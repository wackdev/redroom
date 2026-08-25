"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RevisionItem, RevisionConfidence } from "@/lib/core/types";
import { formatDate, getDateKey, shiftDateKey, safeArray } from "@/lib/core/utils";
import { UPSC_SUBJECTS } from "@/lib/core/constants";
import { DEFAULT_REVISION_TOPICS } from "@/lib/revision/revision-engine";
import { calculateSM2, calculateUrgencyScore } from "@/lib/revision/spaced-repetition";
import {
  broadcastSyncChange,
  subscribeToSyncChanges,
  pushStateToCloud,
  useCloudSync,
} from "@/lib/sync/sync-engine";
import FlashcardQuickDrill from "@/components/FlashcardQuickDrill";
import AuthGuard from "@/components/auth/AuthGuard";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import { UserSessionManager } from "@/lib/core/user-context";
import { trackActivityEvent } from "@/lib/brain/activity-events";

const REVISION_STORAGE_KEY = "redroom_revision_items";


function getDefaultSeedRevisionItems(todayStr: string): RevisionItem[] {
  return DEFAULT_REVISION_TOPICS.map((item, index) => {
    const nextDate = index < 3 ? todayStr : shiftDateKey(todayStr, (index - 2) * 2);
    return {
      id: `rev-${item.topicId}`,
      userId: "local-user",
      topicId: item.topicId,
      topicName: item.topicName,
      subject: item.subject,
      upscImportance: item.importance,
      repetitionCount: 0,
      easeFactor: 2.5,
      intervalDays: 1,
      nextReviewDate: nextDate,
      urgencyScore: calculateUrgencyScore(nextDate, item.importance),
      isOverdue: nextDate <= todayStr,
    };
  });
}

