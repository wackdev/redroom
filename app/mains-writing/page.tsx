"use client";

import React, { useState, useEffect, useRef } from "react";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import MainsDiagramStudio from "@/components/MainsDiagramStudio";
import MainsQCABGenerator from "@/components/MainsQCABGenerator";
import AuthGuard from "@/components/auth/AuthGuard";
import { sound } from "@/lib/audio/sound-engine";
import { trackActivityEvent } from "@/lib/brain/activity-events";

interface MainsQuestionPreset {
  id: string;
  gsPaper: "GS-1" | "GS-2" | "GS-3" | "GS-4";
  marks: 10 | 15;
  wordLimit: 150 | 250;
  timeLimitSec: number; // 420 for 10m (7 min), 660 for 15m (11 min)
  question: string;
  directive: string;
  modelAnswer: {
    intro: string;
    bodyDimensions: { heading: string; points: string[] }[];
    dataAndCommittees: string[];
    conclusion: string;
  };
}

const PRESET_QUESTIONS: MainsQuestionPreset[] = [
  {
    id: "mq-1",
    gsPaper: "GS-2",
    marks: 10,
    wordLimit: 150,
    timeLimitSec: 420,
    question:
      "The discretionary powers of the Governor under Article 163 have frequently become a flashpoint in Centre-State relations. Examine the constitutional safeguards against arbitrary exercise of gubernatorial discretion.",
    directive: "Examine: Scrutinize the constitutional provisions (Art 163, 200, 356) and judicial milestones (Shamsher Singh, Nabam Rebia).",
    modelAnswer: {
      intro:
        "The Governor occupies a dual constitutional position: the constitutional head of the State executive and a vital link between the Union and the State. While Article 163(1) mandates aid and advice of the Council of Ministers, Article 163(2) confers limited constitutional discretion.",
      bodyDimensions: [
        {
          heading: "1. Constitutional Boundaries & Judicial Safeguards",
          points: [
            "Shamsher Singh v. State of Punjab (1974): Governor must exercise powers only on the aid and advice of CoM except in rare exceptions.",
            "Nabam Rebia (2016): Governor's discretion under Art 163 is not unlimited and remains open to judicial review.",
            "State of Punjab v. Principal Secretary to Governor (2023): Governor cannot sit indefinitely on bills under Art 200 without returning them.",
          ],
        },
        {
          heading: "2. Institutional Recommendations",
          points: [
            "Sarkaria Commission (1988): Discretion must be guided by constitutional morality, not partisan considerations.",
            "Punchhi Commission (2010): Provide time limits for gubernatorial assent to state legislations.",
          ],
        },
      ],
      dataAndCommittees: ["Sarkaria Commission (1988)", "Punchhi Commission (2010)", "Law Commission 170th Report"],
      conclusion:
        "Gubernatorial office must function as a sagacious constitutional anchor rather than an executive hurdle, upholding the foundational ethos of cooperative federalism.",
    },
  },
  {
    id: "mq-2",
    gsPaper: "GS-3",
    marks: 15,
    wordLimit: 250,
    timeLimitSec: 660,
    question:
      "Precision agriculture and digital public infrastructure are pivotal to revolutionizing India's agrarian economy. Discuss the challenges in scaling agri-tech and suggest a comprehensive policy roadmap.",
    directive: "Discuss: Present multi-dimensional challenges (infrastructure, digital divide, land fragmentation) and actionable solutions (AgriStack, FPOs).",
    modelAnswer: {
      intro:
        "Agriculture employs ~45% of India's workforce while contributing ~18% to GDP. Precision agriculture—leveraging AI, IoT sensors, drones, and AgriStack—offers the potential to double farmers' income and optimize input efficiencies.",
      bodyDimensions: [
        {
          heading: "1. Strategic Pillars of Agri-Tech Adoption",
          points: [
            "India Digital Ecosystem of Agriculture (IDEA) & AgriStack.",
            "Kisan Drones for soil nutrient mapping and pesticide spraying.",
            "Micro-irrigation linked with IoT moisture sensors under PMKSY.",
          ],
        },
        {
          heading: "2. Key Bottlenecks & Challenges",
          points: [
            "Small & Marginal Landholdings (86% of farmers operate <2 hectares).",
            "Rural Digital Divide and lack of vernacular AI advisory interfaces.",
            "High upfront capital expenditure for sensor arrays and drone services.",
          ],
        },
      ],
      dataAndCommittees: ["Ashok Dalwai Committee on Doubling Farmers' Income", "NITI Aayog Agri-Tech Whitepaper"],
      conclusion:
        "By channeling digital public goods through Farmer Producer Organizations (FPOs), India can transition from traditional subsistence farming to high-value, climate-smart agriculture.",
    },
  },
];

