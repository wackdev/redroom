import { safeArray } from "@/lib/core/utils";
import { calculateExamReadiness, ReadinessScoreResult } from "../scoring/readiness-engine";
import { computeMasterPriority } from "../priority/master-priority";

export interface DailyMissionTask {
  id: string;
  order: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  subject: string;
  route: string;
  completed: boolean;
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
}

export interface PersonalizedPlanResponse {
  date: string;
  estimatedTotalMinutes: number;
  missionTitle: string;
  readiness: ReadinessScoreResult;
  tasks: DailyMissionTask[];
  tacticalQuote: string;
}

/**
 * Answers the core question: "WHAT SHOULD I DO NEXT?"
 * Synthesizes active recall, mistake radar, syllabus status, and time budget.
 */
export async function generatePersonalizedMission(userId?: string): Promise<PersonalizedPlanResponse> {
  const masterIntel = await computeMasterPriority(userId);
  const readiness = await calculateExamReadiness(userId);

  const tasks: DailyMissionTask[] = [
    {
      id: "task-1-revision",
      order: 1,
      title: masterIntel.topPriorityTask.title,
      description: masterIntel.topPriorityTask.description,
      estimatedMinutes: 45,
      subject: masterIntel.topPriorityTask.subject,
      route: masterIntel.topPriorityTask.actionRoute,
      completed: false,
      priority: "CRITICAL",
    },
    {
      id: "task-2-pyq",
      order: 2,
      title: `Solve 25 ${masterIntel.recommendedPYQSubject} PYQs`,
      description: `Target high-frequency ${masterIntel.recommendedPYQSubject} questions with trap elimination mode.`,
      estimatedMinutes: 50,
      subject: masterIntel.recommendedPYQSubject,
      route: "/pyqs",
      completed: false,
      priority: "HIGH",
    },
    {
      id: "task-3-ca",
      order: 3,
      title: "Read 5 Current Affairs Editorials & Take Quiz",
      description: "Analyze The Indian Express & The Hindu GS-2/GS-3 dimensions.",
      estimatedMinutes: 40,
      subject: "Current Affairs",
      route: "/current-affairs",
      completed: false,
      priority: "HIGH",
    },
    {
      id: "task-4-mistakes",
      order: 4,
      title: "Analyze Mistake Anatomy in Mistake Lab",
      description: "Deconstruct yesterday's false positive options and extreme word traps.",
      estimatedMinutes: 30,
      subject: "Performance",
      route: "/performance",
      completed: false,
      priority: "MEDIUM",
    },
    {
      id: "task-5-mains",
      order: 5,
      title: "Draft 1 Mains GS Answer / QCAB Drill",
      description: "Write 150-word answer with introduction, 3 dimensions, data points & conclusion.",
      estimatedMinutes: 35,
      subject: "Mains Answer Writing",
      route: "/mains-writing",
      completed: false,
      priority: "MEDIUM",
    },
  ];

  const estimatedTotalMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

  return {
    date: new Date().toISOString().slice(0, 10),
    estimatedTotalMinutes,
    missionTitle: `Mission ${new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" })} — Targeted Consolidation`,
    readiness,
    tasks: safeArray(tasks),
    tacticalQuote: "Champions do not make fewer mistakes; they resolve their mistakes faster than the competition.",
  };
}
