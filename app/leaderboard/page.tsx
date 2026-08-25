"use client";
import { useState, useEffect } from "react";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import { UserSessionManager } from "@/lib/core/user-context";

interface LeaderboardCadet {
  id: string;
  rank: number;
  cadetName: string;
  cadetTitle: string;
  optionalSubject: string;
  targetYear: number;
  totalXP: number;
  streakDays: number;
  pyqsSolved: number;
  avgAccuracy: number;
  avatarIcon: string;
  badge: "IAS Aspirant" | "IPS Aspirant" | "IFS Aspirant" | "IRS Aspirant";
  isCurrentUser?: boolean;
}

const TOP_CADETS: LeaderboardCadet[] = [
  {
    id: "cadet-01",
    rank: 1,
    cadetName: "Aarav Sharma",
    cadetTitle: "Cabinet Secretary Tier",
    optionalSubject: "PSIR",
    targetYear: 2026,
    totalXP: 14250,
    streakDays: 48,
    pyqsSolved: 1240,
    avgAccuracy: 88.5,
    avatarIcon: "🦁",
    badge: "IAS Aspirant"
  },
  {
    id: "cadet-02",
    rank: 2,
    cadetName: "Pooja Verma",
    cadetTitle: "Chief Secretary Tier",
    optionalSubject: "Sociology",
    targetYear: 2026,
    totalXP: 13800,
    streakDays: 42,
    pyqsSolved: 1180,
    avgAccuracy: 86.2,
    avatarIcon: "🦅",
    badge: "IFS Aspirant"
  },
  {
    id: "cadet-03",
    rank: 3,
    cadetName: "Vikramaditya Roy",
    cadetTitle: "Principal Secretary Tier",
    optionalSubject: "Geography",
    targetYear: 2026,
    totalXP: 12950,
    streakDays: 39,
    pyqsSolved: 1050,
    avgAccuracy: 84.8,
    avatarIcon: "🐅",
    badge: "IPS Aspirant"
  },
  {
    id: "cadet-04",
    rank: 4,
    cadetName: "Sneha Mukherjee",
    cadetTitle: "District Magistrate Tier",
    optionalSubject: "History",
    targetYear: 2026,
    totalXP: 11400,
    streakDays: 31,
    pyqsSolved: 940,
    avgAccuracy: 82.1,
    avatarIcon: "🐺",
    badge: "IAS Aspirant"
  },
  {
    id: "cadet-05",
    rank: 5,
    cadetName: "Rohan Nair",
    cadetTitle: "District Magistrate Tier",
    optionalSubject: "Anthropology",
    targetYear: 2027,
    totalXP: 10850,
    streakDays: 28,
    pyqsSolved: 890,
    avgAccuracy: 81.4,
    avatarIcon: "🦉",
    badge: "IRS Aspirant"
  },
  {
    id: "cadet-06",
    rank: 6,
    cadetName: "Ananya Iyer",
    cadetTitle: "Sub-Divisional Magistrate Tier",
    optionalSubject: "Economics",
    targetYear: 2026,
    totalXP: 9600,
    streakDays: 25,
    pyqsSolved: 780,
    avgAccuracy: 79.5,
    avatarIcon: "🐆",
    badge: "IAS Aspirant"
  },
  {
    id: "cadet-07",
    rank: 7,
    cadetName: "Devendra Patel",
    cadetTitle: "Sub-Divisional Magistrate Tier",
    optionalSubject: "Public Administration",
    targetYear: 2026,
    totalXP: 8900,
    streakDays: 22,
    pyqsSolved: 710,
    avgAccuracy: 78.0,
    avatarIcon: "🛡️",
    badge: "IPS Aspirant"
  }
];

