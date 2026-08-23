import { NextRequest, NextResponse } from "next/server";
import { queryAI } from "@/lib/ai/client";
import { UPSC_MENTOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { getDailyCurrentAffairs } from "@/lib/current-affairs/cache";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({ ok: false, error: "Bot token not configured" }, { status: 400 });
  }

  try {
    const update = await request.json();
    const message = update?.message;

    if (!message || !message.chat || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const firstName = message.from?.first_name || "Aspirant";

    let reply = "";

    if (text.startsWith("/start")) {
      reply = `🏛️ *Welcome to WHYNOTUPSC Telegram Intelligence Node, ${firstName}!*\n\nEvery aspirant can dream of UPSC. The real question is — *WHY NOT YOU?*\n\nCommands:\n⚡ /brief - Get today's top UPSC current affairs\n🎯 /quiz - Get a daily Prelims eliminator question\n💡 Or simply type any question to ask WHY (AI Mentor)!`;
    } else if (text.startsWith("/brief")) {
      const articles = await getDailyCurrentAffairs();
      const top3 = articles.slice(0, 3);
      reply = `📰 *TODAY'S UPSC GS EDITORIAL DIGEST*\n\n`;
      top3.forEach((a, i) => {
        reply += `*${i + 1}. [${a.gsPaper}] ${a.title}*\n${a.summary.slice(0, 150)}...\n\n`;
      });
    } else {
      // General question -> query AI Mentor
      const aiRes = await queryAI({
        systemPrompt: UPSC_MENTOR_SYSTEM_PROMPT,
        prompt: `Telegram User (${firstName}) asks:\n"${text}"\n\nProvide a crisp, encouraging, highly analytical response for UPSC Civil Services. Keep within 4-5 bullet points.`,
        temperature: 0.3,
      });

      reply =
        aiRes.success && aiRes.data?.text
          ? aiRes.data.text
          : "Neural connection momentarily saturated. Please retry with a specific UPSC syllabus topic.";
    }

    // Send response back to Telegram
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply,
        parse_mode: "Markdown",
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: "Telegram Webhook Active", platform: "WHYNOTUPSC" });
}
