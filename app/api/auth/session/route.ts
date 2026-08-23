import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/db/supabase";
import { SINGLE_ADMIN_CREDENTIALS, CadetProfile } from "@/lib/core/user-context";
import { ApiResponse } from "@/lib/core/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ user: CadetProfile | null }>>> {
  try {
    const cadetIdHeader = request.headers.get("x-cadet-id");
    const cadetEmailHeader = request.headers.get("x-cadet-email");

    // 1. Check Master Super Admin
    if (cadetEmailHeader?.toLowerCase() === SINGLE_ADMIN_CREDENTIALS.email.toLowerCase()) {
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: SINGLE_ADMIN_CREDENTIALS.id,
            email: SINGLE_ADMIN_CREDENTIALS.email,
            fullName: SINGLE_ADMIN_CREDENTIALS.fullName,
            targetYear: 2026,
            optionalSubject: "Administration & Public Policy",
            role: "SUPER_ADMIN",
            createdAt: "2026-01-01T00:00:00.000Z",
            lastActiveAt: new Date().toISOString(),
          },
        },
      });
    }

    // 2. Check Supabase Auth Client Session
    try {
      const supabasePublic = createClient();
      const {
        data: { user: publicUser },
      } = await supabasePublic.auth.getUser();

      if (publicUser) {
        const meta = publicUser.user_metadata || {};
        const cadet: CadetProfile = {
          id: publicUser.id,
          email: publicUser.email || "",
          fullName: meta.full_name || meta.fullName || "Cadet Aspirant",
          targetYear: Number(meta.target_year || meta.targetYear) || 2026,
          optionalSubject: meta.optional_subject || meta.optionalSubject || "General Studies",
          role: (meta.role as any) || "USER",
          createdAt: publicUser.created_at || new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };

        return NextResponse.json({
          success: true,
          data: { user: cadet },
        });
      }
    } catch {}

    // 3. Check by Header / Admin lookup
    if (cadetIdHeader || cadetEmailHeader) {
      try {
        const supabaseAdmin = createAdminClient();
        const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
        const found = userList?.users?.find(
          (u) =>
            (cadetIdHeader && u.id === cadetIdHeader) ||
            (cadetEmailHeader && u.email?.toLowerCase() === cadetEmailHeader.toLowerCase())
        );

        if (found) {
          const meta = found.user_metadata || {};
          const cadet: CadetProfile = {
            id: found.id,
            email: found.email || "",
            fullName: meta.full_name || meta.fullName || "Cadet Aspirant",
            targetYear: Number(meta.target_year || meta.targetYear) || 2026,
            optionalSubject: meta.optional_subject || meta.optionalSubject || "General Studies",
            role: (meta.role as any) || "USER",
            createdAt: found.created_at || new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
          };

          return NextResponse.json({
            success: true,
            data: { user: cadet },
          });
        }
      } catch {}
    }

    return NextResponse.json({
      success: true,
      data: { user: null },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Session retrieval error";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SESSION_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
