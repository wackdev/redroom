"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UPSC_FULL_SYLLABUS } from "@/lib/syllabus/upsc-syllabus";
import { SyllabusSubject, SyllabusTopic } from "@/lib/core/types";
import { safeArray } from "@/lib/core/utils";
import { STATIC_PYQ_DATASET } from "@/lib/study/pyq-engine";
import {
  broadcastSyncChange,
  subscribeToSyncChanges,
  pushStateToCloud,
  useCloudSync,
} from "@/lib/sync/sync-engine";
import { sound } from "@/lib/audio/sound-engine";
import AuthGuard from "@/components/auth/AuthGuard";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import { trackActivityEvent } from "@/lib/brain/activity-events";

const STORAGE_KEY = "redroom_syllabus_progress";
const SUBTOPIC_STORAGE_KEY = "redroom_syllabus_subtopics_progress";

const PAPER_OPTIONS = [
  "All Papers",
  "Prelims GS-1",
  "CSAT",
  "GS-1",
  "GS-2",
  "GS-3",
  "GS-4",
] as const;

export default function SyllabusPage() {
  const router = useRouter();
  const { isSyncing, lastSyncTime, triggerManualSync } = useCloudSync();

  const [completed, setCompleted] = useState<string[]>([]);
  const [completedSubtopics, setCompletedSubtopics] = useState<string[]>([]);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [paperFilter, setPaperFilter] = useState<typeof PAPER_OPTIONS[number]>("All Papers");
  const [examFilter, setExamFilter] = useState<"All" | "Prelims" | "Mains">("All");
  const [yieldFilter, setYieldFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [loaded, setLoaded] = useState(false);

  // Load Saved Progress & Subscribe to Cross-Tab Changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCompleted(parsed);
      }
      const savedSub = localStorage.getItem(SUBTOPIC_STORAGE_KEY);
      if (savedSub) {
        const parsedSub = JSON.parse(savedSub);
        if (Array.isArray(parsedSub)) setCompletedSubtopics(parsedSub);
      }
    } catch (err) {
      console.warn("Could not load syllabus progress:", err);
    } finally {
      setLoaded(true);
    }

    const unsubscribe = subscribeToSyncChanges((type) => {
      if (type === "syllabus" || type === "all") {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) setCompleted(parsed);
          }
          const savedSub = localStorage.getItem(SUBTOPIC_STORAGE_KEY);
          if (savedSub) {
            const parsedSub = JSON.parse(savedSub);
            if (Array.isArray(parsedSub)) setCompletedSubtopics(parsedSub);
          }
        } catch {}
      }
    });

    return unsubscribe;
  }, []);

  const allTopics = useMemo(() => {
    return UPSC_FULL_SYLLABUS.flatMap((s) => safeArray(s.topics));
  }, []);

  const allSubtopicsCount = useMemo(() => {
    return allTopics.reduce((acc, t) => acc + (t.subtopics?.length || 0), 0);
  }, [allTopics]);

  const overallCompleted = completed.length;
  const overallTotal = allTopics.length;
  const overallPercent =
    overallTotal === 0 ? 0 : Math.round((overallCompleted / overallTotal) * 100);

  const toggleTopic = useCallback((topicId: string) => {
    sound.playSelect();
    let isMarkedDone = false;
    setCompleted((prev) => {
      isMarkedDone = !prev.includes(topicId);
      const nextList = prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
      } catch {}
      return nextList;
    });

    if (isMarkedDone) {
      void trackActivityEvent("TOPIC_STUDIED", { topicId });
      void trackActivityEvent("TOPIC_COMPLETED", { topicId });
    }

    broadcastSyncChange("syllabus");
    void pushStateToCloud();
  }, []);

  const toggleSubtopic = useCallback((subtopicId: string) => {
    sound.playHover();
    setCompletedSubtopics((prev) => {
      const nextList = prev.includes(subtopicId)
        ? prev.filter((id) => id !== subtopicId)
        : [...prev, subtopicId];
      try {
        localStorage.setItem(SUBTOPIC_STORAGE_KEY, JSON.stringify(nextList));
      } catch {}
      return nextList;
    });
    broadcastSyncChange("syllabus");
    void pushStateToCloud();
  }, []);

  const toggleExpand = (topicId: string) => {
    sound.playHover();
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  };

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset all syllabus progress?")) {
      setCompleted([]);
      setCompletedSubtopics([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SUBTOPIC_STORAGE_KEY);
      } catch {}
      broadcastSyncChange("syllabus");
      void pushStateToCloud();
    }
  };

  const visibleSubjects = useMemo(() => {
    return UPSC_FULL_SYLLABUS.filter((s) => {
      if (selectedSubject !== "all" && s.id !== selectedSubject) return false;
      return true;
    }).map((s) => {
      const filteredTopics = safeArray(s.topics).filter((topic) => {
        // Paper Filter
        if (paperFilter !== "All Papers") {
          if (paperFilter === "Prelims GS-1") {
            if (topic.exam !== "Prelims" && topic.exam !== "Both") return false;
            if (topic.paper === "CSAT") return false;
          } else if (topic.paper !== paperFilter) {
            return false;
          }
        }

        // Exam Filter
        const matchesExam = examFilter === "All" || topic.exam === examFilter || topic.exam === "Both";
        const matchesYield = yieldFilter === "All" || topic.importance === yieldFilter;

        // Search Filter (checks topic name and micro-subtopics)
        const q = search.trim().toLowerCase();
        const matchesSearch =
          !q ||
          topic.name.toLowerCase().includes(q) ||
          (topic.subtopics && topic.subtopics.some((st) => st.name.toLowerCase().includes(q)));

        return matchesExam && matchesYield && matchesSearch;
      });

      return {
        ...s,
        topics: filteredTopics,
      };
    }).filter((s) => s.topics.length > 0);
  }, [selectedSubject, paperFilter, examFilter, yieldFilter, search]);

  const getSubjectProgress = (subject: SyllabusSubject) => {
    const total = safeArray(subject.topics).length;
    const done = safeArray(subject.topics).filter((t) => completed.includes(t.id)).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { done, total, percent };
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
        {/* UNIVERSAL HUD HEADER */}
        <AppUniversalHeader moduleName="Syllabus Master Matrix" moduleBadge="UPSC 2026-27 TAXONOMY" />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
          {/* HERO & OVERALL PROGRESS */}
          <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div>
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-[#F4C95D]">
                OFFICIAL UPSC CSE PRE-CUM-MAINS TAXONOMY (2026–27)
              </p>
              <h1 className="mt-1 text-2xl sm:text-4xl font-black text-white">Syllabus Master Matrix</h1>
              <p className="mt-2 text-xs sm:text-sm text-[#8C8C8C] max-w-2xl">
                Exhaustive, 100% authoritative syllabus breakdown across GS 1-4 & CSAT. Track every single unit, topic, and micro-subtopic with live progress synchronization.
              </p>
            </div>

            <div className="rounded-3xl border border-[#D8A63A]/30 bg-gradient-to-br from-[#1c1608] to-[#0d0d0d] p-6 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs text-[#F4C95D] uppercase font-bold tracking-wider">
                    Syllabus Coverage
                  </p>
                  <p className="mt-1 font-mono text-4xl font-black text-white">{overallPercent}%</p>
                </div>
                <div className="text-right font-mono text-xs space-y-0.5">
                  <p className="font-bold text-white/90">{overallCompleted} / {overallTotal} Topics</p>
                  <p className="text-[11px] text-[#F4C95D]/80">
                    {completedSubtopics.length} / {allSubtopicsCount} Micro-Checkpoints
                  </p>
                </div>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/5 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#D8A63A] to-[#F4C95D] transition-all duration-500 shadow-[0_0_15px_rgba(216,166,58,0.5)]"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
            </div>
          </section>

          {/* PAPER FILTER TABS */}
          <section className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/10 pb-4">
            <span className="font-mono text-xs font-bold text-white/40 uppercase pr-2">Paper:</span>
            {PAPER_OPTIONS.map((paper) => (
              <button
                key={paper}
                onClick={() => {
                  sound.playSelect();
                  setPaperFilter(paper);
                }}
                className={`shrink-0 rounded-2xl px-4 py-2 font-mono text-xs font-bold transition ${
                  paperFilter === paper
                    ? "bg-[#D8A63A] text-black shadow-lg shadow-[#D8A63A]/20"
                    : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {paper}
              </button>
            ))}
          </section>

          {/* SUBJECT SELECTOR GRID */}
          <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            <button
              onClick={() => {
                sound.playSelect();
                setSelectedSubject("all");
              }}
              className={`rounded-2xl border p-3.5 text-left transition ${
                selectedSubject === "all"
                  ? "border-[#D8A63A] bg-[#D8A63A]/15 shadow-lg shadow-[#D8A63A]/10"
                  : "border-white/10 bg-[#0d0d0d] hover:border-white/20 hover:bg-[#141414]"
              }`}
            >
              <span className="text-xl">📚</span>
              <p className="mt-2 text-xs font-bold truncate text-white">All Subjects</p>
              <p className="text-[10px] font-mono text-[#8C8C8C]">{overallCompleted}/{overallTotal}</p>
            </button>

            {UPSC_FULL_SYLLABUS.map((sub) => {
              const prog = getSubjectProgress(sub);
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    sound.playSelect();
                    setSelectedSubject(sub.id);
                  }}
                  className={`rounded-2xl border p-3.5 text-left transition ${
                    selectedSubject === sub.id
                      ? "border-[#D8A63A] bg-[#D8A63A]/15 shadow-lg shadow-[#D8A63A]/10"
                      : "border-white/10 bg-[#0d0d0d] hover:border-white/20 hover:bg-[#141414]"
                  }`}
                >
                  <span className="text-xl">{sub.icon}</span>
                  <p className="mt-2 text-xs font-bold truncate text-white">{sub.name}</p>
                  <p className="text-[10px] font-mono text-[#8C8C8C]">{prog.done}/{prog.total} ({prog.percent}%)</p>
                </button>
              );
            })}
          </section>

          {/* SEARCH & EXAM STAGE FILTERS */}
          <section className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Search across all units & micro-topics (e.g. Fundamental Rights, Monsoons, GDP, Writs, Kant, AMOC)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-xs sm:text-sm text-white outline-none placeholder:text-white/30 focus:border-[#D8A63A] transition shadow-inner font-sans"
            />
            <div className="flex flex-wrap items-center gap-2">
              {(["All", "Prelims", "Mains"] as const).map((stage) => (
                <button
                  key={stage}
                  onClick={() => {
                    sound.playSelect();
                    setExamFilter(stage);
                  }}
                  className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition ${
                    examFilter === stage
                      ? "bg-[#D8A63A] text-black shadow-lg shadow-[#D8A63A]/20"
                      : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {stage}
                </button>
              ))}

              {(["All", "High", "Medium", "Low"] as const).map((yd) => (
                <button
                  key={`yield-${yd}`}
                  onClick={() => {
                    sound.playSelect();
                    setYieldFilter(yd);
                  }}
                  className={`rounded-xl px-3.5 py-2 font-mono text-xs font-bold transition ${
                    yieldFilter === yd
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-950/40"
                      : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {yd === "All" ? "All Yields" : `${yd} Yield`}
                </button>
              ))}

              <button
                onClick={resetProgress}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white/40 hover:bg-red-950/30 hover:text-red-400 transition"
                title="Reset progress"
              >
                Reset
              </button>
            </div>
          </section>

          {/* TOPICS BREAKDOWN CARDS */}
          <section className="space-y-6">
            {visibleSubjects.map((sub) => {
              const prog = getSubjectProgress(sub);
              return (
                <div
                  key={sub.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d] shadow-xl"
                >
                  {/* SUBJECT HEADER */}
                  <div className="flex flex-col gap-3 border-b border-white/10 bg-gradient-to-r from-[#171408] to-[#0a0a0a] p-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8A63A]/30 bg-[#D8A63A]/10 text-xl">
                        {sub.icon}
                      </span>
                      <div>
                        <h2 className="text-base font-bold text-white">{sub.name}</h2>
                        <p className="text-xs text-[#8C8C8C]">{sub.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-xs font-bold text-[#F4C95D]">
                        {prog.done}/{prog.total} Done ({prog.percent}%)
                      </span>
                      <div className="h-2 w-28 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#D8A63A] transition-all"
                          style={{ width: `${prog.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* TOPIC ROWS */}
                  <div className="divide-y divide-white/5">
                    {safeArray(sub.topics).map((topic: SyllabusTopic, idx) => {
                      const isDone = completed.includes(topic.id);
                      const isExpanded = expandedTopics.has(topic.id);
                      const subtopics = topic.subtopics || [];
                      const doneSubtopicsCount = subtopics.filter((st) =>
                        completedSubtopics.includes(st.id)
                      ).length;

                      return (
                        <div
                          key={topic.id}
                          className={`transition ${
                            isDone ? "bg-[#D8A63A]/[0.02]" : "hover:bg-white/[0.01]"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                            <div
                              onClick={() => toggleTopic(topic.id)}
                              className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                            >
                              <div
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                                  isDone
                                    ? "border-[#D8A63A] bg-[#D8A63A] text-black font-black"
                                    : "border-white/20 bg-white/5 hover:border-[#D8A63A]/50"
                                }`}
                              >
                                {isDone && <span className="text-xs">✓</span>}
                              </div>
                              <span className="w-6 shrink-0 text-xs font-mono text-white/30">
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`text-sm font-semibold leading-relaxed ${
                                    isDone ? "text-white/40 line-through" : "text-white"
                                  }`}
                                >
                                  {topic.name}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pl-9 sm:pl-0">
                              {topic.paper && (
                                <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono font-bold text-white/40 border border-white/5">
                                  {topic.paper}
                                </span>
                              )}
                              <span
                                className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                                  topic.importance === "High"
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    : topic.importance === "Medium"
                                    ? "bg-[#D8A63A]/20 text-[#F4C95D]"
                                    : "bg-white/5 text-white/40"
                                }`}
                              >
                                {topic.importance === "High" ? "🔥 High Yield" : `${topic.importance} Yield`}
                              </span>

                              {subtopics.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(topic.id)}
                                  className={`rounded-md px-2.5 py-1 text-[10px] font-mono font-bold transition border cursor-pointer ${
                                    isExpanded
                                      ? "bg-[#D8A63A]/20 border-[#D8A63A]/40 text-[#F4C95D]"
                                      : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                                  }`}
                                >
                                  {isExpanded ? "▲ Hide Micro-Topics" : `▼ ${doneSubtopicsCount}/${subtopics.length} Micro-Topics`}
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sound.playWarp();
                                  router.push(`/pyqs?search=${encodeURIComponent(topic.name)}`);
                                }}
                                className="rounded-md bg-white/5 hover:bg-[#D8A63A] hover:text-black px-2.5 py-1 text-[10px] font-mono font-bold text-white/70 transition border border-white/10 cursor-pointer"
                                title="Practice related questions"
                              >
                                🎯 PYQs →
                              </button>
                            </div>
                          </div>

                          {/* EXPANDABLE MICRO-TOPICS LIST (Zero Omission from PDF) */}
                          {isExpanded && subtopics.length > 0 && (
                            <div className="border-t border-white/5 bg-black/40 px-6 py-4 pl-12 sm:pl-16 space-y-2 animate-in fade-in">
                              <p className="font-mono text-[10px] font-black uppercase tracking-wider text-[#F4C95D]/70 mb-2">
                                Micro-Topics Checklist ({doneSubtopicsCount} of {subtopics.length} completed):
                              </p>
                              <div className="grid gap-2 sm:grid-cols-2">
                                {subtopics.map((st) => {
                                  const isSubDone = completedSubtopics.includes(st.id);
                                  return (
                                    <div
                                      key={st.id}
                                      onClick={() => toggleSubtopic(st.id)}
                                      className={`flex items-start gap-2.5 rounded-xl border p-2 text-xs transition cursor-pointer ${
                                        isSubDone
                                          ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                                          : "border-white/5 bg-white/[0.02] text-white/70 hover:border-white/10 hover:bg-white/[0.04]"
                                      }`}
                                    >
                                      <span
                                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[9px] font-bold ${
                                          isSubDone
                                            ? "border-emerald-400 bg-emerald-400 text-black"
                                            : "border-white/20 bg-black/50 text-transparent"
                                        }`}
                                      >
                                        ✓
                                      </span>
                                      <span className={`leading-relaxed ${isSubDone ? "line-through opacity-70" : ""}`}>
                                        {st.name}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}
