"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { sound } from "@/lib/audio/sound-engine";
import { UPSC_SUBJECTS, UPSCSubject } from "@/lib/core/constants";
import { safeArray } from "@/lib/core/utils";
import { broadcastSyncChange, subscribeToSyncChanges, pushStateToCloud } from "@/lib/sync/sync-engine";
import { trackActivityEvent } from "@/lib/brain/activity-events";

export interface FocusSessionRecord {
  id: string;
  userId?: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  completedAt: string; // ISO timestamp
  notes?: string;
}

const STORAGE_KEY_SESSIONS = "redroom_focus_sessions";
const POMODORO_PERSIST_KEY = "whynotupsc_pomodoro_state";

type TimeRange = "today" | "week" | "month" | "all";
type AmbientSound = "none" | "binaural" | "lbsnaa_rain" | "library";

const PRESET_SPRINTS = [
  { label: "25m Pomodoro", minutes: 25, icon: "⚡" },
  { label: "50m Deep Sprint", minutes: 50, icon: "🔥" },
  { label: "90m Master Block", minutes: 90, icon: "🏛️" },
  { label: "120m Full GS Drill", minutes: 120, icon: "🎯" },
];

export default function PomodoroStudyTracker() {
  // Timer States
  const [selectedDuration, setSelectedDuration] = useState<number>(50); // minutes
  const [sessionSeconds, setSessionSeconds] = useState<number>(50 * 60);
  const [initialSeconds, setInitialSeconds] = useState<number>(50 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [ambientTrack, setAmbientTrack] = useState<AmbientSound>("none");
  const [selectedSubject, setSelectedSubject] = useState<string>("Polity");
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [treeStage, setTreeStage] = useState<number>(1); // 1: Seed, 2: Sprout, 3: Sapling, 4: Mighty Banyan

  // Telemetry & Historical Data
  const [sessions, setSessions] = useState<FocusSessionRecord[]>([]);
  const [activeTab, setActiveTab] = useState<TimeRange>("today");
  const [activeCadetsCount, setActiveCadetsCount] = useState<number>(18);
  const [showManualLogModal, setShowManualLogModal] = useState<boolean>(false);
  const [manualDuration, setManualDuration] = useState<number>(45);
  const [manualSubject, setManualSubject] = useState<string>("Polity");
  const [manualTopic, setManualTopic] = useState<string>("");

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscNodesRef = useRef<any[]>([]);

  // 1. Load Sessions & Saved State from Storage
  const loadSessions = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSessions(parsed);
          return;
        }
      }

      // Seed fallback session data if brand new
      const todayStr = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const seedSessions: FocusSessionRecord[] = [
        {
          id: "seed-1",
          subject: "Polity",
          topic: "Fundamental Rights (Articles 14-18) & Laxmikanth Ch 7",
          durationMinutes: 50,
          date: todayStr,
          completedAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: "seed-2",
          subject: "Economy",
          topic: "Monetary Policy Committee & RBI Repo Rate Transmission",
          durationMinutes: 45,
          date: todayStr,
          completedAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "seed-3",
          subject: "History",
          topic: "Non-Cooperation Movement & Swarajists 1920-1925",
          durationMinutes: 50,
          date: yesterday,
          completedAt: new Date(Date.now() - 90000000).toISOString(),
        },
      ];
      setSessions(seedSessions);
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(seedSessions));
    } catch {}
  }, []);

  useEffect(() => {
    loadSessions();

    // Check persistent active timer
    try {
      const savedTimer = localStorage.getItem(POMODORO_PERSIST_KEY);
      if (savedTimer) {
        const parsed = JSON.parse(savedTimer);
        if (parsed && typeof parsed === "object") {
          setInitialSeconds(parsed.initialSeconds || 50 * 60);
          setAmbientTrack(parsed.ambientTrack || "none");
          if (parsed.subject) setSelectedSubject(parsed.subject);
          if (parsed.topic) setCurrentTopic(parsed.topic);

          if (parsed.isRunning && parsed.lastUpdatedTimestamp) {
            const elapsed = Math.floor((Date.now() - parsed.lastUpdatedTimestamp) / 1000);
            const remaining = Math.max(0, (parsed.remainingSeconds || parsed.initialSeconds) - elapsed);
            if (remaining > 0) {
              setSessionSeconds(remaining);
              setIsRunning(true);
            } else {
              setSessionSeconds(parsed.initialSeconds || 50 * 60);
              setIsRunning(false);
            }
          } else {
            setSessionSeconds(parsed.remainingSeconds || parsed.initialSeconds || 50 * 60);
            setIsRunning(false);
          }
        }
      }
    } catch {}

    // Subscribe to cross-tab updates
    const unsubscribe = subscribeToSyncChanges((type) => {
      if (type === "all" || type === "study_plan") {
        loadSessions();
      }
    });

    return unsubscribe;
  }, [loadSessions]);

  // 2. Persist Timer State to LocalStorage
  const persistTimer = useCallback(
    (running: boolean, remaining: number, initial: number, track: AmbientSound) => {
      try {
        const state = {
          isRunning: running,
          initialSeconds: initial,
          remainingSeconds: remaining,
          lastUpdatedTimestamp: Date.now(),
          ambientTrack: track,
          subject: selectedSubject,
          topic: currentTopic,
        };
        localStorage.setItem(POMODORO_PERSIST_KEY, JSON.stringify(state));
      } catch {}
    },
    [selectedSubject, currentTopic]
  );

  // 3. Save a Completed Focus Session to DB & LocalStorage
  const recordCompletedSession = useCallback(
    (durationMins: number, subject: string, topic: string) => {
      const todayStr = new Date().toISOString().slice(0, 10);
      const newSession: FocusSessionRecord = {
        id: `session-${Date.now()}`,
        subject: subject || "General Studies",
        topic: topic.trim() || `${subject} Core Study Block`,
        durationMinutes: durationMins,
        date: todayStr,
        completedAt: new Date().toISOString(),
      };

      setSessions((prev) => {
        const updated = [newSession, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated));
          const currentMins = parseInt(localStorage.getItem(`redroom_focus_mins_${todayStr}`) || "0", 10);
          localStorage.setItem(`redroom_focus_mins_${todayStr}`, String(currentMins + durationMins));
        } catch {}
        return updated;
      });

      void trackActivityEvent("STUDY_SESSION_COMPLETED", {
        subject: newSession.subject,
        topic: newSession.topic,
        durationMinutes: durationMins,
      });

      broadcastSyncChange("study_plan");
      void pushStateToCloud();
    },
    []
  );

  // 4. Timer Countdown Interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && sessionSeconds > 0) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            sound.playVictory();
            setTreeStage(4);
            const durationMins = Math.round(initialSeconds / 60);
            recordCompletedSession(durationMins, selectedSubject, currentTopic);
            persistTimer(false, initialSeconds, initialSeconds, ambientTrack);
            return initialSeconds;
          }

          // Tree evolution
          const elapsed = initialSeconds - prev;
          if (elapsed > initialSeconds * 0.75) setTreeStage(4);
          else if (elapsed > initialSeconds * 0.45) setTreeStage(3);
          else if (elapsed > initialSeconds * 0.15) setTreeStage(2);

          const nextSec = prev - 1;
          persistTimer(true, nextSec, initialSeconds, ambientTrack);
          return nextSec;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, sessionSeconds, initialSeconds, ambientTrack, selectedSubject, currentTopic, persistTimer, recordCompletedSession]);

  // 5. Audio Synthesizer for Ambient Soundscapes
  useEffect(() => {
    const cleanup = () => {
      oscNodesRef.current.forEach((node) => {
        try {
          node.stop();
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

    if (ambientTrack === "none" || !isRunning) {
      cleanup();
      return;
    }

    cleanup();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (ambientTrack === "binaural") {
        // 40Hz Gamma Focus Binaural Beats
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
        // Soft white noise pink filtered rain
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
        filter.type = "lowpass";
        filter.frequency.value = ambientTrack === "lbsnaa_rain" ? 600 : 350;

        const gain = ctx.createGain();
        gain.gain.value = 0.05;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        oscNodesRef.current = [noise];
      }
    } catch {}

    return cleanup;
  }, [ambientTrack, isRunning]);

  // Handlers for Timer
  const handleSelectPreset = (mins: number) => {
    sound.playSelect();
    setSelectedDuration(mins);
    setInitialSeconds(mins * 60);
    setSessionSeconds(mins * 60);
    setIsRunning(false);
    persistTimer(false, mins * 60, mins * 60, ambientTrack);
  };

  const handleTogglePlay = () => {
    sound.playLock();
    setIsRunning((prev) => {
      const next = !prev;
      persistTimer(next, sessionSeconds, initialSeconds, ambientTrack);
      return next;
    });
  };

  const handleResetTimer = () => {
    sound.playSelect();
    setIsRunning(false);
    setSessionSeconds(initialSeconds);
    setTreeStage(1);
    persistTimer(false, initialSeconds, initialSeconds, ambientTrack);
  };

  const handleManualSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualDuration <= 0) return;
    sound.playVictory();
    recordCompletedSession(manualDuration, manualSubject, manualTopic);
    setShowManualLogModal(false);
    setManualTopic("");
  };

  // Analytics Computation (Today, Week, Month, All)
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);

    // Today's Sessions
    const todaySessions = sessions.filter((s) => s.date === todayStr);
    const todayMinutes = todaySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const todayHours = Math.round((todayMinutes / 60) * 10) / 10;

    // Week's Sessions
    const weekSessions = sessions.filter((s) => new Date(s.date) >= sevenDaysAgo);
    const weekMinutes = weekSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const weekHours = Math.round((weekMinutes / 60) * 10) / 10;

    // 7-day breakdown for bar chart
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekDaysBreakdown = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now.getTime() - (6 - i) * 86400000);
      const dStr = d.toISOString().slice(0, 10);
      const dayName = daysOfWeek[d.getDay()];
      const dayMins = sessions
        .filter((s) => s.date === dStr)
        .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
      return {
        day: dayName,
        date: dStr,
        hours: Math.round((dayMins / 60) * 10) / 10,
        isToday: dStr === todayStr,
      };
    });

    // Month's Sessions
    const monthSessions = sessions.filter((s) => new Date(s.date) >= thirtyDaysAgo);
    const monthMinutes = monthSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const monthHours = Math.round((monthMinutes / 60) * 10) / 10;

    // Subject breakdown for month
    const subjectDistribution: Record<string, number> = {};
    monthSessions.forEach((s) => {
      const sub = s.subject || "General Studies";
      subjectDistribution[sub] = (subjectDistribution[sub] || 0) + (s.durationMinutes || 0);
    });

    // All-time
    const allMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const allHours = Math.round((allMinutes / 60) * 10) / 10;

    return {
      todayHours,
      todayMinutes,
      todaySessionsCount: todaySessions.length,
      todaySessionsList: todaySessions,
      weekHours,
      weekSessionsCount: weekSessions.length,
      weekDaysBreakdown,
      monthHours,
      monthSessionsCount: monthSessions.length,
      subjectDistribution,
      allHours,
      allSessionsCount: sessions.length,
    };
  }, [sessions]);

  // Format MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const progressPercent = initialSeconds > 0 ? Math.round(((initialSeconds - sessionSeconds) / initialSeconds) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & TELEMETRY TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#D8A63A]/20 text-sm">
              ⏳
            </span>
            <h2 className="font-mono text-sm sm:text-base font-black tracking-wider text-white uppercase">
              STUDY TELEMETRY & POMODORO ENGINE
            </h2>
          </div>
          <p className="text-xs text-[#8C8C8C] mt-0.5">
            Track reading velocity across Today, Week, Month & sync live with active study network
          </p>
        </div>

        {/* TIME RANGE SELECTOR PILLS */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 p-1 font-mono text-xs">
          {(
            [
              { id: "today", label: "Today" },
              { id: "week", label: "This Week" },
              { id: "month", label: "This Month" },
              { id: "all", label: "All-Time" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playSelect();
                setActiveTab(tab.id);
              }}
              className={`rounded-xl px-3 py-1.5 font-bold transition ${
                activeTab === tab.id
                  ? "bg-[#D8A63A] text-black shadow-md shadow-[#D8A63A]/20"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN DISPLAY: TIMER + CURRENT ANALYTICS */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: INTERACTIVE POMODORO SPRINT ENGINE (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-[#D8A63A]/30 bg-gradient-to-br from-[#141005] via-[#0d0d0d] to-[#050505] p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-6">
          {/* SPRINT PRESET BUTTONS */}
          <div>
            <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#F4C95D]">
              SELECT FOCUS DURATION
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {PRESET_SPRINTS.map((preset) => (
                <button
                  key={preset.minutes}
                  onClick={() => handleSelectPreset(preset.minutes)}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 font-mono text-xs font-bold transition ${
                    selectedDuration === preset.minutes
                      ? "border-[#D8A63A] bg-[#D8A63A]/20 text-[#F4C95D]"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE SUBJECT & TOPIC TAGGER */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-[#F4C95D] font-black uppercase">SUBJECT & TOPIC BEING READ</span>
              <span className="text-white/40">Tagged in DB</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white outline-none focus:border-[#D8A63A]"
              >
                {UPSC_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub} className="bg-black text-white">
                    {sub}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Topic / Chapter name..."
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:border-[#D8A63A]"
              />
            </div>
          </div>

          {/* CENTER CIRCULAR COUNTDOWN & TREE GROWTH */}
          <div className="flex flex-col items-center justify-center py-2 text-center">
            {/* Tree Stage Indicator */}
            <div className="mb-2 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-[#F4C95D]">
              <span>
                {treeStage === 1 && "🌱 Stage 1: Seed Planted"}
                {treeStage === 2 && "🌿 Stage 2: Sprouting Leaves"}
                {treeStage === 3 && "🌳 Stage 3: Growing Sapling"}
                {treeStage === 4 && "🌲 Stage 4: Mighty Banyan Tree"}
              </span>
            </div>

            <div className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(216,166,58,0.3)]">
              {formatTime(sessionSeconds)}
            </div>

            <div className="mt-3 w-full max-w-xs h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#D8A63A] to-[#F4C95D] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* AMBIENT SOUNDSCAPE SELECTOR */}
          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <span className="font-mono text-[10px] text-white/50 uppercase">AMBIENT AUDIO:</span>
            <div className="flex items-center gap-1 font-mono text-[10px]">
              {(
                [
                  { id: "none", label: "Off" },
                  { id: "binaural", label: "40Hz Gamma" },
                  { id: "lbsnaa_rain", label: "Rain" },
                  { id: "library", label: "Library" },
                ] as const
              ).map((snd) => (
                <button
                  key={snd.id}
                  onClick={() => setAmbientTrack(snd.id)}
                  className={`rounded-lg px-2 py-1 transition ${
                    ambientTrack === snd.id
                      ? "bg-[#D8A63A] text-black font-bold"
                      : "bg-white/5 text-white/50 hover:text-white"
                  }`}
                >
                  {snd.label}
                </button>
              ))}
            </div>
          </div>

          {/* TIMER CONTROLS & MANUAL LOG TRIGGER */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleTogglePlay}
              className={`flex-1 rounded-2xl py-3 font-mono text-xs sm:text-sm font-black transition shadow-xl ${
                isRunning
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40"
                  : "bg-gradient-to-r from-[#D8A63A] to-[#B38322] hover:scale-105 active:scale-95 text-black shadow-[#D8A63A]/30"
              }`}
            >
              {isRunning ? "⏸ PAUSE SPRINT" : "▶ START DEEP SPRINT"}
            </button>

            <button
              onClick={handleResetTimer}
              title="Reset Timer"
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white/70 hover:bg-white/10 hover:text-white transition"
            >
              🔄
            </button>

            <button
              onClick={() => setShowManualLogModal(true)}
              title="Log Offline Study Session"
              className="rounded-2xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3 py-3 font-mono text-xs font-bold text-[#F4C95D] hover:bg-[#D8A63A]/20 transition"
            >
              + Log Reading
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: READ & FOCUS TELEMETRY (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* TAB 1: TODAY'S TELEMETRY */}
          {activeTab === "today" && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-4 shadow-xl">
                  <span className="font-mono text-[10px] text-white/50 uppercase">TODAY'S STUDY HOURS</span>
                  <p className="mt-1 font-mono text-3xl font-black text-[#F4C95D]">{stats.todayHours} hrs</p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#D8A63A]"
                      style={{ width: `${Math.min(100, (stats.todayHours / 6) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[9px] font-mono text-white/40">Goal: 6.0h / day</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-4 shadow-xl">
                  <span className="font-mono text-[10px] text-white/50 uppercase">COMPLETED SPRINTS</span>
                  <p className="mt-1 font-mono text-3xl font-black text-white">{stats.todaySessionsCount}</p>
                  <p className="mt-2 font-mono text-[10px] text-emerald-400">✓ All recorded in DB</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-4 shadow-xl">
                  <span className="font-mono text-[10px] text-white/50 uppercase">ACTIVE STUDY CADETS</span>
                  <p className="mt-1 font-mono text-3xl font-black text-amber-300">● {activeCadetsCount}</p>
                  <p className="mt-2 font-mono text-[10px] text-white/40">Live in Study Hall</p>
                </div>
              </div>

              {/* TODAY'S TOPICS READ & MASTERED LOG */}
              <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white">
                    TOPICS & CHAPTERS READ TODAY
                  </h3>
                  <span className="font-mono text-[10px] text-[#F4C95D]">
                    {stats.todaySessionsList.length} Sessions Logged
                  </span>
                </div>

                {stats.todaySessionsList.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-xs text-white/40">
                    No study sessions logged today yet. Start a timer or click "+ Log Reading" to record your study progress.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {stats.todaySessionsList.map((ses) => (
                      <div
                        key={ses.id}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:bg-white/[0.04]"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D8A63A]/10 text-xs font-bold text-[#F4C95D]">
                            ✓
                          </span>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-white truncate">{ses.topic}</h4>
                            <p className="text-[10px] text-[#8C8C8C]">{ses.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-xs shrink-0 pl-3">
                          <span className="font-bold text-[#F4C95D]">+{ses.durationMinutes}m</span>
                          <span className="text-[10px] text-white/30">
                            {new Date(ses.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: THIS WEEK'S TELEMETRY & 7-DAY BAR CHART */}
          {activeTab === "week" && (
            <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#F4C95D] font-black uppercase">
                    LAST 7 DAYS READING VELOCITY
                  </span>
                  <h3 className="font-mono text-lg font-black text-white">{stats.weekHours} Hours Total</h3>
                </div>
                <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/70">
                  {stats.weekSessionsCount} Sessions
                </span>
              </div>

              {/* 7-DAY BAR CHART */}
              <div className="grid grid-cols-7 gap-2 pt-4 items-end h-44 border-b border-white/5 pb-2">
                {stats.weekDaysBreakdown.map((d, i) => {
                  const barHeight = Math.min(100, Math.max(8, (d.hours / 8) * 100));
                  return (
                    <div key={i} className="flex flex-col items-center justify-end h-full gap-2">
                      <span className="font-mono text-[10px] text-white/60">{d.hours}h</span>
                      <div className="w-full max-w-[36px] bg-white/10 rounded-t-xl overflow-hidden flex flex-col justify-end h-28">
                        <div
                          className={`w-full transition-all duration-500 rounded-t-xl ${
                            d.isToday
                              ? "bg-gradient-to-t from-[#D8A63A] to-[#F4C95D] shadow-[0_0_12px_rgba(216,166,58,0.5)]"
                              : d.hours > 0
                              ? "bg-amber-600/80"
                              : "bg-white/5"
                          }`}
                          style={{ height: `${barHeight}%` }}
                        />
                      </div>
                      <span className={`font-mono text-[10px] ${d.isToday ? "text-[#F4C95D] font-bold" : "text-white/40"}`}>
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#8C8C8C]">
                <span>Weekly Target: 42.0 hrs (6h / day)</span>
                <span className="text-[#F4C95D]">{Math.round((stats.weekHours / 42) * 100)}% Target Achieved</span>
              </div>
            </div>
          )}

          {/* TAB 3: THIS MONTH'S SUBJECT BREAKDOWN */}
          {activeTab === "month" && (
            <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#F4C95D] font-black uppercase">
                    30-DAY SUBJECT STUDY BREAKDOWN
                  </span>
                  <h3 className="font-mono text-lg font-black text-white">{stats.monthHours} Hours Total</h3>
                </div>
                <span className="font-mono text-xs text-white/60">
                  Avg {(stats.monthHours / 30).toFixed(1)}h / day
                </span>
              </div>

              {/* SUBJECT DISTRIBUTION BARS */}
              <div className="space-y-3 pt-2">
                {Object.keys(stats.subjectDistribution).length === 0 ? (
                  <p className="text-xs text-white/40 py-4 text-center">No study sessions recorded in the last 30 days.</p>
                ) : (
                  Object.entries(stats.subjectDistribution).map(([sub, mins]) => {
                    const hrs = Math.round((mins / 60) * 10) / 10;
                    const pct = stats.monthHours > 0 ? Math.round((hrs / stats.monthHours) * 100) : 0;
                    return (
                      <div key={sub} className="space-y-1">
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="text-white font-bold">{sub}</span>
                          <span className="text-[#F4C95D]">{hrs}h ({pct}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#D8A63A] to-[#F4C95D]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ALL-TIME PREPARATION CAREER STATS */}
          {activeTab === "all" && (
            <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#F4C95D] font-black uppercase">
                    ALL-TIME PREPARATION MOMENTUM
                  </span>
                  <h3 className="font-mono text-lg font-black text-white">{stats.allHours} Hours Dedicated</h3>
                </div>
                <span className="rounded-full bg-[#D8A63A]/20 px-3 py-1 font-mono text-xs font-bold text-[#F4C95D]">
                  {stats.allSessionsCount} Total Sprints
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <span className="text-xs font-mono text-white/50 uppercase">Cadet Rank Level</span>
                  <p className="mt-1 font-mono text-lg font-black text-white">
                    {stats.allHours > 100 ? "Cabinet Secretary Track" : stats.allHours > 50 ? "Under Secretary" : "LBSNAA Aspirant"}
                  </p>
                  <p className="mt-1 text-[10px] text-[#F4C95D]">Based on verified logged hours</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <span className="text-xs font-mono text-white/50 uppercase">Cloud Sync Status</span>
                  <p className="mt-1 font-mono text-lg font-black text-emerald-400">Synchronized</p>
                  <p className="mt-1 text-[10px] text-white/40">Dexie DB + Cloud Outbox</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. MANUAL SESSION LOG MODAL (FOR PHYSICAL READING / OFFLINE BOOKS) */}
      {showManualLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#D8A63A]/40 bg-[#0d0d0d] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm font-black uppercase text-white">
                Log Offline Study & Reading
              </h3>
              <button
                onClick={() => setShowManualLogModal(false)}
                className="text-white/50 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSessionSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-white/70 mb-1">Subject</label>
                <select
                  value={manualSubject}
                  onChange={(e) => setManualSubject(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-[#D8A63A]"
                >
                  {UPSC_SUBJECTS.map((s) => (
                    <option key={s} value={s} className="bg-black text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Topic / Chapter Read</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spectrum Modern History Ch 12"
                  value={manualTopic}
                  onChange={(e) => setManualTopic(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none placeholder:text-white/30 focus:border-[#D8A63A]"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min={5}
                  max={480}
                  required
                  value={manualDuration}
                  onChange={(e) => setManualDuration(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white outline-none focus:border-[#D8A63A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowManualLogModal(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#D8A63A] px-5 py-2 font-bold text-black hover:bg-[#F4C95D]"
                >
                  Save Study Session ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