export default function RevisionPage() {
  const router = useRouter();
  const { isSyncing, lastSyncTime, triggerManualSync } = useCloudSync();

  const [items, setItems] = useState<RevisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [showFlashcards, setShowFlashcards] = useState(false);

  // Active Recall Session State
  const [activeSession, setActiveSession] = useState<RevisionItem[] | null>(null);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [processingRating, setProcessingRating] = useState(false);

  // Add Topic Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newSubject, setNewSubject] = useState("Polity");
  const [newImportance, setNewImportance] = useState<"High" | "Medium" | "Low">("High");

  const todayStr = getDateKey();

  const loadRevisionQueue = useCallback(() => {
    setLoading(true);
    try {
      let currentItems: RevisionItem[] = [];
      const saved = localStorage.getItem(REVISION_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentItems = parsed;
          }
        } catch {}
      }

      if (currentItems.length === 0) {
        currentItems = getDefaultSeedRevisionItems(todayStr);
        localStorage.setItem(REVISION_STORAGE_KEY, JSON.stringify(currentItems));
      }

      // Refresh urgency score & overdue status for current day
      const refreshed = currentItems.map((item) => ({
        ...item,
        urgencyScore: calculateUrgencyScore(item.nextReviewDate, item.upscImportance),
        isOverdue: item.nextReviewDate <= todayStr,
      }));

      setItems(refreshed);
      localStorage.setItem(REVISION_STORAGE_KEY, JSON.stringify(refreshed));
    } catch (err) {
      console.warn("Could not load revision queue:", err);
    } finally {
      setLoading(false);
    }
  }, [todayStr]);

  useEffect(() => {
    loadRevisionQueue();

    const unsubscribe = subscribeToSyncChanges((type) => {
      if (type === "revision" || type === "all") {
        loadRevisionQueue();
      }
    });

    return unsubscribe;
  }, [loadRevisionQueue]);

  const dueItems = useMemo(() => {
    return safeArray(items).filter((item) => item.nextReviewDate <= todayStr);
  }, [items, todayStr]);

  const filteredItems = useMemo(() => {
    return safeArray(items).filter(
      (item) => selectedSubject === "All" || item.subject === selectedSubject
    );
  }, [items, selectedSubject]);

  // Start Active Recall
  const startActiveSession = (queueToRun: RevisionItem[]) => {
    if (queueToRun.length === 0) return;
    setActiveSession(queueToRun);
    setSessionIndex(0);
    setIsRevealed(false);
  };

  // Submit Confidence Rating & Persist to Storage & Cloud
  const handleRateConfidence = async (confidence: RevisionConfidence) => {
    if (!activeSession || activeSession.length === 0) return;
    const currentItem = activeSession[sessionIndex];
    setProcessingRating(true);

    // 1. Calculate updated SM-2 parameters
    const sm2 = calculateSM2(
      confidence,
      currentItem.repetitionCount,
      currentItem.intervalDays,
      currentItem.easeFactor,
      currentItem.upscImportance
    );

    const updatedItem: RevisionItem = {
      ...currentItem,
      repetitionCount: sm2.repetitionCount,
      easeFactor: sm2.easeFactor,
      intervalDays: sm2.intervalDays,
      nextReviewDate: sm2.nextReviewDate,
      lastReviewedAt: new Date().toISOString(),
      urgencyScore: sm2.urgencyScore,
      isOverdue: sm2.isOverdue,
    };

    // 2. Immediately update state and persistent localStorage
    setItems((prev) => {
      const nextList = prev.map((it) => (it.topicId === currentItem.topicId ? updatedItem : it));
      try {
        localStorage.setItem(REVISION_STORAGE_KEY, JSON.stringify(nextList));
      } catch {}
      return nextList;
    });

    // 3. Broadcast sync across tabs & push to cloud
    broadcastSyncChange("revision");
    void pushStateToCloud();

    void trackActivityEvent("REVISION_COMPLETED", {
      topicId: currentItem.topicId,
      topicName: currentItem.topicName,
      subject: currentItem.subject,
      confidence,
      intervalDays: sm2.intervalDays,
      nextReviewDate: sm2.nextReviewDate,
    });

    // 4. Send API update in background
    try {
      fetch("/api/revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: currentItem.topicId,
          topicName: currentItem.topicName,
          subject: currentItem.subject,
          confidence,
          upscImportance: currentItem.upscImportance,
        }),
      }).catch(() => {});
    } catch {}

    setProcessingRating(false);
    setIsRevealed(false);

    if (sessionIndex < activeSession.length - 1) {
      setSessionIndex((i) => i + 1);
    } else {
      setActiveSession(null);
      alert("🎉 Spaced Repetition Session Completed! Progress saved.");
    }
  };

  const handleAddCustomTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    const topicId = `custom-${Date.now()}`;
    const newItem: RevisionItem = {
      id: `rev-${topicId}`,
      userId: "local-user",
      topicId,
      topicName: newTopicName.trim(),
      subject: newSubject,
      upscImportance: newImportance,
      repetitionCount: 0,
      easeFactor: 2.5,
      intervalDays: 1,
      nextReviewDate: todayStr,
      urgencyScore: calculateUrgencyScore(todayStr, newImportance),
      isOverdue: true,
    };

    setItems((prev) => {
      const nextList = [newItem, ...prev];
      try {
        localStorage.setItem(REVISION_STORAGE_KEY, JSON.stringify(nextList));
      } catch {}
      return nextList;
    });

    setShowAddModal(false);
    setNewTopicName("");

    broadcastSyncChange("revision");
    void pushStateToCloud();

    try {
      fetch("/api/revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId,
          topicName: newItem.topicName,
          subject: newItem.subject,
          confidence: 1,
          upscImportance: newItem.upscImportance,
        }),
      }).catch(() => {});
    } catch {}
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#080510] text-white">
        {/* UNIVERSAL LUXURY HUD HEADER */}
        <AppUniversalHeader moduleName="Spaced Revision System" moduleBadge="SM-2 RETENTION ENGINE" />

        <div className="border-b border-white/10 bg-[#0b0714]/60 px-5 py-2.5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-white/60">
              <span>ACTIVE RECALL PIPELINE:</span>
              <span className="font-bold text-pink-300">{dueItems.length} Due Today</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFlashcards((p) => !p)}
                className={`rounded-xl border px-3 py-1 text-xs font-bold transition ${
                  showFlashcards
                    ? "border-emerald-500 bg-emerald-500 text-black shadow-lg"
                    : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                }`}
              >
                ⚡ {showFlashcards ? "Hide Flashcards" : "Flashcard Vault"}
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="rounded-xl bg-purple-600 px-3.5 py-1 text-xs font-bold transition hover:bg-purple-500"
              >
                + Add Topic
              </button>
            </div>
          </div>
        </div>

      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* 3D FLASHCARD VAULT */}
        {showFlashcards && (
          <section className="mb-8">
            <FlashcardQuickDrill />
          </section>
        )}

        {/* HERO */}
        <section className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-400">
            SM-2 FORGETTING CURVE OPTIMIZATION
          </p>
          <h1 className="mt-1 text-3xl font-black md:text-4xl">Revision Command Centre</h1>
          <p className="mt-2 text-sm text-white/50">
            Scientifically scheduled active recall sessions based on your confidence ratings and UPSC subject weightage.
          </p>
        </section>

        {/* STATS OVERVIEW */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-pink-500/30 bg-pink-500/10 p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🔥</span>
              <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-bold text-pink-300">
                Action Needed
              </span>
            </div>
            <p className="mt-3 text-3xl font-black text-pink-200">{dueItems.length}</p>
            <p className="mt-1 text-xs text-white/60">Topics Due for Revision Today</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">📚</span>
            </div>
            <p className="mt-3 text-3xl font-black text-white">{items.length}</p>
            <p className="mt-1 text-xs text-white/60">Total Active Revision Trackers</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🧠</span>
            </div>
            <p className="mt-3 text-3xl font-black text-purple-300">
              {items.filter((i) => i.repetitionCount >= 3).length}
            </p>
            <p className="mt-1 text-xs text-white/60">Mastered Topics (3+ Repetitions)</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">⚡</span>
            </div>
            <button
              onClick={() => startActiveSession(dueItems.length > 0 ? dueItems : items)}
              disabled={items.length === 0}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 py-2.5 text-xs font-bold transition hover:opacity-90 disabled:opacity-40"
            >
              Start Recall Session →
            </button>
            <p className="mt-1 text-[11px] text-center text-white/40">Review Due Cards</p>
          </div>
        </section>

        {/* SUBJECT FILTER */}
        <section className="mb-6 flex flex-wrap gap-2">
          {["All", ...UPSC_SUBJECTS.slice(0, 8)].map((sub) => (
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
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-300">
            {error}
          </div>
        )}

        {/* REVISION QUEUE TABLE */}
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-12 text-center text-white/40">
            Loading revision items...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">
            <p className="text-xl font-bold">No revision items found for {selectedSubject}</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold hover:bg-purple-500"
            >
              + Add a Topic to Revise
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-white/40">
                  <tr>
                    <th className="py-4 px-5 font-semibold">Topic / Concept</th>
                    <th className="py-4 px-4 font-semibold">Subject</th>
                    <th className="py-4 px-4 font-semibold">Importance</th>
                    <th className="py-4 px-4 font-semibold">Interval</th>
                    <th className="py-4 px-4 font-semibold">Reps</th>
                    <th className="py-4 px-4 font-semibold">Next Due Date</th>
                    <th className="py-4 px-5 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredItems.map((item) => {
                    const isDue = item.nextReviewDate <= todayStr;
                    return (
                      <tr
                        key={item.id}
                        className={`transition ${
                          isDue ? "bg-pink-500/[0.03] hover:bg-pink-500/[0.06]" : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            {isDue && <span className="text-pink-400">🔥</span>}
                            <span className="font-semibold text-white">{item.topicName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="rounded-lg bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-300">
                            {item.subject}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-xs font-bold ${
                              item.upscImportance === "High"
                                ? "text-pink-400"
                                : item.upscImportance === "Medium"
                                ? "text-yellow-300"
                                : "text-blue-300"
                            }`}
                          >
                            {item.upscImportance}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-white/70">{item.intervalDays} days</td>
                        <td className="py-4 px-4 text-white/70">{item.repetitionCount}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-xs font-semibold ${
                              isDue ? "font-bold text-pink-400" : "text-white/60"
                            }`}
                          >
                            {isDue ? "Today (Due)" : formatDate(item.nextReviewDate, "short")}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => startActiveSession([item])}
                            className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold transition hover:bg-purple-600"
                          >
                            Revise Now
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ACTIVE RECALL FLASHCARD MODAL */}
      {activeSession && activeSession.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-3xl border border-purple-500/30 bg-[#120a21] p-6 shadow-2xl md:p-8">
            {/* SESSION HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Active Recall · Card {sessionIndex + 1} of {activeSession.length}
                </span>
                <p className="font-semibold text-white/80">{activeSession[sessionIndex].subject}</p>
              </div>
              <button
                onClick={() => setActiveSession(null)}
                className="rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* FLASHCARD CORE */}
            <div className="my-8 rounded-2xl border border-white/10 bg-black/40 p-8 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
                Recall Concept & Key Dimensions
              </span>
              <h2 className="mt-4 text-2xl font-black md:text-3xl">
                {activeSession[sessionIndex].topicName}
              </h2>
              <p className="mt-3 text-sm text-white/40">
                Test your active recall. Recall definitions, constitutional articles, key case laws, and committee reports.
              </p>

              {!isRevealed ? (
                <button
                  onClick={() => setIsRevealed(true)}
                  className="mt-8 rounded-xl bg-purple-600 px-6 py-3 font-bold transition hover:bg-purple-500"
                >
                  Show Recall Evaluation →
                </button>
              ) : (
                <div className="mt-6 border-t border-white/10 pt-6 text-left">
                  <p className="text-xs font-bold uppercase tracking-wider text-green-400">
                    How well did you recall this topic?
                  </p>
                  <p className="mt-1 text-xs text-white/50">
                    Your rating directly calculates the next review date via the SM-2 algorithm.
                  </p>
                </div>
              )}
            </div>

            {/* CONFIDENCE RATING BUTTONS */}
            {isRevealed && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <button
                  disabled={processingRating}
                  onClick={() => handleRateConfidence(1)}
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-center transition hover:bg-red-500/20 disabled:opacity-50"
                >
                  <span className="block text-xl">🔄</span>
                  <span className="mt-1 block text-xs font-bold text-red-300">1 - Forgot</span>
                  <span className="text-[10px] text-white/40">Reset (1d)</span>
                </button>

                <button
                  disabled={processingRating}
                  onClick={() => handleRateConfidence(2)}
                  className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-center transition hover:bg-yellow-500/20 disabled:opacity-50"
                >
                  <span className="block text-xl">⚠️</span>
                  <span className="mt-1 block text-xs font-bold text-yellow-300">2 - Hard</span>
                  <span className="text-[10px] text-white/40">1-2 days</span>
                </button>

                <button
                  disabled={processingRating}
                  onClick={() => handleRateConfidence(3)}
                  className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-3 text-center transition hover:bg-blue-500/20 disabled:opacity-50"
                >
                  <span className="block text-xl">👍</span>
                  <span className="mt-1 block text-xs font-bold text-blue-300">3 - Good</span>
                  <span className="text-[10px] text-white/40">Normal mult</span>
                </button>

                <button
                  disabled={processingRating}
                  onClick={() => handleRateConfidence(4)}
                  className="rounded-2xl border border-green-500/30 bg-green-500/10 p-3 text-center transition hover:bg-green-500/20 disabled:opacity-50"
                >
                  <span className="block text-xl">🔥</span>
                  <span className="mt-1 block text-xs font-bold text-green-300">4 - Easy</span>
                  <span className="text-[10px] text-white/40">Mastered</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD CUSTOM TOPIC MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-purple-500/30 bg-[#120a21] p-6 shadow-2xl">
            <h3 className="text-xl font-bold">Add Topic for Spaced Repetition</h3>
            <p className="mt-1 text-xs text-white/40">
              Schedule any UPSC topic for automated review intervals.
            </p>

            <form onSubmit={handleAddCustomTopic} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-white/60">Topic Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Center-State Financial Relations"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/60">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
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
                <label className="text-xs font-semibold text-white/60">UPSC Importance</label>
                <select
                  value={newImportance}
                  onChange={(e) => setNewImportance(e.target.value as any)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#1e1435] px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500"
                >
                  <option value="High">High (Tested Every 1-2 Years)</option>
                  <option value="Medium">Medium (Moderate Frequency)</option>
                  <option value="Low">Low (Peripheral Syllabus)</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold transition hover:bg-purple-500"
                >
                  Add to Schedule
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

