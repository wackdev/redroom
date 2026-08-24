"use client";

import React, { useState, useEffect, useRef } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface PeerCadet {
  id: string;
  name: string;
  avatar: string;
  focusSubject: string;
  currentStreakMins: number;
  status: "Deep Focus" | "Reviewing Notes" | "Break";
}

const PEER_STUDY_ROOM: PeerCadet[] = [
  { id: "p1", name: "Cadet Sharma (IAS Trainee)", avatar: "👨‍💼", focusSubject: "GS-2 Polity & Governance", currentStreakMins: 142, status: "Deep Focus" },
  { id: "p2", name: "Cadet Ananya (IPS Track)", avatar: "👩‍💼", focusSubject: "Modern Indian History", currentStreakMins: 95, status: "Deep Focus" },
  { id: "p3", name: "Cadet Rohan (IFS Aspiration)", avatar: "👨‍💻", focusSubject: "International Relations & Treaties", currentStreakMins: 210, status: "Reviewing Notes" },
  { id: "p4", name: "Cadet Priya (IRS Cadre)", avatar: "👩‍🔬", focusSubject: "Economy Macro-Models", currentStreakMins: 60, status: "Deep Focus" },
];

export default function VirtualStudyHall() {
  const [sessionSeconds, setSessionSeconds] = useState(50 * 60); // 50m focus
  const [isRunning, setIsRunning] = useState(false);
  const [ambientTrack, setAmbientTrack] = useState<"none" | "binaural" | "lbsnaa_rain" | "library">("none");
  const [treeStage, setTreeStage] = useState<number>(1); // 1: Seed, 2: Sprout, 3: Sapling, 4: Mighty Banyan
  const [totalFocusedMinutesToday, setTotalFocusedMinutesToday] = useState(185);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscNodesRef = useRef<any[]>([]);

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning && sessionSeconds > 0) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            sound.playWarp();
            setTreeStage(4);
            setTotalFocusedMinutesToday((t) => t + 50);
            return 50 * 60;
          }
          // Grow tree based on time elapsed
          const elapsed = 50 * 60 - prev;
          if (elapsed > 35 * 60) setTreeStage(4);
          else if (elapsed > 20 * 60) setTreeStage(3);
          else if (elapsed > 5 * 60) setTreeStage(2);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, sessionSeconds]);

  // Procedural Web Audio Ambient Sound Generator
  useEffect(() => {
    // Cleanup previous context if any
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

    // Clean any prior running context before creating a new one
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
        oscR.frequency.value = 240; // 40Hz difference for focus
        gain.gain.value = 0.08;

        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(gain);
        gain.connect(ctx.destination);

        oscL.start();
        oscR.start();
        oscNodesRef.current = [oscL, oscR];
      } else if (ambientTrack === "lbsnaa_rain" || ambientTrack === "library") {
        // Procedural White/Pink Noise for Rain & Library
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
    setIsRunning(!isRunning);
  };

  const minutes = Math.floor(sessionSeconds / 60);
  const seconds = sessionSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080511] p-5 shadow-2xl backdrop-blur-2xl">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-sm">
              ⏳
            </span>
            <h2 className="font-mono text-base font-black tracking-wide text-white sm:text-lg">
              24/7 Virtual Redroom Study Hall (Deep Focus)
            </h2>
          </div>
          <p className="text-xs text-white/50">
            Synchronized 50m Pomodoro, LBSNAA ambient acoustics, Forest tree cultivation & peer presence
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-emerald-300">
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-bold">
            🔥 Today's Deep Work: {Math.floor(totalFocusedMinutesToday / 60)}h {totalFocusedMinutesToday % 60}m
          </span>
        </div>
      </div>

      {/* FOCUS CENTER GRID */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT: TIMER & FOREST TREE CULTIVATION */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-8 space-y-6 text-center">
          {/* VIRTUAL TREE ANIMATION */}
          <div className="flex flex-col items-center">
            <div className="text-6xl animate-bounce">
              {treeStage === 1 ? "🌱" : treeStage === 2 ? "🌿" : treeStage === 3 ? "🪴" : "🌳"}
            </div>
            <span className="mt-2 text-xs font-mono text-emerald-300 font-bold">
              {treeStage === 1
                ? "Cultivating Seedling..."
                : treeStage === 2
                ? "Sprouting Knowledge..."
                : treeStage === 3
                ? "Sapling Growing..."
                : "Mighty Banyan Tree Grown!"}
            </span>
          </div>

          {/* TIMER DISPLAY */}
          <div className="font-mono text-6xl font-black tracking-tight text-white drop-shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            {timeFormatted}
          </div>

          {/* TIMER CONTROLS */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTimer}
              className={`rounded-2xl px-6 py-3 font-mono text-xs font-black uppercase tracking-wider transition shadow-lg ${
                isRunning
                  ? "bg-amber-600 text-white shadow-amber-950/50 hover:bg-amber-500"
                  : "bg-emerald-600 text-white shadow-emerald-950/50 hover:bg-emerald-500"
              }`}
            >
              {isRunning ? "⏸️ Pause Sprint" : "🚀 Start 50m Focus Sprint"}
            </button>
          </div>

          {/* AMBIENT AUDIO SELECTOR */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-white/5">
            <span className="text-[11px] font-mono text-white/50">🎧 Ambient Audio:</span>
            {(["none", "binaural", "lbsnaa_rain", "library"] as const).map((track) => (
              <button
                key={track}
                onClick={() => setAmbientTrack(track)}
                className={`rounded-xl px-2.5 py-1 text-[11px] font-mono transition ${
                  ambientTrack === track
                    ? "bg-emerald-500 text-black font-bold"
                    : "bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                {track === "none"
                  ? "Mute"
                  : track === "binaural"
                  ? "40Hz Gamma Focus"
                  : track === "lbsnaa_rain"
                  ? "LBSNAA Rain"
                  : "Old Library"}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: LIVE PEER CADETS STUDY PRESENCE */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-xs font-mono font-bold text-white">
              👥 Study Hall Cadets ({PEER_STUDY_ROOM.length} Active)
            </h3>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-2.5">
            {PEER_STUDY_ROOM.map((peer) => (
              <div
                key={peer.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-black/40 p-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{peer.avatar}</span>
                  <div>
                    <h4 className="font-bold text-white line-clamp-1">{peer.name}</h4>
                    <p className="text-[11px] text-white/50 line-clamp-1">{peer.focusSubject}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    {peer.currentStreakMins}m
                  </span>
                  <span className="block text-[9px] text-white/40 mt-0.5">{peer.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
