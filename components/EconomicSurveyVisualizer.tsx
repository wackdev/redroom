"use client";

import { useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface MacroMetric {
  title: string;
  value: string;
  change: string;
  status: "positive" | "neutral" | "warning";
  target: string;
  mainsRelevance: string;
}

const MACRO_METRICS: MacroMetric[] = [
  {
    title: "Fiscal Deficit (% of GDP)",
    value: "4.9%",
    change: "Down from 5.6% (FY24)",
    status: "positive",
    target: "Glide path target <4.5% by FY26 (FRBM Act)",
    mainsRelevance: "Demonstrates fiscal consolidation without compromising capital expenditure quality.",
  },
  {
    title: "Effective Capital Expenditure",
    value: "₹11.11 Lakh Cr",
    change: "3.4% of GDP (3x increase over 5 yrs)",
    status: "positive",
    target: "Sustained >3% of GDP multiplier",
    mainsRelevance: "Crowds-in private investment; creates long-term infrastructure assets (Gati Shakti).",
  },
  {
    title: "Current Account Deficit (CAD)",
    value: "0.7% of GDP",
    change: "Narrowed from 1.2%",
    status: "positive",
    target: "Sustainable threshold <2.5% of GDP",
    mainsRelevance: "Robust service exports (IT, GCCs) and remittances cushion merchandise trade deficit.",
  },
  {
    title: "Foreign Exchange Reserves",
    value: "$670+ Billion",
    change: "+$60B YoY Buffer",
    status: "positive",
    target: "Covers >11 months of imports",
    mainsRelevance: "High external stability shield against global currency volatility and crude oil shocks.",
  },
];

const FISCAL_TRAJECTORY = [
  { year: "FY21", deficit: 9.2, capex: 4.1 },
  { year: "FY22", deficit: 6.7, capex: 5.9 },
  { year: "FY23", deficit: 6.4, capex: 7.4 },
  { year: "FY24", deficit: 5.6, capex: 9.5 },
  { year: "FY25 (RE)", deficit: 4.9, capex: 11.1 },
  { year: "FY26 (Target)", deficit: 4.5, capex: 12.0 },
];

export default function EconomicSurveyVisualizer() {
  const [activeTab, setActiveTab] = useState<"fiscal" | "sectors" | "thematic">("fiscal");

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl backdrop-blur-xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-emerald-400">
              GS-3 ECONOMY LAB // UNION BUDGET & SURVEY
            </span>
          </div>
          <h2 className="mt-1 font-mono text-lg font-bold text-white">
            Macroeconomic Trends & Fiscal Intelligence Matrix
          </h2>
          <p className="text-xs text-[#8C8C8C]">
            Interactive data visualizer for GS-3 Economy: Fiscal Deficit trajectory, Capex multipliers, and External sector stability.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 font-mono text-xs">
          <button
            onClick={() => {
              setActiveTab("fiscal");
              sound.playHover();
            }}
            className={`rounded-xl px-3.5 py-1.5 font-bold transition ${
              activeTab === "fiscal"
                ? "bg-[#D8A63A] text-black shadow-lg"
                : "bg-white/5 text-[#8C8C8C] hover:text-white"
            }`}
          >
            📊 Fiscal Path
          </button>
          <button
            onClick={() => {
              setActiveTab("sectors");
              sound.playHover();
            }}
            className={`rounded-xl px-3.5 py-1.5 font-bold transition ${
              activeTab === "sectors"
                ? "bg-[#D8A63A] text-black shadow-lg"
                : "bg-white/5 text-[#8C8C8C] hover:text-white"
            }`}
          >
            🏗️ Capex Multipliers
          </button>
          <button
            onClick={() => {
              setActiveTab("thematic");
              sound.playHover();
            }}
            className={`rounded-xl px-3.5 py-1.5 font-bold transition ${
              activeTab === "thematic"
                ? "bg-[#D8A63A] text-black shadow-lg"
                : "bg-white/5 text-[#8C8C8C] hover:text-white"
            }`}
          >
            💡 Survey Themes
          </button>
        </div>
      </div>

      {/* 4 Macro Highlights Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MACRO_METRICS.map((m, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-4 transition hover:border-[#D8A63A]/40"
          >
            <div>
              <span className="font-mono text-[10px] font-bold text-[#8C8C8C] uppercase">
                {m.title}
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-black text-white">{m.value}</span>
                <span className="font-mono text-[10px] font-bold text-emerald-400">
                  {m.change}
                </span>
              </div>
              <p className="mt-2 font-mono text-[10px] text-[#F4C95D]">{m.target}</p>
            </div>
            <div className="mt-3 border-t border-white/5 pt-2 text-[11px] text-white/70">
              <strong className="text-white">Mains Point:</strong> {m.mainsRelevance}
            </div>
          </div>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="mt-6">
        {activeTab === "fiscal" && (
          <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F4C95D] mb-4">
              Fiscal Deficit (% of GDP) Consolidation Glide Path
            </h3>
            <div className="grid grid-cols-6 gap-3 items-end h-48 border-b border-white/10 pb-4">
              {FISCAL_TRAJECTORY.map((item, idx) => {
                const heightPercent = (item.deficit / 10) * 100;
                const isTarget = item.year.includes("Target");
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="font-mono text-[10px] font-bold text-white">
                      {item.deficit}%
                    </span>
                    <div
                      className={`w-full rounded-t-xl transition-all ${
                        isTarget
                          ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                          : "bg-gradient-to-t from-[#D8A63A] to-[#F4C95D]"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="font-mono text-[10px] text-[#8C8C8C]">{item.year}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 font-sans text-xs text-white/70">
              📌 <strong>Analysis:</strong> India has successfully lowered its post-pandemic fiscal deficit from 9.2% in FY21 to 4.9% in FY25, adhering to FRBM consolidation while simultaneously shifting expenditure composition towards quality capital creation.
            </p>
          </div>
        )}

        {activeTab === "sectors" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <span className="text-xl">🛣️</span>
              <h4 className="mt-2 font-mono text-sm font-bold text-white">
                Roads & Highways (₹2.78L Cr)
              </h4>
              <p className="mt-1 text-xs text-[#8C8C8C]">
                PM Gati Shakti Master Plan, Bharatmala Pariyojana, National Logistics Policy target to reduce logistics cost to &lt;9% of GDP.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <span className="text-xl">🚆</span>
              <h4 className="mt-2 font-mono text-sm font-bold text-white">
                Railways Capex (₹2.52L Cr)
              </h4>
              <p className="mt-1 text-xs text-[#8C8C8C]">
                Dedicated Freight Corridors (EDFC/WDFC), Kavach 4.0 safety system rollout, Vande Bharat expansion.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <span className="text-xl">⚡</span>
              <h4 className="mt-2 font-mono text-sm font-bold text-white">
                Green Energy & Hydrogen (₹19,744 Cr)
              </h4>
              <p className="mt-1 text-xs text-[#8C8C8C]">
                National Green Hydrogen Mission (5 MMT annual capacity by 2030), PM Surya Ghar Muft Bijli Yojana (1 Crore households solarized).
              </p>
            </div>
          </div>
        )}

        {activeTab === "thematic" && (
          <div className="space-y-3 font-sans text-xs">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <strong className="text-[#F4C95D] block mb-1 font-mono text-sm">
                1. Triad of Growth: Capex, Financial Soundness, Private Confidence
              </strong>
              <p className="text-white/80 leading-relaxed">
                The Economic Survey emphasizes that Indian corporate and banking sector balance sheets are the cleanest in a decade (Twin Balance Sheet Advantage), with Non-Performing Assets (NPAs) falling below 2.8%.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <strong className="text-[#F4C95D] block mb-1 font-mono text-sm">
                2. Employment & Skill Upgradation Architecture
              </strong>
              <p className="text-white/80 leading-relaxed">
                Focus on manufacturing-linked incentives (PLI Schemes across 14 sectors) and 5 schemes under the Prime Minister's package for 4.1 crore youth over 5 years.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
