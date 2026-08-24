import { MockTest } from "@/lib/core/types";

export const PRELIMS_YEARLY_MOCK_TESTS: MockTest[] = [
  {
    id: "prelims-2024-full",
    title: "UPSC Civil Services Prelims 2024 (Official GS Paper 1)",
    subject: "Full-Length Prelims (2024)",
    moduleNumber: 2024,
    moduleTitle: "UPSC CSE Prelims 2024 Official Paper Analysis",
    curriculum: "UPSC CSE Prelims GS Paper 1",
    stage: "Prelims",
    topic: "Comprehensive GS 1",
    questions: 2,
    duration: 30,
    description: "Official UPSC CSE Prelims 2024 General Studies Paper 1 containing Polity, Modern History, Macroeconomics, Environment, Space, and International Relations.",
    marksPerQuestion: 2,
    negativeMarking: 0.66,
    difficulty: "High",
    questionList: [
      {
        id: "p24-q1",
        question: "With reference to the 'Finance Commission of India', consider the following statements:\n1. The 16th Finance Commission was constituted under the chairmanship of Dr. Arvind Panagariya.\n2. The recommendations of the Finance Commission regarding devolution of taxes are binding on the Union Government under Article 281.\n3. The Finance Commission is mandated to recommend measures to augment the Consolidated Fund of a State to supplement the resources of the Panchayats.\nWhich of the statements given above are correct?",
        options: [
          { id: "A", key: "A", text: "1 and 2 only" },
          { id: "B", key: "B", text: "2 and 3 only" },
          { id: "C", key: "C", text: "1 and 3 only" },
          { id: "D", key: "D", text: "1, 2 and 3" }
        ],
        answer: "C",
        explanation: "Statement 1 is correct (16th FC chaired by Dr. Arvind Panagariya). Statement 2 is incorrect (Finance Commission recommendations under Art 280/281 are advisory in nature, not legally binding, though convention gives them great weight). Statement 3 is correct (Article 280(3)(bb) added by 73rd CAA).",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. 16th Finance Commission was constituted on December 31, 2023, chaired by Dr. Arvind Panagariya (former Vice-Chairman, NITI Aayog).",
            "Statement 2": "Incorrect. Article 281 requires the President to lay recommendations before Parliament with an explanatory memorandum; its recommendations are purely advisory and not legally binding.",
            "Statement 3": "Correct. Article 280(3)(bb) mandates recommendations to augment state consolidated funds for Panchayats based on State Finance Commission recommendations."
          },
          elimination_technique: "Eliminate Statement 2 immediately: Constitutional bodies like the Finance Commission give advisory recommendations; no constitutional court can issue a writ of mandamus compelling implementation.",
          concept_takeaway: "Article 280 (Finance Commission) is a quasi-judicial body balancing vertical and horizontal fiscal federalism.",
          reference_sources: ["UPSC CSE Prelims 2024 Paper 1", "Indian Polity by M. Laxmikanth (Chapter on Finance Commission)"]
        },
        subject: "Polity",
        topic: "Constitutional Bodies & Fiscal Federalism",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate"
      },
      {
        id: "p24-q2",
        question: "Consider the following strategic straits and their connecting water bodies:\n1. Strait of Hormuz : Persian Gulf and Gulf of Oman\n2. Bab-el-Mandeb : Red Sea and Gulf of Aden\n3. Strait of Malacca : Andaman Sea and South China Sea\n4. Kerch Strait : Black Sea and Sea of Azov\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", key: "A", text: "Only one pair" },
          { id: "B", key: "B", text: "Only two pairs" },
          { id: "C", key: "C", text: "Only three pairs" },
          { id: "D", key: "D", text: "All four pairs" }
        ],
        answer: "D",
        explanation: "All four pairs are correctly matched strategic maritime chokepoints frequently tested in UPSC Prelims.",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1 (Hormuz)": "Correct. Connects Persian Gulf to Gulf of Oman and Arabian Sea (critical for 21% of global petroleum liquids).",
            "Pair 2 (Bab-el-Mandeb)": "Correct. Connects Red Sea to Gulf of Aden (Houthi maritime tension zone).",
            "Pair 3 (Malacca)": "Correct. Connects Andaman Sea (Indian Ocean) to South China Sea (Pacific Ocean).",
            "Pair 4 (Kerch)": "Correct. Connects Black Sea to Sea of Azov (Crimean Bridge location)."
          },
          elimination_technique: "Recognize that global geopolitical conflicts (Red Sea attacks, Ukraine conflict in Sea of Azov, Indo-Pacific Malacca dilemma) highlight these exact 4 maritime straits.",
          concept_takeaway: "Chokepoints in maritime geography dictate global supply chains and naval strategy.",
          reference_sources: ["UPSC CSE Prelims 2024 Paper 1", "Oxford School Atlas"]
        },
        subject: "Geography",
        topic: "World Maritime Geography & Strategic Straits",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "Moderate"
      }
    ]
  },
  {
    id: "prelims-2023-full",
    title: "UPSC Civil Services Prelims 2023 (Official GS Paper 1)",
    subject: "Full-Length Prelims (2023)",
    moduleNumber: 2023,
    moduleTitle: "UPSC CSE Prelims 2023 Elimination & Pair Matrix",
    curriculum: "UPSC CSE Prelims GS Paper 1",
    stage: "Prelims",
    topic: "Comprehensive GS 1",
    questions: 2,
    duration: 30,
    description: "Official UPSC CSE Prelims 2023 Paper introducing the 'How many pairs are correct' format, covering Ancient History, Capital Goods, Central Bank Digital Currency, and Green Hydrogen.",
    marksPerQuestion: 2,
    negativeMarking: 0.66,
    difficulty: "High",
    questionList: [
      {
        id: "p23-q1",
        question: "With reference to the 'Central Bank Digital Currency' (CBDC / Digital Rupee), consider the following statements:\n1. It is a legal tender issued by the Reserve Bank of India in digital form.\n2. It appears as a liability on the balance sheet of the Reserve Bank of India.\n3. It is insured against inflation by guaranteeing an interest payment identical to the RBI repo rate.\nWhich of the statements given above are correct?",
        options: [
          { id: "A", key: "A", text: "1 and 2 only" },
          { id: "B", key: "B", text: "2 and 3 only" },
          { id: "C", key: "C", text: "1 and 3 only" },
          { id: "D", key: "D", text: "1, 2 and 3" }
        ],
        answer: "A",
        explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect because Central Bank Digital Currency (CBDC) is designed to be non-interest-bearing physical cash equivalent in digital form to prevent disintermediation of commercial banks.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Under the amended RBI Act 1934, e-Rupee is sovereign legal tender.",
            "Statement 2": "Correct. Like physical banknotes, CBDC represents a direct sovereign liability on the central bank's balance sheet.",
            "Statement 3": "Incorrect. e-Rupee does NOT pay interest. If CBDC bore interest, citizens would withdraw all commercial bank deposits into central bank wallets, crippling credit creation."
          },
          elimination_technique: "Apply economic logic: Cash currency notes in your wallet do not yield interest. Since CBDC is a digital token representation of physical currency, it cannot pay repo rate interest.",
          concept_takeaway: "CBDC (e₹-R for retail, e₹-W for wholesale) provides digital sovereign settlement without credit or liquidity risk.",
          reference_sources: ["UPSC CSE Prelims 2023 Paper 1", "RBI Concept Note on Central Bank Digital Currency"]
        },
        subject: "Economy",
        topic: "Monetary Policy & Digital Currency",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High"
      },
      {
        id: "p23-q2",
        question: "Consider the following dynasties:\n1. Hoysala\n2. Gahadavala\n3. Kakatiya\n4. Yadava\nHow many of the above dynasties established their kingdoms in the early eighth century AD?",
        options: [
          { id: "A", key: "A", text: "Only one" },
          { id: "B", key: "B", text: "Only two" },
          { id: "C", key: "C", text: "Only three" },
          { id: "D", key: "D", text: "None" }
        ],
        answer: "D",
        explanation: "None of these dynasties were established in the early 8th century AD (700-750 CE). The Hoysalas (10th-14th century), Gahadavalas of Kannauj (late 11th century / c. 1090 CE), Kakatiyas of Warangal (12th-14th century), and Yadavas of Devagiri (late 12th century) all arose much later during the 11th to 12th centuries.",
        detailedExplanation: {
          statement_analysis: {
            "Hoysala": "Established c. 10th-11th century CE in Dwarasamudra (Halebidu).",
            "Gahadavala": "Established c. 1089-1090 CE by Chandradeva in Varanasi/Kannauj.",
            "Kakatiya": "Emerged as independent rulers under Prola II in mid-12th century CE (c. 1150 CE).",
            "Yadava": "Founded by Bhillama V around 1187 CE with capital at Devagiri."
          },
          elimination_technique: "Remember medieval Indian timeline clusters: Tripartite struggle occurred in 8th-10th century (Gurjara-Pratiharas, Rashtrakutas, Palas). Regional successor kingdoms (Hoysalas, Yadavas, Kakatiyas, Gahadavalas) arose in the 11th-13th centuries prior to Alauddin Khalji's invasions.",
          concept_takeaway: "8th Century India was dominated by Rashtrakutas, Gurjara-Pratiharas, Palas, and Imperial Cholas.",
          reference_sources: ["UPSC CSE Prelims 2023 Paper 1", "Satish Chandra Medieval India (Vol 1)"]
        },
        subject: "History",
        topic: "Early Medieval Dynasties & Chronology",
        patternType: "Chronological Filter (New Pattern)",
        difficulty: "High"
      }
    ]
  },
  {
    id: "prelims-2022-full",
    title: "UPSC Civil Services Prelims 2022 (Official GS Paper 1)",
    subject: "Full-Length Prelims (2022)",
    moduleNumber: 2022,
    moduleTitle: "UPSC CSE Prelims 2022 Comprehensive Paper",
    curriculum: "UPSC CSE Prelims GS Paper 1",
    stage: "Prelims",
    topic: "Comprehensive GS 1",
    questions: 1,
    duration: 30,
    description: "Official UPSC CSE Prelims 2022 GS Paper 1 with detailed statement analyses across Money Multiplier, Tea Board of India, G-20, and CRISPR-Cas9.",
    marksPerQuestion: 2,
    negativeMarking: 0.66,
    difficulty: "Moderate to High",
    questionList: [
      {
        id: "p22-q1",
        question: "With reference to the 'Tea Board in India', consider the following statements:\n1. The Tea Board is a statutory body.\n2. It is a regulatory body attached to the Ministry of Agriculture and Farmers Welfare.\n3. The Tea Board's Head Office is situated in Kolkata.\n4. The Board has overseas offices located at Dubai and Moscow.\nWhich of the statements given above are correct?",
        options: [
          { id: "A", key: "A", text: "1 and 3 only" },
          { id: "B", key: "B", text: "2 and 4 only" },
          { id: "C", key: "C", text: "1, 3 and 4" },
          { id: "D", key: "D", text: "1, 2 and 3" }
        ],
        answer: "C",
        explanation: "Statements 1, 3, and 4 are correct. Statement 2 is incorrect because the Tea Board of India is functioning under the Ministry of Commerce and Industry, not the Ministry of Agriculture.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Established under Section 4 of the Tea Act, 1953.",
            "Statement 2": "Incorrect. It functions under the Ministry of Commerce and Industry (all commodity boards like Coffee Board, Rubber Board, Spices Board, Tea Board belong to Commerce Ministry).",
            "Statement 3": "Correct. Headquartered in Kolkata, West Bengal.",
            "Statement 4": "Correct. Maintains overseas promotion offices in Dubai and Moscow."
          },
          elimination_technique: "Commodity Boards rule: Tea Board, Coffee Board, Rubber Board, Tobacco Board, Spices Board all operate under the Ministry of Commerce & Industry. Eliminating Statement 2 immediately leaves Option C (1, 3 and 4).",
          concept_takeaway: "Statutory commodity boards focused on export promotion fall under the Department of Commerce.",
          reference_sources: ["UPSC CSE Prelims 2022 Paper 1", "Ministry of Commerce & Industry Annual Report"]
        },
        subject: "Economy",
        topic: "Statutory Bodies & Commodity Boards",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate"
      }
    ]
  },
  {
    id: "prelims-2021-full",
    title: "UPSC Civil Services Prelims 2021 (Official GS Paper 1)",
    subject: "Full-Length Prelims (2021)",
    moduleNumber: 2021,
    moduleTitle: "UPSC CSE Prelims 2021 Comprehensive Paper",
    curriculum: "UPSC CSE Prelims GS Paper 1",
    stage: "Prelims",
    topic: "Comprehensive GS 1",
    questions: 1,
    duration: 30,
    description: "Official UPSC CSE Prelims 2021 GS Paper 1 covering Right to Privacy under Article 21, Urban Cooperative Banks, Blue Carbon, and TRIPS Waiver.",
    marksPerQuestion: 2,
    negativeMarking: 0.66,
    difficulty: "Moderate",
    questionList: [
      {
        id: "p21-q1",
        question: "Which one of the following in Indian polity is an essential feature that indicates that it is 'federal' in character?",
        options: [
          { id: "A", key: "A", text: "The independence of judiciary is safeguarded." },
          { id: "B", key: "B", text: "The Union Legislature has elected representatives from constituent units." },
          { id: "C", key: "C", text: "The Union Cabinet can have elected representatives from regional parties." },
          { id: "D", key: "D", text: "The Fundamental Rights are enforceable by Courts of Law." }
        ],
        answer: "A",
        explanation: "An independent judiciary is the cardinal feature of a federal constitution required to resolve disputes between the Union and the States and preserve constitutional distribution of powers.",
        detailedExplanation: {
          statement_analysis: {
            "Option A": "Correct. Federalism requires a written constitution and an independent judiciary to act as the neutral umpire of Centre-State jurisdictional boundaries.",
            "Option B": "Present in unitary states with bicameralism as well.",
            "Option C": "Political coalition dynamic, not a structural constitutional federal feature.",
            "Option D": "Feature of constitutionalism and democracy, not specific to federalism."
          },
          elimination_technique: "Federal essentials according to K.C. Wheare and M. Laxmikanth: Dual polity, Written constitution, Division of powers, Supremacy of constitution, Rigid constitution, Independent judiciary, Bicameralism.",
          concept_takeaway: "Independent judiciary protects the federal basic structure (*S.R. Bommai 1994*).",
          reference_sources: ["UPSC CSE Prelims 2021 Paper 1", "Indian Polity by M. Laxmikanth"]
        },
        subject: "Polity",
        topic: "Federal Features of the Indian Constitution",
        patternType: "Conceptual Single Choice",
        difficulty: "Moderate"
      }
    ]
  },
  {
    id: "prelims-2020-full",
    title: "UPSC Civil Services Prelims 2020 (Official GS Paper 1)",
    subject: "Full-Length Prelims (2020)",
    moduleNumber: 2020,
    moduleTitle: "UPSC CSE Prelims 2020 Comprehensive Paper",
    curriculum: "UPSC CSE Prelims GS Paper 1",
    stage: "Prelims",
    topic: "Comprehensive GS 1",
    questions: 1,
    duration: 30,
    description: "Official UPSC CSE Prelims 2020 GS Paper 1 covering Basic Structure, Parliamentary System, Kisan Credit Card, and Jet Streams.",
    marksPerQuestion: 2,
    negativeMarking: 0.66,
    difficulty: "Moderate",
    questionList: [
      {
        id: "p20-q1",
        question: "A parliamentary system of government is one in which:",
        options: [
          { id: "A", key: "A", text: "all political parties in the Parliament are represented in the Government." },
          { id: "B", key: "B", text: "the Government is responsible to the Parliament and can be removed by it." },
          { id: "C", key: "C", text: "the Government is elected by the people and can be removed by them." },
          { id: "D", key: "D", text: "the Government is chosen by the Parliament but cannot be removed by it before completion of a fixed term." }
        ],
        answer: "B",
        explanation: "The defining hallmark of a Parliamentary system (Westminster model) is executive collective responsibility to the popular house of the legislature (Article 75(3) in India), meaning the council of ministers stays in office only as long as it enjoys the confidence of Parliament.",
        detailedExplanation: {
          statement_analysis: {
            "Option A": "Incorrect. Only majority party/coalition forms the executive.",
            "Option B": "Correct. Collective responsibility of the Council of Ministers to the Lok Sabha (Art 75(3)).",
            "Option C": "Defines general democracy or presidential system where executive is independently elected.",
            "Option D": "Incorrect. Describes Swiss collegiate system or fixed-term executive."
          },
          elimination_technique: "Direct Article 75(3) constitutional doctrine: Executive is continuously accountable to the legislature.",
          concept_takeaway: "Parliamentary system = Executive-Legislative Fusion with Collective Responsibility.",
          reference_sources: ["UPSC CSE Prelims 2020 Paper 1", "Indian Polity by M. Laxmikanth"]
        },
        subject: "Polity",
        topic: "Parliamentary System & Collective Responsibility",
        patternType: "Direct Conceptual",
        difficulty: "Easy to Moderate"
      }
    ]
  },
  {
    id: "prelims-2019-full",
    title: "UPSC Civil Services Prelims 2019 (Official GS Paper 1)",
    subject: "Full-Length Prelims (2019)",
    moduleNumber: 2019,
    moduleTitle: "UPSC CSE Prelims 2019 Comprehensive Paper",
    curriculum: "UPSC CSE Prelims GS Paper 1",
    stage: "Prelims",
    topic: "Comprehensive GS 1",
    questions: 1,
    duration: 30,
    description: "Official UPSC CSE Prelims 2019 GS Paper 1 covering 9th Schedule, Money Multiplier, Extended Producer Responsibility, and Asiatic Lions.",
    marksPerQuestion: 2,
    negativeMarking: 0.66,
    difficulty: "Moderate",
    questionList: [
      {
        id: "p19-q1",
        question: "The Ninth Schedule was introduced in the Constitution of India during the prime ministership of:",
        options: [
          { id: "A", key: "A", text: "Jawaharlal Nehru" },
          { id: "B", key: "B", text: "Lal Bahadur Shastri" },
          { id: "C", key: "C", text: "Indira Gandhi" },
          { id: "D", key: "D", text: "Morarji Desai" }
        ],
        answer: "A",
        explanation: "The Ninth Schedule and Article 31B were inserted into the Constitution of India by the 1st Constitutional Amendment Act, 1951, under the Prime Ministership of Pandit Jawaharlal Nehru to protect agrarian land reform legislation from judicial review.",
        detailedExplanation: {
          statement_analysis: {
            "Option A": "Correct. 1st CAA 1951 was enacted by the Provisional Parliament headed by Jawaharlal Nehru.",
            "Option B, C, D": "Incorrect historical timelines."
          },
          elimination_technique: "The 1st Amendment took place in 1951 before the first general elections (1951-52). Nehru was the Prime Minister.",
          concept_takeaway: "In *I.R. Coelho v. State of Tamil Nadu (2007)*, the Supreme Court ruled that laws placed in the 9th Schedule after April 24, 1973 are open to judicial review if they violate the Basic Structure.",
          reference_sources: ["UPSC CSE Prelims 2019 Paper 1", "Indian Polity by M. Laxmikanth"]
        },
        subject: "Polity",
        topic: "Constitutional Amendments & 9th Schedule",
        patternType: "Direct Historical Match",
        difficulty: "Easy"
      }
    ]
  },
  {
    id: "prelims-2018-full",
    title: "UPSC Civil Services Prelims 2018 (Official GS Paper 1)",
    subject: "Full-Length Prelims (2018)",
    moduleNumber: 2018,
    moduleTitle: "UPSC CSE Prelims 2018 Comprehensive Paper",
    curriculum: "UPSC CSE Prelims GS Paper 1",
    stage: "Prelims",
    topic: "Comprehensive GS 1",
    questions: 2,
    duration: 30,
    description: "Official UPSC CSE Prelims 2018 GS Paper 1 covering Right to Privacy under Article 21, Rule of Law Index, Capital Adequacy Ratio, and Genetic Engineering Appraisal Committee (GEAC).",
    marksPerQuestion: 2,
    negativeMarking: 0.66,
    difficulty: "Moderate",
    questionList: [
      {
        id: "p18-q1",
        question: "Right to Privacy is protected as an intrinsic part of Right to Life and Personal Liberty under which Article of the Constitution of India?",
        options: [
          { id: "A", key: "A", text: "Article 14" },
          { id: "B", key: "B", text: "Article 19" },
          { id: "C", key: "C", text: "Article 21" },
          { id: "D", key: "D", text: "Article 29" }
        ],
        answer: "C",
        explanation: "In the landmark 9-judge bench ruling *Justice K.S. Puttaswamy (Retd.) v. Union of India (2017)*, the Supreme Court unanimously declared that the Right to Privacy is a Fundamental Right guaranteed under Article 21 and the freedoms guaranteed by Part III of the Constitution.",
        detailedExplanation: {
          statement_analysis: {
            "Option C": "Correct. Article 21 (Protection of life and personal liberty) encompasses bodily autonomy, informational privacy, and spatial privacy.",
            "Options A, B, D": "While privacy touches on equality (Art 14) and freedoms (Art 19), it is intrinsically anchored in Article 21."
          },
          elimination_technique: "Direct landmark judicial precedent from Puttaswamy 2017 ruling.",
          concept_takeaway: "Article 21 has the widest judicial interpretation in Indian constitutional jurisprudence.",
          reference_sources: ["UPSC CSE Prelims 2018 Paper 1", "Supreme Court Puttaswamy Judgement (2017)"]
        },
        subject: "Polity",
        topic: "Fundamental Rights & Article 21",
        patternType: "Direct Conceptual",
        difficulty: "Easy"
      },
      {
        id: "p18-q2",
        question: "The 'Genetic Engineering Appraisal Committee' (GEAC) is constituted under the:",
        options: [
          { id: "A", key: "A", text: "Food Safety and Standards Act, 2006" },
          { id: "B", key: "B", text: "Geographical Indications of Goods (Registration and Protection) Act, 1999" },
          { id: "C", key: "C", text: "Environment (Protection) Act, 1986" },
          { id: "D", key: "D", text: "Wildlife (Protection) Act, 1972" }
        ],
        answer: "C",
        explanation: "The Genetic Engineering Appraisal Committee (GEAC) functions as a statutory body under the Ministry of Environment, Forest and Climate Change pursuant to Rules 1989 framed under the Environment (Protection) Act, 1986.",
        detailedExplanation: {
          statement_analysis: {
            "Option C": "Correct. GEAC is established under Rules for the Manufacture, Use/Import/Export and Storage of Hazardous Micro Organisms/Genetically Engineered Organisms or Cells 1989 notified under Environment (Protection) Act 1986.",
            "Option A": "FSSAI is under FSS Act 2006.",
            "Option B": "GI Registry is under GI Act 1999.",
            "Option D": "National Board for Wildlife is under WPA 1972."
          },
          elimination_technique: "Environment (Protection) Act, 1986 is India's umbrella environmental legislation under which Hazardous Substances and Genetically Modified Organisms (GMOs) rules are formulated.",
          concept_takeaway: "GEAC approves proposals regarding environmental release of Genetically Modified (GM) crops such as Bt Cotton and GM Mustard (DMH-11).",
          reference_sources: ["UPSC CSE Prelims 2018 Paper 1", "Ministry of Environment, Forest and Climate Change (MoEFCC)"]
        },
        subject: "Environment",
        topic: "Environmental Legislation & GMO Governance",
        patternType: "Direct Statutory Anchor",
        difficulty: "Moderate"
      }
    ]
  }
];
