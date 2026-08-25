"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UPSC_FULL_SYLLABUS } from "@/lib/syllabus/upsc-syllabus";
import { SyllabusSubject, SyllabusTopic } from "@/lib/core/types";
import { safeArray } from "@/lib/core/utils";
import { STATIC_PYQ_DATASET } from "@/lib/pyq/static-dataset";
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

export default function SyllabusPage() {
  const router = useRouter();
  const { isSyncing, lastSyncTime, triggerManualSync } = useCloudSync();

  const [completed, setCompleted] = useState<string[]>([]);
  const [search, setSearch] = useState("");
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
        if (Array.isArray(parsed)) {
          setCompleted(parsed);
        }
      }
    } catch (err) {
      console.warn("Could not load syllabus progress:", err);
    } finally {
      setLoaded(true);
    }

    // Subscribe to cross-tab updates
    const unsubscribe = subscribeToSyncChanges((type) => {
      if (type === "syllabus" || type === "all") {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setCompleted(parsed);
            }
          }
        } catch {}
      }
    });

    return unsubscribe;
  }, []);

  const allTopics = useMemo(() => {
    return UPSC_FULL_SYLLABUS.flatMap((s) => safeArray(s.topics));
  }, []);

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
      void trackActivityEvent("TOPIC_STUDIED", {
        topicId,
      });
      void trackActivityEvent("TOPIC_COMPLETED", {
        topicId,
      });
    }

    broadcastSyncChange("syllabus");
    void pushStateToCloud();
  }, []);

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset all syllabus progress?")) {
      setCompleted([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
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
        const matchesExam = examFilter === "All" || topic.exam === examFilter || topic.exam === "Both";
        const matchesYield = yieldFilter === "All" || topic.importance === yieldFilter;
        const matchesSearch =
          !search.trim() || topic.name.toLowerCase().includes(search.toLowerCase());
        return matchesExam && matchesYield && matchesSearch;
      });
      return {
        ...s,
        topics: filteredTopics,
      };
    }).filter((s) => s.topics.length > 0);
  }, [selectedSubject, examFilter, yieldFilter, search]);

  const getSubjectProgress = (subject: SyllabusSubject) => {
    const total = safeArray(subject.topics).length;
    const done = safeArray(subject.topics).filter((t) => completed.includes(t.id)).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { done, total, percent };
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
        {/* UNIVERSAL LUXURY HUD HEADER */}
        <AppUniversalHeader moduleName="Syllabus Master Matrix" moduleBadge="UPSC OFFICIAL TAXONOMY" />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
          {/* 3D ZONE INVITATION BANNER */}
          <section className="overflow-hidden rounded-3xl border border-[#D8A63A]/30 bg-gradient-to-r from-[#171408] via-[#201809] to-[#0d0d0d] p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 text-2xl shadow-[0_0_15px_rgba(216,166,58,0.3)]">
                🌌
              </div>
              <div>
                <h3 className="font-mono text-sm font-black uppercase text-white tracking-wide">
                  Explore 3D Earth Globe, History Tunnel & Constitutional Atlas
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  Immerse in full 3D visual simulators, GIS spatial cartography, and knowledge constellations in the dedicated Reality Lab.
                </p>
              </div>
            </div>
            <Link
              href="/3d-zone"
              className="shrink-0 rounded-2xl bg-[#D8A63A] px-5 py-2.5 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-lg shadow-[#D8A63A]/20"
            >
              Open 3D Zone →
            </Link>
          </section>

          {/* HERO & OVERALL PROGRESS */}
          <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div>
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-[#F4C95D]">
                OFFICIAL UPSC CSE SYLLABUS
              </p>
              <h1 className="mt-1 text-2xl sm:text-4xl font-black text-white">Syllabus Master Command</h1>
              <p className="mt-2 text-xs sm:text-sm text-[#8C8C8C] max-w-2xl">
                Complete Prelims and Mains (GS 1-4) micro-topics mapped with high-yield frequency tracking, instant cross-links to real PYQs, and cloud state synchronization.
              </p>
            </div>

            <div className="rounded-3xl border border-[#D8A63A]/30 bg-gradient-to-br from-[#1c1608] to-[#0d0d0d] p-6 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs text-[#F4C95D] uppercase font-bold tracking-wider">
                    Overall Coverage
                  </p>
                  <p className="mt-1 font-mono text-4xl font-black text-white">{overallPercent}%</p>
                </div>
                <p className="font-mono text-xs font-bold text-white/70">
                  {overallCompleted} / {overallTotal} Topics
                </p>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/5 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#D8A63A] to-[#F4C95D] transition-all duration-500 shadow-[0_0_15px_rgba(216,166,58,0.5)]"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
            </div>
          </section>

          {/* SUBJECT SELECTOR GRID */}
          <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            <button
              onClick={() => {
                sound.playSelect();
                setSelectedSubject("all");
              }}
              className={`rounded-2xl border p-4 text-left transition ${
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
                  className={`rounded-2xl border p-4 text-left transition ${
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
              placeholder="Search syllabus micro-topics (e.g. Fundamental Rights, Monsoon, GDP, Writs)..."
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
                      const topicLower = topic.name.toLowerCase();
                      const prelimsMatches = STATIC_PYQ_DATASET.filter((q) =>
                        q.question.toLowerCase().includes(topicLower) ||
                        (q.topic && q.topic.toLowerCase().includes(topicLower)) ||
                        (q.subject.toLowerCase() === sub.name.toLowerCase())
                      ).length;

                      return (
                        <div
                          key={topic.id}
                          onClick={() => toggleTopic(topic.id)}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 transition cursor-pointer ${
                            isDone ? "bg-[#D8A63A]/[0.03] hover:bg-[#D8A63A]/[0.06]" : "hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
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

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                sound.playWarp();
                                router.push(`/pyqs?search=${encodeURIComponent(topic.name)}`);
                              }}
                              className="rounded-md bg-white/5 hover:bg-[#D8A63A] hover:text-black px-2.5 py-1 text-[10px] font-mono font-bold text-white/70 transition border border-white/10"
                              title="Practice related PYQs"
                            >
                              🎯 PYQs ({prelimsMatches}) →
                            </button>
                          </div>
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
