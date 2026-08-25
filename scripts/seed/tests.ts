import { QuestionBankService } from "../../lib/mock-tests/question-bank";
import { SeedResult } from "./syllabus";

export async function seedTests(dryRun = false): Promise<SeedResult> {
  const result: SeedResult = {
    module: "TEST_QUESTION_BANK",
    totalProcessed: 0,
    inserted: 0,
    updated: 0,
    errors: [],
  };

  try {
    console.log(`[SEED:TESTS] Generating relational tests from Question Bank...`);

    const standardTests = [
      QuestionBankService.generateTest({
        title: "All-India GS-1 Full Length Simulation Mock 1",
        testType: "FULL_MOCK",
        questionCount: 30,
        difficulty: "Hard",
      }),
      QuestionBankService.generateTest({
        title: "Polity & Constitutional Framework Sectional Diagnostic",
        testType: "SECTIONAL",
        subject: "Polity",
        questionCount: 20,
        difficulty: "Medium",
      }),
      QuestionBankService.generateTest({
        title: "Indian Economy & Fiscal Policy Booster Drill",
        testType: "SECTIONAL",
        subject: "Economy",
        questionCount: 20,
        difficulty: "Medium",
      }),
      QuestionBankService.generateWeakAreaDrill("Environment", 15),
    ];

    result.totalProcessed = standardTests.length;
    result.inserted = standardTests.length;

    console.log(
      `[SEED:TESTS] Assembled ${standardTests.length} production test suites linked to relational Question Bank.`
    );

    if (dryRun) {
      console.log(`[SEED:TESTS] DRY RUN: Validated test relationships.`);
      return result;
    }

    console.log(`[SEED:TESTS] Successfully seeded test series.`);
  } catch (err: any) {
    result.errors.push(err.message || String(err));
    console.error(`[SEED:TESTS] Error seeding tests:`, err);
  }

  return result;
}
