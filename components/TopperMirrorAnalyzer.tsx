"use client";

import React, { useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface TopperMetric {
  metricName: string;
  candidateValue: number;
  topperBenchmark: number;
  unit: string;
  verdict: "Optimal" | "Deficient" | "Excessive";
  recommendation: string;
}

export default function TopperMirrorAnalyzer() {
  const [candidateAnswerText, setCandidateAnswerText] = useState<string>(
    `The Office of the Governor under Article 153 is meant to be a linchpin of constitutional federalism. However, issues regarding discretionary powers under Article 163 and delay in assent to bills under Article 200 have caused friction.\n\n1. Discretionary Boundaries: In Nabam Rebia (2016) and Shamsher Singh (1974), the Supreme Court held that the Governor must act on the aid and advice of the Council of Ministers except in specified areas.\n\n2. Delay in Assent: In State of Punjab v. Principal Secretary (2023), the SC clarified that Governors cannot sit on bills indefinitely under Article 200.\n\n3. Recommendations of Sarkaria Commission (1988) and Punchhi Commission (2010): The Governor should be an eminent person from outside the state, appointed after consulting the Chief Minister, and should act as a neutral umpire.\n\nConclusion: Ensuring fixed timeframes for bill assent and strengthening the Inter-State Council under Article 263 will uphold cooperative federalism.`
  );

  const [analyzed, setAnalyzed] = useState(true);

  // Compute Live Metrics against UPSC Rank 1–10 Benchmark
  const wordCount = candidateAnswerText.trim().split(/\s+/).filter(Boolean).length;
  const bulletCount = (candidateAnswerText.match(/^\d+\.|\*/gm) || []).length;
  const hasConstitutionalArticles = (candidateAnswerText.match(/Article \d+|Art \d+/gi) || []).length;
  const hasJudicialCases = (candidateAnswerText.match(/\b(v\.|vs\.|judgement|ruling|case)\b/gi) || []).length;
  const hasCommissions = (candidateAnswerText.match(/\b(commission|committee|arc)\b/gi) || []).length;

  const metrics: TopperMetric[] = [
    {
      metricName: "Bullet Point Structure Ratio",
      candidateValue: bulletCount >= 3 ? 75 : 30,
      topperBenchmark: 70,
      unit: "%",
      verdict: bulletCount >= 3 ? "Optimal" : "Deficient",
      recommendation: bulletCount >= 3 ? "Strong structural scannability with numbered points." : "Convert bulky paragraphs into crisp bulleted dimensions."
    },
    {
      metricName: "Constitutional & Article Density",
      candidateValue: hasConstitutionalArticles,
      topperBenchmark: 4,
      unit: "articles / 15M",
      verdict: hasConstitutionalArticles >= 3 ? "Optimal" : "Deficient",
      recommendation: "Cite specific Articles (e.g. Art 163, Art 200, Art 263) to anchor legal authority."
    },
    {
      metricName: "Landmark Case Law & Precedent Citations",
      candidateValue: hasJudicialCases,
      topperBenchmark: 2,
      unit: "cases / 15M",
      verdict: hasJudicialCases >= 2 ? "Optimal" : "Deficient",
      recommendation: "Mention authoritative Supreme Court rulings (e.g. Shamsher Singh, Nabam Rebia)."
    },
    {
      metricName: "Commission & Committee Endorsements",
      candidateValue: hasCommissions,
      topperBenchmark: 2,
      unit: "commissions / 15M",
      verdict: hasCommissions >= 1 ? "Optimal" : "Deficient",
      recommendation: "Quote 2nd ARC, Sarkaria, or Punchhi Commission recommendations for policy weight."
    }
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080511] p-5 shadow-2xl backdrop-blur-2xl">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-pink-500/20 text-sm">
              🪞
            </span>
            <h2 className="font-mono text-base font-black tracking-wide text-white sm:text-lg">
              Mains Answer Topper Mirror & Visual Style Cloner
            </h2>
          </div>
          <p className="text-xs text-white/50">
            Compare your handwritten/typed answer against UPSC Rank 1–10 copies on structural scannability and legal density
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-pink-300">
          <span>Words: {wordCount}</span>
          <span>•</span>
          <span>Target: 150–250W</span>
        </div>
      </div>

      {/* INPUT & HEATMAP BENCHMARK GRID */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT: CANDIDATE ANSWER SCRIPT EDITOR */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-white/70 block">
            ✍️ Candidate Answer Script (Type or Paste for Live Topper Benchmark):
          </label>
          <textarea
            value={candidateAnswerText}
            onChange={(e) => setCandidateAnswerText(e.target.value)}
            rows={12}
            className="w-full rounded-2xl border border-white/10 bg-black/50 p-4 font-mono text-xs text-white placeholder-white/40 focus:border-pink-500 focus:outline-none leading-relaxed"
          />
        </div>

        {/* RIGHT: TOPPER BENCHMARK RADAR SCORECARD */}
        <div className="rounded-2xl border border-pink-500/30 bg-pink-950/10 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
            <h3 className="text-sm font-bold text-pink-200">Topper Copy Benchmark (Rank 1-10)</h3>
            <span className="rounded-full bg-pink-500/20 px-2.5 py-0.5 text-[10px] font-bold text-pink-300">
              UPSC Examiner Scan: 5 Sec
            </span>
          </div>

          <div className="space-y-3">
            {metrics.map((m, idx) => (
              <div key={idx} className="rounded-xl border border-white/5 bg-black/40 p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white/90">{m.metricName}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      m.verdict === "Optimal"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {m.verdict} ({m.candidateValue} / {m.topperBenchmark} {m.unit})
                  </span>
                </div>
                <p className="text-[11px] text-white/60 leading-normal">{m.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
