import { MockTest } from "@/lib/core/types";

export const ENVIRONMENT_MODULES: MockTest[] = [
  {
    id: "env-mod-1",
    title: "Environment & Ecology Sectional (2018–2026 High Yield)",
    subject: "Environment",
    moduleNumber: 1,
    moduleTitle: "Ecosystems, Biodiversity & Climate Conventions",
    curriculum: "UPSC CSE Prelims GS Paper 1",
    stage: "Prelims",
    topic: "Biodiversity & Climate Policy",
    questions: 5,
    duration: 20,
    description: "High-yield UPSC Prelims questions covering Ramsar wetlands, UNFCCC COP agreements, species conservation status (IUCN), and bio-indicators.",
    marksPerQuestion: 2,
    negativeMarking: 0.66,
    difficulty: "Moderate to High",
    questionList: [
      {
        id: "env-2024-01",
        question: "Consider the following statements regarding the 'Global Biodiversity Framework' (Kunming-Montreal Agreement):\n1. It sets a global target to protect at least 30% of the planet's lands and oceans by 2030 (30x30 Target).\n2. It requires developed nations to mobilize at least $30 billion per year by 2030 for biodiversity in developing nations.\n3. The Global Environment Facility (GEF) was requested to establish the Global Biodiversity Framework Fund (GBFF).\nWhich of the statements given above are correct?",
        options: [
          { id: "A", key: "A", text: "1 and 2 only" },
          { id: "B", key: "B", text: "2 and 3 only" },
          { id: "C", key: "C", text: "1 and 3 only" },
          { id: "D", key: "D", text: "1, 2 and 3" }
        ],
        answer: "D",
        explanation: "All three statements are correct under the Kunming-Montreal Global Biodiversity Framework adopted at CBD COP15. It sets 23 global targets including the 30x30 target, financial mobilization, and creation of the GBFF managed by the GEF.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Target 3 calls for conserving at least 30% of terrestrial, inland water, and coastal/marine areas by 2030.",
            "Statement 2": "Correct. Target 19 commits developed countries to provide $20 billion/year by 2025 and $30 billion/year by 2030.",
            "Statement 3": "Correct. The GBFF was formally established under the Global Environment Facility (GEF) in 2023."
          },
          elimination_technique: "Recognize that landmark multilateral environmental treaties establish both quantitative conservation targets (30x30) and structured finance mechanisms through the GEF.",
          concept_takeaway: "CBD COP15 Kunming-Montreal Framework replaces the Aichi Biodiversity Targets (2011-2020).",
          reference_sources: ["UNEP CBD COP15 Final Text", "Shankar IAS Environment (Biodiversity Chapter)"]
        },
        subject: "Environment",
        topic: "International Conventions",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate to High"
      },
      {
        id: "env-2023-02",
        question: "Which of the following organisms perform the 'Waggle Dance' for others of their kin to indicate the direction and distance to a food source?",
        options: [
          { id: "A", key: "A", text: "Butterflies" },
          { id: "B", key: "B", text: "Dragonflies" },
          { id: "C", key: "C", text: "Honeybees" },
          { id: "D", key: "D", text: "Wasps" }
        ],
        answer: "C",
        explanation: "Honeybees perform the famous 'waggle dance' (discovered by Karl von Frisch, Nobel Prize 1973) to communicate the angle and distance of floral nectar sources relative to the sun.",
        detailedExplanation: {
          statement_analysis: {
            "Option C": "Correct. Honeybees (Apis mellifera) use the figure-eight waggle dance to communicate nectar vector coordinates inside dark hives."
          },
          elimination_technique: "Direct behavioral ecology question from UPSC Prelims 2023. Honeybee social eusociality and communication is a classic NCERT biology topic.",
          concept_takeaway: "Karl von Frisch's waggle dance decode is the foundational study of invertebrate communication.",
          reference_sources: ["UPSC CSE Prelims 2023 Paper 1", "NCERT Biology Class XII - Ecology"]
        },
        subject: "Environment",
        topic: "Ecology & Ethology",
        patternType: "Direct Single Choice",
        difficulty: "Moderate"
      },
      {
        id: "env-2022-03",
        question: "With reference to the 'Miyawaki method', consider the following statements:\n1. It is a method of urban afforestation developed by Japanese botanist Akira Miyawaki.\n2. It involves planting native tree species in multi-layered dense clusters to grow 10 times faster and 30 times denser.\nWhich of the statements given above is/are correct?",
        options: [
          { id: "A", key: "A", text: "1 only" },
          { id: "B", key: "B", text: "2 only" },
          { id: "C", key: "C", text: "Both 1 and 2" },
          { id: "D", key: "D", text: "Neither 1 nor 2" }
        ],
        answer: "C",
        explanation: "Both statements are correct. The Miyawaki method creates dense, native urban micro-forests that mimic natural ecological succession in small urban spaces.",
        detailedExplanation: {
          statement_analysis: {
            "Statement 1": "Correct. Pioneered by Japanese botanist Akira Miyawaki.",
            "Statement 2": "Correct. Uses 2-4 trees per sq meter with 4 layers (canopy, tree, sub-tree, shrub) to achieve self-sustaining density in 2-3 years."
          },
          elimination_technique: "Urban forestry techniques in news (Miyawaki method in Chennai, Delhi, Mumbai) frequently test origin and structural density multipliers.",
          concept_takeaway: "Miyawaki forests absorb 30x more carbon dioxide and foster 100x more biodiversity than single-species monocultures.",
          reference_sources: ["UPSC CSE Prelims 2022 Paper 1", "The Hindu Sci-Tech"]
        },
        subject: "Environment",
        topic: "Afforestation & Urban Ecology",
        patternType: "Multi-Statement Analysis",
        difficulty: "Moderate"
      },
      {
        id: "env-2021-04",
        question: "In the nature, which of the following is/are most likely to be found surviving on a surface without soil, such as bare rock or hardened lava?\n1. Lichens\n2. Mosses\n3. Mushrooms\n4. Ferns\nSelect the correct answer using the code given below:",
        options: [
          { id: "A", key: "A", text: "1 and 4 only" },
          { id: "B", key: "B", text: "2 only" },
          { id: "C", key: "C", text: "1 and 2 only" },
          { id: "D", key: "D", text: "1, 3 and 4" }
        ],
        answer: "C",
        explanation: "Lichens and mosses are classic pioneer species in primary ecological succession (lithosere) capable of secreting organic acids to weather bare rock into initial humus without prior soil.",
        detailedExplanation: {
          statement_analysis: {
            "Item 1 (Lichens)": "Correct. Pioneer organisms in primary succession on bare rock.",
            "Item 2 (Mosses)": "Correct. Follow lichens in lithosere succession, holding minuscule moisture.",
            "Item 3 (Mushrooms)": "Incorrect. Saprophytic fungi requiring rich decaying organic matter/humus substrate.",
            "Item 4 (Ferns)": "Incorrect. Pteridophytes require established topsoil and moisture."
          },
          elimination_technique: "Eliminate Mushrooms (Item 3) since they are decomposers needing organic substrate, immediately eliminating option D. Eliminate ferns (Item 4) since vascular plants require soil.",
          concept_takeaway: "Primary ecological succession order: Crustose Lichens -> Foliose Lichens -> Mosses -> Annual Herbs -> Perennial Grasses -> Shrubs -> Climax Forest.",
          reference_sources: ["UPSC CSE Prelims 2021 Paper 1", "NCERT Class 12 Biology - Ecosystem"]
        },
        subject: "Environment",
        topic: "Ecological Succession",
        patternType: "Pioneer Species Classification",
        difficulty: "Moderate"
      },
      {
        id: "env-2020-05",
        question: "Which of the following protected areas is well-known for the conservation of a sub-species of the Indian swamp deer (Barasingha) that thrives well on hard ground and is exclusively graminivorous?",
        options: [
          { id: "A", key: "A", text: "Kanha National Park" },
          { id: "B", key: "B", text: "Manas National Park" },
          { id: "C", key: "C", text: "Mudumalai Wildlife Sanctuary" },
          { id: "D", key: "D", text: "Tal Chhapar Sanctuary" }
        ],
        answer: "A",
        explanation: "Kanha National Park in Madhya Pradesh is famous for reviving the Hard-ground Swamp Deer (Rucervus duvaucelii branderi), mascot 'Bhoorsingh the Barasingha'.",
        detailedExplanation: {
          statement_analysis: {
            "Option A": "Correct. Kanha is the sole natural home of the hard-ground Barasingha sub-species.",
            "Option B": "Manas is home to the wetland Barasingha sub-species (R. d. ranjitsinhi).",
            "Option C": "Mudumalai is known for Elephants and Tigers in Western Ghats.",
            "Option D": "Tal Chhapar in Rajasthan is famous for Blackbucks."
          },
          elimination_technique: "Kanha NP was the first tiger reserve in India to officially introduce a mascot ('Bhoorsingh the Barasingha') commemorating this species recovery.",
          concept_takeaway: "There are 3 subspecies of Barasingha: Northern (wetland/Dudhwa), Eastern (Assam/Kaziranga/Manas), and Southern Hardground (Kanha/MP).",
          reference_sources: ["UPSC CSE Prelims 2020 Paper 1", "WII Dehradun Fauna Survey"]
        },
        subject: "Environment",
        topic: "National Parks & Endangered Species",
        patternType: "Direct Factual Match",
        difficulty: "Moderate"
      }
    ]
  }
];
