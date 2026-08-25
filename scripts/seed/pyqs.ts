import { STATIC_PYQS } from "../../lib/pyq/static-dataset";
import { importPYQDataset, PYQImportReport } from "../../lib/pyq/importer";
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
    console.log(`[SEED:PYQ] Loading raw PYQ dataset (${STATIC_PYQS.length} items)...`);
    const report: PYQImportReport = importPYQDataset(STATIC_PYQS);

    result.totalProcessed = report.totalProcessed;
    result.inserted = report.validQuestions;

    console.log(
      `[SEED:PYQ] Processed: ${report.totalProcessed} | Valid: ${report.validQuestions} | Duplicates Skipped: ${report.duplicateCount} | Invalid: ${report.invalidCount}`
    );

    if (report.errors.length > 0) {
      console.warn(`[SEED:PYQ] Warnings encountered during import:`, report.errors.slice(0, 5));
    }

    if (dryRun) {
      console.log(`[SEED:PYQ] DRY RUN: Validated ${report.validQuestions} PYQs successfully.`);
      return result;
    }

    console.log(`[SEED:PYQ] Successfully seeded ${report.validQuestions} production-grade PYQs.`);
  } catch (err: any) {
    result.errors.push(err.message || String(err));
    console.error(`[SEED:PYQ] Error seeding PYQs:`, err);
  }

  return result;
}
