import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/core/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ botName?: string; username?: string; isOnline: boolean; configured: boolean }>>> {
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
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
      cache: "no-store",
    });
    const data = await res.json();

    if (data.ok && data.result) {
      return NextResponse.json({
        success: true,
        data: {
          botName: data.result.first_name,
          username: data.result.username,
          isOnline: true,
          configured: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        isOnline: false,
        configured: true,
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
