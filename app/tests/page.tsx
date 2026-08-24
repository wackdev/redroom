"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MockTest, MockTestQuestion, TestResultRecord } from "@/lib/core/types";
import { formatDate, safeArray } from "@/lib/core/utils";
import {
  broadcastSyncChange,
  subscribeToSyncChanges,
  pushStateToCloud,
  useCloudSync,
} from "@/lib/sync/sync-engine";
import { STATIC_MOCK_MODULES } from "@/lib/mock-tests/static-modules";
import {
  LOCAL_STORAGE_CUSTOM_MODULES_KEY,
  parseRawModulePayload,
  getSubjectTheme,
  filterModulesBySubject,
  getDistinctTopicsForSubject,
} from "@/lib/mock-tests/module-engine";
import { UPSC_SUBJECT_TAXONOMY } from "@/lib/mock-tests/taxonomy";
import AuthGuard from "@/components/auth/AuthGuard";

const RESULT_STORAGE_KEY = "redroom_test_results";

export default function TestsPage() {
  const router = useRouter();
  const { isSyncing, lastSyncTime, triggerManualSync } = useCloudSync();

  // Core Datasets
  const [modules, setModules] = useState<MockTest[]>(STATIC_MOCK_MODULES);
  const [savedResults, setSavedResults] = useState<TestResultRecord[]>([]);

  // Selection & Navigation State
  const [selectedSubject, setSelectedSubject] = useState<string>("All Subjects");
  const [selectedTopic, setSelectedTopic] = useState<string>("All Topics");
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Test Taking State
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string | number, string>>({});
  const [marked, setMarked] = useState<Record<string | number, boolean>>({});
  const [eliminatedOpts, setEliminatedOpts] = useState<Record<string | number, string[]>>({});

  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [endTime, setEndTime] = useState<number | null>(null);

  // Result & Review State
  const [result, setResult] = useState<TestResultRecord | null>(null);
  const [reviewActiveTab, setReviewActiveTab] = useState<Record<string | number, "statements" | "elimination" | "takeaway" | "sources">>({});
  const [saving, setSaving] = useState<boolean>(false);

  // JSON Import Modal State
  const [importModalOpen, setImportModalOpen] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>("");
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Load Saved Results and Custom Modules
  const loadLocalData = useCallback(() => {
    try {
      // 1. Load test results
      const savedRes = localStorage.getItem(RESULT_STORAGE_KEY);
      if (savedRes) {
        const parsed = JSON.parse(savedRes);
        if (Array.isArray(parsed)) {
          setSavedResults(parsed);
        }
      }

      // 2. Load custom imported modules
      const customModStr = localStorage.getItem(LOCAL_STORAGE_CUSTOM_MODULES_KEY);
      if (customModStr) {
        const parsedCustom = JSON.parse(customModStr);
        if (Array.isArray(parsedCustom) && parsedCustom.length > 0) {
          const merged = [...STATIC_MOCK_MODULES];
          for (const c of parsedCustom) {
            if (!merged.some((m) => m.id === c.id)) {
              merged.push(c);
            }
          }
          setModules(merged);
          return;
        }
      }
      setModules(STATIC_MOCK_MODULES);
    } catch (err) {
      console.warn("Could not load local test data:", err);
      setModules(STATIC_MOCK_MODULES);
    }
  }, []);

  useEffect(() => {
    loadLocalData();

    const unsubscribe = subscribeToSyncChanges((type) => {
      if (type === "test_results" || type === "all") {
        loadLocalData();
      }
    });

    return unsubscribe;
  }, [loadLocalData]);

  // Unique Subject List
  const subjectList = useMemo(() => {
    const subs = Array.from(new Set(modules.map((m) => m.subject)));
    return ["All Subjects", ...subs];
  }, [modules]);

  // Distinct Topics for Selected Subject
  const availableTopics = useMemo(() => {
    const topics = getDistinctTopicsForSubject(modules, selectedSubject);
    return ["All Topics", ...topics];
  }, [modules, selectedSubject]);

  const filteredModules = useMemo(() => {
    return modules
      .filter((m) => {
        const matchesSubject = selectedSubject === "All Subjects" || filterModulesBySubject([m], selectedSubject).length > 0;
        const matchesTopic =
          selectedTopic === "All Topics" ||
          (m.topic && m.topic.toLowerCase().includes(selectedTopic.toLowerCase())) ||
          (m.moduleTitle && m.moduleTitle.toLowerCase().includes(selectedTopic.toLowerCase())) ||
          safeArray(m.questionList).some((q) =>
            Boolean(q.syllabusSubtopic && q.syllabusSubtopic.toLowerCase().includes(selectedTopic.toLowerCase()))
          );
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !searchQuery.trim() ||
          (m.title && m.title.toLowerCase().includes(q)) ||
          (m.moduleTitle && m.moduleTitle.toLowerCase().includes(q)) ||
          (m.topic && m.topic.toLowerCase().includes(q)) ||
          (m.description && m.description.toLowerCase().includes(q));
        return matchesSubject && matchesTopic && matchesSearch;
      })
      .sort((a, b) => {
        if (a.subject === b.subject) {
          return (a.moduleNumber || 0) - (b.moduleNumber || 0);
        }
        return a.subject.localeCompare(b.subject);
      });
  }, [modules, selectedSubject, selectedTopic, searchQuery]);



  // Save Result & Broadcast
  const saveResult = async (finalResult: TestResultRecord) => {
    setSaving(true);
    const updated = [finalResult, ...savedResults].slice(0, 100);
    setSavedResults(updated);

    try {
      localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(updated));
      broadcastSyncChange("test_results");
      void pushStateToCloud();
    } catch {}

    setSaving(false);
  };

  // Submit Test
  const submitTest = useCallback(
    async (autoSubmit = false) => {
      if (!selectedTest) return;

      if (!autoSubmit) {
        if (!window.confirm("Are you sure you want to submit this module test?")) return;
      }

      let correct = 0;
      let wrong = 0;
      let skipped = 0;

      safeArray(selectedTest.questionList).forEach((q) => {
        const selected = answers[q.id];
        if (!selected) skipped++;
        else if (selected.toUpperCase() === q.answer.toUpperCase()) correct++;
        else wrong++;
      });

      const attempted = correct + wrong;
      const rawScore =
        correct * selectedTest.marksPerQuestion - wrong * selectedTest.negativeMarking;
      const finalScore = Number(rawScore.toFixed(2));
      const maxScore = selectedTest.questions * selectedTest.marksPerQuestion;

      const finalResult: TestResultRecord = {
        id: `RES-${Date.now()}`,
        testId: selectedTest.id,
        title: selectedTest.title,
        subject: selectedTest.subject,
        moduleNumber: selectedTest.moduleNumber,
        score: finalScore,
        maxScore,
        correct,
        wrong,
        skipped,
        attempted,
        total: selectedTest.questions,
        date: new Date().toISOString(),
        userAnswers: answers,
      };

      setResult(finalResult);
      setFinished(true);
      setStarted(false);
      setEndTime(null);

      await saveResult(finalResult);
    },
    [selectedTest, answers, savedResults]
  );

  const submitTestRef = useRef(submitTest);
  useEffect(() => {
    submitTestRef.current = submitTest;
  });

  // Timer Tick
  useEffect(() => {
    if (!started || finished || !endTime) return;

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        void submitTestRef.current(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [started, finished, endTime]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const startTest = (test: MockTest) => {
    setSelectedTest(test);
    setStarted(true);
    setFinished(false);
    setResult(null);
    setCurrentQuestion(0);
    setAnswers({});
    setMarked({});
    setEliminatedOpts({});
    setEndTime(Date.now() + test.duration * 60 * 1000);
    setTimeLeft(test.duration * 60);
  };

  const handleToggleElimination = (qId: string | number, optId: string) => {
    const current = eliminatedOpts[qId] || [];
    const updated = current.includes(optId)
      ? current.filter((id) => id !== optId)
      : [...current, optId];
    setEliminatedOpts((prev) => ({ ...prev, [qId]: updated }));
  };

  // Import Custom JSON Module
  const handleProcessImport = () => {
    setImportError(null);
    setImportSuccess(null);

    try {
      if (!importJsonText.trim()) {
        setImportError("Please paste valid module JSON before importing.");
        return;
      }

      const parsedTests = parseRawModulePayload(importJsonText);
      if (parsedTests.length === 0) {
        setImportError("No valid test questions or modules found in the provided payload.");
        return;
      }

      const merged = [...modules];
      for (const p of parsedTests) {
        const existingIdx = merged.findIndex((m) => m.id === p.id);
        if (existingIdx >= 0) {
          merged[existingIdx] = p;
        } else {
          merged.push(p);
        }
      }

      setModules(merged);

      // Save custom modules to LocalStorage
      const customOnly = merged.filter(
        (m) => !STATIC_MOCK_MODULES.some((sm) => sm.id === m.id)
      );
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_MODULES_KEY, JSON.stringify(customOnly));
      broadcastSyncChange("test_results");

      setImportSuccess(`Successfully imported ${parsedTests.length} module(s) containing ${parsedTests.reduce((acc, t) => acc + t.questions, 0)} questions!`);

      setTimeout(() => {
        setImportModalOpen(false);
        setImportJsonText("");
        setImportSuccess(null);
      }, 1400);
    } catch (err: any) {
      setImportError(err.message || "Failed to parse JSON. Please verify syntax.");
    }
  };

  // ============================================================================
  // VIEW 1: ACTIVE TEST TAKING INTERFACE
  // ============================================================================
  if (started && selectedTest) {
    const qList = safeArray(selectedTest.questionList);
    const q = qList[currentQuestion];
    const qEliminated = new Set(eliminatedOpts[q?.id] || []);
    const theme = getSubjectTheme(selectedTest.subject);

    return (
      <AuthGuard>
        <main className="min-h-screen bg-[#07040e] text-white flex flex-col font-sans">
          {/* TEST HEADER */}
          <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d071a]/95 backdrop-blur-xl px-4 py-3 sm:px-6">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`rounded-xl px-2.5 py-1 text-xs font-black uppercase ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
                  {selectedTest.subject} · Module {selectedTest.moduleNumber || "01"}
                </span>
                <h2 className="truncate text-xs sm:text-sm font-bold text-white/90">
                  {selectedTest.topic || selectedTest.title}
                </h2>
              </div>

              {/* COUNTDOWN & CONTROLS */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-xs sm:text-sm font-black border transition ${
                    timeLeft <= 120
                      ? "border-red-500 bg-red-500/20 text-red-300 animate-pulse"
                      : "border-purple-500/40 bg-purple-500/10 text-purple-200"
                  }`}
                >
                  <span>⏱️</span>
                  <span>{formatTime(timeLeft)}</span>
                </div>

                <button
                  onClick={() => void submitTest(false)}
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/40 hover:opacity-90 transition"
                >
                  Submit Test
                </button>
              </div>
            </div>
          </header>

          {/* TEST WORKSPACE */}
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 sm:p-6 lg:grid lg:grid-cols-[1fr_320px] lg:gap-6">
            {/* MAIN QUESTION VIEW */}
            {q ? (
              <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7 shadow-2xl">
                <div>
                  {/* QUESTION METADATA BAR */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-black text-purple-300">
                        Q {currentQuestion + 1} of {qList.length}
                      </span>
                      {q.syllabusSubtopic && (
                        <span className="rounded-lg bg-pink-500/10 px-2.5 py-1 text-[11px] font-semibold text-pink-300 border border-pink-500/20">
                          📌 {q.syllabusSubtopic}
                        </span>
                      )}
                      {q.patternType && (
                        <span className="rounded-lg bg-white/5 px-2 py-1 text-[11px] font-medium text-white/50">
                          {q.patternType}
                        </span>
                      )}
                      {q.difficulty && (
                        <span className="text-[10px] font-bold text-amber-300">
                          ⭐ {q.difficulty}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">
                        +{selectedTest.marksPerQuestion} / -{selectedTest.negativeMarking}
                      </span>
                      <button
                        onClick={() =>
                          setMarked((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                        }
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition border ${
                          marked[q.id]
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-white/5 text-white/40 border-white/10 hover:text-white"
                        }`}
                      >
                        {marked[q.id] ? "★ Flagged" : "☆ Flag"}
                      </button>
                    </div>
                  </div>

                  {/* QUESTION TEXT */}
                  <div className="mt-5 text-sm sm:text-base font-semibold leading-relaxed text-white/95 whitespace-pre-line">

                  {q.question}
                </div>

                {/* OPTIONS LIST WITH STRIKE-THROUGH */}
                <div className="mt-6 space-y-2.5">
                  {safeArray(q.options).map((opt) => {
                    const isSelected = answers[q.id] === opt.id;
                    const isEliminated = qEliminated.has(opt.id);

                    let optClass = "border-white/10 bg-black/20 text-white/90 hover:border-purple-500/50 hover:bg-white/5";
                    if (isSelected) {
                      optClass = "border-purple-500 bg-purple-600/30 text-purple-200 font-bold shadow-[0_0_15px_rgba(168,85,247,0.25)]";
                    } else if (isEliminated) {
                      optClass = "border-white/5 bg-black/40 text-white/25 line-through opacity-50";
                    }

                    return (
                      <div key={`test-opt-${q.id}-${opt.id}`} className="relative flex items-center group">
                        <button
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                          className={`flex flex-1 items-start gap-3 rounded-2xl border p-4 text-left transition-all text-xs sm:text-sm ${optClass}`}
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-black text-xs ${
                              isSelected ? "bg-purple-500 text-white" : "bg-white/10 text-white/70"
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="pt-1 leading-snug pr-8">{opt.text}</span>
                        </button>

                        {/* STRIKE / RESTORE BUTTON */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleElimination(q.id, opt.id);
                          }}
                          title={isEliminated ? "Restore Option" : "Strike Out (Eliminate)"}
                          className={`absolute right-3 top-3.5 rounded-lg px-2 py-1 text-[10px] font-bold transition ${
                            isEliminated
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-white/5 text-white/40 border border-white/10 hover:bg-red-500/20 hover:text-red-300 opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          {isEliminated ? "✓ Restore" : "✕ Strike"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                <button
                  onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/70 hover:bg-white/10 disabled:opacity-30"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-2">
                  {answers[q.id] && (
                    <button
                      onClick={() => {
                        const next = { ...answers };
                        delete next[q.id];
                        setAnswers(next);
                      }}
                      className="text-xs text-white/40 hover:text-white underline"
                    >
                      Clear Choice
                    </button>
                  )}

                  {currentQuestion < qList.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestion((prev) => Math.min(qList.length - 1, prev + 1))}
                      className="rounded-xl bg-purple-600 px-6 py-2 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={() => void submitTest(false)}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-900/40 hover:opacity-90"
                    >
                      Finish Test ✓
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* QUESTION PALETTE DRAWER */}
          <aside className="mt-6 lg:mt-0 flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white/60">
              Module Question Palette
            </h3>

            <div className="mt-4 grid grid-cols-5 gap-2">
              {qList.map((quest, idx) => {
                const isCurrent = currentQuestion === idx;
                const isAns = Boolean(answers[quest.id]);
                const isFlg = Boolean(marked[quest.id]);

                let btnStyle = "bg-white/5 text-white/50 border-white/10 hover:bg-white/10";
                if (isCurrent) {
                  btnStyle = "border-purple-400 bg-purple-600 text-white font-black scale-105 shadow-md shadow-purple-600/40";
                } else if (isFlg) {
                  btnStyle = "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold";
                } else if (isAns) {
                  btnStyle = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold";
                }

                return (
                  <button
                    key={`palette-${quest.id}`}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`flex h-10 w-full items-center justify-center rounded-xl border text-xs transition-all ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* LEGEND */}
            <div className="mt-6 border-t border-white/10 pt-4 space-y-2 text-[11px] text-white/50">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Answered:
                </span>
                <strong className="text-white">{Object.keys(answers).length}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Flagged:
                </span>
                <strong className="text-white">{Object.keys(marked).length}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" /> Remaining:
                </span>
                <strong className="text-white">{qList.length - Object.keys(answers).length}</strong>
              </div>
            </div>
          </aside>
        </div>
      </main>
      </AuthGuard>
    );
  }


  // ============================================================================
  // VIEW 2: POST-TEST DETAILED REVIEW & SCORECARD HUD
  // ============================================================================
  if (finished && selectedTest && result) {
    const accuracy = result.attempted > 0 ? Math.round((result.correct / result.attempted) * 100) : 0;
    const theme = getSubjectTheme(selectedTest.subject);

    return (
      <AuthGuard>
        <main className="min-h-screen bg-[#07040e] text-white p-4 sm:p-6 font-sans">
          <div className="mx-auto max-w-5xl space-y-6">
            {/* SCORECARD HERO BANNER */}
            <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-[#170929] via-[#240c42] to-[#120520] p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
                    {selectedTest.subject} · Module {selectedTest.moduleNumber || "01"}
                  </span>
                  <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
                    Test Performance Scorecard
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-white/60">
                    {selectedTest.topic || selectedTest.title}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Score</p>
                    <p className="text-2xl sm:text-3xl font-black text-purple-300">
                      {result.score} <span className="text-xs text-white/40">/ {result.maxScore || result.total * 2}</span>
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Accuracy</p>
                    <p className="text-2xl sm:text-3xl font-black text-emerald-400">
                      {accuracy}%
                    </p>
                  </div>
                </div>
              </div>

            {/* METRICS ROW */}

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center text-xs">
              <div className="rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/20">
                <span className="text-emerald-300 font-extrabold text-base sm:text-lg">✓ {result.correct}</span>
                <p className="text-emerald-200/70 text-[11px] mt-0.5">Correct (+{result.correct * 2.0})</p>
              </div>
              <div className="rounded-xl bg-red-500/10 p-3 border border-red-500/20">
                <span className="text-red-300 font-extrabold text-base sm:text-lg">✕ {result.wrong}</span>
                <p className="text-red-200/70 text-[11px] mt-0.5">Incorrect (-{(result.wrong * 0.66).toFixed(2)})</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                <span className="text-white/60 font-extrabold text-base sm:text-lg">⚪ {result.skipped}</span>
                <p className="text-white/40 text-[11px] mt-0.5">Skipped</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <button
                onClick={() => {
                  setFinished(false);
                  setSelectedTest(null);
                }}
                className="rounded-xl bg-white/10 px-5 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
              >
                ← Back to All Modules
              </button>

              <button
                onClick={() => startTest(selectedTest)}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 text-xs font-bold text-white shadow-lg hover:opacity-90 transition"
              >
                Retake This Module 🔄
              </button>
            </div>
          </div>

          {/* DETAILED QUESTION-BY-QUESTION SOLUTIONS */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white/90">
              Detailed Question Analysis & Explanations
            </h2>

            {safeArray(selectedTest.questionList).map((quest, qIdx) => {
              const userAns = answers[quest.id];
              const isCorrect = userAns && userAns.toUpperCase() === quest.answer.toUpperCase();
              const isSkipped = !userAns;
              const activeTab = reviewActiveTab[quest.id] || "statements";
              const detailed = quest.detailedExplanation;

              return (
                <div
                  key={`review-${quest.id}`}
                  className={`rounded-3xl border p-6 transition-all ${
                    isSkipped
                      ? "border-white/10 bg-white/[0.02]"
                      : isCorrect
                      ? "border-emerald-500/30 bg-emerald-950/10"
                      : "border-red-500/30 bg-red-950/10"
                  }`}
                >
                  {/* TOP STATUS HEADER */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 font-bold text-xs">
                        {qIdx + 1}
                      </span>
                      {quest.syllabusSubtopic && (
                        <span className="rounded-lg bg-pink-500/20 px-2.5 py-0.5 text-[11px] font-bold text-pink-300">
                          {quest.syllabusSubtopic}
                        </span>
                      )}
                    </div>

                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-black uppercase ${
                        isSkipped
                          ? "bg-white/10 text-white/50"
                          : isCorrect
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {isSkipped ? "⚪ Skipped" : isCorrect ? "✓ Correct (+2.00)" : "✕ Incorrect (-0.66)"}
                    </span>
                  </div>

                  {/* QUESTION TEXT */}
                  <p className="mt-4 text-sm sm:text-base font-semibold leading-relaxed text-white/95 whitespace-pre-line">
                    {quest.question}
                  </p>

                  {/* OPTIONS COMPARISON */}
                  <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {safeArray(quest.options).map((opt) => {
                      const isThisAns = opt.id === quest.answer;
                      const isUserChoice = opt.id === userAns;

                      let optStyle = "border-white/10 bg-black/20 text-white/60";
                      if (isThisAns) {
                        optStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-200 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]";
                      } else if (isUserChoice && !isThisAns) {
                        optStyle = "border-red-500 bg-red-500/20 text-red-200 line-through";
                      }

                      return (
                        <div
                          key={`rev-opt-${quest.id}-${opt.id}`}
                          className={`flex items-start gap-3 rounded-xl border p-3 text-xs leading-snug ${optStyle}`}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10 font-bold">
                            {opt.id}
                          </span>
                          <span className="pt-0.5 flex-1">{opt.text}</span>
                          {isThisAns && <span className="text-emerald-400 font-black">✓ Correct</span>}
                          {isUserChoice && !isThisAns && <span className="text-red-400 font-black">✕ Your Choice</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* DETAILED EXPLANATION TABS */}
                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
                    <div className="flex border-b border-white/10 bg-white/[0.02]">
                      <button
                        onClick={() =>
                          setReviewActiveTab((prev) => ({ ...prev, [quest.id]: "statements" as const }))
                        }
                        className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                          activeTab === "statements"
                            ? "border-purple-500 text-purple-300"
                            : "border-transparent text-white/50 hover:text-white"
                        }`}
                      >
                        📝 Statement Analysis
                      </button>

                      {detailed?.elimination_technique && (
                        <button
                          onClick={() =>
                            setReviewActiveTab((prev) => ({ ...prev, [quest.id]: "elimination" as const }))
                          }
                          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                            activeTab === "elimination"
                              ? "border-pink-500 text-pink-300"
                              : "border-transparent text-white/50 hover:text-white"
                          }`}
                        >
                          ✂️ Elimination Strategy
                        </button>
                      )}

                      {detailed?.concept_takeaway && (
                        <button
                          onClick={() =>
                            setReviewActiveTab((prev) => ({ ...prev, [quest.id]: "takeaway" as const }))
                          }
                          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                            activeTab === "takeaway"
                              ? "border-emerald-500 text-emerald-300"
                              : "border-transparent text-white/50 hover:text-white"
                          }`}
                        >
                          💡 Concept Takeaway
                        </button>
                      )}
                    </div>


                    <div className="p-4 text-xs sm:text-sm leading-relaxed text-white/85">
                      {activeTab === "statements" && (
                        <div className="space-y-3">
                          {detailed?.statement_analysis ? (
                            Object.entries(detailed.statement_analysis).map(([stKey, stVal]) => (
                              <div key={stKey} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                                <p className="font-bold text-purple-300 capitalize">{stKey.replace(/_/g, " ")}:</p>
                                <p className="mt-1 text-white/90 leading-relaxed">{stVal}</p>
                              </div>
                            ))
                          ) : (
                            <p>{quest.explanation || "No detailed breakdown available."}</p>
                          )}

                          {detailed?.reference_sources && detailed.reference_sources.length > 0 && (
                            <div className="mt-3 border-t border-white/10 pt-2 text-[11px] text-white/50">
                              <span className="font-bold text-white/70">Reference Sources: </span>
                              {detailed.reference_sources.join(" · ")}
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === "elimination" && detailed?.elimination_technique && (
                        <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-3 text-pink-100">
                          <p className="font-bold text-pink-300">🎯 UPSC Trap & Elimination Heuristic:</p>
                          <p className="mt-1.5 leading-relaxed">{detailed.elimination_technique}</p>
                        </div>
                      )}

                      {activeTab === "takeaway" && detailed?.concept_takeaway && (
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-emerald-100">
                          <p className="font-bold text-emerald-300">💡 High-Yield Core Concept:</p>
                          <p className="mt-1.5 leading-relaxed">{detailed.concept_takeaway}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      </AuthGuard>
    );
  }

  // ============================================================================
  // VIEW 3: SUBJECT-WISE MODULES EXPLORER DASHBOARD
  // ============================================================================
  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#07040e] text-white">
        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0d071a]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-xs font-bold text-purple-300 transition hover:text-white"
              >
                ← Command Centre
              </button>

            <span className="text-white/20">/</span>
            <span className="text-xs font-black uppercase tracking-wider text-white/70">
              Mock Test Arena · Subject Modules
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setImportModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition"
            >
              <span>📥</span>
              <span>Import Module JSON</span>
            </button>

            <button
              onClick={() => void triggerManualSync()}
              title="Sync state"
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-xs text-white/70 hover:bg-white/10 hover:text-white"
            >
              🔄
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
        {/* HERO SECTION */}
        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-pink-400">
              UPSC CSE PRELIMS · SECTIONAL MOCK TEST MODULES
            </p>
            <h1 className="mt-1.5 text-2xl font-black md:text-4xl text-white">
              Subject-Wise Test Modules
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed max-w-2xl">
              Master the syllabus sequentially through targeted, high-yield subject modules. Featuring authentic multi-statement pattern analysis, new-pattern pair matching, and statement-by-statement elimination breakdowns.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-white/60">Module Coverage</span>
              <span className="font-black text-purple-300">{modules.length} Modules Available</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-2xl bg-black/40 p-3 border border-white/5">
                <span className="text-xl font-black text-white">{modules.reduce((a, m) => a + m.questions, 0)}</span>
                <p className="text-[10px] text-white/40 uppercase font-bold mt-0.5">Total Questions</p>
              </div>
              <div className="rounded-2xl bg-black/40 p-3 border border-white/5">
                <span className="text-xl font-black text-emerald-400">{savedResults.length}</span>
                <p className="text-[10px] text-white/40 uppercase font-bold mt-0.5">Tests Completed</p>
              </div>
            </div>
          </div>
        </section>

        {/* SUBJECT SELECTOR TABS */}
        <section className="flex flex-wrap gap-2">
          {subjectList.map((sub) => {
            const isSelected = selectedSubject === sub;
            const count = sub === "All Subjects" ? modules.length : filterModulesBySubject(modules, sub).length;

            return (
              <button
                key={sub}
                onClick={() => {
                  setSelectedSubject(sub);
                  setSelectedTopic("All Topics");
                }}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 scale-105"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{sub}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    isSelected ? "bg-black/30 text-white" : "bg-white/10 text-white/50"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </section>

        {/* TOPIC FILTER CHIPS */}
        {availableTopics.length > 2 && (
          <section className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="shrink-0 text-[11px] font-bold uppercase text-white/40">Topic:</span>
            {availableTopics.map((top) => {
              const isTopSelected = selectedTopic === top;
              return (
                <button
                  key={top}
                  onClick={() => setSelectedTopic(top)}
                  className={`shrink-0 rounded-xl px-3 py-1.5 font-medium transition ${
                    isTopSelected
                      ? "bg-pink-600 text-white font-bold shadow-md shadow-pink-900/40"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {top}
                </button>
              );
            })}
          </section>
        )}

        {/* SEARCH & FILTERS */}
        <section className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search modules by topic (e.g., Subsidiary Alliance, Preamble, Monsoon, Fiscal Deficit)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-2.5 text-xs sm:text-sm text-white outline-none placeholder:text-white/30 focus:border-purple-500"
          />
        </section>

        {/* MODULES GRID */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white/60">
              Available Test Modules ({filteredModules.length})
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {filteredModules.map((mod, idx) => {
              const theme = getSubjectTheme(mod.subject);
              const pastAttempts = savedResults.filter((r) => {
                if (!r) return false;
                const matchId = r.testId != null && String(r.testId) === String(mod.id);
                const rTitle = typeof r.title === "string" ? r.title : "";
                const matchModuleNumber = Boolean(
                  mod.moduleNumber != null &&
                    rTitle &&
                    rTitle.toLowerCase().includes(`module ${mod.moduleNumber}`)
                );
                const matchTitle = Boolean(
                  mod.title && rTitle && rTitle.toLowerCase().includes(mod.title.toLowerCase())
                );
                return matchId || matchModuleNumber || matchTitle;
              });
              const validScores = pastAttempts
                .map((p) => (typeof p?.score === "number" ? p.score : null))
                .filter((s): s is number => s !== null && !isNaN(s));
              const bestScore = validScores.length > 0 ? Math.max(...validScores) : null;


              return (
                <article
                  key={`mod-card-${mod.id}-${idx}`}
                  className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-purple-500/40 hover:bg-white/[0.05] shadow-xl group"
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-xl px-2.5 py-1 text-[11px] font-black uppercase ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
                          MODULE {String(mod.moduleNumber || idx + 1).padStart(2, "0")}
                        </span>
                        <span className="text-xs text-white/50 font-bold">{mod.subject}</span>
                      </div>

                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                        ⭐ {mod.difficulty || "High Yield"}
                      </span>
                    </div>

                    {/* TITLE & DESCRIPTION */}
                    <h3 className="mt-3 text-base sm:text-lg font-black text-white/95 group-hover:text-purple-300 transition leading-snug">
                      {mod.moduleTitle || mod.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/60 leading-relaxed">
                      {mod.description || mod.topic}
                    </p>

                    {/* METADATA CHIPS */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-white/50">
                      <span className="rounded-lg bg-black/30 px-2.5 py-1 border border-white/5">
                        📝 <strong>{mod.questions}</strong> Questions
                      </span>
                      <span className="rounded-lg bg-black/30 px-2.5 py-1 border border-white/5">
                        ⏱️ <strong>{mod.duration}</strong> Mins
                      </span>
                      <span className="rounded-lg bg-black/30 px-2.5 py-1 border border-white/5 text-emerald-400">
                        +{mod.marksPerQuestion} / -{mod.negativeMarking}
                      </span>
                    </div>

                    {/* PAST ATTEMPT INDICATOR */}
                    {pastAttempts.length > 0 && (
                      <div className="mt-3.5 flex items-center justify-between rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 border border-emerald-500/20">
                        <span>✓ Practiced ({pastAttempts.length}x)</span>
                        <span className="font-black">Best: {bestScore} Marks</span>
                      </div>
                    )}
                  </div>

                  {/* START ACTION BUTTON */}
                  <div className="mt-6 border-t border-white/5 pt-4">
                    <button
                      onClick={() => startTest(mod)}
                      className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition hover:opacity-90"
                    >
                      {pastAttempts.length > 0 ? "Retake Module Test 🔄" : "Start Module Test →"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* =======================================================================
          JSON MODULE IMPORT MODAL
          ======================================================================= */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-purple-500/30 bg-[#0d071a] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📥</span>
                <h3 className="font-black text-base">Import Custom UPSC Mock Test Module</h3>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="text-xs text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-xs text-white/70 leading-relaxed">
              Paste your module JSON payload below. The system automatically parses multi-statement questions, statement-by-statement analysis, elimination heuristics, and reference sources into your test arena.
            </p>

            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{ "subject": "Modern Indian History", "module_number": 1, "module_title": "Advent of Europeans", "questions": [ ... ] }'
              rows={10}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/50 p-4 font-mono text-xs text-white outline-none focus:border-purple-500"
            />

            {importError && (
              <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                ✕ {importError}
              </div>
            )}

            {importSuccess && (
              <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 font-bold">
                ✓ {importSuccess}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
              <button
                onClick={() => setImportModalOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessImport}
                disabled={!importJsonText.trim()}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 text-xs font-bold text-white shadow-lg disabled:opacity-40"
              >
                Import & Save Module
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
    </AuthGuard>
  );
}

