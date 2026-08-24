import { MockTest } from "@/lib/core/types";

export const SCIENCE_TECH_MODULES: MockTest[] = [
  {
    id: "sci-mod-1",
    title: "Science & Technology Sectional (2018–2026 Emerging Tech)",
    subject: "Science & Tech",
    moduleNumber: 1,
    moduleTitle: "Space, Biotechnology, Quantum & AI Systems",
    curriculum: "UPSC CSE Prelims GS Paper 1",
    stage: "Prelims",
    topic: "Frontier Technologies",
    questions: 3,
    duration: 20,
    description: "High-yield UPSC questions covering CRISPR-Cas9, Quantum Superposition/Entanglement, Gravitational Waves, Webb Space Telescope, and Solid-State Batteries.",
    marksPerQuestion: 2,
    negativeMarking: 0.66,
    difficulty: "Moderate to High",
    questionList: [
      {
        id: "sci-2024-01",
        question: "With reference to 'Quantum Computing', consider the following statements:\n1. Unlike classical bits which can be either 0 or 1, a qubit can exist in a superposition of both states simultaneously.\n2. Quantum entanglement allows qubits separated by large distances to correlate their states instantaneously.\n3. Shor's Algorithm running on a fault-tolerant quantum computer can factor large integers exponentially faster than classical computers.\nWhich of the statements given above are correct?",
        options: [
          { id: "A", key: "A", text: "1 and 2 only" },
          { id: "B", key: "B", text: "2 and 3 only" },
          { id: "C", key: "C", text: "1 and 3 only" },
          { id: "D", key: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct principles of quantum information theory: superposition ($|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$), quantum entanglement, and Shor's polynomial-time prime factorization algorithm which impacts RSA encryption.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Qubits leverage quantum superposition to represent multiple computational pathways simultaneously.",
            "Statement 2": "Correct. Entangled quantum states exhibit non-local state correlations (Einstein-Podolsky-Rosen paradox).",
            "Statement 3": "Correct. Peter Shor (1994) formulated the quantum algorithm capable of breaking RSA-2048 in polynomial time."
          },
          elimination_technique: "Recognize that the foundational definitions of quantum information science involve Superposition, Entanglement, and Quantum Speedup algorithms (Shor & Grover).",
          concept_takeaway: "India's National Quantum Mission (NQM) was approved with an outlay of ₹6,003 crore (2023-2031) targeting 50-1000 physical qubits.",
          reference_sources: ["Department of Science & Technology (DST) - NQM Guidelines", "MIT Technology Review"]
        },
        subject: "Science & Tech",
        topic: "Quantum Computing & Information",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High"
      },
      {
        id: "sci-2023-02",
        question: "Consider the following actions:\n1. Detection of car crash/collision leading to airbag deployment\n2. Detection of accidental free fall of a laptop towards the ground\n3. Detection of the tilt of a smartphone for display orientation\nIn how many of the above actions is the function of an 'accelerometer' required?",
        options: [
          { id: "A", key: "A", text: "Only one" },
          { id: "B", key: "B", text: "Only two" },
          { id: "C", key: "C", text: "All three" },
          { id: "D", key: "D", text: "None" }
        ],
        answer: "C",
        explanation: "All three actions utilize MEMS (Micro-Electro-Mechanical Systems) accelerometers to measure dynamic acceleration, sudden deceleration during crashes, zero-g free fall, and static gravitational tilt.",
        detailedExplanation: {
          statement_analysis: {
            "Action 1": "Correct. Airbag control modules use MEMS accelerometers to detect rapid negative acceleration (deceleration) above crash thresholds in milliseconds.",
            "Action 2": "Correct. Active hard drive protection systems (APS) use accelerometers to detect free-fall (0g) and park the read/write heads before impact.",
            "Action 3": "Correct. Smartphones measure static gravity vectors (1g) along X/Y/Z axes to switch screen portrait/landscape orientation."
          },
          elimination_technique: "Accelerometers detect all changes in linear acceleration and gravitational pull. All 3 scenarios involve rapid acceleration/deceleration or tilt.",
          concept_takeaway: "MEMS accelerometers are foundational sensors in automotive safety, consumer electronics, and aerospace navigation.",
          reference_sources: ["UPSC CSE Prelims 2023 Paper 1", "IEEE Sensors Journal"]
        },
        subject: "Science & Tech",
        topic: "Applied Physics & MEMS Sensors",
        patternType: "Pair/Action Counting (New Pattern)",
        difficulty: "Moderate"
      },
      {
        id: "sci-2022-03",
        question: "Which one of the following statements best describes the role of 'B cells and T cells' in the human body?",
        options: [
          { id: "A", key: "A", text: "They protect the body from environmental allergens by secreting histamines." },
          { id: "B", key: "B", text: "They alleviate the body's pain and inflammation through endorphins." },
          { id: "C", key: "C", text: "They act as immunosuppressants during organ transplantations." },
          { id: "D", key: "D", text: "They protect the body from diseases caused by pathogens." }
        ],
        answer: "D",
        explanation: "B cells (humoral immunity via antibody synthesis) and T cells (cell-mediated immunity via cytotoxic CD8+ and helper CD4+ cells) constitute the core adaptive immune defense system against pathogens.",
        detailedExplanation: {
          statement_analysis: {
            "Option A": "Incorrect. Mast cells and basophils release histamines during allergic responses, not B/T cells.",
            "Option B": "Incorrect. Endorphins are neurotransmitters produced by the pituitary gland and hypothalamus.",
            "Option C": "Incorrect. Cyclosporine and corticosteroids are immunosuppressants; B and T cells mount the immune response.",
            "Option D": "Correct. B and T lymphocytes are primary effector cells of adaptive immunity defending against bacterial and viral pathogens."
          },
          elimination_technique: "Straightforward NCERT Class 12 Biology definition of adaptive immunity.",
          concept_takeaway: "B cells mature in Bone marrow (produce antibodies/immunoglobulins); T cells mature in Thymus (coordinate cell-mediated lysis).",
          reference_sources: ["UPSC CSE Prelims 2022 Paper 1", "NCERT Class 12 Biology Chapter 8 (Human Health & Disease)"]
        },
        subject: "Science & Tech",
        topic: "Human Biology & Immunology",
        patternType: "Direct Conceptual",
        difficulty: "Easy to Moderate"
      }
    ]
  }
];
