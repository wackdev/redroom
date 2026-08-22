"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MistakeType, PYQQuestion } from "@/lib/core/types";
import { safeArray } from "@/lib/core/utils";
import { MISTAKE_TYPE_LABELS } from "@/lib/pyq/mistake-engine";
import { STATIC_PYQ_DATASET } from "@/lib/pyq/static-dataset";
import {
  diagnoseQuestionTraps,
  calculateEliminationProbability,
} from "@/lib/pyq/elimination-engine";
import {
  broadcastSyncChange,
  subscribeToSyncChanges,
  pushStateToCloud,
  useCloudSync,
} from "@/lib/sync/sync-engine";
import { sound } from "@/lib/audio/sound-engine";
import NeuralKnowledgeGraph from "@/components/NeuralKnowledgeGraph";
import HistoryTimeTunnel from "@/components/HistoryTimeTunnel";
import GeographyGlobe3D from "@/components/GeographyGlobe3D";
import AuthGuard from "@/components/auth/AuthGuard";



const LOCAL_STORAGE_PROGRESS_KEY = "redroom_pyq_progress";
const LOCAL_STORAGE_ATTEMPTS_KEY = "redroom_pyq_user_attempts";
const LOCAL_STORAGE_BOOKMARKS_KEY = "redroom_pyq_bookmarks";
const LOCAL_STORAGE_STREAK_KEY = "redroom_pyq_streak";

const SUBJECT_LIST = [
  "All Subjects",
  "Polity",
  "History",
  "Economy",
  "Environment",
  "Geography",
  "Science & Technology",
] as const;

interface QuestionUserAttempt {
  selectedOption: string;
  isRevealed: boolean;
  isCorrect: boolean;
  mistakeType?: MistakeType;
  attemptedAt?: string;
}

