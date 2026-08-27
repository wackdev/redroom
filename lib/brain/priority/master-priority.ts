import { DailyIntelligence, WeaknessInsight } from "@/lib/core/types";
import { getDateKey } from "@/lib/core/utils";
import { getUserRevisionQueue } from "@/lib/revision/revision-engine";
import { getAllPYQs, getUserPYQAttempts, analyzeUserMistakes } from "@/lib/study/pyq-engine";

/**
 * Computes Master Priority calculations combining:
 * 1. SM-2 Spaced Repetition urgency
 * 2. PYQ Mistake Radar & Weak Subject frequency
 * 3. Daily Current Affairs requirement
 */
export async function computeMasterPriority(userId?: string): Promise<DailyIntelligence> {
  const todayStr = getDateKey();

  // 1. Revision Signals
  const revisionItems = await getUserRevisionQueue(userId);
  const dueRevisions = Array.isArray(revisionItems)
    ? revisionItems.filter((i) => i.nextReviewDate <= todayStr)
    : [];
  const dueRevisionsCount = dueRevisions.length;

  // 2. PYQ & Mistake Signals
  const questions = await getAllPYQs();
  const attempts = userId ? await getUserPYQAttempts(userId) : [];
  const mistakeAnalysis = analyzeUserMistakes(attempts, questions);

  const weakTopics: WeaknessInsight[] =
    Array.isArray(mistakeAnalysis.weakestTopics) ? mistakeAnalysis.weakestTopics : [];

  const recommendedPYQSubject = weakTopics[0]?.subject || "Polity";

  // 3. Backlog Warnings
  const backlogWarnings: string[] = [];
  if (dueRevisionsCount > 2) {
    backlogWarnings.push(
      `You have ${dueRevisionsCount} topics overdue in your Spaced Repetition queue.`
    );
  }
  if (mistakeAnalysis.wrongCount > mistakeAnalysis.correctCount && mistakeAnalysis.totalAttempts > 3) {
    backlogWarnings.push(
      "Your recent PYQ accuracy is under 50%. Review concept notes before attempting new mock tests."
    );
  }

  // 4. Primary Mission Directive Determination
  let topPriorityTask: DailyIntelligence["topPriorityTask"];

  if (dueRevisionsCount > 0) {
    topPriorityTask = {
      title: "Daily Spaced Active Recall",
      description: `Complete ${dueRevisionsCount} due flashcards to consolidate memory retention.`,
      subject: "Revision",
      reason: "Scheduled review due today based on SM-2 algorithm.",
      urgency: "Immediate",
      actionRoute: "/revision",
    };
  } else if (weakTopics.length > 0) {
    topPriorityTask = {
      title: `Consolidate Weak Topic: ${weakTopics[0].topic}`,
      description: weakTopics[0].recommendation,
      subject: weakTopics[0].subject,
      reason: `Accuracy is currently ${weakTopics[0].accuracyPercent}% in recent attempts.`,
      urgency: "High",
      actionRoute: "/pyqs",
    };
  } else {
    topPriorityTask = {
      title: "Daily Editorial Analysis & High-Yield Quiz",
      description: "Read today's UPSC editorial briefs and complete the 5-question speed quiz.",
      subject: "Current Affairs",
      reason: "Daily current events synchronization for GS-2 and GS-3.",
      urgency: "Normal",
      actionRoute: "/current-affairs",
    };
  }

  return {
    date: todayStr,
    topPriorityTask,
    weakTopics,
    dueRevisionsCount,
    recommendedPYQSubject,
    dailyStudyHoursTarget: 6.0,
    streakDays: 4,
    backlogWarnings,
    overallSyllabusProgressPercent: 34,
    recentTestAccuracy: mistakeAnalysis.overallAccuracy || 70,
  };
}
