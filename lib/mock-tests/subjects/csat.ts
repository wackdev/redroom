import { MockTest } from "@/lib/core/types";

export const CSAT_MOCK_MODULES: MockTest[] = [
  {
    id: "csat-full-sim-1",
    title: "CSAT Full-Length Sectional: Quant, Logic & Reading Comprehension (2018–2026)",
    subject: "CSAT",
    moduleNumber: 1,
    moduleTitle: "Aptitude, Permutations, Number Systems & Critical Reasoning",
    curriculum: "UPSC CSE Prelims Paper 2 (CSAT)",
    stage: "Prelims",
    topic: "Quantitative & Analytical Aptitude",
    questions: 2,
    duration: 25,
    description: "Official pattern CSAT questions covering remainder theorems, divisibility, seating arrangements, syllogisms, and inference passages.",
    marksPerQuestion: 2.5,
    negativeMarking: 0.83,
    difficulty: "Moderate to High",
    questionList: [
      {
        id: "csat-2023-num-1",
        question: "What is the remainder when $85 \\times 87 \\times 89 \\times 91 \\times 95 \\times 96$ is divided by $100$?",
        options: [
          { id: "A", key: "A", text: "0" },
          { id: "B", key: "B", text: "1" },
          { id: "C", key: "C", text: "2" },
          { id: "D", key: "D", text: "4" }
        ],
        answer: "A",
        explanation: "The product contains factors $85 = 5 \\times 17$, $95 = 5 \\times 19$, and $96 = 4 \\times 24$. Thus, the numerator contains $(5 \\times 5 \\times 4) = 100$ as a direct factor. When divided by 100, the remainder is strictly 0.",
        detailedExplanation: {
          statement_analysis: {
            "Factor Decomposition": "Numerator contains 85 (factor 5), 95 (factor 5), and 96 (factor 4). 5 * 5 * 4 = 100. Therefore, the numerator is a pure integer multiple of 100."
          },
          elimination_technique: "Check prime factors of the divisor (100 = 2^2 * 5^2). Identify if the product contains at least two 5s (85, 95) and at least two 2s (96 has 2^5). Since both exist, remainder must be 0.",
          concept_takeaway: "In large product divisibility problems, factorize divisor into primes before computing.",
          reference_sources: ["UPSC CSE Prelims CSAT 2023 Paper 2"]
        },
        subject: "CSAT",
        topic: "Number Systems & Divisibility",
        patternType: "Direct Arithmetic",
        difficulty: "Moderate"
      },
      {
        id: "csat-2023-prime-2",
        question: "Let $p$ be a prime number such that $p+2$ is also a prime number (twin prime). If $p > 3$, then what is the remainder when $p + (p+2)$ is divided by $12$?",
        options: [
          { id: "A", key: "A", text: "0" },
          { id: "B", key: "B", text: "2" },
          { id: "C", key: "C", text: "4" },
          { id: "D", key: "D", text: "6" }
        ],
        answer: "A",
        explanation: "For any twin primes $p, p+2$ where $p > 3$, the intermediate number $(p+1)$ must be divisible by 6 (since among three consecutive integers $p, p+1, p+2$, exactly one is divisible by 3, and since $p, p+2$ are odd primes, $p+1$ is even and divisible by 3, hence divisible by 6). The sum is $p + (p+2) = 2(p+1) = 2(6k) = 12k$. Thus, divided by 12, remainder is 0.",
        detailedExplanation: {
          statement_analysis: {
            "Algebraic Proof": "p + (p+2) = 2p + 2 = 2(p+1). For prime p > 3, p ≡ 1 or 5 (mod 6). Since p+2 is also prime, p must be 6k - 1 (5 mod 6). Then p+1 = 6k, so 2(p+1) = 12k. Divisible by 12 with remainder 0."
          },
          elimination_technique: "Substitute the smallest valid twin prime pair greater than 3: (p=5, p+2=7). Sum = 5+7 = 12. 12 mod 12 = 0. Try (11, 13): 11+13 = 24 mod 12 = 0. Try (17, 19): 17+19 = 36 mod 12 = 0. In all cases, remainder is 0.",
          concept_takeaway: "Value substitution with small primes (5, 7) solves modular arithmetic prime questions in under 30 seconds.",
          reference_sources: ["UPSC CSE Prelims CSAT 2023 Paper 2"]
        },
        subject: "CSAT",
        topic: "Prime Numbers & Modular Arithmetic",
        patternType: "Algebraic Property",
        difficulty: "Moderate to High"
      }
    ]
  }
];
