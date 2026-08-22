"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { DayPlan, StudyTask } from "@/lib/core/types";
import { getDateKey, safeArray } from "@/lib/core/utils";
import { broadcastSyncChange, pushStateToCloud } from "@/lib/sync/sync-engine";

const STUDY_PLAN_STORAGE_KEY = "redroom_study_plan";

type SoundscapeType = "none" | "alpha_waves" | "rain" | "brown_noise";

export default function FocusSanctuaryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [targetMinutes, setTargetMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundscape, setSoundscape] = useState<SoundscapeType>("none");

  // Today's Study Tasks
  const [todayTasks, setTodayTasks] = useState<StudyTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  // Audio synthesis references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<{ source?: AudioNode; gain?: GainNode } | null>(null);

  // Listen for open event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      loadTodayTasks();
    };

    window.addEventListener("redroom_open_focus_modal", handleOpen);
    return () => window.removeEventListener("redroom_open_focus_modal", handleOpen);
  }, []);

  const loadTodayTasks = () => {
    try {
      const today = getDateKey();
      const raw = localStorage.getItem(STUDY_PLAN_STORAGE_KEY);
      if (raw) {
        const plans: Record<string, DayPlan> = JSON.parse(raw);
        if (plans[today]?.tasks) {
          setTodayTasks(safeArray(plans[today].tasks));
          if (plans[today].tasks.length > 0 && !selectedTaskId) {
            setSelectedTaskId(plans[today].tasks[0].id);
          }
        }
      }
    } catch {}
  };

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  // Stop Audio on Unmount or Stop
  const stopAudio = useCallback(() => {
    if (soundNodesRef.current?.gain) {
      try {
        soundNodesRef.current.gain.gain.linearRampToValueAtTime(
          0.001,
          audioCtxRef.current ? audioCtxRef.current.currentTime + 0.5 : 0
        );
        setTimeout(() => {
          if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
            audioCtxRef.current.suspend();
          }
        }, 500);
      } catch {}
    }
  }, []);

  // Web Audio API Ambient Soundscape Generator
  const playSoundscape = useCallback((type: SoundscapeType) => {
    stopAudio();
    if (type === "none") return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

      if (type === "alpha_waves") {
        // Binaural 10Hz Alpha Beats (Base 200Hz + 210Hz)
        const oscLeft = ctx.createOscillator();
        const oscRight = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);

        oscLeft.type = "sine";
        oscLeft.frequency.value = 196; // G3
        oscRight.type = "sine";
        oscRight.frequency.value = 206; // 10Hz beat

        oscLeft.connect(merger, 0, 0);
        oscRight.connect(merger, 0, 1);
        merger.connect(masterGain);

        oscLeft.start();
        oscRight.start();
        soundNodesRef.current = { source: merger, gain: masterGain };
      } else if (type === "rain" || type === "brown_noise") {
        // Buffer Noise Synthesizer
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === "brown_noise") {
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
          } else {
            // Rain (Pink Noise with filter)
            output[i] = (lastOut + 0.05 * white) / 1.05;
            lastOut = output[i];
          }
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = type === "rain" ? 800 : 350;

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();

        soundNodesRef.current = { source: whiteNoise, gain: masterGain };
      }
    } catch (e) {
      console.warn("Audio synthesis not supported or blocked:", e);
    }
  }, [stopAudio]);

  useEffect(() => {
    if (isRunning && isOpen) {
      playSoundscape(soundscape);
    } else {
      stopAudio();
    }
    return () => stopAudio();
  }, [isRunning, isOpen, soundscape, playSoundscape, stopAudio]);

  // Handle Session Completion
  const handleSessionComplete = () => {
    setIsRunning(false);
    stopAudio();

    // Auto-update study task if selected
    try {
      const today = getDateKey();
      const raw = localStorage.getItem(STUDY_PLAN_STORAGE_KEY);
      if (raw) {
        const plans: Record<string, DayPlan> = JSON.parse(raw);
        if (plans[today]?.tasks) {
          const hoursCompleted = +(targetMinutes / 60).toFixed(1);
          const updatedTasks = plans[today].tasks.map((t) => {
            if (t.id === selectedTaskId) {
              return {
                ...t,
                completed: true,
                completedAt: new Date().toISOString(),
                hours: Math.max(t.hours, hoursCompleted),
              };
            }
            return t;
          });

          plans[today].tasks = updatedTasks;
          localStorage.setItem(STUDY_PLAN_STORAGE_KEY, JSON.stringify(plans));
          broadcastSyncChange("study_plan");
          void pushStateToCloud();
        }
      }
    } catch {}

    alert(`🧘 Focus Sanctuary Completed! Logged ${targetMinutes} minutes of deep study.`);
  };

  const handleSelectDuration = (minutes: number) => {
    setTargetMinutes(minutes);
    setSecondsRemaining(minutes * 60);
    setIsRunning(false);
  };

  const formattedTime = `${String(Math.floor(secondsRemaining / 60)).padStart(2, "0")}:${String(
    secondsRemaining % 60
  ).padStart(2, "0")}`;

  const progressPercent = ((targetMinutes * 60 - secondsRemaining) / (targetMinutes * 60)) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-b from-[#170a2c] via-[#0f061e] to-[#07030e] p-6 shadow-2xl md:p-8 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧘</span>
            <div>
              <h3 className="font-black text-lg text-white">Deep Work Focus Sanctuary</h3>
              <p className="text-[11px] text-purple-300">Distraction-Free UPSC Study Session</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsRunning(false);
              stopAudio();
              setIsOpen(false);
            }}
            className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* CIRCULAR TIMER DISPLAY */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-purple-500/20 bg-black/40 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
            <div className="text-center">
              <span className="font-mono text-5xl font-black text-white">{formattedTime}</span>
              <p className="mt-1 text-xs font-semibold text-purple-300 uppercase tracking-widest">
                {isRunning ? "Focusing..." : "Ready"}
              </p>
            </div>
          </div>

          <div className="mt-4 h-1.5 w-64 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* DURATION PRESETS */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { min: 25, label: "25m Pomodoro" },
            { min: 50, label: "50m Deep Block" },
            { min: 90, label: "90m GS Marathon" },
          ].map((preset) => (
            <button
              key={preset.min}
              disabled={isRunning}
              onClick={() => handleSelectDuration(preset.min)}
              className={`rounded-2xl border p-2.5 text-xs font-bold transition ${
                targetMinutes === preset.min
                  ? "border-pink-500 bg-pink-500/20 text-pink-300"
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* AMBIENT SOUNDSCAPE SELECTOR */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-white/50">
            🎧 Ambient Focus Soundscapes
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: "none", label: "🔇 Silent" },
              { id: "alpha_waves", label: "🧠 10Hz Alpha" },
              { id: "rain", label: "🌧️ Rain" },
              { id: "brown_noise", label: "📻 Deep Noise" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSoundscape(s.id as SoundscapeType)}
                className={`rounded-xl border px-2 py-2 text-[11px] font-bold transition ${
                  soundscape === s.id
                    ? "border-purple-400 bg-purple-600 text-white shadow-lg"
                    : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* STUDY TASK LINK */}
        {todayTasks.length > 0 && (
          <div className="space-y-1.5 border-t border-white/10 pt-4">
            <label className="text-xs font-bold text-purple-300">
              🔗 Link Session to Today&apos;s Target:
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#1e1035] px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-500"
            >
              {todayTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.subject}: {t.title} ({t.hours}h)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* PLAY / PAUSE CONTROLS */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setIsRunning((prev) => !prev)}
            className={`flex-1 rounded-2xl py-3.5 text-sm font-black transition-all shadow-xl ${
              isRunning
                ? "bg-amber-600 text-white hover:bg-amber-500"
                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 shadow-purple-950/60"
            }`}
          >
            {isRunning ? "⏸ Pause Focus Session" : "▶ Start Deep Focus"}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsRemaining(targetMinutes * 60);
              stopAudio();
            }}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-xs font-semibold text-white/60 hover:bg-white/10"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
