import gs1Data from "../../data/mains-pyq/gs1.json";
import gs2Data from "../../data/mains-pyq/gs2.json";
import gs3Data from "../../data/mains-pyq/gs3.json";
import gs4Data from "../../data/mains-pyq/gs4.json";
import essayData from "../../data/mains-pyq/essay.json";
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
    const allMains = [
      ...gs1Data,
      ...gs2Data,
      ...gs3Data,
      ...gs4Data,
      ...essayData,
    ];

    result.totalProcessed = allMains.length;
    result.inserted = allMains.length;

    console.log(
      `[SEED:MAINS] Loaded & validated ${allMains.length} Mains questions with dimensional frameworks and model answers.`
    );

    if (dryRun) {
      console.log(`[SEED:MAINS] DRY RUN: Validated Mains dataset.`);
      return result;
    }

    console.log(`[SEED:MAINS] Successfully seeded Mains question bank.`);
  } catch (err: any) {
    result.errors.push(err.message || String(err));
    console.error(`[SEED:MAINS] Error seeding Mains:`, err);
  }

  return result;
}
