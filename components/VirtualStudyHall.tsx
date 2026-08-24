"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { sound } from "@/lib/audio/sound-engine";
import { UserSessionManager } from "@/lib/core/user-context";

const POMODORO_STORAGE_KEY = "whynotupsc_pomodoro_state";

interface PersistentTimerState {
  isRunning: boolean;
  initialSeconds: number;
  remainingSeconds: number;
  lastUpdatedTimestamp: number;
  ambientTrack: "none" | "binaural" | "lbsnaa_rain" | "library";
}

export default function VirtualStudyHall() {
  const [sessionSeconds, setSessionSeconds] = useState(50 * 60); // 50m focus sprint
  const [initialSeconds, setInitialSeconds] = useState(50 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientTrack, setAmbientTrack] = useState<"none" | "binaural" | "lbsnaa_rain" | "library">("none");
  const [treeStage, setTreeStage] = useState<number>(1); // 1: Seed, 2: Sprout, 3: Sapling, 4: Mighty Banyan
  const [totalFocusedMinutesToday, setTotalFocusedMinutesToday] = useState(0);
  const [activeCadets, setActiveCadets] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscNodesRef = useRef<any[]>([]);

  // 1. Load Saved Focus Minutes, Active Presence & Persistent Timer on Mount
  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const savedMins = localStorage.getItem(`redroom_focus_mins_${today}`);
      if (savedMins) {
        setTotalFocusedMinutesToday(parseInt(savedMins, 10) || 0);
      }

      // Load persistent timer state across refreshes
      const savedTimerRaw = localStorage.getItem(POMODORO_STORAGE_KEY);
      if (savedTimerRaw) {
        const parsed: PersistentTimerState = JSON.parse(savedTimerRaw);
        if (parsed && typeof parsed === "object") {
          setInitialSeconds(parsed.initialSeconds || 50 * 60);
          setAmbientTrack(parsed.ambientTrack || "none");

          if (parsed.isRunning) {
            const elapsed = Math.floor((Date.now() - parsed.lastUpdatedTimestamp) / 1000);
            const remaining = Math.max(0, parsed.remainingSeconds - elapsed);

            if (remaining > 0) {
              setSessionSeconds(remaining);
              setIsRunning(true);
            } else {
              // Timer finished while user was away / refreshing!
              setIsRunning(false);
              setSessionSeconds(parsed.initialSeconds || 50 * 60);
              const addedMins = Math.round((parsed.initialSeconds || 50 * 60) / 60);
              setTotalFocusedMinutesToday((prev) => {
                const nextTotal = prev + addedMins;
                try {
                  localStorage.setItem(`redroom_focus_mins_${today}`, String(nextTotal));
                } catch {}
                return nextTotal;
              });
              setTreeStage(4);
            }
          } else {
            setSessionSeconds(parsed.remainingSeconds || parsed.initialSeconds || 50 * 60);
            setIsRunning(false);
          }
        }
      }
    } catch {} finally {
      setLoaded(true);
    }

    // Fetch real-time active users currently browsing website
    const fetchPresence = () => {
      fetch("/api/presence/heartbeat")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data?.activeCadets)) {
            setActiveCadets(json.data.activeCadets);
          }
        })
        .catch(() => {});
    };

    fetchPresence();
    const interval = setInterval(fetchPresence, 10000); // Poll presence every 10s
    return () => clearInterval(interval);
  }, []);

  // 2. Persist Timer State to LocalStorage
  const persistState = useCallback(
    (running: boolean, remaining: number, initial: number, track: typeof ambientTrack) => {
      try {
        const state: PersistentTimerState = {
          isRunning: running,
          initialSeconds: initial,
          remainingSeconds: remaining,
          lastUpdatedTimestamp: Date.now(),
          ambientTrack: track,
        };
        localStorage.setItem(POMODORO_STORAGE_KEY, JSON.stringify(state));
      } catch {}
    },
    []
  );

  // 3. Pomodoro Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && sessionSeconds > 0) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            sound.playVictory();
            setTreeStage(4);
            const added = Math.round(initialSeconds / 60);
            setTotalFocusedMinutesToday((t) => {
              const updated = t + added;
              try {
                const today = new Date().toISOString().slice(0, 10);
                localStorage.setItem(`redroom_focus_mins_${today}`, String(updated));
              } catch {}
              return updated;
            });
            persistState(false, initialSeconds, initialSeconds, ambientTrack);
            return initialSeconds;
          }

          // Grow tree based on time elapsed
          const elapsed = initialSeconds - prev;
          if (elapsed > initialSeconds * 0.75) setTreeStage(4);
          else if (elapsed > initialSeconds * 0.45) setTreeStage(3);
          else if (elapsed > initialSeconds * 0.15) setTreeStage(2);

          const nextSec = prev - 1;
          persistState(true, nextSec, initialSeconds, ambientTrack);
          return nextSec;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, sessionSeconds, initialSeconds, ambientTrack, persistState]);

  // 4. Procedural Web Audio Ambient Sound Generator
  useEffect(() => {
    const cleanupAudio = () => {
      oscNodesRef.current.forEach((n) => {
        try {
          n.stop();
        } catch {}
      });
      oscNodesRef.current = [];

      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        try {
          void audioCtxRef.current.close();
        } catch {}
        audioCtxRef.current = null;
      }
    };

    if (ambientTrack === "none") {
      cleanupAudio();
      return;
    }

    cleanupAudio();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (ambientTrack === "binaural") {
        // 40Hz Gamma Focus Binaural Beats (200Hz Left, 240Hz Right)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);
        const gain = ctx.createGain();

        oscL.frequency.value = 200;
        oscR.frequency.value = 240;
        gain.gain.value = 0.08;

        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(gain);
        gain.connect(ctx.destination);

        oscL.start();
        oscR.start();
        oscNodesRef.current = [oscL, oscR];
      } else if (ambientTrack === "lbsnaa_rain" || ambientTrack === "library") {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = ambientTrack === "lbsnaa_rain" ? "lowpass" : "bandpass";
        filter.frequency.value = ambientTrack === "lbsnaa_rain" ? 800 : 400;

        const gain = ctx.createGain();
        gain.gain.value = 0.05;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        oscNodesRef.current = [noise];
      }
    } catch {}

    return () => {
      cleanupAudio();
    };
  }, [ambientTrack]);

  const toggleTimer = () => {
    sound.playClick();
    const nextRunning = !isRunning;
    setIsRunning(nextRunning);
    persistState(nextRunning, sessionSeconds, initialSeconds, ambientTrack);
  };

  const handleReset = (mins: number) => {
    sound.playClick();
    setIsRunning(false);
    setInitialSeconds(mins * 60);
    setSessionSeconds(mins * 60);
    setTreeStage(1);
    persistState(false, mins * 60, mins * 60, ambientTrack);
  };

  const user = UserSessionManager.getActiveUser();
  const userName = user?.fullName || "Active Cadet";

  const minutes = Math.floor(sessionSeconds / 60);
  const seconds = sessionSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="rounded-3xl border border-[#D8A63A]/30 bg-[#080511] p-6 shadow-2xl backdrop-blur-2xl">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D8A63A]/20 border border-[#D8A63A]/30 text-base">
              ⏳
            </span>
            <h2 className="font-mono text-base font-black tracking-wide text-white sm:text-lg">
              DEEP FOCUS POMODORO & STUDY SANCTUARY
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-0.5">
            Calibrated study sprints, persistent countdown across page refreshes, and live cadet network
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-emerald-300">
          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 font-bold">
            🌱 Today's Focus: {totalFocusedMinutesToday} Mins
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* LEFT: TIMER DIAL & FOCUS TREE */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/40 p-6 space-y-6">
          {/* INTERVAL SELECTOR */}
          <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1 gap-1">
            {[25, 50, 90].map((mins) => (
              <button
                key={mins}
                onClick={() => handleReset(mins)}
                className={`rounded-lg px-3.5 py-1.5 font-mono text-xs font-bold transition ${
                  initialSeconds === mins * 60
                    ? "bg-[#D8A63A] text-black shadow"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {mins} Mins {mins === 50 ? "(Standard)" : mins === 90 ? "(Deep Wave)" : "(Sprint)"}
              </button>
            ))}
          </div>

          {/* TIMER DISPLAY & TREE */}
          <div className="flex flex-col items-center space-y-3">
            <div className="text-4xl sm:text-5xl transition-all duration-500 transform hover:scale-110">
              {treeStage === 1 ? "🌱" : treeStage === 2 ? "🌿" : treeStage === 3 ? "🌳" : "🌲"}
            </div>
            <div className="font-mono text-5xl sm:text-7xl font-black tracking-widest text-white drop-shadow-[0_0_20px_rgba(216,166,58,0.3)]">
              {timeFormatted}
            </div>
            <p className="font-mono text-xs text-[#8C8C8C]">
              {isRunning
                ? "⚡ Focus Protocol Active • Forest Tree Growing"
                : "Sprint Paused • Ready when you are"}
            </p>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTimer}
              className={`rounded-2xl px-8 py-3.5 font-mono text-xs font-black uppercase tracking-wider transition shadow-lg ${
                isRunning
                  ? "bg-amber-600 text-white shadow-amber-950/50 hover:bg-amber-500"
                  : "bg-gradient-to-r from-[#D8A63A] to-[#B38322] text-black shadow-[0_0_20px_rgba(216,166,58,0.3)] hover:scale-105"
              }`}
            >
              {isRunning ? "⏸️ Pause Sprint" : "🚀 Start Focus Sprint"}
            </button>
            <button
              onClick={() => handleReset(Math.round(initialSeconds / 60))}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 font-mono text-xs font-bold text-white/60 hover:text-white"
            >
              🔄 Reset
            </button>
          </div>

          {/* AMBIENT AUDIO SELECTOR */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-white/5">
            <span className="text-[11px] font-mono text-white/50">🎧 Ambient Focus:</span>
            {(["none", "binaural", "lbsnaa_rain", "library"] as const).map((track) => (
              <button
                key={track}
                onClick={() => {
                  setAmbientTrack(track);
                  persistState(isRunning, sessionSeconds, initialSeconds, track);
                }}
                className={`rounded-xl px-2.5 py-1 text-[11px] font-mono transition ${
                  ambientTrack === track
                    ? "bg-[#D8A63A] text-black font-bold"
                    : "bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                {track === "none"
                  ? "Mute"
                  : track === "binaural"
                  ? "40Hz Gamma Waves"
                  : track === "lbsnaa_rain"
                  ? "LBSNAA Rain"
                  : "Old Library"}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: ACTIVE CADET PRESENCE */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                👥 LIVE STUDY NETWORK
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] text-emerald-400 font-bold">
                  {Math.max(1, activeCadets.length)} Active Cadets
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {/* Active Current User */}
              <div className="flex items-center justify-between rounded-xl border border-[#D8A63A]/30 bg-[#D8A63A]/10 p-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🎯</span>
                  <div>
                    <h4 className="font-bold text-[#F4C95D] line-clamp-1">{userName} (You)</h4>
                    <p className="text-[10px] text-white/50">{isRunning ? "Deep Sprint Active" : "In Study Sanctuary"}</p>
                  </div>
                </div>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                  {isRunning ? "FOCUSING" : "ONLINE"}
                </span>
              </div>

              {/* Other Active Cadets */}
              {activeCadets
                .filter((name) => name !== userName)
                .slice(0, 5)
                .map((name, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-black/40 p-2.5 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">👨‍🎓</span>
                      <span className="text-white/80 font-medium truncate max-w-[140px]">{name}</span>
                    </div>
                    <span className="text-[9px] text-emerald-400">● Studying</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3 text-[11px] font-mono text-[#8C8C8C]">
            💡 <strong>Persistent Focus:</strong> Timer state is saved in your browser and will continue running even if you refresh or switch tabs.
          </div>
        </div>
      </div>
    </div>
  );
}
