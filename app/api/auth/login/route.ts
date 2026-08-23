import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/db/supabase";
import { SINGLE_ADMIN_CREDENTIALS, CadetProfile } from "@/lib/core/user-context";
import { ApiResponse } from "@/lib/core/types";

interface LoginRequestBody {
  email?: string;
  password?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ user: CadetProfile; token?: string }>>> {
  try {
    const body: LoginRequestBody = await request.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Please provide both email and password.",
          },
        },
        { status: 400 }
      );
    }

    // 1. Single Master Super Admin Check
    if (
      email === SINGLE_ADMIN_CREDENTIALS.email.toLowerCase() &&
      password === SINGLE_ADMIN_CREDENTIALS.password
    ) {
      const adminProfile: CadetProfile = {
        id: SINGLE_ADMIN_CREDENTIALS.id,
        email: SINGLE_ADMIN_CREDENTIALS.email,
        fullName: SINGLE_ADMIN_CREDENTIALS.fullName,
        targetYear: 2026,
        optionalSubject: "Administration & Public Policy",
        role: "SUPER_ADMIN",
        createdAt: "2026-01-01T00:00:00.000Z",
        lastActiveAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: {
          user: adminProfile,
          token: "master-admin-token",
        },
      });
    }

    // 2. Authenticate against Supabase Auth
    try {
      const supabaseAdmin = createAdminClient();
      const supabasePublic = createClient();

      // Check if user exists in Supabase
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = userList?.users?.find((u) => u.email?.toLowerCase() === email);

      if (existingUser) {
        // Attempt sign in with password
        const { data: signInData, error: signInError } =
          await supabasePublic.auth.signInWithPassword({
            email,
            password,
          });

        if (!signInError && signInData.user) {
          const userMeta = signInData.user.user_metadata || {};
          const cadet: CadetProfile = {
            id: signInData.user.id,
            email: signInData.user.email || email,
            fullName: userMeta.full_name || userMeta.fullName || "Cadet Aspirant",
            targetYear: Number(userMeta.target_year || userMeta.targetYear) || 2026,
            optionalSubject: userMeta.optional_subject || userMeta.optionalSubject || "General Studies",
            role: (userMeta.role as any) || "USER",
            createdAt: signInData.user.created_at || new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
          };

          return NextResponse.json({
            success: true,
            data: {
              user: cadet,
              token: signInData.session?.access_token,
            },
          });
        }

        // If password failed on existing user, update user password if needed or return auth error
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "AUTH_FAILED",
              message: signInError?.message || "Invalid password. Please check your credentials.",
            },
          },
          { status: 401 }
        );
      }
    } catch (dbErr) {
      console.warn("[AuthLogin] Supabase sign in exception:", dbErr);
    }

    // 3. Fallback: User not found in cloud Supabase
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "No registered account found with this email. Please click CREATE ACCOUNT to register.",
        },
      },
      { status: 404 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication exception";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_AUTH_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
