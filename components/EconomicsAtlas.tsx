"use client";

import React, { useState, useMemo } from "react";
import { sound } from "@/lib/audio/sound-engine";
import { ECONOMICS_PILLARS_DATASET, EconomicsPillar, ECONOMICS_REVISION_CARDS } from "@/lib/knowledge/datasets/economics-seed";

export default function EconomicsAtlas() {
  const [selectedPillarId, setSelectedPillarId] = useState<string>(ECONOMICS_PILLARS_DATASET[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"pillars" | "monetary-corridor" | "deficits-calculator" | "gst-matrix" | "agri-subsidies" | "flashcards">("pillars");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Deficit Calculator State
  const [calcRevExp, setCalcRevExp] = useState<number>(85000);
  const [calcRevRec, setCalcRevRec] = useState<number>(65000);
  const [calcGCCA, setCalcGCCA] = useState<number>(5000);
  const [calcCapExp, setCalcCapExp] = useState<number>(25000);
  const [calcNonDebtCapRec, setCalcNonDebtCapRec] = useState<number>(3000);
  const [calcInterestPay, setCalcInterestPay] = useState<number>(7500);

  // Calculated Deficits
  const calculatedDeficits = useMemo(() => {
    const totalExp = calcRevExp + calcCapExp;
    const nonDebtRec = calcRevRec + calcNonDebtCapRec;
    const rd = Math.max(0, calcRevExp - calcRevRec);
    const erd = Math.max(0, rd - calcGCCA);
    const fd = Math.max(0, totalExp - nonDebtRec);
    const pd = Math.max(0, fd - calcInterestPay);

    return { totalExp, nonDebtRec, rd, erd, fd, pd };
  }, [calcRevExp, calcRevRec, calcGCCA, calcCapExp, calcNonDebtCapRec, calcInterestPay]);

  // Filter pillars based on search
  const filteredPillars = useMemo(() => {
    if (!searchQuery.trim()) return ECONOMICS_PILLARS_DATASET;
    const q = searchQuery.toLowerCase();
    return ECONOMICS_PILLARS_DATASET.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.theme.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.keyTopics.some(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.keyConcepts.some((c) => c.toLowerCase().includes(q)) ||
            t.prelimsTraps.some((trap) => trap.toLowerCase().includes(q)) ||
            t.mainsPointers.some((m) => m.toLowerCase().includes(q))
        )
    );
  }, [searchQuery]);

  const activePillar = useMemo(() => {
    return ECONOMICS_PILLARS_DATASET.find((p) => p.id === selectedPillarId) || ECONOMICS_PILLARS_DATASET[0];
  }, [selectedPillarId]);

  const handleCopyText = (id: string, text: string) => {
    sound.playSelect();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const monetaryCorridor = [
    {
      tool: "Reverse Repo Rate",
      type: "Absorption (Collateralized)",
      tenure: "Overnight / Short-term (7, 14, 28 days)",
      collateral: "G-Secs provided by RBI to Bank",
      mechanism: "Rate at which RBI borrows from banks when banks have surplus cash.",
      corridorPosition: "Bottom of Rate Corridor",
    },
    {
      tool: "Standing Deposit Facility (SDF)",
      type: "Absorption (Uncollateralized)",
      tenure: "Overnight (Available 24/7/365)",
      collateral: "NO G-Sec Collateral Required",
      mechanism: "Introduced under Urjit Patel Committee; absorbs excess liquidity without locking RBI's bond reserves.",
      corridorPosition: "Floor of Liquidity Adjustment Facility (LAF)",
    },
    {
      tool: "Policy Repo Rate",
      type: "Injection (Benchmark Policy Rate)",
      tenure: "Short-term (1 to 28 days)",
      collateral: "G-Secs pledged by Bank to RBI",
      mechanism: "The core anchor rate of the Monetary Policy Committee; rate charged by RBI on short-term liquidity loans.",
      corridorPosition: "Central Anchor of Rate Corridor",
    },
    {
      tool: "Marginal Standing Facility (MSF)",
      type: "Emergency Lending",
      tenure: "Overnight (Emergency window)",
      collateral: "SLR G-Secs dipping allowed (up to 2-3%)",
      mechanism: "Penal emergency borrowing facility for banks facing acute cash squeeze.",
      corridorPosition: "Ceiling of Rate Corridor (Pegged to Bank Rate)",
    },
    {
      tool: "Bank Rate",
      type: "Long-Term Lending & Penal Rate",
      tenure: "Long-term (Non-collateralized)",
      collateral: "Commercial bills rediscounting",
      mechanism: "Penal rate for shortfall in CRR/SLR and long-term liquidity support.",
      corridorPosition: "Ceiling of Rate Corridor (Aligned with MSF)",
    },
  ];

  const gstMatrixData = [
    { feature: "Constitutional Basis", preGst: "Schedule 7 separation (Center: Excise/Service; State: Sales/VAT)", postGst: "Article 246A (Simultaneous power) & Article 279A (GST Council)" },
    { feature: "Tax Base & Nature", preGst: "Origin-based cascading taxation on separate goods & services", postGst: "Destination-based consumption tax with comprehensive Input Tax Credit (ITC)" },
    { feature: "Excluded Commodities", preGst: "Covered under specific state sales/excise laws", postGst: "5 Petroleum items (unnotified rates) & Alcoholic liquor (constitutionally outside)" },
    { feature: "Council Voting Power", preGst: "Empowered Committee of State Finance Ministers (advisory)", postGst: "Center holds 1/3rd (33.3%) and States hold 2/3rd (66.7%); 75% weighted threshold" },
    { feature: "Interstate Trade Mechanism", preGst: "Central Sales Tax (CST) retained by origin state without ITC", postGst: "Integrated GST (IGST = CGST + SGST) settled to destination consuming state" },
    { feature: "Anti-Avoidance / Compliance", preGst: "Physical border check posts, 25% transit time delays", postGst: "GSTN portal, e-Way Bills, FASTag integration, GSTAT appellate tribunals" },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-sm">
              📈
            </span>
            <h2 className="font-mono text-lg font-black tracking-wide text-white">
              Indian Economy & Macroeconomics Knowledge Atlas (GS-3 Master Suite)
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-1 font-sans">
            Comprehensive curriculum decomposition: 10 Thematic Pillars, Monetary Corridor, Deficits Calculator & Flashcards.
          </p>
        </div>

        {/* VIEW MODE TOGGLER */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => {
              sound.playSelect();
              setViewMode("pillars");
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
              viewMode === "pillars"
                ? "bg-[#D8A63A] text-black shadow-lg"
                : "text-white/60 hover:text-white"
            }`}
          >
            🏛️ 10 Pillars
          </button>
          <button
            onClick={() => {
              sound.playSelect();
              setViewMode("monetary-corridor");
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
              viewMode === "monetary-corridor"
                ? "bg-[#D8A63A] text-black shadow-lg"
                : "text-white/60 hover:text-white"
            }`}
          >
            🏦 Monetary Policy Corridor
          </button>
          <button
            onClick={() => {
              sound.playSelect();
              setViewMode("deficits-calculator");
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
              viewMode === "deficits-calculator"
                ? "bg-[#D8A63A] text-black shadow-lg"
                : "text-white/60 hover:text-white"
            }`}
          >
            💰 Deficits Quartet
          </button>
          <button
            onClick={() => {
              sound.playSelect();
              setViewMode("gst-matrix");
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
              viewMode === "gst-matrix"
                ? "bg-[#D8A63A] text-black shadow-lg"
                : "text-white/60 hover:text-white"
            }`}
          >
            📜 GST & Tax Matrix
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
          placeholder="🔍 Search Indian Economy (e.g. 'MCLR', 'Standing Deposit Facility', 'GVA Basic Price', 'RoDTEP', 'Peace Clause', 'HAM Model', 'Primary Deficit')..."
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 pl-11 text-xs sm:text-sm font-sans text-white focus:border-[#D8A63A] focus:outline-none placeholder-white/30"
        />
        <span className="absolute left-4 top-3.5 text-white/40 text-sm">⚡</span>
      </div>

      {/* VIEW 1: 10 THEMATIC PILLARS */}
      {viewMode === "pillars" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* PILLAR LIST SIDEBAR */}
          <div className="lg:col-span-4 space-y-2 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredPillars.map((p) => {
              const isSelected = p.id === selectedPillarId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    sound.playSelect();
                    setSelectedPillarId(p.id);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition flex flex-col gap-1.5 ${
                    isSelected
                      ? "bg-emerald-500/15 border-emerald-400/50 shadow-lg shadow-emerald-950/40 text-white"
                      : "bg-[#0b0816] border-white/5 text-white/70 hover:border-white/20 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                      Pillar #{p.pillarNumber}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                      {p.theme}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold leading-snug">{p.title}</h4>
                </button>
              );
            })}
          </div>

          {/* ACTIVE PILLAR DEEP VIEW */}
          <div className="lg:col-span-8 space-y-5">
            <div className="rounded-3xl border border-white/10 bg-[#0a0714] p-6 shadow-2xl space-y-5">
              {/* PILLAR HEADER */}
              <div className="border-b border-white/10 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black uppercase text-emerald-400 tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                    Pillar #{activePillar.pillarNumber} • {activePillar.theme}
                  </span>
                  <button
                    onClick={() => handleCopyText(activePillar.id, `${activePillar.title}\n${activePillar.summary}`)}
                    className="font-mono text-xs text-amber-300 hover:text-amber-200"
                  >
                    {copiedId === activePillar.id ? "✓ Copied!" : "📋 Copy Summary"}
                  </button>
                </div>
                <h2 className="text-xl font-black text-white">{activePillar.title}</h2>
                <p className="text-xs text-white/80 leading-relaxed font-sans">{activePillar.summary}</p>
              </div>

              {/* TOPICS IN THIS PILLAR */}
              <div className="space-y-6">
                {activePillar.keyTopics.map((topic, idx) => (
                  <div
                    key={topic.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4 hover:border-emerald-400/30 transition"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-emerald-300 flex items-center gap-2">
                        <span>📌</span>
                        <span>{topic.title}</span>
                      </h3>
                      <span className="font-mono text-[10px] text-white/40">Section {idx + 1}</span>
                    </div>

                    {/* KEY CONCEPTS */}
                    <div className="space-y-2">
                      <p className="font-mono text-[11px] font-bold text-white/60 uppercase">Key Principles & Mechanisms:</p>
                      <ul className="space-y-1.5 text-xs text-white/80 font-sans list-none">
                        {topic.keyConcepts.map((concept, i) => (
                          <li key={i} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{concept}</span>
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
                          <span>UPSC Prelims Elimination Traps</span>
                        </span>
                        <ul className="space-y-1 text-white/80 font-sans">
                          {topic.prelimsTraps.map((trap, i) => (
                            <li key={i} className="leading-snug">• {trap}</li>
                          ))}
                        </ul>
                      </div>

                      {/* MAINS POINTER */}
                      <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-3.5 space-y-1.5">
                        <span className="font-mono text-[10px] font-black uppercase text-amber-300 flex items-center gap-1">
                          <span>📐</span>
                          <span>Mains GS-3 Analytical Hooks</span>
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

      {/* VIEW 2: MONETARY POLICY RATE CORRIDOR */}
      {viewMode === "monetary-corridor" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/15 p-4 text-xs text-cyan-200">
            <span className="font-bold">🏦 RBI Liquidity Management Rate Corridor: </span>
            Reverse Repo Rate &lt; Standing Deposit Facility (SDF) &lt; Policy Repo Rate &lt; Marginal Standing Facility (MSF) / Bank Rate.
            The Monetary Policy Committee adjusts the Repo Rate as the central policy anchor, automatically realigning the corridor.
          </div>

          <div className="space-y-4">
            {monetaryCorridor.map((item, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-white/10 bg-[#0a0714] p-5 shadow-xl space-y-3 hover:border-cyan-400/40 transition"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span className="text-amber-400 font-mono">#{idx + 1}</span>
                      <span>{item.tool}</span>
                    </h3>
                    <span className="font-mono text-[11px] text-cyan-300 mt-0.5 block">{item.corridorPosition}</span>
                  </div>
                  <span className="font-mono text-[10px] text-white/60 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                    {item.type}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-xl bg-white/[0.02] p-3 border border-white/5 space-y-1">
                    <span className="font-mono text-[10px] font-bold text-amber-400 uppercase">Tenure & Liquidity Nature:</span>
                    <p className="text-white/80">{item.tenure}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.02] p-3 border border-white/5 space-y-1">
                    <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase">Collateral Requirement:</span>
                    <p className="text-white/80 font-semibold">{item.collateral}</p>
                  </div>
                </div>

                <p className="text-xs text-white/80 leading-relaxed font-sans">{item.mechanism}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: DEFICITS QUARTET CALCULATOR & SIMULATOR */}
      {viewMode === "deficits-calculator" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-4 text-xs text-amber-200">
            <span className="font-bold">💰 Interactive Deficit Quartet Simulator (Union Budget Framework): </span>
            Adjust the revenue, capital, and borrowing figures below to observe how the Revenue Deficit, Effective Revenue Deficit, Fiscal Deficit, and Primary Deficit change dynamically.
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* INPUT PANEL */}
            <div className="lg:col-span-6 rounded-3xl border border-white/10 bg-[#0a0714] p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider font-mono">
                ⚙️ Union Budget Input Parameters (₹ Crores)
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-white/70 block mb-1">1. Revenue Expenditure (Salaries, Subsidies, Interest):</label>
                  <input
                    type="number"
                    value={calcRevExp}
                    onChange={(e) => setCalcRevExp(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-1">2. Revenue Receipts (Tax + Non-Tax Receipts):</label>
                  <input
                    type="number"
                    value={calcRevRec}
                    onChange={(e) => setCalcRevRec(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-1">3. Grants for Creation of Capital Assets (GCCA to States):</label>
                  <input
                    type="number"
                    value={calcGCCA}
                    onChange={(e) => setCalcGCCA(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-1">4. Capital Expenditure (Highways, Defense Assets, Railway capex):</label>
                  <input
                    type="number"
                    value={calcCapExp}
                    onChange={(e) => setCalcCapExp(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-1">5. Non-Debt Capital Receipts (Loan Recovery, Disinvestment):</label>
                  <input
                    type="number"
                    value={calcNonDebtCapRec}
                    onChange={(e) => setCalcNonDebtCapRec(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-1">6. Interest Payments on Past Borrowings:</label>
                  <input
                    type="number"
                    value={calcInterestPay}
                    onChange={(e) => setCalcInterestPay(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* LIVE DEFICIT DASHBOARD */}
            <div className="lg:col-span-6 space-y-3.5">
              {/* REVENUE DEFICIT */}
              <div className="rounded-2xl border border-rose-500/30 bg-rose-950/15 p-4 space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-xs font-bold text-rose-300">Revenue Deficit (RD = RE - RR)</span>
                  <span className="text-base font-black text-white">₹{calculatedDeficits.rd.toLocaleString()} Cr</span>
                </div>
                <p className="text-[11px] text-white/70">Measures borrowing used purely for day-to-day consumption and administration.</p>
              </div>

              {/* EFFECTIVE REVENUE DEFICIT */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-4 space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-xs font-bold text-amber-300">Effective Revenue Deficit (ERD = RD - GCCA)</span>
                  <span className="text-base font-black text-white">₹{calculatedDeficits.erd.toLocaleString()} Cr</span>
                </div>
                <p className="text-[11px] text-white/70">Excludes grants to states that create permanent infrastructure (Rangarajan Committee).</p>
              </div>

              {/* FISCAL DEFICIT */}
              <div className="rounded-2xl border border-purple-500/30 bg-purple-950/15 p-4 space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-xs font-bold text-purple-300">Fiscal Deficit (FD = Total Exp - Non-Debt Receipts)</span>
                  <span className="text-base font-black text-white">₹{calculatedDeficits.fd.toLocaleString()} Cr</span>
                </div>
                <p className="text-[11px] text-white/70">Equals the NET TOTAL BORROWINGS required by the Union Government for the year.</p>
              </div>

              {/* PRIMARY DEFICIT */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-4 space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-xs font-bold text-emerald-300">Primary Deficit (PD = FD - Interest Payments)</span>
                  <span className="text-base font-black text-white">₹{calculatedDeficits.pd.toLocaleString()} Cr</span>
                </div>
                <p className="text-[11px] text-white/70">Purest gauge of current year fiscal prudence, ignoring the legacy debt burden.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: GST & TAXATION MATRIX */}
      {viewMode === "gst-matrix" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0a0714] p-5 shadow-2xl">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/10 font-mono text-[11px] uppercase text-[#F4C95D]">
                  <th className="p-3">Taxation Dimension</th>
                  <th className="p-3">Pre-GST Indirect Tax Regime</th>
                  <th className="p-3">Post-GST Architecture (101st Amendment)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {gstMatrixData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="p-3 font-mono font-bold text-amber-300 whitespace-nowrap">{row.feature}</td>
                    <td className="p-3 leading-relaxed text-white/70">{row.preGst}</td>
                    <td className="p-3 leading-relaxed text-emerald-200 font-semibold">{row.postGst}</td>
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
            <span>Indian Economy High-Yield Flashcard Deck</span>
            <span>Card {activeCardIndex + 1} of {ECONOMICS_REVISION_CARDS.length}</span>
          </div>

          <div
            onClick={() => {
              sound.playSelect();
              setIsCardFlipped(!isCardFlipped);
            }}
            className="min-h-[260px] cursor-pointer rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#061811] to-[#040806] p-8 shadow-2xl flex flex-col justify-between text-center transition hover:border-emerald-400/60"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 font-mono text-[10px] font-bold text-emerald-300 border border-emerald-400/20">
                {isCardFlipped ? "💡 ANSWER & CORE ECONOMIC PRINCIPLE" : "❓ UPSC PRELIMS / MAINS QUESTION"}
              </span>
              <span className="font-mono text-[10px] text-white/40">Click anywhere to flip</span>
            </div>

            <div className="my-6">
              {!isCardFlipped ? (
                <p className="text-base sm:text-lg font-bold text-white leading-relaxed font-sans">
                  {ECONOMICS_REVISION_CARDS[activeCardIndex].front}
                </p>
              ) : (
                <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-sans whitespace-pre-line text-left">
                  {ECONOMICS_REVISION_CARDS[activeCardIndex].back}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-[10px] text-white/40">
              {(ECONOMICS_REVISION_CARDS[activeCardIndex].keyFacts || []).map((fact, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-emerald-300/80">
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
                setActiveCardIndex((prev) => (prev > 0 ? prev - 1 : ECONOMICS_REVISION_CARDS.length - 1));
              }}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 font-mono text-xs font-bold text-white/80 border border-white/10 transition"
            >
              ⬅ Previous
            </button>

            <button
              onClick={() => {
                sound.playVictory();
                setIsCardFlipped(false);
                setActiveCardIndex((prev) => (prev < ECONOMICS_REVISION_CARDS.length - 1 ? prev + 1 : 0));
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
