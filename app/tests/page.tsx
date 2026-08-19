"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase-client";

type Option = {
  id: string;
  text: string;
};

type Question = {
  id: number;
  question: string;
  options: Option[];
  answer: string;
  explanation: string;
};

type Test = {
  id: number;
  title: string;
  subject: string;
  questions: number;
  duration: number;
  description: string;
  marksPerQuestion: number;
  negativeMarking: number;
  questionList: Question[];
};

type TestResult = {
  id?: number;
  user_id?: string;
  title: string;
  score: number;
  correct: number;
  wrong: number;
  skipped: number;
  attempted: number;
  total: number;
  date: string;
};

const supabase = createClient();

const RESULT_STORAGE_KEY = "redroom_test_results";
const DRAFT_STORAGE_KEY = "redroom_test_draft";

const TESTS: Test[] = [
  {
    id: 1,
    title: "UPSC Polity Mini Test",
    subject: "Polity",
    questions: 10,
    duration: 15,
    description:
      "Constitution, Fundamental Rights, Parliament, Executive and Constitutional Bodies.",
    marksPerQuestion: 2,
    negativeMarking: 0.66,
    questionList: [
      {
        id: 1,
        question:
          "Which Article of the Constitution guarantees equality before law and equal protection of laws?",
        options: [
          { id: "A", text: "Article 12" },
          { id: "B", text: "Article 14" },
          { id: "C", text: "Article 19" },
          { id: "D", text: "Article 21" },
        ],
        answer: "B",
        explanation:
          "Article 14 guarantees equality before law and equal protection of laws.",
      },
      {
        id: 2,
        question:
          "The Council of Ministers is collectively responsible to which House of Parliament?",
        options: [
          { id: "A", text: "Rajya Sabha" },
          { id: "B", text: "Lok Sabha" },
          { id: "C", text: "Both Houses" },
          { id: "D", text: "President" },
        ],
        answer: "B",
        explanation:
          "Under Article 75, the Council of Ministers is collectively responsible to the Lok Sabha.",
      },
      {
        id: 3,
        question:
          "Who appoints the Attorney General of India?",
        options: [
          { id: "A", text: "Prime Minister" },
          { id: "B", text: "Chief Justice of India" },
          { id: "C", text: "President of India" },
          { id: "D", text: "Parliament" },
        ],
        answer: "C",
        explanation:
          "The President appoints the Attorney General of India under Article 76.",
      },
      {
        id: 4,
        question:
          "Which Fundamental Right is available only to citizens of India?",
        options: [
          { id: "A", text: "Right to Equality" },
          { id: "B", text: "Right to Freedom" },
          { id: "C", text: "Right against Exploitation" },
          { id: "D", text: "Right to Constitutional Remedies" },
        ],
        answer: "B",
        explanation:
          "Article 19 freedoms are available only to citizens.",
      },
      {
        id: 5,
        question:
          "The President of India is elected by an electoral college consisting of:",
        options: [
          {
            id: "A",
            text: "Elected MPs only",
          },
          {
            id: "B",
            text: "Elected MPs and elected MLAs",
          },
          {
            id: "C",
            text: "All MPs and all MLAs",
          },
          {
            id: "D",
            text: "Elected MPs, MLAs and MLCs",
          },
        ],
        answer: "B",
        explanation:
          "The elected members of both Houses of Parliament and elected members of Legislative Assemblies participate.",
      },
      {
        id: 6,
        question:
          "Which constitutional body conducts elections to Parliament and State Legislatures?",
        options: [
          { id: "A", text: "Union Public Service Commission" },
          { id: "B", text: "Finance Commission" },
          { id: "C", text: "Election Commission of India" },
          { id: "D", text: "Parliament" },
        ],
        answer: "C",
        explanation:
          "Article 324 vests the superintendence, direction and control of elections in the Election Commission.",
      },
      {
        id: 7,
        question:
          "The power of judicial review in India is exercised by:",
        options: [
          { id: "A", text: "Only Supreme Court" },
          { id: "B", text: "Only High Courts" },
          { id: "C", text: "Supreme Court and High Courts" },
          { id: "D", text: "Parliament" },
        ],
        answer: "C",
        explanation:
          "Both the Supreme Court and High Courts exercise judicial review within their constitutional jurisdictions.",
      },
      {
        id: 8,
        question:
          "A Money Bill can be introduced only in:",
        options: [
          { id: "A", text: "Rajya Sabha" },
          { id: "B", text: "Lok Sabha" },
          { id: "C", text: "Either House" },
          { id: "D", text: "Joint Sitting" },
        ],
        answer: "B",
        explanation:
          "A Money Bill can be introduced only in the Lok Sabha and requires the President's recommendation.",
      },
      {
        id: 9,
        question:
          "The minimum age for becoming a member of the Rajya Sabha is:",
        options: [
          { id: "A", text: "21 years" },
          { id: "B", text: "25 years" },
          { id: "C", text: "30 years" },
          { id: "D", text: "35 years" },
        ],
        answer: "C",
        explanation:
          "A person must be at least 30 years old to be elected to the Rajya Sabha.",
      },
      {
        id: 10,
        question:
          "Which Article deals with the constitutional amendment procedure?",
        options: [
          { id: "A", text: "Article 32" },
          { id: "B", text: "Article 123" },
          { id: "C", text: "Article 356" },
          { id: "D", text: "Article 368" },
        ],
        answer: "D",
        explanation:
          "Article 368 deals with the power and procedure for constitutional amendment.",
      },
    ],
  },

  {
    id: 2,
    title: "UPSC History Mini Test",
    subject: "History",
    questions: 10,
    duration: 15,
    description:
      "Modern Indian History, British expansion, reform movements and national movement.",
    marksPerQuestion: 2,
    negativeMarking: 0.66,
    questionList: [
      {
        id: 1,
        question: "The Battle of Plassey was fought in:",
        options: [
          { id: "A", text: "1757" },
          { id: "B", text: "1764" },
          { id: "C", text: "1773" },
          { id: "D", text: "1857" },
        ],
        answer: "A",
        explanation:
          "The Battle of Plassey was fought in 1757.",
      },
      {
        id: 2,
        question:
          "Who founded the Brahmo Samaj?",
        options: [
          { id: "A", text: "Swami Dayanand Saraswati" },
          { id: "B", text: "Raja Ram Mohan Roy" },
          { id: "C", text: "Swami Vivekananda" },
          { id: "D", text: "Ishwar Chandra Vidyasagar" },
        ],
        answer: "B",
        explanation:
          "Raja Ram Mohan Roy founded the Brahmo Sabha, later known as Brahmo Samaj.",
      },
      {
        id: 3,
        question:
          "The Revolt of 1857 first broke out at:",
        options: [
          { id: "A", text: "Delhi" },
          { id: "B", text: "Kanpur" },
          { id: "C", text: "Meerut" },
          { id: "D", text: "Lucknow" },
        ],
        answer: "C",
        explanation:
          "The revolt began at Meerut on 10 May 1857.",
      },
      {
        id: 4,
        question:
          "The Indian National Congress was founded in:",
        options: [
          { id: "A", text: "1885" },
          { id: "B", text: "1889" },
          { id: "C", text: "1905" },
          { id: "D", text: "1919" },
        ],
        answer: "A",
        explanation:
          "The Indian National Congress was founded in 1885.",
      },
      {
        id: 5,
        question:
          "Who was the first President of the Indian National Congress?",
        options: [
          { id: "A", text: "Dadabhai Naoroji" },
          { id: "B", text: "W.C. Bonnerjee" },
          { id: "C", text: "Surendranath Banerjee" },
          { id: "D", text: "A.O. Hume" },
        ],
        answer: "B",
        explanation:
          "W.C. Bonnerjee presided over the first INC session in 1885.",
      },
      {
        id: 6,
        question:
          "The Non-Cooperation Movement was launched in:",
        options: [
          { id: "A", text: "1919" },
          { id: "B", text: "1920" },
          { id: "C", text: "1922" },
          { id: "D", text: "1930" },
        ],
        answer: "B",
        explanation:
          "The Non-Cooperation Movement was launched in 1920.",
      },
      {
        id: 7,
        question:
          "The Dandi March was associated with:",
        options: [
          { id: "A", text: "Non-Cooperation Movement" },
          { id: "B", text: "Civil Disobedience Movement" },
          { id: "C", text: "Quit India Movement" },
          { id: "D", text: "Swadeshi Movement" },
        ],
        answer: "B",
        explanation:
          "The Dandi March of 1930 marked the beginning of the Civil Disobedience phase.",
      },
      {
        id: 8,
        question:
          "The Quit India Movement was launched in:",
        options: [
          { id: "A", text: "1939" },
          { id: "B", text: "1940" },
          { id: "C", text: "1942" },
          { id: "D", text: "1946" },
        ],
        answer: "C",
        explanation:
          "The Quit India Movement was launched in August 1942.",
      },
      {
        id: 9,
        question:
          "The Government of India Act, 1935 introduced:",
        options: [
          { id: "A", text: "Dyarchy in provinces" },
          { id: "B", text: "Provincial autonomy" },
          { id: "C", text: "Separate electorates for the first time" },
          { id: "D", text: "Complete independence" },
        ],
        answer: "B",
        explanation:
          "The Government of India Act 1935 provided provincial autonomy.",
      },
      {
        id: 10,
        question:
          "The Cabinet Mission came to India in:",
        options: [
          { id: "A", text: "1942" },
          { id: "B", text: "1945" },
          { id: "C", text: "1946" },
          { id: "D", text: "1947" },
        ],
        answer: "C",
        explanation:
          "The Cabinet Mission arrived in India in 1946.",
      },
    ],
  },

  {
    id: 3,
    title: "UPSC Geography Mini Test",
    subject: "Geography",
    questions: 10,
    duration: 15,
    description:
      "Physical geography, Indian geography, climate, rivers and resources.",
    marksPerQuestion: 2,
    negativeMarking: 0.66,
    questionList: [
      {
        id: 1,
        question:
          "Which layer of the atmosphere contains most weather phenomena?",
        options: [
          { id: "A", text: "Troposphere" },
          { id: "B", text: "Stratosphere" },
          { id: "C", text: "Mesosphere" },
          { id: "D", text: "Thermosphere" },
        ],
        answer: "A",
        explanation:
          "Most weather phenomena occur in the troposphere.",
      },
      {
        id: 2,
        question:
          "The Tropic of Cancer passes through how many Indian states?",
        options: [
          { id: "A", text: "6" },
          { id: "B", text: "7" },
          { id: "C", text: "8" },
          { id: "D", text: "9" },
        ],
        answer: "C",
        explanation:
          "The Tropic of Cancer passes through eight Indian states.",
      },
      {
        id: 3,
        question:
          "Which is the longest river flowing entirely within India?",
        options: [
          { id: "A", text: "Ganga" },
          { id: "B", text: "Godavari" },
          { id: "C", text: "Krishna" },
          { id: "D", text: "Narmada" },
        ],
        answer: "B",
        explanation:
          "Godavari is the longest river flowing entirely within India.",
      },
      {
        id: 4,
        question:
          "Black soil is particularly suitable for:",
        options: [
          { id: "A", text: "Tea" },
          { id: "B", text: "Cotton" },
          { id: "C", text: "Jute" },
          { id: "D", text: "Wheat only" },
        ],
        answer: "B",
        explanation:
          "Black cotton soil has high moisture retention and is well suited to cotton.",
      },
      {
        id: 5,
        question:
          "The Western Ghats are also known as:",
        options: [
          { id: "A", text: "Sahyadri" },
          { id: "B", text: "Aravalli" },
          { id: "C", text: "Shivalik" },
          { id: "D", text: "Purvanchal" },
        ],
        answer: "A",
        explanation:
          "The Western Ghats are commonly called the Sahyadri in their northern and central sections.",
      },
      {
        id: 6,
        question:
          "The Indian monsoon is primarily influenced by:",
        options: [
          { id: "A", text: "Land-sea thermal contrast" },
          { id: "B", text: "Only ocean currents" },
          { id: "C", text: "Only western disturbances" },
          { id: "D", text: "Only cyclones" },
        ],
        answer: "A",
        explanation:
          "Differential heating of land and sea is a fundamental factor in the monsoon system.",
      },
      {
        id: 7,
        question:
          "Which ocean current is a cold current?",
        options: [
          { id: "A", text: "Gulf Stream" },
          { id: "B", text: "Kuroshio" },
          { id: "C", text: "Labrador Current" },
          { id: "D", text: "Brazil Current" },
        ],
        answer: "C",
        explanation:
          "The Labrador Current is a cold current in the North Atlantic.",
      },
      {
        id: 8,
        question:
          "The Deccan Plateau is mainly composed of:",
        options: [
          { id: "A", text: "Limestone" },
          { id: "B", text: "Basaltic rocks" },
          { id: "C", text: "Sandstone only" },
          { id: "D", text: "Marble" },
        ],
        answer: "B",
        explanation:
          "Large parts of the Deccan Plateau are formed by basaltic lava flows.",
      },
      {
        id: 9,
        question:
          "Which river is known as the 'Sorrow of Bihar'?",
        options: [
          { id: "A", text: "Kosi" },
          { id: "B", text: "Son" },
          { id: "C", text: "Gandak" },
          { id: "D", text: "Yamuna" },
        ],
        answer: "A",
        explanation:
          "The Kosi is traditionally called the Sorrow of Bihar because of its flooding and channel shifts.",
      },
      {
        id: 10,
        question:
          "El Niño is associated with unusual warming of:",
        options: [
          { id: "A", text: "North Atlantic Ocean" },
          { id: "B", text: "Central and eastern tropical Pacific Ocean" },
          { id: "C", text: "Indian Ocean only" },
          { id: "D", text: "Arctic Ocean" },
        ],
        answer: "B",
        explanation:
          "El Niño involves abnormal warming of the central and eastern tropical Pacific.",
      },
    ],
  },
];

