import fs from "fs";
import path from "path";
import { PYQQuestion } from "../lib/core/types";

export const POLITY_PART2: PYQQuestion[] = [
  // 16. PARLIAMENT (Ch 16)
  {
    id: "pol-ch16-q144",
    year: 2024,
    subject: "Polity",
    topic: "Parliament",
    chapterNumber: 16,
    paper: "GS-1",
    question: "144. With reference to Union Budget, consider the following statements : (2024)\n1. The Union Finance Minister on behalf of the Prime Minister, lays the Annual Financial Statement before both the Houses of Parliament.\n2. At the Union level, no demand for a grant be made except on the recommendation of the President of India.\n\nWhich of the statements given above is/are correct ?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: Under Article 112, the President causes the Annual Financial Statement to be laid before Parliament (the Finance Minister does so on behalf of the President, not the Prime Minister).\nStatement 2 is correct: Under Article 113(3), no demand for a grant can be made except on the recommendation of the President.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Union Budget", "Article 112", "Article 113", "Demands for Grants", "President"]
  },
  {
    id: "pol-ch16-q145",
    year: 2024,
    subject: "Polity",
    topic: "Parliament",
    chapterNumber: 16,
    paper: "GS-1",
    question: "145. With reference to the Speaker of the Lok Sabha, consider the following statements: (2024)\nWhile any resolution for the removal of the Speaker of the Lok Sabha is under consideration:\n1. He/she shall not preside.\n2. He/She shall not have the right to speak.\n3. He/She shall not be entitled to vote on the resolution in the first instance.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "1 and 2 only" },
      { id: "c", key: "C", text: "2 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: Under Article 96(1), the Speaker cannot preside when a removal resolution is under consideration.\nStatement 2 is incorrect: Under Article 96(2), the Speaker has the right to speak and take part in proceedings.\nStatement 3 is incorrect: The Speaker can vote in the first instance, but has no casting vote in case of a tie.",
    superHint: "S1 is common sense: no one presides as judge in their own trial. S2 is too extreme: natural justice allows the accused to speak in defence. Only 1 is correct.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Speaker of Lok Sabha", "Article 96", "Removal Resolution", "Parliament"]
  },
  {
    id: "pol-ch16-q146",
    year: 2024,
    subject: "Polity",
    topic: "Parliament",
    chapterNumber: 16,
    paper: "GS-1",
    question: "146. With reference to the Indian Parliament, consider the following statements: (2024)\n1. A bill pending in the Lok Sabha lapses on its dissolution.\n2. A bill passed by the Lok Sabha and pending in the Rajya Sabha lapses on the dissolution of the Lok Sabha.\n3. A bill in regard to which the President of India notified his/her intention to summon the Houses to a joint sitting lapses on the dissolution of the Lok Sabha.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "1 and 2" },
      { id: "c", key: "C", text: "2 and 3" },
      { id: "d", key: "D", text: "3 only" }
    ],
    correctAnswer: "B",
    explanation: "Statements 1 and 2 are correct under Article 107(5): Any bill pending in Lok Sabha, or passed by Lok Sabha and pending in Rajya Sabha, lapses upon dissolution.\nStatement 3 is incorrect: Under Article 108(5), if the President has already notified a joint sitting before dissolution, the bill DOES NOT lapse.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Parliament", "Lapsing of Bills", "Dissolution of Lok Sabha", "Article 107", "Joint Sitting"]
  },
  {
    id: "pol-ch16-q148",
    year: 2024,
    subject: "Polity",
    topic: "Parliament",
    chapterNumber: 16,
    paper: "GS-1",
    question: "148. Which of the following statements are correct in respect of a Money Bill in the Parliament? (2024)\n1. Article 109 mentions special procedure in respect of Money Bills.\n2. A Money Bill shall not be introduced in the Council of States.\n3. The Rajya Sabha can either approve the Bill or suggest changes but cannot reject it.\n4. Amendments to a Money Bill suggested by the Rajya Sabha have to be accepted by the Lok Sabha.\n\nSelect the answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1, 2 and 3" },
      { id: "d", key: "D", text: "1, 3 and 4" }
    ],
    correctAnswer: "C",
    explanation: "Statements 1, 2, and 3 are correct under Article 109. Statement 4 is incorrect: Lok Sabha may either accept or reject all or any of the recommendations made by Rajya Sabha.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Money Bill", "Article 109", "Rajya Sabha Powers", "Lok Sabha Supremacy"]
  },
  {
    id: "pol-ch16-q150",
    year: 2024,
    subject: "Polity",
    topic: "Parliament",
    chapterNumber: 16,
    paper: "GS-1",
    question: "150. How many Delimitation Commissions have been constituted by the Government of India till December 2023? (2024)",
    options: [
      { id: "a", key: "A", text: "One" },
      { id: "b", key: "B", text: "Two" },
      { id: "c", key: "C", text: "Three" },
      { id: "d", key: "D", text: "Four" }
    ],
    correctAnswer: "D",
    explanation: "Delimitation Commissions have been set up four times in India under parliamentary Acts: in 1952, 1963, 1973, and 2002.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Delimitation Commission", "Article 82", "Electoral Boundaries", "Parliament"]
  },
  {
    id: "pol-ch16-q173",
    year: 2015,
    subject: "Polity",
    topic: "Parliament",
    chapterNumber: 16,
    paper: "GS-1",
    question: "173. When a bill is referred to a joint sitting of both the Houses of the Parliament, it has to be passed by: (2015)",
    options: [
      { id: "a", key: "A", text: "a simple majority of members present and voting" },
      { id: "b", key: "B", text: "three-fourths majority of members present and voting" },
      { id: "c", key: "C", text: "two-thirds majority of the Houses" },
      { id: "d", key: "D", text: "absolute majority of the Houses" }
    ],
    correctAnswer: "A",
    explanation: "Under Article 108(4), if a bill is passed by a simple majority of the total number of members of both Houses present and voting at a joint sitting, it is deemed to have been passed by both Houses.",
    extraEdge: "Joint sitting applies only to ordinary bills and financial bills, not Money Bills or Constitutional Amendment Bills. The Speaker of Lok Sabha presides.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Joint Sitting", "Article 108", "Simple Majority", "Parliamentary Deadlock"]
  },
  {
    id: "pol-ch16-q175",
    year: 2014,
    subject: "Polity",
    topic: "Parliament",
    chapterNumber: 16,
    paper: "GS-1",
    question: "175. Which one of the following is the largest Committee of the Parliament? (2014)",
    options: [
      { id: "a", key: "A", text: "The Committee on Public Accounts" },
      { id: "b", key: "B", text: "The committee on Estimates" },
      { id: "c", key: "C", text: "The Committee on Public Undertakings" },
      { id: "d", key: "D", text: "The committee on Petitions" }
    ],
    correctAnswer: "B",
    explanation: "The Estimates Committee has 30 members, drawn entirely from the Lok Sabha (no Rajya Sabha members), making it the largest standing committee of Parliament. (PAC and COPU have 22 members each).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Parliamentary Committees", "Estimates Committee", "Lok Sabha", "Public Accounts Committee"]
  },

  // 17. HIGHER JUDICIARY: SC AND HC (Ch 17)
  {
    id: "pol-ch17-q210",
    year: 2023,
    subject: "Polity",
    topic: "Higher Judiciary: SC & HC",
    chapterNumber: 17,
    paper: "GS-1",
    question: "210. Consider the following statements: (2023)\nStatement-I: The Supreme Court of India has held in some judgments that the reservation policies made under Article 16(4) of the Constitution of India would be limited by Article 335 for the maintenance of efficiency of administration.\nStatement-II: Article 335 of the Constitution of India defines the term ‘efficiency of administration’.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement-I and Statement-II are correct and Statement-II is the correct explanation for Statement-I." },
      { id: "b", key: "B", text: "Both Statement-I and Statement-II are correct and Statement-II is not the correct explanation for Statement-I." },
      { id: "c", key: "C", text: "Statement-I is correct but Statement-II is incorrect." },
      { id: "d", key: "D", text: "Statement-I is incorrect but Statement-II is correct." }
    ],
    correctAnswer: "C",
    explanation: "Statement-I is correct: In Indra Sawhney (1992) and M. Nagaraj (2006), the Supreme Court ruled that affirmative action under Article 16(4) is circumscribed by Article 335.\nStatement-II is incorrect: Article 335 mentions 'efficiency of administration' but does NOT define the term.",
    superHint: "\"The Constitution defines X\" is almost always false for subjective governance phrases.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Supreme Court", "Article 335", "Article 16(4)", "Reservation", "Efficiency of Administration"]
  },
  {
    id: "pol-ch17-q215",
    year: 2019,
    subject: "Polity",
    topic: "Higher Judiciary: SC & HC",
    chapterNumber: 17,
    paper: "GS-1",
    question: "215. With reference to the Constitution of India, prohibition or limitations or provisions contained in ordinary laws cannot act as prohibitions or limitations on the constitutional powers under Article 142. It could mean which one of the following? (2019)",
    options: [
      { id: "a", key: "A", text: "The decisions taken by the Election Commission of India while discharging its duties cannot be challenged in any court of law." },
      { id: "b", key: "B", text: "The Supreme Court of India is not constrained in the exercise of its powers by laws made by the Parliament." },
      { id: "c", key: "C", text: "In the event of a grave financial crisis in the country, the President of India can declare a Financial Emergency without the counsel from the Cabinet." },
      { id: "d", key: "D", text: "State Legislatures cannot make laws on certain matters without the concurrence of the Union Legislature." }
    ],
    correctAnswer: "B",
    explanation: "Article 142(1) confers plenary power on the Supreme Court to pass decrees or orders necessary for doing 'complete justice'. This inherent constitutional power is independent of and not subordinated to ordinary parliamentary statutory limitations.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Article 142", "Complete Justice", "Supreme Court", "Inherent Powers"]
  },
  {
    id: "pol-ch17-q218",
    year: 2014,
    subject: "Polity",
    topic: "Higher Judiciary: SC & HC",
    chapterNumber: 17,
    paper: "GS-1",
    question: "218. The power of the Supreme Court of India to decide disputes between the Centre and the States falls under its: (2014)",
    options: [
      { id: "a", key: "A", text: "advisory jurisdiction" },
      { id: "b", key: "B", text: "appellate jurisdiction" },
      { id: "c", key: "C", text: "original jurisdiction" },
      { id: "d", key: "D", text: "writ jurisdiction" }
    ],
    correctAnswer: "C",
    explanation: "Under Article 131, the Supreme Court has exclusive original jurisdiction to hear and decide disputes between the Government of India and one or more States, or between two or more States.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Article 131", "Original Jurisdiction", "Federal Disputes", "Centre-State"]
  },

  // 21. GOVERNOR (Ch 21)
  {
    id: "pol-ch21-q250",
    year: 2018,
    subject: "Polity",
    topic: "Governor",
    chapterNumber: 21,
    paper: "GS-1",
    question: "250. Consider the following statements: (2018)\n1. No criminal proceedings shall be instituted against the Governor of a State in any court during his term of office.\n2. The emoluments and allowances of the Governor of a State shall not be diminished during his term of office.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "C",
    explanation: "Both statements are correct constitutional immunities:\n1. Article 361(2) bars criminal proceedings or arrest warrants against the Governor during term of office.\n2. Article 158(4) guarantees that the emoluments and allowances of the Governor shall not be diminished during his term.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Governor", "Article 361", "Article 158", "Constitutional Immunities"]
  },
  {
    id: "pol-ch21-q253",
    year: 2013,
    subject: "Polity",
    topic: "Governor",
    chapterNumber: 21,
    paper: "GS-1",
    question: "253. Which one of the following statements is correct? (2013)\n(a) In India, the same person cannot be appointed as Governor for two or more States at the same time.\n(b) The Judges of the High Court of the States in India are appointed by the Governor of the State just as the Judges of the Supreme Court are appointed by the President.\n(c) No procedure has been laid down in the Constitution of India for the removal of a Governor from his/her post.\n(d) In the case of a Union Territory having a legislative setup, the Chief Minister is appointed by the Lt. Governor on the basis of majority support.",
    options: [
      { id: "a", key: "A", text: "In India, the same person cannot be appointed as Governor for two or more States at the same time." },
      { id: "b", key: "B", text: "The Judges of the High Court of the States in India are appointed by the Governor of the State." },
      { id: "c", key: "C", text: "No procedure has been laid down in the Constitution of India for the removal of a Governor from his/her post." },
      { id: "d", key: "D", text: "In the case of a Union Territory having a legislative setup, the Chief Minister is appointed by the Lt. Governor." }
    ],
    correctAnswer: "C",
    explanation: "Option C is correct: Under Article 156(1), the Governor holds office during the pleasure of the President. The Constitution lays down no specific procedure or grounds for removal.\nOption A is false (7th CAA 1956 permits one person as Governor for two or more states). Option B is false (HC judges are appointed by President under Art 217). Option D is false (in Delhi/Puducherry, CM is appointed by the President under Art 239AA).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Governor", "Article 156", "Pleasure of President", "Removal Procedure"]
  },

  // 23. LOCAL GOVERNMENT (Ch 23)
  {
    id: "pol-ch23-q260",
    year: 2017,
    subject: "Polity",
    topic: "Local Government: Panchayats & Municipalities",
    chapterNumber: 23,
    paper: "GS-1",
    question: "260. Local self-government can be best explained as an exercise in: (2017)",
    options: [
      { id: "a", key: "A", text: "Federalism" },
      { id: "b", key: "B", text: "Democratic decentralisation" },
      { id: "c", key: "C", text: "Administrative delegation" },
      { id: "d", key: "D", text: "Direct democracy" }
    ],
    correctAnswer: "B",
    explanation: "Local self-government (Panchayats and Municipalities under 73rd and 74th Amendments) is fundamentally an exercise in democratic decentralisation, empowering grassroots communities to plan and execute development.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Local Self Government", "Democratic Decentralisation", "73rd Amendment", "Balwant Rai Mehta"]
  },
  {
    id: "pol-ch23-q261",
    year: 2016,
    subject: "Polity",
    topic: "Local Government: Panchayats & Municipalities",
    chapterNumber: 23,
    paper: "GS-1",
    question: "261. Consider the following statements: (2016)\n1. The minimum age prescribed for any person to be a member of Panchayat is 25 years.\n2. A Panchayat reconstituted after premature dissolution continues only for the remainder period.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: Under Article 243F, the minimum age to contest Panchayat elections is 21 years (not 25 years).\nStatement 2 is correct: Under Article 243E(4), a Panchayat reconstituted following premature dissolution serves only for the remainder of the 5-year term.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Article 243F", "Article 243E", "Panchayat Age Limit", "Tenure"]
  },

  // 24. ANTI DEFECTION LAW (Ch 24)
  {
    id: "pol-ch24-q280",
    year: 2022,
    subject: "Polity",
    topic: "Anti Defection Law",
    chapterNumber: 24,
    paper: "GS-1",
    question: "280. With reference to anti-defection law in India, consider the following statements: (2022)\n1. The law specifies that a nominated legislator cannot join any political party within six months of being appointed to the House.\n2. The law does not provide any timeframe within which the presiding officer has to decide a defection case.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: Under Paragraph 2(3) of the Tenth Schedule, a nominated member CAN join a political party within 6 months; joining after 6 months incurs disqualification.\nStatement 2 is correct: The Tenth Schedule prescribes no time limit for the Speaker/Chairman to adjudicate defection petitions (as highlighted in Keisham Meghachandra case 2020).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Anti-Defection Law", "Tenth Schedule", "Nominated Members", "Speaker Timeframe"]
  },

  // 25. CONSTITUTIONAL BODIES (Ch 25)
  {
    id: "pol-ch25-q281",
    year: 2023,
    subject: "Polity",
    topic: "Constitutional Bodies",
    chapterNumber: 25,
    paper: "GS-1",
    question: "281. Consider the following organisations/bodies in India: (2023)\n1. The National Commission for Backward Classes\n2. The National Human Rights Commission\n3. The National Law Commission\n4. The National Consumer Disputes Redressal Commission\n\nHow many of the above are constitutional bodies?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "Only three" },
      { id: "d", key: "D", text: "All four" }
    ],
    correctAnswer: "A",
    explanation: "Only the National Commission for Backward Classes (NCBC) is a constitutional body (conferred constitutional status under Article 338B via 102nd Amendment Act 2018). NHRC is statutory (PHRA 1993), Law Commission is non-statutory executive, and NCDRC is statutory (Consumer Protection Act).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Constitutional Bodies", "Article 338B", "102nd Amendment", "NCBC", "NHRC"]
  },
  {
    id: "pol-ch25-q286",
    year: 2013,
    subject: "Polity",
    topic: "Constitutional Bodies",
    chapterNumber: 25,
    paper: "GS-1",
    question: "286. Consider the following statements: (2013)\nAttorney General of India can:\n1. take part in the proceedings of the Lok Sabha\n2. be a member of a committee of the Lok Sabha\n3. speak in the Lok Sabha\n4. vote in the Lok Sabha\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 and 4" },
      { id: "c", key: "C", text: "1, 2 and 3" },
      { id: "d", key: "D", text: "1 and 3 only" }
    ],
    correctAnswer: "C",
    explanation: "Under Article 76 and Article 88, the Attorney General of India has the right to speak and take part in proceedings of either House, joint sittings, and parliamentary committees of which named a member, but has NO right to vote.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Attorney General", "Article 76", "Article 88", "Right to Speak", "Voting Prohibition"]
  },

  // 28. SCHEDULES (Ch 28)
  {
    id: "pol-ch28-q307",
    year: 2024,
    subject: "Polity",
    topic: "Schedules",
    chapterNumber: 28,
    paper: "GS-1",
    question: "307. The Constitution (71st Amendment) Act, 1992, amends the Eighth Schedule to the Constitution to include which of the following languages? (2024)\n1. Konkani\n2. Manipuri\n3. Nepali\n4. Maithili\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1, 2 and 3" },
      { id: "b", key: "B", text: "1, 2 and 4" },
      { id: "c", key: "C", text: "1, 3 and 4" },
      { id: "d", key: "D", text: "2, 3 and 4" }
    ],
    correctAnswer: "A",
    explanation: "The 71st Constitutional Amendment Act, 1992 added Konkani, Manipuri, and Nepali (mnemonic: KMN) to the Eighth Schedule. Maithili (along with Bodo, Dogri, Santhali) was added later by the 92nd Amendment Act, 2003.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Eighth Schedule", "71st Amendment", "Konkani Manipuri Nepali", "Official Languages"]
  },

  // 29. MISCELLANEOUS (Ch 29)
  {
    id: "pol-ch29-q315",
    year: 2024,
    subject: "Polity",
    topic: "Miscellaneous",
    chapterNumber: 29,
    paper: "GS-1",
    question: "315. Consider the following statements regarding ‘Nari Shakti Vandan Adhiniyam': (2024)\n1. Provisions will come into effect from the 18th Lok Sabha.\n2. This will be in force for 15 years after becoming an Act.\n3. There are provisions for the reservation of seats for Scheduled Castes Women within the quota reserved for the Scheduled Castes.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "1, 2 and 3" },
      { id: "b", key: "B", text: "1 and 2 only" },
      { id: "c", key: "C", text: "2 and 3 only" },
      { id: "d", key: "D", text: "1 and 3 only" }
    ],
    correctAnswer: "C",
    explanation: "Statements 2 and 3 are correct: The 106th Constitutional Amendment Act, 2023 provides 33% reservation for women in Lok Sabha and state assemblies for a 15-year sunset period, including sub-reservation for SC/ST women within existing reserved seats.\nStatement 1 is incorrect: Implementation is tied to the first delimitation after the next census (earliest 19th Lok Sabha in 2029, not 18th).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Nari Shakti Vandan Adhiniyam", "106th Amendment", "Women Reservation", "Delimitation"]
  },
  {
    id: "pol-ch29-q316",
    year: 2024,
    subject: "Polity",
    topic: "Miscellaneous",
    chapterNumber: 29,
    paper: "GS-1",
    question: "316. Consider the following statements: (2024)\n1. It is the Governor of the State who recognises and declares any community of that State as a Scheduled Tribe.\n2. A community declared as a Scheduled Tribe in a State need not be so in another State.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: Under Article 342, the President of India, after consultation with the Governor, notifies Scheduled Tribes.\nStatement 2 is correct: ST status is strictly state-specific; a community listed in one state is not automatically considered ST in another.",
    superHint: "S1 is the classic President vs Governor authority trap. Only the President can declare SC/ST status.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Scheduled Tribes", "Article 342", "Presidential Notification", "Polity"]
  }
];

console.log(`Polity Part 2 initialized: ${POLITY_PART2.length} questions`);
