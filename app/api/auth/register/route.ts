import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/db/supabase";
import { SINGLE_ADMIN_CREDENTIALS, CadetProfile } from "@/lib/core/user-context";
import { AdminService } from "@/lib/admin/admin-service";
import { ApiResponse } from "@/lib/core/types";

interface RegisterRequestBody {
  email?: string;
  password?: string;
  fullName?: string;
  targetYear?: number;
  optionalSubject?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ user: CadetProfile; message: string }>>> {
  try {
    const body: RegisterRequestBody = await request.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();
    const fullName = body.fullName?.trim() || "Cadet Aspirant";
    const targetYear = Number(body.targetYear) || 2026;
    const optionalSubject = body.optionalSubject?.trim() || "General Studies";

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_PARAMS",
            message: "Email and password are required.",
          },
        },
        { status: 400 }
      );
    }

    if (email === SINGLE_ADMIN_CREDENTIALS.email.toLowerCase()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "EMAIL_RESERVED",
            message: "This email address is reserved for the Master Administrator.",
          },
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "PASSWORD_TOO_SHORT",
            message: "Password must be at least 6 characters.",
          },
        },
        { status: 400 }
      );
    }

    let userId = `cadet_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    let userCreatedAt = new Date().toISOString();

    if (isSupabaseConfigured()) {
      try {
        const supabaseAdmin = createAdminClient();

        // Check if user already exists
        const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = userList?.users?.find((u) => u.email?.toLowerCase() === email);

        if (existingUser) {
          userId = existingUser.id;
          userCreatedAt = existingUser.created_at || userCreatedAt;

          await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            password,
            email_confirm: true,
            user_metadata: {
              full_name: fullName,
              target_year: targetYear,
              optional_subject: optionalSubject,
              role: "ASPIRANT",
            },
          });
        } else {
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
              full_name: fullName,
              target_year: targetYear,
              optional_subject: optionalSubject,
              role: "ASPIRANT",
            },
          });

          if (newUser?.user) {
            userId = newUser.user.id;
            userCreatedAt = newUser.user.created_at || userCreatedAt;
          }
        }

        // Upsert into profiles and user_roles tables
        try {
          await supabaseAdmin.from("profiles").upsert({
            id: userId,
            email,
            full_name: fullName,
            target_year: targetYear,
            optional_subject: optionalSubject,
            updated_at: new Date().toISOString(),
          });

          await supabaseAdmin.from("user_roles").upsert({
            user_id: userId,
            role: "ASPIRANT",
            assigned_at: new Date().toISOString(),
          });
        } catch {}
      } catch (supabaseErr) {
        console.warn("[Register API] Supabase error fallback to server store:", supabaseErr);
      }
    }

    const cadet: CadetProfile = {
      id: userId,
      email,
      fullName,
      targetYear,
      optionalSubject,
      role: "USER",
      createdAt: userCreatedAt,
      lastActiveAt: new Date().toISOString(),
    };

    // Register in server in-memory governance store
    AdminService.registerServerCadet({
      id: userId,
      email,
      fullName,
      role: "ASPIRANT",
      accountStatus: "ACTIVE",
      joinedAt: userCreatedAt.split("T")[0],
      lastActiveAt: "Active Now",
      totalStudyHours: 0,
      pyqsSolved: 0,
      pyqAccuracy: 0,
      testsTaken: 0,
      mainsDraftsCount: 0,
      revisionsPending: 0,
      chillGamesCount: 0,
    });

    return NextResponse.json({
      success: true,
      data: {
        user: cadet,
        message: "Cadet profile registered and activated successfully.",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration exception";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_REG_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
