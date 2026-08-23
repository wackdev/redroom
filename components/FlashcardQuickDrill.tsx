"use client";

import { useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface FlashcardItem {
  id: string;
  subject: string;
  front: string;
  back: string;
  eliminatorNote: string;
}

const SAMPLE_FLASHCARDS: FlashcardItem[] = [
  {
    id: "fc-1",
    subject: "Polity",
    front: "Which Article of the Indian Constitution contains the Doctrine of Pleasure?",
    back: "Article 310 — Civil servants hold office during the pleasure of the President (Union) or Governor (State), subject to safeguards under Article 311.",
    eliminatorNote: "Article 311 mandates inquiry and reasonable opportunity before dismissal or reduction in rank.",
  },
  {
    id: "fc-2",
    subject: "Economy",
    front: "What is the difference between Headline Inflation and Core Inflation?",
    back: "Headline Inflation (CPI) includes all commodities in the basket. Core Inflation excludes volatile food and fuel components.",
    eliminatorNote: "RBI officially uses CPI-Combined Headline inflation as its monetary policy anchor target (4% ± 2%).",
  },
  {
    id: "fc-3",
    subject: "Environment",
    front: "What is the difference between Ramsar Montreux Record and normal Ramsar Sites?",
    back: "Montreux Record is a register of wetland sites on the List of Wetlands of International Importance where ecological changes have occurred, are occurring, or are likely to occur.",
    eliminatorNote: "Currently in India, only Keoladeo National Park (Rajasthan) and Loktak Lake (Manipur) are on the Montreux Record.",
  },
  {
    id: "fc-4",
    subject: "History",
    front: "Who were the leaders of the Santhal Hool Rebellion (1855–56)?",
    back: "Sidhu and Kanhu Murmu (along with Chand and Bhairav) led the revolt against British colonial taxation, zamindars, and mahajans in the Rajmahal Hills.",
    eliminatorNote: "Resulted in the creation of the Santhal Pargana non-regulation district by the British in 1855.",
  },
];

export default function FlashcardQuickDrill() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);

  const card = SAMPLE_FLASHCARDS[currentIndex] || SAMPLE_FLASHCARDS[0];

  const handleFlip = () => {
    setIsFlipped((f) => !f);
    sound.playHover();
  };

  const handleRate = (rating: 1 | 3 | 5) => {
    if (rating === 5) {
      setMasteredCount((m) => m + 1);
      sound.playVictory();
    } else if (rating === 1) {
      sound.playLock();
    } else {
      sound.playHover();
    }

    setIsFlipped(false);
    if (currentIndex < SAMPLE_FLASHCARDS.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl backdrop-blur-xl font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-emerald-400">
              ACTIVE RECALL // 3D FLASHCARD DRILL
            </span>
          </div>
          <h3 className="mt-1 font-mono text-base font-bold text-white">
            Spaced Repetition High-Yield Flashcard Vault
          </h3>
        </div>

        <div className="font-mono text-xs text-[#8C8C8C]">
          Card <strong className="text-white">{currentIndex + 1}</strong> of{" "}
          <strong>{SAMPLE_FLASHCARDS.length}</strong> (Mastered:{" "}
          <strong className="text-emerald-400">{masteredCount}</strong>)
        </div>
      </div>

      {/* 3D Flashcard Container */}
      <div className="my-6 flex justify-center perspective-[1000px]">
        <div
          onClick={handleFlip}
          className={`relative h-64 w-full max-w-xl cursor-pointer rounded-3xl border border-[#D8A63A]/40 bg-gradient-to-b from-[#171408] to-[#0d0d0d] p-8 shadow-2xl transition-transform duration-500 flex flex-col justify-between select-none ${
            isFlipped ? "ring-2 ring-[#D8A63A]" : "hover:border-[#D8A63A]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="rounded-full bg-[#D8A63A]/20 px-3 py-0.5 font-mono text-[10px] font-bold text-[#F4C95D]">
                {card.subject}
              </span>
              <span className="font-mono text-[10px] text-[#8C8C8C]">
                {isFlipped ? "💡 CONCEPT EXPLANATION" : "❓ CLICK TO REVEAL"}
              </span>
            </div>

            <div className="mt-4">
              {isFlipped ? (
                <div>
                  <p className="text-sm font-semibold text-white/95 leading-relaxed font-sans">
                    {card.back}
                  </p>
                  <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-xs text-emerald-300">
                    <strong>🎯 Prelims Eliminator:</strong> {card.eliminatorNote}
                  </div>
                </div>
              ) : (
                <p className="text-base sm:text-lg font-bold text-white leading-relaxed font-sans">
                  {card.front}
                </p>
              )}
            </div>
          </div>

          <div className="text-center font-mono text-[10px] text-[#8C8C8C]">
            [Click Card to Flip]
          </div>
        </div>
      </div>

      {/* Rating Controls (Active only after flip) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
        <span className="text-[#8C8C8C] text-xs">Recall Confidence:</span>
        <button
          onClick={() => handleRate(1)}
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 font-bold text-red-300 hover:bg-red-500/20 transition"
        >
          ❌ 1 - Forgot (Reset)
        </button>
        <button
          onClick={() => handleRate(3)}
          className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 font-bold text-amber-200 hover:bg-amber-500/20 transition"
        >
          ⚡ 3 - Good Recall
        </button>
        <button
          onClick={() => handleRate(5)}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 font-bold text-emerald-300 hover:bg-emerald-500/20 transition shadow"
        >
          🏆 5 - Mastered (Long Interval)
        </button>
      </div>
    </div>
  );
}
