/**
 * WHYNOTUPSC — UNIVERSAL UPSC KNOWLEDGE ENGINE TYPE SYSTEM
 * Core domain entities, relationships, search envelopes, and student telemetry.
 */

import { PYQQuestion, MainsPYQQuestion, TestResultRecord } from "@/lib/core/types";

export type TopicLevel =
  | "subject"
  | "syllabus_topic"
  | "subtopic"
  | "microtopic"
  | "concept";

export type ChunkType =
  | "introduction"
  | "definition"
  | "concept"
  | "background"
  | "history"
  | "chronology"
  | "features"
  | "provisions"
  | "constitutional_provision"
  | "article"
  | "amendment"
  | "case_law"
  | "judgment"
  | "committee"
  | "report"
  | "scheme"
  | "policy"
  | "institution"
  | "body"
  | "classification"
  | "types"
  | "causes"
  | "effects"
  | "impact"
  | "challenges"
  | "issues"
  | "criticism"
  | "advantages"
  | "disadvantages"
  | "comparison"
  | "examples"
  | "data"
  | "statistics"
  | "table"
  | "chart"
  | "map"
  | "diagram"
  | "timeline"
  | "current_affairs"
  | "prelims_fact"
  | "mains_dimension"
  | "way_forward"
  | "conclusion"
  | "pyq"
  | "practice";

export type RelationshipType =
  | "related_to"
  | "part_of"
  | "explains"
  | "depends_on"
  | "causes"
  | "effect_of"
  | "contrasts_with"
  | "compares_with"
  | "article_reference"
  | "constitutional_provision"
  | "amendment_reference"
  | "case_law"
  | "judgment_reference"
  | "committee_reference"
  | "report_reference"
  | "scheme_reference"
  | "institution_reference"
  | "current_affairs_reference"
  | "pyq_reference"
  | "example_of"
  | "solution_to"
  | "challenge_to";

export type SourceType =
  | "Standard Book"
  | "NCERT"
  | "Reference Book"
  | "Coaching Notes"
  | "Class Notes"
  | "Personal Notes"
  | "Government Source"
  | "Report"
  | "Committee Report"
  | "Current Affairs"
  | "PYQ"
  | "Mains Notes"
  | "Prelims Notes"
  | "Optional Subject Notes"
  | "Newspaper"
  | "Magazine"
  | "Other";

export type StudentTopicStatus =
  | "Not Started"
  | "Exploring"
  | "Studying"
  | "Practicing"
  | "Revising"
  | "Mastered";

export interface KnowledgeSubject {
  id: string; // e.g. 'indian_polity'
  paperId?: string; // e.g. 'upsc_mains_gs2'
  name: string;
  code: string;
  icon: string;
  color: string;
  description: string;
  totalTopicsCount: number;
  isOptional?: boolean;
}

