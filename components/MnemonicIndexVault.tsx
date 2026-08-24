"use client";

import React, { useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

type VaultTab = "indices" | "spatial_mnemonics";

interface GlobalIndex {
  id: string;
  name: string;
  publishingBody: string;
  frequency: string;
  coreDimensions: {
    dimension: string;
    indicators: string[];
  }[];
  indiaRankAndScore: string;
  upscRelevanceTakeaway: string;
}

interface SpatialMnemonic {
  id: string;
  waterBodyOrRegion: string;
  mnemonicWord: string;
  mnemonicExpansion: { letter: string; countryOrFeature: string; flag: string }[];
  geopoliticalSignificance: string;
  pyqHistory: string;
}

const GLOBAL_INDICES: GlobalIndex[] = [
  {
    id: "mpi-niti",
    name: "National Multidimensional Poverty Index (National MPI)",
    publishingBody: "NITI Aayog (in partnership with UNDP & OPHI)",
    frequency: "Annual / Biennial based on NFHS Data",
    coreDimensions: [
      {
        dimension: "Health (1/3rd weight)",
        indicators: ["Nutrition (BMI)", "Child & Adolescent Mortality", "Maternal Health (Antenatal care)"]
      },
      {
        dimension: "Education (1/3rd weight)",
        indicators: ["Years of Schooling (at least 6 years)", "School Attendance"]
      },
      {
        dimension: "Standard of Living (1/3rd weight)",
        indicators: [
          "Cooking Fuel (Clean fuel)",
          "Sanitation (Improved toilet)",
          "Drinking Water (Safe source within 30m)",
          "Electricity",
          "Housing (Pucca roof/wall)",
          "Assets",
          "Bank Accounts (Jan Dhan Inclusion)"
        ]
      }
    ],
    indiaRankAndScore: "Over 13.5 crore (135 million) Indians exited multidimensional poverty between 2015-16 and 2019-21 (NFHS-4 to NFHS-5). Poverty headcount fell from 24.85% to 14.96%.",
    upscRelevanceTakeaway: "UPSC Prelims 2021 & 2012: India added 'Maternal Health' and 'Bank Accounts' to the Alkire-Foster global MPI methodology."
  },
  {
    id: "lpi-wb",
    name: "Logistics Performance Index (LPI)",
    publishingBody: "World Bank",
    frequency: "Biennial",
    coreDimensions: [
      {
        dimension: "Customs & Clearance",
        indicators: ["Efficiency of border management and customs clearance speed"]
      },
      {
        dimension: "Infrastructure Quality",
        indicators: ["Quality of trade and transport infrastructure (Ports, Expressways, DFCs)"]
      },
      {
        dimension: "International Shipments & Tracking",
        indicators: ["Ease of arranging competitively priced shipments", "Tracking & tracing consignments", "Timeliness"]
      }
    ],
    indiaRankAndScore: "India ranked 38th out of 139 countries in LPI 2023 (jumped 6 places from 44th in 2018 due to PM Gati Shakti & National Logistics Policy).",
    upscRelevanceTakeaway: "UPSC Prelims 2017 & Mains GS-3: Measures multi-modal transport efficiency under PM Gati Shakti."
  },
  {
    id: "gii-wipo",
    name: "Global Innovation Index (GII)",
    publishingBody: "World Intellectual Property Organization (WIPO)",
    frequency: "Annual",
    coreDimensions: [
      {
        dimension: "Innovation Inputs (5 Pillars)",
        indicators: ["Institutions", "Human Capital & Research", "Infrastructure", "Market Sophistication", "Business Sophistication"]
      },
      {
        dimension: "Innovation Outputs (2 Pillars)",
        indicators: ["Knowledge & Technology Outputs (Patents, Scientific papers)", "Creative Outputs (Trademarks, ICT services exports)"]
      }
    ],
    indiaRankAndScore: "India ranked 39th out of 133 economies in GII 2024 (up from 81st in 2015). Top ranked economy in Central & Southern Asia.",
    upscRelevanceTakeaway: "UPSC Prelims 2016 & Mains GS-3: Assesses India's R&D spend (0.65% of GDP) and patent grant velocity."
  },
  {
    id: "hdi-undp",
    name: "Human Development Index (HDI)",
    publishingBody: "United Nations Development Programme (UNDP)",
    frequency: "Annual",
    coreDimensions: [
      {
        dimension: "Long and Healthy Life",
        indicators: ["Life Expectancy at Birth (Normalized minimum 20 years, maximum 85 years)"]
      },
      {
        dimension: "Knowledge / Education",
        indicators: ["Expected Years of Schooling for children", "Mean Years of Schooling for adults aged 25+"]
      },
      {
        dimension: "A Decent Standard of Living",
        indicators: ["Gross National Income (GNI) per capita (PPP $) on a logarithmic scale"]
      }
    ],
    indiaRankAndScore: "India ranked 134th out of 193 countries (HDI value 0.644, categorized under 'Medium Human Development').",
    upscRelevanceTakeaway: "Geometric Mean methodology of the 3 dimensions: $HDI = (I_{Health} \\times I_{Education} \\times I_{Income})^{1/3}$."
  }
];

const SPATIAL_MNEMONICS: SpatialMnemonic[] = [
  {
    id: "sp-baltic",
    waterBodyOrRegion: "Baltic Sea Littoral Countries",
    mnemonicWord: "R-U-D-E  G-E-R-M-A-N-Y",
    mnemonicExpansion: [
      { letter: "R", countryOrFeature: "Russia (Kaliningrad & St. Petersburg)", flag: "🇷🇺" },
      { letter: "U", countryOrFeature: "Ukraine (Anchor memory: Not touching Baltic!)", flag: "⚠️" },
      { letter: "D", countryOrFeature: "Denmark", flag: "🇩🇰" },
      { letter: "E", countryOrFeature: "Estonia", flag: "🇪🇪" },
      { letter: "G", countryOrFeature: "Germany", flag: "🇩🇪" },
      { letter: "E", countryOrFeature: "Estonia", flag: "🇪🇪" },
      { letter: "R", countryOrFeature: "Russia", flag: "🇷🇺" },
      { letter: "M", countryOrFeature: "Montenegro (Trap memory: Baltic 9 = Ru, De, Es, Fi, Ge, La, Li, Pl, Sw)", flag: "🇸🇪" },
      { letter: "A", countryOrFeature: "All-9: Sweden, Finland, Poland, Lithuania, Latvia, Estonia, Germany, Denmark, Russia", flag: "🇪🇺" },
      { letter: "N", countryOrFeature: "Norway (Does NOT touch Baltic Sea - touches North Sea!)", flag: "⚠️" },
      { letter: "Y", countryOrFeature: "Yes: 9 Sovereign Bordering Littorals", flag: "🌊" }
    ],
    geopoliticalSignificance: "Nord Stream 1 & 2 gas pipelines, NATO Baltic Air Policing, Kaliningrad Suwalki Gap corridor.",
    pyqHistory: "UPSC Prelims 2014, 2018, 2023: Testing which country does not border the Baltic Sea (Norway & Ukraine are favourite UPSC traps)."
  },
  {
    id: "sp-black",
    waterBodyOrRegion: "Black Sea Bordering Countries",
    mnemonicWord: "T - E - A   R - U - B - G",
    mnemonicExpansion: [
      { letter: "T", countryOrFeature: "Turkey (Controls Bosphorus & Dardanelles Straits under Montreux 1936)", flag: "🇹🇷" },
      { letter: "E", countryOrFeature: "Europe Anchor", flag: "🇪🇺" },
      { letter: "A", countryOrFeature: "Azov Sea link via Kerch Strait", flag: "🌊" },
      { letter: "R", countryOrFeature: "Russia", flag: "🇷🇺" },
      { letter: "U", countryOrFeature: "Ukraine", flag: "🇺🇦" },
      { letter: "B", countryOrFeature: "Bulgaria", flag: "🇧🇬" },
      { letter: "G", countryOrFeature: "Georgia (and Romania)", flag: "🇬🇪" }
    ],
    geopoliticalSignificance: "Black Sea Grain Initiative, Snake Island, Sevastopol naval base, Montreux Convention 1936.",
    pyqHistory: "UPSC Prelims 2019, 2023: Direct question on countries bordering the Black Sea."
  },
  {
    id: "sp-caspian",
    waterBodyOrRegion: "Caspian Sea Littorals (Largest Enclosed Inland Body)",
    mnemonicWord: "K - A - Z - T - A - R   (TARIK)",
    mnemonicExpansion: [
      { letter: "T", countryOrFeature: "Turkmenistan", flag: "🇹🇲" },
      { letter: "A", countryOrFeature: "Azerbaijan (Baku port)", flag: "🇦🇿" },
      { letter: "R", countryOrFeature: "Russia (Volga river delta)", flag: "🇷🇺" },
      { letter: "I", countryOrFeature: "Iran", flag: "🇮🇷" },
      { letter: "K", countryOrFeature: "Kazakhstan", flag: "🇰🇿" }
    ],
    geopoliticalSignificance: "Caviar sturgeon fishing, massive Kashagan and Tengiz oilfields, INSTC maritime segment.",
    pyqHistory: "UPSC Prelims 2014 & 2019: Identify the countries that border the Caspian Sea (Uzbekistan is the classic trap)."
  },
  {
    id: "sp-red",
    waterBodyOrRegion: "Red Sea Bordering Nations",
    mnemonicWord: "D - E - S - S - E - Y   (DESSEY)",
    mnemonicExpansion: [
      { letter: "D", countryOrFeature: "Djibouti (Bab-el-Mandeb Strait)", flag: "🇩🇯" },
      { letter: "E", countryOrFeature: "Egypt (Suez Canal / Sinai Peninsula)", flag: "🇪🇬" },
      { letter: "S", countryOrFeature: "Saudi Arabia (NEOM project)", flag: "🇸🇦" },
      { letter: "S", countryOrFeature: "Sudan (Port Sudan)", flag: "🇸🇩" },
      { letter: "E", countryOrFeature: "Eritrea", flag: "🇪🇷" },
      { letter: "Y", countryOrFeature: "Yemen (Houthi coastal control)", flag: "🇾🇪" }
    ],
    geopoliticalSignificance: "Critical global choke-point linking Mediterranean Sea via Suez to Indian Ocean via Bab-el-Mandeb.",
    pyqHistory: "UPSC Prelims 2007 & 2024: Direct question on Red Sea littoral nations."
  },
  {
    id: "sp-horn",
    waterBodyOrRegion: "Horn of Africa Countries",
    mnemonicWord: "S - E - E - D   (SEED)",
    mnemonicExpansion: [
      { letter: "S", countryOrFeature: "Somalia (Puntland, Mogadishu)", flag: "🇸🇴" },
      { letter: "E", countryOrFeature: "Ethiopia (Landlocked, Grand Ethiopian Renaissance Dam)", flag: "🇪🇹" },
      { letter: "E", countryOrFeature: "Eritrea (Asmara, Red Sea coast)", flag: "🇪🇷" },
      { letter: "D", countryOrFeature: "Djibouti (Strategic military bases of US, China, France, Japan)", flag: "🇩🇯" }
    ],
    geopoliticalSignificance: "Piracy control in Gulf of Aden, Tigray conflict, Somaliland port agreements.",
    pyqHistory: "UPSC Prelims 2022 & 2024: Questions on landlocked status in Africa and Horn of Africa conflicts."
  }
];

export default function MnemonicIndexVault() {
  const [activeTab, setActiveTab] = useState<VaultTab>("indices");
  const [selectedIndex, setSelectedIndex] = useState<GlobalIndex>(GLOBAL_INDICES[0]);
  const [selectedMnemonic, setSelectedMnemonic] = useState<SpatialMnemonic>(SPATIAL_MNEMONICS[0]);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080511] p-5 shadow-2xl backdrop-blur-2xl">
      {/* HEADER & TAB SWITCHER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-sm">
              🗃️
            </span>
            <h2 className="font-mono text-base font-black tracking-wide text-white sm:text-lg">
              The UPSC Mnemonic & Index Vault
            </h2>
          </div>
          <p className="text-xs text-white/50">
            Instant recall matrix for global indices, report indicators, and strategic spatial mnemonics
          </p>
        </div>

        <div className="flex rounded-2xl border border-white/10 bg-white/[0.03] p-1">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("indices");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 font-mono text-xs font-bold transition ${
              activeTab === "indices"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>📊</span>
            <span>Global Reports & Indices Master</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("spatial_mnemonics");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 font-mono text-xs font-bold transition ${
              activeTab === "spatial_mnemonics"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-950/50"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>🗺️</span>
            <span>Spatial Sea & Chokepoint Mnemonics</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: GLOBAL INDICES MASTER */}
      {activeTab === "indices" && (
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-2">
            {GLOBAL_INDICES.map((idx) => (
              <button
                key={idx.id}
                onClick={() => {
                  sound.playHover();
                  setSelectedIndex(idx);
                }}
                className={`w-full rounded-2xl border p-3.5 text-left transition ${
                  selectedIndex.id === idx.id
                    ? "border-emerald-500 bg-emerald-500/20 text-white shadow-lg shadow-emerald-950/40"
                    : "border-white/5 bg-white/[0.02] text-white/70 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {idx.publishingBody}
                </span>
                <span className="text-xs font-bold text-white line-clamp-1">{idx.name}</span>
              </button>
            ))}
          </div>

          {/* RIGHT: INDEX ANATOMY & INDICATOR BREAKDOWN */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
              <div>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  Published by: {selectedIndex.publishingBody}
                </span>
                <h3 className="mt-1 text-base font-black text-white">{selectedIndex.name}</h3>
                <p className="text-xs text-white/60">Frequency: {selectedIndex.frequency}</p>
              </div>
            </div>

            {/* DIMENSIONS GRID */}
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              {selectedIndex.coreDimensions.map((dim, i) => (
                <div key={i} className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1.5">
                  <span className="font-bold text-emerald-300">{dim.dimension}</span>
                  <ul className="space-y-1 text-white/80">
                    {dim.indicators.map((ind, j) => (
                      <li key={j} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* INDIA'S SCORE & PERFORMANCE */}
            <div className="rounded-xl border border-white/5 bg-black/30 p-3.5 text-xs text-white/90">
              <span className="font-bold text-amber-300">🇮🇳 India's Performance & Trends: </span>
              {selectedIndex.indiaRankAndScore}
            </div>

            {/* UPSC PYQ EXAMINER HOOK */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 text-xs text-emerald-200">
              <span className="font-bold text-emerald-300">🎯 UPSC Examiner Traps: </span>
              {selectedIndex.upscRelevanceTakeaway}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SPATIAL SEA & CHOKEPOINT MNEMONICS */}
      {activeTab === "spatial_mnemonics" && (
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-2">
            {SPATIAL_MNEMONICS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  sound.playHover();
                  setSelectedMnemonic(m);
                }}
                className={`w-full rounded-2xl border p-3.5 text-left transition ${
                  selectedMnemonic.id === m.id
                    ? "border-cyan-500 bg-cyan-500/20 text-white shadow-lg shadow-cyan-950/40"
                    : "border-white/5 bg-white/[0.02] text-white/70 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span className="block text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {m.mnemonicWord}
                </span>
                <span className="text-xs font-bold text-white line-clamp-1">{m.waterBodyOrRegion}</span>
              </button>
            ))}
          </div>

          {/* RIGHT: MNEMONIC DECONSTRUCTION */}
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/10 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
              <div>
                <span className="font-mono text-sm font-black text-cyan-400">
                  Mnemonic: {selectedMnemonic.mnemonicWord}
                </span>
                <h3 className="mt-0.5 text-base font-black text-white">{selectedMnemonic.waterBodyOrRegion}</h3>
              </div>
            </div>

            {/* EXPANSION TILES */}
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              {selectedMnemonic.mnemonicExpansion.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-black/40 p-2.5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 font-mono font-black text-cyan-300">
                    {item.letter}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-white">
                      {item.flag} {item.countryOrFeature}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-white/5 bg-black/30 p-3.5">
                <span className="font-bold text-cyan-300">🌐 Geopolitical Strategic Chokepoint:</span>
                <p className="mt-1 text-white/80">{selectedMnemonic.geopoliticalSignificance}</p>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3.5">
                <span className="font-bold text-cyan-400">📝 UPSC Past Year Paper History:</span>
                <p className="mt-1 text-white/90">{selectedMnemonic.pyqHistory}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
