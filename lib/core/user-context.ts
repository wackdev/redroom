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

const ACTIVE_USER_STORAGE_KEY = "whynotupsc_active_user";
const CADET_PROFILES_REGISTRY_KEY = "whynotupsc_cadet_profiles";

export class UserSessionManager {
  /**
   * Retrieves the currently active logged-in cadet profile
   */
  public static getActiveUser(): CadetProfile {
    if (typeof window === "undefined") {
      return this.getDefaultCadet();
    }

    try {
      const stored = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}

    const defaultCadet = this.getDefaultCadet();
    this.setActiveUser(defaultCadet);
    return defaultCadet;
  }

  /**
   * Sets the active cadet profile in local session
   */
  public static setActiveUser(cadet: CadetProfile) {
    if (typeof window === "undefined") return;
    try {
      const updated = {
        ...cadet,
        lastActiveAt: new Date().toISOString(),
      };
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(updated));
      this.registerCadetProfile(updated);
      window.dispatchEvent(new CustomEvent("whynotupsc_user_changed", { detail: updated }));
    } catch {}
  }

  /**
   * Get all registered cadet profiles on this installation
   */
  public static getAllRegisteredCadets(): CadetProfile[] {
    if (typeof window === "undefined") return [this.getDefaultCadet()];
    try {
      const stored = localStorage.getItem(CADET_PROFILES_REGISTRY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return [this.getDefaultCadet()];
  }

  /**
   * Register a new cadet account
   */
  public static registerCadetProfile(cadet: CadetProfile) {
    if (typeof window === "undefined") return;
    try {
      const currentList = this.getAllRegisteredCadets();
      const existingIdx = currentList.findIndex((c) => c.id === cadet.id || c.email === cadet.email);
      if (existingIdx >= 0) {
        currentList[existingIdx] = { ...currentList[existingIdx], ...cadet };
      } else {
        currentList.push(cadet);
      }
      localStorage.setItem(CADET_PROFILES_REGISTRY_KEY, JSON.stringify(currentList));
    } catch {}
  }

  /**
   * Default fallback cadet account
   */
  public static getDefaultCadet(): CadetProfile {
    return {
      id: "cadet_primary",
      email: "aspirant@whynotupsc.org",
      fullName: "Cadet Aspirant",
      targetYear: 2026,
      optionalSubject: "PSIR / Geography / History",
      role: "SUPER_ADMIN",
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
  }

  /**
   * Get user-scoped storage key to ensure complete data isolation across multiple users
   */
  public static getUserScopedKey(baseKey: string, customUserId?: string): string {
    const userId = customUserId || (typeof window !== "undefined" ? this.getActiveUser().id : "default");
    return `${baseKey}_${userId}`;
  }
}
