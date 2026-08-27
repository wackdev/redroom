import fs from "fs";
import path from "path";
import { GEOGRAPHY_PART1 } from "./build-geography-part1";
import { GEOGRAPHY_PART2 } from "./build-geography-part2";

const OUT_DIR = path.join(process.cwd(), "data", "pyqs", "prelims");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

export const FULL_GEOGRAPHY = [...GEOGRAPHY_PART1, ...GEOGRAPHY_PART2];

fs.writeFileSync(
  path.join(OUT_DIR, "geography.json"),
  JSON.stringify(FULL_GEOGRAPHY, null, 2),
  "utf-8"
);

console.log(`✓ COMPLETE GEOGRAPHY VAULT: Wrote ${FULL_GEOGRAPHY.length} questions across all 10 chapters to data/pyqs/prelims/geography.json`);

// Chapter coverage validation
const chapterCounts: Record<number, number> = {};
for (const q of FULL_GEOGRAPHY) {
  const ch = q.chapterNumber || 0;
  chapterCounts[ch] = (chapterCounts[ch] || 0) + 1;
}

console.log("\nChapter Distribution:");
for (let ch = 1; ch <= 10; ch++) {
  console.log(`  Chapter ${ch.toString().padStart(2, " ")}: ${chapterCounts[ch] || 0} questions`);
}
