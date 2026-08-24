/**
 * REDROOM Prelims Elimination & Trap Diagnostic Engine
 * Intelligent heuristic detection for UPSC Civil Services Prelims MCQs.
 */

import { PYQOption, PYQQuestion } from "../core/types";
import { safeArray } from "../core/utils";

export interface TrapDiagnosis {
  hasTrap: boolean;
  trapType?: "extreme_qualifiers" | "factual_swap" | "scope_generalization" | "statutory_vs_constitutional" | "chronology_inversion";
  label?: string;
  description?: string;
  suspectOptionIds?: ("A" | "B" | "C" | "D")[];
  eliminationTip?: string;
}

export interface EliminationState {
  eliminatedOptions: Set<string>;
  remainingCount: number;
  calculatedProbability: number; // 0 - 100%
  riskRewardStatus: "Favorable (Take Guess)" | "Neutral (50-50)" | "High Risk (Avoid)" | "Definite";
}

const EXTREME_QUALIFIERS = [
  "always",
  "never",
  "only",
  "all",
  "none",
  "strictly",
  "exclusively",
  "any",
  "invariably",
  "entirely",
  "completely",
  "solely",
];

const STATUTORY_CONSTITUTIONAL_WORDS = [
  "constitutional body",
  "statutory body",
  "extra-constitutional",
  "quasi-judicial",
  "executive resolution",
];

/**
 * Diagnoses potential UPSC traps in a given Prelims question.
 */
export function diagnoseQuestionTraps(question: PYQQuestion): TrapDiagnosis {
  const suspectOptions: ("A" | "B" | "C" | "D")[] = [];
  const qTextLower = (question.question || "").toLowerCase();

  // 1. Check for extreme qualifiers in options
  for (const opt of safeArray(question.options)) {
    const textLower = opt.text.toLowerCase();
    for (const word of EXTREME_QUALIFIERS) {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      if (regex.test(textLower)) {
        suspectOptions.push(opt.id as ("A" | "B" | "C" | "D"));
        break;
      }
    }
  }

  if (suspectOptions.length > 0) {
    return {
      hasTrap: true,
      trapType: "extreme_qualifiers",
      label: "Extreme Qualifier Trap",
      description: `Option(s) [${suspectOptions.join(", ")}] contain definitive extreme qualifiers (e.g. 'only', 'all', 'never', 'always'). In UPSC Prelims, absolute statements are incorrect ~80% of the time.`,
      suspectOptionIds: suspectOptions,
      eliminationTip: "Consider eliminating options with extreme qualifiers unless referring to explicit constitutional mandates.",
    };
  }

  // 2. Check for statutory vs constitutional body confusion
  const hasStatutoryKeyword = STATUTORY_CONSTITUTIONAL_WORDS.some(
    (kw) => qTextLower.includes(kw) || safeArray(question.options).some((o) => o.text.toLowerCase().includes(kw))
  );

  if (hasStatutoryKeyword) {
    return {
      hasTrap: true,
      trapType: "statutory_vs_constitutional",
      label: "Statutory vs Constitutional Classification Trap",
      description: "UPSC frequently tests whether an institution is created by the Constitution (e.g., Article 280, 324) vs an Act of Parliament (Statutory) or Executive Order (e.g., NITI Aayog).",
      eliminationTip: "Verify the legal origin (Constitutional Article vs Parliamentary Act) for each institution mentioned.",
    };
  }

  // 3. Chronology / Timeline swap traps
  if (
    qTextLower.includes("chronological") ||
    qTextLower.includes("correct order") ||
    qTextLower.includes("earliest") ||
    qTextLower.includes("latest")
  ) {
    return {
      hasTrap: true,
      trapType: "chronology_inversion",
      label: "Chronology Inversion Trap",
      description: "Chronology questions often swap adjacent intermediate events while keeping the first or last anchor correct.",
      eliminationTip: "Fix the definite earliest and latest anchor events first to eliminate 2 out of 4 options immediately.",
    };
  }

  return {
    hasTrap: false,
  };
}

/**
 * Calculates real-time guess probability and risk-reward ratio given eliminated options.
 */
export function calculateEliminationProbability(
  eliminatedOptionIds: Set<string>,
  totalOptionsCount: number = 4
): EliminationState {
  const eliminated = eliminatedOptionIds.size;
  const remaining = Math.max(1, totalOptionsCount - eliminated);

  let probability = Math.round((1 / remaining) * 100);
  let status: EliminationState["riskRewardStatus"] = "High Risk (Avoid)";

  if (remaining === 1) {
    probability = 100;
    status = "Definite";
  } else if (remaining === 2) {
    // 50-50 odds: Expected value = (0.5 * 2.0) - (0.5 * 0.66) = +0.67 marks! Mathematically profitable.
    status = "Favorable (Take Guess)";
  } else if (remaining === 3) {
    // 33% odds: Expected value = (0.33 * 2.0) - (0.67 * 0.66) = +0.22 marks. Neutral.
    status = "Neutral (50-50)";
  } else {
    status = "High Risk (Avoid)";
  }

  return {
    eliminatedOptions: eliminatedOptionIds,
    remainingCount: remaining,
    calculatedProbability: probability,
    riskRewardStatus: status,
  };
}
