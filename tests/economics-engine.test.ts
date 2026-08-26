import {
  getAllTopics,
  getTopicBySlug,
  getEconomicsMasterPillars,
} from "../lib/knowledge/knowledge-engine";
import {
  ECONOMICS_PILLARS_DATASET,
  ECONOMICS_TOPICS,
  ECONOMICS_RELATIONSHIPS,
  ECONOMICS_REVISION_CARDS,
} from "../lib/knowledge/datasets/economics-seed";

export async function runEconomicsEngineTests() {
  console.log("------------------------------------------------------------");
  console.log("  TEST: INDIAN ECONOMY & MACROECONOMICS MASTER ENGINE");
  console.log("------------------------------------------------------------");

  // 1. Validate all 10 pillars
  const pillars = getEconomicsMasterPillars();
  if (pillars.length !== 10) {
    throw new Error(`Expected 10 Economics Pillars, found ${pillars.length}`);
  }
  console.log(`  ✔ Validated all ${pillars.length} Thematic Pillars covering 33 Master Lectures`);

  // 2. Validate structural integrity of each pillar and topic
  for (const p of pillars) {
    if (!p.id || !p.title || !p.theme || !p.summary || !Array.isArray(p.keyTopics) || p.keyTopics.length === 0) {
      throw new Error(`Pillar ${p.id} has invalid or missing fields`);
    }
    for (const t of p.keyTopics) {
      if (!t.id || !t.title || !Array.isArray(t.keyConcepts) || !Array.isArray(t.prelimsTraps) || !Array.isArray(t.mainsPointers)) {
        throw new Error(`Topic ${t.id} in pillar ${p.id} has invalid fields`);
      }
    }
  }
  console.log(`  ✔ Verified 100% field integrity across all 10 pillars and subtopics`);

  // 3. Validate Universal Topics for Indian Economy
  const economyTopics = getAllTopics("indian_economy");
  if (economyTopics.length < 10) {
    throw new Error(`Expected at least 10 universal topics for Indian Economy, found ${economyTopics.length}`);
  }
  console.log(`  ✔ Validated ${economyTopics.length} Universal Economics Topics registered in Knowledge Engine`);

  // 4. Validate Topic by Slug lookups
  const inflationTopic = getTopicBySlug("inflation-dynamics-price-indices-cpi-wpi-fit");
  if (!inflationTopic || !inflationTopic.name.includes("Inflation")) {
    throw new Error("Slug lookup for Inflation failed");
  }
  const fiscalTopic = getTopicBySlug("fiscal-policy-budgetary-deficits-frbm-finance-commission");
  if (!fiscalTopic || !fiscalTopic.name.includes("Fiscal")) {
    throw new Error("Slug lookup for Fiscal Policy failed");
  }
  console.log(`  ✔ Topic lookup by slug ('inflation-dynamics-price-indices-cpi-wpi-fit' & 'fiscal-policy-budgetary-deficits-frbm-finance-commission') passed`);

  // 5. Validate Knowledge Graph Relationships
  if (ECONOMICS_RELATIONSHIPS.length < 5) {
    throw new Error(`Expected at least 5 graph relationships, found ${ECONOMICS_RELATIONSHIPS.length}`);
  }
  console.log(`  ✔ Knowledge Graph: ${ECONOMICS_RELATIONSHIPS.length} cross-topic/subject relationships validated`);

  // 6. Validate SM-2 Revision Flashcards
  if (ECONOMICS_REVISION_CARDS.length < 8) {
    throw new Error(`Expected at least 8 revision cards, found ${ECONOMICS_REVISION_CARDS.length}`);
  }
  for (const card of ECONOMICS_REVISION_CARDS) {
    if (!card.id || !card.front || !card.back || !card.keyFacts) {
      throw new Error(`Card ${card.id} has missing fields`);
    }
  }
  console.log(`  ✔ SM-2 Flashcards: ${ECONOMICS_REVISION_CARDS.length} high-yield revision cards verified`);

  console.log("  🟢 All Indian Economy & Macroeconomics Engine tests passed!\n");
}
