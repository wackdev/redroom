import { NextRequest } from "next/server";
import { getDailyCurrentAffairs } from "@/lib/current-affairs/cache";
import { getDateKey } from "@/lib/core/utils";
import { apiSuccess, apiError } from "@/lib/core/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date") || getDateKey();
    const forceRefresh =
      searchParams.get("refresh") === "true" ||
      searchParams.get("forceRefresh") === "true" ||
      searchParams.has("refresh");

    const articles = await getDailyCurrentAffairs(dateParam, forceRefresh);

    return apiSuccess(articles, {
      count: articles.length,
      date: dateParam,
      refreshedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to retrieve current affairs";
    return apiError("CURRENT_AFFAIRS_FETCH_FAILED", message, error, 500);
  }
}
