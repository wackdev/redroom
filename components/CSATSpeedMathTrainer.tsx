"use client";

import { useEffect, useState, useCallback } from "react";
import { sound } from "@/lib/audio/sound-engine";
import { mutateWithOutbox } from "@/lib/db/dexie";
import { dexieDb } from "@/lib/db/dexie";

interface SpeedMathQuestion {
  prompt: string;
  options: string[];
  correct: string;
  explanation: string;
}

const MATH_DRILLS: SpeedMathQuestion[] = [
  {
    prompt: "Convert fraction 1/7 to percentage:",
    options: ["14.28%", "12.5%", "16.66%", "11.11%"],
    correct: "14.28%",
    explanation: "1/7 = 14.28% (or 14 2/7%). Notice that 2/7 = 28.57%, 4/7 = 57.14%.",
  },
  {
    prompt: "Convert fraction 3/8 to percentage:",
    options: ["37.5%", "33.33%", "36.25%", "42.5%"],
    correct: "37.5%",
    explanation: "1/8 = 12.5% → 3/8 = 3 * 12.5% = 37.5%.",
  },
  {
    prompt: "What is the unit digit of 7^95?",
    options: ["3", "7", "9", "1"],
    correct: "3",
    explanation: "Cyclicity of 7 is 4: [7, 9, 3, 1]. 95 mod 4 = 3 (remainder 3). 3rd power of 7 ends in 3.",
  },
  {
    prompt: "What is the unit digit of 3^40?",
    options: ["1", "3", "9", "7"],
    correct: "1",
    explanation: "Cyclicity of 3 is 4: [3, 9, 7, 1]. 40 mod 4 = 0 (perfect multiple of 4) → 4th cycle ends in 1.",
  },
  {
    prompt: "Which of the following is divisible by 11?",
    options: ["1331", "1341", "1351", "1321"],
    correct: "1331",
    explanation: "Divisibility by 11: Alternating sum (1+3) - (3+1) = 0. Divisible by 11.",
  },
  {
    prompt: "What is the remainder when (17^23 + 23^23) is divided by 40?",
    options: ["0", "1", "17", "23"],
    correct: "0",
    explanation: "For odd power n, (a^n + b^n) is divisible by (a + b). 17 + 23 = 40. Remainder = 0.",
  },
  {
    prompt: "Convert fraction 5/6 to percentage:",
    options: ["83.33%", "80%", "85.5%", "87.5%"],
    correct: "83.33%",
    explanation: "1 - 1/6 = 100% - 16.66% = 83.33%.",
  },
  {
    prompt: "What is the unit digit of (2^34 × 3^45)?",
    options: ["2", "4", "6", "8"],
    correct: "2",
    explanation: "2^34 → 34 mod 4 = 2 → 2^2=4. 3^45 → 45 mod 4 = 1 → 3^1=3. Unit digit = 4 × 3 = 12 → 2.",
  },
  {
    prompt: "What is the square of 105?",
    options: ["11025", "10525", "11225", "10025"],
    correct: "11025",
    explanation: "Numbers ending in 5: (10 × 11) & (25) = 11025.",
  },
  {
    prompt: "What is the remainder when 2^31 is divided by 5?",
    options: ["3", "1", "2", "4"],
    correct: "3",
    explanation: "2^4 ≡ 1 (mod 5). 2^31 = (2^4)^7 × 2^3 = 1 × 8 ≡ 3 (mod 5).",
  },
];

interface SpeedMathHistory {
  id?: number | string;
  score: number;
  total: number;
  accuracy: number;
  completedAt: string;
}

