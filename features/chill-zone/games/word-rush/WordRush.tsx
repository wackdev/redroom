"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { submitGameScore } from "../../services/score-service";
import { sound } from "@/lib/audio/sound-engine";

interface WordRushProps {
  onBack: () => void;
  onFinish?: () => void;
}

interface WordItem {
  word: string;
  category: "Polity" | "History" | "Geography" | "Economy" | "Environment";
  hint: string;
}

const UPSC_WORDS: WordItem[] = [
  { word: "PREAMBLE", category: "Polity", hint: "Key to the mind of constitution makers" },
  { word: "MONSOON", category: "Geography", hint: "Seasonal reversal of wind systems" },
  { word: "SWADESHI", category: "History", hint: "1905 Boycott and self-reliance movement" },
  { word: "ECOLOGY", category: "Environment", hint: "Interaction between living organisms and habitat" },
  { word: "INFLATION", category: "Economy", hint: "Sustained increase in general price levels" },
  { word: "FEDERALISM", category: "Polity", hint: "Constitutional division of powers" },
  { word: "SATYAGRAHA", category: "History", hint: "Truth force doctrine pioneered by Gandhi" },
  { word: "TSUNAMI", category: "Geography", hint: "Harbour wave triggered by undersea earthquakes" },
  { word: "MANGROVES", category: "Environment", hint: "Tidal halophytic coastal vegetation" },
  { word: "BUDGET", category: "Economy", hint: "Annual financial statement under Article 112" },
  { word: "REPUBLIC", category: "Polity", hint: "Head of State is elected, not hereditary" },
  { word: "TROPICAL", category: "Geography", hint: "Region lying between Tropics of Cancer and Capricorn" },
  { word: "HABEASCORPUS", category: "Polity", hint: "Writ meaning 'to have the body of'" },
  { word: "BIODIVERSITY", category: "Environment", hint: "Variety of plant and animal life in a habitat" },
];

function scrambleWord(str: string): string {
  const arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Ensure scrambled differs from original
  if (arr.join("") === str && str.length > 3) {
    return scrambleWord(str);
  }
  return arr.join("");
}

