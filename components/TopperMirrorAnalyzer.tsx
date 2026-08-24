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

interface TopperModelAnswer {
  id: string;
  paper: "GS-1" | "GS-2" | "GS-3" | "GS-4" | "Essay";
  question: string;
  marks: 10 | 15 | 125;
  topperAnswer: {
    introduction: string;
    bodySections: {
      heading: string;
      points: string[];
      diagramOrStencil?: string;
    }[];
    conclusion: string;
  };
  keyArticlesCasesOrData: string[];
  topperScoreAnnotation: string;
}

const TOPPER_MODEL_ANSWERS: TopperModelAnswer[] = [
  {
    id: "topper-gs2-governor",
    paper: "GS-2",
    question: "Discuss the essential constitutional role of the Governor as a linchpin of federal balance. In light of recent controversies regarding bill assent, suggest institutional reforms. (15 Marks, 250 Words)",
    marks: 15,
    topperAnswer: {
      introduction: "The Governor under Article 153 occupies a pivotal constitutional role, functioning both as the constitutional head of the State and as a vital link between the Union and the States, embodying the spirit of cooperative federalism.",
      bodySections: [
        {
          heading: "1. Constitutional Friction & Discretionary Boundaries",
          points: [
            "Article 163: Governor must act on the 'aid and advice' of the Council of Ministers except in matters where expressly required to exercise discretion.",
            "Article 200 Dilemma: Gubernatorial options regarding Bills (Assent, Withhold, Return for reconsideration, or Reserve for President under Art 201). Recent concerns involve sitting on bills indefinitely ('pocket veto' by delay).",
            "Shamsher Singh (1974) & Nabam Rebia (2016): Supreme Court held that gubernatorial discretion is strictly circumscribed and must not be exercised arbitrarily."
          ],
          diagramOrStencil: "[Union Government] ──(Article 153/356)──► [GOVERNOR] ◄──(Article 163 Aid & Advice)── [State Council of Ministers]"
        },
        {
          heading: "2. Landmark Judicial Clarifications",
          points: [
            "State of Punjab v. Principal Secretary (2023): SC ruled that the Governor cannot sit on bills passed by the legislature and must take timely action; if a bill is withheld, it must be returned to the House with a message as soon as possible.",
            "State of Telangana v. Secretary (2023): Reaffirmed that constitutional functionaries must exercise powers within reasonable timeframes."
          ]
        },
        {
          heading: "3. Institutional Reform Architecture",
          points: [
            "Sarkaria Commission (1988): Governor should be an eminent person outside the state, not actively involved in politics, appointed in consultation with the Chief Minister.",
            "Punchhi Commission (2010): Proposed 'local impeachment' by state legislature for removal; fixed 6-month timeframe for presidential/gubernatorial decision on bills; delete 'pleasure doctrine' arbitrary removals (B.P. Singhal 2010).",
            "2nd ARC (7th Report): Governors should act as neutral umpires and catalysts for good governance."
          ]
        }
      ],
      conclusion: "A constitutional functionary's discretion is governed by constitutional morality (B.R. Ambedkar). Implementing the Punchhi Commission's fixed timeline guidelines will strengthen cooperative and competitive federalism."
    },
    keyArticlesCasesOrData: ["Article 153, 163, 200, 201", "Shamsher Singh (1974)", "Nabam Rebia (2016)", "State of Punjab (2023)", "Sarkaria & Punchhi Commissions"],
    topperScoreAnnotation: "Topper Score: 10.5 / 15. Scannable sub-headings, explicit article citations, contemporary 2023 case laws, and commission-backed actionable roadmap."
  },
  {
    id: "topper-gs3-inclusive-growth",
    paper: "GS-3",
    question: "What do you understand by 'Inclusive Growth'? Examine the major structural challenges hindering financial and social inclusion in India. (10 Marks, 150 Words)",
    marks: 10,
    topperAnswer: {
      introduction: "Inclusive Growth implies economic growth that creates employment opportunities, ensures equitable distribution of wealth, and enhances human capabilities across all strata of society (OECD / 11th & 12th Five Year Plans).",
      bodySections: [
        {
          heading: "1. Core Structural Bottlenecks",
          points: [
            "Labor Market Dualism: ~90% informal workforce with low productivity and absence of universal social security nets.",
            "Regional & Gender Skew: Female Labor Force Participation Rate (FLFPR) at ~37% (PLFS 2023); agrarian distress with ~45% workforce generating only 18% of GDP.",
            "Digital & Credit Divide: Credit concentration in urban hubs; MSMEs face a ₹25 lakh crore credit gap."
          ],
          diagramOrStencil: "Inclusive Growth Matrix: [Economic Access (Jan Dhan/Mudra)] + [Capability Building (Skill India/Ayushman)] + [Social Security (PMSYM)]"
        },
        {
          heading: "2. Strategic Interventions & Policy Levers",
          points: [
            "JAM Trinity & PM SVANidhi: Micro-credit financial inclusion with digital transaction cashback incentives.",
            "PM Gati Shakti & PLI Scheme: Multi-modal logistics efficiency driving manufacturing jobs in Tier-2/3 cities.",
            "Aspirational Districts & Blocks Programme: NITI Aayog's convergence-based delta ranking for lagging social indicators."
          ]
        }
      ],
      conclusion: "Transitioning from poverty alleviation to capability enhancement (Amartya Sen's Capability Approach) is indispensable for achieving SDG-1 (No Poverty), SDG-8 (Decent Work), and SDG-10 (Reduced Inequalities) by 2030."
    },
    keyArticlesCasesOrData: ["PLFS 2023 FLFPR (37%)", "MSME Credit Gap", "JAM Trinity", "Aspirational Districts", "Amartya Sen Capability Approach", "SDG 1, 8, 10"],
    topperScoreAnnotation: "Topper Score: 7.5 / 10. Crisp definition, accurate PLFS data, 3-pillar diagram stencil, and forward-looking SDG linkage."
  },
  {
    id: "topper-gs4-probity-civil-service",
    paper: "GS-4",
    question: "'Probity in governance is an essential requirement for socio-economic development.' Discuss the ethical attributes essential for a public servant facing political pressure. (10 Marks, 150 Words)",
    marks: 10,
    topperAnswer: {
      introduction: "Probity refers to complete and confirmed integrity, uprightness, and adherence to highest ethical and moral standards in public life. It goes beyond mere non-corruptness to encompass active transparency, accountability, and public trust.",
      bodySections: [
        {
          heading: "1. Key Ethical Attributes for Civil Servants",
          points: [
            "Moral Courage & Fortitude: Steadfast adherence to constitutional duty despite coercive transfers or political intimidation (e.g. S.R. Sankaran's civil rights defense).",
            "Impartiality & Political Neutrality: Nolan Committee Principle of Objectivity — decisions based strictly on evidence, merit, and legal framework without partisan bias.",
            "Dedication to Public Service: Empathy and compassion for marginalized sections (Mahatma Gandhi's Talisman)."
          ]
        },
        {
          heading: "2. Institutional Mechanisms to Safeguard Probity",
          points: [
            "Rule of Law vs Rule by Law: Upholding Article 14 and administrative legality over unlawful verbal orders.",
            "Civil Services Boards: Implementing Supreme Court's mandate in Prakash Singh (2006) and TSR Subramanian (2013) for fixed tenure of key administrative postings."
          ]
        }
      ],
      conclusion: "Probity transforms a bureaucrat into a constitutional guardian. As Kautilya's Arthashastra states, 'In the happiness of his subjects lies the king's happiness; in their welfare his welfare.'"
    },
    keyArticlesCasesOrData: ["Nolan Principles of Public Life", "TSR Subramanian (2013)", "Prakash Singh (2006)", "Gandhi's Talisman", "Kautilya Arthashastra"],
    topperScoreAnnotation: "Topper Score: 7.5 / 10. Philosophical precision, concrete case precedents, Nolan principles, and classic administrative thought quote."
  }
];

