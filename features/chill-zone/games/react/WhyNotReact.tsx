"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { submitGameScore } from "../../services/score-service";
import { sound } from "@/lib/audio/sound-engine";

interface WhyNotReactProps {
  onBack: () => void;
  onFinish?: () => void;
}

type GamePhase = "intro" | "waiting" | "ready" | "early" | "round_result" | "complete";

const TOTAL_ROUNDS = 5;

export default function WhyNotReact({ onBack, onFinish }: WhyNotReactProps) {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [currentRound, setCurrentRound] = useState(1);
  const [roundTimes, setRoundTimes] = useState<number[]>([]);
  const [currentReactionTime, setCurrentReactionTime] = useState<number | null>(null);
  const [isNewPb, setIsNewPb] = useState(false);

  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const sessionStartRef = useRef<number>(0);

  const cleanupTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => cleanupTimer();
  }, []);

  const startRound = useCallback(() => {
    cleanupTimer();
    setPhase("waiting");
    setCurrentReactionTime(null);

    // Random delay between 1.6s and 4.2s
    const delay = Math.floor(1600 + Math.random() * 2600);
    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setPhase("ready");
      sound.playWarp();
    }, delay);
  }, []);

  const handlePointerDown = () => {
    if (phase === "intro") {
      sessionStartRef.current = Date.now();
      setRoundTimes([]);
      setCurrentRound(1);
      startRound();
      return;
    }

    if (phase === "waiting") {
      // FALSE START!
      cleanupTimer();
      sound.playWrong();
      setPhase("early");
      return;
    }

    if (phase === "ready") {
      const reactionTime = Math.round(performance.now() - startTimeRef.current);
      sound.playCorrect();
      setCurrentReactionTime(reactionTime);
      const updatedTimes = [...roundTimes, reactionTime];
      setRoundTimes(updatedTimes);

      if (currentRound >= TOTAL_ROUNDS) {
        // Complete game
        const avg = Math.round(updatedTimes.reduce((a, b) => a + b, 0) / updatedTimes.length);
        const duration = Date.now() - sessionStartRef.current;
        submitGameScore({
          gameSlug: "react",
          score: avg,
          durationMs: duration,
          metadata: { roundTimes: updatedTimes },
        }).then((res) => {
          if (res.isPersonalBest) {
            setIsNewPb(true);
            sound.playVictory();
          }
        });
        setPhase("complete");
      } else {
        setPhase("round_result");
      }
      return;
    }

    if (phase === "early") {
      startRound();
      return;
    }

    if (phase === "round_result") {
      setCurrentRound((prev) => prev + 1);
      startRound();
      return;
    }

    if (phase === "complete") {
      setRoundTimes([]);
      setCurrentRound(1);
      setIsNewPb(false);
      startRound();
    }
  };

  const calculateAverage = () => {
    if (roundTimes.length === 0) return 0;
    return Math.round(roundTimes.reduce((a, b) => a + b, 0) / roundTimes.length);
  };

  return (
    <div className="relative flex min-h-[580px] w-full flex-col items-center justify-between rounded-3xl border border-white/10 bg-[#070707] p-6 text-white select-none overflow-hidden sm:p-8">
      {/* Top HUD */}
      <div className="flex w-full items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition"
        >
          ← EXIT PORTAL
        </button>

        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-[#8C8C8C]">
            ROUND: <strong className="text-white">{phase === "intro" ? 0 : Math.min(currentRound, TOTAL_ROUNDS)} / {TOTAL_ROUNDS}</strong>
          </span>
          {roundTimes.length > 0 && (
            <span className="text-[#8C8C8C]">
              AVG: <strong className="text-[#F4C95D]">{calculateAverage()} ms</strong>
            </span>
          )}
        </div>
      </div>

      {/* Interactive Arena Stage */}
      <div
        onPointerDown={handlePointerDown}
        className={`relative my-6 flex h-[340px] w-full max-w-xl cursor-pointer flex-col items-center justify-center rounded-3xl border transition-all duration-150 p-6 text-center ${
          phase === "intro"
            ? "border-white/20 bg-white/[0.03] hover:border-[#D8A63A]/50 hover:bg-[#D8A63A]/5 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
            : phase === "waiting"
            ? "border-red-500/40 bg-red-950/20 shadow-[0_0_50px_rgba(239,68,68,0.15)]"
            : phase === "ready"
            ? "border-[#F4C95D] bg-[#F4C95D]/20 shadow-[0_0_80px_rgba(244,201,93,0.5)] scale-[1.02]"
            : phase === "early"
            ? "border-amber-500/50 bg-amber-950/30 shadow-[0_0_40px_rgba(245,158,11,0.2)]"
            : phase === "round_result"
            ? "border-[#D8A63A]/60 bg-[#D8A63A]/10 shadow-[0_0_40px_rgba(216,166,58,0.25)]"
            : "border-[#F4C95D] bg-[#F4C95D]/10 shadow-[0_0_60px_rgba(244,201,93,0.3)]"
        }`}
      >
        {phase === "intro" && (
          <div className="flex flex-col items-center gap-3">
            <span className="text-5xl">⚡</span>
            <h2 className="font-mono text-2xl font-black tracking-widest text-[#F4C95D] uppercase">
              WHY NOT REACT?
            </h2>
            <p className="max-w-md text-xs text-[#8C8C8C] leading-relaxed">
              When the box turns <strong>Electric Gold</strong>, click as fast as humanly possible. 5 rounds will determine your neural latency.
            </p>
            <div className="mt-4 rounded-xl border border-[#D8A63A] bg-[#D8A63A]/20 px-6 py-2.5 font-mono text-xs font-black text-white shadow-[0_0_20px_rgba(216,166,58,0.4)]">
              TAP OR CLICK TO START
            </div>
          </div>
        )}

        {phase === "waiting" && (
          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 animate-ping rounded-full bg-red-500/20 border border-red-500/50" />
            <h3 className="font-mono text-xl font-black text-red-400 tracking-wider">
              WAIT FOR GOLD...
            </h3>
            <p className="font-mono text-[11px] text-red-300/60 uppercase">
              Do not anticipate the signal
            </p>
          </div>
        )}

        {phase === "ready" && (
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <h2 className="font-mono text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_25px_rgba(244,201,93,0.9)]">
              CLICK NOW!
            </h2>
            <span className="font-mono text-xs font-bold text-[#F4C95D] uppercase tracking-widest">
              TAP THE SCREEN
            </span>
          </div>
        )}

        {phase === "early" && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">⚠️</span>
            <h3 className="font-mono text-2xl font-black text-amber-400">
              TOO EARLY!
            </h3>
            <p className="text-xs text-[#8C8C8C]">
              You clicked before the golden pulse. False start recorded.
            </p>
            <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 font-mono text-xs text-white">
              CLICK TO RETRY ROUND
            </div>
          </div>
        )}

        {phase === "round_result" && (
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#8C8C8C] uppercase">
              ROUND {currentRound} LATENCY
            </span>
            <h2 className="font-mono text-5xl font-black text-[#F4C95D] tracking-tight">
              {currentReactionTime} <span className="text-2xl text-white">ms</span>
            </h2>
            <p className="mt-2 text-xs text-[#8C8C8C]">
              {currentReactionTime && currentReactionTime < 200
                ? "🔥 Incredible reflexive acuity (God tier)"
                : currentReactionTime && currentReactionTime < 240
                ? "⚡ High readiness index (Officer grade)"
                : "Steady baseline focus"}
            </p>
            <div className="mt-4 rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/20 px-5 py-2 font-mono text-xs font-bold text-white">
              CLICK FOR NEXT ROUND
            </div>
          </div>
        )}

        {phase === "complete" && (
          <div className="flex flex-col items-center gap-3">
            {isNewPb && (
              <span className="animate-pulse rounded-full border border-[#F4C95D] bg-[#F4C95D]/20 px-3 py-1 font-mono text-[10px] font-black text-[#F4C95D]">
                🏆 NEW PERSONAL BEST RECORD
              </span>
            )}
            <h3 className="font-mono text-xs font-bold text-[#8C8C8C] uppercase tracking-widest">
              CALIBRATION COMPLETE
            </h3>
            <h2 className="font-mono text-6xl font-black text-white tracking-tighter">
              {calculateAverage()} <span className="text-2xl text-[#F4C95D]">ms</span>
            </h2>
            <div className="flex gap-2">
              {roundTimes.map((t, idx) => (
                <div key={idx} className="flex flex-col items-center rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-mono">
                  <span className="text-[#8C8C8C]">R{idx + 1}</span>
                  <span className="font-bold text-white">{t}ms</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFinish?.();
                  onBack();
                }}
                className="rounded-xl border border-white/20 bg-white/10 px-5 py-2 font-mono text-xs font-bold text-white hover:bg-white/20 transition"
              >
                RETURN TO STUDY
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startRound();
                }}
                className="rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-5 py-2 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_20px_rgba(216,166,58,0.4)]"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Rules Helper */}
      <div className="flex w-full items-center justify-between border-t border-white/10 pt-3 text-[11px] font-mono text-[#8C8C8C]">
        <span>⚡ 5 Rounds · Fast average wins</span>
        <span>Target: Sub-220ms (LBSNAA Reflex Tier)</span>
      </div>
    </div>
  );
}
