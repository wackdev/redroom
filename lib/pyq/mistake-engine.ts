import { MistakeType, PYQAttempt, PYQQuestion, WeaknessInsight } from "../core/types";
import { calculateAccuracy, safeArray } from "../core/utils";

export interface MistakeAnalysisSummary {
  totalAttempts: number;
  correctCount: number;
  wrongCount: number;
  overallAccuracy: number;
  mistakeDistribution: Record<MistakeType, number>;
  weakestTopics: WeaknessInsight[];
}

export const MISTAKE_TYPE_LABELS: Record<MistakeType, string> = {
  conceptual_error: "Conceptual Gap / Theory Confusion",
  factual_memory_loss: "Factual / Data Recall Failure",
  misread_question: "Misread Question ('NOT', 'Except', 'Incorrect')",
  extreme_word_trap: "Fell for Extreme Words ('Always', 'All', 'Never')",
  time_pressure: "Rushed under Time Pressure",
  wild_guess: "Uncalculated Wild Guess",
};

/**
 * Analyzes attempts and extracts mistake patterns and weak areas.
 */
export function analyzeUserMistakes(
  attempts: PYQAttempt[],
  questions: PYQQuestion[]
): MistakeAnalysisSummary {
  const safeAttempts = safeArray(attempts);
  const qMap = new Map<string, PYQQuestion>();
  safeArray(questions).forEach((q) => qMap.set(String(q.id), q));

  let correctCount = 0;
  let wrongCount = 0;

  const distribution: Record<MistakeType, number> = {
    conceptual_error: 0,
    factual_memory_loss: 0,
    misread_question: 0,
    extreme_word_trap: 0,
    time_pressure: 0,
    wild_guess: 0,
  };

  // Group by topic
  const topicStats = new Map<
    string,
    {
      subject: string;
      topic: string;
      correct: number;
      total: number;
      mistakes: MistakeType[];
    }
  >();

  safeAttempts.forEach((attempt) => {
    const q = qMap.get(String(attempt.pyqId));
    const subject = q?.subject || "General";
    const topic = q?.topic || "General";
    const key = `${subject}::${topic}`;

    if (!topicStats.has(key)) {
      topicStats.set(key, {
        subject,
        topic,
        correct: 0,
        total: 0,
        mistakes: [],
      });
    }

    const stat = topicStats.get(key)!;
    stat.total += 1;

    if (attempt.isCorrect) {
      correctCount++;
      stat.correct += 1;
    } else {
      wrongCount++;
      const mType = attempt.mistakeType || "conceptual_error";
      distribution[mType] = (distribution[mType] || 0) + 1;
      stat.mistakes.push(mType);
    }
  });

  const totalAttempts = correctCount + wrongCount;
  const overallAccuracy = calculateAccuracy(correctCount, totalAttempts);

  // Identify weak topics with accuracy < 60% and at least 2 attempts
  const weakestTopics: WeaknessInsight[] = [];
  topicStats.forEach((stat) => {
    const acc = calculateAccuracy(stat.correct, stat.total);
    if (stat.total >= 2 && acc < 70) {
      const weaknessScore = Math.round(100 - acc);
      weakestTopics.push({
        subject: stat.subject,
        topic: stat.topic,
        weaknessScore,
        accuracyPercent: acc,
        attemptCount: stat.total,
        recentMistakes: stat.mistakes.slice(-3),
        recommendation: generateRemedialAdvice(stat.topic, stat.mistakes),
      });
    }
  });

  weakestTopics.sort((a, b) => b.weaknessScore - a.weaknessScore);

  return {
    totalAttempts,
    correctCount,
    wrongCount,
    overallAccuracy,
    mistakeDistribution: distribution,
    weakestTopics,
  };
}

function generateRemedialAdvice(topic: string, mistakes: MistakeType[]): string {
  if (mistakes.includes("misread_question")) {
    return `Practice underlining qualifying keywords (e.g. 'NOT correct') when solving questions on ${topic}.`;
  }
  if (mistakes.includes("extreme_word_trap")) {
    return `Watch out for standard UPSC extreme word traps (e.g. 'only', 'all', 'strictly') in ${topic} options.`;
  }
  if (mistakes.includes("factual_memory_loss")) {
    return `Add ${topic} to your Spaced Repetition queue for periodic active recall review.`;
  }
  return `Review core conceptual notes on ${topic} and attempt targeted sectional MCQs.`;
}
