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

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const body = await request.json();
    const {
      action,
      userId,
      email,
      password,
      fullName,
      role,
      targetYear,
      dailyGoalHours,
      adminEmail = SINGLE_ADMIN_CREDENTIALS.email,
    } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_PARAMS", message: "Missing required 'action' parameter" } },
        { status: 400 }
      );
    }

    // 1. CREATE USER WITH CUSTOM CREDENTIALS
    if (action === "CREATE_USER") {
      if (!email || !fullName) {
        return NextResponse.json(
          { success: false, error: { code: "MISSING_FIELDS", message: "Email and Full Name are required." } },
          { status: 400 }
        );
      }

      const res = await AdminService.createUser({
        email,
        password,
        fullName,
        role,
        targetYear: Number(targetYear) || 2026,
        dailyGoalHours: Number(dailyGoalHours) || 8,
        adminEmail,
      });

      if (res.error) {
        return NextResponse.json(
          { success: false, error: { code: "CREATE_USER_FAILED", message: res.error } },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, data: { user: res.user, created: true } });
    }

    // 2. UPDATE USER DETAILS & PASSWORD
    if (action === "UPDATE_USER") {
      if (!userId) {
        return NextResponse.json(
          { success: false, error: { code: "MISSING_USER_ID", message: "userId is required for updates." } },
          { status: 400 }
        );
      }

      const res = await AdminService.updateUser({
        userId,
        email,
        password,
        fullName,
        role,
        targetYear: targetYear ? Number(targetYear) : undefined,
        dailyGoalHours: dailyGoalHours ? Number(dailyGoalHours) : undefined,
        adminEmail,
      });

      if (!res.success) {
        return NextResponse.json(
          { success: false, error: { code: "UPDATE_USER_FAILED", message: res.error || "Update failed" } },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, data: { updated: true } });
    }

    // 3. DELETE USER
    if (action === "DELETE_USER") {
      if (!userId) {
        return NextResponse.json(
          { success: false, error: { code: "MISSING_USER_ID", message: "userId is required for deletion." } },
          { status: 400 }
        );
      }

      const res = await AdminService.deleteUser(userId, adminEmail);
      if (!res.success) {
        return NextResponse.json(
          { success: false, error: { code: "DELETE_USER_FAILED", message: res.error || "Delete failed" } },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, data: { deleted: true } });
    }

    // 4. UPDATE ROLE
    if (action === "UPDATE_ROLE" && userId && role) {
      const ok = await AdminService.updateUserRole(userId, role, adminEmail);
      return NextResponse.json({ success: true, data: { updated: ok } });
    }

    // 5. TOGGLE SUSPEND
    if (action === "TOGGLE_SUSPEND" && userId) {
      const ok = await AdminService.toggleUserSuspension(userId, adminEmail);
      return NextResponse.json({ success: true, data: { updated: ok } });
    }

    return NextResponse.json(
      { success: false, error: { code: "UNKNOWN_ACTION", message: "Unsupported user action." } },
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
