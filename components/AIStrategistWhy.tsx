"use client";

import { useEffect, useState } from "react";
import { sound } from "@/lib/audio/sound-engine";
import { useRouter } from "next/navigation";

interface Mission {
  id: string;
  step: string;
  title: string;
  subject: string;
  route: string;
  xp: number;
  completed: boolean;
}

export default function AIStrategistWhy() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [scanText, setScanText] = useState<string>("CALIBRATING PREPARATION SIGNALS...");
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "m1",
      step: "01",
      title: "REVISE MODERN INDIAN HISTORY // 1757–1857 EXPANSION",
      subject: "History",
      route: "/tests",
      xp: 250,
      completed: false,
    },
    {
      id: "m2",
      step: "02",
      title: "SOLVE 25 POLITY PYQs (FUNDAMENTAL RIGHTS & WRITS)",
      subject: "Polity",
      route: "/pyqs",
      xp: 300,
      completed: false,
    },
    {
      id: "m3",
      step: "03",
      title: "RECONNECT WITH 5 SPATIAL REVISION FLASHCARDS",
      subject: "Revision",
      route: "/revision",
      xp: 150,
      completed: false,
    },
    {
      id: "m4",
      step: "04",
      title: "DRAFT 1 GS-2 MAINS ANSWER (BASIC STRUCTURE & JUDICIAL REVIEW)",
      subject: "Mains",
      route: "/mains-pyqs",
      xp: 400,
      completed: false,
    },
  ]);

  const [aiMessage, setAiMessage] = useState<string>(
    "Aspirant, your consistency score is at 85%. Modern Indian History accuracy needs calibration before your next mock simulation. Every strategy begins with WHY. Execute the 4 tactical missions below."
  );

  useEffect(() => {
    const sequence = [
      { text: "ANALYSING SYLLABUS RETENTION ARCHIVE...", delay: 600 },
      { text: "CALCULATING PREPARATION MOMENTUM...", delay: 1300 },
      { text: "SYNTHESIZING TODAY'S BEST MOVE...", delay: 2000 },
    ];

    sequence.forEach((item) => {
      setTimeout(() => setScanText(item.text), item.delay);
    });

    const finish = setTimeout(() => {
      setIsScanning(false);
      sound.playLock();
    }, 2500);

    return () => clearTimeout(finish);
  }, []);

  const toggleMission = (id: string) => {
    sound.playHover();
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  return (
    <div className="relative flex flex-col rounded-3xl border border-[#D8A63A]/40 bg-[#0d0d0d] p-6 backdrop-blur-xl shadow-2xl font-mono">
      {/* AI ENTITY HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          {/* HOLOGRAPHIC AI ENTITY: WHY */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D8A63A] bg-black shadow-[0_0_25px_rgba(216,166,58,0.4)]">
            <div className="h-4 w-4 rotate-45 border-2 border-[#D8A63A] bg-[#D8A63A]/20 animate-spin" />
            <div className="absolute h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">WHY // AI STRATEGIST</span>
              <span className="rounded-full bg-[#D8A63A]/20 px-2 py-0.5 text-[9px] font-bold text-[#F4C95D]">
                INTERNAL MENTOR
              </span>
            </div>
            <p className="text-[11px] text-[#8C8C8C]">
              Every strategy begins with WHY · Real-time diagnostic guidance
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/assistant")}
          data-cursor="DIALOGUE"
          className="rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-4 py-2 font-mono text-xs font-black text-black hover:opacity-90 transition shadow-[0_0_15px_rgba(216,166,58,0.4)]"
        >
          Open Strategic Dialogue →
        </button>
      </div>

      {/* SCANNING STATE OR AI DIRECTIVE */}
      {isScanning ? (
        <div className="my-8 flex flex-col items-center justify-center py-6 text-center">
          <div className="h-8 w-8 rounded-full border-2 border-[#D8A63A] border-t-transparent animate-spin mb-3 shadow-[0_0_15px_#D8A63A]" />
          <span className="text-xs font-black tracking-widest text-[#F4C95D] animate-pulse">
            WHY ANALYSING YOUR PREPARATION...
          </span>
          <p className="mt-1 text-[11px] text-[#8C8C8C]">{scanText}</p>
        </div>
      ) : (
        <div className="my-6 rounded-2xl border border-[#D8A63A]/30 bg-black/60 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F4C95D]">
            <span>⚡</span>
            <span>TODAY&apos;S BEST MOVE FROM WHY:</span>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-white/90 leading-relaxed font-sans font-medium">
            &quot;{aiMessage}&quot;
          </p>
        </div>
      )}

      {/* TODAY'S MISSIONS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-white">
            TODAY&apos;S MISSION ({missions.filter((m) => m.completed).length} / {missions.length} COMPLETED)
          </h3>
          <span className="text-[10px] text-[#F4C95D]">
            XP: +{missions.reduce((acc, m) => (m.completed ? acc + m.xp : acc), 0)}
          </span>
        </div>

        <div className="space-y-2.5">
          {missions.map((m) => (
            <div
              key={m.id}
              className={`flex items-center justify-between rounded-xl border p-3 transition ${
                m.completed
                  ? "border-emerald-500/40 bg-emerald-950/20 text-white/50"
                  : "border-white/10 bg-black/40 text-white hover:border-[#D8A63A]/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleMission(m.id)}
                  data-cursor="CHECK"
                  className={`flex h-6 w-6 items-center justify-center rounded-lg border font-mono text-xs font-bold transition ${
                    m.completed
                      ? "border-emerald-500 bg-emerald-500 text-black"
                      : "border-white/20 bg-white/5 text-white hover:border-[#D8A63A]"
                  }`}
                >
                  {m.completed ? "✓" : m.step}
                </button>
                <div>
                  <h4 className={`text-xs font-bold ${m.completed ? "line-through text-white/40" : "text-white"}`}>
                    {m.title}
                  </h4>
                  <span className="text-[10px] text-[#8C8C8C]">{m.subject} · +{m.xp} XP</span>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playWarp();
                  router.push(m.route);
                }}
                data-cursor="START"
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-[#F4C95D] hover:bg-[#D8A63A]/20 transition"
              >
                Launch →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
