"use client";

import { useState, useEffect, useCallback } from "react";
import { QuestionDraft } from "@/lib/admin/types";
import { sound } from "@/lib/audio/sound-engine";

export default function ContentCommandView() {
  const [drafts, setDrafts] = useState<QuestionDraft[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<QuestionDraft | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Draft Form State
  const [formSubject, setFormSubject] = useState("Indian Polity");
  const [formTopic, setFormTopic] = useState("");
  const [formYear, setFormYear] = useState(2026);
  const [formStatus, setFormStatus] = useState<"DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED">("DRAFT");
  const [formQuestion, setFormQuestion] = useState("");
  const [formOptionA, setFormOptionA] = useState("");
  const [formOptionB, setFormOptionB] = useState("");
  const [formOptionC, setFormOptionC] = useState("");
  const [formOptionD, setFormOptionD] = useState("");
  const [formAnswer, setFormAnswer] = useState("A");
  const [formExplanation, setFormExplanation] = useState("");

  const loadDrafts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/content/pyqs");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDrafts(json.data);
        if (json.data.length > 0 && !selectedDraft) {
          setSelectedDraft(json.data[0]);
        }
      }
    } catch {}
  }, [selectedDraft]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const handleStartNew = () => {
    sound.playHover();
    setSelectedDraft(null);
    setFormSubject("Indian Polity");
    setFormTopic("");
    setFormYear(2026);
    setFormStatus("DRAFT");
    setFormQuestion("");
    setFormOptionA("");
    setFormOptionB("");
    setFormOptionC("");
    setFormOptionD("");
    setFormAnswer("A");
    setFormExplanation("");
    setIsEditing(true);
  };

  const handleSelectDraft = (d: QuestionDraft) => {
    sound.playHover();
    setSelectedDraft(d);
    setFormSubject(d.subject);
    setFormTopic(d.topic);
    setFormYear(d.year);
    setFormStatus(d.status);
    setFormQuestion(d.question);
    setFormOptionA(d.options[0]?.text || "");
    setFormOptionB(d.options[1]?.text || "");
    setFormOptionC(d.options[2]?.text || "");
    setFormOptionD(d.options[3]?.text || "");
    setFormAnswer(d.answer);
    setFormExplanation(d.explanation);
    setIsEditing(true);
  };

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formTopic.trim()) return;

    sound.playLock();
    const newDraft: QuestionDraft = {
      id: selectedDraft ? selectedDraft.id : `draft_${Date.now()}`,
      subject: formSubject,
      topic: formTopic,
      year: formYear,
      status: formStatus,
      question: formQuestion,
      options: [
        { id: "A", text: formOptionA || "Option A" },
        { id: "B", text: formOptionB || "Option B" },
        { id: "C", text: formOptionC || "Option C" },
        { id: "D", text: formOptionD || "Option D" },
      ],
      answer: formAnswer,
      explanation: formExplanation,
      difficulty: "Moderate",
      createdAt: selectedDraft ? selectedDraft.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/admin/content/pyqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: newDraft }),
      });
      if (res.ok) {
        sound.playVictory();
        setSaveSuccess(true);
        loadDrafts();
        setSelectedDraft(newDraft);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-[#090909] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="font-mono text-[10px] font-black tracking-widest text-[#F4C95D] uppercase">
            EDITORIAL WORKFLOW & CMS
          </span>
          <h2 className="mt-1 font-mono text-2xl font-black text-white uppercase">
            CONTENT COMMAND CENTER
          </h2>
          <p className="mt-1 text-xs text-[#8C8C8C]">
            Draft, review, map elimination traps, and publish authentic UPSC PYQs and modules.
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="flex items-center gap-2 rounded-2xl border border-[#D8A63A] bg-[#D8A63A] px-5 py-2.5 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_20px_rgba(216,166,58,0.3)]"
        >
          <span>＋</span> CREATE NEW PYQ DRAFT
        </button>
      </div>

      {saveSuccess && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 font-mono text-xs text-emerald-400 animate-fadeIn">
          ✓ Question draft successfully saved and validated in CMS registry!
        </div>
      )}

      {/* Two-Column Editor Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Drafts List */}
        <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-xs font-black uppercase text-[#D8A63A] tracking-wider">
              DRAFTS & QUEUE ({drafts.length})
            </span>
          </div>

          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
            {drafts.map((d) => (
              <div
                key={d.id}
                onClick={() => handleSelectDraft(d)}
                className={`cursor-pointer rounded-2xl border p-3.5 font-mono text-xs transition ${
                  selectedDraft?.id === d.id
                    ? "border-[#D8A63A] bg-[#D8A63A]/15 shadow-[0_0_15px_rgba(216,166,58,0.2)]"
                    : "border-white/5 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#F4C95D] font-bold uppercase">{d.subject}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-black ${
                      d.status === "PUBLISHED"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : d.status === "REVIEW"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-white/10 text-[#8C8C8C]"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <h4 className="mt-1 text-white font-bold line-clamp-2">{d.question}</h4>
                <p className="mt-1 text-[10px] text-[#8C8C8C]">{d.topic}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Full Question CMS Form */}
        <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 lg:col-span-2">
          <form onSubmit={handleSaveDraft} className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-black text-white uppercase tracking-wider">
                {selectedDraft ? `EDITING: ${selectedDraft.id}` : "NEW QUESTION ENTRY"}
              </h3>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="rounded-xl border border-white/15 bg-black/60 px-3 py-1 font-bold text-[#F4C95D] focus:outline-none cursor-pointer"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="REVIEW">REVIEW REQUIRED</option>
                <option value="PUBLISHED">PUBLISHED (LIVE)</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            {/* Meta Fields */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="text-[10px] text-[#8C8C8C] uppercase">Subject</label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none"
                >
                  <option value="Indian Polity">Indian Polity</option>
                  <option value="Modern Indian History">Modern Indian History</option>
                  <option value="Geography">Geography</option>
                  <option value="Indian Economy">Indian Economy</option>
                  <option value="Environment & Ecology">Environment & Ecology</option>
                  <option value="Science & Tech">Science & Tech</option>
                  <option value="CSAT">CSAT</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#8C8C8C] uppercase">Topic / Area</label>
                <input
                  type="text"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  placeholder="e.g. Fundamental Rights (Art 21)"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8C8C8C] uppercase">Year</label>
                <input
                  type="number"
                  value={formYear}
                  onChange={(e) => setFormYear(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="text-[10px] text-[#8C8C8C] uppercase">Question Stem (Markdown supported)</label>
              <textarea
                value={formQuestion}
                onChange={(e) => setFormQuestion(e.target.value)}
                rows={3}
                placeholder="Enter complete UPSC question statement..."
                className="mt-1 w-full rounded-2xl border border-white/15 bg-black/60 p-3 text-white focus:border-[#D8A63A] focus:outline-none"
              />
            </div>

            {/* 4 Options */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[10px] text-[#8C8C8C] uppercase">Option (A)</label>
                <input
                  type="text"
                  value={formOptionA}
                  onChange={(e) => setFormOptionA(e.target.value)}
                  placeholder="Text for option A"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8C8C8C] uppercase">Option (B)</label>
                <input
                  type="text"
                  value={formOptionB}
                  onChange={(e) => setFormOptionB(e.target.value)}
                  placeholder="Text for option B"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8C8C8C] uppercase">Option (C)</label>
                <input
                  type="text"
                  value={formOptionC}
                  onChange={(e) => setFormOptionC(e.target.value)}
                  placeholder="Text for option C"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8C8C8C] uppercase">Option (D)</label>
                <input
                  type="text"
                  value={formOptionD}
                  onChange={(e) => setFormOptionD(e.target.value)}
                  placeholder="Text for option D"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>
            </div>

            {/* Correct Answer & Explanation */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div>
                <label className="text-[10px] text-[#8C8C8C] uppercase">Correct Option</label>
                <select
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-[#F4C95D] font-black focus:border-[#D8A63A] focus:outline-none"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10px] text-[#8C8C8C] uppercase">Elimination Breakdown & Trap Explanation</label>
                <input
                  type="text"
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="Detailed multi-statement elimination rationale..."
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="rounded-2xl border border-[#D8A63A] bg-[#D8A63A] px-6 py-2.5 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_20px_rgba(216,166,58,0.3)]"
              >
                SAVE QUESTION TO CMS →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
