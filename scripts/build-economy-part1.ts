import { PYQQuestion } from "../lib/core/types";

export const ECONOMY_PART1: PYQQuestion[] = [
  // ==========================================================================
  // CHAPTER 1: ECONOMIC GROWTH (econ-1)
  // ==========================================================================
  {
    id: "econ-ch1-q1",
    year: 2024,
    subject: "Indian Economy",
    topic: "Economic Growth",
    chapterNumber: 1,
    paper: "GS-1",
    question: "1. With reference to the sectors of the Indian economy, consider the following pairs: (2024)\n\nEconomic activity : Sector\n1. Storage of agricultural produce : Secondary\n2. Dairy farm : Primary\n3. Mineral exploration : Tertiary\n4. Weaving cloth : Secondary\n\nHow many of the pairs given above are correctly matched?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "Only three" },
      { id: "d", key: "D", text: "All four" }
    ],
    correctAnswer: "B",
    explanation: "Pair 1 is incorrectly matched: Storage of agricultural produce belongs to the Tertiary sector (warehousing and logistics services), not manufacturing/secondary.\nPair 2 is correctly matched: Dairy farming falls under the Primary sector (direct exploitation of natural resources/livestock).\nPair 3 is incorrectly matched: Mineral exploration is an extractive activity belonging to the Primary sector.\nPair 4 is correctly matched: Weaving cloth involves processing raw yarn into fabric, which is Secondary sector (manufacturing).",
    extraEdge: "Economic activities are classified into 4 sectors: Primary (resource extraction like agriculture, forestry, mining), Secondary (industrial processing and manufacturing), Tertiary (commercial and social services like banking, logistics, trade), and Quaternary (knowledge-based research, R&D, software consultancy).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Sectors of Economy", "Primary Sector", "Secondary Sector", "Tertiary Sector", "Economic Activities"]
  },
  {
    id: "econ-ch1-q2",
    year: 2024,
    subject: "Indian Economy",
    topic: "Economic Growth",
    chapterNumber: 1,
    paper: "GS-1",
    question: "2. With reference to physical capital in Indian economy, consider the following pairs: (2024)\n\nItems : Category\n1. Farmer’s plough : Working capital\n2. Computer : Fixed capital\n3. Yarn used by the weaver : Fixed capital\n4. Petrol : Working capital\n\nHow many of the above pairs are correctly matched?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "Only three" },
      { id: "d", key: "D", text: "All four" }
    ],
    correctAnswer: "B",
    explanation: "Pair 1 is incorrectly matched: A farmer’s plough is a durable tool used repeatedly over multiple seasons; it is Fixed capital, not working capital.\nPair 2 is correctly matched: A computer is a durable capital asset used over multiple production cycles, making it Fixed capital.\nPair 3 is incorrectly matched: Yarn is a raw material consumed during production, making it Working capital, not fixed capital.\nPair 4 is correctly matched: Petrol is an operational consumable depleted in production/transportation, making it Working capital.",
    extraEdge: "Fixed capital consists of physical assets that can be used in production over many years and depreciate over time (tools, machines, buildings). Working capital refers to raw materials and money in hand that are consumed during production.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Physical Capital", "Fixed Capital", "Working Capital", "Factors of Production"]
  },
  {
    id: "econ-ch1-q3",
    year: 2018,
    subject: "Indian Economy",
    topic: "Economic Growth",
    chapterNumber: 1,
    paper: "GS-1",
    question: "3. Increase in absolute and per capita real GNP does not connote a higher level of economic development, if: (2018)",
    options: [
      { id: "a", key: "A", text: "industrial output fails to keep pace with agricultural output." },
      { id: "b", key: "B", text: "agricultural output fails to keep pace with industrial output." },
      { id: "c", key: "C", text: "poverty and unemployment increase." },
      { id: "d", key: "D", text: "imports grow faster than exports." }
    ],
    correctAnswer: "C",
    explanation: "Economic development is broader than economic growth. Economic growth measures quantitative expansion (GNP, GDP), whereas economic development reflects qualitative improvements in living standards, employment opportunities, income distribution, and poverty reduction. If poverty and unemployment rise despite GNP growth, it signifies immiserizing or unequal growth without genuine development.",
    superHint: "Economic development ≠ just money in the economy. It = well-being and basic capabilities in the hands of people. If poverty and unemployment increase, GNP growth is jobless and non-inclusive.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Economic Growth vs Development", "Poverty", "Unemployment", "Real GNP", "Inclusive Growth"]
  },
  {
    id: "econ-ch1-q4",
    year: 2011,
    subject: "Indian Economy",
    topic: "Economic Growth",
    chapterNumber: 1,
    paper: "GS-1",
    question: "4. In the context of Indian economy, consider the following statements: (2011)\n1. The growth rate of GDP has steadily increased in the last five years.\n2. The growth rate in per capita income has steadily increased in the last five years.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "D",
    explanation: "Statement 1 is incorrect: India's GDP growth rate did not steadily increase during 2006–2011; it witnessed sharp fluctuations and dipped significantly in 2008–09 due to the Global Financial Crisis.\nStatement 2 is incorrect: Per capita income growth mirrored the macro fluctuations, dipping sharply in 2008–09, and thus did not increase steadily.",
    superHint: "\"Steadily increased\" is an absolute qualifier. In real-world macroeconomic cycles, growth rates fluctuate due to external shocks, commodity price cycles, and monetary shifts. Hence, claims of uninterrupted steady rise are almost universally false.",
    difficulty: "Medium",
    important: false,
    conceptTags: ["GDP Growth Rate", "Per Capita Income", "Macro Trends", "Business Cycles"]
  },
  {
    id: "econ-ch1-q6",
    year: 2007,
    subject: "Indian Economy",
    topic: "Economic Growth",
    chapterNumber: 1,
    paper: "GS-1",
    question: "6. Which one of the following is the correct sequence in the decreasing order of contribution of different sectors to the Gross Domestic Product of India? (2007)",
    options: [
      { id: "a", key: "A", text: "Services - Industry - Agriculture" },
      { id: "b", key: "B", text: "Services - Agriculture - Industry" },
      { id: "c", key: "C", text: "Industry - Services - Agriculture" },
      { id: "d", key: "D", text: "Industry - Agriculture - Services" }
    ],
    correctAnswer: "A",
    explanation: "The contribution sequence to India's GDP/GVA in decreasing order is Services (~54–55%) > Industry (~27–28%) > Agriculture and allied sectors (~17–18%). India underwent a structural transition skipping the traditional manufacturing-dominated stage directly into a service-dominated economy.",
    extraEdge: "As per recent Economic Survey data, the Services sector contributes ~54.7% to Gross Value Added (GVA), Industry contributes ~27.6%, and Agriculture accounts for ~17.7%.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Sectoral Share in GDP", "Services Sector", "Gross Value Added (GVA)", "Structural Transformation"]
  },
  {
    id: "econ-ch1-q9",
    year: 2001,
    subject: "Indian Economy",
    topic: "Economic Growth",
    chapterNumber: 1,
    paper: "GS-1",
    question: "9. The most appropriate measure of economic growth is its: (2001)",
    options: [
      { id: "a", key: "A", text: "Gross Domestic Product of a country’s" },
      { id: "b", key: "B", text: "Net Domestic Product" },
      { id: "c", key: "C", text: "Net National Product" },
      { id: "d", key: "D", text: "Per Capita Real Income" }
    ],
    correctAnswer: "D",
    explanation: "Per Capita Real Income (NNP at factor cost adjusted for inflation and divided by total population) is the most comprehensive measure of individual economic well-being and purchasing power. Aggregate GDP or GNP does not factor in population growth or inflation distortions.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Per Capita Real Income", "Measures of Growth", "NNP at Factor Cost", "Purchasing Power"]
  },
  {
    id: "econ-ch1-q10",
    year: 2001,
    subject: "Indian Economy",
    topic: "Economic Growth",
    chapterNumber: 1,
    paper: "GS-1",
    question: "10. The term National Income represents: (2001)",
    options: [
      { id: "a", key: "A", text: "gross national product at market prices minus depreciation" },
      { id: "b", key: "B", text: "gross national product at market prices minus depreciation plus net factor income from abroad" },
      { id: "c", key: "C", text: "gross national product at market prices minus depreciation and indirect taxes plus subsidies" },
      { id: "d", key: "D", text: "gross national product at market prices minus net factor income from abroad" }
    ],
    correctAnswer: "C",
    explanation: "National Income is defined theoretically as Net National Product at factor cost (NNP at FC). Starting from GNP at market prices: NNP(FC) = GNP(MP) - Depreciation - Net Product Taxes (Indirect Taxes - Subsidies). Hence, GNP(MP) - Depreciation - Indirect Taxes + Subsidies equals National Income.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["National Income", "NNP at Factor Cost", "Depreciation", "Indirect Taxes", "Subsidies"]
  },

  // ==========================================================================
  // CHAPTER 2: PLANNING IN INDIA AND ECONOMIC REFORMS (econ-2)
  // ==========================================================================
  {
    id: "econ-ch2-q13",
    year: 2020,
    subject: "Indian Economy",
    topic: "Planning in India and Economic Reforms",
    chapterNumber: 2,
    paper: "GS-1",
    question: "13. With reference to the Indian economy after the 1991 economic liberalisation, consider the following statements: (2020)\n1. Worker productivity (rupees per worker at 2004-05 prices) increased in urban areas while it decreased in rural areas.\n2. The percentage share of rural areas in the workforce steadily increased.\n3. In rural areas, the growth in the non-farm economy increased.\n4. The growth rate in rural employment decreased.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "3 and 4 only" },
      { id: "c", key: "C", text: "3 only" },
      { id: "d", key: "D", text: "1, 2 and 4 only" }
    ],
    correctAnswer: "B",
    explanation: "According to NITI Aayog's study 'Changing Structure of Rural Economy of India (2017)':\nStatement 1 is incorrect: Worker productivity increased in BOTH rural (from ₹37,273 to ₹1,01,755) and urban areas (from ₹1,20,419 to ₹2,82,515).\nStatement 2 is incorrect: Rural share of the total workforce declined from 77.8% (1993-94) to 70.9% (2011-12) due to urbanization.\nStatement 3 is correct: Rural non-farm economy grew robustly, with non-farm activities generating nearly two-thirds of rural income.\nStatement 4 is correct: Rural employment growth slowed down and turned negative post-2004-05 despite output expansion.",
    superHint: "Look at Statement 2: \"steadily increased\" is an extreme assertion. Urbanisation pulled labor away from rural sectors, causing the rural workforce share to shrink. Eliminating 2 knocks out options A and D.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["1991 Economic Reforms", "Rural Economy", "Non-Farm Economy", "Worker Productivity", "Structural Transformation"]
  },
  {
    id: "econ-ch2-q14",
    year: 2019,
    subject: "Indian Economy",
    topic: "Planning in India and Economic Reforms",
    chapterNumber: 2,
    paper: "GS-1",
    question: "14. With reference to India’s Five-Year Plans, which of the following statements is/are correct? (2019)\n1. From the Second Five-Year Plan, there was a determined thrust towards substitution of basic and capital good industries.\n2. The Fourth Five-Year Plan adopted the objective of correcting the earlier trend of increased concentration of wealth and economic power.\n3. In the Fifth Five-Year Plan, for the first time, the financial sector was included as an integral part of the Plan.\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: The Second FYP (1956-61), based on the P.C. Mahalanobis Model, focused heavily on rapid industrialization through heavy and capital goods industries.\nStatement 2 is correct: The Fourth FYP (1969-74) explicitly adopted 'Growth with Stability' and prevention of concentration of economic power and reduction of regional disparities.\nStatement 3 is incorrect: The Fifth Plan (1974-79) focused on poverty removal ('Garibi Hatao') and self-reliance; financial sector reforms were formally integrated much later in the Ninth Plan (1997-2002).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Five-Year Plans", "Mahalanobis Model", "Fourth Plan", "Industrial Strategy"]
  },
  {
    id: "econ-ch2-q15",
    year: 2017,
    subject: "Indian Economy",
    topic: "Planning in India and Economic Reforms",
    chapterNumber: 2,
    paper: "GS-1",
    question: "15. Which of the following has/have occurred in India after its liberalisation of economic policies in 1991? (2017)\n1. The share of agriculture in GDP increased enormously.\n2. The share of India’s exports in world trade increased.\n3. FDI inflows increased.\n4. India’s foreign exchange reserves increased enormously.\n\nSelect the correct answer using the codes given below:",
    options: [
      { id: "a", key: "A", text: "1 and 4 only" },
      { id: "b", key: "B", text: "2, 3 and 4 only" },
      { id: "c", key: "C", text: "2 and 3 only" },
      { id: "d", key: "D", text: "1, 2, 3 and 4" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: The share of agriculture in GDP steadily declined from ~29% in 1991 to ~15% today.\nStatement 2 is correct: India's share of world merchandise exports increased from ~0.5% in 1990 to ~1.8% today.\nStatement 3 is correct: Foreign investment inflows (FDI & FII) grew exponentially from ~$100 million in 1990-91 to tens of billions annually.\nStatement 4 is correct: Forex reserves surged from $5.8 billion during the 1991 crisis (scarcely 3 weeks of import cover) to over $600+ billion.",
    superHint: "Statement 1 says agriculture increased enormously — this contradicts basic economic development doctrine where developing economies see the share of primary sector shrink in favor of industry and services. Eliminating 1 leaves only (b).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["1991 Liberalisation", "FDI Inflows", "Forex Reserves", "Share of Agriculture", "Export Growth"]
  },
  {
    id: "econ-ch2-q16",
    year: 2014,
    subject: "Indian Economy",
    topic: "Planning in India and Economic Reforms",
    chapterNumber: 2,
    paper: "GS-1",
    question: "16. The main objective of the 12th Five-Year Plan is: (2014)",
    options: [
      { id: "a", key: "A", text: "inclusive growth and poverty reduction." },
      { id: "b", key: "B", text: "inclusive and sustainable growth" },
      { id: "c", key: "C", text: "sustainable and inclusive growth to reduce unemployment" },
      { id: "d", key: "D", text: "faster, sustainable and more inclusive growth." }
    ],
    correctAnswer: "D",
    explanation: "The official slogan and title of the 12th Five-Year Plan (2012–2017) was 'Faster, Sustainable and More Inclusive Growth'. It was the final Five-Year Plan before the Planning Commission was replaced by NITI Aayog on January 1, 2015.",
    extraEdge: "The 11th Plan was 'Towards Faster and More Inclusive Growth', whereas the 12th Plan added the dimension of 'Sustainable'.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["12th Five-Year Plan", "Inclusive Growth", "Sustainable Development", "Planning Commission"]
  },
  {
    id: "econ-ch2-q25",
    year: 2000,
    subject: "Indian Economy",
    topic: "Planning in India and Economic Reforms",
    chapterNumber: 2,
    paper: "GS-1",
    question: "25. Economic liberalisation in India started with: (2000)",
    options: [
      { id: "a", key: "A", text: "substantial changes in industrial licensing policy" },
      { id: "b", key: "B", text: "the convertibility of Indian rupee" },
      { id: "c", key: "C", text: "doing away with procedural formalities for foreign direct investment" },
      { id: "d", key: "D", text: "significant reduction in tax rates" }
    ],
    correctAnswer: "A",
    explanation: "The landmark New Industrial Policy of July 24, 1991 initiated economic liberalisation by dismantling the 'License-Permit-Quota Raj'. It abolished industrial licensing for all projects except 18 strategic/hazardous industries (now reduced to just 4).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["1991 Economic Reforms", "Delicensing", "Industrial Policy 1991", "License Raj"]
  },
  {
    id: "econ-ch2-q30",
    year: 1996,
    subject: "Indian Economy",
    topic: "Planning in India and Economic Reforms",
    chapterNumber: 2,
    paper: "GS-1",
    question: "30. Which one of the following is correct regarding stabilization and structural adjustment as two components of the new economic policy adopted in India? (1996)",
    options: [
      { id: "a", key: "A", text: "Stabilization is a gradual, multi-step process while structural adjustment is a quick adaptation process" },
      { id: "b", key: "B", text: "Structural adjustment is a gradual multi-step process, while stabilization is a quick adaptation process" },
      { id: "c", key: "C", text: "Stabilization and structural adjustment are very similar and complimentary policies. It is difficult to separate one from the other" },
      { id: "d", key: "D", text: "Stabilization mainly deals with a set of policies which are to be implemented by the Central government while structural adjacent is to be set it motion by the State governments" }
    ],
    correctAnswer: "B",
    explanation: "Stabilization policies are short-term demand-management measures designed to rapidly arrest balance of payments crises, stabilize forex reserves, and curb high inflation (e.g., currency devaluation, emergency monetary tightening). Structural adjustment policies are long-term supply-side reforms (industrial delicensing, trade policy overhaul, privatization, financial sector modernization) that take years to transform institutional productivity.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Stabilization Measures", "Structural Adjustment", "Macroeconomic Management", "1991 Crisis"]
  },

  // ==========================================================================
  // CHAPTER 3: AGRICULTURE (econ-3)
  // ==========================================================================
  {
    id: "econ-ch3-q32",
    year: 2024,
    subject: "Indian Economy",
    topic: "Agriculture",
    chapterNumber: 3,
    paper: "GS-1",
    question: "32. With reference to the Digital India Land Records Modernisation Programme, consider the following statements: (2024)\n1. To implement the scheme, the Central Government provides 100% funding.\n2. Under the Scheme, Cadastral Maps are digitised.\n3. An initiative has been undertaken to transliterate the Records of Rights from local language to any of the languages recognized by the Constitution of India.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "D",
    explanation: "Statement 1 is correct: Revamped from April 1, 2016 as a 100% centrally-funded Central Sector Scheme under the Ministry of Rural Development.\nStatement 2 is correct: A primary component is digitizing and geo-referencing cadastral maps and integrating them with textual Records of Rights (RoR).\nStatement 3 is correct: With technical support from C-DAC Pune, land records are being transliterated into any of the 22 languages recognized under the Eighth Schedule to eliminate linguistic barriers.",
    extraEdge: "DILRMP provides the technological foundation for Unique Land Parcel Identification Numbers (ULPIN / Bhu-Aadhar) and integrates with the SVAMITVA drone survey scheme for inhabited rural areas.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["DILRMP", "Cadastral Maps", "Bhu-Aadhar", "Land Reforms", "Eighth Schedule Transliteration"]
  },
  {
    id: "econ-ch3-q33",
    year: 2023,
    subject: "Indian Economy",
    topic: "Agriculture",
    chapterNumber: 3,
    paper: "GS-1",
    question: "33. Which one of the following best describes the concept of ‘Small Farmer Large Field’? (2023)",
    options: [
      { id: "a", key: "A", text: "Resettlement of a large number of people, uprooted from their countries due to war, by giving them a large cultivable land which they cultivate collectively and share the produce" },
      { id: "b", key: "B", text: "Many marginal farmers in an area organize themselves into groups and synchronize and harmonize selected agricultural operations" },
      { id: "c", key: "C", text: "Many marginal farmers in an area together make a contract with a corporate body and surrender their land to the corporate body for a fixed term for which the corporate body makes a payment of agreed amount to the farmers" },
      { id: "d", key: "D", text: "A company extends loans, technical knowledge and material inputs to a number of small farmers in an area so that they produce the agricultural commodity required by the company for its manufacturing process and commercial production" }
    ],
    correctAnswer: "B",
    explanation: "The 'Small Farmer Large Field' (SFLF) model is a collaborative, bottom-up farming approach where smallholders and marginal farmers in contiguous areas voluntarily organize themselves into groups to synchronize operations (seed varieties, sowing dates, nutrient management, harvest, and collective bargaining) while retaining individual land ownership.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Small Farmer Large Field", "Agricultural Collectivization", "Marginal Farmers", "Farmer Producer Organizations"]
  },
  {
    id: "econ-ch3-q34",
    year: 2023,
    subject: "Indian Economy",
    topic: "Agriculture",
    chapterNumber: 3,
    paper: "GS-1",
    question: "34. Consider the following statements: (2023)\n1. The Government of India provides Minimum Support Price for niger (Guizotia abyssinica) seeds.\n2. Niger is cultivated as a Kharif crop.\n3. Some tribal people in India use niger seed oil for cooking.\n\nHow many of the above statements are correct?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All three" },
      { id: "d", key: "D", text: "None of the above" }
    ],
    correctAnswer: "C",
    explanation: "Statement 1 is correct: Nigerseed is one of the 14 Kharif crops for which the Government announces Minimum Support Price (MSP).\nStatement 2 is correct: Niger is predominantly grown as a Kharif crop (June-July to Oct-Nov) in states like Odisha, Madhya Pradesh, Maharashtra, and Chhattisgarh.\nStatement 3 is correct: Niger oil is rich in linoleic acid and is widely consumed by tribal communities for culinary and therapeutic purposes.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Niger Seed", "Kharif Crops", "Minimum Support Price (MSP)", "Tribal Agriculture"]
  },
  {
    id: "econ-ch3-q36",
    year: 2020,
    subject: "Indian Economy",
    topic: "Agriculture",
    chapterNumber: 3,
    paper: "GS-1",
    question: "36. With reference to chemical fertilisers in India, consider the following statements: (2020)\n1. At present, the retail price of chemical fertilisers is market-driven and not administered by the Government.\n2. Ammonia, which is an input of urea, is produced from natural gas.\n3. Sulphur, which is a raw material for phosphoric acid fertilizer, is a by-product of oil refineries.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "2 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: Retail prices are heavily administered/subsidized. Urea has a statutory maximum retail price (MRP) fixed by the central government, and P&K fertilizers are regulated via the Nutrient-Based Subsidy (NBS) regime.\nStatement 2 is correct: Urea production uses ammonia produced via steam reforming of methane (natural gas) in the Haber-Bosch process.\nStatement 3 is correct: Elemental sulfur recovered via hydrodesulfurization in oil refineries and gas processing is utilized to manufacture sulfuric acid and phosphoric acid (for DAP).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Chemical Fertilisers", "Urea Subsidy", "Ammonia", "Natural Gas", "Nutrient-Based Subsidy"]
  },
  {
    id: "econ-ch3-q37",
    year: 2020,
    subject: "Indian Economy",
    topic: "Agriculture",
    chapterNumber: 3,
    paper: "GS-1",
    question: "37. In India, which of the following can be considered as public investment in agriculture? (2020)\n1. Fixing Minimum Support Price for agricultural produce of all crops.\n2. Computerization of Primary Agricultural Credit Societies\n3. Social Capital development\n4. Free electricity supply to farmers\n5. Waiver of agricultural loans by the banking system\n6. Setting up cold storage facilities by the governments.\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1, 2 and 5 only" },
      { id: "b", key: "B", text: "1, 3, 4 and 5 only" },
      { id: "c", key: "C", text: "2, 3 and 6 only" },
      { id: "d", key: "D", text: "1, 2, 3, 4, 5 and 6" }
    ],
    correctAnswer: "C",
    explanation: "Public investment in agriculture refers to gross capital formation that creates lasting productive capacity and infrastructure.\n- Computerization of PACS (2), social capital/extension education (3), and cold chain storage (6) create enduring productive assets and operational efficiency.\n- In contrast, MSP (1), free electricity (4), and farm loan waivers (5) are current transfers/revenue subsidies, not capital investments.",
    superHint: "Focus on Statement 5 (loan waivers): A waiver is a revenue write-off/financial relief, not the creation of an enduring productive physical or human asset. Investment ≠ Subsidy/Freebie. Eliminating 5 leaves only (c).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Public Investment in Agriculture", "Gross Capital Formation", "Subsidies vs Investment", "PACS", "Cold Storage"]
  },
  {
    id: "econ-ch3-q38",
    year: 2020,
    subject: "Indian Economy",
    topic: "Agriculture",
    chapterNumber: 3,
    paper: "GS-1",
    question: "38. Under the Kisan Credit Card scheme, short-term credit support is given to farmers for which of the following purposes? (2020)\n1. Working capital for maintenance of farm assets\n2. Purchase of combine harvesters, tractors and mini trucks.\n3. Consumption requirements of farm households\n4. Post-harvest expense\n5. Construction of a family house and setting up a village cold storage facility.\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1, 2 and 5 only" },
      { id: "b", key: "B", text: "1, 3 and 4 only" },
      { id: "c", key: "C", text: "2, 3, 4 and 5 only" },
      { id: "d", key: "D", text: "1, 2, 3, 4 and 5" }
    ],
    correctAnswer: "B",
    explanation: "Under KCC guidelines, short-term credit encompasses:\n1. Cultivation expenses for crops,\n2. Post-harvest expenses (4),\n3. Produce marketing loan,\n4. Consumption requirements of farmer households (3),\n5. Working capital for maintenance of farm assets and allied activities (1).\nPurchasing tractors/harvesters (2) and building houses or cold storages (5) represent term loans/long-term capital investments, not short-term credit.",
    superHint: "Notice the qualifying term 'short-term credit'. Heavy machinery (tractors) and immovable infrastructure (family houses, cold storages) require multi-year long-term debt financing. Eliminate 2 and 5.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Kisan Credit Card (KCC)", "Short-Term Crop Loans", "Agricultural Credit", "NABARD"]
  },
  {
    id: "econ-ch3-q48",
    year: 2015,
    subject: "Indian Economy",
    topic: "Agriculture",
    chapterNumber: 3,
    paper: "GS-1",
    question: "48. The Fair and Remunerative Price (FRP) of sugarcane is approved by the: (2015)",
    options: [
      { id: "a", key: "A", text: "Cabinet Committee on Economic Affairs." },
      { id: "b", key: "B", text: "Commission for Agricultural Costs and Prices." },
      { id: "c", key: "C", text: "Directorate of Marketing and Inspection, Ministry of Agriculture" },
      { id: "d", key: "D", text: "Agricultural Produce Market Committee" }
    ],
    correctAnswer: "A",
    explanation: "The Fair and Remunerative Price (FRP) of sugarcane is approved by the Cabinet Committee on Economic Affairs (CCEA), chaired by the Prime Minister. It is determined on the recommendations of the Commission for Agricultural Costs and Prices (CACP) under the Sugarcane (Control) Order, 1966.",
    extraEdge: "While CACP recommends the benchmark prices for both MSP and FRP, the final statutory approval and announcement is exclusively made by CCEA.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Fair and Remunerative Price (FRP)", "Sugarcane", "CCEA", "CACP"]
  },

  // ==========================================================================
  // CHAPTER 4: INDUSTRY (econ-4)
  // ==========================================================================
  {
    id: "econ-ch4-q68",
    year: 2024,
    subject: "Indian Economy",
    topic: "Industry",
    chapterNumber: 4,
    paper: "GS-1",
    question: "68. With reference to Corporate Social Responsibility (CSR) rules in India, consider the following statements: (2024)\n1. CSR rules specify that expenditures that benefit the company directly or its employees will not be considered as CSR activities.\n2. CSR rules do not specify minimum spending on CSR activities.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: Under Section 135 of the Companies Act, 2013 and CSR Rules, activities benefiting company employees exclusively or undertaken in normal course of business do not count as CSR.\nStatement 2 is incorrect: The law mandates eligible companies to spend at least 2% of the average net profits made during the three immediately preceding financial years.",
    superHint: "CSR is Corporate *Social* Responsibility — its mandate is societal welfare outside the corporation. If there were no statutory minimum spending, mandatory CSR would be a toothless recommendation.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Corporate Social Responsibility", "Companies Act 2013", "Section 135", "Corporate Governance"]
  },
  {
    id: "econ-ch4-q69",
    year: 2023,
    subject: "Indian Economy",
    topic: "Industry",
    chapterNumber: 4,
    paper: "GS-1",
    question: "69. Consider the investments in the following assets: (2023)\n1. Brand recognition\n2. Inventory\n3. Intellectual property\n4. Mailing list of clients\n\nHow many of the above are considered intangible investments?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "Only three" },
      { id: "d", key: "D", text: "All four" }
    ],
    correctAnswer: "C",
    explanation: "Intangible assets lack physical substance but grant future economic benefits through intellectual or commercial rights.\n1. Brand recognition (intangible),\n2. Inventory (TANGIBLE - physical goods and raw materials held for sale),\n3. Intellectual property (patents, copyrights, trademarks - intangible),\n4. Mailing list of clients / customer databases (intangible).\nHence, exactly three are intangible investments.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Intangible Assets", "Tangible Assets", "Intellectual Property", "Balance Sheet"]
  },
  {
    id: "econ-ch4-q70",
    year: 2023,
    subject: "Indian Economy",
    topic: "Industry",
    chapterNumber: 4,
    paper: "GS-1",
    question: "70. Consider the following statements: (2023)\nStatement-I : India accounts for 3.2% of global export of goods.\nStatement-II : Many local companies and some foreign companies operating in India have taken advantage of India’s ‘Production-linked Incentive’ scheme.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement-I and Statement-II are correct and Statement-II is the correct explanation for Statement-I" },
      { id: "b", key: "B", text: "Both Statement-I and Statement-II are correct and Statement-II is not the correct explanation for Statement-I" },
      { id: "c", key: "C", text: "Statement-I is correct but Statement-II is incorrect" },
      { id: "d", key: "D", text: "Statement-I is incorrect but Statement-II is correct" }
    ],
    correctAnswer: "D",
    explanation: "Statement-I is incorrect: As per WTO and DGTR data, India’s share in global merchandise exports was approximately 1.8% in 2022 (not 3.2%).\nStatement-II is correct: The PLI scheme across 14 key sectors (electronics, telecom, pharma, auto) has seen major domestic and global manufacturing players (Foxconn, Dell, Samsung, Tata) investing and claiming incentives.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Global Export Share", "PLI Scheme", "Merchandise Trade", "Manufacturing in India"]
  },
  {
    id: "econ-ch4-q71",
    year: 2023,
    subject: "Indian Economy",
    topic: "Industry",
    chapterNumber: 4,
    paper: "GS-1",
    question: "71. Consider the following statements with reference to India: (2023)\n1. According to the Micro, Small and Medium Enterprises Development (MSMED) Act, 2006, the ‘medium enterprises’ are those with investments in plant and machinery between 15 crore and 25 crore.\n2. All bank loans to the Micro, Small and Medium Enterprises qualify under the priority sector.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: Under the revised 2020 MSME classification (composite criteria of investment and turnover):\n- Micro: Investment <= ₹1 Cr and Turnover <= ₹5 Cr\n- Small: Investment <= ₹10 Cr and Turnover <= ₹50 Cr\n- Medium: Investment <= ₹50 Cr and Turnover <= ₹250 Cr.\nStatement 2 is correct: Under RBI Priority Sector Lending (PSL) master directions, bank loans to MSMEs qualify under Priority Sector Lending.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["MSME Classification 2020", "MSMED Act", "Priority Sector Lending", "Turnover Criteria"]
  },
  {
    id: "econ-ch4-q73",
    year: 2020,
    subject: "Indian Economy",
    topic: "Industry",
    chapterNumber: 4,
    paper: "GS-1",
    question: "73. The term ‘West Texas Intermediate’, sometimes found in news, refers to a grade of: (2020)",
    options: [
      { id: "a", key: "A", text: "Crude oil" },
      { id: "b", key: "B", text: "Bullion" },
      { id: "c", key: "C", text: "Rare earth elements" },
      { id: "d", key: "D", text: "Uranium" }
    ],
    correctAnswer: "A",
    explanation: "West Texas Intermediate (WTI) is a premier benchmark grade of crude oil, characterized as 'light' (low density) and 'sweet' (low sulfur content < 0.24%), making it ideal for gasoline refining. Alongside Brent Crude and Dubai Crude, it serves as an international oil pricing benchmark.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["West Texas Intermediate (WTI)", "Crude Oil Benchmarks", "Brent Crude", "Energy Commodities"]
  },
  {
    id: "econ-ch4-q80",
    year: 2012,
    subject: "Indian Economy",
    topic: "Industry",
    chapterNumber: 4,
    paper: "GS-1",
    question: "80. In India, in the overall Index of Industrial Production, the Indices of Eight Core Industries have a combined weight of 37.90% (now ~40.27%). Which of the following are among those Eight Core industries? (2012)\n1. Cement\n2. Fertilizer\n3. Natural Gas\n4. Refinery products\n5. Textiles\n\nSelect the correct answer using the codes given below:",
    options: [
      { id: "a", key: "A", text: "1 and 5 only" },
      { id: "b", key: "B", text: "2, 3 and 4 only" },
      { id: "c", key: "C", text: "1, 2, 3 and 4 only" },
      { id: "d", key: "D", text: "1, 2, 3, 4 and 5" }
    ],
    correctAnswer: "C",
    explanation: "The Eight Core Industries are: Coal, Crude Oil, Natural Gas, Refinery Products, Fertilizers, Steel, Cement, and Electricity (mnemonic: CCC-F-R-E-N-S). Textiles is not part of the Eight Core Industries.",
    extraEdge: "Within the Eight Core Industries, Refinery Products has the highest weight (~28.04%), followed by Electricity (~19.85%) and Steel (~17.92%). Fertilizers has the lowest weight (~2.63%).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Eight Core Industries", "Index of Industrial Production (IIP)", "Core Infrastructure"]
  },

  // ==========================================================================
  // CHAPTER 5: INFLATION (econ-5)
  // ==========================================================================
  {
    id: "econ-ch5-q108",
    year: 2021,
    subject: "Indian Economy",
    topic: "Inflation",
    chapterNumber: 5,
    paper: "GS-1",
    question: "108. Which one of the following is likely to be the most inflationary in its effects? (2021)",
    options: [
      { id: "a", key: "A", text: "Repayment of public debt" },
      { id: "b", key: "B", text: "Borrowing from the public to finance a budget deficit" },
      { id: "c", key: "C", text: "Borrowing from the banks to finance a budget deficit" },
      { id: "d", key: "D", text: "Creation of new money to finance a budget deficit" }
    ],
    correctAnswer: "D",
    explanation: "Creation of new money (deficit financing / monetizing the deficit through the central bank) directly pumps unbacked high-powered reserve money into the banking system without any absorption of existing liquidity. This dramatically expands aggregate demand and the money supply, resulting in sharp demand-pull inflation.",
    superHint: "Which option injects entirely fresh liquidity into the system without withdrawing any money from households or financial markets? Only (d) creates brand new money.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Deficit Financing", "Monetization of Debt", "Inflationary Effects", "Money Supply"]
  },
  {
    id: "econ-ch5-q109",
    year: 2021,
    subject: "Indian Economy",
    topic: "Inflation",
    chapterNumber: 5,
    paper: "GS-1",
    question: "109. Which of the following steps is most likely to be taken at the time of an economic recession? (2021)",
    options: [
      { id: "a", key: "A", text: "Cut in tax rates accompanied by an increase in interest rate" },
      { id: "b", key: "B", text: "Increase in expenditure on public projects" },
      { id: "c", key: "C", text: "Increase in tax rates accompanied by reduction of interest rate" },
      { id: "d", key: "D", text: "Reduction of expenditure on public projects" }
    ],
    correctAnswer: "B",
    explanation: "During an economic recession, private consumption and investment drop into a liquidity trap or sluggish slump. The classic Keynesian counter-cyclical response requires the government to step up autonomous capital expenditure on public infrastructure projects to pump prime the economy, generate employment, and spark multiplier effects.",
    superHint: "During recession, public sector expenditure must expand to fill the void left by private sector contractions. Raising rates or cutting public projects would trigger deflationary collapse.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Economic Recession", "Countercyclical Fiscal Policy", "Keynesian Economics", "Public Infrastructure"]
  },
  {
    id: "econ-ch5-q110",
    year: 2021,
    subject: "Indian Economy",
    topic: "Inflation",
    chapterNumber: 5,
    paper: "GS-1",
    question: "110. With reference to the Indian economy, demand-pull inflation can be caused/increased by which of the following? (2021)\n1. Expansionary policies\n2. Fiscal stimulus\n3. Inflation-indexing wages\n4. Higher purchasing power\n5. Rising interest rates\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1, 2 and 4 only" },
      { id: "b", key: "B", text: "3, 4 and 5 only" },
      { id: "c", key: "C", text: "1, 2, 3 and 5 only" },
      { id: "d", key: "D", text: "1, 2, 3, 4 and 5" }
    ],
    correctAnswer: "A",
    explanation: "Demand-pull inflation arises when aggregate demand significantly outpaces aggregate supply ('too much money chasing too few goods').\n- Expansionary monetary policy (1), fiscal stimulus spending (2), and higher consumer purchasing power (4) all directly elevate aggregate demand.\n- Rising interest rates (5) contract liquidity and borrowing, dampening inflation.\n- Wage indexation (3) compensates for past inflation rather than initiating demand shocks.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Demand-Pull Inflation", "Expansionary Policy", "Fiscal Stimulus", "Monetary Tightening"]
  },
  {
    id: "econ-ch5-q111",
    year: 2020,
    subject: "Indian Economy",
    topic: "Inflation",
    chapterNumber: 5,
    paper: "GS-1",
    question: "111. Consider the following statements: (2020)\n1. The weightage of food in Consumer Price Index (CPI) is higher than that in Wholesale Price Index (WPI).\n2. The WPI does not capture changes in the prices of services, which CPI does.\n3. The Reserve Bank of India has now adopted WPI as its key measure of inflation and to decide on changing the key policy rates.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: Food and beverages constitute ~45.86% of the CPI (Combined) basket, compared to ~24.38% (food articles + food products) in WPI.\nStatement 2 is correct: WPI tracks only physical goods at the wholesale producer stage, completely omitting services (housing, health, transport, education), whereas CPI includes both goods and services.\nStatement 3 is incorrect: On the recommendation of the Urjit Patel Committee (2014), the RBI formally adopted CPI-Combined as its headline inflation measure for the Flexible Inflation Targeting (FIT) framework (4% ± 2%).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["CPI vs WPI", "Inflation Targeting", "Food Weightage", "Services Inflation", "RBI Monetary Policy"]
  },
  {
    id: "econ-ch5-q114",
    year: 2013,
    subject: "Indian Economy",
    topic: "Inflation",
    chapterNumber: 5,
    paper: "GS-1",
    question: "114. Consider the following statements: (2013)\n1. Inflation benefits the debtors.\n2. Inflation benefits the bond-holders.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: Inflation erodes the purchasing power of money over time. Debtors repay loans with currency that is worth less in real purchasing power terms than when borrowed, effectively reducing their real debt burden.\nStatement 2 is incorrect: Fixed-rate bondholders receive predetermined nominal coupons and face value at maturity. Inflation erodes the real yield and purchasing power of these fixed cash flows, thereby harming bondholders.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Inflation Impact on Debtors", "Bondholders", "Purchasing Power", "Real Interest Rates"]
  },

  // ==========================================================================
  // CHAPTER 6: MONEY MARKET (econ-6)
  // ==========================================================================
  {
    id: "econ-ch6-q123",
    year: 2024,
    subject: "Indian Economy",
    topic: "Money Market",
    chapterNumber: 6,
    paper: "GS-1",
    question: "123. With reference to the Indian economy, “Collateral Borrowing and Lending Obligations” are the instruments of: (2024)",
    options: [
      { id: "a", key: "A", text: "Bond market" },
      { id: "b", key: "B", text: "Forex market" },
      { id: "c", key: "C", text: "Money market" },
      { id: "d", key: "D", text: "Stock market" }
    ],
    correctAnswer: "C",
    explanation: "Collateralized Borrowing and Lending Obligations (CBLO), developed by the Clearing Corporation of India Ltd. (CCIL) and now transitioned to Triparty Repo (TREPS), are standardized, short-term money market instruments that allow banks, mutual funds, and NBFCs to borrow and lend funds against government securities as collateral.",
    extraEdge: "CBLO operates under money market regulations overseen by the RBI with maturity periods ranging from overnight up to one year.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["CBLO", "TREPS", "Money Market", "Liquidity Management", "CCIL"]
  },
  {
    id: "econ-ch6-q124",
    year: 2024,
    subject: "Indian Economy",
    topic: "Money Market",
    chapterNumber: 6,
    paper: "GS-1",
    question: "124. Consider the following statements in respect of the digital rupee: (2024)\n1. It is a sovereign currency issued by the Reserve Bank of India (RBI) in alignment with its monetary policy.\n2. It appears as a liability on the RBI’s balance sheet.\n3. It is insured against inflation by its very design.\n4. It is freely convertible against commercial bank money and cash.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "1 and 3 only" },
      { id: "c", key: "C", text: "2 and 4 only" },
      { id: "d", key: "D", text: "1, 2 and 4" }
    ],
    correctAnswer: "D",
    explanation: "Statement 1 is correct: The Digital Rupee (e₹) is a Central Bank Digital Currency (CBDC) issued by the RBI as sovereign legal tender.\nStatement 2 is correct: Like physical currency notes, CBDC is a direct claim on the central bank and recorded as a liability on the RBI's balance sheet.\nStatement 3 is incorrect: e₹ is a fiat currency and possesses the same purchasing power as cash; it is NOT immune or insured against general inflation.\nStatement 4 is correct: Digital rupee is fungible one-to-one and freely convertible against commercial bank deposits and physical currency.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Digital Rupee (e₹)", "CBDC", "RBI Balance Sheet", "Legal Tender", "Monetary Policy"]
  },
  {
    id: "econ-ch6-q126",
    year: 2020,
    subject: "Indian Economy",
    topic: "Money Market",
    chapterNumber: 6,
    paper: "GS-1",
    question: "126. “Gold Tranche” (Reserve Tranche) refers to: (2020)",
    options: [
      { id: "a", key: "A", text: "a loan system of the World Bank" },
      { id: "b", key: "B", text: "one of the operations of a Central Bank" },
      { id: "c", key: "C", text: "a credit system granted by WTO to its members" },
      { id: "d", key: "D", text: "a credit system granted by IMF to its members" }
    ],
    correctAnswer: "D",
    explanation: "The Reserve Tranche (formerly Gold Tranche) is that portion of a member country's IMF quota which is deposited in reserve assets (SDRs or foreign currencies). Member nations can draw down their Reserve Tranche unconditionally at will for balance of payments support without interest or conditionality.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Gold Tranche", "Reserve Tranche", "IMF Quota", "Balance of Payments Support"]
  },
  {
    id: "econ-ch6-q127",
    year: 2020,
    subject: "Indian Economy",
    topic: "Money Market",
    chapterNumber: 6,
    paper: "GS-1",
    question: "127. With reference to the Indian economy, consider the following statements: (2020)\n1. ‘Commercial Paper’ is a short-term unsecured promissory note.\n2. ‘Certificate of Deposit’ is a long-term instrument issued by the Reserve Bank of India to a corporation.\n3. ‘Call Money’ is a short term finance used for interbank transactions.\n4. ‘Zero-Coupon Bonds’ are the interest-bearing short term bonds issued by the Scheduled Commercial Banks to corporations.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "4 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "2, 3 and 4 only" }
    ],
    correctAnswer: "C",
    explanation: "Statement 1 is correct: Commercial Paper (CP) is an unsecured money market promissory note issued by corporations for working capital (7 days to 1 year).\nStatement 2 is incorrect: Certificates of Deposit (CDs) are short-term negotiable money market instruments issued by commercial banks and financial institutions (not RBI).\nStatement 3 is correct: Call money is overnight interbank borrowing and lending to manage daily reserve and CRR requirements.\nStatement 4 is incorrect: Zero-coupon bonds are issued at a discount and redeemed at face value; by definition they do not pay periodic interest.",
    superHint: "For S3: 'Call Money' = banks calling each other for emergency overnight funds. S4 says 'Zero-Coupon' is 'interest-bearing' — contradictory on its face! Zero coupon means NO coupon (interest).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Money Market Instruments", "Commercial Paper", "Certificate of Deposit", "Call Money", "Zero-Coupon Bonds"]
  },

  // ==========================================================================
  // CHAPTER 7: BANKING SECTOR IN INDIA (econ-7)
  // ==========================================================================
  {
    id: "econ-ch7-q138",
    year: 2024,
    subject: "Indian Economy",
    topic: "Banking Sector in India",
    chapterNumber: 7,
    paper: "GS-1",
    question: "138. With reference to the rule/rules imposed by the Reserve Bank of India while treating foreign banks, consider the following statements: (2024)\n1. There is no minimum capital requirement for wholly owned banking subsidiaries in India.\n2. For wholly owned banking subsidiaries in India, at least 50% of the board members should be Indian nationals.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "D",
    explanation: "Statement 1 is incorrect: RBI mandates a strict minimum paid-up equity capital requirement of ₹500 crore for wholly owned subsidiaries (WOS) of foreign banks in India.\nStatement 2 is incorrect: Under RBI framework, at least 50% of the directors should be Indian nationals, NRIs, or Persons of Indian Origin (PIOs), with at least one-third being resident Indians. Because PIOs and NRIs qualify, having strictly 50% Indian nationals is not mandated.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Foreign Banks", "Wholly Owned Subsidiaries (WOS)", "RBI Banking Regulations", "Board Governance"]
  },
  {
    id: "econ-ch7-q139",
    year: 2024,
    subject: "Indian Economy",
    topic: "Banking Sector in India",
    chapterNumber: 7,
    paper: "GS-1",
    question: "139. Consider the following statements: (2024)\n1. In India, Non-Banking Financial Companies can access the Liquidity Adjustment Facility window of the Reserve Bank of India.\n2. In India, Foreign Institutional Investors can hold the Government Securities (G-Secs).\n3. In India, Stock Exchanges can offer Separate trading platforms for debts.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "3 only" },
      { id: "c", key: "C", text: "1, 2 and 3" },
      { id: "d", key: "D", text: "2 and 3 only" }
    ],
    correctAnswer: "D",
    explanation: "Statement 1 is incorrect: The Liquidity Adjustment Facility (LAF) window of the RBI is restricted to scheduled commercial banks and standalone Primary Dealers (PDs). General NBFCs cannot directly borrow from the LAF window.\nStatement 2 is correct: Foreign Portfolio Investors (FPIs/FIIs) are permitted to invest in Central and State Government Securities (G-Secs and SDLs) within prescribed annual ceilings.\nStatement 3 is correct: Stock exchanges in India (BSE and NSE) operate dedicated wholesale debt and retail debt market platforms (e.g., NDS-OM integration).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Liquidity Adjustment Facility (LAF)", "NBFCs", "G-Secs", "FPI in Debt", "Debt Platforms"]
  },
  {
    id: "econ-ch7-q142",
    year: 2023,
    subject: "Indian Economy",
    topic: "Banking Sector in India",
    chapterNumber: 7,
    paper: "GS-1",
    question: "142. Which one of the following activities of the Reserve Bank of India is considered to be part of ‘sterilization’? (2023)",
    options: [
      { id: "a", key: "A", text: "Conducting ‘Open Market Operations’" },
      { id: "b", key: "B", text: "Oversight of settlement and payment systems" },
      { id: "c", key: "C", text: "Debt and cash management for the Central and State Governments" },
      { id: "d", key: "D", text: "Regulating the functions of Non-banking Financial Institutions" }
    ],
    correctAnswer: "A",
    explanation: "Sterilization is the monetary operation by which the central bank neutralizes the impact of foreign exchange interventions on the domestic money supply. When RBI buys foreign currency (dollars) to stem rupee appreciation, it releases equivalent rupees into the market. To sterilize this excess liquidity and avoid inflation, RBI sells government securities via Open Market Operations (OMOs) or Market Stabilization Scheme (MSS) bonds.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Sterilization", "Open Market Operations (OMOs)", "Forex Intervention", "Market Stabilization Scheme"]
  },
  {
    id: "econ-ch7-q144",
    year: 2023,
    subject: "Indian Economy",
    topic: "Banking Sector in India",
    chapterNumber: 7,
    paper: "GS-1",
    question: "144. Consider the following statements: (2023)\n1. The Self-Help Group (SHG) programme was originally initiated by the State Bank of India by providing microcredit to the financially deprived.\n2. In an SHG, all members of a group take responsibility for a loan that an individual member takes.\n3. The Regional Rural Banks and Scheduled Commercial Banks support SHGs.\n\nHow many of the above statements are correct?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: The SHG-Bank Linkage Programme was conceptualized and initiated by NABARD in 1992 following pilot projects by MYRADA, not the State Bank of India.\nStatement 2 is correct: SHGs function on peer monitoring and collective mutual guarantee — all members are jointly liable for loans sanctioned to individual members.\nStatement 3 is correct: Commercial Banks, RRBs, and Cooperative Banks actively participate in lending to SHGs.",
    superHint: "S1 is an institution-swap trap. Whenever you see a rural micro-finance or priority banking pioneering programme attributed to SBI or RBI, suspect NABARD.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Self-Help Groups (SHGs)", "NABARD", "SHG-Bank Linkage", "Microfinance", "Peer Guarantee"]
  },
  {
    id: "econ-ch7-q145",
    year: 2022,
    subject: "Indian Economy",
    topic: "Banking Sector in India",
    chapterNumber: 7,
    paper: "GS-1",
    question: "145. With reference to the Indian economy, consider the following statements: (2022)\n1. If the inflation is too high, the Reserve Bank of India (RBI) is likely to buy government securities.\n2. If the rupee is rapidly depreciating, RBI is likely to sell dollars in the market.\n3. If interest rates in the USA or European Union were to fall, that is likely to induce RBI to buy dollars.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: Buying government securities injects liquidity into the banking system, which fuels inflation. During high inflation, RBI SELLS securities to mop up liquidity.\nStatement 2 is correct: When the rupee depreciates rapidly, RBI sells dollars from its forex reserves to augment dollar supply in the market and stabilize the exchange rate.\nStatement 3 is correct: If US/EU rates fall, capital flows into India chasing higher yields, appreciating the rupee. To prevent overvaluation hurting exports, RBI buys dollars to absorb the inflows.",
    superHint: "For S1: Buying bonds = pumping cash into the system. If inflation is raging, why would RBI pump more cash? Illogical, so eliminate Statement 1.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["RBI Monetary Policy", "Exchange Rate Management", "Open Market Operations", "Forex Interventions"]
  },
  {
    id: "econ-ch7-q146",
    year: 2022,
    subject: "Indian Economy",
    topic: "Banking Sector in India",
    chapterNumber: 7,
    paper: "GS-1",
    question: "146. Consider the following statements: (2022)\n1. In India, credit rating agencies are regulated by the Reserve Bank of India.\n2. The rating agency popularly known as ICRA is a public limited company.\n3. Brickwork Ratings is an Indian credit rating agency.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: Credit rating agencies (CRAs) in India are regulated by the Securities and Exchange Board of India (SEBI) under SEBI (Credit Rating Agencies) Regulations, 1999, not the RBI.\nStatement 2 is correct: ICRA Ltd is an independent investment information and credit rating agency incorporated as a public limited company and listed on the BSE and NSE.\nStatement 3 is correct: Brickwork Ratings is an Indian credit rating agency registered with SEBI alongside CRISIL, CARE, and India Ratings.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Credit Rating Agencies", "SEBI Regulations", "ICRA", "Brickwork Ratings", "Financial Regulators"]
  },
  {
    id: "econ-ch7-q148",
    year: 2022,
    subject: "Indian Economy",
    topic: "Banking Sector in India",
    chapterNumber: 7,
    paper: "GS-1",
    question: "148. In India, which one of the following is responsible for maintaining price stability by controlling inflation? (2022)",
    options: [
      { id: "a", key: "A", text: "Department of Consumer Affairs" },
      { id: "b", key: "B", text: "Expenditure Management Commission" },
      { id: "c", key: "C", text: "Financial Stability and Development Council" },
      { id: "d", key: "D", text: "Reserve Bank of India" }
    ],
    correctAnswer: "D",
    explanation: "Under the amended RBI Act, 1934 and the Monetary Policy Framework Agreement, the Reserve Bank of India has the statutory mandate for maintaining price stability while keeping in mind the objective of growth, targeting a CPI inflation rate of 4% within a band of ±2%.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Reserve Bank of India", "Price Stability", "Inflation Targeting", "Monetary Policy"]
  },
  {
    id: "econ-ch7-q175",
    year: 2017,
    subject: "Indian Economy",
    topic: "Banking Sector in India",
    chapterNumber: 7,
    paper: "GS-1",
    question: "175. Which of the following statements is/are correct regarding the ‘Monetary Policy Committee (MPC)? (2017)\n1. It decides the RBI’s benchmark interest rates.\n2. It is a 12-member body including the Governor of RBI and is reconstituted every year.\n3. It functions under the chairmanship of the Union Finance Minister.\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "1 and 2 only" },
      { id: "c", key: "C", text: "3 only" },
      { id: "d", key: "D", text: "2 and 3 only" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: The primary statutory role of the MPC is setting the benchmark Policy Repo Rate to achieve inflation targets.\nStatement 2 is incorrect: MPC is a 6-member body (3 from RBI and 3 external experts appointed by the Central Government for a 4-year term).\nStatement 3 is incorrect: The MPC functions under the ex-officio chairmanship of the Governor of the Reserve Bank of India, who also has a casting vote in the event of a tie.",
    superHint: "Monetary policy is the domain of the central bank, not the Finance Ministry (which handles fiscal policy). The RBI Governor chairs the MPC, not the Finance Minister.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Monetary Policy Committee (MPC)", "Policy Repo Rate", "RBI Governor", "Central Bank Independence"]
  },
  {
    id: "econ-ch7-q181",
    year: 2015,
    subject: "Indian Economy",
    topic: "Banking Sector in India",
    chapterNumber: 7,
    paper: "GS-1",
    question: "181. ‘Basel III Accord’ or simply ‘Basel III’ often seen in the news, seeks to: (2015)",
    options: [
      { id: "a", key: "A", text: "develop national strategies for the conservation and sustainable use of biological diversity" },
      { id: "b", key: "B", text: "improve banking sector’s ability to deal with financial and economic stress and improve risk management" },
      { id: "c", key: "C", text: "reduce the greenhouse gas emissions but places a heavier burden on developed countries" },
      { id: "d", key: "D", text: "transfer technology from developed countries to poor countries to enable them to replace the use of chlorofluorocarbons in refrigeration with harmless chemicals" }
    ],
    correctAnswer: "B",
    explanation: "The Basel III Accord is an international regulatory framework developed by the Basel Committee on Banking Supervision (BCBS) at the Bank for International Settlements (BIS). It aims to strengthen bank capital requirements, introduce liquidity ratios (Liquidity Coverage Ratio - LCR, Net Stable Funding Ratio - NSFR), leverage ratios, and capital conservation buffers to prevent future banking panics.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Basel III Accord", "Capital Adequacy", "Risk Management", "Banking Regulation", "LCR"]
  }
];
