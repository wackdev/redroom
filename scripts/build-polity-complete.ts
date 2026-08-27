import fs from "fs";
import path from "path";
import { POLITY_PART1 } from "./build-polity-part1";
import { POLITY_PART2 } from "./build-polity-part2";

const OUT_DIR = path.join(process.cwd(), "data", "pyqs", "prelims");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const FULL_POLITY = [...POLITY_PART1, ...POLITY_PART2];

fs.writeFileSync(
  path.join(OUT_DIR, "polity.json"),
  JSON.stringify(FULL_POLITY, null, 2),
  "utf-8"
);

console.log(`✓ COMPLETE POLITY VAULT: Wrote ${FULL_POLITY.length} questions across all 29 chapters to data/pyqs/prelims/polity.json`);
