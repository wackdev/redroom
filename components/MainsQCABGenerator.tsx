"use client";

import React, { useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface QCABQuestion {
  qNo: number;
  marks: 10 | 15;
  wordLimit: 150 | 250;
  pagesAllotted: 2 | 3;
  subject: string;
  topic: string;
  questionText: string;
  keyDirectives: string;
}

interface FullPaperMock {
  paperTitle: string;
  gsPaper: "GS-1" | "GS-2" | "GS-3" | "GS-4";
  totalMarks: 250;
  durationMinutes: 180;
  questions: QCABQuestion[];
}

const SAMPLE_QCAB_PAPER: FullPaperMock = {
  paperTitle: "UPSC Civil Services (Mains) Examination — General Studies Paper II",
  gsPaper: "GS-2",
  totalMarks: 250,
  durationMinutes: 180,
  questions: [
    {
      qNo: 1,
      marks: 10,
      wordLimit: 150,
      pagesAllotted: 2,
      subject: "Polity",
      topic: "Constitutional Discretion of the Governor",
      questionText: "The discretionary powers of the Governor under Article 163 have frequently become a flashpoint in Centre-State relations. In light of recent Supreme Court rulings, examine the constitutional safeguards against arbitrary exercise of gubernatorial discretion.",
      keyDirectives: "Examine (Art 163, Art 200, Nabam Rebia 2016, Shamsher Singh 1974, Sarkaria/Punchhi Commissions)."
    },
    {
      qNo: 2,
      marks: 10,
      wordLimit: 150,
      pagesAllotted: 2,
      subject: "Governance",
      topic: "Tribunal Reforms & Judicial Independence",
      questionText: "Do tribunalisation of justice and executive control over appointments erode judicial independence? Critically analyse with reference to the Tribunals Reforms Act, 2021 and Madras Bar Association judgements.",
      keyDirectives: "Critically analyse (Madras Bar Association 2020/2021, Executive interference, Doctrine of Separation of Powers)."
    },
    {
      qNo: 3,
      marks: 10,
      wordLimit: 150,
      pagesAllotted: 2,
      subject: "Social Justice",
      topic: "Sub-Classification of Reserved Categories",
      questionText: "Discuss the constitutional validity and social justice implications of sub-classifying Scheduled Castes and Scheduled Tribes for affirmative action in light of the 7-judge Constitution Bench ruling in State of Punjab v. Davinder Singh (2024).",
      keyDirectives: "Discuss (Article 14, Article 16(4), Article 341, E.V. Chinnaiah overruling, creamy layer debate)."
    },
    {
      qNo: 4,
      marks: 10,
      wordLimit: 150,
      pagesAllotted: 2,
      subject: "International Relations",
      topic: "India & the Global South Diplomacy",
      questionText: "India's advocacy for the Global South at multilateral forums like the G20 and BRICS has repositioned its strategic posture. Evaluate how India balances its traditional non-alignment ethos with contemporary multi-alignment partnerships.",
      keyDirectives: "Evaluate (Voice of Global South Summit, African Union inclusion in G20, Strategic Autonomy, QUAD vs BRICS)."
    },
    {
      qNo: 11,
      marks: 15,
      wordLimit: 250,
      pagesAllotted: 3,
      subject: "Polity",
      topic: "Fiscal Federalism & Finance Commission",
      questionText: "The terms of reference of the 16th Finance Commission face the complex challenge of balancing equity and efficiency between fiscally performing southern states and demographically expanding northern states. Suggest a comprehensive fiscal devolution framework that reconciles competitive and cooperative federalism.",
      keyDirectives: "Suggest & Evaluate (Article 280, Horizontal vs Vertical devolution, Census 2011 demographic performance criterion, Cess and Surcharges shrinking divisible pool)."
    },
    {
      qNo: 12,
      marks: 15,
      wordLimit: 250,
      pagesAllotted: 3,
      subject: "International Relations",
      topic: "Maritime Security & IOR Chokepoints",
      questionText: "The Indian Ocean Region (IOR) is witnessing intense great-power rivalry with increasing militarization of strategic chokepoints. In this context, evaluate India's SAGAR initiative and the Colombo Security Conclave as regional security architecture pillars.",
      keyDirectives: "Evaluate (SAGAR doctrine, Djibouti/Hambantota ports, Malacca dilemma, Information Fusion Centre - IOR Gurgaon)."
    }
  ]
};

export default function MainsQCABGenerator() {
  const [selectedQuestion, setSelectedQuestion] = useState<QCABQuestion>(SAMPLE_QCAB_PAPER.questions[0]);
  const [currentMock, setCurrentMock] = useState<FullPaperMock>(SAMPLE_QCAB_PAPER);

  const handlePrintQCAB = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080511] p-5 shadow-2xl backdrop-blur-2xl">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-500/20 text-sm">
              📄
            </span>
            <h2 className="font-mono text-base font-black tracking-wide text-white sm:text-lg">
              UPSC Mains QCAB (Question-Cum-Answer Booklet) Generator
            </h2>
          </div>
          <p className="text-xs text-white/50">
            Generate authentic full-length 250-mark UPSC Mains papers with printable official margin QCAB format
          </p>
        </div>

        <button
          onClick={handlePrintQCAB}
          className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-2 font-mono text-xs font-bold text-blue-300 hover:bg-blue-500/20 transition shadow-lg shadow-blue-950/40"
        >
          <span>🖨️</span>
          <span>Print / Export Authentic UPSC QCAB</span>
        </button>
      </div>

      {/* QUESTION NAVIGATOR & PREVIEW GRID */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* LEFT: QUESTION LIST */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-blue-300">
            <span>{currentMock.gsPaper} Question Paper (250M)</span>
            <span>Duration: 3 Hours</span>
          </div>

          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
            {currentMock.questions.map((q) => (
              <button
                key={q.qNo}
                onClick={() => {
                  sound.playHover();
                  setSelectedQuestion(q);
                }}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  selectedQuestion.qNo === q.qNo
                    ? "border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-950/40"
                    : "border-white/5 bg-white/[0.02] text-white/70 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold text-blue-400">Q.{q.qNo} ({q.subject})</span>
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-white/80">
                    {q.marks} Marks • {q.wordLimit}W
                  </span>
                </div>
                <h4 className="mt-1 text-xs font-semibold line-clamp-2 text-white/90">
                  {q.questionText}
                </h4>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: AUTHENTIC UPSC QCAB PAGE SIMULATOR */}
        <div className="rounded-2xl border-2 border-[#555] bg-[#fffbf2] text-black p-6 shadow-2xl font-serif space-y-4">
          {/* UPSC QCAB TOP HEADER */}
          <div className="border-b-2 border-black pb-3 text-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600 block">
              संघ लोक सेवा आयोग • UNION PUBLIC SERVICE COMMISSION
            </span>
            <h3 className="text-sm font-black tracking-wide text-black uppercase">
              GENERAL STUDIES PAPER II (MOCK TEST EXAMINATION)
            </h3>
            <div className="mt-1 flex justify-between text-[11px] font-sans font-bold text-gray-700 px-2">
              <span>Time Allowed: Three Hours</span>
              <span>Maximum Marks: 250</span>
            </div>
          </div>

          {/* QUESTION BOX IN QCAB */}
          <div className="border-2 border-black p-3 bg-[#fdf8ed]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="font-sans font-bold text-xs text-red-800">
                  Q.{selectedQuestion.qNo}
                </span>
                <p className="text-xs font-semibold leading-relaxed text-black">
                  {selectedQuestion.questionText}
                </p>
              </div>
              <div className="shrink-0 text-right font-sans text-xs font-bold text-gray-800">
                <span>({selectedQuestion.marks} Marks / {selectedQuestion.wordLimit} Words)</span>
              </div>
            </div>
          </div>

          {/* MARGIN & WRITING RULE WARNINGS */}
          <div className="grid grid-cols-[1fr_2px_1fr] gap-4 min-h-[220px] border-t border-dashed border-gray-400 pt-3 font-sans text-[11px] text-gray-500">
            <div className="border-r border-gray-300 pr-3 space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                [Left Margin — Do not write in this margin / इस हाशिए में न लिखें]
              </span>
              <div className="h-4 border-b border-gray-300" />
              <div className="h-4 border-b border-gray-300" />
              <div className="h-4 border-b border-gray-300" />
              <div className="h-4 border-b border-gray-300" />
              <div className="h-4 border-b border-gray-300" />
            </div>

            <div className="border-l border-gray-300 pl-3 space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                [Right Margin — Space for Evaluator Marking]
              </span>
              <div className="h-4 border-b border-gray-300" />
              <div className="h-4 border-b border-gray-300" />
              <div className="h-4 border-b border-gray-300" />
              <div className="h-4 border-b border-gray-300" />
              <div className="h-4 border-b border-gray-300" />
            </div>
          </div>

          {/* EVALUATION CRITERIA HOOK */}
          <div className="rounded border border-blue-900 bg-blue-50 p-2.5 font-sans text-[11px] text-blue-950">
            <span className="font-bold text-blue-900">Examiner Focal Directives: </span>
            {selectedQuestion.keyDirectives}
          </div>
        </div>
      </div>
    </div>
  );
}
