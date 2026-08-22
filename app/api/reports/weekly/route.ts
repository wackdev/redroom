import { NextRequest, NextResponse } from "next/server";
import { computeWeeklyReport, generateAIWeeklyMentorReview } from "@/lib/performance/weekly-report-engine";
import { ApiResponse, WeeklyReportSummary } from "@/lib/core/types";
import { getDateKey } from "@/lib/core/utils";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<WeeklyReportSummary>>> {
  try {
    const body = await request.json();
    const { plans = {}, testResults = [], referenceDate = getDateKey(), generateAI = false } = body;

    const summary = computeWeeklyReport(plans, testResults, referenceDate);

    if (generateAI) {
      summary.aiMentorReview = await generateAIWeeklyMentorReview(summary);
    }

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Weekly report generation failed";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "WEEKLY_REPORT_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
