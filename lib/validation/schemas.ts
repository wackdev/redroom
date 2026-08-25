import { z } from "zod";

// ============================================================================
// 1. ACTIVITY EVENT SCHEMAS
// ============================================================================

export const ActivityEventTypeSchema = z.enum([
  "STUDY_SESSION_COMPLETED",
  "TOPIC_COMPLETED",
  "TOPIC_STUDIED",
  "PYQ_ATTEMPTED",
  "PYQ_CORRECT",
  "PYQ_INCORRECT",
  "MISTAKE_LOGGED",
  "TEST_COMPLETED",
  "REVISION_COMPLETED",
  "MAINS_ANSWER_SUBMITTED",
  "CURRENT_AFFAIRS_COMPLETED",
  "NOTE_CREATED",
]);

export const ActivityEventSchema = z.object({
  id: z.string().optional(),
  userId: z.string().default("cadet_current"),
  eventType: ActivityEventTypeSchema,
  payload: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.string().datetime().optional(),
});

// ============================================================================
// 2. STUDY PLAN & POMODORO SCHEMAS
// ============================================================================

export const StudySessionPayloadSchema = z.object({
  mode: z.enum(["Stopwatch", "Pomodoro", "Deep Work", "Countdown", "Custom"]).default("Pomodoro"),
  subject: z.string().default("General Studies"),
  topic: z.string().default("Topic Study"),
  goal: z.string().optional(),
  elapsedMinutes: z.number().min(0),
  distractionCount: z.number().min(0).default(0),
  productivityRating: z.number().min(1).max(5).default(4),
  completedAt: z.string().datetime().optional(),
});

// ============================================================================
// 3. PYQ & MISTAKE SCHEMAS
// ============================================================================

export const PYQAttemptPayloadSchema = z.object({
  questionId: z.union([z.string(), z.number()]),
  year: z.number().optional(),
  subject: z.string(),
  topic: z.string(),
  selectedOption: z.string(),
  correctOption: z.string(),
  isCorrect: z.boolean(),
  timeSpentSeconds: z.number().min(0).default(0),
  trapType: z
    .enum([
      "FACT_TRAP",
      "CONCEPT_TRAP",
      "ABSOLUTE_WORD_TRAP",
      "PAIRING_TRAP",
      "STATEMENT_TRAP",
      "ELIMINATION_TRAP",
      "NONE",
    ])
    .optional(),
  mistakeType: z
    .enum([
      "conceptual_error",
      "knowledge_gap",
      "careless_error",
      "time_pressure",
      "extreme_word_trap",
      "misread_question",
      "guessing",
    ])
    .optional(),
});

// ============================================================================
// 4. MOCK TEST RESULT SCHEMA
// ============================================================================

export const MockTestResultPayloadSchema = z.object({
  testId: z.string(),
  testTitle: z.string(),
  subject: z.string(),
  score: z.number(),
  totalMarks: z.number().default(100),
  accuracyPercent: z.number().min(0).max(100),
  timeTakenMinutes: z.number().min(0),
  totalQuestions: z.number().min(1),
  correctCount: z.number().min(0),
  wrongCount: z.number().min(0),
  unansweredCount: z.number().min(0),
  weakTopics: z.array(z.string()).default([]),
});

// ============================================================================
// 5. MAINS & ESSAY EVALUATION SCHEMAS
// ============================================================================

export const MainsAnswerEvaluationSchema = z.object({
  score: z.number().min(0),
  maxScore: z.number().min(10),
  wpm: z.number().min(0).default(0),
  wordCount: z.number().min(0),
  dimensions: z.array(
    z.object({
      name: z.string(),
      rating: z.string(),
      points: z.string(),
    })
  ).default([]),
  overallFeedback: z.string(),
  strengths: z.array(z.string()).default([]),
  improvementPoints: z.array(z.string()).default([]),
});

// ============================================================================
// 6. CURRENT AFFAIRS SCHEMAS
// ============================================================================

export const CurrentAffairsQuizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(
    z.object({
      id: z.string().optional(),
      key: z.string().optional(),
      text: z.string(),
    })
  ),
  answer: z.enum(["A", "B", "C", "D"]),
  explanation: z.string(),
});

export const CurrentAffairsArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  source: z.string(),
  sourceUrl: z.string().optional(),
  category: z.string(),
  gsPaper: z.enum(["GS-1", "GS-2", "GS-3", "GS-4"]).default("GS-2"),
  summary: z.string(),
  whyInNews: z.string().optional(),
  background: z.string().optional(),
  keyFacts: z.array(z.string()).default([]),
  prelimsPoints: z.array(z.string()).default([]),
  mainsAngle: z.string().optional(),
  pyqConnection: z.string().optional(),
  tags: z.array(z.string()).default([]),
  quiz: z.array(CurrentAffairsQuizQuestionSchema).optional(),
});
