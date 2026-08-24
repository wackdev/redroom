"use client";

import { useMemo, useState } from "react";
import { calculateCadetRank, computeCadetBadges, CadetRank, CadetBadge } from "@/lib/core/cadet-ranks";
import { sound } from "@/lib/audio/sound-engine";

interface Props {
  totalHours?: number;
  streakDays?: number;
  mainsAnswerCount?: number;
  pyqSolvedCount?: number;
  revisionsDone?: number;
}

export default function CadetRankBadge({
  totalHours = 45,
  streakDays = 5,
  mainsAnswerCount = 4,
  pyqSolvedCount = 28,
  revisionsDone = 12,
}: Props) {
  const [showModal, setShowModal] = useState(false);

  const { currentRank, nextRank, progressPercent } = useMemo(
    () => calculateCadetRank(totalHours),
    [totalHours]
  );

  const badges = useMemo(
    () =>
      computeCadetBadges({
        totalHours,
        streakDays,
        mainsAnswerCount,
        pyqSolvedCount,
        revisionsDone,
      }),
    [totalHours, streakDays, mainsAnswerCount, pyqSolvedCount, revisionsDone]
  );

  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  return (
    <>
      {/* Mini Rank Badge Button (for Navigation / HUD) */}
      <button
        type="button"
        onClick={() => {
          setShowModal(true);
          sound.playLock();
        }}
        className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0d0d0d] px-3.5 py-2 hover:border-[#D8A63A] transition shadow-lg backdrop-blur-md"
      >
        <span className="text-xl group-hover:scale-110 transition">{currentRank.icon}</span>
        <div className="text-left">
          <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-[#8C8C8C]">
            RANK {currentRank.level}
          </span>
          <span className="block font-mono text-xs font-black text-white group-hover:text-[#F4C95D] transition">
            {currentRank.title}
          </span>
        </div>
        <span className="ml-1 rounded-full bg-[#D8A63A]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#F4C95D]">
          {unlockedBadgesCount}/{badges.length} 🎖️
        </span>
      </button>

      {/* Full Cadet Dossier Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-[#D8A63A]/40 bg-[#0d0d0d] shadow-2xl overflow-hidden font-sans">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/10 bg-[#141414] px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentRank.icon}</span>
                <div>
                  <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#D8A63A]">
                    CIVIL SERVICES RANK INVENTORY // ASPIRANT DOSSIER
                  </span>
                  <h2 className="font-mono text-lg font-bold text-white">{currentRank.title}</h2>
                  <p className="text-xs text-[#8C8C8C]">{currentRank.cadre}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-white/10 px-3 py-1 font-mono text-xs text-[#8C8C8C] hover:text-white"
              >
                ✕ Close
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Progress to Next Rank */}
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                <div className="flex items-center justify-between font-mono text-xs mb-2">
                  <span className="text-[#8C8C8C]">
                    Next Promotion:{" "}
                    <strong className="text-white">
                      {nextRank ? nextRank.title : "Max Rank Achieved (Cabinet Secretary)"}
                    </strong>
                  </span>
                  <strong className="text-[#F4C95D]">{progressPercent}%</strong>
                </div>

                <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D8A63A] to-[#F4C95D] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="mt-2 flex justify-between font-mono text-[10px] text-[#8C8C8C]">
                  <span>{totalHours}h logged</span>
                  <span>{nextRank ? `${nextRank.minHours}h required` : "Sovereign Tier"}</span>
                </div>
              </div>

              {/* Rank Perks */}
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F4C95D] mb-2.5">
                  ⚡ Unlocked Executive Privileges
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {currentRank.perks.map((perk, pIdx) => (
                    <div
                      key={pIdx}
                      className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs text-white"
                    >
                      <span className="text-emerald-400">✓</span>
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Badges */}
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F4C95D] mb-2.5">
                  🎖️ Tactical Milestone Badges ({unlockedBadgesCount}/{badges.length})
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`rounded-2xl border p-3.5 transition ${
                        badge.unlocked
                          ? "border-[#D8A63A]/40 bg-[#D8A63A]/10 shadow-[0_0_15px_rgba(216,166,58,0.15)]"
                          : "border-white/5 bg-black/40 opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{badge.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-mono text-xs font-bold text-white">{badge.name}</h4>
                            {badge.unlocked && (
                              <span className="font-mono text-[9px] font-black uppercase text-emerald-400">
                                UNLOCKED
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-[11px] text-[#8C8C8C] leading-snug">
                            {badge.description}
                          </p>

                          {!badge.unlocked && (
                            <div className="mt-2">
                              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className="h-full bg-[#D8A63A]"
                                  style={{ width: `${badge.progress}%` }}
                                />
                              </div>
                              <span className="mt-1 block text-right font-mono text-[9px] text-[#8C8C8C]">
                                {badge.progress}% ({badge.criteria})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
