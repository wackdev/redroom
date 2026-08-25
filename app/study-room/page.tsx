"use client";
import { useState, useEffect, useRef } from "react";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import { UserSessionManager } from "@/lib/core/user-context";

interface StudyPeer {
  id: string;
  name: string;
  avatar: string;
  targetYear: number;
  currentGoal: string;
  minutesInRoom: number;
  status: "Deep Focus" | "Reviewing PYQs" | "Writing Answer" | "Pomodoro Break";
}

const ACTIVE_PEERS: StudyPeer[] = [
  {
    id: "peer-1",
    name: "Rohan Patel",
    avatar: "🦊",
    targetYear: 2026,
    currentGoal: "Polity Laxmikanth: Emergency Provisions & CAG",
    minutesInRoom: 142,
    status: "Deep Focus"
  },
  {
    id: "peer-2",
    name: "Dr. Aditi Sharma",
    avatar: "🩺",
    targetYear: 2026,
    currentGoal: "Medical Science Paper 1: Physiology Revision",
    minutesInRoom: 95,
    status: "Writing Answer"
  },
  {
    id: "peer-3",
    name: "Vikram S.",
    avatar: "🦁",
    targetYear: 2026,
    currentGoal: "Environment: Mangrove Ecosystems & Ramsar Sites",
    minutesInRoom: 64,
    status: "Reviewing PYQs"
  },
  {
    id: "peer-4",
    name: "Sanya Roy",
    avatar: "🦅",
    targetYear: 2027,
    currentGoal: "NCERT History 11th: Bhakti & Sufi Movements",
    minutesInRoom: 38,
    status: "Pomodoro Break"
  }
];

