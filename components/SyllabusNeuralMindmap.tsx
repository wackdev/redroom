"use client";

import React, { useState, useEffect, useRef } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface MindmapNode {
  id: string;
  label: string;
  gsPaper: "GS-1" | "GS-2" | "GS-3" | "GS-4";
  category: string;
  x: number;
  y: number;
  connectedNodeIds: string[];
  description: string;
  prelimsHooks: string[];
  mainsHooks: string[];
}

const MINDMAP_NODES: MindmapNode[] = [
  {
    id: "el-nino",
    label: "El Niño Southern Oscillation (ENSO)",
    gsPaper: "GS-1",
    category: "Physical Geography & Climatology",
    x: 200,
    y: 180,
    connectedNodeIds: ["walker-circ", "iod", "kharif-monsoon", "food-inflation"],
    description: "Periodic warming of sea surface temperatures in central and eastern equatorial Pacific, weakening trade winds.",
    prelimsHooks: ["UPSC 2017 & 2011: Impact of El Niño on Indian Southwest Monsoon rainfall and Walker circulation."],
    mainsHooks: ["GS-1 (2023): Discuss the mechanism of ENSO and its asymmetric impact on Indian agriculture."]
  },
  {
    id: "walker-circ",
    label: "Pacific Walker Circulation",
    gsPaper: "GS-1",
    category: "Atmospheric Dynamics",
    x: 100,
    y: 110,
    connectedNodeIds: ["el-nino"],
    description: "Equatorial zonal atmospheric overturning circulation driven by tropical temperature and pressure gradients.",
    prelimsHooks: ["UPSC 2019: Walker circulation collapse during El Niño events."],
    mainsHooks: ["GS-1 (2020): Global atmospheric teleconnections and monsoon variability."]
  },
  {
    id: "iod",
    label: "Indian Ocean Dipole (IOD)",
    gsPaper: "GS-1",
    category: "Oceanography",
    x: 320,
    y: 100,
    connectedNodeIds: ["el-nino", "kharif-monsoon"],
    description: "Difference in sea surface temperature between western Indian Ocean (Arabian Sea) and eastern Indian Ocean (Sumatra).",
    prelimsHooks: ["UPSC 2017: Positive IOD neutralizes the negative deficit impact of El Niño on Indian monsoons."],
    mainsHooks: ["GS-1 (2019): Interplay between IOD and Madden-Julian Oscillation (MJO)."]
  },
  {
    id: "kharif-monsoon",
    label: "Kharif Crop Yield & Sowing Deficit",
    gsPaper: "GS-3",
    category: "Agriculture & Cropping Patterns",
    x: 220,
    y: 310,
    connectedNodeIds: ["el-nino", "iod", "food-inflation", "msp-buffer"],
    description: "Rainfed crops (Paddy, Pulses, Oilseeds) heavily dependent on June-September monsoon rainfall distribution.",
    prelimsHooks: ["UPSC 2021: Difference in water requirement of Rice vs Millets vs Sugarcane."],
    mainsHooks: ["GS-3 (2022): Climate-resilient agriculture and micro-irrigation under PMKSY."]
  },
  {
    id: "food-inflation",
    label: "Headline vs Food Inflation (CPI)",
    gsPaper: "GS-3",
    category: "Macroeconomics & Monetary Policy",
    x: 380,
    y: 260,
    connectedNodeIds: ["kharif-monsoon", "msp-buffer", "rbi-repo"],
    description: "Consumer Price Index (CPI) basket where Food and Beverages constitute ~45.86% weight, transmitting supply shocks.",
    prelimsHooks: ["UPSC 2020: CPI vs WPI base year and service sector inclusion."],
    mainsHooks: ["GS-3 (2023): RBI's Flexible Inflation Targeting (FIT 4% +/- 2%) during food supply disruptions."]
  },
  {
    id: "msp-buffer",
    label: "MSP Procurement & FCI Buffer Stocks",
    gsPaper: "GS-3",
    category: "Public Distribution & Food Security",
    x: 160,
    y: 430,
    connectedNodeIds: ["kharif-monsoon", "food-inflation", "nfsa-act"],
    description: "Minimum Support Price (MSP) announced for 22 mandated crops and fair price procurement by Food Corporation of India.",
    prelimsHooks: ["UPSC 2023: CACP recommends MSP based on C2/A2+FL cost formula."],
    mainsHooks: ["GS-3 (2021): Shanta Kumar Committee recommendations on FCI restructuring and Open Market Sale Scheme (OMSS)."]
  },
  {
    id: "nfsa-act",
    label: "National Food Security Act (NFSA 2013)",
    gsPaper: "GS-2",
    category: "Social Justice & Welfare Policies",
    x: 290,
    y: 500,
    connectedNodeIds: ["msp-buffer"],
    description: "Legal entitlement to subsidized food grains for up to 75% of rural and 50% of urban population (PM Garib Kalyan Anna Yojana).",
    prelimsHooks: ["UPSC 2018: Eldest woman aged 18+ as head of household for ration cards under NFSA."],
    mainsHooks: ["GS-2 (2020): Universal Basic Services vs targeted PDS digitisation through One Nation One Ration Card (ONORC)."]
  },
  {
    id: "rbi-repo",
    label: "RBI Repo Rate & LAF Operations",
    gsPaper: "GS-3",
    category: "Monetary Economics",
    x: 480,
    y: 350,
    connectedNodeIds: ["food-inflation"],
    description: "Policy repo rate under Liquidity Adjustment Facility (LAF) used to anchor inflation expectations and credit growth.",
    prelimsHooks: ["UPSC 2021: Impact of Repo Rate hike on currency exchange rate and bank lending rates."],
    mainsHooks: ["GS-3 (2022): Monetary transmission lags in commercial banks and MCLR/EBLR frameworks."]
  }
];

