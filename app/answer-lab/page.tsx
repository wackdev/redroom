"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import { UserSessionManager } from "@/lib/core/user-context";

interface MainsQuestion {
  id: string;
  paper: "GS-1" | "GS-2" | "GS-3" | "GS-4" | "Essay";
  marks: 10 | 15 | 20;
  targetWords: 150 | 250 | 1000;
  timeLimitMinutes: number;
  question: string;
  contextHint: string;
  modelOutline: string[];
  topperAnswerSnippet: string;
}

const QUESTION_BANK: MainsQuestion[] = [
  {
    id: "q-gs2-01",
    paper: "GS-2",
    marks: 15,
    targetWords: 250,
    timeLimitMinutes: 11,
    question: "Examine the role of the Finance Commission in balancing fiscal federalism amid increasing demands from States for greater fiscal autonomy.",
    contextHint: "Article 280, 15th/16th Finance Commission TOR, Centrally Sponsored Schemes (CSS), Cess & Surcharges distortion.",
    modelOutline: [
      "Introduction: Constitutional mandate under Article 280 & key role as balancing wheel of fiscal federalism.",
      "Vertical Devolution: Devolution share trends (41%), rising reliance on cesses & surcharges outside divisible pool.",
      "Horizontal Devolution: Equity vs Efficiency dilemma (Demographic performance vs Income distance criteria).",
      "Key Friction Areas: Performance-linked grants, debt limits under FRBM, conditional tied transfers.",
      "Way Forward: Expanding divisible pool, permanent secretariat for FC, reforming GST Council-FC alignment."
    ],
    topperAnswerSnippet: "The Finance Commission operates as the 'Constitutional adjudicator of fiscal resources' between the Centre and States (Dr. B.R. Ambedkar). While the 15th FC maintained vertical devolution at 41%, the effective transfer to states has eroded due to the expansion of cesses from 9% in 2011 to nearly 20% of gross tax revenue in 2024..."
  },
  {
    id: "q-gs3-01",
    paper: "GS-3",
    marks: 15,
    targetWords: 250,
    timeLimitMinutes: 11,
    question: "Discuss the transformative potential of Artificial Intelligence in India's agricultural supply chains while highlighting cybersecurity and data sovereignty concerns.",
    contextHint: "Agritech, Precision Farming, IndiaAI Mission, e-NAM integration, Farmer Data Privacy.",
    modelOutline: [
      "Introduction: State of Indian agriculture (fragmented supply chain, post-harvest losses ~15-20%).",
      "AI Transformative Solutions: Yield forecasting, automated quality grading via computer vision, hyper-local pest warnings.",
      "Supply Chain Optimization: Dynamic pricing on e-NAM, cold storage predictive telemetry, disintermediation of middlemen.",
      "Risks & Vulnerabilities: Cloud data dependency on foreign hyperscalers, ransomware threats to mandi networks, algorithmic bias.",
      "Way Forward: AgriStack with DPDP Act compliance, open-source AI models via Bhashini, farmer-owned data trusts."
    ],
    topperAnswerSnippet: "AI in agriculture represents a leap from 'input-intensive' to 'knowledge-intensive' farming. Platforms utilizing computer vision can grade produce at the farmgate, compressing the 5-layer intermediary chain to direct mandi access. However, sovereign control over the 14-crore farmer digital identity baseline under AgriStack remains paramount..."
  },
  {
    id: "q-gs4-01",
    paper: "GS-4",
    marks: 10,
    targetWords: 150,
    timeLimitMinutes: 7,
    question: "Distinguish between 'Rule of Law' and 'Rule by Law'. How can an upright civil servant resist illegal verbal orders without violating administrative discipline?",
    contextHint: "Constitutional morality, 2nd ARC ethics, Section 3(3) of All India Services (Conduct) Rules 1968.",
    modelOutline: [
      "Rule of Law vs Rule by Law: Substantive justice & constitutional restraint vs weaponization of legal instruments.",
      "Ethical Dilemma: Hierarchy vs Conscience, Public Interest vs Superior Compliance.",
      "Operational Safeguards: AIS Conduct Rules mandate requiring written orders for controversial directives.",
      "Institutional Redress: Recording dissent on file notes, escalating via confidential channels, whistleblowing protections."
    ],
    topperAnswerSnippet: "Rule of Law embodies Lon Fuller's inner morality of law and diceyan equality before law; Rule by Law uses legislation merely as an instrument of executive arbitrariness. Under Rule 3(3) of AIS Conduct Rules 1968, an officer receiving oral instructions from a superior must insist on written confirmation before execution, thereby creating an audit trail..."
  },
  {
    id: "q-gs1-01",
    paper: "GS-1",
    marks: 10,
    targetWords: 150,
    timeLimitMinutes: 7,
    question: "Evaluate how the physical geography of the Western Ghats determines both its ecological biodiversity and its vulnerability to climate-induced landslides.",
    contextHint: "Orographic rainfall, Gadgil/Kasturirangan Committee, basaltic weathered regolith, anthropogenic degradation.",
    modelOutline: [
      "Geomorphic Setting: Escarpment structure, steep western slopes facing South-West monsoon winds.",
      "Ecological Wealth: UNESCO World Heritage site, 8th hottest global biodiversity hotspot with high endemism.",
      "Landslide Vulnerability: Extreme localized rainfall (>3000mm), slope instability, quarrying, monoculture plantations.",
      "Mitigation: Ecologically Sensitive Area (ESA) demarcation, indigenous bio-engineering on cut slopes."
    ],
    topperAnswerSnippet: "The Western Ghats act as a giant topographical barrier intercepting the Arabian Sea branch of the SW monsoon, causing heavy orographic precipitation. The combination of steep basaltic escarpments, intensely weathered soil regolith, and deforestation for commercial tea/rubber estates triggers catastrophic debris flows during intense precipitation pulses..."
  }
];

