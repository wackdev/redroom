"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { sound } from "@/lib/audio/sound-engine";
import { mutateWithOutbox, dexieDb } from "@/lib/db/dexie";
import rawCsatQuestions from "@/data/csat-questions.json";
import { getCompleteCSATQuestionBank, CSATQuestionItem } from "@/lib/csat/csat-bank";
import SyllogismVennVisualizer from "@/components/SyllogismVennVisualizer";
import CSATSpeedMathTrainer from "@/components/CSATSpeedMathTrainer";
import AuthGuard from "@/components/auth/AuthGuard";

type CSATQuestion = CSATQuestionItem;

// Merge static curated questions with dynamic 100+ question bank
const combinedPool: CSATQuestion[] = [
  ...(rawCsatQuestions as CSATQuestion[]),
  ...getCompleteCSATQuestionBank(),
];

// De-duplicate by ID
const csatDataset: CSATQuestion[] = Array.from(
  new Map(combinedPool.map((q) => [q.id, q])).values()
);

interface CSATAttemptRecord {
  id?: number | string;
  test_title?: string;
  score: number;
  total_questions?: number;
  correct: number;
  wrong: number;
  accuracy?: number;
  completed_at?: string;
}

export default function CSATMatrixArena() {
  const router = useRouter();

  // Mode & Filtering States
  const [mode, setMode] = useState<"practice" | "mock">("practice");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  // Practice State
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Set<string>>(new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [formulaDrawerOpen, setFormulaDrawerOpen] = useState<boolean>(false);
  const [showSyllogismVisualizer, setShowSyllogismVisualizer] = useState<boolean>(false);
  const [showSpeedMath, setShowSpeedMath] = useState<boolean>(false);
  const [pastAttempts, setPastAttempts] = useState<CSATAttemptRecord[]>([]);

  // Mock Arena Timer State
  const [mockTimeRemaining, setMockTimeRemaining] = useState<number>(120 * 60); // 120 mins
  const [mockActive, setMockActive] = useState<boolean>(false);
  const [mockSubmitted, setMockSubmitted] = useState<boolean>(false);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return csatDataset.filter((q) => {
      const matchCat = selectedCategory === "All" || q.category === selectedCategory;
      const matchDiff = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
      const matchSearch =
        !search.trim() ||
        q.question.toLowerCase().includes(search.toLowerCase()) ||
        q.subtopic.toLowerCase().includes(search.toLowerCase()) ||
        (q.passage && q.passage.toLowerCase().includes(search.toLowerCase()));

      return matchCat && matchDiff && matchSearch;
    });
  }, [selectedCategory, selectedDifficulty, search]);

  const currentQ = filteredQuestions[activeQuestionIndex] || filteredQuestions[0];

  // Score Calculations (+2.5 for correct, -0.83 for wrong)
  const stats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let attempted = 0;

    Object.entries(userAnswers).forEach(([qId, ans]) => {
      const question = csatDataset.find((q) => q.id === qId);
      if (question) {
        attempted++;
        if (question.correctAnswer === ans) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    const netScore = +(correct * 2.5 - wrong * 0.833).toFixed(2);
    const accuracy = attempted > 0 ? +((correct / attempted) * 100).toFixed(1) : 0;
    const isQualifying = netScore >= 66.67;

    return {
      attempted,
      correct,
      wrong,
      netScore,
      accuracy,
      isQualifying,
    };
  }, [userAnswers]);

  // Load Past CSAT Attempts from Dexie
  const loadPastAttempts = useCallback(async () => {
    try {
      const results = await dexieDb.test_results
        .where("subject")
        .equals("CSAT")
        .reverse()
        .limit(10)
        .toArray();

      setPastAttempts(
        results.map((r) => ({
          id: r.id,
          test_title: r.test_title || r.title || "CSAT Session",
          score: r.score,
          total_questions: r.total_questions || r.total || 0,
          correct: r.correct,
          wrong: r.wrong,
          accuracy: r.accuracy || (r.total ? Math.round((r.correct / r.total) * 100) : 0),
          completed_at: r.completed_at || r.createdAt || r.date || new Date().toISOString(),
        }))
      );
    } catch {}
  }, []);

  useEffect(() => {
    void loadPastAttempts();
  }, [loadPastAttempts]);

  // Persistent Outbox Save Function
  const saveCSATResultToOutbox = useCallback(
    async (finalStats: typeof stats, totalQ: number, timeSpent: number) => {
      sound.playWarp();
      try {
        const now = new Date().toISOString();
        const testTitle = `CSAT ${mode === "mock" ? "120-Min Simulation" : "Speed Matrix Drill"}`;
        const testResult = {
          title: testTitle,
          test_title: testTitle,
          subject: "CSAT",
          score: finalStats.netScore,
          total: totalQ,
          total_questions: totalQ,
          attempted: finalStats.attempted,
          skipped: Math.max(0, totalQ - finalStats.attempted),
          correct: finalStats.correct,
          wrong: finalStats.wrong,
          accuracy: finalStats.accuracy,
          date: now,
          completed_at: now,
          createdAt: now,
          time_spent_seconds: timeSpent,
          userId: "local-cadet",
        };

        await mutateWithOutbox({
          entityType: "test_results",
          action: "INSERT",
          entityId: Date.now(),
          data: testResult,
        });

        void loadPastAttempts();
      } catch (err) {
        console.warn("Failed to persist CSAT attempt to outbox:", err);
      }
    },
    [mode, stats, loadPastAttempts]
  );

  // Timer for Mock Arena
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mockActive && !mockSubmitted && mockTimeRemaining > 0) {
      timer = setInterval(() => {
        setMockTimeRemaining((prev) => {
          if (prev <= 1) {
            setMockSubmitted(true);
            sound.playVictory();
            void saveCSATResultToOutbox(stats, filteredQuestions.length, 120 * 60);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mockActive, mockSubmitted, mockTimeRemaining, stats, filteredQuestions.length, saveCSATResultToOutbox]);

  const handleSelectOption = (qId: string, optId: string) => {
    if (mockSubmitted) return;
    sound.playHover();
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optId,
    }));
  };

  const handleToggleExplanation = (qId: string) => {
    sound.playLock();
    const next = new Set(revealedExplanations);
    if (next.has(qId)) next.delete(qId);
    else next.add(qId);
    setRevealedExplanations(next);
  };

  const handleToggleBookmark = (qId: string) => {
    sound.playHover();
    const next = new Set(bookmarkedIds);
    if (next.has(qId)) next.delete(qId);
    else next.add(qId);
    setBookmarkedIds(next);
  };

  const handleSubmitMock = () => {
    setMockSubmitted(true);
    sound.playVictory();
    const timeSpent = 120 * 60 - mockTimeRemaining;
    void saveCSATResultToOutbox(stats, filteredQuestions.length, timeSpent);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };


  return (
    <AuthGuard>
      <main className="relative flex min-h-screen w-full flex-col bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
        {/* TOP COMMAND HEADER */}
        <header className="sticky top-0 z-30 flex w-full flex-wrap items-center justify-between border-b border-white/10 bg-[#090909]/95 px-6 py-4 backdrop-blur-xl sm:px-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playHover();
                router.push("/dashboard");
              }}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-mono text-xs text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition"
            >
              ←
            </button>
            <div>
              <h1 className="font-mono text-xs sm:text-sm font-black tracking-widest text-white uppercase flex items-center gap-2">
                <span>📐</span>
                <span>CSAT SPEED & LOGIC MATRIX LAB</span>
              </h1>
              <p className="text-[10px] font-mono text-[#8C8C8C]">
                UPSC PAPER-II // 66.67 QUALIFYING THRESHOLD // ACCURACY ACCELERATOR
              </p>
            </div>
          </div>


        {/* TELEMETRY METRICS BADGE */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-3.5 py-1.5 font-mono text-xs">
            <span className="text-[#8C8C8C]">SCORE:</span>
            <strong
              className={`font-black ${
                stats.netScore >= 66.67 ? "text-emerald-400" : "text-[#F4C95D]"
              }`}
            >
              {stats.netScore} / 200
            </strong>
            <span className="text-[10px] text-[#8C8C8C]">
              ({stats.isQualifying ? "QUALIFYING ✓" : "BELOW 66.7 ⚠️"})
            </span>
          </div>

          <button
            onClick={() => {
              setShowSyllogismVisualizer((p) => !p);
              sound.playHover();
            }}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 font-mono text-xs font-bold transition ${
              showSyllogismVisualizer
                ? "border-purple-500 bg-purple-600 text-white shadow-lg"
                : "border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
            }`}
          >
            <span>⭕</span>
            <span>{showSyllogismVisualizer ? "Hide Venn Visualizer" : "Syllogism Venn Visualizer"}</span>
          </button>

          <button
            onClick={() => {
              setShowSpeedMath((p) => !p);
              sound.playHover();
            }}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 font-mono text-xs font-bold transition ${
              showSpeedMath
                ? "border-[#D8A63A] bg-[#D8A63A] text-black shadow-lg"
                : "border-[#D8A63A]/40 bg-[#D8A63A]/10 text-[#F4C95D] hover:bg-[#D8A63A]/20"
            }`}
          >
            <span>⚡</span>
            <span>{showSpeedMath ? "Hide Speed Math" : "Speed Math Drill"}</span>
          </button>

          <button
            onClick={() => setFormulaDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-xs font-bold text-white hover:bg-white/10 transition"
          >
            <span>📖</span>
            <span>Formula Deck</span>
          </button>
        </div>
      </header>

      {/* WORKSPACE CONTAINER */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-8">
        {/* SYLLOGISM VENN DIAGRAM VISUALIZER */}
        {showSyllogismVisualizer && (
          <section className="mb-2">
            <SyllogismVennVisualizer />
          </section>
        )}

        {/* CSAT SPEED MATH ACCELERATOR */}
        {showSpeedMath && (
          <section className="mb-2">
            <CSATSpeedMathTrainer />
          </section>
        )}

        {/* CONTROLS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#0d0d0d] p-4 shadow-xl">
          {/* CATEGORY SWITCHER */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "All", label: "All Categories", icon: "🌐" },
              { id: "Comprehension", label: "Reading Comprehension", icon: "📖" },
              { id: "Quant", label: "Quantitative Aptitude", icon: "🔢" },
              { id: "Reasoning", label: "Logical Reasoning", icon: "🧠" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveQuestionIndex(0);
                  sound.playHover();
                }}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-mono text-xs transition ${
                  selectedCategory === cat.id
                    ? "border border-[#D8A63A] bg-[#D8A63A]/20 font-black text-[#F4C95D]"
                    : "border border-white/5 bg-white/5 text-[#8C8C8C] hover:text-white"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* MODE TOGGLE */}
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 p-1 font-mono text-xs">
            <button
              onClick={() => {
                setMode("practice");
                sound.playHover();
              }}
              className={`rounded-xl px-3.5 py-1 transition ${
                mode === "practice"
                  ? "bg-[#D8A63A] font-bold text-black shadow-md"
                  : "text-[#8C8C8C] hover:text-white"
              }`}
            >
              Practice Lab
            </button>
            <button
              onClick={() => {
                setMode("mock");
                if (!mockActive) setMockActive(true);
                sound.playWarp();
              }}
              className={`rounded-xl px-3.5 py-1 transition ${
                mode === "mock"
                  ? "bg-gradient-to-r from-red-600 to-amber-600 font-bold text-white shadow-md"
                  : "text-[#8C8C8C] hover:text-white"
              }`}
            >
              ⏱️ Timed Arena
            </button>
          </div>
        </div>

        {/* TIMED ARENA BANNER IF ACTIVE */}
        {mode === "mock" && (
          <div className="flex items-center justify-between rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-black to-black p-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold text-white">CSAT 120-MIN ARENA ACTIVE</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-black text-[#F4C95D]">
                TIME REMAINING: {formatTime(mockTimeRemaining)}
              </span>
              <button
                onClick={handleSubmitMock}
                className="rounded-xl bg-amber-500 px-4 py-1.5 font-bold text-black hover:bg-amber-400 transition"
              >
                Submit Simulation ✓
              </button>
            </div>
          </div>
        )}

        {/* MAIN QUESTION WORKSPACE (TWO COLUMN) */}
        {filteredQuestions.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#0d0d0d] p-16 text-center">
            <span className="text-4xl">🔍</span>
            <h3 className="mt-3 font-mono text-base font-bold text-white">No CSAT Questions Match</h3>
            <p className="mt-1 text-xs text-[#8C8C8C]">Try adjusting category filters or search parameters.</p>
          </div>
        ) : (
          <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            {/* ACTIVE QUESTION PANEL */}
            <article className="flex flex-col rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl">
              {/* QUESTION HEADER */}
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-2.5 py-1 font-mono text-[10px] font-black text-[#F4C95D]">
                    {currentQ.category.toUpperCase()} · {currentQ.year}
                  </span>
                  <span className="text-xs font-mono text-[#8C8C8C]">{currentQ.subtopic}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#8C8C8C]">
                    Q {activeQuestionIndex + 1} of {filteredQuestions.length}
                  </span>
                  <button
                    onClick={() => handleToggleBookmark(currentQ.id)}
                    className="text-sm text-[#8C8C8C] hover:text-[#F4C95D]"
                  >
                    {bookmarkedIds.has(currentQ.id) ? "⭐" : "☆"}
                  </button>
                </div>
              </div>

              {/* COMPREHENSION PASSAGE IF APPLICABLE */}
              {currentQ.passage && (
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/60 p-5 font-serif text-sm text-[#E5E5E5] leading-relaxed">
                  <span className="font-mono text-[10px] font-bold text-[#F4C95D] uppercase block mb-2">
                    📖 READING COMPREHENSION PASSAGE
                  </span>
                  {currentQ.passage}
                </div>
              )}

              {/* QUESTION TEXT */}
              <div className="mt-5">
                <p className="font-mono text-sm sm:text-base font-bold text-white leading-relaxed whitespace-pre-line">
                  {currentQ.question}
                </p>
              </div>

              {/* OPTIONS GRID */}
              <div className="mt-6 flex flex-col gap-3">
                {currentQ.options.map((opt) => {
                  const isSelected = userAnswers[currentQ.id] === opt.id;
                  const isRevealed = revealedExplanations.has(currentQ.id);
                  const isCorrect = currentQ.correctAnswer === opt.id;

                  let optStyle =
                    "border-white/10 bg-black/40 text-white hover:border-[#D8A63A]/50";

                  if (isSelected) {
                    optStyle =
                      "border-[#D8A63A] bg-[#D8A63A]/15 text-[#F4C95D] font-bold shadow-[0_0_15px_rgba(216,166,58,0.2)]";
                  }

                  if (isRevealed) {
                    if (isCorrect) {
                      optStyle =
                        "border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                    } else if (isSelected && !isCorrect) {
                      optStyle = "border-red-500 bg-red-500/15 text-red-300";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQ.id, opt.id)}
                      className={`flex items-start gap-3 rounded-2xl border p-4 text-left font-mono text-xs sm:text-sm transition duration-200 ${optStyle}`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-current text-xs font-black">
                        {opt.id}
                      </span>
                      <span className="leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* ACTIONS & EXPLANATION ACCORDION */}
              <div className="mt-6 flex flex-wrap items-center justify-between border-t border-white/10 pt-4">
                <button
                  onClick={() => handleToggleExplanation(currentQ.id)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs font-bold text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition"
                >
                  <span>{revealedExplanations.has(currentQ.id) ? "Hide Logic" : "💡 Reveal Step-by-Step Logic"}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    disabled={activeQuestionIndex === 0}
                    onClick={() => {
                      setActiveQuestionIndex((prev) => Math.max(0, prev - 1));
                      sound.playHover();
                    }}
                    className="rounded-xl border border-white/10 px-4 py-2 font-mono text-xs text-white hover:bg-white/5 disabled:opacity-30"
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={activeQuestionIndex === filteredQuestions.length - 1}
                    onClick={() => {
                      setActiveQuestionIndex((prev) =>
                        Math.min(filteredQuestions.length - 1, prev + 1)
                      );
                      sound.playHover();
                    }}
                    className="rounded-xl bg-[#D8A63A] px-5 py-2 font-mono text-xs font-bold text-black hover:bg-[#F4C95D] disabled:opacity-30 transition"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* EXPLANATION & TRAP DIAGNOSTIC */}
              {revealedExplanations.has(currentQ.id) && (
                <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#D8A63A]/40 bg-gradient-to-b from-[#141005] to-[#090909] p-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <span className="font-mono text-xs font-black text-[#F4C95D]">
                      ✓ OFFICIAL LOGICAL DERIVATION & ELIMINATION
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      CORRECT OPTION: [{currentQ.correctAnswer}]
                    </span>
                  </div>

                  <p className="font-mono text-xs text-white/90 leading-relaxed whitespace-pre-line">
                    {currentQ.explanation}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                      <span className="font-mono text-[10px] font-bold text-red-400 uppercase block mb-1">
                        ⚠️ UPSC Trap Diagnostic
                      </span>
                      <p className="text-xs text-white/80">{currentQ.trapInsight}</p>
                    </div>

                    <div className="rounded-xl border border-[#D8A63A]/20 bg-[#D8A63A]/5 p-3">
                      <span className="font-mono text-[10px] font-bold text-[#F4C95D] uppercase block mb-1">
                        ⚡ Elimination Shortcut / Formula
                      </span>
                      <p className="text-xs text-white/80">{currentQ.formulaTrick}</p>
                    </div>
                  </div>
                </div>
              )}
            </article>

            {/* SIDEBAR: QUESTION GRID & FORMULAS */}
            <aside className="flex flex-col gap-6">
              {/* QUESTION MATRIX NAVIGATOR */}
              <div className="flex flex-col rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 shadow-xl">
                <span className="font-mono text-[11px] font-bold text-[#8C8C8C] uppercase mb-3">
                  QUESTION MATRIX ({filteredQuestions.length})
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {filteredQuestions.map((q, idx) => {
                    const isAnswered = Boolean(userAnswers[q.id]);
                    const isCurrent = idx === activeQuestionIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setActiveQuestionIndex(idx);
                          sound.playHover();
                        }}
                        className={`flex h-9 w-full items-center justify-center rounded-xl font-mono text-xs font-bold transition ${
                          isCurrent
                            ? "border-2 border-[#D8A63A] bg-[#D8A63A] text-black shadow-[0_0_10px_rgba(216,166,58,0.5)]"
                            : isAnswered
                            ? "border border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                            : "border border-white/10 bg-white/5 text-[#8C8C8C] hover:text-white"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SPEED RADAR SUMMARY */}
              <div className="flex flex-col rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 shadow-xl font-mono text-xs">
                <span className="font-bold text-[#F4C95D] uppercase mb-3">
                  CSAT TELEMETRY RADAR
                </span>
                <div className="flex flex-col gap-2.5 text-[#8C8C8C]">
                  <div className="flex justify-between">
                    <span>Attempted:</span>
                    <strong className="text-white">{stats.attempted} / {filteredQuestions.length}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <strong className="text-white">{stats.accuracy}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Correct (+2.5):</span>
                    <strong className="text-emerald-400">{stats.correct}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Penalty (-0.83):</span>
                    <strong className="text-red-400">-{stats.wrong * 0.833}</strong>
                  </div>
                  <div className="mt-2 border-t border-white/10 pt-2 flex justify-between">
                    <span className="font-bold text-white">Net Total:</span>
                    <strong className="text-[#F4C95D] text-sm">{stats.netScore}</strong>
                  </div>
                </div>
              </div>

              {/* CSAT ATTEMPT LEDGER & HISTORY */}
              <div className="flex flex-col rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 shadow-xl font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="font-bold text-[#F4C95D] uppercase">
                    📜 PAST ATTEMPTS ({pastAttempts.length})
                  </span>
                  <span className="text-[10px] text-emerald-400">Synced</span>
                </div>
                {pastAttempts.length === 0 ? (
                  <p className="text-[11px] text-[#8C8C8C]">No recorded attempts yet. Complete a session to log telemetry.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                    {pastAttempts.map((att, i) => (
                      <div key={att.id || i} className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] font-bold text-white">{att.test_title}</div>
                          <div className="text-[10px] text-[#8C8C8C]">
                            {new Date(att.completed_at || Date.now()).toLocaleDateString([], { month: "short", day: "numeric" })} • {att.accuracy}% Acc
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-bold ${att.score >= 66.67 ? "text-emerald-400" : "text-[#D8A63A]"}`}>
                            {att.score} pts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* FORMULA & SHORTCUT DRAWER */}
      {formulaDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="flex h-[85vh] w-full max-w-3xl flex-col rounded-3xl border border-[#D8A63A]/40 bg-[#0d0d0d] shadow-2xl overflow-hidden">
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#141414]">
              <h2 className="font-mono text-sm font-black tracking-widest text-[#F4C95D] uppercase">
                ⚡ CSAT CORE SPEED FORMULAS & SHORTCUTS
              </h2>
              <button
                onClick={() => setFormulaDrawerOpen(false)}
                className="rounded-xl border border-white/10 px-3 py-1 font-mono text-xs text-[#8C8C8C] hover:text-white"
              >
                ✕ Close
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                <span className="font-bold text-[#F4C95D] uppercase block mb-1">
                  1. Unit Digit Cyclicity & Power Periods
                </span>
                <p className="text-white/80 leading-relaxed">
                  • <strong>Cycle of 4:</strong> <code>[2, 3, 7, 8]</code> — Divide exponent by 4; remainder gives the effective power index (Remainder 0 = Power of 4).<br />
                  • <strong>Cycle of 2:</strong> <code>[4, 9]</code> — 4^odd = 4, 4^even = 6; 9^odd = 9, 9^even = 1.<br />
                  • <strong>Cycle of 1:</strong> <code>[0, 1, 5, 6]</code> — Last digit is always unchanged for all positive integer powers.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                <span className="font-bold text-[#F4C95D] uppercase block mb-1">
                  2. Remainder Theorems & Fermat's Little Theorem
                </span>
                <p className="text-white/80 leading-relaxed">
                  • <strong>Fermat's Theorem:</strong> If <em>p</em> is a prime and <em>gcd(a, p) = 1</em>, then <code>a^(p - 1) % p = 1</code>.<br />
                  • <strong>Successive Division:</strong> If N leaves remainders r1, r2 when divided by d1, d2: <code>N = d1 × (d2 × q + r2) + r1</code>.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                <span className="font-bold text-[#F4C95D] uppercase block mb-1">
                  3. Algebraic Divisibility & Factor Count Rules
                </span>
                <p className="text-white/80 leading-relaxed">
                  • <code>a^n + b^n</code> is always divisible by <code>(a + b)</code> if n is odd.<br />
                  • <code>a^n - b^n</code> is always divisible by <code>(a - b)</code> for all positive n, and by <code>(a + b)</code> if n is even.<br />
                  • <strong>Total Factors:</strong> If <code>N = p1^a × p2^b × p3^c</code>, Total Factors = <code>(a + 1)(b + 1)(c + 1)</code>.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                <span className="font-bold text-[#F4C95D] uppercase block mb-1">
                  4. Clock Angle & Hand Coincidence Formula
                </span>
                <p className="text-white/80 leading-relaxed">
                  • <strong>Angle between Hour & Minute hands:</strong> <code>θ = |30 × H - (11/2) × M|</code>.<br />
                  • <strong>Hands Coincide (0°):</strong> Exactly 11 times in 12 hours, and 22 times in 24 hours.<br />
                  • <strong>Hands Opposite (180°):</strong> Exactly 11 times in 12 hours, and 22 times in 24 hours.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                <span className="font-bold text-[#F4C95D] uppercase block mb-1">
                  5. Calendar Odd Days Method
                </span>
                <p className="text-white/80 leading-relaxed">
                  • <strong>Ordinary Year (365 days):</strong> 52 weeks + 1 odd day.<br />
                  • <strong>Leap Year (366 days):</strong> 52 weeks + 2 odd days.<br />
                  • <strong>Century Odd Days:</strong> 100 yrs = 5 odd days, 200 yrs = 3 odd days, 300 yrs = 1 odd day, 400 yrs = 0 odd days.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                <span className="font-bold text-[#F4C95D] uppercase block mb-1">
                  6. High-Speed Percentage to Fraction Equivalents
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-white/90">
                  <span className="p-1.5 rounded-lg bg-white/5">1/6 = 16.66%</span>
                  <span className="p-1.5 rounded-lg bg-white/5">1/7 = 14.28%</span>
                  <span className="p-1.5 rounded-lg bg-white/5">1/8 = 12.50%</span>
                  <span className="p-1.5 rounded-lg bg-white/5">1/9 = 11.11%</span>
                  <span className="p-1.5 rounded-lg bg-white/5">1/11 = 9.09%</span>
                  <span className="p-1.5 rounded-lg bg-white/5">1/12 = 8.33%</span>
                  <span className="p-1.5 rounded-lg bg-white/5">1/13 = 7.69%</span>
                  <span className="p-1.5 rounded-lg bg-white/5">1/14 = 7.14%</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                <span className="font-bold text-[#F4C95D] uppercase block mb-1">
                  7. Reading Comprehension Elimination Rules
                </span>
                <p className="text-white/80 leading-relaxed">
                  • <strong>Extreme Tone Trap:</strong> Eliminate absolute words (<em>never, always, completely, solely, exclusively, inevitably</em>).<br />
                  • <strong>Assumption Negation Test:</strong> If negating the assumption collapses the author's primary conclusion, the assumption is valid.<br />
                  • <strong>Out of Scope:</strong> Statements factually true in real life but unmentioned in the passage must be rejected.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
    </AuthGuard>
  );
}

