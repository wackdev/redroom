"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { NoteItem, DailyStudyNoteEntry, DayPlan } from "@/lib/core/types";
import { formatDate, formatDateWithTime, formatTime, getDateKey, safeArray } from "@/lib/core/utils";
import { UPSC_SUBJECTS } from "@/lib/core/constants";
import {
  createDailyStudyNote,
  addDailyNoteToPlans,
  deleteDailyNoteFromPlans,
  getAllDailyNotes,
} from "@/lib/study/study-plan-engine";
import {
  broadcastSyncChange,
  subscribeToSyncChanges,
  pushStateToCloud,
  useCloudSync,
} from "@/lib/sync/sync-engine";
import NotesMindMapCanvas from "@/components/NotesMindMapCanvas";
import AuthGuard from "@/components/auth/AuthGuard";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import { UserSessionManager } from "@/lib/core/user-context";
import { useNotesStore } from "@/store/useNotesStore";

const NOTES_STORAGE_KEY = "redroom_notes_data";

const STUDY_PLAN_STORAGE_KEY = "redroom_study_plan";

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

export default function NotesPage() {
  const router = useRouter();
  const { isSyncing, lastSyncTime, triggerManualSync } = useCloudSync();

  // Active View Tab: "topic_notes" | "daily_notes"
  const [activeTab, setActiveTab] = useState<"topic_notes" | "daily_notes">("topic_notes");

  // Zustand Optimistic Notes Store
  const {
    notes,
    selectedNote,
    initialize: initNotes,
    setSelectedNote,
    addNote: addTopicNote,
    updateNote: updateTopicNote,
    deleteNote: removeTopicNote,
  } = useNotesStore();

  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [noteViewMode, setNoteViewMode] = useState<"text" | "mindmap">("text");

  // Daily Synchronized Notes State
  const [studyPlans, setStudyPlans] = useState<Record<string, DayPlan>>({});
  const [selectedDailyNote, setSelectedDailyNote] = useState<DailyStudyNoteEntry | null>(null);

  // New Daily Note Modal / Inline Form
  const [showDailyNoteModal, setShowDailyNoteModal] = useState(false);
  const [newDailyNoteDate, setNewDailyNoteDate] = useState(getDateKey());
  const [newDailyNoteTitle, setNewDailyNoteTitle] = useState("");
  const [newDailyNoteSubject, setNewDailyNoteSubject] = useState("Polity");
  const [newDailyNoteContent, setNewDailyNoteContent] = useState("");

  // AI Synthesis Modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiSubject, setAiSubject] = useState("Polity");
  const [aiTopic, setAiTopic] = useState("");
  const [generating, setGenerating] = useState(false);

  const loadLocalData = useCallback(() => {
    // Daily Synchronized Notes from Study Plans
    try {
      const savedPlans = localStorage.getItem(STUDY_PLAN_STORAGE_KEY);
      if (savedPlans) {
        const parsedPlans = JSON.parse(savedPlans);
        if (parsedPlans && typeof parsedPlans === "object") {
          setStudyPlans(parsedPlans);
        }
      }
    } catch {}
  }, []);

  // Load Saved Notes & Study Plans & Subscribe to Cross-Tab Changes
  useEffect(() => {
    void initNotes();
    loadLocalData();

    // Subscribe to cross-tab updates
    const unsubscribe = subscribeToSyncChanges((type) => {
      if (type === "notes" || type === "all") {
        void initNotes();
      }
      if (type === "study_plan" || type === "all") {
        loadLocalData();
      }
    });

    return unsubscribe;
  }, [initNotes, loadLocalData]);

  // Save Study Plans (Daily Notes) & Broadcast
  const saveStudyPlans = useCallback((updatedPlans: Record<string, DayPlan>) => {
    setStudyPlans(updatedPlans);
    try {
      localStorage.setItem(STUDY_PLAN_STORAGE_KEY, JSON.stringify(updatedPlans));
      broadcastSyncChange("study_plan");
      void pushStateToCloud();
    } catch {}
  }, []);

  // Filtered Topic Notes
  const filteredTopicNotes = useMemo(() => {
    return safeArray(notes).filter((n) => {
      const matchSub = selectedSubject === "All" || n.subject === selectedSubject;
      const matchSearch =
        !searchQuery.trim() ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSub && matchSearch;
    });
  }, [notes, selectedSubject, searchQuery]);

  // All Daily Notes Flattened
  const allDailyNotes = useMemo(() => {
    const list = getAllDailyNotes(studyPlans);
    if (!searchQuery.trim() && selectedSubject === "All") return list;

    return list.filter((n) => {
      const matchSub = selectedSubject === "All" || n.subject === selectedSubject;
      const matchSearch =
        !searchQuery.trim() ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSub && matchSearch;
    });
  }, [studyPlans, searchQuery, selectedSubject]);

  // AI Topic Note Synthesis
  const handleGenerateAiNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setGenerating(true);
    try {
      const res = await fetch("/api/notes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: aiSubject,
          topic: aiTopic.trim(),
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        await addTopicNote({
          id: `note-ai-${Date.now()}`,
          userId: "local-user",
          subject: aiSubject,
          topic: aiTopic.trim(),
          title: `${aiSubject}: ${aiTopic.trim()}`,
          content: json.data.content,
          isAiGenerated: true,
          keyKeywords: json.data.keyKeywords || [aiSubject, aiTopic],
          tags: [aiSubject, "AI Synthesis", "UPSC Notes"],
        });
        setShowAiModal(false);
        setAiTopic("");
      } else {
        alert("Failed to generate AI note.");
      }
    } catch {
      alert("Network connectivity error while calling AI note generator.");
    } finally {
      setGenerating(false);
    }
  };

  // Add Synchronized Daily Note
  const handleCreateDailyNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDailyNoteTitle.trim() || !newDailyNoteContent.trim()) return;

    const newNote = createDailyStudyNote(
      newDailyNoteDate,
      newDailyNoteTitle.trim(),
      newDailyNoteContent.trim(),
      newDailyNoteSubject,
      [newDailyNoteSubject, "Daily Sync"]
    );

    const updatedPlans = addDailyNoteToPlans(studyPlans, newDailyNoteDate, newNote);
    saveStudyPlans(updatedPlans);
    setSelectedDailyNote(newNote);

    setNewDailyNoteTitle("");
    setNewDailyNoteContent("");
    setShowDailyNoteModal(false);
  };

  // Delete Topic Note (Optimistic Zustand + Dexie Outbox)
  const deleteTopicNote = async (noteId: string) => {
    if (window.confirm("Delete this topic note?")) {
      await removeTopicNote(noteId);
    }
  };

  // Delete Daily Note
  const handleDeleteDailyNote = (date: string, noteId: string) => {
    if (window.confirm("Delete this daily timestamped note?")) {
      const updatedPlans = deleteDailyNoteFromPlans(studyPlans, date, noteId);
      saveStudyPlans(updatedPlans);
      if (selectedDailyNote?.id === noteId) {
        setSelectedDailyNote(null);
      }
    }
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#080510] text-white">
        {/* UNIVERSAL LUXURY HUD HEADER */}
        <AppUniversalHeader moduleName="Notes Vault & Journal" moduleBadge="KNOWLEDGE REPOSITORY" />

      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* HERO */}
        <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-400">
              HIGH YIELD REVISION & DAILY JOURNAL REPOSITORY
            </p>
            <h1 className="mt-1 text-3xl font-black md:text-4xl">UPSC Notes & Synthesis</h1>
            <p className="mt-1 text-sm text-white/50">
              Structured concept notes, landmark Supreme Court rulings, and daily synchronized study reflection logs.
            </p>
          </div>

          {/* TAB SWITCHER */}
          <div className="flex rounded-2xl border border-white/10 bg-white/[0.04] p-1 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("topic_notes")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "topic_notes"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <span>📚</span> Topic Synthesis ({notes.length})
            </button>
            <button
              onClick={() => setActiveTab("daily_notes")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "daily_notes"
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-900/50"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <span>🕒</span> Daily Time Logs ({allDailyNotes.length})
            </button>
          </div>
        </section>

        {/* SUBJECT TABS & SEARCH */}
        <section className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="text"
            placeholder={
              activeTab === "topic_notes"
                ? "Search notes, case laws, keywords..."
                : "Search daily timestamped notes and journal logs..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-purple-500"
          />
          <div className="flex flex-wrap gap-2">
            {["All", ...UPSC_SUBJECTS.slice(0, 7)].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  selectedSubject === sub
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </section>

        {/* TAB 1: TOPIC NOTES WORKSPACE */}
        {activeTab === "topic_notes" && (
          <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            {/* TOPIC NOTES LIST */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                Saved Topic Notes ({filteredTopicNotes.length})
              </p>
              <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
                {filteredTopicNotes.map((n) => {
                  const isSelected = selectedNote?.id === n.id;
                  return (
                    <div
                      key={n.id}
                      onClick={() => setSelectedNote(n)}
                      className={`cursor-pointer rounded-2xl border p-4 transition ${
                        isSelected
                          ? "border-purple-500 bg-purple-500/15 shadow-lg shadow-purple-950/40"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-300">
                          {n.subject}
                        </span>
                        {n.isAiGenerated && (
                          <span className="text-[10px] font-bold text-pink-300">✨ AI Note</span>
                        )}
                      </div>
                      <h3 className="mt-2 text-sm font-bold truncate">{n.title}</h3>
                      <p className="mt-1 text-[11px] text-white/40">{formatDate(n.createdAt, "short")}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TOPIC NOTE VIEWER */}
            {selectedNote ? (
              <div className="space-y-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setNoteViewMode("text")}
                    className={`rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold transition ${
                      noteViewMode === "text"
                        ? "bg-purple-600 text-white"
                        : "bg-white/5 text-white/50 hover:bg-white/10"
                    }`}
                  >
                    📄 Text Document
                  </button>
                  <button
                    onClick={() => setNoteViewMode("mindmap")}
                    className={`rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold transition ${
                      noteViewMode === "mindmap"
                        ? "border border-[#D8A63A] bg-[#D8A63A] text-black font-black shadow-lg"
                        : "bg-white/5 text-white/50 hover:text-white"
                    }`}
                  >
                    🧠 Visual Mind-Map
                  </button>
                </div>

                {noteViewMode === "mindmap" ? (
                  <NotesMindMapCanvas
                    title={selectedNote.title}
                    content={selectedNote.content}
                    keywords={selectedNote.keyKeywords}
                  />
                ) : (
                  <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300">
                            {selectedNote.subject}
                          </span>
                          <span className="text-xs text-white/40">
                            Last edited: {formatDate(selectedNote.updatedAt, "full")}
                          </span>
                        </div>
                        <h2 className="mt-3 text-2xl font-black">{selectedNote.title}</h2>
                      </div>
                      <button
                        onClick={() => deleteTopicNote(selectedNote.id)}
                        className="rounded-xl border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="mt-6 whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/80">
                      {selectedNote.content}
                    </div>

                    {safeArray(selectedNote.tags).length > 0 && (
                      <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                        {safeArray(selectedNote.tags).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg bg-white/5 px-2.5 py-1 text-[11px] text-white/50"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center text-white/40">
                Select or generate a note to preview.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DAILY SYNCHRONIZED NOTES & TIME LOGS */}
        {activeTab === "daily_notes" && (
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            {/* DAILY NOTES CHRONOLOGICAL FEED */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                  Daily Study Journal Logs ({allDailyNotes.length})
                </p>
                <button
                  onClick={() => setShowDailyNoteModal(true)}
                  className="text-xs font-bold text-pink-400 hover:text-pink-300 transition"
                >
                  + Add Entry
                </button>
              </div>

              {allDailyNotes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/40">
                  <p className="text-sm">No daily notes logged yet.</p>
                  <button
                    onClick={() => setShowDailyNoteModal(true)}
                    className="mt-3 rounded-xl bg-pink-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-pink-500"
                  >
                    Log First Entry
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                  {allDailyNotes.map((entry) => {
                    const isSelected = selectedDailyNote?.id === entry.id;
                    return (
                      <div
                        key={entry.id}
                        onClick={() => setSelectedDailyNote(entry)}
                        className={`cursor-pointer rounded-2xl border p-4 transition ${
                          isSelected
                            ? "border-pink-500 bg-pink-500/15 shadow-lg shadow-pink-950/40"
                            : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-bold text-pink-300">
                            🕒 {entry.time}
                          </span>
                          <span className="text-[11px] font-semibold text-purple-300">
                            {formatDate(entry.date, "short")}
                          </span>
                        </div>
                        <h4 className="mt-2 text-sm font-bold truncate text-white">{entry.title}</h4>
                        <p className="mt-1 line-clamp-2 text-xs text-white/50 leading-relaxed">
                          {entry.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* DAILY NOTE VIEWER / DETAIL */}
            {selectedDailyNote ? (
              <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs font-bold text-pink-300">
                        🕒 {selectedDailyNote.time}
                      </span>
                      <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300">
                        📅 {formatDate(selectedDailyNote.date, "full")}
                      </span>
                      {selectedDailyNote.subject && (
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
                          {selectedDailyNote.subject}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-3 text-2xl font-black">{selectedDailyNote.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push("/study-plan")}
                      className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
                    >
                      View in Planner →
                    </button>
                    <button
                      onClick={() => handleDeleteDailyNote(selectedDailyNote.date, selectedDailyNote.id)}
                      className="rounded-xl border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-6 whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/80">
                  {selectedDailyNote.content}
                </div>
              </article>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center text-white/40">
                Select an entry from the list or click &ldquo;+ Log Timestamped Note&rdquo; to record your study takeaways.
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE DAILY NOTE MODAL */}
      {showDailyNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-pink-500/30 bg-[#140a24] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🕒</span>
                <h3 className="text-lg font-bold">New Timestamped Study Note</h3>
              </div>
              <span className="rounded-full bg-pink-500/20 px-2.5 py-0.5 text-xs font-bold text-pink-300">
                {formatTime(new Date())}
              </span>
            </div>

            <form onSubmit={handleCreateDailyNote} className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-white/60">Study Date</label>
                  <input
                    type="date"
                    required
                    value={newDailyNoteDate}
                    onChange={(e) => setNewDailyNoteDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/60">Subject</label>
                  <select
                    value={newDailyNoteSubject}
                    onChange={(e) => setNewDailyNoteSubject(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#1f1238] px-3 py-2 text-xs font-semibold text-white outline-none focus:border-pink-500"
                  >
                    {UPSC_SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/60">Note Title / Core Focus</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fundamental Rights - Writs & Exceptions Summary"
                  value={newDailyNoteTitle}
                  onChange={(e) => setNewDailyNoteTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/60">Note Content / Concept Takeaway</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Summary points, case laws, factual memory mnemonics, or reflection..."
                  value={newDailyNoteContent}
                  onChange={(e) => setNewDailyNoteContent(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white leading-relaxed outline-none placeholder:text-white/30 focus:border-pink-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDailyNoteModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2 text-xs font-bold text-white hover:opacity-90 transition"
                >
                  Save Note Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI SYNTHESIS MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-purple-500/30 bg-[#120a21] p-6 shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h3 className="text-lg font-bold">AI Note Synthesizer</h3>
            </div>
            <p className="mt-1 text-xs text-white/50">
              Generate structured, high-yield UPSC revision notes in seconds.
            </p>

            <form onSubmit={handleGenerateAiNote} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-white/60">Subject</label>
                <select
                  value={aiSubject}
                  onChange={(e) => setAiSubject(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#1e1435] px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500"
                >
                  {UPSC_SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/60">Topic to Synthesize</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Center-State Water Disputes / High Seas Treaty"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-purple-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={generating}
                  onClick={() => setShowAiModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-2 text-xs font-bold transition hover:opacity-90 disabled:opacity-50"
                >
                  {generating ? "Synthesizing with AI..." : "Synthesize Notes ✨"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
    </AuthGuard>
  );
}

