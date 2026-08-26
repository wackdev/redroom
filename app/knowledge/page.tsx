"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { sound } from "@/lib/audio/sound-engine";
import {
  KNOWLEDGE_SUBJECTS_DATASET,
  UNIVERSAL_TOPICS_DATASET,
} from "@/lib/knowledge/datasets/polity-knowledge-seed";
import { executeKnowledgeSearch } from "@/lib/knowledge/search-engine";
import { POLITY_SOURCE_CHUNKS } from "@/lib/knowledge/datasets/polity-chunks-seed";
import { KnowledgeSearchResultItem, KnowledgeSubject, UniversalTopic } from "@/lib/knowledge/types";
import ModernHistoryAtlas from "@/components/ModernHistoryAtlas";
import EconomicsAtlas from "@/components/EconomicsAtlas";

export default function KnowledgeVaultHubPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <div className="text-sm font-bold text-amber-400 animate-pulse">Loading Knowledge Vault...</div>
        </div>
      }
    >
      <KnowledgeVaultContent />
    </Suspense>
  );
}

function KnowledgeVaultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get("subject") || "all";

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("ALL");
  const [knowledgePillarTab, setKnowledgePillarTab] = useState<"polity" | "modern-history" | "economics">("economics");

  // Sync state if URL param changes
  useEffect(() => {
    const s = searchParams.get("subject");
    if (s) setSelectedSubject(s);
  }, [searchParams]);

  // Execute Real-Time Search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return executeKnowledgeSearch(searchQuery, UNIVERSAL_TOPICS_DATASET, POLITY_SOURCE_CHUNKS);
  }, [searchQuery]);

  // Grouped Subjects by Paper
  const subjectsByPaper = useMemo(() => {
    const groups: Record<string, KnowledgeSubject[]> = {
      "GS Paper I": [],
      "GS Paper II": [],
      "GS Paper III": [],
      "GS Paper IV": [],
      "Other UPSC Pillars": [],
      "Optional Subject": [],
    };

    KNOWLEDGE_SUBJECTS_DATASET.forEach((subj) => {
      if (subj.paperId === "upsc_mains_gs1") groups["GS Paper I"].push(subj);
      else if (subj.paperId === "upsc_mains_gs2") groups["GS Paper II"].push(subj);
      else if (subj.paperId === "upsc_mains_gs3") groups["GS Paper III"].push(subj);
      else if (subj.paperId === "upsc_mains_gs4") groups["GS Paper IV"].push(subj);
      else if (subj.isOptional) groups["Optional Subject"].push(subj);
      else groups["Other UPSC Pillars"].push(subj);
    });

    return groups;
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* HEADER MATRIX */}
      <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-30 px-4 py-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
              🏛️
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                WHYNOTUPSC <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-400">KNOWLEDGE VAULT</span>
              </h1>
              <p className="text-xs text-slate-400">
                Universal Interconnected UPSC Knowledge Engine • 38+ Subjects • Deep Source Notes • Real PYQs
              </p>
            </div>
          </div>

          {/* QUICK STATS HUD */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Topics</span>
              <span className="text-sm font-black text-amber-400">{UNIVERSAL_TOPICS_DATASET.length} Indexed</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Sources</span>
              <span className="text-sm font-black text-indigo-400">721+ Pages</span>
            </div>
            <Link
              href="/admin?tab=knowledge"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95 flex items-center gap-1.5"
            >
              ⚙️ Vault Admin
            </Link>
          </div>
        </div>
      </header>

      {/* HERO UNIVERSAL SEARCH */}
      <section className="relative px-4 py-8 sm:py-12 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 border-b border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <span>✨</span> One Topic • All Sources • All PYQs • All Revision
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Search Any UPSC Concept, Article, or Case
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Try searching <span className="text-amber-400 cursor-pointer underline" onClick={() => setSearchQuery("Governor")}>“Governor”</span>,{" "}
            <span className="text-indigo-400 cursor-pointer underline" onClick={() => setSearchQuery("Article 21")}>“Article 21”</span>,{" "}
            <span className="text-purple-400 cursor-pointer underline" onClick={() => setSearchQuery("Electoral Bonds")}>“Electoral Bonds”</span>,{" "}
            <span className="text-emerald-400 cursor-pointer underline" onClick={() => setSearchQuery("GST Council")}>“GST Council”</span>, or acronyms like{" "}
            <span className="text-pink-400 cursor-pointer underline" onClick={() => setSearchQuery("FR")}>“FR”</span> or{" "}
            <span className="text-cyan-400 cursor-pointer underline" onClick={() => setSearchQuery("ONOE")}>“ONOE”</span>.
          </p>

          {/* SEARCH INPUT */}
          <div className="relative max-w-2xl mx-auto mt-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 text-lg">
              🔍
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, articles, landmark cases, committees, or source notes..."
              className="w-full rounded-2xl border border-white/20 bg-slate-900/80 pl-12 pr-12 py-3.5 sm:py-4 text-sm sm:text-base text-white placeholder-slate-500 shadow-2xl focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition backdrop-blur-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white text-xs font-bold"
              >
                Clear ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SEARCH RESULTS VIEW (IF QUERY PRESENT) */}
      {searchResults && (
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Search Results for <span className="text-amber-400">"{searchResults.query}"</span>
              </h3>
              <p className="text-xs text-slate-400">
                Found {searchResults.totalResults} results in {searchResults.executionTimeMs}ms across all knowledge layers.
              </p>
            </div>

            {/* CATEGORY TABS */}
            <div className="flex flex-wrap gap-2">
              {["ALL", "TOPICS", "CONCEPTS", "SOURCE_NOTES", "PYQS", "MAINS_QUESTIONS"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sound.playClick();
                    setActiveCategoryFilter(cat);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    activeCategoryFilter === cat
                      ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                      : "bg-slate-900 text-slate-400 border border-white/10 hover:text-white"
                  }`}
                >
                  {cat.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* RESULT CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* MATCHED TOPICS */}
            {(activeCategoryFilter === "ALL" || activeCategoryFilter === "TOPICS") &&
              searchResults.categories.topics.map((item) => (
                <SearchResultCard key={item.id} item={item} />
              ))}

            {/* MATCHED CONCEPTS */}
            {(activeCategoryFilter === "ALL" || activeCategoryFilter === "CONCEPTS") &&
              searchResults.categories.concepts.map((item) => (
                <SearchResultCard key={item.id} item={item} />
              ))}

            {/* MATCHED SOURCE NOTES */}
            {(activeCategoryFilter === "ALL" || activeCategoryFilter === "SOURCE_NOTES") &&
              searchResults.categories.sourceNotes.map((item) => (
                <SearchResultCard key={item.id} item={item} isChunk />
              ))}

            {/* MATCHED PRELIMS PYQS */}
            {(activeCategoryFilter === "ALL" || activeCategoryFilter === "PYQS") &&
              searchResults.categories.pyqs.map((item) => (
                <SearchResultCard key={item.id} item={item} isPyq />
              ))}

            {/* MATCHED MAINS PYQS */}
            {(activeCategoryFilter === "ALL" || activeCategoryFilter === "MAINS_QUESTIONS") &&
              searchResults.categories.mains.map((item) => (
                <SearchResultCard key={item.id} item={item} isMains />
              ))}
          </div>

          {searchResults.totalResults === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/30 p-12 text-center space-y-3">
              <div className="text-3xl">🔍</div>
              <h4 className="text-base font-bold text-white">No exact matches found</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                We couldn't find any direct match for "{searchResults.query}". Try searching for standard constitutional keywords or broad subjects like "Federalism" or "Parliament".
              </p>
            </div>
          )}
        </main>
      )}

      {/* DEFAULT EXPLORER VIEW (WHEN NOT SEARCHING) */}
      {!searchResults && (
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-8 space-y-10">
          {/* PILLAR SWITCHER */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex flex-wrap items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => {
                  sound.playSelect();
                  setKnowledgePillarTab("economics");
                }}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition ${
                  knowledgePillarTab === "economics"
                    ? "bg-[#D8A63A] text-black shadow-lg"
                    : "text-white/60 hover:text-white"
                }`}
              >
                📈 Indian Economy & Macro Atlas (GS-3)
              </button>
              <button
                onClick={() => {
                  sound.playSelect();
                  setKnowledgePillarTab("modern-history");
                }}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition ${
                  knowledgePillarTab === "modern-history"
                    ? "bg-[#D8A63A] text-black shadow-lg"
                    : "text-white/60 hover:text-white"
                }`}
              >
                🇮🇳 Modern Indian History Atlas (1498–1947)
              </button>
              <button
                onClick={() => {
                  sound.playSelect();
                  setKnowledgePillarTab("polity");
                }}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition ${
                  knowledgePillarTab === "polity"
                    ? "bg-[#D8A63A] text-black shadow-lg"
                    : "text-white/60 hover:text-white"
                }`}
              >
                ⚖️ GS-2 Indian Polity Atoms
              </button>
            </div>
            <span className="font-mono text-xs text-amber-400 font-bold">
              {knowledgePillarTab === "economics"
                ? "10 Pillars • 33 Lectures Indexed"
                : knowledgePillarTab === "modern-history"
                ? "15 Complete Modules Indexed"
                : "21 Full Chapters Indexed"}
            </span>
          </div>

          {/* PILLAR 1: INDIAN ECONOMY & MACRO ATLAS */}
          {knowledgePillarTab === "economics" && <EconomicsAtlas />}

          {/* PILLAR 2: MODERN HISTORY ATLAS */}
          {knowledgePillarTab === "modern-history" && <ModernHistoryAtlas />}

          {/* PILLAR 3: HIGH-YIELD TOPIC CARDS (GS-2 POLITY) */}
          {knowledgePillarTab === "polity" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                    <span>⚡</span> High-Yield Knowledge Atoms (GS-2 Indian Polity)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Authoritative full-text chapters from the Gold Standard Series with cross-linked PYQs and case laws
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {UNIVERSAL_TOPICS_DATASET.slice(0, 6).map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/knowledge/${topic.subjectId}/${topic.slug}`}
                    onClick={() => sound.playClick()}
                    className="group rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-xl transition-all hover:border-amber-400/50 hover:bg-slate-900/90 hover:shadow-amber-500/5 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {topic.syllabusCode || "GS-2"}
                        </span>
                        <span className="text-xs font-black text-slate-400 group-hover:text-amber-400 transition">
                          ★ {topic.importanceScore}/100
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition leading-snug">
                        {topic.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {topic.summary30s || topic.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                      <span>📚 {topic.sourceCount} Sources • 🎯 {topic.pyqCount} PYQs</span>
                      <span className="text-amber-400 group-hover:translate-x-1 transition font-bold">
                        Open Topic →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* COMPLETE UPSC SUBJECT DIRECTORY */}
          <section className="space-y-6">
            <div>
              <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>📚</span> UPSC Universal Subject Directory (38+ Disciplines)
              </h3>
              <p className="text-xs text-slate-400">
                Explore the complete examination architecture structured according to official UPSC syllabi.
              </p>
            </div>

            {/* SUBJECT GROUPS ACCORDION / TABS */}
            <div className="space-y-8">
              {Object.entries(subjectsByPaper).map(([paperTitle, subjects]) => (
                <div key={paperTitle} className="space-y-3">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 border-b border-white/5 pb-2 flex items-center justify-between">
                    <span>{paperTitle}</span>
                    <span className="text-xs text-slate-500 font-normal">{subjects.length} Subjects</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {subjects.map((subj) => (
                      <Link
                        key={subj.id}
                        href={`/knowledge?subject=${subj.id}`}
                        onClick={() => sound.playClick()}
                        className="rounded-xl border border-white/10 bg-slate-900/40 p-4 transition hover:border-indigo-500/50 hover:bg-slate-900/80 hover:shadow-lg flex items-start gap-3 group"
                      >
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                          style={{ backgroundColor: `${subj.color}20`, color: subj.color }}
                        >
                          {subj.icon}
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-white group-hover:text-indigo-400 transition truncate">
                            {subj.name}
                          </h5>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {subj.code} • {subj.totalTopicsCount} Topics
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

function SearchResultCard({
  item,
  isChunk = false,
  isPyq = false,
  isMains = false,
}: {
  item: KnowledgeSearchResultItem;
  isChunk?: boolean;
  isPyq?: boolean;
  isMains?: boolean;
}) {
  const targetUrl = isPyq
    ? `/pyqs?search=${encodeURIComponent(item.title)}`
    : isMains
    ? `/mains-pyqs?search=${encodeURIComponent(item.title)}`
    : item.slug
    ? `/knowledge/indian_polity/${item.slug}`
    : `/knowledge`;

  return (
    <Link
      href={targetUrl}
      onClick={() => sound.playClick()}
      className="group rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-xl transition-all hover:border-amber-400/50 hover:bg-slate-900/90 flex flex-col justify-between"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
            {item.category.replace("_", " ")}
          </span>
          <span className="text-xs font-black text-amber-400">{Math.round(item.relevanceScore)}% Match</span>
        </div>

        <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition leading-snug">
          {item.title}
        </h4>

        <div className="text-[11px] text-indigo-400 font-semibold truncate">
          {item.topicPath}
        </div>

        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
          {item.previewText}
        </p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>{item.sourceName ? `p. ${item.pageNumber}` : item.subject}</span>
        <span className="text-amber-400 group-hover:translate-x-1 transition font-bold">
          View Detail →
        </span>
      </div>
    </Link>
  );
}
