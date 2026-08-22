"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CurrentAffairsArticle, CurrentAffairsQuizQuestion } from "@/lib/core/types";
import { formatDate, safeArray } from "@/lib/core/utils";
import DailyAudioBrief from "@/components/DailyAudioBrief";

export default function CurrentAffairsPage() {
  const router = useRouter();

  const [articles, setArticles] = useState<CurrentAffairsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<CurrentAffairsArticle | null>(null);

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

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/current-affairs");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setArticles(json.data);
        if (json.data.length > 0) {
          setSelectedArticle(json.data[0]);
        }
      } else {
        setError(json.error?.message || "Failed to load current affairs");
      }
    } catch (err: unknown) {
      setError("Network connectivity error while fetching current affairs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  const filteredArticles = useMemo(() => {
    return safeArray(articles).filter((item) => {
      const matchesSource = selectedSource === "All" || item.source.toLowerCase().includes(selectedSource.toLowerCase());
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
        setAnalysisModal({
          title: article.title,
          summary: json.data.summary,
          gsPaper: json.data.gsPaper || article.gsPaper || "GS-2",
          prelimsPoints: safeArray(json.data.prelimsPoints),
          mainsAngle: json.data.mainsAngle,
        });
      } else {
        alert("AI analysis could not be generated. Using offline points.");
      }
    } catch {
      alert("Failed to connect to AI engine.");
    } finally {
      setAnalyzingId(null);
    }
  };

  // Trigger Quiz Generation
  const handleGenerateQuiz = async (article: CurrentAffairsArticle) => {
    setQuizzingId(article.id);
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
        setQuizQuestions(json.data.questions);
        setQuizIndex(0);
        setSelectedAnswers({});
        setRevealedQuestions({});
      } else {
        alert("Could not generate quiz questions.");
      }
    } catch {
      alert("Quiz generation failed due to network error.");
    } finally {
      setQuizzingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#080510] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0714]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-purple-300 transition hover:text-white"
            >
              ← Command Centre
            </button>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-2">
              <span className="text-lg">📰</span>
              <span className="font-bold tracking-tight">Daily Current Affairs</span>
              <span className="rounded-full bg-purple-500/15 px-2.5 py-0.5 text-xs font-semibold text-purple-300">
                NextIAS Integration
              </span>
            </div>
          </div>
          <button
            onClick={loadArticles}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold transition hover:bg-white/10 disabled:opacity-50"
          >
            ↻ Refresh Daily News
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* HERO TITLE */}
        <section className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-400">
              UPSC DAILY INTELLIGENCE
            </p>
            <h1 className="mt-1 text-3xl font-black md:text-4xl">Current Affairs Command Centre</h1>
            <p className="mt-2 text-sm text-white/50">
              Curated daily UPSC editorials, Prelims key facts, Mains analysis, and instant AI MCQ generation.
            </p>
          </div>
          <div className="text-right text-xs text-white/40">
            Date: <span className="font-semibold text-white/80">{formatDate(new Date(), "full")}</span>
          </div>
        </section>

        {/* DAILY AUDIO BRIEF PODCAST PLAYER */}
        <section className="mb-6">
          <DailyAudioBrief />
        </section>

        {/* FILTERS & SEARCH */}
        <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="text"
              placeholder="Search headlines, topics, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-purple-500"
            />
            {/* SOURCE SELECTOR */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 p-1">
              {[
                { id: "All", label: "All Feeds" },
                { id: "The Indian Express", label: "📰 Indian Express" },
                { id: "PIB (Press Information Bureau)", label: "🏛️ PIB Releases" },
              ].map((src) => (
                <button
                  key={src.id}
                  onClick={() => setSelectedSource(src.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    selectedSource === src.id
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>

          {/* GS PAPER PILLS */}
          <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white/40 mr-1">
              Filter by GS Paper:
            </span>
            {["All", "GS-1", "GS-2", "GS-3", "GS-4"].map((paper) => (
              <button
                key={paper}
                onClick={() => setSelectedGSPaper(paper)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  selectedGSPaper === paper
                    ? "bg-fuchsia-600 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {paper}
              </button>
            ))}
          </div>
        </section>

        {/* ERROR NOTIFICATION */}
        {error && (
          <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-300">
            {error}
          </div>
        )}

        {/* MAIN SPLIT VIEW */}
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-16 text-center text-white/40">
            <span className="inline-block animate-spin text-3xl">⏳</span>
            <p className="mt-4 font-semibold">Loading daily NextIAS UPSC current affairs...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">
            <p className="text-xl font-bold">No articles match your criteria</p>
            <p className="mt-2 text-sm text-white/40">Try adjusting your search query or GS paper filter.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            {/* ARTICLE SIDEBAR LIST */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                Today&apos;s Articles ({filteredArticles.length})
              </p>
              <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
                {filteredArticles.map((article) => {
                  const isSelected = selectedArticle?.id === article.id;
                  return (
                    <div
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className={`cursor-pointer rounded-2xl border p-4 transition ${
                        isSelected
                          ? "border-purple-500 bg-purple-500/15 shadow-lg shadow-purple-950/40"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-300">
                          {article.gsPaper || "GS-2"}
                        </span>
                        <span className="text-[11px] text-white/40">{article.source}</span>
                      </div>
                      <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug">
                        {article.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs text-white/50 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ARTICLE DETAIL VIEW */}
            {selectedArticle && (
              <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                {/* ARTICLE HEADER */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300">
                    {selectedArticle.gsPaper || "GS-2"}
                  </span>
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
                    {selectedArticle.category || "UPSC General"}
                  </span>
                  <span className="text-xs text-white/40 ml-auto">
                    Source: {selectedArticle.source} · {selectedArticle.date}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-black leading-tight md:text-3xl">
                  {selectedArticle.title}
                </h2>

                {/* ACTION BAR */}
                <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-white/10 py-4">
                  <button
                    onClick={() => handleAnalyze(selectedArticle)}
                    disabled={analyzingId === selectedArticle.id}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-2.5 text-xs font-bold transition hover:opacity-90 disabled:opacity-50"
                  >
                    <span>✨</span>
                    {analyzingId === selectedArticle.id ? "Analyzing with AI..." : "AI UPSC Deep Dive"}
                  </button>

                  <button
                    onClick={() => handleGenerateQuiz(selectedArticle)}
                    disabled={quizzingId === selectedArticle.id}
                    className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-xs font-bold text-purple-200 transition hover:bg-purple-500/20 disabled:opacity-50"
                  >
                    <span>🎯</span>
                    {quizzingId === selectedArticle.id ? "Generating MCQs..." : "Practice 3 MCQs"}
                  </button>

                  {selectedArticle.sourceUrl && (
                    <a
                      href={selectedArticle.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-xs text-white/40 hover:text-white transition"
                    >
                      Original Source ↗
                    </a>
                  )}
                </div>

                {/* SUMMARY */}
                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    Executive Summary
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {selectedArticle.summary}
                  </p>
                </div>

                {/* CONTEXT & WHY IN NEWS */}
                {selectedArticle.context && (
                  <div className="mt-6 rounded-2xl border border-white/5 bg-black/20 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-pink-400">
                      Context / Why in News
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {selectedArticle.context}
                    </p>
                  </div>
                )}

                {/* PRELIMS HIGH-YIELD POINTS */}
                {safeArray(selectedArticle.prelimsPoints).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-green-400">
                      Prelims High-Yield Pointers
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {safeArray(selectedArticle.prelimsPoints).map((point, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-sm leading-relaxed text-white/80"
                        >
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-400" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* MAINS PERSPECTIVE */}
                {selectedArticle.mainsAngle && (
                  <div className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-900/10 p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                      Mains Dimensions & Framework
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-purple-100/90">
                      {selectedArticle.mainsAngle}
                    </p>
                  </div>
                )}

                {/* TAGS */}
                {safeArray(selectedArticle.tags).length > 0 && (
                  <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                    <span className="text-xs text-white/30">Tags:</span>
                    {safeArray(selectedArticle.tags).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-white/5 px-2.5 py-1 text-[11px] text-white/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            )}
          </div>
        )}
      </div>

      {/* AI ANALYSIS MODAL */}
      {analysisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-purple-500/30 bg-[#120a21] p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300">
                  {analysisModal.gsPaper}
                </span>
                <h3 className="mt-2 text-xl font-bold">{analysisModal.title}</h3>
              </div>
              <button
                onClick={() => setAnalysisModal(null)}
                className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  UPSC Strategic Summary
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {analysisModal.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-green-400">
                  Prelims Key Facts & Traps
                </h4>
                <ul className="mt-2 space-y-2">
                  {safeArray(analysisModal.prelimsPoints).map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="text-green-400 font-bold">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400">
                  Mains Evaluative Angle & Way Forward
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {analysisModal.mainsAngle}
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setAnalysisModal(null)}
                className="rounded-xl bg-purple-600 px-6 py-2.5 font-bold transition hover:bg-purple-500"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE QUIZ MODAL */}
      {quizQuestions && quizQuestions.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-purple-500/30 bg-[#120a21] p-6 shadow-2xl md:p-8">
            {/* QUIZ HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                  Current Affairs MCQ Practice
                </span>
                <p className="font-bold">
                  Question {quizIndex + 1} of {quizQuestions.length}
                </p>
              </div>
              <button
                onClick={() => setQuizQuestions(null)}
                className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* QUIZ QUESTION */}
            {(() => {
              const currentQ = quizQuestions[quizIndex];
              const selected = selectedAnswers[currentQ.id];
              const isRevealed = revealedQuestions[currentQ.id];
              const isCorrect = selected === currentQ.answer;

              return (
                <div className="mt-6">
                  <p className="text-base font-semibold leading-relaxed text-white md:text-lg">
                    {currentQ.question}
                  </p>

                  <div className="mt-6 space-y-3">
                    {safeArray(currentQ.options).map((opt) => {
                      const isOptSelected = selected === opt.id;
                      const isOptCorrect = currentQ.answer === opt.id;

                      let optClass = "border-white/10 bg-white/5 hover:border-purple-400";
                      if (isRevealed) {
                        if (isOptCorrect) optClass = "border-green-500 bg-green-500/20 text-green-200";
                        else if (isOptSelected && !isOptCorrect)
                          optClass = "border-red-500 bg-red-500/20 text-red-200";
                      } else if (isOptSelected) {
                        optClass = "border-purple-500 bg-purple-500/20";
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={isRevealed}
                          onClick={() => {
                            setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: opt.id }));
                            setRevealedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));
                          }}
                          className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${optClass}`}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 font-bold">
                            {opt.id}
                          </span>
                          <span className="pt-1 text-sm">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* EXPLANATION */}
                  {isRevealed && (
                    <div
                      className={`mt-6 rounded-2xl border p-4 ${
                        isCorrect ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
                      }`}
                    >
                      <p className="font-bold text-sm">
                        {isCorrect ? "✓ Correct Answer!" : "✕ Incorrect Answer"}
                      </p>
                      <p className="mt-1 text-xs text-white/70">
                        Correct Option: <span className="font-bold text-white">{currentQ.answer}</span>
                      </p>
                      <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/80">
                        {currentQ.explanation}
                      </p>
                    </div>
                  )}

                  {/* NAVIGATION */}
                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                    <button
                      disabled={quizIndex === 0}
                      onClick={() => setQuizIndex((i) => i - 1)}
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold disabled:opacity-30"
                    >
                      ← Previous
                    </button>
                    {quizIndex < quizQuestions.length - 1 ? (
                      <button
                        onClick={() => setQuizIndex((i) => i + 1)}
                        className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold hover:bg-purple-500"
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        onClick={() => setQuizQuestions(null)}
                        className="rounded-xl bg-green-600 px-5 py-2 text-xs font-bold hover:bg-green-500"
                      >
                        Done ✓
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </main>
  );
}
