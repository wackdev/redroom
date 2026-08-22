"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { sound } from "@/lib/audio/sound-engine";
import { safeArray } from "@/lib/core/utils";
import { UserSessionManager } from "@/lib/core/user-context";

interface SectorNode {
  id: string;
  title: string;
  code: string;
  route: string;
  icon: string;
  description: string;
  color: string;
  status: string;
}

export default function UniverseCommandCenter() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Prep Statistics State
  const [stats, setStats] = useState({
    pyqSolved: 0,
    testsTaken: 0,
    mainsDrafted: 0,
    syllabusDone: 0,
    revisionPending: 0,
    streakDays: 1,
    coreHealth: 85, // 0 - 100
  });

  const [hoveredSectorId, setHoveredSectorId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  const hoveredSectorRef = useRef<string | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  hoveredSectorRef.current = hoveredSectorId;

  // Sector Nodes definition
  const sectors: SectorNode[] = useMemo(() => [
    {
      id: "pyq",
      title: "PRELIMS QUESTION ARCHIVE",
      code: "SYSTEM-01",
      route: "/pyqs",
      icon: "🎯",
      description: "UPSC Clues & Trends · Elimination Radar & Trap Diagnostic",
      color: "#D8A63A",
      status: `${stats.pyqSolved} SOLVED`,
    },
    {
      id: "csat",
      title: "CSAT SPEED & LOGIC LAB",
      code: "SYSTEM-02",
      route: "/csat",
      icon: "📐",
      description: "Reading Comprehension · Number Theory · 66.7 Threshold Matrix",
      color: "#F4C95D",
      status: "ACTIVE LAB",
    },
    {
      id: "mains",
      title: "MAINS ANSWER LAB",
      code: "SYSTEM-03",
      route: "/mains-pyqs",
      icon: "✍️",
      description: "Handwritten Scanner · PESTLE Stencil Studio · AI Rubric Evaluation",
      color: "#D8A63A",
      status: `${stats.mainsDrafted} DRAFTS`,
    },
    {
      id: "interview",
      title: "DAF VIVA BOARD ROOM",
      code: "SYSTEM-04",
      route: "/interview",
      icon: "🎙️",
      description: "Voice Personality Test · Dholpur House Panel Simulation · 275 Marks",
      color: "#F4C95D",
      status: "LIVE BOARD",
    },
    {
      id: "intelligence",
      title: "DAILY BRIEF & PODCAST",
      code: "SYSTEM-05",
      route: "/current-affairs",
      icon: "📡",
      description: "7-Min Morning Spoken Digest · Editorial Synthesis · Static-to-Current",
      color: "#E5B94E",
      status: "LIVE FEED",
    },
    {
      id: "syllabus",
      title: "KNOWLEDGE MAP",
      code: "SYSTEM-06",
      route: "/syllabus",
      icon: "🗺️",
      description: "From Confusion to Clarity · High-Yield Heatmap & Yield Radar",
      color: "#F4C95D",
      status: `${stats.syllabusDone} TOPICS`,
    },
    {
      id: "revision",
      title: "SPACED RECALL",
      code: "SYSTEM-07",
      route: "/revision",
      icon: "⚡",
      description: "Active Recall Intervals · SM-2 Memory Health · Reconnect Radar",
      color: stats.revisionPending > 5 ? "#F97316" : "#D8A63A",
      status: stats.revisionPending > 0 ? `⚠️ ${stats.revisionPending} DUE` : "OPTIMAL",
    },
    {
      id: "mocks",
      title: "MOCK SIMULATION",
      code: "SYSTEM-08",
      route: "/tests",
      icon: "🏛️",
      description: "Subject-Wise Modules · Multi-Statement Matrix · Timer Arena",
      color: "#D8A63A",
      status: `${stats.testsTaken} TAKEN`,
    },
    {
      id: "analytics",
      title: "PROGRESS TELEMETRY",
      code: "SYSTEM-09",
      route: "/performance",
      icon: "📊",
      description: "Consistency Matrix · Gap Diagnostics · Preparation Trajectory",
      color: "#E5B94E",
      status: "TELEMETRY",
    },
    {
      id: "ai",
      title: "STRATEGY ENGINE (WHY)",
      code: "SYSTEM-10",
      route: "/assistant",
      icon: "🤖",
      description: "Internal Strategist · Tactical Missions · Personalized Battle Plan",
      color: "#D8A63A",
      status: "ONLINE",
    },
  ], [stats]);

  // Load User Preparation Telemetry
  useEffect(() => {
    try {
      const activeUser = UserSessionManager.getActiveUser();
      const userPrefix = activeUser?.id ? `_${activeUser.id}` : "";

      const pyqProg = localStorage.getItem(`redroom_pyq_progress${userPrefix}`) || localStorage.getItem("redroom_pyq_progress");
      const pyqCount = pyqProg ? safeArray(JSON.parse(pyqProg)).length : 0;

      const tests = localStorage.getItem(`redroom_test_results${userPrefix}`) || localStorage.getItem("redroom_test_results");
      const testsCount = tests ? safeArray(JSON.parse(tests)).length : 0;

      const mains = localStorage.getItem(`redroom_mains_drafts${userPrefix}`) || localStorage.getItem("redroom_mains_drafts");
      const mainsCount = mains ? Object.keys(JSON.parse(mains)).length : 0;

      const syll = localStorage.getItem(`redroom_syllabus_progress${userPrefix}`) || localStorage.getItem("redroom_syllabus_progress");
      const syllCount = syll ? safeArray(JSON.parse(syll)).length : 0;

      const rev = localStorage.getItem(`redroom_revision_items${userPrefix}`) || localStorage.getItem("redroom_revision_items");
      const revItems = rev ? safeArray(JSON.parse(rev)) : [];
      const pendingRev = revItems.filter((i: any) => new Date(i.nextReviewDate || 0) <= new Date()).length;

      const totalActivities = pyqCount + testsCount * 5 + mainsCount * 8 + syllCount;
      const calculatedHealth = Math.min(100, Math.max(30, 60 + totalActivities * 2 - pendingRev * 3));

      setStats({
        pyqSolved: pyqCount,
        testsTaken: testsCount,
        mainsDrafted: mainsCount,
        syllabusDone: syllCount,
        revisionPending: pendingRev,
        streakDays: Math.max(1, Math.min(30, Math.floor(totalActivities / 4) + 1)),
        coreHealth: calculatedHealth,
      });

      setIsMuted(sound.getMuted());
    } catch {}

    if (typeof window !== "undefined") {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  // 3D Canvas Orbital Animation (Possibility Core) - Stable 60fps with Zero React State Thrashing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    let angleStep = 0;

    const render = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      angleStep += 0.003;

      // Subtle Background Grid Lines
      ctx.strokeStyle = "rgba(216, 166, 58, 0.035)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Volumetric Core Aura (Gold & Amber)
      const coreAura = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        width > 768 ? 320 : 180
      );
      coreAura.addColorStop(0, "rgba(244, 201, 93, 0.22)");
      coreAura.addColorStop(0.4, "rgba(216, 166, 58, 0.07)");
      coreAura.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = coreAura;
      ctx.fillRect(0, 0, width, height);

      // Orbital Concentric Energy Rings
      const ringRadius = width > 768 ? 290 : 150;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(216, 166, 58, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Inner Core Geodesic Rings
      const innerSize = width > 768 ? 60 : 38;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const radX = Math.max(0.1, Math.abs(innerSize * Math.cos(angleStep * 1.8 + (i * Math.PI) / 4)));
        const radY = Math.max(0.1, innerSize * 1.1);
        ctx.ellipse(
          centerX,
          centerY,
          radX,
          radY,
          (mousePosRef.current.y / Math.max(1, height) - 0.5) * 0.3,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(244, 201, 93, ${0.3 + i * 0.15})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Glowing Center Energy Sphere
      const sphereGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerSize * 0.75);
      sphereGrad.addColorStop(0, "#FFFFFF");
      sphereGrad.addColorStop(0.35, "#F4C95D");
      sphereGrad.addColorStop(0.8, "#D8A63A");
      sphereGrad.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerSize * 0.75, 0, Math.PI * 2);
      ctx.fill();

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleToggleSound = () => {
    const isMute = sound.toggleMute();
    setIsMuted(isMute);
  };

  const handleNavigate = (route: string) => {
    sound.playWarp();
    router.push(route);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#050505] text-[#F5F5F5] font-sans select-none"
    >
      {/* 3D CANVAS UNIVERSE */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 h-full w-full pointer-events-none" />

      {/* TOP COMMAND HUD BAR */}
      <header className="relative z-20 flex w-full items-center justify-between border-b border-white/10 bg-[#050505]/85 px-4 py-3.5 backdrop-blur-xl sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 font-mono text-xs font-black text-[#F4C95D] shadow-[0_0_12px_rgba(216,166,58,0.4)]">
            ↑
          </div>
          <div>
            <h1 className="font-mono text-xs font-black tracking-[0.25em] text-[#F5F5F5] uppercase">
              WHYNOTUPSC // COMMAND HUB
            </h1>
            <p className="text-[10px] font-mono text-[#8C8C8C]">
              JOURNEY MOMENTUM: <strong className="text-[#F4C95D]">{stats.coreHealth}%</strong> · STREAK:{" "}
              <strong className="text-amber-300">🔥 {stats.streakDays}d</strong>
            </p>
          </div>
        </div>

        {/* QUICK HUD ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {stats.revisionPending > 0 && (
            <div className="hidden md:flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-mono font-bold text-amber-300 animate-pulse">
              <span>⚠️</span>
              <span>{stats.revisionPending} DUE</span>
            </div>
          )}

          <button
            onClick={handleToggleSound}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-[#8C8C8C] hover:border-[#D8A63A]/50 hover:text-white transition touch-manipulation"
          >
            <span>{isMuted ? "🔇" : "🔊"}</span>
            <span className="hidden sm:inline">{isMuted ? "MUTED" : "SOUND ON"}</span>
          </button>

          <button
            onClick={() => handleNavigate("/chill-zone")}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-[#8C8C8C] hover:border-[#D8A63A] hover:text-[#F4C95D] transition touch-manipulation"
          >
            <span>🎮</span>
            <span className="hidden sm:inline">CHILL ZONE</span>
          </button>

          <button
            onClick={() => {
              sound.playLock();
              window.dispatchEvent(new CustomEvent("redroom_open_command_palette"));
            }}
            className="flex items-center gap-2 rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3.5 py-1.5 font-mono text-xs font-bold text-[#F4C95D] shadow-[0_0_15px_rgba(216,166,58,0.25)] hover:bg-[#D8A63A]/20 transition touch-manipulation"
          >
            <span>⚡</span>
            <span>COMMAND [Ctrl+K]</span>
          </button>
        </div>
      </header>

      {/* CENTER STABLE COMMAND CENTER WORKSPACE */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-8 sm:px-8">
        {/* CENTER LIVING POSSIBILITY CORE TELEMETRY BADGE */}
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <div className="rounded-full border border-[#D8A63A]/50 bg-[#050505]/90 px-5 py-2 backdrop-blur-md shadow-[0_0_30px_rgba(216,166,58,0.35)]">
            <span className="font-mono text-[10px] font-black tracking-widest text-[#F4C95D] uppercase">
              THE POSSIBILITY CORE
            </span>
            <p className="mt-0.5 font-mono text-xs font-bold text-white">
              {stats.coreHealth >= 80 ? "PEAK MOMENTUM ACTIVE" : "THE SYSTEM IS READY WHEN YOU ARE"}
            </p>
          </div>
        </div>

        {/* 10 ROCK-SOLID RESPONSIVE SYSTEM NODES GRID */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {sectors.map((sec) => {
            const isHovered = hoveredSectorId === sec.id;

            return (
              <div
                key={sec.id}
                onPointerEnter={() => {
                  if (!isTouchDevice) {
                    setHoveredSectorId(sec.id);
                    sound.playHover();
                  }
                }}
                onPointerLeave={() => {
                  if (!isTouchDevice) setHoveredSectorId(null);
                }}
                onClick={() => handleNavigate(sec.route)}
                className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-4 backdrop-blur-xl transition-all duration-200 touch-manipulation active:scale-[0.98] ${
                  isHovered
                    ? "border-[#D8A63A] bg-[#0d0d0d]/95 shadow-[0_0_30px_rgba(216,166,58,0.35)] scale-[1.03] z-20"
                    : "border-white/10 bg-[#0d0d0d]/80 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:border-white/25 hover:bg-[#121212]/90"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                      {sec.icon}
                    </span>
                    <span className="font-mono text-[9px] font-black uppercase text-[#F4C95D]">
                      {sec.code}
                    </span>
                  </div>

                  <h3 className="mt-2.5 font-mono text-xs font-black text-white group-hover:text-[#F4C95D] transition-colors duration-200">
                    {sec.title}
                  </h3>

                  <p className="mt-1.5 text-[10px] text-[#8C8C8C] leading-snug line-clamp-2">
                    {sec.description}
                  </p>
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-white/5 pt-2 text-[9px] font-mono">
                  <span className="text-white/40">STATUS</span>
                  <span className="font-bold text-[#F4C95D]">{sec.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* BOTTOM TELEMETRY BAR */}
      <footer className="relative z-20 flex w-full flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#050505]/90 px-4 py-3 sm:px-8 text-xs font-mono text-[#8C8C8C]">
        <div className="flex items-center gap-4">
          <span>WHYNOTUPSC CIVIL SERVICES OS</span>
          <span className="hidden sm:inline">CONFUSION → CLARITY → CONSISTENCY → MASTERY</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavigate("/pyqs")}
            className="text-xs text-[#F4C95D] hover:underline touch-manipulation"
          >
            Launch Question Archive →
          </button>
        </div>
      </footer>
    </div>
  );
}

