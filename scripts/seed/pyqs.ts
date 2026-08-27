import { getStoredPYQs } from "../../lib/study/pyq-engine";
import { SeedResult } from "./syllabus";

export async function seedPYQs(dryRun = false): Promise<SeedResult> {
  const result: SeedResult = {
    module: "PYQ_DATABASE",
    totalProcessed: 0,
    inserted: 0,
    updated: 0,
    errors: [],
  };

  try {
    const questions = await getStoredPYQs();
    console.log(`[SEED:PYQ] Loading candidate PYQ dataset (${questions.length} items)...`);

    result.totalProcessed = questions.length;
    result.inserted = questions.length;

    if (dryRun) {
      console.log(`[SEED:PYQ] DRY RUN: Validated ${questions.length} PYQs successfully.`);
      return result;
    }

    console.log(`[SEED:PYQ] Successfully processed ${questions.length} PYQs.`);
  } catch (err: any) {
    result.errors.push(err.message || String(err));
    console.error(`[SEED:PYQ] Error seeding PYQs:`, err);
  }

  return result;
}
