/**
 * REDROOM MOCK TEST SUBJECT MODULE ENGINE
 * Normalizes, validates, and parses subject-wise test modules for UPSC CSE preparation.
 */

import { MockTest, MockTestQuestion, PYQOption } from "@/lib/core/types";
import { safeArray } from "@/lib/core/utils";

export const LOCAL_STORAGE_CUSTOM_MODULES_KEY = "redroom_custom_mock_modules";

export interface RawModuleQuestion {
  id?: string | number;
  syllabus_subtopic?: string;
  pattern_type?: string;
  difficulty?: string;
  question: string;
  options: Record<string, string> | PYQOption[];
  correct_option?: string;
  answer?: string;
  explanation?:
    | string
    | {
        statement_analysis?: Record<string, string>;
        elimination_technique?: string;
        concept_takeaway?: string;
        reference_sources?: string[];
      };
  reference_sources?: string[];
}

export interface RawModulePayload {
  curriculum?: string;
  stage?: string;
  subject?: string;
  module_number?: number;
  module_title?: string;
  topic?: string;
  total_questions?: number;
  questions?: RawModuleQuestion[];
}

/**
 * Normalizes options format into PYQOption array [{ id: "A", text: "..." }]
 */
/**
 * Normalizes options format into PYQOption array [{ id: "A", text: "..." }]
 */
export function normalizeOptions(rawOpts: Record<string, string> | PYQOption[] | undefined): PYQOption[] {
  if (!rawOpts) return [];
  if (Array.isArray(rawOpts)) {
    return rawOpts.map((opt, i) => ({
      id: String(opt.id || (opt as any).key || String.fromCharCode(65 + i)).toUpperCase() as "A" | "B" | "C" | "D",
      text: String(opt.text || ""),
    }));
  }

  return Object.entries(rawOpts).map(([key, val]) => ({
    id: key.toUpperCase() as "A" | "B" | "C" | "D",
    text: String(val),
  }));
}

/**
 * Parses single RawModuleQuestion into a standard MockTestQuestion
 */
export function parseModuleQuestion(raw: RawModuleQuestion, index: number): MockTestQuestion {
  const options = normalizeOptions(raw.options);
  const answer = (raw.correct_option || raw.answer || (raw as any).correctAnswer || "A").toUpperCase();

  let explanationSummary = "";
  let detailedExp: MockTestQuestion["detailedExplanation"] | undefined = undefined;

  if (typeof raw.explanation === "string") {
    explanationSummary = raw.explanation;
  } else if (raw.explanation && typeof raw.explanation === "object") {
    detailedExp = {
      statement_analysis: (raw.explanation as any).statement_analysis,
      elimination_technique: (raw.explanation as any).elimination_technique,
      concept_takeaway: (raw.explanation as any).concept_takeaway,
      reference_sources: (raw.explanation as any).reference_sources || raw.reference_sources,
    };

    const parts: string[] = [];
    if (detailedExp.concept_takeaway) {
      parts.push(detailedExp.concept_takeaway);
    }
    if (detailedExp.elimination_technique) {
      parts.push(`Elimination Tip: ${detailedExp.elimination_technique}`);
    }
    explanationSummary = parts.join("\n\n") || "Comprehensive solution available in detailed review.";
  }

  if (!detailedExp && (raw as any).detailedExplanation) {
    detailedExp = (raw as any).detailedExplanation;
  }

  return {
    id: raw.id || index + 1,
    question: raw.question,
    options,
    answer,
    explanation: explanationSummary || (raw as any).explanation || "Detailed explanation available in review.",
    detailedExplanation: detailedExp,
    subject: (raw as any).subject,
    topic: (raw as any).topic,
    syllabusSubtopic: raw.syllabus_subtopic || (raw as any).syllabusSubtopic,
    patternType: raw.pattern_type || (raw as any).patternType,
    difficulty: raw.difficulty || "Moderate",
    referenceSources: raw.reference_sources || (raw as any).referenceSources,
  };
}

/**
 * Parses a raw module JSON string or object (such as user-provided modules) into a MockTest
 */
