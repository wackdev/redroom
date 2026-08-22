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
import { sound } from "@/lib/audio/sound-engine";

export default function ChillZonePage() {
  const { stats, refreshStats } = useChillStats();
  const [activeGame, setActiveGame] = useState<ChillGame | null>(null);
  const [leaderboardGame, setLeaderboardGame] = useState<ChillGame | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleMute = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
  };

  const handleGameFinish = () => {
    refreshStats();
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A]/30">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#050505]/80 px-4 py-3.5 backdrop-blur-xl sm:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition"
          >
            ← COMMAND CENTRE
          </Link>
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[#8C8C8C]">
            <span className="text-white/20">/</span>
            <span className="text-white font-bold">CHILL ZONE</span>
            <span className="rounded-full bg-[#D8A63A]/20 px-2 py-0.5 text-[9px] font-black text-[#F4C95D]">
              ARCADE LOUNGE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={handleToggleMute}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#8C8C8C] hover:text-white transition"
          >
            {isMuted ? "🔇 MUTED" : "🔊 SOUND ON"}
          </button>
          <button
            onClick={() => setShowStatsModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3 py-1.5 font-bold text-[#F4C95D] hover:bg-[#D8A63A]/20 transition shadow-[0_0_15px_rgba(216,166,58,0.2)]"
          >
            <span>🏆</span> PROFILE
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 sm:p-8">
        {activeGame ? (
          /* Active Game Playing View */
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
        ) : (
          /* Chill Zone Lounge Hub */
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
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition"
                >
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
                className="whitespace-nowrap rounded-2xl border border-[#D8A63A] bg-[#D8A63A] px-6 py-3 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_20px_rgba(216,166,58,0.3)]"
              >
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
  );
}
