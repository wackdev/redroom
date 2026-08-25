"use client";

import React, { useMemo } from "react";
import { WeeklyReportSummary } from "@/lib/core/types";

interface WeeklyRadarChartProps {
  summary: WeeklyReportSummary;
}

export default function WeeklyRadarChart({ summary }: WeeklyRadarChartProps) {
  const radar = summary.radarMetrics || {
    gs1Hours: 6.5,
    gs2Hours: 8.0,
    gs3Hours: 7.5,
    gs4Hours: 5.0,
    csatHours: 4.5,
    essayHours: 3.5,
    targetHoursPerPaper: 7.0,
    prelimsEliminationAccuracy: 78,
    mainsAnswerSpeedWpm: 18.5,
    avgMainsTimePer150W: 7.8,
    avgMainsTimePer250W: 11.5,
  };

  const axes = [
    { label: "GS-1 (History/Geo)", value: radar.gs1Hours, target: radar.targetHoursPerPaper, icon: "🏺" },
    { label: "GS-2 (Polity/Gov)", value: radar.gs2Hours, target: radar.targetHoursPerPaper, icon: "🏛️" },
    { label: "GS-3 (Economy/Env/Sci)", value: radar.gs3Hours, target: radar.targetHoursPerPaper, icon: "📈" },
    { label: "GS-4 (Ethics)", value: radar.gs4Hours, target: radar.targetHoursPerPaper, icon: "⚖️" },
    { label: "CSAT (Quant/Logic)", value: radar.csatHours, target: radar.targetHoursPerPaper, icon: "🧮" },
    { label: "Essay (Synthesis)", value: radar.essayHours, target: radar.targetHoursPerPaper, icon: "✍️" },
  ];

  // SVG Geometry Calculation (6-point Polygon)
  const size = 300;
  const center = size / 2;
  const radius = 105;
  const maxScale = 10.0; // Max 10 hours for scaling

  const calculatePoint = (index: number, val: number) => {
    const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
    const r = (Math.min(val, maxScale) / maxScale) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const actualPoints = axes.map((a, i) => calculatePoint(i, a.value));
  const targetPoints = axes.map((a, i) => calculatePoint(i, a.target));

  const actualPolygon = actualPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const targetPolygon = targetPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0F0F12]/80 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#D8A63A]/20 text-xs">
              🕸️
            </span>
            <h3 className="font-mono text-xs sm:text-sm font-bold text-white tracking-wide">
              Weekly GS Radar & Velocity Audit
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-white/50">
            Automated performance balancing & tactical velocity metrics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D8A63A] shadow-[0_0_8px_#D8A63A]" />
            <span className="font-mono text-[11px] text-white/80">Candidate Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-dashed border-cyan-400" />
            <span className="font-mono text-[11px] text-cyan-400">Target Benchmark (7h)</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px] items-center">
        {/* SVG RADAR CHART */}
        <div className="flex items-center justify-center py-2">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full max-w-[260px] sm:max-w-[290px] aspect-square overflow-visible"
          >
            {/* Concentric Grid Rings */}
            {[0.25, 0.5, 0.75, 1].map((scale, ringIdx) => {
              const ringPoints = Array.from({ length: 6 }).map((_, i) => {
                const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                const r = radius * scale;
                return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
              }).join(" ");

              return (
                <polygon
                  key={ringIdx}
                  points={ringPoints}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Radial Axis Lines */}
            {axes.map((_, i) => {
              const outer = calculatePoint(i, maxScale);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              );
            })}

            {/* Target Polygon */}
            <polygon
              points={targetPolygon}
              fill="rgba(6, 182, 212, 0.05)"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />

            {/* Actual Polygon */}
            <polygon
              points={actualPolygon}
              fill="rgba(216, 166, 58, 0.25)"
              stroke="#D8A63A"
              strokeWidth="2.5"
              className="transition-all duration-700 ease-out"
            />

            {/* Actual Points (Glowing Vertices) */}
            {actualPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#D8A63A"
                stroke="#000"
                strokeWidth="1.5"
                className="drop-shadow-[0_0_6px_#D8A63A]"
              />
            ))}

            {/* Axis Labels */}
            {axes.map((axis, i) => {
              const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
              const labelR = radius + 22;
              const lx = center + labelR * Math.cos(angle);
              const ly = center + labelR * Math.sin(angle);

              return (
                <g key={i} transform={`translate(${lx}, ${ly})`}>
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white/80 font-mono text-[9px] sm:text-[10px] font-bold"
                  >
                    {axis.icon} {axis.value}h
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* TACTICAL METRICS & DIAGNOSTICS */}
        <div className="flex flex-col gap-3">
          {/* Prelims Elimination Accuracy */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-white/70">🎯 Prelims Elimination Accuracy</span>
              <span className="font-mono font-bold text-emerald-400">
                {radar.prelimsEliminationAccuracy}%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${radar.prelimsEliminationAccuracy}%` }}
              />
            </div>
            <p className="mt-1.5 text-[10px] text-white/50">
              Efficiency in 50/50 option elimination traps across test modules.
            </p>
          </div>

          {/* Mains Writing Velocity */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-white/70">✍️ Mains Writing Velocity</span>
              <span className="font-mono font-bold text-[#F4C95D]">
                {radar.mainsAnswerSpeedWpm} wpm
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-black/40 p-2 border border-white/5">
                <span className="block text-[10px] text-white/50">150W (10M)</span>
                <span className="font-mono text-xs font-bold text-white">
                  ~{radar.avgMainsTimePer150W} mins
                </span>
              </div>
              <div className="rounded-xl bg-black/40 p-2 border border-white/5">
                <span className="block text-[10px] text-white/50">250W (15M)</span>
                <span className="font-mono text-xs font-bold text-white">
                  ~{radar.avgMainsTimePer250W} mins
                </span>
              </div>
            </div>
          </div>

          {/* Strategic Balance Flag */}
          <div className="rounded-2xl border border-[#D8A63A]/20 bg-[#D8A63A]/5 p-3 text-xs">
            <span className="font-bold text-[#F4C95D]">💡 Mentor Diagnostic: </span>
            <span className="text-white/80">
              {radar.gs4Hours < 4
                ? "GS-4 Ethics time is below the 6h weekly threshold. Allocate 2 hours for case studies."
                : "Balanced distribution across GS papers. Maintain timed answer writing cadence."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
