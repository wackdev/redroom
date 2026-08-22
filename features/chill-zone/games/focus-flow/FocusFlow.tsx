"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { submitGameScore } from "../../services/score-service";
import { sound } from "@/lib/audio/sound-engine";

interface FocusFlowProps {
  onBack: () => void;
  onFinish?: () => void;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
}

interface EnergyOrb {
  x: number;
  y: number;
  radius: number;
  speed: number;
  pulse: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export default function FocusFlow({ onBack, onFinish }: FocusFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"intro" | "playing" | "gameover">("intro");
  const [score, setScore] = useState(0);
  const [energyCollected, setEnergyCollected] = useState(0);
  const [survivalTime, setSurvivalTime] = useState(0);
  const [isPb, setIsPb] = useState(false);

  const playerRef = useRef({ x: 200, y: 300, radius: 12, targetY: 300 });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const energyRef = useRef<EnergyOrb[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const sessionStartRef = useRef<number>(0);

  const startGame = useCallback(() => {
    setGameState("playing");
    setScore(0);
    setEnergyCollected(0);
    setSurvivalTime(0);
    setIsPb(false);
    obstaclesRef.current = [];
    energyRef.current = [];
    particlesRef.current = [];
    sessionStartRef.current = Date.now();
    playerRef.current = { x: 80, y: 200, radius: 12, targetY: 200 };
    sound.playWarp();
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientY = e.clientY - rect.top;
    const scaleY = canvas.height / rect.height;
    playerRef.current.targetY = clientY * scaleY;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let spawnTimer = 0;
    let energyTimer = 0;
    let currentScore = 0;
    let collectedCount = 0;

    const render = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gameState === "playing") {
        // Grid background lines
        ctx.strokeStyle = "rgba(216, 166, 58, 0.04)";
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        // Smooth player movement
        const player = playerRef.current;
        player.y += (player.targetY - player.y) * 0.15;
        player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

        // Player trail particles
        if (Math.random() < 0.6) {
          particlesRef.current.push({
            x: player.x - 5,
            y: player.y + (Math.random() - 0.5) * 6,
            vx: -3 - Math.random() * 2,
            vy: (Math.random() - 0.5) * 1.5,
            life: 1,
            color: "#F4C95D",
          });
        }

        // Update score
        currentScore += 2;
        setScore(currentScore);
        const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
        setSurvivalTime(elapsed);

        // Speed ramp up factor
        const speedMultiplier = 1 + elapsed * 0.03;

        // Spawn obstacles
        spawnTimer++;
        if (spawnTimer > Math.max(30, 75 - elapsed * 1.2)) {
          spawnTimer = 0;
          const h = 40 + Math.random() * 90;
          const y = Math.random() * (canvas.height - h);
          obstaclesRef.current.push({
            x: canvas.width + 20,
            y,
            width: 18 + Math.random() * 15,
            height: h,
            speed: (3.5 + Math.random() * 2) * speedMultiplier,
            color: "#EF4444",
          });
        }

        // Spawn energy orbs
        energyTimer++;
        if (energyTimer > 110) {
          energyTimer = 0;
          energyRef.current.push({
            x: canvas.width + 20,
            y: 30 + Math.random() * (canvas.height - 60),
            radius: 9,
            speed: 3 * speedMultiplier,
            pulse: 0,
          });
        }

        // Render & Update Obstacles
        for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
          const obs = obstaclesRef.current[i];
          obs.x -= obs.speed;

          // Render obstacle
          ctx.fillStyle = "rgba(239, 68, 68, 0.85)";
          ctx.shadowColor = "rgba(239, 68, 68, 0.6)";
          ctx.shadowBlur = 12;
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.shadowBlur = 0;

          // Collision Check
          if (
            player.x + player.radius > obs.x &&
            player.x - player.radius < obs.x + obs.width &&
            player.y + player.radius > obs.y &&
            player.y - player.radius < obs.y + obs.height
          ) {
            // CRASH!
            sound.playWrong();
            setGameState("gameover");
            const duration = Date.now() - sessionStartRef.current;
            submitGameScore({
              gameSlug: "focus-flow",
              score: currentScore,
              durationMs: duration,
              metadata: { energyCollected: collectedCount, survivalTime: elapsed },
            }).then((res) => {
              if (res.isPersonalBest) setIsPb(true);
            });
            break;
          }

          if (obs.x + obs.width < -10) {
            obstaclesRef.current.splice(i, 1);
          }
        }

        // Render & Update Energy Orbs
        for (let i = energyRef.current.length - 1; i >= 0; i--) {
          const orb = energyRef.current[i];
          orb.x -= orb.speed;
          orb.pulse += 0.1;

          const glowRadius = orb.radius + Math.sin(orb.pulse) * 2;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = "#F4C95D";
          ctx.shadowColor = "rgba(244, 201, 93, 0.8)";
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Collect Check
          const dist = Math.hypot(player.x - orb.x, player.y - orb.y);
          if (dist < player.radius + orb.radius) {
            sound.playCorrect();
            currentScore += 350;
            collectedCount++;
            setEnergyCollected(collectedCount);

            // Burst particles
            for (let p = 0; p < 8; p++) {
              particlesRef.current.push({
                x: orb.x,
                y: orb.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 1,
                color: "#F4C95D",
              });
            }
            energyRef.current.splice(i, 1);
            continue;
          }

          if (orb.x < -10) {
            energyRef.current.splice(i, 1);
          }
        }

        // Render Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.035;

          if (p.life <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // Render Player Orb
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "rgba(216, 166, 58, 0.9)";
        ctx.shadowBlur = 20;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = "#D8A63A";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [gameState]);

  return (
    <div className="relative flex min-h-[580px] w-full flex-col items-center justify-between rounded-3xl border border-white/10 bg-[#070707] p-6 text-white select-none overflow-hidden sm:p-8">
      {/* Top HUD */}
      <div className="flex w-full items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition"
        >
          ← EXIT FLOW
        </button>

        <div className="flex items-center gap-6 font-mono text-xs">
          <span className="text-[#8C8C8C]">
            TIME: <strong className="text-white">{survivalTime}s</strong>
          </span>
          <span className="text-[#8C8C8C]">
            ENERGY: <strong className="text-[#F4C95D]">✨ {energyCollected}</strong>
          </span>
          <span className="text-[#8C8C8C]">
            SCORE: <strong className="text-[#D8A63A] text-sm">{score.toLocaleString()}</strong>
          </span>
        </div>
      </div>

      {/* Canvas Arena */}
      <div className="relative my-4 flex h-[380px] w-full max-w-2xl items-center justify-center rounded-2xl border border-white/15 overflow-hidden bg-black shadow-[0_0_40px_rgba(0,0,0,0.9)]">
        <canvas
          ref={canvasRef}
          width={700}
          height={380}
          onPointerMove={handlePointerMove}
          className="h-full w-full cursor-ns-resize"
        />

        {gameState === "intro" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 p-6 text-center backdrop-blur-sm">
            <span className="text-5xl">🌌</span>
            <h2 className="mt-2 font-mono text-3xl font-black tracking-widest text-[#F4C95D] uppercase">
              FOCUS FLOW
            </h2>
            <p className="mt-1 max-w-md text-xs text-[#8C8C8C] leading-relaxed">
              Dodge red cosmic barriers and collect golden energy rings. Move your mouse or drag your finger up and down to guide the orb.
            </p>
            <button
              onClick={startGame}
              className="mt-5 rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-7 py-2.5 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_25px_rgba(216,166,58,0.5)]"
            >
              ENTER SLIPSTREAM
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/85 p-6 text-center backdrop-blur-md">
            {isPb && (
              <span className="animate-pulse rounded-full border border-[#F4C95D] bg-[#F4C95D]/20 px-3 py-1 font-mono text-[10px] font-black text-[#F4C95D]">
                🏆 NEW PERSONAL BEST RECORD
              </span>
            )}
            <h2 className="mt-1 font-mono text-3xl font-black text-white uppercase">
              STREAM DESTABILIZED
            </h2>
            <h3 className="font-mono text-5xl font-black text-[#F4C95D]">
              {score.toLocaleString()} <span className="text-xl text-white">PTS</span>
            </h3>
            <p className="mt-1 font-mono text-xs text-[#8C8C8C]">
              Survived <strong>{survivalTime}s</strong> · Collected <strong>{energyCollected} nodes</strong>
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  onFinish?.();
                  onBack();
                }}
                className="rounded-xl border border-white/20 bg-white/10 px-5 py-2 font-mono text-xs font-bold text-white hover:bg-white/20 transition"
              >
                RETURN TO STUDY
              </button>
              <button
                onClick={startGame}
                className="rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-5 py-2 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_20px_rgba(216,166,58,0.4)]"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Hint */}
      <div className="flex w-full items-center justify-between border-t border-white/10 pt-3 text-[11px] font-mono text-[#8C8C8C]">
        <span>🖱️ Move Cursor / Drag Finger Up & Down</span>
        <span>Flow Multiplier: +3% speed every second</span>
      </div>
    </div>
  );
}
