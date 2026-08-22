"use client";

import { useEffect, useState, useCallback } from "react";
import { GameScoreRecord, GameSlug, ChillUserStats } from "../types";
import {
  getLocalPersonalBests,
  getLocalScoreHistory,
} from "../services/score-service";
import { CHILL_GAMES, CHILL_ACHIEVEMENTS } from "../constants/games";

const STATS_KEY = "redroom_chill_user_stats";

export function useChillStats() {
  const [personalBests, setPersonalBests] = useState<Record<GameSlug, number>>({} as any);
  const [history, setHistory] = useState<GameScoreRecord[]>([]);
  const [stats, setStats] = useState<ChillUserStats>({
    totalGamesPlayed: 0,
    totalPlayTimeSeconds: 0,
    gamesWon: 0,
    highestScores: {} as any,
    personalBests: {} as any,
    achievementsUnlocked: ["first_break"],
  });

  const refreshStats = useCallback(() => {
    if (typeof window === "undefined") return;

    const pbs = getLocalPersonalBests();
    setPersonalBests(pbs);

    const hist = getLocalScoreHistory();
    setHistory(hist);

    try {
      const raw = localStorage.getItem(STATS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};

      const pbFormatted: Record<GameSlug, string> = {} as any;
      CHILL_GAMES.forEach((g) => {
        const val = pbs[g.slug];
        pbFormatted[g.slug] = val !== undefined && val > 0 ? g.bestScoreFormat(val) : "No Record";
      });

      // Calculate unlocked achievements
      const unlocked: string[] = ["first_break"];
      if (pbs.react && pbs.react < 220) unlocked.push("quick_hands");
      if (pbs["memory-vault"] && pbs["memory-vault"] > 8000) unlocked.push("memory_master");
      if (pbs["focus-flow"] && pbs["focus-flow"] > 5000) unlocked.push("flow_survivor");
      if (pbs["quick-duel"] && pbs["quick-duel"] > 0) unlocked.push("duel_winner");
      if (pbs["word-rush"] && pbs["word-rush"] > 4000) unlocked.push("word_master");
      if (pbs.blink && pbs.blink >= 12) unlocked.push("blink_titan");

      if (Object.keys(pbs).length >= 6) {
        unlocked.push("mind_master");
      }

      setStats({
        totalGamesPlayed: parsed.totalGamesPlayed || hist.length,
        totalPlayTimeSeconds: parsed.totalPlayTimeSeconds || hist.reduce((acc, h) => acc + Math.round(h.durationMs / 1000), 0),
        gamesWon: parsed.gamesWon || hist.filter((h) => h.isPersonalBest).length,
        highestScores: pbs,
        personalBests: pbFormatted,
        achievementsUnlocked: Array.from(new Set(unlocked)),
        lastPlayedAt: parsed.lastPlayedAt,
      });
    } catch {}
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return {
    personalBests,
    history,
    stats,
    achievements: CHILL_ACHIEVEMENTS.map((a) => ({
      ...a,
      isUnlocked: stats.achievementsUnlocked.includes(a.id),
    })),
    refreshStats,
  };
}
