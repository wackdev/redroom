/**
 * WHYNOTUPSC OS Automated Test Suite Runner
 * Executes all unit and integration tests across core engines
 */

import { runBrainScoringTests } from "../../tests/brain-scoring.test";
import { runSpacedRepetitionTests } from "../../tests/spaced-repetition.test";
import { runFocusTimerTests } from "../../tests/focus-timer.test";
import { runEliminationEngineTests } from "../../tests/elimination-engine.test";
import { runStudyPlanTests } from "../../tests/study-plan.test";
import { testKnowledgeEngine } from "../../tests/knowledge-engine.test";
import { runQuotesEngineTests } from "../../tests/quotes-engine.test";
import { runModernHistoryEngineTests } from "../../tests/modern-history-engine.test";
import { runEconomicsEngineTests } from "../../tests/economics-engine.test";
import { runPrelimsTaxonomyTests } from "../../tests/pyq-taxonomy.test";

async function runAllSuites() {
  console.log("=================================================");
  console.log("🚀 STARTING WHYNOTUPSC PRODUCTION TEST RUNNER");
  console.log("=================================================\n");

  const startTime = Date.now();
  let passedSuites = 0;
  let failedSuites = 0;

  const suites = [
    { name: "Brain Readiness & Scoring Engine", fn: runBrainScoringTests },
    { name: "SM-2 Spaced Repetition Engine", fn: runSpacedRepetitionTests },
    { name: "Focus Sanctuary & Timer Accuracy Engine", fn: runFocusTimerTests },
    { name: "Prelims Elimination & Trap Diagnosis Engine", fn: runEliminationEngineTests },
    { name: "Study Plan & Adaptive Task Engine", fn: runStudyPlanTests },
    { name: "Universal UPSC Knowledge Engine & Graph", fn: testKnowledgeEngine },
    { name: "UPSC CSE Mains Quotes & Thinkers Vault Engine", fn: runQuotesEngineTests },
    { name: "Modern Indian History (1498–1947) Master Engine", fn: runModernHistoryEngineTests },
    { name: "Indian Economy & Macroeconomics Master Engine", fn: runEconomicsEngineTests },
    { name: "UPSC Prelims 126-Chapter Taxonomy & PDF Ingestion Engine", fn: runPrelimsTaxonomyTests },
  ];

  for (const suite of suites) {
    try {
      await suite.fn();
      passedSuites++;
      console.log(`  ✨ [PASS] ${suite.name}\n`);
    } catch (err) {
      failedSuites++;
      console.error(`  ❌ [FAIL] ${suite.name}:`, err);
      console.log("\n");
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log("=================================================");
  console.log(`🏁 TEST SUITE COMPLETE: ${passedSuites}/${suites.length} SUITES PASSED in ${duration}s`);
  if (failedSuites > 0) {
    console.log(`⚠️  ${failedSuites} SUITES FAILED`);
    process.exit(1);
  } else {
    console.log("🟢 ALL PRODUCTION TEST SUITES PASSED CLEANLY!");
    console.log("=================================================\n");
  }
}

void runAllSuites();
