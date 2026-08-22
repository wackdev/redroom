import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/admin/admin-service";
import { ApiResponse } from "@/lib/core/types";
import { SINGLE_ADMIN_CREDENTIALS } from "@/lib/core/user-context";

export async function GET(): Promise<NextResponse<ApiResponse<{
  flags: any[];
  maintenance: any;
  auditLogs: any[];
}>>> {
  try {
    const [flags, maintenance, auditLogs] = await Promise.all([
      AdminService.getFeatureFlags(),
      AdminService.getMaintenanceConfig(),
      AdminService.getAuditLogs(),
    ]);

    return NextResponse.json({
      success: true,
      data: { flags, maintenance, auditLogs },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load system config";
    return NextResponse.json(
      { success: false, error: { code: "SYSTEM_CONFIG_ERROR", message: msg } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ updated: boolean }>>> {
  try {
    const body = await request.json();
    const { action, flagId, isEnabled, maintenanceConfig, adminEmail = SINGLE_ADMIN_CREDENTIALS.email } = body;

    if (action === "TOGGLE_FLAG" && flagId !== undefined) {
      const ok = await AdminService.toggleFeatureFlag(flagId, Boolean(isEnabled), adminEmail);
      return NextResponse.json({ success: true, data: { updated: ok } });
    }

    if (action === "UPDATE_MAINTENANCE" && maintenanceConfig) {
      await AdminService.updateMaintenanceConfig(maintenanceConfig, adminEmail);
      return NextResponse.json({ success: true, data: { updated: true } });
    }

    return NextResponse.json(
      { success: false, error: { code: "INVALID_PARAMS", message: "Unsupported action" } },
      { status: 400 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update system config";
    return NextResponse.json(
      { success: false, error: { code: "SYSTEM_UPDATE_ERROR", message: msg } },
      { status: 500 }
    );
  }
}

