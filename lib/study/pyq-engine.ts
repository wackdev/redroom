import {
  PYQQuestion,
  PYQAttempt,
  MistakeType,
  WeaknessInsight,
} from "../core/types";
import { calculateAccuracy, safeArray } from "../core/utils";
import { dexieDb } from "../db/dexie";
import {
  ALL_TAXONOMY_SUBJECTS,
  PRELIMS_TAXONOMY_SUBJECTS,
  PRELIMS_2025_PAPER,
  PYQSubject,
  PYQChapter,
  getSubjectByIdOrName,
  getAllChaptersForSubject,
  findChapterById,
} from "../pyq/taxonomy";

import prelims2025Json from "../../data/pyqs/prelims/prelims-2025.json";
import ancientHistoryJson from "../../data/pyqs/prelims/ancient-history.json";
import medievalHistoryJson from "../../data/pyqs/prelims/medieval-history.json";
import artCultureJson from "../../data/pyqs/prelims/art-and-culture.json";
import modernHistoryJson from "../../data/pyqs/prelims/modern-history.json";
import polityJson from "../../data/pyqs/prelims/polity.json";
import indianEconomyJson from "../../data/pyqs/prelims/indian-economy.json";
import geographyJson from "../../data/pyqs/prelims/geography.json";

// Export taxonomy items directly for consumers
export {
  ALL_TAXONOMY_SUBJECTS,
  PRELIMS_TAXONOMY_SUBJECTS,
  PRELIMS_2025_PAPER,
  getSubjectByIdOrName,
  getAllChaptersForSubject,
  findChapterById,
};
export type { PYQSubject, PYQChapter };

// ============================================================================
// DYNAMIC DATASET (TIED TO 126-CHAPTER TAXONOMY)
// ============================================================================

export const LOCAL_STORAGE_CUSTOM_PYQS_KEY = "redroom_custom_pyqs";

/**
 * Authentic UPSC CSE Prelims PYQs directly classified into the WhyNotUPSC 126-chapter index.
 * Serves as high-yield baseline before candidate imports extra subject-wise PDFs.
 */
const BASELINE_VAULT_QUESTIONS: PYQQuestion[] = [
  ...(prelims2025Json as PYQQuestion[]),
  ...(ancientHistoryJson as PYQQuestion[]),
  ...(medievalHistoryJson as PYQQuestion[]),
  ...(artCultureJson as PYQQuestion[]),
  ...(modernHistoryJson as PYQQuestion[]),
  ...(polityJson as PYQQuestion[]),
  ...(indianEconomyJson as PYQQuestion[]),
  ...(geographyJson as PYQQuestion[]),
];

