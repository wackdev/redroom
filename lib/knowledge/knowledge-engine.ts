/**
 * WHYNOTUPSC — UNIVERSAL KNOWLEDGE ENGINE FAÇADE
 * Central programmatic gateway connecting topics, sources, semantic chunks,
 * knowledge graph, PYQ cross-links, practice generators, and student telemetry.
 */

import {
  KnowledgeSubject,
  UniversalTopic,
  KnowledgeSource,
  SourceChunk,
  TopicRelationship,
  TopicRevisionCard,
  TopicUnifiedView,
  KnowledgeSearchResponse,
  StudentTopicProgress,
} from "./types";
import {
  KNOWLEDGE_SUBJECTS_DATASET,
  CANONICAL_SOURCES_DATASET,
  UNIVERSAL_TOPICS_DATASET,
  KNOWLEDGE_RELATIONSHIPS_DATASET,
  TOPIC_REVISION_CARDS_DATASET,
} from "./datasets/polity-knowledge-seed";
import { POLITY_SOURCE_CHUNKS } from "./datasets/polity-chunks-seed";
import {
  MODERN_HISTORY_TOPICS,
  MODERN_HISTORY_RELATIONSHIPS,
  MODERN_HISTORY_REVISION_CARDS,
  MODERN_HISTORY_MODULES,
} from "./datasets/modern-history-seed";
import {
  ECONOMICS_TOPICS,
  ECONOMICS_RELATIONSHIPS,
  ECONOMICS_REVISION_CARDS,
  ECONOMICS_PILLARS_DATASET,
} from "./datasets/economics-seed";
import { executeKnowledgeSearch } from "./search-engine";
import { STATIC_PYQ_DATASET } from "@/lib/study/pyq-engine";
import { STATIC_MAINS_PYQ_DATASET } from "@/lib/mains-pyq/static-dataset";

// In-Memory mutable registry for runtime expansion and admin operations
let runtimeTopics: UniversalTopic[] = [...UNIVERSAL_TOPICS_DATASET, ...MODERN_HISTORY_TOPICS, ...ECONOMICS_TOPICS];
let runtimeSources: KnowledgeSource[] = [...CANONICAL_SOURCES_DATASET];
let runtimeChunks: SourceChunk[] = [...POLITY_SOURCE_CHUNKS];
let runtimeRelationships: TopicRelationship[] = [
  ...KNOWLEDGE_RELATIONSHIPS_DATASET,
  ...MODERN_HISTORY_RELATIONSHIPS,
  ...ECONOMICS_RELATIONSHIPS,
];
let runtimeCards: TopicRevisionCard[] = [
  ...TOPIC_REVISION_CARDS_DATASET,
  ...MODERN_HISTORY_REVISION_CARDS,
  ...ECONOMICS_REVISION_CARDS,
];
let studentProgressStore: Map<string, StudentTopicProgress> = new Map();

/**
 * Returns all Modern Indian History master modules
 */
export function getModernHistoryModules() {
  return MODERN_HISTORY_MODULES;
}

/**
 * Returns all Indian Economy master thematic pillars
 */
export function getEconomicsMasterPillars() {
  return ECONOMICS_PILLARS_DATASET;
}

/**
 * Returns all active UPSC knowledge subjects
 */
export function getKnowledgeSubjects(): KnowledgeSubject[] {
  return KNOWLEDGE_SUBJECTS_DATASET;
}

/**
 * Returns a specific knowledge subject
 */
export function getKnowledgeSubject(subjectId: string): KnowledgeSubject | undefined {
  return KNOWLEDGE_SUBJECTS_DATASET.find((s) => s.id === subjectId);
}

/**
 * Returns all topics, optionally filtered by subjectId
 */
export function getAllTopics(subjectId?: string): UniversalTopic[] {
  if (!subjectId) return runtimeTopics;
  return runtimeTopics.filter((t) => t.subjectId === subjectId);
}

/**
 * Returns a topic by its unique slug
 */
export function getTopicBySlug(slug: string): UniversalTopic | undefined {
  const normalized = slug.trim().toLowerCase();
  return runtimeTopics.find((t) => t.slug.toLowerCase() === normalized || t.id.toLowerCase() === normalized);
}

/**
 * Returns all sources in the vault
 */
export function getAllSources(): KnowledgeSource[] {
  return runtimeSources;
}

/**
 * Returns a specific source by ID
 */
export function getSourceById(sourceId: string): KnowledgeSource | undefined {
  return runtimeSources.find((s) => s.id === sourceId);
}

/**
 * Returns all knowledge graph relationships
 */
export function getAllRelationships(): TopicRelationship[] {
  return runtimeRelationships;
}

/**
 * Returns all semantic chunks for a topic or source
 */
export function getSourceChunks(filter?: { topicId?: string; sourceId?: string }): SourceChunk[] {
  if (!filter) return runtimeChunks;
  return runtimeChunks.filter((c) => {
    if (filter.topicId && c.topicId !== filter.topicId) return false;
    if (filter.sourceId && c.sourceId !== filter.sourceId) return false;
    return true;
  });
}

/**
 * Returns revision flashcards for a specific topic
 */
export function getTopicRevisionCards(topicId: string): TopicRevisionCard[] {
  return runtimeCards.filter((card) => card.topicId === topicId);
}

/**
 * Constructs the authoritative, interconnected 360-degree Unified View for any Topic
 */
