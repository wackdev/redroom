import { GameScoreRecord, GameSlug, LeaderboardEntry } from "../types";
import { CHILL_GAMES } from "../constants/games";
import { getBrowserClient, isSupabaseConfigured } from "@/lib/db/supabase";
import { idb, DB_STORES } from "@/lib/db/indexed-db";

const LOCAL_STORAGE_HISTORY_KEY = "redroom_chill_history";
const LOCAL_STORAGE_PB_KEY = "redroom_chill_personal_bests";
const LOCAL_STORAGE_STATS_KEY = "redroom_chill_user_stats";

interface ScoreValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Basic anti-cheat heuristic validation
 */
export function validateGameScore(
  gameSlug: GameSlug,
  score: number,
  durationMs: number
): ScoreValidationResult {
  if (score < 0 || isNaN(score) || !isFinite(score)) {
    return { isValid: false, reason: "Invalid score value." };
  }

  if (durationMs < 1000 && gameSlug !== "quick-duel") {
    return { isValid: false, reason: "Session duration too short." };
  }

  // Game specific constraints
  switch (gameSlug) {
    case "react":
      // Human reaction time under 80ms is physiologically impossible without anticipatory cheating
      if (score < 90) {
        return { isValid: false, reason: "Reaction time is below physical human limits." };
      }
      break;
    case "blink":
      // A streak of over 100 is virtually impossible in casual session
      if (score > 100) {
        return { isValid: false, reason: "Streak exceeds theoretical limits." };
      }
      break;
    case "word-rush":
      // Max 30 words in 60s
      if (score > 30000) {
        return { isValid: false, reason: "Score exceeds theoretical maximum." };
      }
      break;
    case "focus-flow":
      // Score rate limit check
      const maxAllowedScore = (durationMs / 1000) * 1500;
      if (score > maxAllowedScore) {
        return { isValid: false, reason: "Abnormal score accumulation rate." };
      }
      break;
  }

  return { isValid: true };
}

/**
 * Submits a valid score record, updates personal bests and history
 */
