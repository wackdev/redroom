"use client";

import { useState } from "react";
import {
  ALL_TAXONOMY_SUBJECTS,
  PRELIMS_TAXONOMY_SUBJECTS,
  PYQSubject,
  PYQChapter,
  getAllChaptersForSubject,
} from "@/lib/pyq/taxonomy";
import {
  parseRawPDFTextToPYQs,
  parseJSONToPYQs,
  mergeIngestedQuestions,
  IngestionResult,
} from "@/lib/study/pyq-importer";
import { PYQQuestion } from "@/lib/core/types";
import { sound } from "@/lib/audio/sound-engine";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsIngested: (newQuestions: PYQQuestion[]) => void;
  initialSubjectId?: string;
}

export default function PrelimsPDFIngestionStudio({
  isOpen,
  onClose,
  onQuestionsIngested,
  initialSubjectId = "polity",
}: Props) {
  const [activeTab, setActiveTab] = useState<"text" | "json">("text");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId);
  const [selectedChapterId, setSelectedChapterId] = useState<string>("auto");
  const [defaultYear, setDefaultYear] = useState<number>(2024);
  const [inputText, setInputText] = useState<string>("");
  const [parsedResult, setParsedResult] = useState<IngestionResult | null>(null);
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [mergeStatus, setMergeStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSubject = ALL_TAXONOMY_SUBJECTS.find((s) => s.id === selectedSubjectId);
  const availableChapters = getAllChaptersForSubject(selectedSubjectId);

  const handleParse = () => {
    sound.playClick();
    setMergeStatus(null);

    const forcedSubj = selectedSubjectId !== "auto" ? selectedSubjectId : undefined;
    const forcedChap = selectedChapterId !== "auto" ? selectedChapterId : undefined;

    if (activeTab === "text") {
      const res = parseRawPDFTextToPYQs(inputText, forcedSubj, forcedChap, defaultYear);
      setParsedResult(res);
      if (res.validCount > 0) {
        sound.playCorrect();
      } else {
        sound.playWrong();
      }
    } else {
      const res = parseJSONToPYQs(inputText, forcedSubj, forcedChap);
      setParsedResult(res);
      if (res.validCount > 0) {
        sound.playCorrect();
      } else {
        sound.playWrong();
      }
    }
  };

  const handleMerge = async () => {
    if (!parsedResult || parsedResult.questions.length === 0) return;
    setIsMerging(true);
    sound.playSelect();
    try {
      const { added, total } = await mergeIngestedQuestions(parsedResult.questions);
      sound.playVictory();
      setMergeStatus(`✓ Ingested ${added} new questions. Total in vault: ${total}`);
      onQuestionsIngested(parsedResult.questions);
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (e) {
      sound.playWrong();
      setMergeStatus(`Error saving questions: ${String(e)}`);
    } finally {
      setIsMerging(false);
    }
  };

  const handleLoadSample = () => {
    sound.playSelect();
    if (activeTab === "text") {
      setInputText(`Q1. [2023] With reference to the Indian Parliament, consider the following statements:
(a) A bill pending in the Rajya Sabha which has not been passed by the Lok Sabha shall not lapse on dissolution of the Lok Sabha.
(b) A bill pending in the Lok Sabha shall not lapse on its prorogation.
(c) Both (a) and (b)
(d) Neither (a) nor (b)
Ans: (c)
Explanation: According to Article 107(4) and (5), prorogation does not cause pending bills to lapse, and a bill pending in Rajya Sabha not passed by Lok Sabha survives Lok Sabha dissolution.

Q2. [2022] In India, which one of the following compiles information on industrial disputes, closures, retrenchments and lay-offs in factories employing workers?
(a) Central Statistics Office
(b) Department for Promotion of Industry and Internal Trade
(c) Labour Bureau
(d) National Technical Manpower Information System
Ans: (c)
Explanation: The Labour Bureau under the Ministry of Labour and Employment is responsible for collecting and compiling statistics relating to industrial disputes, wages, earnings, and working conditions.`);
    } else {
      setInputText(JSON.stringify(
        [
          {
            year: 2024,
            subject: "Polity",
            topic: "Fundamental Rights",
            question: "Under the Constitution of India, which one of the following is not a specific Fundamental Duty?",
            options: [
              { id: "A", text: "To vote in public elections" },
              { id: "B", text: "To develop scientific temper" },
              { id: "C", text: "To safeguard public property" },
              { id: "D", text: "To abide by the Constitution and respect its ideals" }
            ],
            correctAnswer: "A",
            explanation: "Voting in public elections was recommended by the Swaran Singh Committee but was NOT included as a Fundamental Duty under Article 51A.",
            difficulty: "Medium"
          }
        ],
        null,
        2
      ));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl border border-[#D8A63A]/40 bg-[#0a0a0a] shadow-2xl shadow-[#D8A63A]/10 text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#121212] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D8A63A]/20 text-xl border border-[#D8A63A]/40">
              📥
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>PDF & Content Ingestion Studio</span>
                <span className="rounded-full bg-[#D8A63A]/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#F4C95D] border border-[#D8A63A]/40">
                  126 CHAPTER TAXONOMY
                </span>
              </h2>
              <p className="text-xs text-white/50">
                Paste content extracted from subject-wise PDFs or JSON questions to immediately categorize into the 126-chapter hierarchy.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Format Tabs & Sample Loader */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
              <button
                onClick={() => {
                  sound.playHover();
                  setActiveTab("text");
                }}
                className={`rounded-lg px-4 py-1.5 font-mono text-xs font-bold transition ${
                  activeTab === "text"
                    ? "bg-[#D8A63A] text-black shadow"
                    : "text-white/60 hover:text-white"
                }`}
              >
                📄 Raw PDF / OCR Text
              </button>
              <button
                onClick={() => {
                  sound.playHover();
                  setActiveTab("json");
                }}
                className={`rounded-lg px-4 py-1.5 font-mono text-xs font-bold transition ${
                  activeTab === "json"
                    ? "bg-[#D8A63A] text-black shadow"
                    : "text-white/60 hover:text-white"
                }`}
              >
                💾 JSON Schema
              </button>
            </div>

            <button
              onClick={handleLoadSample}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/70 hover:bg-white/10 hover:text-white transition"
            >
              ⚡ Load Specimen Format
            </button>
          </div>

          {/* Classification Targets */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Subject Selector */}
            <div>
              <label className="block text-[11px] font-mono text-white/60 mb-1">
                Target Subject:
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value);
                  setSelectedChapterId("auto");
                }}
                className="w-full rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-xs text-white outline-none focus:border-[#D8A63A]"
              >
                <option value="auto">✨ Auto-Detect with AI Classifier</option>
                {ALL_TAXONOMY_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.name} (p. {s.startPage})
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Selector */}
            <div>
              <label className="block text-[11px] font-mono text-white/60 mb-1">
                Target Chapter (from Book Index):
              </label>
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                disabled={selectedSubjectId === "auto"}
                className="w-full rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-xs text-white outline-none focus:border-[#D8A63A] disabled:opacity-40"
              >
                <option value="auto">✨ Auto-Detect Chapter from Text</option>
                {availableChapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    Ch {ch.chapterNumber}. {ch.name} (p. {ch.pageNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Default Exam Year */}
            <div>
              <label className="block text-[11px] font-mono text-white/60 mb-1">
                Default Year (if omitted in text):
              </label>
              <input
                type="number"
                min={1990}
                max={2030}
                value={defaultYear}
                onChange={(e) => setDefaultYear(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-xs text-white outline-none focus:border-[#D8A63A]"
              />
            </div>
          </div>

          {/* Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono text-white/60">
                {activeTab === "text" ? "Paste PDF Content / OCR Text:" : "Paste JSON Array of Questions:"}
              </label>
              <span className="text-[10px] font-mono text-white/40">
                {inputText.length} characters
              </span>
            </div>
            <textarea
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeTab === "text"
                  ? "Paste question blocks here, e.g.:\nQ1. [2024] Which of the following...\n(a) Option A\n(b) Option B\n(c) Option C\n(d) Option D\nAns: (a)\nExplanation: ..."
                  : "[\n  {\n    \"year\": 2024,\n    \"subject\": \"Polity\",\n    \"topic\": \"Preamble\",\n    \"question\": \"...\",\n    \"options\": [...],\n    \"correctAnswer\": \"B\",\n    \"explanation\": \"...\"\n  }\n]"
              }
              className="w-full rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-white outline-none placeholder:text-white/20 focus:border-[#D8A63A]"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleParse}
              disabled={!inputText.trim()}
              className="rounded-2xl bg-[#D8A63A] hover:bg-[#F4C95D] px-6 py-2.5 font-mono text-xs font-black text-black shadow-xl disabled:opacity-40 transition"
            >
              ⚡ Parse & Validate Questions
            </button>

            {parsedResult && parsedResult.validCount > 0 && (
              <button
                onClick={handleMerge}
                disabled={isMerging}
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 px-6 py-2.5 font-mono text-xs font-black text-white shadow-xl disabled:opacity-40 transition flex items-center gap-2"
              >
                <span>💾 Merge {parsedResult.validCount} Questions into Study Vault</span>
              </button>
            )}
          </div>

          {/* Status Message */}
          {mergeStatus && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 font-mono text-xs text-emerald-300">
              {mergeStatus}
            </div>
          )}

          {/* Parsed Result Preview */}
          {parsedResult && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white">Parser Diagnostic:</span>
                  <span className="text-emerald-400 font-bold">
                    ✓ {parsedResult.validCount} Valid Questions
                  </span>
                  {parsedResult.autoClassifiedCount > 0 && (
                    <span className="text-[#F4C95D]">
                      🎯 {parsedResult.autoClassifiedCount} Auto-classified
                    </span>
                  )}
                </div>
                {parsedResult.errors.length > 0 && (
                  <span className="text-rose-400">
                    ⚠ {parsedResult.errors.length} Warnings
                  </span>
                )}
              </div>

              {/* Sample Cards Preview */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {parsedResult.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/5 bg-[#141414] p-4 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-white/50">
                      <span className="font-bold text-[#D8A63A]">
                        #{idx + 1} · {q.year}
                      </span>
                      <span className="rounded bg-white/10 px-2 py-0.5 text-white/80">
                        {q.subject} ➔ {q.topic}
                      </span>
                    </div>
                    <p className="font-medium text-white leading-relaxed">{q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[11px]">
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`rounded-lg px-2.5 py-1 ${
                            opt.key === q.correctAnswer
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-white/5 text-white/60"
                          }`}
                        >
                          <strong className="mr-1.5">{opt.key || opt.id.toUpperCase()}:</strong>
                          {opt.text}
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-white/40 italic">
                      Ans: <strong className="text-emerald-400 font-bold">{q.correctAnswer}</strong> | {q.explanation.slice(0, 140)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
