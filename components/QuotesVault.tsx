"use client";

import React, { useState, useMemo } from "react";
import { sound } from "@/lib/audio/sound-engine";
import {
  QUOTE_THEMES,
  ARGUMENTATIVE_ANCHORING_GUIDE,
  QuoteTheme,
  ApplicablePaper,
  UPSCQuote,
} from "@/lib/knowledge/datasets/quotes-dataset";
import { searchQuotes, getRandomQuote, getQuoteStats } from "@/lib/knowledge/quotes-engine";

interface QuotesVaultProps {
  initialTheme?: QuoteTheme | "ALL";
  initialPaper?: ApplicablePaper | "ALL";
  onSelectQuote?: (quote: UPSCQuote) => void;
  actionButtonLabel?: string;
  showGuideByDefault?: boolean;
}

export default function QuotesVault({
  initialTheme = "ALL",
  initialPaper = "ALL",
  onSelectQuote,
  actionButtonLabel = "Insert into Draft",
  showGuideByDefault = false,
}: QuotesVaultProps) {
  const [selectedTheme, setSelectedTheme] = useState<QuoteTheme | "ALL">(initialTheme);
  const [selectedPaper, setSelectedPaper] = useState<ApplicablePaper | "ALL">(initialPaper);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(showGuideByDefault);
  const [spotlightQuote, setSpotlightQuote] = useState<UPSCQuote | null>(null);

  const stats = useMemo(() => getQuoteStats(), []);

  const searchResults = useMemo(() => {
    return searchQuotes({
      theme: selectedTheme,
      paper: selectedPaper,
      query: searchQuery,
    });
  }, [selectedTheme, selectedPaper, searchQuery]);

  const handleCopyQuote = (quote: UPSCQuote) => {
    sound.playSelect();
    const formatted = `"${quote.quote}" — ${quote.author} [UPSC Mains: ${quote.coreConcept} | ${quote.applicablePapers.join(", ")}]`;
    navigator.clipboard.writeText(formatted);
    setCopiedId(quote.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleSurpriseMe = () => {
    sound.playLock();
    const random = getRandomQuote(selectedTheme);
    setSpotlightQuote(random);
  };

  return (
    <div className="space-y-6">
      {/* TOP STATS & QUICK ACTIONS BANNER */}
      <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-slate-900/50 to-slate-950 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-[#F4C95D] bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                UPSC CSE MAINS • ISSF MASTER REPOSITORY
              </span>
              <span className="font-mono text-[10px] text-white/50">
                {stats.total} High-Yield Quotes Indexed
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2">
              <span>📜 UPSC Mains Book of Quotes Vault</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-2xl font-sans leading-relaxed">
              Transform quotes into argumentative engines for your GS 1-4 answers and 250-mark Essay papers. Unpack, interrogate, and anchor them to empirical data and constitutional articles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                sound.playSelect();
                setShowGuide((prev) => !prev);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 border ${
                showGuide
                  ? "bg-amber-400 text-black border-amber-400 shadow-lg shadow-amber-400/20"
                  : "bg-white/5 text-amber-300 border-amber-400/30 hover:bg-white/10"
              }`}
            >
              <span>🧭</span>
              <span>{showGuide ? "Hide Anchoring Guide" : "Anchoring Guide"}</span>
            </button>

            <button
              onClick={handleSurpriseMe}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:brightness-110 shadow-lg shadow-amber-500/20"
            >
              <span>✨</span>
              <span>Surprise Hook</span>
            </button>
          </div>
        </div>

        {/* SPOTLIGHT RANDOM QUOTE */}
        {spotlightQuote && (
          <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <span>🌟 Spotlight Quote Hook</span>
                <span className="text-white/40">•</span>
                <span>{spotlightQuote.theme}</span>
              </span>
              <button
                onClick={() => setSpotlightQuote(null)}
                className="text-xs text-white/40 hover:text-white font-mono"
              >
                ✕ Close
              </button>
            </div>
            <p className="text-sm sm:text-base font-serif italic text-amber-100 leading-relaxed">
              &ldquo;{spotlightQuote.quote}&rdquo;
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs font-bold text-white">— {spotlightQuote.author}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-white/80">
                  {spotlightQuote.coreConcept}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyQuote(spotlightQuote)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1"
                >
                  {copiedId === spotlightQuote.id ? "✓ Copied!" : "📋 Copy"}
                </button>
                {onSelectQuote && (
                  <button
                    onClick={() => {
                      sound.playLock();
                      onSelectQuote(spotlightQuote);
                    }}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-[#D8A63A] text-black hover:bg-amber-400 transition"
                  >
                    {actionButtonLabel}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EXPANDABLE ARGUMENTATIVE ANCHORING GUIDE */}
        {showGuide && (
          <div className="mt-5 border-t border-amber-400/20 pt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <h4 className="text-xs font-mono font-black uppercase tracking-wider text-amber-300">
              💡 {ARGUMENTATIVE_ANCHORING_GUIDE.title}
            </h4>
            <p className="text-xs text-white/80 leading-relaxed font-sans">
              {ARGUMENTATIVE_ANCHORING_GUIDE.summary}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {ARGUMENTATIVE_ANCHORING_GUIDE.placementPrinciples.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5"
                >
                  <div className="font-mono text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{item.position}</span>
                  </div>
                  <p className="text-[11px] text-white/70 font-sans leading-relaxed">
                    {item.purpose}
                  </p>
                  <p className="text-[10px] font-serif italic text-amber-200/90 pt-1 border-t border-white/5">
                    Ex: {item.example}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SEARCH AND FILTER CONTROLS */}
      <div className="space-y-4">
        {/* SEARCH BAR */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by quote, thinker (Gandhi, Ambedkar, Rawls), topic (AI, climate, justice), or paper..."
            className="w-full pl-10 pr-10 py-3 bg-[#0d0d12] border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-white/40 hover:text-white font-mono"
            >
              Clear ✕
            </button>
          )}
        </div>

        {/* PAPER TABS FILTER */}
        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          <span className="text-[11px] font-mono text-white/40 mr-1">UPSC Paper:</span>
          {(["ALL", "Essay", "GS-1", "GS-2", "GS-3", "GS-4"] as const).map((paper) => (
            <button
              key={paper}
              onClick={() => {
                sound.playSelect();
                setSelectedPaper(paper);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition border ${
                selectedPaper === paper
                  ? "bg-[#D8A63A] text-black border-[#D8A63A] shadow-md shadow-amber-400/20"
                  : "bg-white/5 text-white/70 border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {paper === "ALL" ? "All Papers" : paper}
            </button>
          ))}
        </div>

        {/* THEME SELECTION TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
          {QUOTE_THEMES.map((theme) => {
            const count = theme.value === "ALL" ? stats.total : stats.byTheme[theme.value] || 0;
            const isSelected = selectedTheme === theme.value;
            return (
              <button
                key={theme.value}
                onClick={() => {
                  sound.playSelect();
                  setSelectedTheme(theme.value);
                }}
                className={`whitespace-nowrap px-3.5 py-2 rounded-2xl text-xs font-mono font-bold transition flex items-center gap-2 border flex-shrink-0 ${
                  isSelected
                    ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-400/50 shadow-md shadow-amber-500/10"
                    : "bg-[#0c0c10] text-white/60 border-white/5 hover:border-white/20 hover:text-white"
                }`}
              >
                <span>{theme.icon}</span>
                <span>{theme.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-amber-400/30 text-amber-200" : "bg-white/10 text-white/40"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEARCH RESULT COUNT */}
      <div className="flex items-center justify-between text-xs font-mono text-white/50 px-1 border-b border-white/5 pb-2">
        <span>
          Showing <strong className="text-amber-300">{searchResults.quotes.length}</strong> quotes
          {selectedTheme !== "ALL" && ` in ${selectedTheme}`}
          {selectedPaper !== "ALL" && ` for ${selectedPaper}`}
        </span>
        {searchQuery && (
          <span>Query: &ldquo;{searchQuery}&rdquo;</span>
        )}
      </div>

      {/* QUOTES GRID */}
      {searchResults.quotes.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#0c0c10] p-12 text-center space-y-3">
          <div className="text-3xl">🔍</div>
          <h3 className="text-base font-bold text-white">No matching quotes found</h3>
          <p className="text-xs text-white/60 max-w-sm mx-auto font-sans">
            Try adjusting your search keywords or switching the Theme / Paper filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedTheme("ALL");
              setSelectedPaper("ALL");
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {searchResults.quotes.map((q) => {
            const isCopied = copiedId === q.id;
            return (
              <div
                key={q.id}
                className="rounded-3xl border border-white/10 bg-[#0a0a0f] p-5 sm:p-6 shadow-xl space-y-4 flex flex-col justify-between hover:border-amber-400/30 hover:bg-[#0e0e14] transition duration-200 group"
              >
                <div className="space-y-3">
                  {/* CARD HEADER: THEME & PAPERS */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                      {q.theme}
                    </span>
                    <div className="flex items-center gap-1">
                      {q.applicablePapers.map((paper) => (
                        <span
                          key={paper}
                          className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-white/70 border border-white/5"
                        >
                          {paper}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* QUOTE TEXT */}
                  <blockquote className="text-sm sm:text-base font-serif italic text-white/95 group-hover:text-amber-100 transition leading-relaxed">
                    &ldquo;{q.quote}&rdquo;
                  </blockquote>

                  {/* AUTHOR & CORE CONCEPT */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#F4C95D] font-sans">
                        — {q.author}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-semibold text-white/60 bg-white/5 px-2 py-0.5 rounded-md">
                      🎯 {q.coreConcept}
                    </span>
                  </div>

                  {/* PLACEMENT & ANCHORING TIP ACCORDION */}
                  <div className="pt-2 text-[11px] space-y-1 font-sans">
                    <p className="text-white/70">
                      <strong className="text-amber-300/90 font-mono text-[10px]">Placement: </strong>
                      {q.placement}
                    </p>
                    <p className="text-white/50 text-[10.5px]">
                      <strong className="text-white/60 font-mono text-[10px]">Anchoring: </strong>
                      {q.anchoringTips}
                    </p>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleCopyQuote(q)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 border ${
                      isCopied
                        ? "bg-emerald-500 text-black border-emerald-500 shadow-md"
                        : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{isCopied ? "✓" : "📋"}</span>
                    <span>{isCopied ? "Copied Citation" : "Copy Quote"}</span>
                  </button>

                  {onSelectQuote && (
                    <button
                      onClick={() => {
                        sound.playLock();
                        onSelectQuote(q);
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#D8A63A] text-black hover:bg-amber-400 transition shadow-md shadow-amber-500/20"
                    >
                      {actionButtonLabel}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
