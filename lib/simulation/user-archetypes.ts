import { UserProfile, TestResultRecord, DayPlan } from "@/lib/core/types";

export type UserArchetypeKey = "NEW_USER" | "ACTIVE_USER" | "STRUGGLING_USER" | "HIGH_PERFORMER";

export interface SimulatedUserState {
  archetype: UserArchetypeKey;
  profile: UserProfile;
  syllabusCompletedTopicIds: string[];
  testResults: TestResultRecord[];
  studyPlans: DayPlan[];
  revisionQueue: { topicId: string; topicName: string; subject: string; daysOverdue: number }[];
  expectedReadinessRange: [number, number];
}

export const USER_ARCHETYPES: Record<UserArchetypeKey, SimulatedUserState> = {
  NEW_USER: {
    archetype: "NEW_USER",
    profile: {
      id: "cadet_new_01",
      email: "new.aspirant@whynotupsc.com",
      fullName: "Ananya Sharma",
      targetYear: 2027,
      dailyGoalHours: 6.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    syllabusCompletedTopicIds: [],
    testResults: [],
    studyPlans: [],
    revisionQueue: [],
    expectedReadinessRange: [40, 55],
  },

  ACTIVE_USER: {
    archetype: "ACTIVE_USER",
    profile: {
      id: "cadet_active_02",
      email: "active.aspirant@whynotupsc.com",
      fullName: "Vikramaditya Roy",
      targetYear: 2027,
      dailyGoalHours: 6.0,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    syllabusCompletedTopicIds: [
      "polity-1", "polity-2", "polity-4", "polity-5", "polity-7", "polity-10",
      "hist-1", "hist-2", "hist-3", "hist-7", "hist-10", "hist-12",
      "eco-1", "eco-2", "eco-4", "eco-5",
      "env-1", "env-2", "env-4",
    ],
    testResults: [
      {
        id: "tr_act_1",
        title: "Polity Sectional Drill 1",
        subject: "Polity",
        score: 72,
        correct: 18,
        wrong: 6,
        skipped: 1,
        attempted: 24,
        total: 25,
        accuracy: 72,
        time_spent_seconds: 1500,
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: "tr_act_2",
        title: "Economy Macro Basics",
        subject: "Economy",
        score: 64,
        correct: 16,
        wrong: 8,
        skipped: 1,
        attempted: 24,
        total: 25,
        accuracy: 64,
        time_spent_seconds: 1600,
        date: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ],
    studyPlans: [
      {
        date: new Date().toISOString().slice(0, 10),
        tasks: [
          { id: "t1", subject: "Polity", title: "Revise Fundamental Rights", description: "Writs review", hours: 1.5, completed: true },
          { id: "t2", subject: "Economy", title: "Monetary Policy & Inflation", description: "Repo & CPI/WPI", hours: 2.0, completed: true },
        ],
      },
    ],
    revisionQueue: [
      { topicId: "polity-4", topicName: "Fundamental Rights", subject: "Polity", daysOverdue: 1 },
      { topicId: "eco-2", topicName: "Inflation & CPI/WPI", subject: "Economy", daysOverdue: 0 },
    ],
    expectedReadinessRange: [65, 76],
  },

  STRUGGLING_USER: {
    archetype: "STRUGGLING_USER",
    profile: {
      id: "cadet_struggling_03",
      email: "struggling.aspirant@whynotupsc.com",
      fullName: "Rohan Varma",
      targetYear: 2027,
      dailyGoalHours: 6.0,
      createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    syllabusCompletedTopicIds: ["polity-1", "hist-1", "eco-1"],
    testResults: [
      {
        id: "tr_str_1",
        title: "All-India Prelims Diagnostic",
        subject: "Polity",
        score: 42,
        correct: 11,
        wrong: 14,
        skipped: 0,
        attempted: 25,
        total: 25,
        accuracy: 42,
        time_spent_seconds: 1800,
        date: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
    ],
    studyPlans: [],
    revisionQueue: [
      { topicId: "polity-4", topicName: "Fundamental Rights", subject: "Polity", daysOverdue: 14 },
      { topicId: "eco-4", topicName: "Monetary Policy", subject: "Economy", daysOverdue: 9 },
      { topicId: "hist-2", topicName: "Buddhism & Jainism", subject: "History", daysOverdue: 11 },
    ],
    expectedReadinessRange: [42, 58],
  },

  HIGH_PERFORMER: {
    archetype: "HIGH_PERFORMER",
    profile: {
      id: "cadet_high_04",
      email: "ranker.aspirant@whynotupsc.com",
      fullName: "Kritika Deshmukh",
      targetYear: 2027,
      dailyGoalHours: 7.0,
      createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    syllabusCompletedTopicIds: [
      "polity-1", "polity-2", "polity-3", "polity-4", "polity-5", "polity-6", "polity-7", "polity-8", "polity-10", "polity-11", "polity-15", "polity-16",
      "hist-1", "hist-2", "hist-3", "hist-4", "hist-5", "hist-7", "hist-9", "hist-10", "hist-11", "hist-12", "hist-14",
      "eco-1", "eco-2", "eco-3", "eco-4", "eco-5", "eco-6", "eco-7", "eco-9",
      "env-1", "env-2", "env-3", "env-4", "env-5", "env-6", "env-7",
      "geo-1", "geo-2", "geo-3", "geo-4", "geo-5",
      "sci-1", "sci-2", "sci-3", "sci-4",
    ],
    testResults: [
      {
        id: "tr_hp_1",
        title: "All-India Full Length Mock 1",
        subject: "Full GS-1",
        score: 88,
        correct: 22,
        wrong: 3,
        skipped: 0,
        attempted: 25,
        total: 25,
        accuracy: 88,
        time_spent_seconds: 1400,
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ],
    studyPlans: [
      {
        date: new Date().toISOString().slice(0, 10),
        tasks: [
          { id: "hp_t1", subject: "Polity", title: "Mains GS-2 Answer Writing", description: "Governor's discretionary powers", hours: 2.5, completed: true },
          { id: "hp_t2", subject: "Economy", title: "Full Mock Analysis", description: "Review 3 trap errors", hours: 3.0, completed: true },
        ],
      },
    ],
    revisionQueue: [
      { topicId: "polity-15", topicName: "Constitutional Bodies", subject: "Polity", daysOverdue: 0 },
    ],
    expectedReadinessRange: [80, 94],
  },
};
