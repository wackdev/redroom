import { NextRequest } from "next/server";
import {
  getAllPYQs,
  recordPYQAttempt,
  getUserPYQAttempts,
  analyzeUserMistakes,
  ALL_TAXONOMY_SUBJECTS,
  getTaxonomyProgressSummary,
} from "@/lib/study/pyq-engine";
import { mergeIngestedQuestions } from "@/lib/study/pyq-importer";
import { apiSuccess, apiError } from "@/lib/core/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const subject = searchParams.get("subject") || undefined;
    const chapter = searchParams.get("chapter") || undefined;
    const year = searchParams.get("year") || undefined;
    const includeTaxonomy = searchParams.get("taxonomy") === "true";

    let questions = await getAllPYQs();

    if (subject && subject !== "All Subjects") {
      questions = questions.filter((q) => q.subject.toLowerCase() === subject.toLowerCase());
    }

    if (chapter && chapter !== "All Topics" && chapter !== "All Chapters") {
      questions = questions.filter(
        (q) =>
          q.topic.toLowerCase() === chapter.toLowerCase() ||
          (q.subtopic && q.subtopic.toLowerCase() === chapter.toLowerCase())
      );
    }

    if (year && year !== "All Years") {
      questions = questions.filter((q) => String(q.year) === year);
    }

    let analytics: ReturnType<typeof analyzeUserMistakes> | undefined = undefined;
    let taxonomySummary: ReturnType<typeof getTaxonomyProgressSummary> | undefined = undefined;

    if (userId) {
      const attempts = await getUserPYQAttempts(userId);
      analytics = analyzeUserMistakes(attempts, questions);
      if (includeTaxonomy) {
        taxonomySummary = getTaxonomyProgressSummary(questions, attempts);
      }
    }

    return apiSuccess(
      {
        questions,
        analytics,
        taxonomy: includeTaxonomy ? ALL_TAXONOMY_SUBJECTS : undefined,
        taxonomySummary,
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
      action,
      questions,
      userId = "local-user",
      pyqId,
      selectedOption,
      isCorrect,
      mistakeType,
      timeSpentSeconds,
      notes,
    } = body;

    // Handle bulk import from PDF parser or JSON upload
    if (action === "batch_import" && Array.isArray(questions)) {
      const mergeResult = await mergeIngestedQuestions(questions);
      return apiSuccess({
        message: `Successfully ingested ${mergeResult.added} questions into question bank.`,
        ...mergeResult,
      });
    }

    if (!pyqId || !selectedOption) {
      return apiError("INVALID_PARAMS", "Missing pyqId or selectedOption", null, 400);
    }

    await recordPYQAttempt({
      userId: userId || "anonymous",
      pyqId,
      selectedOption,
      isCorrect: Boolean(isCorrect),
      mistakeType,
      timeSpentSeconds: timeSpentSeconds || 0,
      notes,
      attemptedAt: new Date().toISOString(),
    });

    return apiSuccess({ recorded: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to record PYQ attempt";
    return apiError("PYQ_RECORD_ERROR", message, error, 500);
  }
}
