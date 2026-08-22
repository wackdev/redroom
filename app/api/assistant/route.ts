import { NextRequest, NextResponse } from "next/server";
import { queryAI } from "@/lib/ai/client";
import { UPSC_MENTOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { ApiResponse } from "@/lib/core/types";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ message: string; modelUsed: string }>>> {
  try {
    const body = await request.json();
    const { message, contextInfo } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_PROMPT",
            message: "Missing message text",
          },
        },
        { status: 400 }
      );
    }

    let finalPrompt = message;
    if (contextInfo) {
      finalPrompt = `[Student Preparation Context: ${contextInfo}]\n\nUser Question: ${message}`;
    }

    const aiRes = await queryAI({
      systemPrompt: UPSC_MENTOR_SYSTEM_PROMPT,
      prompt: finalPrompt,
      temperature: 0.3,
    });

    if (!aiRes.success) {
      return NextResponse.json(aiRes, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        message: aiRes.data.text,
        modelUsed: aiRes.data.modelUsed,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Assistant query failed";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ASSISTANT_ERROR",
          message: msg,
        },
      },
      { status: 500 }
    );
  }
}
