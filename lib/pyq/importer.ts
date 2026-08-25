import { PYQQuestion } from "@/lib/core/types";

export type QuestionType =
  | "SINGLE_CORRECT"
  | "MULTIPLE_STATEMENTS"
  | "ASSERTION_REASONING"
  | "MATCHING"
  | "CHRONOLOGICAL"
  | "MAP_BASED";

export interface ProductionPYQQuestion extends PYQQuestion {
  questionType?: QuestionType;
  exam?: string;
  source?: string;
  sourceUrl?: string;
  contentHash?: string;
  statementList?: string[];
  matchingPairs?: { item: string; match: string }[];
  trapType?: string;
}

export interface PYQImportReport {
  totalProcessed: number;
  validQuestions: number;
  duplicateCount: number;
  invalidCount: number;
  imported: ProductionPYQQuestion[];
  errors: { questionId?: number | string; reason: string }[];
}

/**
 * Generate a deterministic normalized hash of a question for duplicate detection.
 */
export function generateQuestionHash(q: Partial<ProductionPYQQuestion>): string {
  const normalizedText = (q.question || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 100);
  const year = q.year || 0;
  const subject = (q.subject || "").toLowerCase();
  return `${year}_${subject}_${normalizedText}`;
}

/**
 * Detect the question archetype based on question structure and content.
 */
export function detectQuestionType(questionText: string, options: Record<string, string> = {}): QuestionType {
  const lower = questionText.toLowerCase();

  if (lower.includes("consider the following pairs") || lower.includes("match list") || lower.includes("which of the pairs given above are correctly matched")) {
    return "MATCHING";
  }

  if (lower.includes("statement-i") || lower.includes("statement-ii") || lower.includes("assertion") || lower.includes("reason (r)")) {
    return "ASSERTION_REASONING";
  }

  if (lower.includes("chronological order") || lower.includes("correct sequence") || lower.includes("from north to south") || lower.includes("from west to east")) {
    return lower.includes("north to south") || lower.includes("west to east") ? "MAP_BASED" : "CHRONOLOGICAL";
  }

  if (lower.includes("which of the statements given above is/are correct") || lower.includes("consider the following statements") || lower.includes("1 only") || lower.includes("1 and 2 only")) {
    return "MULTIPLE_STATEMENTS";
  }

  if (lower.includes("national park") || lower.includes("strait") || lower.includes("biosphere reserve") || lower.includes("river passes through")) {
    return "MAP_BASED";
  }

  return "SINGLE_CORRECT";
}

/**
 * Normalize options whether provided as an object { A: '...', B: '...' } or array of objects [{ id: 'A', text: '...' }]
 */
export function normalizeOptions(rawOptions: any): Record<string, string> | null {
  if (!rawOptions) return null;

  if (Array.isArray(rawOptions)) {
    const map: Record<string, string> = {};
    for (const opt of rawOptions) {
      if (opt && typeof opt === "object" && opt.id) {
        map[String(opt.id).toUpperCase()] = opt.text || opt.label || "";
      }
    }
    const validKeys = ["A", "B", "C", "D"];
    if (validKeys.every((k) => typeof map[k] === "string")) {
      return map;
    }
    return null;
  }

  if (typeof rawOptions === "object") {
    const validKeys = ["A", "B", "C", "D"];
    const map: Record<string, string> = {};
    for (const k of validKeys) {
      if (rawOptions[k] !== undefined || rawOptions[k.toLowerCase()] !== undefined) {
        map[k] = String(rawOptions[k] ?? rawOptions[k.toLowerCase()] ?? "");
      }
    }
    if (validKeys.every((k) => typeof map[k] === "string")) {
      return map;
    }
  }

  return null;
}

/**
 * Validate a PYQ item before insertion.
 */
export function validatePYQ(q: any): { valid: boolean; reason?: string; normalizedOptions?: Record<string, string> } {
  if (!q.question || typeof q.question !== "string" || q.question.trim().length < 15) {
    return { valid: false, reason: "Question text is missing or too short (< 15 chars)" };
  }

  const normalizedOptions = normalizeOptions(q.options);
  if (!normalizedOptions) {
    return { valid: false, reason: "Options must provide valid options for A, B, C, and D" };
  }

  const validKeys = ["A", "B", "C", "D"];
  const correctAns = String(q.correctAnswer || q.correct_answer || "").toUpperCase();
  if (!correctAns || !validKeys.includes(correctAns)) {
    return { valid: false, reason: "Correct answer must be one of A, B, C, D" };
  }

  if (!q.explanation || typeof q.explanation !== "string" || q.explanation.trim().length < 20) {
    return { valid: false, reason: "Explanation is missing or too short (< 20 chars)" };
  }

  if (!q.subject || typeof q.subject !== "string") {
    return { valid: false, reason: "Subject is required" };
  }

  return { valid: true, normalizedOptions };
}

/**
 * Process and import an array of raw PYQs with duplicate detection and quality control.
 */
export function importPYQDataset(rawList: any[]): PYQImportReport {
  const report: PYQImportReport = {
    totalProcessed: 0,
    validQuestions: 0,
    duplicateCount: 0,
    invalidCount: 0,
    imported: [],
    errors: [],
  };

  const seenHashes = new Set<string>();

  for (const raw of rawList) {
    report.totalProcessed++;

    const validation = validatePYQ(raw);
    if (!validation.valid || !validation.normalizedOptions) {
      report.invalidCount++;
      report.errors.push({
        questionId: raw.id,
        reason: validation.reason || "Validation failed",
      });
      continue;
    }

    const contentHash = generateQuestionHash(raw);
    if (seenHashes.has(contentHash)) {
      report.duplicateCount++;
      continue;
    }

    seenHashes.add(contentHash);

    const questionType = raw.questionType || detectQuestionType(raw.question, validation.normalizedOptions);

    const processed: ProductionPYQQuestion = {
      id: raw.id || report.imported.length + 1,
      year: Number(raw.year) || 2023,
      exam: raw.exam || "UPSC CSE Prelims",
      paper: raw.paper || "GS-1",
      subject: raw.subject,
      topic: raw.topic || "General Studies",
      difficulty: raw.difficulty || "Medium",
      questionType,
      question: raw.question.trim(),
      options: raw.options, // Preserves original structure for UI compatibility
      correctAnswer: String(raw.correctAnswer || raw.correct_answer).toUpperCase() as "A" | "B" | "C" | "D",
      explanation: raw.explanation.trim(),
      source: raw.source || `UPSC Prelims ${raw.year || 2023} Official Key`,
      important: Boolean(raw.important),
      conceptTags: Array.isArray(raw.conceptTags) ? raw.conceptTags : [raw.subject, raw.topic || "UPSC"],
      mainsRelevance: raw.mainsRelevance || undefined,
      contentHash,
      trapType: raw.trapType || (raw.difficulty === "Hard" ? "extreme_word_trap" : "conceptual_trap"),
    };

    report.validQuestions++;
    report.imported.push(processed);
  }

  return report;
}
