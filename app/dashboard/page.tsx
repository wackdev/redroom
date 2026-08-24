"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/db/supabase";
import { DailyIntelligence, TestResultRecord } from "@/lib/core/types";
import { formatDate, safeArray } from "@/lib/core/utils";
import { APP_ROUTES } from "@/lib/core/constants";
import {
  subscribeToSyncChanges,
  useCloudSync,
} from "@/lib/sync/sync-engine";
import UniverseCommandCenter from "@/components/UniverseCommandCenter";
import VirtualStudyHall from "@/components/VirtualStudyHall";
import FutureYouSimulator from "@/components/FutureYouSimulator";
import AIStrategistWhy from "@/components/AIStrategistWhy";
import RevisionHeatmap from "@/components/RevisionHeatmap";
import CadetRankBadge from "@/components/CadetRankBadge";
import AuthGuard from "@/components/auth/AuthGuard";

const RESULT_STORAGE_KEY = "redroom_test_results";
const PLANS_STORAGE_KEY = "redroom_study_plan";
const LEGACY_PLANS_STORAGE_KEY = "redroom_study_plans";

type DashboardTab = "matrix" | "pomodoro" | "3d_universe" | "sectors";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { isSyncing, lastSyncTime, triggerManualSync } = useCloudSync();

  const [activeTab, setActiveTab] = useState<DashboardTab>("matrix");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<TestResultRecord[]>([]);
  const [plans, setPlans] = useState<Record<string, any>>({});
  const [intelligence, setIntelligence] = useState<DailyIntelligence | null>(null);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Auth check (only if Supabase credentials exist)
      if (isSupabaseConfigured()) {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            setEmail(user.email || "");
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

      // 3. Load Test Results & Study Plans from localStorage
      try {
        const saved = localStorage.getItem(RESULT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setResults(parsed);
          }
        }

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

    const unsubscribe = subscribeToSyncChanges(() => {
      void loadDashboardData();
    });

    return unsubscribe;
  }, [loadDashboardData]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const recentResults = safeArray(results).slice(0, 4);

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
        {/* COMMAND HEADER */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0d0d0d]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D8A63A] font-mono font-black text-black shadow-[0_0_15px_rgba(216,166,58,0.4)]">
                ↑
              </div>
              <div>
                <span className="font-mono font-black tracking-widest text-base sm:text-lg text-white uppercase">
                  WHYNOTUPSC <span className="text-[#F4C95D]">COMMAND</span>
                </span>
                <span className="ml-2 hidden rounded-full border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-2 py-0.5 font-mono text-[9px] font-bold text-[#F4C95D] sm:inline-block">
                  WHY NOT YOU?
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <button
                onClick={() => void triggerManualSync()}
                title="Click to sync data with cloud"
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-semibold transition ${
                  isSyncing
                    ? "border-[#D8A63A]/50 bg-[#D8A63A]/10 text-[#F4C95D] animate-pulse"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>🔄</span>
                <span className="hidden sm:inline">
                  {isSyncing ? "SYNCING..." : lastSyncTime ? `SYNCED (${lastSyncTime})` : "SYNC CLOUD"}
                </span>
              </button>

              <CadetRankBadge
                totalHours={
                  Math.round(
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
                  ) / 10
                }
                mainsAnswerCount={4}
                pyqSolvedCount={safeArray(results).length * 15}
              />

              <button
                onClick={logout}
                className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-white/70 hover:bg-white/10 hover:text-white transition"
              >
                Exit
              </button>
            </div>
          </div>
        </header>

        {/* TOP SEGMENTED DASHBOARD TABS */}
        <div className="border-b border-white/10 bg-[#080511]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6">
            <button
              onClick={() => setActiveTab("matrix")}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 font-mono text-xs font-bold transition whitespace-nowrap ${
                activeTab === "matrix"
                  ? "bg-[#D8A63A] text-black shadow-lg shadow-[#D8A63A]/20"
                  : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>⚡</span>
              <span>Tactical Command Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab("pomodoro")}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 font-mono text-xs font-bold transition whitespace-nowrap ${
                activeTab === "pomodoro"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-950/50"
                  : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>⏳</span>
              <span>Deep Work & Pomodoro Hall</span>
            </button>

            <button
              onClick={() => setActiveTab("3d_universe")}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 font-mono text-xs font-bold transition whitespace-nowrap ${
                activeTab === "3d_universe"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-950/50"
                  : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>🌌</span>
              <span>3D Universe & Simulation Labs</span>
            </button>

            <button
              onClick={() => setActiveTab("sectors")}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 font-mono text-xs font-bold transition whitespace-nowrap ${
                activeTab === "sectors"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-950/50"
                  : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>🧭</span>
              <span>All 16 System Sectors</span>
            </button>
          </div>
        </div>

        {/* TAB 1: TACTICAL COMMAND MATRIX */}
        {activeTab === "matrix" && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
            {/* HERO TITLE */}
            <section>
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-[#F4C95D]">
                YOUR PERSONAL UPSC OPERATING SYSTEM
              </p>
              <h1 className="mt-1 text-2xl sm:text-4xl md:text-5xl font-black text-white">
                Preparation Command Matrix
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#8C8C8C] max-w-3xl font-sans">
                Every aspirant can dream of UPSC. The real question is —{" "}
                <strong className="text-white">WHY NOT YOU?</strong> Real-time diagnostic intelligence from your syllabus, tests, and active recall.
              </p>
            </section>

            {/* 1. MASTER INTELLIGENCE PRIORITY BANNER */}
            {intelligence && (
              <section className="overflow-hidden rounded-3xl border border-[#D8A63A]/40 bg-gradient-to-r from-[#171408] via-[#241d0a] to-[#0d0d0d] p-6 sm:p-8 shadow-[0_0_30px_rgba(216,166,58,0.15)]">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 items-center rounded-full bg-[#D8A63A] px-3 font-mono text-[10px] font-black uppercase text-black tracking-wider shadow">
                        ⚡ {intelligence.topPriorityTask.urgency} Priority
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

                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
                    <button
                      onClick={() => router.push(intelligence.topPriorityTask.actionRoute)}
                      className="rounded-2xl bg-gradient-to-r from-[#D8A63A] to-[#B38322] px-6 py-3.5 font-mono text-xs sm:text-sm font-black text-black shadow-xl transition hover:scale-105 active:scale-95"
                    >
                      Start Priority Mission →
                    </button>
                    <button
                      onClick={() => setActiveTab("pomodoro")}
                      className="rounded-2xl border border-white/10 bg-white/5 px-6 py-2.5 font-mono text-xs font-semibold text-white/70 hover:bg-white/10 transition"
                    >
                      Launch Deep Focus Sprint ⏳
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* 2. DIAGNOSTIC RADAR / QUICK SIGNAL CARDS */}
            {intelligence && (
              <section className="grid gap-4 sm:grid-cols-3">
                <div
                  onClick={() => router.push("/revision")}
                  className="cursor-pointer rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 transition hover:border-[#D8A63A]/50 hover:bg-[#141414] shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🔄</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                        intelligence.dueRevisionsCount > 0
                          ? "border border-amber-500/40 bg-amber-500/20 text-amber-300 animate-pulse"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {intelligence.dueRevisionsCount > 0 ? "Time to Reconnect" : "All Connected"}
                    </span>
                  </div>
                  <p className="mt-3 font-mono text-3xl font-black text-white">{intelligence.dueRevisionsCount}</p>
                  <p className="text-xs font-semibold text-white/60">Topics Requiring Active Recall</p>
                  <p className="mt-2 font-mono text-[11px] text-[#F4C95D]">Reconnect memory pathways →</p>
                </div>

                <div
                  onClick={() => router.push("/pyqs")}
                  className="cursor-pointer rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 transition hover:border-[#D8A63A]/50 hover:bg-[#141414] shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">⚠️</span>
                    <span className="rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                      Pattern Detected
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-bold truncate text-white">
                    {intelligence.weakTopics[0]?.topic || "Polity Writs"}
                  </p>
                  <p className="text-xs font-semibold text-white/60">
                    {intelligence.weakTopics[0]?.accuracyPercent}% Recent Accuracy
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-[#F4C95D]">Practice targeted MCQs →</p>
                </div>

                <div
                  onClick={() => router.push("/current-affairs")}
                  className="cursor-pointer rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 transition hover:border-[#D8A63A]/50 hover:bg-[#141414] shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">📡</span>
                    <span className="rounded-full border border-blue-500/40 bg-blue-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-blue-300">
                      Daily Brief
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-bold truncate text-white">Editorials & GS Dimensions</p>
                  <p className="text-xs font-semibold text-white/60">Prelims Pointers & AI Quiz Ready</p>
                  <p className="mt-2 font-mono text-[11px] text-blue-300">Read daily brief →</p>
                </div>
              </section>
            )}

            {/* 3. REVISION & DAILY CONSISTENCY HEATMAP */}
            <RevisionHeatmap plans={plans} testResults={results} />

            {/* 4. FUTURE YOU TRAJECTORY SIMULATOR */}
            <FutureYouSimulator />

            {/* 5. AI STRATEGIST "WHY" WIDGET */}
            <AIStrategistWhy />

            {/* 6. RECENT TESTS & PERFORMANCE SUMMARY */}
            <section className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-mono text-sm font-black uppercase tracking-wider text-white">
                    Recent Simulation Logs
                  </h2>
                  <p className="text-xs text-[#8C8C8C]">Latest mock attempts and score tracking</p>
                </div>
                <button
                  onClick={() => router.push("/performance")}
                  className="font-mono text-xs font-bold text-[#F4C95D] hover:underline"
                >
                  Full Analytics →
                </button>
              </div>

              {recentResults.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-xs text-white/40">
                  No mock test logs yet. Take a test in the{" "}
                  <button
                    onClick={() => router.push("/tests")}
                    className="text-[#F4C95D] underline font-bold"
                  >
                    Mock Test Arena
                  </button>{" "}
                  to begin tracking.
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
        )}

        {/* TAB 2: DEEP FOCUS & POMODORO HALL */}
        {activeTab === "pomodoro" && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
            <VirtualStudyHall />
          </div>
        )}

        {/* TAB 3: 3D UNIVERSE & SIMULATION LABS */}
        {activeTab === "3d_universe" && (
          <div className="relative min-h-[85vh] bg-[#050505] p-4 sm:p-6 space-y-6">
            <div className="rounded-3xl border border-purple-500/30 overflow-hidden shadow-2xl">
              <UniverseCommandCenter />
            </div>
          </div>
        )}

        {/* TAB 4: COMPLETE 16 SYSTEM SECTORS */}
        {activeTab === "sectors" && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
            <div>
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-[#F4C95D]">
                CENTRAL INTERCONNECTED COMMAND
              </p>
              <h2 className="text-xl sm:text-3xl font-black text-white">
                All 16 UPSC Operating System Sectors
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {APP_ROUTES.slice(1).map((route) => (
                <div
                  key={route.path}
                  onClick={() => router.push(route.path)}
                  className="group flex cursor-pointer flex-col justify-between rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 transition hover:border-[#D8A63A]/50 hover:bg-[#141414] shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-xl group-hover:scale-110 transition">
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
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
