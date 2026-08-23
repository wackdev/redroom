"use client";

import { useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface CaseStudyPreset {
  id: string;
  title: string;
  scenario: string;
  stakeholders: {
    primary: string[];
    secondary: string[];
    vulnerable: string[];
  };
  ethicalDilemmas: string[];
  options: {
    title: string;
    description: string;
    merits: string[];
    demerits: string[];
    ethicalFramework: string;
  }[];
  recommendedResolution: string;
}

const PRESET_CASE_STUDIES: CaseStudyPreset[] = [
  {
    id: "cs-1",
    title: "Communal Polarization vs Law Enforcement in a Border District",
    scenario:
      "You are the District Magistrate (DM) of a sensitive border district. A local cultural procession is scheduled which intersects a minority locality. Intelligence reports suggest a fringe group intends to use provocative slogans to incite unrest. A senior local Minister instructs you to permit the procession along the controversial route to avoid public backlash against the ruling party, hinting that denial of permission would lead to your immediate transfer.",
    stakeholders: {
      primary: ["District Magistrate (DM)", "Procession Organizers", "Minority Residents along the route"],
      secondary: ["Senior Minister / Executive Government", "District Police Administration", "Media"],
      vulnerable: ["Local traders whose livelihoods are at risk", "Children and elderly in sensitive areas"],
    },
    ethicalDilemmas: [
      "Rule of Law vs Political Pressure / Threat of Transfer",
      "Right to Assembly (Article 19) vs Maintenance of Public Order (Article 19(2))",
      "Personal Career Security vs Constitutional Morality & Secular Duty",
    ],
    options: [
      {
        title: "Option 1: Yield to the Minister and Allow the Controversial Route",
        description: "Permit the procession on the requested route with heavy police bandobast.",
        merits: ["Avoids political confrontation", "Preserves personal posting tenure"],
        demerits: [
          "High risk of communal riots and loss of life/property",
          "Breach of constitutional morality and impartial governance",
        ],
        ethicalFramework: "Ethical Egoism (Flawed) — Prioritizes self-interest over public welfare.",
      },
      {
        title: "Option 2: Blank Prohibition of the Procession",
        description: "Impose Section 144 and completely ban the procession across the district.",
        merits: ["Pre-empts immediate violence along that specific route"],
        demerits: [
          "Curbs legitimate fundamental rights of peaceful participants",
          "May provoke spontaneous agitated gatherings elsewhere in the city",
        ],
        ethicalFramework: "Deontological Overreach — Rigid adherence without exploring peaceful alternatives.",
      },
      {
        title: "Option 3: Constructive Mediation & Alternative Sanitized Route (Recommended)",
        description:
          "Convene an immediate Peace Committee meeting with community elders, negotiate an alternative non-provocative route with written undertakings, deploy drone surveillance, and firmly brief the Minister with an objective intelligence threat dossier.",
        merits: [
          "Upholds Right to Faith while safeguarding Public Peace",
          "Demonstrates emotional intelligence, crisis leadership, and constitutional fortitude",
          "Creates permanent community bridgeheads for future festivals",
        ],
        demerits: ["Demands intensive administrative coordination and continuous monitoring"],
        ethicalFramework:
          "Virtue Ethics & 2nd ARC Governance: Balances compassion, courage, and integrity.",
      },
    ],
    recommendedResolution:
      "Uphold Article 21 (Right to Life) and public safety above all. Form a multi-community Peace Committee, divert to a mutually agreed safe corridor, record all proceedings on body cameras, and firmly communicate the intelligence rationale to the higher executive with full bureaucratic neutrality.",
  },
  {
    id: "cs-2",
    title: "Whistleblowing vs Institutional Loyalty in Public Health Procurement",
    scenario:
      "You are the Director of Health Services in a state facing an epidemic. A massive tender for life-saving medical equipment was awarded to an influential firm with substandard testing certifications. The Department Secretary advises you that canceling the contract now will cause immediate equipment shortage and national media scrutiny during an ongoing public health crisis.",
    stakeholders: {
      primary: ["Director of Health Services", "Critical Patients", "Tender Vendor"],
      secondary: ["Department Secretary", "State Healthcare Workers", "Taxpayers"],
      vulnerable: ["Impoverished patients reliant on public hospitals"],
    },
    ethicalDilemmas: [
      "Immediate Quantity vs Quality of Medical Supplies",
      "Institutional Subordination vs Duty of Care & Public Trust",
      "Utilitarian Expediency vs Deontological Non-Maleficence",
    ],
    options: [
      {
        title: "Option 1: Overlook the Flawed Certifications",
        description: "Accept delivery to prevent supply gap.",
        merits: ["Ensures immediate equipment availability in wards"],
        demerits: ["Substandard equipment can cause fatal patient accidents; criminal liability"],
        ethicalFramework: "Flawed Utilitarianism — Sacrifices safety for numbers.",
      },
      {
        title: "Option 2: Emergency Independent Re-testing & Parallel Spot Procurement (Recommended)",
        description:
          "Mandate immediate third-party batch testing (e.g. NABL / IIT laboratories) while invoking emergency procurement clauses to source verified backup units from PSUs like HLL Lifecare.",
        merits: [
          "Zero compromise on patient safety",
          "Ensures continuous equipment pipeline while fixing accountability",
        ],
        demerits: ["Requires emergency budget reallocation"],
        ethicalFramework: "Gandhian Talisman: The end does not justify unethical means.",
      },
    ],
    recommendedResolution:
      "Patient life and the Hippocratic principle of 'Do No Harm' take absolute precedence. Conduct expedited independent laboratory validation, blacklist defective batches, invoke emergency spot procurement from certified public sector enterprises, and submit a transparent audit trail to the Chief Secretary.",
  },
];

export default function EthicsDilemmaSimulator() {
  const [selectedCase, setSelectedCase] = useState<CaseStudyPreset>(PRESET_CASE_STUDIES[0]);
  const [activeTab, setActiveTab] = useState<"stakeholders" | "dilemmas" | "options" | "resolution">(
    "stakeholders"
  );
  const [userSelectedOption, setUserSelectedOption] = useState<number | null>(null);

  return (
    <div className="flex flex-col rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-pink-400">
              GS-4 ETHICS IN ACTION // CASE STUDY MATRIX
            </span>
          </div>
          <h2 className="mt-1 font-mono text-lg font-bold text-white">
            Administrative Dilemma Simulator
          </h2>
          <p className="text-xs text-[#8C8C8C]">
            Deconstruct complex ethical scenarios using stakeholder mapping, conflicting values, and administrative jurisprudence.
          </p>
        </div>

        {/* Case Study Selector */}
        <select
          value={selectedCase.id}
          onChange={(e) => {
            const found = PRESET_CASE_STUDIES.find((c) => c.id === e.target.value);
            if (found) {
              setSelectedCase(found);
              setUserSelectedOption(null);
              sound.playHover();
            }
          }}
          className="rounded-xl border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-[#D8A63A] focus:outline-none"
        >
          {PRESET_CASE_STUDIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Case Scenario Narrative */}
      <div className="mt-5 rounded-2xl border border-pink-500/20 bg-pink-500/5 p-4">
        <span className="font-mono text-[10px] font-black uppercase tracking-wider text-pink-300 block mb-1">
          📜 SCENARIO BRIEFING
        </span>
        <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
          {selectedCase.scenario}
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="mt-6 flex border-b border-white/10 font-mono text-xs">
        <button
          onClick={() => {
            setActiveTab("stakeholders");
            sound.playHover();
          }}
          className={`px-4 py-2.5 font-bold transition border-b-2 ${
            activeTab === "stakeholders"
              ? "border-[#D8A63A] text-[#F4C95D]"
              : "border-transparent text-[#8C8C8C] hover:text-white"
          }`}
        >
          👥 Stakeholder Matrix
        </button>
        <button
          onClick={() => {
            setActiveTab("dilemmas");
            sound.playHover();
          }}
          className={`px-4 py-2.5 font-bold transition border-b-2 ${
            activeTab === "dilemmas"
              ? "border-[#D8A63A] text-[#F4C95D]"
              : "border-transparent text-[#8C8C8C] hover:text-white"
          }`}
        >
          ⚖️ Core Ethical Dilemmas
        </button>
        <button
          onClick={() => {
            setActiveTab("options");
            sound.playHover();
          }}
          className={`px-4 py-2.5 font-bold transition border-b-2 ${
            activeTab === "options"
              ? "border-[#D8A63A] text-[#F4C95D]"
              : "border-transparent text-[#8C8C8C] hover:text-white"
          }`}
        >
          🎯 Options Analysis
        </button>
        <button
          onClick={() => {
            setActiveTab("resolution");
            sound.playHover();
          }}
          className={`px-4 py-2.5 font-bold transition border-b-2 ${
            activeTab === "resolution"
              ? "border-[#D8A63A] text-[#F4C95D]"
              : "border-transparent text-[#8C8C8C] hover:text-white"
          }`}
        >
          🏆 Master Course of Action
        </button>
      </div>

      {/* Tab Panels */}
      <div className="mt-5">
        {/* 1. STAKEHOLDERS */}
        {activeTab === "stakeholders" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 font-sans text-xs">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <span className="font-mono text-xs font-bold text-[#F4C95D] block mb-2">
                🏛️ Primary Stakeholders
              </span>
              <ul className="space-y-1.5 text-white/80 list-disc pl-4">
                {selectedCase.stakeholders.primary.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <span className="font-mono text-xs font-bold text-blue-300 block mb-2">
                👥 Secondary Stakeholders
              </span>
              <ul className="space-y-1.5 text-white/80 list-disc pl-4">
                {selectedCase.stakeholders.secondary.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <span className="font-mono text-xs font-bold text-amber-400 block mb-2">
                🛡️ Vulnerable Groups
              </span>
              <ul className="space-y-1.5 text-white/80 list-disc pl-4">
                {selectedCase.stakeholders.vulnerable.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 2. ETHICAL DILEMMAS */}
        {activeTab === "dilemmas" && (
          <div className="space-y-3 font-sans text-xs">
            {selectedCase.ethicalDilemmas.map((dilemma, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-pink-500/20 font-mono text-xs font-bold text-pink-300">
                  {idx + 1}
                </span>
                <span className="text-sm font-semibold text-white">{dilemma}</span>
              </div>
            ))}
          </div>
        )}

        {/* 3. OPTIONS */}
        {activeTab === "options" && (
          <div className="space-y-4 font-sans text-xs">
            {selectedCase.options.map((opt, oIdx) => (
              <div
                key={oIdx}
                onClick={() => {
                  setUserSelectedOption(oIdx);
                  sound.playLock();
                }}
                className={`cursor-pointer rounded-2xl border p-5 transition ${
                  userSelectedOption === oIdx
                    ? "border-[#D8A63A] bg-[#D8A63A]/10 shadow-lg"
                    : "border-white/10 bg-black/40 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-sm font-bold text-white">{opt.title}</h4>
                  <span className="font-mono text-[10px] font-bold text-[#F4C95D]">
                    {opt.ethicalFramework}
                  </span>
                </div>
                <p className="mt-1.5 text-white/80">{opt.description}</p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <strong className="text-emerald-400 block mb-1">✓ Merits:</strong>
                    <ul className="list-disc pl-4 space-y-0.5 text-white/70">
                      {opt.merits.map((m, mIdx) => (
                        <li key={mIdx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                    <strong className="text-red-400 block mb-1">✕ Demerits:</strong>
                    <ul className="list-disc pl-4 space-y-0.5 text-white/70">
                      {opt.demerits.map((d, dIdx) => (
                        <li key={dIdx}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. MASTER RESOLUTION */}
        {activeTab === "resolution" && (
          <div className="rounded-2xl border border-[#D8A63A]/40 bg-gradient-to-b from-[#1c1507] to-[#0d0d0d] p-6 shadow-xl font-sans">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🏆</span>
              <h3 className="font-mono text-sm font-black uppercase tracking-wider text-[#F4C95D]">
                Recommended UPSC Administrative Resolution
              </h3>
            </div>
            <p className="text-sm text-white/95 leading-relaxed">
              {selectedCase.recommendedResolution}
            </p>

            <div className="mt-5 border-t border-white/10 pt-4 font-mono text-xs text-[#8C8C8C] flex flex-wrap gap-4">
              <span>🏛️ 2nd ARC 4th Report Alignment: <strong>Ethics in Governance</strong></span>
              <span>📜 Constitutional Anchor: <strong>Articles 14, 19, 21, 25</strong></span>
              <span>⚖️ Nolan Committee Principles: <strong>Integrity, Objectivity, Leadership</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
