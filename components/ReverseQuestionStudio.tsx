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
    keyFactsAndNumericalThresholds: "₹75,021 crore budget outlay aiming for rooftop solar installations on 1 crore households, providing up to 300 units of free electricity per month.",
    classicUPSCExaminerTraps: [
      "Swapping Ministry to 'Ministry of Power' or 'Ministry of Housing and Urban Affairs'.",
      "Inverting 300 units/month to '100% free electricity without monthly cap'.",
      "Stating that the scheme is funded by private DISCOMs rather than Central Financial Assistance (CFA)."
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
    schemeOrPolicy: "National Quantum Mission (NQM)",
    nodalMinistry: "Department of Science and Technology (DST), Ministry of Science & Technology",
    keyFactsAndNumericalThresholds: "₹6,003 crore outlay (2023-2031) targeting intermediate scale quantum computers with 50-1000 physical qubits in 8 years across 4 Thematic Hubs (T-Hubs).",
    classicUPSCExaminerTraps: [
      "Attributing nodal control to MeitY or ISRO instead of DST.",
      "Claiming target of 100,000 qubits by 2025 (numerical exaggeration).",
      "Stating that satellite-based quantum secure communication is excluded from the mission scope."
    ],
    sampleCraftedStatements: {
      statement1: "NQM is implemented by the Ministry of Electronics and Information Technology (MeitY).",
      statement2: "The mission targets developing quantum computers with 50 to 1000 physical qubits by 2031.",
      statement3: "It aims to establish four Thematic Hubs (T-Hubs) in leading academic and R&D institutes.",
      answerKey: "Statement 1 is INCORRECT (DST, not MeitY). Statements 2 and 3 are CORRECT.",
      trapMechanismsUsed: ["Nodal Ministry Swap Trap"]
    }
  },
  {
    id: "pol-3",
    schemeOrPolicy: "Mission Mausam",
    nodalMinistry: "Ministry of Earth Sciences (MoES)",
    keyFactsAndNumericalThresholds: "₹2,000 crore outlay over 2 years aimed at creating weather-ready India with AI/ML driven forecasting, next-gen Doppler radars, and cloud simulation chambers.",
    classicUPSCExaminerTraps: [
      "Swapping Ministry to 'Ministry of Environment, Forest and Climate Change' (MoEFCC).",
      "Stating that the mission aims to engineer tropical cyclones to prevent coastal landfall.",
      "Claiming it is implemented exclusively by the Indian Air Force."
    ],
    sampleCraftedStatements: {
      statement1: "Mission Mausam is launched by the Ministry of Environment, Forest and Climate Change.",
      statement2: "It integrates artificial intelligence and next-generation radar systems to improve high-resolution weather forecasts.",
      statement3: "India Meteorological Department (IMD) and NCMRWF are key implementing agencies.",
      answerKey: "Statement 1 is INCORRECT (MoES, not MoEFCC). Statements 2 and 3 are CORRECT.",
      trapMechanismsUsed: ["Nodal Ministry Swap Trap"]
    }
  },
  {
    id: "pol-4",
    schemeOrPolicy: "PM-MITRA (Mega Integrated Textile Region and Apparel) Parks",
    nodalMinistry: "Ministry of Textiles",
    keyFactsAndNumericalThresholds: "Setting up 7 PM MITRA Parks across 7 States (Tamil Nadu, Telangana, Gujarat, Karnataka, MP, UP, Maharashtra) inspired by 5F vision (Farm to Fibre to Factory to Fashion to Foreign).",
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
  },
  {
    id: "pol-5",
    schemeOrPolicy: "Green Credit Programme (GCP)",
    nodalMinistry: "Ministry of Environment, Forest and Climate Change (MoEFCC)",
    keyFactsAndNumericalThresholds: "Market-based mechanism under LiFE initiative incentivizing voluntary environmental actions (tree plantation, water management, sustainable agriculture). Administered by Indian Council of Forestry Research and Education (ICFRE).",
    classicUPSCExaminerTraps: [
      "Confusing Green Credits with mandatory Carbon Credits under Carbon Credit Trading Scheme (CCTS).",
      "Claiming that Green Credits are tradable on international carbon compliance markets.",
      "Stating that only private corporations are eligible while individual citizens are barred."
    ],
    sampleCraftedStatements: {
      statement1: "Green Credit Programme is a market-based voluntary environmental initiative governed by MoEFCC.",
      statement2: "The programme is administered by the Bureau of Energy Efficiency (BEE).",
      statement3: "Green Credits are completely fungible with standard carbon offset units under Paris Agreement Article 6.",
      answerKey: "Statement 1 is CORRECT. Statements 2 is INCORRECT (ICFRE administers GCP, while BEE administers Carbon market). Statement 3 is INCORRECT (GCP is non-carbon environmental actions).",
      trapMechanismsUsed: ["Implementing Body Swap Trap", "Concept Conflation Trap"]
    }
  }
];

