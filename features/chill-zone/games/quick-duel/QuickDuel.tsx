"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { QuickDuelChannelManager, generateRoomCode } from "../../services/multiplayer-service";
import { submitGameScore } from "../../services/score-service";
import { sound } from "@/lib/audio/sound-engine";
import { MultiplayerDuelState } from "../../types";

interface QuickDuelProps {
  onBack: () => void;
  onFinish?: () => void;
}

export default function QuickDuel({ onBack, onFinish }: QuickDuelProps) {
  const [mode, setMode] = useState<"lobby" | "room" | "duel">("lobby");
  const [roomInput, setRoomInput] = useState("");
  const [duelState, setDuelState] = useState<MultiplayerDuelState>({
    roomId: "",
    roomCode: "",
    status: "idle",
    isHost: false,
    playerRole: "player1",
    opponentName: "Aspirant Rival",
  });
  const [playerWins, setPlayerWins] = useState(0);
  const [opponentWins, setOpponentWins] = useState(0);

  const channelManagerRef = useRef<QuickDuelChannelManager | null>(null);
  const signalStartTimeRef = useRef<number>(0);

  const cleanupDuel = () => {
    if (channelManagerRef.current) {
      channelManagerRef.current.cleanup();
      channelManagerRef.current = null;
    }
  };

  useEffect(() => {
    return () => cleanupDuel();
  }, []);

  const handleStateChange = useCallback((newState: Partial<MultiplayerDuelState>) => {
    setDuelState((prev) => {
      const updated = { ...prev, ...newState };

      if (newState.status === "go") {
        signalStartTimeRef.current = performance.now();
        sound.playWarp();
      }

      if (newState.status === "finished") {
        if (newState.winner === "player") {
          setPlayerWins((w) => w + 1);
          sound.playVictory();
        } else if (newState.winner === "opponent") {
          setOpponentWins((w) => w + 1);
          sound.playWrong();
        }
      }

      return updated;
    });
  }, []);

  const startQuickMatch = () => {
    cleanupDuel();
    setMode("duel");
    setPlayerWins(0);
    setOpponentWins(0);
    setDuelState({
      roomId: "matchmaking_lobby",
      roomCode: "LOBBY",
      isHost: true,
      playerRole: "player1",
      status: "searching",
      opponentName: "Searching for live Cadet...",
    });

    const dummyManager = new QuickDuelChannelManager("LOBBY", handleStateChange);
    channelManagerRef.current = dummyManager;

    void dummyManager.findOrHostQuickMatch("Cadet", (code, isHost) => {
      setDuelState({
        roomId: `room_${code}`,
        roomCode: code,
        status: "searching",
        isHost,
        playerRole: isHost ? "player1" : "player2",
        opponentName: isHost ? "Waiting for Challenger..." : "Connecting to Host...",
      });

      const actualManager = new QuickDuelChannelManager(code, handleStateChange);
      channelManagerRef.current = actualManager;
      actualManager.initialize(isHost, isHost ? "Cadet (Host)" : "Cadet (Challenger)");
    });
  };

  const createPrivateRoom = () => {
    cleanupDuel();
    const code = generateRoomCode();
    setDuelState({
      roomId: `room_${code}`,
      roomCode: code,
      status: "searching",
      isHost: true,
      playerRole: "player1",
      opponentName: "Waiting for Cadet...",
    });
    setMode("duel");
    setPlayerWins(0);
    setOpponentWins(0);

    const manager = new QuickDuelChannelManager(code, handleStateChange);
    channelManagerRef.current = manager;
    manager.initialize(true, "Cadet (Host)");
  };

  const joinPrivateRoom = () => {
    if (!roomInput.trim()) return;
    cleanupDuel();
    const code = roomInput.trim().toUpperCase();
    setDuelState({
      roomId: `room_${code}`,
      roomCode: code,
      status: "searching",
      isHost: false,
      playerRole: "player2",
      opponentName: "Connecting...",
    });
    setMode("duel");
    setPlayerWins(0);
    setOpponentWins(0);

    const manager = new QuickDuelChannelManager(code, handleStateChange);
    channelManagerRef.current = manager;
    manager.initialize(false, "Cadet (Challenger)");
  };

  const handleDuelClick = () => {
    if (duelState.status === "matched" || duelState.status === "ready") {
      channelManagerRef.current?.sendReady();
      sound.playClick();
      return;
    }

    if (duelState.status === "waiting_signal") {
      // False start in duel!
      sound.playWrong();
      channelManagerRef.current?.submitClick(0, true);
      return;
    }

    if (duelState.status === "go") {
      const reactionTime = Math.round(performance.now() - signalStartTimeRef.current);
      channelManagerRef.current?.submitClick(reactionTime, false);

      submitGameScore({
        gameSlug: "quick-duel",
        score: reactionTime,
        durationMs: 15000,
        metadata: { opponent: duelState.opponentName },
      });
    }
  };

  const nextRound = () => {
    setDuelState((prev) => ({
      ...prev,
      status: "matched",
      playerReactionTime: undefined,
      opponentReactionTime: undefined,
      winner: undefined,
    }));
  };

  return (
    <div className="relative flex min-h-[580px] w-full flex-col items-center justify-between rounded-3xl border border-white/10 bg-[#070707] p-6 text-white select-none overflow-hidden sm:p-8">
      {/* Top Bar */}
      <div className="flex w-full items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={() => {
            cleanupDuel();
            onBack();
          }}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition"
        >
          ← EXIT DUEL
        </button>

        {mode === "duel" && (
          <div className="flex items-center gap-4 font-mono text-xs">
            <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[#8C8C8C]">
              ROOM: <strong className="text-[#F4C95D]">{duelState.roomCode}</strong>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">YOU: {playerWins}</span>
              <span className="text-[#8C8C8C]">VS</span>
              <span className="text-red-400 font-bold">OPPONENT: {opponentWins}</span>
            </div>
          </div>
        )}
      </div>

      {/* Lobby Menu */}
      {mode === "lobby" && (
        <div className="my-auto flex w-full max-w-md flex-col items-center gap-5 text-center">
          <span className="text-5xl">⚔️</span>
          <div>
            <h2 className="font-mono text-3xl font-black text-[#F4C95D] tracking-widest uppercase">
              QUICK DUEL
            </h2>
            <p className="mt-1 text-xs text-[#8C8C8C]">
              Live 1v1 reaction faceoff. Quick Match against active aspirants or invite a peer with a private room code.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <button
              onClick={startQuickMatch}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#D8A63A] bg-[#D8A63A] py-3.5 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_25px_rgba(216,166,58,0.4)]"
            >
              ⚡ QUICK MATCHMAKING (FIND CADET)
            </button>

            <button
              onClick={createPrivateRoom}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 py-3 font-mono text-xs font-bold text-white hover:border-[#D8A63A] hover:bg-white/10 transition"
            >
              🔒 CREATE PRIVATE ROOM (CODE)
            </button>

            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
                placeholder="ENTER CODE (e.g. WHY123)"
                maxLength={8}
                className="flex-1 rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 font-mono text-xs text-white placeholder-white/30 focus:border-[#D8A63A] focus:outline-none"
              />
              <button
                onClick={joinPrivateRoom}
                className="rounded-xl border border-white/20 bg-white/10 px-5 font-mono text-xs font-bold text-white hover:bg-white/20 transition"
              >
                JOIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duel Arena */}
      {mode === "duel" && (
        <div
          onClick={handleDuelClick}
          className={`relative my-6 flex h-[350px] w-full max-w-xl cursor-pointer flex-col items-center justify-center rounded-3xl border transition-all p-6 text-center ${
            duelState.status === "searching"
              ? "border-white/20 bg-white/[0.03]"
              : duelState.status === "matched"
              ? "border-[#D8A63A]/40 bg-[#D8A63A]/10 shadow-[0_0_30px_rgba(216,166,58,0.2)]"
              : duelState.status === "ready"
              ? "border-amber-500/50 bg-amber-950/20 shadow-[0_0_40px_rgba(245,158,11,0.2)]"
              : duelState.status === "waiting_signal"
              ? "border-red-500/50 bg-red-950/30 shadow-[0_0_60px_rgba(239,68,68,0.3)] animate-pulse"
              : duelState.status === "go"
              ? "border-[#F4C95D] bg-[#F4C95D]/20 shadow-[0_0_80px_rgba(244,201,93,0.6)] scale-[1.03]"
              : duelState.status === "too_early"
              ? "border-red-500 bg-red-950/50"
              : "border-emerald-500/50 bg-emerald-950/20"
          }`}
        >
          {duelState.status === "searching" && (
            <div className="flex flex-col items-center gap-3">
              <div className="h-14 w-14 animate-spin rounded-full border-2 border-dashed border-[#D8A63A]" />
              <h3 className="font-mono text-lg font-black text-white">
                LOCATING OPPONENT...
              </h3>
              <p className="font-mono text-xs text-[#8C8C8C]">
                Room Code: <strong className="text-[#F4C95D]">{duelState.roomCode}</strong>
              </p>
            </div>
          )}

          {duelState.status === "matched" && (
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl">🤝</span>
              <h3 className="font-mono text-xl font-black text-white">
                RIVAL CONNECTED: {duelState.opponentName}
              </h3>
              <p className="text-xs text-[#8C8C8C]">
                First to click after GO! claims victory. Clicking early forfeits the round.
              </p>
              <div className="mt-3 rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-6 py-2.5 font-mono text-xs font-black text-black shadow-[0_0_20px_rgba(216,166,58,0.4)]">
                CLICK TO READY UP
              </div>
            </div>
          )}

          {duelState.status === "ready" && (
            <div className="flex flex-col items-center gap-3">
              <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
                BOTH CADETS READY
              </span>
              <h3 className="font-mono text-2xl font-black text-white">
                COMMENCING DRAW...
              </h3>
              <p className="font-mono text-xs text-[#8C8C8C]">
                Wait for the screen to turn gold
              </p>
            </div>
          )}

          {duelState.status === "waiting_signal" && (
            <div className="flex flex-col items-center gap-3">
              <h3 className="font-mono text-3xl font-black text-red-400 tracking-wider">
                STANDBY...
              </h3>
              <p className="font-mono text-xs text-red-300/60 uppercase">
                DO NOT CLICK EARLY
              </p>
            </div>
          )}

          {duelState.status === "go" && (
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <h2 className="font-mono text-5xl font-black text-white drop-shadow-[0_0_30px_rgba(244,201,93,0.9)]">
                CLICK NOW!
              </h2>
            </div>
          )}

          {duelState.status === "too_early" && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">⚠️</span>
              <h3 className="font-mono text-2xl font-black text-red-400">
                TOO EARLY!
              </h3>
              <p className="text-xs text-[#8C8C8C]">
                You clicked before the signal. Round forfeited to {duelState.opponentName}.
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextRound();
                }}
                className="mt-4 rounded-xl border border-white/20 bg-white/10 px-5 py-2 font-mono text-xs font-bold text-white"
              >
                NEXT ROUND
              </button>
            </div>
          )}

          {duelState.status === "finished" && (
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl">
                {duelState.winner === "player" ? "👑" : "💀"}
              </span>
              <h3 className="font-mono text-3xl font-black text-white uppercase">
                {duelState.winner === "player" ? "YOU WON THE DRAW!" : `${duelState.opponentName} WON!`}
              </h3>
              <div className="flex gap-6 font-mono text-sm">
                <div>
                  <span className="text-[#8C8C8C] text-xs">YOUR TIME</span>
                  <p className="font-black text-[#F4C95D]">
                    {duelState.playerReactionTime ? `${duelState.playerReactionTime}ms` : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-[#8C8C8C] text-xs">OPPONENT TIME</span>
                  <p className="font-black text-white">
                    {duelState.opponentReactionTime ? `${duelState.opponentReactionTime}ms` : "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextRound();
                  }}
                  className="rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-5 py-2 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition"
                >
                  NEXT ROUND
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Info */}
      <div className="flex w-full items-center justify-between border-t border-white/10 pt-3 text-[11px] font-mono text-[#8C8C8C]">
        <span>⚔️ 1v1 Real-Time Signal Sync</span>
        <span>Low-latency peer response protocol</span>
      </div>
    </div>
  );
}
