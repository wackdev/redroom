import { PYQQuestion } from "../lib/core/types";

export const ECONOMY_PART2: PYQQuestion[] = [
  // ==========================================================================
  // CHAPTER 8: TAXATION (econ-8)
  // ==========================================================================
  {
    id: "econ-ch8-q212",
    year: 2022,
    subject: "Indian Economy",
    topic: "Taxation",
    chapterNumber: 8,
    paper: "GS-1",
    question: "212. Which one of the following situations best reflects “Indirect Transfers” often talked about in media recently with reference to India? (2022)",
    options: [
      { id: "a", key: "A", text: "An Indian company investing in a foreign enterprise and paying taxes to the foreign country on the profits arising out of its investment." },
      { id: "b", key: "B", text: "A foreign company investing in India and paying taxes to the country of its base on the profits arising out of its investment." },
      { id: "c", key: "C", text: "An Indian company purchases tangible assets in a foreign country and sells such assets after their value increases and transfers the proceeds to India." },
      { id: "d", key: "D", text: "A foreign company transfers shares and such shares derive their substantial value from assets located in India." }
    ],
    correctAnswer: "D",
    explanation: "Under the Income Tax Act (amended post-Vodafone case), an 'Indirect Transfer' occurs when shares of a foreign entity incorporated outside India are transferred, and those shares derive their value substantially (>50%) from underlying assets situated in India. Capital gains on such offshore transactions are made taxable in India.",
    extraEdge: "The retrospective tax amendment introduced in Finance Act 2012 was subsequently scrapped by Parliament in 2021 to provide tax certainty and settle protracted international arbitration disputes with Vodafone and Cairn Energy.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Indirect Transfers", "Capital Gains Tax", "Vodafone Dispute", "International Taxation"]
  },
  {
    id: "econ-ch8-q213",
    year: 2021,
    subject: "Indian Economy",
    topic: "Taxation",
    chapterNumber: 8,
    paper: "GS-1",
    question: "213. The money multiplier in an economy increases with which one of the following? (2021)",
    options: [
      { id: "a", key: "A", text: "Increase in the Cash Reserve Ratio in the banks" },
      { id: "b", key: "B", text: "Increase in the Statutory Liquidity Ratio in the banks" },
      { id: "c", key: "C", text: "Increase in the banking habit of the people" },
      { id: "d", key: "D", text: "Increase in the population of the country" }
    ],
    correctAnswer: "C",
    explanation: "Money multiplier (m = 1 / [c + r(1-c)]) represents the volume of broad money (M3) created per unit of central bank reserve money (M0). When people develop stronger banking habits, they hold less currency in cash (currency-deposit ratio 'c' falls) and deposit more into banks. With larger deposits, commercial banks create more loans and credit, dramatically increasing the money multiplier.",
    superHint: "Increasing CRR or SLR locks up funds as statutory reserves and reduces the loanable funds of banks, shrinking the multiplier. More banking habits = more bank deposits = more credit creation!",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Money Multiplier", "Banking Habit", "Currency-Deposit Ratio", "Credit Creation", "Reserve Ratio"]
  },
  {
    id: "econ-ch8-q214",
    year: 2018,
    subject: "Indian Economy",
    topic: "Taxation",
    chapterNumber: 8,
    paper: "GS-1",
    question: "214. Consider the following items: (2018)\n1. Cereal grains hulled\n2. Chicken eggs cooked\n3. Fish processed and canned\n4. Newspapers containing advertising material\n\nWhich of the above items is/are exempted under GST (Goods and Services Tax)?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1, 2 and 4 only" },
      { id: "d", key: "D", text: "1, 2, 3 and 4" }
    ],
    correctAnswer: "C",
    explanation: "Under the GST tariff schedules:\n1. Hulled cereal grains and unbranded staple grains are zero-rated / exempt.\n2. Cooked chicken eggs and fresh poultry produce are exempt as basic food staples.\n3. Fish processed and canned represents value-added preservation and is subject to GST.\n4. Newspapers, journals, and periodicals (irrespective of advertising) are exempt to protect freedom of press and dissemination of news.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["GST Exemptions", "Indirect Taxes", "Processed Goods vs Raw Staples", "Tax Slabs"]
  },
  {
    id: "econ-ch8-q215",
    year: 2017,
    subject: "Indian Economy",
    topic: "Taxation",
    chapterNumber: 8,
    paper: "GS-1",
    question: "215. What is/are the most likely advantages of implementing ‘Goods and Services Tax (GST)’? (2017)\n1. It will replace multiple taxes collected by multiple authorities and will thus create a single market in India.\n2. It will drastically reduce the ‘Current Account Deficit’ of India and will enable it to increase its foreign exchange reserves.\n3. It will enormously increase the growth and size of the economy of India and will enable it to overtake China in the near future.\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: GST subsumed 17 central and state indirect levies (Excise, Service Tax, VAT, Octroi, CST) under the unified banner of 'One Nation, One Tax', eliminating tax cascading and creating a common national market.\nStatement 2 is incorrect: GST is a domestic tax reform on consumption; it does not directly alter export-import dynamics or drastically reduce the Current Account Deficit.\nStatement 3 is incorrect: Claiming that GST will 'enormously increase' growth so India 'overtakes China in the near future' is an exaggerated speculative hyperbole.",
    superHint: "Watch out for extreme exaggerations in Statements 2 ('drastically reduce CAD') and 3 ('overtake China in the near future'). Such hyperbole is typical UPSC distractor drafting.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["GST Architecture", "Single Common Market", "Cascading Effect", "Indirect Tax Reforms"]
  },
  {
    id: "econ-ch8-q226",
    year: 1996,
    subject: "Indian Economy",
    topic: "Taxation",
    chapterNumber: 8,
    paper: "GS-1",
    question: "226. A redistribution of income in a country can be best brought about through: (1996)",
    options: [
      { id: "a", key: "A", text: "progressive taxation combined with progressive expenditure" },
      { id: "b", key: "B", text: "progressive taxation combined with regressive expenditure" },
      { id: "c", key: "C", text: "regressive taxation combined with regressive expenditure" },
      { id: "d", key: "D", text: "regressive taxation combined with progressive expenditure" }
    ],
    correctAnswer: "A",
    explanation: "Progressive taxation imposes higher tax rates on higher-income brackets (ability-to-pay principle). Progressive expenditure directs public spending disproportionately towards low-income households (subsidized healthcare, free school meals, direct income support, social pensions). When combined, this fiscal policy framework most effectively narrows economic inequality and redistributes national income.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Progressive Taxation", "Progressive Expenditure", "Income Redistribution", "Fiscal Federalism"]
  },

  // ==========================================================================
  // CHAPTER 9: PUBLIC FINANCE (econ-9)
  // ==========================================================================
  {
    id: "econ-ch9-q227",
    year: 2022,
    subject: "Indian Economy",
    topic: "Public Finance",
    chapterNumber: 9,
    paper: "GS-1",
    question: "227. With reference to the expenditure made by an organization or a company, which of the following statements is/are correct? (2022)\n1. Acquiring new technology is capital expenditure.\n2. Debt financing is considered capital expenditure, while equity financing is considered revenue expenditure.\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: Capital Expenditure (CapEx) creates tangible/intangible physical or productive assets that deliver multi-year benefits; purchasing technological infrastructure or software licenses qualifies as CapEx.\nStatement 2 is incorrect: Debt and equity financing are sources of FUNDS (capital receipts / liabilities / equity equity financing), NOT forms of expenditure. Debt repayment is a capital disbursement, while borrowing itself is a debt-creating capital receipt.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Capital Expenditure (CapEx)", "Revenue Expenditure", "Debt Financing", "Equity Financing", "Capital Receipts"]
  },
  {
    id: "econ-ch9-q228",
    year: 2022,
    subject: "Indian Economy",
    topic: "Public Finance",
    chapterNumber: 9,
    paper: "GS-1",
    question: "228. With reference to Indian economy, consider the following statements: (2022)\n1. A share of the household financial savings goes towards government borrowings.\n2. Dated securities issued at market related rates in auctions form a large component of internal debt.\n\nWhich of the above statements is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "C",
    explanation: "Statement 1 is correct: Household financial savings deposited in bank accounts, provident funds (EPF/PPF), postal savings, and insurance policies are heavily invested by institutional intermediaries in sovereign bonds (G-Secs), funding government borrowings.\nStatement 2 is correct: Marketable dated government securities issued through competitive auctions form the overwhelming lion's share (>75%) of the Central Government's internal public debt.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Internal Debt", "Dated Securities", "Household Financial Savings", "Government Borrowing"]
  },
  {
    id: "econ-ch9-q230",
    year: 2020,
    subject: "Indian Economy",
    topic: "Public Finance",
    chapterNumber: 9,
    paper: "GS-1",
    question: "230. In the context of the Indian economy, non-financial debt includes which of the following? (2020)\n1. Housing loans owed by households\n2. Amounts outstanding on credit cards\n3. Treasury bills\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "1 and 2 only" },
      { id: "c", key: "C", text: "3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "D",
    explanation: "Non-financial debt comprises all credit instruments issued by non-financial borrowers across the economy: households, non-financial corporations, and governments.\n- Housing loans owed by households (1) and credit card consumer debts (2) represent household non-financial debt.\n- Treasury bills and sovereign dated bonds (3) represent general government non-financial debt.\nFinancial debt, by contrast, is debt issued by banks and financial intermediaries.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Non-Financial Debt", "Household Debt", "Treasury Bills", "Public Debt"]
  },
  {
    id: "econ-ch9-q234",
    year: 2016,
    subject: "Indian Economy",
    topic: "Public Finance",
    chapterNumber: 9,
    paper: "GS-1",
    question: "234. Which of the following is/are included in the capital budget of the Government of India? (2016)\n1. Expenditure on acquisition of assets like roads, buildings, machinery, etc.\n2. Loans received from foreign governments\n3. Loans and advances granted to the States and Union Territories\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "D",
    explanation: "The Capital Budget consists of Capital Receipts and Capital Disbursements:\n- Expenditure on acquisition of physical assets like roads, machinery, defence equipment (1) = Capital Expenditure.\n- External loans and borrowings from foreign sovereigns/institutions (2) = Capital Receipts.\n- Loans and advances granted by the Centre to State/UT governments (3) = Capital Disbursements (creates an asset/claim).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Capital Budget", "Capital Receipts", "Capital Expenditure", "Union Budget"]
  },
  {
    id: "econ-ch9-q235",
    year: 2016,
    subject: "Indian Economy",
    topic: "Public Finance",
    chapterNumber: 9,
    paper: "GS-1",
    question: "235. With reference to ‘Financial Stability and Development Council’, consider the following statements: (2016)\n1. It is an organ of NITI Aayog.\n2. It is headed by the Union Finance Minister.\n3. It monitors macroprudential supervision of the economy.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "3 only" },
      { id: "c", key: "C", text: "2 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "C",
    explanation: "Statement 1 is incorrect: FSDC is an apex executive council established by the Ministry of Finance in 2010 (following Raghuram Rajan Committee recommendations), completely independent of NITI Aayog.\nStatement 2 is correct: The Union Finance Minister is the ex-officio Chairperson of the FSDC.\nStatement 3 is correct: FSDC monitors macro-prudential regulation, inter-regulatory coordination among SEBI, RBI, IRDAI, and PFRDA, financial stability, and conglomerate oversight.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["FSDC", "Financial Stability and Development Council", "Macroprudential Supervision", "Finance Minister"]
  },
  {
    id: "econ-ch9-q236",
    year: 2015,
    subject: "Indian Economy",
    topic: "Public Finance",
    chapterNumber: 9,
    paper: "GS-1",
    question: "236. With reference to the Fourteenth Finance Commission, which of the following statements is/are correct? (2015)\n1. It has increased the share of States in the central divisible pool from 32 percent to 42 percent.\n2. It has made recommendations concerning sector-specific grants.\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: The 14th Finance Commission (chaired by Dr. Y.V. Reddy) recommended a historic 10-percentage point increase in untied vertical tax devolution to states, from 32% to 42% of the net divisible pool of Union taxes.\nStatement 2 is incorrect: The 14th FC completely did away with sector-specific and scheme-specific tied grants, trusting states to allocate their enhanced unconditional untied revenue share as per local priorities.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["14th Finance Commission", "Vertical Tax Devolution", "Divisible Pool", "Fiscal Federalism"]
  },
  {
    id: "econ-ch9-q244",
    year: 2006,
    subject: "Indian Economy",
    topic: "Public Finance",
    chapterNumber: 9,
    paper: "GS-1",
    question: "244. Which one of the following statements is correct? Fiscal Responsibility and Budget Management Act (FRBMA) concerns: (2006)",
    options: [
      { id: "a", key: "A", text: "Fiscal Deficit only" },
      { id: "b", key: "B", text: "Revenue deficit only" },
      { id: "c", key: "C", text: "Both fiscal deficit and revenue deficit" },
      { id: "d", key: "D", text: "Neither fiscal deficit nor revenue deficit" }
    ],
    correctAnswer: "C",
    explanation: "The Fiscal Responsibility and Budget Management (FRBM) Act, 2003 statutory rules mandated targets for both Fiscal Deficit (to be reduced to 3% of GDP) and Revenue Deficit (mandated to be eliminated/reduced to zero). It also prohibited the RBI from subscribing to primary issuances of central government securities after 2006.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["FRBM Act 2003", "Fiscal Deficit Target", "Revenue Deficit", "Fiscal Consolidation"]
  },

  // ==========================================================================
  // CHAPTER 10: EXTERNAL SECTOR OF INDIA (econ-10)
  // ==========================================================================
  {
    id: "econ-ch10-q249",
    year: 2022,
    subject: "Indian Economy",
    topic: "External Sector of India",
    chapterNumber: 10,
    paper: "GS-1",
    question: "249. “Rapid Financing Instrument” and “Rapid Credit Facility” are related to the provisions of lending by which one of the following? (2022)",
    options: [
      { id: "a", key: "A", text: "Asian Development Bank" },
      { id: "b", key: "B", text: "International Monetary Fund" },
      { id: "c", key: "C", text: "United Nations Environment Programme Finance Initiative" },
      { id: "d", key: "D", text: "World Bank" }
    ],
    correctAnswer: "B",
    explanation: "The Rapid Financing Instrument (RFI) and Rapid Credit Facility (RCF) are emergency lending windows of the International Monetary Fund (IMF). They provide rapid, low-conditionality financial assistance to member countries encountering urgent balance-of-payments shocks, natural disasters, or commodity price collapses.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["International Monetary Fund (IMF)", "Rapid Financing Instrument", "Rapid Credit Facility", "Balance of Payments Emergency"]
  },
  {
    id: "econ-ch10-q250",
    year: 2022,
    subject: "Indian Economy",
    topic: "External Sector of India",
    chapterNumber: 10,
    paper: "GS-1",
    question: "250. With reference to the Indian economy, consider the following statements: (2022)\n1. An increase in Nominal Effective Exchange Rate (NEER) indicates the appreciation of rupee.\n2. An increase in the Real Effective Exchange Rate (REER) indicates an improvement in trade competitiveness.\n3. An increasing trend in domestic inflation relative to inflation in other countries is likely to cause an increasing divergence between NEER and REER.\n\nWhich of the statements are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "C",
    explanation: "Statement 1 is correct: NEER is a trade-weighted basket of bilateral exchange rates; an increase means the domestic currency has appreciated nominally.\nStatement 2 is incorrect: REER adjusts NEER for domestic vs foreign price differentials. An increase in REER implies that domestic prices are rising faster than trade partners, making exports relatively more expensive and foreign goods cheaper — thus deteriorating (not improving) trade competitiveness.\nStatement 3 is correct: Since REER = NEER × (Domestic Price Index / Foreign Price Index), higher domestic inflation causes REER to pull away from NEER.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["NEER", "REER", "Effective Exchange Rate", "Trade Competitiveness", "Inflation Differential"]
  },
  {
    id: "econ-ch10-q253",
    year: 2021,
    subject: "Indian Economy",
    topic: "External Sector of India",
    chapterNumber: 10,
    paper: "GS-1",
    question: "253. Consider the following: (2021)\n1. Foreign currency convertible bonds\n2. Foreign institutional investment with certain conditions\n3. Global depository receipts\n4. Non-resident external deposits\n\nWhich of the above can be included in Foreign Direct Investments?",
    options: [
      { id: "a", key: "A", text: "1, 2 and 3" },
      { id: "b", key: "B", text: "3 only" },
      { id: "c", key: "C", text: "2 and 4" },
      { id: "d", key: "D", text: "1 and 4" }
    ],
    correctAnswer: "A",
    explanation: "Foreign Direct Investment (FDI) represents equity participation or instruments convertible into equity that confer long-term control:\n- Foreign Currency Convertible Bonds (FCCBs) and Global Depository Receipts (GDRs) represent equity or claims convertible into equity shares, treated as FDI flows upon subscription/conversion.\n- FII/FPI investment in an Indian company exceeding 10% of post-issue paid-up equity is formally reclassified as FDI (Mayaram Committee guidelines).\n- Non-Resident External (NRE) deposits are banking deposits in the capital account, not equity ownership or direct investment.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["FDI vs FPI", "FCCB", "GDR", "NRE Deposits", "Foreign Investment Policy"]
  },
  {
    id: "econ-ch10-q254",
    year: 2020,
    subject: "Indian Economy",
    topic: "External Sector of India",
    chapterNumber: 10,
    paper: "GS-1",
    question: "254. With reference to the international trade of India at present, which of the following statements is/are correct? (2020)\n1. India’s merchandise exports are less than its merchandise imports.\n2. India’s imports of iron and steel, chemicals, fertilisers and machinery have decreased in recent years.\n3. India’s exports of services are more than its imports of services.\n4. India suffers from an overall trade/current account deficit.\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 and 4 only" },
      { id: "c", key: "C", text: "3 only" },
      { id: "d", key: "D", text: "1, 3 and 4 only" }
    ],
    correctAnswer: "D",
    explanation: "Statement 1 is correct: India runs a structural merchandise trade deficit because imports (crude petroleum, gold, electronics) consistently exceed merchandise exports.\nStatement 2 is incorrect: India's imports of capital machinery, steel, intermediate chemicals, and fertilizers have risen to cater to domestic industrial expansion.\nStatement 3 is correct: India is a powerhouse in software services, IT, and business consultancy, running a substantial services trade surplus.\nStatement 4 is correct: Because the goods trade deficit is larger than the services surplus + net remittances, India runs an overall Current Account Deficit (CAD).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["International Trade of India", "Merchandise Deficit", "Services Surplus", "Current Account Deficit"]
  },
  {
    id: "econ-ch10-q263",
    year: 2016,
    subject: "Indian Economy",
    topic: "External Sector of India",
    chapterNumber: 10,
    paper: "GS-1",
    question: "263. In the context of which of the following do you sometimes find the terms ‘amber box, blue box and green box’ in the news? (2016)",
    options: [
      { id: "a", key: "A", text: "WTO affairs" },
      { id: "b", key: "B", text: "SAARC affairs" },
      { id: "c", key: "C", text: "UNFCCC affairs" },
      { id: "d", key: "D", text: "India-EU negotiations on FTA" }
    ],
    correctAnswer: "A",
    explanation: "Under the World Trade Organization’s (WTO) Agreement on Agriculture (AoA), domestic agricultural support subsidies are categorized into colored boxes based on their trade-distorting impact:\n- Green Box: Non-distorting or minimally trade-distorting subsidies (R&D, pest control, decoupled income support, disaster relief); fully permitted without limits.\n- Blue Box: Subsidies with direct payments under production-limiting programs; exempt from reduction.\n- Amber Box: All trade-distorting domestic price support subsidies (e.g. MSP, input subsidies) subject to reduction commitments and de minimis caps (10% for developing nations).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["WTO Agreement on Agriculture", "Amber Box", "Green Box", "Blue Box", "Agricultural Subsidies"]
  },
  {
    id: "econ-ch10-q271",
    year: 2014,
    subject: "Indian Economy",
    topic: "External Sector of India",
    chapterNumber: 10,
    paper: "GS-1",
    question: "271. With reference to Balance of Payments, which of the following constitutes/constitute the Current Account? (2014)\n1. Balance of trade\n2. Foreign assets\n3. Balance of invisibles\n4. Special Drawing Rights\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 and 3" },
      { id: "c", key: "C", text: "1 and 3" },
      { id: "d", key: "D", text: "1, 2 and 4" }
    ],
    correctAnswer: "C",
    explanation: "The Current Account in Balance of Payments (BoP) records trade in goods and services and unrequited transfers:\n- Balance of Trade (merchandise exports minus imports) (1) = Current Account.\n- Balance of Invisibles (services, investment income, and unilateral transfers/remittances) (3) = Current Account.\n- Foreign assets (2) and Special Drawing Rights (4) alter cross-border financial claims/liabilities and belong strictly to the Capital/Financial Account.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Balance of Payments (BoP)", "Current Account", "Capital Account", "Invisibles", "Balance of Trade"]
  },

  // ==========================================================================
  // CHAPTER 11: SECURITY MARKET IN INDIA (econ-11)
  // ==========================================================================
  {
    id: "econ-ch11-q297",
    year: 2024,
    subject: "Indian Economy",
    topic: "Security Market in India",
    chapterNumber: 11,
    paper: "GS-1",
    question: "297. In India, which of the following can trade in Corporate Bonds and Government Securities? (2024)\n1. Insurance Companies\n2. Pension Funds\n3. Retail Investors\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "D",
    explanation: "1. Insurance companies are governed by IRDAI investment guidelines which permit trading in both sovereign debt and corporate debt.\n2. Pension funds under PFRDA (NPS) invest across government bonds (Scheme G) and corporate debt (Scheme C).\n3. Retail investors can trade G-Secs directly via the RBI Retail Direct Scheme and trade corporate bonds on BSE and NSE debt segments.",
    superHint: "Use the 'can anyone be reasonably prohibited?' test: In an open, deepening debt market, can the central bank or SEBI stop insurance companies, pension funds, or retail individuals from trading safe bonds? No. All three are eligible.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Government Securities (G-Secs)", "Corporate Bonds", "Retail Direct Scheme", "Debt Market", "IRDAI", "PFRDA"]
  },
  {
    id: "econ-ch11-q298",
    year: 2024,
    subject: "Indian Economy",
    topic: "Security Market in India",
    chapterNumber: 11,
    paper: "GS-1",
    question: "298. Consider the following: (2024)\n1. Exchange-Traded Funds (ETF)\n2. Motor vehicles\n3. Currency swap\n\nWhich of the above is/are considered financial instruments?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1, 2 and 3" },
      { id: "d", key: "D", text: "1 and 3 only" }
    ],
    correctAnswer: "D",
    explanation: "A financial instrument is any contract that gives rise to a financial asset of one entity and a financial liability or equity instrument of another entity.\n- Exchange-Traded Funds (ETFs) (1) are pooled investment vehicles traded on exchanges.\n- Currency swaps (3) are derivative contracts to exchange loan principal and interest payments in different currencies.\n- Motor vehicles (2) are physical durable capital/consumer goods, NOT financial instruments.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Financial Instruments", "Exchange-Traded Funds (ETF)", "Currency Swap", "Physical vs Financial Assets"]
  },
  {
    id: "econ-ch11-q300",
    year: 2023,
    subject: "Indian Economy",
    topic: "Security Market in India",
    chapterNumber: 11,
    paper: "GS-1",
    question: "300. Consider the following statements: (2023)\nStatement-I: Interest income from the deposits in Infrastructure Investment Trusts (InvITs) distributed to their investors is exempted from tax, but the dividend is taxable.\nStatement-II: InvITs are recognized as borrowers under the ‘Securitization and Reconstruction of Financial Assets and Enforcement of Security Interest Act, 2002”.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement-I and Statement-II are correct and Statement-II is the correct explanation for Statement-I" },
      { id: "b", key: "B", text: "Both Statement-I and Statement-II are correct and Statement-II is not the correct explanation for Statement-I" },
      { id: "c", key: "C", text: "Statement-I is correct but Statement-II is incorrect" },
      { id: "d", key: "D", text: "Statement-I is incorrect but Statement-II is correct" }
    ],
    correctAnswer: "D",
    explanation: "Statement-I is incorrect: Under the Income Tax Act, 1961, interest income received by unitholders from an InvIT is NOT exempt; it is treated as income from other sources and taxed at the investor's applicable slab rate. (Dividends are also taxable post-Finance Act 2020 subject to special SPV conditions).\nStatement-II is correct: InvITs and REITs are formally recognized as borrowers under the SARFAESI Act, 2002, empowering institutional debt investors and banks to enforce security interests against defaulting infrastructure trusts.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Infrastructure Investment Trusts (InvITs)", "SARFAESI Act 2002", "Taxation of InvITs", "REITs"]
  },
  {
    id: "econ-ch11-q301",
    year: 2023,
    subject: "Indian Economy",
    topic: "Security Market in India",
    chapterNumber: 11,
    paper: "GS-1",
    question: "301. Consider the following markets: (2023)\n1. Government Bond Market\n2. Call Money Market\n3. Treasury Bill Market\n4. Stock Market\n\nHow many of the above are included in capital markets?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "Only three" },
      { id: "d", key: "D", text: "All four" }
    ],
    correctAnswer: "B",
    explanation: "The financial market is segmented into the Money Market (< 1 year maturity) and the Capital Market (> 1 year long-term capital):\n- Capital Market includes: Government Bond Market (dated securities with maturities up to 40 years) (1) and Stock/Equity Market (4).\n- Money Market includes: Call Money Market (overnight to 14 days) (2) and Treasury Bill Market (91, 182, 364 days) (3).\nHence, exactly two belong to the capital market.",
    superHint: "Capital market = long-term financing (>1 year). Call money (overnight) and T-Bills (<1 year) are pure money market instruments. That leaves only Bonds and Equities.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Capital Market", "Money Market", "Treasury Bills", "Stock Market", "Government Bonds"]
  },
  {
    id: "econ-ch11-q302",
    year: 2023,
    subject: "Indian Economy",
    topic: "Security Market in India",
    chapterNumber: 11,
    paper: "GS-1",
    question: "302. In the context of finance, the term ‘beta’ refers to: (2023)",
    options: [
      { id: "a", key: "A", text: "the process of simultaneous buying and selling of an asset from different platforms" },
      { id: "b", key: "B", text: "an investment strategy of a portfolio manager to balance risk versus reward" },
      { id: "c", key: "C", text: "a type of systemic risk that arises where perfect hedging is not possible" },
      { id: "d", key: "D", text: "a numeric value that measures the fluctuations of a stock to changes in the overall stock market" }
    ],
    correctAnswer: "D",
    explanation: "In modern portfolio theory and the Capital Asset Pricing Model (CAPM), 'Beta' (β) is a quantitative co-efficient that measures the systemic risk and volatility of a security or portfolio relative to the broader market index (e.g. NIFTY or S&P 500). A beta > 1 denotes higher volatility than the benchmark, while beta < 1 indicates lower volatility.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Beta in Finance", "Systematic Risk", "Volatility", "CAPM", "Portfolio Management"]
  },
  {
    id: "econ-ch11-q312",
    year: 2007,
    subject: "Indian Economy",
    topic: "Security Market in India",
    chapterNumber: 11,
    paper: "GS-1",
    question: "312. Participatory Notes (PNs) are associated with which one of the following? (2007)",
    options: [
      { id: "a", key: "A", text: "Consolidated Fund of India" },
      { id: "b", key: "B", text: "Foreign Institutional Investors" },
      { id: "c", key: "C", text: "United Nations Development Programme" },
      { id: "d", key: "D", text: "Kyoto Protocol" }
    ],
    correctAnswer: "B",
    explanation: "Participatory Notes (P-Notes or PNs) are offshore derivative instruments issued by registered Foreign Institutional Investors (FIIs/FPIs) to overseas investors who wish to invest in the Indian stock market without undergoing direct registration with SEBI.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Participatory Notes (P-Notes)", "FIIs", "SEBI Regulations", "Offshore Derivative Instruments"]
  },

  // ==========================================================================
  // CHAPTER 12: HUMAN DEVELOPMENT AND SUSTAINABLE DEVELOPMENT (econ-12)
  // ==========================================================================
  {
    id: "econ-ch12-q319",
    year: 2023,
    subject: "Indian Economy",
    topic: "Human Development and Sustainable Development",
    chapterNumber: 12,
    paper: "GS-1",
    question: "319. Consider the following statements: (2023)\nStatement-I: India’s public sector health care system largely focuses on curative care with limited preventive, promotive and rehabilitative care.\nStatement-II: Under India’s decentralized approach to health care delivery, the States are primarily responsible for organizing health services.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement-I and Statement-II are correct and Statement-II is the correct explanation for Statement-I." },
      { id: "b", key: "B", text: "Both Statement-I and Statement-II are correct and Statement-II is not the correct explanation for Statement-I." },
      { id: "c", key: "C", text: "Statement-I is correct but Statement-II is incorrect." },
      { id: "d", key: "D", text: "Statement-I is incorrect but Statement-II is correct." }
    ],
    correctAnswer: "B",
    explanation: "Statement-I is correct: Historically, India's public health budget and hospital infrastructure have been heavily skewed towards secondary and tertiary curative interventions rather than community-level preventative and primary wellness care.\nStatement-II is correct: Under the Seventh Schedule (State List, Entry 6: 'Public health and sanitation; hospitals and dispensaries'), state governments bear primary constitutional responsibility for health administration.\nHowever, Statement-II does not explain Statement-I; curative bias stems from historical budgetary underfunding and urban hospital-centric design, not decentralization itself.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Public Health", "Curative vs Preventive Care", "Seventh Schedule", "Decentralized Healthcare"]
  },
  {
    id: "econ-ch12-q320",
    year: 2021,
    subject: "Indian Economy",
    topic: "Human Development and Sustainable Development",
    chapterNumber: 12,
    paper: "GS-1",
    question: "320. With reference to ‘Water Credit’, consider the following statements: (2021)\n1. It puts microfinance tools to work in the water and sanitation sector.\n2. It is a global initiative launched under the aegis of the World Health Organization and the World Bank.\n3. It aims to enable poor people to meet their water needs without depending on subsidies.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "C",
    explanation: "Statement 1 is correct: WaterCredit mobilizes commercial microfinance institutions to provide affordable household microloans for constructing piped water connections and sanitation toilets.\nStatement 2 is incorrect: WaterCredit was pioneered and launched by Water.org (a global NGO founded by Gary White and Matt Damon), NOT by WHO or the World Bank.\nStatement 3 is correct: It breaks reliance on charity and subsidies by establishing sustainable market-driven financial credit for WASH infrastructure.",
    superHint: "Statement 2 is a classic agency-misfit trap. WaterCredit is an initiative of Water.org, not an official World Bank / WHO agency program.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["WaterCredit", "Water.org", "Microfinance for Sanitation", "WASH", "Financial Inclusion"]
  },
  {
    id: "econ-ch12-q321",
    year: 2019,
    subject: "Indian Economy",
    topic: "Human Development and Sustainable Development",
    chapterNumber: 12,
    paper: "GS-1",
    question: "321. In a given year in India, official poverty lines are higher in some States than in others because: (2019)",
    options: [
      { id: "a", key: "A", text: "Poverty rates vary from State to State" },
      { id: "b", key: "B", text: "Price levels vary from State to State" },
      { id: "c", key: "C", text: "Gross State Product varies from State to State" },
      { id: "d", key: "D", text: "Quality of public distribution varies from State to State" }
    ],
    correctAnswer: "B",
    explanation: "Poverty line baskets (based on Tendulkar Committee methodology) are anchored to state-specific price indices and purchasing costs. Because the cost of living and consumer price levels (CPI-AL for rural and CPI-IW for urban) vary significantly across Indian states, purchasing the same nutritional basket requires different nominal rupee expenditures in different states.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Poverty Line", "Tendulkar Committee", "State-Specific Price Indices", "Cost of Living"]
  },
  {
    id: "econ-ch12-q322",
    year: 2018,
    subject: "Indian Economy",
    topic: "Human Development and Sustainable Development",
    chapterNumber: 12,
    paper: "GS-1",
    question: "322. Consider the following statements: (2018)\nHuman capital formation as a concept is better explained in terms of a process which enables:\n1. Individuals of a country to accumulate more capital.\n2. Increasing the knowledge, skill levels and capacities of the people of the country.\n3. Accumulation of tangible wealth.\n4. Accumulation of intangible wealth.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "2 and 4" },
      { id: "d", key: "D", text: "1, 3 and 4" }
    ],
    correctAnswer: "C",
    explanation: "Human capital refers to the acquired abilities, technical know-how, healthcare, and education embodied in a population.\n- Increasing knowledge, skills, and capacities (2) is the direct definition of human capital.\n- Human capital represents intangible wealth (4) that enhances future economic productivity without being a physical machine or tangible property.\nStatements 1 and 3 describe physical capital formation (machines, real estate), not human capital.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Human Capital Formation", "Intangible Wealth", "Skills and Education", "Economic Capabilities"]
  },
  {
    id: "econ-ch12-q323",
    year: 2018,
    subject: "Indian Economy",
    topic: "Human Development and Sustainable Development",
    chapterNumber: 12,
    paper: "GS-1",
    question: "323. Despite being a high saving economy, capital formation may not result in significant increase in output due to: (2018)",
    options: [
      { id: "a", key: "A", text: "weak administrative machinery" },
      { id: "b", key: "B", text: "illiteracy" },
      { id: "c", key: "C", text: "high population density" },
      { id: "d", key: "D", text: "high capital-output ratio" }
    ],
    correctAnswer: "D",
    explanation: "Under the Harrod-Domar growth model, Economic Growth Rate = Savings Rate (or Investment Rate) / Incremental Capital-Output Ratio (ICOR). The capital-output ratio measures the amount of capital required to generate one additional unit of output. If ICOR is high, it signifies capital inefficiency, project execution delays, and poor productivity, meaning even enormous savings and investment yield modest output growth.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Incremental Capital-Output Ratio (ICOR)", "Capital Formation", "Harrod-Domar Model", "Productivity"]
  },
  {
    id: "econ-ch12-q327",
    year: 2013,
    subject: "Indian Economy",
    topic: "Human Development and Sustainable Development",
    chapterNumber: 12,
    paper: "GS-1",
    question: "327. To obtain full benefits of the demographic dividend, what should India do? (2013)",
    options: [
      { id: "a", key: "A", text: "Promoting skill development" },
      { id: "b", key: "B", text: "Introducing more social security schemes" },
      { id: "c", key: "C", text: "Reducing infant mortality rate" },
      { id: "d", key: "D", text: "Privatisation of higher education" }
    ],
    correctAnswer: "A",
    explanation: "Demographic dividend is the economic growth potential that results when a population's working-age cohort (15–64 years) expands relative to dependents. To convert this demographic bulge into an economic asset rather than a demographic disaster, the youth must be equipped with market-relevant skills, vocational training, and gainful employment.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Demographic Dividend", "Skill Development", "Employability", "Human Resource Development"]
  },
  {
    id: "econ-ch12-q344",
    year: 1999,
    subject: "Indian Economy",
    topic: "Human Development and Sustainable Development",
    chapterNumber: 12,
    paper: "GS-1",
    question: "344. Persons below the poverty line in India are classified as such based on whether: (1999)",
    options: [
      { id: "a", key: "A", text: "they are entitled to a minimum prescribed food basket" },
      { id: "b", key: "B", text: "they get work for a prescribed minimum number of days in a year" },
      { id: "c", key: "C", text: "they belong to agricultural labourer household and the scheduled caste/tribe social group" },
      { id: "d", key: "D", text: "their daily wages fall below the prescribed minimum wages" }
    ],
    correctAnswer: "A",
    explanation: "Official poverty estimation in India (originating from the Task Force on Projections of Minimum Needs and Effective Consumption Demand headed by Y.K. Alagh in 1979) is determined by the cost of satisfying a minimum normative food basket defined by caloric intake (2,400 kcal in rural and 2,100 kcal in urban areas).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Poverty Line Measurement", "Y.K. Alagh Committee", "Calorie Norm", "Consumption Basket"]
  },

  // ==========================================================================
  // CHAPTER 13: IMPORTANT INDEX AND REPORTS (econ-13)
  // ==========================================================================
  {
    id: "econ-ch13-q347",
    year: 2016,
    subject: "Indian Economy",
    topic: "Important Index and Reports",
    chapterNumber: 13,
    paper: "GS-1",
    question: "347. India’s ranking in the ‘Ease of Doing Business Index’ is sometimes seen in the news. Which of the following has declared that ranking? (2016)",
    options: [
      { id: "a", key: "A", text: "Organization for Economic Cooperation and Development (OECD)" },
      { id: "b", key: "B", text: "World Economic Forum" },
      { id: "c", key: "C", text: "World Bank" },
      { id: "d", key: "D", text: "World Trade Organization (WTO)" }
    ],
    correctAnswer: "C",
    explanation: "The 'Ease of Doing Business' report and rankings were published annually by the World Bank, measuring regulatory regulations across 10 business life-cycle indicators (now replaced by the World Bank's Business Ready 'B-READY' framework).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Ease of Doing Business", "World Bank", "Business Ready (B-READY)", "Regulatory Burden"]
  },
  {
    id: "econ-ch13-q348",
    year: 2015,
    subject: "Indian Economy",
    topic: "Important Index and Reports",
    chapterNumber: 13,
    paper: "GS-1",
    question: "348. In the ‘Index of Eight Core Industries’, which one of the following is given the highest weight? (2015)",
    options: [
      { id: "a", key: "A", text: "Coal production" },
      { id: "b", key: "B", text: "Electricity generation" },
      { id: "c", key: "C", text: "Fertiliser production" },
      { id: "d", key: "D", text: "Steel production" }
    ],
    correctAnswer: "B",
    explanation: "Among the options listed, Electricity generation has the highest weight (~19.85%), followed by Steel (~17.92%), Coal (~10.33%), and Fertilizers (~2.63%). Across all eight core industries overall, Petroleum Refinery Products commands the single highest weight at 28.04%.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Index of Eight Core Industries", "Electricity Generation", "Refinery Products", "Weights in IIP"]
  },
  {
    id: "econ-ch13-q349",
    year: 2014,
    subject: "Indian Economy",
    topic: "Important Index and Reports",
    chapterNumber: 13,
    paper: "GS-1",
    question: "349. Which of the following organisations brings out the publication known as ‘World Economic Outlook’? (2014)",
    options: [
      { id: "a", key: "A", text: "The International Monetary Fund" },
      { id: "b", key: "B", text: "The United Nations Development Programme" },
      { id: "c", key: "C", text: "The World Economic Forum" },
      { id: "d", key: "D", text: "The World Bank" }
    ],
    correctAnswer: "A",
    explanation: "The 'World Economic Outlook' (WEO) is the flagship biannual publication of the International Monetary Fund (IMF), released in April and October, presenting global GDP growth forecasts and macroeconomic surveillance. (The IMF also publishes the Global Financial Stability Report).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["World Economic Outlook", "IMF", "Global Financial Stability Report", "Global Growth Projections"]
  },
  {
    id: "econ-ch13-q350",
    year: 2013,
    subject: "Indian Economy",
    topic: "Important Index and Reports",
    chapterNumber: 13,
    paper: "GS-1",
    question: "350. Disguised unemployment generally means: (2013)",
    options: [
      { id: "a", key: "A", text: "Large number of people remain unemployed" },
      { id: "b", key: "B", text: "Alternative employment is not available" },
      { id: "c", key: "C", text: "Marginal productivity of labour is zero" },
      { id: "d", key: "D", text: "Productivity of workers is low" }
    ],
    correctAnswer: "C",
    explanation: "Disguised unemployment (prevalent in peasant agriculture and traditional services) refers to a scenario where more workers are engaged than technologically required. Withdrawing surplus workers would not cause any drop in total aggregate output — hence, the marginal productivity of surplus labor is zero (or negative).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Disguised Unemployment", "Marginal Productivity of Labour", "Agricultural Overcrowding", "Arthur Lewis Model"]
  },
  {
    id: "econ-ch13-q351",
    year: 2012,
    subject: "Indian Economy",
    topic: "Important Index and Reports",
    chapterNumber: 13,
    paper: "GS-1",
    question: "351. The Multi-dimensional Poverty Index developed by ‘Oxford Poverty and Human Development Initiative’ with UNDP support covers which of the following? (2012)\n1. Deprivation of education, health, assets and services at household level.\n2. Purchasing power parity at national level.\n3. Extent of budget deficit and GDP growth rate at national level.\n\nSelect the correct answer using the codes given below:",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "A",
    explanation: "The Global Multidimensional Poverty Index (MPI) assesses acute non-income poverty across 3 equally-weighted dimensions (Health, Education, Standard of Living) comprising 10 indicators at the micro household level. It does not measure macro-level macroeconomic variables such as national PPP, budget deficits, or GDP growth.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Multidimensional Poverty Index (MPI)", "OPHI", "UNDP", "Deprivation Indicators"]
  },

  // ==========================================================================
  // CHAPTER 14: IMPORTANT CONCEPTS IN ECONOMY (econ-14)
  // ==========================================================================
  {
    id: "econ-ch14-q355",
    year: 2022,
    subject: "Indian Economy",
    topic: "Important Concepts in Economy",
    chapterNumber: 14,
    paper: "GS-1",
    question: "355. With reference to Convertible Bonds, consider the following statements: (2022)\n1. As there is an option to exchange the bond for equity, Convertible Bonds pay a lower rate of interest.\n2. The option to convert to equity affords the bondholder a degree of indexation to rising consumer prices.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "C",
    explanation: "Statement 1 is correct: Because convertible bonds come with the valuable embedded option to convert debt into equity shares, investors accept a lower coupon interest rate relative to non-convertible plain-vanilla corporate bonds.\nStatement 2 is correct: Corporate equity and nominal revenues typically expand during inflationary periods. The conversion option allows bondholders to participate in equity appreciation, providing a natural structural hedge/indexation against rising consumer prices.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Convertible Bonds", "Coupon Rates", "Inflation Hedge", "Hybrid Securities"]
  },
  {
    id: "econ-ch14-q356",
    year: 2018,
    subject: "Indian Economy",
    topic: "Important Concepts in Economy",
    chapterNumber: 14,
    paper: "GS-1",
    question: "356. If a commodity is provided free to the public by the Government, then: (2018)",
    options: [
      { id: "a", key: "A", text: "the opportunity cost is zero." },
      { id: "b", key: "B", text: "the opportunity cost is ignored." },
      { id: "c", key: "C", text: "the opportunity costs are transferred from the consumers of the product to the tax-paying public." },
      { id: "d", key: "D", text: "the opportunity cost is transferred from the consumers of the product to the Government." }
    ],
    correctAnswer: "C",
    explanation: "Opportunity cost represents the value of the next best alternative forgone. Scarcity dictates that there is no free lunch in economics ('TANSTAAFL'). When government supplies public goods or services free at the point of consumption, resource costs and alternative uses do not vanish — the economic burden and opportunity costs are merely shifted to taxpayers who fund the state exchequer.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Opportunity Cost", "Free Goods vs Public Goods", "Taxation", "Resource Allocation"]
  },
  {
    id: "econ-ch14-q357",
    year: 2014,
    subject: "Indian Economy",
    topic: "Important Concepts in Economy",
    chapterNumber: 14,
    paper: "GS-1",
    question: "357. If the interest rate is decreased in an economy, it will: (2014)",
    options: [
      { id: "a", key: "A", text: "decrease the consumption expenditure in the economy" },
      { id: "b", key: "B", text: "increase the tax collection of the Government." },
      { id: "c", key: "C", text: "Increase the investment expenditure in the economy" },
      { id: "d", key: "D", text: "increase the total savings in the economy" }
    ],
    correctAnswer: "C",
    explanation: "Lower interest rates reduce the cost of capital and borrowing for businesses. As financing becomes cheaper, previously marginal capital investment projects exceed the hurdle rate / marginal efficiency of capital (MEC), leading directly to an increase in private investment expenditure.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Interest Rate Transmission", "Investment Expenditure", "Cost of Capital", "Marginal Efficiency of Capital"]
  },
  {
    id: "econ-ch14-q358",
    year: 2013,
    subject: "Indian Economy",
    topic: "Important Concepts in Economy",
    chapterNumber: 14,
    paper: "GS-1",
    question: "358. Economic growth in country X will necessarily have to occur if: (2013)",
    options: [
      { id: "a", key: "A", text: "there is technical progress in the world economy" },
      { id: "b", key: "B", text: "there is population growth in X" },
      { id: "c", key: "C", text: "there is capital formation in X" },
      { id: "d", key: "D", text: "the volume of trade grows in the world economy" }
    ],
    correctAnswer: "C",
    explanation: "Capital formation (net additions to fixed physical capital, machinery, and infrastructure) augments the economy's production possibilities frontier and enhances labor productivity, directly and necessarily expanding domestic productive capacity and aggregate output (GDP).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Capital Formation", "Economic Growth", "Productive Capacity", "Production Possibility Frontier"]
  },
  {
    id: "econ-ch14-q368",
    year: 2011,
    subject: "Indian Economy",
    topic: "Important Concepts in Economy",
    chapterNumber: 14,
    paper: "GS-1",
    question: "368. A “closed economy” is an economy in which: (2011)",
    options: [
      { id: "a", key: "A", text: "The money supply is fully controlled" },
      { id: "b", key: "B", text: "Deficit financing takes place" },
      { id: "c", key: "C", text: "Only exports take place" },
      { id: "d", key: "D", text: "Neither exports or imports take place" }
    ],
    correctAnswer: "D",
    explanation: "In macroeconomic theory, an autarkic or closed economy is one that maintains no economic, trade, or financial interactions with the outside world — meaning total exports (X) and total imports (M) are zero (Y = C + I + G).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Closed Economy", "Autarky", "Open Economy", "Macroeconomic Identities"]
  },
  {
    id: "econ-ch14-q370",
    year: 2010,
    subject: "Indian Economy",
    topic: "Important Concepts in Economy",
    chapterNumber: 14,
    paper: "GS-1",
    question: "370. With reference to the Non-banking Financial Companies (NBFCs) in India, consider the following statements: (2010)\n1. They cannot engage in the acquisition of securities issued by the government.\n2. They cannot accept demand deposits like Savings Account.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: NBFCs routinely invest in and hold government securities for treasury and liquidity management; they are permitted to acquire sovereign paper.\nStatement 2 is correct: By statutory definition under the RBI Act, NBFCs CANNOT accept demand deposits (checking/savings accounts withdrawable on demand) and cannot issue cheques drawn on themselves.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["NBFCs vs Banks", "Demand Deposits", "G-Sec Holdings", "RBI Act 1934"]
  },
  {
    id: "econ-ch14-q375",
    year: 2009,
    subject: "Indian Economy",
    topic: "Important Concepts in Economy",
    chapterNumber: 14,
    paper: "GS-1",
    question: "375. In the context of independent India’s economy, which one of the following was the earliest event to take place? (2009)",
    options: [
      { id: "a", key: "A", text: "Nationalization of Insurance companies" },
      { id: "b", key: "B", text: "Nationalization of State Bank of India" },
      { id: "c", key: "C", text: "Enactment of Banking Regulation Act" },
      { id: "d", key: "D", text: "Introduction of First Five-Year Plan" }
    ],
    correctAnswer: "C",
    explanation: "Chronology of major post-independence economic milestones:\n1. Enactment of Banking Regulation Act: March 1949\n2. Launch of First Five-Year Plan: 1951\n3. Nationalization of State Bank of India (Imperial Bank of India): 1955\n4. Nationalization of Life Insurance companies (formation of LIC): 1956\nHence, the Banking Regulation Act (1949) was the earliest event.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Economic History of India", "Banking Regulation Act 1949", "First Five-Year Plan", "Nationalization"]
  },
  {
    id: "econ-ch14-q382",
    year: 1997,
    subject: "Indian Economy",
    topic: "Important Concepts in Economy",
    chapterNumber: 14,
    paper: "GS-1",
    question: "382. National Income is: (1997)",
    options: [
      { id: "a", key: "A", text: "Net National Product at market price" },
      { id: "b", key: "B", text: "Net National Product at factor cost" },
      { id: "c", key: "C", text: "Net Domestic Product at market price" },
      { id: "d", key: "D", text: "Net Domestic Product at factor cost" }
    ],
    correctAnswer: "B",
    explanation: "By standard national income accounting definition, National Income (NI) of a country is identical to Net National Product at factor cost (NNP at FC). It reflects total factor earnings (wages, interest, rent, and profit) accruing to normal residents of a nation.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["National Income", "NNP at Factor Cost", "Factor Earnings", "Macroeconomic Accounting"]
  }
];
