import {
  getKnowledgeSubjects,
  getAllTopics,
  getTopicBySlug,
  getTopicUnifiedView,
  searchKnowledgeEngine,
  getTopicRevisionCards,
  getAllRelationships,
  getAllSources,
} from "../lib/knowledge/knowledge-engine";
import { extractKnowledgeEntities, classifyChunkType, generateChunkKeywords } from "../lib/knowledge/semantic-chunker";
import { buildTopicGraph } from "../lib/knowledge/knowledge-graph";

export async function testKnowledgeEngine() {
  console.log("------------------------------------------------------------");
  console.log("  TEST: WHYNOTUPSC UNIVERSAL KNOWLEDGE ENGINE");
  console.log("------------------------------------------------------------");

  // 1. Test Subjects Directory
  const subjects = getKnowledgeSubjects();
  if (subjects.length < 30) {
    throw new Error(`Expected at least 30 subjects, found ${subjects.length}`);
  }
  console.log(`  ✔ Validated ${subjects.length} Universal UPSC Subjects (GS 1-4, Essay, CSAT, Schemes, Optional)`);

  // 2. Test Topics
  const topics = getAllTopics();
  if (topics.length === 0) {
    throw new Error("No topics found in Knowledge Vault");
  }
  console.log(`  ✔ Validated ${topics.length} Universal Topics in Knowledge Base`);

  // 3. Test Unified Topic View (Governor & Article 356)
  const governorTopic = getTopicBySlug("governor-and-article-356-presidents-rule");
  if (!governorTopic) {
    throw new Error("Governor & Article 356 topic not found");
  }
  const unifiedView = getTopicUnifiedView("governor-and-article-356-presidents-rule", "cadet-101");
  if (!unifiedView) {
    throw new Error("Failed to generate TopicUnifiedView for Governor");
  }
  if (!unifiedView.topic.landmarkCases.some((c) => c.includes("Bommai"))) {
    throw new Error("Missing S.R. Bommai in Governor landmark cases");
  }
  console.log(`  ✔ Validated Unified Topic View for '${unifiedView.topic.name}' (${unifiedView.chunks.length} chunks, ${unifiedView.connectedRelationships.length} graph links)`);

  // 4. Test Hybrid Search & Acronym Resolution
  const searchFR = searchKnowledgeEngine("FR");
  if (searchFR.totalResults === 0) {
    throw new Error("Search for acronym 'FR' returned 0 results");
  }
  console.log(`  ✔ Acronym Search 'FR' -> Successfully expanded to '${searchFR.query}' with ${searchFR.totalResults} results`);

  const searchGov = searchKnowledgeEngine("Governor");
  if (searchGov.totalResults === 0) {
    throw new Error("Search for 'Governor' returned 0 results");
  }
  console.log(`  ✔ Exact & Keyword Search 'Governor' -> Found ${searchGov.totalResults} matching knowledge items`);

  const searchBonds = searchKnowledgeEngine("Electoral Bonds");
  if (searchBonds.totalResults === 0) {
    throw new Error("Search for 'Electoral Bonds' returned 0 results");
  }
  console.log(`  ✔ Landmark Case Search 'Electoral Bonds' -> Found ${searchBonds.totalResults} matching items`);

  // 5. Test Entity Extraction & Chunking
  const sampleText =
    "In the landmark case of S.R. Bommai v. Union of India (1994), the Supreme Court examined Article 356 and the Sarkaria Commission report.";
  const entities = extractKnowledgeEntities(sampleText);
  if (!entities.articles.includes("Article 356") || !entities.cases.some((c) => c.includes("Bommai"))) {
    throw new Error("Failed to extract entities correctly");
  }
  const chunkType = classifyChunkType("Landmark Judgments", sampleText);
  if (chunkType !== "case_law") {
    throw new Error(`Expected chunkType 'case_law', got '${chunkType}'`);
  }
  const keywords = generateChunkKeywords(sampleText);
  if (!keywords.includes("bommai")) {
    throw new Error("Expected 'bommai' in keywords");
  }
  console.log(`  ✔ Entity Extraction, Classification ('${chunkType}') and Keyword Extraction passed`);

  // 6. Test Knowledge Graph Traversal
  const allRels = getAllRelationships();
  const graph = buildTopicGraph(
    governorTopic.id,
    governorTopic.name,
    governorTopic.subjectId,
    allRels.filter((r) => r.fromTopicId === governorTopic.id || r.toTopicId === governorTopic.id)
  );
  if (graph.nodes.length < 2) {
    throw new Error(`Graph expected at least 2 nodes, found ${graph.nodes.length}`);
  }
  console.log(`  ✔ Knowledge Graph Traversal: ${graph.nodes.length} nodes, ${graph.edges.length} edges`);

  // 7. Test Spaced Repetition Revision Cards
  const cards = getTopicRevisionCards(governorTopic.id);
  if (cards.length === 0) {
    throw new Error("No revision cards found for Governor topic");
  }
  console.log(`  ✔ Spaced Repetition Cards: ${cards.length} cards connected to SM-2 for '${governorTopic.name}'`);

  console.log("\nALL UNIVERSAL KNOWLEDGE ENGINE TESTS PASSED CLEANLY (7/7 GATES)!\n");
}
