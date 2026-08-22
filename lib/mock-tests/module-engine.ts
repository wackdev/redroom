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
export function normalizeOptions(rawOpts: Record<string, string> | PYQOption[] | undefined): PYQOption[] {
  if (!rawOpts) return [];
  if (Array.isArray(rawOpts)) {
    return rawOpts.map((opt, i) => ({
      id: String(opt.id || String.fromCharCode(65 + i)) as "A" | "B" | "C" | "D",
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
  const answer = (raw.correct_option || raw.answer || "A").toUpperCase();

  let explanationSummary = "";
  let detailedExp: MockTestQuestion["detailedExplanation"] | undefined = undefined;

  if (typeof raw.explanation === "string") {
    explanationSummary = raw.explanation;
  } else if (raw.explanation && typeof raw.explanation === "object") {
    detailedExp = {
      statement_analysis: raw.explanation.statement_analysis,
      elimination_technique: raw.explanation.elimination_technique,
      concept_takeaway: raw.explanation.concept_takeaway,
      reference_sources: raw.explanation.reference_sources || raw.reference_sources,
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

  return {
    id: raw.id || index + 1,
    question: raw.question,
    options,
    answer,
    explanation: explanationSummary,
    detailedExplanation: detailedExp,
    syllabusSubtopic: raw.syllabus_subtopic,
    patternType: raw.pattern_type,
    difficulty: raw.difficulty,
    referenceSources: raw.reference_sources,
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

    const rawList = Array.isArray(raw) ? raw : (raw.questions || []);
    const questionsList: RawModuleQuestion[] = safeArray(rawList);
    if (questionsList.length === 0) continue;

    const parsedQuestions: MockTestQuestion[] = questionsList.map((q, qIdx) =>
      parseModuleQuestion(q, qIdx)
    );


    const subject = raw.subject || "General Studies";
    const moduleNumber = raw.module_number || mIdx + 1;
    const moduleTitle = raw.module_title || `Module ${moduleNumber}: ${raw.topic || subject}`;
    const duration = Math.max(5, Math.ceil(parsedQuestions.length * 1.5));

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
      title: `${subject} - Module ${moduleNumber}: ${moduleTitle}`,
      subject,
      moduleNumber,
      moduleTitle,
      curriculum: raw.curriculum || "UPSC Civil Services Examination (CSE)",
      stage: raw.stage || "Preliminary Examination (General Studies Paper-I)",
      topic: raw.topic || moduleTitle,
      questions: parsedQuestions.length,
      duration,
      description: raw.topic || moduleTitle,
      marksPerQuestion: 2.0,
      negativeMarking: 0.66,
      difficulty: parsedQuestions[0]?.difficulty || "Moderate to High",
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

  return {
    badgeBg: "bg-pink-500/20",
    badgeText: "text-pink-300",
    badgeBorder: "border-pink-500/30",
    accentGlow: "from-pink-600/20 to-purple-600/5",
    accentColor: "text-pink-400",
    icon: "🎯",
  };
}
