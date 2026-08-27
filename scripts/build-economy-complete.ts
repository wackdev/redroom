import fs from "fs";
import path from "path";
import { ECONOMY_PART1 } from "./build-economy-part1";
import { ECONOMY_PART2 } from "./build-economy-part2";

const OUT_DIR = path.join(process.cwd(), "data", "pyqs", "prelims");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

export const FULL_ECONOMY = [...ECONOMY_PART1, ...ECONOMY_PART2];

fs.writeFileSync(
  path.join(OUT_DIR, "indian-economy.json"),
  JSON.stringify(FULL_ECONOMY, null, 2),
  "utf-8"
);

console.log(`✓ COMPLETE INDIAN ECONOMY VAULT: Wrote ${FULL_ECONOMY.length} questions across all 14 chapters to data/pyqs/prelims/indian-economy.json`);

// Chapter coverage validation
const chapterCounts: Record<number, number> = {};
for (const q of FULL_ECONOMY) {
  const ch = q.chapterNumber || 0;
  chapterCounts[ch] = (chapterCounts[ch] || 0) + 1;
}

console.log("\nChapter Distribution:");
for (let ch = 1; ch <= 14; ch++) {
  console.log(`  Chapter ${ch.toString().padStart(2, " ")}: ${chapterCounts[ch] || 0} questions`);
}
