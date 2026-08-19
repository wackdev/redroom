"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Task = {
  id: string;
  subject: string;
  title: string;
  description: string;
  hours: number;
  completed: boolean;
};

type DayPlan = {
  date: string;
  tasks: Task[];
};

const STORAGE_KEY = "redroom_study_plan";

const SUBJECTS = [
  "Polity",
  "History",
  "Geography",
  "Economy",
  "Environment",
  "Science & Technology",
  "CSAT",
  "Optional",
  "Current Affairs",
];

const DEFAULT_TASKS: Task[] = [
  {
    id: "polity-1",
    subject: "Polity",
    title: "Polity Revision",
    description: "Revise today's selected Polity topics.",
    hours: 2,
    completed: false,
  },
  {
    id: "history-1",
    subject: "History",
    title: "History Study",
    description: "Complete the planned History chapter/topic.",
    hours: 2,
    completed: false,
  },
  {
    id: "economy-1",
    subject: "Economy",
    title: "Economy",
    description: "Study and revise the scheduled Economy topic.",
    hours: 1.5,
    completed: false,
  },
  {
    id: "environment-1",
    subject: "Environment",
    title: "Environment",
    description: "Complete today's Environment target.",
    hours: 1,
    completed: false,
  },
  {
    id: "pyq-1",
    subject: "Current Affairs",
    title: "Daily PYQs",
    description: "Solve and analyse UPSC Previous Year Questions.",
    hours: 1,
    completed: false,
  },
  {
    id: "revision-1",
    subject: "Revision",
    title: "Daily Revision",
    description: "Revise everything studied today.",
    hours: 1,
    completed: false,
  },
];

function getDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function shiftDate(dateString: string, amount: number) {
  const date = new Date(`${dateString}T00:00:00`);

  date.setDate(date.getDate() + amount);

  return getDateKey(date);
}

function createDefaultPlan(date: string): DayPlan {
  return {
    date,
    tasks: DEFAULT_TASKS.map((task) => ({
      ...task,
      id: `${date}-${task.id}`,
    })),
  };
}

