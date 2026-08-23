import { create } from "zustand";
import { NoteItem } from "@/lib/core/types";
import { dexieDb, SyncOutboxItem } from "@/lib/db/dexie";
import { processSyncOutbox } from "@/lib/sync/dispatcher";
import { broadcastSyncChange } from "@/lib/sync/sync-engine";

export interface NotesStoreState {
  notes: NoteItem[];
  selectedNote: NoteItem | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  setSelectedNote: (note: NoteItem | null) => void;
  addNote: (note: Partial<NoteItem>) => Promise<NoteItem>;
  updateNote: (id: string, updates: Partial<NoteItem>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const DEFAULT_SEED_NOTES: NoteItem[] = [
  {
    id: "note-1",
    userId: "local-user",
    subject: "Polity",
    topic: "Basic Structure Doctrine",
    title: "Basic Structure Doctrine & Kesavananda Bharati Landmark (1973)",
    content: `# Basic Structure Doctrine (Kesavananda Bharati v. State of Kerala 1973)

## 1. Constitutional Background
- Emerged from the conflict between **Article 13(2)** (Fundamental Rights supremacy) and **Article 368** (Constituent power of Parliament).
- **Evolution**:
  1. *Shankari Prasad (1951)*: Parliament can amend any part including FRs.
  2. *Golaknath (1967)*: Parliament cannot abridge FRs; Article 368 only contains procedure, not constituent power.
  3. *Kesavananda Bharati (1973)*: Parliament has wide constituent power under Art 368, but cannot alter the **Basic Structure**.

## 2. Core Elements of Basic Structure
- Supremacy of the Constitution
- Republican and Democratic form of Government
- Secular character of the Constitution
- Separation of powers between Legislature, Executive & Judiciary
- Federal character of the Constitution
- Rule of Law & Judicial Review (Article 32 & 226)

## 3. Important Subsequent Affirmations
- *Indira Nehru Gandhi (1975)*: Free and fair elections.
- *Minerva Mills (1980)*: Harmony between Part III and Part IV; limited amending power is itself a basic feature.
- *S.R. Bommai (1994)*: Secularism and Federalism declared basic features.`,
    isAiGenerated: false,
    keyKeywords: ["Polity", "Basic Structure", "Kesavananda Bharati", "Article 368"],
    tags: ["Polity", "Constitutional Law", "GS-2"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useNotesStore = create<NotesStoreState>((set, get) => ({
  notes: [],
  selectedNote: null,
  isLoading: false,
  error: null,

  /**
   * Initializes store by hydrating from Dexie IndexedDB local table.
   */
  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      let localNotes = await dexieDb.notes.toArray();

      // Seed default notes if empty
      if (localNotes.length === 0) {
        for (const seed of DEFAULT_SEED_NOTES) {
          await dexieDb.notes.put(seed);
        }
        localNotes = DEFAULT_SEED_NOTES;
      }

      set({
        notes: localNotes,
        selectedNote: localNotes[0] || null,
        isLoading: false,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load notes from Dexie";
      set({ error: msg, isLoading: false, notes: DEFAULT_SEED_NOTES, selectedNote: DEFAULT_SEED_NOTES[0] });
    }
  },

  setSelectedNote: (note) => {
    set({ selectedNote: note });
  },

  /**
   * STEP 4: OPTIMISTIC UI WITH ZUSTAND & DEXIE (Zero-Latency Feel)
   * 
   * 1. Update the Zustand state immediately (Optimistic UI).
   * 2. Start a Dexie transaction (dexieDb.transaction) to save the note to the local 'notes' table
   *    AND append it to the 'sync_outbox' table.
   * 3. Call processSyncOutbox() to trigger a background sync.
   */
  addNote: async (partialNote) => {
    const previousNotes = get().notes;
    const now = new Date().toISOString();

    const newNote: NoteItem = {
      id: partialNote.id || `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: partialNote.userId || "local-user",
      subject: partialNote.subject || "General Studies",
      topic: partialNote.topic || partialNote.title || "Untitled Topic",
      title: partialNote.title || "Untitled Note",
      content: partialNote.content || "",
      isAiGenerated: Boolean(partialNote.isAiGenerated),
      keyKeywords: partialNote.keyKeywords || [],
      tags: partialNote.tags || [partialNote.subject || "General Studies"],
      createdAt: now,
      updatedAt: now,
    };

    // ------------------------------------------------------------------------
    // 1. UPDATE ZUSTAND STATE IMMEDIATELY (0ms Perceived Latency)
    // ------------------------------------------------------------------------
    set({
      notes: [newNote, ...previousNotes],
      selectedNote: newNote,
    });

    try {
      // ----------------------------------------------------------------------
      // 2. DEXIE TRANSACTION: Write local 'notes' table + append to 'sync_outbox'
      // ----------------------------------------------------------------------
      await dexieDb.transaction("rw", [dexieDb.notes, dexieDb.sync_outbox], async () => {
        // A. Put in local Dexie notes store
        await dexieDb.notes.put(newNote);

        // B. Append mutation task into sync_outbox
        const outboxTask: SyncOutboxItem = {
          entityType: "notes",
          action: "INSERT",
          entityId: newNote.id,
          payload: newNote as unknown as Record<string, unknown>,
          status: "pending",
          retryCount: 0,
          createdAt: now,
          updatedAt: now,
        };
        await dexieDb.sync_outbox.add(outboxTask);
      });

      // ----------------------------------------------------------------------
      // 3. TRIGGER BACKGROUND SYNC WORKER & CROSS-TAB BROADCAST
      // ----------------------------------------------------------------------
      broadcastSyncChange("notes");
      void processSyncOutbox();

      return newNote;
    } catch (err: unknown) {
      // Rollback Zustand state if local persistence fails
      set({ notes: previousNotes, error: "Failed to persist note to Dexie" });
      throw err;
    }
  },

  /**
   * Optimistic Note Update
   */
  updateNote: async (id, updates) => {
    const previousNotes = get().notes;
    const previousSelected = get().selectedNote;
    const now = new Date().toISOString();

    const updatedNotes = previousNotes.map((note) => {
      if (note.id === id) {
        return { ...note, ...updates, updatedAt: now };
      }
      return note;
    });

    const targetNote = updatedNotes.find((n) => n.id === id);
    if (!targetNote) return;

    // 1. Instant Zustand update
    set({
      notes: updatedNotes,
      selectedNote: previousSelected?.id === id ? targetNote : previousSelected,
    });

    try {
      // 2. Dexie Transaction
      await dexieDb.transaction("rw", [dexieDb.notes, dexieDb.sync_outbox], async () => {
        await dexieDb.notes.put(targetNote);
        await dexieDb.sync_outbox.add({
          entityType: "notes",
          action: "UPDATE",
          entityId: id,
          payload: targetNote as unknown as Record<string, unknown>,
          status: "pending",
          retryCount: 0,
          createdAt: now,
          updatedAt: now,
        });
      });

      // 3. Background sync
      broadcastSyncChange("notes");
      void processSyncOutbox();
    } catch (err: unknown) {
      set({ notes: previousNotes, selectedNote: previousSelected, error: "Failed to update note" });
      throw err;
    }
  },

  /**
   * Optimistic Note Deletion
   */
  deleteNote: async (id) => {
    const previousNotes = get().notes;
    const previousSelected = get().selectedNote;
    const now = new Date().toISOString();

    const filteredNotes = previousNotes.filter((n) => n.id !== id);

    // 1. Instant Zustand update
    set({
      notes: filteredNotes,
      selectedNote: previousSelected?.id === id ? filteredNotes[0] || null : previousSelected,
    });

    try {
      // 2. Dexie Transaction
      await dexieDb.transaction("rw", [dexieDb.notes, dexieDb.sync_outbox], async () => {
        await dexieDb.notes.delete(id);
        await dexieDb.sync_outbox.add({
          entityType: "notes",
          action: "DELETE",
          entityId: id,
          payload: { id },
          status: "pending",
          retryCount: 0,
          createdAt: now,
          updatedAt: now,
        });
      });

      // 3. Background sync
      broadcastSyncChange("notes");
      void processSyncOutbox();
    } catch (err: unknown) {
      set({ notes: previousNotes, selectedNote: previousSelected, error: "Failed to delete note" });
      throw err;
    }
  },
}));
