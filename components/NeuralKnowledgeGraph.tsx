"use client";

import { useEffect, useRef, useState } from "react";
import { sound } from "@/lib/audio/sound-engine";
import { safeArray } from "@/lib/core/utils";

export interface KnowledgeNode {
  id: string;
  name: string;
  code: string;
  status: "not_started" | "learning" | "weak" | "strong" | "mastered";
  totalQuestions: number;
  solvedCount: number;
  accuracy: number;
  subtopics: string[];
  angle: number;
}

interface Props {
  onSelectSubject?: (subjectName: string) => void;
  activeSubject?: string;
}

export default function NeuralKnowledgeGraph({ onSelectSubject, activeSubject }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<KnowledgeNode[]>([
    {
      id: "polity",
      name: "Polity",
      code: "GS2-POL",
      status: "learning",
      totalQuestions: 120,
      solvedCount: 15,
      accuracy: 65,
      subtopics: ["Preamble & Rights", "Parliament & Executive", "Judiciary & Basic Structure", "Federalism"],
      angle: (0 * Math.PI) / 4,
    },
    {
      id: "history",
      name: "History",
      code: "GS1-HIS",
      status: "weak",
      totalQuestions: 150,
      solvedCount: 32,
      accuracy: 48,
      subtopics: ["Modern National Movement", "Socio-Religious Reform", "Ancient Art & Culture", "Medieval India"],
      angle: (1 * Math.PI) / 4,
    },
    {
      id: "geography",
      name: "Geography",
      code: "GS1-GEO",
      status: "learning",
      totalQuestions: 110,
      solvedCount: 18,
      accuracy: 60,
      subtopics: ["Monsoon Systems", "Geomorphology", "Oceanography", "Indian Rivers & Minerals"],
      angle: (2 * Math.PI) / 4,
    },
    {
      id: "economy",
      name: "Economy",
      code: "GS3-ECO",
      status: "strong",
      totalQuestions: 135,
      solvedCount: 45,
      accuracy: 78,
      subtopics: ["Fiscal & Monetary Policy", "Inflation & Banking", "External Sector & Forex", "Agriculture"],
      angle: (3 * Math.PI) / 4,
    },
    {
      id: "environment",
      name: "Environment",
      code: "GS3-ENV",
      status: "weak",
      totalQuestions: 95,
      solvedCount: 12,
      accuracy: 42,
      subtopics: ["Biodiversity Hotspots", "Climate Conventions", "National Parks & Wildlife", "Pollution"],
      angle: (4 * Math.PI) / 4,
    },
    {
      id: "scitech",
      name: "Science & Tech",
      code: "GS3-S&T",
      status: "learning",
      totalQuestions: 85,
      solvedCount: 14,
      accuracy: 58,
      subtopics: ["Space Exploration", "Biotechnology & CRISPR", "AI & Quantum", "Defense Technologies"],
      angle: (5 * Math.PI) / 4,
    },
    {
      id: "ir",
      name: "International Relations",
      code: "GS2-IR",
      status: "not_started",
      totalQuestions: 60,
      solvedCount: 4,
      accuracy: 50,
      subtopics: ["India & Neighbors", "Multilateral Forums (G20, BRICS)", "Global Geopolitics", "Bilateral Pacts"],
      angle: (6 * Math.PI) / 4,
    },
    {
      id: "ca",
      name: "Current Affairs",
      code: "GS-INTEL",
      status: "strong",
      totalQuestions: 140,
      solvedCount: 50,
      accuracy: 82,
      subtopics: ["Government Schemes", "Economic Survey Highlights", "Supreme Court Rulings", "Reports & Indices"],
      angle: (7 * Math.PI) / 4,
    },
  ]);

  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<KnowledgeNode | null>(null);

  // Load real user metrics from storage
  useEffect(() => {
    try {
      const pyqProg = localStorage.getItem("redroom_pyq_progress");
      if (pyqProg) {
        const parsed = safeArray(JSON.parse(pyqProg));
        if (parsed.length > 0) {
          setNodes((prev) =>
            prev.map((n) => {
              const matched = parsed.filter(
                (p: any) =>
                  (p.subject && p.subject.toLowerCase() === n.name.toLowerCase()) ||
                  (p.category && p.category.toLowerCase() === n.name.toLowerCase())
              );
              if (matched.length === 0) return n;

              const correct = matched.filter((p: any) => p.isCorrect).length;
              const acc = Math.round((correct / matched.length) * 100);
              let stat: KnowledgeNode["status"] = "learning";
              if (matched.length > 25 && acc >= 80) stat = "mastered";
              else if (acc >= 70) stat = "strong";
              else if (acc < 50) stat = "weak";

              return {
                ...n,
                solvedCount: matched.length,
                accuracy: acc,
                status: stat,
              };
            })
          );
        }
      }
    } catch {}
  }, []);

  const getStatusBadge = (status: KnowledgeNode["status"]) => {
    switch (status) {
      case "mastered":
        return { label: "MASTERED", color: "#3B82F6", dot: "🔵" };
      case "strong":
        return { label: "STRONG", color: "#10B981", dot: "🟢" };
      case "weak":
        return { label: "WEAK", color: "#FBBF24", dot: "🟡" };
      case "learning":
        return { label: "LEARNING", color: "#F97316", dot: "🟠" };
      case "not_started":
      default:
        return { label: "NOT STARTED", color: "#FF1B1B", dot: "🔴" };
    }
  };

  // 3D Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    let angleOffset = 0;

    const render = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      angleOffset += 0.002;

      // Radial Core Glow
      const glow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, width * 0.4);
      glow.addColorStop(0, "rgba(255, 27, 27, 0.2)");
      glow.addColorStop(0.5, "rgba(122, 0, 0, 0.08)");
      glow.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Central Hub
      ctx.beginPath();
      ctx.arc(centerX, centerY, 38, 0, Math.PI * 2);
      ctx.fillStyle = "#0d0d0d";
      ctx.fill();
      ctx.strokeStyle = "#FF1B1B";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#FF1B1B";
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Orbit Track
      const orbitX = Math.min(width * 0.38, 280);
      const orbitY = Math.min(height * 0.36, 170);

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, orbitX, orbitY, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 27, 27, 0.15)";
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Subject Node Network Synapses
      nodes.forEach((n) => {
        const curAngle = n.angle + angleOffset;
        const nodeX = centerX + Math.cos(curAngle) * orbitX;
        const nodeY = centerY + Math.sin(curAngle) * orbitY;
        const isHover = hoveredNode?.id === n.id || activeSubject?.toLowerCase() === n.name.toLowerCase();

        // Synapse Laser Line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(nodeX, nodeY);
        ctx.strokeStyle = isHover ? "rgba(255, 27, 27, 0.8)" : "rgba(255, 27, 27, 0.18)";
        ctx.lineWidth = isHover ? 2 : 1;
        ctx.stroke();

        // Node Circle
        const statusMeta = getStatusBadge(n.status);
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, isHover ? 18 : 13, 0, Math.PI * 2);
        ctx.fillStyle = "#0d0d0d";
        ctx.fill();
        ctx.strokeStyle = statusMeta.color;
        ctx.lineWidth = isHover ? 3 : 2;
        if (isHover) {
          ctx.shadowColor = statusMeta.color;
          ctx.shadowBlur = 12;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = isHover ? "#FFFFFF" : "#8C8C8C";
        ctx.font = isHover ? "bold 11px monospace" : "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(n.name.toUpperCase(), nodeX, nodeY + 26);
      });

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [nodes, hoveredNode, activeSubject]);

  const handleNodeClick = (n: KnowledgeNode) => {
    sound.playLock();
    setSelectedNode(n);
    if (onSelectSubject) {
      onSelectSubject(n.name);
    }
  };

  return (
    <div className="relative flex flex-col rounded-3xl border border-[#FF1B1B]/30 bg-[#0d0d0d]/95 p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.9)]">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FF1B1B] animate-ping" />
            <h2 className="font-mono text-xs sm:text-sm font-black tracking-widest text-white uppercase">
              UPSC NEURAL KNOWLEDGE CONSTELLATION
            </h2>
          </div>
          <p className="mt-1 text-xs text-[#8C8C8C]">
            Interactive 3D preparation network · Synapsed to official PYQs and syllabus depth
          </p>
        </div>

        {/* STATUS LEGEND */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1 rounded bg-black/40 px-2 py-1 text-red-400 border border-red-500/20">
            🔴 Not Started
          </span>
          <span className="flex items-center gap-1 rounded bg-black/40 px-2 py-1 text-amber-400 border border-amber-500/20">
            🟡 Weak
          </span>
          <span className="flex items-center gap-1 rounded bg-black/40 px-2 py-1 text-emerald-400 border border-emerald-500/20">
            🟢 Strong
          </span>
          <span className="flex items-center gap-1 rounded bg-black/40 px-2 py-1 text-blue-400 border border-blue-500/20">
            🔵 Mastered
          </span>
        </div>
      </div>

      {/* 3D CANVAS HUD */}
      <div
        onClick={(e) => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const orbitX = Math.min(rect.width * 0.38, 280);
          const orbitY = Math.min(rect.height * 0.36, 170);

          // Find clicked node
          for (const n of nodes) {
            const nodeX = centerX + Math.cos(n.angle) * orbitX;
            const nodeY = centerY + Math.sin(n.angle) * orbitY;
            const dist = Math.hypot(x - nodeX, y - nodeY);
            if (dist < 30) {
              handleNodeClick(n);
              break;
            }
          }
        }}
        style={{ touchAction: "manipulation" }}
        className="relative my-4 h-[320px] sm:h-[400px] w-full overflow-hidden rounded-2xl border border-white/5 bg-[#050505] cursor-pointer"
      >
        <canvas ref={canvasRef} className="h-full w-full pointer-events-none" />

        {/* CENTER EMBLEM */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="font-mono text-[9px] font-black tracking-widest text-[#FF1B1B]">UPSC</span>
          <p className="font-mono text-[10px] font-bold text-white">CORE</p>
        </div>
      </div>

      {/* QUICK SELECTOR CHIPS */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {nodes.map((n) => {
          const meta = getStatusBadge(n.status);
          const isSelected = activeSubject?.toLowerCase() === n.name.toLowerCase();

          return (
            <button
              key={n.id}
              onClick={() => handleNodeClick(n)}
              onMouseEnter={() => {
                setHoveredNode(n);
                sound.playHover();
              }}
              onMouseLeave={() => setHoveredNode(null)}
              className={`flex items-center justify-between rounded-xl border p-2.5 font-mono text-xs transition touch-manipulation cursor-pointer active:scale-95 ${
                isSelected
                  ? "border-[#FF1B1B] bg-[#FF1B1B]/15 text-white shadow-[0_0_15px_rgba(255,27,27,0.3)]"
                  : "border-white/10 bg-black/30 text-[#8C8C8C] hover:border-white/30 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span>{meta.dot}</span>
                <span className="font-bold text-white truncate">{n.name}</span>
              </div>
              <span className="text-[10px] text-white/50">{n.accuracy}%</span>
            </button>
          );
        })}
      </div>


      {/* EXPANDED NODE INTELLIGENCE DRAWER */}
      {selectedNode && (
        <div className="mt-4 rounded-2xl border border-[#FF1B1B]/30 bg-black/60 p-4 font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white">{selectedNode.name}</span>
              <span className="rounded bg-[#FF1B1B]/20 px-2 py-0.5 text-[10px] font-bold text-[#FF1B1B]">
                {selectedNode.code}
              </span>
            </div>
            <span className="text-xs text-white/60">
              Accuracy: <strong className="text-[#FF1B1B]">{selectedNode.accuracy}%</strong> ({selectedNode.solvedCount}/{selectedNode.totalQuestions} Solved)
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {selectedNode.subtopics.map((sub, i) => (
              <span
                key={i}
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80"
              >
                ⚡ {sub}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