const WRITING_FRAMEWORKS = [
  {
    name: "PESTLE Dimensional Matrix",
    category: "General Studies 1, 2, 3",
    description: "Deconstruct multi-dimensional questions into 6 distinct analytical buckets.",
    dimensions: [
      { label: "P - Political / Governance", desc: "Federalism, separation of powers, legislation, policy intent." },
      { label: "E - Economic / Fiscal", desc: "GDP impact, fiscal deficit, Capex multiplier, ease of doing business, inflation." },
      { label: "S - Social / Demographic", desc: "Gender parity, vulnerable sections (SC/ST/Minorities), human capital index." },
      { label: "T - Technological / Digital", desc: "Digital public infrastructure (DPI), AI adoption, R&D, patent landscape." },
      { label: "L - Legal / Constitutional", desc: "Fundamental Rights, landmark Supreme Court precedents, international conventions." },
      { label: "E - Environmental / Ecological", desc: "Climate resilience, carbon footprint, biodiversity loss, COP commitments." }
    ]
  },
  {
    name: "Ethical Decision-Making (GS-4 Case Studies)",
    category: "Ethics Case Studies",
    description: "Standardized 5-step framework for resolving ethical dilemmas in governance.",
    dimensions: [
      { label: "1. Stakeholder Mapping", desc: "Identify primary (direct victims/beneficiaries) and secondary (institutions/society) stakeholders." },
      { label: "2. Ethical Dilemmas", desc: "Duty vs Compassion, Procedural Rigidity vs Substantive Justice, Short-term Relief vs Long-term Sustainability." },
      { label: "3. Course of Action Options", desc: "List 3 viable options; evaluate pros, cons, and ethical justification for each." },
      { label: "4. Chosen Course of Action", desc: "Adopt the legally sound and ethically robust path; outline mitigation measures for trade-offs." },
      { label: "5. Long-term Preventive Reforms", desc: "Suggest structural, legal, and systemic SOP improvements to prevent recurrence." }
    ]
  }
];

