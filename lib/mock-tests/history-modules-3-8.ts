import { MockTest } from "@/lib/core/types";

export const HISTORY_MODULES_3_TO_8: MockTest[] = [
  // ==========================================================================
  // MODERN INDIAN HISTORY - MODULE 03
  // ==========================================================================
  {
    id: "MOD-HIST-03",
    subject: "Modern Indian History",
    moduleNumber: 3,
    moduleTitle: "People's Resistance: Civil, Tribal, and Peasant Uprisings (1757–1857)",
    curriculum: "UPSC Civil Services Examination (CSE)",
    stage: "Preliminary Examination (General Studies Paper-I)",
    topic: "Sanyasi Rebellion, Paika Bidroha, Santhal Hul, Kol Mutiny, and Ramosi Uprising",
    title: "Modern Indian History · Module 03: Civil, Tribal & Peasant Uprisings (1757–1857)",
    questions: 10,
    duration: 20,
    marksPerQuestion: 2.0,
    negativeMarking: 0.66,
    difficulty: "Moderate to High",
    description: "Sanyasi-Fakir rebellion in Bengal, Paika rebellion under Bakshi Jagabandhu, Santhal Hul (Sidhu & Kanhu), Ramosi uprising, and Pagal Panthis.",
    questionList: [
      {
        id: "UPSC_MODHIST_MOD03_001",
        syllabusSubtopic: "Sanyasi and Fakir Rebellion (1763–1800)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "With reference to the Sanyasi and Fakir Rebellion in Bengal (1763–1800), consider the following statements:\n\n1. It was sparked by the severe Bengal famine of 1770 and harsh British restrictions on pilgrims visiting holy shrines.\n2. Prominent leaders of the rebellion included Majnu Shah, Chirag Ali, Bhawani Pathak, and Devi Chaudhurani.\n3. Bankim Chandra Chatterjee's famous novel 'Anandamath' is based on the background of this rebellion.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. The Sanyasi-Fakir rebellion was triggered by the 1770 famine and pilgrim taxes, led by Majnu Shah, Bhawani Pathak, and Devi Chaudhurani, and immortalized in Bankim Chandra's Anandamath.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The catastrophic 1770 famine combined with British revenue extraction and pilgrim taxes pushed religious mendicants, dispossessed zamindars, and peasants into armed revolt.",
            "Statement 2": "Correct. Both Muslim Fakirs (Majnu Shah, Chirag Ali) and Hindu Sanyasis (Bhawani Pathak, Devi Chaudhurani) coordinated joint attacks against British factories and treasuries.",
            "Statement 3": "Correct. Bankim Chandra Chatterjee based his novel Anandamath (which contains the national song 'Vande Mataram') on the Sanyasi rebellion."
          },
          elimination_technique: "Recognizing the connection between Anandamath and the Sanyasi rebellion directly validates statement 3.",
          concept_takeaway: "The rebellion demonstrated early Hindu-Muslim unity against the East India Company before communal divisions emerged.",
          reference_sources: ["Spectrum's A Brief History of Modern India", "Bipan Chandra: History of Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD03_002",
        syllabusSubtopic: "Paika Rebellion (1817)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "Consider the following statements regarding the Paika Rebellion of 1817 in Odisha:\n\n1. The Paikas were the traditional landed militia of the Gajapati rulers of Khurda.\n2. The rebellion was led by Bakshi Jagabandhu Bidyadhar, the hereditary military commander of Khurda.\n3. The immediate causes included the introduction of the new currency system, the salt tax, and the auctioning of ancestral estates.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. The Paikas under Bakshi Jagabandhu rebelled against the British land revenue and currency policies in Odisha in 1817.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The Paikas enjoyed rent-free land tenures (Nish-kar) in return for military service to the Raja of Khurda.",
            "Statement 2": "Correct. Bakshi Jagabandhu's own estate of Rorang was fraudulently dispossessed by Bengali revenue officials, prompting him to lead the rebellion.",
            "Statement 3": "Correct. The British disrupted the local cowrie currency system, imposed an oppressive salt monopoly, and fixed exorbitant land revenue demands."
          },
          elimination_technique: "All statements detail the standard historical causes of the 1817 Paika rebellion recognized as a major pre-1857 uprising in Odisha.",
          concept_takeaway: "The Paika Bidroha forced the British to lower revenue assessments and suspend sales of defaulting estates in Khurda.",
          reference_sources: ["NCERT Class VIII & XII", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD03_003",
        syllabusSubtopic: "Santhal Hul (1855–1856)",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): The Santhals of the Rajmahal Hills launched the 'Hul' (rebellion) against the British in 1855 under the leadership of Sidhu and Kanhu Murmu.\nReason (R): The introduction of the Permanent Settlement resulted in heavy taxation, exploitation by moneylenders (Dikus), and alienation of Santhal tribal lands in the Damin-i-Koh area.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains the structural socio-economic grievances in the Damin-i-Koh area that caused the massive Santhal rebellion in 1855.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Brothers Sidhu, Kanhu, Chand, and Bhairav mobilized over 60,000 Santhals to declare a sovereign Santhal Raj in 1855.",
            "Reason (R)": "True and explains the Assertion. The British brought moneylenders, zamindars, and traders (Dikus) into Damin-i-Koh who trapped the Santhals into perpetual debt slavery."
          },
          elimination_technique: "The causal link between exploitation by Dikus and the tribal explosion led by the Murmu brothers is historically direct. Option A is correct.",
          concept_takeaway: "After brutally suppressing the Hul, the British created the separate 'Santhal Parganas' district and enacted special tenancy laws to pacify the region.",
          reference_sources: ["NCERT Class XII: Themes in Indian History - Part III", "Bipan Chandra: India's Struggle for Independence"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD03_004",
        syllabusSubtopic: "Kol Mutiny (1831–1832)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "With reference to the Kol Mutiny of 1831–1832 in the Chhotanagpur region, consider the following statements:\n\n1. The Kols inhabited Chhotanagpur including Ranchi, Singhbhum, Hazaribagh, and Palamau.\n2. The rebellion was triggered by the large-scale transfer of tribal lands to non-tribal merchants and Sikh and Muslim thikadars.\n3. The rebellion was led by Buddho Bhagat, Jona Bhagat, and Madara Mahato.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. The Kol uprising in Chhotanagpur led by Buddho Bhagat was caused by the intrusion of outside thikadars and new British taxes.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The Kol tribe lived across the plateau region of Chhotanagpur and Singbhum.",
            "Statement 2": "Correct. The Raja of Chhotanagpur leased out villages to outsiders who imposed heavy agricultural cesses and forced labor (begar).",
            "Statement 3": "Correct. Buddho Bhagat led armed bands that targeted British courts, police stations, and moneylender houses before he was killed in action."
          },
          elimination_technique: "All statements correctly describe the geographical, causal, and leadership aspects of the Kol uprising.",
          concept_takeaway: "The Kol Mutiny led to the creation of the South-West Frontier Agency (SWFA) to govern tribal areas under special non-regulation rules.",
          reference_sources: ["Spectrum's Modern India", "From Plassey to Partition (Sekhar Bandyopadhyay)"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD03_005",
        syllabusSubtopic: "Pagal Panthis and Faraizi Movements",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "High",
        question: "Consider the following pairs of peasant-religious movements and their founding leaders in Eastern India:\n\n1. Pagal Panthis (Mymensingh) : Karam Shah and Tipu Shah\n2. Faraizi Movement (Bengal) : Haji Shariatullah and Dudu Miyan\n3. Tariqah-i-Muhammadiya (Wahabi) : Syed Ahmed Barelvi\n\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", text: "Only one pair" },
          { id: "B", text: "Only two pairs" },
          { id: "C", text: "All three pairs" },
          { id: "D", text: "None of the pairs" }
        ],
        answer: "C",
        explanation: "All three pairs are correctly matched: Pagal Panthis (Karam Shah & Tipu Shah), Faraizis (Haji Shariatullah & Dudu Miyan), and Wahabi/Tariqah (Syed Ahmed Barelvi).",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1": "Correctly matched. Karam Shah founded the semi-religious Pagal Panthi sect; his son Tipu Shah organized tenants against zamindari exactions in northern Mymensingh.",
            "Pair 2": "Correctly matched. Haji Shariatullah founded the Faraizi movement to return to pure Islamic duties; his son Dudu Miyan organized peasant resistance declaring 'land belongs to God'.",
            "Pair 3": "Correctly matched. Syed Ahmed Barelvi founded the Wahabi movement in India, establishing an armed base at Sithana to fight the British."
          },
          elimination_technique: "Standard 19th-century agrarian-religious protest movements in Bengal and North India. All 3 pairs are accurate.",
          concept_takeaway: "These movements synthesized religious reform with militant agrarian resistance against British tax collectors and zamindars.",
          reference_sources: ["Bipan Chandra: History of Modern India", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD03_006",
        syllabusSubtopic: "Ramosi and Bhil Uprisings (Western India)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "Regarding tribal and peasant resistance in Western India during the early 19th century, consider the following statements:\n\n1. Chittur Singh and Umaji Naik led the Ramosis of Maharashtra against British annexation and heavy land revenue assessments.\n2. The Bhil uprisings occurred in the Khandesh region due to agrarian distress and Company interference in traditional forest rights.\n3. The British succeeded in pacifying the Ramosis by creating special hill police units and granting them land grants.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. The Ramosis under Chittur Singh and Umaji Naik and the Bhils of Khandesh rebelled against British revenue and forest policies in Western Ghats.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The Ramosis (traditional hill watchmen under the Peshwa) lost their livelihood after the fall of the Peshwa in 1818 and rose in revolt.",
            "Statement 2": "Correct. The Bhils revolted repeatedly (1817-1846) in Khandesh against British encroachments.",
            "Statement 3": "Correct. The British used a combination of military force and recruitment of Ramosis into local police forces to quell the unrest."
          },
          elimination_technique: "The pacification strategy of co-opting tribal fighters into hill police corps (e.g., Bhil Corps, Ramosi guards) was standard British administrative policy.",
          concept_takeaway: "Displacement of traditional military and administrative classes after British annexation of the Maratha confederacy triggered widespread rebellion.",
          reference_sources: ["Spectrum's A Brief History of Modern India", "From Plassey to Partition"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD03_007",
        syllabusSubtopic: "Ahom Revolt (1828) and Khasi Uprising (1829–33)",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "With reference to early tribal and regional resistance in North-East India, consider the following statements:\n\n1. Gomdhar Konwar led the Ahom revolt in Assam after the British reneged on their promise to withdraw after the First Anglo-Burmese War.\n2. Tirut Singh (U Tirot Sing), the chief of Nongkhlaw, led the Khasi uprising against the construction of a military road connecting Assam to Sylhet.\n3. The British were completely expelled from the Brahmaputra Valley as a result of these revolts.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "A",
        explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect as the British successfully suppressed both rebellions and permanently annexed Assam.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. In 1828, Ahom nobles led by Gomdhar Konwar rebelled when the British annexed Assam instead of restoring the Ahom kingdom after the 1826 Treaty of Yandabo.",
            "Statement 2": "Correct. Tirut Singh led the Khasis, Garos, and Singphos in a four-year guerrilla war against British road construction through Khasi territory.",
            "Statement 3": "Incorrect. The British crushed the resistance, captured Tirut Singh (who died in prison in Dhaka), and consolidated control over Assam."
          },
          elimination_technique: "Statement 3 claims the British were 'completely expelled', which is historically false since Assam remained a major British tea plantation province.",
          concept_takeaway: "The Treaty of Yandabo (1826) marked the beginning of British colonial encroachment into the North-Eastern tribal kingdoms.",
          reference_sources: ["Spectrum's Modern India", "NCERT Themes in Indian History"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD03_008",
        syllabusSubtopic: "Kittur Chennamma and Rani Gaidinliu",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): Rani Chennamma of Kittur (Karnataka) led an armed rebellion against the British East India Company in 1824.\nReason (R): The British Collector of Dharwad, St. John Thackeray, refused to recognize her adopted son Shivalingappa under an early application of the doctrine of lapsed succession.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains the rejection of adopted heir Shivalingappa that triggered Kittur Chennamma's iconic rebellion.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Rani Chennamma defended Kittur and defeated the British in the initial battle in which Collector Thackeray was killed.",
            "Reason (R)": "True and explains the Assertion. Decades before Dalhousie formalized the Doctrine of Lapse, British local authorities rejected the succession of adopted heirs to seize small principalities."
          },
          elimination_technique: "The causal trigger for the Kittur rebellion was the denial of succession to the adopted heir. R accurately explains A.",
          concept_takeaway: "Rani Chennamma and her lieutenant Sangolli Rayanna became enduring folk heroes of anti-colonial resistance in South India.",
          reference_sources: ["Spectrum's A Brief History of Modern India", "NCERT Class VIII: Our Pasts - III"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD03_009",
        syllabusSubtopic: "Rampa Uprisings (Andhra Pradesh)",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "With reference to the Rampa uprisings in the coastal Andhra region, consider the following statements:\n\n1. The early Rampa rebellion (1879) was directed against the oppressive Mansabdars and new British excise taxes on toddy tapping.\n2. The later Rampa Rebellion (1922–24) was led by Alluri Sitarama Raju, who drew inspiration from Gandhi's Non-Cooperation Movement.\n3. Alluri Sitarama Raju advocated non-violence and strictly opposed the use of firearms by the tribal guerrillas.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "A",
        explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect because Alluri Sitarama Raju believed that India could be liberated only by force, not non-violence, and raided police stations for guns.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The 1879 Rampa rebellion fought against the corrupt Mansabdar and restrictions on firewood and toddy tapping in Godavari agency.",
            "Statement 2": "Correct. Alluri Sitarama Raju organized the Koya tribals against the Madras Forest Act 1882 (prohibiting Podu slash-and-burn cultivation), persuading them to wear Khadi and give up alcohol.",
            "Statement 3": "Incorrect. Although he praised Gandhi, Raju asserted that force was necessary to overthrow colonial rule, leading armed guerrilla ambushes on police stations (Chintapalle, Rampa, Addatigala)."
          },
          elimination_technique: "Statement 3 contradicts Raju's famous armed guerrilla tactics and police station raids. Eliminating 3 leaves Option A.",
          concept_takeaway: "Alluri Sitarama Raju synthesized Gandhian moral leadership with tribal guerrilla warfare to resist British forest enclosures.",
          reference_sources: ["NCERT Class X: India and the Contemporary World", "Bipan Chandra: India's Struggle for Independence"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD03_010",
        syllabusSubtopic: "Munda Ulgulan (1899–1900)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "Consider the following statements regarding the 'Ulgulan' (Great Tumult) led by Birsa Munda in the Chhotanagpur region:\n\n1. It was fought to restore the traditional 'Khuntkatti' (joint landholding) system eroded by British revenue laws and Diku landlords.\n2. Birsa Munda declared himself a prophet of God (Dharti Aba) and advocated a pure moral life, rejecting animal sacrifice and liquor.\n3. The British passed the Chhotanagpur Tenancy Act (CNTA) of 1908 after the rebellion, recognizing the Khuntkatti rights and restricting the transfer of tribal land.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. The Munda Ulgulan fought for Khuntkatti land rights, Birsa declared himself Dharti Aba, and the rebellion led to the historic Chhotanagpur Tenancy Act of 1908.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The erosion of traditional Khuntkatti communal tenure by non-tribal thikadars was the core agrarian grievance.",
            "Statement 2": "Correct. Birsa initiated a new religious faith (Birsait), preaching monotheism and urging the Mundas to cleanse themselves of superstitions and alcohol.",
            "Statement 3": "Correct. The 1908 CNTA provided landmark legal protection to tribal lands, legally abolishing Beth-Begari (forced labor)."
          },
          elimination_technique: "All 3 statements are standard, highly tested facts regarding the Munda rebellion and its legislative aftermath.",
          concept_takeaway: "The Ulgulan demonstrated that tribal movements had distinct socio-religious, economic, and political goals of self-rule (Birsa Raj).",
          reference_sources: ["Bipan Chandra: India's Struggle for Independence", "NCERT Class VIII: Tribals, Dikus and the Vision of a Golden Age"]
        }
      }
    ]
  },

  // ==========================================================================
  // MODERN INDIAN HISTORY - MODULE 04
  // ==========================================================================
  {
    id: "MOD-HIST-04",
    subject: "Modern Indian History",
    moduleNumber: 4,
    moduleTitle: "The Great Revolt of 1857 and Administrative Shift",
    curriculum: "UPSC Civil Services Examination (CSE)",
    stage: "Preliminary Examination (General Studies Paper-I)",
    topic: "Causes, Outbreak, Centers and Leaders of 1857, Suppression, Government of India Act 1858, and Queen's Proclamation",
    title: "Modern Indian History · Module 04: The Great Revolt of 1857 & Act of 1858",
    questions: 10,
    duration: 20,
    marksPerQuestion: 2.0,
    negativeMarking: 0.66,
    difficulty: "Moderate to High",
    description: "General Service Enlistment Act, greased cartridges, regional leaders (Kunwar Singh, Begum Hazrat Mahal, Rani Lakshmibai), Peel Commission, and Queen's Proclamation 1858.",
    questionList: [
      {
        id: "UPSC_MODHIST_MOD04_001",
        syllabusSubtopic: "Immediate and Underlying Causes of 1857",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "With reference to the underlying causes of the Revolt of 1857, consider the following statements:\n\n1. The General Service Enlistment Act of 1856 required Indian sepoys to serve overseas, which violated upper-caste Hindu religious taboos on crossing the sea (Kala Pani).\n2. The annexation of Awadh in 1856 on charges of 'misgovernance' deeply hurt the sentiments of the sepoys, as over 75,000 sepoys in the Bengal Army hailed from Awadh.\n3. The Post Office Act of 1854 completely withdrew the free postage privilege previously enjoyed by sepoys.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. The General Service Enlistment Act 1856, the annexation of Awadh 1856, and the Post Office Act 1854 were critical triggers of sepoy discontent.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Lord Canning's Act mandated overseas service, which high-caste Brahmin and Rajput sepoys viewed as a threat to their caste purity.",
            "Statement 2": "Correct. Awadh was known as the 'nursery of the Bengal Army'. Its annexation by Lord Dalhousie caused widespread resentment among sepoy families.",
            "Statement 3": "Correct. Lord Dalhousie's 1854 Act abolished the free postal privilege of sepoys, adding to their economic and psychological frustration."
          },
          elimination_technique: "All 3 represent key pre-1857 legislative and political triggers documented in standard UPSC textbooks.",
          concept_takeaway: "The greased Enfield rifle cartridge (using cow and pig fat) was merely the spark that ignited decades of accumulated military, religious, and economic grievances.",
          reference_sources: ["Spectrum's A Brief History of Modern India - The Revolt of 1857", "Bipan Chandra: History of Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD04_002",
        syllabusSubtopic: "Centers and Leaders of the 1857 Revolt",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "Moderate",
        question: "Consider the following pairs of centers of the 1857 Revolt and their prominent leaders:\n\n1. Arrah (Bihar) : Kunwar Singh and Amar Singh\n2. Bareilly (Rohilkhand) : Khan Bahadur Khan\n3. Faizabad (Awadh) : Maulvi Ahmadullah Shah\n4. Allahabad (Prayagraj) : Maulvi Liaquat Ali\n\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", text: "Only one pair" },
          { id: "B", text: "Only two pairs" },
          { id: "C", text: "Only three pairs" },
          { id: "D", text: "All four pairs" }
        ],
        answer: "D",
        explanation: "All four pairs are correctly matched: Arrah (Kunwar Singh), Bareilly (Khan Bahadur Khan), Faizabad (Maulvi Ahmadullah), and Allahabad (Maulvi Liaquat Ali).",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1": "Correctly matched. Kunwar Singh (an 80-year-old zamindar of Jagdishpur) and his brother Amar Singh led the resistance across Bihar and eastern UP.",
            "Pair 2": "Correctly matched. Khan Bahadur Khan (descendant of Hafiz Rahmat Khan) established a rebel administration in Bareilly.",
            "Pair 3": "Correctly matched. Maulvi Ahmadullah (the 'Danka Shah' of Faizabad) fought fierce battles against British forces led by Sir Colin Campbell.",
            "Pair 4": "Correctly matched. Maulvi Liaquat Ali led the uprising in Allahabad until it was brutally suppressed by Colonel James Neill."
          },
          elimination_technique: "These four centers and leaders represent standard Prelims matching data. All 4 pairs are accurate.",
          concept_takeaway: "The revolt mobilized dispossessed feudal chiefs, religious preachers, and peasants across the Indo-Gangetic plain.",
          reference_sources: ["Spectrum's Modern India", "NCERT Class XII: Themes in Indian History - Part III"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD04_003",
        syllabusSubtopic: "Nature and Character of the 1857 Revolt",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "Regarding historical interpretations of the Revolt of 1857, consider the following statements:\n\n1. V.D. Savarkar described the 1857 revolt as 'The Indian War of Independence' in his 1909 book.\n2. Sir John Lawrence and Seeley viewed it strictly as a 'wholly unpatriotic and selfish Sepoy Mutiny with no native leadership and no popular support'.\n3. Dr. S.N. Sen, the official historian of the 1857 revolt, concluded that 'what began as a fight for religion ended as a war in the name of national independence'.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements correctly represent the prominent historiographical perspectives on 1857: Savarkar (First War of Independence), John Lawrence (Sepoy Mutiny), and S.N. Sen (Official Historian).",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. V.D. Savarkar published 'The Indian War of Independence 1857' in 1909, popularizing the nationalist interpretation.",
            "Statement 2": "Correct. British imperialist historians like John Lawrence, Seeley, and Kaye minimized the revolt as a mere military mutiny without civilian legitimacy.",
            "Statement 3": "Correct. Dr. S.N. Sen in his official work 'Eighteen Fifty-Seven' noted that while it started with religious anxieties, it took the character of an anti-colonial war of liberation."
          },
          elimination_technique: "All 3 represent standard historiographical quotes tested by UPSC regarding the character of 1857.",
          concept_takeaway: "R.C. Majumdar offered the critical counterpoint: 'Neither first, nor national, nor war of independence.'",
          reference_sources: ["B.L. Grover: A New Look at Modern Indian History", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD04_004",
        syllabusSubtopic: "Government of India Act 1858",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "The Government of India Act 1858 (Act for the Better Government of India) introduced fundamental changes in colonial administration. Which of the following were provisions of this Act?\n\n1. It abolished the British East India Company and transferred the government, territories, and revenues of India directly to the British Crown.\n2. It abolished the dual system of control by terminating both the Board of Control and the Court of Directors.\n3. It created the new office of the Secretary of State for India, who was assisted by a 15-member Council of India.\n4. It changed the designation of the Governor-General of India to the Viceroy of India, with Lord Canning becoming the first Viceroy.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1, 3 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "D",
        explanation: "All four statements are correct. The Act of 1858 transferred power to the Crown, abolished the Board of Control / Court of Directors, created the Secretary of State with a 15-member Council, and created the Viceroy.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Company rule was formally terminated, replaced by direct governance under Queen Victoria.",
            "Statement 2": "Correct. The dual system of control introduced by Pitt's India Act 1784 was abolished.",
            "Statement 3": "Correct. The Secretary of State for India was a member of the British Cabinet, answerable to the British Parliament.",
            "Statement 4": "Correct. Lord Canning, the last Governor-General under the Company, became the first Viceroy under the Crown."
          },
          elimination_technique: "These four points represent the defining constitutional elements of the 1858 Act.",
          concept_takeaway: "While administrative forms changed, the economic exploitation of India intensified under direct British Crown rule.",
          reference_sources: ["M. Laxmikanth: Indian Polity - Historical Background", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD04_005",
        syllabusSubtopic: "Queen Victoria's Proclamation (1858)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "Queen Victoria's Proclamation was read out by Lord Canning at a grand Darbar in Allahabad on November 1, 1858. Which of the following commitments were made in this proclamation?\n\n1. Renunciation of further territorial annexations in India and respect for the rights and dignity of native princes.\n2. Equal and impartial protection of the law for all Indian subjects without distinction of race or religion.\n3. Absolute non-interference in the ancient religious beliefs and worship practices of Indians.\n4. Complete unconditional pardon and amnesty to all rebels, including those convicted of murdering British subjects.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "A",
        explanation: "Statements 1, 2, and 3 are correct. Statement 4 is incorrect because amnesty was strictly denied to anyone who had murdered British subjects.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The Doctrine of Lapse was abandoned; princes were allowed to adopt heirs and were converted into junior partners of the Empire.",
            "Statement 2": "Correct. It promised that Indian subjects would be admitted to public offices according to qualification, irrespective of race or creed.",
            "Statement 3": "Correct. The British pledged strict religious neutrality to prevent provoking another revolt.",
            "Statement 4": "Incorrect. Amnesty was granted only to rebels who laid down arms and had not participated in the murder of British subjects."
          },
          elimination_technique: "The British state would never pardon the perpetrators of massacres like Kanpur (Bibighar). Eliminating statement 4 removes options B and D, leaving A.",
          concept_takeaway: "The Proclamation was hailed by the Indian elite as the 'Magna Carta' of their civil liberties, though in practice its promises were rarely fulfilled.",
          reference_sources: ["Spectrum's Modern India", "B.L. Grover: Modern Indian History"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD04_006",
        syllabusSubtopic: "Military Reorganization: The Peel Commission (1859)",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "Following the 1857 Revolt, the British government appointed the Peel Commission to restructure the Indian Army. Which of the following military reforms were instituted on its recommendations?\n\n1. The ratio of European to Indian troops was substantially increased to 1:2 in the Bengal Army and 1:3 in the Madras and Bombay Armies.\n2. Artillery, sophisticated firearms, and strategic communications were placed strictly under exclusive British control.\n3. The policy of 'Divide and Rule' was institutionalized by dividing army regiments along caste, community, and regional identities.\n4. The classification of Indian communities into 'Martial' and 'Non-Martial' races was introduced.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1, 3 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "D",
        explanation: "All four statements are correct. The Peel Commission established European troop ratios (1:2 in Bengal), British monopoly on artillery, communal segregation of regiments, and the Martial Race doctrine.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. To prevent Indian sepoys from overwhelming British garrisons, the proportion of European soldiers was doubled.",
            "Statement 2": "Correct. Indians were barred from artillery units and senior officer ranks (no Indian could rise above Subedar).",
            "Statement 3": "Correct. Homogeneous sepoy regiments were disbanded in favor of mixed or ethnically segregated regiments (Gorkhas, Sikhs, Dogras, Pathans) to prevent cross-communal solidarity.",
            "Statement 4": "Correct. Communities that rebelled (Brahmins, Awadhi Rajputs) were classified as 'Non-Martial', while loyalists (Gorkhas, Sikhs, Punjabis) were designated 'Martial' races."
          },
          elimination_technique: "All 4 points summarize the core security measures adopted by the British military command post-1857.",
          concept_takeaway: "The Indian Army was reorganized as an instrument of imperial defense and internal counter-insurgency rather than a national military force.",
          reference_sources: ["Sekhar Bandyopadhyay: From Plassey to Partition", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD04_007",
        syllabusSubtopic: "Civil Discontent: The Indigo Revolt (1859–1860)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "Immediately after the 1857 Revolt, Bengal witnessed the historic 'Indigo Revolt' (Neel Bidroha). Consider the following statements regarding this movement:\n\n1. It began in Govindpur village of Nadia district under the leadership of Digambar Biswas and Bishnu Biswas.\n2. The ryots refused to take advances (Dadon) and boycotted the cultivation of indigo, defending themselves with lathis and spears against planters' clubmen (Lathiyals).\n3. Dinabandhu Mitra wrote the famous Bengali play 'Nil Darpan' depicting the brutal atrocities of the indigo planters.\n4. The Government appointed the Indigo Commission in 1860, which declared that ryots could not be compelled to grow indigo.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1, 3 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "D",
        explanation: "All four statements are correct. The 1859 Indigo Revolt in Nadia led by Digambar & Bishnu Biswas was supported by Nil Darpan (Dinabandhu Mitra) and resulted in the 1860 Indigo Commission.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Former employees of planters, Digambar and Bishnu Biswas, organized the initial peasant strike in Nadia in 1859.",
            "Statement 2": "Correct. The peasants organized a total non-cooperation movement and rent strike against European planters.",
            "Statement 3": "Correct. Dinabandhu Mitra's play 'Nil Darpan' (1860) created a massive public outcry in Calcutta and was translated into English by Michael Madhusudan Dutt (published by Rev. James Long).",
            "Statement 4": "Correct. The Indigo Commission of 1860 headed by W.S. Seton-Karr condemned the coercive system and gave ryots the legal freedom to choose their crops."
          },
          elimination_technique: "The Indigo Revolt is celebrated as one of the most disciplined and victorious peasant uprisings in modern Indian history. All 4 statements are accurate.",
          concept_takeaway: "The movement highlighted the emergence of solidarity between the urban intelligentsia of Calcutta (Hindu Patriot edited by Harish Chandra Mukherjee) and the rural peasantry.",
          reference_sources: ["Bipan Chandra: India's Struggle for Independence - Peasant Movements", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD04_008",
        syllabusSubtopic: "Indian Councils Act 1861",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "With reference to the Indian Councils Act of 1861, consider the following statements:\n\n1. It initiated the process of decentralization by restoring the legislative powers of the Bombay and Madras Presidencies.\n2. It empowered the Viceroy to issue Ordinances during emergencies without the concurrence of the legislative council, with an ordinance validity of six months.\n3. It introduced the 'Portfolio System' into the Viceroy's Executive Council, which had been initiated by Lord Canning in 1859.\n4. It introduced direct elections with universal adult franchise for the Central Legislative Council.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "A",
        explanation: "Statements 1, 2, and 3 are correct. Statement 4 is incorrect because there were no direct elections; members were non-officials nominated by the Viceroy.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The Act reversed the centralizing trend begun by the Regulating Act 1773 and Charter Act 1833 by restoring legislative powers to Bombay and Madras.",
            "Statement 2": "Correct. The Viceroy's ordinance-making power (valid for 6 months) was created under this Act.",
            "Statement 3": "Correct. Lord Canning's portfolio system (assigning departments to individual council members) received statutory recognition.",
            "Statement 4": "Incorrect. Non-official Indians (Raja of Benaras, Maharaja of Patiala, Sir Dinkar Rao) were merely nominated, not elected."
          },
          elimination_technique: "Universal adult franchise and direct elections were not introduced until the 20th century. Eliminating statement 4 removes options B, C, and D.",
          concept_takeaway: "The 1861 Act was the first step towards representative institutions, though legislative councils remained toothless advisory committees.",
          reference_sources: ["M. Laxmikanth: Indian Polity - Historical Background", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD04_009",
        syllabusSubtopic: "Deccan Riots (1875)",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): In 1875, ryots in the Pune and Ahmednagar districts of the Bombay Presidency attacked the homes and shops of Gujarati and Marwari moneylenders (Sahukars), burning debt bonds and account books (Khatas).\nReason (R): The collapse of the American Civil War cotton boom, combined with a 50% increase in land revenue under the Ryotwari settlement, trapped the peasants in crushing debt.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains the economic depression and debt burden that led directly to the Deccan Riots of 1875.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. The Deccan riots targeted the legal debt instruments and mortgage deeds held by Sahukars rather than committing bodily violence.",
            "Reason (R)": "True and explains the Assertion. During the American Civil War (1861-65), cotton prices soared; when the war ended, cotton prices plummeted while the colonial state sharply hiked land revenue, forcing peasants to borrow at usurious rates."
          },
          elimination_technique: "The economic cause (cotton price collapse + revenue hike) directly explains the specific target of the riots (burning debt bonds). Option A is correct.",
          concept_takeaway: "The riots led to the Deccan Agriculturalists' Relief Act of 1879, which restricted the arrest and imprisonment of indebted peasants.",
          reference_sources: ["NCERT Class XII: Themes in Indian History - Part III", "Bipan Chandra: India's Struggle for Independence"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD04_010",
        syllabusSubtopic: "Kuka Movement (Punjab)",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "Consider the following statements regarding the Kuka (Namdhari) Movement in Punjab during the late 19th century:\n\n1. It was originally founded in 1840 by Bhagat Jawahar Mal (Sian Sahib) and Baba Balak Singh as a religious purification movement.\n2. Under Baba Ram Singh, the movement transformed into an active anti-British political movement advocating non-cooperation and boycott of British goods.\n3. The Kukas attacked slaughterhouses to protect cows and established their own postal network (Dawk system) across Punjab.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. The Kuka movement started as a Sikh reform movement under Bhagat Jawahar Mal, transformed under Baba Ram Singh into a political resistance with Swadeshi principles and its own postal system.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Bhagat Jawahar Mal and Baba Balak Singh founded the Namdhari sect in Western Punjab to purge Sikhism of Hindu caste practices and rituals.",
            "Statement 2": "Correct. Baba Ram Singh organized the Namdharis into a political force, pioneering the boycott of British education, courts, railway, and foreign cloth decades before Gandhi.",
            "Statement 3": "Correct. The Kukas set up their own parallel administration and communications network; their radical wing attacked butchers in Amritsar and Malerkotla."
          },
          elimination_technique: "Baba Ram Singh's early adoption of Swadeshi and parallel postal networks is a celebrated precursor to 20th-century Non-Cooperation.",
          concept_takeaway: "In 1872, the British brutally suppressed the movement by blowing 65 Kukas from the mouths of cannons at Malerkotla and deporting Baba Ram Singh to Rangoon.",
          reference_sources: ["Spectrum's A Brief History of Modern India", "From Plassey to Partition"]
        }
      }
    ]
  },

  // ==========================================================================
  // MODERN INDIAN HISTORY - MODULE 05
  // ==========================================================================
  {
    id: "MOD-HIST-05",
    subject: "Modern Indian History",
    moduleNumber: 5,
    moduleTitle: "Socio-Religious Reform Movements (19th & 20th Century)",
    curriculum: "UPSC Civil Services Examination (CSE)",
    stage: "Preliminary Examination (General Studies Paper-I)",
    topic: "Brahmo Samaj, Arya Samaj, Ramakrishna Mission, Aligarh Movement, Satyashodhak Samaj, Self-Respect Movement, and Temple Entry",
    title: "Modern Indian History · Module 05: Socio-Religious Reform Movements",
    questions: 10,
    duration: 20,
    marksPerQuestion: 2.0,
    negativeMarking: 0.66,
    difficulty: "Moderate to High",
    description: "Raja Ram Mohan Roy, Ishwar Chandra Vidyasagar, Swami Dayanand Saraswati, Jyotirao Phule, Periyar E.V. Ramasamy, Sri Narayana Guru, and Sir Syed Ahmad Khan.",
    questionList: [
      {
        id: "UPSC_MODHIST_MOD05_001",
        syllabusSubtopic: "Raja Ram Mohan Roy and the Brahmo Samaj",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "With reference to Raja Ram Mohan Roy, often called the 'Father of Modern Indian Renaissance', consider the following statements:\n\n1. He wrote 'Tuhfat-ul-Muwahhidin' (A Gift to Monotheists) in Persian arguing against polytheism and idolatry.\n2. He founded the Atmiya Sabha in 1814 and the Brahmo Sabha in 1828 to propagate monotheism and fight social evils like Sati.\n3. His relentless campaign led Governor-General Lord William Bentinck to declare Sati illegal and punishable as culpable homicide in 1829 (Regulation XVII).\n4. He opposed the introduction of Western scientific education in India, advocating exclusively for traditional Sanskrit learning.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "A",
        explanation: "Statements 1, 2, and 3 are correct. Statement 4 is incorrect because Ram Mohan Roy was a passionate champion of English and Western scientific education, helping establish Hindu College in 1817.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. In Tuhfat-ul-Muwahhidin (1803), he used rationalist arguments to critique idolatry and superstition.",
            "Statement 2": "Correct. He founded Atmiya Sabha (1814) for philosophical discussions and Brahmo Sabha (1828), later renamed Brahmo Samaj.",
            "Statement 3": "Correct. Regulation XVII of 1829 criminalized Sati in Bengal Presidency (extended to Madras and Bombay in 1830).",
            "Statement 4": "Incorrect. Ram Mohan Roy strongly supported Western scientific education, writing letters to Lord Amherst opposing government funding for Sanskrit colleges."
          },
          elimination_technique: "Ram Mohan Roy was a renowned modernist who championed Western science. Eliminating statement 4 removes options B and D.",
          concept_takeaway: "Ram Mohan Roy combined rationalism and monotheistic Vedanta to challenge orthodoxy without rejecting the core ethical foundations of Indian philosophy.",
          reference_sources: ["Spectrum's Modern India - Socio-Religious Reform Movements", "Bipan Chandra: History of Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD05_002",
        syllabusSubtopic: "Splits in the Brahmo Samaj",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "Regarding the evolution and ideological splits of the Brahmo Samaj in the 19th century, consider the following statements:\n\n1. Debendranath Tagore founded the Tattvabodhini Sabha in 1839 and infused the Brahmo Samaj with systematic philosophical study of the Upanishads.\n2. Keshab Chandra Sen radicalized the movement by preaching cosmopolitan universalism, inter-caste marriage, and inclusion of Christian teachings.\n3. In 1866, the first split occurred, leading to the formation of the 'Adi Brahmo Samaj' under Debendranath Tagore and the 'Brahmo Samaj of India' under Keshab Chandra Sen.\n4. The second split (1878) occurred when Keshab Chandra Sen married his minor daughter to the Maharaja of Cooch Behar, leading to the formation of the Sadharan Brahmo Samaj.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1, 2 and 3 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "D",
        explanation: "All four statements are correct. Debendranath founded Tattvabodhini Sabha, Keshab radicalized the movement, the 1866 split created Adi vs Brahmo Samaj of India, and the 1878 Cooch Behar marriage triggered the Sadharan Brahmo Samaj.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Debendranath joined the Brahmo Samaj in 1842 and merged Tattvabodhini Sabha with it.",
            "Statement 2": "Correct. Keshab Chandra Sen expanded the Samaj beyond Bengal and incorporated teachings of all world religions.",
            "Statement 3": "Correct. The 1866 split resulted in Debendranath retaining Adi Brahmo Samaj while Keshab formed the Brahmo Samaj of India.",
            "Statement 4": "Correct. Progressive followers led by Anandamohan Bose and Shibnath Shastri formed the Sadharan Brahmo Samaj in 1878."
          },
          elimination_technique: "All 4 points detail the major institutional milestones and splits of the Brahmo movement in Bengal.",
          concept_takeaway: "The internal debates in the Brahmo Samaj reflected the tension between indigenous Hindu revivalism (Tagore) and radical Westernized reform (Sen).",
          reference_sources: ["Sekhar Bandyopadhyay: From Plassey to Partition", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD05_003",
        syllabusSubtopic: "Ishwar Chandra Vidyasagar and Widow Remarriage",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): Pandit Ishwar Chandra Vidyasagar launched a passionate movement that resulted in the enactment of the Hindu Widows' Remarriage Act of 1856 (Act XV of 1856).\nReason (R): Vidyasagar cited ancient Sanskrit scriptures, particularly the Parashara Smriti, to prove to the orthodox clergy that the remarriage of widows was sanctioned by Hindu shastras.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains how Vidyasagar used scriptural authority from Parashara Smriti to legitimize widow remarriage, leading to the 1856 Act.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Vidyasagar submitted a petition signed by nearly 1,000 prominent citizens leading to the passage of Act XV of 1856 under Lord Dalhousie/Canning.",
            "Reason (R)": "True and explains the Assertion. As Principal of Sanskrit College, Vidyasagar defeated orthodox pandits on their own ground using Vedic and Smriti texts."
          },
          elimination_technique: "Vidyasagar's reform technique relied on internal scriptural argumentation rather than purely colonial secular rationalism. R explains A.",
          concept_takeaway: "Vidyasagar also opened Sanskrit College to non-Brahmin students and established over 35 model schools for girls in Bengal.",
          reference_sources: ["NCERT Class XII: Themes in Indian History", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD05_004",
        syllabusSubtopic: "Arya Samaj and Swami Dayanand Saraswati",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "Consider the following statements regarding Swami Dayanand Saraswati and the Arya Samaj:\n\n1. Swami Dayanand gave the call 'Go Back to the Vedas', asserting that the four Vedas were the infallible word of God containing all scientific truths.\n2. He authored 'Satyarth Prakash' (The Light of Truth) in Hindi to expound his philosophical doctrines.\n3. The Arya Samaj introduced the 'Shuddhi Movement' to reconvert individuals who had converted to Islam or Christianity back to Hinduism.\n4. In 1893, the Arya Samaj split over the issues of meat-eating vs. vegetarianism and Western scientific curriculum vs. traditional Gurukul education.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "D",
        explanation: "All four statements are correct. Dayanand Saraswati founded Arya Samaj (1875 in Bombay), wrote Satyarth Prakash, launched Shuddhi, and the Samaj split in 1893 into the DAV College faction and Gurukul Kangri faction.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Dayanand rejected Puranas, idol worship, and hereditary caste, arguing that pristine Vedic religion was egalitarian and rational.",
            "Statement 2": "Correct. Satyarth Prakash (1875) was his magnum opus written in Hindi to reach the common masses.",
            "Statement 3": "Correct. Shuddhi (purification) was designed to stem proselytization by Christian missionaries and Islamic revivalists.",
            "Statement 4": "Correct. The 1893 split led to the College Section (Lala Lajpat Rai & Lala Hansraj advocating English education at DAV Lahore) and the Gurukul Section (Swami Shraddhanand founding Gurukul Kangri at Haridwar)."
          },
          elimination_technique: "All four statements accurately trace the doctrines, literature, and educational split of the Arya Samaj.",
          concept_takeaway: "The Arya Samaj combined radical social reform (anti-untouchability, inter-caste marriages, women's education) with aggressive Hindu revivalism.",
          reference_sources: ["Bipan Chandra: History of Modern India", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD05_005",
        syllabusSubtopic: "Jyotirao Phule and Satyashodhak Samaj",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "With reference to Mahatma Jyotirao Phule and the social reform movement in Maharashtra, consider the following statements:\n\n1. He founded the 'Satyashodhak Samaj' (Truth-Seekers' Society) in 1873 to liberate the Shudras and Ati-Shudras from Brahminical oppression.\n2. He wrote the famous book 'Gulamgiri' (Slavery) in 1873, dedicating it to the American abolitionist movement against Negro slavery.\n3. Along with his wife Savitribai Phule, he opened India's first indigenous school for girls at Bhide Wada in Pune in 1848.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. Jyotirao Phule founded Satyashodhak Samaj (1873), wrote Gulamgiri, and opened the historic Pune girls' school with Savitribai Phule (1848).",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Satyashodhak Samaj rejected Brahmin priests as intermediaries and conducted religious ceremonies without Brahmin priests.",
            "Statement 2": "Correct. Gulamgiri linked the oppression of lower castes in India to the enslavement of Black Americans, dedicating the text to American anti-slavery fighters.",
            "Statement 3": "Correct. Jyotirao and Savitribai Phule established pioneering schools for girls and untouchable children in Pune despite intense social harassment."
          },
          elimination_technique: "Phule's Gulamgiri and Satyashodhak Samaj are foundational texts of the anti-caste movement in India.",
          concept_takeaway: "Phule constructed an alternate non-Aryan historical narrative, projecting King Bali as the benevolent ruler of the masses overthrown by the Aryan invaders.",
          reference_sources: ["NCERT Class VIII: Women, Caste and Reform", "From Plassey to Partition"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD05_006",
        syllabusSubtopic: "Self-Respect Movement and Justice Party",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "Regarding the Non-Brahmin movements in South India during the early 20th century, consider the following statements:\n\n1. The South Indian Liberal Federation (Justice Party) was founded in 1916 by Dr. C. Natesa Mudaliar, P. Theagaraya Chetty, and T.M. Nair.\n2. E.V. Ramasamy 'Periyar' launched the 'Self-Respect Movement' (Suyamariyathai Iyakkam) in 1925 after resigning from the Congress over communal representation.\n3. The Self-Respect Movement advocated 'Self-Respect Marriages' (Suyamariyathai Thirumanam) conducted without Brahmin priests, holy fire, or Sanskrit mantras.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. The Justice Party was founded in 1916, Periyar started the Self-Respect Movement in 1925, and introduced priest-less Self-Respect Marriages.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The Justice Party challenged the Brahmin hegemony in administrative services and Madras legislative council.",
            "Statement 2": "Correct. Periyar left Congress in 1925 after the Cheranmadevi Gurukulam controversy (where lower-caste students were segregated during meals).",
            "Statement 3": "Correct. Self-Respect Marriages legalized contractual, egalitarian unions free from Brahminical rites and dowry."
          },
          elimination_technique: "All statements accurately capture the political and social milestones of the Dravidian self-respect movement.",
          concept_takeaway: "In 1944, Periyar merged the Justice Party and Self-Respect League to form the social reform organization 'Dravidar Kazhagam'.",
          reference_sources: ["Spectrum's Modern India", "Sekhar Bandyopadhyay: From Plassey to Partition"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD05_007",
        syllabusSubtopic: "Sri Narayana Guru and SNDP Yogam (Kerala)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "With reference to Sri Narayana Guru and the social reform movement in Kerala, consider the following statements:\n\n1. In 1888, he installed a Shivalinga made of stone at Aruvippuram, declaring that 'Here is the place where all people live in fraternity without caste distinction or religious rivalry.'\n2. He gave the famous universal motto: 'One Caste, One Religion, One God for Man' (Oru Jathi, Oru Matham, Oru Daivam Manushyanu).\n3. He founded the Sri Narayana Dharma Paripalana (SNDP) Yogam in 1903 with poet Kumaran Asan as its first general secretary to uplift the Ezhavas.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. Sri Narayana Guru performed the historic Aruvippuram installation (1888), coined 'One Caste, One Religion, One God', and founded the SNDP Yogam (1903).",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The Aruvippuram Prathishta directly challenged the Brahmin monopoly over temple consecration and idol installation.",
            "Statement 2": "Correct. His Advaitic universalist slogan became the rallying cry of lower-caste empowerment across Kerala.",
            "Statement 3": "Correct. SNDP Yogam fought for civil rights, government employment, and temple entry for the disenfranchised Ezhava (toddy-tapper) community."
          },
          elimination_technique: "Sri Narayana Guru's Aruvippuram movement and SNDP Yogam are central to Kerala's modern social history.",
          concept_takeaway: "His disciple Sahodaran Ayyappan radicalized the slogan further into: 'No Caste, No Religion, No God for Man'.",
          reference_sources: ["Bipan Chandra: India's Struggle for Independence", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD05_008",
        syllabusSubtopic: "Temple Entry Movements: Vaikom and Guruvayur",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "Consider the following statements regarding the Temple Entry Satyagrahas in Kerala:\n\n1. The Vaikom Satyagraha (1924–25) was launched to secure the right of untouchables (Avarnas) to walk on the public roads surrounding the Vaikom Mahadeva Temple.\n2. Prominent leaders of the Vaikom Satyagraha included T.K. Madhavan, K.P. Kesava Menon, and George Joseph, and it received active support from Periyar and Mahatma Gandhi.\n3. The Guruvayur Satyagraha (1931–32) was led by K. Kelappan, where poet Subramanian Tirumambu and A.K. Gopalan played frontline roles.\n4. In 1936, the Maharaja of Travancore issued the historic 'Temple Entry Proclamation', opening all state-run temples to all Hindus.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "D",
        explanation: "All four statements are correct. Vaikom (1924), Guruvayur (1931), and the Travancore Temple Entry Proclamation (1936) marked the victorious culmination of the temple entry struggles.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Vaikom was not for entering the inner sanctum, but for basic civil access to roads surrounding the temple.",
            "Statement 2": "Correct. T.K. Madhavan initiated the resolution at the Kakinada Congress (1923), while Periyar was imprisoned twice in Travancore, earning the title 'Vaikom Veeran'.",
            "Statement 3": "Correct. K. Kelappan undertook a fast unto death at Guruvayur, breaking it only upon Gandhi's request.",
            "Statement 4": "Correct. Chithira Thirunal Balarama Varma signed the historic 1936 Proclamation abolishing untouchability in Travancore temples."
          },
          elimination_technique: "All 4 statements describe the chronological milestones of the temple entry movement in Travancore/Malabar.",
          concept_takeaway: "The Temple Entry struggles successfully integrated anti-caste social movements with the mainstream Indian National Congress.",
          reference_sources: ["Spectrum's Modern India - Temple Entry Movement", "Bipan Chandra: India's Struggle for Independence"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD05_009",
        syllabusSubtopic: "Sir Syed Ahmad Khan and the Aligarh Movement",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "Regarding Sir Syed Ahmad Khan and the Aligarh Movement, consider the following statements:\n\n1. He started the journal 'Tahzib-ul-Akhlaq' (Social Reformer) in Urdu to advocate modern scientific rationalism among Indian Muslims.\n2. He founded the Muhammadan Anglo-Oriental (MAO) College at Aligarh in 1875, which later developed into the Aligarh Muslim University (AMU).\n3. He established the Scientific Society in 1864 to translate English scientific and historical works into Urdu.\n4. He advised Indian Muslims to actively join the Indian National Congress from its inception in 1885 to secure democratic rights.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "A",
        explanation: "Statements 1, 2, and 3 are correct. Statement 4 is incorrect because Sir Syed opposed the Congress, advising Muslims to stay away from politics and focus on modern education under British patronage.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Tahzib-ul-Akhlaq advocated liberal religious interpretation, eradication of polygamy, and education of women.",
            "Statement 2": "Correct. MAO College (1875) combined Islamic religious instruction with modern Western arts and sciences.",
            "Statement 3": "Correct. The Scientific Society (founded at Ghazipur, later shifted to Aligarh) translated Western textbooks into Urdu.",
            "Statement 4": "Incorrect. Sir Syed feared that majority-rule democracy would disadvantage the Muslim minority; he founded the United Patriotic Association (1888) with Raja Shiv Prasad of Benaras to oppose the Congress."
          },
          elimination_technique: "Sir Syed's opposition to the early Congress is a standard historical fact. Eliminating statement 4 removes options B, C, and D.",
          concept_takeaway: "Sir Syed prioritized modern education over early political agitation to help the Muslim elite recover from the post-1857 British backlash.",
          reference_sources: ["Bipan Chandra: History of Modern India", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD05_010",
        syllabusSubtopic: "Social Legislation under the British",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "High",
        question: "Consider the following pairs of social reform legislations enacted during British rule and their primary provisions:\n\n1. Native Marriage Act (Civil Marriage Act, 1872) : Prohibited child marriage and polygamy, fixing minimum marriage age for girls at 14\n2. Age of Consent Act (1891) : Raised the age of consent for sexual intercourse for girls from 10 to 12 years\n3. Child Marriage Restraint Act (Sarda Act, 1929) : Fixed minimum age of marriage at 14 for females and 18 for males\n\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", text: "Only one pair" },
          { id: "B", text: "Only two pairs" },
          { id: "C", text: "All three pairs" },
          { id: "D", text: "None of the pairs" }
        ],
        answer: "C",
        explanation: "All three pairs are correctly matched: Native Marriage Act 1872 (Age 14 for girls), Age of Consent Act 1891 (Age 12), and Sarda Act 1929 (Age 14 for girls, 18 for boys).",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1": "Correctly matched. Act III of 1872 was passed due to Keshab Chandra Sen's efforts, legalizing inter-caste civil marriages.",
            "Pair 2": "Correctly matched. Passed following the tragic death of child-bride Phulmoni Dasi; vehemently opposed by Bal Gangadhar Tilak as colonial interference in Hindu religion.",
            "Pair 3": "Correctly matched. Sponsored by Harbilas Sarda, the 1929 Act applied to all communities across British India."
          },
          elimination_technique: "These 3 Acts represent the key legal milestones regulating child marriage in colonial India. All 3 are accurate.",
          concept_takeaway: "Social legislation in British India was often driven by Indian social reformers petitioning the colonial state against fierce orthodox opposition.",
          reference_sources: ["Spectrum's A Brief History of Modern India - Social Legislations", "B.L. Grover: Modern Indian History"]
        }
      }
    ]
  },

  // ==========================================================================
  // MODERN INDIAN HISTORY - MODULE 06
  // ==========================================================================
  {
    id: "MOD-HIST-06",
    subject: "Modern Indian History",
    moduleNumber: 6,
    moduleTitle: "Foundation of INC and the Moderate Phase (1885–1905)",
    curriculum: "UPSC Civil Services Examination (CSE)",
    stage: "Preliminary Examination (General Studies Paper-I)",
    topic: "Pre-Congress Associations, Foundation of INC, Safety Valve Theory, Moderate Leaders and Methods, Economic Critique of Colonialism, and Indian Councils Act 1892",
    title: "Modern Indian History · Module 06: INC Foundation & Moderate Phase (1885–1905)",
    questions: 10,
    duration: 20,
    marksPerQuestion: 2.0,
    negativeMarking: 0.66,
    difficulty: "Moderate to High",
    description: "East India Association, Indian National Association, A.O. Hume, W.C. Bonnerjee, Dadabhai Naoroji (Drain Theory), R.C. Dutt, and Indian Councils Act 1892.",
    questionList: [
      {
        id: "UPSC_MODHIST_MOD06_001",
        syllabusSubtopic: "Pre-Congress Political Associations",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "Moderate",
        question: "Consider the following pairs of early political associations and their founders:\n\n1. East India Association (London, 1866) : Dadabhai Naoroji\n2. Poona Sarvajanik Sabha (1870) : M.G. Ranade and G.V. Joshi\n3. Indian Association of Calcutta (1876) : Surendranath Banerjea and Ananda Mohan Bose\n4. Madras Mahajana Sabha (1884) : M. Veeraraghavachariar, G. Subramania Iyer, and P. Anandacharlu\n\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", text: "Only one pair" },
          { id: "B", text: "Only two pairs" },
          { id: "C", text: "Only three pairs" },
          { id: "D", text: "All four pairs" }
        ],
        answer: "D",
        explanation: "All four pairs are correctly matched: East India Association (Naoroji), Poona Sarvajanik Sabha (Ranade), Indian Association (Banerjea & Bose), and Madras Mahajana Sabha (Iyer, Anandacharlu).",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1": "Correctly matched. Founded in London to lobby British MPs on Indian grievances.",
            "Pair 2": "Correctly matched. Mediated between the government and peasants during Deccan agrarian distress.",
            "Pair 3": "Correctly matched. The most active pre-Congress all-India body; organized nationwide agitation against lowering the ICS age limit from 21 to 19.",
            "Pair 4": "Correctly matched. Unified regional political work in the Madras Presidency."
          },
          elimination_technique: "These four organizations laid the organizational groundwork for the foundation of the Indian National Congress in 1885.",
          concept_takeaway: "The pre-Congress associations represented the rise of the educated middle class demanding civil rights and representative government.",
          reference_sources: ["Spectrum's Modern India", "Bipan Chandra: India's Struggle for Independence"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD06_002",
        syllabusSubtopic: "Foundation of INC and the 'Safety Valve' Theory",
        patternType: "Assertion and Reason",
        difficulty: "Moderate to High",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): Early nationalist leaders like Gopal Krishna Gokhale utilized Allan Octavian Hume as a 'Lightning Conductor' rather than the Congress being merely a British 'Safety Valve'.\nReason (R): Gokhale recognized that if an Indian had initiated an all-India political movement in 1885, colonial authorities would have instantly banned and crushed it, but Hume's status as a retired British civil servant provided protective political legitimacy.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains Bipan Chandra's classic 'Lightning Conductor' thesis countering the colonial 'Safety Valve' myth.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. While Dufferin and Hume may have hoped to defuse mass discontent (Safety Valve), Indian nationalists strategically used Hume as an umbrella to avoid suppression.",
            "Reason (R)": "True and explains the Assertion. Gokhale famously stated: 'No Indian could have started the Indian National Congress... If an Indian had come forward to start such a movement, the officials would have found ways to stifle it instantly.'"
          },
          elimination_technique: "Gokhale's explicit quote provides the exact causal justification for why Indian leaders allowed Hume to take the public lead in 1885. R explains A.",
          concept_takeaway: "The Congress was the culmination of indigenous nationalist mobilization rather than a British conspiracy.",
          reference_sources: ["Bipan Chandra: India's Struggle for Independence - Chapter 5", "From Plassey to Partition"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD06_003",
        syllabusSubtopic: "First Session of the INC (1885)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "With reference to the first session of the Indian National Congress held in December 1885, consider the following statements:\n\n1. It was originally scheduled to be held in Poona, but was shifted to Bombay due to an outbreak of cholera in Poona.\n2. It met at Gokuldas Tejpal Sanskrit College in Bombay under the presidency of Womesh Chandra Bonnerjee.\n3. The session was attended by 72 delegates representing various provinces of British India.\n4. Surendranath Banerjea could not attend the first session because he was convening the second National Conference in Calcutta at the same time.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "D",
        explanation: "All four statements are correct. Shifted from Poona to Bombay (cholera), W.C. Bonnerjee presided over 72 delegates at Gokuldas Tejpal Sanskrit College, and Surendranath Banerjea was absent due to the National Conference.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Cholera in Poona forced the organizers to shift the venue to Bombay.",
            "Statement 2": "Correct. W.C. Bonnerjee (a prominent Calcutta barrister) was elected the first President.",
            "Statement 3": "Correct. 72 delegates (mostly lawyers, journalists, and merchants) attended the foundational session.",
            "Statement 4": "Correct. Banerjea merged his National Conference with the INC during its second session in Calcutta in 1886."
          },
          elimination_technique: "All 4 statements represent verified facts concerning the inaugural December 1885 session.",
          concept_takeaway: "The early Congress focused on building all-India national unity, creating a common political platform, and training public opinion.",
          reference_sources: ["Spectrum's Modern India", "NCERT Class XII: Themes in Indian History"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD06_004",
        syllabusSubtopic: "Economic Critique of British Colonialism",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "The Moderate leaders are celebrated for formulating the foundational economic critique of British imperialism. Consider the following statements:\n\n1. Dadabhai Naoroji propounded the 'Drain of Wealth' theory in his book 'Poverty and Un-British Rule in India'.\n2. Romesh Chunder Dutt (R.C. Dutt) published the landmark economic treatise 'The Economic History of India' analyzing the ruin of handicrafts and high land revenue.\n3. Dinshaw Wacha and Dadabhai Naoroji testified before the Welby Commission (1895) on imperial military expenditure and financial mismanagement.\n4. The Moderates demanded the immediate industrialization of India through protective tariffs and state support for indigenous enterprises.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1, 3 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "D",
        explanation: "All four statements are correct. Naoroji's Drain theory, R.C. Dutt's Economic History, the Welby Commission testimonies, and demands for industrialization formed the core economic nationalist critique.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Naoroji identified Home Charges, remittances, and trade surpluses as an unrequited drain of Indian capital to Britain.",
            "Statement 2": "Correct. R.C. Dutt traced the de-industrialization and recurring famines to excessive colonial land assessments and free trade dogmas.",
            "Statement 3": "Correct. Lord Welby's Royal Commission on Indian Expenditure heard testimony from Naoroji, Gokhale, and Wacha.",
            "Statement 4": "Correct. They recognized that without tariffs and modern industries, India was being reduced to an agricultural appendage of Britain."
          },
          elimination_technique: "The economic critique was the greatest historic contribution of the Moderate phase (1885-1905). All 4 statements are accurate.",
          concept_takeaway: "The economic nationalists shattered the moral claim of the British Raj to be a 'civilizing mission' by proving it was an engine of systematic impoverishment.",
          reference_sources: ["Bipan Chandra: The Rise and Growth of Economic Nationalism in India", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD06_005",
        syllabusSubtopic: "Methods and Philosophy of the Moderates",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "Regarding the political methods and ideology of the Moderates (1885–1905), consider the following statements:\n\n1. Their method of political work was characterized by '3Ps': Petitions, Prayers, and Protests within constitutional limits.\n2. They believed that the British people and Parliament were fundamentally fair-minded and would grant democratic rights if educated about Indian realities.\n3. They demanded the complete severance of all political ties with the British Empire (Purna Swaraj) from the very beginning.\n\nWhich of the statements given above is/are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "A",
        explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect because Moderates demanded administrative reforms, Indianization of services, and legislative expansion within the Empire, not complete independence.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The Moderates strictly adhered to constitutional agitation through public meetings, press articles, and memorandums.",
            "Statement 2": "Correct. They maintained a profound faith in British liberal traditions, setting up the British Committee of the INC in London and publishing the journal 'India'.",
            "Statement 3": "Incorrect. The demand for Purna Swaraj did not emerge until decades later (Lahore 1929). Early Moderates sought self-government on the model of self-governing colonies (Dominion Status)."
          },
          elimination_technique: "Statement 3 claims Moderates demanded 'Purna Swaraj from the very beginning', which contradicts their gradualist constitutional philosophy. Eliminating 3 leaves Option A.",
          concept_takeaway: "While their methods were cautious, the Moderates laid the intellectual foundation and politicized the Indian public.",
          reference_sources: ["Spectrum's A Brief History of Modern India", "From Plassey to Partition"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD06_006",
        syllabusSubtopic: "Indian Councils Act 1892",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "The Indian Councils Act of 1892 was passed as a concession to Congress demands. Which of the following constitutional reforms were introduced by this Act?\n\n1. It increased the number of non-official members in both Central and Provincial Legislative Councils.\n2. It gave legislative members the right to discuss the annual financial statement (budget) under certain conditions.\n3. It allowed members to ask supplementary questions and vote on budget allocations.\n4. It introduced the principle of representation through indirect election/recommendation by universities, municipalities, and chambers of commerce.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 2 and 4 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "A",
        explanation: "Statements 1, 2, and 4 are correct. Statement 3 is incorrect because members had no right to vote on the budget or ask supplementary questions under the 1892 Act (supplementary questions were allowed only in 1909).",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Non-official members were increased, though official majorities were maintained.",
            "Statement 2": "Correct. For the first time, members could discuss the budget and question executive policies on public matters (with 6 days' notice).",
            "Statement 3": "Incorrect. The budget could not be voted upon, nor could amendments be moved. Supplementary questions were granted only under the Morley-Minto Reforms of 1909.",
            "Statement 4": "Correct. Local bodies (municipalities, district boards) nominated representatives, introducing the indirect election principle without using the word 'election'."
          },
          elimination_technique: "Voting on budget and supplementary questions was strictly barred in 1892. Eliminating statement 3 removes options B, C, and D.",
          concept_takeaway: "Gopal Krishna Gokhale and Pherozeshah Mehta used the limited budget discussion provisions of 1892 to brilliantly critique colonial military expenditure.",
          reference_sources: ["M. Laxmikanth: Indian Polity - Historical Background", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD06_007",
        syllabusSubtopic: "British Reaction to the Early Congress",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): Viceroy Lord Dufferin, who initially treated the Congress with neutral courtesy, ridiculed it in 1888 as representing only a 'microscopic minority' of the Indian people.\nReason (R): The British administration realized that the Congress was rapidly evolving from a tame debating club into a national forum challenging the financial and political legitimacy of British rule.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains why the British government turned openly hostile to the Congress, prompting Dufferin's famous 'microscopic minority' taunt.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. In his St. Andrew's Day speech (1888), Dufferin launched a bitter verbal assault on the Congress.",
            "Reason (R)": "True and explains the Assertion. The early Congress mass pamphlet campaigns (like 'A Conversation between Maulvi Fariduddin and Rambux') alarmed British administrators."
          },
          elimination_technique: "The causal link between Congress's growing anti-colonial critique and British administrative hostility is direct. Option A is correct.",
          concept_takeaway: "The British adopted a strategy of open hostility and divide-and-rule, encouraging Sir Syed Ahmad Khan and Raja Shiv Prasad to form loyalist counter-organizations.",
          reference_sources: ["Bipan Chandra: India's Struggle for Independence", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD06_008",
        syllabusSubtopic: "Dadabhai Naoroji: The Grand Old Man of India",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "Consider the following statements regarding Dadabhai Naoroji:\n\n1. He served as the President of the Indian National Congress three times (1886 Calcutta, 1893 Lahore, and 1906 Calcutta).\n2. In 1892, he became the first Asian to be elected to the British House of Commons, winning as a candidate of the Liberal Party from Central Finsbury.\n3. At the 1906 Calcutta session of the INC, he officially declared that the goal of the Congress was 'Swaraj' (Self-Government).\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. Dadabhai Naoroji presided over 3 INC sessions, became the first Indian MP in the British Parliament (1892), and proclaimed 'Swaraj' at Calcutta (1906).",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Naoroji presided over the 2nd (1886), 9th (1893), and 22nd (1906) sessions of the INC.",
            "Statement 2": "Correct. Elected to the House of Commons from Central Finsbury on a Liberal ticket in 1892.",
            "Statement 3": "Correct. To avert a split between Moderates and Extremists at Calcutta (1906), he declared Swaraj as the national objective."
          },
          elimination_technique: "All 3 facts are classic Prelims milestones associated with Dadabhai Naoroji.",
          concept_takeaway: "Naoroji used the floor of the British Parliament to relentlessly present the grievances of the Indian taxpayer.",
          reference_sources: ["Spectrum's Modern India", "NCERT Class XII: Themes in Indian History"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD06_009",
        syllabusSubtopic: "Servants of India Society",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "With reference to the 'Servants of India Society', consider the following statements:\n\n1. It was founded in 1905 in Pune by Gopal Krishna Gokhale with the help of M.G. Ranade.\n2. Its primary aim was to train national missionaries for the service of India and promote the true interests of the Indian people by constitutional means.\n3. The members of the society took vows of poverty and devoted their lives to public work without seeking personal gain.\n4. Following Gokhale's death in 1915, Srinivasa Sastri served as its President.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1, 3 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "D",
        explanation: "All four statements are correct. Founded in 1905 by Gokhale, the Servants of India Society trained secular social workers who took vows of poverty and was later led by Srinivasa Sastri.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Gokhale founded it in Pune in 1905 to spiritualize public life in India.",
            "Statement 2": "Correct. It focused on famine relief, tribal welfare, education, and trade union organization.",
            "Statement 3": "Correct. Members received a nominal subsistence allowance and pledged not to earn money through private professions.",
            "Statement 4": "Correct. V.S. Srinivasa Sastri succeeded Gokhale as President of the Society."
          },
          elimination_technique: "The Servants of India Society was Gokhale's premier institutional legacy. All 4 statements are verified.",
          concept_takeaway: "Mahatma Gandhi regarded Gokhale as his political guru due to the ethical discipline exemplified by the Servants of India Society.",
          reference_sources: ["Spectrum's Modern India", "Bipan Chandra: History of Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD06_010",
        syllabusSubtopic: "Limitations of the Moderate Phase",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "Which of the following were major limitations of the Moderate phase of the Indian National Congress (1885–1905)?\n\n1. It lacked a broad mass base, remaining largely confined to urban educated elites, lawyers, and journalists.\n2. The Moderates failed to understand the power of mass mobilization and lacked confidence in the political capacity of the uneducated peasantry.\n3. They completely rejected the demand for Indianization of the civil services and military expenditure reduction.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "A",
        explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect because simultaneous ICS exams and military expenditure reduction were central demands of the Moderates.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The early Congress had almost no organic connection with the rural peasantry or working class.",
            "Statement 2": "Correct. The Moderates feared that premature mass involvement would provoke violent British repression.",
            "Statement 3": "Incorrect. Simultaneous ICS examinations in India and Britain and reduction of military budgets were their most persistent demands."
          },
          elimination_technique: "Statement 3 contradicts the core Moderate platform. Eliminating 3 removes options B, C, and D, leaving A.",
          concept_takeaway: "The limitations of the Moderates in mass mobilization created the ideological space for the rise of the Extremists (Lal-Bal-Pal).",
          reference_sources: ["Bipan Chandra: India's Struggle for Independence", "Spectrum's Modern India"]
        }
      }
    ]
  },

  // ==========================================================================
  // MODERN INDIAN HISTORY - MODULE 07
  // ==========================================================================
  {
    id: "MOD-HIST-07",
    subject: "Modern Indian History",
    moduleNumber: 7,
    moduleTitle: "The Extremist Phase and Swadeshi Movement (1905–1909)",
    curriculum: "UPSC Civil Services Examination (CSE)",
    stage: "Preliminary Examination (General Studies Paper-I)",
    topic: "Partition of Bengal (1905), Swadeshi and Boycott Movement, Rise of Extremism (Lal-Bal-Pal, Aurobindo), Surat Split (1907), and Morley-Minto Reforms (1909)",
    title: "Modern Indian History · Module 07: Swadeshi Movement & Morley-Minto (1905–1909)",
    questions: 10,
    duration: 20,
    marksPerQuestion: 2.0,
    negativeMarking: 0.66,
    difficulty: "Moderate to High",
    description: "Curzon's Bengal partition, Raksha Bandhan protest, National Council of Education, Bengal Chemical, Surat Split 1907, and separate electorates in 1909.",
    questionList: [
      {
        id: "UPSC_MODHIST_MOD07_001",
        syllabusSubtopic: "Partition of Bengal (1905)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "With reference to the Partition of Bengal announced by Viceroy Lord Curzon in 1905, consider the following statements:\n\n1. The official administrative justification given by the British was that Bengal was too large and populous to be governed by a single Lieutenant-Governor.\n2. The real political objective was to weaken the nerve center of Indian nationalism by dividing Bengalis on linguistic and religious lines.\n3. The day the partition took effect (October 16, 1905) was observed as a day of national mourning, fasting, and Raksha Bandhan across Bengal.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. Curzon justified partition as administrative convenience, while the real motive was communal/linguistic division, and October 16, 1905 was observed with Raksha Bandhan and fasting.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Bengal Presidency had a population of 78 million; administrative efficiency was the official pretext.",
            "Statement 2": "Correct. Home Secretary H.H. Risley noted: 'Bengal united is a power; Bengal divided will pull in several different ways.'",
            "Statement 3": "Correct. Rabindranath Tagore composed 'Amar Sonar Bangla' and suggested tying Rakhi threads to symbolize unbreakable Hindu-Muslim unity."
          },
          elimination_technique: "All 3 statements detail the official pretext, covert motive, and popular symbolic protest on October 16, 1905.",
          concept_takeaway: "The Partition of Bengal transformed Indian nationalism from polite elite petitions into passionate mass agitation.",
          reference_sources: ["Spectrum's Modern India", "Bipan Chandra: India's Struggle for Independence"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD07_002",
        syllabusSubtopic: "Swadeshi and Boycott Methods",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "The Swadeshi Movement (1905–1908) witnessed the birth of innovative techniques of political struggle. Which of the following were prominent features of the movement?\n\n1. Public burning and picketing of foreign cloth and British manufactured goods.\n2. Formation of 'Samitis' (volunteer corps) like the Swadesh Bandhab Samiti led by Ashwini Kumar Dutta in Barisal.\n3. Establishment of indigenous enterprises such as the Bengal Chemical Swadeshi Stores founded by Acharya P.C. Ray.\n4. Setting up of the National Council of Education (1906) and the Bengal National College with Aurobindo Ghose as its principal.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1, 3 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "D",
        explanation: "All four statements are correct. Swadeshi featured boycott, volunteer samitis (Ashwini Kumar Dutta), indigenous industry (P.C. Ray's Bengal Chemicals), and national education (Bengal National College under Aurobindo).",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Foreign salt, sugar, and Manchester textiles were boycotted, and washermen refused to wash foreign clothes.",
            "Statement 2": "Correct. Ashwini Kumar Dutta's Swadesh Bandhab Samiti mobilized over 150 village branches across Barisal.",
            "Statement 3": "Correct. Acharya P.C. Ray set up Bengal Chemical and Chidambaram Pillai launched the Swadeshi Steam Navigation Company in Tuticorin.",
            "Statement 4": "Correct. In August 1906, the National Council of Education was established to impart education on national lines."
          },
          elimination_technique: "All 4 points summarize the core constructive and agitational innovations of Swadeshi.",
          concept_takeaway: "Swadeshi was not merely an economic boycott, but a comprehensive cultural and national renaissance.",
          reference_sources: ["NCERT Class XII: Themes in Indian History", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD07_003",
        syllabusSubtopic: "All-India Spread of Swadeshi",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "Moderate",
        question: "Consider the following pairs of regional leaders and the areas where they led the Swadeshi Movement:\n\n1. Bal Gangadhar Tilak : Bombay and Pune (Maharashtra)\n2. Lala Lajpat Rai and Ajit Singh : Punjab and Delhi\n3. Syed Haider Raza : Delhi\n4. V.O. Chidambaram Pillai : Madras Presidency (Tirunelveli/Tuticorin)\n\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", text: "Only one pair" },
          { id: "B", text: "Only two pairs" },
          { id: "C", text: "Only three pairs" },
          { id: "D", text: "All four pairs" }
        ],
        answer: "D",
        explanation: "All four pairs are correctly matched: Tilak (Maharashtra), Lajpat Rai & Ajit Singh (Punjab), Syed Haider Raza (Delhi), and V.O. Chidambaram Pillai (Madras).",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1": "Correctly matched. Tilak popularized the movement through Ganapati and Shivaji festivals.",
            "Pair 2": "Correctly matched. Lala Lajpat Rai and Ajit Singh (founder of Anjuman-i-Mohisban-i-Watan) mobilized Punjab.",
            "Pair 3": "Correctly matched. Syed Haider Raza organized large public meetings and Swadeshi stores in Delhi.",
            "Pair 4": "Correctly matched. Chidambaram Pillai and Subramania Bharati spearheaded the movement in Tamil Nadu."
          },
          elimination_technique: "Extremist leaders spread the movement across India, breaking out of Bengal's geographical boundary. All 4 pairs are accurate.",
          concept_takeaway: "The all-India expansion of the movement was the central bone of contention between Moderates and Extremists.",
          reference_sources: ["Spectrum's Modern India", "Bipan Chandra: India's Struggle for Independence"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD07_004",
        syllabusSubtopic: "The Surat Split (1907)",
        patternType: "Assertion and Reason",
        difficulty: "Moderate to High",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): The Indian National Congress split into two hostile factions (Moderates and Extremists) at the Surat Session in December 1907.\nReason (R): The Extremists wanted to extend the Boycott and Swadeshi movement across the entire country and apply it to all forms of association with the British government, while the Moderates wanted to restrict it strictly to Bengal and only to foreign cloth.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains the fundamental ideological disagreement over the scope of Swadeshi that caused the 1907 Surat split.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. The session at Surat (presided over by Rashbehari Ghosh) ended in violent chaos with shoes and chairs thrown, splitting the INC.",
            "Reason (R)": "True and explains the Assertion. The Extremists (Tilak, Aurobindo) demanded all-India non-cooperation and Swaraj, whereas Moderates (Pherozeshah Mehta, Gokhale) feared government suppression."
          },
          elimination_technique: "The tactical divergence regarding the geographic and programmatic scope of boycott (Reason) is the classic explanation for the Surat split (Assertion). Option A is correct.",
          concept_takeaway: "The Surat split paralyzed the Congress for nearly a decade, allowing the British to unleash severe repression on the Extremists (Tilak was sentenced to 6 years in Mandalay jail).",
          reference_sources: ["Bipan Chandra: India's Struggle for Independence", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD07_005",
        syllabusSubtopic: "Foundation of the Muslim League (1906)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "With reference to the foundation of the All India Muslim League in 1906, consider the following statements:\n\n1. In October 1906, the 'Shimla Deputation' led by the Aga Khan met Viceroy Lord Minto to demand separate electorates for Muslims.\n2. The All India Muslim League was formally founded at Dacca in December 1906 under the leadership of Nawab Salimullah, Nawab Mohsin-ul-Mulk, and the Aga Khan.\n3. The League supported the Partition of Bengal and opposed the Swadeshi boycott movement.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. The Shimla Deputation (1906) led by the Aga Khan met Minto, the League was founded at Dacca in Dec 1906, and it supported the Partition of Bengal.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Lord Minto welcomed the Shimla Deputation, viewing separate communal representation as a counterpoise to Congress.",
            "Statement 2": "Correct. Founded during the All India Muhammadan Educational Conference in Dacca; Aga Khan was chosen as its first permanent president.",
            "Statement 3": "Correct. The League passed resolutions supporting partition (which created a Muslim-majority Eastern Bengal) and pledging loyalty to the Crown."
          },
          elimination_technique: "All 3 statements detail the origins, patrons, and political platform of the early Muslim League.",
          concept_takeaway: "The foundation of the Muslim League institutionalized communal politics in colonial India.",
          reference_sources: ["Sekhar Bandyopadhyay: From Plassey to Partition", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD07_006",
        syllabusSubtopic: "Morley-Minto Reforms (Indian Councils Act 1909)",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "The Indian Councils Act of 1909 (Morley-Minto Reforms) introduced significant constitutional modifications. Which of the following were provisions of this Act?\n\n1. It introduced a system of 'Separate Electorates' for Muslims, legalizing communalism in Indian politics.\n2. It permitted members of the legislative councils to move resolutions on the budget and ask supplementary questions.\n3. Satyendra Prasanna Sinha became the first Indian to be appointed to the Viceroy's Executive Council as a law member.\n4. It created a non-official elected majority in the Central Legislative Council.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "A",
        explanation: "Statements 1, 2, and 3 are correct. Statement 4 is incorrect because an official majority was strictly retained in the Central Legislative Council (non-official majorities were allowed only in provincial councils).",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Muslims were given separate representation with seats reserved and voting restricted to Muslims only.",
            "Statement 2": "Correct. Council members could ask supplementary questions and debate budget resolutions (though not vote on the whole budget).",
            "Statement 3": "Correct. S.P. Sinha was appointed as the first Indian member of the Viceroy's Executive Council.",
            "Statement 4": "Incorrect. Official British majorities were maintained at the center; provincial councils were allowed non-official majorities (which still included nominated members, not pure elected majorities)."
          },
          elimination_technique: "The British never conceded an elected majority at the Center in 1909. Eliminating statement 4 removes options B and D, leaving A.",
          concept_takeaway: "Lord Minto is known as the 'Father of Communal Electorate'. Morley famously wrote to Minto: 'We are sowing dragon's teeth and the harvest will be bitter.'",
          reference_sources: ["M. Laxmikanth: Indian Polity - Historical Background", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD07_007",
        syllabusSubtopic: "Aurobindo Ghose and Passive Resistance",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "In 1907, Aurobindo Ghose published a series of articles titled 'Doctrine of Passive Resistance' in the journal 'Bande Mataram'. Which of the following were core ideas propounded in this doctrine?\n\n1. Boycott of foreign goods and simultaneous constructive promotion of Swadeshi industries.\n2. Boycott of government-controlled educational institutions and establishment of national schools.\n3. Boycott of British courts and settlement of disputes through national arbitration courts.\n4. Refusal to pay taxes as the ultimate stage if administrative coercion became intolerable.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1, 3 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "D",
        explanation: "All four statements are correct. Aurobindo Ghose's 'Doctrine of Passive Resistance' formulated the complete blueprint of economic, educational, judicial, and fiscal non-cooperation.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Economic boycott to dismantle colonial commerce.",
            "Statement 2": "Correct. Educational boycott to prevent the de-nationalization of Indian youth.",
            "Statement 3": "Correct. Judicial boycott through people's arbitration courts (Adalats).",
            "Statement 4": "Correct. 'No-tax campaign' as the final decisive weapon to paralyze the colonial executive."
          },
          elimination_technique: "Aurobindo Ghose formulated the theoretical blueprint of non-cooperation that Gandhi later implemented on a mass scale in 1920. All 4 statements are correct.",
          concept_takeaway: "Aurobindo viewed political independence (Swaraj) not as an administrative adjustment, but as a spiritual necessity for India's national mission.",
          reference_sources: ["Bipan Chandra: India's Struggle for Independence", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD07_008",
        syllabusSubtopic: "Annulment of Partition (1911)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "In December 1911, the British government convened the Delhi Darbar in the presence of King George V. Which of the following major announcements were made at this Darbar?\n\n1. The Partition of Bengal was annulled to pacify the intense revolutionary and Swadeshi agitation.\n2. The capital of the British Indian Empire was shifted from Calcutta to Delhi.\n3. Bihar and Orissa were separated from Bengal to form a new province, and Assam was restored as a separate chief commissionership.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. The 1911 Delhi Darbar annulled Bengal's partition, shifted the capital to Delhi, and carved out Bihar-Orissa and Assam.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Bengal was reunited on linguistic lines (Bengali-speaking areas united).",
            "Statement 2": "Correct. The imperial capital was shifted to Delhi (inaugurated in 1931) to escape Calcutta's revolutionary atmosphere.",
            "Statement 3": "Correct. Non-Bengali linguistic regions (Odia and Bihari) were separated into the new province of Bihar and Orissa."
          },
          elimination_technique: "All 3 represent standard historic decisions enacted at the 1911 Delhi Darbar under Viceroy Lord Hardinge.",
          concept_takeaway: "The annulment was a victory for Bengali nationalists, but deeply alienated the Muslim League leadership who felt betrayed by the reversal of Eastern Bengal.",
          reference_sources: ["Spectrum's Modern India", "NCERT Class XII: Themes in Indian History"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD07_009",
        syllabusSubtopic: "Cultural Impact of Swadeshi",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "The Swadeshi movement spurred an unprecedented cultural flowering in literature, art, and science. Consider the following achievements:\n\n1. Abanindranath Tagore broke the dominance of Victorian academic realism and painted the iconic 'Bharat Mata' in Indian aesthetic style.\n2. Nandalal Bose became the first recipient of a scholarship from the Indian Society of Oriental Art founded in 1907.\n3. Jagadish Chandra Bose and Prafulla Chandra Ray made pioneering discoveries in plant physiology and chemical sciences, proving indigenous scientific genius.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. Abanindranath painted Bharat Mata (1905), Nandalal Bose led the revivalist Bengal School of Art, and J.C. Bose & P.C. Ray achieved global scientific breakthroughs.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Abanindranath Tagore portrayed Bharat Mata as a serene ascetic figure distributing food, cloth, learning, and spiritual solace.",
            "Statement 2": "Correct. Nandalal Bose created art drawing inspiration from Ajanta frescoes and Mughal miniatures.",
            "Statement 3": "Correct. J.C. Bose (crescograph) and P.C. Ray (mercurous nitrite) exemplified self-reliant national science."
          },
          elimination_technique: "The cultural renaissance was a vital dimension of Swadeshi. All 3 statements are accurate.",
          concept_takeaway: "Swadeshi art and science decolonized Indian cultural production, replacing Western imitation with indigenous creative confidence.",
          reference_sources: ["NCERT Class XII: Themes in Indian History - Part III", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD07_010",
        syllabusSubtopic: "Repressive British Laws (1907–1910)",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "High",
        question: "To crush the Swadeshi and Extremist agitation, the British government enacted a series of draconian laws. Consider the following pairs of Acts and their primary targets:\n\n1. Seditious Meetings Act (1907) : Banned unauthorized public political gatherings and meetings\n2. Explosive Substances Act (1908) : Imposed severe penalties and capital punishment for bomb-making\n3. Indian Newspapers (Incitement to Offences) Act (1908) : Empowered magistrates to confiscate printing presses publishing extremist articles\n4. Indian Press Act (1910) : Mandated hefty security deposits that could be forfeited for criticizing government policy\n\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", text: "Only one pair" },
          { id: "B", text: "Only two pairs" },
          { id: "C", text: "Only three pairs" },
          { id: "D", text: "All four pairs" }
        ],
        answer: "D",
        explanation: "All four pairs are correctly matched. Seditious Meetings Act (1907), Explosive Substances Act (1908), Newspapers Act (1908), and Press Act (1910) formed the British legal arsenal to suppress nationalism.",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1": "Correctly matched. Enacted in 1907 to prohibit public meetings in proclaimed areas.",
            "Pair 2": "Correctly matched. Passed in 1908 following the Muzaffarpur bomb attack by Khudiram Bose and Prafulla Chaki.",
            "Pair 3": "Correctly matched. Used to shut down radical nationalist newspapers like Yugantar and Sandhya.",
            "Pair 4": "Correctly matched. Revived the repressive features of the 1878 Vernacular Press Act."
          },
          elimination_technique: "These four repressive statutes enacted between 1907 and 1910 are frequently tested together. All 4 pairs are accurate.",
          concept_takeaway: "The suppression of open public politics drove radical youth underground, triggering the first wave of revolutionary armed resistance.",
          reference_sources: ["Spectrum's A Brief History of Modern India - Government Acts", "B.L. Grover: Modern Indian History"]
        }
      }
    ]
  },

  // ==========================================================================
  // MODERN INDIAN HISTORY - MODULE 08
  // ==========================================================================
  {
    id: "MOD-HIST-08",
    subject: "Modern Indian History",
    moduleNumber: 8,
    moduleTitle: "Revolutionary Phase-I, Ghadar Movement & Home Rule League (1907–1919)",
    curriculum: "UPSC Civil Services Examination (CSE)",
    stage: "Preliminary Examination (General Studies Paper-I)",
    topic: "Anushilan Samiti, Alipore Bomb Case, Ghadar Party, Komagata Maru Incident, Berlin Committee, Tilak & Besant Home Rule Leagues, Lucknow Pact (1916), and Montagu-Chelmsford Reforms (1919)",
    title: "Modern Indian History · Module 08: Revolutionaries, Ghadar & Home Rule (1907–1919)",
    questions: 10,
    duration: 20,
    marksPerQuestion: 2.0,
    negativeMarking: 0.66,
    difficulty: "Moderate to High",
    description: "Anushilan Samiti, Khudiram Bose, Rashbehari Bose, Ghadar Party in North America (Lala Hardayal), Komagata Maru, Tilak & Besant Home Rule Leagues, Lucknow Pact 1916, and Montagu Declaration 1917.",
    questionList: [
      {
        id: "UPSC_MODHIST_MOD08_001",
        syllabusSubtopic: "Early Revolutionary Societies in Bengal",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "With reference to the first phase of revolutionary activities in Bengal, consider the following statements:\n\n1. The Anushilan Samiti was established in Calcutta in 1902 by Pramathanath Mitra (P. Mitra), along with Jatindranath Banerjee and Barindra Kumar Ghosh.\n2. The weekly newspaper 'Yugantar' was started in 1906 by Barindra Kumar Ghosh and Bhupendranath Datta to preach open armed rebellion.\n3. Khudiram Bose and Prafulla Chaki threw a bomb at a carriage in Muzaffarpur (1908) intended for the oppressive magistrate Kingsford.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. Anushilan Samiti was founded in 1902, Yugantar began in 1906, and Khudiram Bose & Prafulla Chaki attempted the Muzaffarpur assassination in 1908.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. P. Mitra founded Anushilan Samiti with physical culture clubs (akhadas) as a front for revolutionary training.",
            "Statement 2": "Correct. Yugantar boldly proclaimed: 'Force must be stopped by force.'",
            "Statement 3": "Correct. Khudiram Bose (hanged at age 18) and Prafulla Chaki (who shot himself to avoid arrest) targeted Magistrate Kingsford."
          },
          elimination_technique: "All 3 statements detail foundational events of Bengal revolutionary terrorism.",
          concept_takeaway: "The Muzaffarpur incident led to the famous Alipore Bomb Conspiracy Case, where Chittaranjan Das brilliantly defended Aurobindo Ghose.",
          reference_sources: ["Spectrum's Modern India", "Bipan Chandra: India's Struggle for Independence"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD08_002",
        syllabusSubtopic: "Revolutionary Activities in Maharashtra and Abroad",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "Moderate to High",
        question: "Consider the following pairs of revolutionary organizations/actions and their associated leaders:\n\n1. Abhinav Bharat Society (1904) : V.D. Savarkar and Ganesh Savarkar\n2. India House (London, 1905) : Shyamji Krishna Varma\n3. Assassination of Curzon Wyllie (London, 1909) : Madan Lal Dhingra\n4. Paris Indian Society and 'Bande Mataram' : Madam Bhikaji Cama\n\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", text: "Only one pair" },
          { id: "B", text: "Only two pairs" },
          { id: "C", text: "Only three pairs" },
          { id: "D", text: "All four pairs" }
        ],
        answer: "D",
        explanation: "All four pairs are correctly matched: Abhinav Bharat (Savarkar brothers), India House (Shyamji Krishna Varma), Curzon Wyllie assassination (Madan Lal Dhingra), and Paris society (Madam Cama).",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1": "Correctly matched. Mitra Mela (1899) merged into the secret society Abhinav Bharat in 1904.",
            "Pair 2": "Correctly matched. Shyamji Krishna Varma set up India House and founded the journal 'The Indian Sociologist'.",
            "Pair 3": "Correctly matched. Dhingra assassinated the political aide-de-camp to the Secretary of State in London.",
            "Pair 4": "Correctly matched. Madam Cama unfurled the first version of the Indian National Flag at the International Socialist Congress in Stuttgart in 1907."
          },
          elimination_technique: "These four centers and leaders represent the international network of early Indian revolutionaries. All 4 pairs are accurate.",
          concept_takeaway: "Indian revolutionaries built active bases in London, Paris, Berlin, and San Francisco to smuggle arms and literature into India.",
          reference_sources: ["Spectrum's Modern India", "NCERT Class XII: Themes in Indian History"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD08_003",
        syllabusSubtopic: "The Ghadar Movement (1913)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "With reference to the Ghadar Party founded in North America, consider the following statements:\n\n1. It was founded in 1913 in San Francisco by Lala Hardayal, Sohan Singh Bhakna (President), and Kartar Singh Sarabha.\n2. The party published the weekly newspaper 'Ghadar' in Urdu and Gurmukhi with the masthead 'Angrezi Raj ka Dushman'.\n3. The Ghadarites were staunchly secular and their membership was drawn primarily from Punjabi Sikh and Muslim immigrant farmers and ex-soldiers.\n4. The party collaborated with the German Foreign Office under the 'Zimmermann Plan' during World War I to stage an armed insurrection in India.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1, 3 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "D",
        explanation: "All four statements are correct. Ghadar Party (1913 in SF by Hardayal & Sohan Singh Bhakna), weekly Ghadar paper, secular Punjabi membership, and German collaboration under the Zimmermann Plan.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Originally named Pacific Coast Hindustan Association, headquartered at Yugantar Ashram in San Francisco.",
            "Statement 2": "Correct. The first issue of Ghadar was published in Urdu on November 1, 1913, carrying advertisements seeking brave soldiers for mutiny.",
            "Statement 3": "Correct. The ideology was completely non-communal, electing leaders across religious lines (Barkatullah, Bhagwan Singh, Taraknath Das).",
            "Statement 4": "Correct. The Berlin Committee and Indian revolutionaries coordinated with Germany for weapons shipments (Maverick expedition)."
          },
          elimination_technique: "All 4 points detail the core organization, media, ideology, and wartime strategy of the Ghadarites.",
          concept_takeaway: "The Ghadar movement represented an extraordinary attempt by expatriate Indian workers to organize an armed revolution in India.",
          reference_sources: ["Bipan Chandra: India's Struggle for Independence - Chapter 12", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD08_004",
        syllabusSubtopic: "The Komagata Maru Incident (1914)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "Regarding the historic 'Komagata Maru' incident of 1914, consider the following statements:\n\n1. The Komagata Maru was a Japanese steamship chartered by Gurdit Singh to transport Indian immigrants from Hong Kong to Vancouver, Canada.\n2. The Canadian authorities refused permission for the passengers to land, citing discriminatory 'continuous journey' immigration regulations.\n3. When the ship returned to Budge Budge near Calcutta, British police opened fire on the protesting passengers, killing over 20 people.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. Japanese ship chartered by Gurdit Singh, turned away at Vancouver under continuous journey rules, and fired upon at Budge Budge port near Calcutta.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Baba Gurdit Singh chartered the vessel to bypass Canadian immigration restrictions and test legal rights of British Empire subjects.",
            "Statement 2": "Correct. Canada enforced laws requiring immigrants to travel on a continuous journey through ticket from their country of birth (which had no direct ship routes from India).",
            "Statement 3": "Correct. The Budge Budge firing (September 1914) created massive outrage, prompting returning Ghadarites to launch mutinies across Punjab."
          },
          elimination_technique: "The Komagata Maru tragedy was a direct catalyst for the Ghadar uprising in 1914-15. All 3 statements are accurate.",
          concept_takeaway: "The incident exposed the racist reality of the British Empire's claim to treat all subjects equally.",
          reference_sources: ["Spectrum's A Brief History of Modern India", "NCERT Class XII: Themes in Indian History"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD08_005",
        syllabusSubtopic: "The Home Rule League Movement (1916)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "Consider the following statements comparing the two Home Rule Leagues established in India in 1916:\n\n1. Bal Gangadhar Tilak launched his Home Rule League at the Bombay Provincial Conference in Belgaum in April 1916.\n2. Annie Besant launched her All-India Home Rule League in Madras in September 1916.\n3. Tilak's League operated in Maharashtra (excluding Bombay city), Karnataka, Central Provinces, and Berar, while Besant's League covered the rest of India.\n4. Both leaders worked in complete coordination and merged their two leagues into a single unified organization in 1916 to avoid organizational confusion.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "A",
        explanation: "Statements 1, 2, and 3 are correct. Statement 4 is incorrect because Tilak and Besant deliberately kept their leagues separate to avoid friction among their respective followers.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Tilak's League was formed in April 1916 at Belgaum with Joseph Baptista as President and N.C. Kelkar as Secretary.",
            "Statement 2": "Correct. Besant's League was set up in September 1916 with George Arundale as organizing secretary and B.W. Wadia and C.P. Ramaswamy Aiyar.",
            "Statement 3": "Correct. The geographical demarcation was strictly maintained (Tilak: 6 branches; Besant: ~200 branches across the rest of India).",
            "Statement 4": "Incorrect. Tilak noted: 'Some of her followers do not see eye to eye with me, and some of mine do not like her. We have avoided any friction by maintaining two leagues.'"
          },
          elimination_technique: "Tilak and Besant deliberately never merged their leagues. Eliminating statement 4 removes options B and D, leaving A.",
          concept_takeaway: "The Home Rule movement revitalized the national movement, popularizing the demand for self-government on the lines of the Irish Home Rule movement.",
          reference_sources: ["Bipan Chandra: India's Struggle for Independence - Chapter 13", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD08_006",
        syllabusSubtopic: "Methods and Leaders of the Home Rule Leagues",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "With reference to the Home Rule Movement, consider the following statements:\n\n1. Tilak gave the immortal slogan: 'Swaraj is my birthright and I shall have it' during this movement.\n2. Annie Besant promoted the movement through her two newspapers, 'New India' and 'Commonweal'.\n3. Prominent Moderate leaders like Motilal Nehru, Jawaharlal Nehru, Bhulabhai Desai, and Muhammad Ali Jinnah joined the Home Rule Leagues.\n4. When Annie Besant was interned in June 1917, Sir S. Subramaniya Aiyar renounced his British Knighthood in protest.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "D",
        explanation: "All four statements are correct. Tilak coined 'Swaraj is my birthright', Besant used New India & Commonweal, Jinnah & Nehru joined, and Subramaniya Aiyar renounced his knighthood in protest of Besant's internment.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Tilak used his Marathi paper 'Kesari' and English paper 'Mahratta' to campaign for Swaraj.",
            "Statement 2": "Correct. Besant's daily 'New India' and weekly 'Commonweal' reached widespread urban audiences.",
            "Statement 3": "Correct. The internment of Besant brought the prominent legal elite of India (Jinnah became president of the Bombay branch) into active agitational politics.",
            "Statement 4": "Correct. Sir S. Subramaniya Aiyar returned his knighthood and sent a letter to US President Woodrow Wilson protesting British repression."
          },
          elimination_technique: "All 4 statements describe celebrated historical facts associated with the 1916-1917 Home Rule campaign.",
          concept_takeaway: "The movement created a nationwide organizational network that Gandhi inherited and converted into a mass movement in 1919-20.",
          reference_sources: ["Spectrum's Modern India", "NCERT Themes in Indian History"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD08_007",
        syllabusSubtopic: "The Lucknow Pact (1916)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "The historic Lucknow Session of the Indian National Congress in 1916 was a watershed moment in the freedom struggle. Consider the following statements regarding this session:\n\n1. It was presided over by Ambica Charan Mazumdar.\n2. The Moderates and Extremists were reunited within the Congress after a split of nine years.\n3. The Congress and the Muslim League signed the 'Lucknow Pact', jointly presenting constitutional demands to the British government.\n4. In the Lucknow Pact, the Congress officially accepted the principle of Separate Electorates for Muslims for the first time.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1, 3 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "D",
        explanation: "All four statements are correct. A.C. Mazumdar presided, Moderates & Extremists reunited, the Congress-League pact was signed, and Congress accepted separate electorates.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. A.C. Mazumdar hailed the reunion: 'If the Congress was born in Bombay and attained adulthood in Calcutta, it has found its salvation in Lucknow.'",
            "Statement 2": "Correct. Tilak and Besant's persistent efforts brought the Extremists back into the Congress fold.",
            "Statement 3": "Correct. Mohammad Ali Jinnah (hailed by Sarojini Naidu as the 'Ambassador of Hindu-Muslim Unity') drafted the joint pact.",
            "Statement 4": "Correct. Congress agreed to separate electorates with weightage quotas for Muslims in provincial legislatures."
          },
          elimination_technique: "Lucknow 1916 achieved a dual reunion: Moderates + Extremists and Congress + Muslim League. All 4 statements are correct.",
          concept_takeaway: "While the Pact achieved immediate political unity, conceding separate electorates legally legitimized communal identity as a basis for political representation.",
          reference_sources: ["Bipan Chandra: India's Struggle for Independence - Chapter 14", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD08_008",
        syllabusSubtopic: "The Montagu Declaration (August 1917)",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): On August 20, 1917, Secretary of State for India Edwin Montagu announced in the House of Commons that the British policy in India was 'the progressive realization of responsible government'.\nReason (R): The fierce momentum of the Home Rule League Movement and the unified front presented by the Lucknow Pact forced the British government to make a major constitutional concession.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains why the Home Rule agitation and Congress-League unity forced Montagu's historic 'August Declaration'.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Montagu declared: 'increasing association of Indians in every branch of the administration and the gradual development of self-governing institutions with a view to the progressive realization of responsible government in India as an integral part of the British Empire.'",
            "Reason (R)": "True and explains the Assertion. The British needed Indian cooperation for the World War I war effort and sought to appease Moderate nationalists."
          },
          elimination_technique: "Montagu's August Declaration (Assertion) was a direct political concession to defuse the Home Rule League agitation described in the Reason. Option A is correct.",
          concept_takeaway: "The declaration officially conceded the principle of 'Responsible Government' for India, forming the preamble to the Government of India Act 1919.",
          reference_sources: ["M. Laxmikanth: Indian Polity - Historical Background", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD08_009",
        syllabusSubtopic: "Government of India Act 1919 (Montagu-Chelmsford Reforms)",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "The Government of India Act 1919 introduced fundamental changes in colonial constitutional architecture. Which of the following were provisions of this Act?\n\n1. It introduced 'Dyarchy' (dual rule) in the provincial executive, dividing provincial subjects into 'Transferred' and 'Reserved' categories.\n2. 'Transferred' subjects (education, health, local self-government) were administered by Indian ministers responsible to the provincial legislature.\n3. 'Reserved' subjects (law and order, police, land revenue, finance) were kept under the British Governor and his Executive Council without legislative accountability.\n4. It introduced bicameralism (Council of State and Legislative Assembly) and direct elections for the first time at the Center.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "D",
        explanation: "All four statements are correct. The 1919 Act introduced provincial Dyarchy (Transferred vs Reserved subjects), central bicameralism, and direct elections.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Dyarchy (derived from Greek di-arche meaning double rule) was the defining feature of the 1919 Act.",
            "Statement 2": "Correct. Transferred subjects were placed under ministers nominated from elected members of the provincial council.",
            "Statement 3": "Correct. Governors retained overriding veto powers and controlled key portfolios (finance, police) under the reserved list.",
            "Statement 4": "Correct. The Central Legislative Council was replaced by a bicameral legislature (Council of State of 60 members and Legislative Assembly of 144 members) with direct elections."
          },
          elimination_technique: "All 4 points summarize the core provisions of the 1919 Mont-Ford constitutional framework.",
          concept_takeaway: "The 1919 Act also extended separate communal electorates to Sikhs, Indian Christians, Anglo-Indians, and Europeans.",
          reference_sources: ["M. Laxmikanth: Indian Polity - Historical Background", "Spectrum's Modern India"]
        }
      },
      {
        id: "UPSC_MODHIST_MOD08_010",
        syllabusSubtopic: "Gandhi's Early Satyagrahas in India (1917–1918)",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "Moderate",
        question: "Before launching nationwide mass movements, Mahatma Gandhi tested his Satyagraha techniques in three local struggles. Consider the following pairs:\n\n1. Champaran Satyagraha (1917, Bihar) : First Civil Disobedience (Defying British order to leave Champaran to investigate the Tinkathia indigo system)\n2. Ahmedabad Mill Strike (1918, Gujarat) : First Hunger Strike (Demanding 35% wage hike following discontinuation of the Plague Bonus)\n3. Kheda Satyagraha (1918, Gujarat) : First Non-Cooperation (Refusal to pay land revenue following severe crop failure under the Revenue Code)\n\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", text: "Only one pair" },
          { id: "B", text: "Only two pairs" },
          { id: "C", text: "All three pairs" },
          { id: "D", text: "None of the pairs" }
        ],
        answer: "C",
        explanation: "All three pairs are correctly matched: Champaran (First Civil Disobedience), Ahmedabad (First Hunger Strike), and Kheda (First Non-Cooperation).",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1": "Correctly matched. Invited by Rajkumar Shukla, Gandhi defied an eviction order, leading the British to abolish the Tinkathia system and refund 25% of illegal exactions.",
            "Pair 2": "Correctly matched. Gandhi undertook his first fast unto death in India alongside Anasuya Sarabhai, securing a 35% wage hike from the mill owners.",
            "Pair 3": "Correctly matched. Guided by Gandhi and Vallabhbhai Patel, peasants refused to pay revenue because crop yields fell below one-fourth of normal production."
          },
          elimination_technique: "The classic sequence: Champaran (1st Civil Disobedience) -> Ahmedabad (1st Hunger Strike) -> Kheda (1st Non-Cooperation). All 3 pairs are accurate.",
          concept_takeaway: "These three localized laboratory experiments earned Gandhi widespread national credibility and forged his core team (Patel, Rajendra Prasad, J.B. Kripalani).",
          reference_sources: ["NCERT Class XII: Themes in Indian History - Part III", "Bipan Chandra: India's Struggle for Independence"]
        }
      }
    ]
  }
];
