"use client";

import { useEffect, useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

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
    explanation: "Divisibility by 11 rule: Difference of alternating sum of digits (1+3) - (3+1) = 4 - 4 = 0. Divisible by 11.",
  },
];

export default function CSATSpeedMathTrainer() {
  const [drillIndex, setDrillIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  const currentQ = MATH_DRILLS[drillIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((t) => {
          if (t <= 1) {
            setIsRunning(false);
            sound.playVictory();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const handleStart = () => {
    setScore(0);
    setTimerSeconds(60);
    setDrillIndex(0);
    setSelectedOption(null);
    setIsRunning(true);
    sound.playWarp();
  };

  const handleChoose = (opt: string) => {
    if (selectedOption || !isRunning) return;
    setSelectedOption(opt);

    if (opt === currentQ.correct) {
      setScore((s) => s + 1);
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (drillIndex < MATH_DRILLS.length - 1) {
        setDrillIndex((i) => i + 1);
      } else {
        setDrillIndex(0);
      }
    }, 1200);
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
            Score: <strong className="text-white">{score}</strong>
          </div>
          {!isRunning && (
            <button
              onClick={handleStart}
              className="rounded-xl bg-[#D8A63A] px-4 py-1.5 font-bold text-black hover:bg-[#F4C95D] transition shadow"
            >
              🚀 Start 60s Drill
            </button>
          )}
        </div>
      </div>

      {/* Drill Arena */}
      <div className="mt-6">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center">
          <span className="font-mono text-xs text-[#8C8C8C]">
            Question {drillIndex + 1} of {MATH_DRILLS.length}
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
      </div>
    </div>
  );
}
