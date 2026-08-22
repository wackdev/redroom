"use client";

import { useState } from "react";
import { CHILL_GAMES } from "@/features/chill-zone/constants/games";
import { sound } from "@/lib/audio/sound-engine";

interface SuspiciousScore {
  id: string;
  cadetName: string;
  game: string;
  score: string;
  reason: string;
  timestamp: string;
}

const INITIAL_SUSPICIOUS: SuspiciousScore[] = [];

export default function ChillZoneAdminView() {
  const [gamesState, setGamesState] = useState(
    CHILL_GAMES.map((g) => ({ ...g, isOnline: true }))
  );
  const [suspiciousList, setSuspiciousList] = useState<SuspiciousScore[]>(INITIAL_SUSPICIOUS);
  const [modSuccess, setModSuccess] = useState<string | null>(null);

  const toggleGameOnline = (gameSlug: string) => {
    sound.playLock();
    setGamesState((prev) =>
      prev.map((g) => (g.slug === gameSlug ? { ...g, isOnline: !g.isOnline } : g))
    );
  };

  const handleRemoveScore = (id: string, name: string) => {
    sound.playWrong();
    setSuspiciousList((prev) => prev.filter((s) => s.id !== id));
    setModSuccess(`Fraudulent score by ${name} purged from leaderboards.`);
    setTimeout(() => setModSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-[#090909] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="font-mono text-[10px] font-black tracking-widest text-[#F4C95D] uppercase">
            ARCADE LOUNGE & MULTIPLAYER MODERATION
          </span>
          <h2 className="mt-1 font-mono text-2xl font-black text-white uppercase">
            CHILL ZONE COMMAND CENTER
          </h2>
          <p className="mt-1 text-xs text-[#8C8C8C]">
            Monitor live player concurrency, toggle game availability, and purge fraudulent scores.
          </p>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="text-right">
            <span className="text-[#8C8C8C] text-[10px]">PLAYING NOW</span>
            <h3 className="text-xl font-black text-emerald-400">34 CADETS</h3>
          </div>
          <div className="text-right">
            <span className="text-[#8C8C8C] text-[10px]">GAMES TODAY</span>
            <h3 className="text-xl font-black text-[#F4C95D]">1,284</h3>
          </div>
        </div>
      </div>

      {modSuccess && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 font-mono text-xs text-emerald-400 animate-fadeIn">
          ✓ {modSuccess}
        </div>
      )}

      {/* Game Kill-Switches Matrix */}
      <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 font-mono text-xs">
        <h3 className="font-black text-[#D8A63A] uppercase tracking-wider mb-4">
          MINI-GAME OPERATIONAL KILL-SWITCHES
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {gamesState.map((g) => (
            <div
              key={g.id}
              className={`flex items-center justify-between rounded-2xl border p-4 transition ${
                g.isOnline
                  ? "border-white/10 bg-white/[0.02]"
                  : "border-red-500/30 bg-red-950/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{g.icon}</span>
                <div>
                  <strong className="text-white text-xs">{g.name}</strong>
                  <p className="text-[10px] text-[#8C8C8C]">
                    STATUS: {g.isOnline ? "ONLINE" : "MAINTENANCE"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleGameOnline(g.slug)}
                className={`rounded-xl px-3 py-1.5 font-bold transition ${
                  g.isOnline
                    ? "border border-white/15 bg-white/5 text-emerald-400 hover:bg-white/10"
                    : "border border-red-500/40 bg-red-500/20 text-red-300"
                }`}
              >
                {g.isOnline ? "ACTIVE" : "OFFLINE"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Moderation & Suspicious Score Purging */}
      <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-black text-[#D8A63A] uppercase tracking-wider">
            SUSPICIOUS LEADERBOARD ENTRIES ({suspiciousList.length} FLAGGED)
          </h3>
          <span className="text-[10px] text-[#8C8C8C]">Anti-Cheat Flag Engine</span>
        </div>

        {suspiciousList.length === 0 ? (
          <div className="p-8 text-center text-[#8C8C8C]">
            ✓ ALL LEADERBOARDS VERIFIED & CLEAN
          </div>
        ) : (
          <div className="space-y-2.5">
            {suspiciousList.map((s) => (
              <div
                key={s.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border border-red-500/30 bg-red-950/10 p-4 rounded-2xl gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-black">⚠️ [{s.game}]</span>
                    <strong className="text-white">{s.cadetName}</strong>
                    <span className="text-[10px] text-[#8C8C8C]">{s.timestamp}</span>
                  </div>
                  <p className="text-white font-bold text-xs mt-1">RECORD: {s.score}</p>
                  <p className="text-red-300 text-[10px]">{s.reason}</p>
                </div>

                <button
                  onClick={() => handleRemoveScore(s.id, s.cadetName)}
                  className="rounded-xl border border-red-500/40 bg-red-500/20 px-4 py-2 font-bold text-red-300 hover:bg-red-500 hover:text-white transition"
                >
                  PURGE SCORE ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
