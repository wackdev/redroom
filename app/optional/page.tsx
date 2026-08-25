"use client";
import { useState, useEffect } from "react";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import { UserSessionManager } from "@/lib/core/user-context";

interface OptionalSubject {
  id: string;
  name: string;
  code: string;
  is_popular: boolean;
  strategy_notes: string;
  paper1Topics?: string[];
  paper2Topics?: string[];
  topperTips?: string[];
  highYieldAreas?: string[];
}

const DEFAULT_SUBJECTS: OptionalSubject[] = [
  {
    id: "opt-psir",
    name: "Political Science & International Relations",
    code: "PSIR",
    is_popular: true,
    strategy_notes: "Highest overlap with GS-2 (80%+). Strong theoretical foundation required for Western Political Thought (Plato to Marx) and Indian Political Thought (Kautilya to Ambedkar). Daily current affairs linkage essential for Section B & Paper 2.",
    paper1Topics: ["Western Political Thought (Plato, Aristotle, Machiavelli, Hobbes, Locke, Mill, Marx, Gramsci, Hannah Arendt)", "Indian Political Thought (Dharamshastra, Arthashastra, Buddhist traditions, Sir Syed, Gandhi, Ambedkar, MN Roy)", "Political Ideologies (Liberalism, Socialism, Marxism, Fascism, Gandhism, Feminism)", "Indian Nationalism & Constitutional Framework", "Principal Organs of Union & State Government"],
    paper2Topics: ["Comparative Politics & International Approaches (Realism, Liberalism, Constructivism)", "Key Concepts: Power, National Interest, Balance of Power, Transnational Actors", "Changing Global Order: Cold War, Post-Cold War, Multipolarity", "India and the World: NAM, Look East/Act East, Neighborhood First", "India and Global Centers of Power (US, EU, China, Russia, Japan)"],
    topperTips: ["Quote political philosophers and IR scholars directly (e.g., C. Raja Mohan, Harsh Pant, Suhas Palshikar)", "Connect ancient political thought with modern governance dilemmas in GS-4 & Essays", "Maintain a dedicated case study journal for dynamic IR bilateral developments"],
    highYieldAreas: ["Western Thinkers (Paper 1A)", "Grassroots Democracy & 73rd/74th Amendments (Paper 1B)", "Nuclear Doctrine & Geostrategic Realignment (Paper 2B)"]
  },
  {
    id: "opt-sociology",
    name: "Sociology",
    code: "SOC",
    is_popular: true,
    strategy_notes: "Concise syllabus with massive overlap with GS-1 Society, GS-4 Ethics case studies, and Essay paper. Scoring key lies in applying sociological thinkers to contemporary Indian social realities.",
    paper1Topics: ["Sociological Thinkers: Karl Marx, Emile Durkheim, Max Weber, Talcott Parsons, Robert K. Merton, G.H. Mead", "Sociology as Science & Research Methods", "Stratification and Mobility: Caste, Class, Gender, Race", "Works and Economic Life, Politics and Society", "Religion, Kinship Systems, Social Change"],
    paper2Topics: ["Perspectives on Indian Society: Indology (Ghurye), Structural Functionalism (MN Srinivas), Marxist (AR Desai)", "Impact of Colonial Rule on Indian Society", "Caste System: Perspectives, Features, Untouchability", "Agrarian Structure & Peasant Movements", "Tribal Communities: Problems, Assimilation, Integration", "Social Movements in Contemporary India"],
    topperTips: ["Never write pure generalist answers — explicitly cite thinkers and sociological concepts", "Interlink Paper 1 Western concepts with Paper 2 Indian social phenomena", "Use diagrams for kinship systems, stratification models, and social mobility trees"],
    highYieldAreas: ["Durkheim & Weber Theories", "MN Srinivas Sanskritization vs Modernization", "Agrarian Distress & Women's Movements"]
  },
  {
    id: "opt-geography",
    name: "Geography",
    code: "GEO",
    is_popular: true,
    strategy_notes: "Scientific, diagram-heavy, and objective. 70%+ overlap with GS-1 Physical & Human Geography, GS-3 Disaster Management and Agriculture. High returns on map-pointing precision.",
    paper1Topics: ["Geomorphology: Plate Tectonics, Endogenetic/Exogenetic forces, Landforms", "Climatology: Heat budget, Monsoons, Jet streams, Cyclones", "Oceanography: Bottom topography, Salinity, Currents, Tides", "Biogeography & Environmental Geography", "Perspectives in Human Geography: Quantitative Revolution, Behavioralism", "Economic & Population Geography"],
    paper2Topics: ["Physical Setting of India: Structure, Relief, Drainage, Climate", "Resources: Land, Water, Mineral, Energy", "Agriculture: Infrastructure, Crops, Agro-climatic zones, Green Revolution", "Industry: Evolution, Location factors, Industrial complexes", "Transport, Communication and Trade", "Contemporary Issues: Floods, Droughts, Regional disparities"],
    topperTips: ["Integrate hand-drawn sketch maps in every single 10M, 15M, and 20M answer", "Master model application: Christaller, Weber, Von Thunen, Rostow", "Connect physical geography phenomena with live IPCC assessment reports"],
    highYieldAreas: ["Plate Tectonics & Geomorphic Cycles", "Indian Monsoon Dynamics & ENSO", "Regional Development & Urban Planning Models"]
  },
  {
    id: "opt-history",
    name: "History",
    code: "HIST",
    is_popular: true,
    strategy_notes: "Most stable and predictable syllabus. Direct GS-1 overlap (100 marks+). Map question in Paper 1 is pure mathematical scoring if practiced methodically.",
    paper1Topics: ["Sources: Archaeological, Literary, Inscriptions, Coins", "Pre-history, Proto-history, Harappan Civilization", "Vedic Period, Mahajanapadas, Mauryan Empire, Post-Mauryan Developments", "Guptas, Vakatakas, Harsha, Regional States of South India (Cholas, Pallavas)", "Early Medieval India, Delhi Sultanate, Vijayanagara Empire, Mughal Empire"],
    paper2Topics: ["European Penetration in India, British Expansion & Governance", "Economic Impact of British Rule: Land Revenue, Deindustrialization, Drain of Wealth", "Social and Cultural Reform Movements", "Indian National Movement (1857-1947): Moderates, Extremists, Gandhian Era", "Post-Independence Consolidation", "World History: Industrial Revolution, French Revolution, Imperialism, World Wars, Cold War"],
    topperTips: ["Practice 100 historical map sites with exact coordinates and period identification", "Structure historiography debate: Nationalist vs Marxist vs Subaltern perspectives", "Use timeline flowcharts to present chronological developments crisply"],
    highYieldAreas: ["Harappan Urbanism & Trade", "Chola Local Administration & Bronze Art", "Tribal & Peasant Uprisings under Colonialism"]
  },
  {
    id: "opt-pub-admin",
    name: "Public Administration",
    code: "PADM",
    is_popular: true,
    strategy_notes: "The foundational civil servant optional. Massive synergy with GS-2 Governance & Executive, GS-4 Ethics, and administrative decision-making in real life.",
    paper1Topics: ["Administrative Thinkers: Taylor, Fayol, Weber, Simon, Riggs, Likert, Follett", "Evolution of Public Administration: NPM, NPS, Good Governance", "Administrative Behavior: Decision-making, Motivation, Leadership", "Accountability and Control: Citizen's Charter, RTI, Lokpal, Judicial Review", "Administrative Law & Financial Administration"],
    paper2Topics: ["Evolution of Indian Administration: Kautilya, Mughal, British legacy", "Constitutional Framework: President, PM, Cabinet, Secretariat", "Union-State Administrative Relations, Field Administration (District Collector)", "Civil Services in India: Structure, Recruitment, Training, Neutrality", "Law and Order Administration, Disaster Management, Rural and Urban Local Governance"],
    topperTips: ["Anchor Paper 2 answers by citing 2nd ARC Recommendations specifically", "Bridge Paper 1 classical theories with contemporary governance reforms (e.g. Mission Karmayogi)", "Use administrative process flowcharts to demonstrate efficiency interventions"],
    highYieldAreas: ["Simon's Decision Making & Weberian Bureaucracy", "ARC-II Reports & Civil Service Reforms", "RTI, Citizen's Charters & Social Audits"]
  },
  {
    id: "opt-anthropology",
    name: "Anthropology",
    code: "ANTH",
    is_popular: true,
    strategy_notes: "Concise, highly scoring with objective biological section and culturally rich social anthropology. Direct relevance to Tribal Development, GS-1, and Ethics.",
    paper1Topics: ["Meaning, Scope & Development of Anthropology; Relationships with other disciplines", "Human Evolution and Hominization Process; Fossil evidence (Australopithecus to Neanderthal)", "Genetic Principles: Mendelian genetics, Twin study method, DNA technology", "Social Anthropology: Marriage, Family, Kinship, Economic Organisation, Religion", "Anthropological Theories: Classical Evolutionism, Functionalism, Structuralism"],
    paper2Topics: ["Evolution of Indian Culture and Civilization: Palaeolithic to Indus Valley", "Palaeoanthropological evidences from India (Siwaliks, Narmada Man)", "Caste System: Traditional features, Changes, Dominant Caste", "Tribal Cultures of India: Geographical distribution, Socio-economic problems", "Tribal Development: Constitutional safeguards, PESA, Forest Rights Act"],
    topperTips: ["Biological anthropology diagrams (skulls, genetic trees) fetch full marks when neat", "Case studies of specific Indian tribes (e.g., Baiga, Chenchus, Jarawas) add high value", "Keep PESA & Forest Rights Act implementation data at your fingertips"],
    highYieldAreas: ["Human Physical Evolution & Fossil Record", "Structural-Functional Theories of Kinship", "Tribal Vulnerability & PVTG Policy Interventions"]
  },
  {
    id: "opt-philosophy",
    name: "Philosophy",
    code: "PHIL",
    is_popular: false,
    strategy_notes: "Smallest syllabus among all optionals. Logical, abstract, and deeply enriching. Directly elevates Essay scoring ability and GS-4 Ethics theoretical rigor.",
    paper1Topics: ["Western Philosophy: Plato, Aristotle, Rationalism (Descartes, Spinoza, Leibniz), Empiricism (Locke, Berkeley, Hume), Kant, Hegel, Moore, Russell, Wittgenstein", "Indian Philosophy: Carvaka, Jainism, Buddhism, Nyaya-Vaisheshika, Samkhya-Yoga, Mimamsa, Advaita Vedanta (Sankara), Visistadvaita (Ramanuja)"],
    paper2Topics: ["Socio-Political Philosophy: Political Ideals (Equality, Justice, Liberty), Sovereignty, Individual and State, Democratic socialism, Human Rights, Gender Equality", "Philosophy of Religion: Notions of God, Proofs for God's Existence, Problem of Evil, Soul and Immortality, Religious Experience, Secularism"],
    topperTips: ["Focus on epistemological vs ontological distinctions for each thinker", "Use comparative synthesis tables (e.g. Kant's Categorical Imperative vs Gita's Nishkama Karma)", "Ensure crisp definitions of Sanskrit terms (Pramana, Maya, Nirguna, Pratityasamutpada)"],
    highYieldAreas: ["Advaita Vedanta vs Visistadvaita Epistemology", "Kant's Synthetic A Priori & Transcendental Idealism", "John Rawls Theory of Justice vs Amartya Sen"]
  },
  {
    id: "opt-economics",
    name: "Economics",
    code: "ECO",
    is_popular: false,
    strategy_notes: "Analytical, rewarding for candidates with strong quantitative foundation. Deeply connected with GS-3 Economy, Union Budget, and Economic Survey analysis.",
    paper1Topics: ["Advanced Microeconomics: Marshallian/Walrasian Approaches, Consumer Theory, Market Structures", "Macroeconomics: Classical, Keynesian, Post-Keynesian, IS-LM Model", "Money, Banking & International Economics: Monetary policy, Balance of Payments, Exchange rate regimes", "Growth & Development: Solow, Harrod-Domar, Lewis, Sen's Capability Approach"],
    paper2Topics: ["Indian Economy in Pre-Independence Era: Land tenure, Railways, Deindustrialization", "Post-Independence Economy: Planning era, LPG Reforms 1991, Public sector reforms", "Agriculture: Land reforms, Green revolution, MSP, Agri-finance", "Industry & Infrastructure: Industrial policy, Make in India, Disinvestment", "Money, Banking & Public Finance: Fiscal federalism, GST, FRBM Act, Inflation targeting"],
    topperTips: ["Always accompany theoretical answers with labeled geometric graphs and equations", "Incorporate real-time Economic Survey and RBI Annual Report data points", "Evaluate policy initiatives with econometric and welfare implications"],
    highYieldAreas: ["IS-LM Dynamics & Open Economy Macro", "Lewis Model vs Fei-Ranis Dual Economy", "Fiscal Deficit Sustainability & FRBM Architecture"]
  }
];

