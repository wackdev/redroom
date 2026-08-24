/**
 * REDROOM Core Type Definitions
 * Complete domain models for the UPSC Preparation Operating System
 */

// ============================================================================
// API & NETWORK ENVELOPES
// ============================================================================

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      meta?: Record<string, unknown>;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details?: unknown;
      };
    };

// ============================================================================
// USER & PROFILE
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  targetYear: number;
  optionalSubject?: string;
  dailyGoalHours: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// SYLLABUS
// ============================================================================

export type ExamStage = "Prelims" | "Mains" | "Both";

export type GSPaper = "GS-1" | "GS-2" | "GS-3" | "GS-4" | "Essay" | "CSAT" | "Optional";

export interface SyllabusSubtopic {
  id: string;
  name: string;
  importance: "High" | "Medium" | "Low";
}

export interface SyllabusTopic {
  id: string;
  name: string;
  subjectId: string;
  exam: ExamStage;
  paper?: GSPaper;
  importance: "High" | "Medium" | "Low";
  subtopics?: SyllabusSubtopic[];
  pyqFrequency?: number;
  trend?: "Rising" | "Stable" | "Low";
}

export interface SyllabusSubject {
  id: string;
  name: string;
  icon: string;
  description: string;
  topics: SyllabusTopic[];
}

export interface SyllabusProgressRecord {
  id?: string;
  userId: string;
  topicId: string;
  completed: boolean;
  completedAt?: string;
  confidenceRating?: 1 | 2 | 3 | 4 | 5;
}

// ============================================================================
// PYQ (PREVIOUS YEAR QUESTIONS)
// ============================================================================

export interface PYQOption {
  id: string;
  key?: string;
  text: string;
}

export interface PYQQuestion {
  id: number | string;
  year: number;
  subject: string;
  topic: string;
  subtopic?: string;
  paper?: "GS-1" | "CSAT";
  question: string;
  options: PYQOption[];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  important: boolean;
  conceptTags?: string[];
  mainsRelevance?: string;
  createdAt?: string;
}

export type MistakeType =
  | "conceptual_error"
  | "factual_memory_loss"
  | "misread_question"
  | "extreme_word_trap"
  | "time_pressure"
  | "wild_guess";

export interface PYQAttempt {
  id?: string;
  userId: string;
  pyqId: number | string;
  selectedOption: "A" | "B" | "C" | "D";
  isCorrect: boolean;
  timeSpentSeconds?: number;
  mistakeType?: MistakeType;
  notes?: string;
  attemptedAt: string;
}

export interface PYQMistake {
  id?: string;
  userId: string;
  pyqId: number | string;
  question: string;
  subject: string;
  topic: string;
  selectedOption: string;
  correctAnswer: string;
  mistakeType: MistakeType;
  explanation: string;
  reviewed: boolean;
  createdAt: string;
}

// ============================================================================
// MAINS PYQ (CIVIL SERVICES MAINS EXAMINATION)
// ============================================================================

export interface MainsModelAnswerFramework {
  introduction: string;
  dimensions: {
    heading: string;
    points: string[];
  }[];
  diagramOrFlowchart?: string;
  mapDiagram?: string;
  fullModelAnswer?: string;
  caseLawsOrArticlesOrCommittees?: string[];
  conclusion: string;
  keywords: string[];
}

export interface MainsPYQQuestion {
  id: string;
  year: number;
  paper: "GS-1" | "GS-2" | "GS-3" | "GS-4" | "Essay";
  subject: string;
  topic: string;
  subtopic?: string;
  question: string;
  marks: number;
  wordLimit: number;
  directive?: string;
  directiveGuidance?: string;
  framework?: MainsModelAnswerFramework;
  important?: boolean;
  syllabusTags?: string[];
  createdAt?: string;
}

export interface MainsAnswerDraft {
  questionId: string;
  draftText: string;
  wordCount: number;
  timeSpentSeconds: number;
  selfRating?: 1 | 2 | 3 | 4 | 5;
  savedAt: string;
  aiEvaluation?: {
    score: number;
    maxMarks: number;
    introFeedback: string;
    bodyFeedback: string;
    conclusionFeedback: string;
    valueAdditionTips: string[];
  };
}

// ============================================================================
// MOCK TESTS & SUBJECT MODULES
// ============================================================================

