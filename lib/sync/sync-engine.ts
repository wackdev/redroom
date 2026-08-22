"use client";

import { useEffect, useState, useCallback } from "react";
import { DayPlan, NoteItem, TestResultRecord } from "../core/types";
import { safeArray } from "../core/utils";

export const STORAGE_KEYS = {
  STUDY_PLAN: "redroom_study_plan",
  NOTES: "redroom_notes_data",
  TEST_RESULTS: "redroom_test_results",
  SYLLABUS: "redroom_syllabus_progress",
  REVISION: "redroom_revision_items",
  PYQ: "redroom_pyq_progress",
  LAST_SYNC: "redroom_last_cloud_sync",
} as const;

export type SyncEntityType = "study_plan" | "notes" | "test_results" | "syllabus" | "revision" | "pyq" | "all";

interface SyncEventPayload {
  type: SyncEntityType;
  timestamp: string;
  sourceTabId: string;
}

let syncBroadcastChannel: BroadcastChannel | null = null;
const currentTabId = typeof window !== "undefined" ? `tab-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` : "server";

function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (!syncBroadcastChannel) {
    try {
      syncBroadcastChannel = new BroadcastChannel("redroom_cross_tab_sync");
    } catch {
      syncBroadcastChannel = null;
    }
  }
  return syncBroadcastChannel;
}

/**
 * Broadcasts a change to all other open tabs in the browser.
 */
export function broadcastSyncChange(type: SyncEntityType): void {
  if (typeof window === "undefined") return;

  const payload: SyncEventPayload = {
    type,
    timestamp: new Date().toISOString(),
    sourceTabId: currentTabId,
  };

  // 1. BroadcastChannel (modern fast cross-tab communication)
  const channel = getBroadcastChannel();
  if (channel) {
    try {
      channel.postMessage(payload);
    } catch {}
  }

  // 2. Custom In-Window Event (for components within the same tab)
  try {
    window.dispatchEvent(new CustomEvent("redroom_local_sync", { detail: payload }));
  } catch {}
}

/**
 * Subscribes to sync events across all open tabs and inside the window.
 */
export function subscribeToSyncChanges(callback: (type: SyncEntityType) => void): () => void {
  if (typeof window === "undefined") return () => {};

  // 1. Broadcast Channel listener
  const channel = getBroadcastChannel();
  const channelHandler = (event: MessageEvent<SyncEventPayload>) => {
    if (event.data?.sourceTabId !== currentTabId) {
      callback(event.data.type);
    }
  };

  if (channel) {
    channel.addEventListener("message", channelHandler);
  }

  // 2. In-Window Local Event listener
  const localEventHandler = (e: Event) => {
    const customEvent = e as CustomEvent<SyncEventPayload>;
    if (customEvent.detail?.type) {
      callback(customEvent.detail.type);
    }
  };
  window.addEventListener("redroom_local_sync", localEventHandler);

  // 3. Storage Event (fallback across tabs)
  const storageHandler = (e: StorageEvent) => {
    if (
      e.key === STORAGE_KEYS.STUDY_PLAN ||
      e.key === STORAGE_KEYS.NOTES ||
      e.key === STORAGE_KEYS.TEST_RESULTS ||
      e.key === STORAGE_KEYS.SYLLABUS
    ) {
      callback("all");
    }
  };
  window.addEventListener("storage", storageHandler);

  return () => {
    if (channel) {
      channel.removeEventListener("message", channelHandler);
    }
    window.removeEventListener("redroom_local_sync", localEventHandler);
    window.removeEventListener("storage", storageHandler);
  };
}

/**
 * Pushes all current local state to the cloud (Supabase backend).
 */
export async function pushStateToCloud(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const plansRaw = localStorage.getItem(STORAGE_KEYS.STUDY_PLAN);
    const notesRaw = localStorage.getItem(STORAGE_KEYS.NOTES);
    const testsRaw = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
    const syllabusRaw = localStorage.getItem(STORAGE_KEYS.SYLLABUS);
    const revisionRaw = localStorage.getItem(STORAGE_KEYS.REVISION);
    const pyqRaw = localStorage.getItem(STORAGE_KEYS.PYQ);

    const plans = plansRaw ? JSON.parse(plansRaw) : {};
    const notes = notesRaw ? JSON.parse(notesRaw) : [];
    const testResults = testsRaw ? JSON.parse(testsRaw) : [];
    const syllabusProgress = syllabusRaw ? JSON.parse(syllabusRaw) : [];
    const revisionItems = revisionRaw ? JSON.parse(revisionRaw) : [];
    const pyqProgress = pyqRaw ? JSON.parse(pyqRaw) : [];

    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plans,
        notes,
        testResults,
        syllabusProgress,
        revisionItems,
        pyqProgress,
      }),
    });

    const json = await res.json();
    if (json.success) {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      return true;
    }
    return false;
  } catch (err) {
    console.warn("[SyncEngine] Push to cloud failed:", err);
    return false;
  }
}

/**
 * Pulls latest state from the cloud and merges into local storage.
 */
export async function pullStateFromCloud(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const res = await fetch("/api/sync");
    const json = await res.json();

    if (json.success && json.data) {
      const { plans, notes, testResults, syllabusProgress, revisionItems, pyqProgress } = json.data;

      let hasChanges = false;

      if (plans && Object.keys(plans).length > 0) {
        localStorage.setItem(STORAGE_KEYS.STUDY_PLAN, JSON.stringify(plans));
        hasChanges = true;
      }

      if (Array.isArray(notes) && notes.length > 0) {
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
        hasChanges = true;
      }

      if (Array.isArray(testResults) && testResults.length > 0) {
        localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(testResults));
        hasChanges = true;
      }

      if (Array.isArray(syllabusProgress) && syllabusProgress.length > 0) {
        localStorage.setItem(STORAGE_KEYS.SYLLABUS, JSON.stringify(syllabusProgress));
        hasChanges = true;
      }

      if (Array.isArray(revisionItems) && revisionItems.length > 0) {
        localStorage.setItem(STORAGE_KEYS.REVISION, JSON.stringify(revisionItems));
        hasChanges = true;
      }

      if (Array.isArray(pyqProgress) && pyqProgress.length > 0) {
        localStorage.setItem(STORAGE_KEYS.PYQ, JSON.stringify(pyqProgress));
        hasChanges = true;
      }

      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

      if (hasChanges) {
        broadcastSyncChange("all");
      }

      return true;
    }
    return false;
  } catch (err) {
    console.warn("[SyncEngine] Pull from cloud failed:", err);
    return false;
  }
}

/**
 * React hook to enable seamless real-time syncing and status across tabs and devices.
 */
export function useCloudSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const performFullSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      // 1. First pull latest remote state
      await pullStateFromCloud();
      // 2. Then ensure local changes are persisted
      await pushStateToCloud();
      setLastSyncTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    // Initial sync on mount
    void performFullSync();

    // Periodic sync every 60 seconds
    const intervalId = setInterval(() => {
      void pushStateToCloud();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [performFullSync]);

  return {
    isSyncing,
    lastSyncTime,
    triggerManualSync: performFullSync,
  };
}