const DIMENSION_RULES: Record<string, string[]> = {
  "Political & Governance": ["parliament", "executive", "judiciary", "constitution", "federalism", "article", "governance", "democracy", "policy", "amendment", "act"],
  "Economic & Fiscal": ["gdp", "fiscal", "inflation", "tax", "revenue", "investment", "growth", "budget", "finance", "trade", "export", "supply chain"],
  "Social & Gender": ["society", "women", "gender", "poverty", "health", "education", "caste", "tribal", "vulnerable", "inclusion", "community"],
  "Environmental & Climate": ["climate", "environment", "carbon", "biodiversity", "conservation", "sustainable", "pollution", "green", "ecology", "cop"],
  "Technological & Digital": ["technology", "digital", "ai", "cyber", "data", "internet", "telecom", "satellite", "automation", "innovation"],
  "Ethical & Human Values": ["ethics", "integrity", "transparency", "accountability", "justice", "morality", "empathy", "dilemma", "conduct", "values"],
  "Legal & Regulatory": ["statutory", "tribunal", "compliance", "law", "order", "supreme court", "high court", "legislation", "precedent", "rule"],
  "Global & Strategic": ["international", "global", "bilateral", "un", "wto", "treaty", "geopolitics", "foreign policy", "multilateral", "diplomacy"]
};

