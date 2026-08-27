import fs from "fs";
import path from "path";

// Ensure target directory exists
const targetDir = path.join(process.cwd(), "data", "syllabus");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log("Creating syllabus directory at:", targetDir);
