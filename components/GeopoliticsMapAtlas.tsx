"use client";

import { useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface ChokePoint {
  name: string;
  location: string;
  connects: string;
  strategicSignificance: string;
  indiaRelevance: string;
}

interface ConnectivityCorridor {
  name: string;
  nodes: string;
  significance: string;
  challenges: string;
}

const CHOKE_POINTS: ChokePoint[] = [
  {
    name: "Strait of Malacca",
    location: "Between Malay Peninsula and Sumatra Island",
    connects: "Indian Ocean to South China Sea / Pacific Ocean",
    strategicSignificance: "Carries ~25% of global traded goods and 80% of China's oil imports (Malacca Dilemma).",
    indiaRelevance: "Andaman & Nicobar Command (ANC) sits directly at the western mouth of Malacca, giving India dominant maritime domain awareness.",
  },
  {
    name: "Bab-el-Mandeb Strait",
    location: "Between Horn of Africa (Djibouti/Eritrea) and Yemen",
    connects: "Red Sea to Gulf of Aden / Arabian Sea",
    strategicSignificance: "Gateway to Suez Canal. Vulnerable to Houthi drone/missile attacks and piracy.",
    indiaRelevance: "Indian Navy deployed warships under Operation Sankalp to secure merchant vessels carrying Indian cargo.",
  },
  {
    name: "Strait of Hormuz",
    location: "Between Oman/UAE and Iran",
    connects: "Persian Gulf to Gulf of Oman / Arabian Sea",
    strategicSignificance: "World's most critical oil transit chokepoint (carries ~21 million barrels/day or 21% of global petroleum consumption).",
    indiaRelevance: "Over 60% of India's crude oil and 70% of LNG imports pass through Hormuz.",
  },
  {
    name: "Suez Canal",
    location: "Egypt (Isthmus of Suez)",
    connects: "Mediterranean Sea to Red Sea",
    strategicSignificance: "Eliminates need to navigate around the Cape of Good Hope, saving ~7,000 km of sea journey.",
    indiaRelevance: "Primary maritime route for Indian exports to Europe and North America.",
  },
];

const CORRIDORS: ConnectivityCorridor[] = [
  {
    name: "India-Middle East-Europe Economic Corridor (IMEC)",
    nodes: "India (Mundra/JNPT) → UAE → Saudi Arabia → Jordan → Israel (Haifa) → Europe (Piraeus)",
    significance: "Multimodal rail-ship corridor designed to cut transit time by 40% and logistics cost by 30%. Counter-narrative to BRI.",
    challenges: "Regional geopolitical tensions in West Asia; rail track harmonization across borders.",
  },
  {
    name: "International North-South Transport Corridor (INSTC)",
    nodes: "India (Mumbai) → Iran (Bandar Abbas / Chabahar) → Azerbaijan (Baku) → Russia (Moscow/St. Petersburg)",
    significance: "7,200 km multimodal freight network bypassing Suez Canal, reducing transit time from 40 days to 20 days.",
    challenges: "Sanctions on Iran and Russia; banking settlement constraints.",
  },
  {
    name: "Chabahar Port (Shahid Beheshti Terminal)",
    nodes: "India → Iran (Chabahar) → Afghanistan (Zaranj-Delaram) → Central Asian Republics (CARs)",
    significance: "Provides India direct access to Afghanistan and Central Asia bypassing Pakistan's overland denial.",
    challenges: "10-year long-term operating contract signed by India in 2024; navigating US sanctions waivers.",
  },
];

export default function GeopoliticsMapAtlas() {
  const [activeTab, setActiveTab] = useState<"chokepoints" | "corridors">("chokepoints");
  const [selectedItem, setSelectedItem] = useState<ChokePoint | ConnectivityCorridor>(CHOKE_POINTS[0]);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl backdrop-blur-xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-blue-400">
              GS-2 INTERNATIONAL RELATIONS // GEOPOLITICAL ATLAS
            </span>
          </div>
          <h2 className="mt-1 font-mono text-lg font-bold text-white">
            Global Maritime Choke Points & Connectivity Corridors
          </h2>
          <p className="text-xs text-[#8C8C8C]">
            Strategic geographical assets, sea lanes of communication (SLOCs), and India's connectivity projects.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 font-mono text-xs">
          <button
            onClick={() => {
              setActiveTab("chokepoints");
              setSelectedItem(CHOKE_POINTS[0]);
              sound.playHover();
            }}
            className={`rounded-xl px-3.5 py-1.5 font-bold transition ${
              activeTab === "chokepoints"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white/5 text-[#8C8C8C] hover:text-white"
            }`}
          >
            ⚓ Maritime Chokepoints
          </button>
          <button
            onClick={() => {
              setActiveTab("corridors");
              setSelectedItem(CORRIDORS[0]);
              sound.playHover();
            }}
            className={`rounded-xl px-3.5 py-1.5 font-bold transition ${
              activeTab === "corridors"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white/5 text-[#8C8C8C] hover:text-white"
            }`}
          >
            🚆 Connectivity Corridors
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        {/* List Selector */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1 font-mono text-xs">
          {activeTab === "chokepoints"
            ? CHOKE_POINTS.map((cp) => {
                const isSelected = selectedItem.name === cp.name;
                return (
                  <button
                    key={cp.name}
                    onClick={() => {
                      setSelectedItem(cp);
                      sound.playHover();
                    }}
                    className={`w-full text-left rounded-2xl border p-4 transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-500/20 text-white shadow-lg"
                        : "border-white/10 bg-black/40 text-white/70 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="font-bold">{cp.name}</div>
                    <div className="text-[10px] text-[#8C8C8C] truncate mt-1">{cp.location}</div>
                  </button>
                );
              })
            : CORRIDORS.map((c) => {
                const isSelected = selectedItem.name === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedItem(c);
                      sound.playHover();
                    }}
                    className={`w-full text-left rounded-2xl border p-4 transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-500/20 text-white shadow-lg"
                        : "border-white/10 bg-black/40 text-white/70 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="font-bold">{c.name}</div>
                    <div className="text-[10px] text-[#8C8C8C] truncate mt-1">{c.nodes}</div>
                  </button>
                );
              })}
        </div>

        {/* Detail Inspection Card */}
        <div className="rounded-3xl border border-white/10 bg-black/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-mono text-base font-black text-white">
                {selectedItem.name}
              </h3>
              <span className="rounded-full bg-blue-500/20 px-3 py-0.5 font-mono text-[10px] font-bold text-blue-300">
                {activeTab === "chokepoints" ? "Strategic Chokepoint" : "Trade Corridor"}
              </span>
            </div>

            {"connects" in selectedItem ? (
              <div className="mt-4 space-y-3 font-sans text-xs">
                <div>
                  <strong className="text-blue-300 block font-mono">📍 Geography:</strong>
                  <p className="text-white/80">{selectedItem.location}</p>
                </div>
                <div>
                  <strong className="text-blue-300 block font-mono">🌊 Connects:</strong>
                  <p className="text-white/80">{selectedItem.connects}</p>
                </div>
                <div>
                  <strong className="text-[#F4C95D] block font-mono">🌐 Global Significance:</strong>
                  <p className="text-white/80">{selectedItem.strategicSignificance}</p>
                </div>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
                  <strong className="text-emerald-400 block font-mono mb-1">
                    🇮🇳 India's Strategic Imperative:
                  </strong>
                  <p className="text-white/90 leading-relaxed">{selectedItem.indiaRelevance}</p>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3 font-sans text-xs">
                <div>
                  <strong className="text-blue-300 block font-mono">🗺️ Key Nodes:</strong>
                  <p className="text-white/80">{selectedItem.nodes}</p>
                </div>
                <div>
                  <strong className="text-emerald-400 block font-mono">🎯 Strategic Value:</strong>
                  <p className="text-white/80">{selectedItem.significance}</p>
                </div>
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5">
                  <strong className="text-amber-300 block font-mono mb-1">⚠️ Bottlenecks & Challenges:</strong>
                  <p className="text-white/90 leading-relaxed">{selectedItem.challenges}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-white/5 pt-3 font-mono text-[10px] text-[#8C8C8C]">
            💡 Use these points for GS-2 International Relations & GS-1 World Geography answer value-addition.
          </div>
        </div>
      </div>
    </div>
  );
}