export interface StatementAnalysis {
  [statementKey: string]: string; // e.g. statement_1, statement_2, pair_1, assertion_analysis, reason_analysis
}

export interface DetailedExplanation {
  statement_analysis?: StatementAnalysis;
  elimination_technique?: string;
  concept_takeaway?: string;
  reference_sources?: string[];
}

export interface MockTestQuestion {
  id: number | string;
  question: string;
  options: PYQOption[];
  answer: "A" | "B" | "C" | "D" | string;
  explanation: string;
  detailedExplanation?: DetailedExplanation;
  subject?: string;
  topic?: string;
  syllabusSubtopic?: string;
  patternType?: string; // e.g. "Multi-Statement Analysis", "Pair Matching (New Pattern)", "Assertion and Reason"
  difficulty?: string; // e.g. "Moderate", "Moderate to High", "High"
  referenceSources?: string[];
}

export interface MockTest {
  id: number | string;
  title: string;
  subject: string;
  moduleNumber?: number;
  moduleTitle?: string;
  curriculum?: string;
  stage?: string;
  topic?: string;
  questions: number;
  duration: number; // in minutes
  description: string;
  marksPerQuestion: number;
  negativeMarking: number;
  difficulty?: string;
  questionList: MockTestQuestion[];
}

export interface TestResultRecord {
  id?: number | string;
  testId?: number | string;
  userId?: string;
  title: string;
  test_title?: string;
  subject?: string;
  moduleNumber?: number;
  score: number;
  maxScore?: number;
  correct: number;
  wrong: number;
  skipped: number;
  attempted: number;
  total: number;
  date: string;
  total_questions?: number;
  accuracy?: number;
  completed_at?: string;
  createdAt?: string;
  time_spent_seconds?: number;
  userAnswers?: Record<string | number, string>;
  subjectBreakdown?: Record<string, { correct: number; wrong: number; score: number }>;
}


// ============================================================================
// CURRENT AFFAIRS
// ============================================================================

export interface CurrentAffairsArticle {
  id: string;
  title: string;
  date: string;
  source: string;
  sourceUrl?: string;
  category: string;
  gsPaper?: GSPaper;
  summary: string;
  context?: string;
  whyInNews?: string;
  background?: string;
  keyFacts?: string[];
  prelimsPoints: string[];
  mainsAngle?: string;
  pyqConnection?: string;
  tags: string[];
  aiAnalysis?: string;
  rawContent?: string;
  quiz?: CurrentAffairsQuizQuestion[];
  imageUrl?: string;
  createdAt?: string;
}

export interface CurrentAffairsQuizQuestion {
  id: string;
  question: string;
  options: PYQOption[];
  answer: "A" | "B" | "C" | "D";
  explanation: string;
}

// ============================================================================
// SPACED REPETITION & REVISION
// ============================================================================

export type RevisionConfidence = 1 | 2 | 3 | 4 | 5; // 1 = Forget, 5 = Mastered

export interface RevisionItem {
  id: string;
  userId: string;
  topicId: string;
  topicName: string;
  subject: string;
  gsPaper?: GSPaper;
  upscImportance: "High" | "Medium" | "Low";
  repetitionCount: number;
  easeFactor: number; // SM-2 standard default 2.5
  intervalDays: number;
  lastReviewedAt?: string;
  nextReviewDate: string;
  urgencyScore: number; // calculated priority
  isOverdue: boolean;
  historySummary?: string;
}

export interface RevisionLog {
  id?: string;
  userId: string;
  revisionItemId: string;
  confidenceRating: RevisionConfidence;
  timeSpentMinutes?: number;
  reviewedAt: string;
}

// ============================================================================
// STUDY PLAN & DAILY SCHEDULER
// ============================================================================

