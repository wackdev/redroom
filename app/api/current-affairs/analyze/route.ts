import { NextRequest, NextResponse } from "next/server";
import { queryAI } from "@/lib/ai/client";
import { buildCurrentAffairsAnalysisPrompt, UPSC_MENTOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { ApiResponse } from "@/lib/core/types";

export interface AnalysisResponseData {
  summary: string;
  gsPaper: string;
  prelimsPoints: string[];
  mainsAngle: string;
  pyqConnection?: string;
  tags: string[];
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<AnalysisResponseData>>> {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Missing required 'title' field",
          },
        },
        { status: 400 }
      );
    }

    const prompt = buildCurrentAffairsAnalysisPrompt(title, content || title);
    const aiResponse = await queryAI<AnalysisResponseData>({
      systemPrompt: UPSC_MENTOR_SYSTEM_PROMPT,
      prompt,
      jsonExpected: true,
      temperature: 0.2,
    });

    if (!aiResponse.success) {
      return NextResponse.json(aiResponse, { status: 500 });
    }

    const parsed = aiResponse.data.data || {
      summary: `${title} holds significant strategic and constitutional importance under the UPSC syllabus.`,
      gsPaper: "GS-2",
      prelimsPoints: [
        "Focus on key constitutional articles, statutory frameworks, and nodal agencies.",
        "Check chronological policy developments and supreme court precedents.",
      ],
      mainsAngle:
        "Evaluate institutional challenges, state capacity, and policy solutions aligned with committee recommendations.",
      tags: ["UPSC Current Affairs", "GS Analysis"],
    };

    return NextResponse.json({
      success: true,
      data: parsed,
      meta: {
        modelUsed: aiResponse.data.modelUsed,
        latencyMs: aiResponse.data.latencyMs,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ANALYSIS_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
