"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "../../lib/supabase-client";

type PYQ = {
  id: number;
  year: number;
  subject: string;
  question: string;
  important: boolean;
  option_a?: string | null;
  option_b?: string | null;
  option_c?: string | null;
  option_d?: string | null;
  correct_answer?: "A" | "B" | "C" | "D" | null;
  explanation?: string | null;
  created_at?: string;
};

type Progress = {
  id?: number;
  user_id: string;
  pyq_id: number;
  completed: boolean;
  updated_at?: string;
};

type PracticeAttempt = {
  selectedAnswer: string;
  isCorrect: boolean;
  attemptedAt: string;
};

const LOCAL_STORAGE_KEY = "redroom_pyq_progress";

const SUBJECTS = [
  "All Subjects",
  "Polity",
  "History",
  "Geography",
  "Economy",
  "Environment",
  "Science & Technology",
];

export default function PYQPage() {
  const supabase = useMemo(() => createClient(), []);

  const [pyqs, setPyqs] = useState<PYQ[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  const [selectedSubject, setSelectedSubject] =
    useState("All Subjects");

  const [selectedYear, setSelectedYear] =
    useState("All Years");

  const [search, setSearch] = useState("");

  const [importantOnly, setImportantOnly] =
    useState(false);

  const [pendingOnly, setPendingOnly] =
    useState(false);

  const [error, setError] = useState("");

  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceKnown, setPracticeKnown] = useState<Record<number, boolean>>({});
  const [practiceAttempts, setPracticeAttempts] = useState<Record<number, PracticeAttempt>>({});
  const [practiceAnswer, setPracticeAnswer] = useState<string | null>(null);
  const [practiceRevealed, setPracticeRevealed] = useState(false);
  const PRACTICE_STORAGE_KEY = "redroom_pyq_practice";
  const hasLoadedPracticeStorage = useRef(false);

  /*
  |--------------------------------------------------------------------------
  | LOCAL BACKUP
  |--------------------------------------------------------------------------
  */

  const loadLocalProgress = useCallback(() => {
    try {
      const saved = localStorage.getItem(
        LOCAL_STORAGE_KEY
      );

      if (!saved) {
        setProgress([]);
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setProgress(parsed);
      }
    } catch (err) {
      console.error(
        "Could not load local progress:",
        err
      );

      setProgress([]);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOAD DATA
  |--------------------------------------------------------------------------
  */

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data: pyqData, error: pyqError } =
        await supabase
          .from("pyqs")
          .select(
            "id,year,subject,question,important,option_a,option_b,option_c,option_d,correct_answer,explanation,created_at"
          )
          .order("year", { ascending: false })
          .order("id", { ascending: true });

      if (pyqError) {
        console.error(
          "PYQ loading error:",
          pyqError
        );

        setError(pyqError.message);
      } else {
        setPyqs((pyqData || []) as PYQ[]);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const {
          data: progressData,
          error: progressError,
        } = await supabase
          .from("user_pyq_progress")
          .select("*")
          .eq("user_id", user.id);

        if (progressError) {
          console.error(
            "Progress loading error:",
            progressError
          );

          loadLocalProgress();
        } else {
          const saved =
            (progressData || []) as Progress[];

          setProgress(saved);

          try {
            localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify(saved)
            );
          } catch {
            // Local backup is optional.
          }
        }
      } else {
        loadLocalProgress();
      }
    } catch (err) {
      console.error(err);
      loadLocalProgress();
    } finally {
      setLoading(false);
    }
  }, [loadLocalProgress, supabase]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadData();
    }, 0);

    try {
      const saved = localStorage.getItem(PRACTICE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const savedPracticeIndex = Number(parsed.practiceIndex) || 0;
          const savedPracticeKnown = parsed.practiceKnown || {};
          const savedPracticeAttempts = parsed.practiceAttempts || {};

          const timer = window.setTimeout(() => {
            setPracticeIndex(savedPracticeIndex);
            setPracticeKnown(savedPracticeKnown);
            setPracticeAttempts(savedPracticeAttempts);
            hasLoadedPracticeStorage.current = true;
          }, 0);

          return () => {
            window.clearTimeout(loadTimer);
            window.clearTimeout(timer);
          };
        }
      }
    } catch (err) {
      console.error("Could not load practice progress:", err);
    }

    hasLoadedPracticeStorage.current = true;

    return () => window.clearTimeout(loadTimer);
  }, [loadData]);

  useEffect(() => {
    if (!hasLoadedPracticeStorage.current) return;

    try {
      localStorage.setItem(
        PRACTICE_STORAGE_KEY,
        JSON.stringify({
          practiceIndex,
          practiceKnown,
          practiceAttempts,
        })
      );
    } catch {
      // Practice backup is optional.
    }
  }, [practiceIndex, practiceKnown, practiceAttempts]);

  function saveLocalProgress(
    updated: Progress[]
  ) {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch (err) {
      console.error(
        "Could not save local progress:",
        err
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | COMPLETION
  |--------------------------------------------------------------------------
  */

  const completedPyqIds = useMemo(
    () =>
      new Set(
        progress
          .filter((item) => item.completed)
          .map((item) => Number(item.pyq_id))
      ),
    [progress]
  );

  function isCompleted(pyqId: number) {
    return completedPyqIds.has(Number(pyqId));
  }

  /*
  |--------------------------------------------------------------------------
  | TOGGLE
  |--------------------------------------------------------------------------
  */

  async function toggleCompleted(
    pyqId: number
  ) {
    if (saving === pyqId) return;

    setSaving(pyqId);
    setError("");

    const currentlyCompleted =
      isCompleted(pyqId);

    const newCompleted =
      !currentlyCompleted;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let updatedProgress: Progress[];

    if (newCompleted) {
      const newItem: Progress = {
        user_id:
          user?.id || "local-user",
        pyq_id: pyqId,
        completed: true,
        updated_at:
          new Date().toISOString(),
      };

      updatedProgress = [
        ...progress.filter(
          (item) =>
            Number(item.pyq_id) !==
            Number(pyqId)
        ),
        newItem,
      ];
    } else {
      updatedProgress =
        progress.filter(
          (item) =>
            Number(item.pyq_id) !==
            Number(pyqId)
        );
    }

    /*
     * Immediate UI update
     */

    setProgress(updatedProgress);

    /*
     * Local backup
     */

    saveLocalProgress(updatedProgress);

    /*
     * Supabase
     */

    if (user) {
      try {
        if (newCompleted) {
          const { error } =
            await supabase
              .from("user_pyq_progress")
              .upsert(
                {
                  user_id: user.id,
                  pyq_id: pyqId,
                  completed: true,
                  updated_at:
                    new Date().toISOString(),
                },
                {
                  onConflict:
                    "user_id,pyq_id",
                }
              );

          if (error) {
            console.error(
              "Supabase save error:",
              error
            );

            setError(
              "Saved locally, but database save failed."
            );
          }
        } else {
          const { error } =
            await supabase
              .from("user_pyq_progress")
              .delete()
              .eq("user_id", user.id)
              .eq("pyq_id", pyqId);

          if (error) {
            console.error(
              "Supabase delete error:",
              error
            );

            setError(
              "Removed locally, but database update failed."
            );
          }
        }
      } catch (err) {
        console.error(err);

        setError(
          "Saved locally. Database connection failed."
        );
      }
    }

    setSaving(null);
  }

  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  async function resetProgress() {
    const confirmed =
      window.confirm(
        "Are you sure you want to reset all PYQ progress?"
      );

    if (!confirmed) return;

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } =
          await supabase
            .from("user_pyq_progress")
            .delete()
            .eq("user_id", user.id);

        if (error) {
          console.error(
            "Reset database error:",
            error
          );
        }
      }

      setProgress([]);

      localStorage.removeItem(
        LOCAL_STORAGE_KEY
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | YEARS
  |--------------------------------------------------------------------------
  */

  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(pyqs.map((pyq) => pyq.year))
    );

    return uniqueYears.sort(
      (a, b) => b - a
    );
  }, [pyqs]);

  /*
  |--------------------------------------------------------------------------
  | FILTERED PYQS
  |--------------------------------------------------------------------------
  */

  const filteredPYQs = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return pyqs.filter((pyq) => {
      const subjectMatch =
        selectedSubject === "All Subjects" ||
        pyq.subject === selectedSubject;

      const yearMatch =
        selectedYear === "All Years" ||
        String(pyq.year) === selectedYear;

      const searchMatch =
        !searchText ||
        pyq.question
          .toLowerCase()
          .includes(searchText) ||
        pyq.subject
          .toLowerCase()
          .includes(searchText) ||
        String(pyq.year).includes(
          searchText
        );

      const importantMatch =
        !importantOnly ||
        pyq.important === true;

      const pendingMatch =
        !pendingOnly ||
        !completedPyqIds.has(pyq.id);

      return (
        subjectMatch &&
        yearMatch &&
        searchMatch &&
        importantMatch &&
        pendingMatch
      );
    });
  }, [
    pyqs,
    selectedSubject,
    selectedYear,
    search,
    importantOnly,
    pendingOnly,
    completedPyqIds,
  ]);

  /*
  |--------------------------------------------------------------------------
  | GLOBAL STATS
  |--------------------------------------------------------------------------
  */

  const totalPYQs = pyqs.length;

  const completedCount =
    pyqs.filter((pyq) =>
      isCompleted(pyq.id)
    ).length;

  const remainingCount =
    totalPYQs - completedCount;

  const accuracy =
    totalPYQs > 0
      ? Math.round(
          (completedCount /
            totalPYQs) *
            100
        )
      : 0;

  /*
  |--------------------------------------------------------------------------
  | FILTERED STATS
  |--------------------------------------------------------------------------
  */

  const filteredCompleted =
    filteredPYQs.filter((pyq) =>
      isCompleted(pyq.id)
    ).length;

  const filteredProgress =
    filteredPYQs.length > 0
      ? Math.round(
          (filteredCompleted /
            filteredPYQs.length) *
            100
        )
      : 0;

  /*
  |--------------------------------------------------------------------------
  | SUBJECT STATS
  |--------------------------------------------------------------------------
  */

  function subjectCount(
    subject: string
  ) {
    return pyqs.filter(
      (pyq) =>
        pyq.subject === subject
    ).length;
  }

  function subjectCompleted(
    subject: string
  ) {
    return pyqs.filter(
      (pyq) =>
        pyq.subject === subject &&
        isCompleted(pyq.id)
    ).length;
  }

  /*
  |--------------------------------------------------------------------------
  | ANALYTICS
  |--------------------------------------------------------------------------
  */

  const subjectAnalytics = useMemo(() => {
    const completedIds = new Set(
      progress
        .filter((item) => item.completed)
        .map((item) => Number(item.pyq_id))
    );

    return Array.from(
      new Set(
        pyqs
          .map((pyq) => pyq.subject)
          .filter(Boolean)
      )
    )
      .sort((a, b) => a.localeCompare(b))
      .map((subject) => {
        const subjectPYQs = pyqs.filter(
          (pyq) => pyq.subject === subject
        );
        const completed = subjectPYQs.filter((pyq) =>
          completedIds.has(pyq.id)
        ).length;

        return {
          subject,
          total: subjectPYQs.length,
          completed,
          remaining: subjectPYQs.length - completed,
          reviseAgain: subjectPYQs.filter(
            (pyq) => practiceKnown[pyq.id] === false
          ).length,
          attempts: subjectPYQs.reduce((count, pyq) =>
            practiceAttempts[pyq.id] ? count + 1 : count,
          0),
          correctAttempts: subjectPYQs.reduce((count, pyq) =>
            practiceAttempts[pyq.id]?.isCorrect ? count + 1 : count,
          0),
        };
      });
  }, [pyqs, progress, practiceKnown, practiceAttempts]);

  const yearAnalytics = useMemo(() => {
    const completedIds = new Set(
      progress
        .filter((item) => item.completed)
        .map((item) => Number(item.pyq_id))
    );

    return years.map((year) => {
      const yearPYQs = pyqs.filter((pyq) => pyq.year === year);
      const completed = yearPYQs.filter((pyq) =>
        completedIds.has(pyq.id)
      ).length;

      return {
        year,
        total: yearPYQs.length,
        completed,
        remaining: yearPYQs.length - completed,
      };
    });
  }, [pyqs, progress, years]);

  const hasPracticeStatusData = Object.keys(practiceKnown).length > 0;

  const subjectPerformance = useMemo(() => {
    const subjectsWithEnoughAttempts = subjectAnalytics
      .filter((item) => item.attempts >= 3)
      .map((item) => ({
        ...item,
        accuracy: Math.round(
          (item.correctAttempts / item.attempts) * 100
        ),
      }));

    if (subjectsWithEnoughAttempts.length < 2) return null;

    const ranked = [...subjectsWithEnoughAttempts].sort(
      (a, b) => b.accuracy - a.accuracy
    );
    const strongest = ranked[0];
    const weakest = ranked[ranked.length - 1];

    return strongest.accuracy === weakest.accuracy
      ? null
      : { strongest, weakest };
  }, [subjectAnalytics]);

  /*
  |--------------------------------------------------------------------------
  | CLEAR FILTERS
  |--------------------------------------------------------------------------
  */

  function clearFilters() {
    setSearch("");
    setSelectedYear("All Years");
    setSelectedSubject("All Subjects");
    setImportantOnly(false);
    setPendingOnly(false);
  }

  /*
  |--------------------------------------------------------------------------
  | PRACTICE MODE
  |--------------------------------------------------------------------------
  */

  const practiceQuestions = filteredPYQs;

  const currentPractice =
    practiceQuestions.length > 0
      ? practiceQuestions[
          Math.min(
            practiceIndex,
            practiceQuestions.length - 1
          )
        ]
      : null;

  const practiceKnownCount = practiceQuestions.filter(
    (pyq) => practiceKnown[pyq.id] === true
  ).length;

  const practiceProgress =
    practiceQuestions.length > 0
      ? Math.round(
          (practiceKnownCount / practiceQuestions.length) * 100
        )
      : 0;

  function startPractice() {
    if (practiceQuestions.length === 0) return;
    setPracticeIndex(0);
    setPracticeAnswer(null);
    setPracticeRevealed(false);
    setPracticeMode(true);
  }

  function exitPractice() {
    setPracticeMode(false);
  }

  function markPracticeKnown(value: boolean) {
    if (!currentPractice) return;

    setPracticeKnown((previous) => ({
      ...previous,
      [currentPractice.id]: value,
    }));
  }

  function choosePracticeAnswer(answer: string) {
    if (!currentPractice || practiceRevealed) return;

    setPracticeAnswer(answer);
    setPracticeRevealed(true);
    setPracticeAttempts((previous) => ({
      ...previous,
      [currentPractice.id]: {
        selectedAnswer: answer,
        isCorrect: answer === currentPractice.correct_answer,
        attemptedAt: new Date().toISOString(),
      },
    }));
  }

  function nextPractice() {
    if (!currentPractice) return;

    setPracticeAnswer(null);
    setPracticeRevealed(false);

    setPracticeIndex((previous) =>
      Math.min(previous + 1, practiceQuestions.length - 1)
    );
  }

  function previousPractice() {
    setPracticeAnswer(null);
    setPracticeRevealed(false);

    setPracticeIndex((previous) =>
      Math.max(previous - 1, 0)
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PRACTICE SCREEN
  |--------------------------------------------------------------------------
  */

  if (practiceMode) {
    const options = currentPractice
      ? [
          { id: "A", text: currentPractice.option_a || "" },
          { id: "B", text: currentPractice.option_b || "" },
          { id: "C", text: currentPractice.option_c || "" },
          { id: "D", text: currentPractice.option_d || "" },
        ].filter((option) => option.text.trim())
      : [];

    const answerAvailable =
      Boolean(currentPractice?.correct_answer) &&
      options.length === 4;

    const isCorrect =
      answerAvailable &&
      practiceAnswer === currentPractice?.correct_answer;

    return (
      <main className="min-h-screen bg-[#090015] px-4 py-8 text-white md:px-8">
        <div className="mx-auto max-w-4xl">

          <button
            onClick={exitPractice}
            className="mb-6 text-sm text-purple-300 hover:text-white"
          >
            ← Back to PYQ Command Centre
          </button>

          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-purple-500/20 bg-[#171027] p-5 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-pink-400">
                PYQ PRACTICE MODE
              </p>

              <h1 className="mt-1 text-2xl font-black">
                Question {practiceQuestions.length ? practiceIndex + 1 : 0} / {practiceQuestions.length}
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Select an answer to reveal the stored answer and explanation.
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-400">
                Self-marked progress
              </p>

              <p className="text-2xl font-black text-purple-300">
                {practiceProgress}%
              </p>
            </div>

          </div>

          {currentPractice ? (
            <>
              <article className="rounded-3xl border border-purple-500/20 bg-[#171027] p-6 md:p-8">

                <div className="flex flex-wrap gap-2">

                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
                    {currentPractice.subject}
                  </span>

                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
                    {currentPractice.year}
                  </span>

                  {currentPractice.important && (
                    <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-300">
                      ⭐ Important
                    </span>
                  )}

                </div>

                <h2 className="mt-7 text-xl font-bold leading-8 md:text-2xl">
                  {currentPractice.question}
                </h2>

                {answerAvailable ? (
                  <div className="mt-8 space-y-3">

                    {options.map((option) => {
                      const selected =
                        practiceAnswer === option.id;

                      const correct =
                        currentPractice.correct_answer === option.id;

                      let optionClass =
                        "border-white/10 bg-black/10 hover:border-purple-400/40";

                      if (practiceRevealed && correct) {
                        optionClass =
                          "border-green-500/40 bg-green-500/10";
                      } else if (
                        practiceRevealed &&
                        selected &&
                        !correct
                      ) {
                        optionClass =
                          "border-red-500/40 bg-red-500/10";
                      } else if (selected) {
                        optionClass =
                          "border-purple-500 bg-purple-500/10";
                      }

                      return (
                        <button
                          key={option.id}
                          onClick={() => choosePracticeAnswer(option.id)}
                          disabled={practiceRevealed}
                          className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition disabled:cursor-default ${optionClass}`}
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 font-bold">
                            {option.id}
                          </span>

                          <span className="pt-1 text-sm leading-6">
                            {option.text}
                          </span>

                          {practiceRevealed && correct && (
                            <span className="ml-auto text-xs font-bold text-green-400">
                              Correct
                            </span>
                          )}

                          {practiceRevealed &&
                            selected &&
                            !correct && (
                              <span className="ml-auto text-xs font-bold text-red-400">
                                Your answer
                              </span>
                            )}
                        </button>
                      );
                    })}

                  </div>
                ) : (
                  <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">

                    <p className="font-bold text-yellow-300">
                      Answer not available yet
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-400">
                      This PYQ does not yet have all four options and a
                      correct answer stored in Supabase.
                    </p>

                  </div>
                )}

                {practiceRevealed && answerAvailable && (
                  <div
                    className={`mt-6 rounded-2xl border p-5 ${
                      isCorrect
                        ? "border-green-500/30 bg-green-500/5"
                        : "border-red-500/30 bg-red-500/5"
                    }`}
                  >

                    <p
                      className={`font-bold ${
                        isCorrect
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {isCorrect
                        ? "✓ Correct Answer"
                        : "✕ Incorrect Answer"}
                    </p>

                    <p className="mt-2 text-sm text-gray-300">
                      Correct option:{" "}
                      <span className="font-black text-white">
                        {currentPractice.correct_answer}
                      </span>
                    </p>

                    {currentPractice.explanation?.trim() ? (
                      <div className="mt-4 border-t border-white/10 pt-4">

                        <p className="text-xs font-bold uppercase tracking-widest text-purple-300">
                          Explanation
                        </p>

                        <p className="mt-2 text-sm leading-7 text-gray-300">
                          {currentPractice.explanation}
                        </p>

                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-gray-500">
                        No explanation has been added for this PYQ yet.
                      </p>
                    )}

                  </div>
                )}

                <div className="mt-8 grid gap-3 md:grid-cols-2">

                  <button
                    onClick={() => markPracticeKnown(true)}
                    className={`rounded-xl border px-5 py-4 font-bold transition ${
                      practiceKnown[currentPractice.id]
                        ? "border-green-400/40 bg-green-500/10 text-green-300"
                        : "border-white/10 bg-white/5 hover:bg-green-500/10"
                    }`}
                  >
                    ✓ I Know This
                  </button>

                  <button
                    onClick={() => markPracticeKnown(false)}
                    className={`rounded-xl border px-5 py-4 font-bold transition ${
                      practiceKnown[currentPractice.id] === false
                        ? "border-yellow-400/40 bg-yellow-500/10 text-yellow-300"
                        : "border-white/10 bg-white/5 hover:bg-yellow-500/10"
                    }`}
                  >
                    🔖 Revise Again
                  </button>

                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">

                  <button
                    disabled={practiceIndex === 0}
                    onClick={previousPractice}
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold disabled:opacity-30"
                  >
                    ← Previous
                  </button>

                  {practiceIndex < practiceQuestions.length - 1 ? (
                    <button
                      onClick={nextPractice}
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3 font-bold"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={exitPractice}
                      className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3 font-bold"
                    >
                      Finish Practice ✓
                    </button>
                  )}

                </div>

              </article>

              <div className="mt-5 grid grid-cols-5 gap-2 md:grid-cols-10">

                {practiceQuestions.map((pyq, index) => (
                  <button
                    key={pyq.id}
                    onClick={() => {
                      setPracticeIndex(index);
                      setPracticeAnswer(null);
                      setPracticeRevealed(false);
                    }}
                    className={`h-9 rounded-lg text-xs font-bold ${
                      practiceIndex === index
                        ? "bg-purple-600"
                        : practiceKnown[pyq.id]
                        ? "bg-green-500/20 text-green-300"
                        : "bg-white/5 text-white/40"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

              </div>

            </>
          ) : (
            <div className="rounded-2xl border border-purple-500/20 bg-[#171027] p-10 text-center">

              <p className="text-xl font-bold">
                No PYQs available for practice
              </p>

              <button
                onClick={exitPractice}
                className="mt-5 rounded-xl bg-purple-600 px-5 py-3 font-bold"
              >
                Back to PYQs
              </button>

            </div>
          )}

        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-[#090015] px-4 py-8 text-white md:px-8">

      <div className="mx-auto max-w-7xl">

        {/* BACK */}

        <a
          href="/dashboard"
          className="mb-8 inline-block text-sm text-purple-300 hover:text-white"
        >
          ← Back to Dashboard
        </a>

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-pink-400">
              UPSC Previous Year Questions
            </p>

            <h1 className="text-4xl font-black md:text-5xl">
              PYQ Command Centre
            </h1>

            <p className="mt-2 text-gray-400">
              Practice, track and revise your UPSC
              Previous Year Questions.
            </p>

          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={startPractice}
              disabled={filteredPYQs.length === 0}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3 font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              🎯 Practice Filtered PYQs
            </button>

            <button
              onClick={resetProgress}
              className="rounded-xl border border-pink-500/30 px-5 py-3 font-semibold text-pink-400 transition hover:bg-pink-500/10"
            >
              Reset Progress
            </button>
          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-300">
            {error}
          </div>
        )}

        {/* MAIN PROGRESS */}

        <section className="mb-8 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-[#20105c] via-[#3500c7] to-[#241060] p-6 shadow-2xl">

          <div className="mb-3 flex items-center justify-between gap-4">

            <div>
              <p className="text-sm text-purple-200">
                Overall PYQ Progress
              </p>

              <p className="mt-1 text-4xl font-black">
                {accuracy}%
              </p>
            </div>

            <p className="text-sm text-purple-200">
              {completedCount} /{" "}
              {totalPYQs} completed
            </p>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-black/30">

            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-300 transition-all duration-500"
              style={{
                width: `${accuracy}%`,
              }}
            />

          </div>

        </section>

        {/* STATS */}

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <StatCard
            label="Total PYQs"
            value={totalPYQs}
          />

          <StatCard
            label="Completed"
            value={completedCount}
            valueClass="text-green-400"
          />

          <StatCard
            label="Remaining"
            value={remainingCount}
            valueClass="text-pink-400"
          />

        </section>

        {/* SUBJECT-WISE ANALYTICS */}

        {!loading && subjectAnalytics.length > 0 && (
          <section className="mb-8 rounded-2xl border border-purple-500/20 bg-[#171027] p-5 md:p-6">

            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-pink-400">
                  PYQ Analytics
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Subject-wise Progress
                </h2>
              </div>

              <p className="text-sm text-gray-400">
                Accuracy reflects recorded practice answers on this device.
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[730px] text-left text-sm">

                <thead className="border-b border-purple-500/20 text-xs uppercase tracking-wider text-purple-300">
                  <tr>
                    <th className="pb-3 pr-4 font-semibold">Subject</th>
                    <th className="pb-3 px-4 text-right font-semibold">Total</th>
                    <th className="pb-3 px-4 text-right font-semibold">Completed</th>
                    <th className="pb-3 px-4 text-right font-semibold">Remaining</th>
                    <th className="pb-3 px-4 text-right font-semibold">Accuracy</th>
                    <th className="pb-3 pl-4 text-right font-semibold">Revise Again</th>
                  </tr>
                </thead>

                <tbody>
                  {subjectAnalytics.map((item) => (
                    <tr
                      key={item.subject}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="py-4 pr-4 font-semibold text-white">
                        {item.subject}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-300">
                        {item.total}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-green-400">
                        {item.completed}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-pink-300">
                        {item.remaining}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-purple-200">
                        {item.attempts > 0
                          ? `${Math.round((item.correctAttempts / item.attempts) * 100)}% (${item.attempts})`
                          : "—"}
                      </td>
                      <td className="py-4 pl-4 text-right font-semibold text-yellow-300">
                        {hasPracticeStatusData ? item.reviseAgain : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

            {!hasPracticeStatusData && (
              <p className="mt-4 text-xs text-gray-500">
                Revise Again counts appear after you use the practice status controls on this device.
              </p>
            )}

            {subjectPerformance && (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-green-400">
                    Strongest subject
                  </p>
                  <p className="mt-1 font-bold text-white">
                    {subjectPerformance.strongest.subject}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    {subjectPerformance.strongest.accuracy}% accuracy across {subjectPerformance.strongest.attempts} attempts
                  </p>
                </div>

                <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-pink-400">
                    Weakest subject
                  </p>
                  <p className="mt-1 font-bold text-white">
                    {subjectPerformance.weakest.subject}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    {subjectPerformance.weakest.accuracy}% accuracy across {subjectPerformance.weakest.attempts} attempts
                  </p>
                </div>
              </div>
            )}

          </section>
        )}

        {/* YEAR-WISE ANALYTICS */}

        {!loading && yearAnalytics.length > 0 && (
          <section className="mb-8">

            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
                PYQ Analytics
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Year-wise Progress
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {yearAnalytics.map((item) => {
                const completionRate = item.total > 0
                  ? Math.round((item.completed / item.total) * 100)
                  : 0;

                return (
                  <div
                    key={item.year}
                    className="rounded-2xl border border-purple-500/20 bg-[#171027] p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-lg font-black text-purple-200">
                        {item.year}
                      </p>
                      <p className="text-sm font-bold text-purple-300">
                        {completionRate}%
                      </p>
                    </div>

                    <p className="mt-3 text-sm text-gray-400">
                      <span className="font-semibold text-green-400">{item.completed}</span> completed · {item.remaining} remaining
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.total} PYQs total
                    </p>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

          </section>
        )}

        {/* SUBJECTS */}

        <section className="mb-8">

          <h2 className="mb-4 text-xl font-bold">
            Subjects
          </h2>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">

            {SUBJECTS.map((subject) => {

              const count =
                subject === "All Subjects"
                  ? totalPYQs
                  : subjectCount(subject);

              const done =
                subject === "All Subjects"
                  ? completedCount
                  : subjectCompleted(subject);

              const selected =
                selectedSubject === subject;

              return (
                <button
                  key={subject}
                  onClick={() =>
                    setSelectedSubject(
                      subject
                    )
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    selected
                      ? "border-pink-400 bg-purple-700/50 shadow-lg shadow-purple-900/30"
                      : "border-purple-500/20 bg-[#171027] hover:border-purple-400/50"
                  }`}
                >

                  <p className="text-sm font-semibold">
                    {subject}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {done}/{count} completed
                  </p>

                </button>
              );
            })}

          </div>

        </section>

        {/* FILTERS */}

        <section className="mb-8 rounded-2xl border border-purple-500/20 bg-[#171027] p-4">

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search PYQs..."
              className="rounded-xl border border-purple-500/20 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-purple-400"
            />

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(
                  e.target.value
                )
              }
              className="rounded-xl border border-purple-500/20 bg-black/20 px-4 py-3 text-white outline-none"
            >

              <option value="All Years">
                All Years
              </option>

              {years.map((year) => (
                <option
                  key={year}
                  value={String(year)}
                >
                  {year}
                </option>
              ))}

            </select>

            <button
              onClick={clearFilters}
              className="rounded-xl border border-purple-500/20 bg-black/20 px-4 py-3 font-semibold transition hover:bg-purple-900/30"
            >
              Clear Filters
            </button>

          </div>

          {/* FILTER BUTTONS */}

          <div className="mt-4 flex flex-wrap gap-3">

            <button
              onClick={() =>
                setImportantOnly(
                  (value) => !value
                )
              }
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                importantOnly
                  ? "border-yellow-400/50 bg-yellow-500/10 text-yellow-300"
                  : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              ⭐ Important Only
            </button>

            <button
              onClick={() =>
                setPendingOnly(
                  (value) => !value
                )
              }
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                pendingOnly
                  ? "border-pink-400/50 bg-pink-500/10 text-pink-300"
                  : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              ⏳ Pending Only
            </button>

          </div>

        </section>

        {/* FILTERED PROGRESS */}

        <section className="mb-6 rounded-2xl border border-purple-500/20 bg-[#171027] p-5">

          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
                CURRENT VIEW
              </p>

              <p className="mt-1 text-lg font-bold">
                {filteredCompleted} /{" "}
                {filteredPYQs.length} completed
              </p>
            </div>

            <p className="text-2xl font-black text-purple-300">
              {filteredProgress}%
            </p>

          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">

            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all"
              style={{
                width: `${filteredProgress}%`,
              }}
            />

          </div>

        </section>

        {/* RESULT COUNT */}

        <div className="mb-4 flex items-center justify-between">

          <h2 className="text-xl font-bold">
            PYQs
          </h2>

          <p className="text-sm text-gray-400">
            Showing{" "}
            {filteredPYQs.length}{" "}
            questions
          </p>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="rounded-2xl border border-purple-500/20 bg-[#171027] p-10 text-center">

            <p className="text-purple-300">
              Loading PYQs...
            </p>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          filteredPYQs.length === 0 && (
            <div className="rounded-2xl border border-purple-500/20 bg-[#171027] p-10 text-center">

              <p className="text-xl font-bold">
                No PYQs found
              </p>

              <p className="mt-2 text-gray-400">
                Try changing your filters
                or search.
              </p>

              <button
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-purple-600 px-5 py-3 font-bold"
              >
                Clear Filters
              </button>

            </div>
          )}

        {/* PYQ LIST */}

        <section className="space-y-4">

          {filteredPYQs.map(
            (pyq, index) => {

              const completed =
                isCompleted(pyq.id);

              return (
                <article
                  key={pyq.id}
                  className={`rounded-2xl border p-5 transition ${
                    completed
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-purple-500/20 bg-[#171027] hover:border-purple-400/40"
                  }`}
                >

                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                    <div className="flex gap-4">

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${
                          completed
                            ? "bg-green-500/20 text-green-400"
                            : "bg-purple-500/20 text-purple-300"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div>

                        <div className="mb-2 flex flex-wrap gap-2">

                          <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
                            {pyq.subject}
                          </span>

                          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
                            {pyq.year}
                          </span>

                          {pyq.important && (
                            <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-300">
                              ⭐ Important
                            </span>
                          )}

                          {completed && (
                            <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">
                              ✓ Completed
                            </span>
                          )}

                        </div>

                        <p className="text-base font-semibold leading-7 text-gray-100">
                          {pyq.question}
                        </p>

                      </div>

                    </div>

                    <button
                      disabled={
                        saving === pyq.id
                      }
                      onClick={() =>
                        toggleCompleted(
                          pyq.id
                        )
                      }
                      className={`shrink-0 rounded-xl px-5 py-3 font-bold transition ${
                        completed
                          ? "bg-green-500/15 text-green-400"
                          : "bg-pink-500 text-white hover:bg-pink-400"
                      }`}
                    >

                      {saving === pyq.id
                        ? "Saving..."
                        : completed
                        ? "✓ Completed"
                        : "Mark Complete"}

                    </button>

                  </div>

                </article>
              );
            }
          )}

        </section>

        {/* BOTTOM SUMMARY */}

        {!loading &&
          totalPYQs > 0 && (
            <section className="mt-8 rounded-2xl border border-purple-500/20 bg-[#171027] p-6">

              <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">

                <div>
                  <p className="text-sm text-gray-400">
                    Completed
                  </p>

                  <p className="mt-1 text-2xl font-black text-green-400">
                    {completedCount}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Remaining
                  </p>

                  <p className="mt-1 text-2xl font-black text-pink-400">
                    {remainingCount}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Completion Target
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    100%
                  </p>
                </div>

              </div>

            </section>
          )}

      </div>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

function StatCard({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: number;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-purple-500/20 bg-[#171027] p-5">

      <p className="text-sm text-gray-400">
        {label}
      </p>

      <p
        className={`mt-2 text-3xl font-black ${valueClass}`}
      >
        {value}
      </p>

    </div>
  );
}
