export type Question = {
  id: string;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  year?: number;
};

export const questions: Question[] = [
  {
    id: "polity-fr-001",
    subject: "Polity",
    topic: "Fundamental Rights",
    question:
      "Which Article of the Constitution of India guarantees equality before law and equal protection of laws?",
    options: [
      "Article 12",
      "Article 14",
      "Article 19",
      "Article 21",
    ],
    answer: 1,
    explanation:
      "Article 14 guarantees equality before the law and equal protection of the laws within the territory of India.",
    difficulty: "Easy",
  },

  {
    id: "polity-fr-002",
    subject: "Polity",
    topic: "Fundamental Rights",
    question:
      "Which of the following is NOT a Fundamental Right under the Constitution of India?",
    options: [
      "Right to Equality",
      "Right to Freedom",
      "Right to Property",
      "Right against Exploitation",
    ],
    answer: 2,
    explanation:
      "The Right to Property ceased to be a Fundamental Right after the 44th Constitutional Amendment. It is now a constitutional/legal right under Article 300A.",
    difficulty: "Medium",
  },

  {
    id: "polity-fr-003",
    subject: "Polity",
    topic: "Fundamental Rights",
    question: "Article 32 of the Constitution primarily deals with:",
    options: [
      "Right to Equality",
      "Right to Constitutional Remedies",
      "Freedom of Religion",
      "Cultural and Educational Rights",
    ],
    answer: 1,
    explanation:
      "Article 32 provides the right to move the Supreme Court for enforcement of Fundamental Rights.",
    difficulty: "Easy",
  },

  {
    id: "polity-fr-004",
    subject: "Polity",
    topic: "Fundamental Rights",
    question:
      "Who famously described Article 32 as the 'heart and soul' of the Constitution?",
    options: [
      "Jawaharlal Nehru",
      "B. R. Ambedkar",
      "Rajendra Prasad",
      "Sardar Patel",
    ],
    answer: 1,
    explanation:
      "Dr. B. R. Ambedkar described Article 32 as the heart and soul of the Constitution.",
    difficulty: "Easy",
  },

  {
    id: "polity-fr-005",
    subject: "Polity",
    topic: "Writs",
    question:
      "Which writ is generally issued to secure the release of a person from unlawful detention?",
    options: [
      "Mandamus",
      "Certiorari",
      "Habeas Corpus",
      "Quo Warranto",
    ],
    answer: 2,
    explanation:
      "Habeas Corpus literally means 'to have the body'. It is used to challenge unlawful detention.",
    difficulty: "Easy",
  },

  {
    id: "polity-fr-006",
    subject: "Polity",
    topic: "Writs",
    question:
      "Which writ is issued to command a public authority to perform a public duty?",
    options: [
      "Habeas Corpus",
      "Mandamus",
      "Prohibition",
      "Quo Warranto",
    ],
    answer: 1,
    explanation:
      "Mandamus means 'we command'. It directs a public authority to perform a duty required by law.",
    difficulty: "Medium",
  },

  {
    id: "polity-fr-007",
    subject: "Polity",
    topic: "Fundamental Rights",
    question:
      "Which Fundamental Right is available only to citizens of India?",
    options: [
      "Equality before law",
      "Protection of life and personal liberty",
      "Freedom of speech and expression",
      "Protection against arbitrary arrest",
    ],
    answer: 2,
    explanation:
      "Article 19 freedoms, including freedom of speech and expression, are available only to citizens.",
    difficulty: "Medium",
  },

  {
    id: "polity-fr-008",
    subject: "Polity",
    topic: "Fundamental Rights",
    question:
      "The Fundamental Right against exploitation prohibits:",
    options: [
      "Only child labour",
      "Traffic in human beings and forced labour",
      "Only bonded labour",
      "All forms of private employment",
    ],
    answer: 1,
    explanation:
      "Articles 23 and 24 deal with protection against exploitation, including trafficking, forced labour and certain forms of child labour.",
    difficulty: "Medium",
  },
];