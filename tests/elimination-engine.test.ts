import assert from "node:assert";
import {
  diagnoseQuestionTraps,
  calculateEliminationProbability,
} from "../lib/study/pyq-engine";
import { PYQQuestion } from "../lib/core/types";

export function runEliminationEngineTests() {
  console.log("  ▶ [Test Suite] Prelims Trap & Elimination Engine");

  // Test 1: Extreme Qualifier Trap Detection
  const mockQuestionWithExtreme: PYQQuestion = {
    id: "q-test-1",
    year: 2023,
    subject: "Polity",
    topic: "Writs",
    question: "With reference to the writs in India, consider the following statements:",
    options: [
      { id: "A", text: "Mandamus can be issued only against public officials." },
      { id: "B", text: "Quo-Warranto can always be claimed as a matter of right." },
      { id: "C", text: "Habeas Corpus can be issued against both public and private entities." },
      { id: "D", text: "Certiorari is never available against administrative authorities." },
    ],
    correctAnswer: "C",
    explanation: "Standard explanation",
    difficulty: "Medium",
    important: true,
  };

  const trapDiag = diagnoseQuestionTraps(mockQuestionWithExtreme);
  assert.strictEqual(trapDiag.hasTrap, true, "Should detect extreme qualifier trap");
  assert.strictEqual(trapDiag.trapType, "extreme_qualifiers");
  assert.ok(Array.isArray(trapDiag.suspectOptionIds), "Must list suspect option IDs");
  assert.ok(trapDiag.suspectOptionIds.includes("A") || trapDiag.suspectOptionIds.includes("B"));

  // Test 2: Elimination Probability & Expected Value Status
  const eliminatedTwo = new Set(["A", "B"]);
  const probState = calculateEliminationProbability(eliminatedTwo, 4);
  assert.strictEqual(probState.remainingCount, 2, "Remaining options count should be 2");
  assert.strictEqual(probState.calculatedProbability, 50, "50% guess probability for 2 remaining options");
  assert.strictEqual(probState.riskRewardStatus, "Favorable (Take Guess)", "50-50 odds should be marked as Favorable");

  const eliminatedThree = new Set(["A", "B", "D"]);
  const definiteState = calculateEliminationProbability(eliminatedThree, 4);
  assert.strictEqual(definiteState.remainingCount, 1);
  assert.strictEqual(definiteState.calculatedProbability, 100);
  assert.strictEqual(definiteState.riskRewardStatus, "Definite");

  console.log("    ✔ Extreme Qualifier Heuristic Detection verified");
  console.log("    ✔ Elimination Probability & Expected Value Strategy verified");
}
