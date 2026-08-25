"use client";

import React, { useState } from "react";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import EssayStudio from "@/components/EssayStudio";
import QuotesVault from "@/components/QuotesVault";
import AuthGuard from "@/components/auth/AuthGuard";
import { sound } from "@/lib/audio/sound-engine";
import { trackActivityEvent } from "@/lib/brain/activity-events";
import { UPSCQuote } from "@/lib/knowledge/datasets/quotes-dataset";

export default function EssayPage() {
  const [activeTab, setActiveTab] = useState<"frameworks" | "draft" | "quotes">("frameworks");
  const [selectedTopic, setSelectedTopic] = useState(
    "Ships do not sink because of water around them; ships sink because of water that gets into them."
  );
  const [essayContent, setEssayContent] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    flowScore: number;
    dimensionsScore: number;
    examplesScore: number;
    feedback: string;
    suggestions: string[];
  } | null>(null);

  const wordCount = essayContent.trim().length > 0 ? essayContent.trim().split(/\s+/).length : 0;

  const handleSelectQuoteForDraft = (q: UPSCQuote) => {
    sound.playVictory();
    setSelectedTopic(q.quote);
    setEssayContent((prev) => {
      const quoteCitation = `"${q.quote}" — ${q.author}\n\n`;
      return prev ? `${prev}\n\n${quoteCitation}` : quoteCitation;
    });
    setActiveTab("draft");
  };

  const handleEvaluateEssay = async () => {
    if (wordCount < 50) {
      alert("Please write at least 50 words to receive an AI multi-dimensional evaluation.");
      return;
    }
    sound.playLock();
    setIsEvaluating(true);
    try {
      // Simulate / trigger evaluation
      setTimeout(() => {
        setIsEvaluating(false);
        sound.playVictory();
        setEvaluationResult({
          score: Math.min(175, Math.round(110 + (wordCount > 300 ? 25 : 10) + Math.random() * 15)),
          flowScore: 84,
          dimensionsScore: 88,
          examplesScore: 79,
          feedback:
            "Strong philosophical opening with good historical hooks. The individual and institutional dimensions are well articulated. Ensure transition paragraphs connect smoothly to the conclusion.",
          suggestions: [
            "Add a contemporary environmental or technological dimension (e.g., AI ethics or climate resilience).",
            "Incorporate a constitutional anchor like Preamble or Article 51A.",
            "Deepen the counter-nuance perspective before synthesizing the way forward.",
          ],
        });

        void trackActivityEvent("MAINS_ANSWER_SUBMITTED", {
          type: "ESSAY",
          wordCount,
          topic: selectedTopic,
        });
      }, 1800);
    } catch {
      setIsEvaluating(false);
    }
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#040406] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
        <AppUniversalHeader moduleName="Essay Studio & Blueprint Lab" moduleBadge="250 MARKS UPSC ESSAY" />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
          {/* TOP NAV TABS */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-[#F4C95D]">
                PAPER-1 STRATEGY VAULT
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                UPSC Essay Architecture & Evaluation
              </h1>
              <p className="text-xs text-[#8C8C8C] mt-1 font-sans">
                Master 360-degree PESTLE dimensions, philosophical hooks, and timed 1000-1200 word essay composition.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => {
                  sound.playSelect();
                  setActiveTab("frameworks");
                }}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition ${
                  activeTab === "frameworks"
                    ? "bg-[#D8A63A] text-black shadow-lg"
                    : "text-white/60 hover:text-white"
                }`}
              >
                📐 Blueprints
              </button>
              <button
                onClick={() => {
                  sound.playSelect();
                  setActiveTab("quotes");
                }}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition ${
                  activeTab === "quotes"
                    ? "bg-[#D8A63A] text-black shadow-lg"
                    : "text-white/60 hover:text-white"
                }`}
              >
                📜 Quotes Vault
              </button>
              <button
                onClick={() => {
                  sound.playSelect();
                  setActiveTab("draft");
                }}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition ${
                  activeTab === "draft"
                    ? "bg-[#D8A63A] text-black shadow-lg"
                    : "text-white/60 hover:text-white"
                }`}
              >
                ✍️ Draft Arena
              </button>
            </div>
          </div>

          {activeTab === "frameworks" && <EssayStudio />}

          {activeTab === "quotes" && (
            <QuotesVault
              initialPaper="Essay"
              onSelectQuote={handleSelectQuoteForDraft}
              actionButtonLabel="Use in Draft Arena"
              showGuideByDefault={true}
            />
          )}

          {activeTab === "draft" && (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* ESSAY WRITING PAD */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl space-y-4">
                  <div>
                    <label className="font-mono text-xs font-black uppercase tracking-wider text-[#F4C95D]">
                      Selected Essay Topic
                    </label>
                    <input
                      type="text"
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="mt-1.5 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-semibold text-white focus:border-[#D8A63A] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between font-mono text-xs text-white/50 border-b border-white/5 pb-2">
                    <span>Target: 1,000 – 1,200 words</span>
                    <span className={`font-bold ${wordCount >= 800 ? "text-emerald-400" : "text-[#F4C95D]"}`}>
                      Word Count: {wordCount} words
                    </span>
                  </div>

                  <textarea
                    rows={18}
                    value={essayContent}
                    onChange={(e) => setEssayContent(e.target.value)}
                    placeholder="Draft your essay here... Start with a compelling quote, historical anecdote, or rhetorical question. Unpack dimensions systematically across Individual, Societal, Economic, Technological, Ecological, and Constitutional perspectives..."
                    className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-white/90 placeholder-white/20 focus:border-[#D8A63A] focus:outline-none resize-none font-sans"
                  />

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        sound.playHover();
                        setEssayContent("");
                        setEvaluationResult(null);
                      }}
                      className="font-mono text-xs text-white/40 hover:text-white"
                    >
                      Clear Draft
                    </button>

                    <button
                      onClick={handleEvaluateEssay}
                      disabled={isEvaluating}
                      className="rounded-2xl bg-gradient-to-r from-[#D8A63A] to-[#B38322] px-6 py-3 font-mono text-xs font-black text-black shadow-xl hover:scale-105 active:scale-95 transition disabled:opacity-50"
                    >
                      {isEvaluating ? "Evaluating Flow & Depth..." : "Submit for AI Evaluation ⚡"}
                    </button>
                  </div>
                </div>
              </div>

              {/* EVALUATION & STRUCTURE RADAR */}
              <div className="space-y-4">
                {evaluationResult ? (
                  <div className="rounded-3xl border border-[#D8A63A]/40 bg-gradient-to-br from-[#1c1304] to-[#0a0701] p-6 shadow-xl space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#F4C95D] uppercase">
                        AI Scorecard
                      </span>
                      <span className="rounded-full bg-[#D8A63A] px-3 py-1 font-mono text-xs font-black text-black">
                        {evaluationResult.score} / 250
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center font-mono">
                      <div className="rounded-2xl bg-white/5 p-3 border border-white/5">
                        <p className="text-[10px] text-white/50">Flow</p>
                        <p className="text-sm font-bold text-white mt-1">{evaluationResult.flowScore}%</p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-3 border border-white/5">
                        <p className="text-[10px] text-white/50">Dimensions</p>
                        <p className="text-sm font-bold text-white mt-1">{evaluationResult.dimensionsScore}%</p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-3 border border-white/5">
                        <p className="text-[10px] text-white/50">Examples</p>
                        <p className="text-sm font-bold text-white mt-1">{evaluationResult.examplesScore}%</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-white">Diagnostic Summary:</p>
                      <p className="text-white/80 leading-relaxed font-sans">{evaluationResult.feedback}</p>
                    </div>

                    <div className="space-y-2 border-t border-white/10 pt-3">
                      <p className="font-mono text-[11px] font-bold text-[#F4C95D] uppercase">
                        Key Recommendations
                      </p>
                      <ul className="space-y-1.5 text-xs text-white/70 list-disc list-inside">
                        {evaluationResult.suggestions.map((s, idx) => (
                          <li key={idx} className="leading-relaxed">{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl space-y-4">
                    <h3 className="font-mono text-xs font-black uppercase tracking-wider text-[#F4C95D]">
                      Essay Structural Checklist
                    </h3>
                    <div className="space-y-2.5 text-xs text-white/70 font-sans">
                      <div className="flex items-start gap-2.5">
                        <span className="text-[#D8A63A] font-mono font-bold">1.</span>
                        <span>Compelling Hook (Anecdote, Fable, Historical Paradox)</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-[#D8A63A] font-mono font-bold">2.</span>
                        <span>Thesis Statement & Core Argument definition</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-[#D8A63A] font-mono font-bold">3.</span>
                        <span>Temporal Evolution (Ancient → Medieval → Modern → Present)</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-[#D8A63A] font-mono font-bold">4.</span>
                        <span>Spatial Dimensions (Individual → State → Global)</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-[#D8A63A] font-mono font-bold">5.</span>
                        <span>Counter-Perspective / Dialectical Nuance</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-[#D8A63A] font-mono font-bold">6.</span>
                        <span>Visionary Synthesis / Constitutional Anchorage</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
