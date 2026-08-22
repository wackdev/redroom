import { TestResultRecord } from "../core/types";
import { calculateAccuracy, calculateVarianceAndConsistency, safeArray } from "../core/utils";

export interface PerformanceAnalyticsSummary {
  totalTests: number;
  averageScore: number;
  bestScore: number;
  overallAccuracy: number;
  totalCorrect: number;
  totalWrong: number;
  totalSkipped: number;
  totalAttempted: number;
  totalQuestions: number;
  recentAverage: number;
  previousAverage: number;
  improvement: number;
  consistencyScore: number;
  strongestTest: TestResultRecord | null;
  weakestTest: TestResultRecord | null;
  chronologicalScores: Array<{ id: number | string; title: string; score: number; date: string }>;
}


/**
 * Computes deep statistical insights from a user's test history.
 */
export function computeTestPerformanceAnalytics(
  results: TestResultRecord[]
): PerformanceAnalyticsSummary {
  const safeResults = safeArray(results);

  if (safeResults.length === 0) {
    return {
      totalTests: 0,
      averageScore: 0,
      bestScore: 0,
      overallAccuracy: 0,
      totalCorrect: 0,
      totalWrong: 0,
      totalSkipped: 0,
      totalAttempted: 0,
      totalQuestions: 0,
      recentAverage: 0,
      previousAverage: 0,
      improvement: 0,
      consistencyScore: 0,
      strongestTest: null,
      weakestTest: null,
      chronologicalScores: [],
    };
  }

  const totalTests = safeResults.length;
  const totalCorrect = safeResults.reduce((sum, r) => sum + (Number(r.correct) || 0), 0);
  const totalWrong = safeResults.reduce((sum, r) => sum + (Number(r.wrong) || 0), 0);
  const totalSkipped = safeResults.reduce((sum, r) => sum + (Number(r.skipped) || 0), 0);
  const totalAttempted = safeResults.reduce((sum, r) => sum + (Number(r.attempted) || 0), 0);
  const totalQuestions = safeResults.reduce((sum, r) => sum + (Number(r.total) || 0), 0);

  const totalScore = safeResults.reduce((sum, r) => sum + (Number(r.score) || 0), 0);
  const averageScore = Number((totalScore / totalTests).toFixed(2));
  const bestScore = Math.max(...safeResults.map((r) => Number(r.score) || 0));
  const overallAccuracy = calculateAccuracy(totalCorrect, totalAttempted);

  // Chronological sorting (oldest to newest)
  const ordered = [...safeResults].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const scoresList = ordered.map((r) => Number(r.score) || 0);
  const { consistencyScore } = calculateVarianceAndConsistency(scoresList);

  const recent = ordered.slice(-5);
  const previous = ordered.slice(Math.max(0, ordered.length - 10), Math.max(0, ordered.length - 5));

  const avg = (items: TestResultRecord[]) =>
    items.length ? items.reduce((sum, item) => sum + (Number(item.score) || 0), 0) / items.length : 0;

  const recentAverage = Number(avg(recent).toFixed(2));
  const previousAverage = Number(avg(previous).toFixed(2));
  const improvement = previous.length > 0 ? Number((recentAverage - previousAverage).toFixed(2)) : 0;

  const strongestTest = [...ordered].sort(
    (a, b) => (Number(b.score) || 0) - (Number(a.score) || 0)
  )[0] || null;

  const weakestTest = [...ordered].sort(
    (a, b) => (Number(a.score) || 0) - (Number(b.score) || 0)
  )[0] || null;

  const chronologicalScores = ordered.map((r, i) => ({
    id: r.id || i + 1,
    title: r.title || "UPSC Test",
    score: Number(r.score) || 0,
    date: r.date,
  }));

  return {
    totalTests,
    averageScore,
    bestScore,
    overallAccuracy,
    totalCorrect,
    totalWrong,
    totalSkipped,
    totalAttempted,
    totalQuestions,
    recentAverage,
    previousAverage,
    improvement,
    consistencyScore,
    strongestTest,
    weakestTest,
    chronologicalScores,
  };
}