export const STATIC_PYQ_DATASET: PYQQuestion[] = [
  ...BASELINE_VAULT_QUESTIONS,
  // --- ANCIENT HISTORY ---
  {
    id: "ah-q1",
    year: 2021,
    subject: "Ancient History",
    topic: "Harappan Civilization (Indus Valley)",
    subtopic: "Harappan Civilization (Indus Valley)",
    paper: "GS-1",
    question: "Which one of the following ancient towns is well-known for its elaborate system of water harvesting and management by building a series of dams and channelizing water into connected reservoirs?",
    options: [
      { id: "a", key: "A", text: "Dholavira" },
      { id: "b", key: "B", text: "Kalibangan" },
      { id: "c", key: "C", text: "Rakhigarhi" },
      { id: "d", key: "D", text: "Ropar" },
    ],
    correctAnswer: "A",
    explanation: "Dholavira, located on Kadir island in the Rann of Kutch (Gujarat), is celebrated for its unique water harvesting system comprising massive stone-cut rock reservoirs, check dams, and drainage channels. It was declared a UNESCO World Heritage Site in 2021.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Ancient History", "Harappan Civilization", "Water Harvesting", "Dholavira"],
  },
  {
    id: "ah-q2",
    year: 2020,
    subject: "Ancient History",
    topic: "History of Mauryan Age",
    subtopic: "History of Mauryan Age",
    paper: "GS-1",
    question: "Who among the following rulers advised his subjects through this inscription?\n\n'Whosoever praises his religious sect or blames other sects out of extreme devotion to his own sect, with the view of glorifying his own sect, he rather injures his own sect very severely.'",
    options: [
      { id: "a", key: "A", text: "Ashoka" },
      { id: "b", key: "B", text: "Samudragupta" },
      { id: "c", key: "C", text: "Harshavardhana" },
      { id: "d", key: "D", text: "Krishnadevaraya" },
    ],
    correctAnswer: "A",
    explanation: "This quotation is inscribed in Major Rock Edict XII of Emperor Ashoka at Girnar and other sites, advocating religious tolerance, restraint in speech, and mutual respect among different philosophical faiths.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Ancient History", "Mauryan Age", "Ashoka", "Major Rock Edict XII"],
  },

  // --- MEDIEVAL HISTORY ---
  {
    id: "mh-q1",
    year: 2021,
    subject: "Medieval History",
    topic: "Vijayanagara Empire",
    subtopic: "Vijayanagara Empire",
    paper: "GS-1",
    question: "According to Portuguese writer Fernao Nuniz, the women in Vijayanagara Empire were experts in which of the following areas?\n1. Wrestling\n2. Astrology\n3. Accounting\n4. Soothsaying\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1, 2 and 3 only" },
      { id: "b", key: "B", text: "1, 3 and 4 only" },
      { id: "c", key: "C", text: "2 and 4 only" },
      { id: "d", key: "D", text: "1, 2, 3 and 4" },
    ],
    correctAnswer: "D",
    explanation: "Fernao Nuniz, who visited Vijayanagara during the reign of Achyuta Deva Raya, noted that the king had women wrestlers, astrologers, soothsayers, and women who wrote accounts of expenses.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Medieval History", "Vijayanagara Empire", "Foreign Travellers", "Nuniz"],
  },
  {
    id: "mh-q2",
    year: 2021,
    subject: "Medieval History",
    topic: "The Delhi Sultanate",
    subtopic: "The Delhi Sultanate",
    paper: "GS-1",
    question: "With reference to medieval India, which one of the following is the correct sequence in ascending order in terms of size?",
    options: [
      { id: "a", key: "A", text: "Paragana - Sarkar - Suba" },
      { id: "b", key: "B", text: "Sarkar - Paragana - Suba" },
      { id: "c", key: "C", text: "Suba - Sarkar - Paragana" },
      { id: "d", key: "D", text: "Paragana - Suba - Sarkar" },
    ],
    correctAnswer: "A",
    explanation: "In medieval territorial administration: A group of villages formed a Paragana. Several Paraganas formed a Sarkar (district). Multiple Sarkars constituted a Suba (province). In ascending order: Paragana < Sarkar < Suba.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Medieval History", "Delhi Sultanate", "Administrative Hierarchy"],
  },

  // --- MODERN HISTORY ---
  {
    id: "mod-q1",
    year: 2021,
    subject: "Modern History",
    topic: "Indian National Movement - III (1930-1947)",
    subtopic: "Indian National Movement - III (1930-1947)",
    paper: "GS-1",
    question: "With reference to 8th August 1942 in Indian history, which one of the following statements is correct?",
    options: [
      { id: "a", key: "A", text: "The Quit India Resolution was adopted by the AICC." },
      { id: "b", key: "B", text: "The Viceroy's Executive Council was expanded to include more Indians." },
      { id: "c", key: "C", text: "The Congress ministries resigned in seven provinces." },
      { id: "d", key: "D", text: "Cripps proposed an Indian Union with full Dominion Status once the Second World War ended." },
    ],
    correctAnswer: "A",
    explanation: "On 8 August 1942 at the Gowalia Tank Maidan in Bombay, the All India Congress Committee (AICC) ratified the historic Quit India Resolution, where Mahatma Gandhi launched the 'Do or Die' call.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Modern History", "Quit India Movement", "1942", "AICC"],
  },
  {
    id: "mod-q2",
    year: 2021,
    subject: "Modern History",
    topic: "Socio-Religious Movements",
    subtopic: "Socio-Religious Movements",
    paper: "GS-1",
    question: "Who among the following was associated as Secretary with Hindu Female School which later came to be known as Bethune Female School?",
    options: [
      { id: "a", key: "A", text: "Annie Besant" },
      { id: "b", key: "B", text: "Debendranath Tagore" },
      { id: "c", key: "C", text: "Ishwar Chandra Vidyasagar" },
      { id: "d", key: "D", text: "Sarojini Naidu" },
    ],
    correctAnswer: "C",
    explanation: "In 1849, John Elliot Drinkwater Bethune founded the Hindu Female School in Calcutta. Ishwar Chandra Vidyasagar served as its Secretary and was a pioneer of women's education in Bengal.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Modern History", "Socio-Religious Movements", "Vidyasagar", "Women Education"],
  },

  // --- ART AND CULTURE ---
  {
    id: "ac-q1",
    year: 2021,
    subject: "Art and Culture",
    topic: "Temple Architecture",
    subtopic: "Temple Architecture",
    paper: "GS-1",
    question: "With reference to the Chausath Yogini Temple situated near Morena, consider the following statements:\n1. It is a circular temple built during the reign of the Kachchhapaghata dynasty.\n2. It is the only circular temple built in India.\n3. It was meant to promote the Vaishnava cult in the region.\n4. Its design has given rise to a popular belief that it was the inspiration behind the Indian Parliament building.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 4 only" },
      { id: "b", key: "B", text: "2, 3 and 4 only" },
      { id: "c", key: "C", text: "1, 2 and 3 only" },
      { id: "d", key: "D", text: "1, 2, 3 and 4" },
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct (built by Kachchhapaghata king Devapala in 1323 AD). Statement 2 is incorrect (there are other circular temples, e.g. at Ranipur-Jharial and Jabalpur). Statement 3 is incorrect (dedicated to Shiva and 64 Yoginis, Shakta cult). Statement 4 is correct (widely recognized as inspiring the circular old Parliament house).",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Art and Culture", "Temple Architecture", "Chausath Yogini", "Morena"],
  },
  {
    id: "ac-q2",
    year: 2020,
    subject: "Art and Culture",
    topic: "Buddhism and Jainism",
    subtopic: "Buddhism and Jainism",
    paper: "GS-1",
    question: "With reference to the religious history of India, consider the following statements:\n1. Sthaviravadins belong to Mahayana Buddhism.\n2. Lokottaravadin sect was an offshoot of Mahasanghika sect of Buddhism.\n3. The deification of Buddha by Mahasanghikas fostered the Mahayana Buddhism.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" },
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect (Sthaviravadins belong to Theravada/Hinayana school, splitting at the 2nd Buddhist Council). Statement 2 is correct (Lokottaravada emerged from Mahasanghikas). Statement 3 is correct (Mahasanghikas treated Buddha as supramundane/lokottara, laying foundation for Mahayana).",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Art and Culture", "Buddhism and Jainism", "Sects of Buddhism", "Mahasanghikas"],
  },

  // --- POLITY ---
  {
    id: "pol-q1",
    year: 2021,
    subject: "Polity",
    topic: "Preamble",
    subtopic: "Preamble",
    paper: "GS-1",
    question: "What was the exact constitutional status of India on 26th January, 1950?",
    options: [
      { id: "a", key: "A", text: "A Democratic Republic" },
      { id: "b", key: "B", text: "A Sovereign Democratic Republic" },
      { id: "c", key: "C", text: "A Sovereign Secular Democratic Republic" },
      { id: "d", key: "D", text: "A Sovereign Socialist Secular Democratic Republic" },
    ],
    correctAnswer: "B",
    explanation: "On 26 January 1950, the original Preamble described India as a 'Sovereign Democratic Republic'. The words 'Socialist', 'Secular', and 'and integrity' were later added by the 42nd Constitutional Amendment Act, 1976.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Polity", "Preamble", "Constitutional Status", "42nd Amendment"],
  },
  {
    id: "pol-q2",
    year: 2021,
    subject: "Polity",
    topic: "Fundamental Rights",
    subtopic: "Fundamental Rights",
    paper: "GS-1",
    question: "A legislation which confers on the executive or administrative authority an unguided and uncontrolled discretionary power in the matter of the application of law violates which one of the following Articles of the Constitution of India?",
    options: [
      { id: "a", key: "A", text: "Article 14" },
      { id: "b", key: "B", text: "Article 28" },
      { id: "c", key: "C", text: "Article 32" },
      { id: "d", key: "D", text: "Article 44" },
    ],
    correctAnswer: "A",
    explanation: "Arbitrary and unguided discretionary executive power violates the Rule of Law and the doctrine of equality against arbitrariness embedded in Article 14 (Equality before Law & Equal Protection of the Laws).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Polity", "Fundamental Rights", "Article 14", "Rule of Law"],
  },

  // --- INDIAN ECONOMY ---
  {
    id: "econ-q1",
    year: 2021,
    subject: "Indian Economy",
    topic: "Banking Sector in India",
    subtopic: "Banking Sector in India",
    paper: "GS-1",
    question: "In India, the Central Bank's function as the 'lender of last resort' usually refers to which of the following?\n1. Lending to trade and industry bodies when they fail to borrow from other sources\n2. Providing liquidity to the banks having a temporary crisis\n3. Lending to governments to finance budgetary deficits\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "2 and 3 only" },
      { id: "d", key: "D", text: "3 only" },
    ],
    correctAnswer: "B",
    explanation: "As the lender of last resort, RBI comes to the rescue of solvent commercial banks that are facing temporary liquidity strain when they cannot obtain cash from the interbank market.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Indian Economy", "Banking Sector in India", "Lender of Last Resort", "RBI"],
  },
  {
    id: "econ-q2",
    year: 2022,
    subject: "Indian Economy",
    topic: "Money Market",
    subtopic: "Money Market",
    paper: "GS-1",
    question: "With reference to the Indian economy, what are the advantages of 'Inflation Indexed Bonds (IIBs)'?\n1. Government can reduce the coupon rates on its borrowing by way of IIBs.\n2. IIBs provide protection to the investors from uncertainty regarding inflation.\n3. The interest received as well as capital gains on IIBs are not taxable.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" },
    ],
    correctAnswer: "A",
    explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect because interest income and capital gains on IIBs are subject to normal tax rules according to the Income Tax Act.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Indian Economy", "Money Market", "Inflation Indexed Bonds"],
  },

  // --- GEOGRAPHY ---
  {
    id: "geo-q1",
    year: 2020,
    subject: "Geography",
    topic: "Location/Map Based : Indian Geography",
    subtopic: "Location/Map Based : Indian Geography",
    paper: "GS-1",
    question: "Siachen Glacier is situated to the:",
    options: [
      { id: "a", key: "A", text: "East of Aksai Chin" },
      { id: "b", key: "B", text: "East of Leh" },
      { id: "c", key: "C", text: "North of Gilgit" },
      { id: "d", key: "D", text: "North of Nubra Valley" },
    ],
    correctAnswer: "D",
    explanation: "The Siachen Glacier lies in the eastern Karakoram range in the Himalayas, immediately North of the Nubra Valley, which is formed by the Nubra River draining meltwater from the glacier.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Geography", "Map Based Indian Geography", "Siachen Glacier", "Nubra Valley"],
  },
  {
    id: "geo-q2",
    year: 2022,
    subject: "Geography",
    topic: "Climatology",
    subtopic: "Climatology",
    paper: "GS-1",
    question: "Consider the following statements:\n1. High clouds primarily reflect solar radiation and cool the surface of the Earth.\n2. Low clouds have a high absorption of infrared radiation that emanates from the Earth's surface and thus cause warming effect.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" },
    ],
    correctAnswer: "D",
    explanation: "Both statements are inverted! High, thin cirrus clouds transmit incoming sunlight but trap outgoing terrestrial infrared radiation, causing net warming. Low, thick stratocumulus clouds reflect incoming solar radiation (high albedo), causing net cooling.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Geography", "Climatology", "Cloud Forcing", "Radiation Balance"],
  },

  // --- ENVIRONMENT AND ECOLOGY ---
  {
    id: "env-q1",
    year: 2021,
    subject: "Environment and Ecology",
    topic: "Biodiversity",
    subtopic: "Biodiversity",
    paper: "GS-1",
    question: "Which one of the following is a filter feeder?",
    options: [
      { id: "a", key: "A", text: "Catfish" },
      { id: "b", key: "B", text: "Octopus" },
      { id: "c", key: "C", text: "Oyster" },
      { id: "d", key: "D", text: "Pelican" },
    ],
    correctAnswer: "C",
    explanation: "Oysters are classic marine bivalve filter feeders that pump water through their gills to strain out phytoplankton and suspended organic matter, purifying estuarine water.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Environment and Ecology", "Biodiversity", "Filter Feeder", "Oyster"],
  },
  {
    id: "env-q2",
    year: 2017,
    subject: "Environment and Ecology",
    topic: "Environmental Laws, Conventions and Policies",
    subtopic: "Environmental Laws, Conventions and Policies",
    paper: "GS-1",
    question: "In India, if a species of tortoise is declared protected under Schedule I of the Wildlife (Protection) Act, 1972, what does it imply?",
    options: [
      { id: "a", key: "A", text: "It enjoys the same level of protection as the tiger." },
      { id: "b", key: "B", text: "It no longer exists in the wild, a few individuals are under captive protection; and now it is impossible to prevent its extinction." },
      { id: "c", key: "C", text: "It is endemic to a particular region of India." },
      { id: "d", key: "D", text: "Both (b) and (c) stated above are correct in this context." },
    ],
    correctAnswer: "A",
    explanation: "Schedule I of the Wildlife (Protection) Act, 1972 confers the highest level of absolute statutory protection with maximum penalties for hunting or trade, identical to that afforded to the Royal Bengal Tiger.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Environment and Ecology", "Environmental Laws", "WPA 1972", "Schedule I"],
  },

  // --- SCIENCE AND TECHNOLOGY ---
  {
    id: "sci-q1",
    year: 2019,
    subject: "Science and Technology",
    topic: "Biotechnology",
    subtopic: "Biotechnology",
    paper: "GS-1",
    question: "What is the Cas9 protein that is often mentioned in the news?",
    options: [
      { id: "a", key: "A", text: "A molecular scissors used in targeted gene editing" },
      { id: "b", key: "B", text: "A biosensor used in the accurate detection of pathogens in patients" },
      { id: "c", key: "C", text: "A gene that makes plants pest-resistant" },
      { id: "d", key: "D", text: "A herbicidal substance synthesized in genetically modified crops" },
    ],
    correctAnswer: "A",
    explanation: "CRISPR-Cas9 is a groundbreaking gene editing technology. Cas9 is an RNA-guided endonuclease enzyme functioning as 'molecular scissors' that cuts double-stranded DNA at precise target sequences.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Science and Technology", "Biotechnology", "CRISPR Cas9", "Gene Editing"],
  },
  {
    id: "sci-q2",
    year: 2022,
    subject: "Science and Technology",
    topic: "Information and Communication Technology",
    subtopic: "Information and Communication Technology",
    paper: "GS-1",
    question: "Which one of the following is the context in which the term 'qubit' is mentioned?",
    options: [
      { id: "a", key: "A", text: "Cloud Services" },
      { id: "b", key: "B", text: "Quantum Computing" },
      { id: "c", key: "C", text: "Visible Light Communication Technologies" },
      { id: "d", key: "D", text: "Wireless Communication Technologies" },
    ],
    correctAnswer: "B",
    explanation: "A qubit (quantum bit) is the basic unit of quantum information in quantum computing, exploiting quantum mechanical phenomena like superposition and entanglement.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Science and Technology", "ICT", "Quantum Computing", "Qubit"],
  },

  // --- INTERNATIONAL RELATIONS ---
  {
    id: "ir-q1",
    year: 2022,
    subject: "International Relations and Current Affairs",
    topic: "Current Affairs",
    subtopic: "Current Affairs",
    paper: "GS-1",
    question: "The term 'Levant' often heard in the news roughly corresponds to which of the following regions?",
    options: [
      { id: "a", key: "A", text: "Region along the eastern Mediterranean shores" },
      { id: "b", key: "B", text: "Region along North African shores stretching from Egypt to Morocco" },
      { id: "c", key: "C", text: "Region along Persian Gulf and Horn of Africa" },
      { id: "d", key: "D", text: "The entire coastal areas of Mediterranean Sea" },
    ],
    correctAnswer: "A",
    explanation: "The Levant is an approximate historical-geographical term referring to a large area in the Eastern Mediterranean region of Western Asia (including Syria, Lebanon, Jordan, Israel, Palestine, and parts of Turkey).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["International Relations", "Current Affairs", "Levant", "Mediterranean"],
  },

  // --- GENERAL KNOWLEDGE (1995-2010) ---
  {
    id: "gk-q1",
    year: 1996,
    subject: "General Knowledge (1995-2010)",
    topic: "General Awareness : World",
    subtopic: "General Awareness : World",
    paper: "GS-1",
    question: "Which country was the first in the world to give women the right to vote in national elections?",
    options: [
      { id: "a", key: "A", text: "United Kingdom" },
      { id: "b", key: "B", text: "United States of America" },
      { id: "c", key: "C", text: "New Zealand" },
      { id: "d", key: "D", text: "Australia" },
    ],
    correctAnswer: "C",
    explanation: "New Zealand became the first self-governing country in the world in 1893 to grant all adult women the right to vote in parliamentary elections, championed by Kate Sheppard.",
    difficulty: "Easy",
    important: false,
    conceptTags: ["General Knowledge", "World Awareness", "Women Suffrage", "New Zealand"],
  },

  // --- PRELIMS 2025 SPECIAL MODULE ---
  {
    id: "p25-q1",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    paper: "GS-1",
    question: "With reference to India's 'National Green Hydrogen Mission', consider the following statements:\n1. It aims to develop a green hydrogen production capacity of at least 5 MMT (Million Metric Tonnes) per annum by 2030.\n2. The Strategic Interventions for Green Hydrogen Transition (SIGHT) programme provides financial incentives for domestic electrolyser manufacturing.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" },
    ],
    correctAnswer: "C",
    explanation: "Both statements are correct. The National Green Hydrogen Mission targets at least 5 MMT p.a. green hydrogen capacity by 2030, supported by the SIGHT incentive scheme under MNRE.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Green Hydrogen", "SIGHT", "Renewable Energy"],
  },
];

