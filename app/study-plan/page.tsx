"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DayPlan, StudyTask, DailyStudyNoteEntry } from "@/lib/core/types";
import {
  formatDate,
  getDateKey,
  shiftDateKey,
  safeArray,
  getWeekDatesList,
  getWeekDateRange,
  formatWeekSpan,
  formatTime,
} from "@/lib/core/utils";
import {
  createDefaultDayPlan,
  autoRescheduleMissedTasks,
  computeStudyPlanStats,
  createDailyStudyNote,
  addDailyNoteToPlans,
  deleteDailyNoteFromPlans,
} from "@/lib/study/study-plan-engine";
import { UPSC_SUBJECTS } from "@/lib/core/constants";
import {
  broadcastSyncChange,
  subscribeToSyncChanges,
  pushStateToCloud,
  useCloudSync,
} from "@/lib/sync/sync-engine";

const STORAGE_KEY = "redroom_study_plan";

export default function StudyPlanPage() {
  const router = useRouter();
  const { isSyncing, lastSyncTime, triggerManualSync } = useCloudSync();

  const todayStr = getDateKey();
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [plans, setPlans] = useState<Record<string, DayPlan>>({});
  const [loaded, setLoaded] = useState(false);

  // New task inputs
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubject, setNewTaskSubject] = useState("Polity");
  const [newTaskHours, setNewTaskHours] = useState("1.5");
  const [newTaskType, setNewTaskType] = useState<StudyTask["taskType"]>("Study");

  // New timestamped note inputs
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteSubject, setNewNoteSubject] = useState("Polity");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);

  // Load Saved Plans & Subscribe to Cross-Tab Changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setPlans(parsed);
        }
      }
    } catch (err) {
      console.warn("Could not load study plans:", err);
    } finally {
      setLoaded(true);
    }

    // Subscribe to cross-tab updates
    const unsubscribe = subscribeToSyncChanges((type) => {
      if (type === "study_plan" || type === "all") {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === "object") {
              setPlans(parsed);
            }
          }
        } catch {}
      }
    });

    return unsubscribe;
  }, []);

  // Save Plans & Broadcast Change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
      broadcastSyncChange("study_plan");
      void pushStateToCloud();
    } catch (err) {
      console.warn("Could not save study plans:", err);
    }
  }, [plans, loaded]);

  const currentPlan = useMemo(() => {
    return plans[selectedDate] || createDefaultDayPlan(selectedDate);
  }, [plans, selectedDate]);

  const saveCurrentPlan = useCallback(
    (plan: DayPlan) => {
      setPlans((prev) => ({
        ...prev,
        [selectedDate]: plan,
      }));
    },
    [selectedDate]
  );

  // Week Dates List
  const weekDays = useMemo(() => {
    return getWeekDatesList(selectedDate);
  }, [selectedDate]);

  const weekRange = useMemo(() => {
    return getWeekDateRange(selectedDate);
  }, [selectedDate]);

  // Toggle Task Completion
  const toggleTask = (taskId: string) => {
    const updatedTasks = safeArray(currentPlan.tasks).map((task) =>
      task.id === taskId
        ? {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined,
          }
        : task
    );
    saveCurrentPlan({ ...currentPlan, tasks: updatedTasks });
  };

  // Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const hours = parseFloat(newTaskHours) || 1.0;
    const task: StudyTask = {
      id: `${selectedDate}-${Date.now()}`,
      subject: newTaskSubject,
      title: newTaskTitle.trim(),
      description: "Custom targeted study block",
      hours: Math.max(0.5, hours),
      completed: false,
      taskType: newTaskType,
      priority: "Medium",
    };

    saveCurrentPlan({
      ...currentPlan,
      tasks: [...currentPlan.tasks, task],
    });

    setNewTaskTitle("");
    setNewTaskHours("1.5");
  };

  // Delete Task
  const deleteTask = (taskId: string) => {
    const updated = safeArray(currentPlan.tasks).filter((t) => t.id !== taskId);
    saveCurrentPlan({ ...currentPlan, tasks: updated });
  };

  // Add Timestamped Daily Study Note
  const handleAddDailyNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const newEntry = createDailyStudyNote(
      selectedDate,
      newNoteTitle.trim(),
      newNoteContent.trim(),
      newNoteSubject,
      [newNoteSubject, "Daily Journal"]
    );

    const updatedPlans = addDailyNoteToPlans(plans, selectedDate, newEntry);
    setPlans(updatedPlans);

    setNewNoteTitle("");
    setNewNoteContent("");
    setShowNoteForm(false);
  };

  // Delete Daily Study Note
  const handleDeleteDailyNote = (noteId: string) => {
    const updatedPlans = deleteDailyNoteFromPlans(plans, selectedDate, noteId);
    setPlans(updatedPlans);
  };

  // Auto Reschedule Missed Tasks
  const handleAutoReschedule = () => {
    const { updatedPlans, rescheduledCount } = autoRescheduleMissedTasks(plans, selectedDate);
    setPlans(updatedPlans);
    alert(
      rescheduledCount > 0
        ? `✓ Successfully rescheduled ${rescheduledCount} missed task(s) to ${formatDate(selectedDate, "short")}.`
        : "No missed tasks found to reschedule from yesterday."
    );
  };

  // Day Stats
  const completedTasks = safeArray(currentPlan.tasks).filter((t) => t.completed).length;
  const totalTasks = safeArray(currentPlan.tasks).length;
  const dayProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const plannedHours = safeArray(currentPlan.tasks).reduce((sum, t) => sum + (t.hours || 0), 0);
  const completedHours = safeArray(currentPlan.tasks)
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + (t.hours || 0), 0);

  const dailyNotesList = safeArray(currentPlan.dailyNotes);
  const overallStats = useMemo(() => computeStudyPlanStats(plans), [plans]);

  return (
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
              <span className="text-lg">📅</span>
              <span className="font-bold tracking-tight">Adaptive Study Planner & Journal</span>
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
              onClick={() => router.push("/performance")}
              className="hidden rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white sm:block"
            >
              📊 Weekly Reports
            </button>
            <button
              onClick={handleAutoReschedule}
              className="rounded-xl border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-xs font-bold text-purple-200 transition hover:bg-purple-500/20"
            >
              🔄 Auto-Reschedule Missed
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* HERO & QUICK NAVIGATION */}
        <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-400">
              SYNCHRONIZED DAILY SCHEDULE & NOTES
            </p>
            <h1 className="mt-1 text-3xl font-black md:text-4xl">Adaptive Study Planner</h1>
            <p className="mt-1 text-xs text-white/50">
              Week span: {formatWeekSpan(weekRange.startDate, weekRange.endDate)}
            </p>
          </div>

          {/* QUICK JUMP CONTROLS */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedDate(shiftDateKey(selectedDate, -7))}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
              title="Previous Week"
            >
              « Prev Week
            </button>
            <button
              onClick={() => setSelectedDate(shiftDateKey(todayStr, -1))}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                selectedDate === shiftDateKey(todayStr, -1)
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              Yesterday
            </button>
            <button
              onClick={() => setSelectedDate(todayStr)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                selectedDate === todayStr
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-900/50"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedDate(shiftDateKey(todayStr, 1))}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                selectedDate === shiftDateKey(todayStr, 1)
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              Tomorrow
            </button>
            <button
              onClick={() => setSelectedDate(shiftDateKey(selectedDate, 7))}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
              title="Next Week"
            >
              Next Week »
            </button>

            {/* NATIVE CALENDAR DATE PICKER */}
            <div className="relative flex items-center">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value);
                }}
                className="rounded-xl border border-purple-500/40 bg-[#170e2b] px-3 py-1.5 text-xs font-bold text-purple-200 outline-none hover:border-purple-400 focus:border-pink-500"
              />
            </div>
          </div>
        </section>

        {/* 7-DAY VISUAL WEEK STRIP */}
        <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dayPlan = plans[day.dateKey];
              const tasks = safeArray(dayPlan?.tasks);
              const doneCount = tasks.filter((t) => t.completed).length;
              const hasTasks = tasks.length > 0;
              const hasNotes = safeArray(dayPlan?.dailyNotes).length > 0;
              const isSelected = day.isSelected;
              const isToday = day.isToday;

              return (
                <button
                  key={day.dateKey}
                  onClick={() => setSelectedDate(day.dateKey)}
                  className={`flex flex-col items-center justify-between rounded-2xl p-3 transition-all ${
                    isSelected
                      ? "border-2 border-pink-500 bg-gradient-to-b from-purple-900/60 to-[#1e0a38] shadow-lg shadow-purple-950/60 scale-[1.02]"
                      : "border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20"
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase text-white/50">{day.dayName}</span>
                  <div className="my-1 flex h-8 w-8 items-center justify-center rounded-full font-black text-sm">
                    <span className={isToday ? "text-pink-400 font-extrabold" : "text-white"}>
                      {day.dayNumber}
                    </span>
                  </div>

                  {/* STATUS PILLS & DOTS */}
                  <div className="flex items-center gap-1 mt-1">
                    {hasTasks ? (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                          doneCount === tasks.length
                            ? "bg-green-500/20 text-green-300"
                            : doneCount > 0
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-white/10 text-white/40"
                        }`}
                      >
                        {doneCount}/{tasks.length}
                      </span>
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    )}
                    {hasNotes && (
                      <span className="h-1.5 w-1.5 rounded-full bg-pink-400" title="Notes recorded" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* PROGRESS & SUMMARY BANNER */}
        <section className="mb-8 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl bg-gradient-to-r from-purple-800 via-[#50137d] to-fuchsia-700 p-6 shadow-xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                    Daily Target Progress
                  </p>
                  {selectedDate === todayStr && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                      Today
                    </span>
                  )}
                </div>
                <p className="mt-1 text-3xl font-black md:text-4xl">{dayProgress}% Completed</p>
                <p className="mt-1 text-xs text-white/80">
                  {completedTasks} of {totalTasks} study targets finished for {formatDate(selectedDate, "full")}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-white/70">Study Hours</p>
                <p className="mt-1 text-3xl font-black">
                  {completedHours.toFixed(1)}{" "}
                  <span className="text-base font-normal text-white/70">/ {plannedHours.toFixed(1)}h</span>
                </p>
              </div>
            </div>
            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-black/30">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${dayProgress}%` }}
              />
            </div>
          </div>

          {/* TOTAL SYSTEM STATS */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
              <p className="text-xs text-white/40">Total Planned</p>
              <p className="mt-1 text-2xl font-black">{overallStats.totalHours}h</p>
              <p className="text-[10px] text-white/40">{overallStats.activeDaysCount} Days Configured</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
              <p className="text-xs text-white/40">Daily Notes Logged</p>
              <p className="mt-1 text-2xl font-black text-pink-400">{overallStats.totalNotesCount}</p>
              <p className="text-[10px] text-white/40">Across All Days</p>
            </div>
          </div>
        </section>

        {/* TWO-COLUMN GRID: STUDY BLOCKS & DAILY NOTES JOURNAL */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* LEFT COLUMN: SCHEDULED TARGETS */}
          <div className="space-y-6">
            {/* ADD CUSTOM TASK FORM */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300">
                + Add Study Target for {formatDate(selectedDate, "short")}
              </h3>
              <form onSubmit={handleAddTask} className="mt-3 grid gap-3 md:grid-cols-[1fr_130px_120px_90px_auto]">
                <input
                  type="text"
                  required
                  placeholder="e.g. Laxmikanth Ch 7 - Fundamental Rights..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-purple-500"
                />
                <select
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#160d29] px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-500"
                >
                  {UPSC_SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  value={newTaskType}
                  onChange={(e) => setNewTaskType(e.target.value as any)}
                  className="rounded-xl border border-white/10 bg-[#160d29] px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-500"
                >
                  <option value="Study">📖 Deep Study</option>
                  <option value="Revision">🔄 Revision</option>
                  <option value="PYQ">📝 PYQs</option>
                  <option value="CurrentAffairs">📰 Current Affairs</option>
                  <option value="Test">🎯 Test</option>
                </select>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={newTaskHours}
                  onChange={(e) => setNewTaskHours(e.target.value)}
                  placeholder="Hours"
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold transition hover:bg-purple-500"
                >
                  Add Target
                </button>
              </form>
            </section>

            {/* TASK LIST */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold">
                  Scheduled Study Blocks ({currentPlan.tasks.length})
                </h3>
                <span className="text-xs text-white/40">Check off as you complete</span>
              </div>

              <div className="space-y-2.5">
                {safeArray(currentPlan.tasks).map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
                      task.completed
                        ? "border-green-500/30 bg-green-500/[0.04]"
                        : "border-white/10 bg-white/[0.03] hover:border-purple-500/30"
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition ${
                        task.completed
                          ? "border-green-400 bg-green-500 text-white"
                          : "border-white/20 bg-white/5 hover:border-purple-400"
                      }`}
                    >
                      {task.completed && <span className="text-xs font-black">✓</span>}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                          {task.subject}
                        </span>
                        <span className="text-xs text-white/40">{task.hours}h</span>
                        {task.taskType && (
                          <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                            {task.taskType}
                          </span>
                        )}
                        {task.completedAt && (
                          <span className="text-[10px] text-green-400">
                            Done at {formatTime(task.completedAt)}
                          </span>
                        )}
                      </div>
                      <h4
                        className={`mt-1 text-sm font-bold ${
                          task.completed ? "text-white/40 line-through" : "text-white"
                        }`}
                      >
                        {task.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-white/40 leading-relaxed">{task.description}</p>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-lg p-2 text-white/20 hover:text-red-400 transition"
                      title="Remove task"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: DAILY STUDY NOTES & TIME LOGS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <span>✍️</span> Daily Study Notes & Time Logs
                </h3>
                <p className="text-xs text-white/40">
                  Notes for {formatDate(selectedDate, "short")} with automatic timestamps
                </p>
              </div>
              <button
                onClick={() => setShowNoteForm((prev) => !prev)}
                className="rounded-xl border border-pink-500/40 bg-pink-500/10 px-3.5 py-1.5 text-xs font-bold text-pink-300 hover:bg-pink-500/20 transition"
              >
                {showNoteForm ? "Cancel" : "+ Quick Note Entry"}
              </button>
            </div>

            {/* ADD DAILY NOTE FORM */}
            {showNoteForm && (
              <form
                onSubmit={handleAddDailyNote}
                className="rounded-3xl border border-pink-500/30 bg-[#160b24] p-5 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-pink-300">
                    🕒 Time Stamped: {formatTime(new Date())}
                  </span>
                  <span className="text-[11px] text-white/40">{formatDate(selectedDate, "short")}</span>
                </div>

                <div className="grid gap-2 sm:grid-cols-[1fr_130px]">
                  <input
                    type="text"
                    required
                    placeholder="Note headline / Key Takeaway..."
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="rounded-xl border border-white/10 bg-black/30 px-3.5 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:border-pink-500"
                  />
                  <select
                    value={newNoteSubject}
                    onChange={(e) => setNewNoteSubject(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#201138] px-3 py-2 text-xs font-semibold text-white outline-none focus:border-pink-500"
                  >
                    {UPSC_SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  required
                  rows={3}
                  placeholder="Record summary concepts, mnemonics, case laws, or reflection points..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white leading-relaxed outline-none placeholder:text-white/30 focus:border-pink-500"
                />

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowNoteForm(false)}
                    className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-1.5 text-xs font-bold text-white hover:opacity-90 transition"
                  >
                    Save Timestamped Note
                  </button>
                </div>
              </form>
            )}

            {/* NOTES LIST FOR ACTIVE DAY */}
            {dailyNotesList.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-white/40">
                <p className="text-sm">No study notes recorded for {formatDate(selectedDate, "short")}.</p>
                <p className="text-xs mt-1">
                  Click &ldquo;+ Quick Note Entry&rdquo; above to log concepts with automatic timestamps.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {dailyNotesList.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-pink-500/20 px-2.5 py-0.5 text-[10px] font-bold text-pink-300">
                          🕒 {n.time}
                        </span>
                        <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                          {n.subject || "General"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteDailyNote(n.id)}
                        className="text-xs text-white/30 hover:text-red-400 transition"
                        title="Delete note"
                      >
                        ✕
                      </button>
                    </div>

                    <h4 className="mt-2 text-sm font-bold text-white">{n.title}</h4>
                    <p className="mt-1 whitespace-pre-wrap text-xs text-white/70 leading-relaxed">
                      {n.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