export async function submitGameScore(payload: {
  gameSlug: GameSlug;
  score: number;
  durationMs: number;
  accuracy?: number;
  moves?: number;
  streak?: number;
  difficulty?: string;
  metadata?: Record<string, any>;
}): Promise<{ success: boolean; isPersonalBest: boolean; record: GameScoreRecord }> {
  const game = CHILL_GAMES.find((g) => g.slug === payload.gameSlug);
  if (!game) {
    throw new Error(`Unknown game: ${payload.gameSlug}`);
  }

  // Validate Score
  const validation = validateGameScore(payload.gameSlug, payload.score, payload.durationMs);
  if (!validation.isValid) {
    console.warn(`[Anti-Cheat] Score rejected for ${payload.gameSlug}:`, validation.reason);
    return {
      success: false,
      isPersonalBest: false,
      record: {
        id: `rejected_${Date.now()}`,
        gameSlug: payload.gameSlug,
        score: payload.score,
        scoreDisplay: game.bestScoreFormat(payload.score),
        durationMs: payload.durationMs,
        timestamp: Date.now(),
      },
    };
  }

  // Check Personal Best
  const pbs = getLocalPersonalBests();
  const currentBest = pbs[payload.gameSlug];
  let isPb = false;

  if (currentBest === undefined || currentBest === 0) {
    isPb = true;
  } else if (game.scoringType === "ASCENDING_TIME") {
    isPb = payload.score < currentBest; // Lower is better
  } else {
    isPb = payload.score > currentBest; // Higher is better
  }

  if (isPb) {
    pbs[payload.gameSlug] = payload.score;
    saveLocalPersonalBests(pbs);
  }

  const record: GameScoreRecord = {
    id: `chill_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    gameSlug: payload.gameSlug,
    score: payload.score,
    scoreDisplay: game.bestScoreFormat(payload.score),
    durationMs: payload.durationMs,
    accuracy: payload.accuracy,
    moves: payload.moves,
    streak: payload.streak,
    difficulty: payload.difficulty,
    timestamp: Date.now(),
    isPersonalBest: isPb,
  };

  // Save to local history & IndexedDB
  saveScoreToLocalHistory(record);
  try {
    await idb.put(DB_STORES.TEST_RESULTS, record);
  } catch {}

  // Attempt Supabase Sync if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = getBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user?.id) {
        await supabase.from("game_scores").insert({
          user_id: userData.user.id,
          game_slug: payload.gameSlug,
          score: payload.score,
          score_display: record.scoreDisplay,
          duration_ms: payload.durationMs,
          accuracy: payload.accuracy,
          moves: payload.moves,
          streak: payload.streak,
          difficulty: payload.difficulty,
          metadata: payload.metadata || {},
          created_at: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn("Supabase score sync deferred to local offline store:", e);
    }
  }

  // Update gaming user stats (isolated from study stats)
  updateGamingStats(payload.durationMs, payload.score, isPb);

  return { success: true, isPersonalBest: isPb, record };
}

export function getLocalPersonalBests(): Record<GameSlug, number> {
  if (typeof window === "undefined") return {} as any;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PB_KEY);
    return raw ? JSON.parse(raw) : ({} as any);
  } catch {
    return {} as any;
  }
}

export function saveLocalPersonalBests(pbs: Record<GameSlug, number>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PB_KEY, JSON.stringify(pbs));
  } catch {}
}

export function getLocalScoreHistory(): GameScoreRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveScoreToLocalHistory(record: GameScoreRecord) {
  if (typeof window === "undefined") return;
  try {
    const history = getLocalScoreHistory();
    history.unshift(record);
    // Keep last 100 local records
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
  } catch {}
}

function updateGamingStats(durationMs: number, _score: number, isPb: boolean) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STATS_KEY);
    const stats = raw
      ? JSON.parse(raw)
      : {
          totalGamesPlayed: 0,
          totalPlayTimeSeconds: 0,
          gamesWon: 0,
          achievementsUnlocked: ["first_break"],
        };

    stats.totalGamesPlayed = (stats.totalGamesPlayed || 0) + 1;
    stats.totalPlayTimeSeconds = (stats.totalPlayTimeSeconds || 0) + Math.round(durationMs / 1000);
    if (isPb) {
      stats.gamesWon = (stats.gamesWon || 0) + 1;
    }
    stats.lastPlayedAt = Date.now();

    localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(stats));
  } catch {}
}

/**
 * Generates initial realistic leaderboards with peer aspirant benchmarks
 */
export async function getGameLeaderboard(
  gameSlug: GameSlug,
  timeframe: "global" | "weekly" | "monthly" = "global"
): Promise<LeaderboardEntry[]> {
  const game = CHILL_GAMES.find((g) => g.slug === gameSlug);
  const pbs = getLocalPersonalBests();
  const userScore = pbs[gameSlug];

  // Try Supabase first if available
  if (isSupabaseConfigured()) {
    try {
      const supabase = getBrowserClient();
      const { data, error } = await supabase
        .from("game_scores")
        .select("score, score_display, accuracy, created_at, user_id, profiles(full_name, username)")
        .eq("game_slug", gameSlug)
        .order("score", { ascending: game?.scoringType === "ASCENDING_TIME" })
        .limit(20);

      if (!error && data && data.length > 0) {
        return data.map((item: any, idx: number) => ({
          rank: idx + 1,
          displayName: item.profiles?.full_name || item.profiles?.username || `Aspirant-${idx + 101}`,
          score: item.score,
          scoreDisplay: item.score_display || `${item.score}`,
          accuracy: item.accuracy,
          achievedAt: new Date(item.created_at).toLocaleDateString(),
          isCurrentUser: false,
          verified: true,
        }));
      }
    } catch {}
  }

  // Baseline peer benchmarks for instant immersion & competitive drive
  const mockBenchmarks: Record<GameSlug, { name: string; score: number }[]> = {
    react: [
      { name: "Aarav K. (AIR 42 Hopeful)", score: 184 },
      { name: "Divya M. (IPS Aspirant)", score: 198 },
      { name: "Rohan S. (GS Ranker)", score: 212 },
      { name: "Pooja V. (IFS Focus)", score: 226 },
      { name: "Aditya T.", score: 239 },
      { name: "Kavya N.", score: 254 },
      { name: "Vikram R.", score: 268 },
    ],
    "memory-vault": [
      { name: "Ananya B. (Memory Titan)", score: 12450 },
      { name: "Harsh V. (GS-1 Focus)", score: 11200 },
      { name: "Nisha P.", score: 9850 },
      { name: "Sameer K.", score: 8900 },
      { name: "Tanvi S.", score: 7650 },
    ],
    "focus-flow": [
      { name: "Siddharth J. (Flow State)", score: 18920 },
      { name: "Meera D. (Top Ranker)", score: 16450 },
      { name: "Rajesh G.", score: 13200 },
      { name: "Priya C.", score: 10840 },
      { name: "Arjun L.", score: 8950 },
    ],
    "quick-duel": [
      { name: "Kartik N. (Duel Master)", score: 172 },
      { name: "Sneha R.", score: 189 },
      { name: "Manish K.", score: 205 },
      { name: "Ritu M.", score: 220 },
    ],
    "word-rush": [
      { name: "Devansh S. (Lexicon King)", score: 8400 },
      { name: "Kritika B.", score: 7200 },
      { name: "Akash D.", score: 6150 },
      { name: "Shreya V.", score: 5400 },
    ],
    blink: [
      { name: "Rahul M. (19 Sequence)", score: 19 },
      { name: "Ishita P. (17 Sequence)", score: 17 },
      { name: "Gaurav S. (15 Sequence)", score: 15 },
      { name: "Bhavna T.", score: 13 },
      { name: "Kunal R.", score: 11 },
    ],
  };

  const benchmarks = mockBenchmarks[gameSlug] || [];
  const entries: LeaderboardEntry[] = benchmarks.map((b, i) => ({
    rank: i + 1,
    displayName: b.name,
    score: b.score,
    scoreDisplay: game ? game.bestScoreFormat(b.score) : `${b.score}`,
    achievedAt: "Recently",
    isCurrentUser: false,
    verified: true,
  }));

  // Insert Current User if they have a PB
  if (userScore !== undefined && userScore > 0 && game) {
    const userEntry: LeaderboardEntry = {
      rank: 0,
      displayName: "YOU (Cadet)",
      score: userScore,
      scoreDisplay: game.bestScoreFormat(userScore),
      achievedAt: "Today",
      isCurrentUser: true,
      verified: true,
    };

    entries.push(userEntry);
    if (game.scoringType === "ASCENDING_TIME") {
      entries.sort((a, b) => a.score - b.score);
    } else {
      entries.sort((a, b) => b.score - a.score);
    }

    entries.forEach((e, idx) => {
      e.rank = idx + 1;
    });
  }

  return entries.slice(0, 15);
}
