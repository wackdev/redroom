"use client";

import React, { useState, useMemo } from "react";
import { sound } from "@/lib/audio/sound-engine";
import { MODERN_HISTORY_MODULES, ModernHistoryModule, MODERN_HISTORY_REVISION_CARDS } from "@/lib/knowledge/datasets/modern-history-seed";

export default function ModernHistoryAtlas() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(MODERN_HISTORY_MODULES[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"modules" | "acts-matrix" | "land-revenue" | "revolt-1857" | "flashcards">("modules");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter modules based on search
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return MODERN_HISTORY_MODULES;
    const q = searchQuery.toLowerCase();
    return MODERN_HISTORY_MODULES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.era.toLowerCase().includes(q) ||
        m.keyTopics.some(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.keyFigures.some((f) => f.toLowerCase().includes(q)) ||
            t.keyEvents.some((e) => e.toLowerCase().includes(q)) ||
            t.prelimsTraps.some((trap) => trap.toLowerCase().includes(q))
        )
    );
  }, [searchQuery]);

  const activeModule = useMemo(() => {
    return MODERN_HISTORY_MODULES.find((m) => m.id === selectedModuleId) || MODERN_HISTORY_MODULES[0];
  }, [selectedModuleId]);

  const handleCopyText = (id: string, text: string) => {
    sound.playSelect();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const actsData = [
    {
      act: "Regulating Act 1773",
      executive: "Governor of Bengal -> Governor-General of Bengal (Warren Hastings) + 4-member council.",
      legislature: "GG in Council passes regulations by majority vote.",
      judiciary: "Supreme Court established at Calcutta (1774) with Sir Elijah Impey as 1st CJ.",
      tradeGov: "Company trade monopoly continued; private trade and gifts strictly banned.",
      upscHighYield: "First direct parliamentary intervention; abolished Dual Government in Bengal.",
    },
    {
      act: "Pitt's India Act 1784",
      executive: "Dual Control: Board of Control (6 Crown members) + Court of Directors (Commercial). Council reduced to 3.",
      legislature: "Governor-General given casting vote in tie cases.",
      judiciary: "Exempted revenue matters from SC jurisdiction (Act of Settlement 1781).",
      tradeGov: "Coined term 'British Possessions in India'; shareholders' rights eliminated.",
      upscHighYield: "Established joint government between British Crown and EIC until 1858.",
    },
    {
      act: "Charter Act 1813",
      executive: "Administrative control maintained under Board of Control.",
      legislature: "No change to central/provincial lawmaking.",
      judiciary: "Courts given greater power over Europeans residing in India.",
      tradeGov: "Abolished Company trade monopoly EXCEPT for Tea and Trade with China. ₹1 Lakh/yr for Indian education.",
      upscHighYield: "Opened India to free trade for all British merchants and permitted Christian missionaries.",
    },
    {
      act: "Charter Act 1833",
      executive: "GG of Bengal -> Governor-General of India (Lord William Bentinck). Purely administrative body.",
      legislature: "Centralized all lawmaking (Acts instead of Regulations); 4th Law Member added (Lord Macaulay).",
      judiciary: "First Law Commission appointed under Lord Macaulay to codify Indian laws (IPC precursor).",
      tradeGov: "COMPLETELY abolished remaining trade monopoly (Tea & China); Saint Helena island transferred to Crown.",
      upscHighYield: "Peak of legislative centralization; provincial legislatures abolished.",
    },
    {
      act: "Charter Act 1853",
      executive: "Separate Lieutenant Governor appointed for Bengal; Court of Directors reduced from 24 to 18 (6 Crown).",
      legislature: "Separation of powers: 12-member Legislative Council created ('mini-parliament') with local representation.",
      judiciary: "Macaulay Committee (1854) established open civil service examination.",
      tradeGov: "Did not specify 20-year charter renewal (opened door for imminent Crown takeover).",
      upscHighYield: "Introduced open competition for Indian Civil Services and local provincial legislative representation.",
    },
    {
      act: "Govt of India Act 1858",
      executive: "Abolished EIC; direct Crown takeover. Secretary of State for India (Lord Stanley) + 15-member Council; Viceroy (Canning).",
      legislature: "Secretary of State held ultimate legislative veto in British Parliament.",
      judiciary: "Crown courts and Sadar Adalats later merged under Indian High Courts Act 1861.",
      tradeGov: "Abolished Board of Control and Court of Directors.",
      upscHighYield: "Queen's Proclamation (Nov 1, 1858): Ended Doctrine of Lapse, guaranteed religious non-interference.",
    },
    {
      act: "Indian Councils Act 1861",
      executive: "Portfolio system formalized by Lord Canning; Viceroy granted power to issue 6-month Ordinances.",
      legislature: "6 to 12 additional members nominated (3 Indians: Raja of Banaras, Maharaja of Patiala, Sir Dinkar Rao). Restored legislative powers to Bombay & Madras.",
      judiciary: "Indian High Courts established in Calcutta, Bombay, and Madras (1862).",
      tradeGov: "Imperial revenue centralized.",
      upscHighYield: "Beginning of representative institutions and legislative devolution in India.",
    },
    {
      act: "Indian Councils Act 1909",
      executive: "1 Indian admitted to Viceroy's Executive Council (Satyendra P. Sinha as Law Member).",
      legislature: "Central Council expanded to 60 members; non-official majority in provinces; resolution and voting on budget allowed.",
      judiciary: "No structural change.",
      tradeGov: "Formal introduction of SEPARATE ELECTORATES for Muslims (seeds of communalism).",
      upscHighYield: "Morley-Minto Reforms: Institutionalized communal representation; rejected true responsible government.",
    },
    {
      act: "Govt of India Act 1919",
      executive: "3 Indians in Viceroy's 6-member Executive Council; High Commissioner for India created in London.",
      legislature: "Bicameral Central Legislature (Council of State 60, Legislative Assembly 145); DYARCHY in Provinces (Transferred vs Reserved).",
      judiciary: "Public Service Commission established (1926).",
      tradeGov: "Separate electorates extended to Sikhs, Indian Christians, Anglo-Indians, and Europeans.",
      upscHighYield: "Montagu-Chelmsford Reforms: Introduced direct elections (7 lakh voters) and 10-year statutory commission clause.",
    },
    {
      act: "Govt of India Act 1935",
      executive: "Proposed All-India Federation with Princely States (never materialized); Dyarchy introduced at Centre.",
      legislature: "Abolished Dyarchy in Provinces; introduced PROVINCIAL AUTONOMY across 11 provinces (bicameral in 6). 3 Lists: Federal (59), Provincial (54), Concurrent (36).",
      judiciary: "Established Federal Court in Delhi (1937) and Reserve Bank of India (1935).",
      tradeGov: "Burma separated from India; Sindh separated from Bombay; Orissa separated from Bihar.",
      upscHighYield: "Largest colonial act (321 sections, 10 schedules); primary structural blueprint for Constitution of India 1950.",
    },
  ];

  const landRevenueData = [
    {
      system: "Permanent Settlement (Zamindari)",
      year: "1793",
      architect: "Lord Cornwallis & Sir John Shore",
      areaCovered: "~19% of British India (Bengal, Bihar, Odisha, Northern Carnatic, Varanasi)",
      unit: "Zamindar (Recognized as hereditary landowner)",
      stateDemand: "10/11th to EIC, 1/11th to Zamindar (Fixed Permanently)",
      features: "Sunset Law (forfeiture of estate if unpaid by sunset of fixed date); no tenancy protection for ryots.",
      impact: "Absentee landlordism, severe sub-infeudation, complete peasant pauperization, fixed EIC revenue despite price inflation.",
    },
    {
      system: "Ryotwari System",
      year: "1820",
      architect: "Thomas Munro & Captain Alexander Read",
      areaCovered: "~51% of British India (Madras, Bombay, Assam, Coorg)",
      unit: "Individual Cultivator (Ryot recognized as owner)",
      stateDemand: "50% of gross produce (Revised periodically every 20–30 years)",
      features: "Direct revenue collection without middlemen; assessed on potential soil fertility rather than seasonal yield.",
      impact: "The colonial state replaced private zamindars as a predatory landlord; moneylender bondage during crop failure.",
    },
    {
      system: "Mahalwari System",
      year: "1822 / 1833",
      architect: "Holt Mackenzie (1822) & William Bentinck / Merttins Bird (1833)",
      areaCovered: "~30% of British India (North-Western Provinces, Punjab, Central Provinces, Gangetic Valley)",
      unit: "Village Community or Estate ('Mahal') via Village Headman ('Lambardar')",
      stateDemand: "Initially 80%, reduced to 66% under 1833 Regulation (Fixed for 30 years)",
      features: "Collective joint responsibility of entire village; detailed village land survey mapping.",
      impact: "Empowered the Lambardar as a coercive tax agent; broke traditional village brotherhood ('Bhaichara') cohesion.",
    },
  ];

  const revolt1857Centers = [
    { center: "Delhi", leader: "Bahadur Shah Zafar & General Bakht Khan", britishGeneral: "John Nicholson & Lieutenant Hudson", outcome: "Captured Sept 1857; Bahadur Shah exiled to Rangoon; sons shot." },
    { center: "Kanpur", leader: "Nana Sahib (Dhondu Pant), Tantia Tope & Azimullah", britishGeneral: "Sir Colin Campbell & Havelock", outcome: "Recaptured Dec 1857; Nana Sahib escaped to Nepal; Tantia Tope joined Jhansi." },
    { center: "Lucknow", leader: "Begum Hazrat Mahal & Birjis Qadir", britishGeneral: "Henry Lawrence (killed), Sir Colin Campbell", outcome: "Recaptured March 1858 with Gorkha Regiment; Begum fled to Nepal." },
    { center: "Jhansi & Gwalior", leader: "Rani Lakshmi Bai & Tantia Tope", britishGeneral: "Sir Hugh Rose", outcome: "Rani died heroically in battle June 1858; Tantia Tope captured & executed April 1859." },
    { center: "Arrah / Jagdishpur (Bihar)", leader: "Kunwar Singh (80-yr zamindar) & Amar Singh", britishGeneral: "William Taylor & Vincent Eyre", outcome: "Defeated British repeatedly; Kunwar Singh died of battle wounds in 1858." },
    { center: "Bareilly (Rohilkhand)", leader: "Khan Bahadur Khan", britishGeneral: "Sir Colin Campbell", outcome: "Formed 40,000 army; executed in 1860." },
    { center: "Faizabad", leader: "Maulvi Ahmadullah (Danka Shah)", britishGeneral: "Colin Campbell", outcome: "Fierce guerrilla war in Awadh; killed in June 1858." },
    { center: "Baghpat (UP)", leader: "Shah Mal (Mobilized 84 villages)", britishGeneral: "Dunlop", outcome: "Disrupted British communication between Meerut & Delhi; martyred July 1857." },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 text-sm">
              🇮🇳
            </span>
            <h2 className="font-mono text-lg font-black tracking-wide text-white">
              Complete Modern Indian History Knowledge Atlas (1498–1947)
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-1 font-sans">
            Comprehensive curriculum decomposition: 15 Chronological Modules, Battles, Treaties, Constitutional Acts & Revision Cards.
          </p>
        </div>

        {/* VIEW MODE TOGGLER */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => {
              sound.playSelect();
              setViewMode("modules");
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
              viewMode === "modules"
                ? "bg-[#D8A63A] text-black shadow-lg"
                : "text-white/60 hover:text-white"
            }`}
          >
            🏛️ 15 Modules
          </button>
          <button
            onClick={() => {
              sound.playSelect();
              setViewMode("acts-matrix");
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
              viewMode === "acts-matrix"
                ? "bg-[#D8A63A] text-black shadow-lg"
                : "text-white/60 hover:text-white"
            }`}
          >
            📜 Acts Evolution (1773–1935)
          </button>
          <button
            onClick={() => {
              sound.playSelect();
              setViewMode("land-revenue");
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
              viewMode === "land-revenue"
                ? "bg-[#D8A63A] text-black shadow-lg"
                : "text-white/60 hover:text-white"
            }`}
          >
            🌾 Land Revenue
          </button>
          <button
            onClick={() => {
              sound.playSelect();
              setViewMode("revolt-1857");
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
              viewMode === "revolt-1857"
                ? "bg-[#D8A63A] text-black shadow-lg"
                : "text-white/60 hover:text-white"
            }`}
          >
            ⚔️ 1857 Revolt Matrix
          </button>
          <button
            onClick={() => {
              sound.playSelect();
              setViewMode("flashcards");
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
              viewMode === "flashcards"
                ? "bg-[#D8A63A] text-black shadow-lg"
                : "text-white/60 hover:text-white"
            }`}
          >
            🧠 SM-2 Flashcards
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search Modern History (e.g. 'Battle of Buxar', 'Subsidiary Alliance', 'Ryotwari', 'Rowlatt', 'Quit India', 'Dupleix')..."
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 pl-11 text-xs sm:text-sm font-sans text-white focus:border-[#D8A63A] focus:outline-none placeholder-white/30"
        />
        <span className="absolute left-4 top-3.5 text-white/40 text-sm">⚡</span>
      </div>

      {/* VIEW 1: 15 CHRONOLOGICAL MODULES */}
      {viewMode === "modules" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* MODULE LIST SIDEBAR */}
          <div className="lg:col-span-4 space-y-2 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredModules.map((m) => {
              const isSelected = m.id === selectedModuleId;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    sound.playSelect();
                    setSelectedModuleId(m.id);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition flex flex-col gap-1.5 ${
                    isSelected
                      ? "bg-amber-500/15 border-amber-400/50 shadow-lg shadow-amber-950/40 text-white"
                      : "bg-[#0b0816] border-white/5 text-white/70 hover:border-white/20 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black uppercase text-amber-400 tracking-wider">
                      Module #{m.moduleNumber}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                      {m.era}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold leading-snug">{m.title}</h4>
                </button>
              );
            })}
          </div>

          {/* ACTIVE MODULE DEEP VIEW */}
          <div className="lg:col-span-8 space-y-5">
            <div className="rounded-3xl border border-white/10 bg-[#0a0714] p-6 shadow-2xl space-y-5">
              {/* MODULE HEADER */}
              <div className="border-b border-white/10 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black uppercase text-[#F4C95D] tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                    Module #{activeModule.moduleNumber} • Era: {activeModule.era}
                  </span>
                  <button
                    onClick={() => handleCopyText(activeModule.id, `${activeModule.title}\n${activeModule.summary}`)}
                    className="font-mono text-xs text-amber-300 hover:text-amber-200"
                  >
                    {copiedId === activeModule.id ? "✓ Copied!" : "📋 Copy Summary"}
                  </button>
                </div>
                <h2 className="text-xl font-black text-white">{activeModule.title}</h2>
                <p className="text-xs text-white/80 leading-relaxed font-sans">{activeModule.summary}</p>
              </div>

              {/* TOPICS IN THIS MODULE */}
              <div className="space-y-6">
                {activeModule.keyTopics.map((topic, idx) => (
                  <div
                    key={topic.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4 hover:border-amber-400/30 transition"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                        <span>📌</span>
                        <span>{topic.title}</span>
                      </h3>
                      <span className="font-mono text-[10px] text-white/40">Part {idx + 1}</span>
                    </div>

                    {/* KEY FIGURES */}
                    {topic.keyFigures && topic.keyFigures.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[10px] text-white/50 uppercase font-bold">Key Figures:</span>
                        {topic.keyFigures.map((fig, i) => (
                          <span
                            key={i}
                            className="font-mono text-[11px] px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-white/90"
                          >
                            {fig}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* KEY EVENTS TIMELINE */}
                    <div className="space-y-2">
                      <p className="font-mono text-[11px] font-bold text-white/60 uppercase">Chronological Sequence:</p>
                      <ul className="space-y-1.5 text-xs text-white/80 font-sans list-none">
                        {topic.keyEvents.map((event, i) => (
                          <li key={i} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{event}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* PRELIMS TRAPS & MAINS POINTERS GRID */}
                    <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-white/5 text-xs">
                      {/* PRELIMS TRAP */}
                      <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-3.5 space-y-1.5">
                        <span className="font-mono text-[10px] font-black uppercase text-rose-300 flex items-center gap-1">
                          <span>⚠️</span>
                          <span>UPSC Prelims Traps & Nuances</span>
                        </span>
                        <ul className="space-y-1 text-white/80 font-sans">
                          {topic.prelimsTraps.map((trap, i) => (
                            <li key={i} className="leading-snug">• {trap}</li>
                          ))}
                        </ul>
                      </div>

                      {/* MAINS POINTER */}
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-3.5 space-y-1.5">
                        <span className="font-mono text-[10px] font-black uppercase text-emerald-300 flex items-center gap-1">
                          <span>📐</span>
                          <span>Mains Conceptual Pointers</span>
                        </span>
                        <ul className="space-y-1 text-white/80 font-sans">
                          {topic.mainsPointers.map((p, i) => (
                            <li key={i} className="leading-snug">• {p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CONSTITUTIONAL ACTS EVOLUTION MATRIX (1773–1935) */}
      {viewMode === "acts-matrix" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-4 text-xs text-amber-200">
            <span className="font-bold">📜 UPSC Constitutional Evolution Comparator (GS-1 History & GS-2 Polity Anchor): </span>
            Examine how executive supremacy, legislative centralization/devolution, trade monopolies, and communal electorates transformed under Company and Crown acts.
          </div>

          <div className="space-y-4">
            {actsData.map((actItem, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-white/10 bg-[#0a0714] p-5 shadow-xl space-y-4 hover:border-amber-400/40 transition"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <h3 className="text-base font-black text-amber-300">{actItem.act}</h3>
                  <span className="font-mono text-[10px] text-white/50 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                    High-Yield Act #{idx + 1}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                  <div className="rounded-xl bg-white/[0.02] p-3 border border-white/5 space-y-1">
                    <p className="font-mono text-[10px] font-bold text-amber-400/90 uppercase">Executive & Governance</p>
                    <p className="text-white/80 leading-relaxed font-sans">{actItem.executive}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.02] p-3 border border-white/5 space-y-1">
                    <p className="font-mono text-[10px] font-bold text-cyan-400/90 uppercase">Legislature & Lawmaking</p>
                    <p className="text-white/80 leading-relaxed font-sans">{actItem.legislature}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.02] p-3 border border-white/5 space-y-1">
                    <p className="font-mono text-[10px] font-bold text-purple-400/90 uppercase">Judiciary & Legal Codes</p>
                    <p className="text-white/80 leading-relaxed font-sans">{actItem.judiciary}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.02] p-3 border border-white/5 space-y-1">
                    <p className="font-mono text-[10px] font-bold text-emerald-400/90 uppercase">Trade, Revenue & Electorates</p>
                    <p className="text-white/80 leading-relaxed font-sans">{actItem.tradeGov}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs flex items-center justify-between">
                  <p className="text-amber-200">
                    <span className="font-bold font-mono uppercase text-amber-400">⚡ UPSC Landmark Significance: </span>
                    {actItem.upscHighYield}
                  </p>
                  <button
                    onClick={() => handleCopyText(`act-${idx}`, `${actItem.act}\n${actItem.upscHighYield}`)}
                    className="ml-2 font-mono text-[10px] text-amber-300 hover:text-white whitespace-nowrap"
                  >
                    {copiedId === `act-${idx}` ? "✓ Copied" : "📋 Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: LAND REVENUE SYSTEMS COMPARATOR */}
      {viewMode === "land-revenue" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {landRevenueData.map((sys, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-white/10 bg-[#0a0714] p-5 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-mono text-[10px] font-bold text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                      System #{idx + 1} • {sys.year}
                    </span>
                    <span className="font-mono text-[10px] text-white/50">{sys.architect}</span>
                  </div>

                  <h3 className="text-base font-black text-white">{sys.system}</h3>

                  <div className="space-y-2 text-xs font-sans">
                    <div className="rounded-xl bg-white/5 p-2.5 border border-white/5">
                      <span className="font-mono text-[10px] font-bold text-amber-300 block uppercase">Area Coverage:</span>
                      <p className="text-white/80">{sys.areaCovered}</p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-2.5 border border-white/5">
                      <span className="font-mono text-[10px] font-bold text-amber-300 block uppercase">Unit of Settlement:</span>
                      <p className="text-white/80">{sys.unit}</p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-2.5 border border-white/5">
                      <span className="font-mono text-[10px] font-bold text-amber-300 block uppercase">State Demand:</span>
                      <p className="text-white/80 font-semibold">{sys.stateDemand}</p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-2.5 border border-white/5">
                      <span className="font-mono text-[10px] font-bold text-amber-300 block uppercase">Key Features:</span>
                      <p className="text-white/70">{sys.features}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-rose-300/90 font-sans">
                  <span className="font-mono text-[10px] font-bold uppercase text-rose-400 block">Socio-Economic Impact:</span>
                  <p className="mt-0.5 leading-snug">{sys.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: 1857 REVOLT STORM CENTERS MATRIX */}
      {viewMode === "revolt-1857" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0a0714] p-5 shadow-2xl">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/10 font-mono text-[11px] uppercase text-[#F4C95D]">
                  <th className="p-3">Storm Center</th>
                  <th className="p-3">Indian Leader(s)</th>
                  <th className="p-3">British General Suppressor</th>
                  <th className="p-3">Key Outcome & Historical Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {revolt1857Centers.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="p-3 font-mono font-bold text-amber-300 whitespace-nowrap">{row.center}</td>
                    <td className="p-3 font-semibold text-white">{row.leader}</td>
                    <td className="p-3 text-rose-300 font-mono">{row.britishGeneral}</td>
                    <td className="p-3 leading-relaxed text-white/70">{row.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 5: SM-2 FLASHCARDS DECK */}
      {viewMode === "flashcards" && (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex items-center justify-between font-mono text-xs text-white/50">
            <span>Modern History High-Yield Flashcard Deck</span>
            <span>Card {activeCardIndex + 1} of {MODERN_HISTORY_REVISION_CARDS.length}</span>
          </div>

          <div
            onClick={() => {
              sound.playSelect();
              setIsCardFlipped(!isCardFlipped);
            }}
            className="min-h-[260px] cursor-pointer rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#1c1304] to-[#0a0701] p-8 shadow-2xl flex flex-col justify-between text-center transition hover:border-amber-400/60"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-amber-400/10 px-3 py-1 font-mono text-[10px] font-bold text-amber-300 border border-amber-400/20">
                {isCardFlipped ? "💡 ANSWER & HIGH-YIELD MEMORY KEY" : "❓ UPSC PRELIMS / MAINS QUESTION"}
              </span>
              <span className="font-mono text-[10px] text-white/40">Click anywhere to flip</span>
            </div>

            <div className="my-6">
              {!isCardFlipped ? (
                <p className="text-base sm:text-lg font-bold text-white leading-relaxed font-sans">
                  {MODERN_HISTORY_REVISION_CARDS[activeCardIndex].front}
                </p>
              ) : (
                <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed font-sans whitespace-pre-line text-left">
                  {MODERN_HISTORY_REVISION_CARDS[activeCardIndex].back}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-[10px] text-white/40">
              {(MODERN_HISTORY_REVISION_CARDS[activeCardIndex].keyFacts || []).map((fact: string, i: number) => (
                <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-amber-300/80">
                  ⚡ {fact}
                </span>
              ))}
            </div>
          </div>

          {/* CARD NAVIGATION BUTTONS */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => {
                sound.playHover();
                setIsCardFlipped(false);
                setActiveCardIndex((prev) => (prev > 0 ? prev - 1 : MODERN_HISTORY_REVISION_CARDS.length - 1));
              }}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 font-mono text-xs font-bold text-white/80 border border-white/10 transition"
            >
              ⬅ Previous
            </button>

            <button
              onClick={() => {
                sound.playVictory();
                setIsCardFlipped(false);
                setActiveCardIndex((prev) => (prev < MODERN_HISTORY_REVISION_CARDS.length - 1 ? prev + 1 : 0));
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D8A63A] to-[#B38322] font-mono text-xs font-black text-black shadow-xl hover:scale-105 transition"
            >
              Next Card ➡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