export default function TestsPage() {
  const router = useRouter();

  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<
    Record<number, string>
  >({});

  const [marked, setMarked] = useState<
    Record<number, boolean>
  >({});

  const [timeLeft, setTimeLeft] = useState(0);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const [result, setResult] = useState<TestResult | null>(
    null
  );

  const [saving, setSaving] = useState(false);

  const [savedResults, setSavedResults] = useState<
    TestResult[]
  >([]);

  const [subjectFilter, setSubjectFilter] =
    useState("All");

  const submitTestRef = useRef<(autoSubmit?: boolean) => Promise<void>>(
    async () => {}
  );

  /*
  |--------------------------------------------------------------------------
  | LOAD LOCAL RESULTS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(RESULT_STORAGE_KEY);

        if (saved) {
          setSavedResults(JSON.parse(saved));
        }

        const draft = localStorage.getItem(DRAFT_STORAGE_KEY);

        if (draft) {
          const parsed = JSON.parse(draft);

          const test = TESTS.find(
            (item) => item.id === parsed.testId
          );

          if (test && parsed.started && parsed.endTime) {
            const remaining = Math.max(
              0,
              Math.ceil(
                (parsed.endTime - Date.now()) / 1000
              )
            );

            if (remaining > 0) {
              setSelectedTest(test);
              setStarted(true);
              setFinished(false);
              setResult(null);
              setCurrentQuestion(
                Math.min(
                  Math.max(parsed.currentQuestion ?? 0, 0),
                  test.questionList.length - 1
                )
              );
              setAnswers(parsed.answers ?? {});
              setMarked(parsed.marked ?? {});
              setEndTime(parsed.endTime);
              setTimeLeft(remaining);
            } else {
              localStorage.removeItem(DRAFT_STORAGE_KEY);
            }
          }
        }
      } catch (error) {
        console.error("Could not load saved test data", error);
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | TIMER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    submitTestRef.current = submitTest;
  });

  useEffect(() => {
    if (!started || finished || !endTime) return;

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      );

      setTimeLeft(remaining);

      if (remaining <= 0) {
        void submitTestRef.current(true);
      }
    };

    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [
    started,
    finished,
    endTime,
    timeLeft,
    selectedTest,
    answers,
  ]);

  /*
  |--------------------------------------------------------------------------
  | FORMAT TIME
  |--------------------------------------------------------------------------
  */

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }

  /*
  |--------------------------------------------------------------------------
  | START TEST
  |--------------------------------------------------------------------------
  */

  function startTest(test: Test) {
    const newEndTime =
      Date.now() + test.duration * 60 * 1000;

    setSelectedTest(test);
    setStarted(true);
    setFinished(false);
    setResult(null);
    setCurrentQuestion(0);
    setAnswers({});
    setMarked({});
    setEndTime(newEndTime);
    setTimeLeft(test.duration * 60);
  }

  /*
  |--------------------------------------------------------------------------
  | SELECT ANSWER
  |--------------------------------------------------------------------------
  */

  function selectAnswer(
    questionId: number,
    optionId: string
  ) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: optionId,
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | MARK FOR REVIEW
  |--------------------------------------------------------------------------
  */

  function toggleMarked(questionId: number) {
    setMarked((previous) => ({
      ...previous,
      [questionId]: !previous[questionId],
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | SUBMIT TEST
  |--------------------------------------------------------------------------
  */

  async function submitTest(autoSubmit = false) {
    if (!selectedTest) return;

    if (!autoSubmit) {
      const confirmed = window.confirm(
        "Are you sure you want to submit this test?"
      );

      if (!confirmed) return;
    }

    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    selectedTest.questionList.forEach((question) => {
      const selected = answers[question.id];

      if (!selected) {
        skipped++;
      } else if (selected === question.answer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const attempted = correct + wrong;

    const score =
      correct * selectedTest.marksPerQuestion -
      wrong * selectedTest.negativeMarking;

    const finalScore = Number(score.toFixed(2));

    const finalResult: TestResult = {
      title: selectedTest.title,
      score: finalScore,
      correct,
      wrong,
      skipped,
      attempted,
      total: selectedTest.questions,
      date: new Date().toISOString(),
    };

    setResult(finalResult);
    setFinished(true);
    setStarted(false);
    setEndTime(null);

    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (error) {
      console.error("Could not clear test draft:", error);
    }

    await saveResult(finalResult);
  }

  /*
  |--------------------------------------------------------------------------
  | SAVE RESULT
  |--------------------------------------------------------------------------
  */

  async function saveResult(finalResult: TestResult) {
    setSaving(true);

    let resultToStore = finalResult;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("test_results")
          .insert({
            user_id: user.id,
            title: finalResult.title,
            score: finalResult.score,
            correct: finalResult.correct,
            wrong: finalResult.wrong,
            skipped: finalResult.skipped,
            attempted: finalResult.attempted,
            total: finalResult.total,
            date: finalResult.date,
          })
          .select()
          .single();

        if (error) {
          console.error(
            "Supabase result save failed:",
            error
          );
        } else if (data) {
          resultToStore = {
            ...finalResult,
            id: data.id,
            user_id: data.user_id,
          };
        }
      }
    } catch (error) {
      console.error("Supabase save error:", error);
    }

    /*
     * Always maintain a local backup too.
     */

    try {
      const existing = JSON.parse(
        localStorage.getItem(RESULT_STORAGE_KEY) || "[]"
      );

      const updated = [
        resultToStore,
        ...existing,
      ].slice(0, 100);

      localStorage.setItem(
        RESULT_STORAGE_KEY,
        JSON.stringify(updated)
      );

      setSavedResults(updated);
    } catch (error) {
      console.error("Local result save failed:", error);
    }

    setSaving(false);
  }

  /*
  |--------------------------------------------------------------------------
  | RESTART
  |--------------------------------------------------------------------------
  */

  function restartTest() {
    if (!selectedTest) return;

    startTest(selectedTest);
  }

  /*
  |--------------------------------------------------------------------------
  | EXIT
  |--------------------------------------------------------------------------
  */

  function exitTest() {
    setSelectedTest(null);
    setStarted(false);
    setFinished(false);
    setResult(null);
    setAnswers({});
    setMarked({});
    setCurrentQuestion(0);
    setEndTime(null);

    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (error) {
      console.error("Could not clear test draft:", error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CURRENT QUESTION
  |--------------------------------------------------------------------------
  */

  const question = selectedTest?.questionList[currentQuestion];

  /*
  |--------------------------------------------------------------------------
  | TEST STATS
  |--------------------------------------------------------------------------
  */

  const answeredCount = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);

  const markedCount = useMemo(() => {
    return Object.values(marked).filter(Boolean).length;
  }, [marked]);

  /*
  |--------------------------------------------------------------------------
  | SAVE ACTIVE TEST DRAFT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!hydrated) return;

    if (!started || finished || !selectedTest || !endTime) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      return;
    }

    try {
      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({
          testId: selectedTest.id,
          started: true,
          currentQuestion,
          answers,
          marked,
          endTime,
        })
      );
    } catch (error) {
      console.error("Could not save active test draft:", error);
    }
  }, [
    hydrated,
    started,
    finished,
    selectedTest,
    currentQuestion,
    answers,
    marked,
    endTime,
  ]);

  /*
  |--------------------------------------------------------------------------
  | RESULT ACCURACY
  |--------------------------------------------------------------------------
  */

  const accuracy = result
    ? result.attempted > 0
      ? Math.round(
          (result.correct / result.attempted) * 100
        )
      : 0
    : 0;

  /*
  |--------------------------------------------------------------------------
  | TEST HISTORY STATS
  |--------------------------------------------------------------------------
  */

  const testHistoryStats = useMemo(() => {
    return TESTS.reduce(
      (acc, test) => {
        const attempts = savedResults.filter(
          (item) => item.title === test.title
        );

        const best = attempts.reduce(
          (bestScore, item) =>
            Math.max(bestScore, item.score),
          0
        );

        acc[test.id] = {
          attempts: attempts.length,
          best,
        };

        return acc;
      },
      {} as Record<
        number,
        { attempts: number; best: number }
      >
    );
  }, [savedResults]);

  /*
  |--------------------------------------------------------------------------
  | TEST SELECTION SCREEN
  |--------------------------------------------------------------------------
  */

  if (!selectedTest && !finished) {
    return (
      <main className="min-h-screen bg-[#080510] text-white">

        <header className="border-b border-white/10 bg-[#0b0714]">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6">

            <div>
              <button
                onClick={() =>
                  router.push("/dashboard")
                }
                className="text-sm text-purple-300 hover:text-white"
              >
                ← Back to Dashboard
              </button>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-pink-400">
                UPSC TEST CENTRE
              </p>

              <h1 className="mt-1 text-4xl font-black">
                Tests
              </h1>

              <p className="mt-2 text-white/40">
                Attempt tests, analyse your score and improve.
              </p>
            </div>

          </div>

        </header>

        <div className="mx-auto max-w-7xl px-5 py-10">

          {/* TEST FILTER */}

          <div className="mb-6 flex flex-wrap gap-2">
            {["All", ...Array.from(new Set(TESTS.map((test) => test.subject)))].map(
              (subject) => (
                <button
                  key={subject}
                  onClick={() => setSubjectFilter(subject)}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                    subjectFilter === subject
                      ? "border-purple-500 bg-purple-500/20 text-purple-200"
                      : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {subject}
                </button>
              )
            )}
          </div>

          {/* TEST CARDS */}

          <div className="grid gap-5 md:grid-cols-3">

            {TESTS
              .filter(
                (test) =>
                  subjectFilter === "All" ||
                  test.subject === subjectFilter
              )
              .map((test) => (

              <div
                key={test.id}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-purple-500/40 hover:bg-white/[0.06]"
              >

                <div className="flex items-center justify-between">

                  <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
                    {test.subject}
                  </span>

                  <span className="text-sm text-white/30">
                    {test.duration} min
                  </span>

                </div>

                <h2 className="mt-6 text-2xl font-black">
                  {test.title}
                </h2>

                <p className="mt-3 min-h-[60px] text-sm leading-6 text-white/40">
                  {test.description}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-black/20 p-3">
                    <p className="text-xs text-white/30">
                      Questions
                    </p>
                    <p className="mt-1 font-bold">
                      {test.questions}
                    </p>
                  </div>

                  <div className="rounded-xl bg-black/20 p-3">
                    <p className="text-xs text-white/30">
                      Negative
                    </p>
                    <p className="mt-1 font-bold">
                      -{test.negativeMarking}
                    </p>
                  </div>

                  <div className="rounded-xl bg-black/20 p-3">
                    <p className="text-xs text-white/30">
                      Attempts
                    </p>
                    <p className="mt-1 font-bold">
                      {testHistoryStats[test.id]?.attempts ?? 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-black/20 p-3">
                    <p className="text-xs text-white/30">
                      Best Score
                    </p>
                    <p className="mt-1 font-bold text-green-300">
                      {testHistoryStats[test.id]?.best ?? 0}
                    </p>
                  </div>

                </div>

                <button
                  onClick={() => startTest(test)}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3 font-bold transition hover:opacity-90"
                >
                  Start Test →
                </button>

              </div>

            ))}

          </div>

          {/* PREVIOUS RESULTS */}

          {savedResults.length > 0 && (
            <section className="mt-12">

              <p className="text-xs font-bold uppercase tracking-widest text-pink-400">
                HISTORY
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Recent Test Results
              </h2>

              <div className="mt-5 space-y-3">

                {savedResults
                  .slice(0, 10)
                  .map((item, index) => {

                    const itemAccuracy =
                      item.attempted > 0
                        ? Math.round(
                            (item.correct /
                              item.attempted) *
                              100
                          )
                        : 0;

                    return (
                      <div
                        key={`${item.date}-${index}`}
                        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:flex-row md:items-center md:justify-between"
                      >

                        <div>
                          <p className="font-bold">
                            {item.title}
                          </p>

                          <p className="mt-1 text-xs text-white/30">
                            {new Date(
                              item.date
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div className="flex items-center gap-6">

                          <div>
                            <p className="text-xs text-white/30">
                              Score
                            </p>
                            <p className="font-black">
                              {item.score}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-white/30">
                              Accuracy
                            </p>
                            <p className="font-black">
                              {itemAccuracy}%
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-white/30">
                              Correct
                            </p>
                            <p className="font-black text-green-400">
                              {item.correct}
                            </p>
                          </div>

                        </div>

                      </div>
                    );
                  })}

              </div>

            </section>
          )}

        </div>

      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RESULT SCREEN
  |--------------------------------------------------------------------------
  */

  if (finished && result && selectedTest) {
    return (
      <main className="min-h-screen bg-[#080510] text-white">

        <div className="mx-auto max-w-5xl px-5 py-10">

          <div className="text-center">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-pink-400">
              TEST COMPLETED
            </p>

            <h1 className="mt-3 text-4xl font-black">
              {result.title}
            </h1>

            <p className="mt-2 text-white/40">
              {saving
                ? "Saving your result..."
                : "Your result has been recorded."}
            </p>

          </div>

          {/* MAIN SCORE */}

          <section className="mt-10 rounded-3xl bg-gradient-to-br from-purple-700 to-fuchsia-600 p-8 text-center">

            <p className="text-sm font-bold text-white/60">
              YOUR SCORE
            </p>

            <p className="mt-2 text-6xl font-black">
              {result.score}
            </p>

            <p className="mt-2 text-white/60">
              out of{" "}
              {selectedTest.questions *
                selectedTest.marksPerQuestion}
            </p>

          </section>

          {/* RESULT STATS */}

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">

            <ResultStat
              label="Correct"
              value={result.correct}
              icon="✅"
            />

            <ResultStat
              label="Wrong"
              value={result.wrong}
              icon="❌"
            />

            <ResultStat
              label="Skipped"
              value={result.skipped}
              icon="⏭️"
            />

            <ResultStat
              label="Attempted"
              value={result.attempted}
              icon="📝"
            />

            <ResultStat
              label="Accuracy"
              value={`${accuracy}%`}
              icon="🎯"
            />

          </div>

          {/* PERFORMANCE MESSAGE */}

          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">

            <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
              PERFORMANCE
            </p>

            <h2 className="mt-2 text-2xl font-black">
              {accuracy >= 80
                ? "Excellent performance 🔥"
                : accuracy >= 60
                ? "Good performance. Keep improving."
                : accuracy >= 40
                ? "Average performance. Revision required."
                : "Focus on concepts and revise again."}
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Accuracy is calculated from attempted questions.
              Wrong answers receive the configured negative
              marking.
            </p>

          </section>

          {/* ACTIONS */}

          <div className="mt-8 grid gap-3 md:grid-cols-3">

            <button
              onClick={restartTest}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-4 font-bold"
            >
              ↻ Retake Test
            </button>

            <button
              onClick={exitTest}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 font-bold hover:bg-white/10"
            >
              ← All Tests
            </button>

            <button
              onClick={() =>
                router.push("/performance")
              }
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 font-bold hover:bg-white/10"
            >
              📊 View Performance
            </button>

          </div>

          {/* QUESTION REVIEW */}

          <section className="mt-12">

            <p className="text-xs font-bold uppercase tracking-widest text-pink-400">
              REVIEW
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Question Analysis
            </h2>

            <div className="mt-5 space-y-4">

              {selectedTest.questionList.map(
                (item, index) => {

                  const selected =
                    answers[item.id];

                  const isCorrect =
                    selected === item.answer;

                  const isSkipped = !selected;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border p-5 ${
                        isCorrect
                          ? "border-green-500/20 bg-green-500/[0.04]"
                          : isSkipped
                          ? "border-yellow-500/20 bg-yellow-500/[0.04]"
                          : "border-red-500/20 bg-red-500/[0.04]"
                      }`}
                    >

                      <div className="flex items-start gap-3">

                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-bold">
                          {index + 1}
                        </span>

                        <div className="flex-1">

                          <p className="font-bold leading-6">
                            {item.question}
                          </p>

                          <div className="mt-3 grid gap-2 md:grid-cols-2">

                            {item.options.map(
                              (option) => {

                                const selectedOption =
                                  selected ===
                                  option.id;

                                const correctOption =
                                  item.answer ===
                                  option.id;

                                return (
                                  <div
                                    key={option.id}
                                    className={`rounded-lg border p-3 text-sm ${
                                      correctOption
                                        ? "border-green-500/30 bg-green-500/10"
                                        : selectedOption
                                        ? "border-red-500/30 bg-red-500/10"
                                        : "border-white/5 bg-white/[0.02]"
                                    }`}
                                  >
                                    <span className="font-bold">
                                      {option.id}.
                                    </span>{" "}
                                    {option.text}

                                    {correctOption && (
                                      <span className="ml-2 text-xs text-green-400">
                                        Correct
                                      </span>
                                    )}

                                    {selectedOption &&
                                      !correctOption && (
                                        <span className="ml-2 text-xs text-red-400">
                                          Your answer
                                        </span>
                                      )}
                                  </div>
                                );
                              }
                            )}

                          </div>

                          <p className="mt-4 rounded-lg bg-black/20 p-3 text-sm leading-6 text-white/50">
                            <span className="font-bold text-purple-300">
                              Explanation:
                            </span>{" "}
                            {item.explanation}
                          </p>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </section>

        </div>

      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | TEST SCREEN
  |--------------------------------------------------------------------------
  */

  if (started && selectedTest && question) {
    const selectedAnswer =
      answers[question.id];

    const progress =
      ((currentQuestion + 1) /
        selectedTest.questions) *
      100;

    return (
      <main className="min-h-screen bg-[#080510] text-white">

        {/* TEST HEADER */}

        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080510]/95 backdrop-blur">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

            <div>

              <p className="text-xs font-bold text-purple-400">
                {selectedTest.subject}
              </p>

              <h1 className="font-black">
                {selectedTest.title}
              </h1>

            </div>

            <div className="flex items-center gap-4">

              <div className="hidden text-right sm:block">

                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  Answered
                </p>

                <p className="font-bold">
                  {answeredCount}/
                  {selectedTest.questions}
                </p>

              </div>

              <div className="hidden text-right sm:block">

                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  Review
                </p>

                <p className="font-bold">
                  {markedCount}
                </p>

              </div>

              <div
                className={`rounded-xl px-4 py-2 font-black ${
                  timeLeft <= 60
                    ? "bg-red-500/20 text-red-400"
                    : "bg-purple-500/10 text-purple-300"
                }`}
              >
                ⏱ {formatTime(timeLeft)}
              </div>

              <button
                onClick={() => submitTest(false)}
                className="rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 text-sm font-bold"
              >
                Submit
              </button>

            </div>

          </div>

          <div className="h-1 bg-white/5">

            <div
              className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 transition-all"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </header>

        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[1fr_300px]">

          {/* QUESTION */}

          <section>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">

              <div className="flex items-center justify-between">

                <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
                  Question {currentQuestion + 1} of{" "}
                  {selectedTest.questions}
                </span>

                <button
                  onClick={() =>
                    toggleMarked(question.id)
                  }
                  className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                    marked[question.id]
                      ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                      : "border-white/10 bg-white/5 text-white/50"
                  }`}
                >
                  {marked[question.id]
                    ? "🚩 Marked"
                    : "🚩 Mark Review"}
                </button>

              </div>

              <h2 className="mt-8 text-xl font-bold leading-8 md:text-2xl">
                {question.question}
              </h2>

              <div className="mt-8 space-y-3">

                {question.options.map(
                  (option) => {

                    const isSelected =
                      selectedAnswer ===
                      option.id;

                    return (
                      <button
                        key={option.id}
                        onClick={() =>
                          selectAnswer(
                            question.id,
                            option.id
                          )
                        }
                        className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-white/10 bg-white/[0.02] hover:border-purple-500/40 hover:bg-white/[0.04]"
                        }`}
                      >

                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold ${
                            isSelected
                              ? "bg-purple-600 text-white"
                              : "bg-white/5 text-white/50"
                          }`}
                        >
                          {option.id}
                        </span>

                        <span className="pt-1 text-sm leading-6 md:text-base">
                          {option.text}
                        </span>

                      </button>
                    );
                  }
                )}

              </div>

              {/* NAVIGATION */}

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">

                <button
                  disabled={currentQuestion === 0}
                  onClick={() =>
                    setCurrentQuestion(
                      (previous) =>
                        previous - 1
                    )
                  }
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ← Previous
                </button>

                {currentQuestion <
                selectedTest.questions - 1 ? (
                  <button
                    onClick={() =>
                      setCurrentQuestion(
                        (previous) =>
                          previous + 1
                      )
                    }
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3 font-bold"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={() => submitTest(false)}
                    className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3 font-bold"
                  >
                    Finish Test ✓
                  </button>
                )}

              </div>

            </div>

          </section>

          {/* QUESTION PALETTE */}

          <aside>

            <div className="sticky top-24 rounded-3xl border border-white/10 bg-white/[0.04] p-5">

              <h3 className="font-black">
                Question Palette
              </h3>

              <div className="mt-4 grid grid-cols-5 gap-2">

                {selectedTest.questionList.map(
                  (item, index) => {

                    const isAnswered =
                      Boolean(answers[item.id]);

                    const isMarked =
                      Boolean(marked[item.id]);

                    const isCurrent =
                      currentQuestion === index;

                    return (
                      <button
                        key={item.id}
                        onClick={() =>
                          setCurrentQuestion(
                            index
                          )
                        }
                        className={`relative h-10 rounded-lg text-sm font-bold ${
                          isCurrent
                            ? "ring-2 ring-purple-400"
                            : ""
                        } ${
                          isAnswered
                            ? "bg-green-500/20 text-green-300"
                            : "bg-white/5 text-white/40"
                        }`}
                      >
                        {index + 1}

                        {isMarked && (
                          <span className="absolute -right-1 -top-1 text-[10px]">
                            🚩
                          </span>
                        )}

                      </button>
                    );
                  }
                )}

              </div>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-xs text-white/40">

                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-green-500/30" />
                  Answered
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-white/10" />
                  Not answered
                </div>

                <div>
                  🚩 Marked for review
                </div>

              </div>

              <div className="mt-6 rounded-xl bg-purple-500/5 p-4">

                <p className="text-xs leading-5 text-white/40">
                  Correct: +
                  {selectedTest.marksPerQuestion}
                  {"  "}
                  Wrong: -
                  {selectedTest.negativeMarking}
                </p>

              </div>

            </div>

          </aside>

        </div>

      </main>
    );
  }

  return null;
}

/*
|--------------------------------------------------------------------------
| RESULT STAT
|--------------------------------------------------------------------------
*/

function ResultStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">

      <div className="text-xl">
        {icon}
      </div>

      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/30">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black">
        {value}
      </p>

    </div>
  );
}
