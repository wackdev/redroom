"use client";

import { useState } from "react";
import Link from "next/link";
import { CHILL_GAMES } from "@/features/chill-zone/constants/games";
import { ChillGame } from "@/features/chill-zone/types";
import { useChillStats } from "@/features/chill-zone/hooks/use-chill-stats";
import ChillZoneHero from "@/features/chill-zone/components/ChillZoneHero";
import GamePortalCard from "@/features/chill-zone/components/GamePortalCard";
import ChillLeaderboard from "@/features/chill-zone/components/ChillLeaderboard";
import ChillStatsModal from "@/features/chill-zone/components/ChillStatsModal";
import WhyNotReact from "@/features/chill-zone/games/react/WhyNotReact";
import MemoryVault from "@/features/chill-zone/games/memory-vault/MemoryVault";
import FocusFlow from "@/features/chill-zone/games/focus-flow/FocusFlow";
import QuickDuel from "@/features/chill-zone/games/quick-duel/QuickDuel";
import WordRush from "@/features/chill-zone/games/word-rush/WordRush";
import BlinkGame from "@/features/chill-zone/games/blink/BlinkGame";
import MultiplayerBattleArena from "@/components/chill-zone/MultiplayerBattleArena";
import { sound } from "@/lib/audio/sound-engine";
import AuthGuard from "@/components/auth/AuthGuard";
import AppUniversalHeader from "@/components/AppUniversalHeader";