export interface DailyStudyNoteEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "04:30 PM"
  title: string;
  content: string;
  subject?: string;
  tags?: string[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface StudyTask {
  id: string;
  subject: string;
  topicId?: string;
  title: string;
  description: string;
  hours: number;
  completed: boolean;
  completedAt?: string;
  taskType?: "Study" | "Revision" | "PYQ" | "Test" | "CurrentAffairs" | "Custom";
  priority?: "High" | "Medium" | "Low";
}

export interface DayPlan {
  date: string;
  tasks: StudyTask[];
  notes?: string;
  dailyNotes?: DailyStudyNoteEntry[];
  targetHours?: number;
}

// ============================================================================
// NOTES & AI SYNTHESIS
// ============================================================================

export interface NoteItem {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  title: string;
  content: string;
  isAiGenerated: boolean;
  keyKeywords: string[];
  mainsMnemonics?: string[];
  tags: string[];
  dateAssociated?: string; // Optional YYYY-MM-DD for day-sync
  timeCreated?: string; // e.g. "04:30 PM"
  updatedAt: string;
  createdAt: string;
}

// ============================================================================
// WEEKLY REPORTS & PERFORMANCE SUMMARY
// ============================================================================

export interface DailyHoursBreakdown {
  date: string; // YYYY-MM-DD
  dayName: string; // "Mon", "Tue", etc.
  plannedHours: number;
  completedHours: number;
  targetHours: number;
  tasksScheduled: number;
  tasksCompleted: number;
  completionRate: number;
  hasNotes: boolean;
}

export interface SubjectTimeAllocation {
  subject: string;
  hours: number;
  percentage: number;
  tasksCompleted: number;
}

export interface WeeklyReportSummary {
  weekKey: string; // e.g. "2026-W34" or "2026-08-17_2026-08-23"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalPlannedHours: number;
  totalCompletedHours: number;
  weeklyTargetHours: number;
  hoursCompletionRate: number;
  totalTasksScheduled: number;
  totalTasksCompleted: number;
  taskCompletionRate: number;
  activeStudyDays: number;
  consistencyScore: number;
  dailyBreakdown: DailyHoursBreakdown[];
  subjectAllocations: SubjectTimeAllocation[];
  testsAttemptedInWeek: TestResultRecord[];
  averageTestScoreInWeek: number;
  testAccuracyInWeek: number;
  weeklyNotesCount: number;
  weeklyNotesSummary: DailyStudyNoteEntry[];
  radarMetrics?: {
    gs1Hours: number;
    gs2Hours: number;
    gs3Hours: number;
    gs4Hours: number;
    csatHours: number;
    essayHours: number;
    targetHoursPerPaper: number;
    prelimsEliminationAccuracy: number;
    mainsAnswerSpeedWpm: number;
    avgMainsTimePer150W: number;
    avgMainsTimePer250W: number;
  };
  aiMentorReview?: {
    overallGrade: "A+" | "A" | "B+" | "B" | "C" | "Needs Attention";
    executiveSummary: string;
    strengths: string[];
    criticalGaps: string[];
    strategicAdviceForNextWeek: string[];
    generatedAt: string;
    modelUsed?: string;
  };
}

// ============================================================================
// AI CLIENT & PROMPTS
// ============================================================================

export type AIModelProvider = "huggingface" | "openrouter" | "pollinations" | "groq" | "gemini" | "openai_compatible" | "moon" | "mock_fallback" | "fallback";

export interface AIModelConfig {
  id: string;
  name: string;
  provider: AIModelProvider;
  endpoint?: string;
  modelParam: string;
  isPreferred?: boolean;
}

export interface AICompletionRequest {
  systemPrompt?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  jsonExpected?: boolean;
}

export interface AICompletionResponse<T = unknown> {
  text: string;
  data?: T;
  modelUsed: string;
  provider: AIModelProvider;
  latencyMs: number;
}

// ============================================================================
// REDROOM MASTER INTELLIGENCE
// ============================================================================

export interface WeaknessInsight {
  subject: string;
  topic: string;
  weaknessScore: number; // 0 - 100
  accuracyPercent: number;
  attemptCount: number;
  recentMistakes: MistakeType[];
  recommendation: string;
}

export interface DailyIntelligence {
  date: string;
  topPriorityTask: {
    title: string;
    description: string;
    subject: string;
    reason: string;
    urgency: "Immediate" | "High" | "Normal";
    actionRoute: string;
  };
  weakTopics: WeaknessInsight[];
  dueRevisionsCount: number;
  recommendedPYQSubject: string;
  dailyStudyHoursTarget: number;
  streakDays: number;
  backlogWarnings: string[];
  overallSyllabusProgressPercent: number;
  recentTestAccuracy: number;
}
