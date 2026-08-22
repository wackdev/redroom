/**
 * WHYNOTUPSC / REDROOM Native IndexedDB Client
 * Zero-dependency, client-side persistent database for unlimited offline storage:
 * - Mains answer drafts & handwritten image attachments
 * - 10,000+ Prelims & CSAT Question Archive
 * - Daily study plans, tasks, notes, SM-2 flashcards
 * - Test results & AI DAF Interview transcripts
 */

const DB_NAME = "whynotupsc_db";
const DB_VERSION = 1;

export const DB_STORES = {
  MAINS_DRAFTS: "mains_drafts",
  PYQS: "pyqs",
  STUDY_PLANS: "study_plans",
  STUDY_TASKS: "study_tasks",
  NOTES: "notes",
  REVISION_FLASHCARDS: "revision_flashcards",
  TEST_RESULTS: "test_results",
  INTERVIEWS: "interviews",
  CACHED_ARTICLES: "cached_articles",
} as const;

export type DBStoreName = (typeof DB_STORES)[keyof typeof DB_STORES];

class RedroomIndexedDB {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private initDB(): Promise<IDBDatabase> {
    if (typeof window === "undefined") {
      return Promise.reject(new Error("IndexedDB is only available in the browser"));
    }

    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Mains drafts & handwritten answer scans
        if (!db.objectStoreNames.contains(DB_STORES.MAINS_DRAFTS)) {
          db.createObjectStore(DB_STORES.MAINS_DRAFTS, { keyPath: "id" });
        }

        // Question archive
        if (!db.objectStoreNames.contains(DB_STORES.PYQS)) {
          db.createObjectStore(DB_STORES.PYQS, { keyPath: "id" });
        }

        // Study plans & daily notes
        if (!db.objectStoreNames.contains(DB_STORES.STUDY_PLANS)) {
          db.createObjectStore(DB_STORES.STUDY_PLANS, { keyPath: "date" });
        }

        // Tasks
        if (!db.objectStoreNames.contains(DB_STORES.STUDY_TASKS)) {
          db.createObjectStore(DB_STORES.STUDY_TASKS, { keyPath: "id" });
        }

        // Notes
        if (!db.objectStoreNames.contains(DB_STORES.NOTES)) {
          db.createObjectStore(DB_STORES.NOTES, { keyPath: "id" });
        }

        // Spaced repetition flashcards
        if (!db.objectStoreNames.contains(DB_STORES.REVISION_FLASHCARDS)) {
          db.createObjectStore(DB_STORES.REVISION_FLASHCARDS, { keyPath: "id" });
        }

        // Mock test telemetry
        if (!db.objectStoreNames.contains(DB_STORES.TEST_RESULTS)) {
          db.createObjectStore(DB_STORES.TEST_RESULTS, { keyPath: "id" });
        }

        // Interview viva transcripts
        if (!db.objectStoreNames.contains(DB_STORES.INTERVIEWS)) {
          db.createObjectStore(DB_STORES.INTERVIEWS, { keyPath: "id" });
        }

        // Cached current affairs
        if (!db.objectStoreNames.contains(DB_STORES.CACHED_ARTICLES)) {
          db.createObjectStore(DB_STORES.CACHED_ARTICLES, { keyPath: "id" });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  /**
   * Generic Get by Primary Key
   */
  public async get<T>(storeName: DBStoreName, key: IDBValidKey): Promise<T | null> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const req = store.get(key);

        req.onsuccess = () => resolve((req.result as T) ?? null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  }

  /**
   * Generic Get All Records
   */
  public async getAll<T>(storeName: DBStoreName): Promise<T[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const req = store.getAll();

        req.onsuccess = () => resolve((req.result as T[]) || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  }

  /**
   * Generic Put / Upsert
   */
  public async put<T>(storeName: DBStoreName, value: T): Promise<boolean> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.put(value);

        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return false;
    }
  }

  /**
   * Batch Put / Bulk Upsert
   */
  public async putMany<T>(storeName: DBStoreName, items: T[]): Promise<boolean> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);

        for (const item of items) {
          store.put(item);
        }

        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      return false;
    }
  }

  /**
   * Generic Delete
   */
  public async delete(storeName: DBStoreName, key: IDBValidKey): Promise<boolean> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.delete(key);

        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return false;
    }
  }

  /**
   * Clear an entire Object Store
   */
  public async clear(storeName: DBStoreName): Promise<boolean> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.clear();

        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return false;
    }
  }

  /**
   * Transparent Migration: Copies legacy localStorage data to IndexedDB seamlessly.
   */
  public async migrateFromLocalStorage(): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      // 1. Mains drafts
      const legacyMains = localStorage.getItem("redroom_mains_drafts");
      if (legacyMains) {
        const parsed = JSON.parse(legacyMains);
        const items = Object.entries(parsed).map(([id, draft]) => ({
          id,
          ...(draft as object),
        }));
        if (items.length > 0) {
          await this.putMany(DB_STORES.MAINS_DRAFTS, items);
        }
      }

      // 2. Study Plan Notes
      const legacyPlan = localStorage.getItem("redroom_study_plan");
      if (legacyPlan) {
        const parsed = JSON.parse(legacyPlan);
        const items = Object.entries(parsed).map(([date, plan]) => ({
          date,
          ...(plan as object),
        }));
        if (items.length > 0) {
          await this.putMany(DB_STORES.STUDY_PLANS, items);
        }
      }

      // 3. Notes
      const legacyNotes = localStorage.getItem("redroom_notes_data");
      if (legacyNotes) {
        const parsed = JSON.parse(legacyNotes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          await this.putMany(DB_STORES.NOTES, parsed);
        }
      }

      // 4. Test Results
      const legacyTests = localStorage.getItem("redroom_test_results");
      if (legacyTests) {
        const parsed = JSON.parse(legacyTests);
        if (Array.isArray(parsed) && parsed.length > 0) {
          await this.putMany(DB_STORES.TEST_RESULTS, parsed);
        }
      }

      // 5. Revision Flashcards
      const legacyRev = localStorage.getItem("redroom_revision_items");
      if (legacyRev) {
        const parsed = JSON.parse(legacyRev);
        if (Array.isArray(parsed) && parsed.length > 0) {
          await this.putMany(DB_STORES.REVISION_FLASHCARDS, parsed);
        }
      }
    } catch (err) {
      console.warn("IndexedDB Migration warning:", err);
    }
  }
}

export const idb = new RedroomIndexedDB();