export default function StudyRoomPage() {
  const [user] = useState(UserSessionManager.getActiveUser());
  const [roomType, setRoomType] = useState<"lbsnaa" | "library" | "silent">("lbsnaa");
  const [sessionTimeMinutes, setSessionTimeMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [myStudyGoal, setMyStudyGoal] = useState("");
  const [committedGoal, setCommittedGoal] = useState("");
  const [ambientSound, setAmbientSound] = useState<"none" | "library" | "rain" | "waves">("none");
  const [peers, setPeers] = useState<StudyPeer[]>(ACTIVE_PEERS);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerActive && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (!isBreak) {
        setIsBreak(true);
        setSecondsRemaining(5 * 60); // 5 min break
      } else {
        setIsBreak(false);
        setSecondsRemaining(sessionTimeMinutes * 60);
      }
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, secondsRemaining, isBreak, sessionTimeMinutes]);

  const toggleTimer = () => {
    if (!committedGoal && myStudyGoal.trim()) {
      setCommittedGoal(myStudyGoal.trim());
    }
    setIsTimerActive(!isTimerActive);
  };

  const resetTimer = (mins: number) => {
    setIsTimerActive(false);
    setIsBreak(false);
    setSessionTimeMinutes(mins);
    setSecondsRemaining(mins * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const totalSeconds = isBreak ? 5 * 60 : sessionTimeMinutes * 60;
  const progressPercent = Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #070913 0%, #0c1428 50%, #050711 100%)" }}>
      <AppUniversalHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-semibold uppercase tracking-wider"
            style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa" }}>
            <span>🏛️</span> 24/7 Virtual Peer Study Sanctuary
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            LBSNAA Focus Room & Accountability Hall
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            Study synchronously with serious civil service probationers. Commit your hourly target, eliminate distraction, and maintain unbreakable momentum.
          </p>
        </div>

        {/* Room Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {[
              { id: "lbsnaa", label: "🏛️ LBSNAA Radhakrishnan Hall", count: "128 Cadets" },
              { id: "library", label: "📚 Central National Library", count: "84 Cadets" },
              { id: "silent", label: "🤫 Midnight Silent Sanctuary", count: "216 Cadets" }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setRoomType(r.id as any)}
                className="px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2"
                style={{
                  background: roomType === r.id ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.03)",
                  border: roomType === r.id ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(255,255,255,0.06)",
                  color: roomType === r.id ? "#93c5fd" : "#9ca3af"
                }}>
                <span>{r.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-gray-300">{r.count}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Ambient Background:</span>
            {(["none", "library", "rain", "waves"] as const).map(sound => (
              <button
                key={sound}
                onClick={() => setAmbientSound(sound)}
                className="px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all"
                style={{
                  background: ambientSound === sound ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.04)",
                  border: ambientSound === sound ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(255,255,255,0.06)",
                  color: ambientSound === sound ? "#93c5fd" : "#9ca3af"
                }}>
                {sound === "none" ? "Mute" : sound}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Pomodoro Sanctuary & Active Peers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Pomodoro Engine */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-8 rounded-3xl backdrop-blur-xl text-center space-y-6"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.4)"
              }}>
              
              {/* Status Header */}
              <div className="flex items-center justify-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isTimerActive ? "bg-emerald-400 animate-ping" : "bg-gray-600"}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  {isBreak ? "☕ POMODORO BREAK TIME" : isTimerActive ? "🔥 DEEP IMMERSION STUDY IN PROGRESS" : "READY FOR STUDY IMMERSION"}
                </span>
              </div>

              {/* Huge Timer Circular Dial */}
              <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                <svg viewBox="0 0 240 240" className="w-full h-full -rotate-90">
                  <circle
                    cx="120"
                    cy="120"
                    r="100"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="12"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="100"
                    fill="none"
                    stroke={isBreak ? "#10b981" : "#3b82f6"}
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 100}
                    strokeDashoffset={2 * Math.PI * 100 * (1 - progressPercent / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-black tracking-tighter text-white">
                    {formatTime(secondsRemaining)}
                  </div>
                  <div className="text-xs font-semibold text-gray-400 mt-1">
                    {isBreak ? "Rest & Hydrate" : `${sessionTimeMinutes}m Target Interval`}
                  </div>
                </div>
              </div>

              {/* Goal Input & Commitment Display */}
              <div className="max-w-md mx-auto">
                {!committedGoal ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={myStudyGoal}
                      onChange={(e) => setMyStudyGoal(e.target.value)}
                      placeholder="Commit your hourly target (e.g., GS-2 Polity 20 PYQs)..."
                      className="flex-1 px-4 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 bg-black/40 border border-white/10 focus:outline-none"
                    />
                    <button
                      onClick={() => setCommittedGoal(myStudyGoal.trim())}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all">
                      Lock Target
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between gap-3 text-left">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">
                        Locked Focus Commitment:
                      </span>
                      <p className="text-xs font-semibold text-white mt-0.5">{committedGoal}</p>
                    </div>
                    <button
                      onClick={() => setCommittedGoal("")}
                      className="text-[11px] text-gray-400 hover:text-white underline">
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={toggleTimer}
                  className="px-8 py-3 rounded-2xl text-sm font-extrabold text-white transition-all shadow-xl"
                  style={{
                    background: isTimerActive ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #2563eb, #1d4ed8)"
                  }}>
                  {isTimerActive ? "⏸ Pause Focus" : "▶ Begin Deep Focus"}
                </button>
                <button
                  onClick={() => resetTimer(25)}
                  className="px-4 py-3 rounded-2xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 transition-all">
                  25 min
                </button>
                <button
                  onClick={() => resetTimer(50)}
                  className="px-4 py-3 rounded-2xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 transition-all">
                  50 min
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Live Study Peers */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl backdrop-blur-xl space-y-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>👥</span> Active Cadets in Radhakrishnan Hall
                </h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  Live Sync
                </span>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
                {peers.map((peer) => (
                  <div
                    key={peer.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3 transition-all hover:bg-white/[0.04]">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl bg-white/5 shrink-0 border border-white/5">
                      {peer.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h4 className="text-xs font-bold text-white truncate">{peer.name}</h4>
                        <span className="text-[10px] font-semibold text-blue-400 px-2 py-0.5 rounded-md bg-blue-500/10 shrink-0">
                          {peer.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 font-medium truncate mb-1">
                        🎯 {peer.currentGoal}
                      </p>
                      <div className="text-[10px] text-gray-500">
                        In room for {peer.minutesInRoom} mins • Target {peer.targetYear}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 text-center">
                <p className="text-xs text-gray-400">
                  Cadets who study together with silent accountability report <span className="text-blue-400 font-semibold">3.4x higher weekly consistency</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