export const STATIC_PYQS = STATIC_PYQ_DATASET;

/**
 * Retrieves all stored user questions (IndexedDB + localStorage + Static Baseline).
 */
export async function getStoredPYQs(): Promise<PYQQuestion[]> {
  if (typeof window === "undefined") return STATIC_PYQ_DATASET;

  try {
    const localRaw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_PYQS_KEY);
    if (localRaw) {
      const parsed = JSON.parse(localRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge user custom with static dataset without duplicating IDs
        const map = new Map<string, PYQQuestion>();
        STATIC_PYQ_DATASET.forEach((q) => map.set(String(q.id), q));
        parsed.forEach((q: PYQQuestion) => map.set(String(q.id), q));
        return Array.from(map.values());
      }
    }
  } catch (e) {
    console.warn("Failed to load custom PYQs from localStorage:", e);
  }

  return STATIC_PYQ_DATASET;
}

/**
 * Saves candidate uploaded PYQs into browser storage.
 */
export async function saveUploadedPYQs(questions: PYQQuestion[]): Promise<number> {
  if (typeof window === "undefined" || !Array.isArray(questions)) return 0;
  try {
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_PYQS_KEY, JSON.stringify(questions));
    return questions.length;
  } catch (e) {
    console.error("Failed to save uploaded PYQs:", e);
    throw e;
  }
}

