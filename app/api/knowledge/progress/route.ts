import { NextRequest, NextResponse } from "next/server";
import { updateStudentTopicProgress } from "@/lib/knowledge/knowledge-engine";
import { ApiResponse } from "@/lib/core/types";
import { StudentTopicProgress } from "@/lib/knowledge/types";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<StudentTopicProgress>>> {
  try {
    const body = await request.json();
    const { userId = "guest-cadet", topicId, status, timeSpentSeconds = 0, pyqsAttempted = 0, pyqsCorrect = 0 } = body;

    if (!topicId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing topicId",
          },
        },
        { status: 400 }
      );
    }

    const updated = updateStudentTopicProgress(userId, topicId, {
      status,
      timeSpentSeconds,
      pyqsAttempted,
      pyqsCorrect,
      masteryPercentage: status === "Mastered" ? 100 : status === "Revising" ? 75 : status === "Practicing" ? 50 : 25,
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update topic progress";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "PROGRESS_UPDATE_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
