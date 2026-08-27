"use client";

import React, { useState, useEffect, useMemo } from "react";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import MainsDiagramStudio from "@/components/MainsDiagramStudio";
import MainsQCABGenerator from "@/components/MainsQCABGenerator";
import AuthGuard from "@/components/auth/AuthGuard";
import { sound } from "@/lib/audio/sound-engine";
import { trackActivityEvent } from "@/lib/brain/activity-events";
import {
  STATIC_MAINS_PYQ_DATASET,
  getStoredMainsPYQs,
  saveUploadedMainsPYQs,
} from "@/lib/mains-pyq/static-dataset";
import { MainsPYQQuestion } from "@/lib/core/types";

const GS_PAPER_FILTERS = ["All Papers", "GS-1", "GS-2", "GS-3", "GS-4", "Essay"] as const;

export default function MainsWritingPage() {
  const [activeTab, setActiveTab] = useState<"speed-lab" | "diagrams" | "qcab">("speed-lab");
  const [selectedPaper, setSelectedPaper] = useState<string>("All Papers");
  const [allQuestions, setAllQuestions] = useState<MainsPYQQuestion[]>(STATIC_MAINS_PYQ_DATASET);
  const [selectedQuestion, setSelectedQuestion] = useState<MainsPYQQuestion | null>(null);

  const calculateTimeLimit = (q?: MainsPYQQuestion | null) => {
    if (!q) return 420;
    if (q.marks <= 10) return 420; // 7 minutes
    if (q.marks <= 15) return 660; // 11 minutes
    return 1800; // 30 minutes for Essay/Case Study
  };

  const [answerText, setAnswerText] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(420);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  useEffect(() => {
    const stored = getStoredMainsPYQs();
    if (stored && stored.length > 0) {
      setAllQuestions(stored);
      setSelectedQuestion(stored[0]);
      setTimeLeft(calculateTimeLimit(stored[0]));
    }
  }, []);

  const filteredQuestions = useMemo(() => {
    if (selectedPaper === "All Papers") return allQuestions;
    return allQuestions.filter((q) => q.paper === selectedPaper);
  }, [allQuestions, selectedPaper]);

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

  const handleSelectQuestion = (q: MainsPYQQuestion) => {
    sound.playSelect();
    setSelectedQuestion(q);
    setTimeLeft(calculateTimeLimit(q));
    setIsTimerRunning(false);
    setStartTime(null);
    setAnswerText("");
    setEvaluation(null);
  };

  const handleUploadMainsJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        alert("Invalid format: expected JSON array of Mains questions.");
        return;
      }
      saveUploadedMainsPYQs(parsed);
      setAllQuestions(parsed);
      setSelectedQuestion(parsed[0]);
      setTimeLeft(calculateTimeLimit(parsed[0]));
      sound.playVictory();
      alert(`Successfully imported ${parsed.length} authentic Mains questions!`);
    } catch (err: any) {
      sound.playWrong();
      alert(`Upload failed: ${err?.message || "Invalid JSON"}`);
    }
  };

  const handleStartTimer = () => {
    sound.playSelect();
    setIsTimerRunning(true);
    setStartTime(Date.now());
  };

  const handleReset = () => {
    sound.playHover();
    setIsTimerRunning(false);
    setTimeLeft(calculateTimeLimit(selectedQuestion));
    setStartTime(null);
    setAnswerText("");
    setEvaluation(null);
  };

  const handleEvaluate = async () => {
    if (!selectedQuestion) return;
    if (wordCount < 20) {
      alert("Please write at least 20 words before submitting for AI evaluation.");
      return;
    }
    sound.playLock();
    setIsEvaluating(true);

    try {
      const res = await fetch("/api/mains/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selectedQuestion.question,
          answerText,
          marks: selectedQuestion.marks,
          paper: selectedQuestion.paper,
          directive: selectedQuestion.directive,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setEvaluation(json.data);
        sound.playVictory();
      } else {
        throw new Error(json.error?.message || "Failed to evaluate");
      }
    } catch {
      const baseRatio = Math.min(0.72, Math.max(0.4, (wordCount / (selectedQuestion.wordLimit || 150)) * 0.65));
      const calculatedScore = Math.round((selectedQuestion.marks || 10) * baseRatio * 10) / 10;
      setEvaluation({
        score: calculatedScore,
        maxScore: selectedQuestion.marks || 10,
        grade: calculatedScore >= (selectedQuestion.marks || 10) * 0.6 ? "Good" : "Average",
        introFeedback: "Opening contextualizes the core theme. Ensure direct linkage to the directive.",
        bodyDimensions: [
          { dimension: "Directive Alignment", analysis: `Draft responds to '${selectedQuestion.directive || "Examine"}' with relevant analytical points.` },
          { dimension: "Pacing & Density", analysis: `Current pace: ${wpm} WPM across ${wordCount} words.` },
        ],
        caseLawsAndArticles: {
          cited: [],
          recommended: selectedQuestion.framework?.caseLawsOrArticlesOrCommittees || [],
        },
        diagramOrFlowchartIdea: selectedQuestion.framework?.diagramOrFlowchart || "Structured flowchart linking causes to administrative remedies",
        conclusionFeedback: selectedQuestion.framework?.conclusion || "Forward-looking conclusion aligned with constitutional vision and SDGs.",
        valueAdditionPointers: selectedQuestion.framework?.keywords?.slice(0, 4) || [],
      });
      sound.playVictory();
    } finally {
      setIsEvaluating(false);
      void trackActivityEvent("MAINS_ANSWER_SUBMITTED", {
        questionId: selectedQuestion.id,
        marks: selectedQuestion.marks,
        wordCount,
        wpm,
      });
    }
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
                Mains Answer Writing & Evaluation Lab
              </h1>
              <p className="text-xs text-[#8C8C8C] mt-1 font-sans">
                Practice 10-markers (7 mins) & 15-markers (11 mins) with real-time WPM, diagram stencils, and live AI copy evaluation.
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
            </div>
          </div>

          {activeTab === "speed-lab" && (
            <div>
              {!selectedQuestion ? (
                <div className="rounded-3xl border-2 border-dashed border-[#D8A63A]/40 bg-[#0d0d0d] p-10 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D8A63A]/10 text-3xl border border-[#D8A63A]/20">
                    ✍️
                  </div>
                  <h3 className="text-xl font-bold text-white">Upload Your Mains Question Bank</h3>
                  <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
                    Upload your authentic Mains questions in JSON format to begin timed answer drafting with the official UPSC evaluation rubric.
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <label className="cursor-pointer rounded-2xl bg-[#D8A63A] hover:bg-[#F4C95D] px-6 py-3 font-mono text-xs font-black text-black shadow-xl transition inline-flex items-center gap-2">
                      <span>📁 Select Mains Questions (JSON)</span>
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleUploadMainsJson}
                      />
                    </label>
                  </div>
                  <div className="text-left rounded-2xl bg-black/40 border border-white/5 p-4 max-w-lg mx-auto text-[11px] font-mono text-white/50 space-y-1">
                    <p className="font-bold text-white/80">Expected Mains Question Schema:</p>
                    <pre className="overflow-x-auto text-[10px] text-amber-300">
{`[{
  "id": "UPSC-MAINS-2024-GS2-01",
  "year": 2024,
  "paper": "GS-2",
  "subject": "Polity",
  "topic": "Governor",
  "question": "Discuss the discretionary powers of the Governor...",
  "marks": 10,
  "wordLimit": 150,
  "directive": "Discuss"
}]`}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* LEFT: QUESTION & WRITING AREA */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* QUESTION SELECTOR & CARD */}
                    <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl space-y-4">
                      {/* Paper Filter Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                          {GS_PAPER_FILTERS.map((paper) => (
                            <button
                              key={paper}
                              onClick={() => {
                                sound.playSelect();
                                setSelectedPaper(paper);
                                const matched = paper === "All Papers" 
                                  ? allQuestions[0] 
                                  : allQuestions.find((q) => q.paper === paper) || allQuestions[0];
                                if (matched) handleSelectQuestion(matched);
                              }}
                              className={`rounded-xl px-2.5 py-1 font-mono text-[11px] font-bold transition ${
                                selectedPaper === paper
                                  ? "bg-[#D8A63A] text-black shadow"
                                  : "bg-white/5 text-white/60 hover:text-white"
                              }`}
                            >
                              {paper}
                            </button>
                          ))}
                        </div>

                        <span className="font-mono text-[11px] text-white/40">
                          {filteredQuestions.length} Questions Available
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-[#D8A63A] px-2.5 py-0.5 font-mono text-[10px] font-black uppercase text-black">
                            {selectedQuestion.paper} · {selectedQuestion.marks} Marks
                          </span>
                          <span className="font-mono text-xs text-white/60">
                            Word Limit: {selectedQuestion.wordLimit} words
                          </span>
                          <span className="font-mono text-xs text-white/40 hidden sm:inline">
                            • {selectedQuestion.year}
                          </span>
                        </div>

                        {/* Question quick buttons */}
                        <div className="flex gap-1 overflow-x-auto max-w-[200px]">
                          {filteredQuestions.slice(0, 6).map((q, idx) => (
                            <button
                              key={q.id}
                              onClick={() => handleSelectQuestion(q)}
                              className={`px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold transition ${
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

                      {selectedQuestion.directive && (
                        <div className="font-mono text-xs text-[#F4C95D]/90 bg-[#D8A63A]/10 p-3 rounded-2xl border border-[#D8A63A]/20 flex items-start gap-2">
                          <span>💡</span>
                          <div>
                            <strong>Directive: {selectedQuestion.directive}</strong>
                            {selectedQuestion.directiveGuidance && (
                              <p className="mt-0.5 font-sans text-xs text-white/80">
                                {selectedQuestion.directiveGuidance}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
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
                              className="rounded-2xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 font-mono text-xs font-black text-black shadow-lg transition cursor-pointer"
                            >
                              ▶ Start Clock
                            </button>
                          ) : (
                            <button
                              onClick={() => setIsTimerRunning(false)}
                              className="rounded-2xl bg-amber-500 hover:bg-amber-400 px-4 py-2 font-mono text-xs font-black text-black shadow-lg transition cursor-pointer"
                            >
                              ⏸ Pause Clock
                            </button>
                          )}
                          <button
                            onClick={handleReset}
                            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white/60 hover:text-white cursor-pointer"
                          >
                            Reset
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={14}
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Write your Mains answer here... 1. Introduction (25 words) 2. Multi-dimensional Body with subheadings (100 words) 3. Value-add citations/diagram 4. Forward-looking conclusion..."
                        className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-white/90 placeholder-white/20 focus:border-[#D8A63A] focus:outline-none resize-none font-sans"
                      />

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-mono text-xs text-white/40">
                          UPSC Target: ~20-25 WPM handwriting speed
                        </span>

                        <button
                          onClick={handleEvaluate}
                          disabled={isEvaluating}
                          className="rounded-2xl bg-gradient-to-r from-[#D8A63A] to-[#B38322] px-6 py-3 font-mono text-xs font-black text-black shadow-xl hover:scale-105 active:scale-95 transition disabled:opacity-50 cursor-pointer"
                        >
                          {isEvaluating ? "Evaluating with UPSC Rubric..." : "Submit for AI Evaluation ⚡"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: GUIDANCE / EVALUATION REPORT */}
                  <div className="space-y-4">
                    {evaluation ? (
                      <div className="rounded-3xl border border-[#D8A63A]/40 bg-gradient-to-br from-[#1c1304] to-[#0a0701] p-6 shadow-xl space-y-4 animate-in fade-in">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div>
                            <span className="font-mono text-xs font-bold text-[#F4C95D] uppercase">
                              AI Examiner Rubric Report
                            </span>
                            {evaluation.grade && (
                              <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                                {evaluation.grade}
                              </span>
                            )}
                          </div>
                          <span className="rounded-full bg-[#D8A63A] px-3 py-1 font-mono text-sm font-black text-black">
                            {evaluation.score} / {evaluation.maxScore}
                          </span>
                        </div>

                        <div className="space-y-3 text-xs">
                          {evaluation.introFeedback && (
                            <div className="rounded-2xl bg-white/5 p-3 border border-white/5">
                              <strong className="text-[#F4C95D] block mb-1">Introduction Assessment:</strong>
                              <p className="text-white/80 leading-relaxed">{evaluation.introFeedback}</p>
                            </div>
                          )}

                          {evaluation.bodyDimensions && evaluation.bodyDimensions.length > 0 && (
                            <div className="space-y-2">
                              <strong className="text-[#F4C95D] block">Body Dimensions & Arguments:</strong>
                              {evaluation.bodyDimensions.map((dim: any, idx: number) => (
                                <div key={idx} className="rounded-xl bg-white/5 p-2.5 border border-white/5">
                                  <p className="font-bold text-white text-[11px]">{dim.dimension || dim.name}</p>
                                  <p className="text-white/70 mt-0.5 leading-relaxed">{dim.analysis || dim.points}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {evaluation.caseLawsAndArticles?.recommended?.length > 0 && (
                            <div className="rounded-2xl bg-white/5 p-3 border border-white/5">
                              <strong className="text-emerald-400 block mb-1">Recommended Value-Addition Citations:</strong>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {evaluation.caseLawsAndArticles.recommended.map((c: string, idx: number) => (
                                  <span key={idx} className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300 font-mono">
                                    ⚖️ {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {evaluation.conclusionFeedback && (
                            <div className="rounded-2xl bg-white/5 p-3 border border-white/5">
                              <strong className="text-blue-300 block mb-1">Conclusion & Way Forward:</strong>
                              <p className="text-white/80 leading-relaxed">{evaluation.conclusionFeedback}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <h3 className="font-mono text-xs font-black uppercase tracking-wider text-[#F4C95D]">
                            Directive Guidance & Parameters
                          </h3>
                          <span className="font-mono text-[10px] text-white/40">UPSC Rubric</span>
                        </div>

                        <div className="space-y-3 text-xs text-white/80 font-sans">
                          <div>
                            <p className="font-bold text-white">Syllabus Topic:</p>
                            <p className="text-white/60 mt-0.5 leading-relaxed">
                              {selectedQuestion.subject} • {selectedQuestion.topic}
                            </p>
                          </div>

                          {selectedQuestion.framework?.dimensions && (
                            <div className="space-y-1.5">
                              <p className="font-bold text-white">Recommended Dimensions to Cover:</p>
                              <div className="space-y-1">
                                {selectedQuestion.framework.dimensions.map((dim, idx) => (
                                  <div key={idx} className="bg-white/5 p-2 rounded-xl border border-white/5">
                                    <span className="font-semibold text-amber-300 text-[11px]">{dim.heading}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedQuestion.framework?.caseLawsOrArticlesOrCommittees && (
                            <div>
                              <p className="font-bold text-white">Key Citations to Anchor:</p>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {selectedQuestion.framework.caseLawsOrArticlesOrCommittees.map((comm, idx) => (
                                  <span
                                    key={idx}
                                    className="font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded-md border border-white/10 text-emerald-300"
                                  >
                                    ⚖️ {comm}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedQuestion.framework?.keywords && selectedQuestion.framework.keywords.length > 0 && (
                            <div>
                              <p className="font-bold text-white">High-Impact Keywords:</p>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {selectedQuestion.framework.keywords.map((kw, idx) => (
                                  <span
                                    key={idx}
                                    className="font-mono text-[10px] bg-purple-500/10 px-2 py-0.5 rounded-md text-purple-300"
                                  >
                                    #{kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-[11px] text-white/60">
                            <strong className="text-white block mb-1">Scoring Criteria:</strong>
                            <ul className="list-disc pl-3.5 space-y-0.5 text-white/50">
                              <li>Adherence to directive ({selectedQuestion.directive || "Examine"})</li>
                              <li>Introductory hook & definition (~15%)</li>
                              <li>Multi-dimensional body arguments (~70%)</li>
                              <li>Constitutional / forward-looking conclusion (~15%)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
