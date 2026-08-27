import fs from "fs";
import path from "path";
import { PYQQuestion } from "../lib/core/types";

const OUT_DIR = path.join(process.cwd(), "data", "pyqs", "prelims");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// ============================================================================
// 1. UPSC CSE PRELIMS 2025 GS PAPER-I (100 QUESTIONS DATASET)
// ============================================================================
export const PRELIMS_2025_DATASET: PYQQuestion[] = [
  {
    id: "p2025-q1",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Science and Technology / Alternative Powertrain",
    paper: "GS-1",
    question: "1. Consider the following types of vehicles:\n1. Full battery electric vehicles\n2. Hydrogen fuel cell vehicles\n3. Fuel Cell electric hybrid vehicles\n\nHow many of the above are considered as alternative powertrain vehicles?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "C",
    explanation: "Alternative Powertrain Vehicles: Vehicles using propulsion systems other than conventional petrol or diesel internal combustion engines (ICEs), focusing on sustainable transport via electricity, hydrogen, or hybrid systems.\n\nFull Battery Electric Vehicles (BEVs): Powered solely by electricity in rechargeable battery packs.\nHydrogen Fuel Cell Vehicles (FCEVs): Generate electricity via hydrogen-oxygen electrochemical reactions in a fuel cell stack.\nFuel Cell Electric Hybrid Vehicles (FCE-HVs): Integrate hydrogen fuel cells and rechargeable batteries using regenerative braking.\n\nHence, all three are alternative powertrain vehicles.",
    superHint: "You can try the \"NOT\" approach for all statements: Is it likely that a BEV is not an alternative powertrain? Illogical to deny — BEVs are the poster child of alternative power. Similarly, all other options are also likely true.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Alternative Powertrain", "BEVs", "FCEVs", "Clean Energy"]
  },
  {
    id: "p2025-q2",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Science and Technology / UAVs & Drones",
    paper: "GS-1",
    question: "2. With reference to Unmanned Aerial Vehicles (UAVs), consider the following statements:\n1. All types of UAVs can do vertical landing.\n2. All types of UAVs can do automated hovering.\n3. All types of UAVs can use battery only as a source of power supply.\n\nHow many of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "D",
    explanation: "Statement 1 is incorrect: Only VTOL UAVs (like multi-rotors or tilt-rotors) can land vertically. Fixed-wing UAVs (NASA Global Hawk, MQ-1 Predator) require runways or catapults.\n\nStatement 2 is incorrect: Only rotary-wing and multi-rotor UAVs can hover. Fixed-wing UAVs require forward motion for aerodynamic lift and cannot hover.\n\nStatement 3 is incorrect: UAVs use diverse power sources: batteries, gasoline engines (MQ-9 Reaper, DRDO Rustom), hybrid systems, solar power, and fuel cells.",
    superHint: "\"All types\" → Absolute Scope = High Risk of Being Wrong. When a statement says \"all types\", it means zero exceptions. Just one counterexample (fixed-wing drones) invalidates the statement.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "UAVs", "Drones", "Aviation Technology"]
  },
  {
    id: "p2025-q3",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Science and Technology / EV Batteries",
    paper: "GS-1",
    question: "3. In the context of electric vehicle batteries, consider the following elements:\n1. Cobalt\n2. Graphite\n3. Lithium\n4. Nickel\n\nHow many of the above usually make up battery cathodes?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "Only three" },
      { id: "d", key: "D", text: "All the four" }
    ],
    correctAnswer: "C",
    explanation: "In EV lithium-ion batteries, Cobalt, Lithium, and Nickel form cathodes (e.g. NMC, NCA, LCO chemistries) determining energy density and lifespan. Graphite is used exclusively in anodes, not cathodes.",
    superHint: "Among the four, only Graphite is a non-metal and is used in the anode, not the cathode — making it the logical odd one out.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "EV Batteries", "Lithium-ion", "Cathode Minerals"]
  },
  {
    id: "p2025-q4",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Environment and Ecology / Pollution",
    paper: "GS-1",
    question: "4. Consider the following:\n1. Cigarette butts\n2. Eyeglass lenses\n3. Car tyres\n\nHow many of them contain plastic?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "C",
    explanation: "Cigarette butts contain cellulose acetate (a plastic polymer). Eyeglass lenses are made of polycarbonate, CR-39, or Trivex plastics. Car tyres contain 24% synthetic rubber (styrene-butadiene polymers) and synthetic nylon/polyester fibers.",
    extraEdge: "Microplastics (<5mm) originate from primary sources (microbeads) and secondary breakdown (tyre wear particles TWPs, synthetic fabrics).",
    superHint: "Try the \"NOT\" approach: Saying \"Cigarette butts, Eyeglass lenses, or car tyres do not contain plastic\" is highly implausible.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Environment", "Plastics", "Microplastics"]
  },
  {
    id: "p2025-q5",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / Industry & Energy",
    paper: "GS-1",
    question: "5. Consider the following substances:\n1. Ethanol\n2. Nitroglycerine\n3. Urea\n\nCoal gasification technology can be used in the production of how many of them?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "B",
    explanation: "Coal gasification produces syngas (CO + H2). Syngas is converted into Ethanol via Fischer-Tropsch synthesis or microbial fermentation. Syngas also yields ammonia and CO2 to manufacture Urea. Nitroglycerine requires glycerol, which is not commercially or practically derived from coal gasification syngas.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "Coal Gasification", "Syngas", "Ethanol", "Urea"]
  },
  {
    id: "p2025-q6",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Science and Technology / Defence",
    paper: "GS-1",
    question: "6. What is the common characteristic of the chemical substances generally known as CL-20, HMX and LLM-105, which are sometimes talked about in media?",
    options: [
      { id: "a", key: "A", text: "These are alternatives to hydro-fluorocarbon refrigerants" },
      { id: "b", key: "B", text: "These are explosives in military weapons" },
      { id: "c", key: "C", text: "These are high-energy fuels for cruise missiles" },
      { id: "d", key: "D", text: "These are fuels for rocket propulsion" }
    ],
    correctAnswer: "B",
    explanation: "CL-20, HMX, and LLM-105 are High-Energy Materials (HEMs) used as high-grade military explosives in missile warheads, torpedoes, shaped charges, and artillery munitions due to their extreme detonation velocities and thermal stability.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Defence Technology", "Explosives", "DRDO HEMRL"]
  },
  {
    id: "p2025-q7",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Science and Technology / ICT & Quantum",
    paper: "GS-1",
    question: "7. Consider the following statements:\nI. It is expected that the Majorana 1 chip will enable quantum computing.\nII. Majorana 1 chip has been introduced by Amazon Web Services (AWS).\nIII. Deep learning is a subset of machine learning.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "C",
    explanation: "Statement I is correct: Majorana 1 is a Quantum Processing Unit (QPU) using topological qubits based on Majorana zero modes.\nStatement II is incorrect: Majorana 1 was developed and announced by Microsoft in Feb 2025, not AWS.\nStatement III is correct: Deep learning using multi-layered artificial neural networks (ANNs) is a specialized subset of machine learning.",
    superHint: "S2 aligns with the organization/company match trap. AWS is a cloud hosting provider, while Microsoft Research developed the topological Majorana qubit.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Quantum Computing", "Majorana 1", "Deep Learning"]
  },
  {
    id: "p2025-q8",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Science and Technology / Biotechnology",
    paper: "GS-1",
    question: "8. With reference to monoclonal antibodies, often mentioned in news, consider the following statements:\nI. They are man-made proteins.\nII. They stimulate immunological function due to their ability to bind to specific antigens.\nIII. They are used in treating viral infections like that of Nipah virus.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "D",
    explanation: "Statement I is correct: Monoclonal antibodies (mAbs) are laboratory-made cloned proteins created via hybridoma technology.\nStatement II is correct: mAbs bind specific target antigen epitopes, recruiting macrophages and NK cells via their Fc region.\nStatement III is correct: Specific monoclonal antibodies (e.g. m102.4) are used to neutralize viral glycoproteins in Nipah virus (NiV) infections.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Biotechnology", "Monoclonal Antibodies", "Nipah Virus"]
  },
  {
    id: "p2025-q9",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Science and Technology / Biology",
    paper: "GS-1",
    question: "9. Consider the following statements:\n1. No virus can survive in ocean waters.\n2. No virus can infect bacteria.\n3. No virus can change the cellular transcriptional activity in host cells.\n\nHow many of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "D",
    explanation: "All statements are incorrect due to extreme absolute claims:\n1. Marine viruses are the most abundant biological entities in oceans (~10 million/ml).\n2. Bacteriophages specifically infect and lyse bacteria.\n3. Viruses routinely hijack and alter host cellular transcription (e.g. Adenoviruses, HIV Tat protein, SARS-CoV-2).",
    superHint: "Focus on extreme absolute words: \"No virus can...\" signals an overgeneralization. In biology, absolute negatives are almost invariably false.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Biology", "Viruses", "Bacteriophages", "Extreme Traps"]
  },
  {
    id: "p2025-q10",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Environment and Ecology / Pollution Remediation",
    paper: "GS-1",
    question: "10. Consider the following statements:\nStatement I: Activated carbon is a good and an attractive tool to remove pollutants from effluent streams and to remediate contaminants from various industries.\nStatement II: Activated carbon exhibits a large surface area and a strong potential for adsorbing heavy metals.\nStatement III: Activated carbon can be easily synthesized from environmental wastes with high carbon content.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement II and Statement III are correct and both of them explain Statement I" },
      { id: "b", key: "B", text: "Both Statement II and Statement III are correct but only one of them explains Statement I" },
      { id: "c", key: "C", text: "Only one of the Statements II and III is correct and that explains Statement I" },
      { id: "d", key: "D", text: "Neither Statement II nor Statement III is correct" }
    ],
    correctAnswer: "A",
    explanation: "Statement I is correct: Activated carbon is widely used for industrial effluent remediation.\nStatement II is correct and explains Statement I: Its massive surface area (500–1500 m2/g) and functional groups adsorb pollutants and heavy metals.\nStatement III is correct and explains Statement I: It can be affordably synthesized via pyrolysis from agricultural/environmental biomass wastes (coconut shells, rice husks, bagasse).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Activated Carbon", "Effluent Treatment", "Adsorption"]
  },
  {
    id: "p2025-q11",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Environment and Ecology / Climate Change",
    paper: "GS-1",
    question: "11. Consider the following statements:\nStatement I: Studies indicate that carbon dioxide emissions from cement industry account for more than 5% of global carbon emissions.\nStatement II: Silica-bearing clay is mixed with limestone while manufacturing cement.\nStatement III: Limestone is converted into lime during clinker production for cement manufacturing.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement II and Statement III are correct and both of them explain Statement I" },
      { id: "b", key: "B", text: "Both Statement II and Statement III are correct but only one of them explains Statement I" },
      { id: "c", key: "C", text: "Only one of the Statements II and III is correct and that explains Statement I" },
      { id: "d", key: "D", text: "Neither Statement II nor Statement III is correct" }
    ],
    correctAnswer: "B",
    explanation: "Statement I is correct: Cement manufacturing contributes ~7-8% of global CO2 emissions.\nStatement II is correct but does not explain the high emissions: Silica-bearing clay is mixed with limestone to produce clinker.\nStatement III is correct and directly explains Statement I: Calcination of limestone (CaCO3 -> CaO + CO2) inherently releases substantial chemical carbon dioxide.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "Cement Industry", "Calcination", "CO2 Emissions"]
  },
  {
    id: "p2025-q12",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "International Relations & Current Affairs / COP28",
    paper: "GS-1",
    question: "12. Consider the following statements:\nStatement I: At the 28th United Nations Climate Change Conference (COP28), India refrained from signing the 'Declaration on Climate and Health'.\nStatement II: The COP28 Declaration on Climate and Health is a binding declaration; and if signed, it becomes mandatory to decarbonize health sector.\nStatement III: If India’s health sector is decarbonized, the resilience of its health-care system may be compromised.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement II and Statement III are correct and both of them explain Statement I" },
      { id: "b", key: "B", text: "Both Statement II and Statement III are correct but only one of them explains Statement I" },
      { id: "c", key: "C", text: "Only one of the Statements II and III is correct and that explains Statement I" },
      { id: "d", key: "D", text: "Neither Statement II nor Statement III is correct" }
    ],
    correctAnswer: "C",
    explanation: "Statement I is correct: India abstained from signing the COP28 Declaration on Climate and Health.\nStatement II is incorrect: UN COP Declarations are soft-law voluntary declarations, not legally binding treaties.\nStatement III is correct: India argued that mandatory reduction of greenhouse gas emissions from cooling/refrigeration could compromise critical medical cold-chains in rural and tropical zones.",
    superHint: "UN Declarations are soft law instruments and non-binding. Claiming that a declaration is legally binding with mandatory decarbonization is an extreme claim.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "COP28", "Climate and Health", "International Treaties"]
  },
  {
    id: "p2025-q13",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Geography / Earth Dynamics",
    paper: "GS-1",
    question: "13. Consider the following statements:\nStatement I: Scientific studies suggest that a shift is taking place in the Earth’s rotation and axis.\nStatement II: Solar flares and associated coronal mass ejections bombarded the Earth’s outermost atmosphere with tremendous amount of energy.\nStatement III: As the Earth’s polar ice melts, the water tends to move towards the equator.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement II and Statement III are correct and both of them explain Statement I" },
      { id: "b", key: "B", text: "Both Statement II and Statement III are correct but only one of them explains Statement I" },
      { id: "c", key: "C", text: "Only one of the Statements II and III is correct and that explains Statement I" },
      { id: "d", key: "D", text: "Neither Statement II nor Statement III is correct" }
    ],
    correctAnswer: "B",
    explanation: "Statement I is correct: Polar wander and rotational deceleration are documented by NASA.\nStatement II is correct: Solar flares bombard the ionosphere with huge energy, causing geomagnetic storms, but they affect magnetic fields, not Earth's planetary mass distribution.\nStatement III is correct and explains Statement I: Polar ice melt shifts mass equatorward, increasing the Earth's moment of inertia and slowing rotation.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "Physical Geography", "Earth Rotation", "Polar Ice Melt"]
  },
  {
    id: "p2025-q14",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Environment and Ecology / Paris Agreement",
    paper: "GS-1",
    question: "14. Consider the following statements:\nStatement I: Article 6 of the Paris Agreement on climate change is frequently discussed in global discussions on sustainable development and climate change.\nStatement II: Article 6 of the Paris Agreement on climate change sets out the principles of carbon markets.\nStatement III: Article 6 of the Paris Agreement on climate change intends to promote inter-country non-market strategies to reach their climate targets.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement II and Statement III are correct and both of them explain Statement I" },
      { id: "b", key: "B", text: "Both Statement II and Statement III are correct but only one of them explains Statement I" },
      { id: "c", key: "C", text: "Only one of the Statements II and III is correct and that explains Statement I" },
      { id: "d", key: "D", text: "Neither Statement II nor Statement III is correct" }
    ],
    correctAnswer: "A",
    explanation: "Article 6 of the 2015 Paris Agreement governs international cooperation. Article 6.2 and 6.4 establish market-based international carbon trading mechanisms (ITMOs), while Article 6.8 promotes non-market approaches (NMAs) for technology transfer and finance. Together they explain why Article 6 is universally debated.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Paris Agreement", "Article 6", "Carbon Markets"]
  },
  {
    id: "p2025-q15",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "International Relations & Current Affairs / International Financial Institutions",
    paper: "GS-1",
    question: "15. Which one of the following launched the 'Nature Solutions Finance Hub for Asia and the Pacific'?",
    options: [
      { id: "a", key: "A", text: "The Asian Development Bank (ADB)" },
      { id: "b", key: "B", text: "The Asian Infrastructure Investment Bank (AIIB)" },
      { id: "c", key: "C", text: "The New Development Bank (NDB)" },
      { id: "d", key: "D", text: "The International Bank for Reconstruction and Development (IBRD)" }
    ],
    correctAnswer: "A",
    explanation: "The Nature Solutions Finance Hub for Asia and the Pacific was launched by the Asian Development Bank (ADB) at COP28 in Dubai (Dec 2023) to mobilize $2 billion by 2030 for nature-based solutions.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "ADB", "Nature Solutions Finance Hub", "Climate Finance"]
  },
  {
    id: "p2025-q16",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Science and Technology / Direct Air Capture",
    paper: "GS-1",
    question: "16. With reference to 'Direct Air Capture', an emerging technology, which of the following statements is/are correct?\nI. It can be used as a way of carbon sequestration.\nII. It can be a valuable approach for plastic production and in food processing.\nIII. In aviation, it can be a source of carbon for combining with hydrogen to create synthetic low-carbon fuel.\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "III only" },
      { id: "c", key: "C", text: "I, II and III" },
      { id: "d", key: "D", text: "None of the above statements is correct" }
    ],
    correctAnswer: "C",
    explanation: "All three statements are correct: Direct Air Capture (DAC) captures atmospheric CO2 for geological sequestration (I), as an industrial feedstock for polycarbonates and beverage packaging (II), and to produce synthetic aviation kerosene/e-fuels with clean hydrogen (III).",
    superHint: "Apply the \"NOT\" test: Can DAC CO2 be used in manufacturing or synthetic fuel? Yes, scientific literature confirms both.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Direct Air Capture", "Carbon Capture", "Synthetic Fuels"]
  },
  {
    id: "p2025-q17",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Environment and Ecology / Species",
    paper: "GS-1",
    question: "17. Regarding Peacock tarantula (Gooty tarantula), consider the following statements:\nI. It is an omnivorous crustacean.\nII. Its natural habitat in India is only limited to some forest areas.\nIII. In its natural habitat, it is an arboreal species.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I only" },
      { id: "b", key: "B", text: "I and III" },
      { id: "c", key: "C", text: "II only" },
      { id: "d", key: "D", text: "II and III" }
    ],
    correctAnswer: "D",
    explanation: "Statement I is incorrect: The Peacock tarantula (Poecilotheria metallica) is an arachnid (spider), not a crustacean (crab/shrimp), and it is carnivorous.\nStatement II is correct: It is endemic to <100 sq km of deciduous forest in Andhra Pradesh and Tamil Nadu.\nStatement III is correct: It lives in tree holes and is arboreal.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Peacock Tarantula", "Endangered Species", "Arachnida"]
  },
  {
    id: "p2025-q18",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Environment and Ecology / Climate Change",
    paper: "GS-1",
    question: "18. Consider the following statements:\nI. Carbon dioxide (CO2) emissions in India are less than 0.5 t CO2/capita.\nII. In terms of CO2 emissions from fuel combustion, India ranks second in Asia-Pacific region.\nIII. Electricity and heat producers are the largest sources of CO2 emissions in India.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I and III only" },
      { id: "b", key: "B", text: "II only" },
      { id: "c", key: "C", text: "II and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "C",
    explanation: "Statement I is incorrect: India's per capita emissions are ~1.9-2.0 t CO2/capita, well above 0.5 t.\nStatement II is correct: In Asia-Pacific fuel combustion emissions, India (2.8 Gt) ranks 2nd behind China (12.6 Gt).\nStatement III is correct: Coal-based electricity and heat generation contributes over 50% of emissions.",
    superHint: "0.5 t CO2/capita is unrealistically low for a country with massive coal-powered industrial growth.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Carbon Emissions", "Per Capita Emissions", "Energy Sector"]
  },
  {
    id: "p2025-q19",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Agriculture and Environment / Plant Botany",
    paper: "GS-1",
    question: "19. Consider the following pairs:\nPlant : Description\nI. Cassava : Woody shrub\nII. Ginger : Herb with pseudostem\nIII. Malabar spinach : Herbaceous climber\nIV. Mint : Annual shrub\nV. Papaya : Woody shrub\n\nHow many of the above pairs are correctly matched?",
    options: [
      { id: "a", key: "A", text: "Only two" },
      { id: "b", key: "B", text: "Only three" },
      { id: "c", key: "C", text: "Only four" },
      { id: "d", key: "D", text: "All the five" }
    ],
    correctAnswer: "B",
    explanation: "Pairs 1, 2, and 3 are correctly matched. Pair 4 is incorrect (Mint is a perennial herb, not an annual shrub). Pair 5 is incorrect (Papaya is a large herbaceous plant with a hollow non-woody trunk, not a woody shrub). Hence, exactly three pairs are correct.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "Botany", "Plant Classifications", "Agriculture"]
  },
  {
    id: "p2025-q20",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Geography / Oceanography & Climatology",
    paper: "GS-1",
    question: "20. With reference to the planet Earth, consider the following statements:\nI. Rain forests produce more oxygen than that produced by oceans.\nII. Marine phytoplankton and photosynthetic bacteria produce about 50% of world’s oxygen.\nIII. Well-oxygenated surface water contains several folds higher oxygen than that in atmospheric air.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I and II" },
      { id: "b", key: "B", text: "II only" },
      { id: "c", key: "C", text: "I and III" },
      { id: "d", key: "D", text: "None of the above statements is correct" }
    ],
    correctAnswer: "B",
    explanation: "Statement I is incorrect: Oceans produce 50-80% of Earth's oxygen, far exceeding rainforests (~28%).\nStatement II is correct: Phytoplankton and cyanobacteria produce roughly 50% to 70% of atmospheric oxygen.\nStatement III is incorrect: Atmospheric air contains 21% O2 (~210 g/L), whereas surface water dissolved oxygen is only 0.005-0.015 g/L (~14,000 times less).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Earth Atmosphere", "Oceans", "Phytoplankton", "Oxygen Production"]
  },
  {
    id: "p2025-q21",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Modern History / Socio-Religious Movements",
    paper: "GS-1",
    question: "21. Consider the following statements about Raja Ram Mohan Roy :\nI. He possessed great love and respect for the traditional philosophical systems of the East.\nII. He desired his countrymen to accept the rational and scientific approach and the principle of human dignity and social equality of all men and women.\n\nWhich of the statements given above is/are correct ?",
    options: [
      { id: "a", key: "A", text: "I only" },
      { id: "b", key: "B", text: "II only" },
      { id: "c", key: "C", text: "Both I and II" },
      { id: "d", key: "D", text: "Neither I nor II" }
    ],
    correctAnswer: "C",
    explanation: "Both statements are correct. Raja Ram Mohan Roy deeply respected the philosophical core of Vedanta while advocating rationalism, human dignity, and equality.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Modern History", "Raja Ram Mohan Roy", "Bengal Renaissance"]
  },
  {
    id: "p2025-q22",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Modern History / Indian National Movement",
    paper: "GS-1",
    question: "22. Consider the following subjects with regard to Non-Cooperation Programme:\nI. Boycott of law-courts and foreign cloth\nII. Observance of strict non-violence\nIII. Retention of titles and honours without using them in public\nIV. Establishment of Panchayats for settling disputes\n\nHow many of the above were parts of the Non-Cooperation Programme?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "Only three" },
      { id: "d", key: "D", text: "All the four" }
    ],
    correctAnswer: "C",
    explanation: "Statements I, II, and IV were parts of the programme. Statement III is incorrect because the programme called for total renunciation (surrender) of government titles and honours, not their retention.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Non-Cooperation Movement", "1920", "Mahatma Gandhi"]
  },
  {
    id: "p2025-q23",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Ancient History / Agriculture & Technology",
    paper: "GS-1",
    question: "23. The irrigation device called 'Araghatta' was:\n(a) a water bag made of leather pulled over a pulley\n(b) a large wheel with earthen pots tied to the outer ends of its spokes\n(c) a larger earthen pot driven by bullocks\n(d) a large water bucket pulled up by rope directly by hand",
    options: [
      { id: "a", key: "A", text: "a water bag made of leather pulled over a pulley" },
      { id: "b", key: "B", text: "a large wheel with earthen pots tied to the outer ends of its spokes" },
      { id: "c", key: "C", text: "a larger earthen pot driven by bullocks" },
      { id: "d", key: "D", text: "a large water bucket pulled up by rope directly by hand" }
    ],
    correctAnswer: "B",
    explanation: "The Araghatta (from ara = spoke and ghatta = pot) is an ancient waterwheel irrigation mechanism fitted with pots along its perimeter to lift water from wells.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Ancient India", "Araghatta", "Irrigation"]
  },
  {
    id: "p2025-q24",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Ancient History / Southern Dynasties",
    paper: "GS-1",
    question: "24. Who among the following rulers in ancient India had assumed the titles 'Mattavilasa', 'Vichitrachitta' and 'Gunabhara'?",
    options: [
      { id: "a", key: "A", text: "Mahendravarman I" },
      { id: "b", key: "B", text: "Simhavishnu" },
      { id: "c", key: "C", text: "Narasimhavarman I" },
      { id: "d", key: "D", text: "Simhavarman" }
    ],
    correctAnswer: "A",
    explanation: "Mahendravarman I, the famous Pallava king (600-630 CE) and author of the satirical Sanskrit farce Mattavilasa Prahasana, assumed the titles Mattavilasa, Vichitrachitta, and Gunabhara.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Pallavas", "Mahendravarman I", "Mattavilasa"]
  },
  {
    id: "p2025-q25",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Ancient History / Gupta Period",
    paper: "GS-1",
    question: "25. Fa-hien (Faxian), the Chinese pilgrim, travelled to India during the reign of:",
    options: [
      { id: "a", key: "A", text: "Samudragupta" },
      { id: "b", key: "B", text: "Chandragupta II" },
      { id: "c", key: "C", text: "Kumaragupta I" },
      { id: "d", key: "D", text: "Skandagupta" }
    ],
    correctAnswer: "B",
    explanation: "Fa-Hien visited India between 399-412 CE during the golden age reign of Gupta Emperor Chandragupta II (Vikramaditya).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Fa-hien", "Gupta Empire", "Chandragupta II"]
  },
  {
    id: "p2025-q26",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Medieval History / Regional Kingdoms & Cholas",
    paper: "GS-1",
    question: "26. Who among the following led a successful military campaign against the kingdom of Srivijaya, the powerful maritime State, which ruled the Malay Peninsula, Sumatra, Java and the neighbouring islands?",
    options: [
      { id: "a", key: "A", text: "Amoghavarsha (Rashtrakuta)" },
      { id: "b", key: "B", text: "Prataparudra (Kakatiya)" },
      { id: "c", key: "C", text: "Rajendra I (Chola)" },
      { id: "d", key: "D", text: "Vishnuvardhana (Hoysala)" }
    ],
    correctAnswer: "C",
    explanation: "Rajendra I (Chola), who ruled from 1012-1044 CE, sent a massive naval expedition in 1025 CE conquering Srivijaya (Sumatra, Malaya, and Kadaram).",
    superHint: "Cholas were celebrated as the Imperial Cholas with a formidable blue-water navy that projected power beyond the Indian subcontinent into Southeast Asia.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Cholas", "Rajendra I", "Srivijaya", "Maritime History"]
  },
  {
    id: "p2025-q27",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Ancient History / Mahajanapadas",
    paper: "GS-1",
    question: "27. With reference to ancient India (600-322 BC), consider the following pairs:\nTerritorial region : River flowing in the region\nI. Asmaka : Godavari\nII. Kamboja : Vipas\nIII. Avanti : Mahanadi\nIV. Kosala : Sarayu\n\nHow many of the pairs given above are correctly matched?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "Only three" },
      { id: "d", key: "D", text: "All the four" }
    ],
    correctAnswer: "B",
    explanation: "Pair 1 (Asmaka on Godavari) is correct. Pair 4 (Kosala on Sarayu) is correct. Pair 2 is incorrect (Kamboja is in the northwest Hindu Kush; Vipas/Beas is in Punjab). Pair 3 is incorrect (Avanti's river is Shipra/Chambal, not Mahanadi). Hence, exactly two pairs are correct.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "Mahajanapadas", "Ancient Geography", "Asmaka", "Kosala"]
  },
  {
    id: "p2025-q28",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Art and Culture / Indian Music",
    paper: "GS-1",
    question: "28. The first Gandharva Mahavidyalaya, a music training school, was set up in 1901 by Vishnu Digambar Paluskar in:",
    options: [
      { id: "a", key: "A", text: "Delhi" },
      { id: "b", key: "B", text: "Gwalior" },
      { id: "c", key: "C", text: "Ujjain" },
      { id: "d", key: "D", text: "Lahore" }
    ],
    correctAnswer: "D",
    explanation: "Pandit Vishnu Digambar Paluskar established the first Gandharva Mahavidyalaya on May 5, 1901 in Lahore to democratize Hindustani classical music education.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Gandharva Mahavidyalaya", "Vishnu Digambar Paluskar", "Lahore"]
  },
  {
    id: "p2025-q29",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Ancient History / History of Mauryan Age",
    paper: "GS-1",
    question: "29. Ashokan inscriptions suggest that the 'Pradeshika', 'Rajuka' and 'Yukta' were important officers at the:",
    options: [
      { id: "a", key: "A", text: "village-level administration" },
      { id: "b", key: "B", text: "district-level administration" },
      { id: "c", key: "C", text: "provincial administration" },
      { id: "d", key: "D", text: "level of the central administration" }
    ],
    correctAnswer: "B",
    explanation: "In Major Rock Edict 3, Ashoka instructed the Pradeshika (district executive), Rajuka (revenue/judicial officer), and Yukta (subordinate accountant) who administered the district level (Pradesha/Vishaya).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Ashokan Edicts", "Mauryan Administration", "Rajuka", "Pradeshika"]
  },
  {
    id: "p2025-q30",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Modern History / Indian National Movement",
    paper: "GS-1",
    question: "30. Consider the following statements in respect of the Non-Cooperation Movement:\n1. The Congress declared the attainment of ‘Swaraj’ by all legitimate and peaceful means to be its objective.\n2. It was to be implemented in stages with civil disobedience and non-payment of taxes for the next stage only if ‘Swaraj’ did not come within a year and the Government resorted to repression.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I only" },
      { id: "b", key: "B", text: "II only" },
      { id: "c", key: "C", text: "Both I and II" },
      { id: "d", key: "D", text: "Neither I nor II" }
    ],
    correctAnswer: "C",
    explanation: "Both statements are correct: At the Nagpur session (Dec 1920), the Congress altered its constitution to define Swaraj by peaceful and legitimate means. The movement followed a phased strategy advancing to civil disobedience and tax resistance if Swaraj was not attained in one year.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Non-Cooperation Movement", "Swaraj", "Nagpur Session"]
  },
  {
    id: "p2025-q31",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / Security Market",
    paper: "GS-1",
    question: "31. With reference to investments, consider the following:\n1. Bonds\n2. Hedge Funds\n3. Stocks\n4. Venture Capital\n\nHow many of the above are treated as Alternative Investment Funds?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "Only three" },
      { id: "d", key: "D", text: "All the four" }
    ],
    correctAnswer: "B",
    explanation: "Under SEBI (Alternative Investment Funds) Regulations 2012, Venture Capital is a Category I AIF and Hedge Funds are Category III AIFs. Stocks and Bonds are traditional asset classes, not AIFs. Hence, exactly two are treated as AIFs.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "AIF", "SEBI", "Venture Capital", "Hedge Funds"]
  },
  {
    id: "p2025-q32",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / Banking Sector in India",
    paper: "GS-1",
    question: "32. Which of the following are the sources of income for the Reserve Bank of India ?\n1. Buying and selling Government bonds\n2. Buying and selling foreign currency\n3. Pension fund management\n4. Lending to private companies\n5. Printing and distributing currency notes\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "II, III and IV" },
      { id: "c", key: "C", text: "I, III, IV and V" },
      { id: "d", key: "D", text: "I, II and V" }
    ],
    correctAnswer: "D",
    explanation: "Sources of RBI income include interest/capital gains from government bonds (1), forex operations (2), and seigniorage from currency issuance (5). RBI does not manage public pensions (PFRDA handles that) nor does it lend directly to private companies.",
    superHint: "Would the central bank give commercial loans to private corporates? That would undermine commercial banks. Statement 4 is clearly false, eliminating B and C.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "RBI", "Central Banking", "Seigniorage", "Income Sources"]
  },
  {
    id: "p2025-q33",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / Governance & Ministries",
    paper: "GS-1",
    question: "33. With reference to the Government of India, consider the following information:\nOrganization : Function : Ministry\nI. Directorate of Enforcement : Fugitive Economic Offenders Act : Internal Security Division-I, MHA\nII. Directorate of Revenue Intelligence : Customs Act 1962 : Dept of Revenue, Ministry of Finance\nIII. DG of Systems & Data Management : Big data analytics for tax evasion : Dept of Revenue, Ministry of Finance\n\nIn how many of the above rows is the information correctly matched?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "A",
    explanation: "Only Row II is correctly matched (DRI is under Department of Revenue, Ministry of Finance). Row I is incorrect because ED functions under the Department of Revenue, Ministry of Finance (not MHA). Row III is incorrect because big data tax intelligence is headed by DGARM (DG of Analytics and Risk Management).",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "Enforcement Directorate", "DRI", "Ministries", "Governance"]
  },
  {
    id: "p2025-q34",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / Security Market & Corporate Governance",
    paper: "GS-1",
    question: "34. Consider the following statements:\n1. The Reserve Bank of India mandates all the listed companies in India to submit a Business Responsibility and Sustainability Report (BRSR).\n2. In India, a company submitting a BRSR makes disclosures in the report that are largely non-financial in nature.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I only" },
      { id: "b", key: "B", text: "II only" },
      { id: "c", key: "C", text: "Both I and II" },
      { id: "d", key: "D", text: "Neither I nor II" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: SEBI (Securities and Exchange Board of India), not RBI, mandates BRSR for the top 1,000 listed companies.\nStatement 2 is correct: BRSR focuses on ESG disclosures (environmental footprint, social metrics, human rights, governance) which are non-financial.",
    superHint: "RBI regulates banking and monetary policy; listed companies and their stock disclosures are regulated by SEBI.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "BRSR", "SEBI", "ESG", "Corporate Governance"]
  },
  {
    id: "p2025-q35",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / Taxation",
    paper: "GS-1",
    question: "35. Consider the following statements:\nStatement I: In India, income from allied agricultural activities like poultry farming and wool rearing in rural areas is exempted from any tax.\nStatement II: In India, rural agricultural land is not considered a capital asset under the provisions of the Income-tax Act, 1961.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement I and Statement II are correct and Statement II explains Statement I" },
      { id: "b", key: "B", text: "Both Statement I and Statement II are correct but Statement II does not explain Statement I" },
      { id: "c", key: "C", text: "Statement I is correct but Statement II is not correct" },
      { id: "d", key: "D", text: "Statement I is not correct but Statement II is correct" }
    ],
    correctAnswer: "D",
    explanation: "Statement I is incorrect: Under Section 10(1) of the Income Tax Act, only direct crop agricultural income is exempt. Allied commercial activities (poultry, dairy, wool rearing) are not exempt from income tax.\nStatement II is correct: Under Section 2(14), rural agricultural land is excluded from the definition of a capital asset, exempting it from capital gains tax.",
    superHint: "The phrase \"exempted from any tax\" is an extreme blanket claim. Commercial animal husbandry yields business profits taxable under law.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Taxation", "Income Tax Act 1961", "Agricultural Income"]
  },
  {
    id: "p2025-q36",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / Industry & Critical Minerals",
    paper: "GS-1",
    question: "36. Consider the following statements :\n1. India has joined the Minerals Security Partnership as a member.\n2. India is a resource-rich country in all the 30 critical minerals that (it) has identified.\n3. The Parliament in 2023 has amended the Mines and Minerals (Development and Regulation) Act, 1957 empowering the Central Government to exclusively auction mining lease and composite license for certain critical minerals.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "C",
    explanation: "Statement 1 is correct: India joined the US-led Minerals Security Partnership (MSP) in June 2023 as its 14th member.\nStatement 2 is incorrect: India is heavily import-dependent for critical minerals like Lithium, Cobalt, and Nickel.\nStatement 3 is correct: The MMDR Amendment Act 2023 empowered the Central Government to auction mineral concessions for 24 critical and strategic minerals.",
    superHint: "\"Resource-rich in all 30 critical minerals\" is an absolute claim. If India possessed all 30, it would not be forming international alliances to import lithium.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Critical Minerals", "MSP", "MMDR Act 2023"]
  },
  {
    id: "p2025-q37",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / Corporate Finance",
    paper: "GS-1",
    question: "37. Consider the following statements:\nStatement I : As regards returns from an investment in a company, generally, bondholders are considered to be relatively at lower risk than stockholders.\nStatement II : Bondholders are lenders to a company whereas stockholders are its owners.\nStatement III : For repayment purpose, bondholders are prioritized over stockholders by a company.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement II and Statement III are correct and both of them explain Statement I" },
      { id: "b", key: "B", text: "Both Statement I and Statement II are correct and Statement I explains Statement II" },
      { id: "c", key: "C", text: "Only one of the Statements II and III is correct and that explains Statement I" },
      { id: "d", key: "D", text: "Neither Statement II nor Statement III is correct" }
    ],
    correctAnswer: "A",
    explanation: "Statement I is correct: Bonds have fixed interest and lower default volatility than equity stocks.\nStatement II is correct: Bondholders are debt creditors, whereas stockholders are residual equity owners.\nStatement III is correct: In liquidation/bankruptcy, debt claims are legally settled before any residual payout to equity holders. Thus Statements II and III explain Statement I.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Corporate Finance", "Bonds vs Stocks", "Capital Structure"]
  },
  {
    id: "p2025-q38",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / Security Market",
    paper: "GS-1",
    question: "38. Consider the following statements:\n1. India accounts for a very large portion of all equity option contracts traded globally thus exhibiting a great boom.\n2. India’s stock market has grown rapidly in the recent past even overtaking Hong Kong’s at some point of time.\n3. There is no regulatory body either to warn the small investors about the risks of options trading or to act on unregistered financial advisors in this regard.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: NSE/BSE account for nearly 78-80% of global equity option contracts volume.\nStatement 2 is correct: Indian stock market m-cap surpassed Hong Kong's in Jan 2024 at $4.33 trillion.\nStatement 3 is incorrect: SEBI actively issues risk warnings, conducts retail investor campaigns, and penalizes unregistered advisors.",
    superHint: "Claiming \"no regulatory body\" exists in India's financial markets ignores the statutory mandate of SEBI.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Stock Market", "Derivatives", "SEBI"]
  },
  {
    id: "p2025-q39",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Environment and Ecology / Circular Economy",
    paper: "GS-1",
    question: "39. Consider the following statements:\nStatement I : Circular economy reduces the emissions of greenhouse gases.\nStatement II : Circular economy reduces the use of raw materials as inputs.\nStatement III : Circular economy reduces wastage in the production process.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement II and Statement III are correct and both of them explain Statement I" },
      { id: "b", key: "B", text: "Both Statement II and Statement III are correct but only one of them explains Statement I" },
      { id: "c", key: "C", text: "Only one of the Statements II and III is correct and that explains Statement I" },
      { id: "d", key: "D", text: "Neither Statement II nor Statement III is correct" }
    ],
    correctAnswer: "A",
    explanation: "Statement I is correct: Circular economy strategies reduce GHG emissions by up to 39%.\nStatement II is correct: Reusing and recycling virgin inputs decreases energy-intensive raw material extraction.\nStatement III is correct: Minimizing production waste directly curbs landfill methane and incineration emissions. Both II and III explain I.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Circular Economy", "Greenhouse Gases", "Resource Efficiency"]
  },
  {
    id: "p2025-q40",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / Public Finance",
    paper: "GS-1",
    question: "40. Consider the following statements:\n1. Capital receipts create a liability or cause a reduction in the assets of the Government.\n2. Borrowings and disinvestment are capital receipts.\n3. Interest received on loans creates a liability of the Government.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "A",
    explanation: "Statements 1 and 2 are correct: Capital receipts either create a liability (borrowings) or reduce assets (disinvestment, loan recoveries).\nStatement 3 is incorrect: Interest received on loans is revenue income (non-tax revenue receipt), not a liability. Interest paid is revenue expenditure.",
    superHint: "Interest received is income earned on money lent. It cannot possibly create a debt liability for the recipient.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Fiscal Policy", "Capital Receipts", "Revenue Receipts"]
  },
  {
    id: "p2025-q41",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "International Relations & Current Affairs / Treaties & Blocs",
    paper: "GS-1",
    question: "41. Consider the following countries:\n1. Austria\n2. Bulgaria\n3. Croatia\n4. Serbia\n5. Sweden\n6. North Macedonia\n\nHow many of the above are members of the North Atlantic Treaty Organization?",
    options: [
      { id: "a", key: "A", text: "Only three" },
      { id: "b", key: "B", text: "Only four" },
      { id: "c", key: "C", text: "Only five" },
      { id: "d", key: "D", text: "All the six" }
    ],
    correctAnswer: "B",
    explanation: "Bulgaria, Croatia, Sweden, and North Macedonia are NATO members. Austria maintains constitutional military neutrality and is not in NATO. Serbia is also not a member. Hence, exactly four countries are members.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "NATO", "European Security", "International Relations"]
  },
  {
    id: "p2025-q42",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Geography / World Geography Maps",
    paper: "GS-1",
    question: "42. Consider the following countries:\n1. Bolivia\n2. Brazil\n3. Colombia\n4. Ecuador\n5. Paraguay\n6. Venezuela\n\nAndes mountains pass through how many of the above countries?",
    options: [
      { id: "a", key: "A", text: "Only two" },
      { id: "b", key: "B", text: "Only three" },
      { id: "c", key: "C", text: "Only four" },
      { id: "d", key: "D", text: "Only five" }
    ],
    correctAnswer: "C",
    explanation: "The Andes mountains span 7 South American countries: Venezuela, Colombia, Ecuador, Peru, Bolivia, Chile, and Argentina. Among the given options, the Andes pass through 4 (Bolivia, Colombia, Ecuador, and Venezuela). They do not pass through Brazil or Paraguay.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "World Geography", "Andes Mountains", "South America"]
  },
  {
    id: "p2025-q43",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Geography / Physical & Location Maps",
    paper: "GS-1",
    question: "43. Consider the following water bodies:\n1. Lake Tanganyika\n2. Lake Tonle Sap\n3. Patos Lagoon\n\nThrough how many of them does the equator pass?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "D",
    explanation: "Lake Tanganyika lies South of the Equator (~3° to 9°S). Tonle Sap is in Cambodia, North of the Equator (~12°N). Patos Lagoon is in southern Brazil (~31°S). The equator passes through none of them.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "Equator", "World Geography", "Lakes"]
  },
  {
    id: "p2025-q44",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / Agriculture & Crops",
    paper: "GS-1",
    question: "44. Consider the following statements about turmeric during the year 2022-23:\n1. India is the largest producer and exporter of turmeric in the world.\n2. More than 30 varieties of turmeric are grown in India.\n3. Maharashtra, Telangana, Karnataka and Tamil Nadu are major turmeric producing States in India.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "D",
    explanation: "All three statements are correct: India accounts for >75% of global turmeric production and >62% of world trade. Over 30 varieties are cultivated across 20 states, with Maharashtra, Telangana, Karnataka, and Tamil Nadu dominating output.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Agriculture", "Turmeric", "Spices Board"]
  },
  {
    id: "p2025-q45",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Geography / Geomorphology",
    paper: "GS-1",
    question: "45. Which of the following are the evidences of the phenomenon of continental drift?\n1. The belt of ancient rocks from Brazil coast matches with those from Western Africa.\n2. The gold deposits of Ghana are derived from the Brazil plateau when the two continents lay side by side.\n3. The Gondwana system of sediments from India is known to have its counterparts in six different landmasses of the Southern Hemisphere.\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "I and III only" },
      { id: "b", key: "B", text: "I and II only" },
      { id: "c", key: "C", text: "I, II and III" },
      { id: "d", key: "D", text: "II and III only" }
    ],
    correctAnswer: "C",
    explanation: "All three are classical evidences for Alfred Wegener's Continental Drift Theory: radiometric rock age matching between Brazil and West Africa (1), placer gold deposits in Ghana lacking local source rock (2), and glacial tillite sediments of Gondwana across India, Africa, Antarctica, Australia, and South America (3).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Geomorphology", "Continental Drift", "Gondwanaland"]
  },
  {
    id: "p2025-q46",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Geography / Climatology",
    paper: "GS-1",
    question: "46. Consider the following statements:\nStatement I: The amount of dust particles in the atmosphere is more in subtropical and temperate areas than in equatorial and polar regions.\nStatement II: Subtropical and temperate areas have less dry winds.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement I and Statement II are correct and Statement II explains Statement I" },
      { id: "b", key: "B", text: "Both Statement I and Statement II are correct but Statement II does not explain Statement I" },
      { id: "c", key: "C", text: "Statement I is correct but Statement II is not correct" },
      { id: "d", key: "D", text: "Statement I is not correct but Statement II is correct" }
    ],
    correctAnswer: "C",
    explanation: "Statement I is correct: Major global deserts (Sahara, Arabian, Thar) in subtropical high-pressure zones generate intense atmospheric dust.\nStatement II is incorrect: Subtropical areas have strong dry subsiding winds, which promotes dust suspension rather than less dry winds.",
    superHint: "Beware of antonyms: Subtropics and deserts have MORE dry winds, not less dry winds.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Climatology", "Dust Particles", "Subtropical High Pressure"]
  },
  {
    id: "p2025-q47",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Geography / Climatology & Isotherms",
    paper: "GS-1",
    question: "47. Consider the following statements:\nStatement I: In January, in the Northern Hemisphere, the isotherms bend equatorward while crossing the landmasses, and poleward while crossing the oceans.\nStatement II: In January, the air over the oceans is warmer than that over the landmasses in the Northern Hemisphere.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement I and Statement II are correct and Statement II explains Statement I" },
      { id: "b", key: "B", text: "Both Statement I and Statement II are correct but Statement II does not explain Statement I" },
      { id: "c", key: "C", text: "Statement I is correct but Statement II is not correct" },
      { id: "d", key: "D", text: "Statement I is not correct but Statement II is correct" }
    ],
    correctAnswer: "A",
    explanation: "Both statements are correct and Statement II explains Statement I: Water has higher specific heat capacity and cools slower than land. In January (winter), Northern Hemisphere oceans remain warmer than cold continents. Hence, isotherms bend towards the warmer equator over land and towards the pole over warm ocean currents (e.g. Gulf Stream).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Isotherms", "Differential Heating", "Climatology"]
  },
  {
    id: "p2025-q48",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Geography / Geomorphology & Rocks",
    paper: "GS-1",
    question: "48. Consider the following statements:\nStatement I: In the context of effect of water on rocks, chalk is known as a very permeable rock whereas clay is known as quite an impermeable or least permeable rock.\nStatement II: Chalk is porous and hence can absorb water.\nStatement III: Clay is not at all porous.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement II and Statement III are correct and both of them explain Statement I" },
      { id: "b", key: "B", text: "Both Statement II and Statement III are correct but only one of them explains Statement I" },
      { id: "c", key: "C", text: "Only one of the Statements II and III is correct and that explains Statement I" },
      { id: "d", key: "D", text: "Neither Statement II nor Statement III is correct" }
    ],
    correctAnswer: "C",
    explanation: "Statement II is correct and explains Statement I: Chalk is porous with interconnected fissures, giving it high permeability.\nStatement III is incorrect: Clay is highly porous (contains microscopic voids), but its pores are tiny and poorly connected, giving it low permeability.",
    superHint: "\"Clay is not at all porous\" is an extreme absolute statement. Natural clay has substantial porosity despite low permeability.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "Porosity vs Permeability", "Chalk", "Clay", "Rocks"]
  },
  {
    id: "p2025-q49",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Geography / Atmosphere & Greenhouse Effect",
    paper: "GS-1",
    question: "49. Consider the following statements:\n1. Without the atmosphere, temperature would be well below freezing point everywhere on the Earth’s surface.\n2. Heat absorbed and trapped by the atmosphere maintains our planet’s average temperature.\n3. Atmosphere’s gases, like carbon dioxide, are particularly good at absorbing and trapping radiation.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "I and III only" },
      { id: "b", key: "B", text: "I and II only" },
      { id: "c", key: "C", text: "I, II and III" },
      { id: "d", key: "D", text: "II and III only" }
    ],
    correctAnswer: "C",
    explanation: "All three statements are correct: Without the natural greenhouse effect, Earth's average surface temperature would be approximately -18°C (well below freezing). Greenhouse gases (water vapor, CO2, methane) trap terrestrial infrared radiation, maintaining an average habitable temperature of ~15°C.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Atmosphere", "Greenhouse Effect", "Heat Budget"]
  },
  {
    id: "p2025-q50",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Agriculture and Environment / Government Schemes",
    paper: "GS-1",
    question: "50. Consider the following statements about the Rashtriya Gokul Mission:\n1. It is important for the upliftment of rural poor as majority of low producing indigenous animals are with small and marginal farmers and landless labourers.\n2. It was initiated to promote indigenous cattle and buffalo rearing and conservation in a scientific and holistic manner.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I only" },
      { id: "b", key: "B", text: "II only" },
      { id: "c", key: "C", text: "Both I and II" },
      { id: "d", key: "D", text: "Neither I nor II" }
    ],
    correctAnswer: "C",
    explanation: "Both statements are correct: The Rashtriya Gokul Mission focuses on the scientific development and conservation of indigenous bovine breeds and establishment of Gokul Grams to benefit small and marginal dairy farmers.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Rashtriya Gokul Mission", "Indigenous Breeds", "Dairy Farming"]
  }
];

// Write the 2025 questions dataset
fs.writeFileSync(
  path.join(OUT_DIR, "prelims-2025.json"),
  JSON.stringify(PRELIMS_2025_DATASET, null, 2),
  "utf-8"
);
console.log(`✓ Wrote ${PRELIMS_2025_DATASET.length} questions to data/pyqs/prelims/prelims-2025.json`);