export function getTopicUnifiedView(slug: string, userId: string = "guest-cadet"): TopicUnifiedView | null {
  const topic = getTopicBySlug(slug);
  if (!topic) return null;

  const subject = getKnowledgeSubject(topic.subjectId) || {
    id: topic.subjectId,
    name: "General Studies",
    code: "GS",
    icon: "📚",
    color: "#3B82F6",
    description: "General Studies Module",
    totalTopicsCount: 1,
  };

  // Breadcrumbs
  const breadcrumbs = [
    { name: "Knowledge Vault", slug: "/knowledge", level: "vault" },
    { name: subject.name, slug: `/knowledge?subject=${subject.id}`, level: "subject" },
    { name: topic.name, slug: `/knowledge/${subject.id}/${topic.slug}`, level: "topic" },
  ];

  // Chunks & Sources
  const chunks = runtimeChunks.filter((c) => c.topicId === topic.id);
  const relevantSourceIds = Array.from(new Set(chunks.map((c) => c.sourceId)));
  const sources = relevantSourceIds.map((sid) => {
    const src = getSourceById(sid) || {
      id: sid,
      title: "UPSC Standard Reference",
      author: "Expert Faculty",
      sourceType: "Standard Book" as const,
      language: "English",
      totalPages: 100,
      isProcessed: true,
      processingStatus: "completed" as const,
      tags: [],
    };
    const topicChunks = chunks.filter((c) => c.sourceId === sid);
    const minPage = Math.min(...topicChunks.map((c) => c.pageStart), 1);
    const maxPage = Math.max(...topicChunks.map((c) => c.pageEnd), 1);
    return {
      source: src,
      pageRanges: topicChunks.length > 0 ? `Pages ${minPage}–${maxPage}` : undefined,
    };
  });

  // Relationships
  const connectedRelationships = runtimeRelationships.filter(
    (r) => r.fromTopicId === topic.id || r.toTopicId === topic.id
  );
  const crossSubjectConnections = connectedRelationships.filter(
    (r) =>
      (r.fromTopicId === topic.id && r.toSubjectId && r.toSubjectId !== topic.subjectId) ||
      (r.toTopicId === topic.id && r.fromSubjectId && r.fromSubjectId !== topic.subjectId)
  );

  // Prelims PYQs
  const searchKeywords = [topic.name, ...(topic.keywords || []), ...(topic.aliases || [])].map((k) =>
    k.toLowerCase()
  );
  const prelimsPyqs = STATIC_PYQ_DATASET.filter((pyq) => {
    const pyqText = `${pyq.question} ${pyq.topic} ${pyq.explanation}`.toLowerCase();
    return searchKeywords.some((kw) => pyqText.includes(kw));
  }).slice(0, 10);

  // Mains PYQs
  const mainsPyqs = STATIC_MAINS_PYQ_DATASET.filter((m) => {
    const mText = `${m.question} ${m.topic} ${m.subject}`.toLowerCase();
    return searchKeywords.some((kw) => mText.includes(kw));
  }).slice(0, 8);

  // Revision Cards
  const revisionCards = getTopicRevisionCards(topic.id);

  // Student Telemetry
  const progressKey = `${userId}:${topic.id}`;
  const studentProgress = studentProgressStore.get(progressKey) || {
    userId,
    topicId: topic.id,
    status: "Exploring",
    timeSpentSeconds: 0,
    pyqsAttempted: 0,
    pyqsCorrect: 0,
    lastStudiedAt: new Date().toISOString(),
    masteryPercentage: 25,
  };

  return {
    topic,
    subject,
    breadcrumbs,
    chunks,
    sources,
    connectedRelationships,
    crossSubjectConnections,
    prelimsPyqs,
    mainsPyqs,
    revisionCards,
    studentProgress,
  };
}

/**
 * Universal Search across the entire Knowledge Engine
 */
export function searchKnowledgeEngine(query: string): KnowledgeSearchResponse {
  return executeKnowledgeSearch(query, runtimeTopics, runtimeChunks);
}

/**
 * Updates a student's topic engagement telemetry
 */
export function updateStudentTopicProgress(
  userId: string,
  topicId: string,
  updates: Partial<StudentTopicProgress>
): StudentTopicProgress {
  const key = `${userId}:${topicId}`;
  const existing = studentProgressStore.get(key) || {
    userId,
    topicId,
    status: "Studying",
    timeSpentSeconds: 0,
    pyqsAttempted: 0,
    pyqsCorrect: 0,
    lastStudiedAt: new Date().toISOString(),
    masteryPercentage: 0,
  };

  const updated: StudentTopicProgress = {
    ...existing,
    ...updates,
    lastStudiedAt: new Date().toISOString(),
  };

  studentProgressStore.set(key, updated);
  return updated;
}

/**
 * Ingestion: Adds a new source and registers its semantic chunks
 */
export function ingestSourceIntoEngine(source: KnowledgeSource, chunks: SourceChunk[]) {
  runtimeSources = [source, ...runtimeSources.filter((s) => s.id !== source.id)];
  runtimeChunks = [...chunks, ...runtimeChunks.filter((c) => c.sourceId !== source.id)];
}

/**
 * Admin: Adds or updates a topic in the universal topic registry
 */
export function saveTopic(topic: UniversalTopic) {
  runtimeTopics = [topic, ...runtimeTopics.filter((t) => t.id !== topic.id)];
}

/**
 * Admin: Adds or updates a relationship in the knowledge graph
 */
export function saveRelationship(relationship: TopicRelationship) {
  runtimeRelationships = [
    relationship,
    ...runtimeRelationships.filter(
      (r) =>
        !(
          r.fromTopicId === relationship.fromTopicId &&
          r.toTopicId === relationship.toTopicId &&
          r.relationshipType === relationship.relationshipType
        )
    ),
  ];
}
