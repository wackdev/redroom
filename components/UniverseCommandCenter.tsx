"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { sound } from "@/lib/audio/sound-engine";
import { safeArray } from "@/lib/core/utils";

interface SectorNode {
  id: string;
  title: string;
  code: string;
  route: string;
  icon: string;
  description: string;
  color: string;
  angle: number;
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

  const [hoveredSector, setHoveredSector] = useState<SectorNode | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [orbitAngle, setOrbitAngle] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const hoveredSectorRef = useRef<SectorNode | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  hoveredSectorRef.current = hoveredSector;

  // Sector Nodes in the 3D Orbit
  // Sector Nodes in the 3D Orbit
  const sectors: SectorNode[] = [
    {
      id: "pyq",
      title: "PRELIMS QUESTION ARCHIVE",
      code: "SYSTEM-01",
      route: "/pyqs",
      icon: "🎯",
      description: "UPSC has been leaving clues for years · Elimination Radar & Trap Diagnostic",
      color: "#D8A63A",
      angle: (0 * 2 * Math.PI) / 10,
      status: `${stats.pyqSolved} SOLVED`,
    },
    {
      id: "csat",
      title: "CSAT SPEED & LOGIC LAB",
      code: "SYSTEM-02",
      route: "/csat",
      icon: "📐",
      description: "Reading Comprehension · Number Theory · 66.7 Qualifying Threshold Matrix",
      color: "#F4C95D",
      angle: (1 * 2 * Math.PI) / 10,
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
      angle: (2 * 2 * Math.PI) / 10,
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
      angle: (3 * 2 * Math.PI) / 10,
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
      angle: (4 * 2 * Math.PI) / 10,
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
      angle: (5 * 2 * Math.PI) / 10,
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
      angle: (6 * 2 * Math.PI) / 10,
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
      angle: (7 * 2 * Math.PI) / 10,
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
      angle: (8 * 2 * Math.PI) / 10,
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
      angle: (9 * 2 * Math.PI) / 10,
      status: "ONLINE",
    },
  ];

