import { DailyStudyNoteEntry, DayPlan, StudyTask } from "../core/types";
import { getDateKey, shiftDateKey, safeArray, formatTime } from "../core/utils";

export const DEFAULT_DAILY_STUDY_BLOCKS: StudyTask[] = [
  {
    id: "task-core-study",
    subject: "Polity",
    title: "Core Subject Deep Study",
    description: "Read standard source (e.g., Laxmikanth / Spectrum) and take structured analytical notes.",
    hours: 2.5,
    completed: false,
    taskType: "Study",
    priority: "High",
  },
  {
    id: "task-revision",
    subject: "Revision",
    title: "Spaced Repetition & Flashcard Recall",
    description: "Review due topics in REDROOM Revision queue to beat the Ebbinghaus forgetting curve.",
    hours: 1.5,
    completed: false,
    taskType: "Revision",
    priority: "High",
  },
  {
    id: "task-pyq-practice",
    subject: "Polity",
    title: "PYQ Practice & Mistake Analysis",
    description: "Solve 15-20 Previous Year Questions and categorize error types.",
    hours: 1.0,
    completed: false,
    taskType: "PYQ",
    priority: "Medium",
  },
  {
    id: "task-current-affairs",
    subject: "Current Affairs",
    title: "Daily NextIAS Editorials & MCQs",
    description: "Read daily news analysis, review Prelims points, and solve daily current affairs quiz.",
    hours: 1.0,
    completed: false,
    taskType: "CurrentAffairs",
    priority: "Medium",
  },
];

/**
 * Creates a default day plan with unique IDs for a given date.
 */
export function createDefaultDayPlan(dateStr: string = getDateKey(), targetHours = 6.0): DayPlan {
  return {
    date: dateStr,
    targetHours,
    tasks: DEFAULT_DAILY_STUDY_BLOCKS.map((t) => ({
      ...t,
      id: `${dateStr}-${t.id}`,
    })),
    dailyNotes: [],
  };
}

/**
 * Auto-reschedules uncompleted tasks from previous days into today's plan.
 */
export function autoRescheduleMissedTasks(
  allPlans: Record<string, DayPlan>,
  todayStr: string = getDateKey()
): { updatedPlans: Record<string, DayPlan>; rescheduledCount: number } {
  const updatedPlans = { ...allPlans };
  let rescheduledCount = 0;

  const yesterdayStr = shiftDateKey(todayStr, -1);
  const yesterdayPlan = updatedPlans[yesterdayStr];

  if (!yesterdayPlan) {
    return { updatedPlans, rescheduledCount: 0 };
  }

  // Find missed tasks from yesterday
  const missedTasks = safeArray(yesterdayPlan.tasks).filter((t) => !t.completed);

  if (missedTasks.length === 0) {
    return { updatedPlans, rescheduledCount: 0 };
  }

  // Ensure today has a plan
  const todayPlan = updatedPlans[todayStr] || createDefaultDayPlan(todayStr);
  const existingTodayTaskTitles = new Set(todayPlan.tasks.map((t) => t.title.toLowerCase()));

  const tasksToMigrate: StudyTask[] = [];

  missedTasks.forEach((missed) => {
    if (!existingTodayTaskTitles.has(missed.title.toLowerCase())) {
      rescheduledCount++;
      tasksToMigrate.push({
        ...missed,
        id: `${todayStr}-rescheduled-${Date.now()}-${rescheduledCount}`,
        title: `[Rescheduled] ${missed.title}`,
        priority: "High",
        description: `Carried forward from ${yesterdayStr}. ${missed.description}`,
      });
    }
  });

  if (tasksToMigrate.length > 0) {
    updatedPlans[todayStr] = {
      ...todayPlan,
      tasks: [...tasksToMigrate, ...todayPlan.tasks],
    };
  }

  return { updatedPlans, rescheduledCount };
}

/**
 * Creates a new timestamped daily study note entry.
 */
export function createDailyStudyNote(
  date: string,
  title: string,
  content: string,
  subject = "Polity",
  tags: string[] = []
): DailyStudyNoteEntry {
  const now = new Date();
  return {
    id: `daily-note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date,
    time: formatTime(now),
    title: title.trim(),
    content: content.trim(),
    subject,
    tags,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Adds a timestamped note to a specific date's day plan.
 */
export function addDailyNoteToPlans(
  allPlans: Record<string, DayPlan>,
  dateStr: string,
  note: DailyStudyNoteEntry
): Record<string, DayPlan> {
  const plan = allPlans[dateStr] || createDefaultDayPlan(dateStr);
  const existingNotes = safeArray(plan.dailyNotes);

  return {
    ...allPlans,
    [dateStr]: {
      ...plan,
      dailyNotes: [note, ...existingNotes],
    },
  };
}

/**
 * Deletes a timestamped note from a specific date's day plan.
 */
export function deleteDailyNoteFromPlans(
  allPlans: Record<string, DayPlan>,
  dateStr: string,
  noteId: string
): Record<string, DayPlan> {
  const plan = allPlans[dateStr];
  if (!plan) return allPlans;

  return {
    ...allPlans,
    [dateStr]: {
      ...plan,
      dailyNotes: safeArray(plan.dailyNotes).filter((n) => n.id !== noteId),
    },
  };
}

/**
 * Extracts all daily study notes from all saved plans, sorted chronologically (newest first).
 */
export function getAllDailyNotes(allPlans: Record<string, DayPlan>): DailyStudyNoteEntry[] {
  const notes: DailyStudyNoteEntry[] = [];
  Object.values(allPlans).forEach((plan) => {
    safeArray(plan.dailyNotes).forEach((n) => {
      notes.push(n);
    });
  });

  return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Computes study statistics across all planned days.
 */
export function computeStudyPlanStats(allPlans: Record<string, DayPlan>): {
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  completedHours: number;
  completionRate: number;
  activeDaysCount: number;
  totalNotesCount: number;
} {
  let totalTasks = 0;
  let completedTasks = 0;
  let totalHours = 0;
  let completedHours = 0;
  let totalNotesCount = 0;

  const plans = Object.values(allPlans);
  plans.forEach((plan) => {
    safeArray(plan.tasks).forEach((task) => {
      totalTasks++;
      totalHours += task.hours || 0;
      if (task.completed) {
        completedTasks++;
        completedHours += task.hours || 0;
      }
    });
    totalNotesCount += safeArray(plan.dailyNotes).length;
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalTasks,
    completedTasks,
    totalHours: Number(totalHours.toFixed(1)),
    completedHours: Number(completedHours.toFixed(1)),
    completionRate,
    activeDaysCount: plans.length,
    totalNotesCount,
  };
}

