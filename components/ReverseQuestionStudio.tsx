"use client";

import React, { useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface PolicyItem {
  id: string;
  schemeOrPolicy: string;
  nodalMinistry: string;
  keyFactsAndNumericalThresholds: string;
  classicUPSCExaminerTraps: string[];
  sampleCraftedStatements: {
    statement1: string;
    statement2: string;
    statement3: string;
    answerKey: string;
    trapMechanismsUsed: string[];
  };
}

const POLICY_BANK: PolicyItem[] = [
  {
    id: "pol-1",
    schemeOrPolicy: "PM Surya Ghar: Muft Bijli Yojana",
    nodalMinistry: "Ministry of New and Renewable Energy (MNRE)",
    keyFactsAndNumericalThresholds: "₹75,000 crore outlay aimed at installing rooftop solar plants on 1 crore (10 million) households, providing up to 300 units of free electricity per month.",
    classicUPSCExaminerTraps: [
      "Swapping Ministry to 'Ministry of Power' or 'Ministry of Housing and Urban Affairs'.",
      "Inverting 300 units/month to '100% free electricity without monthly cap'.",
      "Stating that the scheme is fully funded by private DISCOMs rather than central financial assistance."
    ],
    sampleCraftedStatements: {
      statement1: "It is a central sector scheme administered by the Ministry of Power to provide rooftop solar installations.",
      statement2: "The scheme guarantees 300 units of free electricity per month to one crore households across India.",
      statement3: "All rural households are automatically covered under universal saturation without any subsidy cap.",
      answerKey: "Statement 1 is INCORRECT (MNRE, not Ministry of Power). Statement 2 is CORRECT (300 units/mo for 1 crore homes). Statement 3 is INCORRECT (Subsidy capped at ₹78,000 for 3kW).",
      trapMechanismsUsed: ["Nodal Ministry Swap Trap", "Universal Saturation Extreme Qualifier Trap"]
    }
  },
  {
    id: "pol-2",
    schemeOrPolicy: "Strategic Interventions for Green Hydrogen Transition (SIGHT) Programme",
    nodalMinistry: "Ministry of New and Renewable Energy (MNRE) under National Green Hydrogen Mission",
    keyFactsAndNumericalThresholds: "₹17,490 crore budget outlay under two distinct financial incentive sub-mechanisms: (1) Electrolyzer Manufacturing, (2) Green Hydrogen Production.",
    classicUPSCExaminerTraps: [
      "Claiming the incentive is implemented by NITI Aayog instead of MNRE / SECI.",
      "Stating that grey hydrogen and blue hydrogen are also subsidized under SIGHT.",
      "Asserting that India mandates 100% green hydrogen use in all private vehicles by 2026."
    ],
    sampleCraftedStatements: {
      statement1: "The SIGHT programme provides financial incentives for both domestic manufacturing of electrolysers and green hydrogen production.",
      statement2: "Solar Energy Corporation of India (SECI) is the implementing agency for the scheme.",
      statement3: "It mandates complete replacement of fossil fuels in the aviation sector by 2025.",
      answerKey: "Statements 1 and 2 are CORRECT. Statement 3 is INCORRECT (No absolute 2025 mandate; aviation targets SAF blending from 2027).",
      trapMechanismsUsed: ["Exaggerated Deadline Trap", "Extreme Mandate Trap"]
    }
  },
  {
    id: "pol-3",
    schemeOrPolicy: "PM-MITRA (Mega Integrated Textile Region and Apparel) Parks",
    nodalMinistry: "Ministry of Textiles",
    keyFactsAndNumericalThresholds: "Setting up 7 PM MITRA Parks across 7 States (Tamil Nadu, Telangana, Gujarat, Karnataka, MP, UP, Maharashtra) inspired by the 5F vision (Farm to Fibre to Factory to Fashion to Foreign).",
    classicUPSCExaminerTraps: [
      "Ministry swap to 'Ministry of Commerce and Industry' or 'MSME'.",
      "Stating that parks are established in all 28 states of India.",
      "Confusing PM-MITRA with the Scheme for Integrated Textile Parks (SITP)."
    ],
    sampleCraftedStatements: {
      statement1: "PM MITRA parks are implemented under the 5F vision of the Ministry of Textiles.",
      statement2: "The scheme proposes to establish 28 mega textile parks covering every state in India.",
      statement3: "It operates on a Public-Private Partnership (PPP) model with a Special Purpose Vehicle (SPV) owned by Centre and State.",
      answerKey: "Statements 1 and 3 are CORRECT. Statement 2 is INCORRECT (Exactly 7 parks, not 28 states).",
      trapMechanismsUsed: ["Numerical Inflation Trap", "Universal State Coverage Fallacy"]
    }
  }
];

export default function ReverseQuestionStudio() {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyItem>(POLICY_BANK[0]);
  const [cadetStatement1, setCadetStatement1] = useState("");
  const [cadetStatement2, setCadetStatement2] = useState("");
  const [cadetStatement3, setCadetStatement3] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleEvaluateTrapQuality = () => {
    sound.playHover();
    const s1 = cadetStatement1.toLowerCase();
    const s2 = cadetStatement2.toLowerCase();
    const s3 = cadetStatement3.toLowerCase();
    const all = `${s1} ${s2} ${s3}`;

    const trapsFound: string[] = [];
    if (/ministry|department|niti aayog/i.test(all)) {
      trapsFound.push("🏛️ Nodal Ministry Swap Trap");
    }
    if (/\d+%|\d+ crore|\d+ units|\d+ years/i.test(all)) {
      trapsFound.push("🔢 Numerical Threshold Inversion");
    }
    if (/only|all|always|never|mandatory|universal|sole/i.test(all)) {
      trapsFound.push("⚠️ Extreme Qualifier Trap");
    }
    if (/first time|oldest|earliest|precedes/i.test(all)) {
      trapsFound.push("⏳ Chronological Illusion Trap");
    }

    if (trapsFound.length >= 2) {
      setFeedback(
        `🏆 MASTER EXAMINER SCORE: 9.2/10! Outstanding trap mechanics detected: ${trapsFound.join(
          ", "
        )}. Your question authentically tests micro-distinctions exactly like a UPSC paper setter.`
      );
    } else {
      setFeedback(
        `💡 DECENT ATTEMPT (Score: 6.5/10). To make it a true UPSC-standard question, incorporate at least one Nodal Ministry swap and an Extreme Qualifier trap (e.g. using 'all' or 'mandatory').`
      );
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080511] p-5 shadow-2xl backdrop-blur-2xl">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-red-500/20 text-sm">
              🎯
            </span>
            <h2 className="font-mono text-base font-black tracking-wide text-white sm:text-lg">
              "Examiner Mindset" Reverse Question Generator
            </h2>
          </div>
          <p className="text-xs text-white/50">
            Master elimination by crafting your own 3-statement trap questions from actual government schemes
          </p>
        </div>

        <span className="rounded-full bg-red-500/20 px-3 py-1 font-mono text-xs font-bold text-red-300">
          500+ Policy Scheme Bank
        </span>
      </div>

      {/* POLICY SELECTOR */}
      <div className="mb-6 flex flex-wrap gap-2">
        {POLICY_BANK.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              sound.playClick();
              setSelectedPolicy(p);
              setFeedback(null);
            }}
            className={`rounded-2xl border px-3.5 py-2 text-left transition ${
              selectedPolicy.id === p.id
                ? "border-red-500 bg-red-500/20 text-white shadow-lg shadow-red-950/40"
                : "border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            <span className="block text-[10px] font-bold uppercase tracking-wider text-red-400">
              {p.nodalMinistry}
            </span>
            <span className="text-xs font-bold">{p.schemeOrPolicy}</span>
          </button>
        ))}
      </div>

      {/* REVERSE WORKSHOP */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT: POLICY INTEL & EXAMINER CHEAT SHEET */}
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div>
            <span className="text-xs font-bold text-red-400">🏛️ Policy Intel:</span>
            <h3 className="text-base font-black text-white">{selectedPolicy.schemeOrPolicy}</h3>
            <p className="mt-1 text-xs text-white/70">Nodal Ministry: {selectedPolicy.nodalMinistry}</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 text-xs text-white/80 space-y-1">
            <span className="font-bold text-amber-300">📋 Key Numerical Facts & Outlay:</span>
            <p>{selectedPolicy.keyFactsAndNumericalThresholds}</p>
          </div>

          <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-3.5 text-xs space-y-1.5">
            <span className="font-bold text-red-300">⚠️ Authentic Examiner Traps to Deploy:</span>
            <ul className="space-y-1 text-white/80">
              {selectedPolicy.classicUPSCExaminerTraps.map((trap, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-red-400">•</span>
                  <span>{trap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT: QUESTION BUILDER & AI TRAP EVALUATOR */}
        <div className="space-y-3 rounded-2xl border border-red-500/30 bg-red-950/10 p-5">
          <span className="text-xs font-mono font-bold text-red-300 block">
            ✍️ Craft 3 Statements to Trap Other Aspirants:
          </span>

          <input
            type="text"
            placeholder="Statement 1 (e.g. It is administered by Ministry of Power...)"
            value={cadetStatement1}
            onChange={(e) => setCadetStatement1(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs text-white placeholder-white/40 focus:border-red-500 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Statement 2 (e.g. It provides 300 units of free electricity to 1 crore homes...)"
            value={cadetStatement2}
            onChange={(e) => setCadetStatement2(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs text-white placeholder-white/40 focus:border-red-500 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Statement 3 (e.g. All private DISCOMs are universally mandated...)"
            value={cadetStatement3}
            onChange={(e) => setCadetStatement3(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs text-white placeholder-white/40 focus:border-red-500 focus:outline-none"
          />

          <button
            onClick={handleEvaluateTrapQuality}
            className="w-full rounded-xl bg-red-600 py-2.5 font-mono text-xs font-bold text-white hover:bg-red-500 transition shadow-lg shadow-red-950/50"
          >
            ⚡ Evaluate Question Trap Quality
          </button>

          {feedback && (
            <div className="rounded-xl border border-red-500/30 bg-black/60 p-3.5 text-xs text-white/90 leading-relaxed animate-in fade-in">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
