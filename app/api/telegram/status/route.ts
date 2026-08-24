import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/core/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ botName?: string; username?: string; isOnline: boolean; configured: boolean; webhookInfo?: any }>>> {
  const rawToken = process.env.TELEGRAM_BOT_TOKEN;
  const token = rawToken ? rawToken.replace(/^:+/, "").trim() : "";

  if (!token || token.includes("placeholder")) {
    return NextResponse.json({
      success: true,
      data: {
        isOnline: false,
        configured: false,
      },
    });
  }

  try {
    const [meRes, webhookRes] = await Promise.allSettled([
      fetch(`https://api.telegram.org/bot${token}/getMe`, { cache: "no-store" }),
      fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`, { cache: "no-store" }),
    ]);

    let botName = "";
    let username = "";
    let isOnline = false;
    let webhookInfo = null;

    if (meRes.status === "fulfilled") {
      const data = await meRes.value.json().catch(() => ({}));
      if (data.ok && data.result) {
        botName = data.result.first_name;
        username = data.result.username;
        isOnline = true;
      }
    }

    if (webhookRes.status === "fulfilled") {
      const data = await webhookRes.value.json().catch(() => ({}));
      if (data.ok && data.result) {
        webhookInfo = data.result;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        botName,
        username,
        isOnline,
        configured: true,
        webhookInfo,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({
      success: true,
      data: {
        isOnline: false,
        configured: true,
      },
    });
  }
}

/**
 * POST: Registers or Updates Telegram Webhook URL
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ registered: boolean; webhookUrl: string; telegramResult: any }>>> {
  const rawToken = process.env.TELEGRAM_BOT_TOKEN;
  const token = rawToken ? rawToken.replace(/^:+/, "").trim() : "";
  const publicUrl = process.env.TELEGRAM_PUBLIC_URL || "https://whynotupsc.vercel.app";
  const webhookUrl = `${publicUrl.replace(/\/+$/, "")}/api/telegram/webhook`;

  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: "NO_TOKEN", message: "TELEGRAM_BOT_TOKEN is not configured." } },
      { status: 400 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const targetUrl = body.url || webhookUrl;

    const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(targetUrl)}`, {
      method: "GET",
    });

    const data = await res.json().catch(() => ({}));

    if (data.ok) {
      return NextResponse.json({
        success: true,
        data: {
          registered: true,
          webhookUrl: targetUrl,
          telegramResult: data,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "TELEGRAM_API_ERROR",
            message: data.description || "Failed to register webhook with Telegram API",
          },
        },
        { status: 400 }
      );
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Webhook registration failed";
    return NextResponse.json(
      { success: false, error: { code: "WEBHOOK_REGISTRATION_FAILED", message: msg } },
      { status: 500 }
    );
  }
}
