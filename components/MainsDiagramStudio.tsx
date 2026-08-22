"use client";

import { useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface MainsDiagramStudioProps {
  onInsertDiagram: (diagramMarkdown: string) => void;
  onClose: () => void;
}

export default function MainsDiagramStudio({
  onInsertDiagram,
  onClose,
}: MainsDiagramStudioProps) {
  const [activeType, setActiveType] = useState<
    "hub_spoke" | "matrix_2x2" | "flowchart" | "india_map" | "pestle"
  >("hub_spoke");

  // Hub & Spoke State
  const [hubCenter, setHubCenter] = useState("CLIMATE RESILIENCE");
  const [spokes, setSpokes] = useState([
    "Afforestation & Mangroves",
    "Renewable Energy (ISA)",
    "Climate Finance & Tech Transfer",
    "Disaster Early Warning Systems",
    "Sustainable Agriculture (PM-PRANAM)",
  ]);
  const [newSpoke, setNewSpoke] = useState("");

  // 2x2 Matrix State
  const [matrixTitle, setMatrixTitle] = useState("ETHICAL DECISION MATRIX");
  const [quadrantLabels, setQuadrantLabels] = useState({
    topAxis: "HIGH PUBLIC GOOD",
    bottomAxis: "LOW PUBLIC GOOD",
    leftAxis: "LOW STATUTORY POWER",
    rightAxis: "HIGH STATUTORY POWER",
    q1: "Administrative Priority (Mandatory Action)",
    q2: "Community Mobilisation & Advocacy",
    q3: "Strict Regulatory Enforcement",
    q4: "Low Feasibility / Avoid Discretion",
  });

  // Flowchart State
  const [flowSteps, setFlowSteps] = useState([
    "Problem Identification & Baseline Survey",
    "Multi-Stakeholder Consultation (NITI Aayog)",
    "Statutory & Budgetary Allocation",
    "District-Level Execution & DBT Transfer",
    "Social Audit & Third-Party Evaluation",
  ]);
  const [newStep, setNewStep] = useState("");

  // India Map Thematic Regions
  const [selectedGeoTheme, setSelectedGeoTheme] = useState<
    "corridors" | "ports" | "renewable" | "minerals"
  >("corridors");

  const handleAddSpoke = () => {
    if (!newSpoke.trim()) return;
    setSpokes([...spokes, newSpoke.trim()]);
    setNewSpoke("");
    sound.playHover();
  };

  const handleRemoveSpoke = (index: number) => {
    setSpokes(spokes.filter((_, i) => i !== index));
    sound.playHover();
  };

  const handleAddFlowStep = () => {
    if (!newStep.trim()) return;
    setFlowSteps([...flowSteps, newStep.trim()]);
    setNewStep("");
    sound.playHover();
  };

  const handleRemoveFlowStep = (index: number) => {
    setFlowSteps(flowSteps.filter((_, i) => i !== index));
    sound.playHover();
  };

  const generateDiagramMarkdown = (): string => {
    if (activeType === "hub_spoke") {
      const topHalf = spokes.slice(0, Math.ceil(spokes.length / 2));
      const bottomHalf = spokes.slice(Math.ceil(spokes.length / 2));

      return `
\`\`\`
          ┌──────────────────────────────────────────────┐
          │        [DIAGRAM] HUB & SPOKE FRAMEWORK       │
          └──────────────────────────────────────────────┘
${topHalf.map((s) => `               ▲ ── [ ${s} ]`).join("\n")}
               │
      ╔═════════════════════════════════════════════════╗
      ║             ${hubCenter.padEnd(35)} ║
      ╚═════════════════════════════════════════════════╝
               │
${bottomHalf.map((s) => `               ▼ ── [ ${s} ]`).join("\n")}
\`\`\`
`;
    }

    if (activeType === "matrix_2x2") {
      return `
\`\`\`
          ┌──────────────────────────────────────────────┐
          │        [DIAGRAM] 2x2 STRATEGIC MATRIX        │
          │             ${matrixTitle.padEnd(32)} │
          └──────────────────────────────────────────────┘

                     ▲ ${quadrantLabels.topAxis}
                     │
     ┌───────────────┼───────────────┐
     │ QUADRANT II   │ QUADRANT I    │
     │ ${quadrantLabels.q2.padEnd(13)} │ ${quadrantLabels.q1.padEnd(13)} │
  ───┼───────────────┼───────────────┼───► ${quadrantLabels.rightAxis}
     │ QUADRANT IV   │ QUADRANT III  │
     │ ${quadrantLabels.q4.padEnd(13)} │ ${quadrantLabels.q3.padEnd(13)} │
     └───────────────┼───────────────┘
                     │
                     ▼ ${quadrantLabels.bottomAxis}
\`\`\`
`;
    }

    if (activeType === "flowchart") {
      return `
\`\`\`
          ┌──────────────────────────────────────────────┐
          │        [DIAGRAM] POLICY IMPLEMENTATION FLOW  │
          └──────────────────────────────────────────────┘

${flowSteps
  .map(
    (step, i) =>
      `  [Step ${i + 1}] ──► ╔════════════════════════════════════════════╗\n               ║ ${step.padEnd(42)} ║\n               ╚════════════════════════════════════════════╝`
  )
  .join("\n                     │\n                     ▼\n")}
\`\`\`
`;
    }

    if (activeType === "india_map") {
      let themeTitle = "NATIONAL FREIGHT CORRIDORS (EDFC & WDFC)";
      let themeDetails = `
   [NW]: Amritsar - Delhi Node (Agro-Industrial Hub)
   [W]:  JNPT - Mumbai (Western Gateway)
   [SW]: Chennai - Bengaluru Industrial Corridor (CBIC)
   [E]:  Dankuni / Kolkata (Eastern Mineral Gateway)`;

      if (selectedGeoTheme === "ports") {
        themeTitle = "SAGARMALA: STRATEGIC MARITIME HUBS";
        themeDetails = `
   [West Coast]: Kandla -> JNPT -> Mangalore -> Cochin
   [East Coast]: Tuticorin -> Chennai -> Vizag -> Paradip -> Haldia`;
      } else if (selectedGeoTheme === "renewable") {
        themeTitle = "RENEWABLE ENERGY MEGA PARKS";
        themeDetails = `
   [Solar]: Bhadla (Rajasthan), Pavagada (Karnataka), Kurnool (AP)
   [Wind]:  Muppandal (Tamil Nadu), Jaisalmer (Rajasthan)`;
      } else if (selectedGeoTheme === "minerals") {
        themeTitle = "MINERAL BELTS & INDUSTRIAL CLUSTERS";
        themeDetails = `
   [Chota Nagpur]: Iron, Coal, Mica (Jharkhand/Odisha/WB)
   [Southern]:     Bauxite & Iron Ore (Bellary/Goa)`;
      }

      return `
\`\`\`
          ┌──────────────────────────────────────────────┐
          │        [GEOGRAPHIC SCHEMATIC: INDIA]         │
          │        ${themeTitle.padEnd(37)} │
          └──────────────────────────────────────────────┘
                       /\\
                      /  \\  (Northern Frontier)
                     / /\\ \\
            ________/ /  \\ \\________
           (  WEST    INDIA    EAST )
            \\                      /
             \\   [CENTRAL DECCAN] /
              \\                  /
               \\   SOUTH INDIA  /
                \\              /
                 \\     \\/     /
                  \\          /
                   \\________/  (Indian Ocean)

${themeDetails}
\`\`\`
`;
    }

    // PESTLE
    return `
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                 PESTLE 360° DIMENSIONAL MATRIX              │
├──────────────────────────────┬──────────────────────────────┤
│ 🏛️ POLITICAL / GOVERNANCE     │ 💰 ECONOMIC & FISCAL         │
│ • Constitutional mandates    │ • Fiscal deficit & Capex     │
│ • Inter-state coordination   │ • Inclusive growth & MSMEs   │
├──────────────────────────────┼──────────────────────────────┤
│ 👥 SOCIAL & DEMOGRAPHIC      │ 🔬 TECHNOLOGICAL & DIGITAL   │
│ • Human development (HDI)    │ • Digital Public Infra (DPI) │
│ • Vulnerable groups (SC/ST)  │ • AI & Cybersecurity         │
├──────────────────────────────┼──────────────────────────────┤
│ ⚖️ LEGAL & REGULATORY        │ 🌿 ENVIRONMENTAL & ECOLOGY   │
│ • Statutory safeguards       │ • Climate adaptation / SDGs  │
│ • Judicial precedents        │ • Biodiversity conservation  │
└──────────────────────────────┴──────────────────────────────┘
\`\`\`
`;
  };

  const handleInsert = () => {
    sound.playWarp();
    const md = generateDiagramMarkdown();
    onInsertDiagram(md);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-3xl border border-[#D8A63A]/40 bg-[#0d0d0d] shadow-[0_0_50px_rgba(216,166,58,0.25)] overflow-hidden">
        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#141414]">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D8A63A]/10 font-mono text-sm text-[#F4C95D] border border-[#D8A63A]/30">
              📊
            </span>
            <div>
              <h2 className="font-mono text-sm font-black tracking-widest text-[#F5F5F5] uppercase">
                MAINS DIAGRAM & MATRIX STUDIO
              </h2>
              <p className="text-[11px] text-[#8C8C8C]">
                Assemble UPSC-standard visual stencils to boost presentation and examiner retention
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-3 py-1.5 font-mono text-xs text-[#8C8C8C] hover:border-red-500/50 hover:text-red-400 transition"
          >
            ESC / CLOSE
          </button>
        </header>

        {/* TOOLBAR TABS */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 bg-[#080808] px-6 py-3 text-xs font-mono">
          {[
            { id: "hub_spoke", label: "Hub & Spoke", icon: "☸️" },
            { id: "matrix_2x2", label: "2x2 Matrix", icon: "📐" },
            { id: "flowchart", label: "Policy Flow", icon: "⚡" },
            { id: "india_map", label: "India Geo-Schematic", icon: "🗺️" },
            { id: "pestle", label: "PESTLE Matrix", icon: "🌐" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveType(tab.id as any);
                sound.playHover();
              }}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 transition ${
                activeType === tab.id
                  ? "border border-[#D8A63A] bg-[#D8A63A]/15 font-bold text-[#F4C95D]"
                  : "border border-white/5 bg-white/5 text-[#8C8C8C] hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* STUDIO WORKSPACE (TWO COLUMN) */}
        <div className="grid flex-1 grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* CONTROLS COLUMN */}
          <div className="flex flex-col gap-4 overflow-y-auto border-r border-white/10 p-6 bg-[#0a0a0a]">
            {activeType === "hub_spoke" && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[11px] font-mono font-bold text-[#F4C95D] uppercase">
                    Central Core Theme / Policy
                  </label>
                  <input
                    type="text"
                    value={hubCenter}
                    onChange={(e) => setHubCenter(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2 text-xs font-mono text-white focus:border-[#D8A63A] focus:outline-none"
                    placeholder="e.g. NATIONAL GREEN HYDROGEN MISSION"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono font-bold text-[#8C8C8C] uppercase">
                    Spokes / Dimensions ({spokes.length})
                  </label>
                  <div className="mt-2 flex flex-col gap-2">
                    {spokes.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-white"
                      >
                        <span className="font-mono text-[11px] text-[#D8A63A]">#{idx + 1}</span>
                        <span className="truncate px-2">{s}</span>
                        <button
                          onClick={() => handleRemoveSpoke(idx)}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={newSpoke}
                      onChange={(e) => setNewSpoke(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSpoke()}
                      placeholder="Add another dimension..."
                      className="flex-1 rounded-xl border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-white focus:border-[#D8A63A] focus:outline-none"
                    />
                    <button
                      onClick={handleAddSpoke}
                      className="rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3 py-1.5 text-xs font-bold text-[#F4C95D] hover:bg-[#D8A63A]/20"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeType === "matrix_2x2" && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[11px] font-mono font-bold text-[#F4C95D] uppercase">
                    Matrix Title
                  </label>
                  <input
                    type="text"
                    value={matrixTitle}
                    onChange={(e) => setMatrixTitle(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2 text-xs font-mono text-white focus:border-[#D8A63A] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-[#8C8C8C]">Top Axis (Y+)</label>
                    <input
                      type="text"
                      value={quadrantLabels.topAxis}
                      onChange={(e) =>
                        setQuadrantLabels({ ...quadrantLabels, topAxis: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-white focus:border-[#D8A63A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#8C8C8C]">Right Axis (X+)</label>
                    <input
                      type="text"
                      value={quadrantLabels.rightAxis}
                      onChange={(e) =>
                        setQuadrantLabels({ ...quadrantLabels, rightAxis: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-white focus:border-[#D8A63A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#8C8C8C]">Bottom Axis (Y-)</label>
                    <input
                      type="text"
                      value={quadrantLabels.bottomAxis}
                      onChange={(e) =>
                        setQuadrantLabels({ ...quadrantLabels, bottomAxis: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-white focus:border-[#D8A63A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#8C8C8C]">Left Axis (X-)</label>
                    <input
                      type="text"
                      value={quadrantLabels.leftAxis}
                      onChange={(e) =>
                        setQuadrantLabels({ ...quadrantLabels, leftAxis: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-white focus:border-[#D8A63A] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeType === "flowchart" && (
              <div className="flex flex-col gap-4">
                <label className="text-[11px] font-mono font-bold text-[#F4C95D] uppercase">
                  Execution Stages / Chronology ({flowSteps.length})
                </label>
                <div className="flex flex-col gap-2">
                  {flowSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-white"
                    >
                      <span className="font-mono text-[11px] text-[#D8A63A]">Step {idx + 1}</span>
                      <span className="truncate px-2">{step}</span>
                      <button
                        onClick={() => handleRemoveFlowStep(idx)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddFlowStep()}
                    placeholder="Next sequence stage..."
                    className="flex-1 rounded-xl border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-white focus:border-[#D8A63A] focus:outline-none"
                  />
                  <button
                    onClick={handleAddFlowStep}
                    className="rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3 py-1.5 text-xs font-bold text-[#F4C95D] hover:bg-[#D8A63A]/20"
                  >
                    + Add Step
                  </button>
                </div>
              </div>
            )}

            {activeType === "india_map" && (
              <div className="flex flex-col gap-4">
                <label className="text-[11px] font-mono font-bold text-[#F4C95D] uppercase">
                  Select Geographic / Economic Theme
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "corridors", label: "Freight & Industrial Corridors (EDFC/WDFC)" },
                    { id: "ports", label: "Sagarmala Strategic Major Ports" },
                    { id: "renewable", label: "Mega Solar & Wind Energy Parks" },
                    { id: "minerals", label: "Key Mineral Belts & Chota Nagpur Cluster" },
                  ].map((th) => (
                    <button
                      key={th.id}
                      onClick={() => setSelectedGeoTheme(th.id as any)}
                      className={`rounded-xl border p-3 text-left font-mono text-xs transition ${
                        selectedGeoTheme === th.id
                          ? "border-[#D8A63A] bg-[#D8A63A]/15 font-bold text-[#F4C95D]"
                          : "border-white/5 bg-white/5 text-[#8C8C8C] hover:text-white"
                      }`}
                    >
                      {th.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeType === "pestle" && (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-[#8C8C8C] leading-relaxed">
                <span className="font-mono font-bold text-[#F4C95D] uppercase block mb-1">
                  PESTLE Analytical Lens
                </span>
                Standard 6-pillar framework covering Political, Economic, Social, Technological, Legal & Environmental dimensions. Ready to drop straight into your answer body to prevent one-dimensional arguments.
              </div>
            )}
          </div>

          {/* PREVIEW COLUMN */}
          <div className="flex flex-col justify-between overflow-hidden bg-[#050505] p-6">
            <div className="flex-1 overflow-y-auto">
              <div className="flex items-center justify-between pb-3">
                <span className="font-mono text-[10px] tracking-widest text-[#8C8C8C] uppercase">
                  LIVE ANSWER STENCIL PREVIEW
                </span>
                <span className="rounded-full bg-[#D8A63A]/10 px-2.5 py-0.5 font-mono text-[9px] font-bold text-[#F4C95D]">
                  MONOSPACE FORMATTED
                </span>
              </div>
              <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d0d0d] p-4 font-mono text-[11px] text-[#D8A63A] leading-tight select-text">
                {generateDiagramMarkdown()}
              </pre>
            </div>

            {/* FOOTER ACTION */}
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs font-mono text-[#8C8C8C]">
                Ready to append to current draft
              </span>
              <button
                onClick={handleInsert}
                className="flex items-center gap-2 rounded-full border border-[#D8A63A] bg-gradient-to-r from-[#D8A63A] to-[#F4C95D] px-6 py-2.5 font-mono text-xs font-black text-black shadow-[0_0_20px_rgba(216,166,58,0.4)] hover:scale-105 active:scale-95 transition"
              >
                <span>APPEND TO ANSWER DRAFT</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
