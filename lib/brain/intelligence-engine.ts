import { dexieDb } from "@/lib/db/dexie";
import { safeArray, getDateKey } from "@/lib/core/utils";
import {
  calculateExamReadiness,
  ReadinessScoreResult,
} from "./scoring/readiness-engine";
import { getAllPYQs, getUserPYQAttempts, analyzeUserMistakes } from "@/lib/study/pyq-engine";
import { getUserRevisionQueue } from "@/lib/revision/revision-engine";

// ============================================================================
// BRAIN DATA INTERFACES
// ============================================================================

export interface NextBestAction {
  title: string;
  topic: string;
  subject: string;
  reason: string;
  actionRoute: string;
  urgency: "CRITICAL" | "HIGH" | "MEDIUM";
  estimatedMinutes: number;
  badge: string;
}

export interface TopicWeaknessDetail {
  subject: string;
  topic: string;
  weaknessScore: number;
  accuracyPercent: number;
  attemptCount: number;
  reason: string;
  actionRoute: string;
}

export interface TopicStrengthDetail {
  subject: string;
  topic: string;
  masteryScore: number;
  accuracyPercent: number;
  attemptCount: number;
  reason: string;
}

export interface RevisionPrioritySummary {
  dueCount: number;
  overdueCount: number;
  retentionHealthScore: number;
  reason: string;
  topDueItems: Array<{
    id: string;
    topicId: string;
    subject: string;
    topicName: string;
    daysOverdue: number;
    retentionRiskPercent: number;
    reason: string;
  }>;
}

export interface BrainRecommendation {
  id: string;
  title: string;
  subject: string;
  reason: string;
  actionRoute: string;
  urgency: "CRITICAL" | "HIGH" | "MEDIUM";
  estimatedMinutes: number;
}

export interface BrainDailyMissionTask {
  id: string;
  order: number;
  title: string;
  description: string;
  reason: string;
  estimatedMinutes: number;
  subject: string;
  route: string;
  completed: boolean;
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
}

export interface BrainDashboardData {
  readiness: ReadinessScoreResult;
  todayMission: BrainDailyMissionTask[];
  nextBestAction: NextBestAction;
  weaknesses: TopicWeaknessDetail[];
  strengths: TopicStrengthDetail[];
  revision: RevisionPrioritySummary;
  recommendations: BrainRecommendation[];
  meta: {
    greeting: string;
    targetYear: number;
    daysToPrelims: number;
    studyStreak: number;
    totalStudyHours: number;
  };
}

// ============================================================================
// 1. WEAKNESS SCORE ENGINE
// ============================================================================

export async function calculateWeaknessScore(
  userId?: string
): Promise<{
  weaknesses: TopicWeaknessDetail[];
  strengths: TopicStrengthDetail[];
}> {
  try {
    const questions = await getAllPYQs();
    const attempts = userId ? await getUserPYQAttempts(userId) : [];
    const mistakeAnalysis = analyzeUserMistakes(attempts, questions);

    const weaknesses: TopicWeaknessDetail[] = [];
    const strengths: TopicStrengthDetail[] = [];

    if (
      Array.isArray(mistakeAnalysis.weakestTopics) &&
      mistakeAnalysis.weakestTopics.length > 0
    ) {
      mistakeAnalysis.weakestTopics.forEach((wt) => {
        weaknesses.push({
          subject: wt.subject,
          topic: wt.topic,
          weaknessScore: wt.weaknessScore,
          accuracyPercent: wt.accuracyPercent,
          attemptCount: wt.attemptCount,
          reason: `${wt.subject} accuracy is ${wt.accuracyPercent}% across ${wt.attemptCount} recent attempts. Recurrent trap: ${wt.recentMistakes[0] || "conceptual error"}.`,
          actionRoute: "/pyqs",
        });
      });
    }

    // Extract strengths from topics where user had >= 2 attempts and >= 70% accuracy
    if (Array.isArray(attempts) && attempts.length > 0) {
      const qMap = new Map<string, (typeof questions)[0]>();
      questions.forEach((q) => qMap.set(String(q.id), q));
      const topicStats = new Map<string, { subject: string; topic: string; correct: number; total: number }>();
      attempts.forEach((a) => {
        const q = qMap.get(String(a.pyqId));
        if (!q) return;
        const key = `${q.subject}::${q.topic}`;
        if (!topicStats.has(key)) {
          topicStats.set(key, { subject: q.subject, topic: q.topic, correct: 0, total: 0 });
        }
        const stat = topicStats.get(key)!;
        stat.total += 1;
        if (a.isCorrect) stat.correct += 1;
      });
      topicStats.forEach((stat) => {
        const acc = Math.round((stat.correct / stat.total) * 100);
        if (stat.total >= 2 && acc >= 70) {
          strengths.push({
            subject: stat.subject,
            topic: stat.topic,
            masteryScore: acc,
            accuracyPercent: acc,
            attemptCount: stat.total,
            reason: `Consistent accuracy (${acc}%) across ${stat.total} practice questions.`,
          });
        }
      });
    }

    return {
      weaknesses: safeArray(weaknesses),
      strengths: safeArray(strengths),
    };
  } catch (err) {
    console.warn("calculateWeaknessScore fallback:", err);
    return {
      weaknesses: [],
      strengths: [],
    };
  }
}