export function parseRawModulePayload(input: string | RawModulePayload | RawModulePayload[]): MockTest[] {
  let parsed: any;
  if (typeof input === "string") {
    try {
      parsed = JSON.parse(input);
    } catch {
      // If user pasted multiple JSON objects concatenated together without an array wrap
      try {
        const wrapped = `[${input.replace(/}\s*{/g, "},{")}]`;
        parsed = JSON.parse(wrapped);
      } catch {
        throw new Error("Invalid JSON format. Please ensure valid JSON object or array.");
      }
    }
  } else {
    parsed = input;
  }

  const rawModules: RawModulePayload[] = Array.isArray(parsed) ? parsed : [parsed];
  const results: MockTest[] = [];

  for (let mIdx = 0; mIdx < rawModules.length; mIdx++) {
    const raw = rawModules[mIdx];
    if (!raw) continue;

    // Support both raw JSON format (questions: [...]) and MockTest format (questionList: [...])
    let questionsList: RawModuleQuestion[] = [];
    if (Array.isArray(raw)) {
      questionsList = raw;
    } else if (Array.isArray(raw.questions)) {
      questionsList = raw.questions;
    } else if (Array.isArray((raw as any).questionList)) {
      questionsList = (raw as any).questionList;
    }

    if (questionsList.length === 0) continue;

    const parsedQuestions: MockTestQuestion[] = questionsList.map((q, qIdx) =>
      parseModuleQuestion(q, qIdx)
    );

    const subject = raw.subject || "General Studies";
    const moduleNumber = raw.module_number || (raw as any).moduleNumber || mIdx + 1;
    const moduleTitle = raw.module_title || (raw as any).moduleTitle || `Module ${moduleNumber}: ${raw.topic || subject}`;
    const duration = (raw as any).duration || Math.max(5, Math.ceil(parsedQuestions.length * 1.5));

    const subjCode = subject.toLowerCase().includes("polity")
      ? "POL"
      : subject.toLowerCase().includes("history")
      ? "HIST"
      : subject.toLowerCase().includes("geo")
      ? "GEO"
      : subject.toLowerCase().includes("econ")
      ? "ECON"
      : subject.replace(/[^A-Za-z]/g, "").slice(0, 4).toUpperCase();

    const testId = (raw as any).id || `MOD-${subjCode}-${String(moduleNumber).padStart(2, "0")}`;

    results.push({
      id: testId,
      title: (raw as any).title || `${subject} · Module ${String(moduleNumber).padStart(2, "0")}: ${moduleTitle}`,
      subject,
      moduleNumber,
      moduleTitle,
      curriculum: raw.curriculum || "UPSC Civil Services Examination (CSE)",
      stage: raw.stage || "Preliminary Examination (General Studies Paper-I)",
      topic: raw.topic || moduleTitle,
      questions: parsedQuestions.length,
      duration,
      description: (raw as any).description || raw.topic || moduleTitle,
      marksPerQuestion: (raw as any).marksPerQuestion || 2.0,
      negativeMarking: (raw as any).negativeMarking || 0.66,
      difficulty: parsedQuestions[0]?.difficulty || (raw as any).difficulty || "Moderate to High",
      questionList: parsedQuestions,
    });
  }

  return results;
}

/**
 * Color and styling badges for various subjects
 */
export function getSubjectTheme(subject: string) {
  const s = (subject || "").toLowerCase();
  if (s.includes("history") || s.includes("art") || s.includes("culture")) {
    return {
      badgeBg: "bg-amber-500/20",
      badgeText: "text-amber-300",
      badgeBorder: "border-amber-500/30",
      accentGlow: "from-amber-600/20 to-orange-600/5",
      accentColor: "text-amber-400",
      icon: "🏛️",
    };
  }
  if (s.includes("polity") || s.includes("constitution") || s.includes("governance")) {
    return {
      badgeBg: "bg-purple-500/20",
      badgeText: "text-purple-300",
      badgeBorder: "border-purple-500/30",
      accentGlow: "from-purple-600/20 to-indigo-600/5",
      accentColor: "text-purple-400",
      icon: "⚖️",
    };
  }
  if (s.includes("economy") || s.includes("economic") || s.includes("finance")) {
    return {
      badgeBg: "bg-emerald-500/20",
      badgeText: "text-emerald-300",
      badgeBorder: "border-emerald-500/30",
      accentGlow: "from-emerald-600/20 to-teal-600/5",
      accentColor: "text-emerald-400",
      icon: "📈",
    };
  }
  if (s.includes("geography") || s.includes("environment") || s.includes("ecology")) {
    return {
      badgeBg: "bg-teal-500/20",
      badgeText: "text-teal-300",
      badgeBorder: "border-teal-500/30",
      accentGlow: "from-teal-600/20 to-emerald-600/5",
      accentColor: "text-teal-400",
      icon: "🌍",
    };
  }
  if (s.includes("science") || s.includes("tech") || s.includes("defense")) {
    return {
      badgeBg: "bg-blue-500/20",
      badgeText: "text-blue-300",
      badgeBorder: "border-blue-500/30",
      accentGlow: "from-blue-600/20 to-cyan-600/5",
      accentColor: "text-blue-400",
      icon: "🚀",
    };
  }

  if (s.includes("csat") || s.includes("aptitude")) {
    return {
      badgeBg: "bg-pink-500/20",
      badgeText: "text-pink-300",
      badgeBorder: "border-pink-500/30",
      accentGlow: "from-pink-600/20 to-rose-600/5",
      accentColor: "text-pink-400",
      icon: "🧠",
    };
  }

  return {
    badgeBg: "bg-amber-500/20",
    badgeText: "text-amber-300",
    badgeBorder: "border-amber-500/30",
    accentGlow: "from-amber-600/20 to-yellow-600/5",
    accentColor: "text-amber-400",
    icon: "🎯",
  };
}

