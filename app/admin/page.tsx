"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AdminRole, PlatformLiveStats, ActivityEvent } from "@/lib/admin/types";
import { UserSessionManager, SINGLE_ADMIN_CREDENTIALS } from "@/lib/core/user-context";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTabsNav, { AdminTab } from "@/components/admin/AdminTabsNav";
import CommandCenterView from "@/components/admin/CommandCenterView";
import UserManagementView from "@/components/admin/UserManagementView";
import ContentCommandView from "@/components/admin/ContentCommandView";
import AnalyticsCommandView from "@/components/admin/AnalyticsCommandView";
import ChillZoneAdminView from "@/components/admin/ChillZoneAdminView";
import SystemSettingsView from "@/components/admin/SystemSettingsView";
import AdminCommandPalette from "@/components/admin/AdminCommandPalette";
import { sound } from "@/lib/audio/sound-engine";

const INITIAL_STATS: PlatformLiveStats = {
  liveNow: 1,
  activeToday: 1,
  newUsersToday: 1,
  totalStudyHours: 0,
  pyqsAttemptedToday: 0,
  revisionsDoneToday: 0,
  mockTestsActive: 10,
  chillZoneActivePlayers: 0,
  platformHealthPercent: 99.9,
  healthStatus: "EXCELLENT",
  dbLatencyMs: 16,
};

export default function AdminPage() {
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("COMMAND_CENTER");
  const [currentRole, setCurrentRole] = useState<AdminRole>("SUPER_ADMIN");
  const [stats, setStats] = useState<PlatformLiveStats>(INITIAL_STATS);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Admin gate form states (if accessed unauthenticated)
  const [gateEmail, setGateEmail] = useState("");
  const [gatePassword, setGatePassword] = useState("");
  const [gateError, setGateError] = useState("");
  const [gateLoading, setGateLoading] = useState(false);

  // Check admin authorization on mount
  useEffect(() => {
    const isMaster = UserSessionManager.isMasterAdmin();
    setIsAuthenticatedAdmin(isMaster);
  }, []);

  const handleAdminGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateError("");
    setGateLoading(true);

    const emailTrim = gateEmail.trim().toLowerCase();
    const passTrim = gatePassword.trim();

    if (
      emailTrim === SINGLE_ADMIN_CREDENTIALS.email.toLowerCase() &&
      passTrim === SINGLE_ADMIN_CREDENTIALS.password
    ) {
      const res = await UserSessionManager.authenticateLocal(emailTrim, passTrim);
      if (res.success) {
        sound.playVictory();
        setIsAuthenticatedAdmin(true);
        setGateLoading(false);
        return;
      }
    }

    sound.playWrong();
    setGateError("Access Denied: Invalid Administrator Credentials.");
    setGateLoading(false);
  };

  const fetchLiveTelemetry = useCallback(async () => {
    if (!isAuthenticatedAdmin) return;
    try {
      const [statsRes, actRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/activity"),
      ]);

      const statsJson = await statsRes.json();
      if (statsJson.success && statsJson.data) {
        setStats(statsJson.data);
      }

      const actJson = await actRes.json();
      if (actJson.success && Array.isArray(actJson.data)) {
        setActivities(actJson.data);
      }
    } catch {}
  }, [isAuthenticatedAdmin]);

  useEffect(() => {
    if (isAuthenticatedAdmin) {
      fetchLiveTelemetry();
      const interval = setInterval(fetchLiveTelemetry, 30000); // 30s telemetry tick
      return () => clearInterval(interval);
    }
  }, [isAuthenticatedAdmin, fetchLiveTelemetry]);

  // Global Ctrl + K event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleMute = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
  };

  // Initial loading state
  if (isAuthenticatedAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] font-mono text-xs text-[#8C8C8C]">
        VERIFYING SECURITY TOKENS...
      </div>
    );
  }

  // Admin Security Shield Gate (if unauthenticated)
  if (!isAuthenticatedAdmin) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-[#F5F5F5] px-4 py-8 font-sans selection:bg-[#D8A63A]/30">
        <div className="w-full max-w-md rounded-3xl border border-red-500/40 bg-[#0d0d0d] p-6 sm:p-8 shadow-[0_0_60px_rgba(239,68,68,0.15)]">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-mono text-sm font-black text-[#8C8C8C] hover:border-[#D8A63A] hover:text-[#D8A63A] transition"
            >
              ←
            </Link>
            <h1 className="text-xl font-black font-mono tracking-widest text-red-400 uppercase">
              RESTRICTED PORTAL
            </h1>
          </div>

          <p className="text-xs font-mono text-[#8C8C8C] mb-6">
            Single Administrator Access Gate // Identity Verification Required
          </p>

          {gateError && (
            <div className="mb-4 rounded-2xl bg-red-500/10 border border-red-500/30 p-3 font-mono text-xs text-red-300 animate-fadeIn">
              ⚠️ {gateError}
            </div>
          )}

          <form onSubmit={handleAdminGateSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-[10px] text-[#8C8C8C] uppercase">Admin Identity (Email)</label>
              <input
                type="email"
                placeholder="whynotupsc@wacky.com"
                value={gateEmail}
                onChange={(e) => setGateEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-xl bg-black/60 border border-white/10 px-4 py-2.5 text-xs text-white outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#8C8C8C] uppercase">Security Clearance Key (Password)</label>
              <input
                type="password"
                placeholder="••••••••"
                value={gatePassword}
                onChange={(e) => setGatePassword(e.target.value)}
                required
                className="mt-1 w-full rounded-xl bg-black/60 border border-white/10 px-4 py-2.5 text-xs text-white outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={gateLoading}
              className="mt-2 w-full rounded-2xl border border-red-500 bg-red-500/20 py-3 font-mono text-xs font-black text-red-300 hover:bg-red-500 hover:text-black transition shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50 cursor-pointer"
            >
              {gateLoading ? "AUTHENTICATING COMMAND KEY..." : "UNLOCK ADMIN WORKSPACE →"}
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <Link href="/login" className="font-mono text-xs text-[#8C8C8C] hover:text-[#D8A63A] transition">
              ← Return to Standard Cadet Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A]/30">
      {/* Top Admin Header */}
      <AdminHeader
        currentRole={currentRole}
        onChangeRole={(r) => setCurrentRole(r)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Admin Sub-Navigation Tabs */}
      <AdminTabsNav
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
      />

      {/* Main Admin Workspace Container */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 sm:p-8">
        {activeTab === "COMMAND_CENTER" && (
          <CommandCenterView
            stats={stats}
            activities={activities}
            onRefresh={fetchLiveTelemetry}
          />
        )}

        {activeTab === "USERS" && <UserManagementView />}

        {activeTab === "CONTENT" && <ContentCommandView />}

        {activeTab === "ANALYTICS" && <AnalyticsCommandView />}

        {activeTab === "CHILL_ZONE" && <ChillZoneAdminView />}

        {activeTab === "SYSTEM_SETTINGS" && <SystemSettingsView />}
      </main>

      {/* Universal Admin Omnibox Palette */}
      <AdminCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(t) => setActiveTab(t)}
      />
    </div>
  );
}

