import {
  getAllTopics,
  getTopicBySlug,
  getModernHistoryModules,
} from "../lib/knowledge/knowledge-engine";
import {
  MODERN_HISTORY_MODULES,
  MODERN_HISTORY_TOPICS,
  MODERN_HISTORY_RELATIONSHIPS,
  MODERN_HISTORY_REVISION_CARDS,
} from "../lib/knowledge/datasets/modern-history-seed";

export async function runModernHistoryEngineTests() {
  console.log("------------------------------------------------------------");
  console.log("  TEST: MODERN INDIAN HISTORY (1498–1947) MASTER ENGINE");
  console.log("------------------------------------------------------------");

  // 1. Validate all 15 modules
  const modules = getModernHistoryModules();
  if (modules.length !== 15) {
    throw new Error(`Expected 15 Modern History modules, found ${modules.length}`);
  }
  console.log(`  ✔ Validated all ${modules.length} Chronological Modules from 1498 to 1947`);

  // 2. Validate structural integrity of each module
  for (const m of modules) {
    if (!m.id || !m.title || !m.era || !m.summary || !Array.isArray(m.keyTopics) || m.keyTopics.length === 0) {
      throw new Error(`Module ${m.id} has invalid or missing fields`);
    }
    for (const t of m.keyTopics) {
      if (!t.id || !t.title || !Array.isArray(t.keyEvents) || !Array.isArray(t.prelimsTraps) || !Array.isArray(t.mainsPointers)) {
        throw new Error(`Topic ${t.id} in module ${m.id} has invalid fields`);
      }
    }
  }
  console.log(`  ✔ Verified 100% field integrity across all 15 modules and subtopics`);

  // 3. Validate Universal Topics for Modern History
  const historyTopics = getAllTopics("modern_history");
  if (historyTopics.length < 10) {
    throw new Error(`Expected at least 10 universal topics for modern history, found ${historyTopics.length}`);
  }
  console.log(`  ✔ Validated ${historyTopics.length} Universal Modern History Topics registered in Knowledge Engine`);

  // 4. Validate Topic by Slug lookup
  const revoltTopic = getTopicBySlug("the-great-revolt-of-1857-causes-leaders-and-consequences");
  if (!revoltTopic || !revoltTopic.name.includes("1857")) {
    throw new Error("Slug lookup for 1857 Revolt failed");
  }
  console.log(`  ✔ Topic lookup by slug ('the-great-revolt-of-1857-causes-leaders-and-consequences') passed`);

  // 5. Validate Knowledge Graph Relationships
  if (MODERN_HISTORY_RELATIONSHIPS.length < 5) {
    throw new Error(`Expected at least 5 graph relationships, found ${MODERN_HISTORY_RELATIONSHIPS.length}`);
  }
  console.log(`  ✔ Knowledge Graph: ${MODERN_HISTORY_RELATIONSHIPS.length} cross-topic/subject relationships validated`);

  // 6. Validate SM-2 Revision Flashcards
  if (MODERN_HISTORY_REVISION_CARDS.length < 8) {
    throw new Error(`Expected at least 8 revision cards, found ${MODERN_HISTORY_REVISION_CARDS.length}`);
  }
  for (const card of MODERN_HISTORY_REVISION_CARDS) {
    if (!card.id || !card.front || !card.back || !card.keyFacts) {
      throw new Error(`Card ${card.id} has missing fields`);
    }
  }
  console.log(`  ✔ SM-2 Flashcards: ${MODERN_HISTORY_REVISION_CARDS.length} high-yield revision cards verified`);

  console.log("  🟢 All Modern Indian History Engine tests passed!\n");
}