export default function TopperMirrorAnalyzer() {
  const [activeTab, setActiveTab] = useState<"analyzer" | "model_answers" | "frameworks">("analyzer");
  const [selectedModelAnswer, setSelectedModelAnswer] = useState<TopperModelAnswer>(TOPPER_MODEL_ANSWERS[0]);

  const [candidateAnswerText, setCandidateAnswerText] = useState<string>(
    `The Office of the Governor under Article 153 is meant to be a linchpin of constitutional federalism. However, issues regarding discretionary powers under Article 163 and delay in assent to bills under Article 200 have caused friction.\n\n1. Discretionary Boundaries: In Nabam Rebia (2016) and Shamsher Singh (1974), the Supreme Court held that the Governor must act on the aid and advice of the Council of Ministers except in specified areas.\n\n2. Delay in Assent: In State of Punjab v. Principal Secretary (2023), the SC clarified that Governors cannot sit on bills indefinitely under Article 200.\n\n3. Recommendations of Sarkaria Commission (1988) and Punchhi Commission (2010): The Governor should be an eminent person from outside the state, appointed after consulting the Chief Minister, and should act as a neutral umpire.\n\nConclusion: Ensuring fixed timeframes for bill assent and strengthening the Inter-State Council under Article 263 will uphold cooperative federalism.`
  );

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

  // Overall Structural Scannability Score out of 10
  const overallScore = Math.min(
    10,
    Math.round(
      (bulletCount >= 3 ? 2.5 : 1) +
        (hasConstitutionalArticles >= 3 ? 2.5 : 1) +
        (hasJudicialCases >= 2 ? 2.5 : 1) +
        (hasCommissions >= 1 ? 2.5 : 1)
    )
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080511] p-5 shadow-2xl backdrop-blur-2xl space-y-6">
      {/* HEADER & TAB SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-pink-500/20 text-sm">
              🪞
            </span>
            <h2 className="font-mono text-base font-black tracking-wide text-white sm:text-lg">
              Mains Answer Topper Mirror & Model Answer Cloner
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-0.5">
            Compare your written drafts against UPSC Rank 1–10 copies, analyze scannability metrics, and clone topper structures
          </p>
        </div>

        {/* 3 TABS */}
        <div className="flex flex-wrap rounded-2xl border border-white/10 bg-white/[0.03] p-1 gap-1">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("analyzer");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold transition ${
              activeTab === "analyzer"
                ? "bg-pink-600 text-white shadow-lg shadow-pink-950/50"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>📊</span>
            <span>Live Topper Analyzer</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("model_answers");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold transition ${
              activeTab === "model_answers"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-950/50"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>🏆</span>
            <span>Topper Model Copies ({TOPPER_MODEL_ANSWERS.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("frameworks");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold transition ${
              activeTab === "frameworks"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-950/50"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>📐</span>
            <span>Writing Frameworks & Stencils</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: LIVE TOPPER ANALYZER
          ===================================================================== */}
      {activeTab === "analyzer" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* LEFT: CANDIDATE ANSWER SCRIPT EDITOR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-white/70 block">
                ✍️ Candidate Answer Script (Type or Paste for Real-Time Analysis):
              </label>
              <div className="flex items-center gap-2 font-mono text-xs text-pink-300">
                <span>Words: {wordCount}</span>
                <span>•</span>
                <span>Target: 150–250W</span>
              </div>
            </div>
            <textarea
              value={candidateAnswerText}
              onChange={(e) => setCandidateAnswerText(e.target.value)}
              rows={13}
              className="w-full rounded-2xl border border-white/10 bg-black/50 p-4 font-mono text-xs text-white placeholder-white/40 focus:border-pink-500 focus:outline-none leading-relaxed"
              placeholder="Paste your 10M / 15M answer draft here to evaluate structural scannability..."
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setCandidateAnswerText(
                    `The Office of the Governor under Article 153 is meant to be a linchpin of constitutional federalism. However, issues regarding discretionary powers under Article 163 and delay in assent to bills under Article 200 have caused friction.\n\n1. Discretionary Boundaries: In Nabam Rebia (2016) and Shamsher Singh (1974), the Supreme Court held that the Governor must act on the aid and advice of the Council of Ministers except in specified areas.\n\n2. Delay in Assent: In State of Punjab v. Principal Secretary (2023), the SC clarified that Governors cannot sit on bills indefinitely under Article 200.\n\n3. Recommendations of Sarkaria Commission (1988) and Punchhi Commission (2010): The Governor should be an eminent person from outside the state, appointed after consulting the Chief Minister, and should act as a neutral umpire.\n\nConclusion: Ensuring fixed timeframes for bill assent and strengthening the Inter-State Council under Article 263 will uphold cooperative federalism.`
                  );
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] text-white/70 hover:bg-white/10 transition"
              >
                Load Sample GS-2 Script
              </button>
              <button
                onClick={() => setCandidateAnswerText("")}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] text-white/70 hover:bg-white/10 transition"
              >
                Clear Script
              </button>
            </div>
          </div>

          {/* RIGHT: BENCHMARK SCORECARD */}
          <div className="space-y-4 rounded-2xl border border-pink-500/30 bg-pink-950/10 p-5">
            <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400">
                  UPSC Rank 1–10 Mirror
                </span>
                <h3 className="text-sm font-black text-white">Structural Scannability Score</h3>
              </div>
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-pink-500/20 border border-pink-500/40 font-mono text-base font-black text-pink-300">
                {overallScore}/10
              </div>
            </div>

            <div className="space-y-3">
              {metrics.map((m, idx) => (
                <div key={idx} className="rounded-xl border border-white/5 bg-black/40 p-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{m.metricName}</span>
                    <span
                      className={`font-mono text-[10px] font-black uppercase ${
                        m.verdict === "Optimal" ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {m.verdict}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-white/60">
                    <span>
                      Your: <strong className="text-white">{m.candidateValue}</strong> {m.unit}
                    </span>
                    <span>
                      Topper: <strong className="text-pink-300">{m.topperBenchmark}</strong> {m.unit}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/70 pt-0.5">{m.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: TOPPER MODEL COPIES LIBRARY
          ===================================================================== */}
      {activeTab === "model_answers" && (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-2">
            {TOPPER_MODEL_ANSWERS.map((ans) => (
              <button
                key={ans.id}
                onClick={() => {
                  sound.playHover();
                  setSelectedModelAnswer(ans);
                }}
                className={`w-full rounded-2xl border p-3.5 text-left transition ${
                  selectedModelAnswer.id === ans.id
                    ? "border-purple-500 bg-purple-500/20 text-white shadow-lg shadow-purple-950/40"
                    : "border-white/5 bg-white/[0.02] text-white/70 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-md">
                    {ans.paper}
                  </span>
                  <span className="text-[10px] font-mono text-white/50">{ans.marks} Marks</span>
                </div>
                <p className="mt-2 text-xs font-bold text-white line-clamp-2">{ans.question}</p>
              </button>
            ))}
          </div>

          {/* RIGHT: MODEL ANSWER PREVIEW */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/10 p-5 space-y-4">
            <div className="border-b border-purple-500/20 pb-3">
              <span className="text-xs font-mono font-bold text-purple-400">
                UPSC Model Answer • {selectedModelAnswer.paper} ({selectedModelAnswer.marks} Marks)
              </span>
              <h3 className="mt-1 text-sm font-bold text-white leading-snug">
                {selectedModelAnswer.question}
              </h3>
            </div>

            {/* INTRO */}
            <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1 text-xs">
              <span className="font-mono text-[10px] font-bold uppercase text-purple-300">
                📍 Introduction Hook (Context & Definition)
              </span>
              <p className="text-white/90 leading-relaxed">{selectedModelAnswer.topperAnswer.introduction}</p>
            </div>

            {/* BODY SECTIONS */}
            <div className="space-y-3">
              {selectedModelAnswer.topperAnswer.bodySections.map((sec, i) => (
                <div key={i} className="rounded-xl border border-white/5 bg-black/30 p-3.5 space-y-2 text-xs">
                  <h4 className="font-bold text-purple-300">{sec.heading}</h4>
                  <ul className="space-y-1.5 text-white/85">
                    {sec.points.map((pt, j) => (
                      <li key={j} className="flex items-start gap-1.5">
                        <span className="text-purple-400 font-bold">▸</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  {sec.diagramOrStencil && (
                    <div className="mt-2 rounded-lg border border-purple-500/20 bg-purple-950/30 p-2 font-mono text-[11px] text-purple-200">
                      📐 {sec.diagramOrStencil}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CONCLUSION */}
            <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1 text-xs">
              <span className="font-mono text-[10px] font-bold uppercase text-emerald-300">
                🎯 Forward-Looking Conclusion (Way Forward / SDG / Constitutional Morality)
              </span>
              <p className="text-white/90 leading-relaxed">{selectedModelAnswer.topperAnswer.conclusion}</p>
            </div>

            {/* ANNOTATIONS */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-purple-500/20 text-xs">
              <div className="flex flex-wrap gap-1.5">
                {selectedModelAnswer.keyArticlesCasesOrData.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[11px] text-pink-300 font-bold">
                {selectedModelAnswer.topperScoreAnnotation}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: WRITING FRAMEWORKS & STENCILS
          ===================================================================== */}
      {activeTab === "frameworks" && (
        <div className="grid gap-4 md:grid-cols-2">
          {WRITING_FRAMEWORKS.map((fw, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-cyan-500/30 bg-cyan-950/10 p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {fw.category}
                </span>
                <span className="text-xs">📐</span>
              </div>
              <h3 className="text-sm font-black text-white">{fw.name}</h3>
              <p className="text-xs text-white/60">{fw.description}</p>

              <div className="space-y-2 pt-2">
                {fw.dimensions.map((dim, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/5 bg-black/40 p-2.5 text-xs space-y-0.5"
                  >
                    <span className="font-bold text-cyan-300">{dim.label}</span>
                    <p className="text-white/70 text-[11px]">{dim.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
