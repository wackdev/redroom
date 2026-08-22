"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { submitGameScore } from "../../services/score-service";
import { sound } from "@/lib/audio/sound-engine";

interface BlinkGameProps {
  onBack: () => void;
  onFinish?: () => void;
}

const NODES = [
  { id: 0, label: "ALPHA", color: "#D8A63A", bgClass: "bg-[#D8A63A]", glow: "rgba(216,166,58,0.7)" },
  { id: 1, label: "BETA", color: "#F4C95D", bgClass: "bg-[#F4C95D]", glow: "rgba(244,201,93,0.7)" },
  { id: 2, label: "GAMMA", color: "#E5B94E", bgClass: "bg-[#E5B94E]", glow: "rgba(229,185,78,0.7)" },
  { id: 3, label: "DELTA", color: "#FFFFFF", bgClass: "bg-white", glow: "rgba(255,255,255,0.7)" },
];

export default function BlinkGame({ onBack, onFinish }: BlinkGameProps) {
  const [gameState, setGameState] = useState<"intro" | "showing_sequence" | "player_turn" | "gameover">("intro");
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [isPb, setIsPb] = useState(false);

  const sessionStartRef = useRef<number>(0);
  const isPlayingSeqRef = useRef<boolean>(false);

  const playSequence = useCallback(async (seq: number[]) => {
    setGameState("showing_sequence");
    isPlayingSeqRef.current = true;
    setPlayerInput([]);

    // Speed decreases delay as sequence grows
    const flashDuration = Math.max(220, 480 - seq.length * 20);
    const pauseDuration = Math.max(120, 220 - seq.length * 10);

    for (let i = 0; i < seq.length; i++) {
      await new Promise((r) => setTimeout(r, pauseDuration));
      const nodeId = seq[i];
      setActiveNode(nodeId);
      sound.playClick();
      await new Promise((r) => setTimeout(r, flashDuration));
      setActiveNode(null);
    }

    isPlayingSeqRef.current = false;
    setGameState("player_turn");
  }, []);

  const startNextRound = useCallback((currentSeq: number[]) => {
    const nextNode = Math.floor(Math.random() * 4);
    const newSeq = [...currentSeq, nextNode];
    setSequence(newSeq);
    setTimeout(() => {
      playSequence(newSeq);
    }, 600);
  }, [playSequence]);

  const startGame = () => {
    setGameState("showing_sequence");
    setStreak(0);
    setIsPb(false);
    sessionStartRef.current = Date.now();
    startNextRound([]);
    sound.playWarp();
  };

  const handleNodeClick = (nodeId: number) => {
    if (gameState !== "player_turn" || isPlayingSeqRef.current) return;

    sound.playClick();
    setActiveNode(nodeId);
    setTimeout(() => setActiveNode(null), 180);

    const newInput = [...playerInput, nodeId];
    setPlayerInput(newInput);

    const checkIdx = newInput.length - 1;
    if (newInput[checkIdx] !== sequence[checkIdx]) {
      // Mistake! Game Over
      sound.playWrong();
      setGameState("gameover");
      const duration = Date.now() - sessionStartRef.current;
      submitGameScore({
        gameSlug: "blink",
        score: streak,
        durationMs: duration,
        streak,
      }).then((res) => {
        if (res.isPersonalBest) setIsPb(true);
      });
      return;
    }

    if (newInput.length === sequence.length) {
      // Completed Sequence!
      sound.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      startNextRound(sequence);
    }
  };

  return (
    <div className="relative flex min-h-[580px] w-full flex-col items-center justify-between rounded-3xl border border-white/10 bg-[#070707] p-6 text-white select-none overflow-hidden sm:p-8">
      {/* Top HUD */}
      <div className="flex w-full items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition"
        >
          ← EXIT BLINK
        </button>

        <div className="flex items-center gap-6 font-mono text-xs">
          <span className="text-[#8C8C8C]">
            SEQUENCE LENGTH: <strong className="text-white">{sequence.length}</strong>
          </span>
          <span className="text-[#8C8C8C]">
            CURRENT STREAK: <strong className="text-[#F4C95D] text-sm">🔥 {streak}</strong>
          </span>
        </div>
      </div>

      {/* Main Game Stage */}
      {gameState === "intro" && (
        <div className="my-auto flex w-full max-w-md flex-col items-center gap-4 text-center">
          <span className="text-5xl">👁️</span>
          <h2 className="font-mono text-3xl font-black text-[#F4C95D] uppercase tracking-widest">
            BLINK
          </h2>
          <p className="text-xs text-[#8C8C8C] leading-relaxed">
            Memorize and repeat progressive light and sound sequences. Tests cognitive working memory and executive attention.
          </p>
          <button
            onClick={startGame}
            className="mt-4 rounded-2xl border border-[#D8A63A] bg-[#D8A63A] px-8 py-3.5 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_25px_rgba(216,166,58,0.5)]"
          >
            COMMENCE SEQUENCE
          </button>
        </div>
      )}

      {(gameState === "showing_sequence" || gameState === "player_turn") && (
        <div className="my-auto flex flex-col items-center gap-6">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#8C8C8C]">
            {gameState === "showing_sequence" ? "👀 WATCH THE PATTERN..." : "🎯 YOUR TURN: REPEAT SEQUENCE"}
          </span>

          {/* 2x2 Radial Quadrant Grid */}
          <div className="grid grid-cols-2 gap-4">
            {NODES.map((node) => {
              const isActive = activeNode === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  disabled={gameState === "showing_sequence"}
                  style={{
                    boxShadow: isActive ? `0 0 45px ${node.glow}` : "none",
                  }}
                  className={`flex h-28 w-28 sm:h-36 sm:w-36 flex-col items-center justify-center rounded-3xl border transition-all duration-150 transform ${
                    isActive
                      ? `${node.bgClass} text-black scale-105 border-white shadow-2xl z-10`
                      : "border-white/10 bg-white/[0.04] text-[#8C8C8C] hover:border-white/30 hover:bg-white/[0.08]"
                  }`}
                >
                  <span className="font-mono text-xs font-black tracking-wider">
                    {node.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            {sequence.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx < playerInput.length
                    ? "bg-[#F4C95D] scale-125"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {gameState === "gameover" && (
        <div className="my-auto flex w-full max-w-md flex-col items-center gap-3 text-center">
          {isPb && (
            <span className="animate-pulse rounded-full border border-[#F4C95D] bg-[#F4C95D]/20 px-3 py-1 font-mono text-[10px] font-black text-[#F4C95D]">
              🏆 NEW PERSONAL BEST RECORD
            </span>
          )}
          <span className="text-5xl">⚡</span>
          <h2 className="font-mono text-3xl font-black text-white uppercase">
            SEQUENCE BROKEN!
          </h2>
          <h3 className="font-mono text-5xl font-black text-[#F4C95D]">
            {streak} <span className="text-xl text-white">STREAK</span>
          </h3>
          <p className="font-mono text-xs text-[#8C8C8C]">
            Memorized <strong>{streak} progressive pattern steps</strong> before misfire.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => {
                onFinish?.();
                onBack();
              }}
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-2 font-mono text-xs font-bold text-white hover:bg-white/20 transition"
            >
              RETURN TO STUDY
            </button>
            <button
              onClick={startGame}
              className="rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-5 py-2 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_20px_rgba(216,166,58,0.4)]"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Bottom Info */}
      <div className="flex w-full items-center justify-between border-t border-white/10 pt-3 text-[11px] font-mono text-[#8C8C8C]">
        <span>👁️ Cognitive Attention & Sequence Drill</span>
        <span>Target: 12+ Sequence Length</span>
      </div>
    </div>
  );
}