export default function PYQCommandCenter() {
  const router = useRouter();
  const { isSyncing, lastSyncTime, triggerManualSync } = useCloudSync();

  // Core Dataset & User State
  const [questions, setQuestions] = useState<PYQQuestion[]>(STATIC_PYQ_DATASET);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [userAttempts, setUserAttempts] = useState<Record<string, QuestionUserAttempt>>({});
  const [expandedExplanationIds, setExpandedExplanationIds] = useState<Set<string>>(new Set());

  // View Mode: 'list' | 'daily_challenge' | 'exam_sim'
  const [viewMode, setViewMode] = useState<"list" | "daily_challenge" | "exam_sim">("list");
  const [explorationTab, setExplorationTab] = useState<"matrix" | "constellation" | "history_tunnel" | "geo_globe">("matrix");


  // Elimination Mode & Trap States
  const [eliminationMode, setEliminationMode] = useState<boolean>(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<string, string[]>>({});
  const [expandedTraps, setExpandedTraps] = useState<Set<string>>(new Set());

  // Filters
  const [selectedSubject, setSelectedSubject] = useState<string>("All Subjects");
  const [selectedTopic, setSelectedTopic] = useState<string>("All Topics");
  const [selectedYear, setSelectedYear] = useState<string>("All Years");
  const [search, setSearch] = useState<string>("");
  const [importantOnly, setImportantOnly] = useState<boolean>(false);
  const [pendingOnly, setPendingOnly] = useState<boolean>(false);
  const [bookmarksOnly, setBookmarksOnly] = useState<boolean>(false);

  // Exam Simulation States
  const [examIndex, setExamIndex] = useState<number>(0);
  const [examTimeRemaining, setExamTimeRemaining] = useState<number>(600);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});

  // Daily Challenge State
  const [dailyStreak, setDailyStreak] = useState<number>(1);
  const [dailyQuestions, setDailyQuestions] = useState<PYQQuestion[]>([]);
  const [dailyIndex, setDailyIndex] = useState<number>(0);
  const [dailyAnswered, setDailyAnswered] = useState<Record<string, string>>({});

  // Load Saved Attempts & Progress from localStorage
  const loadLocalState = useCallback(() => {
    try {
      const savedProgress = localStorage.getItem(LOCAL_STORAGE_PROGRESS_KEY);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        if (Array.isArray(parsed)) setCompletedIds(new Set(parsed.map(String)));
      }

      const savedBookmarks = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS_KEY);
      if (savedBookmarks) {
        const parsed = JSON.parse(savedBookmarks);
        if (Array.isArray(parsed)) setBookmarkedIds(new Set(parsed.map(String)));
      }

      const savedAttempts = localStorage.getItem(LOCAL_STORAGE_ATTEMPTS_KEY);
      if (savedAttempts) {
        const parsed = JSON.parse(savedAttempts);
        if (parsed && typeof parsed === "object") setUserAttempts(parsed);
      }

      const savedStreak = localStorage.getItem(LOCAL_STORAGE_STREAK_KEY);
      if (savedStreak) setDailyStreak(parseInt(savedStreak, 10) || 1);
    } catch {
      // Local fallback
    }
  }, []);

  // Fetch remote questions in background
  const fetchRemoteQuestions = useCallback(async () => {
    try {
      const res = await fetch("/api/pyq");
      const json = await res.json();
      if (json.success && Array.isArray(json.data?.questions) && json.data.questions.length > 0) {
        setQuestions(json.data.questions);
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadLocalState();
    void fetchRemoteQuestions();

    const unsubscribe = subscribeToSyncChanges((type) => {
      if (type === "pyq" || type === "all") {
        loadLocalState();
      }
    });

    return unsubscribe;
  }, [loadLocalState, fetchRemoteQuestions]);

  // Exam Simulation Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (viewMode === "exam_sim" && !examSubmitted && examTimeRemaining > 0) {
      timer = setInterval(() => {
        setExamTimeRemaining((prev) => {
          if (prev <= 1) {
            setExamSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [viewMode, examSubmitted, examTimeRemaining]);

  // Dynamic Subject Counts with Robust Normalization
  const subjectCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "All Subjects": questions.length,
      Polity: 0,
      History: 0,
      Economy: 0,
      Environment: 0,
      Geography: 0,
      "Science & Technology": 0,
    };

    for (const q of questions) {
      const sub = (q.subject || "").toLowerCase();
      if (sub.includes("polity")) counts["Polity"]++;
      else if (sub.includes("history")) counts["History"]++;
      else if (sub.includes("economy")) counts["Economy"]++;
      else if (sub.includes("environment")) counts["Environment"]++;
      else if (sub.includes("geography")) counts["Geography"]++;
      else if (sub.includes("science") || sub.includes("tech")) counts["Science & Technology"]++;
    }
    return counts;
  }, [questions]);

  // Available Years
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(questions.map((q) => q.year)));
    return years.sort((a, b) => b - a);
  }, [questions]);

  // Topics for Selected Subject
  const availableTopics = useMemo(() => {
    let filtered = questions;
    if (selectedSubject !== "All Subjects") {
      const s = selectedSubject.toLowerCase();
      filtered = questions.filter((q) => (q.subject || "").toLowerCase().includes(s));
    }
    const topics = Array.from(new Set(filtered.map((q) => q.topic).filter(Boolean)));
    return ["All Topics", ...topics];
  }, [questions, selectedSubject]);

  // Filtered Questions Engine with Robust Fuzzy Normalization
  const filteredQuestions = useMemo(() => {
    const qText = search.trim().toLowerCase();
    const targetSub = selectedSubject.trim().toLowerCase();

    return safeArray(questions).filter((q) => {
      const qSub = (q.subject || "").trim().toLowerCase();
      const qTopic = (q.topic || "").trim().toLowerCase();

      // 1. Subject Match
      let matchSub = false;
      if (targetSub === "all subjects") {
        matchSub = true;
      } else if (targetSub.includes("history")) {
        matchSub = qSub.includes("history") || qTopic.includes("ancient") || qTopic.includes("medieval");
      } else if (targetSub.includes("polity")) {
        matchSub = qSub.includes("polity");
      } else if (targetSub.includes("economy")) {
        matchSub = qSub.includes("economy");
      } else if (targetSub.includes("environment")) {
        matchSub = qSub.includes("environment") || qSub.includes("ecology");
      } else if (targetSub.includes("geography")) {
        matchSub = qSub.includes("geography");
      } else if (targetSub.includes("science") || targetSub.includes("tech")) {
        matchSub = qSub.includes("science") || qSub.includes("tech");
      } else {
        matchSub = qSub === targetSub;
      }

      // 2. Topic Match
      const matchTopic =
        selectedTopic === "All Topics" ||
        (q.topic && q.topic.toLowerCase() === selectedTopic.toLowerCase());

      // 3. Year Match
      const matchYr = selectedYear === "All Years" || String(q.year) === selectedYear;

      // 4. Status Flags
      const matchImp = !importantOnly || Boolean(q.important);
      const matchPend = !pendingOnly || !completedIds.has(String(q.id));
      const matchBook = !bookmarksOnly || bookmarkedIds.has(String(q.id));

      // 5. Search query
      const matchSearch =
        !qText ||
        (q.question && q.question.toLowerCase().includes(qText)) ||
        (q.subject && q.subject.toLowerCase().includes(qText)) ||
        (q.topic && q.topic.toLowerCase().includes(qText)) ||
        (q.explanation && q.explanation.toLowerCase().includes(qText));

      return matchSub && matchTopic && matchYr && matchImp && matchPend && matchBook && matchSearch;
    });
  }, [
    questions,
    selectedSubject,
    selectedTopic,
    selectedYear,
    importantOnly,
    pendingOnly,
    bookmarksOnly,
    search,
    completedIds,
    bookmarkedIds,
  ]);

  // Overall Metrics
  const completedCount = useMemo(() => {
    return questions.filter((q) => completedIds.has(String(q.id))).length;
  }, [questions, completedIds]);

  const attemptedCount = useMemo(() => {
    return Object.keys(userAttempts).length;
  }, [userAttempts]);

  const correctAttemptsCount = useMemo(() => {
    return Object.values(userAttempts).filter((a) => a.isCorrect).length;
  }, [userAttempts]);

  const accuracyRate = attemptedCount > 0 ? Math.round((correctAttemptsCount / attemptedCount) * 100) : 0;
  const progressPercent = questions.length > 0 ? Math.round((completedCount / questions.length) * 100) : 0;

  // Change Subject Filter Cleanly
  const handleSelectSubject = (sub: string) => {
    setSelectedSubject(sub);
    setSelectedTopic("All Topics");
    setSelectedYear("All Years");
    setSearch("");
    setImportantOnly(false);
    setPendingOnly(false);
    setBookmarksOnly(false);
  };

  // Toggle Marked Completed Status
  const handleToggleCompleted = (qId: number | string) => {
    const strId = String(qId);
    const next = new Set(completedIds);
    const isNowDone = !next.has(strId);

    if (isNowDone) next.add(strId);
    else next.delete(strId);

    setCompletedIds(next);

    try {
      localStorage.setItem(LOCAL_STORAGE_PROGRESS_KEY, JSON.stringify(Array.from(next)));
    } catch {}

    broadcastSyncChange("pyq");
    void pushStateToCloud();

    void fetch("/api/pyq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pyqId: strId,
        selectedOption: userAttempts[strId]?.selectedOption || "A",
        isCorrect: isNowDone,
      }),
    }).catch(() => {});
  };

  // Toggle Bookmark
  const handleToggleBookmark = (qId: number | string) => {
    const strId = String(qId);
    const next = new Set(bookmarkedIds);
    if (next.has(strId)) next.delete(strId);
    else next.add(strId);

    setBookmarkedIds(next);
    try {
      localStorage.setItem(LOCAL_STORAGE_BOOKMARKS_KEY, JSON.stringify(Array.from(next)));
    } catch {}
  };

  // Handle Option Click
  const handleSelectOption = (question: PYQQuestion, optionId: string) => {
    const strId = String(question.id);
    const isCorrect = optionId === question.correctAnswer;

    const newAttempt: QuestionUserAttempt = {
      selectedOption: optionId,
      isRevealed: true,
      isCorrect,
      mistakeType: userAttempts[strId]?.mistakeType,
      attemptedAt: new Date().toISOString(),
    };

    const nextAttempts = { ...userAttempts, [strId]: newAttempt };
    setUserAttempts(nextAttempts);

    if (isCorrect && !completedIds.has(strId)) {
      const nextDone = new Set(completedIds);
      nextDone.add(strId);
      setCompletedIds(nextDone);
      try {
        localStorage.setItem(LOCAL_STORAGE_PROGRESS_KEY, JSON.stringify(Array.from(nextDone)));
      } catch {}
      broadcastSyncChange("pyq");
      void pushStateToCloud();
    }

    try {
      localStorage.setItem(LOCAL_STORAGE_ATTEMPTS_KEY, JSON.stringify(nextAttempts));
    } catch {}

    void fetch("/api/pyq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pyqId: strId,
        selectedOption: optionId,
        isCorrect,
      }),
    }).catch(() => {});
  };

  // Toggle Explanation Reveal
  const handleToggleExplanation = (qId: number | string) => {
    const strId = String(qId);
    const next = new Set(expandedExplanationIds);
    if (next.has(strId)) next.delete(strId);
    else next.add(strId);
    setExpandedExplanationIds(next);
  };

  // Tag Mistake Type
  const handleTagMistake = (qId: number | string, mType: MistakeType) => {
    const strId = String(qId);
    const existing = userAttempts[strId];
    if (!existing) return;

    const updated: QuestionUserAttempt = { ...existing, mistakeType: mType };
    const nextAttempts = { ...userAttempts, [strId]: updated };
    setUserAttempts(nextAttempts);

    try {
      localStorage.setItem(LOCAL_STORAGE_ATTEMPTS_KEY, JSON.stringify(nextAttempts));
    } catch {}

    void fetch("/api/pyq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pyqId: strId,
        selectedOption: existing.selectedOption,
        isCorrect: false,
        mistakeType: mType,
      }),
    }).catch(() => {});
  };

  // Toggle Strike Elimination on an Option
  const handleToggleOptionElimination = (qId: number | string, optId: string) => {
    const strId = String(qId);
    const currentList = eliminatedOptions[strId] || [];
    const isEliminated = currentList.includes(optId);

    const updated = isEliminated
      ? currentList.filter((id) => id !== optId)
      : [...currentList, optId];

    setEliminatedOptions((prev) => ({ ...prev, [strId]: updated }));
  };

  // Toggle Trap Analysis Card
  const handleToggleTrapCard = (qId: number | string) => {
    const strId = String(qId);
    setExpandedTraps((prev) => {
      const next = new Set(prev);
      if (next.has(strId)) next.delete(strId);
      else next.add(strId);
      return next;
    });
  };

  // Select Option in Daily Sprint
  const handleSelectDailyOption = (q: PYQQuestion, optId: string) => {
    const strId = String(q.id);
    setDailyAnswered((prev) => ({ ...prev, [strId]: optId }));
    const isRight = optId === q.correctAnswer;
    if (isRight) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }
  };


  // Start Daily 5-MCQ Challenge
  const handleStartDailyChallenge = () => {

    const pool = questions.length > 0 ? questions : STATIC_PYQ_DATASET;
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);
    setDailyQuestions(shuffled);
    setDailyIndex(0);
    setDailyAnswered({});
    setViewMode("daily_challenge");
  };

  // Start Timed Exam Sim
  const handleStartExamSim = () => {
    const sampleSet = filteredQuestions.length > 0 ? filteredQuestions.slice(0, 20) : questions.slice(0, 20);
    setExamIndex(0);
    setExamAnswers({});
    setExamSubmitted(false);
    setExamTimeRemaining(sampleSet.length * 60);
    setViewMode("exam_sim");
  };

  // ==========================================================================
  // VIEW: DAILY 5-MCQ CHALLENGE MODE
  // ==========================================================================
  if (viewMode === "daily_challenge" && dailyQuestions.length > 0) {
    const currentQ = dailyQuestions[dailyIndex];
    const strId = String(currentQ.id);
    const chosenOption = dailyAnswered[strId];
    const isAnswered = Boolean(chosenOption);
    const isCorrect = chosenOption === currentQ.correctAnswer;
    const completedDailyCount = Object.keys(dailyAnswered).length;

    return (
      <AuthGuard>
        <main className="min-h-screen bg-[#07040e] text-white">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode("list")}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/70 hover:bg-white/10 hover:text-white"
                >
                  ← Exit Daily
                </button>
                <h1 className="font-mono text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  Prelims 5-MCQ Sprint
                </h1>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-[#F4C95D]">
                <span>🔥 {dailyStreak} Day Streak</span>
              </div>
            </div>

            {/* Daily Progress Dots */}
            <div className="my-6 flex items-center justify-between gap-2">
              {dailyQuestions.map((_, idx) => {
                const isCur = idx === dailyIndex;
                const isDone = Boolean(dailyAnswered[String(dailyQuestions[idx].id)]);
                return (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      isCur
                        ? "bg-[#D8A63A] ring-2 ring-[#D8A63A]/40"
                        : isDone
                        ? "bg-emerald-500"
                        : "bg-white/10"
                    }`}
                  />
                );
              })}
            </div>

            {/* Question Card */}
            <article className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="rounded-full bg-[#D8A63A]/20 px-3 py-1 font-mono text-[10px] font-bold text-[#F4C95D]">
                  {currentQ.subject} · {currentQ.year}
                </span>
                <span className="text-xs font-semibold text-white/40">{currentQ.topic}</span>
              </div>

              <p className="mt-6 text-base font-semibold leading-relaxed text-white/95 sm:text-lg">
                {currentQ.question}
              </p>

              <div className="mt-6 space-y-3">
                {safeArray(currentQ.options).map((opt) => {
                  const isSelected = chosenOption === opt.id;
                  const isRight = currentQ.correctAnswer === opt.id;

                  let optClass = "border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/10 text-white/90";
                  if (isAnswered) {
                    if (isRight) {
                      optClass = "border-emerald-500 bg-emerald-500/20 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.25)]";
                    } else if (isSelected && !isRight) {
                      optClass = "border-red-500 bg-red-500/20 text-red-200";
                    } else {
                      optClass = "border-white/5 bg-white/[0.02] text-white/40 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={isAnswered}
                      onClick={() => handleSelectDailyOption(currentQ, opt.id)}
                      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${optClass}`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/20 font-mono text-xs font-bold uppercase">
                        {opt.id}
                      </span>
                      <span className="text-xs sm:text-sm font-medium leading-relaxed">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {isAnswered && (
                <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">
                      {isCorrect ? "✓ Correct Deduction" : "✕ Trap Triggered"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-emerald-200/90 font-sans">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Bottom Nav */}
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <button
                  disabled={dailyIndex === 0}
                  onClick={() => setDailyIndex((i) => i - 1)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-white/70 hover:bg-white/5 disabled:opacity-30"
                >
                  ← Prev
                </button>

                {dailyIndex < dailyQuestions.length - 1 ? (
                  <button
                    disabled={!isAnswered}
                    onClick={() => setDailyIndex((i) => i + 1)}
                    className="rounded-xl bg-[#D8A63A] px-6 py-2 text-xs font-black text-black hover:bg-[#F4C95D] disabled:opacity-30"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    disabled={completedDailyCount < 5}
                    onClick={() => {
                      const newStreak = dailyStreak + 1;
                      setDailyStreak(newStreak);
                      try {
                        localStorage.setItem(LOCAL_STORAGE_STREAK_KEY, String(newStreak));
                      } catch {}
                      setViewMode("list");
                    }}
                    className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg"
                  >
                    Complete Challenge (+5 XP) ✓
                  </button>
                )}
              </div>
            </article>
          </div>
        </main>
      </AuthGuard>
    );
  }

  // ==========================================================================
  // VIEW: TIMED EXAM SIMULATION MODE
  // ==========================================================================
  if (viewMode === "exam_sim") {
    const examQuestions = filteredQuestions.length > 0 ? filteredQuestions.slice(0, 20) : questions.slice(0, 20);
    const currentQ = examQuestions[examIndex];
    const strId = String(currentQ.id);

    const minutes = Math.floor(examTimeRemaining / 60);
    const seconds = examTimeRemaining % 60;

    const totalAttemptedInExam = Object.keys(examAnswers).length;
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;

    if (examSubmitted) {
      for (const q of examQuestions) {
        const chosen = examAnswers[String(q.id)];
        if (chosen) {
          if (chosen === q.correctAnswer) {
            score += 2.0;
            correctCount++;
          } else {
            score -= 0.66;
            wrongCount++;
          }
        }
      }
    }

    return (
      <AuthGuard>
        <main className="min-h-screen bg-[#07040e] text-white">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode("list")}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-purple-300 hover:bg-white/10 hover:text-white"
              >
                ← Exit Exam
              </button>
              <span className="font-bold text-sm">🎯 UPSC Prelims Mock Simulation</span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 rounded-xl px-4 py-1.5 font-mono text-sm font-black ${
                  examTimeRemaining < 120
                    ? "bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse"
                    : "bg-purple-500/20 text-purple-200 border border-purple-500/30"
                }`}
              >
                <span>⏱️</span>
                <span>
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
              </div>

              {!examSubmitted ? (
                <button
                  onClick={() => setExamSubmitted(true)}
                  className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg transition hover:bg-red-500"
                >
                  Submit Exam ↵
                </button>
              ) : (
                <button
                  onClick={() => handleStartExamSim()}
                  className="rounded-xl bg-purple-600 px-4 py-1.5 text-xs font-bold text-white"
                >
                  Retake Exam ↺
                </button>
              )}
            </div>
          </div>

          {examSubmitted && (
            <div className="mb-8 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-[#0d071d] to-pink-950/40 p-6 shadow-2xl">
              <h2 className="text-xl font-black text-purple-300">Exam Performance Scorecard</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-xs text-white/50">Total Score</p>
                  <p className={`mt-1 text-2xl font-black ${score >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {score.toFixed(2)} / {(examQuestions.length * 2).toFixed(2)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-xs text-white/50">Accuracy</p>
                  <p className="mt-1 text-2xl font-black text-pink-400">
                    {totalAttemptedInExam > 0 ? Math.round((correctCount / totalAttemptedInExam) * 100) : 0}%
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-xs text-white/50">Correct Answers</p>
                  <p className="mt-1 text-2xl font-black text-emerald-400">{correctCount}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-xs text-white/50">Negative Deductions</p>
                  <p className="mt-1 text-2xl font-black text-red-400">-{ (wrongCount * 0.66).toFixed(2) }</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
            <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs">
                <span className="rounded-full bg-purple-500/20 px-3 py-1 font-bold text-purple-300">
                  Question {examIndex + 1} of {examQuestions.length}
                </span>
                <span className="text-white/40">{currentQ.subject} · {currentQ.year}</span>
              </div>

              <p className="mt-6 text-base font-semibold leading-relaxed sm:text-lg">
                {currentQ.question}
              </p>

              <div className="mt-6 space-y-3">
                {safeArray(currentQ.options).map((opt) => {
                  const isSelected = examAnswers[strId] === opt.id;
                  const isRight = currentQ.correctAnswer === opt.id;

                  let optClass = "border-white/10 bg-white/5 hover:border-purple-400";
                  if (examSubmitted) {
                    if (isRight) optClass = "border-emerald-500 bg-emerald-500/20 text-emerald-200";
                    else if (isSelected && !isRight) optClass = "border-red-500 bg-red-500/20 text-red-200";
                    else optClass = "border-white/5 bg-white/[0.02] text-white/40";
                  } else if (isSelected) {
                    optClass = "border-purple-500 bg-purple-500/20 text-white shadow-lg shadow-purple-500/20";
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={examSubmitted}
                      onClick={() => setExamAnswers((prev) => ({ ...prev, [strId]: opt.id }))}
                      className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${optClass}`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xs font-bold">
                        {opt.id}
                      </span>
                      <span className="pt-0.5 text-sm sm:text-base">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {examSubmitted && (
                <div className="mt-6 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-5 text-xs sm:text-sm leading-relaxed">
                  <p className="font-bold text-purple-300">Official UPSC Key: {currentQ.correctAnswer}</p>
                  <p className="mt-2 text-white/90">{currentQ.explanation}</p>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <button
                  disabled={examIndex === 0}
                  onClick={() => setExamIndex((i) => i - 1)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold disabled:opacity-30"
                >
                  ← Prev
                </button>
                <button
                  disabled={examIndex === examQuestions.length - 1}
                  onClick={() => setExamIndex((i) => i + 1)}
                  className="rounded-xl bg-purple-600 px-6 py-2 text-xs font-bold text-white hover:bg-purple-500 disabled:opacity-30"
                >
                  Next →
                </button>
              </div>
            </article>

            <aside className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 h-fit">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Question Palette</h3>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {examQuestions.map((q, idx) => {
                  const isAns = Boolean(examAnswers[String(q.id)]);
                  const isCur = examIndex === idx;

                  let palStyle = "border-white/10 bg-white/5 text-white/60";
                  if (isCur) palStyle = "border-purple-500 bg-purple-600 text-white font-bold ring-2 ring-purple-400";
                  else if (isAns) palStyle = "border-emerald-500/40 bg-emerald-500/20 text-emerald-300 font-bold";

                  return (
                    <button
                      key={q.id}
                      onClick={() => setExamIndex(idx)}
                      className={`h-9 rounded-xl border text-xs transition hover:scale-105 ${palStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-white/10 pt-4 text-[11px] text-white/50 space-y-1">
                <p>• Attempted: <strong className="text-emerald-400">{totalAttemptedInExam}</strong></p>
                <p>• Unanswered: <strong className="text-white/80">{examQuestions.length - totalAttemptedInExam}</strong></p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      </AuthGuard>
    );
  }

  // ==========================================================================
  // VIEW: MAIN LIST COMMAND CENTRE
  // ==========================================================================
  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0d0d0d]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              data-cursor="BACK"
              className="font-mono text-xs text-[#F4C95D] transition hover:underline"
            >
              ← Command Centre
            </button>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#D8A63A] font-mono text-xs font-black text-black">
                ↑
              </span>
              <h1 className="font-mono font-black tracking-tight text-xs sm:text-sm uppercase text-white">
                THE UPSC QUESTION ARCHIVE
              </h1>
              <span className="rounded-full border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#F4C95D]">
                {questions.length} CLUES MAPPED
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => router.push("/mains-pyqs")}
              data-cursor="MAINS"
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-bold text-white/80 transition hover:border-[#D8A63A]/40 hover:text-white"
            >
              <span>✍️</span>
              <span className="hidden sm:inline">Mains Lab</span>
            </button>

            <button
              onClick={handleStartDailyChallenge}
              data-cursor="QUIZ"
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 font-bold text-amber-200 transition hover:bg-amber-500/20"
            >
              <span>🔥</span>
              <span className="hidden sm:inline">Daily 5-MCQ Quiz</span>
            </button>

            <button
              onClick={handleStartExamSim}
              data-cursor="EXAM"
              className="flex items-center gap-1.5 rounded-xl border border-[#D8A63A] bg-gradient-to-r from-[#D8A63A] to-[#B38322] px-3.5 py-1.5 font-black text-black shadow-lg transition hover:scale-105 active:scale-95"
            >
              <span>🎯</span>
              <span>Timed Simulation</span>
            </button>

            <button
              onClick={() => void triggerManualSync()}
              title="Cloud sync"
              className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            >
              🔄
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#F4C95D]">
              UPSC HAS BEEN LEAVING CLUES FOR YEARS
            </p>
            <h2 className="mt-1 text-2xl font-black md:text-3xl text-white">
              Official Civil Services Question Archive
            </h2>
            <p className="mt-1 text-xs text-[#8C8C8C] leading-relaxed max-w-2xl font-sans">
              Authentic UPSC questions mapped to standard NCERT & reference sources. Test yourself with instant inline option checking, mistake tracking, and full official explanations.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-4 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold uppercase tracking-wider text-white/60">Preparation Momentum</span>
              <span className="font-black text-[#F4C95D]">{progressPercent}% of Your Journey Built</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#D8A63A] to-[#F4C95D] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-white/50">
              <span>Solved: <strong className="text-white">{completedCount}</strong> / {questions.length}</span>
              <span>Accuracy: <strong className="text-emerald-400">{accuracyRate}%</strong></span>
              <span>Streak: <strong className="text-amber-300">🔥 {dailyStreak}d</strong></span>
            </div>
          </div>
        </section>

        {/* 3D IMMERSIVE EXPLORATION SWITCHER */}
        <section className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-[#D8A63A]/30 bg-[#0d0d0d] p-2 shadow-xl">
          <button
            onClick={() => {
              sound.playHover();
              setExplorationTab("matrix");
            }}
            data-cursor="MATRIX"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition ${
              explorationTab === "matrix"
                ? "border border-[#D8A63A] bg-[#D8A63A] text-black font-black shadow-[0_0_15px_rgba(216,166,58,0.4)]"
                : "text-[#8C8C8C] hover:text-white"
            }`}
          >
            <span>⚡</span>
            <span>Question Archive Matrix</span>
          </button>

          <button
            onClick={() => {
              sound.playHover();
              setExplorationTab("constellation");
            }}
            data-cursor="NEURAL"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition ${
              explorationTab === "constellation"
                ? "border border-[#D8A63A] bg-[#D8A63A] text-black font-black shadow-[0_0_15px_rgba(216,166,58,0.4)]"
                : "text-[#8C8C8C] hover:text-white"
            }`}
          >
            <span>🌌</span>
            <span>The UPSC Universe Constellation</span>
          </button>

          <button
            onClick={() => {
              sound.playHover();
              setExplorationTab("history_tunnel");
            }}
            data-cursor="WARP"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition ${
              explorationTab === "history_tunnel"
                ? "border border-[#D8A63A] bg-[#D8A63A] text-black font-black shadow-[0_0_15px_rgba(216,166,58,0.4)]"
                : "text-[#8C8C8C] hover:text-white"
            }`}
          >
            <span>⏳</span>
            <span>History 3D Time Tunnel</span>
          </button>

          <button
            onClick={() => {
              sound.playHover();
              setExplorationTab("geo_globe");
            }}
            data-cursor="GLOBE"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition ${
              explorationTab === "geo_globe"
                ? "border border-[#D8A63A] bg-[#D8A63A] text-black font-black shadow-[0_0_15px_rgba(216,166,58,0.4)]"
                : "text-[#8C8C8C] hover:text-white"
            }`}
          >
            <span>🌍</span>
            <span>Geography 3D Earth</span>
          </button>
        </section>


        {/* RENDER ACTIVE 3D EXPLORATION VIEW */}
        {explorationTab === "constellation" && (
          <div className="mb-8">
            <NeuralKnowledgeGraph
              activeSubject={selectedSubject}
              onSelectSubject={(subj) => {
                handleSelectSubject(subj);
                setExplorationTab("matrix");
              }}
            />
          </div>
        )}

        {explorationTab === "history_tunnel" && (
          <div className="mb-8">
            <HistoryTimeTunnel />
          </div>
        )}

        {explorationTab === "geo_globe" && (
          <div className="mb-8">
            <GeographyGlobe3D />
          </div>
        )}

        {/* SUBJECT FILTER PILLS WITH ROBUST RESET */}
        <section className="mb-4 flex flex-wrap gap-2">
          {SUBJECT_LIST.map((sub) => {
            const count = subjectCounts[sub] || 0;
            const isSelected = selectedSubject === sub;

            return (
              <button
                key={sub}
                onClick={() => handleSelectSubject(sub)}
                data-cursor="FILTER"
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs font-bold transition-all ${
                  isSelected
                    ? "border border-[#FF1B1B] bg-[#FF1B1B] text-black shadow-[0_0_15px_rgba(255,27,27,0.4)] scale-105"
                    : "border border-white/10 bg-[#0d0d0d] text-white/60 hover:border-white/30 hover:text-white"
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


        {/* TOPIC CHIPS IF FILTERED */}
        {availableTopics.length > 2 && (
          <section className="mb-5 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="shrink-0 text-[11px] font-bold uppercase text-white/40">Topic:</span>
            {availableTopics.map((top) => (
              <button
                key={top}
                onClick={() => setSelectedTopic(top)}
                className={`shrink-0 rounded-lg px-2.5 py-1 transition ${
                  selectedTopic === top
                    ? "bg-fuchsia-600 text-white font-bold"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {top}
              </button>
            ))}
          </section>
        )}

        {/* SEARCH & SECONDARY CONTROLS */}
        <section className="mb-6 grid gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:grid-cols-[1fr_150px_auto_auto_auto]">
          <input
            type="text"
            placeholder="Search questions, articles, acts, concepts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/30 px-3.5 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:border-purple-500"
          />

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#120a22] px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-500"
          >
            <option value="All Years">All Years ({availableYears.length})</option>
            {availableYears.map((yr) => (
              <option key={yr} value={String(yr)}>
                {yr} ({questions.filter((q) => q.year === yr).length})
              </option>
            ))}
          </select>

          <button
            onClick={() => setImportantOnly((v) => !v)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              importantOnly
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            ⭐ High-Yield
          </button>

          <button
            onClick={() => setPendingOnly((v) => !v)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              pendingOnly
                ? "bg-pink-500/20 text-pink-300 border border-pink-500/40"
                : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            ⏳ Unsolved ({filteredQuestions.filter((q) => !completedIds.has(String(q.id))).length})
          </button>

          <button
            onClick={() => setBookmarksOnly((v) => !v)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              bookmarksOnly
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            🔖 Bookmarked ({bookmarkedIds.size})
          </button>


          <button
            onClick={() => setEliminationMode((v) => !v)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              eliminationMode
                ? "bg-pink-500/30 text-pink-300 border border-pink-500/50 shadow-lg shadow-pink-900/40"
                : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
            title="Toggle Option Elimination & Trap Analysis HUD"
          >
            ✂ Elimination HUD {eliminationMode ? "ON" : "OFF"}
          </button>
        </section>


        {/* QUESTIONS LIST */}
        {filteredQuestions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
            <span className="text-3xl">🔍</span>
            <p className="mt-3 text-base font-bold">No questions found for current filters</p>
            <p className="mt-1 text-xs text-white/40">Try selecting another subject or resetting filters.</p>
            <button
              onClick={() => handleSelectSubject("All Subjects")}
              className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q, index) => {
              const strId = String(q.id);
              const isDone = completedIds.has(strId);
              const isBookmarked = bookmarkedIds.has(strId);
              const attempt = userAttempts[strId];
              const hasAttempted = Boolean(attempt?.isRevealed);
              const isCorrect = attempt?.selectedOption === q.correctAnswer;
              const isExpanded = expandedExplanationIds.has(strId) || hasAttempted;

              const qEliminated = new Set(eliminatedOptions[strId] || []);
              const elimState = calculateEliminationProbability(qEliminated, safeArray(q.options).length);
              const trapInfo = diagnoseQuestionTraps(q);
              const isTrapExpanded = expandedTraps.has(strId);

              return (
                <article
                  key={`pyq-card-${strId}-${index}`}
                  className={`rounded-2xl border p-5 transition-all ${
                    isDone
                      ? "border-emerald-500/20 bg-emerald-500/[0.02]"
                      : "border-white/10 bg-white/[0.03] hover:border-purple-500/40"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-black text-purple-300">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-300">
                            {q.subject}
                          </span>
                          <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-blue-300">
                            {q.year}
                          </span>
                          {q.topic && (
                            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
                              {q.topic}
                            </span>
                          )}
                          {q.important && (
                            <span className="text-[10px] font-bold text-amber-300">⭐ High Yield</span>
                          )}
                          {trapInfo.hasTrap && (
                            <button
                              onClick={() => handleToggleTrapCard(q.id)}
                              className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition"
                            >
                              ⚠️ {trapInfo.label} {isTrapExpanded ? "▲" : "▼"}
                            </button>
                          )}
                          {isDone && (
                            <span className="text-[10px] font-bold text-emerald-400">✓ Solved</span>
                          )}
                        </div>

                        <h3 className="mt-2.5 text-sm font-semibold leading-relaxed text-white/95 sm:text-base">
                          {q.question}
                        </h3>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-end sm:self-start">
                      <button
                        onClick={() => handleToggleBookmark(q.id)}
                        title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
                        className={`rounded-xl border p-2 text-xs transition ${
                          isBookmarked
                            ? "border-amber-500/40 bg-amber-500/20 text-amber-300"
                            : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {isBookmarked ? "★" : "☆"}
                      </button>

                      <button
                        onClick={() => handleToggleCompleted(q.id)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                          isDone
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                            : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
                        }`}
                      >
                        {isDone ? "✓ Done" : "Mark"}
                      </button>
                    </div>
                  </div>

                  {/* TRAP ANALYSIS BANNER */}
                  {trapInfo.hasTrap && isTrapExpanded && (
                    <div className="mt-3.5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 to-[#1e1308] p-4 text-xs space-y-1.5 shadow-lg">
                      <div className="flex items-center gap-2 text-amber-300 font-bold">
                        <span>🔎 UPSC Trap Radar:</span>
                        <span>{trapInfo.label}</span>
                      </div>
                      <p className="text-white/80 leading-relaxed">{trapInfo.description}</p>
                      <p className="text-amber-200 font-semibold pt-1">
                        🎯 <strong>Elimination Rule:</strong> {trapInfo.eliminationTip}
                      </p>
                    </div>
                  )}

                  {/* ELIMINATION PROBABILITY HUD */}
                  {qEliminated.size > 0 && (
                    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-pink-500/30 bg-pink-500/10 px-4 py-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🎯</span>
                        <span className="font-bold text-pink-300">Elimination Odds:</span>
                        <span className="font-semibold text-white">
                          {elimState.remainingCount} options left ({elimState.calculatedProbability}% probability)
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          elimState.riskRewardStatus.includes("Favorable")
                            ? "bg-emerald-500/20 text-emerald-300"
                            : elimState.riskRewardStatus.includes("Definite")
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        {elimState.riskRewardStatus}
                      </span>
                    </div>
                  )}

                  {/* OPTIONS WITH STRIKE-THROUGH TOOL */}
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {safeArray(q.options).map((opt) => {
                      const isSelected = attempt?.selectedOption === opt.id;
                      const isAnswer = q.correctAnswer === opt.id;
                      const isOptionEliminated = qEliminated.has(opt.id);

                      let optStyle = "border-white/10 bg-black/20 hover:border-purple-500/50 hover:bg-white/5 text-white/85";

                      if (hasAttempted) {
                        if (isAnswer) {
                          optStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-200 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]";
                        } else if (isSelected && !isAnswer) {
                          optStyle = "border-red-500 bg-red-500/20 text-red-200";
                        } else {
                          optStyle = "border-white/5 bg-black/10 text-white/35";
                        }
                      } else if (isOptionEliminated) {
                        optStyle = "border-white/5 bg-black/40 text-white/30 line-through opacity-50";
                      }

                      return (
                        <div
                          key={`opt-wrap-${strId}-${opt.id}`}
                          className="relative flex items-center group"
                        >
                          <button
                            onClick={() => handleSelectOption(q, opt.id)}
                            className={`flex flex-1 items-start gap-3 rounded-xl border p-3 text-left transition-all text-xs sm:text-sm ${optStyle}`}
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold">
                              {opt.id}
                            </span>
                            <span className="pt-0.5 leading-snug pr-8">{opt.text}</span>
                          </button>

                          {/* INLINE ELIMINATE / RESTORE BUTTON */}
                          {!hasAttempted && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleOptionElimination(q.id, opt.id);
                              }}
                              title={isOptionEliminated ? "Restore Option" : "Eliminate Option (Strike)"}
                              className={`absolute right-2 top-2.5 rounded-lg px-2 py-1 text-[10px] font-bold transition ${
                                isOptionEliminated
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                                  : "bg-white/5 text-white/40 border border-white/10 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 opacity-0 group-hover:opacity-100"
                              }`}
                            >
                              {isOptionEliminated ? "✓ Restore" : "✕ Strike"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>


                  {isExpanded && (
                    <div
                      className={`mt-4 rounded-xl border p-4 text-xs sm:text-sm leading-relaxed ${
                        hasAttempted
                          ? isCorrect
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
                            : "border-red-500/30 bg-red-500/10 text-red-100"
                          : "border-purple-500/20 bg-purple-500/5 text-purple-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs uppercase tracking-wider text-purple-300">
                          {hasAttempted
                            ? isCorrect
                              ? "✓ Correct (+2.00)"
                              : "✕ Incorrect (-0.66)"
                            : "Official Solution"}
                        </span>
                        <span className="font-bold text-white">
                          Correct Option: <span className="text-emerald-300 font-black">{q.correctAnswer}</span>
                        </span>
                      </div>

                      <p className="mt-2 text-white/90 leading-relaxed border-t border-white/10 pt-2">
                        {q.explanation}
                      </p>

                      {hasAttempted && !isCorrect && (
                        <div className="mt-3 border-t border-red-500/20 pt-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-pink-300">
                            Tag Your Mistake for AI Analytics:
                          </p>
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {(Object.keys(MISTAKE_TYPE_LABELS) as MistakeType[]).map((mKey) => (
                              <button
                                key={mKey}
                                onClick={() => handleTagMistake(q.id, mKey)}
                                className={`rounded px-2 py-0.5 text-[10px] font-bold transition ${
                                  attempt?.mistakeType === mKey
                                    ? "bg-pink-600 text-white shadow"
                                    : "bg-black/30 text-white/60 hover:bg-black/50"
                                }`}
                              >
                                {MISTAKE_TYPE_LABELS[mKey]}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!isExpanded && (
                    <button
                      onClick={() => handleToggleExplanation(q.id)}
                      className="mt-3 text-[11px] font-semibold text-purple-300 hover:text-white transition"
                    >
                      Show Answer & Explanation ▼
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
    </AuthGuard>
  );
}

