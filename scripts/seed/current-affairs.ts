import verifiedEditorials from "../../data/current-affairs/verified-editorials-2025-2026.json";
import { runCurrentAffairsPipeline } from "../../lib/current-affairs/pipeline";
import { SeedResult } from "./syllabus";

export async function seedCurrentAffairs(dryRun = false): Promise<SeedResult> {
  const result: SeedResult = {
    module: "CURRENT_AFFAIRS_PIPELINE",
    totalProcessed: 0,
    inserted: 0,
    updated: 0,
    errors: [],
  };

  try {
    console.log(`[SEED:CA] Running 8-stage quality pipeline on ${verifiedEditorials.length} editorials...`);
    const report = await runCurrentAffairsPipeline(verifiedEditorials);

    result.totalProcessed = report.totalFetched;
    result.inserted = report.validCount;

    console.log(
      `[SEED:CA] Processed: ${report.totalFetched} | Published: ${report.validCount} | Duplicates: ${report.duplicatesSkipped} | Failed: ${report.failedCount}`
    );

    if (report.errors.length > 0) {
      console.warn(`[SEED:CA] Pipeline error logs:`, report.errors);
    }

    if (dryRun) {
      console.log(`[SEED:CA] DRY RUN: Validated ${report.validCount} editorials successfully.`);
      return result;
    }

    console.log(`[SEED:CA] Successfully seeded ${report.validCount} verified production editorials.`);
  } catch (err: any) {
    result.errors.push(err.message || String(err));
    console.error(`[SEED:CA] Error seeding current affairs:`, err);
  }

  return result;
}
