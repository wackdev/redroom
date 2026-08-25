import { seedSyllabus, SeedResult } from "./syllabus";
import { seedPYQs } from "./pyqs";
import { seedCurrentAffairs } from "./current-affairs";
import { seedTests } from "./tests";
import { seedMains } from "./mains";
import { seedDevelopment } from "./development";

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");

  console.log(`========================================================`);
  console.log(`  WHYNOTUPSC OS — PRODUCTION DATA SEED & CONTENT PIPELINE`);
  console.log(`  Dry Run: ${isDryRun ? "YES (Validation only)" : "NO (Live Seed)"}`);
  console.log(`========================================================\n`);

  const results: SeedResult[] = [];

  // 1. Syllabus
  results.push(await seedSyllabus(isDryRun));

  // 2. PYQ Database
  results.push(await seedPYQs(isDryRun));

  // 3. Current Affairs Pipeline
  results.push(await seedCurrentAffairs(isDryRun));

  // 4. Test Question Bank
  results.push(await seedTests(isDryRun));

  // 5. Mains Question Bank
  results.push(await seedMains(isDryRun));

  // 6. Development Simulation & Brain Validation
  results.push(await seedDevelopment(isDryRun));

  console.log(`\n========================================================`);
  console.log(`  FINAL SEEDING & VALIDATION SUMMARY`);
  console.log(`========================================================`);
  console.table(
    results.map((r) => ({
      Module: r.module,
      Processed: r.totalProcessed,
      Inserted: r.inserted,
      Updated: r.updated,
      Errors: r.errors.length,
    }))
  );

  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  if (totalErrors > 0) {
    console.error(`\nCompleted with ${totalErrors} errors.`);
    process.exit(1);
  } else {
    console.log(`\nAll production content pipelines & seeders completed with 0 errors!`);
  }
}

void main();
