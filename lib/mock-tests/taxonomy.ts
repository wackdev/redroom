/**
 * REDROOM UPSC CSE MOCK TEST TAXONOMY
 * Comprehensive subject-wise and topic-wise hierarchy for all Prelims test modules.
 */

export interface TopicMeta {
  id: string;
  name: string;
  description: string;
  expectedWeightage: string; // e.g. "High (3-5 Qs)"
}

export interface SubjectTaxonomy {
  id: string;
  subjectKey: string;
  displayName: string;
  curriculum: string;
  stage: "Prelims" | "Mains" | "Both";
  icon: string;
  accentColor: string;
  bgGradient: string;
  description: string;
  topics: TopicMeta[];
}

export const UPSC_SUBJECT_TAXONOMY: SubjectTaxonomy[] = [
  {
    id: "polity",
    subjectKey: "Polity",
    displayName: "Indian Polity & Governance",
    curriculum: "UPSC CSE GS Paper 1 & GS Paper 2",
    stage: "Both",
    icon: "🏛️",
    accentColor: "#D8A63A",
    bgGradient: "from-amber-950/40 via-[#181102] to-black",
    description: "Constitutional framework, Fundamental Rights, Union Executive, Parliament, Judiciary, and Federal Relations.",
    topics: [
      {
        id: "pol-const-framework",
        name: "Constitutional Framework & Preamble",
        description: "Evolution, drafting of Constitution, Preamble, Citizenship, and Article 1-4 State Reorganization.",
        expectedWeightage: "High (2-3 Qs)",
      },
      {
        id: "pol-rights-dpsp",
        name: "Fundamental Rights & Directive Principles",
        description: "Articles 12-35, writs jurisdiction, DPSP Articles 36-51, and Fundamental Duties Article 51A.",
        expectedWeightage: "Very High (3-5 Qs)",
      },
      {
        id: "pol-executive",
        name: "Union & State Executive",
        description: "President, Governor discretionary powers, Prime Minister, Council of Ministers, and Attorney General.",
        expectedWeightage: "High (2-4 Qs)",
      },
      {
        id: "pol-parliament",
        name: "Parliament & State Legislatures",
        description: "Sessions, bills procedure, parliamentary committees, budget passing, and speaker powers.",
        expectedWeightage: "Very High (4-6 Qs)",
      },
      {
        id: "pol-judiciary",
        name: "Judiciary & Constitutional Review",
        description: "Supreme Court, High Courts, judicial review, collegium system, and landmark constitutional benches.",
        expectedWeightage: "High (2-3 Qs)",
      },
      {
        id: "pol-federalism",
        name: "Federalism, Emergency & Local Bodies",
        description: "Inter-state councils, 73rd/74th amendments, Emergency provisions (Articles 352, 356, 360).",
        expectedWeightage: "Moderate (2-3 Qs)",
      },
      {
        id: "pol-bodies",
        name: "Constitutional & Statutory Bodies",
        description: "Election Commission, CAG, UPSC, Finance Commission, NITI Aayog, and statutory tribunals.",
        expectedWeightage: "High (2-3 Qs)",
      },
    ],
  },
  {
    id: "history",
    subjectKey: "History",
    displayName: "History of India & National Movement",
    curriculum: "UPSC CSE GS Paper 1",
    stage: "Prelims",
    icon: "📜",
    accentColor: "#F59E0B",
    bgGradient: "from-amber-900/30 via-[#150e03] to-black",
    description: "From 1757 British expansion, 1857 Revolt, tribal uprisings, socio-religious reforms, to Gandhian mass movements & Independence 1947.",
    topics: [
      {
        id: "hist-early-british",
        name: "British Expansion & Administrative Policies (1757–1857)",
        description: "Plassey, Buxar, Subsidiary Alliance, Doctrine of Lapse, Permanent Settlement, Ryotwari, and Mahalwari.",
        expectedWeightage: "High (2-3 Qs)",
      },
      {
        id: "hist-uprisings",
        name: "Civil, Tribal & Peasant Uprisings (1757–1857)",
        description: "Sanyasi Rebellion, Paika Bidroha, Santhal Hul, Kol Mutiny, and Ramosi Uprising.",
        expectedWeightage: "High (2-3 Qs)",
      },
      {
        id: "hist-1857-revolt",
        name: "The Revolt of 1857 & Aftermath",
        description: "Causes, leadership, Government of India Act 1858, and Queen's Proclamation.",
        expectedWeightage: "Moderate (1-2 Qs)",
      },
      {
        id: "hist-reforms",
        name: "Socio-Religious Reform Movements",
        description: "Brahmo Samaj, Arya Samaj, Ramakrishna Mission, Aligarh Movement, Jyotirao Phule, and Temple Entry.",
        expectedWeightage: "High (2-4 Qs)",
      },
      {
        id: "hist-early-inc",
        name: "Early Nationalism & Moderate-Extremist Era (1885–1905)",
        description: "Safety Valve theory, Dadabhai Naoroji drain theory, Moderate constitutional agitation, and Extremist leaders.",
        expectedWeightage: "Moderate (1-2 Qs)",
      },
      {
        id: "hist-swadeshi",
        name: "Swadeshi Movement, Surat Split & Revolutionaries (1905–1916)",
        description: "Partition of Bengal, Boycott movement, 1907 Surat Split, and Ghadar Party revolution.",
        expectedWeightage: "High (2-3 Qs)",
      },
      {
        id: "hist-gandhi-advent",
        name: "Home Rule Leagues & Gandhian Advent (1915–1919)",
        description: "Tilak & Annie Besant leagues, Champaran, Ahmedabad Mill Strike, and Kheda Satyagraha.",
        expectedWeightage: "High (2-3 Qs)",
      },
      {
        id: "hist-non-cooperation",
        name: "Rowlatt, Khilafat & Non-Cooperation Movement (1919–1922)",
        description: "Jallianwala Bagh Hunter Commission, Khilafat alliance, Nagpur session, and Chauri Chaura.",
        expectedWeightage: "Very High (3-4 Qs)",
      },
      {
        id: "hist-civil-disobedience",
        name: "Swarajists, Simon Commission & Civil Disobedience (1922–1934)",
        description: "Nehru Report, Dandi March, Salt Satyagraha, Karachi Resolution, and Round Table Conferences.",
        expectedWeightage: "Very High (3-5 Qs)",
      },
      {
        id: "hist-quit-india",
        name: "Quit India, INA & Final Freedom Phase (1939–1947)",
        description: "August Offer, Cripps Mission, Quit India Movement, Subhas Chandra Bose & INA trials, and Cabinet Mission.",
        expectedWeightage: "Very High (3-5 Qs)",
      },
    ],
  },
  {
    id: "economy",
    subjectKey: "Economy",
    displayName: "Indian Economy & Financial Architecture",
    curriculum: "UPSC CSE GS Paper 1 & GS Paper 3",
    stage: "Both",
    icon: "📈",
    accentColor: "#10B981",
    bgGradient: "from-emerald-950/40 via-[#03150d] to-black",
    description: "National income accounting, monetary policy, FRBM, GST, banking reforms, inflation, and external sector.",
    topics: [
      {
        id: "econ-national-income",
        name: "National Income Accounting & GDP/GVA",
        description: "Real vs Nominal GDP, Gross Value Added, deflators, and economic growth indicators.",
        expectedWeightage: "Moderate (1-2 Qs)",
      },
      {
        id: "econ-fiscal-policy",
        name: "Fiscal Policy, FRBM & Budget Deficits",
        description: "Fiscal, Revenue, and Primary Deficits, FRBM targets, and debt-to-GDP ratios.",
        expectedWeightage: "High (2-3 Qs)",
      },
      {
        id: "econ-taxation",
        name: "Taxation & GST Council Mechanism",
        description: "Direct tax reforms, GST Council Article 279A, inverted duty structure, and cess/surcharges.",
        expectedWeightage: "High (2-3 Qs)",
      },
      {
        id: "econ-monetary",
        name: "Monetary Policy & RBI Operations",
        description: "Repo/Reverse Repo, SDF, Liquidity Adjustment Facility, OMO, and MPC inflation mandate.",
        expectedWeightage: "Very High (3-4 Qs)",
      },
      {
        id: "econ-banking",
        name: "Banking Sector, NPA & Financial Inclusion",
        description: "IBC 2016, Bad Bank (NARCL), Basel III norms, Prompt Corrective Action, and Digital Public Infrastructure.",
        expectedWeightage: "High (2-3 Qs)",
      },
      {
        id: "econ-external",
        name: "External Sector, BoP & Forex Reserves",
        description: "Current Account Deficit, Capital Account Convertibility, Forex reserves, and Exchange Rate mechanisms.",
        expectedWeightage: "High (2-3 Qs)",
      },
    ],
  },
  {
    id: "geography",
    subjectKey: "Geography",
    displayName: "Indian & World Physical Geography",
    curriculum: "UPSC CSE GS Paper 1",
    stage: "Both",
    icon: "🌍",
    accentColor: "#06B6D4",
    bgGradient: "from-cyan-950/40 via-[#02141a] to-black",
    description: "Geomorphology, climatology, Indian monsoon, ocean currents, strategic straits, and river basins.",
    topics: [
      {
        id: "geo-geomorphology",
        name: "Geomorphology & Earth Dynamics",
        description: "Plate tectonics, continental drift, earthquake waves (P/S), volcanoes, and landforms.",
        expectedWeightage: "Moderate (1-2 Qs)",
      },
      {
        id: "geo-climatology",
        name: "Climatology & Indian Monsoon",
        description: "Jet streams, El Niño/La Niña, Indian Ocean Dipole, cyclones, and tropical atmospheric circulation.",
        expectedWeightage: "Very High (3-4 Qs)",
      },
      {
        id: "geo-oceanography",
        name: "Oceanography & Marine Straits",
        description: "Ocean currents, thermohaline circulation, strategic choke-points (Hormuz, Malacca, Bab-el-Mandeb).",
        expectedWeightage: "High (2-3 Qs)",
      },
      {
        id: "geo-indian-rivers",
        name: "Indian River Systems & Mountain Passes",
        description: "Himalayan vs Peninsular drainage, tributaries of Ganga, Indus, Brahmaputra, Godavari, and Western Ghats.",
        expectedWeightage: "Very High (3-4 Qs)",
      },
    ],
  },
  {
    id: "environment",
    subjectKey: "Environment",
    displayName: "Environment, Ecology & Climate Change",
    curriculum: "UPSC CSE GS Paper 1 & GS Paper 3",
    stage: "Both",
    icon: "🌿",
    accentColor: "#22C55E",
    bgGradient: "from-green-950/40 via-[#031508] to-black",
    description: "Kunming-Montreal Global Biodiversity Framework, Ramsar sites, Wildlife Protection Act, and climate COP pacts.",
    topics: [
      {
        id: "env-ecology",
        name: "Ecosystems & Biodiversity",
        description: "Ecological pyramids, biomagnification, ecotones, Ramsar wetlands, and IUCN Red List statuses.",
        expectedWeightage: "Very High (4-6 Qs)",
      },
      {
        id: "env-conventions",
        name: "International Climate & Environmental Conventions",
        description: "UNFCCC COP, CBD COP15 Kunming-Montreal (30x30), Paris Agreement, CITES, and Montreal Protocol.",
        expectedWeightage: "Very High (3-5 Qs)",
      },
      {
        id: "env-legislation",
        name: "Indian Environmental Acts & Protected Areas",
        description: "Wildlife Protection Act 1972 (2022 amendment), National Parks, Tiger Reserves, and Bio-reserves.",
        expectedWeightage: "High (3-4 Qs)",
      },
    ],
  },
  {
    id: "science_tech",
    subjectKey: "Science & Tech",
    displayName: "Science, Emerging Tech & Space",
    curriculum: "UPSC CSE GS Paper 1 & GS Paper 3",
    stage: "Both",
    icon: "🔬",
    accentColor: "#8B5CF6",
    bgGradient: "from-purple-950/40 via-[#10031f] to-black",
    description: "Quantum computing, CRISPR-Cas9 genome editing, James Webb Telescope, MEMS accelerometers, and AI systems.",
    topics: [
      {
        id: "sci-space",
        name: "Space Exploration & Astronomy",
        description: "ISRO missions (Gaganyaan, Chandrayaan, Aditya-L1), JWST, gravitational waves, and orbit types.",
        expectedWeightage: "High (2-3 Qs)",
      },
      {
        id: "sci-biotech",
        name: "Biotechnology & Healthcare",
        description: "CRISPR gene editing, mRNA vaccines, CAR-T cell therapy, and mitochondrial replacement.",
        expectedWeightage: "High (2-3 Qs)",
      },
      {
        id: "sci-frontier",
        name: "Quantum Computing & Frontier Tech",
        description: "Qubits, quantum superposition, Shor algorithm, MEMS sensors, solid-state batteries, and generative AI.",
        expectedWeightage: "High (2-4 Qs)",
      },
    ],
  },
  {
    id: "csat",
    subjectKey: "CSAT",
    displayName: "CSAT Paper 2 (Aptitude & Reasoning)",
    curriculum: "UPSC CSE Prelims Paper 2",
    stage: "Prelims",
    icon: "🧠",
    accentColor: "#EC4899",
    bgGradient: "from-pink-950/40 via-[#190310] to-black",
    description: "Number systems, divisibility, permutations & combinations, syllogisms, and critical reading comprehension.",
    topics: [
      {
        id: "csat-quant",
        name: "Quantitative Aptitude & Number Systems",
        description: "Remainders, modular arithmetic, prime numbers, factorials, ratios, and percentages.",
        expectedWeightage: "Very High (25-30 Qs)",
      },
      {
        id: "csat-reasoning",
        name: "Analytical & Logical Reasoning",
        description: "Puzzles, seating arrangements, blood relations, syllogisms, and clock/calendar problems.",
        expectedWeightage: "High (15-20 Qs)",
      },
      {
        id: "csat-reading",
        name: "Reading Comprehension & Critical Inferences",
        description: "Crucial assumptions, logical corollaries, most rational inferences, and passage themes.",
        expectedWeightage: "Very High (25-28 Qs)",
      },
    ],
  },
  {
    id: "full_length",
    subjectKey: "Full-Length Prelims",
    displayName: "Full-Length GS Paper 1 Simulations",
    curriculum: "UPSC CSE Prelims Official Pattern",
    stage: "Prelims",
    icon: "🎯",
    accentColor: "#EF4444",
    bgGradient: "from-red-950/40 via-[#190303] to-black",
    description: "Comprehensive multi-subject GS Paper 1 simulations reflecting the exact difficulty, negative marking, and trap radar of UPSC CSE.",
    topics: [
      {
        id: "flt-official-2024",
        name: "UPSC CSE Prelims Official Paper Analysis",
        description: "Multi-statement and 'how many pairs' questions mapped to authentic UPSC answer keys.",
        expectedWeightage: "100 Questions / 200 Marks",
      },
      {
        id: "flt-all-india",
        name: "All-India Mock Benchmark Simulations",
        description: "Full syllabus simulation with percentile ranking and subject-wise accuracy analysis.",
        expectedWeightage: "100 Questions / 200 Marks",
      },
    ],
  },
];

/**
 * Normalized Subject Keys for Quick Lookup
 */
export function normalizeSubjectKey(rawSubject: string): string {
  const s = (rawSubject || "").toLowerCase().trim();
  if (s.includes("polity")) return "Polity";
  if (s.includes("history")) return "History";
  if (s.includes("econ")) return "Economy";
  if (s.includes("geo")) return "Geography";
  if (s.includes("env") || s.includes("ecol")) return "Environment";
  if (s.includes("sci") || s.includes("tech")) return "Science & Tech";
  if (s.includes("csat") || s.includes("aptitude")) return "CSAT";
  if (s.includes("full") || s.includes("prelims")) return "Full-Length Prelims";
  return rawSubject;
}