// ============================================================================
// 2. REVISION PRIORITY ENGINE
// ============================================================================

export async function calculateRevisionPriority(
  userId?: string
): Promise<RevisionPrioritySummary> {
  const todayStr = getDateKey();
  try {
    const revisionItems = await getUserRevisionQueue(userId);
    const safeItems = Array.isArray(revisionItems) ? revisionItems : [];

    const dueItems = safeItems.filter((i) => i.nextReviewDate <= todayStr);
    const overdueItems = safeItems.filter((i) => i.nextReviewDate < todayStr);

    const dueCount = dueItems.length;
    const overdueCount = overdueItems.length;

    const retentionHealthScore =
      safeItems.length > 0
        ? Math.max(
            15,
            Math.round(((safeItems.length - dueCount) / safeItems.length) * 100)
          )
        : 82;

    const reason =
      overdueCount > 0
        ? `You have ${overdueCount} overdue cards and ${dueCount} total cards scheduled for review today.`
        : dueCount > 0
        ? `You have ${dueCount} flashcards due for active recall consolidation today.`
        : "Spaced repetition queue is clear. Retention health is optimal at 100%.";

    const topDue = dueItems.slice(0, 5).map((item) => {
      const daysOverdue = Math.max(
        0,
        Math.ceil(
          (new Date(todayStr).getTime() -
            new Date(item.nextReviewDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );
      const risk = Math.min(95, 40 + daysOverdue * 15);
      return {
        id: String(item.id),
        topicId: item.topicId || "polity_fr",
        subject: item.subject || "Polity",
        topicName: item.topicName || "Fundamental Rights & Writs",
        daysOverdue,
        retentionRiskPercent: risk,
        reason:
          daysOverdue > 0
            ? `Review expired ${daysOverdue} days ago; retention decay risk is ${risk}%.`
            : "Review scheduled today according to SM-2 memory curve.",
      };
    });

    return {
      dueCount,
      overdueCount,
      retentionHealthScore,
      reason,
      topDueItems: safeArray(topDue),
    };
  } catch (err) {
    console.warn("calculateRevisionPriority fallback:", err);
    return {
      dueCount: 0,
      overdueCount: 0,
      retentionHealthScore: 100,
      reason: "Spaced repetition queue is currently empty.",
      topDueItems: [],
    };
  }
}

// ============================================================================
// 3. STUDY CONSISTENCY ENGINE
// ============================================================================

export async function calculateStudyConsistency(
  userId?: string
): Promise<{
  streakDays: number;
  consistencyScore: number;
  totalStudyMinutes: number;
  dailyAverageMinutes: number;
  reason: string;
}> {
  try {
    let streakDays = 0;
    let totalMinutes = 0;

    if (typeof window !== "undefined" || dexieDb) {
      const plans = await dexieDb.study_plans.toArray();
      if (Array.isArray(plans) && plans.length > 0) {
        totalMinutes = plans.reduce((sum, p) => {
          const taskMinutes = Array.isArray(p.tasks)
            ? p.tasks.reduce(
                (tSum, t) => tSum + (t.completed ? Math.round((t.hours || 1) * 60) : 0),
                0
              )
            : 0;
          return sum + (taskMinutes || ((p as any).completedMinutes || 60));
        }, 0);
        streakDays = Math.min(30, Math.max(1, plans.length));
      }
    }

    const consistencyScore = streakDays > 0 
      ? Math.min(100, Math.round(streakDays * 12 + (totalMinutes > 200 ? 40 : 20)))
      : 0;
    const dailyAverageMinutes = streakDays > 0 ? Math.round(totalMinutes / streakDays) : 0;

    const reason =
      streakDays >= 5
        ? `Exceptional ${streakDays}-day streak maintained! Daily average is ${Math.round(dailyAverageMinutes / 60)}h ${dailyAverageMinutes % 60}m.`
        : streakDays > 0
        ? `Active ${streakDays}-day streak. Target 4+ hours daily to achieve optimal Prelims readiness.`
        : "No study sessions recorded yet. Launch your first sprint in Study Sanctuary to start your streak.";

    return {
      streakDays,
      consistencyScore,
      totalStudyMinutes: totalMinutes,
      dailyAverageMinutes,
      reason,
    };
  } catch {
    return {
      streakDays: 0,
      consistencyScore: 0,
      totalStudyMinutes: 0,
      dailyAverageMinutes: 0,
      reason: "No study sessions recorded yet. Start your first sprint in Study Sanctuary.",
    };
  }
}

// ============================================================================
// 4. READINESS SCORE ENGINE
// ============================================================================

export async function calculateReadinessScore(
  userId?: string
): Promise<ReadinessScoreResult> {
  return calculateExamReadiness(userId);
}

// ============================================================================
// 5. NEXT BEST ACTION GENERATOR
// ============================================================================

export async function generateNextBestAction(
  userId?: string
): Promise<NextBestAction> {
  const readiness = await calculateReadinessScore(userId);

  if (readiness.isNewUser) {
    return {
      title: "Take 15-Question Baseline Diagnostic Mock",
      topic: "Multi-Subject Prelims Calibration",
      subject: "Diagnostic",
      reason: "Calibrate your baseline accuracy radar across GS subjects and detect key trap patterns.",
      actionRoute: "/tests",
      urgency: "CRITICAL",
      estimatedMinutes: 20,
      badge: "CALIBRATION DIRECTIVE",
    };
  }

  const revision = await calculateRevisionPriority(userId);
  const { weaknesses } = await calculateWeaknessScore(userId);

  // 1. If high retention risk / overdue cards exist -> prioritize revision
  if (revision.dueCount > 0 && revision.topDueItems.length > 0) {
    const topCard = revision.topDueItems[0];
    return {
      title: `Revise ${topCard.topicName}`,
      topic: topCard.topicName,
      subject: topCard.subject,
      reason:
        topCard.daysOverdue > 0
          ? `Retention risk is high (${topCard.retentionRiskPercent}%) — topic expired ${topCard.daysOverdue} days ago.`
          : `Scheduled active recall due today on ${topCard.subject} memory retention curve.`,
      actionRoute: "/revision",
      urgency: topCard.daysOverdue > 0 ? "CRITICAL" : "HIGH",
      estimatedMinutes: 25,
      badge: "RETENTION RECOVERY",
    };
  }

  // 2. If weak topics detected -> drill PYQs
  if (weaknesses.length > 0) {
    const topWeak = weaknesses[0];
    return {
      title: `Practice 20 ${topWeak.subject} MCQs: ${topWeak.topic}`,
      topic: topWeak.topic,
      subject: topWeak.subject,
      reason: topWeak.reason,
      actionRoute: topWeak.actionRoute || "/pyqs",
      urgency: "HIGH",
      estimatedMinutes: 35,
      badge: "WEAKNESS ELIMINATION",
    };
  }

  // 3. Fallback: Daily Editorial Analysis
  return {
    title: "Complete Today's Current Affairs Quiz",
    topic: "Daily Editorial & GS-2/GS-3 Mapping",
    subject: "Current Affairs",
    reason:
      "Daily editorials compiled for The Hindu and Indian Express with 5 AI questions.",
    actionRoute: "/current-affairs",
    urgency: "MEDIUM",
    estimatedMinutes: 30,
    badge: "DAILY MOMENTUM",
  };
}

// ============================================================================
// 6. DAILY MISSION GENERATOR
// ============================================================================

export async function generateDailyMission(
  userId?: string
): Promise<BrainDailyMissionTask[]> {
  const readiness = await calculateReadinessScore(userId);

  if (readiness.isNewUser) {
    return [
      {
        id: "starter-1",
        order: 1,
        title: "Take 15-Question Baseline Diagnostic Mock",
        description: "Test baseline accuracy on high-frequency Polity, History & Economy questions.",
        reason: "Initializes your 6-axis preparation readiness telemetry.",
        estimatedMinutes: 20,
        subject: "Diagnostic Mock",
        route: "/tests",
        completed: false,
        priority: "CRITICAL",
      },
      {
        id: "starter-2",
        order: 2,
        title: "Configure GS Syllabus Milestones",
        description: "Explore GS-1 to GS-4 micro-topics and mark completed milestones.",
        reason: "Establishes macro syllabus coverage tracking.",
        estimatedMinutes: 15,
        subject: "Syllabus Matrix",
        route: "/syllabus",
        completed: false,
        priority: "HIGH",
      },
      {
        id: "starter-3",
        order: 3,
        title: "Complete First 25-Minute Focus Sprint",
        description: "Launch your first distraction-free Pomodoro session in the Focus Sanctuary.",
        reason: "Establishes your daily study streak and deep work momentum.",
        estimatedMinutes: 25,
        subject: "Focus Sanctuary",
        route: "/study-plan",
        completed: false,
        priority: "HIGH",
      },
      {
        id: "starter-4",
        order: 4,
        title: "Explore Daily Current Affairs & Editorial Digest",
        description: "Review today's curated The Hindu & Indian Express key dimensions.",
        reason: "Introduces daily news integration with GS papers.",
        estimatedMinutes: 30,
        subject: "Current Affairs",
        route: "/current-affairs",
        completed: false,
        priority: "MEDIUM",
      },
    ];
  }

  const nextAction = await generateNextBestAction(userId);
  const { weaknesses } = await calculateWeaknessScore(userId);
  const targetSubject = weaknesses[0]?.subject || "Polity";

  const tasks: BrainDailyMissionTask[] = [
    {
      id: "task-1-next-action",
      order: 1,
      title: nextAction.title,
      description: nextAction.reason,
      reason: nextAction.reason,
      estimatedMinutes: nextAction.estimatedMinutes,
      subject: nextAction.subject,
      route: nextAction.actionRoute,
      completed: false,
      priority: nextAction.urgency,
    },
    {
      id: "task-2-pyq-elimination",
      order: 2,
      title: `Solve 25 ${targetSubject} PYQs (Trap Elimination Mode)`,
      description: `Target high-frequency ${targetSubject} questions with extreme-word and pairing trap breakdown.`,
      reason: `${targetSubject} is flagged as your primary high-yield improvement area for Prelims.`,
      estimatedMinutes: 50,
      subject: targetSubject,
      route: "/pyqs",
      completed: false,
      priority: "HIGH",
    },
    {
      id: "task-3-current-affairs",
      order: 3,
      title: "Read 5 Current Affairs Editorials & Take Speed Quiz",
      description:
        "Analyze The Indian Express & The Hindu dimensions with syllabus cross-referencing.",
      reason:
        "Daily current events synchronization prevents backlog before monthly compilation.",
      estimatedMinutes: 40,
      subject: "Current Affairs",
      route: "/current-affairs",
      completed: false,
      priority: "HIGH",
    },
    {
      id: "task-4-mistake-lab",
      order: 4,
      title: "Deconstruct Recent Errors in Mistake Lab",
      description:
        "Review incorrect options and tag specific mistake categories (conceptual vs false positive).",
      reason:
        "Resolving mistake anatomy reduces negative marking by up to 22 marks in Prelims.",
      estimatedMinutes: 30,
      subject: "Performance",
      route: "/performance",
      completed: false,
      priority: "MEDIUM",
    },
    {
      id: "task-5-mains-writing",
      order: 5,
      title: "Draft 1 Timed Mains GS Answer (150 Words)",
      description:
        "Construct structured answer with introduction, 3 dimensions, case laws / data points, and conclusion.",
      reason:
        "Daily answer drafting maintains writing velocity and articulation stamina.",
      estimatedMinutes: 35,
      subject: "Mains Answer Writing",
      route: "/mains-writing",
      completed: false,
      priority: "MEDIUM",
    },
  ];

  return safeArray(tasks);
}

// ============================================================================
// 7. COMPLETE BRAIN DASHBOARD DATA AGGREGATOR
// ============================================================================

export async function getBrainDashboardData(
  userId?: string
): Promise<BrainDashboardData> {
  const [
    readiness,
    todayMission,
    nextBestAction,
    { weaknesses, strengths },
    revision,
    consistency,
  ] = await Promise.all([
    calculateReadinessScore(userId),
    generateDailyMission(userId),
    generateNextBestAction(userId),
    calculateWeaknessScore(userId),
    calculateRevisionPriority(userId),
    calculateStudyConsistency(userId),
  ]);

  const recommendations: BrainRecommendation[] = readiness.isNewUser
    ? [
        {
          id: "rec-starter-1",
          title: "Complete 15-Question Diagnostic Assessment",
          subject: "Diagnostic",
          reason: "Calibrates baseline multi-subject accuracy and identifies immediate high-yield topics.",
          actionRoute: "/tests",
          urgency: "CRITICAL",
          estimatedMinutes: 20,
        },
        {
          id: "rec-starter-2",
          title: "Set Target Exam Year & Optional in DAF Dossier",
          subject: "Profile",
          reason: "Aligns all daily missions and revision algorithms to your exam timeline.",
          actionRoute: "/profile",
          urgency: "HIGH",
          estimatedMinutes: 10,
        },
        {
          id: "rec-starter-3",
          title: "Explore 3D Possibility Core & Visual Reality Labs",
          subject: "3D Visualizer",
          reason: "Familiarize with GIS spatial cartography and constitutional atlas simulators.",
          actionRoute: "/3d-zone",
          urgency: "MEDIUM",
          estimatedMinutes: 15,
        },
      ]
    : [
        {
          id: "rec-1",
          title: nextBestAction.title,
          subject: nextBestAction.subject,
          reason: nextBestAction.reason,
          actionRoute: nextBestAction.actionRoute,
          urgency: nextBestAction.urgency,
          estimatedMinutes: nextBestAction.estimatedMinutes,
        },
        {
          id: "rec-2",
          title: `Attempt 2024 Prelims Simulation Drill`,
          subject: "Mock Tests",
          reason:
            "Full test simulation verifies elimination speed and negative marking control under exam conditions.",
          actionRoute: "/tests",
          urgency: "HIGH",
          estimatedMinutes: 60,
        },
        {
          id: "rec-3",
          title: "Study 3D Constitutional Atlas: Directive Principles",
          subject: "Polity",
          reason:
            "Visual neural mapping reinforces Article 36-51 interconnections with Fundamental Rights.",
          actionRoute: "/3d-zone",
          urgency: "MEDIUM",
          estimatedMinutes: 25,
        },
      ];

  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";

  const targetYear = 2027;
  const examDate = new Date("2027-05-23T09:30:00+05:30").getTime();
  const now = new Date().getTime();
  const daysToPrelims = Math.max(
    0,
    Math.ceil((examDate - now) / (1000 * 60 * 60 * 24))
  );

  return {
    readiness,
    todayMission,
    nextBestAction,
    weaknesses,
    strengths,
    revision,
    recommendations,
    meta: {
      greeting,
      targetYear,
      daysToPrelims,
      studyStreak: consistency.streakDays,
      totalStudyHours: Math.round((consistency.totalStudyMinutes / 60) * 10) / 10,
    },
  };
}
