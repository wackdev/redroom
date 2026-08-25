"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CurrentAffairsArticle, CurrentAffairsQuizQuestion } from "@/lib/core/types";
import { formatDate, safeArray } from "@/lib/core/utils";
import DailyAudioBrief from "@/components/DailyAudioBrief";
import EconomicSurveyVisualizer from "@/components/EconomicSurveyVisualizer";
import GeopoliticsMapAtlas from "@/components/GeopoliticsMapAtlas";
import AuthGuard from "@/components/auth/AuthGuard";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import { sound } from "@/lib/audio/sound-engine";
import { trackActivityEvent } from "@/lib/brain/activity-events";

interface NewspaperEditorial {
  id: string;
  source: "The Hindu" | "Indian Express" | "PIB" | "LiveMint";
  title: string;
  category: "Editorial" | "Explained" | "Lead" | "Economy";
  gsPaper: "GS-1" | "GS-2" | "GS-3" | "GS-4";
  syllabusTopic: string;
  summary: string;
  prelimsPointers: string[];
  mainsPoints: string[];
  topperQuote?: string;
  readTimeMinutes: number;
  date: string;
}

const CURATED_NEWSPAPER_EDITORIALS: NewspaperEditorial[] = [
  {
    id: "edit-01",
    source: "The Hindu",
    title: "Navigating the New Contours of Fiscal Federalism in India",
    category: "Editorial",
    gsPaper: "GS-2",
    syllabusTopic: "Functions & Responsibilities of Union and States, Issues & Challenges of Federal Structure",
    summary: "The 16th Finance Commission begins deliberations amid heightened friction regarding the increasing reliance on cesses/surcharges outside the divisible pool, which now constitutes nearly 18% of gross tax revenue, effectively reducing unconditional state transfers.",
    prelimsPointers: [
      "Article 270 was amended by 80th Amendment Act to introduce the divisible pool concept.",
      "Cess is levied for specific purposes under Article 270/271 and is NOT shared with States unless mandated by Parliament.",
      "15th Finance Commission set vertical devolution at 41% (1% adjusted for UTs of J&K and Ladakh)."
    ],
    mainsPoints: [
      "Vertical fiscal imbalance: States generate only ~37% of revenue but incur ~60% of total government expenditure.",
      "Erosion of divisible tax pool via non-sharable cesses forces states toward high-cost open market borrowing.",
      "Solution: Cap the maximum percentage of cesses to gross tax revenue at 10% through a constitutional amendment."
    ],
    topperQuote: "Fiscal federalism in India cannot be a one-way street of conditional central discretion; it requires constitutional parity between revenue generation and welfare expenditure.",
    readTimeMinutes: 4,
    date: "August 25, 2026"
  },
  {
    id: "edit-02",
    source: "Indian Express",
    title: "Explained: The Ethics & Legality of Sovereign Generative AI Infrastructure",
    category: "Explained",
    gsPaper: "GS-3",
    syllabusTopic: "Science & Technology - Developments & Applications, Cyber Security, IT & Computers",
    summary: "India's approval of the ₹10,300 crore IndiaAI Mission marks a major step toward establishing public AI compute (10,000+ GPUs) and foundational multilingual LLMs under sovereign jurisdiction.",
    prelimsPointers: [
      "IndiaAI Mission operates under Ministry of Electronics and IT (MeitY).",
      "Bhashini initiative provides open-source multimodal datasets in 22 scheduled Indian languages.",
      "GPAI (Global Partnership on Artificial Intelligence) was hosted by India in 2023."
    ],
    mainsPoints: [
      "Strategic necessity: Relying on foreign cloud infrastructure creates critical vulnerabilities in public service delivery.",
      "Digital divide mitigation: Sovereign indigenous AI models eliminate linguistic barriers in e-governance and healthcare diagnostics.",
      "Regulatory architecture: Balancing innovation incentives with Digital Personal Data Protection (DPDP) Act compliance."
    ],
    topperQuote: "AI sovereignty is not digital isolationism; it is the strategic capability to build technology aligned with our constitutional ethics and demographic diversity.",
    readTimeMinutes: 5,
    date: "August 25, 2026"
  },
  {
    id: "edit-03",
    source: "The Hindu",
    title: "Protecting the Silent Carbon Sinks: India's Coastal Mangrove Belts",
    category: "Lead",
    gsPaper: "GS-3",
    syllabusTopic: "Conservation, Environmental Pollution & Degradation, Disaster Management",
    summary: "A review of the MISHTI scheme (Mangrove Initiative for Shoreline Habitats & Tangible Incomes) and its integration with blue carbon credit financing along the Bay of Bengal and Arabian Sea coastlines.",
    prelimsPointers: [
      "Mangroves are salt-tolerant halophytes found between latitudes 24° N and 38° S.",
      "Sundarbans (West Bengal) is the largest single block of tidal halophytic mangrove forest in the world.",
      "Pneumatophores (aerial roots) and vivipary germination are key adaptive features."
    ],
    mainsPoints: [
      "Blue carbon sequestration rate is up to 4-5 times faster than terrestrial tropical rainforests.",
      "Biophysical storm barrier: Dense stilt root systems dissipate wave energy during severe cyclonic events.",
      "Community stewardship: Linking eco-tourism and crab aquaculture with coastal forest preservation."
    ],
    topperQuote: "Mangroves stand as nature's dual sentinel: absorbing atmospheric carbon while physically safeguarding coastal livelihoods against rising sea surges.",
    readTimeMinutes: 3,
    date: "August 25, 2026"
  },
  {
    id: "edit-04",
    source: "PIB",
    title: "Mission Karmayogi: Capacity Building Commission Releases Annual Governance Index",
    category: "Editorial",
    gsPaper: "GS-4",
    syllabusTopic: "Public/Civil Service Values & Ethics in Public Administration, Accountability & Ethical Governance",
    summary: "The evaluation framework shifts civil servant evaluation from 'Rule-based' compliance to 'Role-based' competency mapping across all Group A and B officers in Union Ministries.",
    prelimsPointers: [
      "National Programme for Civil Services Capacity Building (NPCSCB) launched in 2020.",
      "iGOT Karmayogi platform delivers digital micro-learning modules for continuous learning.",
      "Capacity Building Commission (CBC) is an independent body assisting the Prime Minister's HR Council."
    ],
    mainsPoints: [
      "De-siloing administration: Standardized cross-functional competencies replace rigid bureaucratic boundaries.",
      "Citizen-centric orientation: Measuring civil servant empathy and grievance resolution efficiency.",
      "Institutionalizing ethical reflexivity into mid-career promotion appraisals."
    ],
    topperQuote: "Administrative transformation requires shifting the mindset of officers from wielders of colonial authority to facilitators of democratic citizen empowerment.",
    readTimeMinutes: 4,
    date: "August 25, 2026"
  }
];