export default function OptionalPage() {
  const [user] = useState(UserSessionManager.getActiveUser());
  const [subjects, setSubjects] = useState<OptionalSubject[]>(DEFAULT_SUBJECTS);
  const [selectedSubject, setSelectedSubject] = useState<OptionalSubject>(DEFAULT_SUBJECTS[0]);
  const [activePaper, setActivePaper] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "popular">("all");

  useEffect(() => {
    fetch("/api/optional/subjects")
      .then(res => res.json())
      .then(data => {
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          setSubjects(data.data);
          setSelectedSubject(data.data[0]);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = subjects.filter(s => {
    const matchesFilter = filterMode === "all" || s.is_popular;
    const matchesSearch = searchQuery === "" || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #090a14 0%, #0e1224 50%, #080912 100%)" }}>
      <AppUniversalHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Hero Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-semibold uppercase tracking-wider"
            style={{ background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa" }}>
            <span>🏛️</span> 500-Mark Critical Decider Module
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
            Optional Subject Mastery Command
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto text-sm leading-relaxed">
            Optional contributes <span className="text-blue-400 font-semibold">500 marks out of 1750 (nearly 30%)</span> in UPSC Mains. A target score of 290-320+ guarantees a top 100 rank. Explore complete Paper 1 & 2 breakdown, high-yield topics, and topper strategy blueprints.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or code (e.g., PSIR, SOC)..."
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 transition-all focus:outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode("all")}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: filterMode === "all" ? "rgba(96,165,250,0.25)" : "rgba(255,255,255,0.04)",
                border: filterMode === "all" ? "1px solid rgba(96,165,250,0.5)" : "1px solid rgba(255,255,255,0.08)",
                color: filterMode === "all" ? "#93c5fd" : "#9ca3af"
              }}>
              All 25 Optionals
            </button>
            <button
              onClick={() => setFilterMode("popular")}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: filterMode === "popular" ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.04)",
                border: filterMode === "popular" ? "1px solid rgba(245,158,11,0.5)" : "1px solid rgba(255,255,255,0.08)",
                color: filterMode === "popular" ? "#fcd34d" : "#9ca3af"
              }}>
              🔥 High Enrolment Only
            </button>
          </div>
        </div>

        {/* Main Grid: Subject Selector & Deep Dive Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Subject Tabs */}
          <div className="lg:col-span-4 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filtered.map(subj => {
              const isSelected = selectedSubject.id === subj.id;
              return (
                <div
                  key={subj.id}
                  onClick={() => setSelectedSubject(subj)}
                  className="p-4 rounded-2xl cursor-pointer transition-all duration-200"
                  style={{
                    background: isSelected ? "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(30,58,138,0.3))" : "rgba(255,255,255,0.03)",
                    border: isSelected ? "1px solid rgba(96,165,250,0.5)" : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: isSelected ? "0 8px 24px rgba(37,99,235,0.2)" : "none"
                  }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                      style={{
                        background: isSelected ? "rgba(96,165,250,0.3)" : "rgba(255,255,255,0.08)",
                        color: isSelected ? "#bfdbfe" : "#cbd5e1"
                      }}>
                      {subj.code}
                    </span>
                    {subj.is_popular && (
                      <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                        High Yield
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-white leading-snug">{subj.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{subj.strategy_notes}</p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Subject Deep View */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.4)"
              }}>
              
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h2 className="text-2xl font-bold text-white">{selectedSubject.name}</h2>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg text-blue-300 bg-blue-500/20 border border-blue-500/30">
                      {selectedSubject.code}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Paper 1 (250M) + Paper 2 (250M) = 500 Marks Total</p>
                </div>

                <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setActivePaper(1)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: activePaper === 1 ? "#2563eb" : "transparent",
                      color: activePaper === 1 ? "#fff" : "#9ca3af"
                    }}>
                    Paper 1 (Theory & Foundation)
                  </button>
                  <button
                    onClick={() => setActivePaper(2)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: activePaper === 2 ? "#2563eb" : "transparent",
                      color: activePaper === 2 ? "#fff" : "#9ca3af"
                    }}>
                    Paper 2 (Applied & Indian Context)
                  </button>
                </div>
              </div>

              {/* Strategy Blueprint Alert */}
              <div className="my-6 p-4 rounded-2xl" style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)" }}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Strategic Orientation</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">{selectedSubject.strategy_notes}</p>
                  </div>
                </div>
              </div>

              {/* Syllabus Breakdown for Active Paper */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                  <span>📑</span> Paper {activePaper} Core Syllabus Modules
                </h4>
                <div className="space-y-2.5">
                  {(activePaper === 1 ? (selectedSubject.paper1Topics || []) : (selectedSubject.paper2Topics || [])).map((topic, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl flex items-start gap-3"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-400 bg-blue-500/10 shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-xs text-gray-200 leading-relaxed font-medium">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topper Insights & High Yield Grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                {selectedSubject.topperTips && (
                  <div className="p-4 rounded-2xl" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span>🏆</span> Topper Answer Writing Rules
                    </h4>
                    <ul className="space-y-2">
                      {selectedSubject.topperTips.map((tip, idx) => (
                        <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedSubject.highYieldAreas && (
                  <div className="p-4 rounded-2xl" style={{ background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.2)" }}>
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span>🎯</span> High Probability Exam Sectors
                    </h4>
                    <ul className="space-y-2">
                      {selectedSubject.highYieldAreas.map((area, idx) => (
                        <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">★</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-white/10">
                <a
                  href="/answer-lab"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}>
                  <span>✍️</span> Practice Mains Answer for {selectedSubject.code}
                </a>
                <a
                  href="/mains-pyqs"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-300 transition-all flex items-center gap-2"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span>📚</span> View 10-Year Mains PYQs
                </a>
                <a
                  href="/study-room"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-300 transition-all flex items-center gap-2"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span>👥</span> Join {selectedSubject.code} Study Room
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
