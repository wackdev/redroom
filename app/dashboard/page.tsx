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
import FutureYouSimulator from "@/components/FutureYouSimulator";
import AIStrategistWhy from "@/components/AIStrategistWhy";
import RevisionHeatmap from "@/components/RevisionHeatmap";
import CadetRankBadge from "@/components/CadetRankBadge";
import AuthGuard from "@/components/auth/AuthGuard";

const RESULT_STORAGE_KEY = "redroom_test_results";
const PLANS_STORAGE_KEY = "redroom_study_plans";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { isSyncing, lastSyncTime, triggerManualSync } = useCloudSync();

  const [viewMode, setViewMode] = useState<"3d_universe" | "tactical_hud">("3d_universe");
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

        const savedPlans = localStorage.getItem(PLANS_STORAGE_KEY);
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

  // 3D UNIVERSE MODE
  if (viewMode === "3d_universe") {
    return (
      <AuthGuard>
        <div className="relative min-h-screen bg-[#050505]">
          <UniverseCommandCenter />

          {/* FLOATING HUD VIEW TOGGLE */}
          <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-2xl border border-[#D8A63A]/40 bg-[#0d0d0d]/90 p-1.5 backdrop-blur-xl shadow-[0_0_20px_rgba(216,166,58,0.3)]">
            <button
              onClick={() => setViewMode("3d_universe")}
              className="rounded-xl bg-[#D8A63A] px-3.5 py-1.5 font-mono text-xs font-black text-[#050505] shadow"
            >
              🌌 3D UNIVERSE
            </button>
            <button
              onClick={() => setViewMode("tactical_hud")}
              className="rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold text-white/70 hover:text-white transition"
            >
              📊 TACTICAL HUD
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }


  // TACTICAL 2.5D COMMAND HUD
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
                onClick={() => setViewMode("3d_universe")}
                className="flex items-center gap-1.5 rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3.5 py-1.5 font-bold text-[#F4C95D] hover:bg-[#D8A63A]/20 transition"
              >
                <span>🌌</span>
                <span>3D UNIVERSE</span>
              </button>

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
                totalHours={Math.round(
                  Object.values(plans).reduce((acc: number, p: any) => {
                    if (p && Array.isArray(p.tasks)) {
                      return (
                        acc +
                        p.tasks.reduce(
                          (sum: number, t: any) => (t.completed ? sum + (Number(t.hours) || 0) : sum),
                          0
                        )
                      );
                    }
                    return acc;
                  }, 0) * 10
                ) / 10}
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
            Every aspirant can dream of UPSC. The real question is — <strong className="text-white">WHY NOT YOU?</strong> Real-time diagnostic intelligence from your syllabus, tests, and active recall.
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
                  onClick={() => router.push("/study-plan")}
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-2.5 font-mono text-xs font-semibold text-white/70 hover:bg-white/10 transition"
                >
                  View Full Study Plan
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 2. DIAGNOSTIC RADAR / QUICK SIGNAL CARDS */}
        {intelligence && (
          <section className="grid gap-4 sm:grid-cols-3">
            {/* SPATIAL REVISION SIGNAL */}
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

            {/* WEAK TOPIC RADAR */}
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

            {/* DAILY CURRENT AFFAIRS */}
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

        {/* 5. ADVANCED TACTICAL ARSENAL & SIMULATORS */}
        <section className="rounded-3xl border border-[#D8A63A]/30 bg-gradient-to-r from-[#161208] via-[#0d0d0d] to-[#12081f] p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#F4C95D]">
                TACTICAL UPGRADES & SIMULATION LABORATORIES
              </span>
              <h2 className="text-lg font-black text-white">Next-Gen UPSC Arsenal</h2>
            </div>
            <span className="rounded-full bg-[#D8A63A]/20 px-3 py-1 font-mono text-xs font-bold text-[#F4C95D]">
              9 Active Laboratories
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <div
              onClick={() => router.push("/pyqs")}
              className="cursor-pointer rounded-2xl border border-white/10 bg-black/50 p-4 transition hover:border-cyan-500 hover:bg-black/80 space-y-1"
            >
              <span className="text-xl">🗺️</span>
              <h3 className="font-bold text-white">Spatial GIS Map Plotter</h3>
              <p className="text-[11px] text-white/50">Rivers, Passes, IVC Sites & 60s Pin-Drop Spatial Drill</p>
            </div>

            <div
              onClick={() => router.push("/pyqs")}
              className="cursor-pointer rounded-2xl border border-white/10 bg-black/50 p-4 transition hover:border-[#D8A63A] hover:bg-black/80 space-y-1"
            >
              <span className="text-xl">🏺</span>
              <h3 className="font-bold text-white">3D Art & History Museum</h3>
              <p className="text-[11px] text-white/50">Temples, Sculptures, Coins & Modern History Vault</p>
            </div>

            <div
              onClick={() => router.push("/pyqs")}
              className="cursor-pointer rounded-2xl border border-white/10 bg-black/50 p-4 transition hover:border-purple-500 hover:bg-black/80 space-y-1"
            >
              <span className="text-xl">🔮</span>
              <h3 className="font-bold text-white">Predictive PYQ Forecast</h3>
              <p className="text-[11px] text-white/50">30-Year Trend Modeler & Overdue Topic Radar</p>
            </div>

            <div
              onClick={() => router.push("/pyqs")}
              className="cursor-pointer rounded-2xl border border-white/10 bg-black/50 p-4 transition hover:border-emerald-500 hover:bg-black/80 space-y-1"
            >
              <span className="text-xl">🗃️</span>
              <h3 className="font-bold text-white">Mnemonic & Index Vault</h3>
              <p className="text-[11px] text-white/50">Global Reports Master & Spatial Sea Mnemonics</p>
            </div>

            <div
              onClick={() => router.push("/mains-pyqs")}
              className="cursor-pointer rounded-2xl border border-white/10 bg-black/50 p-4 transition hover:border-amber-500 hover:bg-black/80 space-y-1"
            >
              <span className="text-xl">✍️</span>
              <h3 className="font-bold text-white">Essay Architecture Studio</h3>
              <p className="text-[11px] text-white/50">1,200-Word Multi-Dimensional Essay Deconstruction</p>
            </div>

            <div
              onClick={() => router.push("/mains-pyqs")}
              className="cursor-pointer rounded-2xl border border-white/10 bg-black/50 p-4 transition hover:border-blue-500 hover:bg-black/80 space-y-1"
            >
              <span className="text-xl">📄</span>
              <h3 className="font-bold text-white">Printable QCAB Generator</h3>
              <p className="text-[11px] text-white/50">Official 250M UPSC Mains Question-Cum-Answer Booklet</p>
            </div>

            <div
              onClick={() => router.push("/mains-pyqs")}
              className="cursor-pointer rounded-2xl border border-white/10 bg-black/50 p-4 transition hover:border-pink-500 hover:bg-black/80 space-y-1"
            >
              <span className="text-xl">🪞</span>
              <h3 className="font-bold text-white">Topper Mirror Analyzer</h3>
              <p className="text-[11px] text-white/50">Rank 1-10 Structural Scannability & Legal Density</p>
            </div>

            <div
              onClick={() => router.push("/syllabus")}
              className="cursor-pointer rounded-2xl border border-white/10 bg-black/50 p-4 transition hover:border-purple-400 hover:bg-black/80 space-y-1"
            >
              <span className="text-xl">🧠</span>
              <h3 className="font-bold text-white">Syllabus Neural Mindmap</h3>
              <p className="text-[11px] text-white/50">1,200+ Cross-Syllabus Interdisciplinary Chain Reactions</p>
            </div>

            <div
              onClick={() => router.push("/chill-zone")}
              className="cursor-pointer rounded-2xl border border-white/10 bg-black/50 p-4 transition hover:border-emerald-400 hover:bg-black/80 space-y-1"
            >
              <span className="text-xl">⏳</span>
              <h3 className="font-bold text-white">24/7 Virtual Study Hall</h3>
              <p className="text-[11px] text-white/50">50m Pomodoro, Ambient LBSNAA Audio & Forest Trees</p>
            </div>
          </div>
        </section>

        {/* 6. CORE SYSTEM SECTOR LAUNCHER */}
        <section>
          <h2 className="mb-4 font-mono text-sm font-black uppercase tracking-wider text-white/70">
            WHYNOTUPSC System Matrix
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {APP_ROUTES.slice(1).map((route) => (
              <div
                key={route.path}
                onClick={() => router.push(route.path)}
                className="group flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-[#0d0d0d] p-4 transition hover:border-[#D8A63A]/50 hover:bg-[#141414]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-lg group-hover:scale-110 transition">
                    {route.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#F4C95D] transition">
                      {route.label}
                    </h3>
                  </div>
                </div>
                <span className="font-mono text-white/30 group-hover:translate-x-1 group-hover:text-[#F4C95D] transition">
                  →
                </span>
              </div>
            ))}
          </div>
        </section>

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
            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/40">
              <p className="text-xs font-mono">No simulations logged yet.</p>
              <button
                onClick={() => router.push("/tests")}
                className="mt-3 rounded-xl bg-[#D8A63A] px-4 py-2 font-mono text-xs font-black text-black hover:opacity-90"
              >
                Start First Module Test →
              </button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recentResults.map((r, i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-black/40 p-4">
                  <span className="font-mono text-[10px] text-[#8C8C8C]">{formatDate(r.date, "short")}</span>
                  <h4 className="mt-1 font-bold text-xs truncate text-white">{r.title}</h4>
                  <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-xs">
                    <span className="text-white/40 font-mono">Score:</span>
                    <span className="font-mono font-black text-[#F4C95D]">{r.score}</span>
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

