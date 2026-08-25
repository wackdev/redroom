"use client";

import { useState } from "react";
import { sound } from "@/lib/audio/sound-engine";
import {
  UNIVERSAL_TOPICS_DATASET,
  CANONICAL_SOURCES_DATASET,
  KNOWLEDGE_RELATIONSHIPS_DATASET,
  KNOWLEDGE_SUBJECTS_DATASET,
} from "@/lib/knowledge/datasets/polity-knowledge-seed";
import { POLITY_SOURCE_CHUNKS } from "@/lib/knowledge/datasets/polity-chunks-seed";
import { KnowledgeSource, UniversalTopic, SourceChunk, TopicRelationship } from "@/lib/knowledge/types";

export default function KnowledgeVaultAdmin() {
  const [activeSection, setActiveSection] = useState<
    "dashboard" | "sources" | "upload" | "queue" | "ocr" | "topics" | "graph" | "analytics" | "qc"
  >("dashboard");

  // Ingestion Form State
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceSubtitle, setSourceSubtitle] = useState("");
  const [sourceAuthor, setSourceAuthor] = useState("UPSC Faculty");
  const [sourceType, setSourceType] = useState<string>("Standard Book");
  const [primarySubject, setPrimarySubject] = useState("indian_polity");
  const [rawContentText, setRawContentText] = useState("");
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  // Dynamic state
  const [sourcesList, setSourcesList] = useState<KnowledgeSource[]>([...CANONICAL_SOURCES_DATASET]);
  const [chunksList, setChunksList] = useState<SourceChunk[]>([...POLITY_SOURCE_CHUNKS]);
  const [topicsList, setTopicsList] = useState<UniversalTopic[]>([...UNIVERSAL_TOPICS_DATASET]);
  const [relationshipsList, setRelationshipsList] = useState<TopicRelationship[]>([...KNOWLEDGE_RELATIONSHIPS_DATASET]);

  // Selected OCR item for review
  const [selectedOcrChunk, setSelectedOcrChunk] = useState<SourceChunk | null>(POLITY_SOURCE_CHUNKS[0] || null);
  const [correctedText, setCorrectedText] = useState<string>(POLITY_SOURCE_CHUNKS[0]?.cleanedContent || "");

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceTitle.trim() || !rawContentText.trim()) return;

    try {
      const res = await fetch("/api/knowledge/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sourceTitle,
          subtitle: sourceSubtitle,
          author: sourceAuthor,
          sourceType,
          rawText: rawContentText,
          primarySubjectId: primarySubject,
          totalPages: Math.ceil(rawContentText.length / 2000) || 1,
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.source) {
        sound.playVictory();
        setSourcesList((prev) => [data.data.source, ...prev]);
        setUploadFeedback(`Successfully ingested '${sourceTitle}' (${data.data.chunksCreated} chunks generated).`);
        setSourceTitle("");
        setSourceSubtitle("");
        setRawContentText("");
      } else {
        sound.playWrong();
        setUploadFeedback(`Error: ${data.error?.message || "Ingestion failed"}`);
      }
    } catch (err: any) {
      sound.playWrong();
      setUploadFeedback(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* HEADER SECTION NAV */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0c0c0c] p-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <span>🏛️</span> KNOWLEDGE VAULT COMMAND CENTER
          </h2>
          <p className="text-xs text-slate-400">
            Universal Ingestion Pipeline • Semantic Chunking • Knowledge Graph Governance • OCR Audit
          </p>
        </div>

        {/* SECTION SWITCHER */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "dashboard", label: "Overview", icon: "📊" },
            { id: "sources", label: "Sources", icon: "📚" },
            { id: "upload", label: "Upload & Ingest", icon: "⬆️" },
            { id: "ocr", label: "OCR Review", icon: "🔍" },
            { id: "topics", label: "Topics", icon: "📑" },
            { id: "graph", label: "Knowledge Graph", icon: "🕸️" },
            { id: "analytics", label: "Search Analytics", icon: "📈" },
            { id: "qc", label: "Quality Control", icon: "🛡️" },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                sound.playClick();
                setActiveSection(sec.id as any);
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 ${
                activeSection === sec.id
                  ? "bg-amber-400 text-slate-950 font-black shadow-md"
                  : "bg-slate-900 text-slate-400 border border-white/10 hover:text-white"
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. DASHBOARD OVERVIEW */}
      {/* ==================================================================== */}
      {activeSection === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/10 bg-[#121212] p-4 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Sources</span>
              <div className="text-2xl font-black text-amber-400">{sourcesList.length} Books / Notes</div>
              <span className="text-[10px] text-emerald-400">721+ Pages Indexed</span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#121212] p-4 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Semantic Chunks</span>
              <div className="text-2xl font-black text-indigo-400">{chunksList.length} Chunks</div>
              <span className="text-[10px] text-indigo-300">100% Attributed</span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#121212] p-4 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Universal Topics</span>
              <div className="text-2xl font-black text-purple-400">{topicsList.length} Topics</div>
              <span className="text-[10px] text-purple-300">38+ Subjects</span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#121212] p-4 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Graph Relationships</span>
              <div className="text-2xl font-black text-emerald-400">{relationshipsList.length} Edges</div>
              <span className="text-[10px] text-emerald-300">Bidirectional Links</span>
            </div>
          </div>

          {/* RECENT SOURCES TABLE */}
          <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📚</span> Active Canonical Sources
              </h3>
              <button
                onClick={() => setActiveSection("upload")}
                className="text-xs text-amber-400 hover:underline font-bold"
              >
                + Ingest New Material
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase font-mono text-[10px]">
                    <th className="pb-2">Source Title</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Author</th>
                    <th className="pb-2">Pages</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sourcesList.map((src) => (
                    <tr key={src.id} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 font-bold text-white">{src.title}</td>
                      <td className="py-2.5 text-slate-300">{src.sourceType}</td>
                      <td className="py-2.5 text-slate-400">{src.author}</td>
                      <td className="py-2.5 text-slate-400">{src.totalPages} p.</td>
                      <td className="py-2.5">
                        <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          {src.processingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. UPLOAD & INGESTION FORM */}
      {/* ==================================================================== */}
      {activeSection === "upload" && (
        <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>⬆️</span> Universal Document Ingestion Pipeline
            </h3>
            <p className="text-xs text-slate-400">
              Upload notes, standard book chapters, government reports, or case law transcripts for automatic semantic chunking, keyword extraction, and topic mapping.
            </p>
          </div>

          {uploadFeedback && (
            <div className={`p-4 rounded-xl text-xs font-semibold ${
              uploadFeedback.startsWith("Error")
                ? "bg-rose-500/10 border border-rose-500/20 text-rose-300"
                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
            }`}>
              {uploadFeedback}
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Document Title *</label>
                <input
                  type="text"
                  required
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  placeholder="e.g. Finance Commission 15th Report Summary"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Subtitle / Context</label>
                <input
                  type="text"
                  value={sourceSubtitle}
                  onChange={(e) => setSourceSubtitle(e.target.value)}
                  placeholder="e.g. Vertical & Horizontal Devolution Formula"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Source Type</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                >
                  <option value="Standard Book">Standard Book</option>
                  <option value="NCERT">NCERT</option>
                  <option value="Report">Government / Committee Report</option>
                  <option value="Coaching Notes">Coaching Notes</option>
                  <option value="Current Affairs">Current Affairs</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Primary Subject</label>
                <select
                  value={primarySubject}
                  onChange={(e) => setPrimarySubject(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                >
                  {KNOWLEDGE_SUBJECTS_DATASET.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Author / Faculty</label>
                <input
                  type="text"
                  value={sourceAuthor}
                  onChange={(e) => setSourceAuthor(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Raw Text Content *</label>
              <textarea
                required
                rows={8}
                value={rawContentText}
                onChange={(e) => setRawContentText(e.target.value)}
                placeholder="Paste OCR text or document paragraphs here for automated semantic parsing..."
                className="w-full rounded-xl border border-white/10 bg-slate-900 p-3.5 text-xs text-white font-mono placeholder-slate-600 outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 px-6 py-3 text-xs font-black text-slate-950 shadow-lg transition hover:opacity-90 active:scale-95"
            >
              🚀 Process & Ingest Into Knowledge Engine
            </button>
          </form>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. OCR REVIEW & TEXT CORRECTION */}
      {/* ==================================================================== */}
      {activeSection === "ocr" && (
        <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🔍</span> OCR Audit & Text Correction Studio
            </h3>
            <p className="text-xs text-slate-400">
              Audit low-confidence text and perform human-in-the-loop corrections while preserving original source page anchors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CHUNKS LIST */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Select Chunk to Audit:</span>
              {chunksList.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedOcrChunk(c);
                    setCorrectedText(c.cleanedContent);
                    sound.playClick();
                  }}
                  className={`rounded-xl p-3 border transition cursor-pointer text-xs ${
                    selectedOcrChunk?.id === c.id
                      ? "border-amber-400 bg-amber-500/10 text-white"
                      : "border-white/5 bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{c.heading}</span>
                    <span className="text-[10px] text-emerald-400">{Math.round(c.ocrConfidence * 100)}% Conf</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Pages {c.pageStart}–{c.pageEnd}</div>
                </div>
              ))}
            </div>

            {/* EDITING WORKSPACE */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Correct Cleaned Content:</span>
              <textarea
                rows={10}
                value={correctedText}
                onChange={(e) => setCorrectedText(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-3.5 text-xs text-white font-mono outline-none focus:border-amber-400"
              />
              <button
                onClick={() => {
                  sound.playVictory();
                  if (selectedOcrChunk) {
                    selectedOcrChunk.cleanedContent = correctedText;
                  }
                  alert("OCR Text correction saved successfully.");
                }}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-500 transition"
              >
                Save Human Verified Correction ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. KNOWLEDGE GRAPH RELATIONSHIPS GOVERNANCE */}
      {/* ==================================================================== */}
      {activeSection === "graph" && (
        <div className="rounded-2xl border border-white/10 bg-[#121212] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🕸️</span> Knowledge Graph Link Governance
              </h3>
              <p className="text-xs text-slate-400">
                Review and approve cross-subject links, landmark case associations, and constitutional provisions.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {relationshipsList.map((rel, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/5 bg-slate-950 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
                      {rel.relationshipType.replace("_", " ")}
                    </span>
                    <span className="font-bold text-white">{rel.fromTopicName} ↔ {rel.toTopicName}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{rel.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-emerald-400">
                    {rel.verificationStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
