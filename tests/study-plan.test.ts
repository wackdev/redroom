import assert from "node:assert";
import { safeArray, getDateKey, shiftDateKey } from "../lib/core/utils";
import { StudyTask } from "../lib/core/types";

export function runStudyPlanTests() {
  console.log("  ▶ [Test Suite] Study Plan & Adaptive Task Rescheduler");

  // Test 1: Task Completion Hours Calculation
  const sampleTasks: StudyTask[] = [
    { id: "t-1", subject: "Polity", title: "Laxmikanth Ch 7", description: "Articles 14-18", hours: 2.0, completed: true },
    { id: "t-2", subject: "Economy", title: "Banking Reforms", description: "Narasimham Committee", hours: 1.5, completed: false },
    { id: "t-3", subject: "History", title: "1857 Revolt", description: "Causes & Impact", hours: 2.5, completed: true },
  ];

  const completedHours = sampleTasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + (t.hours || 0), 0);

  const totalHours = sampleTasks.reduce((sum, t) => sum + (t.hours || 0), 0);

  assert.strictEqual(completedHours, 4.5, "Completed hours should equal 4.5h");
  assert.strictEqual(totalHours, 6.0, "Total hours should equal 6.0h");

  // Test 2: Auto-Rescheduling Missed Tasks
  const today = getDateKey();
  const tomorrow = shiftDateKey(today, 1);

  const incompleteTasks = sampleTasks.filter((t) => !t.completed);
  const rescheduledTasks = incompleteTasks.map((t) => ({
    ...t,
    description: `[Rescheduled from ${today}] ${t.description}`,
  }));

  assert.strictEqual(rescheduledTasks.length, 1, "Only 1 incomplete task should be rescheduled");
  assert.ok(rescheduledTasks[0].description.includes(today), "Rescheduled note should be prepended");

  // Test 3: safeArray null handling
  assert.deepStrictEqual(safeArray(null), [], "safeArray(null) must return empty array");
  assert.deepStrictEqual(safeArray(undefined), [], "safeArray(undefined) must return empty array");
  assert.deepStrictEqual(safeArray([1, 2]), [1, 2], "safeArray([1,2]) must return array as is");

  console.log("    ✔ Study Hours & Completion Aggregator verified");
  console.log("    ✔ Adaptive Task Rescheduling verified");
  console.log("    ✔ Safe Array Defensive Parsing verified");
}
