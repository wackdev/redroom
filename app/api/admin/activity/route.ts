import { NextResponse } from "next/server";
import { AdminService } from "@/lib/admin/admin-service";
import { ApiResponse } from "@/lib/core/types";
import { ActivityEvent } from "@/lib/admin/types";

export async function GET(): Promise<NextResponse<ApiResponse<ActivityEvent[]>>> {
  try {
    const stream = await AdminService.getActivityStream();
    return NextResponse.json({ success: true, data: stream });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch activity stream";
    return NextResponse.json(
      { success: false, error: { code: "ACTIVITY_STREAM_ERROR", message: msg } },
      { status: 500 }
    );
  }
}
