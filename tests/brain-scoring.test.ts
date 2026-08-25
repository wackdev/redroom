import assert from "node:assert";
import { calculateExamReadiness } from "../lib/brain/scoring/readiness-engine";

export async function runBrainScoringTests() {
  console.log("  ▶ [Test Suite] Brain Readiness & Scoring Engine");

  // Test 1: New User Calibration State
  const newCadetScore = await calculateExamReadiness();
  assert.ok(newCadetScore.overallScore >= 0, "Readiness score must be non-negative");
  assert.ok(newCadetScore.whyThisScore, "Must provide 'WHY THIS SCORE?' causal diagnosis");
  assert.ok(Array.isArray(newCadetScore.whyThisScore.nextActions), "Must provide next actions");
  assert.ok(newCadetScore.whyThisScore.nextActions.length >= 1, "Must contain at least 1 actionable step");

  // Test 2: Breakdown Components Integrity
  const { prelimsBreakdown, mainsBreakdown } = newCadetScore;
  assert.ok(typeof prelimsBreakdown.syllabusCoverage === "number", "Prelims syllabus coverage must be number");
  assert.ok(typeof prelimsBreakdown.pyqAccuracy === "number", "Prelims MCQ accuracy must be number");
  assert.ok(typeof mainsBreakdown.answerWriting === "number", "Mains answer writing must be number");

  // Test 3: Action routes validity
  for (const action of newCadetScore.whyThisScore.nextActions) {
    assert.ok(action.route.startsWith("/"), `Action route must be an absolute path: ${action.route}`);
    assert.ok(["IMMEDIATE", "HIGH", "MEDIUM"].includes(action.urgency), `Invalid urgency: ${action.urgency}`);
  }

  console.log("    ✔ New Cadet Diagnostic State passed");
  console.log("    ✔ Metric Normalization & Multi-Paper Breakdown passed");
  console.log("    ✔ Next Action Directives verified");
}
