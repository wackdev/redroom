"use client";

import { useEffect, useState } from "react";
import { sound } from "@/lib/audio/sound-engine";
import { safeArray } from "@/lib/core/utils";

export default function FutureYouSimulator() {
  const [trajectory, setTrajectory] = useState<"continue" | "stop">("continue");
  const [prepDays, setPrepDays] = useState<number>(60);
  const [currentScore, setCurrentScore] = useState<number>(95);

  useEffect(() => {
    try {
      const tests = localStorage.getItem("redroom_test_results");
      if (tests) {
        const parsed = safeArray(JSON.parse(tests));
        if (parsed.length > 0) {
          const avg = parsed.reduce((acc: number, t: any) => acc + (t.score || 0), 0) / parsed.length;
          setCurrentScore(Math.round(avg * 5)); // scaled to prelims 200 marks estimate
        }
      }
    } catch {}
  }, []);

  const continueMetrics = {
    estimatedPrelimsScore: Math.min(135, currentScore + 28),
    syllabusRetention: "88%",
    eliminationAccuracy: "84%",
    revisionBacklog: "0 Topics Due",
    readinessStatus: "PEAK COMPETITIVE EDGE",
    dailyCommitment: "3 hrs focused deep work",
  };

  const stopMetrics = {
    estimatedPrelimsScore: Math.max(55, currentScore - 35),
    syllabusRetention: "42%",
    eliminationAccuracy: "48%",
    revisionBacklog: "45+ Topics at Risk",
    readinessStatus: "HIGH REVISION DECAY",
    dailyCommitment: "Inconsistent / Procrastinated",
  };

  const active = trajectory === "continue" ? continueMetrics : stopMetrics;

  return (
    <div className="flex flex-col rounded-3xl border border-[#D8A63A]/30 bg-[#0d0d0d] p-6 backdrop-blur-xl shadow-2xl font-mono">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase text-[#F4C95D] tracking-widest">
            FUTURE YOU TRAJECTORY SIMULATOR
          </span>
          <h2 className="mt-1 text-xl sm:text-2xl font-black text-white">
            WHY NOT THE FUTURE YOU?
          </h2>
          <p className="text-xs text-[#8C8C8C] font-sans">
            Simulate your UPSC CSE readiness over the next {prepDays} days based on daily consistency.
          </p>
        </div>

        {/* TRAJECTORY TOGGLE */}
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 p-1.5">
          <button
            onClick={() => {
              sound.playLock();
              setTrajectory("continue");
            }}
            data-cursor="TRAJECTORY"
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              trajectory === "continue"
                ? "bg-[#D8A63A] text-black font-black shadow-[0_0_15px_rgba(216,166,58,0.4)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            🔥 IF YOU CONTINUE
          </button>
          <button
            onClick={() => {
              sound.playHover();
              setTrajectory("stop");
            }}
            data-cursor="TRAJECTORY"
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              trajectory === "stop"
                ? "bg-red-500/20 border border-red-500/40 text-red-300 font-bold"
                : "text-white/60 hover:text-white"
            }`}
          >
            ⚠️ IF YOU STOP CONSISTENCY
          </button>
        </div>
      </div>

      {/* COMPARATIVE TELEMETRY RADAR */}
      <div className="my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <span className="text-[10px] text-[#8C8C8C]">ESTIMATED PRELIMS SCORE</span>
          <p
            className={`mt-1 text-2xl font-black ${
              trajectory === "continue" ? "text-[#F4C95D]" : "text-red-400"
            }`}
          >
            {active.estimatedPrelimsScore} / 200
          </p>
          <span className="text-[10px] text-white/40">Cutoff benchmark: ~90-95</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <span className="text-[10px] text-[#8C8C8C]">SYLLABUS RETENTION</span>
          <p
            className={`mt-1 text-2xl font-black ${
              trajectory === "continue" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {active.syllabusRetention}
          </p>
          <span className="text-[10px] text-white/40">Active recall strength</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <span className="text-[10px] text-[#8C8C8C]">ELIMINATION ACCURACY</span>
          <p
            className={`mt-1 text-2xl font-black ${
              trajectory === "continue" ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {active.eliminationAccuracy}
          </p>
          <span className="text-[10px] text-white/40">UPSC statement trap radar</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <span className="text-[10px] text-[#8C8C8C]">REVISION HEALTH</span>
          <p
            className={`mt-1 text-base font-black ${
              trajectory === "continue" ? "text-[#F4C95D]" : "text-red-400"
            }`}
          >
            {active.revisionBacklog}
          </p>
          <span className="text-[10px] text-white/40">{active.readinessStatus}</span>
        </div>
      </div>

      {/* CORE PHILOSOPHY SUMMARY */}
      <div className="rounded-2xl border border-[#D8A63A]/20 bg-[#D8A63A]/5 p-4 text-center">
        <p className="text-xs text-white/70 font-sans">
          {trajectory === "continue"
            ? "60 days of persistent active recall and daily PYQ elimination compound into insurmountable rank security."
            : "Without spaced revision intervals, memory decay reduces retention by 50% within 14 days."}
        </p>
        <h3 className="mt-2 text-sm sm:text-base font-black text-[#F4C95D] uppercase tracking-wider">
          THE DIFFERENCE IS WHAT YOU DO TODAY.
        </h3>
      </div>
    </div>
  );
}
