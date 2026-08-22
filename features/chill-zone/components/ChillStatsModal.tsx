"use client";

import { useChillStats } from "../hooks/use-chill-stats";
import { CHILL_GAMES } from "../constants/games";

interface ChillStatsModalProps {
  onClose: () => void;
}

export default function ChillStatsModal({ onClose }: ChillStatsModalProps) {
  const { stats, achievements, history } = useChillStats();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl border border-white/15 bg-[#090909] p-6 text-white shadow-[0_0_60px_rgba(0,0,0,0.95)] sm:p-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="font-mono text-xl font-black text-white uppercase tracking-wider">
              🎮 CHILL ZONE // CADET GAMING PROFILE
            </h2>
            <p className="font-mono text-[10px] text-[#8C8C8C] uppercase">
              Isolated Gaming Metrics · Never Impacts UPSC Academic Study Hours
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 font-mono text-xs text-[#8C8C8C] hover:border-white/40 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <span className="text-xl">🕹️</span>
            <span className="mt-1 font-mono text-2xl font-black text-white">
              {stats.totalGamesPlayed}
            </span>
            <span className="font-mono text-[10px] text-[#8C8C8C] uppercase">
              Games Played
            </span>
          </div>

          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <span className="text-xl">⏱️</span>
            <span className="mt-1 font-mono text-2xl font-black text-[#F4C95D]">
              {Math.round(stats.totalPlayTimeSeconds / 60)}m
            </span>
            <span className="font-mono text-[10px] text-[#8C8C8C] uppercase">
              Break Time Total
            </span>
          </div>

          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <span className="text-xl">🏆</span>
            <span className="mt-1 font-mono text-2xl font-black text-emerald-400">
              {stats.gamesWon}
            </span>
            <span className="font-mono text-[10px] text-[#8C8C8C] uppercase">
              PB Records Set
            </span>
          </div>

          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <span className="text-xl">🎖️</span>
            <span className="mt-1 font-mono text-2xl font-black text-amber-300">
              {achievements.filter((a) => a.isUnlocked).length} / {achievements.length}
            </span>
            <span className="font-mono text-[10px] text-[#8C8C8C] uppercase">
              Badges Unlocked
            </span>
          </div>
        </div>

        {/* Content Scroll Area */}
        <div className="mt-5 flex-1 overflow-y-auto space-y-6 pr-1">
          {/* Personal Best Records Matrix */}
          <div>
            <h3 className="font-mono text-xs font-black uppercase text-[#D8A63A] tracking-wider mb-2.5">
              PERSONAL BEST BENCHMARKS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CHILL_GAMES.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5 font-mono text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span>{g.icon}</span>
                    <span className="font-bold text-white">{g.name}</span>
                  </div>
                  <strong className="text-[#F4C95D]">
                    {stats.personalBests[g.slug] || "No Record"}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Grid */}
          <div>
            <h3 className="font-mono text-xs font-black uppercase text-[#D8A63A] tracking-wider mb-2.5">
              ACHIEVEMENT TROPHY VAULT
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`flex items-start gap-3 rounded-2xl border p-3 font-mono text-xs transition ${
                    ach.isUnlocked
                      ? "border-[#D8A63A]/40 bg-[#D8A63A]/10 shadow-[0_0_15px_rgba(216,166,58,0.15)]"
                      : "border-white/5 bg-white/[0.01] opacity-50"
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg">
                    {ach.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{ach.name}</span>
                      {ach.isUnlocked && (
                        <span className="text-[9px] text-emerald-400 font-bold">✓ UNLOCKED</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[10px] text-[#8C8C8C] leading-snug">
                      {ach.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent History */}
          {history.length > 0 && (
            <div>
              <h3 className="font-mono text-xs font-black uppercase text-[#D8A63A] tracking-wider mb-2.5">
                RECENT SESSIONS LOG
              </h3>
              <div className="flex flex-col gap-1.5">
                {history.slice(0, 8).map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] px-3 py-2 font-mono text-[11px]"
                  >
                    <span className="font-bold text-white uppercase">{h.gameSlug}</span>
                    <span className="text-[#F4C95D] font-black">{h.scoreDisplay}</span>
                    <span className="text-[#8C8C8C] text-[10px]">
                      {new Date(h.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
