import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/admin/admin-service";
import { ApiResponse } from "@/lib/core/types";
import { UserAdminSummary } from "@/lib/admin/types";
import { SINGLE_ADMIN_CREDENTIALS } from "@/lib/core/user-context";

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<UserAdminSummary[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || undefined;
    const role = searchParams.get("role") || undefined;

    const users = await AdminService.getUsersList(query, role);
    return NextResponse.json({ success: true, data: users });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load users list";
    return NextResponse.json(
      { success: false, error: { code: "USERS_FETCH_ERROR", message: msg } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ updated: boolean }>>> {
  try {
    const body = await request.json();
    const { action, userId, role, adminEmail = SINGLE_ADMIN_CREDENTIALS.email } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_PARAMS", message: "Missing userId or action" } },
        { status: 400 }
      );
    }

    if (action === "UPDATE_ROLE" && role) {
      const ok = await AdminService.updateUserRole(userId, role, adminEmail);
      return NextResponse.json({ success: true, data: { updated: ok } });
    }

    if (action === "TOGGLE_SUSPEND") {
      const ok = await AdminService.toggleUserSuspension(userId, adminEmail);
      return NextResponse.json({ success: true, data: { updated: ok } });
    }

    return NextResponse.json(
      { success: false, error: { code: "UNKNOWN_ACTION", message: "Unsupported action" } },
      { status: 400 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to execute user action";
    return NextResponse.json(
      { success: false, error: { code: "USER_ACTION_ERROR", message: msg } },
      { status: 500 }
    );
  }
}

