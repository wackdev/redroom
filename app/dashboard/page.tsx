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
import AuthGuard from "@/components/auth/AuthGuard";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import { UserSessionManager } from "@/lib/core/user-context";
import { dexieDb } from "@/lib/db/dexie";
import { calculateExamReadiness, ReadinessScoreResult } from "@/lib/brain/scoring/readiness-engine";
import { generatePersonalizedMission, PersonalizedPlanResponse } from "@/lib/brain/recommendations/recommendation-engine";
import { BrainDashboardData, getBrainDashboardData } from "@/lib/brain/intelligence-engine";

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
  const [readiness, setReadiness] = useState<ReadinessScoreResult | null>(null);
  const [mission, setMission] = useState<PersonalizedPlanResponse | null>(null);
  const [brainData, setBrainData] = useState<BrainDashboardData | null>(null);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [telegramBroadcasts, setTelegramBroadcasts] = useState<TelegramBroadcast[]>([]);
  const [dismissedBroadcastIds, setDismissedBroadcastIds] = useState<Set<string>>(new Set());

  // Dynamic Greeting based on local hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  // Exam Countdown (Target: UPSC Prelims 2027)
  const daysToPrelims = useMemo(() => {
    const examDate = new Date("2027-05-23T09:30:00+05:30").getTime();
    const now = new Date().getTime();
    const diff = examDate - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const currentCadet = UserSessionManager.getActiveUser();
      setActiveCadet(currentCadet);
      if (currentCadet?.email) {
        setEmail(currentCadet.email);
      }

      // 1. Auth check
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

      // 2. Fetch Central WhyNotUPSC Brain Intelligence (/api/brain/dashboard)
      try {
        const brainRes = await fetch("/api/brain/dashboard");
        const brainJson = await brainRes.json();
        if (brainJson.success && brainJson.data) {
          setBrainData(brainJson.data);
          setReadiness(brainJson.data.readiness);
          setMission({
            date: new Date().toISOString().slice(0, 10),
            estimatedTotalMinutes: (brainJson.data.todayMission || []).reduce(
              (sum: number, t: any) => sum + (t.estimatedMinutes || 0),
              0
            ),
            missionTitle: `Mission ${new Date().toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            })} — Targeted Consolidation`,
            readiness: brainJson.data.readiness,
            tasks: brainJson.data.todayMission,
            tacticalQuote:
              "Champions do not make fewer mistakes; they resolve their mistakes faster than the competition.",
          });
        } else {
          const localBrain = await getBrainDashboardData();
          setBrainData(localBrain);
          setReadiness(localBrain.readiness);
        }
      } catch (err) {
        console.warn("Brain API fallback to local calculation:", err);
        const localBrain = await getBrainDashboardData();
        setBrainData(localBrain);
        setReadiness(localBrain.readiness);
      }

      try {
        const intelRes = await fetch("/api/dashboard/intelligence");
        const intelJson = await intelRes.json();
        if (intelJson.success && intelJson.data) {
          setIntelligence(intelJson.data);
        }
      } catch {}

      // 3. Telegram Broadcasts
      try {
        const bcRes = await fetch("/api/admin/broadcast");
        const bcJson = await bcRes.json();
        if (bcJson.success && Array.isArray(bcJson.data)) {
          setTelegramBroadcasts(bcJson.data);
        }
      } catch {}

      // 4. Test results from Dexie + LocalStorage
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

    return () => {
      unsubscribe();
      window.removeEventListener("redroom_new_broadcast", handleLocalBroadcast);
    };
  }, [loadDashboardData]);

  // Dismiss a specific telegram broadcast
  const handleDismissBroadcast = (id: string) => {
    sound.playHover();
    setDismissedBroadcastIds((prev) => new Set([...prev, id]));
  };

  const activeBroadcasts = useMemo(() => {
    return telegramBroadcasts.filter((b) => !dismissedBroadcastIds.has(b.id));
  }, [telegramBroadcasts, dismissedBroadcastIds]);

  const recentResults = useMemo(() => {
    return results.slice(0, 4);
  }, [results]);

  const isNewCadetProfile = Boolean(readiness?.isNewUser);

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
        {/* UNIVERSAL REDROOM HUD HEADER */}
        <AppUniversalHeader moduleName="Command Centre HUD" moduleBadge="WHYNOTUPSC OS" />

        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8">
          {/* 1. TELEGRAM DISPATCH BROADCASTS */}
          {activeBroadcasts.length > 0 && (
            <div className="space-y-3">
              {activeBroadcasts.map((b) => (
                <div
                  key={b.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border p-4 shadow-xl transition-all ${
                    b.priority === "URGENT"
                      ? "border-red-500/50 bg-red-950/20 text-red-200 shadow-red-950/30"
                      : b.priority === "HIGH"
                      ? "border-amber-500/50 bg-amber-950/20 text-amber-200 shadow-amber-950/30"
                      : "border-blue-500/50 bg-blue-950/20 text-blue-200 shadow-blue-950/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">
                      {b.priority === "URGENT" ? "🚨" : b.priority === "HIGH" ? "⚠️" : "📢"}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">
                          {b.type} • {b.priority}
                        </span>
                        <span className="text-[10px] text-white/50">{formatDate(b.createdAt)}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white mt-1">{b.title}</h4>
                      <p className="text-xs text-white/80 mt-0.5">{b.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {b.actionLink && (
                      <Link
                        href={b.actionLink}
                        onClick={() => sound.playSelect()}
                        className="rounded-xl bg-[#D8A63A] px-3.5 py-1.5 font-mono text-xs font-bold text-black hover:bg-[#F4C95D] transition"
                      >
                        {b.actionLabel || "View Action"} →
                      </Link>
                    )}
                    <button
                      onClick={() => handleDismissBroadcast(b.id)}
                      className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. COMMAND HERO & NEXT BEST ACTION */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#121212] via-[#0d0d0d] to-[#080808] p-5 sm:p-8 shadow-2xl">
            <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#D8A63A]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-bold">
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-400">
                    ● BRAIN TELEMETRY ACTIVE
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60">
                    TARGET: UPSC PRELIMS {brainData?.meta.targetYear || 2027} ({brainData?.meta.daysToPrelims || daysToPrelims} DAYS LEFT)
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  {greeting}, Cadet {activeCadet?.fullName?.split(" ")[0] || email.split("@")[0] || "Aspirant"}.
                </h1>

                {/* COMMAND DIRECTIVE: NEXT BEST ACTION */}
                <div className="mt-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#F4C95D]">
                      COMMAND DIRECTIVE • {brainData?.nextBestAction.badge || (isNewCadetProfile ? "PROFILE CALIBRATION" : "NEXT BEST ACTION")}
                    </span>
                    <span className="font-mono text-[11px] text-white/50">
                      ⏱ {brainData?.nextBestAction.estimatedMinutes || 25} MINS
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {brainData?.nextBestAction.title || "Take 15-Question Baseline Diagnostic Mock"}
                  </h3>
                  <p className="text-xs text-white/70 font-sans leading-relaxed">
                    {brainData?.nextBestAction.reason ||
                      "Calibrate your multi-subject baseline accuracy radar to generate real-time exam readiness metrics."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-4 shrink-0 font-mono">
                <div className="flex items-baseline gap-2 bg-black/40 px-5 py-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] font-black text-white/50 uppercase">
                    {isNewCadetProfile ? "PROFILE" : "READINESS"}
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {isNewCadetProfile ? "50" : (brainData?.readiness.overallScore ?? readiness?.overallScore ?? 72)}
                    <span className="text-xl text-[#D8A63A] font-bold">%</span>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      sound.playWarp();
                      const target = brainData?.nextBestAction.actionRoute || mission?.tasks[0]?.route || (isNewCadetProfile ? "/tests" : "/revision");
                      router.push(target);
                    }}
                    className="flex items-center justify-center gap-2 flex-1 sm:flex-initial rounded-2xl bg-gradient-to-r from-[#D8A63A] to-[#B38322] px-7 py-3.5 font-mono text-xs font-black text-black shadow-[0_0_25px_rgba(216,166,58,0.4)] hover:scale-105 active:scale-95 transition text-center cursor-pointer"
                  >
                    <span>⚡</span>
                    <span>{isNewCadetProfile ? "START CALIBRATION" : "START MISSION NOW"}</span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playWarp();
                      router.push("/3d-zone?lab=universe_core");
                    }}
                    className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-3.5 py-3.5 text-xs text-white/80 transition cursor-pointer"
                    title="Possibility Core 3D"
                  >
                    🌀
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 3. TODAY'S READINESS & TODAY'S MISSION SECTION */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* TODAY'S READINESS HUD */}
            <div className="rounded-3xl border border-[#D8A63A]/40 bg-gradient-to-br from-[#171305] via-[#100c02] to-[#0d0d0d] p-5 sm:p-6 shadow-[0_0_30px_rgba(216,166,58,0.15)] flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#F4C95D] bg-[#D8A63A]/10 px-2.5 py-1 rounded-full border border-[#D8A63A]/20">
                    {isNewCadetProfile ? "CALIBRATING PROFILE" : "TODAY'S READINESS"}
                  </span>
                  <span className="font-mono text-xs text-white/50">Diagnostic Telemetry</span>
                </div>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-white">
                    {isNewCadetProfile ? "50" : (readiness?.overallScore ?? 72)}
                    <span className="text-2xl text-[#D8A63A] font-bold">%</span>
                  </span>
                  <span className="font-mono text-xs text-emerald-400 font-bold">
                    {isNewCadetProfile ? "★ Baseline Ready" : "▲ +4.2% this week"}
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-2 font-sans leading-relaxed">
                  {isNewCadetProfile
                    ? "Your preparation profile is being built. Complete your first diagnostic mock or study session to calibrate your live 6-axis radar."
                    : "Composite benchmark across Prelims MCQ accuracy, SM-2 retention, and syllabus mapping."}
                </p>

                {/* SUB-SCORES */}
                <div className="mt-5 grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="rounded-2xl bg-white/5 p-3 border border-white/5">
                    <span className="text-[10px] text-white/50 block">PRELIMS SCORE</span>
                    <span className="text-lg font-black text-amber-300 mt-0.5 block">
                      {isNewCadetProfile ? "Calibrating" : `${readiness?.prelimsScore ?? 78}%`}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3 border border-white/5">
                    <span className="text-[10px] text-white/50 block">MAINS SCORE</span>
                    <span className="text-lg font-black text-blue-300 mt-0.5 block">
                      {isNewCadetProfile ? "Calibrating" : `${readiness?.mainsScore ?? 66}%`}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playLock();
                  setShowWhyModal(true);
                }}
                className="w-full min-h-[44px] rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3 font-mono text-xs font-bold text-white/90 transition text-center cursor-pointer"
              >
                🔍 WHY THIS SCORE? (Explain Breakdown)
              </button>
            </div>

            {/* TODAY'S MISSION & WHAT SHOULD I DO NEXT */}
            <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 sm:p-7 shadow-xl flex flex-col justify-between space-y-6">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#F4C95D] bg-[#D8A63A]/10 px-2 py-0.5 rounded-full">
                        {isNewCadetProfile ? "STARTER DIRECTIVES" : "TODAY'S MISSION"}
                      </span>
                      <span className="font-mono text-xs text-white/60">
                        {mission?.missionTitle || "Daily Strategic Directives"}
                      </span>
                    </div>
                  </div>

                  <div className="font-mono text-xs text-white/60">
                    Estimated Time: <strong className="text-white">{Math.round(((mission?.estimatedTotalMinutes || 90) / 60) * 10) / 10} Hours</strong>
                  </div>
                </div>

                {/* ORDERED MISSION TASKS */}
                <div className="mt-4 space-y-2.5">
                  {(mission?.tasks || [
                    { id: "1", order: 1, title: "Take 15-Question Baseline Diagnostic Mock", description: "Establish your baseline accuracy across Polity, Economy & History.", estimatedMinutes: 20, subject: "Diagnostic Mock", route: "/tests", completed: false, priority: "CRITICAL" },
                    { id: "2", order: 2, title: "Configure GS Syllabus Milestones", description: "Map GS 1-4 micro-topics for target exam cycle.", estimatedMinutes: 15, subject: "Syllabus Matrix", route: "/syllabus", completed: false, priority: "HIGH" },
                    { id: "3", order: 3, title: "Complete First 25-Minute Focus Sprint", description: "Initialize daily study stamina in the Focus Sanctuary.", estimatedMinutes: 25, subject: "Focus Sanctuary", route: "/study-plan", completed: false, priority: "HIGH" },
                  ]).map((task, idx) => (
                    <div
                      key={task.id || idx}
                      onClick={() => {
                        sound.playWarp();
                        router.push(task.route);
                      }}
                      className="group flex cursor-pointer items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#D8A63A]/40 p-3.5 transition"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/5 font-mono text-xs font-bold text-[#F4C95D] group-hover:bg-[#D8A63A] group-hover:text-black transition">
                          {task.order || idx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#F4C95D] transition">
                            {task.title}
                          </h4>
                          <p className="text-[11px] text-white/50 font-sans mt-0.5 line-clamp-1">
                            {task.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                        <span className="text-white/40 text-[11px]">{task.estimatedMinutes}m</span>
                        <span className="text-[#F4C95D] opacity-0 group-hover:opacity-100 transition">
                          Start →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRIMARY CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 pt-4">
                <p className="text-xs text-[#8C8C8C] italic font-sans">
                  &ldquo;{mission?.tacticalQuote || "Resolve mistakes faster than the competition."}&rdquo;
                </p>

                <button
                  onClick={() => {
                    sound.playWarp();
                    const firstRoute = mission?.tasks[0]?.route || (isNewCadetProfile ? "/tests" : "/revision");
                    router.push(firstRoute);
                  }}
                  className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-[#D8A63A] to-[#B38322] px-8 py-3.5 font-mono text-xs font-black text-black shadow-xl hover:scale-105 active:scale-95 transition text-center shrink-0 cursor-pointer"
                >
                  START TODAY&apos;S MISSION ⚡
                </button>
              </div>
            </div>
          </div>

          {/* 4. DIAGNOSTIC SIGNAL PULSE */}
          <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div
              onClick={() => {
                sound.playWarp();
                router.push("/revision");
              }}
              className="cursor-pointer rounded-3xl border border-white/10 bg-[#0d0d0d] p-4 sm:p-5 transition hover:border-[#D8A63A]/50 hover:bg-[#141414] shadow-xl flex flex-col justify-between"
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
                <p className="mt-3 font-mono text-2xl sm:text-3xl font-black text-white">{intelligence?.dueRevisionsCount ?? 0}</p>
                <p className="text-xs font-semibold text-white/60">Topics for Active Recall</p>
              </div>
              <p className="mt-3 font-mono text-[11px] text-[#F4C95D]">Reconnect pathways →</p>
            </div>

            <div
              onClick={() => {
                sound.playWarp();
                router.push("/pyqs");
              }}
              className="cursor-pointer rounded-3xl border border-white/10 bg-[#0d0d0d] p-4 sm:p-5 transition hover:border-[#D8A63A]/50 hover:bg-[#141414] shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">⚠️</span>
                  <span className="rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                    Pattern Radar
                  </span>
                </div>
                <p className="mt-3 text-xs sm:text-sm font-bold truncate text-white">
                  {intelligence?.weakTopics[0]?.topic || "Polity Writs & Rights"}
                </p>
                <p className="text-xs font-semibold text-white/60">
                  {intelligence?.weakTopics[0]?.accuracyPercent || 58}% Accuracy
                </p>
              </div>
              <p className="mt-3 font-mono text-[11px] text-[#F4C95D]">Targeted MCQs →</p>
            </div>

            <div
              onClick={() => {
                sound.playWarp();
                router.push("/current-affairs");
              }}
              className="cursor-pointer rounded-3xl border border-white/10 bg-[#0d0d0d] p-4 sm:p-5 transition hover:border-[#D8A63A]/50 hover:bg-[#141414] shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">📡</span>
                  <span className="rounded-full border border-blue-500/40 bg-blue-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-blue-300">
                    Daily Spoken
                  </span>
                </div>
                <p className="mt-3 text-xs sm:text-sm font-bold truncate text-white">Editorials & GS</p>
                <p className="text-xs font-semibold text-white/60">Audio Brief & AI Quiz</p>
              </div>
              <p className="mt-3 font-mono text-[11px] text-blue-300">7-min audio digest →</p>
            </div>

            <div
              onClick={() => {
                sound.playWarp();
                router.push("/3d-zone?lab=universe_core");
              }}
              className="cursor-pointer rounded-3xl border border-amber-500/40 bg-gradient-to-br from-[#1c1304] to-[#0a0701] p-4 sm:p-5 transition hover:border-amber-400 hover:scale-[1.02] shadow-[0_0_25px_rgba(245,158,11,0.2)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🌀</span>
                  <span className="rounded-full border border-amber-500/50 bg-amber-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-300 animate-pulse">
                    Possibility Core
                  </span>
                </div>
                <p className="mt-3 text-xs sm:text-sm font-bold truncate text-white">Kinetic Orbital</p>
                <p className="text-xs font-semibold text-white/60">3D reality simulators</p>
              </div>
              <p className="mt-3 font-mono text-[11px] text-amber-300">Launch Core →</p>
            </div>
          </section>

          {/* 5. INTEGRATED POMODORO & STUDY TRACKER */}
          <section className="rounded-3xl border border-white/10 bg-[#080511] p-4 sm:p-7 shadow-2xl space-y-6">
            <PomodoroStudyTracker />
          </section>

          {/* 6. 3D SIMULATION REALITY LABS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-wider text-[#F4C95D]">
                  SPATIAL & VISUAL SIMULATION CENTER
                </p>
                <h2 className="text-lg sm:text-2xl font-black text-white">
                  3D Reality Simulation Labs
                </h2>
              </div>
              <Link
                href="/3d-zone"
                onClick={() => sound.playSelect()}
                className="font-mono text-xs font-bold text-[#F4C95D] hover:underline"
              >
                Open 3D Zone →
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  id: "geography_globe",
                  title: "Interactive 3D GIS Earth",
                  icon: "🌍",
                  desc: "Tectonic plates, Himalayan fault lines, ocean currents & atmospheric circulation.",
                },
                {
                  id: "history_tunnel",
                  title: "History Space-Time Tunnel",
                  icon: "⏳",
                  desc: "Chronological 3D corridor from Indus Valley to 1947 Independence.",
                },
                {
                  id: "constitutional_atlas",
                  title: "Constitutional Neural Atlas",
                  icon: "🏛️",
                  desc: "Articles 1 to 395 spatial node network with landmark Supreme Court judgments.",
                },
              ].map((lab) => (
                <div
                  key={lab.id}
                  onClick={() => {
                    sound.playWarp();
                    router.push(`/3d-zone?lab=${lab.id}`);
                  }}
                  className="group cursor-pointer rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 transition hover:border-[#D8A63A]/50 hover:bg-[#141414] shadow-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{lab.icon}</span>
                    <span className="font-mono text-xs text-white/40 group-hover:text-[#F4C95D] transition">
                      Enter Lab →
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-[#F4C95D] transition">
                    {lab.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-1 line-clamp-2">{lab.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 7. ALL 25 SYSTEM HUBS GRID */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-wider text-[#F4C95D]">
                  COMPLETE ARCHITECTURE
                </p>
                <h2 className="text-lg sm:text-2xl font-black text-white">
                  Core System Launchpad
                </h2>
              </div>
              <span className="font-mono text-xs text-[#8C8C8C]">
                {APP_ROUTES.length - 1} Interconnected Systems
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

          {/* 8. REVISION HEATMAP */}
          <section className="space-y-3">
            <RevisionHeatmap plans={plans} testResults={results} />
          </section>

          {/* 9. FUTURE YOU SIMULATOR */}
          <section className="space-y-3">
            <FutureYouSimulator />
          </section>

          {/* 10. AI STRATEGIST */}
          <section className="space-y-3">
            <AIStrategistWhy />
          </section>

          {/* 11. RECENT TEST SIMULATION LOGS */}
          <section className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                  Recent Simulation Logs
                </h2>
                <p className="text-xs text-[#8C8C8C]">Latest mock attempts and score tracking</p>
              </div>
              <button
                onClick={() => {
                  sound.playWarp();
                  router.push("/performance");
                }}
                className="font-mono text-xs font-bold text-[#F4C95D] hover:underline cursor-pointer"
              >
                Full Analytics Radar →
              </button>
            </div>

            {recentResults.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 sm:p-8 text-center text-xs text-white/50">
                No mock test logs yet. Take your baseline diagnostic in the{" "}
                <button
                  onClick={() => {
                    sound.playWarp();
                    router.push("/tests");
                  }}
                  className="text-[#F4C95D] underline font-bold cursor-pointer"
                >
                  Mock Test Arena
                </button>{" "}
                to begin tracking telemetry.
              </div>
            ) : (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                {recentResults.map((rec, i) => (
                  <div
                    key={rec.id || i}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 sm:p-4 flex flex-col justify-between"
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

        {/* 12. "WHY THIS SCORE?" DIAGNOSTIC MODAL */}
        {showWhyModal && readiness && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#D8A63A]/50 bg-[#0d0d0d] p-5 sm:p-8 shadow-[0_0_50px_rgba(216,166,58,0.25)] space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#F4C95D] uppercase">
                    CAUSAL TELEMETRY DIAGNOSTIC
                  </span>
                  <h3 className="text-lg sm:text-2xl font-black text-white mt-0.5">
                    {isNewCadetProfile
                      ? "Why is your Readiness 50% (Calibrating)?"
                      : `Why is your Readiness ${readiness.overallScore}%?`}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    sound.playHover();
                    setShowWhyModal(false);
                  }}
                  className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {/* Summary */}
                <p className="text-xs text-white/80 leading-relaxed font-sans bg-white/5 p-3.5 rounded-2xl border border-white/5">
                  {readiness.whyThisScore.summary}
                </p>

                {/* Strengths */}
                {readiness.whyThisScore.strengths.length > 0 && (
                  <div>
                    <h4 className="font-mono text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5 mb-2">
                      <span>✓</span> Key Strengths
                    </h4>
                    <ul className="space-y-1 text-xs text-white/70 list-disc list-inside">
                      {readiness.whyThisScore.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses / Declines */}
                {readiness.whyThisScore.weaknesses.length > 0 && (
                  <div>
                    <h4 className="font-mono text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5 mb-2">
                      <span>⚠️</span> Areas Requiring Immediate Focus
                    </h4>
                    <ul className="space-y-1 text-xs text-white/70 list-disc list-inside">
                      {readiness.whyThisScore.weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Immediate Next Best Actions */}
                <div className="border-t border-white/10 pt-3">
                  <h4 className="font-mono text-xs font-bold text-[#F4C95D] uppercase mb-2">
                    🎯 Recommended Next Actions
                  </h4>
                  <div className="space-y-2">
                    {readiness.whyThisScore.nextActions.map((action, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/5 text-xs gap-2"
                      >
                        <div className="min-w-0">
                          <span className="font-bold text-white block truncate">{action.step}</span>
                          <span className="text-white/50 block text-[11px] mt-0.5 line-clamp-1">{action.reason}</span>
                        </div>
                        <button
                          onClick={() => {
                            sound.playWarp();
                            setShowWhyModal(false);
                            router.push(action.route);
                          }}
                          className="min-h-[38px] rounded-lg bg-[#D8A63A] px-3.5 py-1 font-mono text-[11px] font-bold text-black hover:bg-[#F4C95D] transition shrink-0 ml-2 cursor-pointer"
                        >
                          Execute →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    sound.playHover();
                    setShowWhyModal(false);
                  }}
                  className="min-h-[44px] rounded-xl bg-white/10 px-5 py-2 font-mono text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
                >
                  Close Diagnostic
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