export default function ReverseQuestionStudio() {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyItem>(POLICY_BANK[0]);
  const [cadetStatement1, setCadetStatement1] = useState("");
  const [cadetStatement2, setCadetStatement2] = useState("");
  const [cadetStatement3, setCadetStatement3] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showModelQuestions, setShowModelQuestions] = useState(false);

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
    if (/voluntary|mandatory|centrally sponsored|central sector/i.test(all)) {
      trapsFound.push("📑 Scheme Architecture Classification Trap");
    }

    if (trapsFound.length >= 2) {
      sound.playVictory();
      setFeedback(
        `🏆 EXCELLENT EXAMINER MINDSET! You successfully crafted ${trapsFound.length} high-probability UPSC trap mechanisms:\n• ` +
          trapsFound.join("\n• ") +
          "\n\nCadets who create trap statements develop subconscious immunity when taking Prelims."
      );
    } else {
      sound.playLock();
      setFeedback(
        `🎯 GOOD START! Detected ${trapsFound.length} trap patterns. Try adding a Nodal Ministry Swap or an Extreme Absolute Word (e.g. 'all/never') to elevate the question to UPSC difficulty standard.`
      );
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#090909] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#D8A63A] animate-ping" />
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#D8A63A]">
            REVERSE COGNITION STUDIO // THINK LIKE THE UPSC EXAMINER
          </span>
        </div>
        <h2 className="mt-1 font-mono text-xl sm:text-2xl font-black text-white uppercase">
          Policy Trap Creator & Statement Synthesis
        </h2>
        <p className="mt-1 text-xs text-[#8C8C8C]">
          The most effective way to eliminate options in Prelims is learning how the UPSC paper setter plants deceptive traps in government schemes.
        </p>
      </div>

      {/* Policy Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {POLICY_BANK.map((pol) => {
          const isSelected = selectedPolicy.id === pol.id;
          return (
            <button
              key={pol.id}
              onClick={() => {
                sound.playSelect();
                setSelectedPolicy(pol);
                setFeedback(null);
                setShowModelQuestions(false);
              }}
              className="px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2"
              style={{
                background: isSelected ? "rgba(216,166,58,0.25)" : "rgba(255,255,255,0.03)",
                border: isSelected ? "1px solid rgba(216,166,58,0.5)" : "1px solid rgba(255,255,255,0.06)",
                color: isSelected ? "#F4C95D" : "#9ca3af"
              }}>
              <span>{pol.schemeOrPolicy}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Policy Factcard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Target Scheme:</span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedPolicy.schemeOrPolicy}</h3>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Nodal Ministry:</span>
              <p className="text-xs text-gray-200 mt-0.5 font-medium">{selectedPolicy.nodalMinistry}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Key Facts & Outlay:</span>
              <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">{selectedPolicy.keyFactsAndNumericalThresholds}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-2">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
              🪤 Classic UPSC Examiner Traps:
            </span>
            <ul className="space-y-1.5">
              {selectedPolicy.classicUPSCExaminerTraps.map((trap, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{trap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Craft Your Own Statements */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>✍️ Craft 3 Deceptive Statements</span>
              <span className="text-[10px] text-amber-400 font-mono">Reverse Drills</span>
            </h4>

            <input
              type="text"
              value={cadetStatement1}
              onChange={(e) => setCadetStatement1(e.target.value)}
              placeholder="Statement 1 (e.g. swap nodal ministry or implementing body)..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 bg-black/40 border border-white/10 focus:outline-none"
            />

            <input
              type="text"
              value={cadetStatement2}
              onChange={(e) => setCadetStatement2(e.target.value)}
              placeholder="Statement 2 (e.g. true factual statement with key thresholds)..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 bg-black/40 border border-white/10 focus:outline-none"
            />

            <input
              type="text"
              value={cadetStatement3}
              onChange={(e) => setCadetStatement3(e.target.value)}
              placeholder="Statement 3 (e.g. plant an extreme qualifier: all, never, solely)..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 bg-black/40 border border-white/10 focus:outline-none"
            />

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleEvaluateTrapQuality}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-black bg-[#D8A63A] hover:bg-[#F4C95D] transition-all shadow-lg">
                ⚡ Evaluate Trap Quality
              </button>

              <button
                onClick={() => setShowModelQuestions(!showModelQuestions)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10 transition-all">
                {showModelQuestions ? "Hide Model" : "💡 Model Trap"}
              </button>
            </div>
          </div>

          {feedback && (
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 text-xs text-gray-200 whitespace-pre-line leading-relaxed">
              {feedback}
            </div>
          )}

          {showModelQuestions && (
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                🏛️ Standard UPSC Examiner Template:
              </span>
              <div className="space-y-1.5 text-xs text-gray-300">
                <p>1. {selectedPolicy.sampleCraftedStatements.statement1}</p>
                <p>2. {selectedPolicy.sampleCraftedStatements.statement2}</p>
                <p>3. {selectedPolicy.sampleCraftedStatements.statement3}</p>
              </div>
              <div className="p-3 rounded-xl bg-black/40 text-xs text-gray-300 border border-white/5">
                <span className="text-emerald-400 font-bold block mb-1">Answer Analysis:</span>
                {selectedPolicy.sampleCraftedStatements.answerKey}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
