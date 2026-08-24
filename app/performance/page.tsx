"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DayPlan, TestResultRecord, WeeklyReportSummary } from "@/lib/core/types";
import { formatDate, formatTime, formatWeekSpan, getDateKey, safeArray, shiftDateKey } from "@/lib/core/utils";
import { computeTestPerformanceAnalytics } from "@/lib/performance/analytics-engine";
import { computeWeeklyReport } from "@/lib/performance/weekly-report-engine";
import {
  subscribeToSyncChanges,
  useCloudSync,
} from "@/lib/sync/sync-engine";
import AuthGuard from "@/components/auth/AuthGuard";
import WeeklyRadarChart from "@/components/WeeklyRadarChart";
import PushNotificationManager from "@/components/PushNotificationManager";

const RESULT_STORAGE_KEY = "redroom_test_results";

const STUDY_PLAN_STORAGE_KEY = "redroom_study_plan";

export default function PerformancePage() {
  const router = useRouter();
  const { isSyncing, lastSyncTime, triggerManualSync } = useCloudSync();

  // Active Tab: "analytics" | "weekly_report"
  const [activeTab, setActiveTab] = useState<"analytics" | "weekly_report">("analytics");

  // Test Results State
  const [results, setResults] = useState<TestResultRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Study Plans State for Weekly Report
  const [studyPlans, setStudyPlans] = useState<Record<string, DayPlan>>({});
  const [selectedWeekDate, setSelectedWeekDate] = useState(getDateKey());
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiReviewData, setAiReviewData] = useState<WeeklyReportSummary["aiMentorReview"] | null>(null);

  const loadData = useCallback(() => {
    setLoading(true);
    try {
      // 1. Load Test Results
      const savedTests = localStorage.getItem(RESULT_STORAGE_KEY);
      if (savedTests) {
        const parsed = JSON.parse(savedTests);
        if (Array.isArray(parsed)) {
          setResults(parsed);
        }
      }

      // 2. Load Study Plans
      const savedPlans = localStorage.getItem(STUDY_PLAN_STORAGE_KEY);
      if (savedPlans) {
        const parsedPlans = JSON.parse(savedPlans);
        if (parsedPlans && typeof parsedPlans === "object") {
          setStudyPlans(parsedPlans);
        }
      }
    } catch (err) {
      console.warn("Could not load performance records:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Subscribe to cross-tab updates
    const unsubscribe = subscribeToSyncChanges(() => {
      loadData();
    });

    return unsubscribe;
  }, [loadData]);

  // Delete Test Record
  const deleteResult = (indexToDelete: number) => {
    if (window.confirm("Delete this test record?")) {
      const updated = results.filter((_, idx) => idx !== indexToDelete);
      setResults(updated);
      try {
        localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }
  };

  // Test Analytics
  const analytics = useMemo(() => computeTestPerformanceAnalytics(results), [results]);

  // Weekly Report
  const weeklyReport = useMemo(() => {
    const report = computeWeeklyReport(studyPlans, results, selectedWeekDate);
    if (aiReviewData) {
      report.aiMentorReview = aiReviewData;
    }
    return report;
  }, [studyPlans, results, selectedWeekDate, aiReviewData]);

  // Generate AI Weekly Mentor Review
  const handleGenerateAiWeeklyReview = async () => {
    setGeneratingAI(true);
    try {
      const res = await fetch("/api/reports/weekly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plans: studyPlans,
          testResults: results,
          referenceDate: selectedWeekDate,
          generateAI: true,
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.aiMentorReview) {
        setAiReviewData(json.data.aiMentorReview);
      }
    } catch (err) {
      console.error("AI review error:", err);
      alert("Failed to generate AI mentor review. Using deterministic evaluation.");
    } finally {
      setGeneratingAI(false);
    }
  };

  const [dispatchingTelegram, setDispatchingTelegram] = useState(false);
  const [telegramFeedback, setTelegramFeedback] = useState<string | null>(null);

  // Dispatch Weekly Audit & PDF Digest to Telegram
  const handleDispatchTelegramAudit = async () => {
    setDispatchingTelegram(true);
    setTelegramFeedback(null);
    try {
      let customChatId: string | undefined;
      try {
        const saved = localStorage.getItem("whynotupsc_telegram_chat_id");
        if (saved) customChatId = saved.trim();
      } catch {}

      const res = await fetch("/api/telegram/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "weekly_audit",
          chatId: customChatId,
          weeklySummary: weeklyReport,
          starredNotes: weeklyReport.weeklyNotesSummary,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTelegramFeedback("✓ Weekly Audit & Condensed Digest dispatched to Telegram!");
        if (data.data?.formattedText) {
          navigator.clipboard.writeText(data.data.formattedText);
        }
      } else {
        setTelegramFeedback(`⚠️ ${data.error?.message || "Failed to dispatch Telegram alert"}`);
      }
    } catch {
      setTelegramFeedback("⚠️ Dispatch failed. Please check network connection.");
    } finally {
      setDispatchingTelegram(false);
    }
  };

  // Copy Weekly Summary to Clipboard
  const handleCopyWeeklyReport = () => {
    const text = `📊 REDROOM Weekly UPSC Study Report (${formatWeekSpan(weeklyReport.startDate, weeklyReport.endDate)})
- Total Study Hours: ${weeklyReport.totalCompletedHours}h / ${weeklyReport.weeklyTargetHours}h target (${weeklyReport.hoursCompletionRate}%)
- Task Execution: ${weeklyReport.taskCompletionRate}% (${weeklyReport.totalTasksCompleted}/${weeklyReport.totalTasksScheduled} tasks)
- Active Study Days: ${weeklyReport.activeStudyDays}/7
- Consistency Score: ${weeklyReport.consistencyScore}%
- Mock Tests Attempted: ${weeklyReport.testsAttemptedInWeek.length} (Avg Score: ${weeklyReport.averageTestScoreInWeek})
- Timestamped Daily Notes Captured: ${weeklyReport.weeklyNotesCount}
${
  weeklyReport.aiMentorReview
    ? `\n🤖 AI Mentor Evaluation (Grade: ${weeklyReport.aiMentorReview.overallGrade}):\n${weeklyReport.aiMentorReview.executiveSummary}`
    : ""
}`;

    navigator.clipboard.writeText(text);
    alert("✓ Weekly report summary copied to clipboard!");
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#080510] text-white">
        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0714]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-sm text-purple-300 transition hover:text-white"
              >
                ← Command Centre
              </button>

            <span className="text-white/20">|</span>
            <div className="flex items-center gap-2">
              <span className="text-lg">📈</span>
              <span className="font-bold tracking-tight">Performance & Weekly Reports Engine</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => void triggerManualSync()}
              title="Click to sync data with cloud"
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                isSyncing
                  ? "border-pink-500/40 bg-pink-500/10 text-pink-300 animate-pulse"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{isSyncing ? "🔄" : "☁️"}</span>
              <span className="hidden sm:inline">
                {isSyncing ? "Syncing..." : lastSyncTime ? `Synced (${lastSyncTime})` : "Cloud Synced"}
              </span>
            </button>
            <button
              onClick={() => router.push("/study-plan")}
              className="hidden rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white sm:block"
            >
              📅 Study Plan
            </button>
            <button
              onClick={loadData}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold hover:bg-white/10"
            >
              ↻ Refresh Data
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* HERO & TAB SWITCHER */}
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-400">
              DIAGNOSTIC INTELLIGENCE & PROGRESS REVIEWS
            </p>
            <h1 className="mt-1 text-3xl font-black md:text-5xl">Performance & Reports</h1>
            <p className="mt-2 text-sm text-white/50">
              Statistical evaluation of test accuracy, score trends, and comprehensive weekly study reports.
            </p>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex rounded-2xl border border-white/10 bg-white/[0.04] p-1 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "analytics"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <span>📈</span> Test Series Analytics
            </button>
            <button
              onClick={() => setActiveTab("weekly_report")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "weekly_report"
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-900/50"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <span>📊</span> Weekly Study Reports
            </button>
          </div>
        </section>

        {/* NATIVE PWA PUSH NOTIFICATIONS */}
        <section className="mb-8">
          <PushNotificationManager />
        </section>

        {/* TAB 1: TEST SERIES ANALYTICS */}
        {activeTab === "analytics" && (
          <>
            {/* WEEKLY RADAR & VELOCITY AUDIT */}
            <section className="mb-8">
              <WeeklyRadarChart summary={weeklyReport} />
            </section>

            {/* STATS OVERVIEW */}
            <section className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="text-2xl">📝</span>
                <p className="mt-2 text-xs font-bold uppercase text-white/40">Total Tests Attempted</p>
                <p className="mt-1 text-3xl font-black">{analytics.totalTests}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="text-2xl">🎯</span>
                <p className="mt-2 text-xs font-bold uppercase text-white/40">Average Score</p>
                <p className="mt-1 text-3xl font-black text-purple-300">{analytics.averageScore}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="text-2xl">🏆</span>
                <p className="mt-2 text-xs font-bold uppercase text-white/40">Best Score</p>
                <p className="mt-1 text-3xl font-black text-green-400">{analytics.bestScore}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="text-2xl">📈</span>
                <p className="mt-2 text-xs font-bold uppercase text-white/40">Overall Accuracy</p>
                <p className="mt-1 text-3xl font-black text-pink-400">{analytics.overallAccuracy}%</p>
              </div>
            </section>

            {/* PERFORMANCE INSIGHTS */}
            <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-lg font-bold">Preparation Insights</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <span className="text-xs text-white/40 uppercase font-semibold">Recent Average (5 Tests)</span>
                  <p className="mt-1 text-2xl font-black text-white">{analytics.recentAverage}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">Moving average</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <span className="text-xs text-white/40 uppercase font-semibold">Recent Trend</span>
                  <p
                    className={`mt-1 text-2xl font-black ${
                      analytics.improvement >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {analytics.improvement >= 0 ? `+${analytics.improvement}` : analytics.improvement}
                  </p>
                  <p className="text-[11px] text-white/40 mt-0.5">vs previous 5 tests</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <span className="text-xs text-white/40 uppercase font-semibold">Score Consistency</span>
                  <p className="mt-1 text-2xl font-black text-purple-300">{analytics.consistencyScore}%</p>
                  <p className="text-[11px] text-white/40 mt-0.5">Standard deviation index</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <span className="text-xs text-white/40 uppercase font-semibold">Top Performing Test</span>
                  <p className="mt-1 text-base font-bold truncate text-white">
                    {analytics.strongestTest?.title || "—"}
                  </p>
                  <p className="text-[11px] text-green-400 mt-0.5 font-bold">
                    {analytics.strongestTest ? `${analytics.strongestTest.score} Marks` : "No attempts"}
                  </p>
                </div>
              </div>

              {/* CHRONOLOGICAL SCORE TREND VISUALIZER */}
              {analytics.chronologicalScores.length >= 2 && (
                <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-sm">Score Progression Curve</h3>
                      <p className="text-xs text-white/40">Chronological test attempts (oldest → newest)</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        analytics.improvement >= 0
                          ? "bg-green-500/20 text-green-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {analytics.improvement >= 0 ? "📈 Upward Momentum" : "⚠️ Needs Consolidation"}
                    </span>
                  </div>

                  <div className="flex h-36 items-end gap-2 overflow-x-auto pb-2">
                    {analytics.chronologicalScores.map((item, idx) => {
                      const maxPossible = Math.max(...analytics.chronologicalScores.map((s) => s.score), 10);
                      const heightPercent = Math.max(12, Math.min(100, (item.score / maxPossible) * 100));

                      return (
                        <div
                          key={item.id}
                          className="flex min-w-[32px] flex-1 flex-col items-center justify-end gap-1.5"
                          title={`${item.title}: ${item.score} marks`}
                        >
                          <span className="text-[10px] font-bold text-white/60">{item.score}</span>
                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-purple-700 to-fuchsia-400 transition-all duration-500 hover:brightness-125"
                            style={{ height: `${heightPercent}%` }}
                          />
                          <span className="text-[9px] text-white/30">#{idx + 1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            {/* DETAILED HISTORY TABLE */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Complete Test Log ({results.length})</h2>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-12 text-center text-white/40">
                  Loading test records...
                </div>
              ) : results.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">
                  <p className="text-xl font-bold">No test attempts recorded yet</p>
                  <button
                    onClick={() => router.push("/tests")}
                    className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold hover:bg-purple-500"
                  >
                    Go to Test Centre →
                  </button>
                </div>
              ) : (
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-sm">
                      <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-white/40">
                        <tr>
                          <th className="py-4 px-5 font-semibold">Test Title</th>
                          <th className="py-4 px-4 font-semibold">Date</th>
                          <th className="py-4 px-4 font-semibold">Score</th>
                          <th className="py-4 px-4 font-semibold">Correct</th>
                          <th className="py-4 px-4 font-semibold">Wrong</th>
                          <th className="py-4 px-4 font-semibold">Accuracy</th>
                          <th className="py-4 px-5 text-right font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {results.map((r, idx) => {
                          const acc = r.attempted > 0 ? Math.round((r.correct / r.attempted) * 100) : 0;
                          return (
                            <tr key={idx} className="hover:bg-white/[0.02] transition">
                              <td className="py-4 px-5 font-semibold text-white">{r.title}</td>
                              <td className="py-4 px-4 text-xs text-white/50">{formatDate(r.date, "short")}</td>
                              <td className="py-4 px-4 font-black text-purple-300">{r.score}</td>
                              <td className="py-4 px-4 text-green-400 font-bold">{r.correct}</td>
                              <td className="py-4 px-4 text-red-400 font-bold">{r.wrong}</td>
                              <td className="py-4 px-4 text-white/80">{acc}%</td>
                              <td className="py-4 px-5 text-right">
                                <button
                                  onClick={() => deleteResult(idx)}
                                  className="text-xs text-red-400 hover:text-red-300"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* TAB 2: WEEKLY STUDY & PERFORMANCE REPORTS */}
        {activeTab === "weekly_report" && (
          <div className="space-y-8">
            {/* WEEK SELECTOR CONTROLS */}
            <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setSelectedWeekDate(shiftDateKey(selectedWeekDate, -7))}
                  className="rounded-xl bg-white/5 px-4 py-2 text-xs font-bold hover:bg-white/10 transition"
                >
                  ← Previous Week
                </button>
                <button
                  onClick={() => setSelectedWeekDate(getDateKey())}
                  className="rounded-xl bg-purple-600/30 border border-purple-500/40 px-3.5 py-2 text-xs font-bold text-purple-200 hover:bg-purple-600/50 transition"
                >
                  Current Week
                </button>
                <button
                  onClick={() => setSelectedWeekDate(shiftDateKey(selectedWeekDate, 7))}
                  className="rounded-xl bg-white/5 px-4 py-2 text-xs font-bold hover:bg-white/10 transition"
                >
                  Next Week →
                </button>

                <button
                  onClick={handleDispatchTelegramAudit}
                  disabled={dispatchingTelegram}
                  className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition disabled:opacity-50 shadow-lg shadow-cyan-950/40"
                >
                  <span>🚀</span>
                  <span>{dispatchingTelegram ? "Dispatching..." : "Dispatch to Telegram"}</span>
                </button>

                <button
                  onClick={handleCopyWeeklyReport}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-white/80 hover:bg-white/10 transition"
                >
                  <span>📋</span>
                  <span>Copy Report</span>
                </button>
              </div>

              <div className="text-left md:text-right">
                <span className="text-[11px] font-bold uppercase tracking-widest text-pink-400">
                  Target Week Span
                </span>
                <h2 className="text-xl font-bold">
                  {formatWeekSpan(weeklyReport.startDate, weeklyReport.endDate)}
                </h2>
              </div>
            </section>

            {/* TELEGRAM FEEDBACK TOAST */}
            {telegramFeedback && (
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/40 p-4 text-xs font-semibold text-cyan-200 flex items-center justify-between">
                <span>{telegramFeedback}</span>
                <button onClick={() => setTelegramFeedback(null)} className="text-cyan-400 hover:text-white">✕</button>
              </div>
            )}

            {/* GS RADAR & VELOCITY AUDIT */}
            <section>
              <WeeklyRadarChart summary={weeklyReport} />
            </section>

            {/* WEEKLY METRICS OVERVIEW */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-950/40 to-[#140a24] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">⏳</span>
                  <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-300">
                    Target: {weeklyReport.weeklyTargetHours}h
                  </span>
                </div>
                <p className="mt-3 text-3xl font-black text-white">{weeklyReport.totalCompletedHours}h</p>
                <p className="text-xs font-semibold text-white/60">Study Hours Completed</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${weeklyReport.hoursCompletionRate}%` }}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">✅</span>
                  <span className="text-xs font-bold text-green-400">{weeklyReport.taskCompletionRate}%</span>
                </div>
                <p className="mt-3 text-3xl font-black text-white">
                  {weeklyReport.totalTasksCompleted}{" "}
                  <span className="text-base font-normal text-white/40">/ {weeklyReport.totalTasksScheduled}</span>
                </p>
                <p className="text-xs font-semibold text-white/60">Study Blocks Completed</p>
                <p className="mt-2 text-[11px] text-white/40">Scheduled targets executed</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🗓️</span>
                  <span className="text-xs font-bold text-purple-300">{weeklyReport.activeStudyDays}/7 Days</span>
                </div>
                <p className="mt-3 text-3xl font-black text-white">{weeklyReport.consistencyScore}%</p>
                <p className="text-xs font-semibold text-white/60">Weekly Consistency Index</p>
                <p className="mt-2 text-[11px] text-white/40">Variance stability rating</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">✍️</span>
                  <span className="text-xs font-bold text-pink-300">{weeklyReport.weeklyNotesCount} Notes</span>
                </div>
                <p className="mt-3 text-3xl font-black text-pink-400">{weeklyReport.testsAttemptedInWeek.length}</p>
                <p className="text-xs font-semibold text-white/60">Mock Tests Attempted</p>
                <p className="mt-2 text-[11px] text-white/40">
                  {weeklyReport.testsAttemptedInWeek.length > 0
                    ? `Avg: ${weeklyReport.averageTestScoreInWeek} Marks`
                    : "No test records this week"}
                </p>
              </div>
            </section>

            {/* DAY-BY-DAY HOURS BAR CHART & SUBJECT BREAKDOWN */}
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {/* DAY-BY-DAY CHART */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold">Daily Study Hours (Mon – Sun)</h3>
                    <p className="text-xs text-white/40">Completed hours vs planned hours per day</p>
                  </div>
                  <span className="text-xs font-bold text-purple-300">
                    {weeklyReport.totalCompletedHours} Hours Logged
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-3 h-48 items-end pt-6 pb-2 border-b border-white/10">
                  {weeklyReport.dailyBreakdown.map((day) => {
                    const maxH = Math.max(...weeklyReport.dailyBreakdown.map((d) => Math.max(d.completedHours, d.plannedHours)), 6.0);
                    const heightPercent = Math.max(10, Math.min(100, (day.completedHours / maxH) * 100));

                    return (
                      <div key={day.date} className="flex flex-col items-center justify-end h-full gap-2">
                        <span className="text-[10px] font-bold text-white/70">{day.completedHours}h</span>
                        <div
                          className={`w-full max-w-[36px] rounded-t-xl transition-all duration-500 ${
                            day.completedHours >= 5
                              ? "bg-gradient-to-t from-purple-700 to-pink-500"
                              : day.completedHours > 0
                              ? "bg-gradient-to-t from-purple-800 to-purple-500"
                              : "bg-white/10"
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                        <div className="text-center">
                          <span className="text-xs font-bold text-white/80">{day.dayName}</span>
                          <p className="text-[9px] text-white/40">{day.date.split("-")[2]}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* SUBJECT TIME ALLOCATIONS */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-base font-bold mb-1">Subject Time Allocation</h3>
                <p className="text-xs text-white/40 mb-4">Hours and share of preparation</p>

                {weeklyReport.subjectAllocations.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-xs text-white/40">
                    No completed study blocks logged this week.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {weeklyReport.subjectAllocations.map((sub) => (
                      <div key={sub.subject} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">{sub.subject}</span>
                          <span className="text-white/60">
                            {sub.hours}h <span className="text-pink-400 font-bold">({sub.percentage}%)</span>
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500"
                            style={{ width: `${sub.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* AI MENTOR WEEKLY REVIEW SECTION */}
            <section className="overflow-hidden rounded-3xl border border-purple-500/40 bg-gradient-to-br from-[#1b0a2e] via-[#2a0e44] to-[#12071f] p-6 md:p-8 shadow-2xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🤖</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black">AI Weekly Mentor Evaluation</h3>
                      {weeklyReport.aiMentorReview && (
                        <span className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-0.5 text-xs font-black uppercase text-white shadow-lg">
                          Grade: {weeklyReport.aiMentorReview.overallGrade}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60">
                      Holistic diagnostic evaluation across study velocity, mock accuracy, and consistency.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyWeeklyReport}
                    className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 transition"
                  >
                    📋 Copy Report
                  </button>
                  <button
                    onClick={handleGenerateAiWeeklyReview}
                    disabled={generatingAI}
                    className="rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition disabled:opacity-50"
                  >
                    {generatingAI ? "Analyzing Week..." : "✨ Generate AI Review"}
                  </button>
                </div>
              </div>

              {weeklyReport.aiMentorReview ? (
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                      Executive Summary
                    </h4>
                    <p className="mt-1 text-sm text-white/90 leading-relaxed">
                      {weeklyReport.aiMentorReview.executiveSummary}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.03] p-4">
                      <h5 className="text-xs font-bold uppercase text-green-400">✨ Key Strengths</h5>
                      <ul className="mt-2 space-y-1.5 text-xs text-white/80 list-disc list-inside">
                        {weeklyReport.aiMentorReview.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.03] p-4">
                      <h5 className="text-xs font-bold uppercase text-yellow-400">⚠️ Critical Gaps</h5>
                      <ul className="mt-2 space-y-1.5 text-xs text-white/80 list-disc list-inside">
                        {weeklyReport.aiMentorReview.criticalGaps.map((g, i) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-pink-500/20 bg-pink-500/[0.03] p-4">
                      <h5 className="text-xs font-bold uppercase text-pink-400">🎯 Next Week Tactics</h5>
                      <ul className="mt-2 space-y-1.5 text-xs text-white/80 list-disc list-inside">
                        {weeklyReport.aiMentorReview.strategicAdviceForNextWeek.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-white/40 border-t border-white/5 pt-3">
                    <span>Generated on: {formatDate(weeklyReport.aiMentorReview.generatedAt, "full")}</span>
                    {weeklyReport.aiMentorReview.modelUsed && (
                      <span>Engine: {weeklyReport.aiMentorReview.modelUsed}</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                  <p className="text-sm text-white/60">
                    No AI mentor review generated yet for this week.
                  </p>
                  <button
                    onClick={handleGenerateAiWeeklyReview}
                    disabled={generatingAI}
                    className="mt-3 rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-500 transition"
                  >
                    {generatingAI ? "Analyzing with AI..." : "Generate AI Weekly Mentor Review ✨"}
                  </button>
                </div>
              )}
            </section>

            {/* WEEKLY TIMESTAMPED NOTES & REFLECTIONS */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <span>✍️</span> Weekly Study Journal & Takeaways ({weeklyReport.weeklyNotesCount})
                  </h3>
                  <p className="text-xs text-white/40">
                    Chronological study logs captured during {formatWeekSpan(weeklyReport.startDate, weeklyReport.endDate)}
                  </p>
                </div>
                <button
                  onClick={() => router.push("/notes")}
                  className="text-xs font-semibold text-purple-300 hover:text-white transition"
                >
                  Notes Central Hub →
                </button>
              </div>

              {weeklyReport.weeklyNotesSummary.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-xs text-white/40">
                  No daily study notes were recorded in the study plan during this week.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {weeklyReport.weeklyNotesSummary.map((n) => (
                    <div key={n.id} className="rounded-2xl border border-white/5 bg-black/30 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-bold text-pink-300">
                          🕒 {n.time}
                        </span>
                        <span className="text-[10px] text-purple-300 font-semibold">
                          {formatDate(n.date, "short")}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{n.title}</h4>
                      <p className="line-clamp-3 text-[11px] text-white/60 leading-relaxed">
                        {n.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
    </AuthGuard>
  );
}