export default function CSATSpeedMathTrainer() {
  const [drillIndex, setDrillIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<SpeedMathHistory[]>([]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const currentQ = MATH_DRILLS[drillIndex % MATH_DRILLS.length];

  // Load history from Dexie on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const results = await dexieDb.test_results
          .where("subject")
          .equals("CSAT Speed Math")
          .reverse()
          .limit(5)
          .toArray();

        setHistory(
          results.map((r) => ({
            id: r.id,
            score: r.score,
            total: r.total_questions || r.total || 0,
            accuracy: r.accuracy || 0,
            completedAt: r.completed_at || r.createdAt || r.date || new Date().toISOString(),
          }))
        );
      } catch {}
    };
    void loadHistory();
  }, [lastSaved]);

  const saveSprintResult = useCallback(async (finalScore: number, finalTotal: number) => {
    try {
      const accuracy = finalTotal > 0 ? Math.round((finalScore / finalTotal) * 100) : 0;
      const now = new Date().toISOString();
      const testResult = {
        title: "CSAT 60s Speed Sprint",
        test_title: "CSAT 60s Speed Sprint",
        subject: "CSAT Speed Math",
        score: finalScore,
        total: finalTotal,
        total_questions: finalTotal,
        attempted: finalTotal,
        skipped: 0,
        correct: finalScore,
        wrong: Math.max(0, finalTotal - finalScore),
        accuracy,
        date: now,
        completed_at: now,
        createdAt: now,
        time_spent_seconds: 60,
        userId: "local-cadet",
      };

      await mutateWithOutbox({
        entityType: "test_results",
        action: "INSERT",
        entityId: Date.now(),
        data: testResult,
      });

      setLastSaved(now);
    } catch (err) {
      console.warn("Failed to persist speed math result:", err);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((t) => {
          if (t <= 1) {
            setIsRunning(false);
            sound.playVictory();
            void saveSprintResult(score, totalAnswered);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds, score, totalAnswered, saveSprintResult]);

  const handleStart = () => {
    setScore(0);
    setTotalAnswered(0);
    setTimerSeconds(60);
    setDrillIndex(Math.floor(Math.random() * MATH_DRILLS.length));
    setSelectedOption(null);
    setIsRunning(true);
    sound.playWarp();
  };

  const handleChoose = (opt: string) => {
    if (selectedOption || !isRunning) return;
    setSelectedOption(opt);
    setTotalAnswered((t) => t + 1);

    if (opt === currentQ.correct) {
      setScore((s) => s + 1);
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    setTimeout(() => {
      setSelectedOption(null);
      setDrillIndex((i) => i + 1);
    }, 900);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl backdrop-blur-xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#D8A63A] animate-pulse" />
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#D8A63A]">
              CSAT QUANT SPEED ACCELERATOR // 60-SEC DRILL
            </span>
          </div>
          <h3 className="mt-1 font-mono text-base font-bold text-white">
            Rapid Mental Math & Cyclicity Trainer
          </h3>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="rounded-xl border border-white/10 bg-black/60 px-3.5 py-1.5">
            ⏱️ <strong className="text-white">{timerSeconds}s</strong>
          </div>
          <div className="rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3.5 py-1.5 text-[#F4C95D]">
            Score: <strong className="text-white">{score}</strong> / {totalAnswered}
          </div>
          {!isRunning && (
            <button
              onClick={handleStart}
              className="rounded-xl bg-[#D8A63A] px-4 py-1.5 font-bold text-black hover:bg-[#F4C95D] transition shadow"
            >
              🚀 {timerSeconds === 0 ? "Drill Again" : "Start 60s Drill"}
            </button>
          )}
        </div>
      </div>

      {/* Drill Arena */}
      <div className="mt-6">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center">
          <span className="font-mono text-xs text-[#8C8C8C]">
            Question {(drillIndex % MATH_DRILLS.length) + 1} of {MATH_DRILLS.length}
          </span>
          <h4 className="mt-3 font-mono text-lg font-bold text-white">{currentQ.prompt}</h4>

          {/* Options Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 max-w-md mx-auto">
            {currentQ.options.map((opt) => {
              const isChosen = selectedOption === opt;
              const isRight = opt === currentQ.correct;

              let style = "border-white/10 bg-white/5 text-white hover:bg-white/10";
              if (selectedOption) {
                if (isRight) {
                  style = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold";
                } else if (isChosen && !isRight) {
                  style = "border-red-500 bg-red-500/20 text-red-300";
                }
              }

              return (
                <button
                  key={opt}
                  disabled={!isRunning || Boolean(selectedOption)}
                  onClick={() => handleChoose(opt)}
                  className={`rounded-2xl border py-3 font-mono text-sm transition ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selectedOption && (
            <div className="mt-4 rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-[#F4C95D] font-mono animate-fadeIn">
              💡 {currentQ.explanation}
            </div>
          )}
        </div>

        {/* Sprint Attempts History Ledger */}
        {history.length > 0 && !isRunning && (
          <div className="mt-4 border-t border-white/5 pt-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#8C8C8C] mb-2">
              <span>📊 RECENT SPRINT ATTEMPTS</span>
              <span className="text-[#D8A63A]">Synced to Outbox</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {history.map((h, idx) => (
                <div key={h.id || idx} className="rounded-xl border border-white/5 bg-white/[0.02] p-2 text-center font-mono">
                  <div className="text-[11px] text-[#F4C95D] font-bold">{h.score}/{h.total} correct</div>
                  <div className="text-[10px] text-[#8C8C8C]">{h.accuracy}% acc</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