export interface UniversalTopic {
  id: string;
  subjectId: string;
  paperId?: string;
  name: string;
  slug: string;
  description: string;
  parentTopicId?: string;
  topicLevel: TopicLevel;
  syllabusCode?: string;
  prelimsRelevance: number; // 0 to 1
  mainsRelevance: number;
  optionalRelevance: number;
  importanceScore: number; // 1 to 100
  keyArticles: string[];
  landmarkCases: string[];
  committees: string[];
  constitutionalAmendments: string[];
  keywords: string[];
  aliases: string[];
  summary30s?: string;
  summary2m?: string;
  detailedExplanation?: string;
  challengesAndIssues?: string[];
  wayForward?: string[];
  sourceCount: number;
  pyqCount: number;
  practiceCount: number;
  revisionCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TopicAlias {
  id?: string;
  topicId: string;
  alias: string;
  normalizedAlias: string;
  isAcronym?: boolean;
}

export interface KnowledgeSource {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  publisher?: string;
  edition?: string;
  publicationYear?: number;
  sourceType: SourceType;
  language: string;
  description?: string;
  fileUrl?: string;
  fileSizeBytes?: number;
  totalPages: number;
  nativeTextPages?: number;
  ocrRequiredPages?: number;
  isProcessed: boolean;
  processingStatus: "queued" | "processing" | "completed" | "failed" | "needs_review";
  tags: string[];
  primarySubjectId?: string;
  createdAt?: string;
}

export interface SourcePage {
  id?: string;
  sourceId: string;
  pageNumber: number;
  nativeText?: string;
  ocrText?: string;
  cleanedText: string;
  ocrConfidence: number;
  hasTables: boolean;
  hasCharts: boolean;
  hasDiagrams: boolean;
  headings: string[];
  subheadings: string[];
  needsReview?: boolean;
}

export interface SourceChunk {
  id: string;
  sourceId: string;
  sourceTitle?: string;
  sourceType?: SourceType;
  topicId?: string;
  topicName?: string;
  pageStart: number;
  pageEnd: number;
  heading?: string;
  subheading?: string;
  chunkType: ChunkType;
  rawContent: string;
  cleanedContent: string;
  searchableContent: string;
  keywords: string[];
  entities?: {
    articles?: string[];
    cases?: string[];
    committees?: string[];
    amendments?: string[];
    dates?: string[];
  };
  ocrConfidence: number;
  sourcePosition: number;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

export interface TopicRelationship {
  id?: string;
  fromTopicId: string;
  fromTopicName?: string;
  fromSubjectId?: string;
  toTopicId: string;
  toTopicName?: string;
  toSubjectId?: string;
  relationshipType: RelationshipType;
  relevanceScore: number;
  description?: string;
  evidenceChunkIds?: string[];
  verificationStatus: "AI Suggested" | "Admin Approved" | "Manual";
  createdAt?: string;
}

export interface TopicRevisionCard {
  id: string;
  topicId: string;
  cardType: "flashcard" | "one_liner" | "article_card" | "case_law_card" | "committee_card";
  front: string;
  back: string;
  keyFacts?: string[];
  upscImportance: "High" | "Medium" | "Low";
  sourceRef?: string;
  intervalDays?: number;
  easeFactor?: number;
  repetitionCount?: number;
  lastReviewedAt?: string;
  nextReviewDate?: string;
}

export interface StudentTopicProgress {
  id?: string;
  userId: string;
  topicId: string;
  status: StudentTopicStatus;
  timeSpentSeconds: number;
  pyqsAttempted: number;
  pyqsCorrect: number;
  lastStudiedAt: string;
  masteryPercentage: number;
}

export interface StudentKnowledgeBookmark {
  id?: string;
  userId: string;
  topicId?: string;
  sourceId?: string;
  chunkId?: string;
  noteSnippet?: string;
  createdAt: string;
}

export interface KnowledgeSearchResultItem {
  id: string;
  category: "TOPICS" | "CONCEPTS" | "SOURCE_NOTES" | "PYQS" | "MAINS_QUESTIONS" | "REVISION";
  title: string;
  subject: string;
  topicPath: string;
  relevanceScore: number;
  sourceName?: string;
  pageNumber?: number;
  previewText: string;
  slug?: string;
  meta?: Record<string, unknown>;
}

export interface KnowledgeSearchResponse {
  query: string;
  totalResults: number;
  executionTimeMs: number;
  categories: {
    topics: KnowledgeSearchResultItem[];
    concepts: KnowledgeSearchResultItem[];
    sourceNotes: KnowledgeSearchResultItem[];
    pyqs: KnowledgeSearchResultItem[];
    mains: KnowledgeSearchResultItem[];
    revision: KnowledgeSearchResultItem[];
  };
}

export interface TopicUnifiedView {
  topic: UniversalTopic;
  subject: KnowledgeSubject;
  breadcrumbs: { name: string; slug: string; level: string }[];
  chunks: SourceChunk[];
  sources: { source: KnowledgeSource; pageRanges?: string }[];
  connectedRelationships: TopicRelationship[];
  crossSubjectConnections: TopicRelationship[];
  prelimsPyqs: PYQQuestion[];
  mainsPyqs: MainsPYQQuestion[];
  revisionCards: TopicRevisionCard[];
  studentProgress?: StudentTopicProgress;
}
