import { NextRequest, NextResponse } from "next/server";
import { computeMasterIntelligence } from "@/lib/intelligence/master-priority-engine";
import { ApiResponse, DailyIntelligence } from "@/lib/core/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<DailyIntelligence>>> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;

    const intelligence = await computeMasterIntelligence(userId);

    return NextResponse.json({
      success: true,
      data: intelligence,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to compute master intelligence";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTELLIGENCE_ERROR",
          message: msg,
        },
      },
      { status: 500 }
    );
  }
}
