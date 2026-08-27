import fs from "fs";
import path from "path";
import { PYQQuestion } from "../lib/core/types";
import { PRELIMS_2025_DATASET as PART1 } from "./build-prelims-vault";

const OUT_DIR = path.join(process.cwd(), "data", "pyqs", "prelims");

export const PRELIMS_2025_PART2: PYQQuestion[] = [
  {
    id: "p2025-q51",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / Local Government: Panchayats",
    paper: "GS-1",
    question: "51. Consider the following statements:\nI. Panchayats at the intermediate level exist in all States.\nII. To be eligible to be a Member of a Panchayat at the intermediate level, a person should attain the age of thirty years.\nIII. The Chief Minister of a State constitutes a commission to review the financial position of Panchayats at the intermediate levels and to make recommendations regarding the distribution of net proceeds of taxes and duties, leviable by the State, between the State and Panchayats at the intermediate level.\n\nWhich of the statements given above are not correct?",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "D",
    explanation: "All three statements are incorrect:\nI. Under Article 243B, intermediate panchayats are not mandatory for states with a population under 20 lakhs.\nII. Under Article 243F, the minimum qualifying age to contest a Panchayat election is 21 years (not 30 years).\nIII. Under Article 243I, the State Finance Commission is constituted by the Governor (not Chief Minister).",
    superHint: "S1: \"All states\" is an extreme absolute. S2: 30 years is for Rajya Sabha/Legislative Council; local democracy starts at 21 years. S3: State Finance Commission is appointed by the Governor.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Polity", "Panchayati Raj", "73rd Amendment"]
  },
  {
    id: "p2025-q52",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "International Relations / Regional Blocs",
    paper: "GS-1",
    question: "52. Consider the following statements in respect of BIMSTEC:\nI. It is a regional organization consisting of seven member States till January 2025.\nII. It came into existence with the signing of the Dhaka Declaration, 1999.\nIII. Bangladesh, India, Sri Lanka, Thailand and Nepal are founding member States of BIMSTEC.\nIV. In BIMSTEC, the subsector of ‘tourism’ is being led by India.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I and II" },
      { id: "b", key: "B", text: "II and III" },
      { id: "c", key: "C", text: "I and IV" },
      { id: "d", key: "D", text: "I only" }
    ],
    correctAnswer: "D",
    explanation: "Statement I is correct: BIMSTEC has 7 members (India, Bangladesh, Bhutan, Nepal, Sri Lanka, Myanmar, Thailand).\nStatement II is incorrect: Founded via Bangkok Declaration in June 1997.\nStatement III is incorrect: Nepal joined in 2004, not a founding member.\nStatement IV is incorrect: Tourism is led by Nepal; India leads Security.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "BIMSTEC", "Regional Groupings", "International Relations"]
  },
  {
    id: "p2025-q53",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / Awards & Commissions",
    paper: "GS-1",
    question: "53. Who amongst the following are members of the Jury to select the recipient of ‘Gandhi Peace Prize’?\nI. The President of India\nII. The Prime Minister of India\nIII. The Chief Justice of India\nIV. The Leader of Opposition in the Lok Sabha\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "II and IV only" },
      { id: "b", key: "B", text: "I, II and III" },
      { id: "c", key: "C", text: "II, III and IV" },
      { id: "d", key: "D", text: "I and III only" }
    ],
    correctAnswer: "C",
    explanation: "The Gandhi Peace Prize Jury consists of: the Prime Minister (Chairperson), Chief Justice of India, Leader of Opposition in Lok Sabha, and two eminent personalities. The President is not a member of the selection jury.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Gandhi Peace Prize", "Jury Composition", "National Awards"]
  },
  {
    id: "p2025-q54",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Science and Technology / Space & Navigation",
    paper: "GS-1",
    question: "54. GPS-Aided Geo Augmented Navigation (GAGAN) uses a system of ground stations to provide necessary augmentation. Which of the following statements is/are correct in respect of GAGAN?\nI. It is designed to provide additional accuracy and integrity.\nII. It will allow more uniform and high quality air traffic management.\nIII. It will provide benefits only in aviation but not in other modes of transportation.\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "I, II and III" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I only" },
      { id: "d", key: "D", text: "I and II only" }
    ],
    correctAnswer: "D",
    explanation: "Statements I and II are correct: GAGAN, jointly developed by ISRO and AAI, provides enhanced satellite navigation accuracy and seamless air traffic management over Indian airspace.\nStatement III is incorrect: GAGAN extends beyond aviation to maritime navigation, railways train-tracking, road transport, and disaster management.",
    superHint: "\"Only in aviation\" is an extreme word trap. Satellite augmentation signals are freely receivable by maritime and land GPS receivers.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "GAGAN", "ISRO", "AAI", "Satellite Navigation"]
  },
  {
    id: "p2025-q55",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Science and Technology / Artificial Intelligence",
    paper: "GS-1",
    question: "55. Consider the following statements regarding AI Action Summit held in Grand Palais, Paris in February 2025:\nI. Co-chaired with India, the event builds on the advances made at the Bletchley Park Summit held in 2023 and the Seoul Summit held in 2024.\nII. Along with other countries, US and UK also signed the declaration on inclusive and sustainable AI.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I only" },
      { id: "b", key: "B", text: "II only" },
      { id: "c", key: "C", text: "Both I and II" },
      { id: "d", key: "D", text: "Neither I nor II" }
    ],
    correctAnswer: "A",
    explanation: "Statement I is correct: The AI Action Summit in Paris (Feb 2025) was co-chaired by French President Emmanuel Macron and Indian Prime Minister Narendra Modi.\nStatement II is incorrect: While signed by over 60 countries, the US and the UK explicitly declined to sign the declaration due to regulatory concerns.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "AI Action Summit Paris", "Global AI Governance"]
  },
  {
    id: "p2025-q56",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "International Relations & Current Affairs / UN Declarations",
    paper: "GS-1",
    question: "56. Consider the following pairs:\nI. International Year of the Woman Farmer : 2026\nII. International Year of Sustainable and Resilient Tourism : 2027\nIII. International Year of Peace and Trust : 2025\nIV. International Year of Asteroid Awareness and Planetary Defence : 2029\n\nHow many of the pairs given above are correctly matched?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "Only three" },
      { id: "d", key: "D", text: "All the four" }
    ],
    correctAnswer: "D",
    explanation: "All four pairs are correctly matched as officially declared by UN General Assembly resolutions: 2025 (Peace and Trust / Glaciers), 2026 (Woman Farmer), 2027 (Sustainable and Resilient Tourism), and 2029 (Asteroid Awareness and Planetary Defence for asteroid Apophis close flyby).",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "UN Observances", "International Years"]
  },
  {
    id: "p2025-q57",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "International Relations / BRICS",
    paper: "GS-1",
    question: "57. Consider the following statements with regard to BRICS:\nI. 16th BRICS Summit was held under the Chairship of Russia in Kazan.\nII. Indonesia has become a full member of BRICS.\nIII. The theme of the 16th BRICS Summit was Strengthening Multiculturalism for Just Global Development and Security.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I and II" },
      { id: "b", key: "B", text: "II and III" },
      { id: "c", key: "C", text: "I and III" },
      { id: "d", key: "D", text: "I only" }
    ],
    correctAnswer: "A",
    explanation: "Statement I is correct: 16th BRICS Summit was held in Kazan, Russia in Oct 2024.\nStatement II is correct: Indonesia officially became the 10th full member of BRICS in Jan 2025.\nStatement III is incorrect: The theme was \"Strengthening Multilateralism (not Multiculturalism) for Just Global Development and Security\".",
    superHint: "Watch for lexical traps: \"Multilateralism\" relates to international diplomacy and trade; \"Multiculturalism\" relates to domestic cultural integration.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "BRICS", "Kazan Summit", "Indonesia"]
  },
  {
    id: "p2025-q58",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / Non-Constitutional Bodies (Lokpal)",
    paper: "GS-1",
    question: "58. Consider the following statements about Lokpal:\nI. The power of Lokpal applies to public servants of India, but not to the Indian public servants posted outside India.\nII. The Chairperson or a Member shall not be a Member of the Parliament or a Member of the Legislature of any State or Union Territory, and only the Chief Justice of India, whether incumbent or retired, has to be its Chairperson.\nIII. The Chairperson or a Member shall not be a person of less than forty-five years of age on the date of assuming office as the Chairperson or Member, as the case may be.\nIV. Lokpal cannot inquire into the allegations of corruption against a sitting Prime Minister of India.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "III only" },
      { id: "b", key: "B", text: "II and III" },
      { id: "c", key: "C", text: "I and IV" },
      { id: "d", key: "D", text: "None of the above statements is correct" }
    ],
    correctAnswer: "A",
    explanation: "Statement III is correct: Under Section 3(3) of the Lokpal Act 2013, members must be at least 45 years of age.\nStatements I, II, and IV are incorrect:\nI. Jurisdiction extends to public servants serving outside India.\nII. Chairperson can also be a retired Supreme Court judge or an eminent jurist, not only CJI.\nIV. Under Section 14, Lokpal can inquire into allegations against the Prime Minister (with specific full-bench and camera proceedings safeguards).",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "Lokpal and Lokayuktas Act 2013", "Anti-Corruption", "Polity"]
  },
  {
    id: "p2025-q59",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "General Knowledge / Sports And Games",
    paper: "GS-1",
    question: "59. Consider the following statements in respect of the first Kho Kho World Cup:\nI. The event was held in Delhi, India.\nII. Indian men beat Nepal with a score of 78-40 in the final to become the World Champion in men category.\nIII. Indian women beat Nepal with a score of 54-36 in the final to become the World Champion in women category.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I only" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "A",
    explanation: "Statement I is correct: The inaugural Kho Kho World Cup 2025 took place at the Indira Gandhi Indoor Stadium in New Delhi.\nStatements II and III are inverted: Indian men beat Nepal 54-36, while Indian women beat Nepal 78-40.",
    difficulty: "Medium",
    important: false,
    conceptTags: ["Prelims 2025", "Sports", "Kho Kho World Cup 2025"]
  },
  {
    id: "p2025-q60",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "General Knowledge / Sports And Games",
    paper: "GS-1",
    question: "60. Consider the following statements:\nI. In the finals of the 45th Chess Olympiad held in 2024, Gukesh Dommaraju became the world’s youngest winner after defeating the Russian player Ian Nepomniachtchi.\nII. Abhimanyu Mishra, an American chess player, holds the record of becoming world’s youngest ever Grandmaster.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I only" },
      { id: "b", key: "B", text: "II only" },
      { id: "c", key: "C", text: "Both I and II" },
      { id: "d", key: "D", text: "Neither I nor II" }
    ],
    correctAnswer: "B",
    explanation: "Statement I is incorrect: Gukesh D became the youngest World Chess Champion in Dec 2024 by defeating China's Ding Liren, not Ian Nepomniachtchi.\nStatement II is correct: Abhimanyu Mishra achieved the Grandmaster title at 12 years, 4 months, and 25 days in June 2021.",
    difficulty: "Easy",
    important: false,
    conceptTags: ["Prelims 2025", "Chess", "Gukesh D", "Grandmaster Records"]
  },
  {
    id: "p2025-q61",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Science and Technology / Rare Earth Elements",
    paper: "GS-1",
    question: "61. Consider the following statements:\nStatement I: Some rare earth elements are used in the manufacture of flat television, screens and computer monitors.\nStatement II: Some rare earth elements have phosphorescent properties.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement I and Statement II are correct and Statement II explains Statement I" },
      { id: "b", key: "B", text: "Both Statement I and Statement II are correct but Statement II does not explain Statement I" },
      { id: "c", key: "C", text: "Statement I is correct but Statement II is not correct" },
      { id: "d", key: "D", text: "Statement I is not correct but Statement II is correct" }
    ],
    correctAnswer: "A",
    explanation: "Both statements are correct and Statement II directly explains Statement I: Rare earth phosphors like Europium (red), Terbium (green), and Yttrium absorb energy and emit vibrant colors, making them indispensable for flat displays and monitors.",
    superHint: "Use of \"some\" makes statements hard to refute, and screens requiring light emission naturally link to phosphorescent rare earths.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Rare Earth Elements", "Phosphorescence", "Displays"]
  },
  {
    id: "p2025-q62",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Science and Technology / Railways & Kavach",
    paper: "GS-1",
    question: "62. Consider the following statements:\nI. Indian Railways have prepared a National Rail Plan (NRP) to create a ‘future ready’ railway system by 2028.\nII. ‘Kavach’ is an Automatic Train Protection system developed in collaboration with Germany.\nIII. ‘Kavach’ system consists of RFID tags fitted on track in station section.\n\nWhich of the statements given above are not correct?",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "A",
    explanation: "Statements I and II are incorrect:\nI. The National Rail Plan aims for a future-ready system by 2030 (not 2028).\nII. Kavach was developed indigenously by RDSO (Research Designs and Standards Organisation) with Indian industry, not with Germany.\nStatement III is correct: Kavach uses RFID tags placed along tracks to identify train location.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Kavach", "Indian Railways", "Automatic Train Protection"]
  },
  {
    id: "p2025-q63",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Science and Technology / Space Missions",
    paper: "GS-1",
    question: "63. Consider the following space missions :\nI. Axiom-4\nII. SpaDeX\nIII. Gaganyaan\n\nHow many of the space missions given above encourage and support micro-gravity research?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "C",
    explanation: "All three missions support micro-gravity research:\nI. Axiom-4 conducts biological and materials microgravity experiments on the ISS with ISRO participation.\nII. SpaDeX uses the PSLV POEM-4 orbital platform for in-space docking and microgravity experiments.\nIII. Gaganyaan, India's human spaceflight mission, includes scientific research payloads in low Earth microgravity.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Microgravity", "Gaganyaan", "SpaDeX", "Axiom-4"]
  },
  {
    id: "p2025-q64",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Science and Technology / Defence Aircraft",
    paper: "GS-1",
    question: "64. With reference to India’s defence, consider the following pairs :\nAircraft type : Description\nI. Dornier-228 : Maritime patrol aircraft\nII. IL-76 : Supersonic combat aircraft\nIII. C-17 Globe-master III : Military transport aircraft\n\nHow many of the pairs given above are correctly matched?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "B",
    explanation: "Pairs I and III are correctly matched. Pair II is incorrect because the Ilyushin Il-76 is a heavy strategic transport aircraft, not a supersonic combat fighter. Hence, exactly two pairs are correct.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Defence", "Indian Air Force", "Military Aircraft"]
  },
  {
    id: "p2025-q65",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Science and Technology / Cloud Seeding",
    paper: "GS-1",
    question: "65. Artificial way of causing rainfall to reduce air pollution makes use of:\n(a) silver iodide and potassium iodide\n(b) silver nitrate and potassium iodide\n(c) silver iodide and potassium nitrate\n(d) silver nitrate and potassium chloride",
    options: [
      { id: "a", key: "A", text: "silver iodide and potassium iodide" },
      { id: "b", key: "B", text: "silver nitrate and potassium iodide" },
      { id: "c", key: "C", text: "silver iodide and potassium nitrate" },
      { id: "d", key: "D", text: "silver nitrate and potassium chloride" }
    ],
    correctAnswer: "A",
    explanation: "Cloud seeding introduces silver iodide (AgI) and potassium iodide (KI) or dry ice (solid CO2) into clouds as ice nuclei to induce precipitation and clear suspended particulates.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Cloud Seeding", "Silver Iodide", "Pollution Control"]
  },
  {
    id: "p2025-q66",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / President (Article 72)",
    paper: "GS-1",
    question: "66. Consider the following statements with regard to pardoning power of the President of India :\nI. The exercise of this power by the President can be subjected to limited judicial review.\nII. The President can exercise this power without the advice of the Central Government.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I only" },
      { id: "b", key: "B", text: "II only" },
      { id: "c", key: "C", text: "Both I and II" },
      { id: "d", key: "D", text: "Neither I nor II" }
    ],
    correctAnswer: "A",
    explanation: "Statement I is correct: Under Maru Ram (1980) and Kehar Singh (1989), the President's pardon under Article 72 is subject to limited judicial review on grounds of arbitrariness or mala fide intent.\nStatement II is incorrect: As established in Maru Ram, the President must act strictly on the advice of the Council of Ministers under Article 74.",
    superHint: "Under the Indian Constitution, the President possesses no independent discretionary pardoning power.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Polity", "Pardoning Power", "Article 72", "Judicial Review"]
  },
  {
    id: "p2025-q67",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / Parliament (Speaker)",
    paper: "GS-1",
    question: "67. Consider the following statements:\nI. On the dissolution of the House of the People, the Speaker shall not vacate his/her office until immediately before the first meeting of the House of the People after the dissolution.\nII. According to the provisions of the Constitution of India, a Member of the House of the People on being elected as Speaker shall resign from his/her political party Immediately.\nIII. The Speaker of the House of the People may be removed from his/her office by a resolution of the House of the People passed by a majority of all the then Members of the House, provided that no resolution shall be moved unless at least fourteen days’ notice has been given of the intention to move the resolution.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "C",
    explanation: "Statements I and III are correct under Article 94 of the Constitution.\nStatement II is incorrect: The Constitution does not require the Speaker to resign from their party (unlike the British convention). Speakers in India remain members of their political parties.",
    superHint: "\"Shall resign immediately according to the Constitution\" is factually wrong; Indian Speakers like Om Birla retain their party affiliations.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Polity", "Speaker of Lok Sabha", "Article 94"]
  },
  {
    id: "p2025-q68",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / Anti Defection Law (Tenth Schedule)",
    paper: "GS-1",
    question: "68. Consider the following statements:\nI. If any question arises as to whether a Member of the House of the People has become subject to disqualification under the 10th Schedule, the President’s decision in accordance with the opinion of the Council of Union Ministers shall be final.\nII. There is no mention of the word ‘political party’ in the Constitution of India.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I only" },
      { id: "b", key: "B", text: "II only" },
      { id: "c", key: "C", text: "Both I and II" },
      { id: "d", key: "D", text: "Neither I nor II" }
    ],
    correctAnswer: "D",
    explanation: "Both statements are incorrect:\nI. Under the Tenth Schedule, the Presiding Officer (Speaker/Chairman), not the President, decides on defection disqualification.\nII. The term \"political party\" was explicitly incorporated into the Constitution by the 52nd Constitutional Amendment Act, 1985 via the Tenth Schedule.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Polity", "Tenth Schedule", "Anti-Defection Law"]
  },
  {
    id: "p2025-q69",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / Centre-State Relations & Minerals",
    paper: "GS-1",
    question: "69. Consider the following statements:\nStatement I: In India, State Governments have no power for making rules for grant of concessions in respect of extraction of minor minerals even though such minerals are located in their territories.\nStatement II: In India, the Central Government has the power to notify minor minerals under the relevant law.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement I and Statement II are correct and Statement II explains Statement I" },
      { id: "b", key: "B", text: "Both Statement I and Statement II are correct but Statement II does not explain Statement I" },
      { id: "c", key: "C", text: "Statement I is correct but Statement II is not correct" },
      { id: "d", key: "D", text: "Statement I is not correct but Statement II is correct" }
    ],
    correctAnswer: "D",
    explanation: "Statement I is incorrect: Under Section 15 of the MMDR Act 1957, State Governments have exclusive powers to frame rules for minor minerals.\nStatement II is correct: Under Section 3(e) of the MMDR Act, the Central Government has the statutory authority to declare and notify minor minerals.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "MMDR Act 1957", "Minor Minerals", "Federalism"]
  },
  {
    id: "p2025-q70",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Environment and Ecology / International Laws",
    paper: "GS-1",
    question: "70. Which organization has enacted the Nature Restoration Law (NRL) to tackle climate change and biodiversity loss?",
    options: [
      { id: "a", key: "A", text: "The European Union" },
      { id: "b", key: "B", text: "The World Bank" },
      { id: "c", key: "C", text: "The Organization for Economic Cooperation and Development" },
      { id: "d", key: "D", text: "The Food and Agriculture Organization" }
    ],
    correctAnswer: "A",
    explanation: "The European Union enacted the landmark Nature Restoration Law (NRL) setting binding targets to restore degraded land and marine ecosystems across EU member nations by 2030.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "European Union", "Nature Restoration Law", "Biodiversity"]
  },
  {
    id: "p2025-q71",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / Public Finance (Deficits)",
    paper: "GS-1",
    question: "71. Suppose the revenue expenditure is ₹80,000 crores and the revenue receipts of the Government are ₹60,000 crores. The Government budget also shows borrowings of 10,000 crores and interest payments of ₹6,000 crores. Which of the following statements are correct?\nI. Revenue deficit is ₹20,000 crores.\nII. Fiscal deficit is ₹10,000 crores.\nIII. Primary deficit is ₹4,000 crores.\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "D",
    explanation: "All three statements are correct:\nI. Revenue Deficit = 80,000 - 60,000 = ₹20,000 crores.\nII. Fiscal Deficit = Total Borrowings = ₹10,000 crores.\nIII. Primary Deficit = Fiscal Deficit (10,000) - Interest Payments (6,000) = ₹4,000 crores.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Public Finance", "Fiscal Deficit", "Primary Deficit"]
  },
  {
    id: "p2025-q72",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "International Relations & Current Affairs / Trade Corridors",
    paper: "GS-1",
    question: "72. India is one of the founding members of the International North-South Transport Corridor (INSTC), a multimodal transportation corridor, which will connect:",
    options: [
      { id: "a", key: "A", text: "India to Central Asia to Europe via Iran" },
      { id: "b", key: "B", text: "India to Central Asia via China" },
      { id: "c", key: "C", text: "India to South-East Asia through Bangladesh and Myanmar" },
      { id: "d", key: "D", text: "India to Europe through Azerbaijan" }
    ],
    correctAnswer: "A",
    explanation: "INSTC is a 7,200-km multimodal ship, rail, and road route connecting India (via Chabahar/Bandar Abbas in Iran) across Central Asia and the Caspian Sea to Russia and Northern Europe.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "INSTC", "Chabahar Port", "Central Asia", "Trade Routes"]
  },
  {
    id: "p2025-q73",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Geography / Economic Geography & Biofuels",
    paper: "GS-1",
    question: "73. Consider the following statements:\nStatement I: Of the two major ethanol producers in the world, i.e., Brazil and the United States of America, the former produces more ethanol than the latter.\nStatement II: Unlike in the United States of America where corn is the principal feedstock for ethanol production, sugarcane is the principal feedstock for ethanol production in Brazil.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement I and Statement II are correct and Statement II explains Statement I" },
      { id: "b", key: "B", text: "Both Statement I and Statement II are correct but Statement II does not explain Statement I" },
      { id: "c", key: "C", text: "Statement I is correct but Statement II is not correct" },
      { id: "d", key: "D", text: "Statement I is not correct but Statement II is correct" }
    ],
    correctAnswer: "D",
    explanation: "Statement I is incorrect: The United States is the world's largest producer of ethanol (~52% global share), producing more than Brazil (~28%).\nStatement II is correct: Corn is the primary feedstock in the USA, while sugarcane is the primary feedstock in Brazil.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Biofuels", "Ethanol", "USA vs Brazil"]
  },
  {
    id: "p2025-q74",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Environment and Ecology / Climate Change",
    paper: "GS-1",
    question: "74. The World Bank warned that India could become one of the first places where wet-bulb temperatures routinely exceed 35°C. Which of the following statements best reflect(s) the implication of the above-said report?\nI. Peninsular India will most likely suffer from flooding, tropical cyclones and droughts.\nII. The survival of animals including humans will be affected as shedding of their body heat through perspiration becomes difficult.\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "I only" },
      { id: "b", key: "B", text: "II only" },
      { id: "c", key: "C", text: "Both I and II" },
      { id: "d", key: "D", text: "Neither I nor II" }
    ],
    correctAnswer: "B",
    explanation: "A wet-bulb temperature exceeding 35°C marks the physiological threshold of human survival where the surrounding humid air prevents cooling via perspiration, leading to fatal hyperthermia. It directly reflects Statement II.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Wet-Bulb Temperature", "Heat Stress", "Climate Change"]
  },
  {
    id: "p2025-q75",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / Public Finance",
    paper: "GS-1",
    question: "75. A country’s fiscal deficit stands at ₹50,000 crores. It is receiving ₹10,000 crores through non-debt creating capital receipts. The country’s interest liabilities are ₹1,500 crores. What is the gross primary deficit?",
    options: [
      { id: "a", key: "A", text: "₹48,500 crores" },
      { id: "b", key: "B", text: "₹51,500 crores" },
      { id: "c", key: "C", text: "₹58,500 crores" },
      { id: "d", key: "D", text: "None of the above" }
    ],
    correctAnswer: "A",
    explanation: "Gross Primary Deficit = Gross Fiscal Deficit - Interest Liabilities = ₹50,000 - ₹1,500 = ₹48,500 crores. (Non-debt receipts are already factored into the fiscal deficit).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Primary Deficit", "Fiscal Deficit", "Macroeconomics"]
  },
  {
    id: "p2025-q76",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / Finance Commission (Article 280)",
    paper: "GS-1",
    question: "76. Which of the following statements with regard to recommendations of the 15th Finance Commission of India are correct?\n1. It has recommended grants of Rs. 4,800 crores from the year 2022-23 to the year 2025-26 for incentivizing States to enhance educational outcomes.\n2. 45% of the net proceeds of Union taxes are to be shared with States.\n3. Rs. 45,000 crores are to be kept as performance-based incentive for all States for carrying out agricultural reforms.\n4. It reintroduced tax effort criteria to reward fiscal performance.\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "I, II and III" },
      { id: "b", key: "B", text: "I, II and IV" },
      { id: "c", key: "C", text: "I, III and IV" },
      { id: "d", key: "D", text: "II, III and IV" }
    ],
    correctAnswer: "C",
    explanation: "Statement 2 is incorrect: The 15th Finance Commission recommended a vertical devolution of 41% (not 45%) of net divisible central taxes to states. Statements 1, 3, and 4 are correct.",
    superHint: "Knowledge that 15th FC devolution is 41% (reduced from 42% due to J&K reorganization) eliminates options A, B, and D immediately.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "15th Finance Commission", "Devolution", "Fiscal Federalism"]
  },
  {
    id: "p2025-q77",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / External Sector (World Bank)",
    paper: "GS-1",
    question: "77. Consider the following statements in respect of the International Bank for Reconstruction and Development (IBRD):\n1. It provides loans and guarantees to middle income countries.\n2. It works single-handedly to help developing countries to reduce poverty.\n3. It was established to help Europe rebuild after World War II.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "C",
    explanation: "Statements 1 and 3 are correct: Founded at Bretton Woods in 1944 to rebuild post-WWII Europe, IBRD now provides loans and guarantees to creditworthy middle-income nations.\nStatement 2 is incorrect: IBRD does not work \"single-handedly\"; it works in partnership with IDA, IFC, MIGA, and regional banks.",
    superHint: "\"Works single-handedly\" is an extreme word trap.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "IBRD", "World Bank Group", "Bretton Woods"]
  },
  {
    id: "p2025-q78",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / Banking & Payments",
    paper: "GS-1",
    question: "78. Consider the following statements in respect of RTGS and NEFT :\n1. In RTGS, the settlement time is instantaneous while in case of NEFT, it takes some time to settle payments.\n2. In RTGS, the customer is charged for inward transactions while that is not the case for NEFT.\n3. Operating hours for RTGS are restricted on certain days while this is not true for NEFT.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I only" },
      { id: "b", key: "B", text: "I and III" },
      { id: "c", key: "C", text: "I and II" },
      { id: "d", key: "D", text: "III only" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: RTGS operates on continuous real-time gross settlement, while NEFT settles in half-hourly batches.\nStatements 2 and 3 are incorrect: Under RBI guidelines, inward transactions carry zero charges in both systems, and both operate 24x7x365 with no day restrictions.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Banking", "RTGS", "NEFT", "Payment Systems"]
  },
  {
    id: "p2025-q79",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / UPI & Digital Payments",
    paper: "GS-1",
    question: "79. Consider the following countries:\n1. United Arab Emirates\n2. France\n3. Germany\n4. Singapore\n5. Bangladesh\n\nHow many countries amongst the above are there other than India where international merchant payments are accepted under UPI?",
    options: [
      { id: "a", key: "A", text: "Only two" },
      { id: "b", key: "B", text: "Only three" },
      { id: "c", key: "C", text: "Only four" },
      { id: "d", key: "D", text: "All the five" }
    ],
    correctAnswer: "B",
    explanation: "Among the given options, only three countries (UAE, France, Singapore) enable international UPI merchant payments. Germany and Bangladesh do not yet have UPI merchant acceptance.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "UPI", "NPCI International", "Digital Payments"]
  },
  {
    id: "p2025-q80",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / Government Schemes",
    paper: "GS-1",
    question: "80. Consider the following statements about ‘PM Surya Ghar Muft Bijli Yojana’:\n1. It targets installation of one crore solar rooftop panels in the residential sector.\n2. The Ministry of New and Renewable Energy aims to impart training on installation, operation, maintenance and repairs of solar rooftop systems at grassroot levels.\n3. It aims to create more than three lakhs skilled manpower through fresh skilling, and up-skilling, under scheme component of capacity building.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "I and III only" },
      { id: "c", key: "C", text: "II and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "C",
    explanation: "Statements 2 and 3 are correct. Statement 1 is technically flawed in English phrasing because the scheme targets 1 crore *households* (with multi-panel systems delivering 300 units/month), not merely 1 crore individual panels.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "PM Surya Ghar", "Rooftop Solar", "MNRE"]
  },
  {
    id: "p2025-q81",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / President (Ordinance Making)",
    paper: "GS-1",
    question: "81. With reference to the Indian polity, consider the following statements :\n1. An Ordinance can amend any Central Act.\n2. An Ordinance can abridge a Fundamental Right.\n3. An Ordinance can come into effect from a back date.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "C",
    explanation: "Statements 1 and 3 are correct: An ordinance issued under Article 123 has the same legal force as an Act of Parliament, can amend Acts, and can be made retrospective.\nStatement 2 is incorrect: Under Article 13(2), an ordinance is \"law\" and cannot violate or abridge Fundamental Rights.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Ordinance", "Article 123", "Fundamental Rights", "Polity"]
  },
  {
    id: "p2025-q82",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Geography / Indian Geography & States",
    paper: "GS-1",
    question: "82. Consider the following pairs:\nState : Description\nI. Arunachal Pradesh : The capital is named after a fort, and the State has two National Parks\nII. Nagaland : The State came into existence on the basis of a Constitutional Amendment Act\nIII. Tripura : Initially a Part ‘C’ State, it became a centrally administered territory with the reorganization of States in 1956 and later attained the status of a full-fledged State\n\nHow many of the above pairs are correctly matched?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "C",
    explanation: "All three pairs are correct:\nI. Itanagar is named after Ita Fort; has Namdapha and Mouling National Parks.\nII. Nagaland was created via the 13th Constitutional Amendment Act 1962 (Article 371A).\nIII. Tripura was a Part C State, became a UT in 1956, and attained statehood under the North Eastern Areas Act 1971.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "Northeast States", "Arunachal Pradesh", "Nagaland", "Tripura"]
  },
  {
    id: "p2025-q83",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / Constitutional vs Non-Constitutional Bodies",
    paper: "GS-1",
    question: "83. With reference to India, consider the following:\n1. The Inter-State Council\n2. The National Security Council\n3. Zonal Councils\n\nHow many of the above were established as per the provisions of the Constitution of India?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "A",
    explanation: "Only Inter-State Council is established under constitutional provisions (Article 263). The National Security Council is an executive body (1998), and Zonal Councils are statutory bodies created under the States Reorganisation Act 1956.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Constitutional Bodies", "Article 263", "Inter-State Council"]
  },
  {
    id: "p2025-q84",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / Governor (Articles 163 & 200)",
    paper: "GS-1",
    question: "84. Consider the following statements:\n1. The Constitution of India explicitly mentions that in certain spheres the Governor of a State acts in his/her own discretion.\n2. The President of India can, of his/her own, reserve a bill passed by a State Legislature for his/her consideration without it being forwarded by the Governor of the State concerned.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I only" },
      { id: "b", key: "B", text: "II only" },
      { id: "c", key: "C", text: "Both I and II" },
      { id: "d", key: "D", text: "Neither I nor II" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: Article 163(1) explicitly mentions that the Governor acts on aid and advice \"except in so far as he is by or under this Constitution required to exercise his functions or any of them in his discretion\".\nStatement 2 is incorrect: Under Article 200, only the Governor can reserve a State bill for the President. The President cannot unilaterally reserve a State bill.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Governor", "Article 163", "Discretionary Powers", "Polity"]
  },
  {
    id: "p2025-q85",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / Fundamental Rights, DPSP & Fundamental Duties",
    paper: "GS-1",
    question: "85. Consider the following pairs:\nProvision in the Constitution of India : Stated under\nI. Separation of Judiciary from Executive in public services : Directive Principles of State Policy\nII. Valuing and preserving rich heritage of composite culture : Fundamental Duties\nIII. Prohibition of employment of children below 14 in factories : Fundamental Rights\n\nHow many of the above pairs are correctly matched?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "C",
    explanation: "All three pairs are correct:\nI. Separation of judiciary is under Article 50 (DPSP).\nII. Composite culture preservation is under Article 51A(f) (Fundamental Duties).\nIII. Prohibition of child labour in factories is under Article 24 (Fundamental Rights).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "DPSP", "Fundamental Duties", "Fundamental Rights", "Polity"]
  },
  {
    id: "p2025-q86",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / Schedules (Fifth Schedule)",
    paper: "GS-1",
    question: "86. Consider the following statements:\nWith reference to the Constitution of India, if an area in a State is declared as Scheduled Area under the Fifth Schedule:\n1. the State Government loses its executive power in such areas and a local body assumes total administration\n2. the Union Government can take over the total administration of such areas under certain circumstances on the recommendations of the Governor\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I only" },
      { id: "b", key: "B", text: "II only" },
      { id: "c", key: "C", text: "Both I and II" },
      { id: "d", key: "D", text: "Neither I nor II" }
    ],
    correctAnswer: "D",
    explanation: "Both statements are incorrect: Under the Fifth Schedule, the executive power of the State continues to extend to Scheduled Areas (subject to the Governor's special powers to modify Acts). The State does not lose its powers, and the Union does not take over administration on Governor's recommendation.",
    superHint: "\"Loses its executive power\" and \"total administration assumed by local body\" are extreme statements contradictory to India's constitutional framework.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Fifth Schedule", "Scheduled Areas", "Governor Powers"]
  },
  {
    id: "p2025-q87",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / Governance & Ministries",
    paper: "GS-1",
    question: "87. With reference to India, consider the following pairs :\nOrganization : Union Ministry\nI. The National Automotive Board : Ministry of Commerce and Industry\nII. The Coir Board : Ministry of Heavy Industries\nIII. The National Centre for Trade Information : Ministry of Micro, Small and Medium Enterprises\n\nHow many of the above pairs are correctly matched?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "D",
    explanation: "None of the pairs are correct:\nI. National Automotive Board is under Ministry of Heavy Industries.\nII. Coir Board is under Ministry of MSME.\nIII. National Centre for Trade Information (NCTI) is under Ministry of Commerce and Industry.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "Ministries", "Statutory Boards", "Governance"]
  },
  {
    id: "p2025-q88",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / Constitutional Amendment (Article 368)",
    paper: "GS-1",
    question: "88. Consider the following subjects under the Constitution of India :\n1. List I-Union List, in the Seventh Schedule\n2. Extent of the executive power of a State\n3. Conditions of the Governor’s office\n\nFor a constitutional amendment with respect to which of the above, ratification by the Legislatures of not less than one-half of the States is required before presenting the bill to the President of India for assent?",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "A",
    explanation: "Under the proviso to Article 368(2), federal matters such as the Seventh Schedule Lists (1) and the extent of the executive power of a State (2) require ratification by at least half the states. Conditions of Governor's office (Article 158) do not require state ratification.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Article 368", "Federal Provisions", "State Ratification"]
  },
  {
    id: "p2025-q89",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Polity / Constitutional Immunities",
    paper: "GS-1",
    question: "89. With reference to the Indian polity, consider the following statements:\n1. The Governor of a State is not answerable to any court for the exercise and performance of the powers and duties of his/her office.\n2. No criminal proceedings shall be instituted or continued against the Governor during his/her term of office.\n3. Members of a State Legislature are not liable to any proceedings in any court in respect of anything said within the House.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "I and II only" },
      { id: "b", key: "B", text: "II and III only" },
      { id: "c", key: "C", text: "I and III only" },
      { id: "d", key: "D", text: "I, II and III" }
    ],
    correctAnswer: "D",
    explanation: "All three statements are correct constitutional provisions:\n1. Article 361(1) grants personal immunity to the Governor from court answerability.\n2. Article 361(2) prohibits criminal proceedings against the Governor during tenure.\n3. Article 194(2) grants absolute parliamentary privilege to state legislators for speeches/votes in the House.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Article 361", "Article 194", "Parliamentary Privileges", "Governor"]
  },
  {
    id: "p2025-q90",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Indian Economy / Regulatory Bodies (PNGRB)",
    paper: "GS-1",
    question: "90. Consider the following activities:\n1. Production of crude oil\n2. Refining, storage and distribution of petroleum\n3. Marketing and sale of petroleum products\n4. Production of natural gas\n\nHow many of the above activities are regulated by the Petroleum and Natural Gas Regulatory Board in our country?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "Only three" },
      { id: "d", key: "D", text: "All four" }
    ],
    correctAnswer: "B",
    explanation: "The PNGRB Act 2006 regulates midstream and downstream activities (2: Refining, storage, distribution pipelines; 3: Marketing and sale). Upstream exploration and production (1 and 4) fall under the Directorate General of Hydrocarbons (DGH). Hence, exactly two activities are regulated.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "PNGRB", "Petroleum Sector", "Regulatory Bodies"]
  },
  {
    id: "p2025-q91",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Modern History / Civil Disobedience Movement",
    paper: "GS-1",
    question: "91. 'Sedition has become my religion' was the famous statement given by Gandhiji at the time of:\n(a) the Champaran Satyagraha\n(b) publicly violating Salt Law at Dandi\n(c) attending the Second Round Table Conference in London\n(d) the launch of the Quit India Movement",
    options: [
      { id: "a", key: "A", text: "the Champaran Satyagraha" },
      { id: "b", key: "B", text: "publicly violating Salt Law at Dandi" },
      { id: "c", key: "C", text: "attending the Second Round Table Conference in London" },
      { id: "d", key: "D", text: "the launch of the Quit India Movement" }
    ],
    correctAnswer: "B",
    explanation: "Mahatma Gandhi proclaimed 'Sedition has become my religion' in 1930 during the Salt Satyagraha upon breaking the British salt monopoly law at Dandi.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Mahatma Gandhi", "Dandi March", "Salt Satyagraha", "1930"]
  },
  {
    id: "p2025-q92",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Ancient History / Harappan Civilization",
    paper: "GS-1",
    question: "92. The famous female figurine known as 'Dancing Girl', found at Mohenjo-daro, is made of:\n(a) carnelian\n(b) clay\n(c) bronze\n(d) gold",
    options: [
      { id: "a", key: "A", text: "carnelian" },
      { id: "b", key: "B", text: "clay" },
      { id: "c", key: "C", text: "bronze" },
      { id: "d", key: "D", text: "gold" }
    ],
    correctAnswer: "C",
    explanation: "The iconic 10.5 cm 'Dancing Girl' sculpture from Mohenjo-daro was cast in bronze using the lost-wax (cire perdue) technique.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Dancing Girl", "Mohenjo-daro", "Bronze Sculpture", "IVC"]
  },
  {
    id: "p2025-q93",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Modern History / Indian National Movement",
    paper: "GS-1",
    question: "93. Who provided legal defence to the people arrested in the aftermath of the Chauri Chaura incident?\n(a) C. R. Das\n(b) Madan Mohan Malaviya and Krishna Kant\n(c) Dr. Saifuddin Kitchlew and Khwaja Hasan Nizami\n(d) M. A. Jinnah",
    options: [
      { id: "a", key: "A", text: "C. R. Das" },
      { id: "b", key: "B", text: "Madan Mohan Malaviya and Krishna Kant" },
      { id: "c", key: "C", text: "Dr. Saifuddin Kitchlew and Khwaja Hasan Nizami" },
      { id: "d", key: "D", text: "M. A. Jinnah" }
    ],
    correctAnswer: "B",
    explanation: "Madan Mohan Malaviya and Krishna Kant provided legal defence in the Allahabad High Court, successfully saving over 150 accused freedom fighters from execution.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Chauri Chaura", "Madan Mohan Malaviya", "Legal Defence"]
  },
  {
    id: "p2025-q94",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Modern History / Indian National Movement",
    paper: "GS-1",
    question: "94. Subsequent to which one of the following events, Gandhiji, who consistently opposed untouchability and appealed for its eradication from all spheres, decided to include the upliftment of ‘Harijans’ in his political and social programme?\n(a) The Poona Pact\n(b) The Gandhi-Irwin Agreement (Delhi Pact)\n(c) Arrest of Congress leadership at the time of the Quit India Movement\n(d) Promulgation of the Government of India Act, 1935",
    options: [
      { id: "a", key: "A", text: "The Poona Pact" },
      { id: "b", key: "B", text: "The Gandhi-Irwin Agreement (Delhi Pact)" },
      { id: "c", key: "C", text: "Arrest of Congress leadership at the time of the Quit India Movement" },
      { id: "d", key: "D", text: "Promulgation of the Government of India Act, 1935" }
    ],
    correctAnswer: "A",
    explanation: "Following the historic Poona Pact of September 1932 with Dr. B.R. Ambedkar, Mahatma Gandhi founded the All India Anti-Untouchability League and the weekly journal 'Harijan' to campaign against caste discrimination.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Poona Pact 1932", "Harijan Upliftment", "Dr Ambedkar"]
  },
  {
    id: "p2025-q95",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Modern History / The Advent of the Europeans",
    paper: "GS-1",
    question: "95. Consider the following fruits :\n1. Papaya\n2. Pineapple\n3. Guava\n\nHow many of the above were introduced in India by the Portuguese in the sixteenth and seventeenth centuries?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "C",
    explanation: "All three tropical fruits (Papaya, Pineapple, and Guava) originated in the tropical Americas and were introduced into India by the Portuguese via the Columbian exchange in the 16th-17th centuries.",
    superHint: "None of these fruits are mentioned in ancient Sanskrit, Vedic, or Sangam texts, showing they were introduced from the New World by Portuguese colonial trade.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Columbian Exchange", "Portuguese in India", "Crops & Fruits"]
  },
  {
    id: "p2025-q96",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Geography / World Geography (Time Zones)",
    paper: "GS-1",
    question: "96. Consider the following countries:\n1. United Kingdom\n2. Denmark\n3. New Zealand\n4. Australia\n5. Brazil\n\nHow many of the above countries have more than four time zones?",
    options: [
      { id: "a", key: "A", text: "All the five" },
      { id: "b", key: "B", text: "Only four" },
      { id: "c", key: "C", text: "Only three" },
      { id: "d", key: "D", text: "Only two" }
    ],
    correctAnswer: "B",
    explanation: "UK has 9 time zones (with overseas territories), Denmark has 5 (including Greenland and Faroes), New Zealand has 5 (including Niue, Tokelau, Cook Islands), and Australia has 9 (with external territories). Brazil has exactly 4 time zones (UTC-2 to UTC-5), which is not MORE than four. Hence, exactly four countries qualify.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Prelims 2025", "Time Zones", "World Geography", "Physical Geography"]
  },
  {
    id: "p2025-q97",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Geography / International Date Line",
    paper: "GS-1",
    question: "97. Consider the following statements:\n1. Anadyr in Siberia and Nome in Alaska are a few kilometers from each other, but when people are waking up and getting set for breakfast in these cities, it would be different days.\n2. When it is Monday in Anadyr, it is Tuesday in Nome.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "I only" },
      { id: "b", key: "B", text: "II only" },
      { id: "c", key: "C", text: "Both I and II" },
      { id: "d", key: "D", text: "Neither I nor II" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: The International Date Line passes through the Bering Strait between Siberia and Alaska, placing them on different calendar dates.\nStatement 2 is incorrect: Anadyr (West of IDL) is ahead in time. When it is Monday in Anadyr, it is Sunday in Nome (Alaska).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "International Date Line", "Time Zones", "Bering Strait"]
  },
  {
    id: "p2025-q98",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Modern History / Socio-Religious Movements",
    paper: "GS-1",
    question: "98. Who among the following was the founder of the ‘Self-Respect Movement?",
    options: [
      { id: "a", key: "A", text: "Periyar E. V. Ramaswamy Naicker" },
      { id: "b", key: "B", text: "Dr. B. R. Ambedkar" },
      { id: "c", key: "C", text: "Bhaskarrao Jadhav" },
      { id: "d", key: "D", text: "Dinkarrao Javalkar" }
    ],
    correctAnswer: "A",
    explanation: "Periyar E. V. Ramaswamy Naicker founded the Self-Respect Movement (Suyamariyathai Iyakkam) in 1925 in Tamil Nadu to eradicate caste inequalities and promote rationalism.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Prelims 2025", "Self-Respect Movement", "Periyar", "Social Reform"]
  },
  {
    id: "p2025-q99",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Geography / Economic Geography & Minerals",
    paper: "GS-1",
    question: "99. Consider the following pairs:\nCountry : Resource-rich in\nI. Botswana : Diamond\nII. Chile : Lithium\nIII. Indonesia : Nickel\n\nIn how many of the above rows is the given information correctly matched?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "C",
    explanation: "All three pairs are correct: Botswana is a leading global diamond producer (Debswana), Chile possesses massive lithium brine reserves in Salar de Atacama (Lithium Triangle), and Indonesia holds the world's largest nickel reserves.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "Mineral Resources", "Lithium", "Nickel", "Diamonds"]
  },
  {
    id: "p2025-q100",
    year: 2025,
    subject: "UPSC CSE Prelims 2025 GS Paper-I",
    topic: "UPSC CSE Prelims 2025 GS Paper-I (Complete 100 Questions)",
    subtopic: "Geography / World Geography (Regions in News)",
    paper: "GS-1",
    question: "100. Consider the following pairs :\nRegion : Country\nI. Mallorca : Italy\nII. Normandy : Spain\nIII. Sardinia : France\n\nIn how many of the above rows is the given information correctly matched?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All the three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "D",
    explanation: "None of the rows are matched correctly:\nI. Mallorca is an autonomous island of Spain (Balearic Islands), not Italy.\nII. Normandy is a historic region of France, not Spain.\nIII. Sardinia is an autonomous region of Italy, not France (Corsica is French).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Prelims 2025", "European Geography", "Mediterranean Islands", "World Geography"]
  }
];

const FULL_2025 = [...PART1, ...PRELIMS_2025_PART2];

fs.writeFileSync(
  path.join(OUT_DIR, "prelims-2025.json"),
  JSON.stringify(FULL_2025, null, 2),
  "utf-8"
);
console.log(`✓ COMPLETE PRELIMS 2025: Wrote all ${FULL_2025.length} questions to data/pyqs/prelims/prelims-2025.json`);