// ============================================================================
// TAXONOMY HIERARCHY AGGREGATION HELPERS
// ============================================================================

export interface ChapterProgressStat {
  chapterId: string;
  chapterNumber: number;
  chapterName: string;
  pageNumber: number;
  totalQuestions: number;
  attemptedQuestions: number;
  correctCount: number;
  accuracy: number;
  isCompleted: boolean;
}

export interface SubjectProgressSummary {
  subjectId: string;
  subjectName: string;
  icon: string;
  color: string;
  startPage: number;
  totalChapters: number;
  totalQuestions: number;
  attemptedQuestions: number;
  accuracy: number;
  chapters: ChapterProgressStat[];
}

/**
 * Calculates complete chapter-level and subject-level statistics
 * mapped to the WhyNotUPSC 126-chapter hierarchy.
 */
export function getTaxonomyProgressSummary(
  questions: PYQQuestion[],
  attempts: PYQAttempt[]
): SubjectProgressSummary[] {
  const attemptMap = new Map<string, PYQAttempt>();
  safeArray(attempts).forEach((att) => {
    attemptMap.set(String(att.pyqId), att);
  });

  return ALL_TAXONOMY_SUBJECTS.map((subject) => {
    let subjectTotalQ = 0;
    let subjectAttemptedQ = 0;
    let subjectCorrectQ = 0;

    const chapterStats: ChapterProgressStat[] = subject.chapters.map((ch) => {
      // Find matching questions for this chapter
      const matching = questions.filter((q) => {
        const qSubj = (q.subject || "").toLowerCase();
        const qTopic = (q.topic || "").toLowerCase();
        const chName = ch.name.toLowerCase();
        const subjMatch = qSubj === subject.name.toLowerCase() || qSubj === subject.id.toLowerCase();
        const topicMatch = qTopic === chName || qTopic.includes(chName) || chName.includes(qTopic);
        return subjMatch && topicMatch;
      });

      const totalQuestions = matching.length;
      let attemptedQuestions = 0;
      let correctCount = 0;

      matching.forEach((q) => {
        const att = attemptMap.get(String(q.id));
        if (att) {
          attemptedQuestions++;
          if (att.isCorrect) correctCount++;
        }
      });

      const accuracy = calculateAccuracy(correctCount, attemptedQuestions);
      const isCompleted = totalQuestions > 0 && attemptedQuestions >= totalQuestions;

      subjectTotalQ += totalQuestions;
      subjectAttemptedQ += attemptedQuestions;
      subjectCorrectQ += correctCount;

      return {
        chapterId: ch.id,
        chapterNumber: ch.chapterNumber,
        chapterName: ch.name,
        pageNumber: ch.pageNumber,
        totalQuestions,
        attemptedQuestions,
        correctCount,
        accuracy,
        isCompleted,
      };
    });

    const subjectAccuracy = calculateAccuracy(subjectCorrectQ, subjectAttemptedQ);

    return {
      subjectId: subject.id,
      subjectName: subject.name,
      icon: subject.icon,
      color: subject.color,
      startPage: subject.startPage,
      totalChapters: subject.chapters.length,
      totalQuestions: subjectTotalQ,
      attemptedQuestions: subjectAttemptedQ,
      accuracy: subjectAccuracy,
      chapters: chapterStats,
    };
  });
}

