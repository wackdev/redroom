"use client";

import { dexieDb, SyncOutboxItem } from "../db/dexie";
import { broadcastSyncChange, SyncEntityType } from "./sync-engine";

export interface SyncDispatcherConfig {
  maxBatchSize: number;
  maxRetries: number;
  baseBackoffMs: number;
  pollIntervalMs: number;
}

const DEFAULT_CONFIG: SyncDispatcherConfig = {
  maxBatchSize: 25,
  maxRetries: 5,
  baseBackoffMs: 1500,
  pollIntervalMs: 15000,
};

class SyncDispatcher {
  private isProcessing = false;
  private timer: NodeJS.Timeout | null = null;
  private config: SyncDispatcherConfig;

  constructor(config: Partial<SyncDispatcherConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initializes background sync listeners (online events, tab focus, periodic interval).
   */
  public start(): void {
    if (typeof window === "undefined") return;

    // Listen to online events for immediate reconnect sync
    window.addEventListener("online", () => {
      this.flushOutbox();
    });

    // Listen to document visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        this.flushOutbox();
      }
    });

    // Start background polling timer
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.flushOutbox();
      }, this.config.pollIntervalMs);
    }

    // Immediate initial sync
    this.flushOutbox();
  }

  /**
   * Stops background polling.
   */
  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Processes all pending and retriable failed items in the sync_outbox.
   * Uses Web Locks API to prevent multi-tab concurrency race conditions.
   */
  public async flushOutbox(): Promise<{ processed: number; errors: number }> {
    if (typeof window !== "undefined" && !navigator.onLine) {
      return { processed: 0, errors: 0 };
    }

    // Use Web Locks API if supported to ensure single-tab outbox processing
    if (typeof navigator !== "undefined" && "locks" in navigator) {
      return navigator.locks.request("sync_outbox_lock", { ifAvailable: true }, async (lock) => {
        if (!lock) {
          // Another tab is actively flushing the outbox
          return { processed: 0, errors: 0 };
        }
        return this.executeFlush();
      });
    }

    return this.executeFlush();
  }

  /**
   * Core Outbox Processing Engine
   */
  private async executeFlush(): Promise<{ processed: number; errors: number }> {
    if (this.isProcessing) {
      return { processed: 0, errors: 0 };
    }

    this.isProcessing = true;
    let processedCount = 0;
    let errorCount = 0;

    try {
      const now = Date.now();

      // Query pending and retriable items with true exponential backoff filter
      const pendingItems = await dexieDb.sync_outbox
        .where("status")
        .anyOf(["pending", "failed"])
        .filter((item) => {
          if (item.retryCount >= this.config.maxRetries) return false;
          if (item.retryCount === 0) return true;

          // Exponential backoff: baseBackoffMs * 2^(retryCount - 1)
          const backoffDelay = this.config.baseBackoffMs * Math.pow(2, item.retryCount - 1);
          const timeSinceUpdate = now - new Date(item.updatedAt).getTime();
          return timeSinceUpdate >= backoffDelay;
        })
        .limit(this.config.maxBatchSize)
        .toArray();

      if (pendingItems.length === 0) {
        this.isProcessing = false;
        return { processed: 0, errors: 0 };
      }

      // Mark items as processing
      const itemIds = pendingItems.map((i) => i.id!).filter(Boolean);
      await dexieDb.sync_outbox.where("id").anyOf(itemIds).modify({
        status: "processing",
        updatedAt: new Date().toISOString(),
      });

      // Send to /api/sync endpoint
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch: pendingItems.map((item) => ({
            id: item.id,
            entityType: item.entityType,
            action: item.action,
            entityId: item.entityId,
            payload: item.payload,
            createdAt: item.createdAt,
          })),
        }),
      });

      if (response.ok) {
        // Successfully synced — mark as synced (cleanupLocalDatabase will prune after retention window)
        await dexieDb.sync_outbox.where("id").anyOf(itemIds).modify({
          status: "synced",
          updatedAt: new Date().toISOString(),
        });
        processedCount = pendingItems.length;

        // Broadcast sync to other tabs
        const entityTypes = new Set<string>(pendingItems.map((p) => p.entityType));
        for (const type of entityTypes) {
          broadcastSyncChange(this.mapToSyncEntityType(type));
        }
      } else {
        const errorText = await response.text().catch(() => "HTTP Sync Error");
        throw new Error(`Sync API responded with status ${response.status}: ${errorText}`);
      }
    } catch (err: unknown) {
      errorCount++;
      const errorMessage = err instanceof Error ? err.message : "Sync Dispatcher Exception";

      // On failure, update retry count and status with exponential backoff
      try {
        const processingItems = await dexieDb.sync_outbox
          .where("status")
          .equals("processing")
          .toArray();

        let sentAlertForBatch = false;

        for (const item of processingItems) {
          if (item.id) {
            const nextRetry = item.retryCount + 1;
            await dexieDb.sync_outbox.update(item.id, {
              status: "failed",
              retryCount: nextRetry,
              lastError: errorMessage,
              updatedAt: new Date().toISOString(),
            });

            // ----------------------------------------------------------------
            // SYNC TELEMETRY: Alert admin via Telegram ONCE per batch on retry 3
            // ----------------------------------------------------------------
            if (!sentAlertForBatch && nextRetry === 3 && typeof window !== "undefined" && navigator.onLine) {
              sentAlertForBatch = true;
              fetch("/api/telegram/dispatch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: "⚠️ REDROOM SYNC OUTBOX ALERT",
                  message: `Cadet Outbox Sync Failure\nEntity: ${item.entityType}\nAction: ${item.action}\nRetry Count: ${nextRetry}\nError: ${errorMessage.slice(0, 200)}`,
                  priority: "HIGH",
                }),
                keepalive: true,
              }).catch(() => {});
            }
          }
        }
      } catch { }
    } finally {
      this.isProcessing = false;
    }

    return { processed: processedCount, errors: errorCount };
  }

  private mapToSyncEntityType(dexieEntity: string): SyncEntityType {
    switch (dexieEntity) {
      case "study_plans":
      case "study_tasks":
        return "study_plan";
      case "notes":
        return "notes";
      case "test_results":
        return "test_results";
      case "syllabus_progress":
        return "syllabus";
      case "revision_items":
        return "revision";
      case "pyq_progress":
      case "pyq_attempts":
        return "pyq";
      default:
        return "all";
    }
  }
}

