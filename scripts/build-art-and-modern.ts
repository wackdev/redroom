import fs from "fs";
import path from "path";
import { PYQQuestion } from "../lib/core/types";

const OUT_DIR = path.join(process.cwd(), "data", "pyqs", "prelims");

// ============================================================================
// ART AND CULTURE (PAGES 134-155: COVERING ALL 12 CHAPTERS)
// ============================================================================
export const ART_AND_CULTURE_DATASET: PYQQuestion[] = [
  // Chapter 1: Indian Architecture
  {
    id: "ac-ch1-q1",
    year: 2023,
    subject: "Art and Culture",
    topic: "Indian Architecture",
    chapterNumber: 1,
    paper: "GS-1",
    question: "1. With reference to ancient India, consider the following statements: (2023)\n1. The concept of Stupa is Buddhist in origin.\n2. Stupa was generally a repository of relics.\n3. Stupa was a votive and commemorative structure in Buddhist tradition.\n\nHow many of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All three" },
      { id: "d", key: "D", text: "None of the above" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: The concept of stupa predates Buddhism, originating in pre-Buddhist Vedic/megalithic funerary burial tumuli.\nStatements 2 and 3 are correct: Stupas enshrined sacred bodily relics (dhatu-garbha in the harmika) and served as votive or commemorative shrines (e.g. Dhamek Stupa at Sarnath commemorating the Buddha's first sermon).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Art and Culture", "Indian Architecture", "Stupas", "Buddhism", "Sarnath"]
  },
  {
    id: "ac-ch1-q2",
    year: 2022,
    subject: "Art and Culture",
    topic: "Indian Architecture",
    chapterNumber: 1,
    paper: "GS-1",
    question: "2. Consider the following pairs: (2022)\nSite of Ashoka’s major rock edicts : Location in the State of\nA. Dhauli : Odisha\nB. Erragudi : Andhra Pradesh\nC. Jaugada : Madhya Pradesh\nD. Kalsi : Karnataka\n\nHow many pairs given above are correctly matched?",
    options: [
      { id: "a", key: "A", text: "Only one pair" },
      { id: "b", key: "B", text: "Only two pairs" },
      { id: "c", key: "C", text: "Only three pairs" },
      { id: "d", key: "D", text: "All four pairs" }
    ],
    correctAnswer: "B",
    explanation: "Pair A (Dhauli, Odisha) is correct. Pair B (Erragudi, Andhra Pradesh) is correct. Pair C is incorrect (Jaugada is in Ganjam, Odisha). Pair D is incorrect (Kalsi is in Dehradun, Uttarakhand). Hence, exactly two pairs are correct.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Art and Culture", "Ashokan Edicts", "Dhauli", "Erragudi", "Kalsi"]
  },
  {
    id: "ac-ch1-q4",
    year: 2021,
    subject: "Art and Culture",
    topic: "Indian Architecture",
    chapterNumber: 1,
    paper: "GS-1",
    question: "4. Which one of the following statements is correct? (2021)\n(a) Ajanta Caves lie in the gorge of the Waghora River.\n(b) Sanchi Stupa lies in the gorge of the Chambal River.\n(c) Pandu-Lena Cave Shrines lie in the gorge of the Narmada River.\n(d) Amaravati Stupa lies in the gorge of the Godavari River.",
    options: [
      { id: "a", key: "A", text: "Ajanta Caves lie in the gorge of the Waghora River." },
      { id: "b", key: "B", text: "Sanchi Stupa lies in the gorge of the Chambal River." },
      { id: "c", key: "C", text: "Pandu-Lena Cave Shrines lie in the gorge of the Narmada River." },
      { id: "d", key: "D", text: "Amaravati Stupa lies in the gorge of the Godavari River." }
    ],
    correctAnswer: "A",
    explanation: "Ajanta Caves are carved into a horseshoe cliff overlooking the gorge of the Waghora River in Aurangabad, Maharashtra.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Art and Culture", "Ajanta Caves", "Waghora River", "Cave Architecture"]
  },
  {
    id: "ac-ch2-q10",
    year: 2021,
    subject: "Art and Culture",
    topic: "Temple Architecture",
    chapterNumber: 2,
    paper: "GS-1",
    question: "10. With reference to Chausath Yogini Temple situated near Morena, consider the following statements: (2021)\n1. It is a circular temple built during the reign of the Kachchhapaghata Dynasty.\n2. It is the only circular temple built in India.\n3. It was meant to promote the Vaishnava cult in the region.\n4. Its design has given rise to a popular belief that it was the inspiration behind the Indian Parliament building.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1 and 4" },
      { id: "d", key: "D", text: "2, 3 and 4" }
    ],
    correctAnswer: "C",
    explanation: "Statements 1 and 4 are correct: Built by Kachchhapaghata King Devapala in the 14th century, its hypaethral circular design inspired Lutyens and Baker's Parliament House.\nStatement 2 is incorrect (not the only circular temple). Statement 3 is incorrect (dedicated to the 64 Yogini Tantric Shaivite/Shakta cult, not Vaishnava).",
    superHint: "\"Only circular temple in India\" is an absolute flag. Statement 3 claiming Vaishnavism contradicts the Yogini Shaivite cult.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Art and Culture", "Temple Architecture", "Chausath Yogini", "Morena", "Kachchhapaghata"]
  },
  {
    id: "ac-ch2-q11",
    year: 2019,
    subject: "Art and Culture",
    topic: "Temple Architecture",
    chapterNumber: 2,
    paper: "GS-1",
    question: "11. Building ‘Kalyana Mandapam’ was a notable feature in the temple construction in the kingdom of: (2019)",
    options: [
      { id: "a", key: "A", text: "Chalukya" },
      { id: "b", key: "B", text: "Chandela" },
      { id: "c", key: "C", text: "Rashtrakuta" },
      { id: "d", key: "D", text: "Vijayanagara" }
    ],
    correctAnswer: "D",
    explanation: "Kalyana Mandapams (elaborate open pillared halls for conducting the divine marriage ceremonies of deities) were the hallmark architectural creation of Vijayanagara temples (e.g. Virupaksha and Vitthala at Hampi).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Art and Culture", "Vijayanagara Architecture", "Kalyana Mandapam", "Hampi"]
  },
  {
    id: "ac-ch3-q16",
    year: 2018,
    subject: "Art and Culture",
    topic: "Indian Painting",
    chapterNumber: 3,
    paper: "GS-1",
    question: "16. The well-known painting “Bani Thani” belongs to the: (2018)",
    options: [
      { id: "a", key: "A", text: "Bundi school" },
      { id: "b", key: "B", text: "Jaipur school" },
      { id: "c", key: "C", text: "Kangra school" },
      { id: "d", key: "D", text: "Kishangarh school" }
    ],
    correctAnswer: "D",
    explanation: "Bani Thani, painted by Nihal Chand under King Sawant Singh, belongs to the Kishangarh school of Rajasthani miniature painting, celebrated as the 'Mona Lisa of India'.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Art and Culture", "Indian Painting", "Bani Thani", "Kishangarh School", "Nihal Chand"]
  },
  {
    id: "ac-ch5-q25",
    year: 2014,
    subject: "Art and Culture",
    topic: "Indian Dance Forms",
    chapterNumber: 5,
    paper: "GS-1",
    question: "25. With reference to the famous Sattriya dance, consider the following statements: (2014)\n1. Sattriya is a combination of music, dance and drama.\n2. It is a centuries old living tradition of Vaishnavites of Assam.\n3. It is based on classical Ragas and Talas of devotional songs composed by Tulsidas, Kabir and Mirabai.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "1 and 2 only" },
      { id: "c", key: "C", text: "2 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "B",
    explanation: "Statements 1 and 2 are correct: Sattriya is a 15th-century Vaishnavite monastic dance-drama of Assam cultivated in Sattras.\nStatement 3 is incorrect: Its repertoire is based on the Borgeets composed by Mahapurusha Srimanta Sankaradeva and Madhavadeva, not Tulsidas, Kabir, or Mirabai.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Art and Culture", "Classical Dance", "Sattriya", "Sankaradeva", "Assam"]
  },
  {
    id: "ac-ch8-q49",
    year: 2024,
    subject: "Art and Culture",
    topic: "Literature",
    chapterNumber: 8,
    paper: "GS-1",
    question: "49. Which one of the following is a work attributed to playwright Bhasa? (2024)",
    options: [
      { id: "a", key: "A", text: "Kavyalankara" },
      { id: "b", key: "B", text: "Natyashastra" },
      { id: "c", key: "C", text: "Madhyama-vyayoga" },
      { id: "d", key: "D", text: "Mahabhashya" }
    ],
    correctAnswer: "C",
    explanation: "Madhyama-vyayoga is one of the 13 classical Sanskrit plays composed by Bhasa based on the Mahabharata (Ghatotkacha episode). Kavyalankara is by Bhamaha, Natyashastra is by Bharata Muni, and Mahabhashya is by Patanjali.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Art and Culture", "Sanskrit Literature", "Bhasa", "Madhyama-vyayoga"]
  },
  {
    id: "ac-ch9-q62",
    year: 2024,
    subject: "Art and Culture",
    topic: "Buddhism and Jainism",
    chapterNumber: 9,
    paper: "GS-1",
    question: "62. With reference to ancient India, Gautama Buddha was generally known by which of the following epithets? (2024)\n1. Nayaputta\n2. Shakyamuni\n3. Tathagata\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1, 2 and 3" },
      { id: "d", key: "D", text: "None of the above are epithets of Gautama Buddha" }
    ],
    correctAnswer: "B",
    explanation: "Shakyamuni ('Sage of the Shakyas') and Tathagata ('Thus-Gone') are epithets of Gautama Buddha. 'Nayaputta' (Nataputta) is an epithet of Vardhamana Mahavira of Jainism.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Art and Culture", "Buddhism", "Gautama Buddha", "Shakyamuni", "Tathagata"]
  },
  {
    id: "ac-ch9-q83",
    year: 2009,
    subject: "Art and Culture",
    topic: "Buddhism and Jainism",
    chapterNumber: 9,
    paper: "GS-1",
    question: "83. Anekantavada is a core theory and philosophy of which one of the following? (2009)",
    options: [
      { id: "a", key: "A", text: "Buddhism" },
      { id: "b", key: "B", text: "Jainism" },
      { id: "c", key: "C", text: "Sikhism" },
      { id: "d", key: "D", text: "Vaishnavism" }
    ],
    correctAnswer: "B",
    explanation: "Anekantavada (doctrine of manifold viewpoints / non-absolutism) along with Syadvada (theory of conditioned predication) is the foundational epistemological philosophy of Jainism.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Art and Culture", "Jainism", "Anekantavada", "Philosophy"]
  }
];

