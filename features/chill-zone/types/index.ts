export type GameSlug =
  | "react"
  | "memory-vault"
  | "focus-flow"
  | "quick-duel"
  | "word-rush"
  | "blink";

export type ScoringDirection = "ASCENDING_TIME" | "DESCENDING_POINTS" | "HIGHEST_STREAK";

export interface ChillGame {
  id: string;
  slug: GameSlug;
  name: string;
  code: string;
  tagline: string;
  description: string;
  icon: string;
  durationLabel: string;
  scoringType: ScoringDirection;
  unit: string;
  bestScoreFormat: (score: number) => string;
  rules: string[];
  tips: string[];
  achievements: string[];
}

export interface GameScoreRecord {
  id: string;
  gameSlug: GameSlug;
  score: number;
  scoreDisplay: string;
  durationMs: number;
  accuracy?: number;
  moves?: number;
  streak?: number;
  difficulty?: string;
  timestamp: number;
  isPersonalBest?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  score: number;
  scoreDisplay: string;
  accuracy?: number;
  achievedAt: string;
  isCurrentUser: boolean;
  avatarSeed?: string;
  verified: boolean;
}

export interface ChillUserStats {
  totalGamesPlayed: number;
  totalPlayTimeSeconds: number;
  gamesWon: number;
  highestScores: Record<GameSlug, number>;
  personalBests: Record<GameSlug, string>;
  achievementsUnlocked: string[];
  lastPlayedAt?: number;
}

export interface GameAchievement {
  id: string;
  gameSlug?: GameSlug | "global";
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface MultiplayerDuelState {
  roomId: string;
  roomCode: string;
  status: "idle" | "searching" | "matched" | "ready" | "waiting_signal" | "go" | "too_early" | "finished" | "timeout" | "disconnected";
  isHost: boolean;
  playerRole: "player1" | "player2";
  opponentName: string;
  playerReactionTime?: number;
  opponentReactionTime?: number;
  winner?: "player" | "opponent" | "tie";
  signalTimestamp?: number;
}