export default function ChillZonePage() {
  const { stats, refreshStats } = useChillStats();
  const [activeTab, setActiveTab] = useState<"multiplayer" | "solo">("multiplayer");
  const [activeGame, setActiveGame] = useState<ChillGame | null>(null);
  const [leaderboardGame, setLeaderboardGame] = useState<ChillGame | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const handleGameFinish = () => {
    refreshStats();
  };

  return (
    <AuthGuard>
      <div className="relative flex min-h-screen w-full flex-col bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A]/30">
        {/* UNIVERSAL LUXURY HUD HEADER */}
        <AppUniversalHeader moduleName="Chill Zone & Multiplayer Battle Arena" moduleBadge="CADET ESPORTS & REFRESH" />

        {/* Main Container */}
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 sm:p-8 space-y-6">
          {/* Main Navigation Mode Switcher */}
          {!activeGame && (
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <button
                onClick={() => {
                  sound.playSelect();
                  setActiveTab("multiplayer");
                }}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2"
                style={{
                  background: activeTab === "multiplayer" ? "rgba(216,166,58,0.25)" : "rgba(255,255,255,0.03)",
                  border: activeTab === "multiplayer" ? "1px solid rgba(216,166,58,0.5)" : "1px solid rgba(255,255,255,0.06)",
                  color: activeTab === "multiplayer" ? "#F4C95D" : "#9ca3af",
                }}>
                <span>⚔️</span>
                <span>Live Multiplayer Battle Arena (1v1, Ludo, Battle Royale)</span>
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  setActiveTab("solo");
                }}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2"
                style={{
                  background: activeTab === "solo" ? "rgba(216,166,58,0.25)" : "rgba(255,255,255,0.03)",
                  border: activeTab === "solo" ? "1px solid rgba(216,166,58,0.5)" : "1px solid rgba(255,255,255,0.06)",
                  color: activeTab === "solo" ? "#F4C95D" : "#9ca3af",
                }}>
                <span>🎮</span>
                <span>Solo Neuro-Refresh Arcade (6 Games)</span>
              </button>
            </div>
          )}

          {/* ACTIVE MULTIPLAYER BATTLE ARENA */}
          {activeTab === "multiplayer" && !activeGame && (
            <MultiplayerBattleArena onExit={() => setActiveTab("solo")} />
          )}

          {/* ACTIVE SOLO GAME PLAYING VIEW */}
          {activeTab === "solo" && activeGame && (
            <div className="flex flex-col items-center justify-center">
              {activeGame.slug === "react" && (
                <WhyNotReact
                  onBack={() => {
                    setActiveGame(null);
                    refreshStats();
                  }}
                  onFinish={handleGameFinish}
                />
              )}
              {activeGame.slug === "memory-vault" && (
                <MemoryVault
                  onBack={() => {
                    setActiveGame(null);
                    refreshStats();
                  }}
                  onFinish={handleGameFinish}
                />
              )}
              {activeGame.slug === "focus-flow" && (
                <FocusFlow
                  onBack={() => {
                    setActiveGame(null);
                    refreshStats();
                  }}
                  onFinish={handleGameFinish}
                />
              )}
              {activeGame.slug === "quick-duel" && (
                <QuickDuel
                  onBack={() => {
                    setActiveGame(null);
                    refreshStats();
                  }}
                  onFinish={handleGameFinish}
                />
              )}
              {activeGame.slug === "word-rush" && (
                <WordRush
                  onBack={() => {
                    setActiveGame(null);
                    refreshStats();
                  }}
                  onFinish={handleGameFinish}
                />
              )}
              {activeGame.slug === "blink" && (
                <BlinkGame
                  onBack={() => {
                    setActiveGame(null);
                    refreshStats();
                  }}
                  onFinish={handleGameFinish}
                />
              )}
            </div>
          )}

          {/* SOLO ARCADE PORTALS HUB */}
          {activeTab === "solo" && !activeGame && (
            <div className="space-y-8">
              {/* Hero Section */}
              <ChillZoneHero
                onOpenStats={() => setShowStatsModal(true)}
                totalGames={stats.totalGamesPlayed}
              />

              {/* 6 Game Portals Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-mono text-sm font-black uppercase text-[#D8A63A] tracking-wider">
                      ARCADE PORTALS // 6 GAMES
                    </h2>
                    <p className="font-mono text-[11px] text-[#8C8C8C]">
                      Select a portal for a 30-second to 2-minute neural refresh
                    </p>
                  </div>
                  <button
                    onClick={() => setLeaderboardGame(CHILL_GAMES[0])}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition">
                    GLOBAL LEADERBOARDS ↗
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {CHILL_GAMES.map((game) => (
                    <GamePortalCard
                      key={game.id}
                      game={game}
                      personalBestDisplay={stats.personalBests[game.slug] || "No Record"}
                      onPlay={(g) => setActiveGame(g)}
                      onOpenLeaderboard={(g) => setLeaderboardGame(g)}
                    />
                  ))}
                </div>
              </div>

              {/* Return to Study Philosophy Card */}
              <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 text-center sm:flex-row sm:text-left">
                <div>
                  <span className="font-mono text-[9px] font-black tracking-widest text-[#F4C95D] uppercase">
                    THE WHYNOTUPSC CADET PROMISE
                  </span>
                  <h3 className="font-mono text-sm font-black text-white uppercase">
                    TAKE A BREAK. DON'T BREAK THE MOMENTUM.
                  </h3>
                  <p className="mt-1 max-w-xl text-xs text-[#8C8C8C]">
                    Gaming in Chill Zone is designed to prevent burnout during 10-hour study marathons. Once refreshed, return immediately to your daily syllabus targets.
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="whitespace-nowrap rounded-2xl border border-[#D8A63A] bg-[#D8A63A] px-6 py-3 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_20px_rgba(216,166,58,0.3)]">
                  RETURN TO PREP DASHBOARD →
                </Link>
              </div>
            </div>
          )}
        </main>

        {/* Leaderboard Modal */}
        {leaderboardGame && (
          <ChillLeaderboard
            initialGame={leaderboardGame}
            onClose={() => setLeaderboardGame(null)}
            onSelectGameToPlay={(g) => {
              setLeaderboardGame(null);
              setActiveGame(g);
            }}
          />
        )}

        {/* Stats & Achievements Modal */}
        {showStatsModal && (
          <ChillStatsModal onClose={() => setShowStatsModal(false)} />
        )}
      </div>
    </AuthGuard>
  );
}