  // Load User Preparation Telemetry
  useEffect(() => {
    try {
      const pyqProg = localStorage.getItem("redroom_pyq_progress");
      const pyqCount = pyqProg ? safeArray(JSON.parse(pyqProg)).length : 0;

      const tests = localStorage.getItem("redroom_test_results");
      const testsCount = tests ? safeArray(JSON.parse(tests)).length : 0;

      const mains = localStorage.getItem("redroom_mains_drafts");
      const mainsCount = mains ? Object.keys(JSON.parse(mains)).length : 0;

      const syll = localStorage.getItem("redroom_syllabus_progress");
      const syllCount = syll ? safeArray(JSON.parse(syll)).length : 0;

      const rev = localStorage.getItem("redroom_revision_items");
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

    setMounted(true);
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  // 3D Canvas Orbital Animation (Possibility Core)
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
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);

    let angleStep = 0;
    let lastAngleUpdate = 0;

    const render = (time: number) => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      angleStep += 0.0025;

      // Throttle React state updates to avoid thrashing re-renders while keeping smooth 60fps canvas
      if (time - lastAngleUpdate > 40) {
        setOrbitAngle(angleStep);
        lastAngleUpdate = time;
      }

      // Grid Lines
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
      const corePulse = Math.sin(angleStep * 5) * 12;
      const coreAura = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        width > 768 ? 320 : 180
      );
      coreAura.addColorStop(0, "rgba(244, 201, 93, 0.25)");
      coreAura.addColorStop(0.4, "rgba(216, 166, 58, 0.08)");
      coreAura.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = coreAura;
      ctx.fillRect(0, 0, width, height);

      // Orbital Concentric Energy Rings
      const ringRadius = width > 768 ? 300 : 160;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(216, 166, 58, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Inner Core Geodesic Rings
      const innerSize = Math.max(10, (width > 768 ? 70 : 45) + corePulse);
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const radX = Math.max(0.1, Math.abs(innerSize * Math.cos(angleStep * 2 + (i * Math.PI) / 4)));
        const radY = Math.max(0.1, innerSize * 1.1);
        ctx.ellipse(
          centerX,
          centerY,
          radX,
          radY,
          (mousePosRef.current.y / height - 0.5) * 0.4,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(244, 201, 93, ${0.35 + i * 0.15})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Glowing Center Energy Sphere
      const sphereGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerSize * 0.7);
      sphereGrad.addColorStop(0, "#FFFFFF");
      sphereGrad.addColorStop(0.35, "#F4C95D");
      sphereGrad.addColorStop(0.8, "#D8A63A");
      sphereGrad.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerSize * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Energy Beams to Sectors
      sectors.forEach((s) => {
        const currentAngle = s.angle + angleStep;
        const targetX = centerX + Math.cos(currentAngle) * ringRadius;
        const targetY = centerY + Math.sin(currentAngle) * (ringRadius * 0.7);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(targetX, targetY);
        ctx.strokeStyle =
          hoveredSectorRef.current?.id === s.id
            ? "rgba(244, 201, 93, 0.7)"
            : "rgba(216, 166, 58, 0.12)";
        ctx.lineWidth = hoveredSectorRef.current?.id === s.id ? 2 : 1;
        ctx.stroke();
      });

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [sectors]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleToggleSound = () => {
    const isMute = sound.toggleMute();
    setIsMuted(isMute);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#050505] text-[#F5F5F5] font-sans select-none"
    >
      {/* 3D CANVAS UNIVERSE */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full pointer-events-none" />

      {/* TOP COMMAND HUD BAR */}
      <header className="relative z-20 flex w-full items-center justify-between border-b border-white/10 bg-[#050505]/80 px-4 py-4 backdrop-blur-xl sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D8A63A]/40 bg-[#D8A63A]/10 font-mono text-xs font-black text-[#F4C95D] shadow-[0_0_12px_rgba(216,166,58,0.4)]">
            ↑
          </div>
          <div>
            <h1 className="font-mono text-xs font-black tracking-[0.25em] text-[#F5F5F5] uppercase">
              WHYNOTUPSC // COMMAND HUB
            </h1>
            <p className="text-[10px] font-mono text-[#8C8C8C]">
              JOURNEY BUILT: <strong className="text-[#F4C95D]">{stats.coreHealth}%</strong> · STREAK:{" "}
              <strong className="text-amber-300">🔥 {stats.streakDays}d</strong>
            </p>
          </div>
        </div>

        {/* QUICK HUD ACTIONS */}
        <div className="flex items-center gap-3">
          {stats.revisionPending > 0 && (
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-mono font-bold text-amber-300 animate-pulse">
              <span>⚠️</span>
              <span>ATTENTION REQUIRED: {stats.revisionPending} TOPICS DUE</span>
            </div>
          )}

          <button
            onClick={handleToggleSound}
            data-cursor="AUDIO"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-[#8C8C8C] hover:border-[#D8A63A]/50 hover:text-white transition"
          >
            <span>{isMuted ? "🔇" : "🔊"}</span>
            <span className="hidden md:inline">{isMuted ? "MUTED" : "SOUND ON"}</span>
          </button>

          <button
            onClick={() => {
              sound.playWarp();
              router.push("/chill-zone");
            }}
            data-cursor="PLAY"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-[#8C8C8C] hover:border-[#D8A63A] hover:text-[#F4C95D] transition"
          >
            <span>🎮</span>
            <span className="hidden sm:inline">CHILL ZONE</span>
          </button>

          <button
            onClick={() => {
              sound.playLock();
              window.dispatchEvent(new CustomEvent("redroom_open_command_palette"));
            }}
            data-cursor="SEARCH"
            className="flex items-center gap-2 rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3.5 py-1.5 font-mono text-xs font-bold text-[#F4C95D] shadow-[0_0_15px_rgba(216,166,58,0.25)] hover:bg-[#D8A63A]/20 transition"
          >
            <span>⚡</span>
            <span>COMMAND [Ctrl+K]</span>
          </button>
        </div>
      </header>

      {/* 3D SECTORS UNIVERSE CANVAS & ORBITAL NODES */}
      <div className="relative z-10 flex flex-1 items-center justify-center p-4">
        {/* CENTER LIVING POSSIBILITY CORE TELEMETRY BADGE */}
        <div className="pointer-events-none absolute z-10 flex flex-col items-center justify-center text-center">
          <div className="rounded-full border border-[#D8A63A]/50 bg-[#050505]/90 px-4 py-2 backdrop-blur-md shadow-[0_0_25px_rgba(216,166,58,0.4)]">
            <span className="font-mono text-[10px] font-black tracking-widest text-[#F4C95D] uppercase">
              THE POSSIBILITY CORE
            </span>
            <p className="mt-0.5 font-mono text-xs font-bold text-white">
              {stats.coreHealth >= 80 ? "PEAK MOMENTUM" : "THE SYSTEM IS READY WHEN YOU ARE"}
            </p>
          </div>
        </div>

        {/* ORBITAL FLOATING SECTOR NODES */}
        <div className="relative h-[480px] w-full max-w-[900px] md:h-[620px]" suppressHydrationWarning>
          {sectors.map((sec) => {
            const currentAngle = sec.angle + (mounted ? orbitAngle : 0);
            const radiusX = isMobile ? 140 : 280;
            const radiusY = isMobile ? 120 : 210;

            const x = (Math.cos(currentAngle) * radiusX).toFixed(2);
            const y = (Math.sin(currentAngle) * radiusY).toFixed(2);
            const isHovered = hoveredSector?.id === sec.id;

            return (
              <div
                key={sec.id}
                suppressHydrationWarning
                onMouseEnter={() => {
                  setHoveredSector(sec);
                  sound.playHover();
                }}
                onMouseLeave={() => setHoveredSector(null)}
                onClick={() => {
                  sound.playWarp();
                  router.push(sec.route);
                }}
                data-cursor="ENTER"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${isHovered ? 1.08 : 1})`,
                }}
                className={`absolute left-1/2 top-1/2 cursor-pointer transition-transform duration-200 ease-out`}
              >
                <div
                  className={`group relative flex w-[160px] sm:w-[190px] flex-col rounded-2xl border p-3.5 backdrop-blur-xl transition-all ${
                    isHovered
                      ? "border-[#D8A63A] bg-[#0d0d0d]/95 shadow-[0_0_35px_rgba(216,166,58,0.4)] scale-105 z-30"
                      : "border-white/10 bg-[#0d0d0d]/80 shadow-[0_8px_20px_rgba(0,0,0,0.8)] z-10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{sec.icon}</span>
                    <span className="font-mono text-[9px] font-black uppercase text-[#F4C95D]">
                      {sec.code}
                    </span>
                  </div>

                  <h3 className="mt-2 font-mono text-xs font-black text-white group-hover:text-[#F4C95D] transition">
                    {sec.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-[10px] text-[#8C8C8C] leading-snug">
                    {sec.description}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2 text-[9px] font-mono">
                    <span className="text-white/40">STATUS</span>
                    <span className="font-bold text-[#F4C95D]">{sec.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM TELEMETRY BAR */}
      <footer className="relative z-20 flex w-full flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#050505]/90 px-4 py-3 sm:px-8 text-xs font-mono text-[#8C8C8C]">
        <div className="flex items-center gap-6">
          <span>WHYNOTUPSC PREPARATION OPERATING SYSTEM</span>
          <span className="hidden sm:inline">CONFUSION → CLARITY → CONSISTENCY → MASTERY</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/pyqs")}
            className="text-xs text-[#F4C95D] hover:underline"
          >
            Launch Question Archive →
          </button>
        </div>
      </footer>
    </div>
  );
}
