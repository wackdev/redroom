"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { sound } from "@/lib/audio/sound-engine";
import { mutateWithOutbox } from "@/lib/db/dexie";
import { dexieDb } from "@/lib/db/dexie";

type DrillCategory = "all" | "percentages" | "unit_digits" | "divisibility" | "remainders" | "squares";

interface SpeedMathQuestion {
  id: string;
  category: DrillCategory;
  prompt: string;
  options: string[];
  correct: string;
  explanation: string;
}

const MATH_DRILLS: SpeedMathQuestion[] = [
  // --------------------------------------------------------------------------
  // 1. PERCENTAGE & FRACTION LIGHTNING CONVERSIONS
  // --------------------------------------------------------------------------
  {
    id: "pct-1",
    category: "percentages",
    prompt: "Convert fraction 1/7 to percentage:",
    options: ["14.28%", "12.50%", "16.66%", "11.11%"],
    correct: "14.28%",
    explanation: "1/7 = 14.28% (or 14 2/7%). Notice that 2/7 = 28.57%, 4/7 = 57.14%.",
  },
  {
    id: "pct-2",
    category: "percentages",
    prompt: "Convert fraction 3/8 to percentage:",
    options: ["37.50%", "33.33%", "36.25%", "42.50%"],
    correct: "37.50%",
    explanation: "1/8 = 12.5% → 3/8 = 3 × 12.5% = 37.50%.",
  },
  {
    id: "pct-3",
    category: "percentages",
    prompt: "Convert fraction 5/6 to percentage:",
    options: ["83.33%", "80.00%", "85.50%", "87.50%"],
    correct: "83.33%",
    explanation: "1 - 1/6 = 100% - 16.66% = 83.33%.",
  },
  {
    id: "pct-4",
    category: "percentages",
    prompt: "Convert fraction 1/14 to percentage:",
    options: ["7.14%", "6.66%", "8.33%", "7.69%"],
    correct: "7.14%",
    explanation: "1/14 = (1/7) / 2 = 14.28% / 2 = 7.14%.",
  },
  {
    id: "pct-5",
    category: "percentages",
    prompt: "Convert fraction 4/9 to percentage:",
    options: ["44.44%", "40.00%", "45.45%", "48.00%"],
    correct: "44.44%",
    explanation: "1/9 = 11.11% → 4/9 = 44.44%. (Compare with 1/11 = 9.09% → 4/11 = 36.36%).",
  },
  {
    id: "pct-6",
    category: "percentages",
    prompt: "Convert fraction 7/12 to percentage:",
    options: ["58.33%", "60.00%", "56.66%", "62.50%"],
    correct: "58.33%",
    explanation: "1/2 + 1/12 = 50% + 8.33% = 58.33%.",
  },

  // --------------------------------------------------------------------------
  // 2. UNIT DIGITS & CYCLICITY PERIODS
  // --------------------------------------------------------------------------
  {
    id: "ud-1",
    category: "unit_digits",
    prompt: "What is the unit digit of 7^95?",
    options: ["3", "7", "9", "1"],
    correct: "3",
    explanation: "Cyclicity of 7 is 4: [7, 9, 3, 1]. 95 mod 4 = 3 (remainder 3). 3rd power of 7 ends in 3.",
  },
  {
    id: "ud-2",
    category: "unit_digits",
    prompt: "What is the unit digit of 3^40?",
    options: ["1", "3", "9", "7"],
    correct: "1",
    explanation: "Cyclicity of 3 is 4: [3, 9, 7, 1]. 40 mod 4 = 0 (perfect multiple of 4) → 4th power ends in 1.",
  },
  {
    id: "ud-3",
    category: "unit_digits",
    prompt: "What is the unit digit of (2^34 × 3^45)?",
    options: ["2", "4", "6", "8"],
    correct: "2",
    explanation: "2^34 → 34 mod 4 = 2 → 2^2=4. 3^45 → 45 mod 4 = 1 → 3^1=3. Unit digit = 4 × 3 = 12 → 2.",
  },
  {
    id: "ud-4",
    category: "unit_digits",
    prompt: "What is the unit digit of (4^73 + 9^84)?",
    options: ["5", "3", "7", "9"],
    correct: "5",
    explanation: "4^odd ends in 4. 9^even ends in 1. Unit digit = 4 + 1 = 5.",
  },
  {
    id: "ud-5",
    category: "unit_digits",
    prompt: "What is the unit digit of (8^67 - 3^53)?",
    options: ["9", "1", "7", "3"],
    correct: "9",
    explanation: "8^67 → 67 mod 4 = 3 → 8^3 ends in 2. 3^53 → 53 mod 4 = 1 → 3^1 ends in 3. (12 - 3) = 9.",
  },

  // --------------------------------------------------------------------------
  // 3. DIVISIBILITY RULES & DIGITAL SUM
  // --------------------------------------------------------------------------
  {
    id: "div-1",
    category: "divisibility",
    prompt: "Which of the following numbers is divisible by 11?",
    options: ["1331", "1341", "1351", "1321"],
    correct: "1331",
    explanation: "Divisibility by 11: Alternating sum (1 + 3) - (3 + 1) = 0. Divisible by 11.",
  },
  {
    id: "div-2",
    category: "divisibility",
    prompt: "If 435x2 is divisible by 9, what is the value of digit x?",
    options: ["4", "5", "6", "3"],
    correct: "4",
    explanation: "Sum of digits must be a multiple of 9: 4 + 3 + 5 + x + 2 = 14 + x. Next multiple of 9 is 18 → x = 4.",
  },
  {
    id: "div-3",
    category: "divisibility",
    prompt: "Which of the following numbers is divisible by 7?",
    options: ["2023", "2024", "2025", "2022"],
    correct: "2023",
    explanation: "2023 = 7 × 289 (Exact divisor). Or osculator test: 202 - (3 × 2) = 196 = 7 × 28.",
  },
  {
    id: "div-4",
    category: "divisibility",
    prompt: "How many numbers between 100 and 300 are divisible by both 4 and 6?",
    options: ["16", "17", "18", "15"],
    correct: "16",
    explanation: "LCM(4, 6) = 12. Smallest multiple > 100 is 108; largest < 300 is 288. Count = (288 - 108)/12 + 1 = 180/12 + 1 = 16.",
  },

  // --------------------------------------------------------------------------
  // 4. REMAINDER THEOREMS & ALGEBRAIC IDENTITIES
  // --------------------------------------------------------------------------
  {
    id: "rem-1",
    category: "remainders",
    prompt: "What is the remainder when (17^23 + 23^23) is divided by 40?",
    options: ["0", "1", "17", "23"],
    correct: "0",
    explanation: "For odd power n, (a^n + b^n) is divisible by (a + b). 17 + 23 = 40. Remainder = 0.",
  },
  {
    id: "rem-2",
    category: "remainders",
    prompt: "What is the remainder when 2^31 is divided by 5?",
    options: ["3", "1", "2", "4"],
    correct: "3",
    explanation: "2^4 ≡ 1 (mod 5). 2^31 = (2^4)^7 × 2^3 = 1 × 8 ≡ 3 (mod 5).",
  },
  {
    id: "rem-3",
    category: "remainders",
    prompt: "What is the remainder when (67^67 + 67) is divided by 68?",
    options: ["66", "1", "67", "0"],
    correct: "66",
    explanation: "67 ≡ -1 (mod 68). (-1)^67 + 67 = -1 + 67 = 66.",
  },
  {
    id: "rem-4",
    category: "remainders",
    prompt: "A number when successively divided by 4 and 5 leaves remainders 1 and 4. What is the remainder when divided by 20?",
    options: ["17", "9", "13", "19"],
    correct: "17",
    explanation: "N = 4 × (5k + 4) + 1 = 20k + 16 + 1 = 20k + 17. Remainder mod 20 = 17.",
  },

  // --------------------------------------------------------------------------
  // 5. RAPID SQUARES & VEDIC MULTIPLICATION
  // --------------------------------------------------------------------------
  {
    id: "sq-1",
    category: "squares",
    prompt: "What is the square of 105?",
    options: ["11025", "10525", "11225", "10025"],
    correct: "11025",
    explanation: "Numbers ending in 5: (10 × 11) & (25) = 11025.",
  },
  {
    id: "sq-2",
    category: "squares",
    prompt: "What is the square of 96 using Base-100 shortcut?",
    options: ["9216", "9416", "9116", "9316"],
    correct: "9216",
    explanation: "96 is (100 - 4). (96 - 4) = 92; (-4)^2 = 16 → 9216.",
  },
  {
    id: "sq-3",
    category: "squares",
    prompt: "What is the square of 65?",
    options: ["4225", "4025", "4125", "4325"],
    correct: "4225",
    explanation: "Numbers ending in 5: (6 × 7) & (25) = 4225.",
  },
  {
    id: "sq-4",
    category: "squares",
    prompt: "What is the value of 103 × 107 using Base-100 Vedic multiplication?",
    options: ["11021", "11031", "10921", "11121"],
    correct: "11021",
    explanation: "103 (+3) and 107 (+7). (103 + 7) = 110; (3 × 7) = 21 → 11021.",
  }
];