// Singleton Dispatcher Instance
export const syncDispatcher = new SyncDispatcher();

/**
 * Manually triggers an immediate outbox flush.
 */
export async function triggerSync(): Promise<{ processed: number; errors: number }> {
  return syncDispatcher.flushOutbox();
}

/**
 * Explicit Step 4 Outbox Processor Alias
 */
export const processSyncOutbox = triggerSync;

/**
 * Prunes completely processed outbox tasks and stale transient items from IndexedDB
 * to protect mobile and low-memory devices from storage bloat.
 */
export async function cleanupLocalDatabase(): Promise<{ prunedOutbox: number }> {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

    // 1. Delete synced tasks older than 24 hours
    const syncedItems = await dexieDb.sync_outbox
      .where("status")
      .equals("synced")
      .filter((item) => item.updatedAt < oneDayAgo)
      .toArray();

    const idsToDelete = syncedItems.map((i) => i.id!).filter(Boolean);

    // 2. Delete permanently failed / exhausted tasks older than 14 days
    const staleFailedItems = await dexieDb.sync_outbox
      .where("status")
      .equals("failed")
      .filter((item) => item.retryCount >= 10 || item.updatedAt < twoWeeksAgo)
      .toArray();

    idsToDelete.push(...staleFailedItems.map((i) => i.id!).filter(Boolean));

    if (idsToDelete.length > 0) {
      await dexieDb.sync_outbox.where("id").anyOf(idsToDelete).delete();
    }

    return { prunedOutbox: idsToDelete.length };
  } catch (err) {
    console.warn("[Local DB Cleanup] Storage pruning warning:", err);
    return { prunedOutbox: 0 };
  }
}

/**
 * Initializes the background dispatcher and schedules periodic local storage cleanup.
 */
export function initSyncDispatcher(): void {
  if (typeof window !== "undefined") {
    syncDispatcher.start();
    // Run local IndexedDB cleanup on startup
    void cleanupLocalDatabase();
  }
}

/**
 * Triggers an immediate outbox sync flush (called on network reconnection or SW event).
 */
export async function triggerOutboxFlush(): Promise<void> {
  await syncDispatcher.flushOutbox();
}