export default function WordRush({ onBack, onFinish }: WordRushProps) {
  const [gameState, setGameState] = useState<"intro" | "playing" | "gameover">("intro");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(60);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [scrambled, setScrambled] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isWrong, setIsWrong] = useState(false);
  const [isPb, setIsPb] = useState(false);

  const timerRef = useRef<any>(null);
  const sessionStartRef = useRef<number>(0);
  const wordListRef = useRef<WordItem[]>([]);

  const startNextWord = useCallback((idx: number, list: WordItem[]) => {
    if (idx >= list.length) {
      // Loop or reshuffle
      const reshuffled = [...UPSC_WORDS].sort(() => Math.random() - 0.5);
      wordListRef.current = reshuffled;
      setCurrentWordIdx(0);
      setScrambled(scrambleWord(reshuffled[0].word));
      return;
    }
    setCurrentWordIdx(idx);
    setScrambled(scrambleWord(list[idx].word));
    setUserInput("");
    setIsWrong(false);
  }, []);

  const startGame = () => {
    const shuffled = [...UPSC_WORDS].sort(() => Math.random() - 0.5);
    wordListRef.current = shuffled;
    setGameState("playing");
    setScore(0);
    setStreak(0);
    setSolvedCount(0);
    setTotalTimeLeft(60);
    setIsPb(false);
    sessionStartRef.current = Date.now();
    startNextWord(0, shuffled);
    sound.playWarp();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTotalTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = useCallback(() => {
    setGameState("gameover");
    sound.playVictory();
    const duration = Date.now() - sessionStartRef.current;
    submitGameScore({
      gameSlug: "word-rush",
      score,
      durationMs: duration,
      streak,
      metadata: { solvedCount },
    }).then((res) => {
      if (res.isPersonalBest) setIsPb(true);
    });
  }, [score, streak, solvedCount]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentWord = wordListRef.current[currentWordIdx] || UPSC_WORDS[0];

  const handleInputSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || gameState !== "playing") return;

    const cleaned = userInput.trim().toUpperCase();
    if (cleaned === currentWord.word) {
      // Correct!
      sound.playCorrect();
      const points = 350 + streak * 50;
      setScore((s) => s + points);
      setStreak((st) => st + 1);
      const newCount = solvedCount + 1;
      setSolvedCount(newCount);
      startNextWord(currentWordIdx + 1, wordListRef.current);
    } else {
      // Wrong
      sound.playWrong();
      setIsWrong(true);
      setStreak(0);
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const handleSkip = () => {
    sound.playClick();
    setStreak(0);
    startNextWord(currentWordIdx + 1, wordListRef.current);
  };

  return (
    <div className="relative flex min-h-[580px] w-full flex-col items-center justify-between rounded-3xl border border-white/10 bg-[#070707] p-6 text-white select-none overflow-hidden sm:p-8">
      {/* Top HUD */}
      <div className="flex w-full items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            onBack();
          }}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition"
        >
          ← EXIT RUSH
        </button>

        <div className="flex items-center gap-6 font-mono text-xs">
          <span className="text-[#8C8C8C]">
            TIME: <strong className={totalTimeLeft <= 10 ? "text-red-400 animate-ping" : "text-[#F4C95D]"}>{totalTimeLeft}s</strong>
          </span>
          <span className="text-[#8C8C8C]">
            STREAK: <strong className="text-amber-400">🔥 {streak}x</strong>
          </span>
          <span className="text-[#8C8C8C]">
            SCORE: <strong className="text-[#D8A63A] text-sm">{score.toLocaleString()}</strong>
          </span>
        </div>
      </div>

      {/* Main Game Stage */}
      {gameState === "intro" && (
        <div className="my-auto flex w-full max-w-md flex-col items-center gap-4 text-center">
          <span className="text-5xl">🔤</span>
          <h2 className="font-mono text-3xl font-black text-[#F4C95D] uppercase tracking-widest">
            WORD RUSH
          </h2>
          <p className="text-xs text-[#8C8C8C] leading-relaxed">
            Unscramble high-yield UPSC vocabulary across Polity, Geography, History, and Economy in a 60-second speed sprint.
          </p>
          <button
            onClick={startGame}
            className="mt-4 rounded-2xl border border-[#D8A63A] bg-[#D8A63A] px-8 py-3.5 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_25px_rgba(216,166,58,0.5)]"
          >
            START 60s SPRINT
          </button>
        </div>
      )}

      {gameState === "playing" && (
        <div className="my-auto flex w-full max-w-lg flex-col items-center gap-5 text-center">
          {/* Category Tag */}
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] font-bold text-[#F4C95D] uppercase">
            {currentWord.category} · {currentWord.hint}
          </span>

          {/* Scrambled Word Tile Display */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {scrambled.split("").map((letter, idx) => (
              <div
                key={idx}
                className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 font-mono text-2xl font-black text-white shadow-[0_0_15px_rgba(216,166,58,0.2)]"
              >
                {letter}
              </div>
            ))}
          </div>

          {/* Word Input Form */}
          <form onSubmit={handleInputSubmit} className="flex w-full max-w-sm flex-col gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.toUpperCase())}
              placeholder="TYPE UNSCRAMBLED WORD..."
              autoFocus
              className={`w-full rounded-2xl border bg-black/70 px-4 py-3 text-center font-mono text-sm font-bold tracking-widest text-white transition focus:outline-none ${
                isWrong
                  ? "border-red-500 bg-red-950/30 animate-shake"
                  : "border-white/20 focus:border-[#D8A63A]"
              }`}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 font-mono text-xs text-[#8C8C8C] hover:text-white"
              >
                SKIP (-STREAK)
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl border border-[#D8A63A] bg-[#D8A63A] py-2 font-mono text-xs font-black text-black hover:bg-[#F4C95D]"
              >
                SUBMIT
              </button>
            </div>
          </form>
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
            SPRINT COMPLETE!
          </h2>
          <h3 className="font-mono text-5xl font-black text-[#F4C95D]">
            {score.toLocaleString()} <span className="text-xl text-white">PTS</span>
          </h3>
          <p className="font-mono text-xs text-[#8C8C8C]">
            Unscrambled <strong>{solvedCount} terms</strong> with a peak streak of <strong>{streak}x</strong>.
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
        <span>🔤 Rapid Anagram Matrix</span>
        <span>UPSC Terminology Speed Drills</span>
      </div>
    </div>
  );
}
