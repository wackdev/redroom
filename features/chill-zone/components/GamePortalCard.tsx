"use client";

import { ChillGame } from "../types";
import { sound } from "@/lib/audio/sound-engine";

interface GamePortalCardProps {
  game: ChillGame;
  personalBestDisplay: string;
  onPlay: (game: ChillGame) => void;
  onOpenLeaderboard: (game: ChillGame) => void;
}

export default function GamePortalCard({
  game,
  personalBestDisplay,
  onPlay,
  onOpenLeaderboard,
}: GamePortalCardProps) {
  return (
    <div
      onMouseEnter={() => sound.playHover()}
      className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0c0c0c]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#D8A63A]/70 hover:bg-[#111111] hover:shadow-[0_0_40px_rgba(216,166,58,0.25)] hover:-translate-y-1"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl shadow-inner group-hover:border-[#D8A63A]/40 group-hover:scale-105 transition">
            {game.icon}
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-[9px] font-black tracking-widest text-[#F4C95D] uppercase">
              {game.code}
            </span>
            <span className="font-mono text-[10px] text-[#8C8C8C]">
              {game.durationLabel}
            </span>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="mt-4 font-mono text-lg font-black text-white group-hover:text-[#F4C95D] transition">
          {game.name}
        </h3>
        <p className="font-mono text-[10px] font-bold text-[#D8A63A] uppercase">
          {game.tagline}
        </p>

        <p className="mt-2.5 text-xs text-[#8C8C8C] leading-relaxed line-clamp-3">
          {game.description}
        </p>
      </div>

      {/* Footer Info & Play Button */}
      <div className="mt-6 border-t border-white/5 pt-4">
        <div className="mb-3.5 flex items-center justify-between text-xs font-mono">
          <span className="text-[#8C8C8C] text-[11px]">YOUR RECORD:</span>
          <strong className="text-white font-bold">{personalBestDisplay}</strong>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard(game);
            }}
            className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 font-mono text-[11px] font-bold text-[#8C8C8C] hover:border-white/30 hover:text-white transition"
          >
            📊 RANKS
          </button>
          <button
            onClick={() => {
              sound.playWarp();
              onPlay(game);
            }}
            className="flex-1 rounded-xl border border-[#D8A63A] bg-[#D8A63A] py-2.5 font-mono text-[11px] font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_20px_rgba(216,166,58,0.3)]"
          >
            ▶ PLAY
          </button>
        </div>
      </div>
    </div>
  );
}
