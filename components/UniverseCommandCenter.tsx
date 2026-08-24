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
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

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
      description: "GS 1-4 Complete Micro-Topic Breakdown · Yield Weightings",
      color: "#D8A63A",
      status: `${stats.syllabusDone} TOPICS`,
    },
    {
      id: "revision",
      title: "SPACED ACTIVE RECALL",
      code: "SYSTEM-07",
      route: "/revision",
      icon: "🔄",
      description: "SM-2 Leitner Memory Vault · Forgetting Curve Diagnostics",
      color: "#F4C95D",
      status: stats.revisionPending > 0 ? `${stats.revisionPending} DUE` : "OPTIMAL",
    },
    {
      id: "tests",
      title: "MOCK TEST ARENA",
      code: "SYSTEM-08",
      route: "/tests",
      icon: "🏛️",
      description: "Sectional & Full-Length UPSC Simulations · 2-Hour Timed Radar",
      color: "#D8A63A",
      status: `${stats.testsTaken} ATTEMPTS`,
    },
    {
      id: "study_plan",
      title: "FOCUS SANCTUARY",
      code: "SYSTEM-09",
      route: "/study-plan",
      icon: "🧘",
      description: "Pomodoro Sprints · Binaural Soundscapes · Daily Velocity Tracker",
      color: "#E5B94E",
      status: "ACTIVE RADAR",
    },
    {
      id: "chill_zone",
      title: "COGNITIVE ARCADE",
      code: "SYSTEM-10",
      route: "/chill-zone",
      icon: "🎮",
      description: "6 Fast Reaction & Spatial Games · Memory Reload · Leaderboard",
      color: "#D8A63A",
      status: "UNLOCKED",
    },
  ], [stats]);

  // Read Local Preparation Data
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);

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
    } catch {}
  }, []);

  // 3D Kinetic Possibility Core Orbital Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 650;
    };
    window.addEventListener("resize", handleResize);

    interface Particle3D {
      x: number;
      y: number;
      z: number;
      baseRadius: number;
      speed: number;
      angle: number;
      elevation: number;
      size: number;
      color: string;
    }

    const particleCount = 120;
    const particles: Particle3D[] = [];
    const colorPalette = ["#FFFFFF", "#D8A63A", "#F4C95D", "#FFE599"];

    for (let i = 0; i < particleCount; i++) {
      const baseRadius = 60 + Math.random() * 220;
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI * 0.7;

      particles.push({
        x: 0,
        y: 0,
        z: 0,
        baseRadius,
        speed: 0.004 + Math.random() * 0.007,
        angle,
        elevation,
        size: 1 + Math.random() * 2.2,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      });
    }

    let coreRotationY = 0;
    let angleStep = 0;

    const render = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      coreRotationY += 0.006;
      angleStep += 0.02;

      // Coordinate Grid Lines
      ctx.strokeStyle = "rgba(216, 166, 58, 0.04)";
      ctx.lineWidth = 1;
      const step = 60;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Orbital Aura Gradient
      const coreAura = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        width > 768 ? 260 : 150
      );
      coreAura.addColorStop(0, "rgba(244, 201, 93, 0.22)");
      coreAura.addColorStop(0.4, "rgba(216, 166, 58, 0.07)");
      coreAura.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = coreAura;
      ctx.fillRect(0, 0, width, height);

      // Render 3D Rotating Particles
      const fov = 380;
      particles.forEach((p) => {
        p.angle += p.speed;

        const x1 = p.baseRadius * Math.cos(p.angle) * Math.cos(p.elevation);
        const z1 = p.baseRadius * Math.sin(p.angle) * Math.cos(p.elevation);
        const y1 = p.baseRadius * Math.sin(p.elevation);

        const x2 = x1 * Math.cos(coreRotationY) + z1 * Math.sin(coreRotationY);
        const z2 = -x1 * Math.sin(coreRotationY) + z1 * Math.cos(coreRotationY);

        const zFinal = z2 + 400;
        if (zFinal > 10) {
          const scale = fov / zFinal;
          const projX = centerX + x2 * scale;
          const projY = centerY + y1 * scale;
          const projSize = Math.max(0.6, p.size * scale);
          const alpha = Math.max(0.15, Math.min(0.9, (z2 + 200) / 400));

          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(projX, projY, projSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0;

      // Inner Core Geodesic Rings
      const innerSize = width > 768 ? 50 : 32;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const radX = Math.max(0.1, Math.abs(innerSize * Math.cos(angleStep * 1.5 + (i * Math.PI) / 3)));
        const radY = Math.max(0.1, innerSize * 1.1);
        ctx.ellipse(centerX, centerY, radX, radY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(244, 201, 93, ${0.3 + i * 0.2})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Glowing Center Singularity
      const sphereGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerSize * 0.7);
      sphereGrad.addColorStop(0, "#FFFFFF");
      sphereGrad.addColorStop(0.4, "#F4C95D");
      sphereGrad.addColorStop(0.8, "#D8A63A");
      sphereGrad.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerSize * 0.7, 0, Math.PI * 2);
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

  const handleNavigate = (route: string) => {
    sound.playWarp();
    router.push(route);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-[#D8A63A]/40 bg-[#050505] p-6 sm:p-8 text-[#F5F5F5] font-sans shadow-[0_0_40px_rgba(216,166,58,0.15)]"
    >
      {/* 3D CANVAS BACKGROUND */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none opacity-60" />

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 space-y-6">
        {/* HEADER BADGE */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D8A63A] font-mono font-black text-black shadow-[0_0_20px_rgba(216,166,58,0.4)] text-lg">
              🌌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#D8A63A] px-2 py-0.5 font-mono text-[9px] font-black uppercase text-black">
                  LIVING 3D KINETIC SYSTEM
                </span>
                <span className="font-mono text-xs text-[#8C8C8C]">10 Interconnected Systems</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">The Possibility Core</h2>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="rounded-2xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-4 py-2 text-center">
              <span className="block text-[9px] text-[#8C8C8C] uppercase font-bold">Aspirant Health</span>
              <strong className="text-sm text-[#F4C95D] font-black">{stats.coreHealth}% Momentum</strong>
            </div>
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-center">
              <span className="block text-[9px] text-[#8C8C8C] uppercase font-bold">Active Streak</span>
              <strong className="text-sm text-amber-300 font-black">🔥 {stats.streakDays} Days</strong>
            </div>
          </div>
        </div>

        {/* 10 SYSTEM NODES GRID */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
                className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-4 backdrop-blur-xl transition-all duration-200 active:scale-[0.98] ${
                  isHovered
                    ? "border-[#D8A63A] bg-[#0d0d0d]/95 shadow-[0_0_25px_rgba(216,166,58,0.35)] scale-[1.02] z-20"
                    : "border-white/10 bg-[#0d0d0d]/80 hover:border-white/25 hover:bg-[#121212]/90"
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
      </div>
    </div>
  );
}
