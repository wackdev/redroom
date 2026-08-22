import { AdminRole, AdminUserSession } from "./types";
import { createAdminClient, isSupabaseConfigured } from "@/lib/db/supabase";
import { SINGLE_ADMIN_CREDENTIALS } from "@/lib/core/user-context";

export const ROLE_PERMISSIONS: Record<AdminRole, {
  canManageUsers: boolean;
  canManageContent: boolean;
  canManageGames: boolean;
  canManageSystem: boolean;
  canViewAnalytics: boolean;
}> = {
  SUPER_ADMIN: {
    canManageUsers: true,
    canManageContent: true,
    canManageGames: true,
    canManageSystem: true,
    canViewAnalytics: true,
  },
  ADMIN: {
    canManageUsers: true,
    canManageContent: true,
    canManageGames: true,
    canManageSystem: false,
    canViewAnalytics: true,
  },
  CONTENT_ADMIN: {
    canManageUsers: false,
    canManageContent: true,
    canManageGames: false,
    canManageSystem: false,
    canViewAnalytics: true,
  },
  MODERATOR: {
    canManageUsers: false,
    canManageContent: false,
    canManageGames: true,
    canManageSystem: false,
    canViewAnalytics: true,
  },
  ANALYST: {
    canManageUsers: false,
    canManageContent: false,
    canManageGames: false,
    canManageSystem: false,
    canViewAnalytics: true,
  },
};

/**
 * Server-side helper to verify user admin privileges
 */
export async function verifyAdminSession(userId?: string, userEmail?: string): Promise<AdminUserSession | null> {
  // Check if this matches the single master admin
  if (
    userEmail?.toLowerCase() === SINGLE_ADMIN_CREDENTIALS.email.toLowerCase() ||
    userId === SINGLE_ADMIN_CREDENTIALS.id
  ) {
    return {
      userId: SINGLE_ADMIN_CREDENTIALS.id,
      email: SINGLE_ADMIN_CREDENTIALS.email,
      displayName: SINGLE_ADMIN_CREDENTIALS.fullName,
      role: "SUPER_ADMIN",
      isSuperAdmin: true,
      canManageUsers: true,
      canManageContent: true,
      canManageGames: true,
      canManageSystem: true,
    };
  }

  // If Supabase is configured, check database role
  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createAdminClient();
      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role, email")
        .eq("user_id", userId)
        .single();

      if (error || !roleData) {
        return null;
      }

      const role = (roleData.role as AdminRole) || "ANALYST";
      const perms = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.ANALYST;

      return {
        userId,
        email: roleData.email || SINGLE_ADMIN_CREDENTIALS.email,
        displayName: "Authorized Admin",
        role,
        isSuperAdmin: role === "SUPER_ADMIN",
        canManageUsers: perms.canManageUsers,
        canManageContent: perms.canManageContent,
        canManageGames: perms.canManageGames,
        canManageSystem: perms.canManageSystem,
      };
    } catch {
      return null;
    }
  }

  return null;
}