/**
 * Filter modules by Subject name with normalization
 */
export function filterModulesBySubject(modules: MockTest[], subject: string): MockTest[] {
  if (!subject || subject === "All Subjects") return modules;
  const s = subject.toLowerCase().trim();

  return safeArray(modules).filter((m) => {
    const mSub = (m.subject || "").toLowerCase();
    if (s.includes("polity")) return mSub.includes("polity");
    if (s.includes("history")) return mSub.includes("history");
    if (s.includes("economy") || s.includes("econ")) return mSub.includes("economy") || mSub.includes("econ");
    if (s.includes("geography") || s.includes("geo")) return mSub.includes("geography") || mSub.includes("geo");
    if (s.includes("environment") || s.includes("env")) return mSub.includes("environment") || mSub.includes("env");
    if (s.includes("science") || s.includes("tech")) return mSub.includes("science") || mSub.includes("tech");
    if (s.includes("csat")) return mSub.includes("csat");
    if (s.includes("full") || s.includes("prelims")) return mSub.includes("full") || mSub.includes("prelims");
    return mSub === s;
  });
}

/**
 * Extract distinct topics for a given subject from active modules
 */
export function getDistinctTopicsForSubject(modules: MockTest[], subject?: string): string[] {
  const filtered = subject && subject !== "All Subjects" ? filterModulesBySubject(modules, subject) : modules;
  const topicSet = new Set<string>();

  for (const m of safeArray(filtered)) {
    if (m.topic) topicSet.add(m.topic);
    for (const q of safeArray(m.questionList)) {
      if (q.syllabusSubtopic) topicSet.add(q.syllabusSubtopic);
    }
  }

  return Array.from(topicSet).sort();
}

/**
 * Subject-wise counts and metrics generator
 */
export interface SubjectStats {
  subject: string;
  totalModules: number;
  totalQuestions: number;
  totalDurationMins: number;
  topics: string[];
}

export function computeSubjectBreakdown(modules: MockTest[]): Record<string, SubjectStats> {
  const breakdown: Record<string, SubjectStats> = {
    Polity: { subject: "Polity", totalModules: 0, totalQuestions: 0, totalDurationMins: 0, topics: [] },
    History: { subject: "History", totalModules: 0, totalQuestions: 0, totalDurationMins: 0, topics: [] },
    Economy: { subject: "Economy", totalModules: 0, totalQuestions: 0, totalDurationMins: 0, topics: [] },
    Geography: { subject: "Geography", totalModules: 0, totalQuestions: 0, totalDurationMins: 0, topics: [] },
    Environment: { subject: "Environment", totalModules: 0, totalQuestions: 0, totalDurationMins: 0, topics: [] },
    "Science & Tech": { subject: "Science & Tech", totalModules: 0, totalQuestions: 0, totalDurationMins: 0, topics: [] },
    CSAT: { subject: "CSAT", totalModules: 0, totalQuestions: 0, totalDurationMins: 0, topics: [] },
    "Full-Length Prelims": { subject: "Full-Length Prelims", totalModules: 0, totalQuestions: 0, totalDurationMins: 0, topics: [] },
  };

  const topicsMap: Record<string, Set<string>> = {
    Polity: new Set(),
    History: new Set(),
    Economy: new Set(),
    Geography: new Set(),
    Environment: new Set(),
    "Science & Tech": new Set(),
    CSAT: new Set(),
    "Full-Length Prelims": new Set(),
  };

  for (const m of safeArray(modules)) {
    const s = (m.subject || "").toLowerCase();
    let key = "Full-Length Prelims";
    if (s.includes("polity")) key = "Polity";
    else if (s.includes("history")) key = "History";
    else if (s.includes("econ")) key = "Economy";
    else if (s.includes("geo")) key = "Geography";
    else if (s.includes("env") || s.includes("ecol")) key = "Environment";
    else if (s.includes("sci") || s.includes("tech")) key = "Science & Tech";
    else if (s.includes("csat")) key = "CSAT";

    if (!breakdown[key]) {
      breakdown[key] = { subject: key, totalModules: 0, totalQuestions: 0, totalDurationMins: 0, topics: [] };
      topicsMap[key] = new Set();
    }

    breakdown[key].totalModules += 1;
    breakdown[key].totalQuestions += safeArray(m.questionList).length || m.questions || 0;
    breakdown[key].totalDurationMins += m.duration || 20;

    if (m.topic) topicsMap[key].add(m.topic);
    for (const q of safeArray(m.questionList)) {
      if (q.syllabusSubtopic) topicsMap[key].add(q.syllabusSubtopic);
    }
  }

  for (const k of Object.keys(breakdown)) {
    breakdown[k].topics = Array.from(topicsMap[k] || []);
  }

  return breakdown;
}

