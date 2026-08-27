/**
 * UPSC PRELIMS PYQ PDF & TEXT INGESTION ENGINE
 * Parses OCR/PDF text, validates question schemas, auto-maps to the 126-chapter taxonomy,
 * and enables bulk importing for candidate study vaults.
 */

import { PYQQuestion, PYQOption } from "@/lib/core/types";
import {
  autoClassifyQuestion,
  getSubjectByIdOrName,
  findChapterById,
  PYQChapter,
  PYQSubject,
} from "@/lib/pyq/taxonomy";
import { saveUploadedPYQs, getStoredPYQs } from "./pyq-engine";

export interface ParsedQuestionDraft {
  rawText: string;
  year?: number;
  subject?: string;
  topic?: string;
  subtopic?: string;
  question: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  conceptTags?: string[];
  matchedChapter?: PYQChapter;
  matchedSubject?: PYQSubject;
  confidence?: number;
}

export interface IngestionResult {
  totalExtracted: number;
  validCount: number;
  autoClassifiedCount: number;
  questions: PYQQuestion[];
  errors: string[];
}

/**
 * Parses raw text extracted from PDF content into structured PYQ questions
 */
export function parseRawPDFTextToPYQs(
  rawText: string,
  forcedSubjectId?: string,
  forcedChapterId?: string,
  defaultYear: number = 2024
): IngestionResult {
  const result: IngestionResult = {
    totalExtracted: 0,
    validCount: 0,
    autoClassifiedCount: 0,
    questions: [],
    errors: [],
  };

  if (!rawText || !rawText.trim()) {
    result.errors.push("Provided text is empty.");
    return result;
  }

  // Normalize line breaks
  const clean = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Question boundary matcher: splits by patterns like:
  // "Q1.", "Q.1", "1.", "\nQ 1", "\n[Q1]"
  const questionBlocks = clean.split(/(?:^|\n)(?:Q\.?\s*\d+[\.\):]|(?:Question|\bQ)\s*\d+[\.\):]|\d+[\.\)]\s+(?=[A-Z0-9"“'\[\(]))/gi);

  let forcedSubject: PYQSubject | undefined = forcedSubjectId ? getSubjectByIdOrName(forcedSubjectId) : undefined;
  let forcedChapter: PYQChapter | undefined = forcedChapterId ? findChapterById(forcedChapterId) : undefined;

  for (let i = 0; i < questionBlocks.length; i++) {
    const block = questionBlocks[i].trim();
    if (block.length < 30) continue; // Skip noise

    result.totalExtracted++;

    try {
      // 1. Extract Year if present (e.g. [2023], (UPSC 2021), 2020)
      let year = defaultYear;
      const yearMatch = block.match(/(?:(?:UPSC|CSE|Prelims)?\s*[\[\(]?(19\d{2}|20\d{2})[\]\)]?)/i);
      if (yearMatch && yearMatch[1]) {
        const parsedYear = parseInt(yearMatch[1], 10);
        if (parsedYear >= 1990 && parsedYear <= 2030) {
          year = parsedYear;
        }
      }

      // 2. Extract Options (a), (b), (c), (d) or (A), (B), (C), (D)
      // Look for options block
      const optionRegex = /(?:\n|\s)(?:\(([a-dA-D])\)|\b([a-dA-D])[\.\)])\s+([\s\S]*?)(?=(?:\n|\s)(?:\([a-dA-D]\)|[a-dA-D][\.\)]|\bAns(?:wer)?\b|\bExplanation\b|$))/gi;
      
      const optionMatches: { key: "A" | "B" | "C" | "D"; text: string }[] = [];
      let lastMatchEnd = -1;
      let firstMatchStart = -1;

      let match: RegExpExecArray | null;
      while ((match = optionRegex.exec(block)) !== null) {
        const letter = (match[1] || match[2]).toUpperCase() as "A" | "B" | "C" | "D";
        const text = match[3].trim().replace(/\n+/g, " ");
        if (firstMatchStart === -1) firstMatchStart = match.index;
        lastMatchEnd = optionRegex.lastIndex;
        if (!optionMatches.some((o) => o.key === letter)) {
          optionMatches.push({ key: letter, text });
        }
      }

      // 3. Extract Answer Key (e.g. "Ans: (b)", "Answer: C", "Correct Answer: [A]")
      let correctAnswer: "A" | "B" | "C" | "D" = "A";
      const ansMatch = block.match(/(?:Ans(?:wer)?|Correct\s*(?:Option|Answer)?)\s*[:\-\]]*\s*[\[\(]?([A-Da-d])[\]\)]?/i);
      if (ansMatch && ansMatch[1]) {
        correctAnswer = ansMatch[1].toUpperCase() as "A" | "B" | "C" | "D";
      }

      // 4. Extract Explanation
      let explanation = "";
      const expMatch = block.match(/(?:Explanation|Solution|Exp)[:\-\s]*([\s\S]*)$/i);
      if (expMatch && expMatch[1]) {
        explanation = expMatch[1].trim();
      }

      // 5. Question Stem
      let questionStem = "";
      if (firstMatchStart !== -1) {
        questionStem = block.substring(0, firstMatchStart).trim();
      } else {
        // Fallback: up to Ans or Explanation
        const stopIndex = block.search(/(?:Ans(?:wer)?|Explanation|Solution)/i);
        questionStem = stopIndex !== -1 ? block.substring(0, stopIndex).trim() : block;
      }

      // Clean up headers like [2024] from stem
      questionStem = questionStem.replace(/^[\[\(]?(?:19\d{2}|20\d{2})[\]\)]?\s*[-:]?\s*/, "").trim();

      if (!questionStem || optionMatches.length < 2) {
        // Can't form a valid MCQ
        continue;
      }

      // Fill remaining options if only 2 or 3 found
      const requiredKeys: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
      const formattedOptions: PYQOption[] = requiredKeys.map((k) => {
        const found = optionMatches.find((o) => o.key === k);
        return {
          id: k.toLowerCase(),
          key: k,
          text: found ? found.text : `Option ${k}`,
        };
      });

      // 6. Topic & Subject Classification
      let resolvedSubjectName = forcedSubject?.name || "Polity";
      let resolvedTopicName = forcedChapter?.name || "General";

      if (!forcedSubject || !forcedChapter) {
        const auto = autoClassifyQuestion(questionStem, explanation);
        if (auto) {
          resolvedSubjectName = auto.subject.name;
          resolvedTopicName = auto.chapter.name;
          result.autoClassifiedCount++;
        }
      }

      const newQ: PYQQuestion = {
        id: `pyq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        year,
        subject: resolvedSubjectName,
        topic: resolvedTopicName,
        subtopic: forcedChapter?.name || resolvedTopicName,
        paper: "GS-1",
        question: questionStem,
        options: formattedOptions,
        correctAnswer,
        explanation: explanation || "Comprehensive UPSC standard explanation will be indexed.",
        difficulty: "Medium",
        important: true,
        conceptTags: [resolvedSubjectName, resolvedTopicName],
        createdAt: new Date().toISOString(),
      };

      result.questions.push(newQ);
      result.validCount++;
    } catch (err) {
      result.errors.push(`Error parsing block ${i + 1}: ${String(err)}`);
    }
  }

  return result;
}

/**
 * Validates and normalizes JSON questions input by user
 */
export function parseJSONToPYQs(
  rawJson: string,
  forcedSubjectId?: string,
  forcedChapterId?: string
): IngestionResult {
  const result: IngestionResult = {
    totalExtracted: 0,
    validCount: 0,
    autoClassifiedCount: 0,
    questions: [],
    errors: [],
  };

  try {
    const parsed = JSON.parse(rawJson);
    const list = Array.isArray(parsed) ? parsed : [parsed];
    result.totalExtracted = list.length;

    let forcedSubject: PYQSubject | undefined = forcedSubjectId ? getSubjectByIdOrName(forcedSubjectId) : undefined;
    let forcedChapter: PYQChapter | undefined = forcedChapterId ? findChapterById(forcedChapterId) : undefined;

    list.forEach((item, idx) => {
      if (!item.question || !item.options) {
        result.errors.push(`Item ${idx + 1} is missing question or options.`);
        return;
      }

      const options: PYQOption[] = Array.isArray(item.options)
        ? item.options.map((opt: unknown, optIdx: number) => {
            const optLetter = ["A", "B", "C", "D"][optIdx] as "A" | "B" | "C" | "D";
            if (typeof opt === "string") {
              return { id: optLetter.toLowerCase(), key: optLetter, text: opt };
            }
            const o = opt as { id?: string; key?: string; text?: string };
            return {
              id: o.id || optLetter.toLowerCase(),
              key: o.key || optLetter,
              text: o.text || String(opt),
            };
          })
        : [];

      let subj = forcedSubject?.name || item.subject || "Polity";
      let topic = forcedChapter?.name || item.topic || "General";

      if (!forcedSubject || !forcedChapter) {
        const auto = autoClassifyQuestion(item.question, item.explanation || "");
        if (auto) {
          subj = auto.subject.name;
          topic = auto.chapter.name;
          result.autoClassifiedCount++;
        }
      }

      const q: PYQQuestion = {
        id: item.id || `pyq-json-${Date.now()}-${idx}`,
        year: Number(item.year) || 2024,
        subject: subj,
        topic: topic,
        subtopic: item.subtopic || topic,
        paper: item.paper === "CSAT" ? "CSAT" : "GS-1",
        question: String(item.question).trim(),
        options,
        correctAnswer: (["A", "B", "C", "D"].includes(String(item.correctAnswer).toUpperCase())
          ? String(item.correctAnswer).toUpperCase()
          : "A") as "A" | "B" | "C" | "D",
        explanation: item.explanation || "No explanation provided.",
        difficulty: ["Easy", "Medium", "Hard"].includes(item.difficulty)
          ? item.difficulty
          : "Medium",
        important: Boolean(item.important ?? true),
        conceptTags: Array.isArray(item.conceptTags) ? item.conceptTags : [subj, topic],
        createdAt: item.createdAt || new Date().toISOString(),
      };

      result.questions.push(q);
      result.validCount++;
    });
  } catch (e) {
    result.errors.push(`Invalid JSON format: ${String(e)}`);
  }

  return result;
}

/**
 * Merges ingested questions into existing question bank without duplicates
 */
export async function mergeIngestedQuestions(
  newQuestions: PYQQuestion[]
): Promise<{ added: number; total: number }> {
  const existing = await getStoredPYQs();
  const existingMap = new Map<string, PYQQuestion>();

  existing.forEach((q) => {
    // Unique key: normalized question first 60 chars + year
    const key = `${q.year}-${q.question.slice(0, 60).toLowerCase().trim()}`;
    existingMap.set(key, q);
  });

  let added = 0;
  newQuestions.forEach((q) => {
    const key = `${q.year}-${q.question.slice(0, 60).toLowerCase().trim()}`;
    if (!existingMap.has(key)) {
      existingMap.set(key, q);
      added++;
    }
  });

  const merged = Array.from(existingMap.values());
  await saveUploadedPYQs(merged);
  return { added, total: merged.length };
}
