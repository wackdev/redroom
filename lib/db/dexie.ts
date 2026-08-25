import Dexie, { type Table } from "dexie";
import {
  UserProfile,
  DayPlan,
  StudyTask,
  NoteItem,
  TestResultRecord,
  SyllabusProgressRecord,
  RevisionItem,
} from "../core/types";
import {
  UniversalTopic,
  KnowledgeSource,
  SourceChunk,
  TopicRelationship,
  TopicRevisionCard,
  StudentTopicProgress,
} from "../knowledge/types";

// ============================================================================
// OUTBOX ENTITY TYPES
// ============================================================================

export type OutboxEntityType =
  | "study_plans"
  | "study_tasks"
  | "notes"
  | "test_results"
  | "syllabus_progress"
  | "revision_items"
  | "pyq_progress"
  | "pyq_attempts"
  | "profiles"
  | "student_topic_progress";

export type OutboxAction = "INSERT" | "UPDATE" | "DELETE" | "UPSERT";

export interface SyncOutboxItem {
  id?: number;
  entityType: OutboxEntityType;
  action: OutboxAction;
  entityId: string | number;
  payload: Record<string, unknown>;
  status: "pending" | "processing" | "failed" | "synced";
  retryCount: number;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalPYQProgress {
  id: string;
  userId: string;
  pyqId: number | string;
  completed: boolean;
  updatedAt: string;
}

export interface LocalPYQAttempt {
  id: string;
  userId: string;
  pyqId: number | string;
  selectedOption: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  mistakeType?: string;
  notes?: string;
  attemptedAt: string;
}

// ============================================================================
// DEXIE DATABASE DEFINITION
// ============================================================================

export class RedroomDexieDB extends Dexie {
  profiles!: Table<UserProfile, string>;
  study_plans!: Table<DayPlan, string>;
  study_tasks!: Table<StudyTask, string>;
  notes!: Table<NoteItem, string>;
  test_results!: Table<TestResultRecord, number>;
  syllabus_progress!: Table<SyllabusProgressRecord, string>;
  revision_items!: Table<RevisionItem, string>;
  pyq_progress!: Table<LocalPYQProgress, string>;
  pyq_attempts!: Table<LocalPYQAttempt, string>;
  sync_outbox!: Table<SyncOutboxItem, number>;

  // Knowledge Engine Tables
  topics!: Table<UniversalTopic, string>;
  sources!: Table<KnowledgeSource, string>;
  source_chunks!: Table<SourceChunk, string>;
  topic_relationships!: Table<TopicRelationship, string>;
  topic_revision_cards!: Table<TopicRevisionCard, string>;
  student_topic_progress!: Table<StudentTopicProgress, string>;

  constructor() {
    super("redroom_dexie_db");

    this.version(1).stores({
      profiles: "id, email, updatedAt",
      study_plans: "id, planDate, userId, updatedAt",
      study_tasks: "id, planDate, userId, completed, updatedAt",
      notes: "id, userId, subject, topic, updatedAt",
      test_results: "++id, userId, date, createdAt",
      syllabus_progress: "id, userId, topicId, completed, updatedAt",
      revision_items: "id, userId, topicId, nextReviewDate, updatedAt",
      pyq_progress: "id, userId, pyqId, completed, updatedAt",
      pyq_attempts: "id, userId, pyqId, isCorrect, attemptedAt",
      sync_outbox: "++id, entityType, action, entityId, status, retryCount, createdAt, updatedAt",
    });

    this.version(2).stores({
      profiles: "id, email, updatedAt",
      study_plans: "id, planDate, userId, updatedAt",
      study_tasks: "id, planDate, userId, completed, updatedAt",
      notes: "id, userId, subject, topic, updatedAt",
      test_results: "++id, userId, date, createdAt",
      syllabus_progress: "id, userId, topicId, completed, updatedAt",
      revision_items: "id, userId, topicId, nextReviewDate, updatedAt",
      pyq_progress: "id, userId, pyqId, completed, updatedAt",
      pyq_attempts: "id, userId, pyqId, isCorrect, attemptedAt",
      sync_outbox: "++id, entityType, action, entityId, status, retryCount, createdAt, updatedAt",
      // New Knowledge tables
      topics: "id, slug, subjectId, parentTopicId, importanceScore, topicLevel",
      sources: "id, title, sourceType, primarySubjectId, isProcessed",
      source_chunks: "id, sourceId, topicId, chunkType, pageStart",
      topic_relationships: "++id, fromTopicId, toTopicId, relationshipType",
      topic_revision_cards: "id, topicId, cardType, upscImportance",
      student_topic_progress: "++id, userId, topicId, status, lastStudiedAt",
    });
  }
}

// Singleton Database Instance
export const dexieDb = new RedroomDexieDB();

// ============================================================================
// ATOMIC OUTBOX MUTATION TRANSACTION
// ============================================================================

/**
 * Atomically mutates the local Dexie table and appends a pending task to sync_outbox.
 * Guarantees zero data loss if network drops or browser crashes mid-mutation.
 */
export async function mutateWithOutbox<T extends Record<string, unknown>>(params: {
  entityType: OutboxEntityType;
  action: OutboxAction;
  entityId: string | number;
  data: T;
}): Promise<void> {
  const { entityType, action, entityId, data } = params;
  const now = new Date().toISOString();

  // Cast entityId appropriately to avoid Dexie primary key DataError
  const typedEntityId = entityType === "test_results" ? Number(entityId) : String(entityId);

  await dexieDb.transaction("rw", [dexieDb.table(entityType), dexieDb.sync_outbox], async () => {
    const table = dexieDb.table(entityType);

    if (action === "DELETE") {
      await table.delete(typedEntityId as any);
    } else if (action === "INSERT" || action === "UPSERT" || action === "UPDATE") {
      await table.put(data as any);
    }

    // Append mutation to sync_outbox queue
    const outboxItem: SyncOutboxItem = {
      entityType,
      action,
      entityId: typedEntityId,
      payload: data,
      status: "pending",
      retryCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    await dexieDb.sync_outbox.add(outboxItem);
  });
}
