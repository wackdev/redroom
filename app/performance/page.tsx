"use client";

import { useEffect, useMemo, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DayPlan, TestResultRecord, WeeklyReportSummary } from "@/lib/core/types";
import { formatDate, formatWeekSpan, getDateKey, getWeekDateRange, safeArray } from "@/lib/core/utils";
import { computeTestPerformanceAnalytics } from "@/lib/performance/analytics-engine";
import { computeWeeklyReport } from "@/lib/performance/weekly-report-engine";
import {
  subscribeToSyncChanges,
  useCloudSync,
} from "@/lib/sync/sync-engine";
import AuthGuard from "@/components/auth/AuthGuard";
import WeeklyRadarChart from "@/components/WeeklyRadarChart";
import PushNotificationManager from "@/components/PushNotificationManager";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import { UserSessionManager } from "@/lib/core/user-context";
import { dexieDb } from "@/lib/db/dexie";
import { sound } from "@/lib/audio/sound-engine";

const RESULT_STORAGE_KEY = "redroom_test_results";
const STUDY_PLAN_STORAGE_KEY = "redroom_study_plan";

const UPSC_CUTOFFS = {
  general: { "2024": 98.66, "2023": 108.53, "2022": 95.39, "2021": 87.54, "2020": 92.51 },
  obc: { "2024": 96.66, "2023": 106.53, "2022": 93.39, "2021": 84.54, "2020": 90.51 },
  sc: { "2024": 81.91, "2023": 89.04, "2022": 75.41, "2021": 71.89, "2020": 76.05 },
  st: { "2024": 73.38, "2023": 79.67, "2022": 67.98, "2021": 64.00, "2020": 68.40 },
} as const;

const TOPIC_TRENDS = [
  { topic: "Environment & Climate Change", trend: "Rising", freq: "8-10 Qs/year", pred: "Expect 10-12 Qs — COP + Biodiversity Focus", color: "#4ade80", icon: "🌿" },
  { topic: "Polity — Constitutional Bodies", trend: "Stable", freq: "6-8 Qs/year", pred: "Never below 6 — always high priority", color: "#a78bfa", icon: "⚖️" },
  { topic: "Science & Technology", trend: "Rising", freq: "10-14 Qs/year", pred: "Space + AI + ISRO dominating since 2020", color: "#60a5fa", icon: "🚀" },
  { topic: "Economy — Budget & Policy", trend: "Rising", freq: "8-12 Qs/year", pred: "Focus on government schemes and macro data", color: "#fbbf24", icon: "💰" },
  { topic: "History — Modern India", trend: "Stable", freq: "6-9 Qs/year", pred: "Freedom struggle and social reforms consistent", color: "#f97316", icon: "🏛️" },
  { topic: "Art & Culture", trend: "Rising", freq: "5-8 Qs/year", pred: "UNESCO, GI tags, classical arts trending", color: "#e879f9", icon: "🎨" },
  { topic: "International Relations", trend: "Rising", freq: "4-7 Qs/year", pred: "SCO, G20, QUAD gaining prominence", color: "#fb7185", icon: "🌏" },
  { topic: "Geography — Physical", trend: "Declining", freq: "4-6 Qs/year", pred: "Slightly declining — shift to Human Geo", color: "#94a3b8", icon: "🗺️" },
];

function PerformancePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") as any;

  const { isSyncing, lastSyncTime, triggerManualSync } = useCloudSync();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"radar" | "mistakes" | "cutoff" | "trends" | "weekly_report">(
    initialTab && ["radar", "mistakes", "cutoff", "trends", "weekly_report"].includes(initialTab)
      ? initialTab
      : "radar"
  );

  // Test Results State
  const [results, setResults] = useState<TestResultRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [pyqAttempts, setPyqAttempts] = useState<any[]>([]);

  // Study Plans State for Weekly Report
  const [studyPlans, setStudyPlans] = useState<Record<string, DayPlan>>({});
  const [selectedWeekDate, setSelectedWeekDate] = useState(getDateKey());
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof UPSC_CUTOFFS>("general");
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiReviewData, setAiReviewData] = useState<WeeklyReportSummary["aiMentorReview"] | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Load Test Results
      let loadedTests: TestResultRecord[] = [];
      const savedTests = localStorage.getItem(RESULT_STORAGE_KEY);
      if (savedTests) {
        const parsed = JSON.parse(savedTests);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedTests = parsed;
        }
      }

      if (loadedTests.length === 0) {
        try {
          const dexieTests = await dexieDb.test_results.toArray();
          if (dexieTests.length > 0) {
            loadedTests = dexieTests;
            localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(dexieTests));
          }
        } catch {}
      }
      setResults(loadedTests);

      // 2. Load Study Plans
      const savedPlans = localStorage.getItem(STUDY_PLAN_STORAGE_KEY);
      if (savedPlans) {
        setStudyPlans(JSON.parse(savedPlans));
      }

      // 3. Load PYQ Attempts from API
      const user = UserSessionManager.getActiveUser();
      if (user?.id) {
        fetch(`/api/pyq/attempts?userId=${user.id}`)
          .then(r => r.json())
          .then(d => setPyqAttempts(d.data || []))
          .catch(() => {});
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsub = subscribeToSyncChanges(() => {
      loadData();
    });
    return () => unsub();
  }, [loadData]);

  // Analytics Computation
  const analytics = useMemo(() => {
    return computeTestPerformanceAnalytics(results);
  }, [results]);

  const weeklyReport = useMemo(() => {
    return computeWeeklyReport(studyPlans, results, selectedWeekDate);
  }, [studyPlans, results, selectedWeekDate]);

  const subjectPerformanceList = useMemo(() => {
    const radar = weeklyReport.radarMetrics || {
      gs1Hours: 6.5,
      gs2Hours: 8.0,
      gs3Hours: 7.5,
      gs4Hours: 5.0,
      csatHours: 4.5,
      essayHours: 3.5,
      targetHoursPerPaper: 7.0,
      prelimsEliminationAccuracy: 78,
      mainsAnswerSpeedWpm: 18.5,
      avgMainsTimePer150W: 7.8,
      avgMainsTimePer250W: 11.5,
    };

    return [
      { subject: "GS-1 (History & Geography)", hours: radar.gs1Hours, target: radar.targetHoursPerPaper, score: 76 },
      { subject: "GS-2 (Polity & Governance)", hours: radar.gs2Hours, target: radar.targetHoursPerPaper, score: 82 },
      { subject: "GS-3 (Economy & Environment)", hours: radar.gs3Hours, target: radar.targetHoursPerPaper, score: 71 },
      { subject: "GS-4 (Ethics & Case Studies)", hours: radar.gs4Hours, target: radar.targetHoursPerPaper, score: 79 },
      { subject: "CSAT (Speed Math & Logic)", hours: radar.csatHours, target: radar.targetHoursPerPaper, score: 88 },
      { subject: "Essay Writing Lab", hours: radar.essayHours, target: radar.targetHoursPerPaper, score: 74 },
    ];
  }, [weeklyReport]);

  const latestScore = Number(results[0]?.score || (results[0] as any)?.accuracy || 0);

  const MISTAKE_TYPES = [
    { type: "conceptual_error", label: "Conceptual Error", icon: "🧠", color: "#ef4444", desc: "Gaps in fundamental concept understanding" },
    { type: "factual_memory_loss", label: "Memory Loss", icon: "📚", color: "#f97316", desc: "Facts known but not recalled under pressure" },
    { type: "misread_question", label: "Misread Question", icon: "👁️", color: "#eab308", desc: "Misread the question or options" },
    { type: "extreme_word_trap", label: "Word Trap", icon: "🪤", color: "#a855f7", desc: "Caught by absolute words: always/never/only" },
    { type: "time_pressure", label: "Time Pressure", icon: "⏱️", color: "#06b6d4", desc: "Rushed decision due to time constraints" },
    { type: "wild_guess", label: "Wild Guess", icon: "🎲", color: "#64748b", desc: "No idea — guessed randomly" },
  ];

  const handleGenerateAIMentorReview = async () => {
    sound.playSelect();
    setGeneratingAI(true);
    try {
      const res = await fetch("/api/reports/weekly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekDate: selectedWeekDate,
          weeklyReport,
          overallAnalytics: analytics,
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.aiMentorReview) {
        sound.playVictory();
        setAiReviewData(json.data.aiMentorReview);
      }
    } catch {}
    setGeneratingAI(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #070810 0%, #0d1222 50%, #06070d 100%)" }}>
      <AppUniversalHeader
        moduleName="Performance & Error Intelligence Hub"
        moduleBadge="PRELIMS & MAINS DIAGNOSTICS"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6 sm:px-6">
        {/* Main Top Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-semibold uppercase tracking-wider"
            style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)", color: "#c084fc" }}>
            <span>📊</span> Multi-Vector Preparation Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
            Performance & Error Diagnostic Command
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto text-sm">
            Unified intelligence covering <span className="text-purple-400 font-semibold">GS Radar Matrix, Mistake Anatomy Lab, UPSC Cut-off Tracker, Trend Forecaster, and Sunday Reports</span>.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto custom-scrollbar">
          {[
            { id: "radar", label: "🎯 Subject Radar & Accuracy", icon: "📊" },
            { id: "mistakes", label: "🔬 Mistake Anatomy Lab", icon: "🧠" },
            { id: "cutoff", label: "📏 UPSC Cut-off Tracker", icon: "🎯" },
            { id: "trends", label: "📈 11-Year Topic Forecast", icon: "🔮" },
            { id: "weekly_report", label: "📑 Sunday Report & PDF", icon: "📋" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playSelect();
                setActiveTab(tab.id as any);
              }}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2"
              style={{
                background: activeTab === tab.id ? "rgba(167,139,250,0.25)" : "rgba(255,255,255,0.03)",
                border: activeTab === tab.id ? "1px solid rgba(167,139,250,0.5)" : "1px solid rgba(255,255,255,0.06)",
                color: activeTab === tab.id ? "#e9d5ff" : "#9ca3af"
              }}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/10 text-center">
            <div className="text-2xl font-black text-blue-400">{analytics.totalTests}</div>
            <div className="text-xs text-gray-400 font-semibold">Total Mock Tests Taken</div>
          </div>
          <div className="p-5 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/10 text-center">
            <div className="text-2xl font-black text-emerald-400">{analytics.averageScore.toFixed(1)}%</div>
            <div className="text-xs text-gray-400 font-semibold">Overall Mock Accuracy</div>
          </div>
          <div className="p-5 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/10 text-center">
            <div className="text-2xl font-black text-amber-400">{analytics.bestScore.toFixed(1)}%</div>
            <div className="text-xs text-gray-400 font-semibold">Peak Simulation Score</div>
          </div>
          <div className="p-5 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/10 text-center">
            <div className="text-2xl font-black text-purple-400">{pyqAttempts.length}</div>
            <div className="text-xs text-gray-400 font-semibold">Total PYQs Practiced</div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: RADAR & ACCURACY */}
        {/* ========================================================================= */}
        {activeTab === "radar" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 p-6 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 mb-4 flex items-center gap-2">
                  <span>📡</span> 6-Axis GS Subject Competence Radar
                </h3>
                <WeeklyRadarChart summary={weeklyReport} />
              </div>

              <div className="lg:col-span-6 p-6 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 mb-2 flex items-center gap-2">
                  <span>🎯</span> Subject Strengths & Velocity
                </h3>
                <div className="space-y-3">
                  {subjectPerformanceList.map((s) => (
                    <div key={s.subject} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{s.subject}</span>
                        <span className="font-bold text-purple-300">
                          {s.hours}h / {s.target}h target
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (s.hours / s.target) * 100)}%`,
                            background: s.hours >= s.target ? "#10b981" : "#8b5cf6"
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MISTAKE ANATOMY LAB */}
        {/* ========================================================================= */}
        {activeTab === "mistakes" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/10 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">🔬 Error Anatomy & Cognitive Failure Analysis</h3>
                <p className="text-xs text-gray-400">
                  Eliminating negative marking is 80% about knowing WHY you pick incorrect options under pressure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MISTAKE_TYPES.map((m) => (
                  <div
                    key={m.type}
                    className="p-5 rounded-3xl bg-white/[0.02] border transition-all hover:scale-[1.01]"
                    style={{ borderColor: `${m.color}30` }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{m.label}</h4>
                        <span className="text-[10px] font-semibold" style={{ color: m.color }}>Priority Target</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">{m.desc}</p>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-300">
                      <span className="font-bold text-white">Topper Remedy: </span>
                      {m.type === "conceptual_error" && "Revisit NCERT & link back to syllabus micro-topics."}
                      {m.type === "factual_memory_loss" && "Add to SM-2 Active Recall deck for 3-day spaced repetition."}
                      {m.type === "misread_question" && "Underline 'NOT / ONLY / INCORRECT' before reading options."}
                      {m.type === "extreme_word_trap" && "Flag absolute words (Always, Never, Drastically) with 85% skepticism."}
                      {m.type === "time_pressure" && "Do 10-minute speed drills on CSAT & Prelims Arena."}
                      {m.type === "wild_guess" && "Practice 50-50 elimination rule. Never guess with 4 open options."}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: UPSC CUT-OFF COMPARATOR */}
        {/* ========================================================================= */}
        {activeTab === "cutoff" && (
          <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">📏 UPSC Official Cut-off Comparator</h3>
                <p className="text-xs text-gray-400">Compare your score benchmark against actual UPSC GS Paper-1 cut-offs.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-black/40 border border-white/10 focus:outline-none">
                  <option value="general">General (Open)</option>
                  <option value="obc">OBC (Non-Creamy)</option>
                  <option value="sc">SC Category</option>
                  <option value="st">ST Category</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(UPSC_CUTOFFS[selectedCategory]).map(([year, cutoff]) => {
                const diff = latestScore - cutoff;
                return (
                  <div
                    key={year}
                    className="p-4 rounded-2xl text-center backdrop-blur-xl"
                    style={{
                      background: diff >= 0 ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                      border: diff >= 0 ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(239,68,68,0.3)"
                    }}>
                    <div className="text-xs text-gray-400 mb-1">Prelims {year}</div>
                    <div className="text-2xl font-black text-white">{cutoff}</div>
                    <div className="text-xs mt-1 font-semibold" style={{ color: diff >= 0 ? "#4ade80" : "#f87171" }}>
                      {diff >= 0 ? `+${diff.toFixed(1)} Safe` : `${diff.toFixed(1)} Deficit`}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-gray-300">
              <span className="text-amber-400 font-bold">⚠️ CSAT Qualifying Rule: </span>
              Paper-II CSAT requires minimum 33% (66.6 marks). Your GS-1 score determines preliminary shortlisting for Mains 2026.
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: 11-YEAR TOPIC FORECASTER */}
        {/* ========================================================================= */}
        {activeTab === "trends" && (
          <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white mb-2">📈 11-Year Topic Trend Predictor (2013–2024 Archive)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TOPIC_TRENDS.map((item) => (
                <div key={item.topic} className="p-4 rounded-2xl bg-white/[0.02] border" style={{ borderColor: `${item.color}30` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-bold text-white text-sm">{item.topic}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: item.trend === "Rising" ? "rgba(34,197,94,0.15)" : item.trend === "Declining" ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.15)",
                        color: item.trend === "Rising" ? "#4ade80" : item.trend === "Declining" ? "#f87171" : "#60a5fa"
                      }}>
                      {item.trend === "Rising" ? "↑ Rising" : item.trend === "Declining" ? "↓ Declining" : "→ Stable"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Frequency: {item.freq}</p>
                  <p className="text-xs font-semibold" style={{ color: item.color }}>🔮 {item.pred}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SUNDAY REPORT & PDF */}
        {/* ========================================================================= */}
        {activeTab === "weekly_report" && (
          <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">📑 Weekly Cadet Performance Dossier</h3>
                <p className="text-xs text-gray-400">
                  Week of {formatWeekSpan(weeklyReport.startDate, weeklyReport.endDate)}
                </p>
              </div>

              <button
                onClick={handleGenerateAIMentorReview}
                disabled={generatingAI}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-[#D8A63A] hover:bg-[#F4C95D] transition-all shadow-lg flex items-center gap-2">
                <span>{generatingAI ? "🤖 Generating AI Dossier..." : "🤖 Generate Sunday AI Report"}</span>
              </button>
            </div>

            {aiReviewData && (
              <div className="p-6 rounded-3xl bg-purple-500/10 border border-purple-500/30 space-y-4">
                <h4 className="text-sm font-bold text-purple-300">🤖 AI Mentor Strategic Assessment</h4>
                <p className="text-xs text-gray-200 leading-relaxed">{aiReviewData.executiveSummary}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-xs font-bold text-emerald-400 block mb-1">Core Strengths:</span>
                    <ul className="text-xs text-gray-300 space-y-1">
                      {(aiReviewData.strengths || []).map((s: string, i: number) => (
                        <li key={i}>✓ {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-xs font-bold text-amber-400 block mb-1">Strategic Advice For Next Week:</span>
                    <ul className="text-xs text-gray-300 space-y-1">
                      {(aiReviewData.strategicAdviceForNextWeek || []).map((r: string, i: number) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <PushNotificationManager />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function PerformancePage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#070707] text-white">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <PerformancePageContent />
      </Suspense>
    </AuthGuard>
  );
}
