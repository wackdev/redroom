"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase-client";

type TestResult = {
  id: number;
  title: string | null;
  score: number;
  correct: number;
  wrong: number;
  skipped: number;
  attempted: number;
  total: number;
  date: string;
};

export default function PerformancePage() {
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | LOAD PERFORMANCE DATA
  |--------------------------------------------------------------------------
  */

  const loadPerformance = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setResults([]);
        return;
      }

      const { data, error } = await supabase
        .from("test_results")
        .select(
          "id,title,score,correct,wrong,skipped,attempted,total,date"
        )
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Performance load error:", error);
        return;
      }

      setResults((data as TestResult[]) || []);
    } catch (error) {
      console.error("Performance error:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadPerformance();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [loadPerformance]);

  /*
  |--------------------------------------------------------------------------
  | CALCULATE STATISTICS
  |--------------------------------------------------------------------------
  */

  const statistics = useMemo(() => {
    if (results.length === 0) {
      return {
        totalTests: 0,
        averageScore: 0,
        bestScore: 0,
        totalCorrect: 0,
        totalWrong: 0,
        totalSkipped: 0,
        totalAttempted: 0,
        totalQuestions: 0,
        accuracy: 0,
      };
    }

    const totalTests = results.length;

    const totalCorrect = results.reduce(
      (sum, item) => sum + Number(item.correct || 0),
      0
    );

    const totalWrong = results.reduce(
      (sum, item) => sum + Number(item.wrong || 0),
      0
    );

    const totalSkipped = results.reduce(
      (sum, item) => sum + Number(item.skipped || 0),
      0
    );

    const totalAttempted = results.reduce(
      (sum, item) => sum + Number(item.attempted || 0),
      0
    );

    const totalQuestions = results.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0
    );

    const totalScore = results.reduce(
      (sum, item) => sum + Number(item.score || 0),
      0
    );

    const averageScore =
      totalTests > 0 ? totalScore / totalTests : 0;

    const bestScore = Math.max(
      ...results.map((item) => Number(item.score || 0))
    );

    const accuracy =
      totalAttempted > 0
        ? (totalCorrect / totalAttempted) * 100
        : 0;

    return {
      totalTests,
      averageScore,
      bestScore,
      totalCorrect,
      totalWrong,
      totalSkipped,
      totalAttempted,
      totalQuestions,
      accuracy,
    };
  }, [results]);

  /*
  |--------------------------------------------------------------------------
  | TREND / INSIGHTS
  |--------------------------------------------------------------------------
  */

  const insights = useMemo(() => {
    if (results.length === 0) {
      return {
        recentAverage: 0,
        previousAverage: 0,
        improvement: 0,
        strongestTest: null as TestResult | null,
        weakestTest: null as TestResult | null,
        consistency: 0,
      };
    }

    const ordered = [...results].sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );

    const recent = ordered.slice(-5);
    const previous = ordered.slice(
      Math.max(0, ordered.length - 10),
      Math.max(0, ordered.length - 5)
    );

    const avg = (items: TestResult[]) =>
      items.length
        ? items.reduce(
            (sum, item) => sum + Number(item.score || 0),
            0
          ) / items.length
        : 0;

    const recentAverage = avg(recent);
    const previousAverage = avg(previous);

    const improvement =
      previous.length > 0
        ? recentAverage - previousAverage
        : 0;

    const scores = ordered.map((item) =>
      Number(item.score || 0)
    );

    const mean =
      scores.reduce((sum, value) => sum + value, 0) /
      scores.length;

    const variance =
      scores.reduce(
        (sum, value) =>
          sum + Math.pow(value - mean, 2),
        0
      ) / scores.length;

    const standardDeviation = Math.sqrt(variance);

    const consistency = Math.max(
      0,
      Math.min(
        100,
        100 - standardDeviation * 10
      )
    );

    return {
      recentAverage,
      previousAverage,
      improvement,
      strongestTest: [...ordered].sort(
        (a, b) =>
          Number(b.score || 0) -
          Number(a.score || 0)
      )[0] || null,
      weakestTest: [...ordered].sort(
        (a, b) =>
          Number(a.score || 0) -
          Number(b.score || 0)
      )[0] || null,
      consistency,
    };
  }, [results]);

  /*
  |--------------------------------------------------------------------------
  | DELETE RESULT
  |--------------------------------------------------------------------------
  */

  async function deleteResult(id: number) {
    const confirmed = window.confirm(
      "Delete this test result?"
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("test_results")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      setResults((previous) =>
        previous.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  function formatDate(date: string) {
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  }

  function getAccuracy(result: TestResult) {
    if (!result.attempted) return 0;

    return (
      (Number(result.correct) /
        Number(result.attempted)) *
      100
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-[#080510] text-white">

      <div className="mx-auto max-w-7xl px-5 py-8">

        {/* BACK */}

        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 text-sm text-purple-300 transition hover:text-white"
        >
          ← Back to Dashboard
        </button>

        {/* HEADER */}

        <section className="mb-8">

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-pink-400">
            UPSC PERFORMANCE
          </p>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div>
              <h1 className="text-4xl font-black md:text-5xl">
                Performance
              </h1>

              <p className="mt-3 text-white/60">
                Track your tests, accuracy, mistakes and
                improvement over time.
              </p>
            </div>

            <button
              onClick={loadPerformance}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              ↻ Refresh
            </button>

          </div>

        </section>

        {/* MAIN STATS */}

        <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">

          <StatCard
            icon="📝"
            label="Tests"
            value={statistics.totalTests}
          />

          <StatCard
            icon="🎯"
            label="Average Score"
            value={statistics.averageScore.toFixed(1)}
          />

          <StatCard
            icon="🏆"
            label="Best Score"
            value={statistics.bestScore.toFixed(1)}
          />

          <StatCard
            icon="📈"
            label="Accuracy"
            value={`${statistics.accuracy.toFixed(1)}%`}
          />

        </section>

        {/* PERFORMANCE INSIGHTS */}

        <section className="mb-8">

          <div className="mb-4">
            <h2 className="text-2xl font-bold">
              Performance Insights
            </h2>

            <p className="mt-1 text-sm text-white/50">
              Based on your saved test attempts.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

            <InsightCard
              icon="📈"
              label="Recent Average"
              value={insights.recentAverage.toFixed(1)}
              description="Average score across your latest 5 tests"
            />

            <InsightCard
              icon={insights.improvement >= 0 ? "🚀" : "⚠️"}
              label="Recent Trend"
              value={`${
                insights.improvement >= 0 ? "+" : ""
              }${insights.improvement.toFixed(1)}`}
              description="Latest 5 tests vs previous 5"
            />

            <InsightCard
              icon="🏅"
              label="Strongest Test"
              value={
                insights.strongestTest
                  ? Number(
                      insights.strongestTest.score
                    ).toFixed(1)
                  : "—"
              }
              description={
                insights.strongestTest?.title ||
                "No test data"
              }
            />

            <InsightCard
              icon="🎯"
              label="Consistency"
              value={`${insights.consistency.toFixed(0)}%`}
              description="Score consistency across attempts"
            />

          </div>

          {results.length >= 2 && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6">

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">
                    Score Trend
                  </h3>

                  <p className="mt-1 text-xs text-white/40">
                    Oldest → newest attempts
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    insights.improvement >= 0
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {insights.improvement >= 0
                    ? "Improving"
                    : "Needs Attention"}
                </span>
              </div>

              <div className="flex h-40 items-end gap-2 overflow-x-auto pb-2">

                {[...results]
                  .reverse()
                  .map((result, index) => {

                    const score = Math.max(
                      0,
                      Number(result.score || 0)
                    );

                    const maxScore = Math.max(
                      ...results.map((item) =>
                        Math.max(
                          1,
                          Number(item.score || 0)
                        )
                      )
                    );

                    const height = Math.max(
                      8,
                      (score / maxScore) * 100
                    );

                    return (
                      <div
                        key={result.id}
                        className="flex min-w-[34px] flex-1 flex-col items-center justify-end gap-2"
                        title={`${result.title || "Test"}: ${score.toFixed(1)}`}
                      >
                        <span className="text-[10px] text-white/50">
                          {score.toFixed(0)}
                        </span>

                        <div
                          className="w-full min-w-[18px] rounded-t-lg bg-gradient-to-t from-purple-700 to-fuchsia-400 transition-all"
                          style={{
                            height: `${height}%`,
                          }}
                        />

                        <span className="text-[9px] text-white/30">
                          {index + 1}
                        </span>
                      </div>
                    );
                  })}

              </div>

            </div>
          )}

        </section>

        {/* ANSWER BREAKDOWN */}

        <section className="mb-8">

          <h2 className="mb-4 text-2xl font-bold">
            Answer Analysis
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <AnalysisCard
              icon="✅"
              label="Correct Answers"
              value={statistics.totalCorrect}
              description="Questions answered correctly"
            />

            <AnalysisCard
              icon="❌"
              label="Wrong Answers"
              value={statistics.totalWrong}
              description="Questions answered incorrectly"
            />

            <AnalysisCard
              icon="⏭️"
              label="Skipped"
              value={statistics.totalSkipped}
              description="Questions not attempted"
            />

          </div>

        </section>

        {/* ACCURACY BAR */}

        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold">
                Overall Accuracy
              </h2>

              <p className="mt-1 text-sm text-white/50">
                Based on all attempted questions
              </p>
            </div>

            <span className="text-2xl font-black text-purple-300">
              {statistics.accuracy.toFixed(1)}%
            </span>

          </div>

          <div className="h-4 overflow-hidden rounded-full bg-white/10">

            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 transition-all duration-700"
              style={{
                width: `${Math.min(
                  statistics.accuracy,
                  100
                )}%`,
              }}
            />

          </div>

          <div className="mt-3 flex justify-between text-xs text-white/40">

            <span>
              {statistics.totalCorrect} correct
            </span>

            <span>
              {statistics.totalAttempted} attempted
            </span>

          </div>

        </section>

        {/* TEST HISTORY */}

        <section>

          <div className="mb-5">

            <h2 className="text-2xl font-bold">
              Test Performance
            </h2>

            <p className="mt-1 text-sm text-white/50">
              Your complete test history from Supabase.
            </p>

          </div>

          {loading ? (

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center text-white/50">
              Loading performance...
            </div>

          ) : results.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">

              <div className="text-5xl">
                📊
              </div>

              <h3 className="mt-4 text-xl font-bold">
                No test data yet
              </h3>

              <p className="mt-2 text-sm text-white/50">
                Complete a test from the Tests page and
                your performance will appear here.
              </p>

              <button
                onClick={() => router.push("/tests")}
                className="mt-5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3 font-bold"
              >
                Go to Tests →
              </button>

            </div>

          ) : (

            <div className="space-y-4">

              {results.map((result) => {

                const accuracy =
                  getAccuracy(result);

                return (
                  <div
                    key={result.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-purple-500/30"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      {/* TEST INFO */}

                      <div className="min-w-0 flex-1">

                        <h3 className="truncate text-lg font-bold">
                          {result.title ||
                            "UPSC Test"}
                        </h3>

                        <p className="mt-1 text-xs text-white/40">
                          {formatDate(result.date)}
                        </p>

                      </div>

                      {/* SCORE */}

                      <div className="flex items-center gap-6">

                        <div className="text-center">

                          <p className="text-xs uppercase tracking-wide text-white/40">
                            Score
                          </p>

                          <p className="mt-1 text-2xl font-black text-purple-300">
                            {Number(
                              result.score
                            ).toFixed(1)}
                          </p>

                        </div>

                        <div className="text-center">

                          <p className="text-xs uppercase tracking-wide text-white/40">
                            Accuracy
                          </p>

                          <p className="mt-1 text-lg font-bold">
                            {accuracy.toFixed(1)}%
                          </p>

                        </div>

                      </div>

                      {/* BREAKDOWN */}

                      <div className="grid grid-cols-4 gap-3 text-center">

                        <MiniStat
                          label="Correct"
                          value={result.correct}
                        />

                        <MiniStat
                          label="Wrong"
                          value={result.wrong}
                        />

                        <MiniStat
                          label="Skip"
                          value={result.skipped}
                        />

                        <MiniStat
                          label="Total"
                          value={result.total}
                        />

                      </div>

                      {/* DELETE */}

                      <button
                        onClick={() =>
                          deleteResult(result.id)
                        }
                        className="rounded-lg border border-red-500/20 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-purple-500/30">

      <div className="text-2xl">
        {icon}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/40">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black">
        {value}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| INSIGHT CARD
|--------------------------------------------------------------------------
*/

function InsightCard({
  icon,
  label,
  value,
  description,
}: {
  icon: string;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">

      <div className="flex items-start justify-between gap-3">
        <div className="text-2xl">
          {icon}
        </div>

        <span className="text-xs text-white/30">
          LIVE
        </span>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/40">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black">
        {value}
      </p>

      <p className="mt-2 line-clamp-2 text-xs text-white/40">
        {description}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| ANALYSIS CARD
|--------------------------------------------------------------------------
*/

function AnalysisCard({
  icon,
  label,
  value,
  description,
}: {
  icon: string;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-xl">
          {icon}
        </div>

        <div>

          <p className="font-bold">
            {label}
          </p>

          <p className="text-xs text-white/40">
            {description}
          </p>

        </div>

      </div>

      <p className="mt-5 text-4xl font-black">
        {value}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| MINI STAT
|--------------------------------------------------------------------------
*/

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>

      <p className="text-[10px] uppercase tracking-wide text-white/30">
        {label}
      </p>

      <p className="mt-1 font-bold">
        {value}
      </p>

    </div>
  );
}