export default function CurrentAffairsPage() {
  const router = useRouter();

  // Active Main Tab
  const [activeMainTab, setActiveMainTab] = useState<"newspaper" | "feed" | "audio" | "quiz" | "atlas">("newspaper");

  // Feed State
  const [articles, setArticles] = useState<CurrentAffairsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<CurrentAffairsArticle | null>(null);
  const [refreshFeedback, setRefreshFeedback] = useState("");

  // Newspaper State
  const [editorials] = useState<NewspaperEditorial[]>(CURATED_NEWSPAPER_EDITORIALS);
  const [selectedEditorial, setSelectedEditorial] = useState<NewspaperEditorial>(CURATED_NEWSPAPER_EDITORIALS[0]);
  const [editorialSubTab, setEditorialSubTab] = useState<"summary" | "prelims" | "mains">("summary");
  const [selectedPaperFilter, setSelectedPaperFilter] = useState<string>("All");

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
        setError(json.error?.message || "Failed to load current affairs feed.");
      }
    } catch {
      setError("Network or API error occurred while fetching updates.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedArticle]);

  useEffect(() => {
    loadArticles(false);
  }, [loadArticles]);

  const handleAnalyzeArticle = async (art: CurrentAffairsArticle) => {
    sound.playSelect();
    setAnalyzingId(art.id);
    try {
      const res = await fetch("/api/current-affairs/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: art.title,
          summary: art.summary,
          source: art.source,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        sound.playUnlock();
        setAnalysisModal(json.data);
      }
    } catch {}
    setAnalyzingId(null);
  };

  const handleGenerateQuiz = async (art: CurrentAffairsArticle) => {
    sound.playLock();
    setQuizzingId(art.id);
    try {
      const res = await fetch("/api/current-affairs/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: art.title,
          summary: art.summary,
          gsPaper: art.gsPaper || "GS-2",
        }),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        sound.playVictory();
        setQuizQuestions(json.data);
        setQuizIndex(0);
        setSelectedAnswers({});
        setRevealedQuestions({});
        setActiveMainTab("quiz");
      }
    } catch {}
    setQuizzingId(null);
  };

  const filteredEditorials = useMemo(() => {
    return editorials.filter(art => {
      if (selectedPaperFilter === "All") return true;
      return art.gsPaper === selectedPaperFilter;
    });
  }, [editorials, selectedPaperFilter]);

  const filteredArticles = useMemo(() => {
    return safeArray(articles).filter((art) => {
      const matchSource = selectedSource === "All" || art.source === selectedSource;
      const matchPaper = selectedGSPaper === "All" || art.gsPaper === selectedGSPaper;
      const matchSearch =
        searchQuery === "" ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSource && matchPaper && matchSearch;
    });
  }, [articles, selectedSource, selectedGSPaper, searchQuery]);

  return (
    <AuthGuard>
      <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #070810 0%, #0d1222 50%, #06070d 100%)" }}>
        <AppUniversalHeader
          moduleName="Current Affairs & Newspaper Command"
          moduleBadge="GS-1 TO GS-4 INTELLIGENCE"
        />

        <main className="mx-auto max-w-7xl px-4 py-8 space-y-6 sm:px-6">
          {/* Main Top Banner */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-semibold uppercase tracking-wider"
              style={{ background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.3)", color: "#facc15" }}>
              <span>📰</span> Daily Curated UPSC Editorial & Current Affairs Command
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
              Current Affairs & Newspaper Editorial Hub
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto text-sm">
              Unified intelligence covering <span className="text-amber-400 font-semibold">The Hindu, Indian Express, PIB, & PRS</span>. Classified by GS Paper 1–4, paired with audio briefings, Prelims pointers, and interactive quizzes.
            </p>
          </div>

          {/* Navigation Bar: 5 Unified Tabs */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4 overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-2">
              {[
                { id: "newspaper", label: "📰 Newspaper Editorial Digest", count: "4 Deep Dives" },
                { id: "feed", label: "⚡ Live Flash Feed (PIB/Express)", count: `${articles.length} Updates` },
                { id: "audio", label: "🎙️ Audio Briefs", count: "Daily Podcast" },
                { id: "quiz", label: "🎯 Daily MCQ Quiz", count: quizQuestions ? `${quizQuestions.length} Active` : "Generate" },
                { id: "atlas", label: "🌐 Geopolitics & Survey Atlas", count: "Visual" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playSelect();
                    setActiveMainTab(tab.id as any);
                  }}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2"
                  style={{
                    background: activeMainTab === tab.id ? "rgba(234,179,8,0.25)" : "rgba(255,255,255,0.03)",
                    border: activeMainTab === tab.id ? "1px solid rgba(234,179,8,0.5)" : "1px solid rgba(255,255,255,0.06)",
                    color: activeMainTab === tab.id ? "#fef08a" : "#9ca3af"
                  }}>
                  <span>{tab.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-gray-300">{tab.count}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => loadArticles(true)}
              disabled={refreshing}
              className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-[#D8A63A] hover:bg-[#F4C95D] transition-all flex items-center gap-2 shrink-0 shadow-lg">
              <span>{refreshing ? "🔄 Syncing..." : "⚡ Refresh Feed"}</span>
            </button>
          </div>

          {/* Feedback banner */}
          {refreshFeedback && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center">
              ✓ {refreshFeedback}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: NEWSPAPER EDITORIAL DIGEST */}
          {/* ========================================================================= */}
          {activeMainTab === "newspaper" && (
            <div className="space-y-6">
              {/* Paper Filter Bar */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {["All", "GS-1", "GS-2", "GS-3", "GS-4"].map(filter => (
                    <button
                      key={filter}
                      onClick={() => {
                        sound.playHover();
                        setSelectedPaperFilter(filter);
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: selectedPaperFilter === filter ? "rgba(234,179,8,0.25)" : "rgba(255,255,255,0.03)",
                        border: selectedPaperFilter === filter ? "1px solid rgba(234,179,8,0.5)" : "1px solid rgba(255,255,255,0.06)",
                        color: selectedPaperFilter === filter ? "#fef08a" : "#9ca3af"
                      }}>
                      {filter === "All" ? "All Papers" : filter}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  📅 {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>

              {/* Grid: List & Deep Reader */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Article Cards */}
                <div className="lg:col-span-5 space-y-3 max-h-[720px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredEditorials.map((art) => {
                    const isSelected = selectedEditorial.id === art.id;
                    return (
                      <div
                        key={art.id}
                        onClick={() => {
                          sound.playSelect();
                          setSelectedEditorial(art);
                          setEditorialSubTab("summary");
                        }}
                        className="p-5 rounded-3xl cursor-pointer transition-all duration-200"
                        style={{
                          background: isSelected ? "linear-gradient(135deg, rgba(234,179,8,0.15), rgba(180,83,9,0.2))" : "rgba(255,255,255,0.03)",
                          border: isSelected ? "1px solid rgba(234,179,8,0.5)" : "1px solid rgba(255,255,255,0.06)",
                          boxShadow: isSelected ? "0 8px 24px rgba(234,179,8,0.1)" : "none"
                        }}>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300">
                              {art.source}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">
                              {art.category} • {art.readTimeMinutes} min
                            </span>
                          </div>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/10 text-white">
                            {art.gsPaper}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white leading-snug mb-1.5">{art.title}</h3>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{art.summary}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Selected Editorial Reader */}
                <div className="lg:col-span-7">
                  <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl space-y-6"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.4)"
                    }}>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {selectedEditorial.source}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {selectedEditorial.gsPaper}
                        </span>
                        <span className="text-xs text-gray-400 font-medium ml-auto">
                          ⏱️ {selectedEditorial.readTimeMinutes} min read • {selectedEditorial.date}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-2">
                        {selectedEditorial.title}
                      </h2>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-300">
                        <span className="text-amber-400 font-semibold">UPSC Syllabus Linkage: </span>
                        {selectedEditorial.syllabusTopic}
                      </div>
                    </div>

                    {/* Sub Navigation Tabs */}
                    <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10">
                      <button
                        onClick={() => setEditorialSubTab("summary")}
                        className="flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center"
                        style={{
                          background: editorialSubTab === "summary" ? "#eab308" : "transparent",
                          color: editorialSubTab === "summary" ? "#000" : "#9ca3af"
                        }}>
                        Editorial Essence
                      </button>
                      <button
                        onClick={() => setEditorialSubTab("prelims")}
                        className="flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center"
                        style={{
                          background: editorialSubTab === "prelims" ? "#eab308" : "transparent",
                          color: editorialSubTab === "prelims" ? "#000" : "#9ca3af"
                        }}>
                        🎯 Prelims Factoids
                      </button>
                      <button
                        onClick={() => setEditorialSubTab("mains")}
                        className="flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center"
                        style={{
                          background: editorialSubTab === "mains" ? "#eab308" : "transparent",
                          color: editorialSubTab === "mains" ? "#000" : "#9ca3af"
                        }}>
                        ✍️ Mains Arguments
                      </button>
                    </div>

                    {/* Content Panel */}
                    <div className="space-y-4 min-h-[240px]">
                      {editorialSubTab === "summary" && (
                        <div className="space-y-4">
                          <p className="text-sm text-gray-200 leading-relaxed">
                            {selectedEditorial.summary}
                          </p>
                          {selectedEditorial.topperQuote && (
                            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                              <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider block mb-1">
                                💬 High-Impact Mains Quotable Extract:
                              </span>
                              <p className="text-xs text-gray-300 italic leading-relaxed">
                                "{selectedEditorial.topperQuote}"
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {editorialSubTab === "prelims" && (
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                            High-Probability Prelims Elimination Points:
                          </h4>
                          {selectedEditorial.prelimsPointers.map((pt, i) => (
                            <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                              <span className="text-amber-400 font-bold text-xs mt-0.5">•</span>
                              <span className="text-xs text-gray-200 leading-relaxed">{pt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {editorialSubTab === "mains" && (
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                            Multi-Dimensional Analytical Points for Mains Answers:
                          </h4>
                          {selectedEditorial.mainsPoints.map((pt, i) => (
                            <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                              <span className="text-emerald-400 font-bold text-xs mt-0.5">✓</span>
                              <span className="text-xs text-gray-200 leading-relaxed">{pt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                      <a
                        href="/notes"
                        className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 transition-all flex items-center gap-2">
                        <span>📝</span> Save to Notes Vault
                      </a>
                      <a
                        href="/mains-pyqs"
                        className="px-4 py-2 rounded-xl text-xs font-bold text-gray-300 transition-all flex items-center gap-2 bg-white/5 hover:bg-white/10">
                        <span>✍️</span> Practice Answer in Mains Studio
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: LIVE FLASH FEED */}
          {/* ========================================================================= */}
          {activeMainTab === "feed" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search live feed by topic, keyword, or policy..."
                  className="w-full sm:w-80 px-4 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 bg-black/40 border border-white/10 focus:outline-none"
                />

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-black/40 border border-white/10 focus:outline-none">
                    <option value="All">All Sources</option>
                    <option value="The Hindu">The Hindu</option>
                    <option value="Indian Express">Indian Express</option>
                    <option value="PIB">PIB Delhi</option>
                    <option value="PRS Legislative">PRS Legislative</option>
                  </select>

                  <select
                    value={selectedGSPaper}
                    onChange={(e) => setSelectedGSPaper(e.target.value)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-black/40 border border-white/10 focus:outline-none">
                    <option value="All">All GS Papers</option>
                    <option value="GS-1">GS-1 (History/Geo/Society)</option>
                    <option value="GS-2">GS-2 (Polity/Governance/IR)</option>
                    <option value="GS-3">GS-3 (Economy/Env/Sci-Tech)</option>
                    <option value="GS-4">GS-4 (Ethics/Integrity)</option>
                  </select>
                </div>
              </div>

              {/* Feed Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    className="p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
                    }}>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {art.source}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {art.gsPaper || "GS-2"}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-2 leading-snug line-clamp-2">{art.title}</h3>
                      <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 mb-4">{art.summary}</p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleAnalyzeArticle(art)}
                        disabled={analyzingId === art.id}
                        className="flex-1 py-1.5 rounded-xl text-xs font-semibold text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 transition-all text-center">
                        {analyzingId === art.id ? "Analyzing..." : "🔍 UPSC Breakdown"}
                      </button>

                      <button
                        onClick={() => handleGenerateQuiz(art)}
                        disabled={quizzingId === art.id}
                        className="flex-1 py-1.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 transition-all text-center">
                        {quizzingId === art.id ? "Drafting..." : "🎯 MCQ Drill"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: DAILY AUDIO BRIEFS */}
          {/* ========================================================================= */}
          {activeMainTab === "audio" && (
            <div className="space-y-6">
              <DailyAudioBrief />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: INTERACTIVE MCQ QUIZ */}
          {/* ========================================================================= */}
          {activeMainTab === "quiz" && (
            <div className="space-y-6">
              {!quizQuestions || quizQuestions.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/5">
                  <span className="text-5xl block mb-3">🎯</span>
                  <h3 className="text-lg font-bold text-white mb-2">No Active News Quiz Loaded</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
                    Select any live news article in the Live Feed tab and click "🎯 MCQ Drill" to generate instant 4-option UPSC practice questions.
                  </p>
                  <button
                    onClick={() => setActiveMainTab("feed")}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 transition-all">
                    Browse Live Feed →
                  </button>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto p-8 rounded-3xl backdrop-blur-xl space-y-6"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
                    <span className="font-bold text-amber-400">
                      Question {quizIndex + 1} of {quizQuestions.length}
                    </span>
                    <span className="text-gray-400 font-medium">Daily Current Affairs Drill</span>
                  </div>

                  {(() => {
                    const q = quizQuestions[quizIndex];
                    const selected = selectedAnswers[q.id];
                    const isRevealed = revealedQuestions[q.id];

                    return (
                      <div className="space-y-4">
                        <h3 className="text-base font-bold text-white leading-relaxed">{q.question}</h3>

                        <div className="space-y-2.5 pt-2">
                          {q.options.map((opt) => {
                            const optKey = opt.key || opt.id || "";
                            const isChosen = selected === optKey;
                            const isCorrect = optKey === q.answer;

                            let optStyle = {
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "#cbd5e1"
                            };

                            if (isRevealed) {
                              if (isCorrect) {
                                optStyle = { background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.5)", color: "#86efac" };
                              } else if (isChosen && !isCorrect) {
                                optStyle = { background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.5)", color: "#fca5a5" };
                              }
                            } else if (isChosen) {
                              optStyle = { background: "rgba(234,179,8,0.2)", border: "1px solid rgba(234,179,8,0.5)", color: "#fde047" };
                            }

                            return (
                              <div
                                key={optKey}
                                onClick={() => {
                                  if (!isRevealed) {
                                    sound.playClick();
                                    setSelectedAnswers((prev) => ({ ...prev, [q.id]: optKey }));
                                  }
                                }}
                                className="p-3.5 rounded-2xl cursor-pointer transition-all flex items-center gap-3 text-xs"
                                style={optStyle}>
                                <span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center font-bold">
                                  {optKey}
                                </span>
                                <span className="font-medium">{opt.text}</span>
                              </div>
                            );
                          })}
                        </div>

                        {!isRevealed && selected && (
                          <button
                            onClick={() => {
                              sound.playLock();
                              setRevealedQuestions({ ...revealedQuestions, [q.id]: true });
                              const isCorrect = selected === q.answer;
                              void trackActivityEvent("CURRENT_AFFAIRS_COMPLETED", {
                                questionId: q.id,
                                selectedAnswer: selected,
                                correctAnswer: q.answer,
                                isCorrect,
                              });
                            }}
                            className="w-full py-3 rounded-2xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 transition-all">
                            Submit Answer & View UPSC Reasoning
                          </button>
                        )}

                        {isRevealed && (
                          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                            <span className="text-xs font-bold text-emerald-400 block">Explanation:</span>
                            <p className="text-xs text-gray-300 leading-relaxed">{q.explanation}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <button
                            onClick={() => setQuizIndex(Math.max(0, quizIndex - 1))}
                            disabled={quizIndex === 0}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-30">
                            ← Previous
                          </button>
                          <button
                            onClick={() => setQuizIndex(Math.min(quizQuestions.length - 1, quizIndex + 1))}
                            disabled={quizIndex === quizQuestions.length - 1}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-amber-400 hover:text-amber-300 disabled:opacity-30">
                            Next Question →
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: GEOPOLITICS & ECONOMIC ATLAS */}
          {/* ========================================================================= */}
          {activeMainTab === "atlas" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => setShowEconomicSurvey(!showEconomicSurvey)}
                  className="p-5 rounded-3xl bg-blue-500/10 border border-blue-500/30 text-left transition-all hover:bg-blue-500/20">
                  <span className="text-2xl block mb-2">📊</span>
                  <h3 className="text-sm font-bold text-white">Economic Survey Visualizer</h3>
                  <p className="text-xs text-gray-400 mt-1">Macro indicators, GDP composition, Fiscal Deficit trends.</p>
                </button>

                <button
                  onClick={() => setShowGeopoliticsAtlas(!showGeopoliticsAtlas)}
                  className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-left transition-all hover:bg-amber-500/20">
                  <span className="text-2xl block mb-2">🌍</span>
                  <h3 className="text-sm font-bold text-white">Geopolitics Map Atlas</h3>
                  <p className="text-xs text-gray-400 mt-1">Straits, chokepoints, international corridors, and conflict zones.</p>
                </button>
              </div>

              {showEconomicSurvey && <EconomicSurveyVisualizer />}
              {showGeopoliticsAtlas && <GeopoliticsMapAtlas />}
            </div>
          )}

          {/* AI Analysis Modal */}
          {analysisModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="max-w-2xl w-full p-6 sm:p-8 rounded-3xl bg-[#0e1222] border border-blue-500/40 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold text-blue-400 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    {analysisModal.gsPaper} Analysis
                  </span>
                  <button
                    onClick={() => setAnalysisModal(null)}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white">
                    ✕
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">{analysisModal.title}</h3>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-gray-300 leading-relaxed">
                  <span className="text-blue-400 font-bold block mb-1">Executive Summary:</span>
                  {analysisModal.summary}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">High-Yield Prelims Pointers:</span>
                  <ul className="space-y-1.5">
                    {analysisModal.prelimsPoints.map((pt, i) => (
                      <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                  <span className="text-xs font-bold text-emerald-400 block mb-1">Mains Analytical Angle:</span>
                  <p className="text-xs text-gray-300 leading-relaxed">{analysisModal.mainsAngle}</p>
                </div>

                <button
                  onClick={() => setAnalysisModal(null)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all">
                  Close Breakdown
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
