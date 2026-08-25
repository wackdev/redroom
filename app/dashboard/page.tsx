"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/db/supabase";
import { DailyIntelligence, TestResultRecord } from "@/lib/core/types";
import { formatDate, safeArray } from "@/lib/core/utils";
import { APP_ROUTES } from "@/lib/core/constants";
import {
  subscribeToSyncChanges,
  useCloudSync,
} from "@/lib/sync/sync-engine";
import { sound } from "@/lib/audio/sound-engine";
import PomodoroStudyTracker from "@/components/PomodoroStudyTracker";
import FutureYouSimulator from "@/components/FutureYouSimulator";
import AIStrategistWhy from "@/components/AIStrategistWhy";
import RevisionHeatmap from "@/components/RevisionHeatmap";
import CadetRankBadge from "@/components/CadetRankBadge";
import AuthGuard from "@/components/auth/AuthGuard";

import AppUniversalHeader from "@/components/AppUniversalHeader";
import { UserSessionManager } from "@/lib/core/user-context";
import { dexieDb } from "@/lib/db/dexie";

const RESULT_STORAGE_KEY = "redroom_test_results";
const PLANS_STORAGE_KEY = "redroom_study_plan";
const LEGACY_PLANS_STORAGE_KEY = "redroom_study_plans";

interface TelegramBroadcast {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  author?: string;
  actionLink?: string;
  actionLabel?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { isSyncing, lastSyncTime, triggerManualSync } = useCloudSync();

  const [activeCadet, setActiveCadet] = useState(() => UserSessionManager.getActiveUser());
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<TestResultRecord[]>([]);
  const [plans, setPlans] = useState<Record<string, any>>({});
  const [intelligence, setIntelligence] = useState<DailyIntelligence | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [telegramBroadcasts, setTelegramBroadcasts] = useState<TelegramBroadcast[]>([]);
  const [dismissedBroadcastIds, setDismissedBroadcastIds] = useState<Set<string>>(new Set());

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const currentCadet = UserSessionManager.getActiveUser();
      setActiveCadet(currentCadet);
      if (currentCadet?.email) {
        setEmail(currentCadet.email);
      }

