import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/core/api-response";
import { getBrainDashboardData } from "@/lib/brain/intelligence-engine";

export const dynamic = "force-dynamic";

/**
 * GET /api/brain/dashboard
 * Central intelligence engine endpoint for WHYNOTUPSC OS.
 * Returns Readiness, Today's Mission, Next Best Action, Weaknesses, Strengths, Revision Priority, and Recommendations.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;

    const data = await getBrainDashboardData(userId);
    return apiSuccess(data, {
      engine: "WhyNotUPSC Brain v1.0",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("GET /api/brain/dashboard error:", error);
    return apiError(
      "BRAIN_DASHBOARD_ERROR",
      "Failed to compute WhyNotUPSC Brain dashboard intelligence.",
      error?.message,
      500
    );
  }
}