// ============================================================================
// DATABASE ATTEMPTS & PROGRESS HELPERS
// ============================================================================

export async function getAllPYQs(): Promise<PYQQuestion[]> {
  return getStoredPYQs();
}

export async function getUserPYQAttempts(userId?: string): Promise<PYQAttempt[]> {
  if (typeof window === "undefined" || !dexieDb) return [];
  try {
    const rawAttempts = userId
      ? await dexieDb.pyq_attempts.where("userId").equals(userId).toArray()
      : await dexieDb.pyq_attempts.toArray();

    return rawAttempts.map((a) => ({
      id: a.id,
      userId: a.userId,
      pyqId: a.pyqId,
      selectedOption: a.selectedOption as "A" | "B" | "C" | "D",
      isCorrect: a.isCorrect,
      timeSpentSeconds: a.timeSpentSeconds,
      mistakeType: (a.mistakeType as MistakeType) || undefined,
      notes: a.notes,
      attemptedAt: a.attemptedAt,
    }));
  } catch (err) {
    console.warn("getUserPYQAttempts error:", err);
    return [];
  }
}

export async function recordPYQAttempt(attempt: PYQAttempt): Promise<void> {
  if (typeof window === "undefined" || !dexieDb) return;
  try {
    await dexieDb.pyq_attempts.add({
      id: attempt.id || `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: attempt.userId || "anonymous",
      pyqId: attempt.pyqId,
      selectedOption: attempt.selectedOption,
      isCorrect: attempt.isCorrect,
      timeSpentSeconds: attempt.timeSpentSeconds || 0,
      mistakeType: attempt.mistakeType,
      notes: attempt.notes,
      attemptedAt: attempt.attemptedAt || new Date().toISOString(),
    });
  } catch (err) {
    console.warn("recordPYQAttempt error:", err);
  }
}

// ============================================================================
// MISTAKE & WEAKNESS ANALYSIS ENGINE
// ============================================================================

export interface MistakeAnalysisSummary {
  totalAttempts: number;
  correctCount: number;
  wrongCount: number;
  overallAccuracy: number;
  mistakeDistribution: Record<MistakeType, number>;
  weakestTopics: WeaknessInsight[];
}

export const MISTAKE_TYPE_LABELS: Record<MistakeType, string> = {
  conceptual_error: "Conceptual Gap / Theory Confusion",
  factual_memory_loss: "Factual / Data Recall Failure",
  misread_question: "Misread Question ('NOT', 'Except', 'Incorrect')",
  extreme_word_trap: "Fell for Extreme Words ('Always', 'All', 'Never')",
  time_pressure: "Rushed under Time Pressure",
  wild_guess: "Uncalculated Wild Guess",
};

export function analyzeUserMistakes(
  attempts: PYQAttempt[],
  questions: PYQQuestion[]
): MistakeAnalysisSummary {
  const safeAttempts = safeArray(attempts);
  const qMap = new Map<string, PYQQuestion>();
  safeArray(questions).forEach((q) => qMap.set(String(q.id), q));

  let correctCount = 0;
  let wrongCount = 0;

  const distribution: Record<MistakeType, number> = {
    conceptual_error: 0,
    factual_memory_loss: 0,
    misread_question: 0,
    extreme_word_trap: 0,
    time_pressure: 0,
    wild_guess: 0,
  };

  const topicStats = new Map<
    string,
    {
      subject: string;
      topic: string;
      correct: number;
      total: number;
      mistakes: MistakeType[];
    }
  >();

  safeAttempts.forEach((attempt) => {
    const q = qMap.get(String(attempt.pyqId));
    const subject = q?.subject || "General";
    const topic = q?.topic || "General";
    const key = `${subject}::${topic}`;

    if (!topicStats.has(key)) {
      topicStats.set(key, {
        subject,
        topic,
        correct: 0,
        total: 0,
        mistakes: [],
      });
    }

    const stat = topicStats.get(key)!;
    stat.total += 1;

    if (attempt.isCorrect) {
      correctCount++;
      stat.correct += 1;
    } else {
      wrongCount++;
      const mType = attempt.mistakeType || "conceptual_error";
      distribution[mType] = (distribution[mType] || 0) + 1;
      stat.mistakes.push(mType);
    }
  });

  const totalAttempts = correctCount + wrongCount;
  const overallAccuracy = calculateAccuracy(correctCount, totalAttempts);

  const weakestTopics: WeaknessInsight[] = [];
  topicStats.forEach((stat) => {
    const acc = calculateAccuracy(stat.correct, stat.total);
    if (stat.total >= 2 && acc < 70) {
      const weaknessScore = Math.round(100 - acc);
      weakestTopics.push({
        subject: stat.subject,
        topic: stat.topic,
        weaknessScore,
        accuracyPercent: acc,
        attemptCount: stat.total,
        recentMistakes: stat.mistakes.slice(-3),
        recommendation: generateRemedialAdvice(stat.topic, stat.mistakes),
      });
    }
  });

  weakestTopics.sort((a, b) => b.weaknessScore - a.weaknessScore);

  return {
    totalAttempts,
    correctCount,
    wrongCount,
    overallAccuracy,
    mistakeDistribution: distribution,
    weakestTopics,
  };
}

function generateRemedialAdvice(topic: string, mistakes: MistakeType[]): string {
  const topMistake = mistakes[mistakes.length - 1];
  switch (topMistake) {
    case "extreme_word_trap":
      return `Target '${topic}' statements containing absolute qualifiers (all, only, invariably). Validate constitutional or statutory exceptions.`;
    case "misread_question":
      return `Double-check whether '${topic}' questions ask for 'INCORRECT' or 'NOT CORRECT' before marking options.`;
    case "factual_memory_loss":
      return `Create active recall flashcards for '${topic}' key articles, sections, numbers, and dates.`;
    default:
      return `Revise basic concepts and NCERT/standard textbook summaries for '${topic}'.`;
  }
}

// ============================================================================
// PRELIMS TRAP & ELIMINATION ENGINE
// ============================================================================

export interface TrapDiagnosis {
  hasTrap: boolean;
  trapType?: "extreme_qualifiers" | "negation_cue" | "data_inversion" | "general";
  label?: string;
  description?: string;
  eliminationTip?: string;
  advice: string;
  suspectOptionIds: string[];
}

export interface EliminationProbabilityState {
  remainingCount: number;
  calculatedProbability: number;
  riskRewardStatus: "Definite" | "Favorable (Take Guess)" | "Neutral" | "High Risk (Skip)";
  expectedValue: number;
}

const EXTREME_WORDS = [
  /\ball\b/i,
  /\balways\b/i,
  /\bnever\b/i,
  /\bonly\b/i,
  /\binvariably\b/i,
  /\bcompletely\b/i,
  /\btotally\b/i,
  /\bany\b/i,
  /\bnone\b/i,
];

export function diagnoseQuestionTraps(question: PYQQuestion): TrapDiagnosis {
  const suspectOptionIds: string[] = [];
  let extremeCount = 0;

  const isNegation =
    /\bnot correct\b/i.test(question.question) ||
    /\bincorrect\b/i.test(question.question) ||
    /\bexcept\b/i.test(question.question);

  question.options.forEach((opt) => {
    const text = opt.text;
    const hasExtreme = EXTREME_WORDS.some((regex) => regex.test(text));
    if (hasExtreme) {
      suspectOptionIds.push(opt.id);
      extremeCount++;
    }
  });

  if (extremeCount > 0) {
    return {
      hasTrap: true,
      trapType: "extreme_qualifiers",
      label: "Extreme Qualifier Trap",
      description: "Options contain absolute linguistic terms ('always', 'all', 'never', 'only').",
      eliminationTip: "In UPSC CSE, absolute qualifiers have an ~80% historical probability of being FALSE.",
      advice: `Extreme qualifiers ('always', 'all', 'never', 'only') detected in option(s) ${suspectOptionIds.join(", ")}. In UPSC CSE, statements with extreme qualifiers have an ~80% historical probability of being FALSE. Check for statutory exceptions.`,
      suspectOptionIds,
    };
  }

  if (isNegation) {
    return {
      hasTrap: true,
      trapType: "negation_cue",
      label: "Negation Cue Detected",
      description: "Question asks for 'NOT correct' or 'INCORRECT'.",
      eliminationTip: "Invert your validation mental model: eliminate statements that are factual truths.",
      advice: "Negation detected ('NOT correct' / 'INCORRECT'). Invert your validation mental model: eliminate statements that are factual truths.",
      suspectOptionIds: [],
    };
  }

  return {
    hasTrap: false,
    label: "Standard Conceptual",
    description: "No extreme linguistic markers found.",
    eliminationTip: "Apply standard syllabus conceptual frameworks.",
    advice: "No obvious linguistic trap keywords detected. Rely on standard conceptual elimination.",
    suspectOptionIds: [],
  };
}

export function calculateEliminationProbability(
  eliminatedOptionIds: Set<string>,
  totalOptionsCount: number = 4
): EliminationProbabilityState {
  const remainingCount = Math.max(1, totalOptionsCount - eliminatedOptionIds.size);
  const calculatedProbability = Math.round((1 / remainingCount) * 100);

  const pCorrect = 1 / remainingCount;
  const pIncorrect = 1 - pCorrect;
  const expectedValue = Math.round((pCorrect * 2.0 - pIncorrect * 0.66) * 100) / 100;

  let riskRewardStatus: EliminationProbabilityState["riskRewardStatus"];
  if (remainingCount === 1) {
    riskRewardStatus = "Definite";
  } else if (remainingCount === 2) {
    riskRewardStatus = "Favorable (Take Guess)";
  } else if (remainingCount === 3) {
    riskRewardStatus = "Neutral";
  } else {
    riskRewardStatus = "High Risk (Skip)";
  }

  return {
    remainingCount,
    calculatedProbability,
    riskRewardStatus,
    expectedValue,
  };
}
