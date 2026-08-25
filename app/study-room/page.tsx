"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import { UserSessionManager } from "@/lib/core/user-context";
import { sound } from "@/lib/audio/sound-engine";
import { trackActivityEvent } from "@/lib/brain/activity-events";

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
    status: "Deep Focus",
  },
  {
    id: "peer-2",
    name: "Dr. Aditi Sharma",
    avatar: "🩺",
    targetYear: 2026,
    currentGoal: "Medical Science Paper 1: Physiology Revision",
    minutesInRoom: 95,
    status: "Writing Answer",
  },
  {
    id: "peer-3",
    name: "Vikram S.",
    avatar: "🦁",
    targetYear: 2026,
    currentGoal: "Environment: Mangrove Ecosystems & Ramsar Sites",
    minutesInRoom: 64,
    status: "Reviewing PYQs",
  },
  {
    id: "peer-4",
    name: "Sanya Roy",
    avatar: "🦅",
    targetYear: 2027,
    currentGoal: "NCERT History 11th: Bhakti & Sufi Movements",
    minutesInRoom: 38,
    status: "Pomodoro Break",
  },
];

const STUDY_ROOM_PERSIST_KEY = "whynotupsc_study_room_timer";

export default function StudyRoomPage() {
  const [user] = useState(() => UserSessionManager.getActiveUser());
  const [roomType, setRoomType] = useState<"lbsnaa" | "library" | "silent">("lbsnaa");
  const [sessionTimeMinutes, setSessionTimeMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [myStudyGoal, setMyStudyGoal] = useState("");
  const [committedGoal, setCommittedGoal] = useState("");
  const [ambientSound, setAmbientSound] = useState<"none" | "library" | "rain" | "waves">("none");
  const [peers] = useState<StudyPeer[]>(ACTIVE_PEERS);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Timestamp anchor reference for zero drift
  const targetEndTimeRef = useRef<number | null>(null);

  // Web Audio Context reference for ambient sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundSourceRef = useRef<{ source?: AudioNode; gain?: GainNode } | null>(null);

  // Load Saved Timer State on Mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STUDY_ROOM_PERSIST_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setSessionTimeMinutes(parsed.sessionTimeMinutes || 25);
          setIsBreak(Boolean(parsed.isBreak));
          if (parsed.committedGoal) setCommittedGoal(parsed.committedGoal);
          if (parsed.ambientSound) setAmbientSound(parsed.ambientSound);

          if (parsed.isTimerActive && parsed.targetEndTimeMs) {
            const now = Date.now();
            const diff = Math.max(0, Math.ceil((parsed.targetEndTimeMs - now) / 1000));
            if (diff > 0) {
              targetEndTimeRef.current = parsed.targetEndTimeMs;
              setSecondsRemaining(diff);
              setIsTimerActive(true);
            } else {
              targetEndTimeRef.current = null;
              setSecondsRemaining(0);
              setIsTimerActive(false);
            }
          } else {
            setSecondsRemaining(parsed.secondsRemaining ?? (parsed.sessionTimeMinutes || 25) * 60);
            setIsTimerActive(false);
          }
        }
      }
    } catch {}
  }, []);

  const persistState = useCallback(
    (running: boolean, remaining: number, mins: number, endMs: number | null, brk: boolean, goal: string, soundTrack: string) => {
      try {
        const payload = {
          isTimerActive: running,
          secondsRemaining: remaining,
          sessionTimeMinutes: mins,
          targetEndTimeMs: endMs,
          isBreak: brk,
          committedGoal: goal,
          ambientSound: soundTrack,
          lastUpdated: Date.now(),
        };
        localStorage.setItem(STUDY_ROOM_PERSIST_KEY, JSON.stringify(payload));
      } catch {}
    },
    []
  );

  // Ambient sound generator via Web Audio API
  const stopAudio = useCallback(() => {
    if (soundSourceRef.current?.gain) {
      try {
        soundSourceRef.current.gain.gain.linearRampToValueAtTime(
          0.001,
          audioCtxRef.current ? audioCtxRef.current.currentTime + 0.5 : 0
        );
        setTimeout(() => {
          if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
            void audioCtxRef.current.suspend();
          }
        }, 500);
      } catch {}
    }
  }, []);

  const playAmbientSound = useCallback((track: "none" | "library" | "rain" | "waves") => {
    stopAudio();
    if (track === "none") return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.12, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (track === "library") {
          output[i] = (lastOut + 0.015 * white) / 1.015;
          lastOut = output[i];
          output[i] *= 2.5;
        } else if (track === "waves") {
          output[i] = (lastOut + 0.03 * white) / 1.03;
          lastOut = output[i];
        } else {
          // Rain
          output[i] = (lastOut + 0.05 * white) / 1.05;
          lastOut = output[i];
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = track === "library" ? 250 : track === "waves" ? 450 : 800;

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      soundSourceRef.current = { source: whiteNoise, gain: masterGain };
    } catch (e) {
      console.warn("Audio synth warning:", e);
    }
  }, [stopAudio]);

  useEffect(() => {
    if (isTimerActive && ambientSound !== "none") {
      playAmbientSound(ambientSound);
    } else {
      stopAudio();
    }
    return () => stopAudio();
  }, [isTimerActive, ambientSound, playAmbientSound, stopAudio]);

  // Handle Session or Break Completion
  const handleIntervalTransition = useCallback(() => {
    sound.playVictory();
    if (!isBreak) {
      // Completed Focus Session
      setIsBreak(true);
      const breakSecs = 5 * 60;
      const nextEnd = Date.now() + breakSecs * 1000;
      targetEndTimeRef.current = nextEnd;
      setSecondsRemaining(breakSecs);
      persistState(true, breakSecs, sessionTimeMinutes, nextEnd, true, committedGoal, ambientSound);

      void trackActivityEvent("STUDY_SESSION_COMPLETED", {
        room: roomType,
        minutes: sessionTimeMinutes,
        goal: committedGoal,
      });

      alert(`🎉 Focus Sprint Completed! Starting 5-minute hydration break.`);
    } else {
      // Completed Break
      setIsBreak(false);
      const sprintSecs = sessionTimeMinutes * 60;
      targetEndTimeRef.current = null;
      setSecondsRemaining(sprintSecs);
      setIsTimerActive(false);
      persistState(false, sprintSecs, sessionTimeMinutes, null, false, committedGoal, ambientSound);
      alert(`☕ Break completed. Ready for your next focus session.`);
    }
  }, [isBreak, sessionTimeMinutes, committedGoal, ambientSound, roomType, persistState]);

  // Tab Visibility & Focus Drift Recalculator
  useEffect(() => {
    const handleRecalculate = () => {
      if (isTimerActive && targetEndTimeRef.current) {
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((targetEndTimeRef.current - now) / 1000));
        setSecondsRemaining(diff);
        if (diff <= 0) {
          handleIntervalTransition();
        }
      }
    };

    document.addEventListener("visibilitychange", handleRecalculate);
    window.addEventListener("focus", handleRecalculate);

    return () => {
      document.removeEventListener("visibilitychange", handleRecalculate);
      window.removeEventListener("focus", handleRecalculate);
    };
  }, [isTimerActive, handleIntervalTransition]);

  // Timestamp-Delta Timer Interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive) {
      interval = setInterval(() => {
        if (!targetEndTimeRef.current) return;
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((targetEndTimeRef.current - now) / 1000));
        setSecondsRemaining(diff);

        persistState(true, diff, sessionTimeMinutes, targetEndTimeRef.current, isBreak, committedGoal, ambientSound);

        if (diff <= 0) {
          handleIntervalTransition();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, sessionTimeMinutes, isBreak, committedGoal, ambientSound, persistState, handleIntervalTransition]);

  const toggleTimer = () => {
    if (!committedGoal && myStudyGoal.trim()) {
      setCommittedGoal(myStudyGoal.trim());
    }

    if (!isTimerActive) {
      sound.playSelect();
      const endMs = Date.now() + secondsRemaining * 1000;
      targetEndTimeRef.current = endMs;
      setIsTimerActive(true);
      persistState(true, secondsRemaining, sessionTimeMinutes, endMs, isBreak, committedGoal || myStudyGoal.trim(), ambientSound);
    } else {
      sound.playLock();
      targetEndTimeRef.current = null;
      setIsTimerActive(false);
      persistState(false, secondsRemaining, sessionTimeMinutes, null, isBreak, committedGoal, ambientSound);
    }
  };

  const resetTimer = (mins: number) => {
    sound.playHover();
    setIsTimerActive(false);
    setIsBreak(false);
    targetEndTimeRef.current = null;
    setSessionTimeMinutes(mins);
    const secs = mins * 60;
    setSecondsRemaining(secs);
    stopAudio();
    persistState(false, secs, mins, null, false, committedGoal, ambientSound);
  };

  const handleToggleFullscreen = async () => {
    sound.playSelect();
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          (document.documentElement as any).webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn("Fullscreen toggle error:", e);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const totalSeconds = isBreak ? 5 * 60 : sessionTimeMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100)));

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
      <AppUniversalHeader moduleName="Virtual Peer Study Sanctuary" moduleBadge="LBSNAA FOCUS ROOM" />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 font-mono text-[11px] font-bold uppercase tracking-wider bg-[#D8A63A]/10 border border-[#D8A63A]/30 text-[#F4C95D]">
            <span>🏛️</span> 24/7 Virtual Peer Study Sanctuary
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
            LBSNAA Focus Room & Accountability Hall
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-xs sm:text-sm font-sans">
            Study synchronously with serious civil service probationers. Commit your hourly target, eliminate distraction, and maintain unbreakable momentum with zero timer drift.
          </p>
        </div>

        {/* Room Navigation & Ambient Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "lbsnaa", label: "🏛️ LBSNAA Radhakrishnan Hall", count: "128 Cadets" },
              { id: "library", label: "📚 Central National Library", count: "84 Cadets" },
              { id: "silent", label: "🤫 Midnight Silent Sanctuary", count: "216 Cadets" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  sound.playSelect();
                  setRoomType(r.id as any);
                }}
                className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  roomType === r.id
                    ? "bg-[#D8A63A]/20 border border-[#D8A63A]/50 text-[#F4C95D] shadow-lg shadow-[#D8A63A]/10"
                    : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{r.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-white/80">{r.count}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-white/50">Ambient:</span>
            {(["none", "library", "rain", "waves"] as const).map((soundTrack) => (
              <button
                key={soundTrack}
                onClick={() => {
                  sound.playHover();
                  setAmbientSound(soundTrack);
                }}
                className={`min-h-[38px] px-3 py-1 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                  ambientSound === soundTrack
                    ? "bg-[#D8A63A] text-black shadow-lg"
                    : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {soundTrack === "none" ? "Mute 🔇" : soundTrack}
              </button>
            ))}
            <button
              onClick={handleToggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Focus"}
              className="min-h-[38px] px-3 py-1 rounded-xl border border-white/10 bg-white/5 text-xs text-white/70 hover:text-white transition cursor-pointer"
            >
              {isFullscreen ? "🗗" : "⛶"}
            </button>
          </div>
        </div>

        {/* Main Grid: Pomodoro Sanctuary & Active Peers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Column: Pomodoro Engine */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0d0d0d] shadow-2xl text-center space-y-6">
              {/* Status Header */}
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    isTimerActive ? "bg-emerald-400 animate-ping" : "bg-white/30"
                  }`}
                />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#F4C95D]">
                  {isBreak
                    ? "☕ POMODORO BREAK TIME"
                    : isTimerActive
                    ? "🔥 DEEP IMMERSION STUDY IN PROGRESS"
                    : "READY FOR STUDY IMMERSION"}
                </span>
              </div>

              {/* Circular Dial */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
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
                    stroke={isBreak ? "#10b981" : "#d8a63a"}
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 100}
                    strokeDashoffset={2 * Math.PI * 100 * (1 - progressPercent / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-white">
                    {formatTime(secondsRemaining)}
                  </div>
                  <div className="font-mono text-xs font-semibold text-white/50 mt-1">
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
                      placeholder="Commit your hourly target (e.g. GS-2 Polity 20 PYQs)..."
                      className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl font-mono text-xs text-white placeholder:text-white/40 bg-black/60 border border-white/10 focus:border-[#D8A63A] focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        sound.playLock();
                        setCommittedGoal(myStudyGoal.trim());
                      }}
                      className="min-h-[44px] px-4 py-2.5 rounded-xl font-mono text-xs font-bold text-black bg-[#D8A63A] hover:bg-[#F4C95D] transition cursor-pointer"
                    >
                      Lock Target
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-[#D8A63A]/10 border border-[#D8A63A]/30 flex items-center justify-between gap-3 text-left">
                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-[#F4C95D] tracking-wider block">
                        Locked Focus Commitment:
                      </span>
                      <p className="text-xs font-semibold text-white mt-0.5">{committedGoal}</p>
                    </div>
                    <button
                      onClick={() => {
                        sound.playHover();
                        setCommittedGoal("");
                      }}
                      className="font-mono text-[11px] text-white/60 hover:text-white underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={toggleTimer}
                  className={`min-h-[48px] px-8 py-3 rounded-2xl font-mono text-xs sm:text-sm font-black text-black transition shadow-xl cursor-pointer ${
                    isTimerActive
                      ? "bg-amber-600 text-white hover:bg-amber-500"
                      : "bg-gradient-to-r from-[#D8A63A] to-[#B38322] hover:scale-105"
                  }`}
                >
                  {isTimerActive ? "⏸ Pause Focus" : "▶ Begin Deep Focus"}
                </button>
                <button
                  onClick={() => resetTimer(25)}
                  className="min-h-[48px] px-4 py-3 rounded-2xl font-mono text-xs font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer border border-white/5"
                >
                  25 min
                </button>
                <button
                  onClick={() => resetTimer(50)}
                  className="min-h-[48px] px-4 py-3 rounded-2xl font-mono text-xs font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer border border-white/5"
                >
                  50 min
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Study Peers */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl border border-white/10 bg-[#0d0d0d] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-mono text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>👥</span> Active Cadets in Radhakrishnan Hall
                </h3>
                <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                  Live Sync
                </span>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {peers.map((peer) => (
                  <div
                    key={peer.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3 transition hover:bg-white/[0.04]"
                  >
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl bg-white/5 shrink-0 border border-white/5">
                      {peer.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h4 className="text-xs font-bold text-white truncate">{peer.name}</h4>
                        <span className="font-mono text-[10px] font-semibold text-[#F4C95D] px-2 py-0.5 rounded-md bg-[#D8A63A]/10 shrink-0">
                          {peer.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/80 font-medium truncate mb-1">
                        🎯 {peer.currentGoal}
                      </p>
                      <div className="font-mono text-[10px] text-white/40">
                        In room for {peer.minutesInRoom} mins • Target {peer.targetYear}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 text-center">
                <p className="text-xs text-white/60 font-sans">
                  Cadets who study together with silent accountability report{" "}
                  <strong className="text-[#F4C95D]">3.4x higher weekly consistency</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