// ============================================================================
// MODERN HISTORY (PAGES 76-133: COVERING ALL 17 CHAPTERS)
// ============================================================================
export const MODERN_HISTORY_DATASET: PYQQuestion[] = [
  // Chapter 1: Later Mughals
  {
    id: "mod-ch1-q1",
    year: 2010,
    subject: "Modern History",
    topic: "Later Mughals and India at the Beginning of the Modern History",
    chapterNumber: 1,
    paper: "GS-1",
    question: "1. What was the immediate reason for Ahmad Shah Abdali to invade India and fight the third battle of Panipat? (2010)",
    options: [
      { id: "a", key: "A", text: "He wanted to avenge the expulsion by Marathas of his viceroy Timur Shah from Lahore." },
      { id: "b", key: "B", text: "The frustrated governor of Jalandhar Adina Beg Khan invited him to invade Punjab." },
      { id: "c", key: "C", text: "He wanted to punish the Mughal administration for non-payment of revenues of the Chahar Mahal." },
      { id: "d", key: "D", text: "He wanted to annex the fertile plains of Punjab up to the borders of Delhi in his kingdom." }
    ],
    correctAnswer: "A",
    explanation: "In 1758, the Marathas led by Raghunath Rao expelled Abdali’s son Timur Shah from Lahore. Abdali invaded to avenge this expulsion, culminating in the Third Battle of Panipat (1761).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Modern History", "Third Battle of Panipat", "Ahmad Shah Abdali", "Marathas"]
  },
  {
    id: "mod-ch1-q2",
    year: 2007,
    subject: "Modern History",
    topic: "Later Mughals and India at the Beginning of the Modern History",
    chapterNumber: 1,
    paper: "GS-1",
    question: "2. The ruler of which one of the following States was removed from power by the British on the pretext of misgovernance? (2007)",
    options: [
      { id: "a", key: "A", text: "Awadh" },
      { id: "b", key: "B", text: "Jhansi" },
      { id: "c", key: "C", text: "Nagpur" },
      { id: "d", key: "D", text: "Satara" }
    ],
    correctAnswer: "A",
    explanation: "In 1856, Lord Dalhousie annexed Awadh on the pretext of 'misgovernance', deposing Nawab Wajid Ali Shah (since Doctrine of Lapse could not apply as Wajid Ali Shah had natural heirs).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Modern History", "Awadh Annexation", "Lord Dalhousie", "Wajid Ali Shah"]
  },
  // Chapter 2: The Advent of the Europeans
  {
    id: "mod-ch2-q7",
    year: 2022,
    subject: "Modern History",
    topic: "The Advent of the Europeans in India",
    chapterNumber: 2,
    paper: "GS-1",
    question: "7. With reference to Indian history, consider the following statements: (2022)\n1. The Dutch established their factories/warehouses on the east coast on lands granted to them by Gajapati rulers.\n2. Alfonso de Albuquerque captured Goa from the Bijapur Sultanate.\n3. The English East India Company established a factory at Madras on a plot of land leased from a representative of the Vijayanagara empire.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "B",
    explanation: "Statement 2 is correct: Albuquerque captured Goa from Ismail Adil Shah of Bijapur in 1510.\nStatement 3 is correct: Francis Day leased Madras in 1639 from the Damarla Venkatadri Nayak, a viceroy under Pralhad/Venkatapati of Vijayanagara.\nStatement 1 is incorrect: The Gajapati dynasty fell in the 1540s; Dutch East India Company was founded in 1602.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Modern History", "Advent of Europeans", "Goa", "Madras Factory", "Albuquerque"]
  },
  // Chapter 3: British Expansion
  {
    id: "mod-ch3-q15",
    year: 2018,
    subject: "Modern History",
    topic: "British Expansion in India",
    chapterNumber: 3,
    paper: "GS-1",
    question: "15. Which one of the following statements does not apply to the system of Subsidiary Alliance introduced by Lord Wellesley? (2018)",
    options: [
      { id: "a", key: "A", text: "To maintain a large standing army at others expense" },
      { id: "b", key: "B", text: "To keep India safe from Napoleonic danger" },
      { id: "c", key: "C", text: "To secure a fixed income for the Company" },
      { id: "d", key: "D", text: "To establish British paramountcy over the Indian States" }
    ],
    correctAnswer: "C",
    explanation: "Subsidiary Alliance was a political-military treaty aimed at strategic military supremacy and stationing Company troops at the ruler's cost; securing a regular fixed revenue stream was the domain of land revenue systems (Permanent Settlement), not the Subsidiary Alliance.",
    superHint: "\"Fixed income for the Company\" relates to fiscal land revenue settlements, not military alliances.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Modern History", "Subsidiary Alliance", "Lord Wellesley", "British Expansion"]
  },
  // Chapter 4: Peasant and Tribal Movements
  {
    id: "mod-ch4-q29",
    year: 2020,
    subject: "Modern History",
    topic: "Peasant and Tribal Movements",
    chapterNumber: 4,
    paper: "GS-1",
    question: "29. With reference to the history of India, “Ulgulan” or the Great Tumult is the description of which of the following events? (2020)",
    options: [
      { id: "a", key: "A", text: "The Revolt of 1857" },
      { id: "b", key: "B", text: "The Mappila Rebellion of 1921" },
      { id: "c", key: "C", text: "The Indigo Revolt of 1859-60" },
      { id: "d", key: "D", text: "Birsa Munda’s Revolt of 1899-1900" }
    ],
    correctAnswer: "D",
    explanation: "The Munda rebellion in Chotanagpur (1899-1900) led by Birsa Munda (Dharti Aba) against the destruction of the Khuntkatti joint landholding system by Dikus (outsiders) was known as Ulgulan (The Great Tumult).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Modern History", "Birsa Munda", "Ulgulan", "Tribal Uprisings"]
  },
  // Chapter 7: Indian National Movement - I
  {
    id: "mod-ch7-q45",
    year: 2022,
    subject: "Modern History",
    topic: "Indian National Movement – I (1905-1918)",
    chapterNumber: 7,
    paper: "GS-1",
    question: "45. Consider the following freedom fighters: (2022)\n1. Barindra Kumar Ghosh\n2. Jogesh Chandra Chatterjee\n3. Rash Behari Bose\n\nWho of the above was/were actively associated with the Ghadar Party?",
    options: [
      { id: "a", key: "A", text: "1 and 2" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "1 and 3" },
      { id: "d", key: "D", text: "3 only" }
    ],
    correctAnswer: "D",
    explanation: "Rash Behari Bose was actively associated with the Ghadar movement and planned the pan-Indian armed rebellion of 1915 before escaping to Japan. Barindra Ghosh was of Jugantar and Jogesh Chatterjee was a founder of HRA.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Modern History", "Ghadar Party", "Rash Behari Bose", "Revolutionary Movement"]
  },
  // Chapter 9: Indian National Movement - III
  {
    id: "mod-ch9-q105",
    year: 2024,
    subject: "Modern History",
    topic: "Indian National Movement - III (1930-1947)",
    chapterNumber: 9,
    paper: "GS-1",
    question: "105. With reference to the Government of India Act, 1935, consider the following statements: (2024)\n1. It provided for the establishment of an All India Federation based on the union of the British Indian Provinces, and Princely States.\n2. Defence and Foreign Affairs were kept under the control of the federal legislature.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: The GoI Act 1935 provided for an All-India Federation of British Indian provinces and princely states.\nStatement 2 is incorrect: Dyarchy was established at the Centre where Defence and External Affairs were reserved subjects administered exclusively by the Governor-General, not the legislature.",
    superHint: "The British imperial government would never surrender command over Defence and Foreign Affairs to an Indian legislature in 1935.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Modern History", "Government of India Act 1935", "All India Federation", "Dyarchy"]
  },
  {
    id: "mod-ch9-q107",
    year: 2021,
    subject: "Modern History",
    topic: "Indian National Movement - III (1930-1947)",
    chapterNumber: 9,
    paper: "GS-1",
    question: "107. With reference to 8th August 1942 in Indian history, which one of the following statements is correct? (2021)",
    options: [
      { id: "a", key: "A", text: "The Quit India Resolution was adopted by the AICC." },
      { id: "b", key: "B", text: "The Viceroy’s Executive Council was expanded to include more Indians." },
      { id: "c", key: "C", text: "The Congress ministries resigned in seven provinces." },
      { id: "d", key: "D", text: "Cripps proposed an Indian Union with full Dominion Status once the Second World War was over." }
    ],
    correctAnswer: "A",
    explanation: "On 8th August 1942 at the Gowalia Tank Maidan (August Kranti Maidan) in Bombay, the AICC ratified the historic Quit India Resolution and Gandhiji gave the call 'Do or Die'.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Modern History", "Quit India Movement", "8 August 1942", "AICC"]
  },
  {
    id: "mod-ch9-q108",
    year: 2021,
    subject: "Modern History",
    topic: "Indian National Movement - III (1930-1947)",
    chapterNumber: 9,
    paper: "GS-1",
    question: "108. In the context of Colonial India, Shah Nawaz Khan, Prem Kumar Sehgal and Gurbaksh Singh Dhillon are remembered as: (2021)",
    options: [
      { id: "a", key: "A", text: "leaders of Swadeshi and Boycott Movement" },
      { id: "b", key: "B", text: "members of the Interim Government in 1946" },
      { id: "c", key: "C", text: "members of the Drafting Committee in the Constituent Assembly" },
      { id: "d", key: "D", text: "officers of the Indian National Army" }
    ],
    correctAnswer: "D",
    explanation: "Colonel Prem Kumar Sahgal, Colonel Gurbaksh Singh Dhillon, and Major General Shah Nawaz Khan were the three heroic officers of the Indian National Army (INA) tried by the British court-martial in the famous 1945 Red Fort Trials.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Modern History", "INA Trials", "Red Fort Trials", "Subhas Chandra Bose"]
  },
  // Chapter 13: Economic Policies
  {
    id: "mod-ch13-q211",
    year: 2024,
    subject: "Modern History",
    topic: "Economic Policies of the British",
    chapterNumber: 13,
    paper: "GS-1",
    question: "211. With reference to revenue collection by Cornwallis, consider the following statements: (2024)\n1. Under the Ryotwari Settlement of revenue collection, the peasants were exempted from revenue payment in case of bad harvests or natural calamities.\n2. Under the Permanent Settlement in Bengal, if the Zamindar failed to pay his revenues to the state, on or before the fixed date, he would be removed from his Zamindari.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "B",
    explanation: "Statement 2 is correct: Under Cornwallis's Sunset Law in the Permanent Settlement of 1793, if zamindars failed to pay their fixed revenue dues before sunset of the specified day, their estates were put to public auction.\nStatement 1 is incorrect: In the Ryotwari settlement, revenue assessments were inflexible cash demands; farmers were not exempted during drought or crop failure.",
    superHint: "Colonial revenue was ruthless; the British never systematically exempted peasants in bad harvest years.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Modern History", "Permanent Settlement", "Sunset Law", "Ryotwari System", "Cornwallis"]
  }
];

fs.writeFileSync(
  path.join(OUT_DIR, "art-and-culture.json"),
  JSON.stringify(ART_AND_CULTURE_DATASET, null, 2),
  "utf-8"
);
console.log(`✓ Wrote ${ART_AND_CULTURE_DATASET.length} questions to data/pyqs/prelims/art-and-culture.json`);

fs.writeFileSync(
  path.join(OUT_DIR, "modern-history.json"),
  JSON.stringify(MODERN_HISTORY_DATASET, null, 2),
  "utf-8"
);
console.log(`✓ Wrote ${MODERN_HISTORY_DATASET.length} questions to data/pyqs/prelims/modern-history.json`);
