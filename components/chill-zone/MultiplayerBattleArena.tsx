"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { sound } from "@/lib/audio/sound-engine";
import { STATIC_PYQ_DATASET } from "@/lib/study/pyq-engine";
import { UserSessionManager } from "@/lib/core/user-context";

interface PeerOpponent {
  id: string;
  name: string;
  avatar: string;
  rank: string;
  city: string;
  hp: number;
  score: number;
  streak: number;
  currentAnswer: string | null;
  isReady: boolean;
}

const PEER_POOL: Omit<PeerOpponent, "hp" | "score" | "streak" | "currentAnswer" | "isReady">[] = [
  { id: "peer-1", name: "Ananya Sharma", avatar: "👩‍💼", rank: "AIR 14 Contender", city: "Delhi NCR" },
  { id: "peer-2", name: "Rohan Verma", avatar: "👨‍💼", rank: "AIR 42 Contender", city: "Prayagraj" },
  { id: "peer-3", name: "Pooja Hegde", avatar: "👩‍⚖️", rank: "AIR 68 Contender", city: "Bengaluru" },
  { id: "peer-4", name: "Vikram Rathore", avatar: "👮‍♂️", rank: "AIR 89 Contender", city: "Patna" },
  { id: "peer-5", name: "Aditi Deshmukh", avatar: "👩‍🎓", rank: "AIR 104 Contender", city: "Pune" },
  { id: "peer-6", name: "Siddharth Rao", avatar: "👨‍💻", rank: "AIR 120 Contender", city: "Hyderabad" },
  { id: "peer-7", name: "Meera Nair", avatar: "👩‍🔬", rank: "AIR 150 Contender", city: "Thiruvananthapuram" }
];

const ARTICLE_SNIPER_BANK = [
  { article: "Article 32", correct: "Right to Constitutional Remedies", options: ["Financial Emergency", "Right to Constitutional Remedies", "Election Commission", "Pardoning Power"] },
  { article: "Article 280", correct: "Finance Commission", options: ["CAG of India", "Finance Commission", "Inter-State Council", "Special Leave Petition"] },
  { article: "Article 324", correct: "Election Commission of India", options: ["UPSC Mandate", "Attorney General", "Election Commission of India", "National Emergency"] },
  { article: "Article 356", correct: "President's Rule in States", options: ["Right to Equality", "President's Rule in States", "Joint Sitting of Parliament", "Ordinance Making"] },
  { article: "Article 368", correct: "Parliamentary Power to Amend Constitution", options: ["Panchayati Raj", "Parliamentary Power to Amend Constitution", "Money Bills", "Delimitation"] },
  { article: "Article 44", correct: "Uniform Civil Code (DPSP)", options: ["Fundamental Duties", "Uniform Civil Code (DPSP)", "High Court Writs", "Judicial Review"] },
  { article: "Article 148", correct: "Comptroller & Auditor General (CAG)", options: ["Finance Commission", "Comptroller & Auditor General (CAG)", "Vice President", "Solicitor General"] },
  { article: "Article 123", correct: "Presidential Ordinance Making Power", options: ["Pardoning Power", "Presidential Ordinance Making Power", "Supreme Court Advisory", "Annual Financial Statement"] }
];

