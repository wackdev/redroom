import { NextRequest } from "next/server";
import { getAllPYQs, recordPYQAttempt, getUserPYQAttempts } from "@/lib/pyq/database";
import { analyzeUserMistakes } from "@/lib/pyq/mistake-engine";
import { apiSuccess, apiError } from "@/lib/core/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const subject = searchParams.get("subject") || undefined;
    const year = searchParams.get("year") || undefined;

    let questions = await getAllPYQs();

    if (subject && subject !== "All Subjects") {
      questions = questions.filter((q) => q.subject.toLowerCase() === subject.toLowerCase());
    }

    if (year && year !== "All Years") {
      questions = questions.filter((q) => String(q.year) === year);
    }

    let analytics: ReturnType<typeof analyzeUserMistakes> | undefined = undefined;
    if (userId) {
      const attempts = await getUserPYQAttempts(userId);
      analytics = analyzeUserMistakes(attempts, questions);
    }

    return apiSuccess(
      {
        questions,
        analytics,
      },
      {
        total: questions.length,
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to retrieve PYQs";
    return apiError("PYQ_FETCH_ERROR", message, error, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      userId = "local-user",
      pyqId,
      selectedOption,
      isCorrect,
      mistakeType,
      timeSpentSeconds,
      notes,
    } = body;

    if (!pyqId || !selectedOption) {
      return apiError("INVALID_PARAMS", "Missing pyqId or selectedOption", null, 400);
    }

    await recordPYQAttempt(
      userId,
      pyqId,
      selectedOption,
      Boolean(isCorrect),
      mistakeType,
      timeSpentSeconds || 0,
      notes
    );

    return apiSuccess({ recorded: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to record PYQ attempt";
    return apiError("PYQ_RECORD_ERROR", message, error, 500);
  }
}
