"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { sound } from "@/lib/audio/sound-engine";
import AuthGuard from "@/components/auth/AuthGuard";
import AppUniversalHeader from "@/components/AppUniversalHeader";

// 3D & Spatial Simulators
import GeographyGlobe3D from "@/components/GeographyGlobe3D";
import HistoryTimeTunnel from "@/components/HistoryTimeTunnel";
import ArtCultureMuseum3D from "@/components/ArtCultureMuseum3D";
import ConstitutionalAtlas from "@/components/ConstitutionalAtlas";
import SpatialMapTrainer from "@/components/SpatialMapTrainer";
import SyllabusNeuralMindmap from "@/components/SyllabusNeuralMindmap";
import UniverseCommandCenter from "@/components/UniverseCommandCenter";
import MnemonicIndexVault from "@/components/MnemonicIndexVault";
import PredictiveForecastEngine from "@/components/PredictiveForecastEngine";
import PrelimsEliminationLab from "@/components/PrelimsEliminationLab";

export type LabCategory = "all" | "geography" | "history" | "polity" | "strategy";

interface VisualLabDef {
  id: string;
  name: string;
  shortName: string;
  category: LabCategory;
  icon: string;
  tagline: string;
  description: string;
  features: string[];
}

const VISUAL_LABS: VisualLabDef[] = [
  {
    id: "geo_globe",
    name: "Geography 3D Earth Globe",
    shortName: "3D Earth Globe",
    category: "geography",
    icon: "🌍",
    tagline: "3D Planetary GIS & Ocean Belts",
    description: "Interactive 3D Earth sphere rendering oceanic trenches, volcanic belts, global straits, fault lines, and tectonic boundaries.",
    features: ["Ring of Fire & Trenches", "Choke Points & Straits", "Atmospheric Wind Belts", "Mineral Belts"],
  },
  {
    id: "history_tunnel",
    name: "History 3D Time Tunnel",
    shortName: "3D Time Tunnel",
    category: "history",
    icon: "⏳",
    tagline: "Chronological Warp (IVC to 1947)",
    description: "Immersive chronological 3D time warp navigating through ancient empires, medieval sultanates, Mughal era, and the Freedom Struggle.",
    features: ["IVC & Vedic Era", "Mauryan & Gupta Age", "Mughal Architecture", "Freedom Struggle 1857-1947"],
  },
  {
    id: "art_culture_3d",
    name: "3D Art & Culture Museum",
    shortName: "Art & Culture 3D",
    category: "history",
    icon: "🏺",
    tagline: "Temple Styles & UNESCO Heritage",
    description: "Interactive 3D architectural models of Nagara, Dravida, and Vesara temple styles, rock-cut architecture, and Ajanta/Ellora sculptures.",
    features: ["Temple Architectural Styles", "Rock-Cut Caves & Stupas", "Classical Dance Forms", "UNESCO World Heritage"],
  },
  {
    id: "polity_3d",
    name: "Constitutional & Legal 3D Atlas",
    shortName: "Constitutional Atlas",
    category: "polity",
    icon: "📜",
    tagline: "Articles 1-395 & Landmark Judgments",
    description: "Comprehensive 3D visual explorer for the Indian Constitution: all 395 Articles, 12 Schedules, Landmark Supreme Court cases, and Amendments.",
    features: ["Articles 1-395 Matrix", "Schedules & Writs", "Landmark SC Judgments", "Constitutional Bodies"],
  },
  {
    id: "spatial_map",
    name: "Spatial GIS Map Trainer",
    shortName: "GIS Spatial Map",
    category: "geography",
    icon: "🗺️",
    tagline: "National Parks, Rivers & Passes",
    description: "High-precision cartographic GIS trainer for Indian National Parks, Biosphere Reserves, Ramsar Wetlands, Himalayan Passes, and River Tributaries.",
    features: ["106+ National Parks", "Ramsar Wetland Sites", "Himalayan Passes & Peaks", "River Basin Tributaries"],
  },
  {
    id: "mindmap",
    name: "Neural Knowledge Mindmap",
    shortName: "Neural Mindmap",
    category: "strategy",
    icon: "🧠",
    tagline: "GS 1-4 Interconnected Constellation",
    description: "Dynamic graph node network illuminating hidden overlaps between Polity, Economy, Environment, History, and Ethics micro-topics.",
    features: ["GS 1-4 Cross-Links", "Inter-Subject Synapses", "High-Yield Node Weights", "Topic Drilldown"],
  },
  {
    id: "universe_core",
    name: "The Possibility Core",
    shortName: "Possibility Core",
    category: "strategy",
    icon: "🌌",
    tagline: "Living Kinetic System Orbit",
    description: "Real-time 60fps kinetic particle universe linking all 10 preparation sectors into a central orbital telemetry HUD.",
    features: ["Kinetic Orbital Engine", "Sector Telemetry", "Real-time Momentum", "Soundscape Integration"],
  },
  {
    id: "mnemonic_vault",
    name: "Mnemonic & Index Vault",
    shortName: "Mnemonic Vault",
    category: "strategy",
    icon: "🗃️",
    tagline: "Global Groupings & Memory Pegs",
    description: "Curated active recall mnemonics for international groupings (ASEAN, G20, BIMSTEC, SCO), Indian river orders, and minerals.",
    features: ["ASEAN & G20 Mnemonics", "North-to-South River Pegs", "Ramsar Sites Shortcuts", "Constitutional Article Tricks"],
  },
  {
    id: "predictive_forecast",
    name: "PYQ Trend & Yield Forecaster",
    shortName: "Yield Forecaster",
    category: "strategy",
    icon: "🔮",
    tagline: "30-Year Trend Probability Radar",
    description: "Statistical forecast engine analyzing 30 years of UPSC Prelims questions to pinpoint high-probability upcoming themes.",
    features: ["30-Year Trend Analytics", "Probability Heatmaps", "Subject Weight Shifts", "Expected Theme Radar"],
  },
  {
    id: "elimination_lab",
    name: "Prelims Elimination & Trap Lab",
    shortName: "Elimination Lab",
    category: "strategy",
    icon: "🎯",
    tagline: "Heuristic Heuristics & Trap Diagnosis",
    description: "Master the subtle heuristics of UPSC Prelims: extreme wording traps, negative-evidence deduction, and chronological elimination.",
    features: ["Extreme Statement Trap", "Double-Negative Heuristics", "Association Flips", "Confidence Matrix"],
  },
];

function ThreeDZoneContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const labParam = searchParams.get("lab");

  const [activeLabId, setActiveLabId] = useState<string>(() => {
    if (labParam && VISUAL_LABS.some((l) => l.id === labParam)) {
      return labParam;
    }
    return "geo_globe";
  });

  const [selectedCategory, setSelectedCategory] = useState<LabCategory>("all");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (labParam && VISUAL_LABS.some((l) => l.id === labParam)) {
      setActiveLabId(labParam);
    }
  }, [labParam]);

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const activeLab = VISUAL_LABS.find((l) => l.id === activeLabId) || VISUAL_LABS[0];

  const filteredLabs = VISUAL_LABS.filter((l) => {
    if (selectedCategory === "all") return true;
    return l.category === selectedCategory;
  });

  const handleSelectLab = (id: string) => {
    sound.playSelect();
    setActiveLabId(id);
  };

  const handleToggleMute = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black flex flex-col">
      {/* UNIVERSAL LUXURY HUD HEADER */}
      <AppUniversalHeader moduleName="3D Simulation Zone" moduleBadge="REALITY LABS" />

      {/* SUB-HEADER / CATEGORY TABS */}
      <div className="border-b border-white/10 bg-[#080511]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
          <span className="font-mono text-[10px] font-black uppercase text-[#F4C95D] mr-2 shrink-0">
            LAB DOMAIN:
          </span>

          {[
            { id: "all", label: "All 10 Simulators" },
            { id: "geography", label: "🌍 Geography & GIS" },
            { id: "history", label: "⏳ History & Heritage" },
            { id: "polity", label: "📜 Constitution & Law" },
            { id: "strategy", label: "🧠 Strategy & Mindmaps" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playSelect();
                setSelectedCategory(cat.id as LabCategory);
              }}
              className={`rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-[#D8A63A] text-black shadow-md shadow-[#D8A63A]/20"
                  : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN 3D WORKSPACE */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 space-y-6">
        {/* LAB SELECTOR HORIZONTAL SHELF */}
        <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
          {filteredLabs.map((lab) => {
            const isSelected = lab.id === activeLabId;
            return (
              <button
                key={lab.id}
                onClick={() => handleSelectLab(lab.id)}
                className={`group flex flex-col justify-between rounded-2xl border p-3 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-[#D8A63A] bg-[#1a1405] shadow-[0_0_20px_rgba(216,166,58,0.25)] scale-[1.02]"
                    : "border-white/10 bg-[#0d0d0d] hover:border-white/20 hover:bg-[#141414]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl group-hover:scale-110 transition">{lab.icon}</span>
                    {isSelected && (
                      <span className="flex h-2 w-2 rounded-full bg-[#F4C95D] shadow-[0_0_8px_#F4C95D] animate-ping" />
                    )}
                  </div>
                  <h3 className={`mt-2 font-mono text-xs font-bold truncate ${
                    isSelected ? "text-[#F4C95D]" : "text-white group-hover:text-white"
                  }`}>
                    {lab.shortName}
                  </h3>
                  <p className="mt-0.5 text-[10px] text-[#8C8C8C] line-clamp-1">{lab.tagline}</p>
                </div>
                <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-1.5 font-mono text-[9px]">
                  <span className="text-white/40 uppercase">{lab.category}</span>
                  <span className={isSelected ? "text-[#F4C95D] font-bold" : "text-white/30"}>
                    {isSelected ? "ACTIVE" : "LAUNCH →"}
                  </span>
                </div>
              </button>
            );
          })}
        </section>

        {/* ACTIVE LAB INTRO CARD */}
        <section className="overflow-hidden rounded-3xl border border-[#D8A63A]/30 bg-gradient-to-r from-[#171408] via-[#1c1608] to-[#0d0d0d] p-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#D8A63A]/20 text-base">
                  {activeLab.icon}
                </span>
                <h2 className="font-mono text-base sm:text-lg font-black text-white">
                  {activeLab.name}
                </h2>
                <span className="rounded-full border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#F4C95D]">
                  {activeLab.tagline}
                </span>
              </div>
              <p className="mt-2 text-xs text-white/70 max-w-3xl">
                {activeLab.description}
              </p>
            </div>

            {/* KEY FEATURES PILLS */}
            <div className="flex flex-wrap gap-1.5 shrink-0 max-w-md">
              {activeLab.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-white/80"
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 3D SIMULATOR VIEWPORT FRAME */}
        <section className="relative min-h-[680px] overflow-hidden rounded-3xl border border-[#D8A63A]/40 bg-[#080511] shadow-[0_0_40px_rgba(0,0,0,0.9)]">
          {activeLabId === "geo_globe" && <GeographyGlobe3D />}
          {activeLabId === "history_tunnel" && <HistoryTimeTunnel />}
          {activeLabId === "art_culture_3d" && <ArtCultureMuseum3D />}
          {activeLabId === "polity_3d" && <ConstitutionalAtlas />}
          {activeLabId === "spatial_map" && <SpatialMapTrainer />}
          {activeLabId === "mindmap" && <SyllabusNeuralMindmap />}
          {activeLabId === "universe_core" && <UniverseCommandCenter />}
          {activeLabId === "mnemonic_vault" && <MnemonicIndexVault />}
          {activeLabId === "predictive_forecast" && <PredictiveForecastEngine />}
          {activeLabId === "elimination_lab" && <PrelimsEliminationLab />}
        </section>
      </main>

      {/* BOTTOM FOOTER */}
      <footer className="border-t border-white/10 bg-[#050505] px-4 py-4 sm:px-6 text-center text-xs font-mono text-[#8C8C8C]">
        <span>WHYNOTUPSC 3D SIMULATION REALITY LABS · FULL KINETIC & SPATIAL ENGINE</span>
      </footer>
    </div>
  );
}

export default function ThreeDZonePage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050505] text-[#F4C95D] font-mono text-sm">
          INITIALIZING 3D REALITY ENGINE...
        </div>
      }>
        <ThreeDZoneContent />
      </Suspense>
    </AuthGuard>
  );
}
