import { NextRequest, NextResponse } from "next/server";
import { queryAI } from "@/lib/ai/client";
import { buildQuizGenerationPrompt, UPSC_MENTOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { ApiResponse, CurrentAffairsQuizQuestion } from "@/lib/core/types";

export interface QuizResponseData {
  questions: CurrentAffairsQuizQuestion[];
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<QuizResponseData>>> {
  try {
    const body = await request.json();
    const { topic, content, count = 3 } = body;

    const topicText = topic || content || "General Current Affairs";
    const prompt = buildQuizGenerationPrompt(topicText, Math.min(5, Math.max(1, count)));

    const aiResponse = await queryAI<QuizResponseData>({
      systemPrompt: UPSC_MENTOR_SYSTEM_PROMPT,
      prompt,
      jsonExpected: true,
      temperature: 0.3,
    });

    if (!aiResponse.success) {
      return NextResponse.json(aiResponse, { status: 500 });
    }

    const questions = aiResponse.data.data?.questions || [
      {
        id: "ca-q1",
        question: `With reference to ${topicText}, consider the following statements: 1. It is directly governed under constitutional or statutory frameworks. 2. The nodal enforcement agency operates under the Union Government. Which of the statements given above is/are correct?`,
        options: [
          { id: "A", text: "1 only" },
          { id: "B", text: "2 only" },
          { id: "C", text: "Both 1 and 2" },
          { id: "D", text: "Neither 1 nor 2" },
        ],
        answer: "C",
        explanation:
          "Both statements reflect the standard legal and executive governance mechanisms in India.",
      },
    ];

    return NextResponse.json({
      success: true,
      data: { questions },
      meta: {
        modelUsed: aiResponse.data.modelUsed,
        latencyMs: aiResponse.data.latencyMs,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Quiz generation failed";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "QUIZ_GENERATION_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