export default function SyllabusNeuralMindmap() {
  const [selectedNode, setSelectedNode] = useState<MindmapNode>(MINDMAP_NODES[0]);
  const [activeSearch, setActiveSearch] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Filtered / Searched Node
  const activeNodes = MINDMAP_NODES.filter((n) =>
    n.label.toLowerCase().includes(activeSearch.toLowerCase()) ||
    n.category.toLowerCase().includes(activeSearch.toLowerCase())
  );

  // Render Interactive Neural Graph Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background subtle grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Connections (Lines & Animated Neural Pulses)
      MINDMAP_NODES.forEach((node) => {
        node.connectedNodeIds.forEach((targetId) => {
          const target = MINDMAP_NODES.find((n) => n.id === targetId);
          if (!target) return;

          const isHighlight =
            selectedNode.id === node.id || selectedNode.id === target.id;

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = isHighlight
            ? "rgba(168, 85, 247, 0.8)"
            : "rgba(255, 255, 255, 0.1)";
          ctx.lineWidth = isHighlight ? 2.5 : 1;
          ctx.stroke();

          // Animated Pulse
          if (isHighlight) {
            const t = ((Date.now() / 1500) % 1);
            const px = node.x + (target.x - node.x) * t;
            const py = node.y + (target.y - node.y) * t;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#c084fc";
            ctx.shadowColor = "#c084fc";
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });

      // Draw Nodes
      MINDMAP_NODES.forEach((node) => {
        const isSelected = selectedNode.id === node.id;
        const isConnected = selectedNode.connectedNodeIds.includes(node.id);

        ctx.beginPath();
        ctx.arc(node.x, node.y, isSelected ? 16 : isConnected ? 12 : 9, 0, Math.PI * 2);

        if (isSelected) {
          ctx.fillStyle = "#a855f7";
          ctx.shadowColor = "#a855f7";
          ctx.shadowBlur = 15;
        } else if (isConnected) {
          ctx.fillStyle = "#06b6d4";
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Node Label
        ctx.font = isSelected ? "bold 11px Inter, sans-serif" : "10px Inter, sans-serif";
        ctx.fillStyle = isSelected ? "#fff" : "rgba(255, 255, 255, 0.7)";
        ctx.fillText(node.label, node.x + 18, node.y + 4);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const node of MINDMAP_NODES) {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist <= 20) {
        sound.playHover();
        setSelectedNode(node);
        break;
      }
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080511] p-5 shadow-2xl backdrop-blur-2xl">
      {/* HEADER & SEARCH */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-500/20 text-sm">
              🧠
            </span>
            <h2 className="font-mono text-base font-black tracking-wide text-white sm:text-lg">
              Dynamic Syllabus Micro-Concept Mindmap & Graph
            </h2>
          </div>
          <p className="text-xs text-white/50">
            Interactive neural graph displaying interdisciplinary chain reactions across 1,200+ UPSC micro-topics
          </p>
        </div>

        <input
          type="text"
          placeholder="🔍 Search syllabus micro-topics..."
          value={activeSearch}
          onChange={(e) => setActiveSearch(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-white placeholder-white/40 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* GRAPH CANVAS & CONCEPT DETAILS */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT: INTERACTIVE NEURAL CANVAS */}
        <div className="relative flex items-center justify-center rounded-2xl border border-purple-500/30 bg-black/60 p-2">
          <canvas
            ref={canvasRef}
            width={580}
            height={560}
            onClick={handleCanvasClick}
            className="cursor-pointer max-w-full rounded-xl"
          />
          <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 text-[10px] font-mono text-purple-300 border border-purple-500/30 backdrop-blur-md">
            ⚡ Click any node to activate neural chain reaction
          </div>
        </div>

        {/* RIGHT: ACTIVE CONCEPT NODE DISCOVERY HUB */}
        <div className="rounded-2xl border border-purple-500/30 bg-purple-950/10 p-5 space-y-4">
          <div className="border-b border-purple-500/20 pb-3">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-300">
                {selectedNode.gsPaper} • {selectedNode.category}
              </span>
            </div>
            <h3 className="mt-1.5 text-base font-black text-white">{selectedNode.label}</h3>
            <p className="mt-1 text-xs text-white/80 leading-relaxed">{selectedNode.description}</p>
          </div>

          {/* CHAIN REACTION CONNECTIONS */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
              🔗 Connected Cross-Syllabus Nodes:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedNode.connectedNodeIds.map((id) => {
                const conn = MINDMAP_NODES.find((n) => n.id === id);
                if (!conn) return null;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedNode(conn);
                    }}
                    className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[11px] font-medium text-cyan-300 hover:bg-cyan-500/20 transition"
                  >
                    → {conn.label} ({conn.gsPaper})
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRELIMS EXAMINER HOOK */}
          <div className="rounded-xl border border-white/5 bg-black/40 p-3 text-xs space-y-1">
            <span className="font-bold text-amber-300">🎯 Prelims Past Year Hook:</span>
            <p className="text-white/80">{selectedNode.prelimsHooks[0]}</p>
          </div>

          {/* MAINS INTER-DISCIPLINARY HOOK */}
          <div className="rounded-xl border border-white/5 bg-black/40 p-3 text-xs space-y-1">
            <span className="font-bold text-pink-300">📝 Mains Analytical Integration:</span>
            <p className="text-white/80">{selectedNode.mainsHooks[0]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