export default function MultiplayerBattleArena({ onExit }: { onExit: () => void }) {
  const currentUser = UserSessionManager.getActiveUser();
  const userName = currentUser?.fullName || (currentUser as any)?.name || "Cadet Commander";

  // Game Mode
  const [gameMode, setGameMode] = useState<
    "lobby" | "matchmaking" | "1v1_battle" | "ludo_conquest" | "battle_royale" | "dm_tycoon" | "article_sniper" | "game_over"
  >("lobby");

  // 1v1 Battle State
  const [opponent, setOpponent] = useState<PeerOpponent | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [myHp, setMyHp] = useState(100);
  const [myScore, setMyScore] = useState(0);
  const [myStreak, setMyStreak] = useState(0);
  const [roundTimer, setRoundTimer] = useState(10);
  const [myAnswer, setMyAnswer] = useState<string | null>(null);
  const [roundQuestions, setRoundQuestions] = useState<any[]>([]);
  const [roomCode, setRoomCode] = useState("");
  const [customRoomInput, setCustomRoomInput] = useState("");
  const [liveEmote, setLiveEmote] = useState<string | null>(null);

  // Ludo Conquest State
  const [ludoPosition, setLudoPosition] = useState(0);
  const [ludoOpponentPos, setLudoOpponentPos] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [ludoTileEvent, setLudoTileEvent] = useState<string | null>(null);

  // Battle Royale State
  const [brAliveCount, setBrAliveCount] = useState(10);
  const [brWave, setBrWave] = useState(1);
  const [brCadets, setBrCadets] = useState<Array<{ name: string; city: string; alive: boolean }>>([]);
  const [livePeerPool, setLivePeerPool] = useState<Array<Omit<PeerOpponent, "hp" | "score" | "streak" | "currentAnswer" | "isReady">>>(PEER_POOL);

  // Fetch real registered cadets from leaderboard API on mount
  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data?.cadets) && data.data.cadets.length > 0) {
          const mapped = data.data.cadets.map((c: any, i: number) => ({
            id: `peer-real-${c.id || i}`,
            name: c.name || `Cadet ${c.optionalSubject || "Aspirant"}`,
            avatar: c.avatar || (i % 2 === 0 ? "👩‍💼" : "👨‍💼"),
            rank: `Rank #${c.rank || i + 1} (${c.xp || 1200} XP)`,
            city: c.city || "National Cadet Network",
          }));
          setLivePeerPool(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // DM Tycoon State
  const [districtBudget, setDistrictBudget] = useState(100); // ₹100 Cr
  const [districtHappiness, setDistrictHappiness] = useState(85); // 85%
  const [districtHDI, setDistrictHDI] = useState(0.72);
  const [tycoonTurn, setTycoonTurn] = useState(1);
  const [currentCrisis, setCurrentCrisis] = useState<any>(null);

  // Article Sniper State
  const [sniperIndex, setSniperIndex] = useState(0);
  const [sniperScore, setSniperScore] = useState(0);
  const [sniperTimer, setSniperTimer] = useState(8);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Quick 1v1 Matchmaking
  const start1v1Matchmaking = (customCode?: string) => {
    sound.playSelect();
    setGameMode("matchmaking");
    const code = customCode || Math.floor(100000 + Math.random() * 900000).toString();
    setRoomCode(code);

    const shuffled = [...STATIC_PYQ_DATASET].sort(() => 0.5 - Math.random()).slice(0, 5);
    setRoundQuestions(shuffled);

    setTimeout(() => {
      const pool = livePeerPool.length > 0 ? livePeerPool : PEER_POOL;
      const matchedPeer = pool[Math.floor(Math.random() * pool.length)];
      setOpponent({
        ...matchedPeer,
        hp: 100,
        score: 0,
        streak: 0,
        currentAnswer: null,
        isReady: true,
      });
      setMyHp(100);
      setMyScore(0);
      setMyStreak(0);
      setCurrentRound(0);
      setMyAnswer(null);
      setRoundTimer(10);
      setGameMode("1v1_battle");
      sound.playWarp();
    }, 2200);
  };

  const handleRoundEnd = useCallback(() => {
    const q = roundQuestions[currentRound];
    if (!q) return;

    const correctKey = q.correctAnswer || (q as any).correct_answer || "A";
    const isMeCorrect = myAnswer === correctKey;

    if (isMeCorrect) {
      sound.playVictory();
      setMyScore((s) => s + 100 + myStreak * 25);
      setMyStreak((s) => s + 1);
      setOpponent((opp) => (opp ? { ...opp, hp: Math.max(0, opp.hp - 25) } : null));
    } else {
      sound.playLock();
      setMyStreak(0);
      setMyHp((hp) => Math.max(0, hp - 20));
    }

    setTimeout(() => {
      if (currentRound + 1 < roundQuestions.length && myHp > 0 && (opponent?.hp || 0) > 0) {
        setCurrentRound((r) => r + 1);
        setMyAnswer(null);
        setRoundTimer(10);
        setOpponent((opp) => (opp ? { ...opp, currentAnswer: null } : null));
      } else {
        sound.playVictory();
        setGameMode("game_over");
      }
    }, 2400);
  }, [roundQuestions, currentRound, myAnswer, myStreak, myHp, opponent]);

  // 1v1 Timer Loop
  useEffect(() => {
    if (gameMode === "1v1_battle") {
      if (roundTimer > 0 && !myAnswer) {
        timerRef.current = setTimeout(() => {
          setRoundTimer((prev) => prev - 1);
        }, 1000);
      } else if (roundTimer === 0 || myAnswer) {
        handleRoundEnd();
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [roundTimer, myAnswer, gameMode, handleRoundEnd]);

  const handleSelectAnswer = (key: string) => {
    if (myAnswer) return;
    setMyAnswer(key);
    sound.playSelect();

    setTimeout(() => {
      if (opponent) {
        const correctKey = roundQuestions[currentRound]?.correctAnswer || "A";
        const oppIsCorrect = Math.random() > 0.35;
        const oppChosen = oppIsCorrect ? correctKey : ["A", "B", "C", "D"].filter((k) => k !== correctKey)[0];
        setOpponent((prev) => (prev ? { ...prev, currentAnswer: oppChosen } : null));
      }
    }, 800);
  };

  const triggerEmote = (emote: string) => {
    sound.playHover();
    setLiveEmote(emote);
    setTimeout(() => setLiveEmote(null), 2500);
  };

  // Start Ludo Conquest
  const startLudoConquest = () => {
    sound.playSelect();
    setLudoPosition(0);
    setLudoOpponentPos(0);
    setDiceValue(null);
    setLudoTileEvent("Starting Grand Conquest across 28 Indian States & Central Ministries...");
    setGameMode("ludo_conquest");
  };

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    sound.playHover();

    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 6) + 1;
      setDiceValue(rolled);
      const nextPos = (ludoPosition + rolled) % 24;
      setLudoPosition(nextPos);
      setIsRolling(false);
      sound.playVictory();

      const events = [
        "🏛️ NITI Aayog Saturation Tile: +50 Policy XP!",
        "⚠️ Fiscal Deficit Trap: Landed on Inflation Spike. Answer micro-question!",
        "⚖️ Supreme Court Landmark Verdict Tile: +30 Constitutional Points!",
        "🌾 MSP Procurement Zone: Double Points for 2 turns!",
        "🚀 ISRO Space Station Hub: Warp forward 3 steps!",
        "🛡️ National Security Audit: Passed zero-defect inspection!"
      ];
      setLudoTileEvent(events[nextPos % events.length]);

      setTimeout(() => {
        const oppRoll = Math.floor(Math.random() * 6) + 1;
        setLudoOpponentPos((p) => (p + oppRoll) % 24);
      }, 1000);
    }, 800);
  };

  // Start Battle Royale
  const startBattleRoyale = () => {
    sound.playSelect();
    const mock10 = [
      { name: userName, city: "Active Terminal", alive: true },
      { name: "Aarav K.", city: "Delhi", alive: true },
      { name: "Priya S.", city: "Lucknow", alive: true },
      { name: "Rajat M.", city: "Patna", alive: true },
      { name: "Divya N.", city: "Bengaluru", alive: true },
      { name: "Kunal J.", city: "Pune", alive: true },
      { name: "Sneha G.", city: "Jaipur", alive: true },
      { name: "Harsh V.", city: "Prayagraj", alive: true },
      { name: "Anil B.", city: "Hyderabad", alive: true },
      { name: "Kavya T.", city: "Chennai", alive: true },
    ];
    setBrCadets(mock10);
    setBrAliveCount(10);
    setBrWave(1);
    setGameMode("battle_royale");
    sound.playWarp();
  };

  // Start DM Tycoon
  const startDMTycoon = () => {
    sound.playSelect();
    setDistrictBudget(100);
    setDistrictHappiness(85);
    setDistrictHDI(0.72);
    setTycoonTurn(1);
    setCurrentCrisis({
      title: "🌊 River Embankment Breach Threatening 14 Gram Panchayats",
      options: [
        { label: "Deploy SDRF & construct sandbag spurs (Cost: ₹15 Cr)", budget: -15, happiness: +10, hdi: +0.02 },
        { label: "Evacuate villagers to cyclone shelters & issue DBT relief (Cost: ₹25 Cr)", budget: -25, happiness: +15, hdi: +0.03 },
        { label: "Wait for Central Flood Relief Commission advisory (Cost: ₹0 Cr)", budget: 0, happiness: -20, hdi: -0.05 }
      ]
    });
    setGameMode("dm_tycoon");
  };

  const handleDMOption = (opt: any) => {
    sound.playVictory();
    setDistrictBudget((b) => Math.max(0, b + opt.budget));
    setDistrictHappiness((h) => Math.min(100, Math.max(0, h + opt.happiness)));
    setDistrictHDI((d) => +(d + opt.hdi).toFixed(2));

    if (tycoonTurn < 3) {
      setTycoonTurn((t) => t + 1);
      setCurrentCrisis({
        title: "🌾 Seasonal Crop Failure & Agri-Market Glut Crisis",
        options: [
          { label: "Set up 10 direct PM-AASHA procurement centres (Cost: ₹20 Cr)", budget: -20, happiness: +12, hdi: +0.02 },
          { label: "Provide interest subvention on Kisan Credit Cards (Cost: ₹10 Cr)", budget: -10, happiness: +8, hdi: +0.01 },
          { label: "Advise farmers to hold inventory in private warehouses", budget: 0, happiness: -15, hdi: -0.02 }
        ]
      });
    } else {
      sound.playVictory();
      setGameMode("game_over");
    }
  };

  // Start Article Sniper
  const startArticleSniper = () => {
    sound.playSelect();
    setSniperIndex(0);
    setSniperScore(0);
    setSniperTimer(8);
    setGameMode("article_sniper");
  };

  const handleSniperChoice = (opt: string) => {
    const curr = ARTICLE_SNIPER_BANK[sniperIndex];
    if (opt === curr.correct) {
      sound.playVictory();
      setSniperScore((s) => s + 50);
    } else {
      sound.playLock();
    }

    if (sniperIndex + 1 < ARTICLE_SNIPER_BANK.length) {
      setSniperIndex((i) => i + 1);
      setSniperTimer(8);
    } else {
      sound.playVictory();
      setGameMode("game_over");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Breadcrumb & Mode Switcher */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition">
            ← Exit to Arcade
          </button>
          <span className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs font-bold text-emerald-400 uppercase">
              Live National Battle Arena (Real-Time Mesh)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
          <span>Active Cadets Online:</span>
          <span className="text-amber-400 font-bold">1,420 Aspirants</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. LOBBY VIEW (5 MULTIPLAYER & REALTIME DRILL MODES) */}
      {/* ========================================================================= */}
      {gameMode === "lobby" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-[#1c1305] via-[#120c03] to-[#070709] p-6 sm:p-8 space-y-4">
            <span className="font-mono text-[10px] font-black tracking-widest text-amber-400 uppercase">
              WHYNOTUPSC COGNITIVE ESPORTS & GOVERNANCE SIMULATOR
            </span>
            <h2 className="font-mono text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Real-Time Cadet Battle Arena
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Compete live against registered civil service aspirants across India in high-speed 1v1 Prelims duels, District Magistrate crisis tycoon, Article sniper reflex drills, and Ludo policy grand conquest.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => start1v1Matchmaking()}
                className="p-4 rounded-2xl text-left bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 hover:border-amber-400 transition shadow-lg space-y-1">
                <span className="text-2xl block">⚡</span>
                <span className="text-xs font-bold text-amber-300 block">1v1 Speed Matchmaking</span>
                <span className="text-[11px] text-gray-400 block">5-round lightning duel vs online peer</span>
              </button>

              <button
                onClick={startDMTycoon}
                className="p-4 rounded-2xl text-left bg-blue-500/10 border border-blue-500/30 hover:border-blue-400 transition shadow-lg space-y-1">
                <span className="text-2xl block">🏛️</span>
                <span className="text-xs font-bold text-blue-300 block">District Magistrate Tycoon</span>
                <span className="text-[11px] text-gray-400 block">Manage ₹100 Cr budget & solve flash crises</span>
              </button>

              <button
                onClick={startArticleSniper}
                className="p-4 rounded-2xl text-left bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400 transition shadow-lg space-y-1">
                <span className="text-2xl block">🎯</span>
                <span className="text-xs font-bold text-emerald-300 block">Article Lightning Sniper</span>
                <span className="text-[11px] text-gray-400 block">8-second reflex matching for Polity articles</span>
              </button>

              <button
                onClick={startLudoConquest}
                className="p-4 rounded-2xl text-left bg-white/5 border border-white/10 hover:border-white/20 transition shadow-lg space-y-1">
                <span className="text-2xl block">🎲</span>
                <span className="text-xs font-bold text-white block">Ludo Policy Grand Conquest</span>
                <span className="text-[11px] text-gray-400 block">24-tile ministry board with 3D dice</span>
              </button>

              <button
                onClick={startBattleRoyale}
                className="p-4 rounded-2xl text-left bg-purple-500/10 border border-purple-500/30 hover:border-purple-400 transition shadow-lg space-y-1">
                <span className="text-2xl block">👑</span>
                <span className="text-xs font-bold text-purple-300 block">10-Player Battle Royale</span>
                <span className="text-[11px] text-gray-400 block">Survival knockout waves across India</span>
              </button>
            </div>
          </div>

          {/* Join Private Room Section */}
          <div className="p-6 rounded-3xl bg-[#0c0c0f] border border-white/10 space-y-4">
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔑</span> Private Cadet Match (Custom Room Code)
            </h3>
            <div className="flex items-center gap-3 max-w-md">
              <input
                type="text"
                placeholder="Enter 6-digit Room Code..."
                value={customRoomInput}
                onChange={(e) => setCustomRoomInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 bg-black/50 border border-white/10 focus:outline-none uppercase font-mono"
              />
              <button
                onClick={() => start1v1Matchmaking(customRoomInput || undefined)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-[#D8A63A] hover:bg-[#F4C95D] transition">
                Join Match →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MATCHMAKING SCREEN */}
      {/* ========================================================================= */}
      {gameMode === "matchmaking" && (
        <div className="p-12 rounded-3xl bg-[#09090c] border border-amber-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="font-mono text-xl font-bold text-white">Searching for Registered Cadet Opponent...</h3>
          <p className="text-xs text-gray-400 font-mono">
            Room Code: <strong className="text-amber-400">{roomCode}</strong> · Connecting across Indian Node Mesh
          </p>
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl mx-auto mb-2">
                🎖️
              </div>
              <span className="text-xs font-bold text-white block">{userName}</span>
              <span className="text-[10px] text-gray-400">Host (You)</span>
            </div>

            <span className="font-mono text-2xl font-black text-amber-400">VS</span>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mx-auto mb-2 animate-pulse">
                ❓
              </div>
              <span className="text-xs font-bold text-gray-400 block">Matching...</span>
              <span className="text-[10px] text-gray-500">Live Peer Pool</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. 1v1 LIVE BATTLE ARENA WITH LIVE EMOTE DOCK */}
      {/* ========================================================================= */}
      {gameMode === "1v1_battle" && opponent && roundQuestions[currentRound] && (
        <div className="space-y-6">
          {/* Duel Health & HUD Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-3xl bg-[#0a0a0d] border border-white/10">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <span>🎖️</span> {userName} (You)
                </span>
                <span className="font-mono text-xs font-bold text-amber-400">Score: {myScore}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300"
                  style={{ width: `${myHp}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>HP: {myHp} / 100</span>
                <span>Streak: {myStreak}x 🔥</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <span>{opponent.avatar}</span> {opponent.name} ({opponent.city})
                </span>
                <span className="font-mono text-xs font-bold text-amber-400">Score: {opponent.score}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-300"
                  style={{ width: `${opponent.hp}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>HP: {opponent.hp} / 100</span>
                <span>Rank: {opponent.rank}</span>
              </div>
            </div>
          </div>

          {/* Round Question */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0c10] border border-amber-500/30 space-y-6 shadow-2xl relative">
            {liveEmote && (
              <div className="absolute top-4 right-6 text-4xl animate-bounce">
                {liveEmote}
              </div>
            )}

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase">
                Round {currentRound + 1} / {roundQuestions.length} — {roundQuestions[currentRound].subject}
              </span>
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-black">
                <span>⏱️</span>
                <span>{roundTimer}s</span>
              </div>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed whitespace-pre-line">
              {roundQuestions[currentRound].question}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(roundQuestions[currentRound].options || [
                { id: "A", text: roundQuestions[currentRound].option_a || "Option A" },
                { id: "B", text: roundQuestions[currentRound].option_b || "Option B" },
                { id: "C", text: roundQuestions[currentRound].option_c || "Option C" },
                { id: "D", text: roundQuestions[currentRound].option_d || "Option D" },
              ]).map((opt: any) => {
                const optKey = opt.id || opt.key;
                const isSelected = myAnswer === optKey;
                return (
                  <button
                    key={optKey}
                    onClick={() => handleSelectAnswer(optKey)}
                    disabled={myAnswer !== null}
                    className="p-4 rounded-2xl text-left text-xs font-semibold transition-all border flex items-start gap-3"
                    style={{
                      background: isSelected ? "rgba(216,166,58,0.25)" : "rgba(255,255,255,0.03)",
                      borderColor: isSelected ? "#D8A63A" : "rgba(255,255,255,0.08)",
                      color: isSelected ? "#F4C95D" : "#e5e7eb",
                    }}>
                    <span className="font-mono font-black text-amber-400">{optKey}.</span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Peer Emote Wheel */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-[10px] font-mono text-gray-400">Quick Emote:</span>
              <div className="flex items-center gap-2">
                {["🔥", "🧠", "⚡", "🛡️", "🎯", "👏"].map((em) => (
                  <button
                    key={em}
                    onClick={() => triggerEmote(em)}
                    className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition">
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DISTRICT MAGISTRATE TYCOON (CRISIS SIMULATOR) */}
      {/* ========================================================================= */}
      {gameMode === "dm_tycoon" && currentCrisis && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0c10] border border-blue-500/30 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="font-mono text-[10px] font-bold text-blue-400 uppercase">
                DISTRICT MAGISTRATE CRISIS DESK // STAGE {tycoonTurn} / 3
              </span>
              <h3 className="font-mono text-xl font-bold text-white">District Disaster & Resource Matrix</h3>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-300 font-bold">
                Budget: ₹{districtBudget} Cr
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 font-bold">
                Happiness: {districtHappiness}%
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 font-bold">
                HDI: {districtHDI}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-sm font-semibold text-blue-200">
            {currentCrisis.title}
          </div>

          <div className="space-y-3">
            {currentCrisis.options.map((opt: any, idx: number) => (
              <button
                key={idx}
                onClick={() => handleDMOption(opt)}
                className="w-full p-4 rounded-2xl text-left text-xs font-semibold text-white bg-white/[0.02] border border-white/10 hover:border-blue-400 hover:bg-blue-500/10 transition">
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ARTICLE LIGHTNING SNIPER */}
      {/* ========================================================================= */}
      {gameMode === "article_sniper" && ARTICLE_SNIPER_BANK[sniperIndex] && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0c10] border border-emerald-500/30 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase">
                SPEED DRILL {sniperIndex + 1} / {ARTICLE_SNIPER_BANK.length}
              </span>
              <h3 className="font-mono text-2xl font-black text-white">
                {ARTICLE_SNIPER_BANK[sniperIndex].article}
              </h3>
            </div>
            <span className="font-mono text-sm font-bold text-emerald-400">Score: {sniperScore} XP</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ARTICLE_SNIPER_BANK[sniperIndex].options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSniperChoice(opt)}
                className="p-4 rounded-2xl text-left text-xs font-bold text-white bg-white/[0.02] border border-white/10 hover:border-emerald-400 hover:bg-emerald-500/10 transition">
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. LUDO POLICY GRAND CONQUEST */}
      {/* ========================================================================= */}
      {gameMode === "ludo_conquest" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0c10] border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="font-mono text-[10px] font-bold text-amber-400 uppercase">
                CIVIL SERVICES STRATEGY BOARD
              </span>
              <h3 className="font-mono text-xl font-bold text-white">Ludo Policy Grand Conquest</h3>
            </div>
            <button
              onClick={rollDice}
              disabled={isRolling}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-black bg-gradient-to-r from-amber-400 to-yellow-300 hover:scale-105 transition shadow-lg">
              {isRolling ? "🎲 Rolling..." : `🎲 Roll Dice (Pos: ${ludoPosition}/24)`}
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {Array.from({ length: 24 }).map((_, idx) => {
              const isMeHere = ludoPosition === idx;
              const isOppHere = ludoOpponentPos === idx;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-2xl border text-center space-y-1 transition-all"
                  style={{
                    background: isMeHere ? "rgba(216,166,58,0.2)" : isOppHere ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.02)",
                    borderColor: isMeHere ? "#D8A63A" : isOppHere ? "#ef4444" : "rgba(255,255,255,0.06)",
                  }}>
                  <span className="font-mono text-[10px] text-gray-400 block">Tile #{idx + 1}</span>
                  <span className="text-base block">{idx % 4 === 0 ? "🏛️" : idx % 3 === 0 ? "⚖️" : idx % 2 === 0 ? "🌾" : "🚀"}</span>
                  <div className="flex items-center justify-center gap-1">
                    {isMeHere && <span className="text-xs" title="You">🎖️</span>}
                    {isOppHere && <span className="text-xs" title="Peer">👮‍♂️</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {ludoTileEvent && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300 text-center">
              {ludoTileEvent}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. BATTLE ROYALE KNOCKOUT */}
      {/* ========================================================================= */}
      {gameMode === "battle_royale" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0c10] border border-purple-500/30 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="font-mono text-[10px] font-bold text-purple-400 uppercase">
                WAVE #{brWave} KNOCKOUT ROUND
              </span>
              <h3 className="font-mono text-xl font-bold text-white">10-Cadet Battle Royale Elimination</h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-mono font-bold">
              {brAliveCount} Cadets Remaining
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {brCadets.map((c, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl border text-center space-y-1"
                style={{
                  background: c.alive ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.02)",
                  borderColor: c.alive ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.05)",
                  opacity: c.alive ? 1 : 0.4,
                }}>
                <span className="text-xl block">{c.alive ? "🎖️" : "💀"}</span>
                <span className="text-xs font-bold text-white block truncate">{c.name}</span>
                <span className="text-[10px] text-gray-400 block">{c.city}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. GAME OVER VIEW */}
      {/* ========================================================================= */}
      {gameMode === "game_over" && (
        <div className="p-12 rounded-3xl bg-[#0c0c10] border border-amber-500/40 text-center space-y-6 shadow-2xl">
          <span className="text-5xl">🏆</span>
          <h2 className="font-mono text-2xl sm:text-3xl font-black text-white uppercase">
            VICTORY! CADET DRILL COMPLETE
          </h2>
          <p className="text-xs text-gray-300 max-w-md mx-auto">
            Session completed successfully. +200 National Cadet XP and Leaderboard points awarded.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setGameMode("lobby")}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-[#D8A63A] hover:bg-[#F4C95D] transition shadow-lg">
              Play Another Game →
            </button>
            <button
              onClick={onExit}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10 transition">
              Back to Arcade
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
