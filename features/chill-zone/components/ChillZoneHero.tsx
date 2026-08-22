"use client";

import { sound } from "@/lib/audio/sound-engine";

interface ChillZoneHeroProps {
  onOpenStats: () => void;
  totalGames: number;
}

export default function ChillZoneHero({ onOpenStats, totalGames }: ChillZoneHeroProps) {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#111111]/80 via-[#070707] to-[#050505] p-8 text-center sm:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full bg-[#D8A63A]/10 blur-[100px]" />

      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3.5 py-1 text-[11px] font-mono font-black tracking-widest text-[#F4C95D] shadow-[0_0_15px_rgba(216,166,58,0.2)] uppercase">
          <span>🎮</span> WHYNOTUPSC // CHILL ZONE
        </div>

        <h1 className="mt-2 font-mono text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase drop-shadow-[0_0_35px_rgba(255,255,255,0.2)]">
          CHILL ZONE
        </h1>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-3 font-mono text-xs sm:text-sm font-black tracking-widest text-[#D8A63A] uppercase">
          <span>TAKE A BREAK.</span>
          <span className="text-white/20">/</span>
          <span>RESET YOUR MIND.</span>
          <span className="text-white/20">/</span>
          <span className="text-white">RETURN STRONGER.</span>
        </div>

        <p className="mt-3 max-w-xl text-xs sm:text-sm text-[#8C8C8C] leading-relaxed">
          High-performance cognitive recalibration. 6 lightweight speed, memory, and reaction mini-games designed to clear mental fatigue and keep your momentum intact.
        </p>

        {/* Quick Stats Trigger */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              sound.playLock();
              onOpenStats();
            }}
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-2.5 font-mono text-xs font-bold text-white hover:border-[#D8A63A] hover:bg-[#D8A63A]/10 transition shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          >
            <span>🏆</span> GAMING PROFILE & STATS ({totalGames} SESSIONS)
          </button>
        </div>
      </div>
    </div>
  );
}