interface SpeedMathHistory {
  id?: number | string;
  score: number;
  total: number;
  accuracy: number;
  completedAt: string;
}

export default function CSATSpeedMathTrainer() {
  const [selectedCategory, setSelectedCategory] = useState<DrillCategory>("all");
  const [drillIndex, setDrillIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<SpeedMathHistory[]>([]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const filteredDrills = useMemo(() => {
    if (selectedCategory === "all") return MATH_DRILLS;
    return MATH_DRILLS.filter((d) => d.category === selectedCategory);
  }, [selectedCategory]);

  const currentQ = filteredDrills[drillIndex % filteredDrills.length] || MATH_DRILLS[0];

  // Load history from Dexie
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const records = await dexieDb.test_results
          .where("subject")
          .equals("CSAT_SPEED_MATH")
          .reverse()
          .limit(5)
          .toArray();

        setHistory(
          records.map((r) => ({
            id: r.id,
            score: r.score,
            total: r.total || 0,
            accuracy: r.accuracy || 0,
            completedAt: r.completed_at || r.createdAt || new Date().toISOString(),
          }))
        );
      } catch {}
    };
    void loadHistory();
  }, []);

  // Save session upon timer expiry
  const saveSession = useCallback(
    async (finalScore: number, finalTotal: number) => {
      if (finalTotal === 0) return;
      const acc = Math.round((finalScore / finalTotal) * 100);
      const now = new Date().toISOString();

      try {
        await mutateWithOutbox({
          entityType: "test_results",
          action: "INSERT",
          entityId: Date.now(),
          data: {
            title: "CSAT Speed Math Blitz",
            subject: "CSAT_SPEED_MATH",
            score: finalScore,
            total: finalTotal,
            correct: finalScore,
            wrong: finalTotal - finalScore,
            accuracy: acc,
            completed_at: now,
            createdAt: now,
            userId: "local-cadet",
          },
        });

        setLastSaved(`Saved! ${finalScore}/${finalTotal} (${acc}% accuracy)`);
        sound.playVictory();
      } catch (err) {
        console.warn("Could not save speed math session:", err);
      }
    },
    []
  );

  // Timer Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timerSeconds === 0) {
      setIsRunning(false);
      void saveSession(score, totalAnswered);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds, score, totalAnswered, saveSession]);

  const handleStart = () => {
    sound.playWarp();
    setScore(0);
    setTotalAnswered(0);
    setStreak(0);
    setTimerSeconds(60);
    setIsRunning(true);
    setSelectedOption(null);
    setDrillIndex(0);
    setLastSaved(null);
  };

  const handleAnswer = (opt: string) => {
    if (selectedOption !== null) return; // Prevent double taps

    setSelectedOption(opt);
    setTotalAnswered((prev) => prev + 1);

    const isCorrect = opt === currentQ.correct;
    if (isCorrect) {
      sound.playLock();
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      sound.playWrong();
      setStreak(0);
    }

    setTimeout(() => {
      setSelectedOption(null);
      setDrillIndex((prev) => prev + 1);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl backdrop-blur-xl">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#D8A63A]/20 font-black text-[#F4C95D] text-xs">
              ⚡
            </span>
            <h2 className="font-mono text-base font-black text-white sm:text-lg">
              CSAT Speed Math & Formula Blitz
            </h2>
          </div>
          <p className="text-xs text-[#8C8C8C] mt-0.5">
            Rapid calculation drills to boost mental arithmetic speed and eliminate calculator dependence
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-xs">
            <span className="text-[#8C8C8C]">TIME:</span>
            <span
              className={`font-black ${
                timerSeconds <= 10 ? "text-red-400 animate-pulse" : "text-[#F4C95D]"
              }`}
            >
              {timerSeconds}s
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-xs">
            <span className="text-[#8C8C8C]">SCORE:</span>
            <span className="font-black text-emerald-400">
              {score}/{totalAnswered}
            </span>
          </div>

          {streak >= 3 && (
            <div className="flex items-center gap-1 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 animate-bounce">
              🔥 {streak} STREAK
            </div>
          )}

          {!isRunning ? (
            <button
              onClick={handleStart}
              className="rounded-2xl bg-gradient-to-r from-[#D8A63A] to-[#B38322] px-5 py-2 text-xs font-black text-black shadow-lg transition hover:scale-105 active:scale-95"
            >
              Start 60s Sprint →
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(false)}
              className="rounded-2xl border border-red-500/40 bg-red-500/20 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-500/30"
            >
              Pause
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY FILTER CHIPS */}
      <div className="flex flex-wrap gap-2 text-xs font-mono">
        {[
          { id: "all", label: "All Categories" },
          { id: "percentages", label: "Percentages & Fractions" },
          { id: "unit_digits", label: "Unit Digits & Cycles" },
          { id: "divisibility", label: "Divisibility Rules" },
          { id: "remainders", label: "Remainder Theorems" },
          { id: "squares", label: "Rapid Squares & Vedic" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id as DrillCategory);
              setDrillIndex(0);
              sound.playClick();
            }}
            className={`rounded-xl px-3 py-1.5 font-bold transition ${
              selectedCategory === cat.id
                ? "bg-[#D8A63A] text-black shadow-md"
                : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ACTIVE QUESTION ARENA */}
      <div className="flex flex-col items-center justify-center rounded-3xl border border-[#D8A63A]/20 bg-gradient-to-b from-[#120f06] to-[#080808] p-8 text-center shadow-xl">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#F4C95D]">
          Drill #{drillIndex + 1} • {currentQ.category.toUpperCase()}
        </span>
        <h3 className="mt-3 text-lg sm:text-2xl font-black text-white max-w-2xl leading-snug font-mono">
          {currentQ.prompt}
        </h3>

        {/* 4 ANSWER OPTIONS */}
        <div className="mt-6 grid w-full max-w-lg grid-cols-2 gap-3">
          {currentQ.options.map((opt) => {
            let btnStyle = "border-white/10 bg-black/60 text-white/90 hover:border-[#D8A63A] hover:bg-black/90";
            if (selectedOption !== null) {
              if (opt === currentQ.correct) {
                btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]";
              } else if (opt === selectedOption && opt !== currentQ.correct) {
                btnStyle = "border-red-500 bg-red-500/20 text-red-300 font-bold";
              } else {
                btnStyle = "border-white/5 bg-black/20 text-white/30";
              }
            }

            return (
              <button
                key={opt}
                disabled={!isRunning || selectedOption !== null}
                onClick={() => handleAnswer(opt)}
                className={`rounded-2xl border p-4 font-mono text-sm sm:text-base font-bold transition-all duration-150 active:scale-95 disabled:cursor-not-allowed ${btnStyle}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* STEP-BY-STEP EXPLANATION */}
        {selectedOption !== null && (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/60 p-3 text-xs font-mono text-white/80 max-w-lg text-left">
            <span className="font-bold text-[#F4C95D]">💡 Solution: </span>
            {currentQ.explanation}
          </div>
        )}

        {lastSaved && (
          <p className="mt-3 font-mono text-xs font-bold text-emerald-400 animate-pulse">
            ✓ {lastSaved}
          </p>
        )}
      </div>

      {/* RECENT SPEED DRILL TELEMETRY */}
      {history.length > 0 && (
        <div className="border-t border-white/10 pt-4">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
            Recent Speed Sprint Telemetry (Dexie Local Outbox)
          </h4>
          <div className="grid gap-2 sm:grid-cols-3 text-xs font-mono">
            {history.map((h, i) => (
              <div
                key={h.id || i}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5"
              >
                <span className="text-white/80">
                  {h.score}/{h.total} correct
                </span>
                <span className="font-bold text-emerald-400">{h.accuracy}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
