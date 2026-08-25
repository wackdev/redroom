"use client";

import { useState, useEffect } from "react";
import { ChillGame, LeaderboardEntry } from "../types";
import { getGameLeaderboard } from "../services/score-service";
import { CHILL_GAMES } from "../constants/games";

interface ChillLeaderboardProps {
  initialGame?: ChillGame;
  onClose: () => void;
  onSelectGameToPlay: (game: ChillGame) => void;
}

export default function ChillLeaderboard({
  initialGame = CHILL_GAMES[0],
  onClose,
  onSelectGameToPlay,
}: ChillLeaderboardProps) {
  const [selectedGame, setSelectedGame] = useState<ChillGame>(initialGame);
  const [timeframe, setTimeframe] = useState<"global" | "weekly" | "monthly">("global");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getGameLeaderboard(selectedGame.slug, timeframe).then((data) => {
      if (isMounted) {
        setEntries(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedGame, timeframe]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-white/15 bg-[#090909] p-6 text-white shadow-[0_0_60px_rgba(0,0,0,0.95)] sm:p-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedGame.icon}</span>
            <div>
              <h2 className="font-mono text-lg font-black text-white uppercase">
                {selectedGame.name} {"//"} LEADERBOARD
              </h2>
              <p className="font-mono text-[10px] text-[#8C8C8C] uppercase">
                Scoring: {selectedGame.scoringType === "ASCENDING_TIME" ? "Lower time is superior (ms)" : "Higher score is superior"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 font-mono text-xs text-[#8C8C8C] hover:border-white/40 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Game Tabs */}
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CHILL_GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGame(g)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 py-1.5 font-mono text-[11px] font-bold transition ${
                selectedGame.slug === g.slug
                  ? "border-[#D8A63A] bg-[#D8A63A]/15 text-[#F4C95D] shadow-[0_0_15px_rgba(216,166,58,0.3)]"
                  : "border-white/10 bg-white/5 text-[#8C8C8C] hover:text-white"
              }`}
            >
              <span>{g.icon}</span>
              <span>{g.name}</span>
            </button>
          ))}
        </div>

        {/* Timeframe Filter */}
        <div className="mt-3 flex rounded-xl border border-white/10 bg-white/5 p-1 text-[11px] font-mono">
          {(["global", "weekly", "monthly"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`flex-1 rounded-lg py-1 font-bold uppercase transition ${
                timeframe === t
                  ? "bg-[#D8A63A] text-black"
                  : "text-[#8C8C8C] hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Leaderboard Table List */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D8A63A] border-t-transparent" />
            </div>
          ) : entries.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center font-mono text-xs text-[#8C8C8C]">
              <span>NO SCORES RECORDED YET</span>
              <span className="mt-1 text-[10px]">Be the first cadet to set the benchmark</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {entries.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between rounded-2xl border p-3 font-mono text-xs transition ${
                    entry.isCurrentUser
                      ? "border-[#D8A63A] bg-[#D8A63A]/20 shadow-[0_0_20px_rgba(216,166,58,0.3)]"
                      : entry.rank === 1
                      ? "border-amber-400/40 bg-amber-950/20"
                      : entry.rank === 2
                      ? "border-slate-300/30 bg-slate-800/20"
                      : entry.rank === 3
                      ? "border-amber-700/30 bg-amber-950/10"
                      : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg font-black text-[11px] ${
                        entry.rank === 1
                          ? "bg-amber-400 text-black font-black"
                          : entry.rank === 2
                          ? "bg-slate-300 text-black font-bold"
                          : entry.rank === 3
                          ? "bg-amber-700 text-white font-bold"
                          : "text-[#8C8C8C]"
                      }`}
                    >
                      {entry.rank.toString().padStart(2, "0")}
                    </span>
                    <div>
                      <span className="font-bold text-white">
                        {entry.displayName} {entry.isCurrentUser && "(YOU)"}
                      </span>
                      <p className="text-[10px] text-[#8C8C8C]">{entry.achievedAt}</p>
                    </div>
                  </div>

                  <strong className="text-sm font-black text-[#F4C95D]">
                    {entry.scoreDisplay}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="font-mono text-[10px] text-[#8C8C8C]">
            Encrypted zero-cost peer benchmark telemetry
          </span>
          <button
            onClick={() => {
              onClose();
              onSelectGameToPlay(selectedGame);
            }}
            className="rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-5 py-2 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_20px_rgba(216,166,58,0.3)]"
          >
            PLAY {selectedGame.name}
          </button>
        </div>
      </div>
    </div>
  );
}