export default function AnswerLabPage() {
  const [user] = useState(UserSessionManager.getActiveUser());
  const [selectedQuestion, setSelectedQuestion] = useState<MainsQuestion>(QUESTION_BANK[0]);
  const [answerText, setAnswerText] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer Lifecycle
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Word count and WPM
  const words = answerText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const targetWords = selectedQuestion.targetWords;
  const progressPercent = Math.min(100, Math.round((wordCount / targetWords) * 100));

  const minutesElapsed = elapsedSeconds / 60;
  const currentWPM = minutesElapsed > 0 ? Math.round(wordCount / minutesElapsed) : 0;
  const targetTimeSeconds = selectedQuestion.timeLimitMinutes * 60;
  const remainingTimeSeconds = Math.max(0, targetTimeSeconds - elapsedSeconds);

  // Multi-dimensional PESTLE Extraction
  const detectedDimensions = Object.entries(DIMENSION_RULES).filter(([, keywords]) => {
    const textLower = answerText.toLowerCase();
    return keywords.some(k => textLower.includes(k));
  }).map(([dimension]) => dimension);

  // Structural checks
  const firstParagraph = answerText.trim().split("\n\n")[0] || "";
  const hasIntro = firstParagraph.length > 40;
  const hasConclusion = answerText.toLowerCase().includes("way forward") ||
    answerText.toLowerCase().includes("conclusion") ||
    answerText.toLowerCase().includes("thus,") ||
    answerText.toLowerCase().includes("in fine");

  const startWriting = () => {
    setIsTimerRunning(true);
    setIsCompleted(false);
  };

  const finishWriting = () => {
    setIsTimerRunning(false);
    setIsCompleted(true);
  };

  const resetWriting = (question: MainsQuestion) => {
    setSelectedQuestion(question);
    setAnswerText("");
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    setIsCompleted(false);
    setShowModelAnswer(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0a0c16 0%, #0d1326 50%, #080a14 100%)" }}>
      <AppUniversalHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-semibold uppercase tracking-wider"
            style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399" }}>
            <span>✍️</span> UPSC Mains Speed & Multi-Dimensional Lab
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Mains Answer Writing Speed Lab
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            In UPSC Mains, you must write <span className="text-emerald-400 font-semibold">4,000 words in 3 hours (22 WPM)</span> while maintaining multidimensional depth. Train under exact timed pressure with live dimension diagnostics.
          </p>
        </div>

        {/* Question Selector Carousel */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 mb-6 custom-scrollbar">
          {QUESTION_BANK.map((q) => {
            const isSelected = selectedQuestion.id === q.id;
            return (
              <button
                key={q.id}
                onClick={() => resetWriting(q)}
                className="px-4 py-2.5 rounded-2xl text-left whitespace-nowrap transition-all shrink-0 flex items-center gap-3"
                style={{
                  background: isSelected ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.03)",
                  border: isSelected ? "1px solid rgba(52,211,153,0.5)" : "1px solid rgba(255,255,255,0.06)",
                  color: isSelected ? "#6ee7b7" : "#9ca3af"
                }}>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/10 text-white">{q.paper}</span>
                <span className="text-xs font-medium">{q.marks}M ({q.targetWords}W)</span>
              </button>
            );
          })}
        </div>

        {/* Main Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Question Details & Diagnostics */}
          <div className="lg:col-span-4 space-y-5">
            {/* Question Card */}
            <div className="p-6 rounded-3xl backdrop-blur-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  {selectedQuestion.paper} • {selectedQuestion.marks} Marks
                </span>
                <span className="text-xs text-gray-400 font-semibold">
                  Target: {selectedQuestion.timeLimitMinutes} mins ({selectedQuestion.targetWords} words)
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-relaxed mb-4">
                {selectedQuestion.question}
              </h3>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-300">
                <span className="text-emerald-400 font-semibold">Context Keywords: </span>
                {selectedQuestion.contextHint}
              </div>
            </div>

            {/* Live Analytics Dashboard */}
            <div className="p-6 rounded-3xl backdrop-blur-xl space-y-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <span>⚡</span> Real-Time Writing Telemetry
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 text-center">
                  <div className="text-2xl font-black text-white">{wordCount}</div>
                  <div className="text-[11px] text-gray-400">Words Written ({targetWords} goal)</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 text-center">
                  <div className="text-2xl font-black text-emerald-400">{currentWPM}</div>
                  <div className="text-[11px] text-gray-400">Writing Speed (WPM)</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 text-center">
                  <div className="text-2xl font-black text-blue-400">{formatTime(elapsedSeconds)}</div>
                  <div className="text-[11px] text-gray-400">Time Elapsed</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 text-center">
                  <div className={`text-2xl font-black ${remainingTimeSeconds === 0 ? "text-red-400" : "text-amber-400"}`}>
                    {formatTime(remainingTimeSeconds)}
                  </div>
                  <div className="text-[11px] text-gray-400">Time Remaining</div>
                </div>
              </div>

              {/* Word Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Target Fulfillment</span>
                  <span className="font-bold text-white">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progressPercent}%`,
                      background: progressPercent >= 100 ? "#10b981" : "linear-gradient(90deg, #3b82f6, #10b981)"
                    }}
                  />
                </div>
              </div>
            </div>

            {/* PESTLE Dimensions Scanner */}
            <div className="p-6 rounded-3xl backdrop-blur-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <span>🌐</span> Multidimensional Coverage ({detectedDimensions.length}/8)
                </h4>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  {detectedDimensions.length >= 4 ? "Excellent Depth" : "Need More Dims"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(DIMENSION_RULES).map((dim) => {
                  const isDetected = detectedDimensions.includes(dim);
                  return (
                    <span
                      key={dim}
                      className="text-xs px-3 py-1 rounded-xl font-medium transition-all"
                      style={{
                        background: isDetected ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.04)",
                        border: isDetected ? "1px solid rgba(52,211,153,0.4)" : "1px solid rgba(255,255,255,0.06)",
                        color: isDetected ? "#6ee7b7" : "#64748b"
                      }}>
                      {isDetected ? "✓ " : "• "}{dim}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Writing Canvas & Evaluation */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                minHeight: "580px"
              }}>
              
              {/* Canvas Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isTimerRunning ? "bg-emerald-400 animate-pulse" : "bg-gray-600"}`} />
                  <span className="text-xs font-bold text-gray-300">
                    {isTimerRunning ? "LIVE RECORDING SESSION" : isCompleted ? "SESSION COMPLETED" : "READY TO WRITE"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!isTimerRunning && !isCompleted && (
                    <button
                      onClick={startWriting}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-lg"
                      style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                      ▶ Start Timed Drill
                    </button>
                  )}
                  {isTimerRunning && (
                    <button
                      onClick={finishWriting}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-lg"
                      style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
                      ⏹ Finish & Evaluate
                    </button>
                  )}
                  <button
                    onClick={() => resetWriting(selectedQuestion)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 transition-all">
                    Reset
                  </button>
                </div>
              </div>

              {/* Text Writing Input */}
              <div className="flex-1 my-4">
                <textarea
                  value={answerText}
                  onChange={(e) => {
                    setAnswerText(e.target.value);
                    if (!isTimerRunning && !isCompleted && e.target.value.length > 0) {
                      setIsTimerRunning(true);
                    }
                  }}
                  disabled={isCompleted}
                  placeholder="Type your UPSC answer here... Follow standard structure: 1) Definition / Context Intro (20-30 words) -> 2) Body with Subheadings, Bullet Points, and Scheme / Case Law citations -> 3) Way Forward & Sustainable Conclusion..."
                  className="w-full h-full min-h-[420px] bg-transparent text-sm text-gray-100 placeholder-gray-600 leading-relaxed resize-none focus:outline-none custom-scrollbar p-2"
                />
              </div>

              {/* Bottom Canvas Footer: Structure Badges */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg font-semibold ${hasIntro ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-gray-500"}`}>
                    {hasIntro ? "✓ Introduction Detected" : "• Missing Introduction"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg font-semibold ${hasConclusion ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-gray-500"}`}>
                    {hasConclusion ? "✓ Way Forward / Conclusion" : "• Missing Conclusion"}
                  </span>
                </div>

                <button
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                  className="px-4 py-1.5 rounded-xl font-semibold text-xs text-blue-300 bg-blue-500/20 border border-blue-500/30 transition-all hover:bg-blue-500/30">
                  {showModelAnswer ? "Hide Model Framework" : "💡 View Topper Framework"}
                </button>
              </div>
            </div>

            {/* Model Framework & Topper Answer Accordion */}
            {showModelAnswer && (
              <div className="p-6 rounded-3xl backdrop-blur-xl space-y-4"
                style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(96,165,250,0.3)" }}>
                <h4 className="text-sm font-bold text-blue-300 flex items-center gap-2">
                  <span>🏆</span> Standard Model Structure & Topper Snippet
                </h4>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Blueprint Skeleton:</span>
                  <ul className="space-y-1.5">
                    {selectedQuestion.modelOutline.map((item, i) => (
                      <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-xs font-bold text-emerald-400 block mb-1.5">Model Topper Introduction & Approach:</span>
                  <p className="text-xs text-gray-300 italic leading-relaxed">
                    "{selectedQuestion.topperAnswerSnippet}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
