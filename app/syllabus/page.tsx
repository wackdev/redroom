"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UPSC_FULL_SYLLABUS } from "@/lib/syllabus/upsc-syllabus";
import { SyllabusSubject, SyllabusTopic } from "@/lib/core/types";
import { safeArray } from "@/lib/core/utils";
import { STATIC_PYQ_DATASET } from "@/lib/pyq/static-dataset";
import { STATIC_MAINS_PYQ_DATASET } from "@/lib/mains-pyq/static-dataset";
import {
  broadcastSyncChange,
  subscribeToSyncChanges,
  pushStateToCloud,
  useCloudSync,
} from "@/lib/sync/sync-engine";
import AuthGuard from "@/components/auth/AuthGuard";

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
    setCompleted((prev) => {
      const nextList = prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
      } catch {}
      return nextList;
    });

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
      <main className="min-h-screen bg-[#080510] text-white">
        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0714]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-sm text-purple-300 transition hover:text-white"
              >
                ← Command Centre
              </button>

            <span className="text-white/20">|</span>
            <div className="flex items-center gap-2">
              <span className="text-lg">📚</span>
              <span className="font-bold tracking-tight">UPSC Syllabus Tracker</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => void triggerManualSync()}
              title="Click to sync data with cloud"
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                isSyncing
                  ? "border-pink-500/40 bg-pink-500/10 text-pink-300 animate-pulse"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{isSyncing ? "🔄" : "☁️"}</span>
              <span className="hidden sm:inline">
                {isSyncing ? "Syncing..." : lastSyncTime ? `Synced (${lastSyncTime})` : "Cloud Synced"}
              </span>
            </button>
            <button
              onClick={resetProgress}
              className="rounded-xl border border-pink-500/30 px-4 py-1.5 text-xs font-semibold text-pink-400 hover:bg-pink-500/10"
            >
              Reset Progress
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* HERO & OVERALL PROGRESS */}
        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-400">
              OFFICIAL UPSC CSE SYLLABUS
            </p>
            <h1 className="mt-1 text-3xl font-black md:text-4xl">Syllabus Master Command</h1>
            <p className="mt-2 text-sm text-white/50">
              Complete Prelims and Mains (GS 1-4) micro-topics mapped with high-yield frequency tracking.
            </p>
          </div>

          <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/40 to-fuchsia-900/20 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-300 uppercase font-bold tracking-wider">
                  Overall Syllabus Coverage
                </p>
                <p className="mt-1 text-4xl font-black">{overallPercent}%</p>
              </div>
              <p className="text-sm font-bold text-white/70">
                {overallCompleted} / {overallTotal} Topics
              </p>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-black/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-400 transition-all duration-500"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>
        </section>

        {/* SUBJECT SELECTOR BAR */}
        <section className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          <button
            onClick={() => setSelectedSubject("all")}
            className={`rounded-2xl border p-3.5 text-left transition ${
              selectedSubject === "all"
                ? "border-purple-500 bg-purple-600/30"
                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
            }`}
          >
            <span className="text-xl">📚</span>
            <p className="mt-2 text-xs font-bold truncate">All Subjects</p>
            <p className="text-[10px] text-white/40">{overallCompleted}/{overallTotal}</p>
          </button>

          {UPSC_FULL_SYLLABUS.map((sub) => {
            const prog = getSubjectProgress(sub);
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id)}
                className={`rounded-2xl border p-3.5 text-left transition ${
                  selectedSubject === sub.id
                    ? "border-purple-500 bg-purple-600/30"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
              >
                <span className="text-xl">{sub.icon}</span>
                <p className="mt-2 text-xs font-bold truncate">{sub.name}</p>
                <p className="text-[10px] text-white/40">{prog.done}/{prog.total}</p>
              </button>
            );
          })}
        </section>

        {/* SEARCH & EXAM STAGE FILTER */}
        <section className="mb-8 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="Search syllabus micro-topics (e.g. Fundamental Rights, Monsoon, GDP)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-purple-500"
          />
          <div className="flex flex-wrap gap-2">
            {(["All", "Prelims", "Mains"] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => setExamFilter(stage)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  examFilter === stage
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {stage}
              </button>
            ))}

            {(["All", "High", "Medium", "Low"] as const).map((yd) => (
              <button
                key={`yield-${yd}`}
                onClick={() => setYieldFilter(yd)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                  yieldFilter === yd
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {yd === "All" ? "All Yields" : `${yd} Yield`}
              </button>
            ))}
          </div>
        </section>

        {/* TOPICS BREAKDOWN */}
        <section className="space-y-6">
          {visibleSubjects.map((sub) => {
            const prog = getSubjectProgress(sub);
            return (
              <div
                key={sub.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
              >
                {/* SUBJECT HEADER */}
                <div className="flex flex-col gap-3 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-black/20 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-xl">
                      {sub.icon}
                    </span>
                    <div>
                      <h2 className="text-lg font-bold">{sub.name}</h2>
                      <p className="text-xs text-white/40">{sub.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-purple-300">
                      {prog.done}/{prog.total} Done ({prog.percent}%)
                    </span>
                    <div className="h-2 w-28 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-purple-500 transition-all"
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
                          isDone ? "bg-purple-500/[0.04] hover:bg-purple-500/[0.08]" : "hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                              isDone
                                ? "border-pink-400 bg-pink-500 text-white"
                                : "border-white/20 bg-white/5"
                            }`}
                          >
                            {isDone && <span className="text-xs font-black">✓</span>}
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
                            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/40">
                              {topic.paper}
                            </span>
                          )}
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              topic.importance === "High"
                                ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                                : topic.importance === "Medium"
                                ? "bg-purple-500/20 text-purple-300"
                                : "bg-white/5 text-white/40"
                            }`}
                          >
                            {topic.importance === "High" ? "🔥 High Yield" : `${topic.importance} Yield`}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/pyqs?search=${encodeURIComponent(topic.name)}`);
                            }}
                            className="rounded-md bg-white/5 hover:bg-purple-600 hover:text-white px-2 py-0.5 text-[10px] font-semibold text-white/60 transition border border-white/10"
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


