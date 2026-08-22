import { AdminRole, AdminUserSession } from "./types";
import { createAdminClient, isSupabaseConfigured } from "@/lib/db/supabase";

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
export async function verifyAdminSession(userId?: string): Promise<AdminUserSession | null> {
  // If no Supabase configured (local mode), allow master local super-admin
  if (!isSupabaseConfigured() || !userId) {
    return {
      userId: "local_super_admin",
      email: "command@whynotupsc.org",
      displayName: "Master Commander",
      role: "SUPER_ADMIN",
      isSuperAdmin: true,
      canManageUsers: true,
      canManageContent: true,
      canManageGames: true,
      canManageSystem: true,
    };
  }

  try {
    const supabase = createAdminClient();
    const { data: roleData, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error || !roleData) {
      return null;
    }

    const role = (roleData.role as AdminRole) || "ANALYST";
    const perms = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.ANALYST;

    return {
      userId,
      email: "admin@whynotupsc.org",
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
