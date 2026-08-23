"use client";

import { useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

const EXTREME_MODIFIERS = [
  "always",
  "never",
  "only",
  "solely",
  "completely",
  "all",
  "none",
  "strictly",
  "impossible",
  "inevitably",
  "universally",
  "drastically",
  "exclusively",
];

export default function PrelimsEliminationLab() {
  const [statementText, setStatementText] = useState(
    "All species of fungi are solely found in tropical rainforests and can never survive in sub-zero alpine conditions."
  );
  const [eliminatedCount, setEliminatedCount] = useState<number>(2); // 0, 1, or 2

  // Highlight Extreme Words in Statement
  const words = statementText.split(/\s+/);
  const detectedExtremeWords = words.filter((w) =>
    EXTREME_MODIFIERS.includes(w.toLowerCase().replace(/[^a-z]/g, ""))
  );

  // Expected Value Calculation
  // Correct = +2.0, Wrong = -0.667
  const optionsRemaining = 4 - eliminatedCount;
  const successProbability = 1 / optionsRemaining;
  const expectedValue = +(
    successProbability * 2.0 -
    (1 - successProbability) * 0.667
  ).toFixed(2);

  const getRecommendation = () => {
    if (eliminatedCount === 2) {
      return {
        text: "⚡ MANDATORY ATTEMPT — Positive Expected Yield (+0.67). Statistical certainty over 100 questions gives +67 Marks net.",
        color: "text-emerald-400",
        badge: "MUST ATTEMPT",
      };
    }
    if (eliminatedCount === 1) {
      return {
        text: "🎯 PRUDENT ATTEMPT — Positive Expected Yield (+0.22). Attempt if total attempts are below 80.",
        color: "text-amber-300",
        badge: "CALCULATED GUESS",
      };
    }
    return {
      text: "⚠️ HIGH RISK — Zero Expected Yield (+0.00). Extreme danger of negative penalty attrition.",
      color: "text-red-400",
      badge: "LEAVE QUESTION",
    };
  };

  const rec = getRecommendation();

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#D8A63A] animate-pulse" />
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#D8A63A]">
            TACTICAL RADAR // PRELIMS ELIMINATION LAB
          </span>
        </div>
        <h3 className="mt-1 font-mono text-lg font-bold text-white">
          Elimination Matrix & 50:50 Probability Engine
        </h3>
        <p className="text-xs text-[#8C8C8C]">
          Master mathematical elimination probabilities and detect traps set by UPSC examiners.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 1. EXTREME WORD SCANNER */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold text-[#F4C95D] uppercase">
              1. Extreme Modifier Scanner
            </span>
            <span className="rounded-full bg-red-500/20 px-2 py-0.5 font-mono text-[10px] font-black text-red-300">
              {detectedExtremeWords.length} Traps Detected
            </span>
          </div>

          <textarea
            value={statementText}
            onChange={(e) => setStatementText(e.target.value)}
            rows={3}
            placeholder="Paste any UPSC Prelims statement to scan for trap keywords..."
            className="w-full rounded-xl border border-white/10 bg-black/60 p-3 font-sans text-xs text-white focus:border-[#D8A63A] focus:outline-none"
          />

          {/* Highlighted Preview */}
          <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs leading-relaxed text-white/90 font-sans">
            {words.map((w, i) => {
              const clean = w.toLowerCase().replace(/[^a-z]/g, "");
              const isExtreme = EXTREME_MODIFIERS.includes(clean);
              return (
                <span
                  key={i}
                  className={
                    isExtreme
                      ? "mx-0.5 rounded bg-red-500/30 px-1 py-0.5 font-bold text-red-300 underline"
                      : ""
                  }
                >
                  {w}{" "}
                </span>
              );
            })}
          </div>

          <p className="mt-2 text-[11px] text-[#8C8C8C]">
            💡 <em>Rule of Thumb:</em> Statements containing absolute terms (*solely, never, always*) are statistically incorrect in 85%+ of UPSC Prelims questions.
          </p>
        </div>

        {/* 2. RISK-REWARD EXPECTED VALUE CALCULATOR */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold text-[#F4C95D] uppercase">
              2. 50:50 Expected Yield Calculator
            </span>
            <span className={`font-mono text-[10px] font-black uppercase ${rec.color}`}>
              {rec.badge}
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[#8C8C8C] block mb-1">Options Confidently Eliminated:</label>
              <div className="flex gap-2">
                {[0, 1, 2].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => {
                      setEliminatedCount(cnt);
                      sound.playLock();
                    }}
                    className={`flex-1 rounded-xl py-2 font-bold transition border ${
                      eliminatedCount === cnt
                        ? "border-[#D8A63A] bg-[#D8A63A] text-black shadow-lg"
                        : "border-white/10 bg-white/5 text-[#8C8C8C] hover:text-white"
                    }`}
                  >
                    {cnt === 2 ? "2 Options (50:50)" : cnt === 1 ? "1 Option (33%)" : "0 (Blind Guess)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Expected Yield Output Box */}
            <div className="rounded-xl border border-white/10 bg-black/60 p-3.5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#8C8C8C]">Expected Value (EV per Q):</span>
                <strong className={`text-base ${rec.color}`}>
                  {expectedValue > 0 ? `+${expectedValue}` : expectedValue} Marks
                </strong>
              </div>
              <div className="flex justify-between text-[11px] text-[#8C8C8C]">
                <span>Success Probability:</span>
                <span className="text-white font-bold">{Math.round(successProbability * 100)}%</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-[11px] font-sans">
              <p className={rec.color}>{rec.text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
