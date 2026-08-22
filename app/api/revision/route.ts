import { NextRequest, NextResponse } from "next/server";
import { getUserRevisionQueue, logRevisionReview } from "@/lib/revision/revision-engine";
import { ApiResponse, RevisionItem } from "@/lib/core/types";
import { getDateKey } from "@/lib/core/utils";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ items: RevisionItem[]; dueTodayCount: number }>>> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;

    const items = await getUserRevisionQueue(userId);
    const todayStr = getDateKey();
    const dueTodayCount = items.filter((item) => item.nextReviewDate <= todayStr).length;

    return NextResponse.json({
      success: true,
      data: {
        items,
        dueTodayCount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load revision queue";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "REVISION_FETCH_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<RevisionItem>>> {
  try {
    const body = await request.json();
    const { userId = "local-user", topicId, topicName, subject, confidence, upscImportance } = body;

    if (!topicId || !confidence) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_PARAMS",
            message: "Missing topicId or confidence rating",
          },
        },
        { status: 400 }
      );
    }

    const updated = await logRevisionReview(
      userId,
      topicId,
      topicName || topicId,
      subject || "General",
      Number(confidence) as any,
      upscImportance || "High"
    );

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to record revision review";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "REVISION_SAVE_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
