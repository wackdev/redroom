"use client";

import React, { useState } from "react";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import EthicsDilemmaSimulator from "@/components/EthicsDilemmaSimulator";
import QuotesVault from "@/components/QuotesVault";
import AuthGuard from "@/components/auth/AuthGuard";
import { sound } from "@/lib/audio/sound-engine";
import { trackActivityEvent } from "@/lib/brain/activity-events";

export default function EthicsPage() {
  const [activeTab, setActiveTab] = useState<"case-studies" | "quotes-frameworks">("case-studies");
  const [frameworksSubTab, setFrameworksSubTab] = useState<"frameworks" | "quotes">("quotes");

  const ethicalFrameworks = [
    {
      name: "Deontological Ethics (Kant)",
      principle: "Categorical Imperative & Duty for Duty's Sake",
      upscUsage: "Public officials must adhere to duty, truthfulness, and non-instrumental treatment of citizens regardless of consequences.",
      anchor: "Articles 14, 21, Prevention of Corruption Act",
    },
    {
      name: "Utilitarianism (Bentham & Mill)",
      principle: "Greatest Happiness of the Greatest Number",
      upscUsage: "Resource allocation, public health interventions, disaster relief prioritization.",
      anchor: "Directive Principles of State Policy (Part IV)",
    },
    {
      name: "Virtue Ethics (Aristotle)",
      principle: "Golden Mean & Moral Excellence (Phronesis / Practical Wisdom)",
      upscUsage: "Balancing empathy and objectivity in bureaucratic decision-making.",
      anchor: "Nolan Committee Principles: Selflessness, Integrity, Objectivity, Accountability, Openness, Honesty, Leadership",
    },
    {
      name: "Rawlsian Justice (John Rawls)",
      principle: "Veil of Ignorance & Difference Principle",
      upscUsage: "Affirmative action, tribal development, welfare safety nets for the most disadvantaged.",
      anchor: "Article 46, Scheduled Tribes & Traditional Forest Dwellers Act",
    },
    {
      name: "Gandhian Talisman & Sarvodaya",
      principle: "Recall the face of the poorest and the weakest man you may have seen...",
      upscUsage: "Ultimate moral litmus test when assessing whether any policy step will lead to Swaraj for the hungry and spiritually starving millions.",
      anchor: "Antyodaya, Trusteeship, Gram Swaraj",
    },
  ];

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#040406] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
        <AppUniversalHeader moduleName="Ethics, Integrity & Aptitude Lab" moduleBadge="GS-4 MASTER SUITE" />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
          {/* HEADER ROW */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-[#F4C95D]">
                GS PAPER-4 DECISION MATRIX
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Ethics Case Studies & Stakeholder Mapping
              </h1>
              <p className="text-xs text-[#8C8C8C] mt-1 font-sans">
                Interactive bureaucratic dilemma simulator, Nolan 7 principles, and constitutional morality decision matrices.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => {
                  sound.playSelect();
                  setActiveTab("case-studies");
                }}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition ${
                  activeTab === "case-studies"
                    ? "bg-[#D8A63A] text-black shadow-lg"
                    : "text-white/60 hover:text-white"
                }`}
              >
                ⚖️ Case Studies Simulator
              </button>
              <button
                onClick={() => {
                  sound.playSelect();
                  setActiveTab("quotes-frameworks");
                }}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition ${
                  activeTab === "quotes-frameworks"
                    ? "bg-[#D8A63A] text-black shadow-lg"
                    : "text-white/60 hover:text-white"
                }`}
              >
                📜 Ethical Frameworks & Quotes
              </button>
            </div>
          </div>

          {activeTab === "case-studies" ? (
            <EthicsDilemmaSimulator />
          ) : (
            <div className="space-y-6">
              {/* SUB-TAB SELECTOR */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <button
                  onClick={() => {
                    sound.playSelect();
                    setFrameworksSubTab("quotes");
                  }}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition ${
                    frameworksSubTab === "quotes"
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                      : "bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  📜 325+ Quotes & Thinkers Bank
                </button>
                <button
                  onClick={() => {
                    sound.playSelect();
                    setFrameworksSubTab("frameworks");
                  }}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition ${
                    frameworksSubTab === "frameworks"
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                      : "bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  🏛️ Classical Ethical Philosophies
                </button>
              </div>

              {frameworksSubTab === "quotes" ? (
                <QuotesVault initialTheme="Ethics & Integrity" initialPaper="GS-4" />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {ethicalFrameworks.map((fw, idx) => (
                    <div
                      key={idx}
                      className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#F4C95D] bg-[#D8A63A]/10 px-2 py-0.5 rounded-full border border-[#D8A63A]/20">
                          Framework #{idx + 1}
                        </span>
                        <h3 className="text-base font-black text-white mt-2">{fw.name}</h3>
                        <p className="font-mono text-xs text-white/60 mt-1 italic">{fw.principle}</p>
                        <p className="text-xs text-white/80 mt-3 leading-relaxed font-sans">{fw.upscUsage}</p>
                      </div>

                      <div className="mt-4 border-t border-white/5 pt-3 font-mono text-[11px] text-amber-300/80">
                        <span>Constitutional Anchor:</span>
                        <p className="text-white/60 text-[10px] mt-0.5">{fw.anchor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
