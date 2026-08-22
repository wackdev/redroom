import { DailyHoursBreakdown, DailyStudyNoteEntry, DayPlan, SubjectTimeAllocation, TestResultRecord, WeeklyReportSummary } from "../core/types";
import { calculateAccuracy, calculateVarianceAndConsistency, formatDate, formatWeekSpan, getDateKey, getWeekDateRange, safeArray, shiftDateKey } from "../core/utils";
import { queryAI } from "../ai/client";
import { buildWeeklyReportAnalysisPrompt, UPSC_MENTOR_SYSTEM_PROMPT } from "../ai/prompts";

/**
 * Computes deep weekly performance and study analytics for any given date's week.
 */
export function computeWeeklyReport(
  allPlans: Record<string, DayPlan>,
  testResults: TestResultRecord[] = [],
  referenceDate: string = getDateKey()
): WeeklyReportSummary {
  const { startDate, endDate, weekKey } = getWeekDateRange(referenceDate);

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dailyBreakdown: DailyHoursBreakdown[] = [];
  const subjectHoursMap: Record<string, { hours: number; tasksCompleted: number }> = {};
  const weeklyNotesSummary: DailyStudyNoteEntry[] = [];

  let totalPlannedHours = 0;
  let totalCompletedHours = 0;
  let totalTasksScheduled = 0;
  let totalTasksCompleted = 0;
  let activeStudyDays = 0;

  // Iterate across Monday to Sunday (7 days)
  for (let i = 0; i < 7; i++) {
    const currentDayKey = shiftDateKey(startDate, i);
    const dayPlan = allPlans[currentDayKey];

    const tasks = safeArray(dayPlan?.tasks);
    const dailyNotes = safeArray(dayPlan?.dailyNotes);

    let dayPlannedHours = 0;
    let dayCompletedHours = 0;
    let dayTasksCompleted = 0;

    tasks.forEach((t) => {
      const h = Number(t.hours) || 0;
      dayPlannedHours += h;
      totalTasksScheduled++;

      const sub = t.subject || "General Studies";
      if (!subjectHoursMap[sub]) {
        subjectHoursMap[sub] = { hours: 0, tasksCompleted: 0 };
      }

      if (t.completed) {
        dayCompletedHours += h;
        dayTasksCompleted++;
        totalTasksCompleted++;
        subjectHoursMap[sub].hours += h;
        subjectHoursMap[sub].tasksCompleted += 1;
      }
    });

    // Collect daily notes
    dailyNotes.forEach((n) => {
      weeklyNotesSummary.push(n);
    });

    if (dayCompletedHours > 0) {
      activeStudyDays++;
    }

    totalPlannedHours += dayPlannedHours;
    totalCompletedHours += dayCompletedHours;

    const completionRate = tasks.length > 0 ? Math.round((dayTasksCompleted / tasks.length) * 100) : 0;

    dailyBreakdown.push({
      date: currentDayKey,
      dayName: dayNames[i],
      plannedHours: Number(dayPlannedHours.toFixed(1)),
      completedHours: Number(dayCompletedHours.toFixed(1)),
      targetHours: dayPlan?.targetHours || 6.0,
      tasksScheduled: tasks.length,
      tasksCompleted: dayTasksCompleted,
      completionRate,
      hasNotes: dailyNotes.length > 0,
    });
  }

  // Calculate Subject Time Allocations
  const subjectAllocations: SubjectTimeAllocation[] = Object.entries(subjectHoursMap)
    .map(([subject, data]) => ({
      subject,
      hours: Number(data.hours.toFixed(1)),
      percentage: totalCompletedHours > 0 ? Math.round((data.hours / totalCompletedHours) * 100) : 0,
      tasksCompleted: data.tasksCompleted,
    }))
    .sort((a, b) => b.hours - a.hours);

  // Filter Test Results Attempted During This Week
  const startTs = new Date(`${startDate}T00:00:00`).getTime();
  const endTs = new Date(`${endDate}T23:59:59`).getTime();

  const testsAttemptedInWeek = safeArray(testResults).filter((r) => {
    try {
      const testTs = new Date(r.date).getTime();
      return testTs >= startTs && testTs <= endTs;
    } catch {
      return false;
    }
  });

  const totalScoreInWeek = testsAttemptedInWeek.reduce((sum, r) => sum + (Number(r.score) || 0), 0);
  const averageTestScoreInWeek =
    testsAttemptedInWeek.length > 0 ? Number((totalScoreInWeek / testsAttemptedInWeek.length).toFixed(1)) : 0;

  const totalCorrect = testsAttemptedInWeek.reduce((sum, r) => sum + (Number(r.correct) || 0), 0);
  const totalAttempted = testsAttemptedInWeek.reduce((sum, r) => sum + (Number(r.attempted) || 0), 0);
  const testAccuracyInWeek = calculateAccuracy(totalCorrect, totalAttempted);

  // Consistency Score across the 7 days
  const dailyHoursList = dailyBreakdown.map((d) => d.completedHours);
  const { consistencyScore } = calculateVarianceAndConsistency(dailyHoursList);

  const weeklyTargetHours = 42.0; // 6 hours/day * 7 days
  const hoursCompletionRate = Math.min(100, Math.round((totalCompletedHours / weeklyTargetHours) * 100));
  const taskCompletionRate =
    totalTasksScheduled > 0 ? Math.round((totalTasksCompleted / totalTasksScheduled) * 100) : 0;

  return {
    weekKey,
    startDate,
    endDate,
    totalPlannedHours: Number(totalPlannedHours.toFixed(1)),
    totalCompletedHours: Number(totalCompletedHours.toFixed(1)),
    weeklyTargetHours,
    hoursCompletionRate,
    totalTasksScheduled,
    totalTasksCompleted,
    taskCompletionRate,
    activeStudyDays,
    consistencyScore,
    dailyBreakdown,
    subjectAllocations,
    testsAttemptedInWeek,
    averageTestScoreInWeek,
    testAccuracyInWeek,
    weeklyNotesCount: weeklyNotesSummary.length,
    weeklyNotesSummary,
  };
}