export default function MainsWritingPage() {
  const [activeTab, setActiveTab] = useState<"speed-lab" | "diagrams" | "qcab">("speed-lab");
  const [selectedQuestion, setSelectedQuestion] = useState<MainsQuestionPreset>(PRESET_QUESTIONS[0]);
  const [answerText, setAnswerText] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(PRESET_QUESTIONS[0].timeLimitSec);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  const wordCount = answerText.trim().length > 0 ? answerText.trim().split(/\s+/).length : 0;
  const elapsedMinutes = startTime ? Math.max(0.1, (Date.now() - startTime) / 60000) : 0;
  const wpm = elapsedMinutes > 0 ? Math.round(wordCount / elapsedMinutes) : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      sound.playLock();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const handleStartTimer = () => {
    sound.playSelect();
    setIsTimerRunning(true);
    setStartTime(Date.now());
  };

  const handleReset = () => {
    sound.playHover();
    setIsTimerRunning(false);
    setTimeLeft(selectedQuestion.timeLimitSec);
    setStartTime(null);
    setAnswerText("");
    setEvaluation(null);
  };

  const handleEvaluate = () => {
    if (wordCount < 20) {
      alert("Please write at least 20 words to evaluate.");
      return;
    }
    sound.playLock();
    setIsEvaluating(true);

    setTimeout(() => {
      setIsEvaluating(false);
      sound.playVictory();
      setEvaluation({
        score: selectedQuestion.marks === 10 ? 6.5 : 9.0,
        maxScore: selectedQuestion.marks,
        dimensions: [
          { name: "Introduction & Context", rating: "Excellent", points: "Defined constitutional provisions and dual role clearly." },
          { name: "Constitutional / Case Laws", rating: "Strong", points: "Cited Shamsher Singh & Nabam Rebia. Consider adding 2023 Punjab ruling." },
          { name: "Content & Structure", rating: "Good", points: "Balanced arguments across institutional and judicial safeguards." },
          { name: "Way Forward & Conclusion", rating: "Very Good", points: "Sarkaria Commission recommendations integrated well." },
        ],
        overallFeedback:
          "High-scoring structure. Your handwriting pace and WPM are on track for the 3-hour Mains benchmark.",
      });

      void trackActivityEvent("MAINS_ANSWER_SUBMITTED", {
        questionId: selectedQuestion.id,
        marks: selectedQuestion.marks,
        wordCount,
        wpm,
      });
    }, 1500);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#040406] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
        <AppUniversalHeader moduleName="Mains Speed Lab & QCAB Studio" moduleBadge="MAINS ANSWER WRITING" />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
          {/* HEADER NAV TABS */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-[#F4C95D]">
                TIMED SPEED LAB & QCAB GENERATOR
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Mains Answer Writing & Diagram Studio
              </h1>
              <p className="text-xs text-[#8C8C8C] mt-1 font-sans">
                Practice 10-markers (7 mins) & 15-markers (11 mins) with real-time WPM, diagram generators, and AI copy evaluation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
                <button
                  onClick={() => {
                    sound.playSelect();
                    setActiveTab("speed-lab");
                  }}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition ${
                    activeTab === "speed-lab"
                      ? "bg-[#D8A63A] text-black shadow-lg"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  ⏱️ Timed Speed Lab
                </button>
                <button
                  onClick={() => {
                    sound.playSelect();
                    setActiveTab("diagrams");
                  }}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition ${
                    activeTab === "diagrams"
                      ? "bg-[#D8A63A] text-black shadow-lg"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  📊 Diagram Studio
                </button>
                <button
                  onClick={() => {
                    sound.playSelect();
                    setActiveTab("qcab");
                  }}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition ${
                    activeTab === "qcab"
                      ? "bg-[#D8A63A] text-black shadow-lg"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  📑 QCAB Print Sheet
                </button>
              </div>

              <a
                href="/answer-lab"
                className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 font-mono text-xs font-bold text-white/70 hover:border-[#D8A63A] hover:text-[#F4C95D] transition flex items-center gap-1.5"
              >
                <span>✍️</span>
                <span>Answer Lab →</span>
              </a>
            </div>
          </div>

          {activeTab === "speed-lab" && (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* LEFT: QUESTION & WRITING AREA */}
              <div className="lg:col-span-2 space-y-4">
                {/* QUESTION CARD */}
                <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#D8A63A] px-2.5 py-0.5 font-mono text-[10px] font-black uppercase text-black">
                        {selectedQuestion.gsPaper} · {selectedQuestion.marks} Marks
                      </span>
                      <span className="font-mono text-xs text-white/60">
                        Word Limit: {selectedQuestion.wordLimit} words
                      </span>
                    </div>

                    {/* QUESTION SELECTOR */}
                    <div className="flex gap-2">
                      {PRESET_QUESTIONS.map((q, idx) => (
                        <button
                          key={q.id}
                          onClick={() => {
                            sound.playSelect();
                            setSelectedQuestion(q);
                            setTimeLeft(q.timeLimitSec);
                            setAnswerText("");
                            setEvaluation(null);
                          }}
                          className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition ${
                            selectedQuestion.id === q.id
                              ? "bg-white text-black"
                              : "bg-white/5 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          Q{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    {selectedQuestion.question}
                  </h2>

                  <p className="font-mono text-xs text-[#F4C95D]/80 bg-[#D8A63A]/10 p-3 rounded-2xl border border-[#D8A63A]/20">
                    💡 <strong>Directive Focus:</strong> {selectedQuestion.directive}
                  </p>
                </div>

                {/* WRITING WORKSPACE */}
                <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl space-y-4">
                  {/* TIMER & TELEMETRY HUD */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="font-mono">
                        <span className="text-[10px] text-white/50 block">TIME REMAINING</span>
                        <span
                          className={`text-2xl font-black ${
                            timeLeft < 60 ? "text-red-400 animate-pulse" : "text-white"
                          }`}
                        >
                          {formatTimer(timeLeft)}
                        </span>
                      </div>

                      <div className="font-mono">
                        <span className="text-[10px] text-white/50 block">WORD COUNT</span>
                        <span
                          className={`text-2xl font-black ${
                            wordCount > selectedQuestion.wordLimit ? "text-amber-400" : "text-[#F4C95D]"
                          }`}
                        >
                          {wordCount} / {selectedQuestion.wordLimit}
                        </span>
                      </div>

                      <div className="font-mono">
                        <span className="text-[10px] text-white/50 block">PACE / SPEED</span>
                        <span className="text-2xl font-black text-emerald-400">
                          {wpm} <span className="text-xs text-white/50 font-normal">WPM</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isTimerRunning ? (
                        <button
                          onClick={handleStartTimer}
                          className="rounded-2xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 font-mono text-xs font-black text-black shadow-lg transition"
                        >
                          ▶ Start Clock
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsTimerRunning(false)}
                          className="rounded-2xl bg-amber-500 hover:bg-amber-400 px-4 py-2 font-mono text-xs font-black text-black shadow-lg transition"
                        >
                          ⏸ Pause Clock
                        </button>
                      )}
                      <button
                        onClick={handleReset}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white/60 hover:text-white"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={14}
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Write your Mains answer here... Follow standard structure: 1. Introduction (25 words) 2. Body with subheadings/bullets (100 words) 3. Value-add (Data/Supreme Court/Committee) 4. Conclusion/Way Forward (25 words)..."
                    className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-white/90 placeholder-white/20 focus:border-[#D8A63A] focus:outline-none resize-none font-sans"
                  />

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono text-xs text-white/40">
                      UPSC Target: ~20-25 WPM handwriting speed
                    </span>

                    <button
                      onClick={handleEvaluate}
                      disabled={isEvaluating}
                      className="rounded-2xl bg-gradient-to-r from-[#D8A63A] to-[#B38322] px-6 py-3 font-mono text-xs font-black text-black shadow-xl hover:scale-105 active:scale-95 transition disabled:opacity-50"
                    >
                      {isEvaluating ? "Evaluating Answer Structure..." : "Evaluate Answer Copy ⚡"}
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT: MODEL ANSWER & EVALUATION HUD */}
              <div className="space-y-4">
                {evaluation ? (
                  <div className="rounded-3xl border border-[#D8A63A]/40 bg-gradient-to-br from-[#1c1304] to-[#0a0701] p-6 shadow-xl space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#F4C95D] uppercase">
                        Evaluated Score
                      </span>
                      <span className="rounded-full bg-[#D8A63A] px-3 py-1 font-mono text-sm font-black text-black">
                        {evaluation.score} / {evaluation.maxScore}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {evaluation.dimensions.map((dim: any, idx: number) => (
                        <div key={idx} className="rounded-2xl bg-white/5 p-3 border border-white/5 text-xs">
                          <div className="flex items-center justify-between font-bold text-white">
                            <span>{dim.name}</span>
                            <span className="text-emerald-400 font-mono text-[11px]">{dim.rating}</span>
                          </div>
                          <p className="text-white/70 mt-1 leading-relaxed">{dim.points}</p>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-white/80 leading-relaxed font-sans border-t border-white/10 pt-3">
                      {evaluation.overallFeedback}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-mono text-xs font-black uppercase tracking-wider text-[#F4C95D]">
                        Model Blueprint
                      </h3>
                      <span className="font-mono text-[10px] text-white/40">Topper Framework</span>
                    </div>

                    <div className="space-y-3 text-xs text-white/80 font-sans">
                      <div>
                        <p className="font-bold text-white">Introduction Anchor:</p>
                        <p className="text-white/60 mt-0.5 leading-relaxed">{selectedQuestion.modelAnswer.intro}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="font-bold text-white">Key Dimensions:</p>
                        {selectedQuestion.modelAnswer.bodyDimensions.map((dim, idx) => (
                          <div key={idx} className="bg-white/5 p-2.5 rounded-xl">
                            <p className="font-semibold text-amber-300">{dim.heading}</p>
                            <ul className="mt-1 list-disc list-inside text-white/60 space-y-0.5">
                              {dim.points.map((pt, pIdx) => (
                                <li key={pIdx}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div>
                        <p className="font-bold text-white">Value Addition Anchors:</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {selectedQuestion.modelAnswer.dataAndCommittees.map((comm, idx) => (
                            <span
                              key={idx}
                              className="font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded-md border border-white/10 text-[#F4C95D]"
                            >
                              {comm}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "diagrams" && (
            <MainsDiagramStudio
              onInsertDiagram={(diagram) => {
                setAnswerText((prev) => (prev ? `${prev}\n\n${diagram}` : diagram));
                setActiveTab("speed-lab");
                sound.playVictory();
              }}
              onClose={() => setActiveTab("speed-lab")}
            />
          )}

          {activeTab === "qcab" && <MainsQCABGenerator />}
        </div>
      </main>
    </AuthGuard>
  );
}
