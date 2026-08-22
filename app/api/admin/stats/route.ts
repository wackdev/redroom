import { NextResponse } from "next/server";
import { AdminService } from "@/lib/admin/admin-service";
import { ApiResponse } from "@/lib/core/types";
import { PlatformLiveStats } from "@/lib/admin/types";

export async function GET(): Promise<NextResponse<ApiResponse<PlatformLiveStats>>> {
  try {
    const stats = await AdminService.getLiveStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load admin stats";
    return NextResponse.json(
      { success: false, error: { code: "ADMIN_STATS_ERROR", message: msg } },
      { status: 500 }
    );
  }
}
