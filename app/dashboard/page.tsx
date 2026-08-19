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

export default function DashboardPage() {
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<TestResult[]>([]);

  /*
  |--------------------------------------------------------------------------
  | LOAD DASHBOARD DATA
  |--------------------------------------------------------------------------
  */

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email || "");

      const { data, error } = await supabase
        .from("test_results")
        .select(
          "id,title,score,correct,wrong,skipped,attempted,total,date"
        )
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error(
          "Dashboard test results error:",
          error
        );

        setResults([]);
        return;
      }

      setResults((data as TestResult[]) || []);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [loadDashboard]);

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const statistics = useMemo(() => {
    if (results.length === 0) {
      return {
        tests: 0,
        averageScore: 0,
        bestScore: 0,
        accuracy: 0,
        correct: 0,
        wrong: 0,
        skipped: 0,
        attempted: 0,
        questions: 0,
      };
    }

    const correct = results.reduce(
      (sum, item) => sum + Number(item.correct || 0),
      0
    );

    const wrong = results.reduce(
      (sum, item) => sum + Number(item.wrong || 0),
      0
    );

    const skipped = results.reduce(
      (sum, item) => sum + Number(item.skipped || 0),
      0
    );

    const attempted = results.reduce(
      (sum, item) => sum + Number(item.attempted || 0),
      0
    );

    const questions = results.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0
    );

    const totalScore = results.reduce(
      (sum, item) => sum + Number(item.score || 0),
      0
    );

    const averageScore =
      results.length > 0
        ? totalScore / results.length
        : 0;

    const bestScore = Math.max(
      ...results.map((item) => Number(item.score || 0))
    );

    const accuracy =
      attempted > 0
        ? (correct / attempted) * 100
        : 0;

    return {
      tests: results.length,
      averageScore,
      bestScore,
      accuracy,
      correct,
      wrong,
      skipped,
      attempted,
      questions,
    };
  }, [results]);

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  async function logout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  /*
  |--------------------------------------------------------------------------
  | FORMAT DATE
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

  /*
  |--------------------------------------------------------------------------
  | RECENT RESULTS
  |--------------------------------------------------------------------------
  */

  const recentResults = results.slice(0, 5);

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-[#080510] text-white">

      {/* HEADER */}

      <header className="border-b border-white/10 bg-[#0b0714]/80 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">

          <div>
            <p className="text-xl font-black">
              REDROOM
            </p>

            <p className="text-xs text-white/40">
              UPSC Preparation Platform
            </p>
          </div>

          <div className="flex items-center gap-3">

            <span className="hidden text-sm text-white/50 md:block">
              {email}
            </span>

            <button
              onClick={logout}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">

        {/* WELCOME */}

        <section className="mb-8">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-400">
            UPSC COMMAND CENTRE
          </p>

          <h1 className="mt-2 text-4xl font-black md:text-5xl">
            Dashboard
          </h1>

          <p className="mt-3 text-white/50">
            Your preparation progress at a glance.
          </p>

        </section>

        {/* MAIN ACTIONS */}

        <section className="mb-8 grid gap-5 md:grid-cols-3">

          <DashboardCard
            icon="📚"
            title="Syllabus"
            description="Track your UPSC syllabus topic by topic."
            button="Open Syllabus"
            onClick={() => router.push("/syllabus")}
          />

          <DashboardCard
            icon="📝"
            title="PYQ Command Centre"
            description="Practice and track Previous Year Questions."
            button="Open PYQs"
            onClick={() => router.push("/pyqs")}
          />

          <DashboardCard
            icon="🎯"
            title="Tests"
            description="Record your test results and scores."
            button="Take Tests"
            onClick={() => router.push("/tests")}
          />

        </section>

        {/* PERFORMANCE */}

        <section className="mb-8">

          <div className="mb-5 flex items-end justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-purple-400">
                LIVE DATA
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Test Performance
              </h2>
            </div>

            <button
              onClick={() =>
                router.push("/performance")
              }
              className="text-sm font-semibold text-purple-300 hover:text-white"
            >
              View Details →
            </button>

          </div>

          {/* STAT CARDS */}

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

            <StatCard
              icon="📝"
              label="Tests"
              value={statistics.tests}
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

          </div>

        </section>

        {/* ANSWER BREAKDOWN */}

        <section className="mb-8">

          <h2 className="mb-4 text-2xl font-bold">
            Answer Breakdown
          </h2>

          <div className="grid grid-cols-3 gap-4">

            <BreakdownCard
              icon="✅"
              label="Correct"
              value={statistics.correct}
            />

            <BreakdownCard
              icon="❌"
              label="Wrong"
              value={statistics.wrong}
            />

            <BreakdownCard
              icon="⏭️"
              label="Skipped"
              value={statistics.skipped}
            />

          </div>

        </section>

        {/* ACCURACY */}

        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold">
                Overall Accuracy
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Based on all attempted questions
              </p>
            </div>

            <p className="text-3xl font-black text-purple-300">
              {statistics.accuracy.toFixed(1)}%
            </p>

          </div>

          <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/10">

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
              {statistics.correct} correct
            </span>

            <span>
              {statistics.attempted} attempted
            </span>

          </div>

        </section>

        {/* RECENT TESTS */}

        <section className="mb-8">

          <div className="mb-5 flex items-end justify-between">

            <div>
              <h2 className="text-2xl font-bold">
                Recent Tests
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Your latest saved test results
              </p>
            </div>

            {results.length > 0 && (
              <button
                onClick={() =>
                  router.push("/tests")
                }
                className="text-sm text-purple-300 hover:text-white"
              >
                All Tests →
              </button>
            )}

          </div>

          {loading ? (

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center text-white/40">
              Loading dashboard...
            </div>

          ) : recentResults.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">

              <div className="text-5xl">
                📊
              </div>

              <h3 className="mt-4 text-xl font-bold">
                No tests attempted yet
              </h3>

              <p className="mt-2 text-sm text-white/40">
                Complete your first test and your
                performance will appear here.
              </p>

              <button
                onClick={() =>
                  router.push("/tests")
                }
                className="mt-5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3 font-bold"
              >
                Start Tracking →
              </button>

            </div>

          ) : (

            <div className="space-y-3">

              {recentResults.map((result) => {

                const accuracy =
                  result.attempted > 0
                    ? (result.correct /
                        result.attempted) *
                      100
                    : 0;

                return (
                  <div
                    key={result.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-purple-500/30"
                  >

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                      <div className="min-w-0">

                        <h3 className="truncate font-bold">
                          {result.title ||
                            "UPSC Test"}
                        </h3>

                        <p className="mt-1 text-xs text-white/40">
                          {formatDate(result.date)}
                        </p>

                      </div>

                      <div className="flex items-center gap-6">

                        <DashboardResultStat
                          label="Score"
                          value={Number(
                            result.score
                          ).toFixed(1)}
                        />

                        <DashboardResultStat
                          label="Accuracy"
                          value={`${accuracy.toFixed(
                            1
                          )}%`}
                        />

                        <DashboardResultStat
                          label="Correct"
                          value={result.correct}
                        />

                        <DashboardResultStat
                          label="Wrong"
                          value={result.wrong}
                        />

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </section>

        {/* QUICK NAVIGATION */}

        <section>

          <h2 className="mb-5 text-2xl font-bold">
            Quick Access
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <QuickButton
              icon="📖"
              title="Syllabus"
              onClick={() =>
                router.push("/syllabus")
              }
            />

            <QuickButton
              icon="❓"
              title="PYQs"
              onClick={() =>
                router.push("/pyqs")
              }
            />

            <QuickButton
              icon="📝"
              title="Tests"
              onClick={() =>
                router.push("/tests")
              }
            />

            <QuickButton
              icon="📈"
              title="Performance"
              onClick={() =>
                router.push("/performance")
              }
            />

          </div>

        </section>

      </div>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| DASHBOARD CARD
|--------------------------------------------------------------------------
*/

function DashboardCard({
  icon,
  title,
  description,
  button,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  button: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-purple-500/30 hover:bg-white/[0.06]">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-2xl">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-2 min-h-[40px] text-sm leading-6 text-white/50">
        {description}
      </p>

      <button
        onClick={onClick}
        className="mt-5 w-full rounded-xl bg-white/5 px-4 py-3 text-sm font-bold transition hover:bg-purple-600"
      >
        {button} →
      </button>

    </div>
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">

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
| BREAKDOWN CARD
|--------------------------------------------------------------------------
*/

function BreakdownCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">

      <div className="flex items-center gap-3">

        <span className="text-xl">
          {icon}
        </span>

        <span className="text-sm font-semibold text-white/50">
          {label}
        </span>

      </div>

      <p className="mt-4 text-3xl font-black">
        {value}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| RESULT STAT
|--------------------------------------------------------------------------
*/

function DashboardResultStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="text-center">

      <p className="text-[10px] uppercase tracking-wide text-white/30">
        {label}
      </p>

      <p className="mt-1 font-bold">
        {value}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| QUICK BUTTON
|--------------------------------------------------------------------------
*/

function QuickButton({
  icon,
  title,
  onClick,
}: {
  icon: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-purple-500/40 hover:bg-white/[0.07]"
    >

      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
        {icon}
      </span>

      <span className="font-bold">
        {title}
      </span>

      <span className="ml-auto text-white/30">
        →
      </span>

    </button>
  );
}