export default function LeaderboardPage() {
  const [user] = useState(UserSessionManager.getActiveUser());
  const [timeFilter, setTimeFilter] = useState<"weekly" | "allTime">("weekly");
  const [subjectFilter, setSubjectFilter] = useState<string>("All");

  const currentUserData: LeaderboardCadet = {
    id: user?.id || "my-id",
    rank: 14,
    cadetName: user?.fullName || user?.email?.split("@")[0] || "Cadet Aspirant",
    cadetTitle: "Probationer Officer Tier",
    optionalSubject: user?.optionalSubject || "PSIR",
    targetYear: user?.targetYear || 2026,
    totalXP: 6450,
    streakDays: 14,
    pyqsSolved: 420,
    avgAccuracy: 76.4,
    avatarIcon: "⚔️",
    badge: "IAS Aspirant",
    isCurrentUser: true
  };

  const cadets = [...TOP_CADETS];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0a0b16 0%, #120d24 50%, #080712 100%)" }}>
      <AppUniversalHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-semibold uppercase tracking-wider"
            style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc" }}>
            <span>🏆</span> All-India Cadet Rank Registry
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            National UPSC Cadet Leaderboard
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            Compete with thousands of serious UPSC aspirants across India. Measure your consistency, accuracy, and spaced repetition streaks.
          </p>
        </div>

        {/* User's Floating Personal Rank Banner */}
        <div className="mb-8 p-5 sm:p-6 rounded-3xl backdrop-blur-xl"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(79,70,229,0.2))",
            border: "1px solid rgba(168,85,247,0.4)",
            boxShadow: "0 12px 32px rgba(168,85,247,0.15)"
          }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-purple-500/20 border border-purple-500/30">
                {currentUserData.avatarIcon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{currentUserData.cadetName}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                    You
                  </span>
                </div>
                <p className="text-xs text-purple-300 font-medium">{currentUserData.cadetTitle} • {currentUserData.optionalSubject} ({currentUserData.targetYear})</p>
              </div>
            </div>

            <div className="flex items-center gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl font-black text-amber-400">#{currentUserData.rank}</div>
                <div className="text-[11px] text-gray-400 font-medium">All-India Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-purple-400">{currentUserData.totalXP.toLocaleString()}</div>
                <div className="text-[11px] text-gray-400 font-medium">Cadet XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-emerald-400">{currentUserData.streakDays}d 🔥</div>
                <div className="text-[11px] text-gray-400 font-medium">Daily Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-blue-400">{currentUserData.avgAccuracy}%</div>
                <div className="text-[11px] text-gray-400 font-medium">PYQ Accuracy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimeFilter("weekly")}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: timeFilter === "weekly" ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.03)",
                border: timeFilter === "weekly" ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(255,255,255,0.06)",
                color: timeFilter === "weekly" ? "#e9d5ff" : "#9ca3af"
              }}>
              🔥 Weekly Sprint
            </button>
            <button
              onClick={() => setTimeFilter("allTime")}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: timeFilter === "allTime" ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.03)",
                border: timeFilter === "allTime" ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(255,255,255,0.06)",
                color: timeFilter === "allTime" ? "#e9d5ff" : "#9ca3af"
              }}>
              👑 All-Time Hall of Fame
            </button>
          </div>

          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span>Filter Optional:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs text-white bg-black/40 border border-white/10 focus:outline-none">
              <option value="All">All Optionals</option>
              <option value="PSIR">PSIR</option>
              <option value="Sociology">Sociology</option>
              <option value="Geography">Geography</option>
              <option value="History">History</option>
              <option value="Anthropology">Anthropology</option>
            </select>
          </div>
        </div>

        {/* Podium for Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {cadets.slice(0, 3).map((cadet, i) => {
            const podiumRanks = [1, 0, 2]; // 2nd, 1st, 3rd presentation
            const currentCadet = cadets[podiumRanks[i]];
            const isFirst = currentCadet.rank === 1;

            return (
              <div
                key={currentCadet.id}
                className="p-6 rounded-3xl backdrop-blur-xl text-center flex flex-col items-center justify-between"
                style={{
                  background: isFirst ? "linear-gradient(135deg, rgba(234,179,8,0.15), rgba(180,83,9,0.2))" : "rgba(255,255,255,0.03)",
                  border: isFirst ? "1px solid rgba(234,179,8,0.5)" : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isFirst ? "0 16px 36px rgba(234,179,8,0.15)" : "none"
                }}>
                <div>
                  <div className="relative inline-block mb-3">
                    <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-4xl bg-white/5 border border-white/10">
                      {currentCadet.avatarIcon}
                    </div>
                    <span className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                      currentCadet.rank === 1 ? "bg-amber-400 text-black shadow-lg" : currentCadet.rank === 2 ? "bg-slate-300 text-black" : "bg-amber-700 text-white"
                    }`}>
                      {currentCadet.rank === 1 ? "👑" : currentCadet.rank}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-0.5">{currentCadet.cadetName}</h3>
                  <p className="text-xs text-gray-400 font-medium mb-3">{currentCadet.cadetTitle}</p>
                </div>

                <div className="w-full pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="font-bold text-purple-400">{currentCadet.totalXP.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500">XP</div>
                  </div>
                  <div>
                    <div className="font-bold text-emerald-400">{currentCadet.streakDays}d 🔥</div>
                    <div className="text-[10px] text-gray-500">Streak</div>
                  </div>
                  <div>
                    <div className="font-bold text-blue-400">{currentCadet.avgAccuracy}%</div>
                    <div className="text-[10px] text-gray-500">Accuracy</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Leaderboard Table */}
        <div className="rounded-3xl backdrop-blur-xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="p-4 sm:p-6 pb-2 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">National Roster (Top 500)</h3>
            <span className="text-xs text-gray-500">Updated every 15 minutes</span>
          </div>

          <div className="divide-y divide-white/5">
            {cadets.map((cadet) => (
              <div
                key={cadet.id}
                className="p-4 sm:px-6 flex items-center justify-between gap-4 transition-all hover:bg-white/[0.02]">
                <div className="flex items-center gap-4 min-w-[200px]">
                  <span className={`w-8 text-center text-sm font-black ${
                    cadet.rank === 1 ? "text-amber-400" : cadet.rank === 2 ? "text-slate-300" : cadet.rank === 3 ? "text-amber-600" : "text-gray-400"
                  }`}>
                    #{cadet.rank}
                  </span>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl bg-white/5 border border-white/5">
                    {cadet.avatarIcon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      {cadet.cadetName}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 text-gray-400">
                        {cadet.optionalSubject}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">{cadet.cadetTitle}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-10 text-xs">
                  <div className="text-right hidden sm:block">
                    <div className="font-bold text-white">{cadet.pyqsSolved} Qs</div>
                    <div className="text-[10px] text-gray-500">PYQs Solved</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-400">{cadet.avgAccuracy}%</div>
                    <div className="text-[10px] text-gray-500">Accuracy</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-400">{cadet.streakDays}d 🔥</div>
                    <div className="text-[10px] text-gray-500">Streak</div>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <div className="font-bold text-purple-400">{cadet.totalXP.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500">XP</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