/**
 * Generates an AI-Powered Diagnostic Mentor Evaluation for a Weekly Report.
 */
export async function generateAIWeeklyMentorReview(
  summary: WeeklyReportSummary
): Promise<NonNullable<WeeklyReportSummary["aiMentorReview"]>> {
  const weekSpan = formatWeekSpan(summary.startDate, summary.endDate);

  const subjectSummary =
    summary.subjectAllocations.length > 0
      ? summary.subjectAllocations.map((s) => `${s.subject}: ${s.hours}h (${s.percentage}%)`).join(", ")
      : "General Studies mixed blocks";

  const testsSummary =
    summary.testsAttemptedInWeek.length > 0
      ? `${summary.testsAttemptedInWeek.length} Mock Tests (Avg Score: ${summary.averageTestScoreInWeek}, Accuracy: ${summary.testAccuracyInWeek}%)`
      : "No mock tests recorded this week";

  const notesSummary =
    summary.weeklyNotesSummary.length > 0
      ? `${summary.weeklyNotesSummary.length} timestamped study notes recorded covering: ${summary.weeklyNotesSummary
          .slice(0, 4)
          .map((n) => `[${n.time}] ${n.title}`)
          .join("; ")}`
      : "No daily journal notes recorded";

  const prompt = buildWeeklyReportAnalysisPrompt({
    weekSpan,
    totalPlannedHours: summary.totalPlannedHours,
    totalCompletedHours: summary.totalCompletedHours,
    taskCompletionRate: summary.taskCompletionRate,
    subjectSummary,
    testsSummary,
    notesSummary,
  });

  const aiResult = await queryAI<{
    overallGrade: "A+" | "A" | "B+" | "B" | "C" | "Needs Attention";
    executiveSummary: string;
    strengths: string[];
    criticalGaps: string[];
    strategicAdviceForNextWeek: string[];
  }>({
    systemPrompt: UPSC_MENTOR_SYSTEM_PROMPT,
    prompt,
    temperature: 0.3,
    jsonExpected: true,
  });

  if (aiResult.success && aiResult.data?.data) {
    const data = aiResult.data.data;
    return {
      overallGrade: data.overallGrade || "A",
      executiveSummary:
        data.executiveSummary ||
        `Strong effort across the week with ${summary.totalCompletedHours}h completed. Continue maintaining daily study discipline.`,
      strengths: safeArray(data.strengths).length > 0 ? data.strengths : ["Consistent target scheduling"],
      criticalGaps: safeArray(data.criticalGaps).length > 0 ? data.criticalGaps : ["Increase mock test frequency"],
      strategicAdviceForNextWeek:
        safeArray(data.strategicAdviceForNextWeek).length > 0
          ? data.strategicAdviceForNextWeek
          : ["Prioritize weak subjects and spaced repetition"],
      generatedAt: new Date().toISOString(),
      modelUsed: aiResult.data.modelUsed,
    };
  }

  // Fallback heuristic evaluation
  let grade: "A+" | "A" | "B+" | "B" | "C" | "Needs Attention" = "B+";
  if (summary.totalCompletedHours >= 35 && summary.taskCompletionRate >= 80) grade = "A+";
  else if (summary.totalCompletedHours >= 28) grade = "A";
  else if (summary.totalCompletedHours >= 20) grade = "B+";
  else if (summary.totalCompletedHours >= 12) grade = "B";
  else grade = "Needs Attention";

  return {
    overallGrade: grade,
    executiveSummary: `For the week of ${weekSpan}, you logged ${summary.totalCompletedHours}h of focused preparation across ${summary.activeStudyDays} active days. Task completion rate was ${summary.taskCompletionRate}%.`,
    strengths: [
      `Logged ${summary.totalCompletedHours}h across core subjects.`,
      `Maintained ${summary.taskCompletionRate}% task execution discipline.`,
      `Captured ${summary.weeklyNotesCount} timestamped study notes and reflections.`,
    ],
    criticalGaps: [
      summary.totalCompletedHours < 30 ? "Study hours fell short of the 35h weekly benchmark." : "Ensure timed GS answer writing is integrated.",
      summary.testsAttemptedInWeek.length === 0 ? "No sectional mock tests attempted during this week." : "Review mistake categorization in recent test series.",
    ],
    strategicAdviceForNextWeek: [
      "Target minimum 5.5h daily focused study sessions.",
      "Attempt 1 full-length Sectional Mock test on Sunday.",
      "Clear all overdue spaced repetition flashcards in the Revision queue.",
    ],
    generatedAt: new Date().toISOString(),
    modelUsed: "redroom-heuristic-evaluator",
  };
}
