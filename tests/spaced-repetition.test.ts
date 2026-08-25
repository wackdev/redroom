import assert from "node:assert";
import { calculateSM2, calculateUrgencyScore } from "../lib/revision/spaced-repetition";

export function runSpacedRepetitionTests() {
  console.log("  ▶ [Test Suite] SM-2 Spaced Repetition Engine");

  // Test 1: Blackout recall (Rating 1) resets repetitions to 0 and interval to 1
  const failResult = calculateSM2(1, 4, 15, 2.5, "High");
  assert.strictEqual(failResult.repetitionCount, 0, "Repetition count should reset to 0 on failure");
  assert.strictEqual(failResult.intervalDays, 1, "Interval should reset to 1 on failure");
  assert.ok(failResult.easeFactor < 2.5, "Ease factor should drop on failure");

  // Test 2: Mastered recall (Rating 5) expands interval and increases ease factor
  const masterResult = calculateSM2(5, 2, 3, 2.5, "High");
  assert.strictEqual(masterResult.repetitionCount, 3, "Repetition count should increment to 3");
  assert.ok(masterResult.intervalDays >= 5, "Interval should expand on high mastery");
  assert.ok(masterResult.easeFactor > 2.5, "Ease factor should increase on rating 5");

  // Test 3: Ease factor bounds (Minimum 1.3, Maximum 3.0)
  const floorResult = calculateSM2(1, 0, 1, 1.3, "High");
  assert.ok(floorResult.easeFactor >= 1.3, "Ease factor must not fall below floor 1.3");

  const ceilingResult = calculateSM2(5, 10, 30, 3.0, "High");
  assert.ok(ceilingResult.easeFactor <= 3.0, "Ease factor must not exceed ceiling 3.0");

  // Test 4: Urgency Score Calculation
  const todayStr = new Date().toISOString().slice(0, 10);
  const overdueUrgency = calculateUrgencyScore(todayStr, "High");
  assert.ok(overdueUrgency >= 80, "Due/Overdue high-importance items must have urgency >= 80");

  console.log("    ✔ SM-2 Blackout Reset verified");
  console.log("    ✔ Mastery Interval Expansion verified");
  console.log("    ✔ Ease Factor Boundary Clamping verified");
  console.log("    ✔ Urgency Scoring & UPSC Weighting verified");
}
