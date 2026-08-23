"use client";

import { useEffect, useRef, useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

export default function FocusSoundscape() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeFrequency, setActiveFrequency] = useState<"alpha" | "theta" | "rain">("alpha");
  const [volume, setVolume] = useState(0.2);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscLeftRef = useRef<OscillatorNode | null>(null);
  const oscRightRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const stopAudio = () => {
    try {
      oscLeftRef.current?.stop();
      oscRightRef.current?.stop();
      oscLeftRef.current?.disconnect();
      oscRightRef.current?.disconnect();
      audioCtxRef.current?.close();
    } catch {}
    audioCtxRef.current = null;
    oscLeftRef.current = null;
    oscRightRef.current = null;
    setIsPlaying(false);
  };

  const startAudio = (type: "alpha" | "theta" | "rain") => {
    stopAudio();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      // Base Carrier Frequencies
      let baseFreq = 200;
      let diff = 10; // Alpha 10 Hz

      if (type === "theta") {
        baseFreq = 150;
        diff = 6; // Theta 6 Hz
      } else if (type === "rain") {
        baseFreq = 100;
        diff = 2;
      }

      // Left Channel
      const oscL = ctx.createOscillator();
      oscL.type = "sine";
      oscL.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      const merger = ctx.createChannelMerger(2);
      oscL.connect(merger, 0, 0);

      // Right Channel
      const oscR = ctx.createOscillator();
      oscR.type = "sine";
      oscR.frequency.setValueAtTime(baseFreq + diff, ctx.currentTime);
      oscR.connect(merger, 0, 1);

      merger.connect(gain);

      oscL.start();
      oscR.start();

      oscLeftRef.current = oscL;
      oscRightRef.current = oscR;
      setIsPlaying(true);
      setActiveFrequency(type);
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const handleToggle = (type: "alpha" | "theta" | "rain") => {
    if (isPlaying && activeFrequency === type) {
      stopAudio();
      sound.playLock();
    } else {
      startAudio(type);
      sound.playWarp();
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/50 p-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="font-bold text-[#F4C95D] uppercase flex items-center gap-2">
          <span>🎧</span>
          <span>Flow-State Binaural Synthesizer</span>
        </span>
        <span className="text-[10px] text-[#8C8C8C]">
          {isPlaying ? "⚡ ACTIVE (Stereo Headphones Recommended)" : "PAUSED"}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          onClick={() => handleToggle("alpha")}
          className={`rounded-xl py-2 px-2.5 text-center transition border ${
            isPlaying && activeFrequency === "alpha"
              ? "border-[#D8A63A] bg-[#D8A63A] text-black font-black shadow-lg"
              : "border-white/10 bg-white/5 text-white/70 hover:text-white"
          }`}
        >
          <strong className="block text-[11px]">Alpha 10Hz</strong>
          <span className="text-[9px] opacity-75">Deep Focus</span>
        </button>

        <button
          onClick={() => handleToggle("theta")}
          className={`rounded-xl py-2 px-2.5 text-center transition border ${
            isPlaying && activeFrequency === "theta"
              ? "border-purple-500 bg-purple-600 text-white font-black shadow-lg"
              : "border-white/10 bg-white/5 text-white/70 hover:text-white"
          }`}
        >
          <strong className="block text-[11px]">Theta 6Hz</strong>
          <span className="text-[9px] opacity-75">Memory Lock</span>
        </button>

        <button
          onClick={() => handleToggle("rain")}
          className={`rounded-xl py-2 px-2.5 text-center transition border ${
            isPlaying && activeFrequency === "rain"
              ? "border-blue-500 bg-blue-600 text-white font-black shadow-lg"
              : "border-white/10 bg-white/5 text-white/70 hover:text-white"
          }`}
        >
          <strong className="block text-[11px]">Calm 2Hz</strong>
          <span className="text-[9px] opacity-75">Anti-Anxiety</span>
        </button>
      </div>
    </div>
  );
}
