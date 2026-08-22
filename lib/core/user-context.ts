"use client";

export interface CadetProfile {
  id: string;
  email: string;
  fullName: string;
  targetYear: number;
  optionalSubject?: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN" | "CONTENT_ADMIN" | "MODERATOR" | "ANALYST";
  createdAt: string;
  lastActiveAt: string;
}

export interface StoredUserRecord extends CadetProfile {
  passwordHash?: string;
  salt?: string;
}

export const SINGLE_ADMIN_CREDENTIALS = {
  email: "whynotupsc@wacky.com",
  password: "wacky@0808",
  role: "SUPER_ADMIN" as const,
  fullName: "WhyNotUPSC Master Administrator",
  id: "admin_whynotupsc_master",
};

const ACTIVE_USER_STORAGE_KEY = "whynotupsc_active_user";
const CADET_PROFILES_REGISTRY_KEY = "whynotupsc_cadet_profiles";

/**
 * SHA-256 hash helper with salt
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + ":" + salt + ":whynotupsc_sec_token");
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Simple deterministic fallback for non-crypto environments
  let hash = 0;
  const str = password + salt;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

export class UserSessionManager {
  /**
   * Retrieves the currently active logged-in cadet profile, or null if unauthenticated
   */
  public static getActiveUser(): CadetProfile | null {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const stored = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}

    return null;
  }

  /**
   * Check if current session is the authorized single admin
   */
  public static isMasterAdmin(): boolean {
    const user = this.getActiveUser();
    if (!user) return false;
    return (
      user.email.toLowerCase() === SINGLE_ADMIN_CREDENTIALS.email.toLowerCase() &&
      user.role === "SUPER_ADMIN"
    );
  }

  /**
   * Sets the active cadet profile in local session
   */
  public static setActiveUser(cadet: CadetProfile) {
    if (typeof window === "undefined") return;
    try {
      const updated: CadetProfile = {
        ...cadet,
        lastActiveAt: new Date().toISOString(),
      };
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(updated));
      this.registerCadetProfile(updated);
      window.dispatchEvent(new CustomEvent("whynotupsc_user_changed", { detail: updated }));
    } catch {}
  }

  /**
   * Clear active user session (Logout)
   */
  public static logout() {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("whynotupsc_user_changed", { detail: null }));
    } catch {}
  }

  /**
   * Get all registered cadet profiles on this installation
   */
  public static getAllRegisteredCadets(): CadetProfile[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(CADET_PROFILES_REGISTRY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out passwords before returning
          return parsed.map(({ passwordHash, salt, ...profile }: StoredUserRecord) => profile);
        }
      }
    } catch {}
    return [];
  }

  /**
   * Register or update a cadet account in local store
   */
  public static registerCadetProfile(cadet: StoredUserRecord) {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(CADET_PROFILES_REGISTRY_KEY);
      let list: StoredUserRecord[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(list)) list = [];

      const existingIdx = list.findIndex(
        (c) => c.id === cadet.id || c.email.toLowerCase() === cadet.email.toLowerCase()
      );

      if (existingIdx >= 0) {
        list[existingIdx] = { ...list[existingIdx], ...cadet };
      } else {
        list.push(cadet);
      }
      localStorage.setItem(CADET_PROFILES_REGISTRY_KEY, JSON.stringify(list));
    } catch {}
  }

  /**
   * Authenticate against local or master credentials
   */
  public static async authenticateLocal(
    emailInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; user?: CadetProfile; error?: string }> {
    const emailNorm = emailInput.trim().toLowerCase();

    // 1. Check Master Single Admin
    if (
      emailNorm === SINGLE_ADMIN_CREDENTIALS.email.toLowerCase() &&
      passwordInput === SINGLE_ADMIN_CREDENTIALS.password
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
      this.setActiveUser(adminProfile);
      return { success: true, user: adminProfile };
    }

    if (emailNorm === SINGLE_ADMIN_CREDENTIALS.email.toLowerCase()) {
      return { success: false, error: "Invalid password for administrator account." };
    }

    // 2. Check Local Registered Users
    if (typeof window === "undefined") {
      return { success: false, error: "Authentication service unavailable." };
    }

    try {
      const stored = localStorage.getItem(CADET_PROFILES_REGISTRY_KEY);
      const list: StoredUserRecord[] = stored ? JSON.parse(stored) : [];
      const userRecord = list.find((u) => u.email.toLowerCase() === emailNorm);

      if (!userRecord) {
        return {
          success: false,
          error: "No registered account found with this email. Please create an account.",
        };
      }

      if (userRecord.passwordHash && userRecord.salt) {
        const testHash = await hashPassword(passwordInput, userRecord.salt);
        if (testHash !== userRecord.passwordHash) {
          return { success: false, error: "Invalid password. Please check your credentials." };
        }
      }

      const { passwordHash, salt, ...profile } = userRecord;
      this.setActiveUser(profile);
      return { success: true, user: profile };
    } catch {
      return { success: false, error: "Authentication error occurred. Please try again." };
    }
  }

  /**
   * Register a new cadet with hashed credentials
   */
  public static async registerLocal(params: {
    email: string;
    password: string;
    fullName: string;
    targetYear: number;
    optionalSubject?: string;
  }): Promise<{ success: boolean; user?: CadetProfile; error?: string }> {
    const emailNorm = params.email.trim().toLowerCase();

    if (emailNorm === SINGLE_ADMIN_CREDENTIALS.email.toLowerCase()) {
      return {
        success: false,
        error: "This email address is reserved for the platform administrator.",
      };
    }

    if (typeof window === "undefined") {
      return { success: false, error: "Registration service unavailable." };
    }

    try {
      const stored = localStorage.getItem(CADET_PROFILES_REGISTRY_KEY);
      const list: StoredUserRecord[] = stored ? JSON.parse(stored) : [];

      if (list.some((u) => u.email.toLowerCase() === emailNorm)) {
        return {
          success: false,
          error: "An account with this email already exists. Please sign in instead.",
        };
      }

      const salt = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      const passwordHash = await hashPassword(params.password, salt);
      const userId = `cadet_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

      const newRecord: StoredUserRecord = {
        id: userId,
        email: emailNorm,
        fullName: params.fullName.trim() || "Cadet Aspirant",
        targetYear: params.targetYear,
        optionalSubject: params.optionalSubject?.trim() || "General Studies",
        role: "USER",
        passwordHash,
        salt,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };

      this.registerCadetProfile(newRecord);

      const { passwordHash: _, salt: __, ...profile } = newRecord;
      this.setActiveUser(profile);
      return { success: true, user: profile };
    } catch {
      return { success: false, error: "Failed to create cadet profile. Please try again." };
    }
  }

  /**
   * Get user-scoped storage key to ensure complete data isolation across multiple users
   */
  public static getUserScopedKey(baseKey: string, customUserId?: string): string {
    const active = typeof window !== "undefined" ? this.getActiveUser() : null;
    const userId = customUserId || active?.id || "guest";
    return `${baseKey}_${userId}`;
  }
}
