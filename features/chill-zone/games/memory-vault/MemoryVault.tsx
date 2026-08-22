"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { submitGameScore } from "../../services/score-service";
import { sound } from "@/lib/audio/sound-engine";

interface MemoryVaultProps {
  onBack: () => void;
  onFinish?: () => void;
}

type Difficulty = "easy" | "medium" | "hard" | "extreme";

interface CardItem {
  uid: string;
  pairId: string;
  symbol: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const UPSC_PAIRS = [
  { id: "preamble", symbol: "📜", label: "Preamble" },
  { id: "ashoka", symbol: "🦁", label: "Ashoka Pillar" },
  { id: "monsoon", symbol: "🌧️", label: "SW Monsoon" },
  { id: "judiciary", symbol: "⚖️", label: "Supreme Court" },
  { id: "economy", symbol: "💹", label: "Fiscal Deficit" },
  { id: "space", symbol: "🚀", label: "ISRO Gaganyaan" },
  { id: "ecology", symbol: "🐅", label: "Project Tiger" },
  { id: "ancient", symbol: "🏺", label: "Indus Seal" },
  { id: "ocean", symbol: "🌊", label: "Indian Ocean Dipole" },
  { id: "rights", symbol: "🛡️", label: "Article 21" },
];

const DIFFICULTY_CONFIG: Record<Difficulty, { pairs: number; cols: string; multiplier: number }> = {
  easy: { pairs: 4, cols: "grid-cols-4", multiplier: 1 },
  medium: { pairs: 6, cols: "grid-cols-4", multiplier: 1.5 },
  hard: { pairs: 8, cols: "grid-cols-4", multiplier: 2.2 },
  extreme: { pairs: 10, cols: "grid-cols-5", multiplier: 3.5 },
};

export default function MemoryVault({ onBack, onFinish }: MemoryVaultProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardItem[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "playing" | "won">("idle");
  const [finalScore, setFinalScore] = useState<number>(0);
  const [isPb, setIsPb] = useState(false);

  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  const initGame = useCallback((diff: Difficulty) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const config = DIFFICULTY_CONFIG[diff];
    const selectedPairs = UPSC_PAIRS.slice(0, config.pairs);

    const deck: CardItem[] = [];
    selectedPairs.forEach((pair) => {
      deck.push({
        uid: `${pair.id}_1`,
        pairId: pair.id,
        symbol: pair.symbol,
        label: pair.label,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        uid: `${pair.id}_2`,
        pairId: pair.id,
        symbol: pair.symbol,
        label: pair.label,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimeSeconds(0);
    setGameState("playing");
    setIsPb(false);

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeSeconds((prev) => prev + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    initGame(difficulty);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [difficulty, initGame]);

  const handleCardClick = (card: CardItem) => {
    if (gameState !== "playing" || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return;
    }

    sound.playClick();
    const newFlipped = [...flippedCards, card];
    setCards((prev) =>
      prev.map((c) => (c.uid === card.uid ? { ...c, isFlipped: true } : c))
    );
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [first, second] = newFlipped;

      if (first.pairId === second.pairId) {
        // Match found
        sound.playCorrect();
        setCards((prev) =>
          prev.map((c) =>
            c.pairId === first.pairId ? { ...c, isMatched: true, isFlipped: true } : c
          )
        );
        const newMatches = matches + 1;
        setMatches(newMatches);
        setFlippedCards([]);

        const totalPairs = DIFFICULTY_CONFIG[difficulty].pairs;
        if (newMatches >= totalPairs) {
          // Game Won!
          clearInterval(timerRef.current);
          const duration = Date.now() - startTimeRef.current;
          const config = DIFFICULTY_CONFIG[difficulty];
          const calculatedScore = Math.max(
            500,
            Math.round(
              ((totalPairs * 1000) / Math.max(1, moves + 1) +
                Math.max(0, 180 - timeSeconds) * 40) *
                config.multiplier
            )
          );
          setFinalScore(calculatedScore);
          setGameState("won");
          sound.playVictory();

          submitGameScore({
            gameSlug: "memory-vault",
            score: calculatedScore,
            durationMs: duration,
            moves: moves + 1,
            difficulty,
            accuracy: Math.round((totalPairs / (moves + 1)) * 100),
          }).then((res) => {
            if (res.isPersonalBest) setIsPb(true);
          });
        }
      } else {
        // Miss match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.uid === first.uid || c.uid === second.uid ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 750);
      }
    }
  };

  const config = DIFFICULTY_CONFIG[difficulty];

  return (
    <div className="relative flex min-h-[580px] w-full flex-col items-center justify-between rounded-3xl border border-white/10 bg-[#070707] p-6 text-white select-none overflow-hidden sm:p-8">
      {/* Top Bar */}
      <div className="flex w-full flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition"
        >
          ← EXIT VAULT
        </button>

        {/* Difficulty Selector */}
        <div className="flex rounded-xl border border-white/10 bg-white/5 p-1 text-[11px] font-mono">
          {(["easy", "medium", "hard", "extreme"] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`rounded-lg px-2.5 py-1 font-bold uppercase transition ${
                difficulty === d
                  ? "bg-[#D8A63A] text-black shadow-[0_0_12px_rgba(216,166,58,0.4)]"
                  : "text-[#8C8C8C] hover:text-white"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Game Stats */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-[#8C8C8C]">
            MOVES: <strong className="text-white">{moves}</strong>
          </span>
          <span className="text-[#8C8C8C]">
            TIME: <strong className="text-[#F4C95D]">{timeSeconds}s</strong>
          </span>
        </div>
      </div>

      {/* Cards Matrix Grid */}
      {gameState === "playing" && (
        <div className={`my-6 grid ${config.cols} gap-3 w-full max-w-2xl`}>
          {cards.map((c) => (
            <button
              key={c.uid}
              onClick={() => handleCardClick(c)}
              className={`relative flex h-24 sm:h-28 flex-col items-center justify-center rounded-2xl border text-center transition-all duration-200 transform ${
                c.isMatched
                  ? "border-[#D8A63A] bg-[#D8A63A]/20 shadow-[0_0_20px_rgba(216,166,58,0.3)] scale-[0.98] opacity-85 cursor-default"
                  : c.isFlipped
                  ? "border-white/40 bg-white/15 scale-105"
                  : "border-white/10 bg-white/[0.04] hover:border-[#D8A63A]/40 hover:bg-white/[0.08]"
              }`}
            >
              {c.isFlipped || c.isMatched ? (
                <div className="flex flex-col items-center gap-1 animate-fadeIn">
                  <span className="text-2xl sm:text-3xl">{c.symbol}</span>
                  <span className="font-mono text-[9px] font-bold text-[#F4C95D] uppercase line-clamp-1 px-1">
                    {c.label}
                  </span>
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 font-mono text-xs font-black text-[#8C8C8C]">
                  ?
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Win State Overlay */}
      {gameState === "won" && (
        <div className="my-8 flex flex-col items-center gap-3 text-center">
          {isPb && (
            <span className="animate-pulse rounded-full border border-[#F4C95D] bg-[#F4C95D]/20 px-3 py-1 font-mono text-[10px] font-black text-[#F4C95D]">
              🏆 NEW PERSONAL BEST RECORD
            </span>
          )}
          <span className="text-5xl">🧠</span>
          <h2 className="font-mono text-3xl font-black text-white uppercase tracking-wider">
            VAULT CRACKED!
          </h2>
          <h3 className="font-mono text-5xl font-black text-[#F4C95D]">
            {finalScore.toLocaleString()} <span className="text-xl text-white">PTS</span>
          </h3>
          <p className="font-mono text-xs text-[#8C8C8C]">
            Cleared in <strong>{timeSeconds}s</strong> with <strong>{moves} moves</strong> ({difficulty.toUpperCase()} tier).
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
              onClick={() => initGame(difficulty)}
              className="rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-5 py-2 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_20px_rgba(216,166,58,0.4)]"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Bottom Info */}
      <div className="flex w-full items-center justify-between border-t border-white/10 pt-3 text-[11px] font-mono text-[#8C8C8C]">
        <span>Pairs: {matches} / {config.pairs}</span>
        <span>Cognitive Recall Benchmark: Match under 45 seconds</span>
      </div>
    </div>
  );
}
