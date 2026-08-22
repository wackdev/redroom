import { DailyIntelligence, WeaknessInsight } from "../core/types";
import { getDateKey } from "../core/utils";
import { getUserRevisionQueue } from "../revision/revision-engine";
import { getAllPYQs, getUserPYQAttempts } from "../pyq/database";
import { analyzeUserMistakes } from "../pyq/mistake-engine";

/**
 * Aggregates all user signals to generate the Master REDROOM Intelligence state.
 */
export async function computeMasterIntelligence(userId?: string): Promise<DailyIntelligence> {
  const todayStr = getDateKey();

  // 1. Revision Signals
  const revisionItems = await getUserRevisionQueue(userId);
  const dueRevisions = revisionItems.filter((i) => i.nextReviewDate <= todayStr);
  const dueRevisionsCount = dueRevisions.length;

  // 2. PYQ & Mistake Signals
  const questions = await getAllPYQs();
  const attempts = userId ? await getUserPYQAttempts(userId) : [];
  const mistakeAnalysis = analyzeUserMistakes(attempts, questions);

  const weakTopics: WeaknessInsight[] =
    mistakeAnalysis.weakestTopics.length > 0
      ? mistakeAnalysis.weakestTopics
      : [
          {
            subject: "Polity",
            topic: "Fundamental Rights & Writs",
            weaknessScore: 65,
            accuracyPercent: 35,
            attemptCount: 3,
            recentMistakes: ["conceptual_error", "extreme_word_trap"],
            recommendation: "Focus on Article 14-32 exceptions and judicial review limitations.",
          },
        ];

  // 3. Recommended PYQ Subject (based on weak topics or due subjects)
  const recommendedPYQSubject = weakTopics[0]?.subject || "Polity";

  // 4. Backlog Warnings
  const backlogWarnings: string[] = [];
  if (dueRevisionsCount > 3) {
    backlogWarnings.push(
      `You have ${dueRevisionsCount} topics overdue in your Spaced Repetition queue.`
    );
  }
  if (mistakeAnalysis.wrongCount > mistakeAnalysis.correctCount && mistakeAnalysis.totalAttempts > 4) {
    backlogWarnings.push(
      "Your recent PYQ accuracy is under 50%. Review concept notes before attempting new tests."
    );
  }

  // 5. Determine #1 Highest Priority Task
  let topPriorityTask: DailyIntelligence["topPriorityTask"] = {
    title: "Daily Spaced Repetition Revision",
    description: `Complete ${dueRevisionsCount} due flashcards to prevent Ebbinghaus memory loss.`,
    subject: "Revision",
    reason: "Scheduled review due today based on SM-2 algorithm.",
    urgency: "Immediate",
    actionRoute: "/revision",
  };

  if (dueRevisionsCount === 0 && weakTopics.length > 0) {
    topPriorityTask = {
      title: `Consolidate Weak Topic: ${weakTopics[0].topic}`,
      description: weakTopics[0].recommendation,
      subject: weakTopics[0].subject,
      reason: `Accuracy is currently ${weakTopics[0].accuracyPercent}% in recent attempts.`,
      urgency: "High",
      actionRoute: "/pyqs",
    };
  } else if (dueRevisionsCount === 0 && weakTopics.length === 0) {
    topPriorityTask = {
      title: "Daily NextIAS Current Affairs & Quiz",
      description: "Read today's high-yield UPSC editorials and solve daily practice MCQs.",
      subject: "Current Affairs",
      reason: "Stay up-to-date with daily dynamic syllabus events.",
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
    overallSyllabusProgressPercent: 28,
    recentTestAccuracy: mistakeAnalysis.overallAccuracy || 72,
  };
}
