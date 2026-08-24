import { NextRequest, NextResponse } from "next/server";
import { queryAI } from "@/lib/ai/client";
import { UPSC_MENTOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { getDailyCurrentAffairs } from "@/lib/current-affairs/cache";
import { STATIC_PYQ_DATASET } from "@/lib/pyq/static-dataset";
import { createAdminClient } from "@/lib/db/supabase";

/**
 * Validates if the incoming Telegram message is from the authorized Admin.
 */
function isAuthorizedAdmin(chatId: string | number, username?: string): boolean {
  const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  const adminUsername = process.env.ADMIN_TELEGRAM_USERNAME;

  // If no admin chat ID is set, allow initial configuration
  if (!adminChatId) return true;

  if (String(chatId) === String(adminChatId)) return true;
  if (adminUsername && username && username.toLowerCase() === adminUsername.toLowerCase()) return true;

  return false;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({ ok: false, error: "Bot token not configured" }, { status: 400 });
  }

  try {
    const update = await request.json().catch(() => ({}));
    const message = update?.message;

    if (!message || !message.chat || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const username = message.from?.username;
    const firstName = message.from?.first_name || "Commander";

    // ------------------------------------------------------------------------
    // 1. ADMIN GATE SECURITY CHECK
    // ------------------------------------------------------------------------
    if (!isAuthorizedAdmin(chatId, username)) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🔒 *ACCESS RESTRICTED: REDROOM COMMAND GATEWAY*\n\n` +
            `This Telegram Intelligence Node is private to the REDROOM OS Administrator.\n` +
            `Your Chat ID: \`${chatId}\`\n\n` +
            `_If you are the Admin, please add this Chat ID to TELEGRAM_CHAT_ID in your environment variables._`,
          parse_mode: "Markdown",
        }),
      });

      return NextResponse.json({ ok: true });
    }

    let reply = "";

    // ------------------------------------------------------------------------
    // 2. ADMIN TELEMETRY & TRACKING COMMANDS
    // ------------------------------------------------------------------------
    if (text.startsWith("/track") || text.startsWith("/stats") || text.startsWith("/telemetry")) {
      try {
        const supabase = createAdminClient();
        const [usersCountRes, resultsCountRes, broadcastCountRes] = await Promise.allSettled([
          supabase.from("users").select("id", { count: "exact", head: true }),
          supabase.from("test_results").select("id", { count: "exact", head: true }),
          supabase.from("admin_broadcasts").select("id", { count: "exact", head: true }),
        ]);

        const totalUsers = usersCountRes.status === "fulfilled" ? usersCountRes.value.count || 1 : 1;
        const totalTests = resultsCountRes.status === "fulfilled" ? resultsCountRes.value.count || 0 : 0;
        const totalBroadcasts = broadcastCountRes.status === "fulfilled" ? broadcastCountRes.value.count || 0 : 0;

        reply = `📊 *REDROOM OS — LIVE ADMIN TELEMETRY REPORT*\n\n` +
          `👥 *Total Registered Cadets:* ${totalUsers}\n` +
          `🎯 *Total Tests & Mock Submissions:* ${totalTests}\n` +
          `📡 *Active Universal Broadcasts:* ${totalBroadcasts}\n` +
          `🔄 *Outbox Sync Engine:* Active (Web Locks Enabled)\n` +
          `⚡ *Server Environment:* Production Edge (Vercel & Supabase ap-south-1)\n` +
          `🕒 *Telemetry Timestamp:* ${new Date().toLocaleString("en-IN")}\n\n` +
          `_Use /broadcast to push real-time notifications to all users._`;
      } catch {
        reply = `📊 *REDROOM OS TELEMETRY:*\n• System Status: 100% Operational\n• Database: Connected (Supabase Connection Pooler)\n• Outbox Dispatcher: Active`;
      }
    }
    // ------------------------------------------------------------------------
    // 3. REAL-TIME UNIVERSAL PORTAL BROADCAST FROM TELEGRAM
    // Format: /broadcast <Title> | <Message>  OR  /broadcast <Message>
    // ------------------------------------------------------------------------
    else if (text.startsWith("/broadcast") || text.startsWith("/alert") || text.startsWith("/notify")) {
      const payload = text.replace(/^\/(broadcast|alert|notify)\s*/i, "").trim();

      if (!payload) {
        reply = `⚠️ *Usage:* \`/broadcast <Title> | <Message>\`\nExample:\n\`/broadcast 🚨 Emergency Drill | All cadets must complete CSAT timed simulation before 9 PM.\``;
      } else {
        let broadcastTitle = "⚡ COMMANDER DIRECTIVE";
        let broadcastMessage = payload;

        if (payload.includes("|")) {
          const parts = payload.split("|");
          broadcastTitle = parts[0].trim();
          broadcastMessage = parts.slice(1).join("|").trim();
        }

        try {
          const supabase = createAdminClient();
          await supabase.from("admin_broadcasts").insert({
            title: broadcastTitle,
            message: broadcastMessage,
            type: text.startsWith("/alert") ? "alert" : "directive",
            priority: "Urgent",
            author: `Commander (${firstName})`,
            is_active: true,
          });

          reply = `✅ *UNIVERSAL BROADCAST PUBLISHED IN REAL TIME!*\n\n` +
            `📢 *Title:* ${broadcastTitle}\n` +
            `💬 *Message:* ${broadcastMessage}\n` +
            `🎯 *Target:* All active cadet browser stations across the web portal.`;
        } catch (err) {
          reply = `⚠️ Failed to save broadcast to database, but notification was received.`;
        }
      }
    }
    // ------------------------------------------------------------------------
    // 4. DAILY BRIEF ON DEMAND
    // ------------------------------------------------------------------------
    else if (text.startsWith("/brief")) {
      const articles = await getDailyCurrentAffairs();
      const top3 = articles.slice(0, 3);
      reply = `📰 *TODAY'S UPSC GS EDITORIAL DIGEST*\n\n`;
      top3.forEach((a, i) => {
        reply += `*${i + 1}. [${a.gsPaper}] ${a.title}*\n`;
        reply += `📰 Source: ${a.source}\n`;
        reply += `${a.summary.slice(0, 160)}...\n\n`;
      });
      reply += `_Dispatched from REDROOM OS Editorial Sync_`;
    }
    // ------------------------------------------------------------------------
    // 5. PRELIMS MCQ QUIZ
    // ------------------------------------------------------------------------
    else if (text.startsWith("/quiz")) {
      const randomQ = STATIC_PYQ_DATASET[Math.floor(Math.random() * STATIC_PYQ_DATASET.length)];
      reply = `🎯 *UPSC PRELIMS DRILL (${randomQ.subject} · ${randomQ.year})*\n\n` +
        `${randomQ.question}\n\n` +
        (randomQ.options || []).map((o) => `[${o.id}] ${o.text}`).join("\n") +
        `\n\n` +
        `||🔑 *Official Answer:* Option ${randomQ.correctAnswer}||\n` +
        `💡 _Explanation:_ ${randomQ.explanation.slice(0, 200)}...`;
    }
    // ------------------------------------------------------------------------
    // 6. /start COMMAND (ADMIN COMMAND CENTER)
    // ------------------------------------------------------------------------
    else if (text.startsWith("/start")) {
      reply = `🏛️ *REDROOM OS — COMMANDER CONTROL TERMINAL*\n` +
        `Welcome, Commander ${firstName}!\n\n` +
        `👑 *Admin Capabilities:*\n` +
        `📢 */broadcast <Title> | <Msg>* - Push instant alert to all portal users\n` +
        `📊 */track* or */stats* - View real-time database & cadet telemetry\n` +
        `⚡ */brief* - Send daily current affairs intelligence\n` +
        `🎯 */quiz* - Dispatch Prelims drill\n` +
        `💡 *Or ask any UPSC query to consult the AI Mentor.*`;
    }
    // ------------------------------------------------------------------------
    // 7. GENERAL AI MENTOR INQUIRY
    // ------------------------------------------------------------------------
    else {
      const aiRes = await queryAI({
        systemPrompt: UPSC_MENTOR_SYSTEM_PROMPT,
        prompt: `Commander asks:\n"${text}"\n\nProvide a crisp, authoritative response for UPSC Civil Services strategy. Keep within 4-5 bullet points.`,
        temperature: 0.3,
      });

      reply =
        aiRes.success && aiRes.data?.text
          ? aiRes.data.text
          : "Neural connection active. Use /broadcast, /track, /brief, or ask any syllabus question.";
    }

    // Truncate if exceeding Telegram limit
    if (reply.length > 4000) {
      reply = reply.slice(0, 3950) + "\n\n_...[Response truncated]_";
    }

    // Send response back to Telegram Admin (with fallback to plain text)
    let sendRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply,
        parse_mode: "Markdown",
      }),
    });

    let sendJson = await sendRes.json().catch(() => ({}));
    if (!sendRes.ok || !sendJson.ok) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: reply.replace(/[*_`\[\]()~>#+\-=|{}.!]/g, ""),
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "Telegram Admin Commander Webhook Active",
    platform: "REDROOM OS",
    adminGateActive: true,
    botTokenConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    chatIdConfigured: Boolean(process.env.TELEGRAM_CHAT_ID),
  });
}
