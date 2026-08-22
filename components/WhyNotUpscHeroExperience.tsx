"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sound } from "@/lib/audio/sound-engine";
import { UserSessionManager, CadetProfile } from "@/lib/core/user-context";

interface Particle3D {
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  speed: number;
  angle: number;
  radius: number;
  color: string;
}

export default function WhyNotUpscHeroExperience() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // States
  const [activeUser, setActiveUser] = useState<CadetProfile | null>(null);
  const [phase, setPhase] = useState<"blackout" | "point" | "forming" | "active" | "warping">("blackout");
  const [warpProgress, setWarpProgress] = useState<number>(0);

  // Initial Sequence & User Check
  useEffect(() => {
    setActiveUser(UserSessionManager.getActiveUser());

    const handleUserChange = (e: CustomEvent<CadetProfile | null>) => {
      setActiveUser(e.detail);
    };
    window.addEventListener("whynotupsc_user_changed", handleUserChange as EventListener);

    sound.startDrone();

    const t1 = setTimeout(() => setPhase("point"), 300);
    const t2 = setTimeout(() => setPhase("forming"), 900);
    const t3 = setTimeout(() => setPhase("active"), 1600);

    return () => {
      window.removeEventListener("whynotupsc_user_changed", handleUserChange as EventListener);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // 3D Canvas Particle Simulation
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
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Initialize 3D Orbital Gold/White Particle Cloud
    const particleCount = 180;
    const particles: Particle3D[] = [];
    const colors = ["#FFFFFF", "#D8A63A", "#F4C95D", "#FFE599"];

    for (let i = 0; i < particleCount; i++) {
      const radius = 80 + Math.random() * 240;
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI;

      particles.push({
        baseX: radius * Math.cos(angle) * Math.cos(elevation),
        baseY: radius * Math.sin(elevation),
        baseZ: radius * Math.sin(angle) * Math.cos(elevation),
        size: 1 + Math.random() * 2,
        speed: 0.003 + Math.random() * 0.006,
        angle: Math.random() * Math.PI * 2,
        radius,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let coreRotationY = 0;
    let coreRotationX = 0;
    let pulseTime = 0;

    const render = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Mouse Parallax
      const mouseOffset = mousePosRef.current;
      const targetRotY = (mouseOffset.x - centerX) * 0.0003;
      const targetRotX = (mouseOffset.y - centerY) * 0.0003;

      coreRotationY += (targetRotY - coreRotationY) * 0.05 + 0.003;
      coreRotationX += (targetRotX - coreRotationX) * 0.05;
      pulseTime += 0.02;

      // Background Subtle Gold Coordinate Grid
      ctx.strokeStyle = "rgba(216, 166, 58, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 70;
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

      // Draw Volumetric Possibility Core (Central Singularity)
      const aura = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, width > 768 ? 260 : 140);
      aura.addColorStop(0, "rgba(244, 201, 93, 0.25)");
      aura.addColorStop(0.5, "rgba(216, 166, 58, 0.08)");
      aura.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      // Render 3D Gold Orbiting Particles
      const fov = 400;
      particles.forEach((p) => {
        p.angle += p.speed;

        // 3D rotation math
        const x1 = p.radius * Math.cos(p.angle);
        const z1 = p.radius * Math.sin(p.angle);
        const y1 = p.baseY;

        // Apply Core Y rotation
        const x2 = x1 * Math.cos(coreRotationY) + z1 * Math.sin(coreRotationY);
        const z2 = -x1 * Math.sin(coreRotationY) + z1 * Math.cos(coreRotationY);

        // Apply Core X rotation
        const y3 = y1 * Math.cos(coreRotationX) - z2 * Math.sin(coreRotationX);
        const z3 = y1 * Math.sin(coreRotationX) + z2 * Math.cos(coreRotationX) + 500;

        if (z3 > 10) {
          const scale = fov / z3;
          const projX = centerX + x2 * scale;
          const projY = centerY + y3 * scale;
          const projSize = Math.max(0.5, p.size * scale);
          const alpha = Math.min(1, Math.max(0.1, (scale - 0.3) * 1.5));

          ctx.beginPath();
          ctx.arc(projX, projY, projSize, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.shadowColor = "#F4C95D";
          ctx.shadowBlur = projSize > 2 ? 8 : 0;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;
        }
      });

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleBeginJourney = (destination: string = "/dashboard") => {
    const user = UserSessionManager.getActiveUser();
    if (!user) {
      sound.playLock();
      router.push(`/login?redirect=${encodeURIComponent(destination)}`);
      return;
    }

    sound.playWarp();
    setPhase("warping");

    let step = 0;
    const interval = setInterval(() => {
      step += 0.05;
      setWarpProgress(step);
      if (step >= 1) {
        clearInterval(interval);
        router.push(destination);
      }
    }, 30);
  };

  const handleLogout = () => {
    UserSessionManager.logout();
    setActiveUser(null);
    sound.playClick();
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A]/30"
    >
      {/* 3D CANVAS BACKGROUND */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 h-full w-full pointer-events-none" />

      {/* TOP STATUS BAR */}
      <header className="relative z-20 flex w-full items-center justify-between px-6 py-4 sm:px-12 border-b border-white/10 bg-[#050505]/85 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 font-mono text-sm font-black text-[#D8A63A] shadow-[0_0_15px_rgba(216,166,58,0.35)]">
            ↑
          </div>
          <span className="font-mono text-xs sm:text-sm font-black tracking-[0.25em] text-[#F5F5F5] uppercase">
            WHYNOTUPSC
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          {activeUser ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[#8C8C8C]">
                CADET: <strong className="text-white">{activeUser.fullName}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-[#8C8C8C] hover:border-red-500 hover:text-red-400 transition"
              >
                Sign Out
              </button>
              <button
                onClick={() => handleBeginJourney("/dashboard")}
                className="rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-4 py-1.5 font-bold text-black hover:bg-[#F4C95D] transition shadow-[0_0_15px_rgba(216,166,58,0.3)]"
              >
                COMMAND HUB →
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white hover:border-[#D8A63A] hover:text-[#F4C95D] transition"
              >
                CADET SIGN IN →
              </Link>
              <button
                onClick={() => handleBeginJourney("/dashboard")}
                className="rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-4 py-2 font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_20px_rgba(216,166,58,0.3)]"
              >
                ENTER PORTAL
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CENTER CINEMATIC HERO */}
      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-16 text-center my-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-4 py-1.5 font-mono text-xs font-black tracking-widest text-[#F4C95D] uppercase shadow-[0_0_20px_rgba(216,166,58,0.2)]">
            <span>⚡</span> CIVIL SERVICES OPERATING SYSTEM
          </div>

          <h1 className="font-mono text-4xl sm:text-7xl font-black tracking-tighter text-white uppercase drop-shadow-[0_0_45px_rgba(255,255,255,0.25)]">
            WHY NOT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D8A63A] via-[#F4C95D] to-[#FFE599]">YOU?</span>
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-[#8C8C8C] leading-relaxed">
            Every aspirant can dream of the Civil Services. The true question is: <strong className="text-white">Why Not You?</strong> An autonomous, multi-user ecosystem powering your syllabus mastery, elimination radar, mock simulations, and spaced revision.
          </p>

          {/* Core Action Trigger */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleBeginJourney("/dashboard")}
              className="flex items-center gap-3 rounded-2xl border border-[#D8A63A] bg-gradient-to-r from-[#D8A63A] via-[#F4C95D] to-[#D8A63A] px-8 py-4 font-mono text-sm font-black text-black shadow-[0_0_35px_rgba(216,166,58,0.5)] hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <span>🚀 INITIALIZE PREPARATION ENGINE</span>
              <span>→</span>
            </button>
            <button
              onClick={() => handleBeginJourney("/chill-zone")}
              className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-mono text-sm font-bold text-white hover:border-[#D8A63A] hover:bg-[#D8A63A]/10 transition cursor-pointer"
            >
              <span>🎮</span> CHILL ZONE LOUNGE
            </button>
          </div>
        </div>

        {/* 10 Core Systems Overview Grid */}
        <div className="mt-16 grid w-full grid-cols-2 gap-3 sm:grid-cols-5 text-left font-mono text-xs">
          {[
            { title: "SYLLABUS RADAR", icon: "🗺️", link: "/syllabus" },
            { title: "PRELIMS PYQS", icon: "📝", link: "/pyqs" },
            { title: "MOCK SIMULATIONS", icon: "🏛️", link: "/tests" },
            { title: "MAINS LAB", icon: "✍️", link: "/mains-pyqs" },
            { title: "CSAT MATRIX", icon: "📐", link: "/csat" },
            { title: "PERSONALITY VIVA", icon: "🎙️", link: "/interview" },
            { title: "DAILY CURRENT AFFAIRS", icon: "📰", link: "/current-affairs" },
            { title: "SPACED REVISION", icon: "🔄", link: "/revision" },
            { title: "ARCADE CHILL ZONE", icon: "🎮", link: "/chill-zone" },
            { title: "ADMIN COMMAND", icon: "👑", link: "/admin" },
          ].map((sys) => (
            <button
              key={sys.title}
              onClick={() => handleBeginJourney(sys.link)}
              className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 hover:border-[#D8A63A] hover:bg-[#D8A63A]/10 transition text-left cursor-pointer"
            >
              <span className="text-base">{sys.icon}</span>
              <span className="font-bold text-white text-[11px] uppercase truncate">{sys.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-20 flex flex-col items-center justify-between gap-4 border-t border-white/10 bg-[#050505]/90 px-6 py-6 font-mono text-xs text-[#8C8C8C] sm:flex-row sm:px-12 backdrop-blur-xl">
        <div>
          <span>WHYNOTUPSC © 2026 // FREE & ACCESSIBLE CIVIL SERVICES PREPARATION</span>
        </div>
        <div className="flex gap-6">
          <button onClick={() => handleBeginJourney("/dashboard")} className="hover:text-[#F4C95D]">Command Centre</button>
          <button onClick={() => handleBeginJourney("/tests")} className="hover:text-[#F4C95D]">Mock Tests</button>
          <button onClick={() => handleBeginJourney("/chill-zone")} className="hover:text-[#F4C95D]">Chill Zone</button>
          <button onClick={() => handleBeginJourney("/admin")} className="hover:text-[#F4C95D]">Admin Portal</button>
        </div>
      </footer>
    </div>
  );
}
