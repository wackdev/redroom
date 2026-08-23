import { NextRequest, NextResponse } from "next/server";
import { getDailyCurrentAffairs } from "@/lib/current-affairs/cache";
import { getDateKey } from "@/lib/core/utils";
import { ApiResponse, CurrentAffairsArticle } from "@/lib/core/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<CurrentAffairsArticle[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date") || getDateKey();
    const forceRefresh =
      searchParams.get("refresh") === "true" ||
      searchParams.get("forceRefresh") === "true" ||
      searchParams.has("refresh");

    const articles = await getDailyCurrentAffairs(dateParam, forceRefresh);

    return NextResponse.json({
      success: true,
      data: articles,
      meta: {
        count: articles.length,
        date: dateParam,
        refreshedAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to retrieve current affairs";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CURRENT_AFFAIRS_FETCH_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}
