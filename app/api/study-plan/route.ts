import { NextRequest, NextResponse } from "next/server";
import { autoRescheduleMissedTasks, computeStudyPlanStats, createDefaultDayPlan } from "@/lib/study/study-plan-engine";
import { ApiResponse, DayPlan } from "@/lib/core/types";
import { getDateKey } from "@/lib/core/utils";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ plan: DayPlan; stats: ReturnType<typeof computeStudyPlanStats> }>>> {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date") || getDateKey();

    const plan = createDefaultDayPlan(dateParam);
    const stats = computeStudyPlanStats({ [dateParam]: plan });

    return NextResponse.json({
      success: true,
      data: {
        plan,
        stats,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load study plan";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "STUDY_PLAN_FETCH_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ rescheduledCount: number; updatedPlans: Record<string, DayPlan> }>>> {
  try {
    const body = await request.json();
    const { plans, todayStr = getDateKey() } = body;

    const result = autoRescheduleMissedTasks(plans || {}, todayStr);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Auto-reschedule failed";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RESCHEDULE_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
