import { RevisionConfidence, RevisionItem } from "../core/types";
import { getDateKey, shiftDateKey } from "../core/utils";

export interface SM2Result {
  repetitionCount: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: string;
  urgencyScore: number;
  isOverdue: boolean;
}

/**
 * Calculates updated SM-2 Spaced Repetition parameters weighted by UPSC importance.
 *
 * Confidence Rating scale:
 * 1 = Blackout / Completely forgot (Reset interval to 1 day)
 * 2 = Hard (Struggled, interval 1-2 days)
 * 3 = Moderate / Good (Standard SM-2 multiplier)
 * 4 = Easy (Solid recall, expanded interval)
 * 5 = Mastered (Long interval)
 */
export function calculateSM2(
  confidence: RevisionConfidence,
  currentReps = 0,
  currentInterval = 1,
  currentEase = 2.5,
  upscImportance: "High" | "Medium" | "Low" = "High"
): SM2Result {
  let reps = currentReps;
  let interval = currentInterval;
  let ease = currentEase;

  if (confidence < 3) {
    // Failed recall: reset repetitions to 0 and interval to 1 day
    reps = 0;
    interval = 1;
  } else {
    // Successful recall
    if (reps === 0) {
      interval = 1;
    } else if (reps === 1) {
      interval = 3; // 3 days for second successful recall
    } else {
      interval = Math.round(currentInterval * ease);
    }
    reps += 1;
  }

  // SM-2 Ease Factor formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const q = confidence;
  ease = ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ease < 1.3) ease = 1.3; // Minimum ease floor
  if (ease > 3.0) ease = 3.0; // Maximum ease ceiling

  // Adjust interval slightly based on UPSC subject weight
  if (upscImportance === "High") {
    // High importance subjects are revised slightly more frequently
    interval = Math.max(1, Math.round(interval * 0.9));
  } else if (upscImportance === "Low") {
    interval = Math.round(interval * 1.15);
  }

  const nextReviewDate = shiftDateKey(getDateKey(), interval);
  const urgencyScore = calculateUrgencyScore(nextReviewDate, upscImportance);
  const isOverdue = nextReviewDate <= getDateKey();

  return {
    repetitionCount: reps,
    intervalDays: interval,
    easeFactor: Number(ease.toFixed(2)),
    nextReviewDate,
    urgencyScore,
    isOverdue,
  };
}

/**
 * Computes urgency score (0 - 100) based on days until due and UPSC importance.
 */
export function calculateUrgencyScore(
  nextReviewDate: string,
  upscImportance: "High" | "Medium" | "Low" = "High"
): number {
  const today = new Date(getDateKey()).getTime();
  const target = new Date(nextReviewDate).getTime();
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  let baseScore = 50;
  if (diffDays <= 0) {
    // Overdue: urgency scales rapidly with days past
    baseScore = 80 + Math.min(20, Math.abs(diffDays) * 5);
  } else if (diffDays === 1) {
    baseScore = 70;
  } else if (diffDays <= 3) {
    baseScore = 55;
  } else {
    baseScore = Math.max(10, 50 - diffDays * 3);
  }

  const weightMultiplier =
    upscImportance === "High" ? 1.2 : upscImportance === "Medium" ? 1.0 : 0.85;

  return Math.min(100, Math.max(0, Math.round(baseScore * weightMultiplier)));
}
