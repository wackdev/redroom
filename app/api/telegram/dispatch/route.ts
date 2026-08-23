import { NextRequest, NextResponse } from "next/server";
import { getDailyCurrentAffairs } from "@/lib/current-affairs/cache";
import { ApiResponse } from "@/lib/core/types";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ sentCount: number; message: string }>>> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NO_BOT_TOKEN",
          message: "Telegram Bot Token is not configured in environment.",
        },
      },
      { status: 400 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const chatId = body.chatId || process.env.TELEGRAM_CHAT_ID;

    if (!chatId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NO_CHAT_ID",
            message: "Target chatId is required to dispatch Telegram briefing.",
          },
        },
        { status: 400 }
      );
    }

    const articles = await getDailyCurrentAffairs();
    const topArticles = articles.slice(0, 4);

    let dispatchText = `🏛️ *WHYNOTUPSC DAILY INTELLIGENCE BRIEF*\n📅 Date: ${new Date().toLocaleDateString("en-IN")}\n\n`;

    topArticles.forEach((art, i) => {
      dispatchText += `*${i + 1}. [${art.gsPaper}] ${art.title}*\n`;
      dispatchText += `📰 _Source: ${art.source}_\n`;
      dispatchText += `${art.summary.slice(0, 160)}...\n`;
      if (art.prelimsPoints && art.prelimsPoints.length > 0) {
        dispatchText += `🎯 *Prelims Eliminator:* ${art.prelimsPoints[0]}\n`;
      }
      dispatchText += `\n`;
    });

    dispatchText += `🚀 _Prepared by WHYNOTUPSC AI Operating System_`;

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: dispatchText,
        parse_mode: "Markdown",
      }),
    });

    const data = await res.json();

    if (data.ok) {
      return NextResponse.json({
        success: true,
        data: {
          sentCount: topArticles.length,
          message: "Daily intelligence broadcasted to Telegram successfully.",
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TELEGRAM_API_ERROR",
          message: data.description || "Telegram API rejected broadcast.",
        },
      },
      { status: 500 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Telegram broadcast exception";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DISPATCH_FAILED",
          message: msg,
        },
      },
      { status: 500 }
    );
  }
}