export default function StudyPlanPage() {
  const router = useRouter();

  const today = getDateKey(new Date());

  const [selectedDate, setSelectedDate] = useState(today);
  const [plans, setPlans] = useState<Record<string, DayPlan>>({});
  const [loaded, setLoaded] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubject, setNewTaskSubject] = useState("Polity");
  const [newTaskHours, setNewTaskHours] = useState("1");

  /*
  |--------------------------------------------------------------------------
  | LOAD SAVED DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
          const parsed = JSON.parse(saved);

          if (parsed && typeof parsed === "object") {
            setPlans(parsed);
          }
        }
      } catch (error) {
        console.error("Failed to load study plan:", error);
      } finally {
        setLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SAVE DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(plans)
      );
    } catch (error) {
      console.error("Failed to save study plan:", error);
    }
  }, [plans, loaded]);

  /*
  |--------------------------------------------------------------------------
  | CURRENT DAY
  |--------------------------------------------------------------------------
  */

  const currentPlan = useMemo(() => {
    return plans[selectedDate] || createDefaultPlan(selectedDate);
  }, [plans, selectedDate]);

  /*
  |--------------------------------------------------------------------------
  | SAVE CURRENT PLAN
  |--------------------------------------------------------------------------
  */

  function savePlan(plan: DayPlan) {
    setPlans((previous) => ({
      ...previous,
      [selectedDate]: plan,
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | TOGGLE TASK
  |--------------------------------------------------------------------------
  */

  function toggleTask(taskId: string) {
    const updatedTasks = currentPlan.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            completed: !task.completed,
          }
        : task
    );

    savePlan({
      ...currentPlan,
      tasks: updatedTasks,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | ADD TASK
  |--------------------------------------------------------------------------
  */

  function addTask() {
    const title = newTaskTitle.trim();

    if (!title) return;

    const hours = Number(newTaskHours);

    const task: Task = {
      id: `${selectedDate}-${Date.now()}`,
      subject: newTaskSubject,
      title,
      description: "Custom study task",
      hours: Number.isFinite(hours) && hours > 0 ? hours : 1,
      completed: false,
    };

    savePlan({
      ...currentPlan,
      tasks: [...currentPlan.tasks, task],
    });

    setNewTaskTitle("");
    setNewTaskHours("1");
  }

  /*
  |--------------------------------------------------------------------------
  | DELETE TASK
  |--------------------------------------------------------------------------
  */

  function deleteTask(taskId: string) {
    const updatedTasks = currentPlan.tasks.filter(
      (task) => task.id !== taskId
    );

    savePlan({
      ...currentPlan,
      tasks: updatedTasks,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | RESET DAY
  |--------------------------------------------------------------------------
  */

  function resetDay() {
    const confirmed = window.confirm(
      "Reset all tasks for this day?"
    );

    if (!confirmed) return;

    savePlan(createDefaultPlan(selectedDate));
  }

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const completedTasks = currentPlan.tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = currentPlan.tasks.length;

  const progress =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const plannedHours = currentPlan.tasks.reduce(
    (sum, task) => sum + task.hours,
    0
  );

  const completedHours = currentPlan.tasks
    .filter((task) => task.completed)
    .reduce((sum, task) => sum + task.hours, 0);

  /*
  |--------------------------------------------------------------------------
  | OVERALL STATS
  |--------------------------------------------------------------------------
  */

  const overallStats = useMemo(() => {
    const allPlans = Object.values(plans);

    let totalTasks = 0;
    let completed = 0;
    let totalHours = 0;
    let completedHours = 0;

    allPlans.forEach((plan) => {
      plan.tasks.forEach((task) => {
        totalTasks++;
        totalHours += task.hours;

        if (task.completed) {
          completed++;
          completedHours += task.hours;
        }
      });
    });

    return {
      totalTasks,
      completed,
      totalHours,
      completedHours,
      progress:
        totalTasks > 0
          ? Math.round((completed / totalTasks) * 100)
          : 0,
    };
  }, [plans]);

  /*
  |--------------------------------------------------------------------------
  | SUBJECT STATS
  |--------------------------------------------------------------------------
  */

  const subjectStats = useMemo(() => {
    const map: Record<
      string,
      {
        total: number;
        completed: number;
      }
    > = {};

    currentPlan.tasks.forEach((task) => {
      if (!map[task.subject]) {
        map[task.subject] = {
          total: 0,
          completed: 0,
        };
      }

      map[task.subject].total++;

      if (task.completed) {
        map[task.subject].completed++;
      }
    });

    return map;
  }, [currentPlan]);

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-[#080510] text-white">

      {/* HEADER */}

      <header className="border-b border-white/10 bg-[#0b0714]/90">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">

          <div>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-purple-300 hover:text-white"
            >
              ← Back to Dashboard
            </button>

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-pink-400">
              UPSC STUDY PLANNER
            </p>

            <h1 className="mt-1 text-3xl font-black">
              Study Plan
            </h1>
          </div>

          <button
            onClick={resetDay}
            className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10"
          >
            Reset Day
          </button>

        </div>

      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">

        {/* DATE NAVIGATION */}

        <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <button
              onClick={() =>
                setSelectedDate(
                  shiftDate(selectedDate, -1)
                )
              }
              className="rounded-xl bg-white/5 px-5 py-3 font-bold hover:bg-white/10"
            >
              ← Previous Day
            </button>

            <div className="text-center">

              <p className="text-xs font-semibold uppercase tracking-widest text-purple-300">
                Study Date
              </p>

              <h2 className="mt-1 text-xl font-bold">
                {formatDate(selectedDate)}
              </h2>

              {selectedDate === today && (
                <span className="mt-2 inline-block rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-300">
                  Today
                </span>
              )}

            </div>

            <button
              onClick={() =>
                setSelectedDate(
                  shiftDate(selectedDate, 1)
                )
              }
              className="rounded-xl bg-white/5 px-5 py-3 font-bold hover:bg-white/10"
            >
              Next Day →
            </button>

          </div>

        </section>

        {/* PROGRESS */}

        <section className="mb-6 rounded-2xl bg-gradient-to-r from-purple-700 to-fuchsia-600 p-6">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm font-semibold text-white/70">
                TODAY&apos;S STUDY PROGRESS
              </p>

              <p className="mt-1 text-4xl font-black">
                {progress}%
              </p>

              <p className="mt-1 text-sm text-white/70">
                {completedTasks} of {totalTasks} tasks completed
              </p>

            </div>

            <div className="text-right">

              <p className="text-sm text-white/70">
                Study Hours
              </p>

              <p className="text-3xl font-black">
                {completedHours.toFixed(1)}
                <span className="text-base font-normal text-white/60">
                  {" "}
                  / {plannedHours.toFixed(1)}h
                </span>
              </p>

            </div>

          </div>

          <div className="mt-6 h-4 overflow-hidden rounded-full bg-black/20">

            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </section>

        {/* QUICK STATS */}

        <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">

          <Stat
            label="Today's Tasks"
            value={totalTasks}
            icon="📋"
          />

          <Stat
            label="Completed"
            value={completedTasks}
            icon="✅"
          />

          <Stat
            label="Planned Hours"
            value={`${plannedHours.toFixed(1)}h`}
            icon="⏱️"
          />

          <Stat
            label="Completed Hours"
            value={`${completedHours.toFixed(1)}h`}
            icon="🔥"
          />

        </section>

        {/* ADD TASK */}

        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">

          <h2 className="text-xl font-bold">
            Add Study Task
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Add your own target for this day.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px_120px_auto]">

            <input
              value={newTaskTitle}
              onChange={(event) =>
                setNewTaskTitle(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  addTask();
                }
              }}
              placeholder="e.g. Fundamental Rights revision"
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-purple-500"
            />

            <select
              value={newTaskSubject}
              onChange={(event) =>
                setNewTaskSubject(event.target.value)
              }
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-purple-500"
            >
              {SUBJECTS.map((subject) => (
                <option
                  key={subject}
                  value={subject}
                  className="bg-[#10091d]"
                >
                  {subject}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="0.5"
              step="0.5"
              value={newTaskHours}
              onChange={(event) =>
                setNewTaskHours(event.target.value)
              }
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-purple-500"
              placeholder="Hours"
            />

            <button
              onClick={addTask}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3 font-bold transition hover:opacity-90"
            >
              + Add
            </button>

          </div>

        </section>

        {/* TASK LIST */}

        <section className="mb-8">

          <div className="mb-5">

            <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
              DAILY TARGETS
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Today&apos;s Tasks
            </h2>

          </div>

          <div className="space-y-3">

            {currentPlan.tasks.map((task) => (

              <div
                key={task.id}
                className={`rounded-2xl border p-5 transition ${
                  task.completed
                    ? "border-green-500/20 bg-green-500/[0.04]"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >

                <div className="flex items-start gap-4">

                  <button
                    onClick={() =>
                      toggleTask(task.id)
                    }
                    className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition ${
                      task.completed
                        ? "border-green-400 bg-green-500 text-white"
                        : "border-white/20 bg-white/5 hover:border-purple-400"
                    }`}
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-[10px] font-bold uppercase text-purple-300">
                        {task.subject}
                      </span>

                      <span className="text-xs text-white/30">
                        {task.hours}h
                      </span>

                    </div>

                    <h3
                      className={`mt-2 text-lg font-bold ${
                        task.completed
                          ? "text-white/40 line-through"
                          : ""
                      }`}
                    >
                      {task.title}
                    </h3>

                    <p className="mt-1 text-sm text-white/40">
                      {task.description}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      deleteTask(task.id)
                    }
                    className="text-sm text-white/20 hover:text-red-400"
                    title="Delete task"
                  >
                    ✕
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* SUBJECT PROGRESS */}

        <section className="mb-8">

          <h2 className="mb-5 text-2xl font-black">
            Subject Progress
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            {Object.entries(subjectStats).map(
              ([subject, stat]) => {

                const percent =
                  stat.total > 0
                    ? Math.round(
                        (stat.completed /
                          stat.total) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={subject}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                  >

                    <div className="flex items-center justify-between">

                      <span className="font-bold">
                        {subject}
                      </span>

                      <span className="text-sm text-white/40">
                        {stat.completed}/{stat.total}
                      </span>

                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500"
                        style={{
                          width: `${percent}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </section>

        {/* OVERALL */}

        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">

          <p className="text-xs font-bold uppercase tracking-widest text-pink-400">
            ALL SAVED DAYS
          </p>

          <h2 className="mt-1 text-2xl font-black">
            Overall Study Plan
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

            <Stat
              label="Total Tasks"
              value={overallStats.totalTasks}
              icon="📚"
            />

            <Stat
              label="Completed"
              value={overallStats.completed}
              icon="✅"
            />

            <Stat
              label="Study Hours"
              value={`${overallStats.completedHours.toFixed(
                1
              )}h`}
              icon="🔥"
            />

            <Stat
              label="Overall Progress"
              value={`${overallStats.progress}%`}
              icon="📈"
            />

          </div>

        </section>

      </div>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| STAT COMPONENT
|--------------------------------------------------------------------------
*/

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">

      <div className="text-2xl">
        {icon}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/40">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black">
        {value}
      </p>

    </div>
  );
}
