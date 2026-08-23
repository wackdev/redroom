import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/db/supabase";
import { SINGLE_ADMIN_CREDENTIALS, CadetProfile } from "@/lib/core/user-context";
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

    const supabaseAdmin = createAdminClient();

    // Check if user already exists
    const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = userList?.users?.find((u) => u.email?.toLowerCase() === email);

    if (existingUser) {
      // Update the user's password and metadata so they can sign in immediately
      const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        {
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            target_year: targetYear,
            optional_subject: optionalSubject,
            role: "USER",
          },
        }
      );

      if (updateError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "UPDATE_FAILED",
              message: updateError.message,
            },
          },
          { status: 500 }
        );
      }

      const cadet: CadetProfile = {
        id: existingUser.id,
        email: existingUser.email || email,
        fullName,
        targetYear,
        optionalSubject,
        role: "USER",
        createdAt: existingUser.created_at || new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: {
          user: cadet,
          message: "Account credentials updated successfully. You can now sign in.",
        },
      });
    }

    // Create new confirmed user in Supabase Auth
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        target_year: targetYear,
        optional_subject: optionalSubject,
        role: "USER",
      },
    });

    if (createError || !newUser.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "REGISTRATION_FAILED",
            message: createError?.message || "Failed to create cadet profile.",
          },
        },
        { status: 500 }
      );
    }

    const cadet: CadetProfile = {
      id: newUser.user.id,
      email: newUser.user.email || email,
      fullName,
      targetYear,
      optionalSubject,
      role: "USER",
      createdAt: newUser.user.created_at || new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: {
        user: cadet,
        message: "Cadet profile registered and confirmed successfully.",
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
