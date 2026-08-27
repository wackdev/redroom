import fs from "fs";
import path from "path";
import { PYQQuestion } from "../lib/core/types";

export const POLITY_PART1: PYQQuestion[] = [
  // 1. HISTORICAL BACKGROUND (Ch 1)
  {
    id: "pol-ch1-q1",
    year: 2024,
    subject: "Polity",
    topic: "Historical Background",
    chapterNumber: 1,
    paper: "GS-1",
    question: "1. Who was the Provisional President of the Constituent Assembly before Dr. Rajendra Prasad took over? (2024)",
    options: [
      { id: "a", key: "A", text: "C. Rajagopalachari" },
      { id: "b", key: "B", text: "Dr. B.R. Ambedkar" },
      { id: "c", key: "C", text: "T.T. Krishnamachari" },
      { id: "d", key: "D", text: "Dr. Sachchidananda Sinha" }
    ],
    correctAnswer: "D",
    explanation: "The Constituent Assembly convened its inaugural meeting on December 9, 1946. Following the French practice, Dr. Sachchidananda Sinha, the oldest member, was elected provisional President. On December 11, 1946, Dr. Rajendra Prasad was elected permanent President.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Constituent Assembly", "Sachchidananda Sinha", "Rajendra Prasad", "Historical Background"]
  },
  {
    id: "pol-ch1-q2",
    year: 2023,
    subject: "Polity",
    topic: "Historical Background",
    chapterNumber: 1,
    paper: "GS-1",
    question: "2. By which one of the following Acts was the Governor General of Bengal designated as the Governor General of India? (2023)",
    options: [
      { id: "a", key: "A", text: "The Regulating Act" },
      { id: "b", key: "B", text: "The Pitt’s India Act" },
      { id: "c", key: "C", text: "The Charter Act of 1793" },
      { id: "d", key: "D", text: "The Charter Act of 1833" }
    ],
    correctAnswer: "D",
    explanation: "The Charter Act of 1833 redesignated the Governor-General of Bengal as the Governor-General of India, vesting in him all civil and military powers. Lord William Bentinck became the first Governor-General of India.",
    extraEdge: "The 1833 Act also ended the East India Company's commercial activities, making it a purely administrative body, and deprived the Governors of Bombay and Madras of their legislative powers.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Charter Act 1833", "Governor-General of India", "William Bentinck", "Centralization"]
  },
  {
    id: "pol-ch1-q3",
    year: 2022,
    subject: "Polity",
    topic: "Historical Background",
    chapterNumber: 1,
    paper: "GS-1",
    question: "3. In the Government of India Act 1919, the functions of Provincial Government were divided into “Reserved” and “Transferred” subjects. Which of the following were treated as “Reserved” subjects? (2022)\n1. Administration of Justice\n2. Local self-Government\n3. Land Revenue\n4. Police\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1, 2 and 3" },
      { id: "b", key: "B", text: "2, 3 and 4" },
      { id: "c", key: "C", text: "1, 3 and 4" },
      { id: "d", key: "D", text: "1, 2 and 4" }
    ],
    correctAnswer: "C",
    explanation: "The Government of India Act 1919 introduced Dyarchy in the provinces, dividing provincial subjects into Reserved and Transferred. Reserved subjects (Administration of Justice, Police, Land Revenue, Finance) were administered by the Governor with his bureaucratic executive council. Transferred subjects (Local Self-Government, Education, Public Health) were administered by ministers responsible to the legislative council.",
    superHint: "Reserved = retained by British bureaucrats; Transferred = given to Indian ministers. The British would never give Police or Land Revenue, but Local Self-Government (2) was harmless and handed over. Eliminating 2 leads directly to (c).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["GoI Act 1919", "Dyarchy", "Reserved Subjects", "Transferred Subjects"]
  },
  {
    id: "pol-ch1-q4",
    year: 2012,
    subject: "Polity",
    topic: "Historical Background",
    chapterNumber: 1,
    paper: "GS-1",
    question: "4. The distribution of powers between the Centre and the States in the Indian Constitution is based on the scheme provided in the: (2012)",
    options: [
      { id: "a", key: "A", text: "Morley-Minto Reforms, 1909" },
      { id: "b", key: "B", text: "Montagu-Chelmsford Act, 1919" },
      { id: "c", key: "C", text: "Government of India Act, 1935" },
      { id: "d", key: "D", text: "Indian Independence Act, 1947" }
    ],
    correctAnswer: "C",
    explanation: "The Government of India Act, 1935 introduced a three-fold division of legislative powers: Federal List, Provincial List, and Concurrent List. This tripartite federal framework was adopted in the Seventh Schedule (Article 246) of the Constitution of India.",
    extraEdge: "Under the 1935 Act, residuary legislative powers were vested in the Governor-General, whereas in independent India, Article 248 vests residuary powers in the Union Parliament.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["GoI Act 1935", "Seventh Schedule", "Division of Powers", "Federalism"]
  },
  {
    id: "pol-ch1-q5",
    year: 2005,
    subject: "Polity",
    topic: "Historical Background",
    chapterNumber: 1,
    paper: "GS-1",
    question: "5. Who among the following was the chairman of the Union Constitution Committee of the Constituent Assembly? (2005)",
    options: [
      { id: "a", key: "A", text: "B.R. Ambedkar" },
      { id: "b", key: "B", text: "J. B. Kripalani" },
      { id: "c", key: "C", text: "Jawaharlal Nehru" },
      { id: "d", key: "D", text: "Alladi Krishnaswami Ayyar" }
    ],
    correctAnswer: "C",
    explanation: "Jawaharlal Nehru was Chairman of the Union Constitution Committee, Union Powers Committee, and States Committee. Dr. B.R. Ambedkar chaired the Drafting Committee, and J.B. Kripalani chaired the Fundamental Rights Sub-Committee.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Constituent Assembly", "Committees", "Jawaharlal Nehru", "Drafting Committee"]
  },
  {
    id: "pol-ch1-q6",
    year: 2003,
    subject: "Polity",
    topic: "Historical Background",
    chapterNumber: 1,
    paper: "GS-1",
    question: "6. Match List-I (Items in the Indian Constitution) with List-II (Country from which it was derived): (2003)\nList-I : List-II\nA. Directive Principles of State Policy : 1. Australia\nB. Fundamental Rights : 2. Canada\nC. Concurrent List in Union-State Relations : 3. Ireland\nD. India as a Union of States with greater powers to the Union : 4. United Kingdom / 5. United States of America",
    options: [
      { id: "a", key: "A", text: "A-5, B-4, C-1, D-2" },
      { id: "b", key: "B", text: "A-3, B-5, C-2, D-1" },
      { id: "c", key: "C", text: "A-5, B-4, C-2, D-1" },
      { id: "d", key: "D", text: "A-3, B-5, C-1, D-2" }
    ],
    correctAnswer: "D",
    explanation: "Directive Principles of State Policy were borrowed from Ireland (A-3). Fundamental Rights were inspired by the US Bill of Rights (B-5). Concurrent List was adopted from Australia (C-1). Federation with a strong Centre was borrowed from Canada (D-2).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Sources of Constitution", "DPSP Ireland", "Fundamental Rights USA", "Concurrent List Australia"]
  },

  // 2. BASIC CONCEPTS (Ch 2)
  {
    id: "pol-ch2-q7",
    year: 2023,
    subject: "Polity",
    topic: "Basic Concepts",
    chapterNumber: 2,
    paper: "GS-1",
    question: "7. In essence, what does ‘Due Process of Law’ mean? (2023)",
    options: [
      { id: "a", key: "A", text: "The principle of natural justice" },
      { id: "b", key: "B", text: "The procedure established by law" },
      { id: "c", key: "C", text: "Fair application of law" },
      { id: "d", key: "D", text: "Equality before law" }
    ],
    correctAnswer: "A",
    explanation: "Due Process of Law assesses not just whether a procedure exists by statute, but whether the law itself is just, fair, and reasonable, incorporating the fundamental tenets of Natural Justice (audi alteram partem, impartiality, non-arbitrariness). In Maneka Gandhi (1978), the Supreme Court integrated Due Process into Article 21.",
    superHint: "\"Natural justice\" (fairness + impartiality + right to a fair hearing) is much more comprehensive than mere procedural legality or \"fair application\".",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Due Process of Law", "Natural Justice", "Article 21", "Maneka Gandhi"]
  },
  {
    id: "pol-ch2-q8",
    year: 2023,
    subject: "Polity",
    topic: "Basic Concepts",
    chapterNumber: 2,
    paper: "GS-1",
    question: "8. Which one of the following statements best reflects the Chief purpose of the ‘Constitution’ of a country? (2023)",
    options: [
      { id: "a", key: "A", text: "It determines the objective for the making of necessary laws." },
      { id: "b", key: "B", text: "It enables the creation of political offices and a government." },
      { id: "c", key: "C", text: "It defines and limits the powers of government." },
      { id: "d", key: "D", text: "It secures social justice, social equality and social security." }
    ],
    correctAnswer: "C",
    explanation: "The core philosophical and structural purpose of a written Constitution is Constitutionalism — defining, distributing, and strictly limiting the arbitrary powers of the government to safeguard citizens' fundamental liberties.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Constitutionalism", "Purpose of Constitution", "Limited Government"]
  },
  {
    id: "pol-ch2-q9",
    year: 2021,
    subject: "Polity",
    topic: "Basic Concepts",
    chapterNumber: 2,
    paper: "GS-1",
    question: "9. Which one of the following best defines the term ‘State’? (2021)",
    options: [
      { id: "a", key: "A", text: "A community of persons permanently occupying a definite territory independent of external control and possessing an organised government" },
      { id: "b", key: "B", text: "A politically organised people of a definite territory and possessing an authority to govern them, maintain law and order, protect their natural rights and safeguard their means of sustenance" },
      { id: "c", key: "C", text: "A number of persons who have been living in a definite territory for a very long time with their own culture, tradition and government" },
      { id: "d", key: "D", text: "A society permanently living in a definite territory with a central authority, an executive responsible to the central authority and an independent judiciary" }
    ],
    correctAnswer: "A",
    explanation: "Under the classical Montevideo Convention (1933) and political science definition, a 'State' requires four essential elements: 1. Permanent Population, 2. Defined Territory, 3. Organised Government, and 4. Sovereignty (independence from external control). Option A encompasses all four accurately.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["State", "Montevideo Convention", "Sovereignty", "Political Theory"]
  },
  {
    id: "pol-ch2-q10",
    year: 2021,
    subject: "Polity",
    topic: "Basic Concepts",
    chapterNumber: 2,
    paper: "GS-1",
    question: "10. Which one of the following factors constitutes the best safeguard of liberty in a liberal democracy? (2021)",
    options: [
      { id: "a", key: "A", text: "A committed judiciary" },
      { id: "b", key: "B", text: "Centralization of powers" },
      { id: "c", key: "C", text: "Elected government" },
      { id: "d", key: "D", text: "Separation of powers" }
    ],
    correctAnswer: "D",
    explanation: "The doctrine of Separation of Powers (Montesquieu) divides governmental power among the legislature, executive, and judiciary with checks and balances, preventing despotic concentration of power and serving as the primary safeguard of individual liberty.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Separation of Powers", "Liberty", "Liberal Democracy", "Montesquieu"]
  },
  {
    id: "pol-ch2-q11",
    year: 2021,
    subject: "Polity",
    topic: "Basic Concepts",
    chapterNumber: 2,
    paper: "GS-1",
    question: "11. What is the position of the Right to Property in India? (2021)",
    options: [
      { id: "a", key: "A", text: "Legal right available to citizens only" },
      { id: "b", key: "B", text: "Legal right available to any person" },
      { id: "c", key: "C", text: "Fundamental Right available to citizens only" },
      { id: "d", key: "D", text: "Neither Fundamental Right nor legal right" }
    ],
    correctAnswer: "B",
    explanation: "Following the 44th Amendment Act (1978), the Right to Property ceased to be a Fundamental Right (repealing Articles 19(1)(f) and 31) and was reconstituted as a constitutional legal right under Article 300-A: 'No person shall be deprived of his property save by authority of law'. It applies to 'any person' (citizens and non-citizens alike).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Right to Property", "Article 300A", "44th Amendment", "Legal Rights"]
  },

  // 3. SALIENT FEATURES OF THE CONSTITUTION (Ch 3)
  {
    id: "pol-ch3-q18",
    year: 2022,
    subject: "Polity",
    topic: "Salient Features of the Constitution",
    chapterNumber: 3,
    paper: "GS-1",
    question: "18. If a particular area is brought under the Fifth Schedule of the Constitution of India, which one of the following statements best reflects the consequence of it? (2022)",
    options: [
      { id: "a", key: "A", text: "This would prevent the transfer of land of tribal people to non-tribal people." },
      { id: "b", key: "B", text: "This would create a local self-governing body in that area." },
      { id: "c", key: "C", text: "This would convert that area into the Union Territory." },
      { id: "d", key: "D", text: "The State having such areas would be declared a Special Category State." }
    ],
    correctAnswer: "A",
    explanation: "Under the Fifth Schedule (Article 244(1)), the Governor is empowered to make regulations prohibiting or restricting the transfer of land by or among members of Scheduled Tribes to non-tribals, safeguarding tribal land alienation (reaffirmed in Samatha case, 1997).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Fifth Schedule", "Scheduled Areas", "Tribal Land Rights", "Samatha Judgment"]
  },
  {
    id: "pol-ch3-q19",
    year: 2021,
    subject: "Polity",
    topic: "Salient Features of the Constitution",
    chapterNumber: 3,
    paper: "GS-1",
    question: "19. Which one of the following in Indian polity is an essential feature that indicates that it is federal in character? (2021)",
    options: [
      { id: "a", key: "A", text: "The independence of the judiciary is safeguarded." },
      { id: "b", key: "B", text: "The Union Legislature has elected representatives from constituent units." },
      { id: "c", key: "C", text: "The Union Cabinet can have elected representatives from regional parties." },
      { id: "d", key: "D", text: "The Fundamental Rights are enforceable by Courts of Law." }
    ],
    correctAnswer: "A",
    explanation: "An independent judiciary is an indispensable structural pillar of federalism to resolve disputes between the Centre and the constituent States and maintain the constitutional division of powers.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Federalism", "Independent Judiciary", "Basic Features", "Division of Powers"]
  },
  {
    id: "pol-ch3-q20",
    year: 2020,
    subject: "Polity",
    topic: "Salient Features of the Constitution",
    chapterNumber: 3,
    paper: "GS-1",
    question: "20. Consider the following statements: (2020)\n1. The Constitution of India defines its basic structure in terms of federalism, secularism, fundamental rights and democracy.\n2. The Constitution of India provides for ‘Judicial review’ to safeguard the citizens’ liberties and to preserve the ideals on which the Constitution is based.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: The Constitution does not define 'Basic Structure'; it is a judicial doctrine created in the Kesavananda Bharati case (1973).\nStatement 2 is correct: The Constitution provides for Judicial Review (Articles 13, 32, 136, 226) to safeguard fundamental liberties.",
    superHint: "The word \"defines\" is a rigid red flag. The Constitution never explicitly lists or defines 'Basic Structure'.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Basic Structure", "Judicial Review", "Kesavananda Bharati", "Article 13"]
  },

  // 4. PREAMBLE (Ch 4)
  {
    id: "pol-ch4-q31",
    year: 2021,
    subject: "Polity",
    topic: "Preamble",
    chapterNumber: 4,
    paper: "GS-1",
    question: "31. What was the exact constitutional status of India on 26th January, 1950? (2021)",
    options: [
      { id: "a", key: "A", text: "A democratic Republic" },
      { id: "b", key: "B", text: "A Sovereign Democratic Republic" },
      { id: "c", key: "C", text: "A Sovereign Secular Democratic Republic" },
      { id: "d", key: "D", text: "A Sovereign Socialist Secular Democratic Republic" }
    ],
    correctAnswer: "B",
    explanation: "On January 26, 1950, the original Preamble declared India to be a 'Sovereign Democratic Republic'. The words 'Socialist', 'Secular', and 'Integrity' were added later by the 42nd Constitutional Amendment Act, 1976.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Preamble", "26 January 1950", "42nd Amendment", "Sovereign Democratic Republic"]
  },
  {
    id: "pol-ch4-q32",
    year: 2020,
    subject: "Polity",
    topic: "Preamble",
    chapterNumber: 4,
    paper: "GS-1",
    question: "32. The Preamble to the Constitution of India, is: (2020)",
    options: [
      { id: "a", key: "A", text: "part of the Constitution but has no legal effect" },
      { id: "b", key: "B", text: "not a part of the Constitution and has no legal effect either" },
      { id: "c", key: "C", text: "a part of the Constitution and has the same legal effect as any other part" },
      { id: "d", key: "D", text: "a part of the Constitution but has no legal effect independently of other parts" }
    ],
    correctAnswer: "D",
    explanation: "In Kesavananda Bharati (1973) and LIC of India (1995), the Supreme Court affirmed that the Preamble is an integral part of the Constitution, but it is non-justiciable and has no independent legal effect apart from other provisions.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Preamble", "Legal Status", "Non-Justiciable", "Kesavananda Bharati"]
  },

  // 6. FUNDAMENTAL RIGHTS (Ch 6)
  {
    id: "pol-ch6-q40",
    year: 2024,
    subject: "Polity",
    topic: "Fundamental Rights",
    chapterNumber: 6,
    paper: "GS-1",
    question: "40. A Writ of Prohibition is an order issued by the Supreme Court or High Courts to: (2024)",
    options: [
      { id: "a", key: "A", text: "a government officer prohibiting him from taking a particular action." },
      { id: "b", key: "B", text: "the Parliament/Legislative Assembly to pass a law on Prohibition." },
      { id: "c", key: "C", text: "the lower court prohibiting the continuation of proceedings in a case." },
      { id: "d", key: "D", text: "the Government prohibiting it from following an unconstitutional policy." }
    ],
    correctAnswer: "C",
    explanation: "A Writ of Prohibition is a preventive judicial command issued by higher constitutional courts (SC under Art 32 / HC under Art 226) to an inferior court or tribunal forbidding it from continuing proceedings in excess of its jurisdiction.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Writs", "Writ of Prohibition", "Article 32", "Article 226", "Judiciary"]
  },
  {
    id: "pol-ch6-q41",
    year: 2024,
    subject: "Polity",
    topic: "Fundamental Rights",
    chapterNumber: 6,
    paper: "GS-1",
    question: "41. Under which of the following Articles of the Constitution of India has the Supreme Court of India placed the Right to Privacy? (2024)",
    options: [
      { id: "a", key: "A", text: "Article 15" },
      { id: "b", key: "B", text: "Article 16" },
      { id: "c", key: "C", text: "Article 19" },
      { id: "d", key: "D", text: "Article 21" }
    ],
    correctAnswer: "D",
    explanation: "In Justice K.S. Puttaswamy v. Union of India (2017), a 9-judge constitutional bench ruled that the Right to Privacy is an intrinsic fundamental right protected under Article 21 (Right to Life and Personal Liberty) and Part III.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Right to Privacy", "Article 21", "Puttaswamy Judgment", "Fundamental Rights"]
  },
  {
    id: "pol-ch6-q44",
    year: 2021,
    subject: "Polity",
    topic: "Fundamental Rights",
    chapterNumber: 6,
    paper: "GS-1",
    question: "44. A legislation which confers on the executive or administrative authority an unguided and uncontrolled discretionary power in the matter of application of law violates one of the following Articles of the Constitution of India? (2021)",
    options: [
      { id: "a", key: "A", text: "Article 14" },
      { id: "b", key: "B", text: "Article 28" },
      { id: "c", key: "C", text: "Article 32" },
      { id: "d", key: "D", text: "Article 44" }
    ],
    correctAnswer: "A",
    explanation: "Conferring unguided, arbitrary, or uncontrolled discretionary power on executive authorities violates Article 14 (Equality Before Law & Rule of Law), as non-arbitrariness is the essence of Article 14.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Article 14", "Rule of Law", "Arbitrariness", "Administrative Discretion"]
  },
  {
    id: "pol-ch6-q47",
    year: 2019,
    subject: "Polity",
    topic: "Fundamental Rights",
    chapterNumber: 6,
    paper: "GS-1",
    question: "47. Which Article of the Constitution of India safeguards one’s right to marry the person of one’s choice? (2019)",
    options: [
      { id: "a", key: "A", text: "Article 19" },
      { id: "b", key: "B", text: "Article 21" },
      { id: "c", key: "C", text: "Article 25" },
      { id: "d", key: "D", text: "Article 29" }
    ],
    correctAnswer: "B",
    explanation: "In Shafin Jahan v. Asokan K.M. (Hadiya case, 2018), the Supreme Court affirmed that the right to marry a person of one's choice is an integral component of Article 21 (Right to Personal Liberty and Dignity).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Article 21", "Right to Marry", "Hadiya Case", "Personal Liberty"]
  },

  // 7. DPSP (Ch 7)
  {
    id: "pol-ch7-q69",
    year: 2021,
    subject: "Polity",
    topic: "DPSP",
    chapterNumber: 7,
    paper: "GS-1",
    question: "69. Under the Indian Constitution, concentration of wealth violates: (2021)",
    options: [
      { id: "a", key: "A", text: "the Right to Equality" },
      { id: "b", key: "B", text: "the Directive Principles of State Policy" },
      { id: "c", key: "C", text: "the Right to Freedom" },
      { id: "d", key: "D", text: "the Concept of Welfare" }
    ],
    correctAnswer: "B",
    explanation: "Article 39(c) of the Directive Principles of State Policy (Part IV) states that the state shall direct its policy to ensure that the economic system does not result in the concentration of wealth and means of production to the common detriment.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["DPSP", "Article 39(c)", "Concentration of Wealth", "Socialist Principles"]
  },
  {
    id: "pol-ch7-q72",
    year: 2020,
    subject: "Polity",
    topic: "DPSP",
    chapterNumber: 7,
    paper: "GS-1",
    question: "72. In India, separation of judiciary from the executive is enjoined by: (2020)",
    options: [
      { id: "a", key: "A", text: "The Preamble of the Constitution" },
      { id: "b", key: "B", text: "A Directive Principle of State Policy" },
      { id: "c", key: "C", text: "The Seventh Schedule" },
      { id: "d", key: "D", text: "The conventional practice" }
    ],
    correctAnswer: "B",
    explanation: "Article 50 in Part IV (DPSP) directs the State to take steps to separate the judiciary from the executive in the public services of the State.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Article 50", "Separation of Judiciary", "DPSP", "Separation of Powers"]
  },

  // 9. CONSTITUTIONAL AMENDMENT (Ch 9)
  {
    id: "pol-ch9-q91",
    year: 2024,
    subject: "Polity",
    topic: "Constitutional Amendment",
    chapterNumber: 9,
    paper: "GS-1",
    question: "91. As per Article 368 of the Constitution of India, the Parliament may amend any provision of the Constitution by way of: (2024)\n1. Addition\n2. Variation\n3. Repeal\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "D",
    explanation: "Article 368(1) states: 'Parliament may in exercise of its constituent power amend by way of addition, variation or repeal any provision of this Constitution in accordance with the procedure laid down in this article'.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Article 368", "Constitutional Amendment", "Addition Variation Repeal"]
  },
  {
    id: "pol-ch9-q93",
    year: 2022,
    subject: "Polity",
    topic: "Constitutional Amendment",
    chapterNumber: 9,
    paper: "GS-1",
    question: "93. Consider the following statements: (2022)\n1. A bill amending the Constitution requires a prior recommendation of the President of India.\n2. When a Constitution Amendment Bill is presented to the President of India, it is obligatory for the President of India to give his/her assent.\n3. A Constitution Amendment Bill must be passed by both the Lok Sabha and the Rajya Sabha by a special majority and there is no provision for joint sitting.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: Prior recommendation of the President is NOT required for introducing a Constitutional Amendment Bill.\nStatement 2 is correct: Under the 24th Amendment Act 1971, the President MUST give assent to a Constitution Amendment Bill.\nStatement 3 is correct: Each house must pass it separately by special majority; no joint sitting is permitted.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Article 368", "Presidential Assent", "Joint Sitting Prohibited", "24th Amendment"]
  },

  // 12. SYSTEMS OF GOVERNMENT (Ch 12)
  {
    id: "pol-ch12-q113",
    year: 2021,
    subject: "Polity",
    topic: "Systems of Government",
    chapterNumber: 12,
    paper: "GS-1",
    question: "113. Constitutional government means: (2021)",
    options: [
      { id: "a", key: "A", text: "A representative government of a nation with federal structure" },
      { id: "b", key: "B", text: "A government whose Head enjoys nominal powers" },
      { id: "c", key: "C", text: "A government whose Head enjoys real powers" },
      { id: "d", key: "D", text: "A government limited by the terms of the Constitution" }
    ],
    correctAnswer: "D",
    explanation: "A constitutional government is defined by Constitutionalism, which means 'limited government' — a governance system bounded and restricted by legal and constitutional rules to prevent arbitrariness.",
    superHint: "If the question asks 'What is a constitutional government?', the answer logically must involve limitation by the Constitution.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Constitutionalism", "Limited Government", "Rule of Law"]
  },
  {
    id: "pol-ch12-q118",
    year: 2015,
    subject: "Polity",
    topic: "Systems of Government",
    chapterNumber: 12,
    paper: "GS-1",
    question: "118. There is a Parliamentary System of Government in India because the: (2015)",
    options: [
      { id: "a", key: "A", text: "Lok Sabha is elected directly by the people" },
      { id: "b", key: "B", text: "Parliament can amend the Constitution" },
      { id: "c", key: "C", text: "Rajya Sabha cannot be dissolved" },
      { id: "d", key: "D", text: "Council of Ministers is responsible to the Lok Sabha" }
    ],
    correctAnswer: "D",
    explanation: "The defining hallmark of a Parliamentary system is the collective responsibility of the executive (Council of Ministers) to the popular chamber of the legislature (Lok Sabha) under Article 75(3).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Parliamentary System", "Collective Responsibility", "Article 75(3)", "Lok Sabha"]
  },

  // 13. PRESIDENT (Ch 13)
  {
    id: "pol-ch13-q124",
    year: 2023,
    subject: "Polity",
    topic: "President",
    chapterNumber: 13,
    paper: "GS-1",
    question: "124. Consider the following statements in respect of election to the President of India: (2023)\n1. The members nominated to either House of the Parliament or the Legislative Assemblies of States are also eligible to be included in the Electoral College.\n2. Higher the number of elective Assembly seats, higher is the value of vote of each MLA of that State.\n3. The value of vote of each MLA of Madhya Pradesh is greater than that of Kerala.\n4. The value of vote of each MLA of Puducherry is higher than that of Arunachal Pradesh because the ratio of total population to total number of elective seats in Puducherry is greater as compared to Arunachal Pradesh.\n\nHow many of the above statements are correct?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "Only three" },
      { id: "d", key: "D", text: "All four" }
    ],
    correctAnswer: "A",
    explanation: "Only statement 4 is correct: MLA vote value depends on the ratio of population (1971 census) to total elected assembly seats. In Puducherry, this ratio is higher than in Arunachal Pradesh.\nStatement 1 is incorrect (nominated members cannot vote).\nStatement 2 is incorrect (vote value depends on population ratio, not absolute seat count).\nStatement 3 is incorrect (Kerala MLA vote value is 152, while MP is 131).",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Presidential Election", "Article 54", "Article 55", "MLA Vote Value"]
  },
  {
    id: "pol-ch13-q125",
    year: 2023,
    subject: "Polity",
    topic: "President",
    chapterNumber: 13,
    paper: "GS-1",
    question: "125. Consider the following statements: (2023)\n1. If the election of the President of India is declared void by the Supreme Court of India, all acts done by him/her in the performance of duties of his/her office of President before the date of decision become invalid.\n2. Elections for the post of the President of India can be postponed on the ground that some Legislative Assemblies have been dissolved and elections are yet to take place.\n3. When a Bill is presented to the President of India, the Constitution prescribes time limits within which he/she has to declare his/her assent.\n\nHow many of the above statements are correct?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "D",
    explanation: "All three statements are incorrect:\n1. Under Article 71(2), acts done by the President before the SC void declaration remain valid.\n2. Under Article 62 and 71(4), election cannot be postponed on grounds of dissolved assemblies/vacancies.\n3. Under Article 111, the Constitution prescribes NO time limit for Presidential assent (giving rise to pocket veto).",
    superHint: "S1: Invalidating prior presidential acts would cause an instant constitutional collapse. S3: If time limits existed, pocket veto debates would be impossible. All statements are false.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["President", "Article 71", "Article 111", "Pocket Veto", "Supreme Court"]
  }
];

console.log(`Polity Part 1 initialized: ${POLITY_PART1.length} questions`);
