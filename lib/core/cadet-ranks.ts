/**
 * WHYNOTUPSC Cadet Rank & Badge Engine
 * Gamifies civil services preparation milestones and discipline tracking.
 */

export interface CadetRank {
  level: number;
  title: string;
  cadre: string;
  icon: string;
  minHours: number;
  nextRankHours: number;
  perks: string[];
  color: string;
}

export interface CadetBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number; // 0 to 100
  criteria: string;
}

export const CADET_RANKS: CadetRank[] = [
  {
    level: 1,
    title: "LBSNAA Probationer",
    cadre: "Foundational Course // Mussoorie",
    icon: "🥉",
    minHours: 0,
    nextRankHours: 50,
    perks: ["Access to Basic Syllabus Hub", "Daily Current Affairs Briefing"],
    color: "#8C8C8C",
  },
  {
    level: 2,
    title: "Sub-Divisional Magistrate (SDM)",
    cadre: "Sub-Division Administration // Field Posting",
    icon: "🥈",
    minHours: 50,
    nextRankHours: 150,
    perks: ["AI Mains Rubric Evaluator", "CSAT Speed Matrix Simulator"],
    color: "#60A5FA",
  },
  {
    level: 3,
    title: "District Magistrate (DM)",
    cadre: "District Collectorate // Executive Authority",
    icon: "🥇",
    minHours: 150,
    nextRankHours: 300,
    perks: ["GS-4 Ethics Case Dilemma Engine", "Neural Spaced Repetition Radar"],
    color: "#F4C95D",
  },
  {
    level: 4,
    title: "Divisional Commissioner",
    cadre: "State Secretariat // Policy Coordination",
    icon: "🎖️",
    minHours: 300,
    nextRankHours: 500,
    perks: ["Voice Personality Test Simulator", "Advanced Eliminator Probability Matrix"],
    color: "#A78BFA",
  },
  {
    level: 5,
    title: "Cabinet Secretary",
    cadre: "Rashtrapati Bhavan // Prime Minister's Secretariat",
    icon: "👑",
    minHours: 500,
    nextRankHours: 1000,
    perks: ["Full Sovereign AI Strategist Access", "National Percentile Master Badge"],
    color: "#D8A63A",
  },
];

export function calculateCadetRank(totalHours: number): {
  currentRank: CadetRank;
  nextRank: CadetRank | null;
  progressPercent: number;
} {
  let currentRank = CADET_RANKS[0];
  for (let i = CADET_RANKS.length - 1; i >= 0; i--) {
    if (totalHours >= CADET_RANKS[i].minHours) {
      currentRank = CADET_RANKS[i];
      break;
    }
  }

  const nextRank =
    currentRank.level < CADET_RANKS.length ? CADET_RANKS[currentRank.level] : null;

  let progressPercent = 100;
  if (nextRank) {
    const range = nextRank.minHours - currentRank.minHours;
    const completed = totalHours - currentRank.minHours;
    progressPercent = Math.min(100, Math.max(0, Math.round((completed / range) * 100)));
  }

  return { currentRank, nextRank, progressPercent };
}

export function computeCadetBadges(stats: {
  totalHours: number;
  streakDays: number;
  mainsAnswerCount: number;
  pyqSolvedCount: number;
  revisionsDone: number;
}): CadetBadge[] {
  return [
    {
      id: "streak_warrior",
      name: "Iron Will Consistency",
      description: "Maintained a continuous daily study streak of 7+ days.",
      icon: "🔥",
      unlocked: stats.streakDays >= 7,
      progress: Math.min(100, Math.round((stats.streakDays / 7) * 100)),
      criteria: "7 Consecutive Days",
    },
    {
      id: "elimination_grandmaster",
      name: "Prelims Eliminator Grandmaster",
      description: "Solved 50+ Previous Year Questions with analytical elimination.",
      icon: "🎯",
      unlocked: stats.pyqSolvedCount >= 50,
      progress: Math.min(100, Math.round((stats.pyqSolvedCount / 50) * 100)),
      criteria: "50 PYQs Practiced",
    },
    {
      id: "mains_architect",
      name: "Mains Dimensionist",
      description: "Drafted and evaluated 10+ Mains model answers.",
      icon: "✍️",
      unlocked: stats.mainsAnswerCount >= 10,
      progress: Math.min(100, Math.round((stats.mainsAnswerCount / 10) * 100)),
      criteria: "10 Mains Answers Evaluated",
    },
    {
      id: "memory_titan",
      name: "Neural Spaced Recall Titan",
      description: "Completed 25+ spaced repetition recall reviews on schedule.",
      icon: "🧠",
      unlocked: stats.revisionsDone >= 25,
      progress: Math.min(100, Math.round((stats.revisionsDone / 25) * 100)),
      criteria: "25 Topics Mastered",
    },
    {
      id: "centurion_hours",
      name: "Centurion Scholar",
      description: "Logged 100+ focused deep-work hours.",
      icon: "⚡",
      unlocked: stats.totalHours >= 100,
      progress: Math.min(100, Math.round((stats.totalHours / 100) * 100)),
      criteria: "100 Focus Hours",
    },
  ];
}
