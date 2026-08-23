"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CurrentAffairsArticle, CurrentAffairsQuizQuestion } from "@/lib/core/types";
import { formatDate, safeArray } from "@/lib/core/utils";
import DailyAudioBrief from "@/components/DailyAudioBrief";
import EconomicSurveyVisualizer from "@/components/EconomicSurveyVisualizer";
import GeopoliticsMapAtlas from "@/components/GeopoliticsMapAtlas";
import AuthGuard from "@/components/auth/AuthGuard";
import { sound } from "@/lib/audio/sound-engine";

export default function CurrentAffairsPage() {
  const router = useRouter();

  const [articles, setArticles] = useState<CurrentAffairsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<CurrentAffairsArticle | null>(null);
  const [refreshFeedback, setRefreshFeedback] = useState("");

  // AI Analysis state
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisModal, setAnalysisModal] = useState<{
    title: string;
    summary: string;
    gsPaper: string;
    prelimsPoints: string[];
    mainsAngle: string;
  } | null>(null);

  // Interactive Quiz state
  const [quizzingId, setQuizzingId] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<CurrentAffairsQuizQuestion[] | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<string, boolean>>({});

  const [selectedSource, setSelectedSource] = useState<string>("All");
  const [selectedGSPaper, setSelectedGSPaper] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEconomicSurvey, setShowEconomicSurvey] = useState(false);
  const [showGeopoliticsAtlas, setShowGeopoliticsAtlas] = useState(false);

  const loadArticles = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
      sound.playHover();
    } else {
      setLoading(true);
    }
    setError("");
    setRefreshFeedback("");

    try {
      const url = isManualRefresh ? "/api/current-affairs?refresh=true" : "/api/current-affairs";
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();

      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setArticles(json.data);
        if (!selectedArticle || isManualRefresh) {
          setSelectedArticle(json.data[0]);
        }
        if (isManualRefresh) {
          sound.playVictory();
          setRefreshFeedback(`Updated ${json.data.length} live articles from Indian Express, PIB & PRS.`);
          setTimeout(() => setRefreshFeedback(""), 4000);
        }
      } else {
        setError(json.error?.message || "Failed to load latest current affairs.");
      }
    } catch {
      setError("Network error while connecting to current affairs newsfeed.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedArticle]);

  useEffect(() => {
    void loadArticles(false);
  }, []);

  const filteredArticles = useMemo(() => {
    return safeArray(articles).filter((item) => {
      const matchesSource =
        selectedSource === "All" || item.source.toLowerCase().includes(selectedSource.toLowerCase());
      const matchesPaper = selectedGSPaper === "All" || item.gsPaper === selectedGSPaper;
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSource && matchesPaper && matchesSearch;
    });
  }, [articles, selectedSource, selectedGSPaper, searchQuery]);

  // Trigger AI Analysis
  const handleAnalyze = async (article: CurrentAffairsArticle) => {
    setAnalyzingId(article.id);
    sound.playHover();

    try {
      const res = await fetch("/api/current-affairs/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          content: article.summary + " " + safeArray(article.prelimsPoints).join(" "),
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        sound.playVictory();
        setAnalysisModal({
          title: article.title,
          summary: json.data.summary,
          gsPaper: json.data.gsPaper || article.gsPaper || "GS-2",
          prelimsPoints: safeArray(json.data.prelimsPoints),
          mainsAngle: json.data.mainsAngle,
        });
      } else {
        setAnalysisModal({
          title: article.title,
          summary: article.summary,
          gsPaper: article.gsPaper || "GS-2",
          prelimsPoints: safeArray(article.prelimsPoints),
          mainsAngle: article.mainsAngle || "Analyze policy implications under UPSC GS framework.",
        });
      }
    } catch {
      setAnalysisModal({
        title: article.title,
        summary: article.summary,
        gsPaper: article.gsPaper || "GS-2",
        prelimsPoints: safeArray(article.prelimsPoints),
        mainsAngle: article.mainsAngle || "Analyze policy implications under UPSC GS framework.",
      });
    } finally {
      setAnalyzingId(null);
    }
  };

  // Trigger Quiz Generation
  const handleGenerateQuiz = async (article: CurrentAffairsArticle) => {
    setQuizzingId(article.id);
    sound.playHover();

    try {
      const res = await fetch("/api/current-affairs/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: article.title,
          content: article.summary,
          count: 3,
        }),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data?.questions) && json.data.questions.length > 0) {
        sound.playVictory();
        setQuizQuestions(json.data.questions);
        setQuizIndex(0);
        setSelectedAnswers({});
        setRevealedQuestions({});
      } else {
        // Fallback quiz from article
        setQuizQuestions([
          {
            id: "q1",
            question: `With reference to "${article.title.slice(0, 70)}", consider the key dimensions discussed in current affairs:\n\nWhich of the statements given above is/are most aligned with the constitutional/policy framework?`,
            options: [
              { id: "A", text: "Requires statutory notification under relevant ministry guidelines" },
              { id: "B", text: "Directly governed by constitutional fundamental rights protections" },
              { id: "C", text: "Both A and B" },
              { id: "D", text: "Neither A nor B" },
            ],
            answer: "C",
            explanation: "Core policy implementation requires institutional alignment and regulatory oversight.",
          },
        ]);
        setQuizIndex(0);
        setSelectedAnswers({});
        setRevealedQuestions({});
      }
    } catch {
      alert("Quiz generation failed. Please check network connection.");
    } finally {
      setQuizzingId(null);
    }
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0d0d0d]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sound.playHover();
                  router.push("/dashboard");
                }}
                className="font-mono text-xs text-[#F4C95D] transition hover:underline"
              >
                ← Command Centre
              </button>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#D8A63A] font-mono text-xs font-black text-black">
                  📰
                </span>
                <span className="font-mono font-black tracking-widest text-sm text-white uppercase">
                  CURRENT AFFAIRS RADAR
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => void loadArticles(true)}
                disabled={refreshing || loading}
                title="Fetch fresh live articles from Indian Express, PIB, and PRS feeds"
                className="flex items-center gap-2 rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3.5 py-1.5 font-mono text-xs font-bold text-[#F4C95D] hover:bg-[#D8A63A]/20 transition disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(216,166,58,0.2)]"
              >
                <span className={refreshing ? "animate-spin" : ""}>🔄</span>
                <span>{refreshing ? "SCRAPING LIVE FEEDS..." : "↻ REFRESH DAILY NEWS"}</span>
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
          {/* HERO BANNER */}
          <section className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-6">
            <div>
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-[#F4C95D]">
                CIVIL SERVICES DAILY INTELLIGENCE
              </p>
              <h1 className="mt-1 text-2xl sm:text-4xl font-black text-white">
                Current Affairs Command Centre
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#8C8C8C] max-w-3xl">
                Multi-source live editorial synthesis (The Indian Express Explained, PIB Press Releases, PRS India) categorized for GS-1, GS-2, GS-3 & GS-4 with instant AI analysis & Prelims MCQs.
              </p>
            </div>
            <div className="text-left md:text-right font-mono text-xs text-[#8C8C8C]">
              <span>Date: </span>
              <strong className="text-white">{formatDate(new Date(), "full")}</strong>
            </div>
          </section>

          {refreshFeedback && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 font-mono text-xs text-emerald-300 animate-fadeIn flex items-center gap-2">
              <span>✓</span>
              <span>{refreshFeedback}</span>
            </div>
          )}

          {/* DAILY AUDIO BRIEF */}
          <section>
            <DailyAudioBrief />
          </section>

          {/* ACADEMIC ENGINES TOGGLE BAR */}
          <section className="flex flex-wrap gap-3 font-mono text-xs">
            <button
              onClick={() => {
                setShowEconomicSurvey((p) => !p);
                sound.playHover();
              }}
              className={`rounded-2xl border px-4 py-2.5 font-bold transition ${
                showEconomicSurvey
                  ? "border-[#D8A63A] bg-[#D8A63A] text-black shadow-lg"
                  : "border-white/10 bg-white/5 text-[#F4C95D] hover:bg-white/10"
              }`}
            >
              📊 {showEconomicSurvey ? "Hide Budget & Survey Matrix" : "Budget & Economic Survey Lab"}
            </button>

            <button
              onClick={() => {
                setShowGeopoliticsAtlas((p) => !p);
                sound.playHover();
              }}
              className={`rounded-2xl border px-4 py-2.5 font-bold transition ${
                showGeopoliticsAtlas
                  ? "border-blue-500 bg-blue-600 text-white shadow-lg"
                  : "border-white/10 bg-white/5 text-blue-300 hover:bg-white/10"
              }`}
            >
              🌍 {showGeopoliticsAtlas ? "Hide Geopolitics Atlas" : "Geopolitics & Maritime Atlas"}
            </button>
          </section>

          {/* ECONOMIC SURVEY VISUALIZER */}
          {showEconomicSurvey && (
            <section className="animate-fadeIn">
              <EconomicSurveyVisualizer />
            </section>
          )}

          {/* GEOPOLITICS MAP ATLAS */}
          {showGeopoliticsAtlas && (
            <section className="animate-fadeIn">
              <GeopoliticsMapAtlas />
            </section>
          )}

          {/* FILTERS & SEARCH */}
          <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#0d0d0d] p-4 sm:p-5 shadow-xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search headlines, ministries, constitutional articles, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-xs sm:text-sm text-white outline-none placeholder:text-white/30 focus:border-[#D8A63A] transition"
                />
              </div>

              {/* SOURCE SELECTOR */}
              <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/10 bg-black/40 p-1 font-mono text-xs">
                {[
                  { id: "All", label: "All Feeds" },
                  { id: "Indian Express", label: "📰 Indian Express" },
                  { id: "PIB", label: "🏛️ PIB Releases" },
                  { id: "PRS", label: "⚖️ PRS India" },
                ].map((src) => (
                  <button
                    key={src.id}
                    onClick={() => {
                      sound.playHover();
                      setSelectedSource(src.id);
                    }}
                    className={`rounded-xl px-3 py-1.5 font-bold transition ${
                      selectedSource === src.id
                        ? "bg-[#D8A63A] text-black shadow-[0_0_10px_rgba(216,166,58,0.3)]"
                        : "text-[#8C8C8C] hover:text-white"
                    }`}
                  >
                    {src.label}
                  </button>
                ))}
              </div>
            </div>

            {/* GS PAPER PILLS */}
            <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-3 font-mono text-xs">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#8C8C8C] mr-1">
                Filter by GS Paper:
              </span>
              {["All", "GS-1", "GS-2", "GS-3", "GS-4"].map((paper) => (
                <button
                  key={paper}
                  onClick={() => {
                    sound.playHover();
                    setSelectedGSPaper(paper);
                  }}
                  className={`rounded-xl px-3 py-1 font-bold transition ${
                    selectedGSPaper === paper
                      ? "border border-[#D8A63A] bg-[#D8A63A]/20 text-[#F4C95D]"
                      : "border border-white/10 bg-white/5 text-[#8C8C8C] hover:text-white"
                  }`}
                >
                  {paper}
                </button>
              ))}
            </div>
          </section>

          {/* ERROR NOTIFICATION */}
          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 font-mono text-xs text-red-300 flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button
                onClick={() => void loadArticles(true)}
                className="rounded-lg bg-red-500/20 px-3 py-1 hover:bg-red-500/30 text-white"
              >
                Retry Fetch
              </button>
            </div>
          )}

          {/* MAIN SPLIT VIEW */}
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-16 text-center text-[#8C8C8C] font-mono text-xs">
              <div className="h-8 w-8 mx-auto mb-3 animate-spin rounded-full border-2 border-[#D8A63A] border-t-transparent shadow-[0_0_15px_rgba(216,166,58,0.3)]" />
              <p className="font-bold text-white">SCANNING LIVE UPSC INTELLIGENCE FEEDS...</p>
              <p className="mt-1 text-[11px]">Ingesting Indian Express Explained, PIB releases & PRS reports</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-[#0d0d0d] p-12 text-center">
              <p className="text-base font-bold text-white">No articles match your search filter</p>
              <p className="mt-2 font-mono text-xs text-[#8C8C8C]">Try adjusting your search query or clicking Refresh Daily News.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSource("All");
                  setSelectedGSPaper("All");
                }}
                className="mt-4 rounded-xl bg-[#D8A63A] px-4 py-2 font-mono text-xs font-black text-black"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
              {/* SIDEBAR ARTICLE LIST */}
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs text-[#8C8C8C]">
                  <span>ARTICLES ({filteredArticles.length})</span>
                  <span className="text-[#F4C95D]">CLICK TO INSPECT</span>
                </div>
                <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
                  {filteredArticles.map((article) => {
                    const isSelected = selectedArticle?.id === article.id;
                    return (
                      <div
                        key={article.id}
                        onClick={() => {
                          sound.playHover();
                          setSelectedArticle(article);
                        }}
                        className={`cursor-pointer rounded-2xl border p-4 transition ${
                          isSelected
                            ? "border-[#D8A63A] bg-[#D8A63A]/10 shadow-[0_0_20px_rgba(216,166,58,0.15)]"
                            : "border-white/10 bg-[#0d0d0d] hover:border-white/20 hover:bg-[#141414]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5 font-mono text-[10px]">
                          <span className="rounded-full bg-[#D8A63A]/20 border border-[#D8A63A]/40 px-2 py-0.5 font-bold text-[#F4C95D]">
                            {article.gsPaper || "GS-2"}
                          </span>
                          <span className="text-[#8C8C8C] truncate max-w-[160px]">{article.source}</span>
                        </div>
                        <h3 className="line-clamp-2 text-xs sm:text-sm font-bold text-white leading-snug">
                          {article.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-xs text-[#8C8C8C] leading-relaxed">
                          {article.summary}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ARTICLE DETAIL VIEW */}
              {selectedArticle ? (
                <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 sm:p-8 shadow-2xl space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#D8A63A] px-3 py-1 font-mono text-xs font-black text-black">
                        {selectedArticle.gsPaper || "GS-2"}
                      </span>
                      <span className="font-mono text-xs text-[#F4C95D] font-bold">
                        {selectedArticle.category || "General Studies"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <button
                        onClick={() => void handleAnalyze(selectedArticle)}
                        disabled={analyzingId === selectedArticle.id}
                        className="flex items-center gap-1.5 rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3.5 py-1.5 font-bold text-[#F4C95D] hover:bg-[#D8A63A]/20 transition disabled:opacity-50"
                      >
                        <span>🧠</span>
                        <span>{analyzingId === selectedArticle.id ? "Analyzing..." : "AI GS Analysis"}</span>
                      </button>

                      <button
                        onClick={() => void handleGenerateQuiz(selectedArticle)}
                        disabled={quizzingId === selectedArticle.id}
                        className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 px-3.5 py-1.5 font-bold text-blue-300 hover:bg-blue-500/20 transition disabled:opacity-50"
                      >
                        <span>⚡</span>
                        <span>{quizzingId === selectedArticle.id ? "Generating..." : "Generate MCQs"}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                      {selectedArticle.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-3 font-mono text-xs text-[#8C8C8C]">
                      <span>Source: <strong className="text-white">{selectedArticle.source}</strong></span>
                      <span>•</span>
                      <span>Date: <strong className="text-white">{selectedArticle.date}</strong></span>
                    </div>
                  </div>

                  {/* SUMMARY & CONTEXT */}
                  <div className="rounded-2xl border border-white/5 bg-black/40 p-5 space-y-3">
                    <h4 className="font-mono text-xs font-black tracking-wider text-[#F4C95D] uppercase">
                      Executive UPSC Editorial Summary
                    </h4>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                      {selectedArticle.summary}
                    </p>
                    {selectedArticle.context && (
                      <p className="font-mono text-xs text-[#8C8C8C] italic">
                        Context: {selectedArticle.context}
                      </p>
                    )}
                  </div>

                  {/* PRELIMS HIGH YIELD POINTERS */}
                  {safeArray(selectedArticle.prelimsPoints).length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs font-black tracking-wider text-[#F4C95D] uppercase flex items-center gap-2">
                        <span>🎯</span>
                        <span>Prelims High-Yield Eliminators & Facts</span>
                      </h4>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {safeArray(selectedArticle.prelimsPoints).map((point, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-white/5 bg-black/30 p-3 text-xs text-white/80 leading-relaxed flex items-start gap-2.5"
                          >
                            <span className="font-mono text-[#D8A63A] font-bold">#{idx + 1}</span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MAINS ANGLE */}
                  {selectedArticle.mainsAngle && (
                    <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-5 space-y-2">
                      <h4 className="font-mono text-xs font-black tracking-wider text-purple-300 uppercase flex items-center gap-2">
                        <span>✍️</span>
                        <span>UPSC GS Mains Analytical Dimension</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-serif italic">
                        &ldquo;{selectedArticle.mainsAngle}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* FOOTER LINK */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs">
                    <a
                      href={selectedArticle.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F4C95D] hover:underline flex items-center gap-1"
                    >
                      <span>Read full original article on {selectedArticle.source}</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* AI ANALYSIS MODAL */}
        {analysisModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-2xl rounded-3xl border border-[#D8A63A] bg-[#0d0d0d] p-6 sm:p-8 shadow-[0_0_50px_rgba(216,166,58,0.25)] space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧠</span>
                  <h3 className="font-mono text-sm font-black text-white uppercase">
                    AI STRATEGIC EDITORIAL BREAKDOWN
                  </h3>
                </div>
                <button
                  onClick={() => setAnalysisModal(null)}
                  className="rounded-lg border border-white/10 px-2.5 py-1 font-mono text-xs text-[#8C8C8C] hover:text-white"
                >
                  ✕ Close
                </button>
              </div>

              <h4 className="text-base font-bold text-white">{analysisModal.title}</h4>

              <div className="rounded-2xl bg-black/50 p-4 border border-white/5 text-xs text-white/90 leading-relaxed">
                <strong className="text-[#F4C95D] font-mono block mb-1">Synthesized Core Concept:</strong>
                {analysisModal.summary}
              </div>

              {analysisModal.prelimsPoints.length > 0 && (
                <div className="space-y-2">
                  <span className="font-mono text-xs font-bold text-[#F4C95D] uppercase">
                    Prelims Keywords & Statutory Hooks:
                  </span>
                  <ul className="space-y-1.5 text-xs text-white/80 list-disc list-inside">
                    {analysisModal.prelimsPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisModal.mainsAngle && (
                <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4 text-xs text-purple-200">
                  <strong className="font-mono block mb-1 uppercase">Mains Evaluative Angle:</strong>
                  {analysisModal.mainsAngle}
                </div>
              )}
            </div>
          </div>
        )}

        {/* INTERACTIVE MCQ QUIZ MODAL */}
        {quizQuestions && quizQuestions.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-2xl rounded-3xl border border-blue-500 bg-[#0d0d0d] p-6 sm:p-8 shadow-[0_0_50px_rgba(59,130,246,0.25)] space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <h3 className="font-mono text-sm font-black text-white uppercase">
                    PRELIMS MCQ LAB // QUESTION {quizIndex + 1} OF {quizQuestions.length}
                  </h3>
                </div>
                <button
                  onClick={() => setQuizQuestions(null)}
                  className="rounded-lg border border-white/10 px-2.5 py-1 font-mono text-xs text-[#8C8C8C] hover:text-white"
                >
                  ✕ Close
                </button>
              </div>

              {(() => {
                const q = quizQuestions[quizIndex];
                const selectedOpt = selectedAnswers[q.id];
                const isRevealed = revealedQuestions[q.id];

                return (
                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm font-semibold text-white whitespace-pre-wrap leading-relaxed">
                      {q.question}
                    </p>

                    <div className="grid gap-2.5">
                      {q.options.map((opt) => {
                        let btnStyle = "border-white/10 bg-black/40 text-white hover:border-[#D8A63A]";
                        if (isRevealed) {
                          if (opt.id === q.answer) {
                            btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold";
                          } else if (selectedOpt === opt.id) {
                            btnStyle = "border-red-500 bg-red-500/20 text-red-300";
                          }
                        } else if (selectedOpt === opt.id) {
                          btnStyle = "border-[#D8A63A] bg-[#D8A63A]/20 text-[#F4C95D]";
                        }

                        return (
                          <button
                            key={opt.id}
                            disabled={isRevealed}
                            onClick={() => {
                              sound.playHover();
                              setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt.id }));
                            }}
                            className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left text-xs transition ${btnStyle}`}
                          >
                            <span className="font-mono font-bold">{opt.id}.</span>
                            <span>{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {!isRevealed ? (
                      <button
                        onClick={() => {
                          if (!selectedOpt) return;
                          sound.playLock();
                          setRevealedQuestions((prev) => ({ ...prev, [q.id]: true }));
                        }}
                        disabled={!selectedOpt}
                        className="w-full rounded-2xl bg-[#D8A63A] py-3 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition disabled:opacity-40"
                      >
                        SUBMIT ANSWER & VIEW EXPLANATION →
                      </button>
                    ) : (
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
                        <span className="font-mono text-xs font-bold text-emerald-300 uppercase block">
                          ✓ Explanation & Syllabus Anchor:
                        </span>
                        <p className="text-xs text-white/90 leading-relaxed">{q.explanation}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                      <button
                        disabled={quizIndex === 0}
                        onClick={() => setQuizIndex((prev) => prev - 1)}
                        className="font-mono text-xs text-[#8C8C8C] hover:text-white disabled:opacity-30"
                      >
                        ← Previous Question
                      </button>
                      <button
                        disabled={quizIndex === quizQuestions.length - 1}
                        onClick={() => setQuizIndex((prev) => prev + 1)}
                        className="font-mono text-xs text-[#F4C95D] hover:underline disabled:opacity-30"
                      >
                        Next Question →
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
