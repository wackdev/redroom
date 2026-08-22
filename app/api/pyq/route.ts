import { NextRequest, NextResponse } from "next/server";
import { getAllPYQs, recordPYQAttempt, getUserPYQAttempts } from "@/lib/pyq/database";
import { analyzeUserMistakes } from "@/lib/pyq/mistake-engine";
import { ApiResponse, PYQQuestion } from "@/lib/core/types";

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<{
  questions: PYQQuestion[];
  analytics?: ReturnType<typeof analyzeUserMistakes>;
}>>> {
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

    return NextResponse.json({
      success: true,
      data: {
        questions,
        analytics,
      },
      meta: {
        total: questions.length,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to retrieve PYQs";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "PYQ_FETCH_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ recorded: boolean }>>> {
  try {
    const body = await request.json();
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
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_PARAMS",
            message: "Missing pyqId or selectedOption",
          },
        },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      data: { recorded: true },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to record PYQ attempt";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "PYQ_RECORD_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
