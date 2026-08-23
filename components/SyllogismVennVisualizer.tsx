"use client";

import { useEffect, useRef, useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface PremisePreset {
  id: string;
  title: string;
  statement1: string;
  statement2: string;
  conclusions: {
    text: string;
    isValid: boolean;
    reason: string;
  }[];
  circles: {
    label: string;
    x: number;
    y: number;
    radius: number;
    color: string;
  }[];
}

const PRESET_SYLLOGISMS: PremisePreset[] = [
  {
    id: "syl-1",
    title: "Classic Universal Affirmative + Particular Affirmative",
    statement1: "All IAS Officers are Leaders.",
    statement2: "Some Leaders are Economists.",
    conclusions: [
      {
        text: "Some IAS Officers are definitely Economists.",
        isValid: false,
        reason: "False. IAS Officers circle may or may not overlap with Economists circle (Possibility, not certainty).",
      },
      {
        text: "Some Leaders are IAS Officers.",
        isValid: true,
        reason: "True. Since All IAS Officers are inside Leaders, the subset of Leaders containing IAS Officers is non-empty.",
      },
      {
        text: "All Economists being IAS Officers is a possibility.",
        isValid: true,
        reason: "True. There is no negative statement preventing the Economists circle from being inside the IAS circle.",
      },
    ],
    circles: [
      { label: "Leaders (Outer)", x: 260, y: 170, radius: 100, color: "rgba(216, 166, 58, 0.25)" },
      { label: "IAS Officers (Inner)", x: 230, y: 170, radius: 55, color: "rgba(244, 201, 93, 0.6)" },
      { label: "Economists (Intersecting)", x: 380, y: 170, radius: 75, color: "rgba(167, 139, 250, 0.4)" },
    ],
  },
  {
    id: "syl-2",
    title: "Universal Negative + Universal Affirmative (No-Overlap)",
    statement1: "No Politician is Incorruptible.",
    statement2: "All Judges are Incorruptible.",
    conclusions: [
      {
        text: "No Judge is a Politician.",
        isValid: true,
        reason: "True. Since Judges are entirely inside Incorruptible and Incorruptible has 0 overlap with Politicians, Judges can never touch Politicians.",
      },
      {
        text: "Some Incorruptible individuals are Judges.",
        isValid: true,
        reason: "True. Sub-conversion of universal affirmative.",
      },
    ],
    circles: [
      { label: "Politicians (Disjoint)", x: 180, y: 170, radius: 75, color: "rgba(239, 68, 68, 0.4)" },
      { label: "Incorruptible (Outer)", x: 420, y: 170, radius: 95, color: "rgba(16, 185, 129, 0.25)" },
      { label: "Judges (Inner)", x: 420, y: 170, radius: 50, color: "rgba(52, 211, 153, 0.6)" },
    ],
  },
];

export default function SyllogismVennVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PremisePreset>(PRESET_SYLLOGISMS[0]);

  // Render Venn Circles on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    selectedPreset.circles.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.radius, 0, 2 * Math.PI);
      ctx.fillStyle = c.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#D8A63A";
      ctx.stroke();

      // Label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(c.label, c.x, c.y);
    });
  }, [selectedPreset]);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl backdrop-blur-xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-purple-400">
              CSAT REASONING LAB // DEDUCTIVE LOGIC
            </span>
          </div>
          <h2 className="mt-1 font-mono text-lg font-bold text-white">
            Syllogism Venn Diagram Visualizer
          </h2>
          <p className="text-xs text-[#8C8C8C]">
            Visually verify statement premises and evaluate definite vs possibility conclusions.
          </p>
        </div>

        {/* Preset Selector */}
        <select
          value={selectedPreset.id}
          onChange={(e) => {
            const found = PRESET_SYLLOGISMS.find((p) => p.id === e.target.value);
            if (found) {
              setSelectedPreset(found);
              sound.playHover();
            }
          }}
          className="rounded-xl border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-[#D8A63A] focus:outline-none"
        >
          {PRESET_SYLLOGISMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Statements Banner */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 font-mono text-xs">
          <strong className="text-[#F4C95D] block mb-1">Premise Statement 1:</strong>
          <span className="text-white">{selectedPreset.statement1}</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 font-mono text-xs">
          <strong className="text-[#F4C95D] block mb-1">Premise Statement 2:</strong>
          <span className="text-white">{selectedPreset.statement2}</span>
        </div>
      </div>

      {/* Main Interactive Canvas & Conclusions Split */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Venn Canvas */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/60 p-4">
          <canvas ref={canvasRef} width={600} height={340} className="max-w-full rounded-xl" />
          <span className="mt-2 font-mono text-[10px] text-[#8C8C8C]">
            Venn Intersection Topology Model
          </span>
        </div>

        {/* Conclusions Evaluator */}
        <div className="space-y-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F4C95D]">
            Conclusions Analytical Breakdown
          </h3>
          {selectedPreset.conclusions.map((c, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-4 transition ${
                c.isValid
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-red-500/30 bg-red-500/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white">Conclusion {idx + 1}</span>
                <span
                  className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    c.isValid
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {c.isValid ? "✓ Logically Follows" : "✕ Does Not Follow"}
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-white/90">{c.text}</p>
              <p className="mt-2 text-[11px] text-[#8C8C8C] font-sans border-t border-white/5 pt-2">
                <strong>Proof:</strong> {c.reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
