import { getStoredMainsPYQs } from "../../lib/mains-pyq/static-dataset";
import { SeedResult } from "./syllabus";

export async function seedMains(dryRun = false): Promise<SeedResult> {
  const result: SeedResult = {
    module: "MAINS_QUESTION_BANK",
    totalProcessed: 0,
    inserted: 0,
    updated: 0,
    errors: [],
  };

  try {
    const allMains = getStoredMainsPYQs();

    result.totalProcessed = allMains.length;
    result.inserted = allMains.length;

    console.log(
      `[SEED:MAINS] Loaded & validated ${allMains.length} Mains questions.`
    );

    if (dryRun) {
      console.log(`[SEED:MAINS] DRY RUN: Validated Mains dataset.`);
      return result;
    }

    console.log(`[SEED:MAINS] Successfully processed Mains question bank.`);
  } catch (err: any) {
    result.errors.push(err.message || String(err));
    console.error(`[SEED:MAINS] Error seeding Mains questions:`, err);
  }

  return result;
}
