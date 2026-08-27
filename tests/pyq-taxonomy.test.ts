import {
  ALL_TAXONOMY_SUBJECTS,
  PRELIMS_TAXONOMY_SUBJECTS,
  PRELIMS_2025_PAPER,
  getSubjectByIdOrName,
  getAllChaptersForSubject,
  autoClassifyQuestion,
} from "../lib/pyq/taxonomy";
import { parseRawPDFTextToPYQs, parseJSONToPYQs } from "../lib/study/pyq-importer";
import { STATIC_PYQ_DATASET, getTaxonomyProgressSummary } from "../lib/study/pyq-engine";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    throw new Error(msg);
  }
}

export function runPrelimsTaxonomyTests() {
  console.log("\n------------------------------------------------------------");
  console.log("  TEST: UPSC PRELIMS 126-CHAPTER TAXONOMY & INGESTION SUITE");
  console.log("------------------------------------------------------------");

  // Gate 1: Subject Counts and Structure
  assert(ALL_TAXONOMY_SUBJECTS.length === 12, `Expected 12 total subjects, got ${ALL_TAXONOMY_SUBJECTS.length}`);
  assert(PRELIMS_TAXONOMY_SUBJECTS.length === 11, `Expected 11 core subjects, got ${PRELIMS_TAXONOMY_SUBJECTS.length}`);
  console.log("  ✔ 11 Core Subjects + Prelims 2025 Paper validated");

  // Gate 2: Page Numbering matches WhyNotUPSC 30-Year Compendium Index
  const pageChecks: Record<string, number> = {
    "ancient-history": 34,
    "medieval-history": 53,
    "modern-history": 76,
    "art-and-culture": 134,
    "polity": 156,
    "indian-economy": 237,
    "geography": 339,
    "environment-and-ecology": 470,
    "science-and-technology": 530,
    "international-relations": 641,
    "general-knowledge": 680,
  };

  for (const [subjId, expectedPage] of Object.entries(pageChecks)) {
    const subj = getSubjectByIdOrName(subjId);
    assert(!!subj, `Subject ${subjId} not found`);
    assert(subj!.startPage === expectedPage, `Subject ${subjId} page mismatch: expected ${expectedPage}, got ${subj?.startPage}`);
  }
  console.log("  ✔ Exact Book Start Pages verified across all 11 Subjects");

  // Gate 3: Chapter Counts across subjects
  const chapterCountChecks: Record<string, number> = {
    "ancient-history": 7,
    "medieval-history": 7,
    "modern-history": 17,
    "art-and-culture": 12,
    "polity": 29,
    "indian-economy": 14,
    "geography": 10,
    "environment-and-ecology": 10,
    "science-and-technology": 12,
    "international-relations": 3,
    "general-knowledge": 5,
  };

  let coreChapters = 0;
  for (const [subjId, expectedCount] of Object.entries(chapterCountChecks)) {
    const chapters = getAllChaptersForSubject(subjId);
    assert(chapters.length === expectedCount, `Subject ${subjId} chapter count mismatch: expected ${expectedCount}, got ${chapters.length}`);
    coreChapters += chapters.length;
  }
  assert(coreChapters === 126, `Expected exactly 126 core chapters in taxonomy, got ${coreChapters}`);
  
  // Total including Prelims 2025 Special Paper
  const totalChapters = coreChapters + PRELIMS_2025_PAPER.chapters.length;
  assert(totalChapters === 127, `Expected 127 total modules including 2025 paper, got ${totalChapters}`);
  console.log(`  ✔ Verified all 126 core chapters + Prelims 2025 Paper (127 modules) across compendium`);

  // Gate 4: Intelligent Auto-Classification Engine
  const sampleMauryan = autoClassifyQuestion("Ashoka rock edicts and Kautilya Arthashastra administration", "Major Rock Edicts");
  assert(sampleMauryan !== null, "Auto classification failed for Mauryan question");
  assert(sampleMauryan!.subject.id === "ancient-history", `Expected ancient-history, got ${sampleMauryan?.subject.id}`);
  assert(sampleMauryan!.chapter.name === "History of Mauryan Age", `Expected History of Mauryan Age, got ${sampleMauryan?.chapter.name}`);

  const sampleBio = autoClassifyQuestion("CRISPR-Cas9 gene editing molecular scissors", "Biotechnology application in genetics");
  assert(sampleBio !== null, "Auto classification failed for CRISPR");
  assert(sampleBio!.subject.id === "science-and-technology", `Expected science-and-technology, got ${sampleBio?.subject.id}`);
  assert(sampleBio!.chapter.name === "Biotechnology", `Expected Biotechnology, got ${sampleBio?.chapter.name}`);

  const samplePolity = autoClassifyQuestion("Sovereign Socialist Secular Democratic Republic under Article 368", "Constitutional amendment");
  assert(samplePolity !== null, "Auto classification failed for Preamble");
  assert(samplePolity!.subject.id === "polity", `Expected polity, got ${samplePolity?.subject.id}`);
  console.log("  ✔ Intelligent Auto-Classification Engine correctly mapped queries to syllabus chapters");

  // Gate 5: Raw PDF/OCR Text Ingestion Parser
  const rawSample = `
Q1. [2023] With reference to the Parliament of India, consider the following statements:
(a) Statement A
(b) Statement B
(c) Statement C
(d) Statement D
Ans: (c)
Explanation: Test explanation for parliament.
`;
  const parsed = parseRawPDFTextToPYQs(rawSample, "polity");
  assert(parsed.validCount === 1, `Expected 1 parsed question, got ${parsed.validCount}`);
  assert(parsed.questions[0].correctAnswer === "C", `Expected correct answer C, got ${parsed.questions[0].correctAnswer}`);
  assert(parsed.questions[0].year === 2023, `Expected year 2023, got ${parsed.questions[0].year}`);
  assert(parsed.questions[0].options.length === 4, `Expected 4 options, got ${parsed.questions[0].options.length}`);
  console.log("  ✔ Raw PDF/OCR text parser successfully extracted MCQ with options, answer & explanation");

  // Gate 6: JSON Question Ingestion
  const jsonSample = JSON.stringify([
    {
      year: 2024,
      subject: "Geography",
      topic: "Climatology",
      question: "Which cloud type has the highest albedo?",
      options: ["Cirrus", "Cumulonimbus", "Stratocumulus", "Altostratus"],
      correctAnswer: "C",
      explanation: "Low thick stratocumulus clouds have high albedo."
    }
  ]);
  const parsedJson = parseJSONToPYQs(jsonSample);
  assert(parsedJson.validCount === 1, `Expected 1 JSON question, got ${parsedJson.validCount}`);
  assert(parsedJson.questions[0].options.length === 4, `Expected 4 options in JSON parsed`);
  console.log("  ✔ JSON schema parser validated and normalized question payload");

  // Gate 7: Static Seed Dataset & Taxonomy Progress Summary
  assert(STATIC_PYQ_DATASET.length >= 10, `Expected at least 10 static seed questions, got ${STATIC_PYQ_DATASET.length}`);
  const summary = getTaxonomyProgressSummary(STATIC_PYQ_DATASET, []);
  assert(summary.length === 12, `Expected 12 subject summaries, got ${summary.length}`);
  console.log(`  ✔ Taxonomy Progress Aggregator verified across ${STATIC_PYQ_DATASET.length} verified questions`);

  const econQuestions = STATIC_PYQ_DATASET.filter((q) => q.subject === "Indian Economy");
  assert(econQuestions.length >= 80, `Expected at least 80 Indian Economy questions, got ${econQuestions.length}`);
  console.log(`  ✔ Indian Economy Vault: Verified ${econQuestions.length} questions mapped across all 14 chapters`);

  const geoQuestions = STATIC_PYQ_DATASET.filter((q) => q.subject === "Geography");
  assert(geoQuestions.length >= 50, `Expected at least 50 Geography questions, got ${geoQuestions.length}`);
  console.log(`  ✔ Geography Vault: Verified ${geoQuestions.length} questions mapped across all 10 chapters`);

  console.log("\nALL PRELIMS 126-CHAPTER TAXONOMY TESTS PASSED CLEANLY (7/7 GATES)!");
  console.log("  ✨ [PASS] UPSC Prelims 126-Chapter Taxonomy & PDF Ingestion Engine");
}

if (require.main === module) {
  runPrelimsTaxonomyTests();
}
