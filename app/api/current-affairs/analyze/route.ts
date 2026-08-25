import { NextRequest } from "next/server";
import { queryAI } from "@/lib/ai/client";
import { buildCurrentAffairsAnalysisPrompt, UPSC_MENTOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { apiSuccess, apiError } from "@/lib/core/api-response";

export interface AnalysisResponseData {
  summary: string;
  gsPaper: string;
  prelimsPoints: string[];
  mainsAngle: string;
  pyqConnection?: string;
  tags: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { title, content } = body;

    if (!title || typeof title !== "string") {
      return apiError("INVALID_REQUEST", "Missing required 'title' field", null, 400);
    }

    const prompt = buildCurrentAffairsAnalysisPrompt(title, content || title);
    const aiResponse = await queryAI<AnalysisResponseData>({
      systemPrompt: UPSC_MENTOR_SYSTEM_PROMPT,
      prompt,
      jsonExpected: true,
      temperature: 0.2,
    });

    if (!aiResponse.success) {
      return apiError(
        aiResponse.error.code,
        aiResponse.error.message,
        aiResponse.error.details,
        500
      );
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

    return apiSuccess(parsed, {
      modelUsed: aiResponse.data.modelUsed,
      latencyMs: aiResponse.data.latencyMs,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Current affairs analysis failed";
    return apiError("ANALYSIS_ERROR", message, error, 500);
  }
}
