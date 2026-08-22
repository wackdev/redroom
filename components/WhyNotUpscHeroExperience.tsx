"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sound } from "@/lib/audio/sound-engine";

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
  const [phase, setPhase] = useState<"blackout" | "point" | "forming" | "active" | "warping">("blackout");
  const [warpProgress, setWarpProgress] = useState<number>(0);

  // Initial Sequence
  useEffect(() => {
    sound.startDrone();

    const t1 = setTimeout(() => setPhase("point"), 300);
    const t2 = setTimeout(() => setPhase("forming"), 900);
    const t3 = setTimeout(() => setPhase("active"), 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // 3D Canvas Particle Simulation (Created only once on mount!)
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
    const particleCount = 200;
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

      // Mouse Parallax without triggering React renders
      const mouseOffset = mousePosRef.current;
      const targetRotY = (mouseOffset.x - centerX) * 0.0003;
      const targetRotX = (mouseOffset.y - centerY) * 0.0003;

      coreRotationY += (targetRotY - coreRotationY) * 0.05 + 0.003;
      coreRotationX += (targetRotX - coreRotationX) * 0.05;
      pulseTime += 0.03;

      // Draw Orbiting Core Rings
      ctx.save();
      ctx.translate(centerX, centerY);

      // Ring 1
      ctx.beginPath();
      ctx.ellipse(0, 0, 160 + Math.sin(pulseTime) * 6, 60, coreRotationY, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(216, 166, 58, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ring 2
      ctx.beginPath();
      ctx.ellipse(0, 0, 120, 180 + Math.cos(pulseTime) * 6, -coreRotationY * 0.7, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(244, 201, 93, 0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      // Draw 3D Particles
      const fov = 350;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed;

        // 3D rotation matrix
        const cosY = Math.cos(coreRotationY + p.angle);
        const sinY = Math.sin(coreRotationY + p.angle);
        const cosX = Math.cos(coreRotationX);
        const sinX = Math.sin(coreRotationX);

        const rotX = p.baseX * cosY - p.baseZ * sinY;
        const tempZ = p.baseX * sinY + p.baseZ * cosY;
        const rotY = p.baseY * cosX - tempZ * sinX;
        const rotZ = p.baseY * sinX + tempZ * cosX;

        const scale = fov / (fov + rotZ + 200);
        const projX = centerX + rotX * scale;
        const projY = centerY + rotY * scale;

        if (scale > 0) {
          const alpha = Math.min(1, Math.max(0.1, (rotZ + 250) / 500));
          ctx.beginPath();
          ctx.arc(projX, projY, p.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []); // Run ONLY once on mount!

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleBeginJourney = () => {
    sound.playWarp();
    setPhase("warping");

    let step = 0;
    const interval = setInterval(() => {
      step += 0.05;
      setWarpProgress(step);
      if (step >= 1) {
        clearInterval(interval);
        router.push("/dashboard");
      }
    }, 30);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A]/30"
    >
      {/* 3D CANVAS BACKGROUND */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 h-full w-full pointer-events-none" />

      {/* TOP STATUS BAR */}
      <header className="relative z-20 flex w-full items-center justify-between px-6 py-5 sm:px-12 border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 font-mono text-sm font-black text-[#D8A63A] shadow-[0_0_15px_rgba(216,166,58,0.35)]">
            ↑
          </div>
          <span className="font-mono text-xs sm:text-sm font-black tracking-[0.25em] text-[#F5F5F5] uppercase">
            WHYNOTUPSC
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <Link
            href="/login"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white hover:border-[#D8A63A] hover:text-[#F4C95D] transition"
          >
            CADET SIGN IN →
          </Link>
          <button
            onClick={handleBeginJourney}
            className="rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-4 py-2 font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_20px_rgba(216,166,58,0.3)]"
          >
            ENTER COMMAND HUB
          </button>
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
              onClick={handleBeginJourney}
              className="flex items-center gap-3 rounded-2xl border border-[#D8A63A] bg-gradient-to-r from-[#D8A63A] via-[#F4C95D] to-[#D8A63A] px-8 py-4 font-mono text-sm font-black text-black shadow-[0_0_35px_rgba(216,166,58,0.5)] hover:scale-105 active:scale-95 transition"
            >
              <span>🚀 INITIALIZE PREPARATION ENGINE</span>
              <span>→</span>
            </button>
            <Link
              href="/chill-zone"
              className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-mono text-sm font-bold text-white hover:border-[#D8A63A] hover:bg-[#D8A63A]/10 transition"
            >
              <span>🎮</span> CHILL ZONE LOUNGE
            </Link>
          </div>
        </div>

        {/* 10 Core Systems Overview Grid */}
        <div className="mt-20 grid w-full grid-cols-2 gap-3 sm:grid-cols-5 text-left font-mono text-xs">
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
            <Link
              key={sys.title}
              href={sys.link}
              className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 hover:border-[#D8A63A] hover:bg-[#D8A63A]/10 transition"
            >
              <span className="text-base">{sys.icon}</span>
              <span className="font-bold text-white text-[11px] uppercase truncate">{sys.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-20 flex flex-col items-center justify-between gap-4 border-t border-white/10 bg-[#050505]/90 px-6 py-6 font-mono text-xs text-[#8C8C8C] sm:flex-row sm:px-12 backdrop-blur-xl">
        <div>
          <span>WHYNOTUPSC © 2026 // FREE & ACCESSIBLE CIVIL SERVICES PREPARATION</span>
        </div>
        <div className="flex gap-6">
          <Link href="/dashboard" className="hover:text-[#F4C95D]">Command Centre</Link>
          <Link href="/tests" className="hover:text-[#F4C95D]">Mock Tests</Link>
          <Link href="/chill-zone" className="hover:text-[#F4C95D]">Chill Zone</Link>
          <Link href="/admin" className="hover:text-[#F4C95D]">Admin Portal</Link>
        </div>
      </footer>
    </div>
  );
}
