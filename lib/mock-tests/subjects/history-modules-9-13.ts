import { MockTest } from "@/lib/core/types";

export const HISTORY_MODULES_9_TO_13: MockTest[] = [
  // ==========================================================================
  // MODERN INDIAN HISTORY - MODULE 09
  // ==========================================================================
  {
    id: "MOD-HIST-09",
    subject: "Modern Indian History",
    moduleNumber: 9,
    moduleTitle: "Mass Nationalism: Rowlatt, Khilafat, and Non-Cooperation (1919–1922)",
    curriculum: "UPSC Civil Services Examination (CSE)",
    stage: "Preliminary Examination (General Studies Paper-I)",
    topic: "Rowlatt Act, Jallianwala Bagh, Khilafat Movement, and the Non-Cooperation Movement",
    title: "Modern Indian History · Module 09: Mass Nationalism & Non-Cooperation (1919–1922)",
    questions: 10,
    duration: 20,
    marksPerQuestion: 2.0,
    negativeMarking: 0.66,
    difficulty: "Moderate to High",
    description: "Rowlatt Satyagraha, Jallianwala Bagh Hunter Commission, Khilafat alliance, Nagpur session restructuring, and Chauri Chaura.",
    questionList: [
      {
        id: "UPSC_MODHIST_MOD09_001",
        syllabusSubtopic: "The Rowlatt Act and Satyagraha (1919)",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): The Anarchical and Revolutionary Crimes Act of 1919 (Rowlatt Act) was met with a nationwide Satyagraha organized by Mahatma Gandhi.\nReason (R): The Act allowed the British colonial government to imprison any person suspected of terrorism without trial and conviction in a court of law, effectively suspending the right of habeas corpus.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) is the correct explanation. The draconian suspension of habeas corpus under the Rowlatt Act directly triggered Gandhi's first all-India Satyagraha.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Gandhi organized the Rowlatt Satyagraha Sabha, calling for a nationwide strike (hartal) on April 6, 1919, marking his first attempt at leading an all-India mass strike.",
            "Reason (R)": "True and perfectly explains the Assertion. The Rowlatt Act was based on the recommendations of the Sedition Committee. It allowed detention without trial for up to two years and restricted the freedom of the press. The popular Indian slogan against it was 'No Dalil, No Vakil, No Appeal'."
          },
          elimination_technique: "The causal link is direct. The draconian denial of basic civil liberties (Reason) was the exact trigger for Gandhi's launch of the all-India Satyagraha (Assertion). Option A is the logical choice.",
          concept_takeaway: "The Rowlatt Act disillusioned Indian leaders who had expected democratic reforms as a reward for India's massive contribution to the British war effort during WWI, permanently altering the trust between the Empire and the Congress.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence - The Rowlatt Satyagraha",
            "Spectrum's A Brief History of Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD09_002",
        syllabusSubtopic: "Jallianwala Bagh Massacre and Hunter Commission",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "With reference to the Jallianwala Bagh massacre (April 13, 1919) and its aftermath, consider the following statements:\n\n1. Rabindranath Tagore renounced his British Knighthood in protest, declaring that 'badges of honour make our shame glaring in the incongruous context of humiliation.'\n2. The British government appointed the Hunter Commission to investigate the massacre, which included no Indian members to ensure a biased verdict.\n3. The British House of Lords passed a resolution condemning General Dyer's actions and demanding his immediate imprisonment.\n\nWhich of the statements given above is/are correct?",
        options: [
          { id: "A", text: "1 only" },
          { id: "B", text: "1 and 2 only" },
          { id: "C", text: "2 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "A",
        explanation: "Statement 1 is correct. Statement 2 is incorrect as the Hunter Commission included 3 Indian members. Statement 3 is incorrect because the House of Lords passed a resolution approving Dyer's actions.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Tagore returned his knighthood in a famous letter to the Viceroy, Lord Chelmsford. Sir Shankaran Nair also resigned from the Viceroy's Executive Council in protest.",
            "Statement 2": "Incorrect. The Disorders Inquiry Committee (Hunter Commission) did have Indian members: Sir Chimanlal Setalvad, Pandit Jagat Narayan, and Sardar Sahibzada Sultan Ahmad Khan. However, its findings were largely viewed as a whitewash by Indians.",
            "Statement 3": "Incorrect. The House of Commons censured Dyer, but the House of Lords actually passed a resolution approving his actions. Furthermore, the conservative British newspaper 'Morning Post' collected a massive fund of £26,000 to reward Dyer as the 'Savior of Punjab'."
          },
          elimination_technique: "Statements 2 and 3 contain common historical misconceptions. The British establishment's defense of Dyer (House of Lords and the Morning Post fund) deeply shocked the Indian public. Eliminating 2 and 3 leaves Option A.",
          concept_takeaway: "The blatant racism revealed by the British public's defense of General Dyer convinced many Moderate Indian leaders that justice could never be achieved under imperial rule.",
          reference_sources: [
            "NCERT Class XII: Themes in Indian History - Mahatma Gandhi",
            "Sekhar Bandyopadhyay: From Plassey to Partition"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD09_003",
        syllabusSubtopic: "The Khilafat Movement",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): Mahatma Gandhi viewed the Khilafat Movement as an opportunity of uniting Hindus and Muslims as would not arise in a hundred years.\nReason (R): Gandhi believed that if Hindus unconditionally supported the Muslims in their time of deep religious anxiety regarding the Ottoman Caliphate, it would permanently cement communal unity against the British Empire.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) provides the moral and strategic rationale for Gandhi's decision to support the Khilafat cause.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Gandhi was elected President of the All India Khilafat Conference in November 1919 and saw this as a golden historical opportunity for Hindu-Muslim unity.",
            "Reason (R)": "True and is the correct explanation of (A). The Muslims were agitated over the harsh Treaty of Sèvres, which dismembered the Ottoman Empire and threatened the spiritual authority of the Khalifa. Gandhi argued that Hindus had a moral duty to support their Muslim brethren, which would organically fuse the two communities in the anti-colonial struggle."
          },
          elimination_technique: "The Reason directly explains the strategic and moral calculus behind Gandhi's Assertion. Despite opposition from some leaders (like Jinnah and Tilak) who warned against mixing religion with politics, Gandhi pushed the alliance forward.",
          concept_takeaway: "The Khilafat-Non-Cooperation alliance marked the highest point of Hindu-Muslim unity in the entire Indian freedom struggle, bringing orthodox Muslim masses into the anti-imperialist fold for the first time.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence - The Non-Cooperation Movement",
            "Spectrum's Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD09_004",
        syllabusSubtopic: "Programmes of the Non-Cooperation Movement",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "The Non-Cooperation Movement (1920–1922) included both constructive and destructive (boycott) programmes. Which of the following were part of the official program approved by the Congress?\n\n1. Surrender of British titles and honorary offices.\n2. Boycott of government-affiliated schools, colleges, and law courts.\n3. Immediate non-payment of taxes across all provinces from the very beginning of the movement.\n4. Promotion of Swadeshi, particularly hand-spinning and weaving (Khadi).\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 2 and 4 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "A",
        explanation: "Statements 1, 2, and 4 are correct. Statement 3 is incorrect as non-payment of taxes was a final civil disobedience measure reserved for specific areas, not launched immediately nationwide.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The movement began with Gandhi returning his Kaiser-i-Hind medal and others returning their titles.",
            "Statement 2": "Correct. National schools and arbitration courts (Panchayats) were set up to replace boycotted British institutions. Prominent lawyers like C.R. Das, Motilal Nehru, and C. Rajagopalachari gave up their lucrative practices.",
            "Statement 3": "Incorrect. The non-payment of taxes (Civil Disobedience) was reserved as the extreme, final weapon to be used only in specific areas (like Bardoli) if the initial boycott phases failed. It was not launched immediately across all provinces.",
            "Statement 4": "Correct. The constructive program heavily emphasized Khadi, Hindu-Muslim unity, and the eradication of untouchability."
          },
          elimination_technique: "Statement 3 represents a fundamental misunderstanding of Gandhi's phased strategy. Gandhi was very cautious about 'no-tax' campaigns because they directly threatened state sovereignty and invited maximum violence. Eliminating 3 removes options B, C, and D.",
          concept_takeaway: "The NCM was designed to systematically withdraw the Indian consent that allowed the British to rule. Gandhi famously promised 'Swaraj in one year' if the programs were fully implemented.",
          reference_sources: [
            "Spectrum's A Brief History of Modern India - Khilafat and Non-Cooperation",
            "NCERT Class XII: Themes in Indian History"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD09_005",
        syllabusSubtopic: "Institutional Changes at the Nagpur Session (1920)",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "The Nagpur Session of the Indian National Congress in December 1920 fundamentally restructured the organization. Consider the following statements regarding the changes made during this session:\n\n1. The Congress objective was changed from 'attainment of self-government through constitutional means' to 'attainment of Swaraj through peaceful and legitimate means'.\n2. Provincial Congress Committees were reorganized on a linguistic basis rather than on the basis of British administrative boundaries.\n3. A 15-member Congress Working Committee (CWC) was created to lead the movement throughout the year.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. The Nagpur session transformed the INC into a mass political movement with linguistic reorganization and the creation of the CWC.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. This constitutional change legally permitted the Congress to use extra-constitutional mass struggles (like Non-Cooperation), marking a definitive break from the Moderate era.",
            "Statement 2": "Correct. By restructuring on linguistic lines, the Congress allowed the nationalist message to penetrate the masses in their mother tongues, democratizing the movement.",
            "Statement 3": "Correct. Previously, the Congress only met once a year (in December) and had no machinery to execute continuous political action. The CWC functioned as the real executive head, transforming the INC into a disciplined, year-round political party."
          },
          elimination_technique: "All three institutional changes were orchestrated by Gandhi at Nagpur to convert the Congress from an elite debating club into a modern mass political machine capable of fighting the British Empire.",
          concept_takeaway: "The membership fee was also reduced to four annas (25 paise) per year to enable the poorest peasants and workers to join the Congress.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence - The Non-Cooperation Movement",
            "Spectrum's Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD09_006",
        syllabusSubtopic: "Parallel Movements: Trade Unions and Peasants",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "Moderate",
        question: "The atmosphere of the Non-Cooperation Movement inspired various class-based movements. Consider the following pairs of movements/organizations and their associated leaders:\n\n1. Awadh Kisan Sabha (1920) : Baba Ramchandra\n2. Eka Movement (1921) : Madari Pasi\n3. All India Trade Union Congress (AITUC, 1920) : Lala Lajpat Rai (First President)\n\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", text: "Only one pair" },
          { id: "B", text: "Only two pairs" },
          { id: "C", text: "All three pairs" },
          { id: "D", text: "None of the pairs" }
        ],
        answer: "C",
        explanation: "All three pairs are correctly matched: Awadh Kisan Sabha (Baba Ramchandra), Eka Movement (Madari Pasi), and AITUC (Lala Lajpat Rai).",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1": "Correctly matched. Baba Ramchandra (a Sanyasi who had been an indentured laborer in Fiji) organized peasants in Awadh against exorbitant rents and illegal cesses (bedakhli) exacted by taluqdars.",
            "Pair 2": "Correctly matched. The Eka (Unity) Movement emerged in the northern districts of Awadh, led by Madari Pasi, a low-caste leader. It was more radical than the Kisan Sabha and involved a religious ritual of swearing to pay only the recorded rent.",
            "Pair 3": "Correctly matched. The AITUC was founded in 1920 (driven by the need for representation at the newly formed ILO). Lala Lajpat Rai was elected its first President and Dewan Chaman Lal its General Secretary."
          },
          elimination_technique: "These three facts are standard high-yield Prelims data points showing the integration of peasant and labor struggles with the broader national movement during the 1920s. All pairs are accurate.",
          concept_takeaway: "While Gandhi and the Congress leadership tried to keep these movements strictly non-violent and anti-British, the peasants and workers often targeted Indian landlords and capitalists, revealing class tensions within the nationalist coalition.",
          reference_sources: [
            "Sekhar Bandyopadhyay: From Plassey to Partition - Peasant and Working Class Movements",
            "Spectrum's Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD09_007",
        syllabusSubtopic: "Alternative Educational Institutions",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "High",
        question: "As thousands of students left British-affiliated schools during the Non-Cooperation Movement, nationalist educational institutions were established. Consider the following pairs:\n\n1. Jamia Millia Islamia (Aligarh/Delhi) : Founded by Zakir Husain, Mahmud Hasan, and others\n2. Kashi Vidyapeeth (Varanasi) : Babu Shiv Prasad Gupta and Bhagavan Das\n3. Gujarat Vidyapith (Ahmedabad) : Mahatma Gandhi\n\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", text: "Only one pair" },
          { id: "B", text: "Only two pairs" },
          { id: "C", text: "All three pairs" },
          { id: "D", text: "None of the pairs" }
        ],
        answer: "C",
        explanation: "All three pairs are correctly matched. Jamia Millia, Kashi Vidyapeeth, and Gujarat Vidyapith were all born out of the 1920-21 educational boycott.",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1": "Correctly matched. Jamia Millia Islamia was founded in 1920 by nationalist Muslim leaders who rejected the pro-British stance of the Aligarh Muslim University administration.",
            "Pair 2": "Correctly matched. Kashi Vidyapeeth was established in Varanasi in 1921 to provide indigenous education, heavily patronized by nationalist leaders.",
            "Pair 3": "Correctly matched. Mahatma Gandhi founded the Gujarat Vidyapith in 1920 and served as its lifelong Chancellor, aiming to prepare youth for national reconstruction."
          },
          elimination_technique: "The boycott of educational institutions was one of the most successful aspects of the NCM. Recognizing that these premier Indian universities were born out of the 1920-21 boycott movement validates all three pairs.",
          concept_takeaway: "These institutions aimed to decolonize the Indian mind, focusing on vocational training, Indian languages, and nationalist history, free from government grants and control.",
          reference_sources: [
            "Spectrum's A Brief History of Modern India - Educational Boycott",
            "B.L. Grover: A New Look at Modern Indian History"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD09_008",
        syllabusSubtopic: "The Moplah Rebellion (1921)",
        patternType: "Assertion and Reason",
        difficulty: "High",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): The Moplah Rebellion of 1921 in Malabar initially started as an anti-government and anti-landlord movement but later took a tragic communal turn.\nReason (R): The Moplahs were predominantly Muslim tenants cultivating land owned by upper-caste Hindu landlords (Jenmis), who were perceived by the tenants as being protected by the British authorities.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains how the overlap of class grievances and religious identity led the rebellion into communal violence.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. The rebellion was sparked by British crackdowns on Khilafat leaders in Malabar. It began as an agrarian uprising against the state and oppressive landlords but devolved into violence against Hindus.",
            "Reason (R)": "True and perfectly explains the Assertion. The class division (tenant vs. landlord) exactly coincided with the religious division (Muslim vs. Hindu). When British repression removed the educated Khilafat leadership, the unguided peasant mobs targeted the Hindu Jenmis, associating them with the oppressive colonial state."
          },
          elimination_technique: "Understanding the intersection of class and religion in Malabar is crucial. Because the economic exploiters (Jenmis) belonged to a different religion, an economic rebellion easily warped into a communal riot. Thus, R accurately explains A.",
          concept_takeaway: "The communal violence of the Moplah rebellion severely damaged the Hindu-Muslim unity forged during the Khilafat movement and provided ammunition to communal organizations on both sides.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence - Peasant Movements",
            "NCERT Class XII: Themes in Indian History"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD09_009",
        syllabusSubtopic: "Chauri Chaura and Withdrawal of NCM (1922)",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): Mahatma Gandhi abruptly called off the Non-Cooperation Movement in February 1922 following the Chauri Chaura incident.\nReason (R): He realized that the movement was turning violent, indicating that the masses had not yet fully understood or internalized the principle of strict non-violence (Ahimsa) required for Satyagraha.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) provides Gandhi's fundamental strategic rationale for the Bardoli resolution suspending the movement.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. On February 5, 1922, a mob set fire to a police station in Chauri Chaura (Gorakhpur, UP), burning 22 policemen alive. Gandhi passed the Bardoli resolution on February 12, halting the movement.",
            "Reason (R)": "True and explains the Assertion. Gandhi believed that if the movement turned violent, the British government would have a legitimate excuse to use massive armed force against unarmed Indians, thereby crushing the national movement completely."
          },
          elimination_technique: "Gandhi's absolute commitment to non-violence meant that any deviation, even if provoked by police brutality, was unacceptable. R explains the philosophical and strategic rationale behind the sudden withdrawal mentioned in A.",
          concept_takeaway: "While controversial, Gandhi's decision prevented the movement from devolving into an armed clash that the Indians could not possibly win against the British military machine.",
          reference_sources: [
            "Spectrum's Modern India - Withdrawal of the Movement",
            "Sekhar Bandyopadhyay: From Plassey to Partition"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD09_010",
        syllabusSubtopic: "Reactions to the Withdrawal of NCM",
        patternType: "Assertion and Reason",
        difficulty: "High",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): Prominent nationalist leaders like C.R. Das, Motilal Nehru, and Subhas Chandra Bose strongly opposed Mahatma Gandhi's decision to suspend the Non-Cooperation Movement.\nReason (R): They argued that it was politically disastrous to halt a nationwide mass movement at the peak of its momentum due to an isolated incident of violence in one remote village.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains the deep strategic frustration that directly prompted the creation of the Swaraj Party in 1923.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. The suspension caused massive shock and anger. Subhas Chandra Bose called it a 'national calamity'. Jawaharlal Nehru and Lala Lajpat Rai wrote angry letters from prison.",
            "Reason (R)": "True and perfectly captures their argument. The younger and more radical leaders believed that holding the entire country hostage to the behavior of a single village was strategically flawed and demoralizing for the masses."
          },
          elimination_technique: "The frustration of the leaders (Assertion) was directly caused by the strategic disagreement over punishing the whole nation for a localized event (Reason). Thus, A is the correct answer.",
          concept_takeaway: "This intense disagreement over strategy immediately following the suspension of the movement led directly to the formation of the Swaraj Party by C.R. Das and Motilal Nehru in 1923, as they sought a new method of opposing the British through legislative councils.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence",
            "Spectrum's A Brief History of Modern India"
          ]
        }
      }
    ]
  },

  // ==========================================================================
  // MODERN INDIAN HISTORY - MODULE 10
  // ==========================================================================
  {
    id: "MOD-HIST-10",
    subject: "Modern Indian History",
    moduleNumber: 10,
    moduleTitle: "Swarajists, Revolutionaries, and the Road to Civil Disobedience (1922–1929)",
    curriculum: "UPSC Civil Services Examination (CSE)",
    stage: "Preliminary Examination (General Studies Paper-I)",
    topic: "Swaraj Party, HSRA, Simon Commission, and the Nehru Report",
    title: "Modern Indian History · Module 10: Swarajists, HSRA & Simon Commission (1922–1929)",
    questions: 10,
    duration: 20,
    marksPerQuestion: 2.0,
    negativeMarking: 0.66,
    difficulty: "Moderate to High",
    description: "Swarajists vs No-Changers, HSRA ideology and actions, Simon Commission boycott, Nehru Report, and the Lahore Purna Swaraj declaration.",
    questionList: [
      {
        id: "UPSC_MODHIST_MOD10_001",
        syllabusSubtopic: "Swarajists vs. No-Changers",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): Following the withdrawal of the Non-Cooperation Movement, leaders like C.R. Das and Motilal Nehru advocated for contesting elections and entering the legislative councils.\nReason (R): They wanted to cooperate with the British government to gain administrative experience and gradually secure dominion status for India.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "C",
        explanation: "Assertion (A) is true but Reason (R) is false. The Swarajists did not want to cooperate; their explicit strategy was 'End or Mend'—to enter councils to wreck them from within.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. C.R. Das (President) and Motilal Nehru (Secretary) formed the Congress-Khilafat Swarajya Party (Swaraj Party) in December 1922 after their proposal for council entry was defeated at the Gaya session.",
            "Reason (R)": "False. The Swarajists did not want to cooperate. Their explicit strategy was 'End or Mend'—to enter the councils to wreck them from within by creating constitutional deadlocks and exposing the sham of the 1919 reforms."
          },
          elimination_technique: "Understanding the fundamental ideology of the Swarajists is key. They were anti-imperialists who chose a different battleground (the legislature) rather than moderates seeking cooperation. Since R is factually false, C is the answer.",
          concept_takeaway: "The 'No-Changers' (like Vallabhbhai Patel, Rajendra Prasad, and C. Rajagopalachari) opposed council entry, arguing it would lead to political corruption, preferring to focus on Gandhian constructive work in villages.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence - The Years of Stagnation",
            "Spectrum's A Brief History of Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD10_002",
        syllabusSubtopic: "Achievements of the Swaraj Party",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "With reference to the political achievements of the Swaraj Party in the Central Legislative Assembly during the 1920s, consider the following statements:\n\n1. In 1925, Vithalbhai Patel became the first Indian to be elected as the President (Speaker) of the Central Legislative Assembly.\n2. The Swarajists successfully outvoted the government and defeated the controversial Public Safety Bill in 1928.\n3. The party managed to compel the British government to appoint the Muddiman Committee to expose the weaknesses of the Dyarchy system.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. Vithalbhai Patel was elected Speaker (1925), the Public Safety Bill was defeated (1928), and the Muddiman Committee was appointed (1924).",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Vithalbhai Patel (Sardar Patel's elder brother) was elected as the Speaker in 1925, a massive prestige victory for the Swarajists.",
            "Statement 2": "Correct. The Public Safety Bill of 1928 was designed to deport foreign socialist/communist organizers without trial. The Swarajists, in coalition with others, successfully defeated it in the assembly.",
            "Statement 3": "Correct. The relentless constitutional deadlocks created by the Swarajists forced the government to appoint the Alexander Muddiman Committee (1924) to evaluate the defects of the 1919 Government of India Act."
          },
          elimination_technique: "All three statements highlight the high-water marks of Swarajist parliamentary obstruction. Recognizing Vithalbhai Patel's historic election and the defeat of the Public Safety Bill validates the options.",
          concept_takeaway: "Despite their early successes, the Swaraj Party declined after the death of C.R. Das in 1925, suffering from internal splits (the 'Responsivists' vs. 'Non-Responsivists') and communal tensions.",
          reference_sources: [
            "Bipan Chandra: History of Modern India",
            "Sekhar Bandyopadhyay: From Plassey to Partition"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD10_003",
        syllabusSubtopic: "Second Phase of Revolutionary Terrorism",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "Moderate",
        question: "Consider the following pairs of revolutionary actions in the 1920s and the prominent leaders associated with them:\n\n1. Kakori Train Robbery (1925) : Ram Prasad Bismil and Ashfaqulla Khan\n2. Assassination of John Saunders (1928) : Bhagat Singh, Shivaram Rajguru, and Chandra Shekhar Azad\n3. Central Assembly Bomb Throwing (1929) : Bhagat Singh and Batukeshwar Dutt\n\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", text: "Only one pair" },
          { id: "B", text: "Only two pairs" },
          { id: "C", text: "All three pairs" },
          { id: "D", text: "None of the pairs" }
        ],
        answer: "C",
        explanation: "All three pairs are correctly matched. Kakori (Bismil & Ashfaqulla), Saunders assassination (Bhagat Singh, Rajguru, Azad), and Central Assembly bomb (Bhagat Singh & B.K. Dutt).",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1": "Correctly matched. The Kakori conspiracy was executed by the Hindustan Republican Association (HRA) to fund their armed struggle. Bismil, Ashfaqulla, Roshan Singh, and Rajendra Lahiri were hanged for this.",
            "Pair 2": "Correctly matched. To avenge the death of Lala Lajpat Rai (who died from lathi blows during an anti-Simon protest), HSRA members assassinated police officer John Saunders in Lahore.",
            "Pair 3": "Correctly matched. Bhagat Singh and B.K. Dutt threw harmless bombs in the Central Legislative Assembly to protest against the Public Safety Bill and the Trade Dispute Bill, intending 'to make the deaf hear' rather than kill."
          },
          elimination_technique: "These are the three most defining acts of the HRA/HSRA. The individuals associated with each specific event are historically accurate and frequently tested. All pairs are correct.",
          concept_takeaway: "Unlike the first phase of revolutionary terrorism (which focused on religious nationalism and assassinating unpopular officials), this second phase was highly organized, ideological, and aimed at capturing the public imagination through open trials.",
          reference_sources: [
            "Spectrum's Modern India - Revolutionary Activities During the 1920s",
            "Bipan Chandra: India's Struggle for Independence"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD10_004",
        syllabusSubtopic: "Ideology of the HSRA and Bhagat Singh",
        patternType: "Assertion and Reason",
        difficulty: "Moderate to High",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): Under the leadership of Bhagat Singh and Chandra Shekhar Azad, the revolutionaries moved away from individual heroic assassinations towards organizing a mass-based socialist revolution.\nReason (R): This ideological shift was formally marked by changing the name of their organization from the Hindustan Republican Association (HRA) to the Hindustan Socialist Republican Association (HSRA) at Ferozeshah Kotla in 1928.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains the institutional rebranding at Ferozeshah Kotla reflecting their Marxist ideological shift.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Bhagat Singh was a voracious reader of Marxist literature. He realized that individual terrorism was politically futile and that true revolution required the mobilization of peasants and workers.",
            "Reason (R)": "True and is the direct explanation of the assertion. At the historic meeting at Ferozeshah Kotla (Delhi) in 1928, the word 'Socialist' was added to the organization's name to explicitly align their goals with the establishment of a socialist state."
          },
          elimination_technique: "The evolution of Bhagat Singh's political thought from a nationalist avenger to a Marxist intellectual is a central theme in modern historiography. The Reason directly provides the institutional evidence for the ideological shift described in the Assertion.",
          concept_takeaway: "Bhagat Singh's ideological maturity was evident in his founding of the Naujawan Bharat Sabha (1926) for open political work among the youth and his famous essay 'Why I am an Atheist'.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence - Bhagat Singh, Surya Sen and the Revolutionary Terrorists",
            "NCERT Class XII: Themes in Indian History"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD10_005",
        syllabusSubtopic: "Chittagong Armoury Raid (1930)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "With reference to the Chittagong Armoury Raid of 1930, consider the following statements:\n\n1. It was planned and executed by Surya Sen, affectionately known as 'Masterda', under the banner of the Indian Republican Army (Chittagong Branch).\n2. The revolutionaries successfully captured the police and auxiliary force armouries, cut off communication lines, and hoisted the national flag.\n3. Unlike the revolutionary movements in northern India, the Bengal revolutionaries strictly barred women from participating in armed actions.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "A",
        explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect because Bengal revolutionaries prominently included women fighters like Kalpana Datta and Pritilata Waddedar.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Surya Sen, a school teacher and Secretary of the Chittagong District Congress Committee, organized the raid.",
            "Statement 2": "Correct. On April 18, 1930, they captured the armouries, disrupted telegraph and railway lines, and established a provisional revolutionary government.",
            "Statement 3": "Incorrect. The Chittagong group was famous for the unprecedented frontline participation of women. Revolutionaries like Kalpana Datta, Pritilata Waddedar (who led the attack on the Pahartali European Club), and Santi and Suniti Chowdhury actively engaged in armed combat."
          },
          elimination_technique: "Statement 3 claims women were 'strictly barred', which contradicts one of the most celebrated aspects of the Bengal revolutionary movement. Eliminating statement 3 leaves Option A.",
          concept_takeaway: "The Chittagong raid demonstrated that a small, disciplined group could temporarily paralyze the mighty British administration, inspiring a massive wave of anti-imperialist sentiment across Bengal.",
          reference_sources: [
            "Spectrum's A Brief History of Modern India - Revolutionaries in Bengal",
            "From Plassey to Partition"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD10_006",
        syllabusSubtopic: "The Simon Commission (1927)",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "Regarding the Indian Statutory Commission (Simon Commission) appointed in 1927, consider the following statements:\n\n1. It was appointed two years ahead of the schedule mandated by the Government of India Act 1919 due to the Conservative government's fear of losing the upcoming British elections to the Labour Party.\n2. The Commission was universally boycotted by all Indian political parties, including the Justice Party of Madras and the Unionist Party in Punjab.\n3. Its final report recommended the abolition of dyarchy and the establishment of responsible government in the provinces, but retained separate electorates.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "1 and 3 only" },
          { id: "C", text: "2 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "B",
        explanation: "Statements 1 and 3 are correct. Statement 2 is incorrect because the Justice Party (Madras) and Unionist Party (Punjab) cooperated with the Commission.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The 1919 Act provided for a review after 10 years (1929). However, the Conservative Secretary of State, Lord Birkenhead, advanced it to 1927 to prevent the pro-Indian Labour Party from framing the reforms.",
            "Statement 2": "Incorrect. While it was widely boycotted (by Congress, the Jinnah faction of the Muslim League, and Hindu Mahasabha) because it had zero Indian members, a few loyalist groups like the Justice Party (Madras), the Unionist Party (Punjab), and the Shafi faction of the Muslim League did cooperate with it.",
            "Statement 3": "Correct. Published in 1930, the Simon Report recommended ending dyarchy in the provinces, establishing provincial autonomy, and continuing communal electorates, but refused to concede responsible government at the center."
          },
          elimination_technique: "UPSC tests exceptions. The term 'universally boycotted by all' in statement 2 is a trap. Regional anti-Brahmin and loyalist parties often cooperated with the British against the Congress. Eliminating 2 leaves Option B.",
          concept_takeaway: "The exclusion of Indians from a commission deciding India's constitutional future was seen as a grave national insult, instantly uniting fractured Indian political factions in protest.",
          reference_sources: [
            "M. Laxmikanth: Indian Polity - Historical Background",
            "Spectrum's Modern India - Simon Commission"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD10_007",
        syllabusSubtopic: "The Nehru Report (1928)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "The Nehru Report (1928) was the first major attempt by Indians to draft a constitutional framework for themselves. Which of the following were core recommendations of this report?\n\n1. Complete Independence (Purna Swaraj) as the immediate constitutional status for India.\n2. Rejection of separate electorates in favor of joint electorates with reserved seats for minorities.\n3. A declaration of nineteen fundamental rights, including equal rights for women and universal adult suffrage.\n4. Creation of provinces on linguistic lines.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1, 3 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "B",
        explanation: "Statements 2, 3, and 4 are correct. Statement 1 is incorrect because the Nehru Report demanded Dominion Status, sparking fierce opposition from younger radicals like Jawaharlal Nehru and Subhas Bose.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Incorrect. The Nehru Report demanded 'Dominion Status' (self-government within the Empire) as the chief political objective, not Complete Independence. This severely angered younger leaders like Jawaharlal Nehru and Subhas Chandra Bose.",
            "Statement 2": "Correct. It explicitly rejected separate communal electorates (which it viewed as inherently divisive) and proposed joint electorates, with seat reservations for Muslims only in provinces where they were in a minority.",
            "Statement 3": "Correct. It was highly progressive, proposing 19 fundamental rights, universal adult suffrage, and equal rights for men and women.",
            "Statement 4": "Correct. It recognized that linguistic redistribution of provinces was essential for democratic functioning."
          },
          elimination_technique: "Statement 1 is the defining controversy of the Nehru Report. The debate between Dominion Status (old guard) and Purna Swaraj (youth) led to the formation of the Independence for India League. Eliminating 1 removes options A, C, and D.",
          concept_takeaway: "Drafted primarily by Motilal Nehru and Tej Bahadur Sapru, the report was a direct response to Lord Birkenhead's challenge that Indians were incapable of producing an agreed-upon constitution.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence",
            "Spectrum's A Brief History of Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD10_008",
        syllabusSubtopic: "Muslim League and Jinnah's 14 Points",
        patternType: "Assertion and Reason",
        difficulty: "High",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): M.A. Jinnah rejected the Nehru Report of 1928 and subsequently formulated his famous 'Fourteen Points'.\nReason (R): The Nehru Report refused to accept Jinnah's demands for one-third representation for Muslims in the Central Legislature and the retention of residuary powers with the provinces.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains the communal disagreements over quotas and residuary powers that led to Jinnah's 14 points.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. At the All Parties Convention in Calcutta (December 1928), Jinnah proposed amendments to the Nehru Report. When they were overwhelmingly defeated, he issued his '14 Points' in 1929.",
            "Reason (R)": "True and explains the Assertion. The Hindu Mahasabha strictly opposed Jinnah's amendments. The Nehru Report provided for a strong center (residuary powers with the center) and refused the strict 1/3 quota for Muslims at the center, prompting Jinnah to break away from the consensus."
          },
          elimination_technique: "The political failure of the Nehru Report was rooted in communal disagreements. The Reason perfectly details the specific constitutional mechanisms (residuary powers, quotas) that Jinnah demanded to protect Muslim interests against a Hindu-majority center. Thus, A is correct.",
          concept_takeaway: "This failure marked a critical turning point where Jinnah began drifting away from his role as the 'Ambassador of Hindu-Muslim Unity' towards a more rigid, separatist political stance.",
          reference_sources: [
            "Sekhar Bandyopadhyay: From Plassey to Partition",
            "Spectrum's Modern India - Nehru Report and Jinnah's 14 points"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD10_009",
        syllabusSubtopic: "Lahore Session and Purna Swaraj (1929)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "The Lahore Session of the Indian National Congress in 1929 was highly significant. Consider the following statements regarding this session:\n\n1. It was presided over by Jawaharlal Nehru, symbolizing the passing of leadership to the radical youth.\n2. The Congress officially adopted 'Purna Swaraj' (Complete Independence) as its singular goal.\n3. January 26, 1930, was fixed as the first Independence Day, to be celebrated everywhere by hoisting the tricolor and taking a pledge.\n4. The Congress decided to participate in the First Round Table Conference to discuss the Simon Commission report.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1, 2 and 3 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1, 3 and 4 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "A",
        explanation: "Statements 1, 2, and 3 are correct. Statement 4 is incorrect because the Lahore session passed a resolution to boycott the Round Table Conference.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Gandhi backed Jawaharlal Nehru for the presidency, deliberately elevating the socialist, younger wing to lead the upcoming mass movement.",
            "Statement 2": "Correct. Angered by Viceroy Irwin's vague 'Deepavali Declaration' regarding dominion status, the Congress abandoned the Nehru Report's dominion goal and declared Complete Independence.",
            "Statement 3": "Correct. January 26 was designated as Independence Day, which is why the Indian Constitution was later formally adopted on this specific date in 1950 (Republic Day).",
            "Statement 4": "Incorrect. The Lahore session specifically passed a resolution to boycott the upcoming Round Table Conference and authorized the Working Committee to launch a program of civil disobedience."
          },
          elimination_technique: "The Lahore session was a declaration of war against British administration. It makes no historical sense that they would declare Purna Swaraj and simultaneously agree to participate in British-led Round Table talks. Eliminating 4 leaves Option A.",
          concept_takeaway: "On December 31, 1929, on the banks of the river Ravi, Jawaharlal Nehru hoisted the newly adopted tricolor flag of freedom, signaling the dawn of the final phase of the freedom struggle.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence - Civil Disobedience",
            "NCERT Class XII: Themes in Indian History"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD10_010",
        syllabusSubtopic: "Working Class and Peasant Movements (Late 1920s)",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "High",
        question: "The late 1920s saw a massive surge in class-based movements and the rise of left-wing ideologies. Consider the following pairs:\n\n1. Kanpur Bolshevik Conspiracy Case (1924) : S.A. Dange, Muzaffar Ahmed, and Shaukat Usmani\n2. Meerut Conspiracy Case (1929) : Mass trial of 31 communist and labor leaders which drew global sympathy\n3. Bardoli Satyagraha (1928) : Sardar Vallabhbhai Patel leading a successful no-tax campaign against the Bombay Presidency\n\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", text: "Only one pair" },
          { id: "B", text: "Only two pairs" },
          { id: "C", text: "All three pairs" },
          { id: "D", text: "None of the pairs" }
        ],
        answer: "C",
        explanation: "All three pairs are correctly matched: Kanpur case (1924), Meerut trial (1929), and Bardoli Satyagraha (1928).",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1": "Correctly matched. The British sought to crush the nascent communist movement. S.A. Dange, Muzaffar Ahmed, and others were jailed for seeking 'to deprive the King Emperor of his sovereignty over British India'.",
            "Pair 2": "Correctly matched. In 1929, the government arrested 31 prominent labor leaders (including three Englishmen like Philip Spratt) in the Meerut Conspiracy Case. The harsh trial ironically popularized communist ideas across India.",
            "Pair 3": "Correctly matched. The Bardoli Satyagraha was a highly disciplined peasant movement against a 22% hike in land revenue. Its success earned Vallabhbhai Patel the title of 'Sardar' (given by the women of Bardoli)."
          },
          elimination_technique: "These three events highlight the socio-economic radicalization occurring parallel to the Congress-led national movement. The details align perfectly with standard historical records. All three pairs are correct.",
          concept_takeaway: "The British government was terrified of the growing alliance between the nationalist movement and communist-led labor unions, leading them to enact the Public Safety Bill and launch the Meerut trials.",
          reference_sources: [
            "Sekhar Bandyopadhyay: From Plassey to Partition",
            "Spectrum's A Brief History of Modern India"
          ]
        }
      }
    ]
  },

  // ==========================================================================
  // MODERN INDIAN HISTORY - MODULE 11
  // ==========================================================================
  {
    id: "MOD-HIST-11",
    subject: "Modern Indian History",
    moduleNumber: 11,
    moduleTitle: "Civil Disobedience, Round Table Conferences, and Provincial Autonomy (1930–1937)",
    curriculum: "UPSC Civil Services Examination (CSE)",
    stage: "Preliminary Examination (General Studies Paper-I)",
    topic: "Salt Satyagraha, Gandhi-Irwin Pact, Poona Pact, and Government of India Act 1935",
    title: "Modern Indian History · Module 11: Civil Disobedience & GoI Act 1935 (1930–1937)",
    questions: 10,
    duration: 20,
    marksPerQuestion: 2.0,
    negativeMarking: 0.66,
    difficulty: "Moderate to High",
    description: "Gandhi's 11 demands, Dandi March, Gandhi-Irwin Pact, Karachi Resolution, Poona Pact, and GoI Act 1935 provisions.",
    questionList: [
      {
        id: "UPSC_MODHIST_MOD11_001",
        syllabusSubtopic: "Gandhi's Eleven Demands and the Salt March",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "Before launching the Civil Disobedience Movement, Mahatma Gandhi presented an 11-point ultimatum to Viceroy Lord Irwin. Which of the following demands were included in this ultimatum?\n\n1. Reduce military expenditure and civil administration salaries by 50%.\n2. Abolish the salt tax and the government's salt monopoly.\n3. Release all political prisoners, including those convicted of violence and assassination.\n4. Reserve coastal shipping for Indians.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 2 and 4 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 2 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "A",
        explanation: "Statements 1, 2, and 4 are correct. Statement 3 is incorrect because Gandhi demanded the release of only political prisoners not convicted of violence.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Gandhi demanded a drastic 50% reduction in the oppressive military and civil administration expenses to provide relief to the Indian taxpayer.",
            "Statement 2": "Correct. The salt tax was the most universally hated tax as it affected the poorest of the poor, making it the perfect unifying symbol for a mass movement.",
            "Statement 3": "Incorrect. Gandhi explicitly demanded the release of only political prisoners not convicted of violence. He did not ask for the release of revolutionaries convicted of violent acts (like Bhagat Singh).",
            "Statement 4": "Correct. This was a specific bourgeois/capitalist demand included to rally the Indian mercantile class behind the national movement."
          },
          elimination_technique: "Gandhi's strict adherence to non-violence meant he never officially championed the release of those convicted of armed revolutionary terrorism in his negotiations with the British state. Eliminating statement 3 removes options B and D.",
          concept_takeaway: "The 11 demands were a strategic masterstroke; they combined general political demands with specific economic demands of the bourgeoisie and the peasantry, thereby uniting diverse classes before the Dandi March.",
          reference_sources: [
            "Spectrum's A Brief History of Modern India - Civil Disobedience Movement",
            "Bipan Chandra: India's Struggle for Independence"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD11_002",
        syllabusSubtopic: "Regional Spread of the Salt Satyagraha",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "Moderate",
        question: "The Dandi March inspired leaders across India to break the salt law. Consider the following pairs of regional leaders and the areas where they led the Salt Satyagraha:\n\n1. C. Rajagopalachari : Vedaranyam (Tamil Nadu)\n2. K. Kelappan : Malabar (Kerala)\n3. Khan Abdul Ghaffar Khan : Peshawar (North-West Frontier Province)\n4. Sarojini Naidu : Dharasana (Gujarat)\n\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", text: "Only one pair" },
          { id: "B", text: "Only two pairs" },
          { id: "C", text: "Only three pairs" },
          { id: "D", text: "All four pairs" }
        ],
        answer: "D",
        explanation: "All four pairs are correctly matched: Rajagopalachari (Vedaranyam), Kelappan (Malabar), Ghaffar Khan (Peshawar), and Sarojini Naidu (Dharasana).",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1": "Correctly matched. C. Rajagopalachari led a march from Tiruchirappalli to the Vedaranyam coast to break the salt law, earning him the title of the 'Gandhi of the South'.",
            "Pair 2": "Correctly matched. K. Kelappan (the 'Kerala Gandhi' and hero of the Vaikom Satyagraha) organized salt marches from Calicut to Payyanur.",
            "Pair 3": "Correctly matched. Ghaffar Khan (Frontier Gandhi) organized the 'Khudai Khidmatgars' (Red Shirts) who led a massive non-violent uprising in Peshawar.",
            "Pair 4": "Correctly matched. After Gandhi's arrest, Sarojini Naidu, Imam Saheb, and Manilal Gandhi led the famous non-violent raid on the Dharasana Salt Works, where satyagrahis bravely faced brutal police beatings."
          },
          elimination_technique: "These are the four most iconic regional manifestations of the Civil Disobedience Movement. All pairs correctly map the leader to their geographical center of operation.",
          concept_takeaway: "The Salt Satyagraha successfully transformed a basic economic issue into a profound moral challenge to British sovereignty, drawing global media attention (e.g., Webb Miller's reporting at Dharasana).",
          reference_sources: [
            "Sekhar Bandyopadhyay: From Plassey to Partition",
            "NCERT Class XII: Themes in Indian History - Mahatma Gandhi"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD11_003",
        syllabusSubtopic: "Characteristics of the Civil Disobedience Movement",
        patternType: "Assertion and Reason",
        difficulty: "Moderate to High",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): Unlike the Non-Cooperation Movement (1920-22), the Civil Disobedience Movement (1930-34) explicitly aimed at the complete paralysis of the administration by breaking specific colonial laws.\nReason (R): The stated political objective of the Civil Disobedience Movement was Purna Swaraj (Complete Independence), whereas the Non-Cooperation Movement was fought for the vague goal of Swaraj and the Khilafat cause.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains why the escalated goal of Purna Swaraj required moving from non-cooperation to direct law-breaking.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Non-Cooperation meant withdrawing support (boycotting schools, titles, foreign cloth). Civil Disobedience went a step further into illegal acts: manufacturing salt, refusing to pay land revenue, and defying forest laws.",
            "Reason (R)": "True and explains the Assertion. Because the Lahore Congress (1929) elevated the goal from 'Dominion Status/Swaraj' to 'Purna Swaraj', the methods had to escalate from mere non-cooperation to actively defying and breaking the legal authority of the British state."
          },
          elimination_technique: "The evolution of the Congress's ultimate goal (Reason) naturally dictated the evolution of its protest methods (Assertion). As the demand became more radical (Purna Swaraj), the method shifted from boycott to actual law-breaking. R explains A perfectly.",
          concept_takeaway: "Despite the more radical objective, the Civil Disobedience Movement saw less active Muslim participation compared to the Non-Cooperation Movement, largely due to the intervening years of communal riots and the alienation of the Muslim League.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence",
            "Spectrum's Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD11_004",
        syllabusSubtopic: "Gandhi-Irwin Pact (1931)",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "The Gandhi-Irwin Pact (Delhi Pact) of 1931 temporarily halted the Civil Disobedience Movement. Which of the following concessions were successfully secured by Mahatma Gandhi from the British government in this pact?\n\n1. Immediate release of all political prisoners not convicted of violence.\n2. The right of coastal villages to make salt for personal consumption without paying the tax.\n3. A public inquiry into the police atrocities and excesses committed during the movement.\n4. Commutation of the death sentences of Bhagat Singh, Sukhdev, and Rajguru to life imprisonment.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "1, 2 and 3 only" },
          { id: "C", text: "2 and 4 only" },
          { id: "D", text: "1, 3 and 4 only" }
        ],
        answer: "A",
        explanation: "Statements 1 and 2 are correct. Statements 3 and 4 were strictly rejected by Viceroy Lord Irwin.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Lord Irwin agreed to release those who had participated in the non-violent Satyagraha.",
            "Statement 2": "Correct. While the Salt Act was not repealed, Irwin conceded the right to make salt for domestic consumption for villages along the coast.",
            "Statement 3": "Incorrect. The British strictly refused to allow any public inquiry into police excesses, and Gandhi eventually dropped this demand to secure the pact.",
            "Statement 4": "Incorrect. Lord Irwin adamantly refused to pardon or commute the death sentences of the Lahore conspirators, a failure that drew massive criticism upon Gandhi from the youth of the country."
          },
          elimination_technique: "Statements 3 and 4 represent the two major failures of the Gandhi-Irwin negotiations. The execution of Bhagat Singh just days before the Karachi session created a hostile atmosphere for Gandhi. Eliminating 3 and 4 leaves option A.",
          concept_takeaway: "Despite its limitations, the Pact was a psychological victory for Indians. It was the first time the Viceroy of the British Empire negotiated with the leader of the Indian national movement on an equal footing.",
          reference_sources: [
            "Spectrum's A Brief History of Modern India - Gandhi-Irwin Pact",
            "B.L. Grover: A New Look at Modern Indian History"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD11_005",
        syllabusSubtopic: "The Karachi Session (1931)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "Consider the following statements regarding the historic Karachi Session of the Indian National Congress in 1931:\n\n1. It was presided over by Sardar Vallabhbhai Patel.\n2. The session officially endorsed the Gandhi-Irwin Pact and reiterated the goal of Purna Swaraj.\n3. It adopted two landmark resolutions on Fundamental Rights and the National Economic Programme, drafted heavily by Jawaharlal Nehru.\n\nWhich of the statements given above is/are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct. Presided over by Sardar Patel, Karachi (1931) ratified the Delhi Pact and adopted the landmark Fundamental Rights and National Economic Programme resolutions.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Sardar Vallabhbhai Patel served as the President of this highly charged session.",
            "Statement 2": "Correct. Despite the anger over Bhagat Singh's execution, the Congress ratified the Delhi Pact and authorized Gandhi to represent them at the Second Round Table Conference.",
            "Statement 3": "Correct. To placate the left wing and define what 'Swaraj' meant for the masses, the Congress adopted resolutions guaranteeing basic civil liberties, secularism, universal adult franchise, and state ownership of key industries."
          },
          elimination_technique: "The Karachi Session is famous specifically for the Fundamental Rights and National Economic Programme resolutions, which formed the socio-economic blueprint for independent India. All statements are historically accurate.",
          concept_takeaway: "For the first time, the Congress defined what freedom would mean in socioeconomic terms, moving beyond mere political independence to promise minimum wages, rent reduction, and the right to form trade unions.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence - The Karachi Congress",
            "Spectrum's Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD11_006",
        syllabusSubtopic: "Round Table Conferences",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "Regarding the three Round Table Conferences held in London between 1930 and 1932, consider the following statements:\n\n1. The Indian National Congress officially boycotted the First and Third Conferences, participating only in the Second.\n2. B.R. Ambedkar and Tej Bahadur Sapru were among the few Indian leaders who attended all three Round Table Conferences.\n3. The Second Round Table Conference failed primarily because the British refused to grant Purna Swaraj immediately.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "A",
        explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect because the Second RTC broke down over the 'Communal Question' and minority representation deadlocks, not the immediate grant of Purna Swaraj.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Due to the Civil Disobedience Movement, Congress boycotted the first. Following the Gandhi-Irwin pact, Gandhi attended the second. After the talks failed and Gandhi was arrested, they boycotted the third.",
            "Statement 2": "Correct. Dr. B.R. Ambedkar (representing the Depressed Classes) and Sir Tej Bahadur Sapru (a prominent Liberal) attended all three conferences.",
            "Statement 3": "Incorrect. The Second RTC failed due to the 'Communal Question'. The Muslim League, the Hindu Mahasabha, and the Depressed Classes all demanded separate electorates. Gandhi opposed the fragmentation of the Indian nation, leading to a complete deadlock on minority representation, not the immediate grant of Purna Swaraj."
          },
          elimination_technique: "Statement 3 misidentifies the cause of the breakdown. The Minorities Committee deadlock, where different groups squabbled over reserved seats and separate electorates, caused the failure. Eliminating 3 leaves option A.",
          concept_takeaway: "The British effectively used the 'Minorities Pact' at the Second RTC to demonstrate that Indians were too divided to govern themselves, justifying continued imperial control.",
          reference_sources: [
            "Sekhar Bandyopadhyay: From Plassey to Partition",
            "M. Laxmikanth: Indian Polity - Historical Background"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD11_007",
        syllabusSubtopic: "Communal Award and Poona Pact (1932)",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): Mahatma Gandhi undertook a fast unto death in the Yerwada Jail in September 1932 against the Communal Award announced by British Prime Minister Ramsay MacDonald.\nReason (R): The Communal Award recognized the Depressed Classes (Dalits) as a separate minority and granted them separate electorates, which Gandhi believed would permanently divide Hindu society.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains why separate electorates for Dalits caused Gandhi's fast unto death, which led to the Poona Pact.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Gandhi viewed the August 1932 Communal Award as a sinister British plot to separate the 'untouchables' from the mainstream Hindu fold, prompting his fast.",
            "Reason (R)": "True and perfectly explains the Assertion. Gandhi was fine with reserved seats, but separate electorates (where only Dalits could vote for Dalit candidates) meant that untouchability would be legally cemented rather than eradicated."
          },
          elimination_technique: "The political logic is direct: the British announcement (Reason) triggered Gandhi's extreme protest (Assertion). Option A is the correct choice.",
          concept_takeaway: "The fast led to the Poona Pact between Gandhi and Ambedkar. Ambedkar agreed to abandon separate electorates in exchange for a massive increase in reserved seats for the Depressed Classes (from 71 proposed by the British to 147).",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence - The Communal Award",
            "Spectrum's Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD11_008",
        syllabusSubtopic: "Government of India Act 1935",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "The Government of India Act 1935 was the longest Act ever passed by the British Parliament and formed the blueprint for the Indian Constitution. Which of the following were provisions of this Act?\n\n1. Establishment of an All-India Federation consisting of Provinces and Princely States.\n2. Abolition of 'Dyarchy' in the provinces and its introduction at the Centre.\n3. Introduction of bicameralism in all the eleven provinces of British India.\n4. Establishment of a Reserve Bank of India and a Federal Court.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 2 and 4 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 2 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "A",
        explanation: "Statements 1, 2, and 4 are correct. Statement 3 is incorrect because bicameralism was introduced in only 6 out of 11 provinces, not all.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. It proposed a federation, though it never materialized because the requisite number of Princely States refused to join.",
            "Statement 2": "Correct. It replaced provincial dyarchy (introduced in 1919) with 'Provincial Autonomy'. However, it introduced dyarchy at the center (reserved subjects like defense and foreign affairs were kept under the Viceroy).",
            "Statement 3": "Incorrect. Bicameralism (two houses) was introduced in only six out of eleven provinces (Bengal, Bombay, Madras, Bihar, Assam, and the United Provinces), not all of them.",
            "Statement 4": "Correct. The Act established the RBI to control currency and credit, and the Federal Court (set up in 1937), which was the predecessor to the Supreme Court."
          },
          elimination_technique: "Statement 3 contains the absolute word 'all'. Knowing that smaller provinces did not get two houses helps eliminate statement 3. Removing 3 eliminates options B and D, leaving A as the correct choice.",
          concept_takeaway: "Despite offering 'Provincial Autonomy', the Act retained dictatorial powers for the British Governors, who could veto legislation and suspend the provincial governments, rendering the autonomy largely hollow.",
          reference_sources: [
            "M. Laxmikanth: Indian Polity - Historical Background",
            "Spectrum's Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD11_009",
        syllabusSubtopic: "Provincial Elections of 1937 and Congress Ministries",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): The Indian National Congress formed ministries in the majority of British Indian provinces following the 1937 elections, despite initially rejecting the 1935 Act.\nReason (R): The Congress leadership realized that boycotting the elections would allow loyalist and communal parties to capture the provincial governments and use state power against the national movement.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains the pragmatic decision to prevent loyalists from consolidating power by entering ministries.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Although Congress fundamentally rejected the 1935 Act as 'thoroughly rotten, fundamentally bad and totally unacceptable', they contested the elections and formed governments in 8 out of 11 provinces.",
            "Reason (R)": "True and perfectly explains the Assertion. The debate within the Congress (led by Nehru and Bose against office acceptance vs. the right wing for it) concluded that fighting the British from within the state machinery would prevent anti-national forces from consolidating power."
          },
          elimination_technique: "The apparent contradiction of rejecting the constitution but forming the government (Assertion) is resolved by the strategic logic provided in the Reason. A is the correct answer.",
          concept_takeaway: "During their 28 months in power, Congress ministries restored civil liberties, released political prisoners, and enacted tenancy reforms, proving that Indians were highly capable of democratic governance.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence - 28 Months of Congress Rule",
            "Sekhar Bandyopadhyay: From Plassey to Partition"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD11_010",
        syllabusSubtopic: "Resignation of Congress Ministries (1939)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "In October-November 1939, all the Congress provincial ministries resigned. What was the primary reason for this drastic step?\n\n1. The British Viceroy, Lord Linlithgow, declared India a belligerent state in the Second World War without consulting the Central Legislative Assembly or the provincial ministries.\n2. The British refused to immediately declare India an independent nation or promise a Constituent Assembly after the war.\n3. The Muslim League successfully passed a motion of no-confidence against the Congress governments in the Central Legislature.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1 only" },
          { id: "B", text: "1 and 2 only" },
          { id: "C", text: "2 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "B",
        explanation: "Statements 1 and 2 are correct. Resignations were in protest of unilateral declaration of war without consultation, not due to no-confidence motions.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. On September 3, 1939, Britain declared war on Germany. Lord Linlithgow unilaterally declared that India was also at war, deeply insulting the elected Indian representatives.",
            "Statement 2": "Correct. Congress stated they would support the anti-fascist war effort only if Britain declared that the war was being fought for democracy, which must include granting India immediate independence and convening a post-war Constituent Assembly. Linlithgow refused.",
            "Statement 3": "Incorrect. The Muslim League did not bring down the governments through no-confidence motions. However, when the Congress resigned voluntarily, Jinnah called upon Muslims to celebrate December 22, 1939, as a 'Day of Deliverance' from 'Hindu Raj'."
          },
          elimination_technique: "Statement 3 is historically false; the resignations were an act of voluntary protest against the Viceroy's autocratic war declaration, not a legislative defeat. Eliminating 3 leaves option B.",
          concept_takeaway: "The resignation of the Congress ministries created a massive administrative vacuum in the provinces, which the British quickly filled by heavily patronizing the Muslim League, fundamentally altering the balance of power during World War II.",
          reference_sources: [
            "Spectrum's Modern India - Second World War and Nationalist Response",
            "Bipan Chandra: India's Struggle for Independence"
          ]
        }
      }
    ]
  },

  // ==========================================================================
  // MODERN INDIAN HISTORY - MODULE 12
  // ==========================================================================
  {
    id: "MOD-HIST-12",
    subject: "Modern Indian History",
    moduleNumber: 12,
    moduleTitle: "World War II, Quit India, and the INA (1939–1945)",
    curriculum: "UPSC Civil Services Examination (CSE)",
    stage: "Preliminary Examination (General Studies Paper-I)",
    topic: "August Offer, Cripps Mission, Quit India Movement, Peasant Movements, and the Indian National Army",
    title: "Modern Indian History · Module 12: World War II, Quit India & INA (1939–1945)",
    questions: 10,
    duration: 20,
    marksPerQuestion: 2.0,
    negativeMarking: 0.66,
    difficulty: "Moderate to High",
    description: "August Offer 1940, Individual Satyagraha, Cripps Mission proposals, Quit India leaderless uprising, parallel governments, and INA campaigns.",
    questionList: [
      {
        id: "UPSC_MODHIST_MOD12_001",
        syllabusSubtopic: "The August Offer (1940)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "In response to the Congress's demand for a national government during World War II, Viceroy Lord Linlithgow announced the 'August Offer' in 1940. Which of the following were provisions of this offer?\n\n1. It explicitly promised 'Dominion Status' as the objective for India.\n2. It promised the expansion of the Viceroy's Executive Council, which would have a majority of Indians for the first time.\n3. It agreed to the immediate formation of a provisional National Government at the center.\n4. It conceded the demand for a constituent assembly to be set up after the war, mainly drafted by Indians.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 2 and 4 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "A",
        explanation: "Statements 1, 2, and 4 are correct. Statement 3 is incorrect because the British strictly refused to form a provisional national government during the war.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. For the first time, the British explicitly recognized Dominion Status as the official goal.",
            "Statement 2": "Correct. The Executive Council was expanded to include 8 Indians out of 12 members, though crucial portfolios like Defense and Finance remained with the British.",
            "Statement 3": "Incorrect. The British strictly refused to form a provisional national government during the war, which was the core demand of the Congress.",
            "Statement 4": "Correct. It recognized the inherent right of Indians to frame their own constitution after the conclusion of the war."
          },
          elimination_technique: "Statement 3 contradicts the British wartime strategy. They were unwilling to transfer real executive power while fighting a global war. Eliminating statement 3 removes options B, C, and D.",
          concept_takeaway: "The Congress rejected the August Offer because Dominion Status was a 'dead as a doornail' concept by 1940. The Muslim League welcomed the veto power it gave to minorities but rejected it because it did not explicitly promise Pakistan.",
          reference_sources: [
            "Spectrum's A Brief History of Modern India - The August Offer",
            "Bipan Chandra: India's Struggle for Independence"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD12_002",
        syllabusSubtopic: "Individual Satyagraha (1940–1941)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "Following the rejection of the August Offer, Mahatma Gandhi launched the 'Individual Satyagraha'. Consider the following statements regarding this movement:\n\n1. The primary objective of the movement was to seek immediate independence taking advantage of Britain's vulnerability in the war.\n2. The Satyagraha was limited to selected individuals to peacefully affirm the right to free speech against participation in the war.\n3. Acharya Vinoba Bhave was chosen as the first Satyagrahi, followed by Jawaharlal Nehru and Brahma Datt.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "B",
        explanation: "Statements 2 and 3 are correct. Statement 1 is incorrect because Gandhi did not want to embarrass Britain in its fight against Fascism; the goal was moral protest for freedom of speech.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Incorrect. Gandhi explicitly stated that he did not want to embarrass the British government during its existential fight against Fascism. The aim was not to spark a mass uprising for immediate independence, but a limited moral protest.",
            "Statement 2": "Correct. The focus was strictly on the civil liberty of freedom of speech—specifically, the right to preach against the war effort.",
            "Statement 3": "Correct. Vinoba Bhave offered the first Satyagraha in October 1940. Nehru was the second, and Brahma Datt (an inmate of Gandhi's ashram) was the third."
          },
          elimination_technique: "Understanding Gandhi's anti-fascist stance is critical. He refused to launch a full-scale mass movement in 1940 precisely because he did not want to actively help Nazi Germany by paralyzing India. Eliminating statement 1 leaves option B.",
          concept_takeaway: "The Individual Satyagraha (also known as the 'Delhi Chalo' movement) successfully kept the nationalist spirit alive without provoking a brutal wartime crackdown.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence - Individual Satyagraha",
            "NCERT Class XII: Themes in Indian History"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD12_003",
        syllabusSubtopic: "The Cripps Mission (1942)",
        patternType: "Assertion and Reason",
        difficulty: "High",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): The Indian National Congress overwhelmingly rejected the proposals brought by Sir Stafford Cripps in March 1942.\nReason (R): The Cripps proposal allowed any province that did not wish to join the new Indian Union to form a separate constitution, effectively opening the door to the balkanization of India.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains why the provincial opt-out clause in Cripps proposals was seen as a recipe for partition, causing its rejection.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Despite the threat of a Japanese invasion, the Congress rejected the Cripps proposals, with Gandhi famously calling it a 'post-dated cheque on a crashing bank'.",
            "Reason (R)": "True and perfectly explains the Assertion. The 'local option' clause in the Cripps proposal implicitly accepted the Muslim League's demand for Pakistan and gave princely states the right to stay out of the Union, which the Congress saw as a blueprint to shatter Indian unity."
          },
          elimination_technique: "The Congress rejected Cripps primarily for two reasons: the refusal to transfer immediate defense powers and the implicit acceptance of partition (the provincial opt-out clause). Thus, R is the correct historical explanation for A.",
          concept_takeaway: "The failure of the Cripps Mission meant the end of constitutional negotiations. It convinced Gandhi that the British presence was an active hindrance to Indian defense against Japan, leading directly to the Quit India resolution.",
          reference_sources: [
            "Spectrum's Modern India - Cripps Mission",
            "Sekhar Bandyopadhyay: From Plassey to Partition"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD12_004",
        syllabusSubtopic: "Quit India Movement (1942) - Launch and Character",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): The Quit India Movement is often described by historians as a 'leaderless' mass uprising.\nReason (R): In the early hours of August 9, 1942, under 'Operation Zero Hour', the British government arrested Mahatma Gandhi and the entire Congress Working Committee before the movement could be formally launched.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains how Operation Zero Hour decapitated the leadership overnight, causing spontaneous decentralized resistance.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Unlike previous movements, Quit India was characterized by spontaneous, unguided mass violence, strikes, and sabotage of government infrastructure across the country.",
            "Reason (R)": "True and explains the Assertion. Anticipating the uprising after the August 8 Gowalia Tank resolution, the British decapitated the movement overnight. Left without a high command to enforce non-violence, the local populace took matters into their own hands."
          },
          elimination_technique: "The sudden removal of the top tier of leadership (Reason) is the direct historical cause for the decentralized, violent, and spontaneous nature of the 1942 uprising (Assertion). A is the correct answer.",
          concept_takeaway: "Gandhi's mantra of 'Do or Die' was interpreted by the masses as a license to use any means necessary to paralyze the British war state, marking a significant departure from strict Gandhian Ahimsa.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence - Quit India Movement",
            "NCERT Class XII: Themes in Indian History"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD12_005",
        syllabusSubtopic: "Underground Networks and Parallel Governments",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "High",
        question: "During the Quit India Movement, underground networks and parallel governments emerged to challenge British authority. Consider the following pairs:\n\n1. Ballia (United Provinces) : Parallel government established by Chittu Pandey\n2. Tamluk (Bengal) : 'Jatiya Sarkar' which organized an armed 'Vidyut Vahini'\n3. Satara (Maharashtra) : 'Prati Sarkar' led by Nana Patil and Y.B. Chavan\n4. Congress Radio (Bombay) : Secret broadcast run by Usha Mehta and Ram Manohar Lohia\n\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", text: "Only one pair" },
          { id: "B", text: "Only two pairs" },
          { id: "C", text: "Only three pairs" },
          { id: "D", text: "All four pairs" }
        ],
        answer: "D",
        explanation: "All four pairs are correctly matched: Ballia (Chittu Pandey), Tamluk (Jatiya Sarkar & Vidyut Vahini), Satara (Prati Sarkar), and Congress Radio (Usha Mehta & Lohia).",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1": "Correctly matched. Chittu Pandey ran a short-lived but famous parallel government in Ballia in August 1942, releasing political prisoners from jail.",
            "Pair 2": "Correctly matched. The Jatiya Sarkar in Midnapore (Tamluk) lasted until 1944. They undertook cyclone relief work, set up arbitration courts, and formed the Vidyut Vahini (Lightning Brigade).",
            "Pair 3": "Correctly matched. The Prati Sarkar in Satara was the longest-lasting parallel government (up to 1945), running 'Nyayadan Mandals' (people's courts) and attacking British infrastructure.",
            "Pair 4": "Correctly matched. Operating from secret locations in Bombay, Usha Mehta's Congress Radio broadcasted uncensored news to bypass the strict wartime media blackout."
          },
          elimination_technique: "These are the four most defining examples of decentralized resistance during the Quit India movement. Memorizing these specific regional nodes (Ballia, Tamluk, Satara) and the secret radio is essential for UPSC Prelims. All pairs are correct.",
          concept_takeaway: "The second-rung socialist leadership (Jayaprakash Narayan, Aruna Asaf Ali, Ram Manohar Lohia, Sucheta Kripalani) sustained the underground movement after the top leadership was jailed.",
          reference_sources: [
            "Spectrum's A Brief History of Modern India - Quit India Movement",
            "Bipan Chandra: History of Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD12_006",
        syllabusSubtopic: "The Indian National Army (INA)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "Regarding the formation and military campaigns of the Indian National Army (Azad Hind Fauj), consider the following statements:\n\n1. The idea of the INA was first conceived by Subhas Chandra Bose after he fled to Germany in 1941.\n2. The INA established a dedicated women's regiment called the Rani Jhansi Regiment, commanded by Captain Lakshmi Swaminathan.\n3. The INA actively participated in the Japanese offensive in Imphal and Kohima in 1944, planting the Indian tricolor at Moirang.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "B",
        explanation: "Statements 2 and 3 are correct. Statement 1 is incorrect because the INA was originally conceived in Malaya by Captain Mohan Singh, not Subhas Bose.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Incorrect. The idea of the INA was first conceived in Malaya by Captain Mohan Singh, an Indian officer of the British Indian Army who surrendered to the Japanese. Bose took over the leadership (second phase) much later in 1943 in Singapore.",
            "Statement 2": "Correct. The Rani of Jhansi regiment was an extraordinary feature of the INA, highlighting Bose's commitment to women's equality in the freedom struggle.",
            "Statement 3": "Correct. The INA, alongside the Japanese 15th Army, fought on Indian soil in Manipur and Nagaland. They hoisted the flag at Moirang, but the offensive ultimately failed due to monsoon logistics and British air superiority."
          },
          elimination_technique: "A common historical misconception is that Bose founded the INA. It was founded by Mohan Singh and Rash Behari Bose; Subhas Bose reorganized and revived it. Eliminating statement 1 leaves Option B.",
          concept_takeaway: "Though militarily defeated, the INA's psychological impact was immense. The post-war INA trials at the Red Fort destroyed the loyalty of the British Indian armed forces, accelerating the British departure.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence - The Indian National Army",
            "Spectrum's Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD12_007",
        syllabusSubtopic: "Peasant and States' People Movements (1930s-40s)",
        patternType: "Pair Matching (New Pattern)",
        difficulty: "High",
        question: "During the late 1930s, peasant and regional movements increasingly aligned with the national freedom struggle. Consider the following pairs:\n\n1. All India Kisan Sabha (1936) : Swami Sahajanand Saraswati and N.G. Ranga\n2. Haripura Congress Session (1938) : Officially permitted the Congress to directly intervene in the internal affairs of Princely States\n3. Tebhaga Movement (1946) : Bengal sharecroppers demanding two-thirds of the harvest instead of half\n\nHow many of the pairs given above are correctly matched?",
        options: [
          { id: "A", text: "Only one pair" },
          { id: "B", text: "Only two pairs" },
          { id: "C", text: "All three pairs" },
          { id: "D", text: "None of the pairs" }
        ],
        answer: "B",
        explanation: "Pairs 1 and 3 are correctly matched. Pair 2 is incorrectly matched because Haripura maintained a policy of non-intervention in Princely States.",
        detailedExplanation: {
          statement_analysis: {
            "Pair 1": "Correctly matched. The AIKS was founded in Lucknow with Swami Sahajanand as President and N.G. Ranga as General Secretary, integrating isolated peasant movements into an all-India platform.",
            "Pair 2": "Incorrectly matched. At the Haripura session, the Congress maintained its traditional policy of non-interference in Princely States. They stated that while state subjects could form organizations (Praja Mandals), they could not use the 'Congress' name. Direct intervention only began at the Tripuri (1939) and Ludhiana sessions.",
            "Pair 3": "Correctly matched. Driven by the Bengal Provincial Kisan Sabha, the Tebhaga (three parts) movement was a fierce struggle by sharecroppers (bargadars) to keep 2/3rds of the produce, reducing the landlord's share from 1/2 to 1/3rd."
          },
          elimination_technique: "Understanding the Congress's hesitant policy toward Princely States is vital. The Haripura resolution specifically denied direct Congress intervention, frustrating radical state leaders. Eliminating pair 2 leaves two correct pairs.",
          concept_takeaway: "The alignment of the All India States Peoples' Conference (AISPC) with the Congress (with Nehru becoming its president in 1939) laid the groundwork for Sardar Patel's post-independence integration of the states.",
          reference_sources: [
            "Sekhar Bandyopadhyay: From Plassey to Partition",
            "Spectrum's A Brief History of Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD12_008",
        syllabusSubtopic: "C. Rajagopalachari Formula (1944)",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): M.A. Jinnah rejected the C. Rajagopalachari Formula (CR Formula) of 1944, which was a blueprint to resolve the Congress-League political deadlock.\nReason (R): The CR Formula proposed that the entire adult population of the Muslim-majority areas in the North-West and East should vote in a plebiscite on the issue of partition, rather than just the Muslim population.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains why Jinnah's Two-Nation Theory rejected a common plebiscite involving non-Muslims.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Gandhi held talks with Jinnah in 1944 based on the CR Formula, which Jinnah completely rejected.",
            "Reason (R)": "True and is the correct explanation. Jinnah demanded that only Muslims in those provinces should be allowed to vote in the plebiscite. He also objected to the formula's premise that the League should endorse the demand for independence first, with partition happening after the British left."
          },
          elimination_technique: "The CR Formula implicitly accepted the possibility of Pakistan (a major concession by Congress), but Jinnah's two-nation theory dictated that Muslims were a separate nation and thus only they had the right to self-determination. R accurately explains A.",
          concept_takeaway: "The failure of the Gandhi-Jinnah talks (1944) convinced the British that the two communities could not reach a compromise on their own, setting the stage for future British arbitration (Cabinet Mission).",
          reference_sources: [
            "Spectrum's Modern India - Rajagopalachari Formula",
            "B.L. Grover: A New Look at Modern Indian History"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD12_009",
        syllabusSubtopic: "Wavell Plan and Simla Conference (1945)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "Lord Wavell convened the Simla Conference in June 1945 to discuss a new executive council. Consider the following statements regarding the 'Wavell Plan':\n\n1. It proposed that all members of the Viceroy's Executive Council, including the Viceroy and Commander-in-Chief, would be Indians.\n2. It proposed equal representation for 'Caste Hindus' and Muslims in the newly formed Executive Council.\n3. The conference broke down because the Muslim League insisted that it alone had the right to nominate all Muslim members to the council, a claim rejected by the Congress.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "B",
        explanation: "Statements 2 and 3 are correct. Statement 1 is incorrect because the Viceroy and Commander-in-Chief were to remain British under the Wavell Plan.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Incorrect. The plan proposed that all portfolios would be transferred to Indians, except the Viceroy and the Commander-in-Chief, who would remain British.",
            "Statement 2": "Correct. This parity was a major British concession to the Muslim League, elevating their status to equal that of the vast majority Hindu population.",
            "Statement 3": "Correct. Congress, insisting on its secular national character, wanted to nominate Nationalist Muslims (like Maulana Abul Kalam Azad) to its share of the council. Jinnah vetoed this, leading Wavell to abandon the plan."
          },
          elimination_technique: "The British never offered up the Commander-in-Chief position before independence. Eliminating statement 1 removes options A, C, and D.",
          concept_takeaway: "By abandoning the plan due to Jinnah's veto, Lord Wavell officially recognized the Muslim League as the sole representative of Indian Muslims, significantly boosting Jinnah's prestige ahead of the critical 1945-46 elections.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence",
            "Spectrum's A Brief History of Modern India - Wavell Plan"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD12_010",
        syllabusSubtopic: "Desai-Liaquat Pact (1945)",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): The Desai-Liaquat Pact of 1945 was a draft agreement aimed at forming a coalition interim government at the center.\nReason (R): The pact successfully resolved the communal deadlock as both the Congress and Muslim League high commands officially ratified the agreement.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "C",
        explanation: "Assertion (A) is true but Reason (R) is false. The Desai-Liaquat pact was never officially approved or ratified by either Gandhi/Congress or Jinnah/Muslim League.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Bhulabhai Desai (Congress) and Liaquat Ali Khan (Muslim League) drafted a pact for an interim government consisting of equal numbers of persons nominated by Congress and the League, plus 20% reserved seats for minorities.",
            "Reason (R)": "False. The pact was a private negotiation between the two leaders in the central legislature. Neither Gandhi and the Congress high command nor Jinnah officially approved it. It remained a dead letter and was ultimately discarded."
          },
          elimination_technique: "Every major pact in the 1940s failed to resolve the communal deadlock (until Partition). If R were true, the Simla Conference and Cabinet Mission wouldn't have been necessary. Since R is false, C is the answer.",
          concept_takeaway: "Though it failed, the Desai-Liaquat draft demonstrated that Indian parliamentarians were attempting to bridge the gap even while their top leadership was imprisoned or in ideological deadlock.",
          reference_sources: [
            "Spectrum's Modern India - Desai-Liaquat Pact",
            "B.L. Grover: A New Look at Modern Indian History"
          ]
        }
      }
    ]
  },

  // ==========================================================================
  // MODERN INDIAN HISTORY - MODULE 13
  // ==========================================================================
  {
    id: "MOD-HIST-13",
    subject: "Modern Indian History",
    moduleNumber: 13,
    moduleTitle: "Towards Freedom and Partition (1945–1947)",
    curriculum: "UPSC Civil Services Examination (CSE)",
    stage: "Preliminary Examination (General Studies Paper-I)",
    topic: "INA Trials, RIN Mutiny, Cabinet Mission, and the Indian Independence Act",
    title: "Modern Indian History · Module 13: Freedom and Partition (1945–1947)",
    questions: 10,
    duration: 20,
    marksPerQuestion: 2.0,
    negativeMarking: 0.66,
    difficulty: "Moderate to High",
    description: "Red Fort INA trials, RIN naval mutiny, Cabinet Mission grouping clauses, Attlee's declaration, Mountbatten plan, Radcliffe awards, and Indian Independence Act 1947.",
    questionList: [
      {
        id: "UPSC_MODHIST_MOD13_001",
        syllabusSubtopic: "The INA Trials (1945-46)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "With reference to the Indian National Army (INA) trials held at the Red Fort in 1945-46, consider the following statements:\n\n1. The first batch of INA officers put on trial included a Hindu, a Muslim, and a Sikh: Prem Kumar Sehgal, Shah Nawaz Khan, and Gurbaksh Singh Dhillon.\n2. The Indian National Congress officially boycotted the trials and refused to provide any legal assistance to the INA prisoners.\n3. The massive public upsurge in support of the INA forced the Commander-in-Chief, Claude Auchinleck, to remit their sentences of transportation for life.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "1 and 3 only" },
          { id: "C", text: "2 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "B",
        explanation: "Statements 1 and 3 are correct. Statement 2 is incorrect because the Congress actively organized the INA Defence Committee with legal stalwarts like Nehru, Bhulabhai Desai, and Sapru.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The British strategically, yet foolishly, put a secular trio of officers on trial together, which instantly united all religious communities in India in their defense.",
            "Statement 2": "Incorrect. The Congress fully supported the INA prisoners. They formed the INA Defence Committee, which included legal stalwarts like Bhulabhai Desai, Tej Bahadur Sapru, Kailash Nath Katju, Asaf Ali, and Jawaharlal Nehru (who donned his barrister's gown after decades).",
            "Statement 3": "Correct. Despite being found guilty of 'waging war against the King', the unprecedented nationwide strikes and mutinies forced the British to release them to prevent a full-scale rebellion."
          },
          elimination_technique: "Statement 2 contradicts the well-known historical fact that the Congress actively championed the INA cause as a major political rallying point post-World War II. Eliminating 2 leaves Option B.",
          concept_takeaway: "The INA trials were the tipping point that destroyed the loyalty of the British Indian armed forces, convincing the British that they could no longer rely on Indian soldiers to maintain imperial rule.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence - The Post-War National Upsurge",
            "Spectrum's A Brief History of Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD13_002",
        syllabusSubtopic: "Royal Indian Navy (RIN) Mutiny (1946)",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "Regarding the Royal Indian Navy (RIN) Mutiny of February 1946, consider the following statements:\n\n1. It began on the HMIS Talwar in Bombay as a protest against unpalatable food, racial discrimination, and the arrest of rating B.C. Dutt for writing 'Quit India' on the ship's walls.\n2. The striking ratings hoisted the tricolor, the crescent, and the hammer and sickle flags together on the ships.\n3. Mahatma Gandhi and Sardar Vallabhbhai Patel highly praised the violent mutiny and urged the ratings to continue their armed struggle against the British.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "A",
        explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect because Patel, Gandhi, and Jinnah all condemned the mutiny to prevent indiscipline in the armed forces on the eve of independence.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The mutiny was sparked by terrible conditions and racial abuse by British officers, quickly escalating into a political strike demanding the release of INA prisoners.",
            "Statement 2": "Correct. In a remarkable display of anti-imperialist solidarity, the ratings intertwined the flags of the Congress, the Muslim League, and the Communist Party on the masts of the captured ships.",
            "Statement 3": "Incorrect. Both Sardar Patel (Congress) and M.A. Jinnah (Muslim League) strongly condemned the mutiny, fearing a breakdown of military discipline on the eve of independence. Patel personally intervened and persuaded the Naval Central Strike Committee to surrender."
          },
          elimination_technique: "The mainstream national leadership (Congress and League) was preparing for a transfer of power and did not want to inherit a fractured, mutinous military. Knowing Gandhi's strict non-violence and Patel's pragmatic approach eliminates statement 3.",
          concept_takeaway: "The RIN Mutiny demonstrated that the anti-imperialist sentiment had deeply penetrated the final bastion of British power—the armed forces—accelerating the dispatch of the Cabinet Mission.",
          reference_sources: [
            "Sekhar Bandyopadhyay: From Plassey to Partition",
            "NCERT Class XII: Themes in Indian History"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD13_003",
        syllabusSubtopic: "The Cabinet Mission Plan (1946)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "The Cabinet Mission (consisting of Pethick-Lawrence, Stafford Cripps, and A.V. Alexander) arrived in India in 1946 to negotiate the transfer of power. Which of the following were core proposals of the Cabinet Mission Plan?\n\n1. It accepted the Muslim League's demand for a fully sovereign and separate state of Pakistan.\n2. It proposed a weak Central Government controlling only Defence, Foreign Affairs, and Communications.\n3. It grouped the provincial assemblies into three sections (A, B, and C) to draft provincial and group constitutions.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "B",
        explanation: "Statements 2 and 3 are correct. Statement 1 is incorrect because the Cabinet Mission explicitly rejected a sovereign Pakistan.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Incorrect. The Cabinet Mission explicitly rejected the demand for a sovereign Pakistan, arguing it would not solve the communal minority problem and would be economically and militarily unviable.",
            "Statement 2": "Correct. To placate the Muslim League, it proposed a highly decentralized, three-tier federal structure where the center had minimal powers and all residuary powers rested with the provinces.",
            "Statement 3": "Correct. Provinces were divided into Section A (Hindu-majority), Section B (Muslim-majority North-West), and Section C (Muslim-majority North-East). These groups were to form an intermediate level of government between the provinces and the center."
          },
          elimination_technique: "The explicit rejection of Pakistan is the most defining feature of the Cabinet Mission Plan. It attempted to preserve a united India through mandatory grouping. Eliminating statement 1 leaves Option B.",
          concept_takeaway: "The plan ultimately failed because of differing interpretations: Congress argued that joining a group was optional for a province from the start (protecting Assam and NWFP), while the League argued grouping was compulsory.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence - The Cabinet Mission",
            "Spectrum's Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD13_004",
        syllabusSubtopic: "Direct Action Day and Interim Government (1946)",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): The Muslim League withdrew its acceptance of the Cabinet Mission Plan and called for 'Direct Action Day' on August 16, 1946.\nReason (R): Jawaharlal Nehru gave a press statement declaring that the Congress would enter the Constituent Assembly 'completely unfettered' and was free to modify the Cabinet Mission Plan, particularly regarding the grouping clause.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains why Nehru's press statement shattered Jinnah's trust in the Cabinet Mission grouping clause, triggering Direct Action Day.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Frustrated by the political deadlock, Jinnah called for Direct Action to achieve Pakistan, leading to the catastrophic 'Great Calcutta Killings' and nationwide communal riots.",
            "Reason (R)": "True and perfectly explains the Assertion. Nehru's speech in July 1946 alarmed Jinnah. Jinnah realized that once the British left, the Hindu-majority Constituent Assembly could vote to dismantle the mandatory grouping system (the League's only guarantee of regional power in a united India)."
          },
          elimination_technique: "The causal relationship is direct. Nehru's assertion of parliamentary sovereignty over the Cabinet Mission's framework (Reason) destroyed the League's trust in the constitutional process, triggering their pivot to violent street agitation (Assertion).",
          concept_takeaway: "When the Interim Government was formed in September 1946, the League initially boycotted it, but joined in October. Their Finance Minister, Liaquat Ali Khan, used his veto power to paralyze the Congress ministries, proving that a united government was unworkable.",
          reference_sources: [
            "Sekhar Bandyopadhyay: From Plassey to Partition",
            "Bipan Chandra: History of Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD13_005",
        syllabusSubtopic: "Clement Attlee's Declaration (Feb 1947)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High",
        question: "On February 20, 1947, British Prime Minister Clement Attlee made a historic statement in the House of Commons. Which of the following were key components of this declaration?\n\n1. It fixed a strict deadline of June 30, 1948, for the complete withdrawal of British power from India.\n2. It announced the replacement of Lord Wavell with Lord Mountbatten as the Viceroy of India.\n3. It clarified that if the Constituent Assembly was not fully representative by the deadline, power would automatically be transferred exclusively to the Muslim League.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "A",
        explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect because Attlee stated power would be transferred to central, provincial, or other reasonable authorities, not exclusively to the Muslim League.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Attlee set a definitive deadline (June 30, 1948) to shock the Indian parties into reaching an agreement and to absolve the British of responsibility for the deteriorating law and order situation.",
            "Statement 2": "Correct. Lord Mountbatten was appointed to execute the rapid withdrawal and was given sweeping plenary powers to negotiate.",
            "Statement 3": "Incorrect. The declaration stated that if a fully representative assembly failed to draft a constitution by the deadline, the British would consider transferring power to the central government, or to existing provincial governments, or in some other reasonable way. It did not promise power exclusively to the League."
          },
          elimination_technique: "Statement 3 is extreme and illogical; the British would never legally commit to handing the entire subcontinent over to a minority party. Eliminating 3 leaves Option A.",
          concept_takeaway: "Attlee's deadline inadvertently incentivized the Muslim League to intensify communal riots to topple Congress/Unionist provincial governments in Punjab and the NWFP, aiming to be the 'existing provincial government' when the British left.",
          reference_sources: [
            "Spectrum's A Brief History of Modern India - Attlee's Statement",
            "M. Laxmikanth: Indian Polity"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD13_006",
        syllabusSubtopic: "The Mountbatten Plan (June 3 Plan, 1947)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "The Mountbatten Plan (June 3, 1947) provided the final blueprint for the partition of India. Which of the following provisions were included in this plan?\n\n1. The provincial legislative assemblies of Bengal and Punjab would meet in two parts (Hindu-majority and Muslim-majority districts) to vote on partition.\n2. Referendums would be held in the North-West Frontier Province (NWFP) and the Sylhet district of Assam to decide their fate.\n3. The princely states were given the option to join either India or Pakistan, or to remain fully independent sovereign nations under British protection.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "2 and 3 only" },
          { id: "C", text: "1 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "A",
        explanation: "Statements 1 and 2 are correct. Statement 3 is incorrect because Mountbatten informed Princes that complete independence was unviable and British protection was terminated.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. If either part voted for partition by a simple majority, the province would be partitioned. Both provinces eventually voted to partition.",
            "Statement 2": "Correct. Referendums were mandated for NWFP and Sylhet (a Bengali-speaking Muslim-majority district in Assam). Both voted to join Pakistan.",
            "Statement 3": "Incorrect. While paramountcy lapsed, Mountbatten explicitly told the Princes that remaining completely independent was not a practical option; they had to accede to either India or Pakistan based on geographical contiguity and the wishes of their people. British protection was entirely withdrawn."
          },
          elimination_technique: "The British definitively refused to allow 500+ princely states to become independent sovereign entities, which would have balkanized the subcontinent. Eliminating statement 3 leaves Option A.",
          concept_takeaway: "The plan was accepted by the Congress because it ensured that India retained the maximum possible territory and a strong center, and by the League because it finally secured the creation of a sovereign Pakistan.",
          reference_sources: [
            "Spectrum's Modern India - Mountbatten Plan",
            "B.L. Grover: A New Look at Modern Indian History"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD13_007",
        syllabusSubtopic: "Referendum in the NWFP",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): Khan Abdul Ghaffar Khan and his 'Khudai Khidmatgars' boycotted the 1947 referendum held in the North-West Frontier Province (NWFP).\nReason (R): The referendum offered the voters only the choice of joining India or Pakistan, but denied them the third option of independence (a sovereign Pashtunistan), which Ghaffar Khan demanded.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains why Ghaffar Khan boycotted the binary referendum that excluded Pashtun self-determination.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Despite being a Congress stronghold, Ghaffar Khan (the Frontier Gandhi) advised his followers to boycott the referendum.",
            "Reason (R)": "True and perfectly explains the Assertion. Ghaffar Khan felt betrayed by the Congress for accepting the partition plan without securing the Pashtuns' right to self-determination. He famously lamented that the Congress had 'thrown us to the wolves'."
          },
          elimination_technique: "The strict binary choice (India or Pakistan) imposed by the Mountbatten Plan left the secular, anti-partition Pashtun leadership with no acceptable political option, leading directly to their boycott. R explains A.",
          concept_takeaway: "Due to the boycott, the Muslim League won the referendum easily, and the NWFP became part of Pakistan, leading to decades of political marginalization for Ghaffar Khan under the Pakistani state.",
          reference_sources: [
            "Bipan Chandra: India's Struggle for Independence",
            "Sekhar Bandyopadhyay: From Plassey to Partition"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD13_008",
        syllabusSubtopic: "The Boundary Commissions (Radcliffe Award)",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate",
        question: "With reference to the Boundary Commissions established under the Mountbatten Plan, consider the following statements:\n\n1. Two separate boundary commissions were set up for Punjab and Bengal, both chaired by Sir Cyril Radcliffe.\n2. Radcliffe was chosen because of his extensive historical and cultural knowledge of the Indian subcontinent.\n3. The final boundary awards were deliberately published a few days after August 15, 1947.\n\nWhich of the statements given above are correct?",
        options: [
          { id: "A", text: "1 and 2 only" },
          { id: "B", text: "1 and 3 only" },
          { id: "C", text: "2 and 3 only" },
          { id: "D", text: "1, 2 and 3" }
        ],
        answer: "B",
        explanation: "Statements 1 and 3 are correct. Statement 2 is incorrect because Radcliffe had never visited India and was chosen for his theoretical detachment.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Sir Cyril Radcliffe, a British lawyer, chaired both the Punjab and Bengal Boundary Commissions.",
            "Statement 2": "Incorrect. Radcliffe was specifically chosen because he had never been to India before and had no prior knowledge of its society, making him theoretically 'impartial' to the claims of the Hindus, Muslims, and Sikhs.",
            "Statement 3": "Correct. Mountbatten received the awards on August 12 but deliberately delayed their publication until August 17. He did this so that the inevitable mass violence and ethnic cleansing would be the responsibility of the newly independent Indian and Pakistani governments, not the British."
          },
          elimination_technique: "Statement 2 is a tragic historical irony. Radcliffe drew the borders of a complex subcontinent in 5 weeks using outdated maps precisely because he lacked local knowledge. Eliminating 2 leaves Option B.",
          concept_takeaway: "The Radcliffe Line sliced through homes, fields, and irrigation systems, sparking one of the largest and bloodiest mass migrations in human history.",
          reference_sources: [
            "Dominique Lapierre and Larry Collins: Freedom at Midnight",
            "Spectrum's Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD13_009",
        syllabusSubtopic: "Indian Independence Act (1947)",
        patternType: "Multi-Statement Analysis",
        difficulty: "High",
        question: "The Indian Independence Act was passed by the British Parliament in July 1947. Which of the following constitutional provisions were enacted by this legislation?\n\n1. It declared India and Pakistan as two independent dominions, granting their Constituent Assemblies full sovereign power to frame any constitution.\n2. It provided for the continuation of the Office of the Secretary of State for India to oversee the transition of the princely states.\n3. It abolished the title of 'Emperor of India' from the royal styles and titles of the King of England.\n4. It stipulated that until the new constitutions were drafted, the dominions would be governed in accordance with the Government of India Act 1935.\n\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", text: "1, 3 and 4 only" },
          { id: "B", text: "2, 3 and 4 only" },
          { id: "C", text: "1, 2 and 3 only" },
          { id: "D", text: "1, 2, 3 and 4" }
        ],
        answer: "A",
        explanation: "Statements 1, 3, and 4 are correct. Statement 2 is incorrect because the Act abolished the Office of Secretary of State for India.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. The Act created two sovereign dominions and empowered their respective Constituent Assemblies to repeal any British law, including the Independence Act itself.",
            "Statement 2": "Incorrect. The Act completely abolished the Office of the Secretary of State for India, transferring his functions to the Secretary of State for Commonwealth Affairs.",
            "Statement 3": "Correct. The British monarch officially dropped the imperial title, signaling the end of the British Raj.",
            "Statement 4": "Correct. The Government of India Act 1935 served as the interim constitutional framework, though both dominions were free to modify it."
          },
          elimination_technique: "The purpose of the Act was complete withdrawal of British sovereignty. Maintaining the 'Secretary of State for India' (Statement 2) contradicts the core principle of independence. Eliminating 2 leaves Option A.",
          concept_takeaway: "The Act transformed the Governor-General (Mountbatten, and later C. Rajagopalachari) from an autocratic imperial ruler into a constitutional figurehead bound by the advice of the Indian cabinet.",
          reference_sources: [
            "M. Laxmikanth: Indian Polity - Historical Background",
            "Spectrum's Modern India"
          ]
        }
      },
      {
        id: "UPSC_MODHIST_MOD13_010",
        syllabusSubtopic: "Integration of Princely States (Pre-Independence Phase)",
        patternType: "Assertion and Reason",
        difficulty: "Moderate",
        question: "Given below are two statements, one labelled as Assertion (A) and the other labelled as Reason (R):\n\nAssertion (A): By August 15, 1947, Sardar Vallabhbhai Patel had successfully secured the accession of almost all princely states geographically contiguous to India, with the notable exceptions of Junagadh, Hyderabad, and Kashmir.\nReason (R): Patel convinced the princes to sign the 'Instrument of Accession', under which they only had to surrender control of Defence, External Affairs, and Communications to the Indian Union, retaining internal autonomy.\n\nIn the context of the statements above, which of the following is correct?",
        options: [
          { id: "A", text: "Both (A) and (R) are true and (R) is the correct explanation of (A)" },
          { id: "B", text: "Both (A) and (R) are true but (R) is not the correct explanation of (A)" },
          { id: "C", text: "(A) is true but (R) is false" },
          { id: "D", text: "(A) is false but (R) is true" }
        ],
        answer: "A",
        explanation: "Both (A) and (R) are true and (R) explains how Patel's initial 3-subject concession made accession politically acceptable to the princes.",
        detailedExplanation: {
          statement_analysis: {
            "Assertion (A)": "True. Aided by V.P. Menon, Patel engaged in a masterful diplomatic blitzkrieg, integrating over 500 states before independence day, leaving only the three famous holdouts.",
            "Reason (R)": "True and perfectly explains the strategy mentioned in the Assertion. By asking for only three essential subjects (which the princes had never controlled anyway under British paramountcy) and promising to respect their internal sovereignty and privileges, Patel made accession politically palatable."
          },
          elimination_technique: "Patel's success relied on a mix of veiled threats of mass agitation by the State Peoples' Conferences and the highly reasonable terms of the initial Instrument of Accession. R perfectly explains the 'how' of A's historical achievement.",
          concept_takeaway: "Once the states were securely inside the Union, Patel launched the second phase of integration (post-1947), merging them into larger administrative units and eventually democratizing them, fully eroding their internal autonomy.",
          reference_sources: [
            "V.P. Menon: The Story of the Integration of the Indian States",
            "Bipan Chandra: India Since Independence"
          ]
        }
      }
    ]
  }
];
