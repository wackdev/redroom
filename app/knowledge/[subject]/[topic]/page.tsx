"use client";

import { use, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sound } from "@/lib/audio/sound-engine";
import { getTopicUnifiedView, updateStudentTopicProgress } from "@/lib/knowledge/knowledge-engine";
import { TopicUnifiedView, SourceChunk, TopicRevisionCard, StudentTopicStatus } from "@/lib/knowledge/types";

export default function UniversalTopicWorkspacePage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "overview" | "notes" | "sources" | "connected" | "pyqs" | "practice" | "revision" | "progress"
  >("overview");

  // Load Unified Topic View
  const unifiedView: TopicUnifiedView | null = useMemo(() => {
    return getTopicUnifiedView(resolvedParams.topic);
  }, [resolvedParams.topic]);

  // Local Practice State
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<Record<number, string>>({});
  const [showPracticeExplanation, setShowPracticeExplanation] = useState<Record<number, boolean>>({});

  // Local Revision State
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Local Progress Tracking
  const [currentStatus, setCurrentStatus] = useState<StudentTopicStatus>(
    unifiedView?.studentProgress?.status || "Studying"
  );

  // Time Spent Tracker
  useEffect(() => {
    if (!unifiedView) return;
    const interval = setInterval(() => {
      updateStudentTopicProgress("guest-cadet", unifiedView.topic.id, {
        timeSpentSeconds: (unifiedView.studentProgress?.timeSpentSeconds || 0) + 5,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [unifiedView]);

  if (!unifiedView) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-4xl">🏛️</div>
          <h2 className="text-xl font-bold">Topic Not Found</h2>
          <p className="text-xs text-slate-400">
            The requested knowledge topic '{resolvedParams.topic}' does not exist in the vault.
          </p>
          <Link
            href="/knowledge"
            className="inline-block rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950"
          >
            ← Back to Knowledge Vault
          </Link>
        </div>
      </div>
    );
  }

  const { topic, subject, breadcrumbs, chunks, sources, connectedRelationships, crossSubjectConnections, prelimsPyqs, mainsPyqs, revisionCards, studentProgress } =
    unifiedView;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* STICKY TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-30 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* BREADCRUMBS */}
          <div className="flex items-center gap-2 text-xs text-slate-400 overflow-x-auto w-full md:w-auto">
            <Link href="/knowledge" className="hover:text-white transition whitespace-nowrap">
              Vault
            </Link>
            <span>/</span>
            <Link href={`/knowledge?subject=${subject.id}`} className="hover:text-white transition whitespace-nowrap">
              {subject.name}
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-bold whitespace-nowrap truncate max-w-[200px]">
              {topic.name}
            </span>
          </div>

          {/* TOPIC MASTERY HUD */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-white/10 px-3 py-1 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Status:</span>
              <select
                value={currentStatus}
                onChange={(e) => {
                  const newStatus = e.target.value as StudentTopicStatus;
                  setCurrentStatus(newStatus);
                  updateStudentTopicProgress("guest-cadet", topic.id, { status: newStatus });
                  sound.playVictory();
                }}
                className="bg-transparent font-bold text-amber-400 outline-none cursor-pointer text-xs"
              >
                <option value="Exploring" className="bg-slate-900 text-white">Exploring</option>
                <option value="Studying" className="bg-slate-900 text-white">Studying</option>
                <option value="Practicing" className="bg-slate-900 text-white">Practicing</option>
                <option value="Revising" className="bg-slate-900 text-white">Revising</option>
                <option value="Mastered" className="bg-slate-900 text-white">Mastered</option>
              </select>
            </div>

            <Link
              href="/knowledge"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold hover:bg-white/10 transition"
            >
              Search Engine 🔍
            </Link>
          </div>
        </div>
      </nav>

      {/* TOPIC HERO BANNER */}
      <header className="max-w-7xl mx-auto px-4 pt-6 sm:px-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl select-none pointer-events-none">
            {subject.icon}
          </div>

          <div className="relative z-10 space-y-3 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-black uppercase tracking-wider">
                {topic.syllabusCode || "GS-2 POLITY"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-semibold">
                UPSC Weightage: {topic.importanceScore}/100
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                {chunks.length} Knowledge Chunks
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {topic.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {topic.description}
            </p>
          </div>

          {/* 8 INTERACTIVE TABS */}
          <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap gap-2">
            {[
              { id: "overview", label: "Overview", icon: "📑" },
              { id: "notes", label: `Notes (${chunks.length})`, icon: "📖" },
              { id: "sources", label: `Sources (${sources.length})`, icon: "📚" },
              { id: "connected", label: `Connected Graph (${connectedRelationships.length})`, icon: "🕸️" },
              { id: "pyqs", label: `PYQs (${prelimsPyqs.length + mainsPyqs.length})`, icon: "🎯" },
              { id: "practice", label: "Practice", icon: "✍️" },
              { id: "revision", label: `Revision (${revisionCards.length})`, icon: "⚡" },
              { id: "progress", label: "Progress", icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 font-black scale-105"
                    : "bg-slate-900/80 text-slate-400 border border-white/10 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* TAB CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 pt-6 sm:px-8">
        {/* ==================================================================== */}
        {/* 1. OVERVIEW TAB */}
        {/* ==================================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* 30s & 2m REVISION SUMMARIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <span>⚡</span> 30-Second Rapid Sprint Summary
                  </h3>
                  <span className="text-[10px] text-slate-400">Pre-Exam Refresh</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {topic.summary30s || topic.description}
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <span>⏱️</span> 2-Minute Conceptual Review
                  </h3>
                  <span className="text-[10px] text-slate-400">Deep Foundation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {topic.summary2m || topic.summary30s || topic.description}
                </p>
              </div>
            </div>

            {/* KEY CONSTITUTIONAL ENTITIES MATRIX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* ARTICLES */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Constitutional Articles</span>
                <div className="flex flex-wrap gap-1.5">
                  {topic.keyArticles.length > 0 ? (
                    topic.keyArticles.map((art) => (
                      <span key={art} className="rounded bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[11px] font-bold text-indigo-300">
                        {art}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">None specified</span>
                  )}
                </div>
              </div>

              {/* LANDMARK CASES */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Landmark Judgments</span>
                <div className="space-y-1">
                  {topic.landmarkCases.length > 0 ? (
                    topic.landmarkCases.map((c) => (
                      <div key={c} className="text-xs text-amber-300 font-semibold truncate" title={c}>
                        ⚖️ {c}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">None specified</span>
                  )}
                </div>
              </div>

              {/* COMMITTEES */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Commissions & Committees</span>
                <div className="space-y-1">
                  {topic.committees.length > 0 ? (
                    topic.committees.map((com) => (
                      <div key={com} className="text-xs text-emerald-300 font-semibold truncate" title={com}>
                        📋 {com}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">None specified</span>
                  )}
                </div>
              </div>

              {/* AMENDMENTS */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Amendments</span>
                <div className="space-y-1">
                  {topic.constitutionalAmendments.length > 0 ? (
                    topic.constitutionalAmendments.map((am) => (
                      <div key={am} className="text-xs text-pink-300 font-semibold truncate" title={am}>
                        📜 {am}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">None specified</span>
                  )}
                </div>
              </div>
            </div>

            {/* CHALLENGES & WAY FORWARD FOR MAINS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-rose-500/20 bg-slate-900/60 p-5 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <span>⚠️</span> Contemporary Challenges & Critical Issues
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed">
                  {(topic.challengesAndIssues && topic.challengesAndIssues.length > 0
                    ? topic.challengesAndIssues
                    : [
                        "Structural rigidity in implementation",
                        "Delay in judicial adjudication & lack of enforcement teeth",
                        "Tension between legislative intent and executive execution",
                      ]
                  ).map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-5 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <span>🚀</span> Institutional Way Forward & Reforms
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed">
                  {(topic.wayForward && topic.wayForward.length > 0
                    ? topic.wayForward
                    : [
                        "Implement 2nd ARC and Law Commission recommendations in a time-bound manner",
                        "Adopt cooperative federalism consultative mechanisms to reduce institutional friction",
                        "Strengthen transparency and objective performance indicators",
                      ]
                  ).map((wf, idx) => (
                    <li key={idx}>{wf}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 2. NOTES TAB (MULTI-SOURCE NOTES WITH ATTRIBUTION) */}
        {/* ==================================================================== */}
        {activeTab === "notes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📖</span> Multi-Source Notes Vault
              </h3>
              <span className="text-xs text-slate-400">{chunks.length} Semantic Chunks</span>
            </div>

            <div className="space-y-4">
              {chunks.map((chunk) => (
                <div
                  key={chunk.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {chunk.chunkType.replace("_", " ")}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {chunk.sourceTitle} (Pages {chunk.pageStart}–{chunk.pageEnd})
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400">
                      OCR Confidence: {Math.round(chunk.ocrConfidence * 100)}%
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">{chunk.heading}</h4>
                  {chunk.subheading && (
                    <h5 className="text-xs text-slate-400 italic">{chunk.subheading}</h5>
                  )}

                  <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {chunk.cleanedContent}
                  </div>

                  {chunk.keywords && chunk.keywords.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Keywords:</span>
                      {chunk.keywords.map((kw) => (
                        <span key={kw} className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 3. SOURCES TAB (ORIGINAL DOCUMENT VIEWER) */}
        {/* ==================================================================== */}
        {activeTab === "sources" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📚</span> Primary Source Attributions
              </h3>
              <p className="text-xs text-slate-400">
                Every note in WhyNotUPSC is strictly attributed to published source pages. Click below to inspect source boundaries.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sources.map(({ source, pageRanges }) => (
                  <div
                    key={source.id}
                    className="rounded-xl border border-white/10 bg-slate-950 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                        {source.sourceType}
                      </span>
                      <span className="text-xs text-slate-400">{pageRanges}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{source.title}</h4>
                    <p className="text-xs text-slate-400">
                      Author: {source.author} • Publisher: {source.publisher || "N/A"}
                    </p>
                    <div className="pt-2 text-[11px] text-indigo-400 font-semibold">
                      Total Source Pages: {source.totalPages} • Native Text: 100%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 4. CONNECTED KNOWLEDGE GRAPH TAB */}
        {/* ==================================================================== */}
        {activeTab === "connected" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>🕸️</span> Interconnected Knowledge Graph
                  </h3>
                  <p className="text-xs text-slate-400">
                    Bidirectional linkages across constitutional provisions, landmark judgments, and other subjects.
                  </p>
                </div>
              </div>

              {/* RELATIONSHIP EDGES LIST */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {connectedRelationships.map((rel, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 bg-slate-950 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {rel.relationshipType.replace("_", " ")}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {Math.round(rel.relevanceScore * 100)}% Affinity
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white">
                      {rel.fromTopicName} ↔ {rel.toTopicName}
                    </h4>
                    {rel.description && (
                      <p className="text-[11px] text-slate-400">{rel.description}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* CROSS-SUBJECT CONNECTIONS HIGHLIGHT */}
              {crossSubjectConnections.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                    🌐 Cross-Subject Linkages (Mains GS 1-4 Interdisciplinary Integration)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {crossSubjectConnections.map((cs, idx) => (
                      <div key={idx} className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-slate-300">
                        <span className="font-bold text-amber-300">{cs.toSubjectId?.toUpperCase()}: </span>
                        {cs.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 5. PYQs TAB (PRELIMS & MAINS) */}
        {/* ==================================================================== */}
        {activeTab === "pyqs" && (
          <div className="space-y-6">
            {/* PRELIMS PYQs */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🎯</span> Prelims PYQs Linked to this Topic ({prelimsPyqs.length})
              </h3>

              <div className="space-y-4">
                {prelimsPyqs.map((q) => (
                  <div key={q.id} className="rounded-xl border border-white/5 bg-slate-950 p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold text-amber-400">UPSC Prelims {q.year}</span>
                      <span>Difficulty: {q.difficulty}</span>
                    </div>
                    <p className="text-xs text-white leading-relaxed font-medium">{q.question}</p>
                    <div className="pt-2 text-xs text-emerald-400 font-bold">
                      Correct Answer: {q.correctAnswer}
                    </div>
                    <p className="text-[11px] text-slate-400 bg-white/5 p-3 rounded-lg leading-relaxed">
                      💡 {q.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* MAINS PYQs */}
            {mainsPyqs.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📑</span> Mains Questions & Model Blueprints ({mainsPyqs.length})
                </h3>

                <div className="space-y-4">
                  {mainsPyqs.map((mq) => (
                    <div key={mq.id} className="rounded-xl border border-white/5 bg-slate-950 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-bold text-indigo-400">
                          UPSC Mains {mq.year} • {mq.paper} ({mq.marks} Marks)
                        </span>
                        <span>Word Limit: {mq.wordLimit}</span>
                      </div>
                      <p className="text-xs text-white leading-relaxed font-bold">{mq.question}</p>
                      {mq.framework && (
                        <div className="text-[11px] text-amber-300 bg-amber-500/10 p-2.5 rounded-lg">
                          📐 <span className="font-bold">PESTLE Blueprint:</span>{" "}
                          {typeof mq.framework === "string" ? mq.framework : mq.framework.introduction}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* 6. PRACTICE TAB (INTERACTIVE QUIZ) */}
        {/* ==================================================================== */}
        {activeTab === "practice" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>✍️</span> Practice MCQs for {topic.name}
              </h3>
              <p className="text-xs text-slate-400">
                Solve UPSC-standard MCQs directly to calibrate your concept retention.
              </p>

              {prelimsPyqs.length > 0 ? (
                <div className="space-y-6">
                  {prelimsPyqs.slice(0, 3).map((pyq, index) => {
                    const selected = selectedPracticeOption[index];
                    const isAnswered = Boolean(selected);
                    const isCorrect = selected === pyq.correctAnswer;

                    return (
                      <div key={pyq.id} className="rounded-2xl border border-white/10 bg-slate-950 p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-bold text-amber-400">Question {index + 1}</span>
                          <span>UPSC Prelims {pyq.year}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                          {pyq.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                          {(pyq.options || []).map((opt) => (
                            <button
                              key={opt.id}
                              disabled={isAnswered}
                              onClick={() => {
                                setSelectedPracticeOption((prev) => ({ ...prev, [index]: opt.id }));
                                if (opt.id === pyq.correctAnswer) sound.playVictory();
                                else sound.playWrong();
                              }}
                              className={`rounded-xl p-3 text-left text-xs font-semibold transition border ${
                                isAnswered
                                  ? opt.id === pyq.correctAnswer
                                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                                    : selected === opt.id
                                    ? "bg-rose-500/20 border-rose-500 text-rose-300"
                                    : "bg-slate-900/40 border-white/5 text-slate-500"
                                  : "bg-slate-900 border-white/10 text-slate-300 hover:border-amber-400/50 hover:bg-slate-800"
                              }`}
                            >
                              <span className="font-bold mr-1.5">({opt.id})</span>
                              {opt.text}
                            </button>
                          ))}
                        </div>

                        {isAnswered && (
                          <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                            <div className={`font-bold ${isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                              {isCorrect ? "✓ Correct!" : `✗ Incorrect (Correct Answer: ${pyq.correctAnswer})`}
                            </div>
                            <p className="text-slate-300 leading-relaxed">{pyq.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Practice questions are currently being generated for this topic.</p>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 7. REVISION TAB (SPACED REPETITION FLASHCARDS) */}
        {/* ==================================================================== */}
        {activeTab === "revision" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>⚡</span> Spaced Repetition Revision Cards
                  </h3>
                  <p className="text-xs text-slate-400">
                    Card {activeCardIndex + 1} of {revisionCards.length || 1} • Connected to SM-2 Algorithm
                  </p>
                </div>
              </div>

              {revisionCards.length > 0 ? (
                <div className="max-w-2xl mx-auto space-y-4">
                  {/* FLASHCARD CONTAINER */}
                  <div
                    onClick={() => {
                      sound.playClick();
                      setIsFlipped(!isFlipped);
                    }}
                    className="min-h-[220px] rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900 to-indigo-950/40 p-6 sm:p-8 flex flex-col justify-between shadow-2xl cursor-pointer hover:border-amber-400/50 transition-all text-center select-none"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                      <span>{revisionCards[activeCardIndex]?.cardType.replace("_", " ")}</span>
                      <span>Click to flip 🔄</span>
                    </div>

                    <div className="py-4">
                      {!isFlipped ? (
                        <h4 className="text-base sm:text-lg font-bold text-white">
                          {revisionCards[activeCardIndex]?.front}
                        </h4>
                      ) : (
                        <div className="space-y-2 text-left">
                          <p className="text-xs sm:text-sm text-amber-200 leading-relaxed whitespace-pre-line">
                            {revisionCards[activeCardIndex]?.back}
                          </p>
                          {revisionCards[activeCardIndex]?.sourceRef && (
                            <span className="text-[10px] text-slate-400 block pt-2">
                              Source: {revisionCards[activeCardIndex]?.sourceRef}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-500 font-semibold">
                      {isFlipped ? "Rate retention difficulty below" : "Reveal Answer"}
                    </div>
                  </div>

                  {/* RATING BUTTONS */}
                  {isFlipped && (
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {[
                        { label: "Again (1)", color: "bg-rose-600 hover:bg-rose-500" },
                        { label: "Hard (2)", color: "bg-amber-600 hover:bg-amber-500" },
                        { label: "Good (3)", color: "bg-indigo-600 hover:bg-indigo-500" },
                        { label: "Easy (4)", color: "bg-emerald-600 hover:bg-emerald-500" },
                      ].map((btn, idx) => (
                        <button
                          key={btn.label}
                          onClick={() => {
                            sound.playVictory();
                            setIsFlipped(false);
                            setActiveCardIndex((prev) => (prev + 1) % revisionCards.length);
                          }}
                          className={`rounded-xl py-2.5 text-xs font-bold text-white shadow-lg transition ${btn.color}`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-8">
                  No flashcards generated yet for this topic.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 8. PROGRESS TAB */}
        {/* ==================================================================== */}
        {activeTab === "progress" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📊</span> Topic Mastery & Telemetry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-slate-950 p-4 border border-white/5 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Mastery Level</span>
                  <div className="text-2xl font-black text-amber-400">
                    {studentProgress?.masteryPercentage || 25}%
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950 p-4 border border-white/5 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">PYQ Accuracy</span>
                  <div className="text-2xl font-black text-indigo-400">
                    {studentProgress?.pyqsAttempted
                      ? `${Math.round((studentProgress.pyqsCorrect / studentProgress.pyqsAttempted) * 100)}%`
                      : "N/A"}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950 p-4 border border-white/5 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Active State</span>
                  <div className="text-xl font-black text-emerald-400">{currentStatus}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
