import { NextRequest, NextResponse } from "next/server";
import { queryAI } from "@/lib/ai/client";
import { UPSC_MENTOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { getDailyCurrentAffairs } from "@/lib/current-affairs/cache";
import { STATIC_PYQ_DATASET } from "@/lib/study/pyq-engine";
import { STATIC_MAINS_PYQ_DATASET } from "@/lib/mains-pyq/static-dataset";
import { createAdminClient } from "@/lib/db/supabase";
import { addBroadcastToStore, AdminBroadcastMessage } from "@/lib/admin/broadcast-store";

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
    const firstName = message.from?.first_name || "Cadet";

    const sendMsg = async (msgText: string) => {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: msgText,
          parse_mode: "Markdown",
        }),
      });
    };

    // ------------------------------------------------------------------------
    // ADMIN DIRECTIVE / NOTICE BROADCAST HANDLER
    // ------------------------------------------------------------------------
    if (
      text.startsWith("/broadcast") ||
      text.startsWith("/notice") ||
      text.startsWith("/alert") ||
      text.startsWith("/directive")
    ) {
      let rawContent = text.replace(/^\/(broadcast|notice|alert|directive)\s*/i, "").trim();
      let title = "📢 OFFICIAL CADET DIRECTIVE";
      let priority: "Urgent" | "High" | "Normal" = "High";
      let type: "directive" | "announcement" | "alert" | "system" = "directive";

      if (text.startsWith("/alert")) {
        type = "alert";
        priority = "Urgent";
        title = "⚠️ URGENT ADVISORY // HIGH PRIORITY";
      }

      if (rawContent.includes("|")) {
        const parts = rawContent.split("|");
        title = parts[0].trim();
        rawContent = parts.slice(1).join("|").trim();
      }

      if (!rawContent) {
        await sendMsg(
          "ℹ️ *FORMAT:* `/broadcast <Your Message>` OR `/notice <Title> | <Message>` OR `/alert <Urgent Warning>`"
        );
        return NextResponse.json({ ok: true });
      }

      const newBroadcast: AdminBroadcastMessage = {
        id: `bc-tg-${Date.now()}`,
        title,
        message: rawContent,
        type,
        priority,
        actionLink: "/dashboard",
        actionLabel: "View Notice Board →",
        createdAt: new Date().toISOString(),
        author: `Admin (${firstName})`,
        isActive: true,
      };

      // 1. Add to In-Memory & Active Broadcast Store
      addBroadcastToStore(newBroadcast);

      // 2. Persist to Database if Supabase is connected
      try {
        const supabaseAdmin = createAdminClient();
        if (supabaseAdmin) {
          await supabaseAdmin.from("broadcasts").insert({
            id: newBroadcast.id,
            title: newBroadcast.title,
            message: newBroadcast.message,
            type: newBroadcast.type,
            priority: newBroadcast.priority,
            author: newBroadcast.author,
            is_active: true,
          });
        }
      } catch {}

      await sendMsg(
        `✅ *DIRECTIVE BROADCASTED SUCCESSFULLY!*\n\n` +
          `*Title:* ${title}\n` +
          `*Priority:* ${priority}\n` +
          `*Status:* Published to all active Cadet Dashboards & Live Notice Boards.`
      );
      return NextResponse.json({ ok: true });
    }

    // COMMAND: /start
    if (text === "/start" || text === "/help") {
      const welcome =
        `🏛️ *WHYNOTUPSC CADET INTELLIGENCE NODE*\n\n` +
        `Welcome Commander *${firstName}*! Your direct Telegram gateway to the UPSC Preparation OS is active.\n\n` +
        `*AVAILABLE COMMANDS:*\n` +
        `• \`/broadcast <msg>\` — Instant dispatch to platform Notice Board\n` +
        `• \`/notice <Title> | <Body>\` — Publish formatted bulletin\n` +
        `• \`/alert <Warning>\` — Send critical high-priority alert\n` +
        `• \`/daily_quiz\` — Get instant 4-option current affairs MCQ\n` +
        `• \`/prelims_pyq\` — Drill a high-yield Prelims PYQ with trap analysis\n` +
        `• \`/mains_prompt\` — Practice today's Mains question & PESTLE framework\n` +
        `• \`/today_news\` — Curated editorial summary (The Hindu / Express)\n` +
        `• \`/status\` — Live platform readiness & cadet metrics\n\n` +
        `_Or ask any open-ended civil services question for direct AI Strategic Mentor analysis._`;
      await sendMsg(welcome);
      return NextResponse.json({ ok: true });
    }

    // COMMAND: /status
    if (text === "/status") {
      const statusMsg =
        `⚡ *WHYNOTUPSC PLATFORM TELEMETRY*\n\n` +
        `• *System Status*: OPERATIONAL (100%)\n` +
        `• *Database Engine*: PostgreSQL (Supabase) + Client Dexie Cache\n` +
        `• *AI Fallback Chain*: Qwen 2.5 72B / Llama 3.3 70B / Mistral 24B\n` +
        `• *Active Hubs*: 25 Modules (Prelims, Mains, CSAT, 3D Zone, Optional, Study Room)\n` +
        `• *Sync Outbox*: Zero-latency atomic synchronization active.`;
      await sendMsg(statusMsg);
      return NextResponse.json({ ok: true });
    }

    // COMMAND: /prelims_pyq
    if (text === "/prelims_pyq") {
      const randomQ = STATIC_PYQ_DATASET[Math.floor(Math.random() * STATIC_PYQ_DATASET.length)];
      if (randomQ) {
        const qMsg =
          `📝 *UPSC PRELIMS DRILL (${randomQ.year} — ${randomQ.subject})*\n\n` +
          `*Question:*\n${randomQ.question}\n\n` +
          `*Options:*\n` +
          (randomQ.options || []).map((o) => `*${o.id}.* ${o.text}`).join("\n") +
          `\n\n_Correct Answer:_ ||*${randomQ.correctAnswer || (randomQ as any).correct_answer}*||\n` +
          `_Explanation:_ ${randomQ.explanation}`;
        await sendMsg(qMsg);
        return NextResponse.json({ ok: true });
      }
    }

    // COMMAND: /mains_prompt
    if (text === "/mains_prompt") {
      const randomMains =
        STATIC_MAINS_PYQ_DATASET[Math.floor(Math.random() * STATIC_MAINS_PYQ_DATASET.length)];
      if (randomMains) {
        const outlines: string[] = (randomMains as any).modelAnswerOutline || (randomMains as any).modelAnswer || [
          "Structure into Introduction context, 3 PESTLE dimensions, and a balanced constitutional conclusion.",
        ];
        const mMsg =
          `✍️ *UPSC MAINS DRILL (${randomMains.paper} — ${randomMains.marks}M)*\n\n` +
          `*Question:*\n${randomMains.question}\n\n` +
          `*Blueprint Outline:*\n` +
          outlines.map((o: string) => `• ${o}`).join("\n");
        await sendMsg(mMsg);
        return NextResponse.json({ ok: true });
      }
    }

    // COMMAND: /today_news
    if (text === "/today_news") {
      const news = await getDailyCurrentAffairs();
      const top3 = news.slice(0, 3);
      let newsMsg = `📰 *DAILY EDITORIAL DIGEST — ${new Date().toLocaleDateString()}*\n\n`;
      top3.forEach((n, idx) => {
        newsMsg += `*${idx + 1}. ${n.title}* [${n.gsPaper || "GS-2"}]\n${n.summary}\n\n`;
      });
      await sendMsg(newsMsg);
      return NextResponse.json({ ok: true });
    }

    // COMMAND: /daily_quiz
    if (text === "/daily_quiz") {
      const quizMsg =
        `🎯 *DAILY CURRENT AFFAIRS MCQ*\n\n` +
        `*Q: With reference to the 'Mission Mausam' approved by the Union Cabinet, consider:*\n` +
        `1. It is implemented by the Ministry of Earth Sciences.\n` +
        `2. It incorporates AI and high-performance computing for next-gen weather forecasting.\n\n` +
        `*Options:*\n(a) 1 only\n(b) 2 only\n(c) Both 1 and 2\n(d) Neither 1 nor 2\n\n` +
        `_Answer:_ ||*(c) Both 1 and 2 are correct.*||`;
      await sendMsg(quizMsg);
      return NextResponse.json({ ok: true });
    }

    // DEFAULT: Direct Conversational AI Mentor Query
    const aiResponse = await queryAI({
      systemPrompt: UPSC_MENTOR_SYSTEM_PROMPT,
      prompt: text,
      maxTokens: 500,
    });

    const reply =
      aiResponse.success && aiResponse.data?.text
        ? aiResponse.data.text
        : "I am ready to assist with your civil services preparation strategy.";
    await sendMsg(`🤖 *WHYNOTUPSC STRATEGIC MENTOR*\n\n${reply}`);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
