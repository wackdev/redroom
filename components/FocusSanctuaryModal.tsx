"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { DayPlan, StudyTask } from "@/lib/core/types";
import { getDateKey, safeArray } from "@/lib/core/utils";
import { broadcastSyncChange, pushStateToCloud } from "@/lib/sync/sync-engine";
import { sound } from "@/lib/audio/sound-engine";
import { trackActivityEvent } from "@/lib/brain/activity-events";

const STUDY_PLAN_STORAGE_KEY = "redroom_study_plan";
const FOCUS_TIMER_PERSIST_KEY = "whynotupsc_focus_sanctuary_timer";

type SoundscapeType = "none" | "alpha_waves" | "rain" | "brown_noise";

export default function FocusSanctuaryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [targetMinutes, setTargetMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundscape, setSoundscape] = useState<SoundscapeType>("none");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Today's Study Tasks
  const [todayTasks, setTodayTasks] = useState<StudyTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  // Timestamp anchor reference for zero-drift timing
  const targetEndTimeRef = useRef<number | null>(null);

  // Audio synthesis references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<{ source?: AudioNode; gain?: GainNode } | null>(null);

  // Load Today's Study Tasks
  const loadTodayTasks = useCallback(() => {
    try {
      const today = getDateKey();
      const raw = localStorage.getItem(STUDY_PLAN_STORAGE_KEY);
      if (raw) {
        const plans: Record<string, DayPlan> = JSON.parse(raw);
        if (plans[today]?.tasks) {
          const tasks = safeArray(plans[today].tasks);
          setTodayTasks(tasks);
          if (tasks.length > 0 && !selectedTaskId) {
            setSelectedTaskId(tasks[0].id);
          }
        }
      }
    } catch {}
  }, [selectedTaskId]);

  // Restore persistent timer state on mount / open
  const restoreTimerState = useCallback(() => {
    try {
      const saved = localStorage.getItem(FOCUS_TIMER_PERSIST_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setTargetMinutes(parsed.targetMinutes || 25);
          setSoundscape(parsed.soundscape || "none");
          if (parsed.selectedTaskId) setSelectedTaskId(parsed.selectedTaskId);

          if (parsed.isRunning && parsed.targetEndTimeMs) {
            const now = Date.now();
            const diffSec = Math.max(0, Math.ceil((parsed.targetEndTimeMs - now) / 1000));
            if (diffSec > 0) {
              targetEndTimeRef.current = parsed.targetEndTimeMs;
              setSecondsRemaining(diffSec);
              setIsRunning(true);
            } else {
              targetEndTimeRef.current = null;
              setSecondsRemaining(0);
              setIsRunning(false);
            }
          } else {
            setSecondsRemaining(parsed.secondsRemaining ?? (parsed.targetMinutes || 25) * 60);
            setIsRunning(false);
          }
        }
      }
    } catch {}
  }, []);

  // Save persistent timer state
  const persistTimerState = useCallback(
    (running: boolean, remaining: number, targetMins: number, endMs: number | null, sound: SoundscapeType) => {
      try {
        const payload = {
          isRunning: running,
          secondsRemaining: remaining,
          targetMinutes: targetMins,
          targetEndTimeMs: endMs,
          soundscape: sound,
          selectedTaskId,
          lastUpdated: Date.now(),
        };
        localStorage.setItem(FOCUS_TIMER_PERSIST_KEY, JSON.stringify(payload));
      } catch {}
    },
    [selectedTaskId]
  );

  // Listen for open event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      loadTodayTasks();
      restoreTimerState();
    };

    window.addEventListener("redroom_open_focus_modal", handleOpen);
    return () => window.removeEventListener("redroom_open_focus_modal", handleOpen);
  }, [loadTodayTasks, restoreTimerState]);

  // Handle Fullscreen change sync
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
          (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

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
            void audioCtxRef.current.suspend();
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

      if (type === "alpha_waves") {
        // Binaural 10Hz Alpha Beats (Base 196Hz + 206Hz)
        const oscLeft = ctx.createOscillator();
        const oscRight = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);

        oscLeft.type = "sine";
        oscLeft.frequency.value = 196; // G3
        oscRight.type = "sine";
        oscRight.frequency.value = 206; // 10Hz beat difference

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
            // Rain (Pink Noise with lowpass filter)
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
  const handleSessionComplete = useCallback(() => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    stopAudio();
    sound.playVictory();

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

    void trackActivityEvent("FOCUS_SESSION_COMPLETED", {
      targetMinutes,
      soundscape,
      selectedTaskId,
    });

    persistTimerState(false, targetMinutes * 60, targetMinutes, null, soundscape);
    alert(`🧘 Focus Sanctuary Completed! Logged ${targetMinutes} minutes of deep study.`);
  }, [targetMinutes, selectedTaskId, soundscape, stopAudio, persistTimerState]);

  // Handle Page Visibility & Tab Re-focus (Zero Timer Drift on Sleep/Wake)
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (isRunning && targetEndTimeRef.current) {
        const now = Date.now();
        const recalculated = Math.max(0, Math.ceil((targetEndTimeRef.current - now) / 1000));
        setSecondsRemaining(recalculated);
        if (recalculated <= 0) {
          handleSessionComplete();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
    };
  }, [isRunning, handleSessionComplete]);

  // Accurate Timestamp-Delta Timer Interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        if (!targetEndTimeRef.current) return;
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((targetEndTimeRef.current - now) / 1000));
        setSecondsRemaining(diff);

        persistTimerState(true, diff, targetMinutes, targetEndTimeRef.current, soundscape);

        if (diff <= 0) {
          handleSessionComplete();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, targetMinutes, soundscape, persistTimerState, handleSessionComplete]);

  const handleToggleTimer = () => {
    if (!isRunning) {
      sound.playSelect();
      const endMs = Date.now() + secondsRemaining * 1000;
      targetEndTimeRef.current = endMs;
      setIsRunning(true);
      persistTimerState(true, secondsRemaining, targetMinutes, endMs, soundscape);
    } else {
      sound.playLock();
      targetEndTimeRef.current = null;
      setIsRunning(false);
      persistTimerState(false, secondsRemaining, targetMinutes, null, soundscape);
    }
  };

  const handleSelectDuration = (minutes: number) => {
    sound.playHover();
    setTargetMinutes(minutes);
    const secs = minutes * 60;
    setSecondsRemaining(secs);
    setIsRunning(false);
    targetEndTimeRef.current = null;
    persistTimerState(false, secs, minutes, null, soundscape);
  };

  const handleResetTimer = () => {
    sound.playHover();
    setIsRunning(false);
    targetEndTimeRef.current = null;
    const secs = targetMinutes * 60;
    setSecondsRemaining(secs);
    stopAudio();
    persistTimerState(false, secs, targetMinutes, null, soundscape);
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

  const formattedTime = `${String(Math.floor(secondsRemaining / 60)).padStart(2, "0")}:${String(
    secondsRemaining % 60
  ).padStart(2, "0")}`;

  const progressPercent = Math.min(
    100,
    Math.max(0, ((targetMinutes * 60 - secondsRemaining) / (targetMinutes * 60)) * 100)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-b from-[#170a2c] via-[#0f061e] to-[#07030e] p-5 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.25)] space-y-5 sm:space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🧘</span>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white">Deep Work Focus Sanctuary</h3>
              <p className="text-[10px] sm:text-[11px] text-purple-300">
                Distraction-Free UPSC Study Session • Timestamp Synchronized
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Focus"}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs text-white/70 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              {isFullscreen ? "🗗" : "⛶"}
            </button>
            <button
              onClick={() => {
                sound.playHover();
                setIsOpen(false);
              }}
              title="Close Focus Modal"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CIRCULAR TIMER DISPLAY */}
        <div className="flex flex-col items-center justify-center py-2 sm:py-4">
          <div className="relative flex h-44 w-44 sm:h-52 sm:w-52 items-center justify-center rounded-full border-4 border-purple-500/30 bg-black/50 shadow-[0_0_50px_rgba(168,85,247,0.2)]">
            <div className="text-center">
              <span className="font-mono text-4xl sm:text-5xl font-black text-white tracking-tight">
                {formattedTime}
              </span>
              <p className="mt-1 text-[11px] font-bold text-purple-300 uppercase tracking-widest">
                {isRunning ? "🔥 Deep Focus Active" : "Ready to Immerse"}
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 w-56 sm:w-64 overflow-hidden rounded-full bg-white/10 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-[#D8A63A] transition-all duration-300"
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
              className={`min-h-[44px] rounded-2xl border p-2.5 text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                targetMinutes === preset.min
                  ? "border-pink-500 bg-pink-500/20 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* AMBIENT SOUNDSCAPE SELECTOR */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-white/60 block">
            🎧 Ambient Focus Soundscapes
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "none", label: "🔇 Silent" },
              { id: "alpha_waves", label: "🧠 10Hz Alpha" },
              { id: "rain", label: "🌧️ Rain" },
              { id: "brown_noise", label: "📻 Deep Noise" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  sound.playHover();
                  setSoundscape(s.id as SoundscapeType);
                  persistTimerState(isRunning, secondsRemaining, targetMinutes, targetEndTimeRef.current, s.id as SoundscapeType);
                }}
                className={`min-h-[44px] rounded-xl border px-2 py-2 text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                  soundscape === s.id
                    ? "border-purple-400 bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                    : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* STUDY TASK LINK */}
        {todayTasks.length > 0 && (
          <div className="space-y-1.5 border-t border-white/10 pt-3 sm:pt-4">
            <label className="text-xs font-bold text-purple-300 block">
              🔗 Link Session to Today&apos;s Target:
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-white/10 bg-[#1e1035] px-3 py-2 text-xs font-semibold text-white outline-none focus:border-purple-500"
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
            onClick={handleToggleTimer}
            className={`min-h-[48px] flex-1 rounded-2xl py-3.5 text-xs sm:text-sm font-black transition-all shadow-xl cursor-pointer ${
              isRunning
                ? "bg-amber-600 text-white hover:bg-amber-500 shadow-amber-950/60"
                : "bg-gradient-to-r from-purple-600 via-pink-600 to-[#D8A63A] text-white hover:opacity-95 shadow-purple-950/60"
            }`}
          >
            {isRunning ? "⏸ Pause Focus Session" : "▶ Start Deep Focus"}
          </button>
          <button
            onClick={handleResetTimer}
            className="min-h-[48px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