      // 1. Auth check (only if Supabase credentials exist)
      if (isSupabaseConfigured()) {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            setEmail(user.email || currentCadet?.email || "");
          }
        } catch {}
      }

      // 2. Fetch Master Intelligence
      try {
        const intelRes = await fetch("/api/dashboard/intelligence");
        const intelJson = await intelRes.json();
        if (intelJson.success && intelJson.data) {
          setIntelligence(intelJson.data);
        }
      } catch (err) {
        console.warn("Could not load intelligence:", err);
      }

      // 3. Fetch Telegram & Admin Live Broadcasts
      try {
        const bcRes = await fetch("/api/admin/broadcast");
        const bcJson = await bcRes.json();
        if (bcJson.success && Array.isArray(bcJson.data)) {
          setTelegramBroadcasts(bcJson.data);
        }
      } catch {}

      // 4. Load Test Results from Dexie + localStorage
      try {
        let loadedResults: TestResultRecord[] = [];
        const saved = localStorage.getItem(RESULT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedResults = parsed;
          }
        }

        if (loadedResults.length === 0) {
          const dexieResults = await dexieDb.test_results.toArray();
          if (dexieResults.length > 0) {
            loadedResults = dexieResults;
            localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(dexieResults));
          }
        }

        setResults(loadedResults);

        const savedPlans =
          localStorage.getItem(PLANS_STORAGE_KEY) ||
          localStorage.getItem(LEGACY_PLANS_STORAGE_KEY);
        if (savedPlans) {
          const parsedPlans = JSON.parse(savedPlans);
          if (parsedPlans && typeof parsedPlans === "object") {
            setPlans(parsedPlans);
          }
        }
      } catch {}
    } catch (err) {
      console.warn("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void loadDashboardData();
    setIsMuted(sound.getMuted());

    const unsubscribe = subscribeToSyncChanges(() => {
      void loadDashboardData();
    });

    const handleLocalBroadcast = () => {
      void loadDashboardData();
    };
    window.addEventListener("redroom_new_broadcast", handleLocalBroadcast);

    // Fast poll broadcasts every 5s
    const pollInterval = setInterval(() => {
      fetch("/api/admin/broadcast")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            setTelegramBroadcasts(json.data);
          }
        })
        .catch(() => {});
    }, 5000);

    return () => {
      unsubscribe();
      window.removeEventListener("redroom_new_broadcast", handleLocalBroadcast);
      clearInterval(pollInterval);
    };
  }, [loadDashboardData]);

  const handleToggleSound = () => {
    const muteState = sound.toggleMute();
    setIsMuted(muteState);
  };

  const handleDismissBroadcast = (id: string) => {
    sound.playSelect();
    setDismissedBroadcastIds((prev) => new Set([...prev, id]));
  };

  const handleSendQuickBroadcast = async () => {
    sound.playLock();
    try {
      const res = await fetch("/api/telegram/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "alert",
          title: "⚡ LIVE TELEGRAM NOTIFICATION ALERT",
          message: `UPSC Mission Directive dispatched from Commander Hub at ${new Date().toLocaleTimeString()}. Focus sprint active!`,
          priority: "URGENT",
        }),
      });
      const json = await res.json();
      if (json.success) {
        sound.playVictory();
        window.dispatchEvent(new CustomEvent("redroom_new_broadcast"));
        void loadDashboardData();
      }
    } catch {}
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    UserSessionManager.logout();
    router.push("/login");
  };

  const calculatedHours = Math.round(
    Object.values(plans).reduce((acc: number, p: any) => {
      if (p && Array.isArray(p.tasks)) {
        return (
          acc +
          p.tasks.reduce(
            (sum: number, t: any) =>
              t.completed ? sum + (Number(t.hours) || 0) : sum,
            0
          )
        );
      }
      return acc;
    }, 0) * 10
  ) / 10;

  const recentResults = safeArray(results).slice(0, 4);

  // Active Telegram broadcasts visible
  const activeTelegramAlerts = telegramBroadcasts.filter(
    (b) => !dismissedBroadcastIds.has(b.id)
  );

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#040406] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
        {/* UNIVERSAL LUXURY HUD HEADER */}
        <AppUniversalHeader moduleName="Command Centre" moduleBadge="CADET DASHBOARD" />

        {/* UNIFIED COMMAND DASHBOARD BODY */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
          {/* 1. LIVE TELEGRAM BROADCASTS & COMMAND DIRECTIVES BANNER */}
          {activeTelegramAlerts.length > 0 && (
            <section className="space-y-3">
              {activeTelegramAlerts.slice(0, 2).map((alert) => (
                <div
                  key={alert.id}
                  className="overflow-hidden rounded-3xl border border-amber-500/50 bg-gradient-to-r from-[#211505] via-[#170e03] to-[#0d0d0d] p-4 sm:p-5 shadow-[0_0_25px_rgba(245,158,11,0.25)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-xl border border-amber-500/40">
                      📡
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-amber-500 px-2 py-0.5 font-mono text-[9px] font-black uppercase text-black">
                          TELEGRAM DISPATCH
                        </span>
                        <span className="font-mono text-[10px] text-white/50">
                          {alert.author || "Commander"} · {formatDate(alert.createdAt)}
                        </span>
                      </div>
                      <h3 className="mt-1 font-mono text-sm font-bold text-white">
                        {alert.title}
                      </h3>
                      <p className="text-xs text-white/80 mt-0.5 leading-relaxed font-sans">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {alert.actionLink && (
                      <button
                        onClick={() => {
                          sound.playWarp();
                          router.push(alert.actionLink!);
                        }}
                        className="rounded-xl bg-[#D8A63A] px-3.5 py-1.5 font-mono text-xs font-bold text-black hover:bg-[#F4C95D] transition"
                      >
                        {alert.actionLabel || "Open Task →"}
                      </button>
                    )}
                    <button
                      onClick={() => handleDismissBroadcast(alert.id)}
                      className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-white/60 hover:text-white hover:bg-white/10 transition"
                      title="Dismiss notification"
                    >
                      Dismiss ✕
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* 2. HERO TITLE & OPERATING MOTTO */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-[#F4C95D]">
                CENTRAL INTELLIGENCE & TELEMETRY
              </p>
              <h1 className="mt-1 text-2xl sm:text-4xl md:text-5xl font-black text-white">
                Preparation Command Matrix
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#8C8C8C] max-w-2xl font-sans">
                Every aspirant can dream of UPSC. The real question is —{" "}
                <strong className="text-white">WHY NOT YOU?</strong> Real-time diagnostic intelligence from your syllabus, tests, spaced active recall, and 3D reality labs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs shrink-0">
              <button
                onClick={() => {
                  sound.playWarp();
                  router.push("/3d-zone?lab=universe_core");
                }}
                className="flex items-center gap-2 rounded-2xl border border-amber-500/50 bg-gradient-to-r from-[#211505] to-[#141005] px-4 py-2 font-bold text-amber-300 hover:border-amber-400 hover:bg-amber-500/20 transition shadow-[0_0_25px_rgba(245,158,11,0.25)]"
              >
                <span>🌀</span>
                <span>THE POSSIBILITY CORE →</span>
              </button>
              <Link
                href="/3d-zone"
                className="flex items-center gap-2 rounded-2xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-4 py-2 font-bold text-[#F4C95D] hover:bg-[#D8A63A]/20 transition shadow-[0_0_20px_rgba(216,166,58,0.25)]"
              >
                <span>🌌</span>
                <span>3D SIMULATION ZONE</span>
              </Link>
              <Link
                href="/chill-zone"
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/70 hover:bg-white/10 hover:text-white transition"
              >
                <span>🎮</span>
                <span>CHILL ARCADE</span>
              </Link>
            </div>
          </section>

          {/* 3. MASTER INTELLIGENCE PRIORITY MISSION (HERO BANNER) */}
          {intelligence && (
            <section className="overflow-hidden rounded-3xl border border-[#D8A63A]/40 bg-gradient-to-r from-[#171408] via-[#241d0a] to-[#0d0d0d] p-6 sm:p-8 shadow-[0_0_30px_rgba(216,166,58,0.15)]">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 items-center rounded-full bg-[#D8A63A] px-3 font-mono text-[10px] font-black uppercase text-black tracking-wider shadow">
                      ⚡ {intelligence.topPriorityTask.urgency} Priority Mission
                    </span>
                    <span className="font-mono text-xs font-semibold text-white/70">
                      Subject: <strong className="text-white">{intelligence.topPriorityTask.subject}</strong>
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl sm:text-2xl md:text-3xl font-black text-white">
                    {intelligence.topPriorityTask.title}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                    {intelligence.topPriorityTask.description}
                  </p>
                  <p className="mt-2 font-mono text-xs text-[#F4C95D]/80 italic">
                    Strategic reason: {intelligence.topPriorityTask.reason}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row md:flex-col">
                  <button
                    onClick={() => {
                      sound.playWarp();
                      router.push(intelligence.topPriorityTask.actionRoute);
                    }}
                    className="rounded-2xl bg-gradient-to-r from-[#D8A63A] to-[#B38322] px-6 py-3.5 font-mono text-xs sm:text-sm font-black text-black shadow-xl transition hover:scale-105 active:scale-95 text-center"
                  >
                    Start Priority Mission →
                  </button>
                  <button
                    onClick={() => {
                      sound.playSelect();
                      window.scrollTo({ top: 850, behavior: "smooth" });
                    }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-6 py-2.5 font-mono text-xs font-semibold text-white/70 hover:bg-white/10 transition text-center"
                  >
                    Launch Deep Focus Sprint ⏳
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* 4. DIAGNOSTIC SIGNAL PULSE (QUICK STATUS CARDS) */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
              onClick={() => {
                sound.playWarp();
                router.push("/revision");
              }}
              className="cursor-pointer rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 transition hover:border-[#D8A63A]/50 hover:bg-[#141414] shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🔄</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                      (intelligence?.dueRevisionsCount || 0) > 0
                        ? "border border-amber-500/40 bg-amber-500/20 text-amber-300 animate-pulse"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {(intelligence?.dueRevisionsCount || 0) > 0 ? "Time to Recall" : "Optimal"}
                  </span>
                </div>
                <p className="mt-3 font-mono text-3xl font-black text-white">{intelligence?.dueRevisionsCount ?? 0}</p>
                <p className="text-xs font-semibold text-white/60">Topics Requiring Active Recall</p>
              </div>
              <p className="mt-3 font-mono text-[11px] text-[#F4C95D]">Reconnect memory pathways →</p>
            </div>

            <div
              onClick={() => {
                sound.playWarp();
                router.push("/pyqs");
              }}
              className="cursor-pointer rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 transition hover:border-[#D8A63A]/50 hover:bg-[#141414] shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">⚠️</span>
                  <span className="rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                    Pattern Radar
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold truncate text-white">
                  {intelligence?.weakTopics[0]?.topic || "Polity Writs & Rights"}
                </p>
                <p className="text-xs font-semibold text-white/60">
                  {intelligence?.weakTopics[0]?.accuracyPercent || 58}% Recent Accuracy
                </p>
              </div>
              <p className="mt-3 font-mono text-[11px] text-[#F4C95D]">Practice targeted MCQs →</p>
            </div>

            <div
              onClick={() => {
                sound.playWarp();
                router.push("/current-affairs");
              }}
              className="cursor-pointer rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 transition hover:border-[#D8A63A]/50 hover:bg-[#141414] shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">📡</span>
                  <span className="rounded-full border border-blue-500/40 bg-blue-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-blue-300">
                    Daily Spoken
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold truncate text-white">Editorials & GS Dimensions</p>
                <p className="text-xs font-semibold text-white/60">Prelims Pointers & AI Quiz</p>
              </div>
              <p className="mt-3 font-mono text-[11px] text-blue-300">Listen 7-min audio digest →</p>
            </div>

            <div
              onClick={() => {
                sound.playWarp();
                router.push("/3d-zone?lab=universe_core");
              }}
              className="cursor-pointer rounded-3xl border border-amber-500/40 bg-gradient-to-br from-[#1c1304] to-[#0a0701] p-5 transition hover:border-amber-400 hover:scale-[1.02] shadow-[0_0_25px_rgba(245,158,11,0.2)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🌀</span>
                  <span className="rounded-full border border-amber-500/50 bg-amber-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-300 animate-pulse">
                    Possibility Core
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold truncate text-white">Kinetic Orbital System</p>
                <p className="text-xs font-semibold text-white/60">Live 3D telemetry for all 10 hubs</p>
              </div>
              <p className="mt-3 font-mono text-[11px] text-amber-300">Launch Possibility Core →</p>
            </div>
          </section>

          {/* 5. INTEGRATED POMODORO & STUDY READING TRACKER (TODAY / WEEK / MONTH / ALL-TIME) */}
          <section className="rounded-3xl border border-white/10 bg-[#080511] p-5 sm:p-7 shadow-2xl space-y-6">
            <PomodoroStudyTracker />
          </section>

          {/* 6. INTERACTIVE 3D SIMULATION REALITY LABS SHOWCASE */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-wider text-[#F4C95D]">
                  SPATIAL & VISUAL SIMULATION CENTER
                </p>
                <h2 className="text-lg sm:text-2xl font-black text-white">
                  3D Reality & GIS Visual Labs
                </h2>
              </div>
              <Link
                href="/3d-zone"
                className="font-mono text-xs font-bold text-[#F4C95D] hover:underline"
              >
                View All 10 Labs →
              </Link>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  id: "universe_core",
                  title: "The Possibility Core",
                  category: "Central Kinetic Hub",
                  icon: "🌀",
                  desc: "Real-time 60fps kinetic particle universe connecting all 10 preparation sectors.",
                },
                {
                  id: "geo_globe",
                  title: "3D Earth GIS Globe",
                  category: "Geography & Oceanography",
                  icon: "🌍",
                  desc: "Interactive planetary globe with tectonic fault lines, ocean currents & global straits.",
                },
                {
                  id: "history_tunnel",
                  title: "History 3D Time Tunnel",
                  category: "Ancient to Modern",
                  icon: "⏳",
                  desc: "Chronological immersive visual timeline from Indus Valley to 1947.",
                },
                {
                  id: "polity_3d",
                  title: "Constitutional 3D Atlas",
                  category: "Polity & Supreme Court",
                  icon: "📜",
                  desc: "Articles 1-395, Schedules 1-12 & Landmark Supreme Court Judgments.",
                },
                {
                  id: "spatial_map",
                  title: "Spatial GIS Map Trainer",
                  category: "Environment & Geography",
                  icon: "🗺️",
                  desc: "Cartographic GIS trainer for 106+ National Parks, Ramsar Wetlands & River Basins.",
                },
                {
                  id: "mindmap",
                  title: "Neural Knowledge Mindmap",
                  category: "Inter-Subject Cross-Links",
                  icon: "🧠",
                  desc: "Dynamic graph node network illuminating hidden overlaps between GS 1-4 topics.",
                },
              ].map((lab) => (
                <div
                  key={lab.id}
                  onClick={() => {
                    sound.playWarp();
                    router.push(`/3d-zone?lab=${lab.id}`);
                  }}
                  className="group flex cursor-pointer flex-col justify-between rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 transition hover:border-[#D8A63A]/50 hover:bg-[#141414] shadow-xl hover:scale-[1.01]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-xl group-hover:scale-110 group-hover:bg-[#D8A63A]/10 transition">
                        {lab.icon}
                      </span>
                      <span className="font-mono text-[10px] uppercase font-bold text-[#F4C95D] bg-[#D8A63A]/10 px-2 py-0.5 rounded-full border border-[#D8A63A]/20">
                        {lab.category}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-[#F4C95D] transition">
                        {lab.title}
                      </h3>
                      <p className="text-xs text-white/50 mt-1 line-clamp-2">
                        {lab.desc}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-2 font-mono text-[11px] text-white/40 group-hover:text-[#F4C95D]">
                    <span>Enter Simulator</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 7. CORE UPSC SYSTEM LAUNCHPAD (ALL ESSENTIAL SECTORS) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-wider text-[#F4C95D]">
                  CENTRAL UPSC OPERATING HUBS
                </p>
                <h2 className="text-lg sm:text-2xl font-black text-white">
                  Core System Launchpad
                </h2>
              </div>
              <span className="font-mono text-xs text-[#8C8C8C]">
                16 Interconnected Systems
              </span>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {APP_ROUTES.slice(1).map((route) => (
                <div
                  key={route.path}
                  onClick={() => {
                    sound.playWarp();
                    router.push(route.path);
                  }}
                  className="group flex cursor-pointer flex-col justify-between rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 transition hover:border-[#D8A63A]/50 hover:bg-[#141414] shadow-xl hover:scale-[1.01]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-xl group-hover:scale-110 group-hover:bg-[#D8A63A]/10 transition">
                        {route.icon}
                      </span>
                      <span className="font-mono text-xs text-white/30 group-hover:text-[#F4C95D] group-hover:translate-x-1 transition">
                        Launch →
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-[#F4C95D] transition">
                        {route.label}
                      </h3>
                      <p className="text-xs text-white/50 mt-1 line-clamp-2">
                        {route.description || "Active UPSC preparation laboratory and simulator."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 8. REVISION & DAILY CONSISTENCY HEATMAP */}
          <section className="space-y-3">
            <RevisionHeatmap plans={plans} testResults={results} />
          </section>

          {/* 9. FUTURE YOU TRAJECTORY SIMULATOR */}
          <section className="space-y-3">
            <FutureYouSimulator />
          </section>

          {/* 10. AI STRATEGIST "WHY" DIAGNOSTIC ENGINE */}
          <section className="space-y-3">
            <AIStrategistWhy />
          </section>

          {/* 11. RECENT SIMULATION LOGS & SCORE TRACKER */}
          <section className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-mono text-sm font-black uppercase tracking-wider text-white">
                  Recent Simulation Logs
                </h2>
                <p className="text-xs text-[#8C8C8C]">Latest mock attempts and score tracking</p>
              </div>
              <button
                onClick={() => {
                  sound.playWarp();
                  router.push("/performance");
                }}
                className="font-mono text-xs font-bold text-[#F4C95D] hover:underline"
              >
                Full Analytics Radar →
              </button>
            </div>

            {recentResults.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-xs text-white/40">
                No mock test logs yet. Take a test in the{" "}
                <button
                  onClick={() => {
                    sound.playWarp();
                    router.push("/tests");
                  }}
                  className="text-[#F4C95D] underline font-bold"
                >
                  Mock Test Arena
                </button>{" "}
                to begin tracking telemetry.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {recentResults.map((rec, i) => (
                  <div
                    key={rec.id || i}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[#F4C95D] uppercase">
                        {rec.subject || "General Studies"}
                      </span>
                      <h4 className="font-bold text-xs text-white line-clamp-1 mt-1">
                        {rec.title || "Module Test"}
                      </h4>
                      <p className="text-[10px] text-[#8C8C8C] mt-0.5">
                        {rec.date ? formatDate(rec.date) : "Recent"}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-2 font-mono">
                      <span className="text-[11px] text-white/70">Score</span>
                      <span
                        className={`text-sm font-black ${
                          (rec.score || 0) >= (rec.total || 100) * 0.5
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        {rec.score || 0} / {rec.total || 100}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}
