"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminRole, PlatformLiveStats, ActivityEvent } from "@/lib/admin/types";
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

const DEFAULT_STATS: PlatformLiveStats = {
  liveNow: 142,
  activeToday: 1248,
  newUsersToday: 36,
  totalStudyHours: 842.5,
  pyqsAttemptedToday: 2340,
  revisionsDoneToday: 412,
  mockTestsActive: 10,
  chillZoneActivePlayers: 34,
  platformHealthPercent: 99.2,
  healthStatus: "EXCELLENT",
  dbLatencyMs: 24,
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("COMMAND_CENTER");
  const [currentRole, setCurrentRole] = useState<AdminRole>("SUPER_ADMIN");
  const [stats, setStats] = useState<PlatformLiveStats>(DEFAULT_STATS);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const fetchLiveTelemetry = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchLiveTelemetry();
    const interval = setInterval(fetchLiveTelemetry, 30000); // 30s telemetry tick
    return () => clearInterval(interval);
  }, [fetchLiveTelemetry]);

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
