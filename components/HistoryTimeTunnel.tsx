"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { sound } from "@/lib/audio/sound-engine";
import { useRouter } from "next/navigation";

export type HistoryPeriod = "ancient" | "medieval" | "modern" | "all";

export interface HistoryEra {
  id: string;
  period: "ancient" | "medieval" | "modern";
  displayYear: string;
  yearSort: number;
  eraTitle: string;
  codename: string;
  theme: string;
  causes: string[];
  keyEvents: string[];
  consequences: string[];
  pyqCount: number;
  pyqSample: string;
}

const ALL_HISTORY_TIMELINE: HistoryEra[] = [
  // ==========================================================================
  // ANCIENT INDIA (2500 BCE – 750 CE)
  // ==========================================================================
  {
    id: "harappa",
    period: "ancient",
    displayYear: "2500 BCE",
    yearSort: -2500,
    eraTitle: "Indus Valley (Harappan) Urban Bronze Age",
    codename: "ANC-IVC-2500",
    theme: "Grid Town Planning, Citadel Architecture & Maritime Bronze Age Economy",
    causes: [
      "Perennial floodplains of the Indus-Ghaggar-Hakra river system providing rich alluvial silt",
      "Technological mastery over bronze metallurgy, baked brick manufacturing, and hydraulic drainage",
      "Thriving long-distance maritime trade connections with Mesopotamia (Meluhha) and Dilmun (Bahrain)",
    ],
    keyEvents: [
      "Standardized orthogonal grid planning, Great Bath of Mohenjodaro, and Great Granary of Harappa",
      "Dockyard and tidal hydraulic engineering at Lothal; unique water reservoir systems at Dholavira",
      "Steatite seals (Pashupati, Unicorn), bronze dancing girl, and undeciphered pictographic script",
    ],
    consequences: [
      "First Urbanization in South Asia; laid foundations for Indian urban metallurgy and weights/measures",
      "Late Harappan de-urbanization (c. 1900 BCE) driven by tectonic shifts, Saraswati desiccation, and climate aridity",
    ],
    pyqCount: 24,
    pyqSample: "To what extent has the urban planning and culture of the Indus Valley Civilization provided inputs to the present-day urbanization?",
  },
  {
    id: "vedic",
    period: "ancient",
    displayYear: "1500 BCE",
    yearSort: -1500,
    eraTitle: "Early & Later Vedic Transformation",
    codename: "ANC-VED-1500",
    theme: "Pastoral Sapta-Sindhu to Sedentary Gangetic Monarchy & Iron Age",
    causes: [
      "Migration into Indo-Gangetic divide; expansion of iron metallurgy (Shyama Ayas) clearing dense forests",
      "Transition from pastoral tribal lineage (Jana) to territorial agrarian kingdoms (Janapada)",
    ],
    keyEvents: [
      "Rigvedic tribal assemblies (Sabha, Samiti, Vidatha) and pastoral economy centered on 'Gau' (cattle)",
      "Later Vedic emergence of large territorial states, Painted Grey Ware (PGW) culture, and complex Vedic sacrifices (Rajasuya, Ashvamedha)",
      "Philosophical rebellion against ritualism in the Upanishads (Advaita, Atman-Brahman synthesis)",
    ],
    consequences: [
      "Crystallization of rigid four-fold Varna hierarchy and Gotra institutions",
      "Agrarian surplus preparing the ground for the Second Urbanization in the Gangetic plains",
    ],
    pyqCount: 19,
    pyqSample: "Discuss the socio-economic factors that led to the philosophical shift from early Vedic ritualism to Upanishadic thought.",
  },
  {
    id: "mahajanapadas",
    period: "ancient",
    displayYear: "600 BCE",
    yearSort: -600,
    eraTitle: "Mahajanapadas, Heterodox Sramana & Rise of Magadha",
    codename: "ANC-MJP-600",
    theme: "Second Urbanization, Buddhism, Jainism & Imperial Consolidation",
    causes: [
      "Widespread use of iron ploughshares creating massive agrarian surplus in the middle Gangetic plains",
      "Revolt of Kshatriyas and merchant classes (Sreshthis) against Vedic animal sacrifices and caste rigidities",
      "Strategic geographic advantage of Magadha (Rajgriha iron mines, fertile alluvium, riverine defense at Pataliputra)",
    ],
    keyEvents: [
      "Gautama Buddha propounds Four Noble Truths and Eightfold Path; Vardhamana Mahavira organizes Jain Sangha",
      "Sixteen Mahajanapadas emerge; Bimbisara and Ajatashatru establish Magadhan dominance through Haryanka dynasty",
      "Mahapadma Nanda unites northern India into the first pan-Indian empire with a massive standing army",
    ],
    consequences: [
      "Democratization of spiritual liberation through vernacular Prakrit and Pali languages",
      "Establishment of imperial statecraft that paved the way for the Mauryan Empire",
    ],
    pyqCount: 28,
    pyqSample: "Explain the role of geographical factors in making Magadha the most powerful kingdom among the sixteen Mahajanapadas.",
  },
  {
    id: "maurya",
    period: "ancient",
    displayYear: "321 BCE",
    yearSort: -321,
    eraTitle: "Mauryan Imperial Zenith & Ashokan Dhamma",
    codename: "ANC-MAU-321",
    theme: "Centralized Bureaucracy, Arthashastra Statecraft & Moral Imperialism",
    causes: [
      "Overthrow of the Nandas by Chandragupta Maurya under the mentorship of Chanakya (Kautilya)",
      "Need to defend northwest frontier against Seleucid Greek succession following Alexander's invasion",
    ],
    keyEvents: [
      "Kautilya's Arthashastra codifying Saptanga theory of statecraft, espionage, and taxation",
      "Megasthenes arrives as Seleucid ambassador at Pataliputra, authoring 'Indica'",
      "Kalinga War (261 BCE) triggers Ashoka's remorse and adoption of 'Dhamma Vijaya' over 'Bheri Ghosha'",
      "Rock and Pillar Edicts inscribed in Brahmi, Kharosthi, Aramaic, and Greek across the subcontinent",
    ],
    consequences: [
      "First political unification of the entire Indian subcontinent from Afghanistan to Mysore",
      "Patronage of Third Buddhist Council and transmission of Buddhism to Sri Lanka and Southeast Asia",
    ],
    pyqCount: 32,
    pyqSample: "How did Ashoka's policy of Dhamma attempt to resolve the socio-religious tensions of a multi-ethnic empire?",
  },
  {
    id: "post-maurya",
    period: "ancient",
    displayYear: "185 BCE",
    yearSort: -185,
    eraTitle: "Post-Mauryan Synthesis, Silk Road & Sangam Age",
    codename: "ANC-PMR-185",
    theme: "Cross-Cultural Syncretism, Indo-Roman Maritime Trade & Early Southern Thalassocracy",
    causes: [
      "Decline of centralized Mauryan authority leading to regional kingdoms (Sungas, Kanvas, Satavahanas, Chedis)",
      "Invasions from Central Asia (Indo-Greeks, Scythians/Sakas, Parthians, Kushanas) connecting India to Silk Route",
    ],
    keyEvents: [
      "Kushana King Kanishka convenes Fourth Buddhist Council (Mahayana-Hinayana split) and patronizes Gandhara and Mathura Art",
      "Satavahanas in Deccan pioneer land grants (Brahmadeya), cave architecture (Karle, Ajanta), and lead-alloy coinage",
      "Sangam Age in Tamilakam: Cholas, Cheras, Pandyas flourishing with maritime ports (Muziris, Arikamedu) trading with Roman Empire",
    ],
    consequences: [
      "Flourishing of Mahayana Buddhist iconography and evolution of rock-cut Chaityas and Viharas",
      "Compilation of ancient Tamil literary masterworks (Silappadikaram, Manimekalai, Tirukkural)",
    ],
    pyqCount: 22,
    pyqSample: "Examine the significance of the Sangam literature as a source of socio-economic history of ancient South India.",
  },
  {
    id: "gupta",
    period: "ancient",
    displayYear: "320 CE",
    yearSort: 320,
    eraTitle: "The Classical Gupta Era (Golden Age)",
    codename: "ANC-GUP-320",
    theme: "Scientific Advancements, Classical Sanskrit Renaissance & Temple Architecture",
    causes: [
      "Political consolidation under Chandragupta I and Samudragupta's military expeditions (Digvijaya)",
      "Agrarian expansion through feudal land grants and gold coinage (Dinaras) circulation",
    ],
    keyEvents: [
      "Samudragupta's Prayag Prashasti (composed by Harishena) documenting conquests of Aryavarta and Dakshinapatha",
      "Chandragupta II Vikramaditya's court celebrated for Navaratnas, including Kalidasa (Abhijnanasakuntalam) and Amarasimha",
      "Scientific leaps: Aryabhata (Aryabhatiya - Zero, Earth's rotation, solar eclipses), Varahamihira (Brihat Samhita)",
      "Nagara temple architecture evolution (Dashavatara Temple, Deogarh) and peak Ajanta cave frescoes",
    ],
    consequences: [
      "Establishment of Nalanda Mahavihara as the premier international university of Asia",
      "Beginnings of Indian feudalism (Samanta system) and gradual decentralization",
    ],
    pyqCount: 30,
    pyqSample: "The Gupta period is often termed as the Golden Age of ancient Indian art and science. Critically evaluate.",
  },
  {
    id: "harsha",
    period: "ancient",
    displayYear: "606 CE",
    yearSort: 606,
    eraTitle: "Harsha Vardhana & Dawn of Early Medieval Regionalism",
    codename: "ANC-HAR-606",
    theme: "Last Pan-Northern Empire, Kannauj Assembly & Chinese Pilgrim Chronicles",
    causes: [
      "Collapse of Gupta power due to Huna invasions; rise of Pushyabhuti dynasty in Thanesar/Kannauj",
    ],
    keyEvents: [
      "Harsha unites northern India; authored Sanskrit plays (Ratnavali, Priyadarsika, Nagananda)",
      "Banabhatta composes 'Harshacharita'; Chinese monk Xuanzang visits and documents Indian socio-religious life",
      "Clash with Chalukya King Pulakeshin II on the Narmada River (Aihole Inscription records Pulakeshin's victory)",
      "Grand quinquennial Mahamoksha Parishad assembly at Prayag",
    ],
    consequences: [
      "Kannauj emerges as the prime symbol of imperial sovereignty, triggering the Medieval Tripartite Struggle",
      "Transition from classical imperial unity to localized regional kingdoms",
    ],
    pyqCount: 16,
    pyqSample: "Discuss the political and cultural significance of Harsha's reign as recorded by Xuanzang and Banabhatta.",
  },

  // ==========================================================================
  // MEDIEVAL INDIA (750 CE – 1757 CE)
  // ==========================================================================
  {
    id: "tripartite-chola",
    period: "medieval",
    displayYear: "750 CE",
    yearSort: 750,
    eraTitle: "Tripartite Struggle & Imperial Chola Thalassocracy",
    codename: "MED-CHO-750",
    theme: "Kannauj Dominance, Dravidian Monumental Temples & Southeast Asian Naval Expeditions",
    causes: [
      "Centuries-long conflict among Gurjara-Pratiharas, Palas of Bengal, and Rashtrakutas for control of Kannauj",
      "Agrarian revolution in the Kaveri Delta powering the militarization and maritime ambitions of the Imperial Cholas",
    ],
    keyEvents: [
      "Rajaraja I builds the monumental Brihadeeswara (Rajarajeswara) Temple at Thanjavur (1010 CE)",
      "Rajendra I assumes title 'Gangaikondachola' and launches naval expeditions against Srivijaya (Indonesia/Malaysia)",
      "Democratic local self-governance documented in the historic Uttaramerur Inscription (Kudavolai electoral system)",
      "Bronze casting zenith (Nataraja Cire Perdue lost-wax sculptures)",
    ],
    consequences: [
      "Spread of Indian cultural, religious, and architectural idioms across Southeast Asia (Angkor Wat, Borobudur)",
      "Institutionalization of temple-centric urban economies in South India",
    ],
    pyqCount: 27,
    pyqSample: "The Chola naval expeditions transformed the Bay of Bengal into a 'Chola Lake'. Discuss its geopolitical and commercial impact.",
  },
  {
    id: "delhi-sultanate-early",
    period: "medieval",
    displayYear: "1206 CE",
    yearSort: 1206,
    eraTitle: "Delhi Sultanate: Mamluk Consolidation & Khalji Imperialism",
    codename: "MED-SLT-1206",
    theme: "Iqta Administration, Market Control Reforms & Repelling Mongol Invasions",
    causes: [
      "Defeat of Prithviraj Chauhan by Muhammad Ghori at Second Battle of Tarain (1192 CE)",
      "Establishment of the Slave/Mamluk Dynasty by Qutb-ud-din Aibak in 1206 CE",
    ],
    keyEvents: [
      "Iltutmish introduces the Iqta land administrative system, organizes the Turkan-i-Chahalgani (Group of Forty), and issues silver Tanka and copper Jital",
      "Sultana Razia becomes the first and only woman ruler of the Delhi Sultanate",
      "Ghiyasuddin Balban enforces divine kingship (Niyabat-i-Khudai), Blood and Iron policy, and Court etiquette (Sijda & Paibos)",
      "Alauddin Khalji's military revolution: Dag (horse branding), Chehra (descriptive rolls), and strict Market Price Control Regulations",
      "Malik Kafur's southern Deccan military expeditions extracting tribute from Devagiri, Warangal, Dwarasamudra, and Madurai",
    ],
    consequences: [
      "Successful repulsion of massive Mongol invasions protecting Northern India from catastrophic sackings",
      "Agrarian centralization and introduction of Indo-Islamic architectural elements (arches, domes, minarets)",
    ],
    pyqCount: 25,
    pyqSample: "Critically evaluate the agrarian and market control measures introduced by Alauddin Khalji.",
  },
  {
    id: "tughlaq-fragmentation",
    period: "medieval",
    displayYear: "1325 CE",
    yearSort: 1325,
    eraTitle: "Tughlaq Administrative Experiments & Sultanate Decline",
    codename: "MED-TUG-1325",
    theme: "Currency Reforms, Public Works Engineering & Regional Secessions",
    causes: [
      "Over-extended territorial boundaries of the Sultanate causing administrative overreach",
      "Intellectual, eccentric governance under Muhammad bin Tughlaq and subsequent feudal compromises under Firoz Shah",
    ],
    keyEvents: [
      "Muhammad bin Tughlaq's five radical experiments: Doab tax hike, Capital transfer from Delhi to Daulatabad (Devagiri), Token brass/copper currency, Khorasan expedition, and Qarachil expedition",
      "Establishment of Diwan-i-Kohi (Ministry of Agriculture) and introduction of agricultural loans (Sondhar/Taccavi)",
      "Firoz Shah Tughlaq's hydraulic network of canals (Yamuna-Sutlej), founding of new cities (Hisar, Firozabad, Jaunpur), and creation of Diwan-i-Khairat & Diwan-i-Bandagan",
      "Devastating sack of Delhi by Turco-Mongol conqueror Timur (1398 CE), crippling Sultanate authority",
    ],
    consequences: [
      "Fragmentation of Delhi Sultanate giving birth to independent regional sultanates (Bengal, Gujarat, Malwa, Jaunpur)",
      "Rise of powerful southern kingdoms: Vijayanagara Empire and Bahmani Sultanate",
    ],
    pyqCount: 20,
    pyqSample: "Muhammad bin Tughlaq was a man ahead of his times. Analyze in the context of his administrative experiments.",
  },
  {
    id: "vijayanagara",
    period: "medieval",
    displayYear: "1336 CE",
    yearSort: 1336,
    eraTitle: "Vijayanagara Empire & Deccan Sultanate Rivalry",
    codename: "MED-VIJ-1336",
    theme: "Provida Architecture, Nayankara Feudal System & Maritime Horse Trade",
    causes: [
      "Need to defend southern Hindu culture and temple economies against northern Sultanate expansions",
      "Founded by brothers Harihara I and Bukka Raya I under the spiritual guidance of Sage Vidyaranya in the Tungabhadra basin",
    ],
    keyEvents: [
      "Golden Age under Krishnadevaraya (Tuluva Dynasty, 1509–1529 CE): authored 'Amuktamalyada' in Telugu and patronized Ashtadiggajas (Allasani Peddana, Tenali Rama)",
      "Monumental architectural synthesis: Raya Gopurams, Kalyana Mandapams with Yali pillars at Hampi (Virupaksha, Vittala Temple)",
      "Nayankara administrative system vesting military commanders (Nayakas) with land revenue and troop upkeep duties",
      "Battle of Talikota (Rakshasi-Tangadi, 1565 CE): Combined Deccan Sultanates (Bijapur, Golconda, Ahmednagar, Bidar) defeat and destroy Vijayanagara",
    ],
    consequences: [
      "Preservation and flourishing of classical South Indian literature, Carnatic music, and temple institutions",
      "European traveler accounts (Domingo Paes, Nicolo de Conti, Abdur Razzaq) establishing Hampi as one of the world's grandest metropolises",
    ],
    pyqCount: 29,
    pyqSample: "Explain how the Nayankara system and the architectural brilliance of Vijayanagara projected imperial authority in South India.",
  },
  {
    id: "bhakti-sufi",
    period: "medieval",
    displayYear: "1400 CE",
    yearSort: 1400,
    eraTitle: "Bhakti & Sufi Cultural Renaissance",
    codename: "MED-BHK-1400",
    theme: "Egalitarian Mysticism, Vernacular Literatures & Syncretic Ganga-Jamuni Tehzeeb",
    causes: [
      "Grassroots reaction against rigid orthodoxies of both Brahmanical ritualism and Islamic scholasticism (Ulema)",
      "Quest for direct personal communion with the Divine through emotional devotion (Bhakti) and mystical love (Ishq)",
    ],
    keyEvents: [
      "Nirguna Saints: Sant Kabir (Dohas, Bijak) challenging idol worship and caste; Guru Nanak Dev founding Sikhism on equality and Langar (community kitchen)",
      "Saguna Saints: Tulsidas (Ramcharitmanas in Awadhi), Surdas (Braj Bhasha), Mirabai (devotional pads to Krishna), and Chaitanya Mahaprabhu (Gaudiya Sankirtana in Bengal)",
      "Maharashtra Dharma: Sant Dnyaneshwar, Sant Tukaram's Abhangas, Sant Namdev; Assam: Srimanta Sankardeva's Ekasarana Dharma and Sattriya dance",
      "Sufi Silsilas: Chishti order (Khwaja Moinuddin Chishti, Baba Farid, Nizamuddin Auliya) promoting Sama (musical assemblies) and Khanqah philanthropy",
      "Amir Khusrau pioneers Hindavi/Urdu poetry, Qawwali, and invents the Sitar",
    ],
    consequences: [
      "Democratization of regional vernacular languages (Hindi, Marathi, Bengali, Punjabi, Gujarati, Assamese, Kannada)",
      "Laying the foundations of India's composite secular culture and inter-faith communal harmony",
    ],
    pyqCount: 31,
    pyqSample: "How did the Bhakti and Sufi movements contribute to the evolution of a composite Indian culture?",
  },
  {
    id: "mughal-foundation-akbar",
    period: "medieval",
    displayYear: "1526 CE",
    yearSort: 1526,
    eraTitle: "Mughal Foundation, Sher Shah & Akbar's Synthesis",
    codename: "MED-MUG-1526",
    theme: "Mansabdari System, Sulh-i-Kul & Imperial Bureaucracy",
    causes: [
      "Babur defeats Ibrahim Lodi at First Battle of Panipat (1526 CE) introducing field artillery and Tulghuma tactics",
      "Interregnum of Sher Shah Suri (1540–1545 CE) pioneering standard silver currency (Rupiya), Grand Trunk Road, and Zabti revenue system",
    ],
    keyEvents: [
      "Second Battle of Panipat (1556 CE): Akbar and Bairam Khan defeat Hemu, restoring Mughal power",
      "Administrative Innovations: Mansabdari System (Zat & Sawar ranks), Dahsala system (Raja Todar Mal) calculating ten-year average crop yields",
      "Religious Pluralism: Abolition of Jizya and Pilgrimage tax; establishment of Ibadat Khana (1575 CE) at Fatehpur Sikri",
      "Proclamation of Mahzar (1579 CE) and propagation of 'Sulh-i-Kul' (Universal Peace) and 'Din-i-Ilahi'",
      "Artistic Synthesis: Mughal Miniature Painting school under Mir Sayyid Ali and Abdus Samad; architectural fusion at Fatehpur Sikri (Buland Darwaza)",
    ],
    consequences: [
      "Unification of India into a single unified fiscal and administrative empire with a booming export economy (textiles, spices)",
      "Establishment of enduring Rajput alliances through matrimonial ties and high mansab appointments (Raja Man Singh)",
    ],
    pyqCount: 34,
    pyqSample: "Analyze the administrative machinery of the Mughal Empire under Akbar with special reference to the Mansabdari and Dahsala systems.",
  },
  {
    id: "mughal-zenith-aurangzeb",
    period: "medieval",
    displayYear: "1628 CE",
    yearSort: 1628,
    eraTitle: "Mughal Architectural Zenith to Aurangzeb's Crises",
    codename: "MED-ZEN-1628",
    theme: "Pietra Dura Architectural Climax, Deccan Ulcer & Agrarian Revolts",
    causes: [
      "Unprecedented imperial treasury surplus under Jahangir and Shah Jahan financing monumental architecture",
      "Succession War of 1658 CE resulting in Aurangzeb Alamgir seizing the throne and shifting toward religious orthodoxy",
    ],
    keyEvents: [
      "Shah Jahan builds the Taj Mahal, Red Fort (Delhi), Jama Masjid, and Peacock Throne; introduces Pietra Dura inlay art",
      "Aurangzeb reimposes Jizya (1679 CE), bans court music and historical chronicles, and moves court to Deccan for 25-year military campaigns",
      "Agrarian & Regional Rebellions: Jat rebellions (Gokula, Churaman), Satnami revolt, Bundela uprising, and Sikh resistance under Guru Gobind Singh (creation of the Khalsa 1699 CE)",
    ],
    consequences: [
      "'Deccan Ulcer' drained Mughal military resources and imperial finances, causing the Jagirdari crisis",
      "Rapid post-Aurangzeb disintegration of the empire, opening the door for Maratha hegemony and European colonizers",
    ],
    pyqCount: 26,
    pyqSample: "How far was Aurangzeb's Deccan policy responsible for the decline of the Mughal Empire?",
  },
  {
    id: "maratha-swarajya",
    period: "medieval",
    displayYear: "1674 CE",
    yearSort: 1674,
    eraTitle: "Rise of Maratha Swarajya & Peshwa Hegemony",
    codename: "MED-MAR-1674",
    theme: "Guerrilla Warfare (Ganimi Kava), Ashtapradhan & Pan-Indian Confederacy",
    causes: [
      "Chhatrapati Shivaji Maharaj mobilizing indigenous peasantry (Mavalas) against Bijapur Sultanate and Mughal dominance",
      "Strategic geographic advantage of the Western Ghats hill-fort network (Raigad, Pratapgad, Sinhagad)",
    ],
    keyEvents: [
      "Coronation of Shivaji at Raigad (1674 CE) as Chhatrapati; establishment of 'Hindavi Swarajya'",
      "Administrative system: Ashtapradhan council of ministers (Peshwa, Amatya, Senapati, etc.); collection of Chauth (1/4th) and Sardeshmukhi (1/10th)",
      "Peshwa Era: Balaji Vishwanath and Peshwa Baji Rao I expand Maratha flag from 'Attock to Cuttack'",
      "Third Battle of Panipat (14 Jan 1761): Ahmad Shah Abdali defeats Marathas, halting their immediate march to Delhi's throne",
    ],
    consequences: [
      "Transformation of Maratha state into a decentralized Confederacy (Scindia, Holkar, Gaekwad, Bhonsle)",
      "Created a political vacuum in 18th-century India that the British East India Company swiftly exploited",
    ],
    pyqCount: 23,
    pyqSample: "Discuss the military and administrative innovations introduced by Chhatrapati Shivaji Maharaj that sustained the Maratha Swarajya.",
  },

  // ==========================================================================
  // MODERN INDIA (1757 CE – 1947 CE)
  // ==========================================================================
  {
    id: "plassey",
    period: "modern",
    displayYear: "1757 CE",
    yearSort: 1757,
    eraTitle: "Battle of Plassey & British Colonial Foothold",
    codename: "MOD-PLA-1757",
    theme: "Commercial Company transformed into Territorial Landlord in Bengal",
    causes: [
      "Misuse of trade Dastaks by East India Company servants and unauthorized fortification of Fort William, Calcutta",
      "Siraj-ud-Daulah's siege of Calcutta and political intrigues involving Mir Jafar and Jagat Seth",
    ],
    keyEvents: [
      "Battle of Plassey (23 June 1757): Clive's tactical victory over Siraj-ud-Daulah through military treachery",
      "Mir Jafar installed as puppet Nawab; 24 Parganas zamindari ceded to the Company",
      "Battle of Buxar (1764) and Treaty of Allahabad (1765) granting Company the Diwani (revenue collecting) rights of Bengal, Bihar, and Orissa",
    ],
    consequences: [
      "Dual Government of Bengal (1765–1772) under Clive triggering severe drain of wealth and the Great Bengal Famine of 1770",
      "Transformation of British East India Company from trading merchants into sovereign territorial masters",
    ],
    pyqCount: 21,
    pyqSample: "The Battle of Plassey was won not by military valour, but by diplomatic conspiracy. Critically evaluate.",
  },
  {
    id: "revolt-1857",
    period: "modern",
    displayYear: "1857 CE",
    yearSort: 1857,
    eraTitle: "The Great Revolt of 1857",
    codename: "MOD-REV-1857",
    theme: "First Major Structural Armed Challenge to Colonial Dominance",
    causes: [
      "Dalhousie's aggressive Doctrine of Lapse (Satara, Jhansi, Nagpur, Sambalpur) and annexation of Awadh on grounds of misgovernance",
      "Ruin of Indian handicraft artisans, zamindars, and peasantry under exorbitant land revenue settlements",
      "Enfield rifle greased cartridge controversy violating religious taboos of Hindu and Muslim sepoys",
    ],
    keyEvents: [
      "Mangal Pandey's mutiny at Barrackpore (29 March 1857); Meerut outbreak (10 May 1857)",
      "Bahadur Shah Zafar proclaimed Shahenshah-e-Hindustan; epicenters led by Rani Lakshmibai (Jhansi), Nana Saheb & Tatya Tope (Kanpur), Kunwar Singh (Arrah), Begum Hazrat Mahal (Awadh)",
    ],
    consequences: [
      "Abolition of East India Company rule via Government of India Act 1858; Queen Victoria's Proclamation",
      "Reorganization of Indian Army on the 'Martial vs Non-Martial' divide-and-rule principle",
    ],
    pyqCount: 29,
    pyqSample: "The 1857 uprising was the culmination of recurrent big and small local rebellions against colonial encroachment. Elaborate.",
  },
  {
    id: "inc-1885",
    period: "modern",
    displayYear: "1885 CE",
    yearSort: 1885,
    eraTitle: "Genesis of National Consciousness & INC",
    codename: "MOD-INC-1885",
    theme: "Formation of Indian National Congress & Moderate Constitutional Agitation",
    causes: [
      "Growth of vernacular journalism, Western legal education, and reactionary policies of Lord Lytton (Vernacular Press Act 1878, Arms Act)",
      "Racist agitation against the Ilbert Bill (1883) uniting Indian intelligentsia",
    ],
    keyEvents: [
      "First Session of Indian National Congress held at Gokuldas Tejpal Sanskrit College, Bombay (Dec 1885) under W.C. Bonnerjee with 72 delegates",
      "Early Moderate Leadership: Dadabhai Naoroji, Gopal Krishna Gokhale, Pherozeshah Mehta, Dinshaw Wacha",
      "Formulation of the Economic Critique of British Imperialism (Naoroji's Poverty and Un-British Rule in India - Drain of Wealth Theory)",
    ],
    consequences: [
      "Instilled pan-Indian national consciousness and trained Indians in modern political agitation",
      "Led to constitutional concessions in the Indian Councils Act 1892",
    ],
    pyqCount: 22,
    pyqSample: "Discuss the economic critique of colonial rule formulated by early Indian nationalists.",
  },
  {
    id: "swadeshi-1905",
    period: "modern",
    displayYear: "1905 CE",
    yearSort: 1905,
    eraTitle: "Partition of Bengal & Swadeshi Movement",
    codename: "MOD-SWA-1905",
    theme: "Rise of Extremism, Swadeshi Boycott & Cultural Nationalism",
    causes: [
      "Lord Curzon's communal partition of Bengal (16 Oct 1905) designed to weaken the nerve-center of Indian nationalism",
    ],
    keyEvents: [
      "Swadeshi & Boycott proclamation at Calcutta Town Hall (7 Aug 1905); Raksha Bandhan observed as symbol of Hindu-Muslim fraternity",
      "Rise of Lal-Bal-Pal (Lala Lajpat Rai, Bal Gangadhar Tilak, Bipin Chandra Pal) and Aurobindo Ghosh advocating passive resistance and Swaraj",
      "National Education Council, opening of Bengal Chemicals (P.C. Ray), and patriotic songs (Vande Mataram, Rabindranath Tagore's Amar Shonar Bangla)",
      "Surat Split (1907) between Moderates and Extremists; British launch of Morley-Minto Reforms (1909) introducing Separate Electorates",
    ],
    consequences: [
      "First mass movement breaking the petitioning mold of the Moderates; direct precursor to Gandhian satyagraha",
      "Annulment of Bengal Partition in 1911; Capital shifted from Calcutta to Delhi",
    ],
    pyqCount: 26,
    pyqSample: "The Swadeshi Movement marks an important milestone in modern Indian mass mobilization. Explain.",
  },
  {
    id: "ncm-1919",
    period: "modern",
    displayYear: "1919 CE",
    yearSort: 1919,
    eraTitle: "Rowlatt Satyagraha, Khilafat & Non-Cooperation",
    codename: "MOD-NCM-1919",
    theme: "Gandhian Leadership, Mass Satyagraha & Hindu-Muslim Unity",
    causes: [
      "Post-WWI economic distress, Montagu-Chelmsford Reforms introducing limited dyarchy, and repressive Rowlatt Act ('No Dalil, No Vakil, No Appeal')",
      "Dismemberment of Ottoman Caliphate triggering the pan-Islamic Khilafat movement",
    ],
    keyEvents: [
      "Jallianwala Bagh Massacre (13 April 1919) under General Dyer in Amritsar; Rabindranath Tagore renounces Knighthood",
      "Non-Cooperation Movement launched (1 Aug 1920) merging with Khilafat: boycott of foreign cloth, courts, titles, and schools",
      "Chauri Chaura incident (4 Feb 1922): Violent police station burning prompts Gandhi to call off the movement to preserve non-violence",
    ],
    consequences: [
      "Transformed Indian National Congress into a genuine grassroots mass organization reaching rural peasants and workers",
      "Formation of Swaraj Party (C.R. Das, Motilal Nehru) to fight elections and obstruct colonial legislatures from within",
    ],
    pyqCount: 33,
    pyqSample: "Why did Mahatma Gandhi link the Khilafat Movement with the Non-Cooperation Movement? Assess its outcome.",
  },
  {
    id: "cdm-1930",
    period: "modern",
    displayYear: "1930 CE",
    yearSort: 1930,
    eraTitle: "Civil Disobedience Movement & Dandi March",
    codename: "MOD-CDM-1930",
    theme: "Purna Swaraj, Salt Tax Defiance & Round Table Conferences",
    causes: [
      "All-White Simon Commission boycott (1927), rejection of Nehru Report (1928), and Lahore Congress Purna Swaraj Declaration (1929)",
    ],
    keyEvents: [
      "Historic Dandi March (12 March – 6 April 1930): Gandhi walks 240 miles from Sabarmati to Dandi to break the British Salt Law",
      "Pan-Indian defiance: Salt raids at Dharasana (Sarojini Naidu), Khan Abdul Ghaffar Khan's Khudai Khidmatgars in NWFP, C. Rajagopalachari in Vedaranyam",
      "Gandhi-Irwin Pact (1931) and Gandhi attending the Second Round Table Conference in London",
      "Poona Pact (1932) between Dr. B.R. Ambedkar and Mahatma Gandhi reserving seats for Depressed Classes within general electorates",
    ],
    consequences: [
      "Brought British administration to a standstill, forcing them to negotiate on equal terms",
      "Resulted in the comprehensive constitutional blueprint of the Government of India Act 1935",
    ],
    pyqCount: 30,
    pyqSample: "Analyze the significance of the Salt Satyagraha as a turning point in India's struggle for freedom.",
  },
  {
    id: "quit-india-1942",
    period: "modern",
    displayYear: "1942 CE",
    yearSort: 1942,
    eraTitle: "Quit India Movement & Azad Hind Fauj (INA)",
    codename: "MOD-QIM-1942",
    theme: "'Do or Die' Mass Uprising & Netaji's Armed Liberation",
    causes: [
      "Failure of Sir Stafford Cripps Mission (1942) offering only vague post-war Dominion Status",
      "Threat of imminent Japanese invasion of India during World War II and rampant wartime inflation",
    ],
    keyEvents: [
      "All India Congress Committee passes Quit India Resolution at Gowalia Tank, Bombay (8 Aug 1942); Gandhi gives call 'Do or Die' (Karo ya Maro)",
      "Immediate midnight arrest of all top Congress leaders; spontaneous leaderless mass uprising across India",
      "Parallel Governments (Jatiya Sarkar in Tamluk, Prati Sarkar in Satara by Nana Patil, Ballia by Chittu Pandey)",
      "Underground network: Aruna Asaf Ali hoisting tricolor, Usha Mehta operating secret Congress Radio",
      "Netaji Subhas Chandra Bose revives Indian National Army (INA) in Southeast Asia: 'Give me blood, and I will give you freedom!'",
    ],
    consequences: [
      "Demonstrated that British rule could no longer hold India by coercion; INA Red Fort trials (1945) triggered Royal Indian Navy (RIN) Mutiny (1946)",
    ],
    pyqCount: 36,
    pyqSample: "The Quit India Movement was spontaneous, militant, and leaderless. Critically analyze.",
  },
  {
    id: "independence-1947",
    period: "modern",
    displayYear: "1947 CE",
    yearSort: 1947,
    eraTitle: "Cabinet Mission, Independence, Partition & Integration",
    codename: "MOD-IND-1947",
    theme: "Transfer of Power, Tragic Partition & National Integration of Princely States",
    causes: [
      "Post-WWII British economic exhaustion, RIN Mutiny, and intense political deadlock between Congress and Muslim League",
    ],
    keyEvents: [
      "Cabinet Mission Plan (1946) rejecting Pakistan demand and proposing three-tier federation; Direct Action Day (16 Aug 1946)",
      "Formation of Interim Government under Jawaharlal Nehru; Constituent Assembly begins work on 9 Dec 1946 under Dr. Rajendra Prasad",
      "Mountbatten Plan (3 June 1947) advancing transfer of power date; Indian Independence Act 1947",
      "Sardar Vallabhbhai Patel and V.P. Menon orchestrating the accession and integration of 565 Princely States (Junagadh, Hyderabad, Kashmir)",
    ],
    consequences: [
      "Birth of the Sovereign Democratic Republic of India (15 August 1947) amidst tragic communal partition migrations",
      "Adoption of the Constitution of India drafted by Dr. B.R. Ambedkar's Drafting Committee (26 Nov 1949)",
    ],
    pyqCount: 38,
    pyqSample: "Evaluate the role of Sardar Patel and the State Department in the integration of princely states into the Indian Union.",
  },
];

export default function HistoryTimeTunnel() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<HistoryPeriod>("all");
  const [activeEraIndex, setActiveEraIndex] = useState<number>(0);
  const [warpSpeed, setWarpSpeed] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const filteredTimeline = useMemo(() => {
    if (selectedPeriod === "all") return ALL_HISTORY_TIMELINE;
    return ALL_HISTORY_TIMELINE.filter((era) => era.period === selectedPeriod);
  }, [selectedPeriod]);

  // Ensure active index is within bounds when period changes
  useEffect(() => {
    setActiveEraIndex(0);
  }, [selectedPeriod]);

  const currentEra = filteredTimeline[activeEraIndex] || filteredTimeline[0];
  const currentEraRef = useRef<HistoryEra>(currentEra);
  currentEraRef.current = currentEra;

  // 3D Canvas Time Tunnel Wormhole Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    let tunnelTime = 0;

    // Particle Stars
    const particles = Array.from({ length: 90 }, () => ({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800,
      z: Math.random() * 1000,
      size: Math.random() * 2 + 0.5,
    }));

    const render = () => {
      ctx.fillStyle = "#040406";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      tunnelTime += 0.015 * warpSpeed;

      // Color Theme by Active Era
      const isAncient = currentEraRef.current?.period === "ancient";
      const isMedieval = currentEraRef.current?.period === "medieval";
      
      const primaryRgb = isAncient
        ? "245, 158, 11" // Amber
        : isMedieval
        ? "16, 185, 129" // Emerald
        : "255, 27, 27"; // Crimson Red

      // 3D Starfield Warp
      particles.forEach((p) => {
        p.z -= 4 * warpSpeed;
        if (p.z <= 0) {
          p.z = 1000;
          p.x = (Math.random() - 0.5) * 800;
          p.y = (Math.random() - 0.5) * 800;
        }

        const k = 350 / p.z;
        const px = p.x * k + centerX;
        const py = p.y * k + centerY;
        const pSize = Math.max(0.5, (1 - p.z / 1000) * 3);

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = (1 - p.z / 1000) * 0.8;
          ctx.fillStyle = `rgba(${primaryRgb}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 3D Concentric Tunnel Rings
      const ringCount = 14;
      for (let i = 0; i < ringCount; i++) {
        const progress = ((i + tunnelTime) % ringCount) / ringCount;
        const radius = Math.pow(progress, 2.4) * (width * 0.65);
        const alpha = Math.min(1, progress * 1.6);

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${primaryRgb}, ${alpha * 0.35})`;
        ctx.lineWidth = 1 + progress * 2.5;
        ctx.stroke();

        // Warp Ray Radial Lines
        if (i % 2 === 0) {
          const rayAngle = (i * Math.PI) / 4 + tunnelTime * 0.3;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(
            centerX + Math.cos(rayAngle) * (width * 0.8),
            centerY + Math.sin(rayAngle) * (height * 0.8)
          );
          ctx.strokeStyle = `rgba(${primaryRgb}, ${alpha * 0.12})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Center Singularity Vortex Glow
      const centerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 140);
      centerGlow.addColorStop(0, `rgba(${primaryRgb}, 0.5)`);
      centerGlow.addColorStop(0.4, `rgba(${primaryRgb}, 0.15)`);
      centerGlow.addColorStop(1, "rgba(4, 4, 6, 0)");
      ctx.fillStyle = centerGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 140, 0, Math.PI * 2);
      ctx.fill();

      // Holographic HUD Badge on Center
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 28px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = `rgb(${primaryRgb})`;
      ctx.shadowBlur = 18;
      ctx.fillText(currentEraRef.current?.displayYear || "ERA", centerX, centerY - 14);

      ctx.fillStyle = `rgba(${primaryRgb}, 0.95)`;
      ctx.font = "700 11px monospace";
      ctx.fillText(
        `[ ${currentEraRef.current?.codename || "CHRONO-NODE"} ]`,
        centerX,
        centerY + 18
      );
      ctx.restore();

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [warpSpeed]);

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS & PERIOD SELECTOR TABS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
            <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
              3D Historical Time Tunnel
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-0.5">
            Interactive Chronological Deep-Dive from Harappan Civilisation (2500 BCE) to Independence (1947 CE)
          </p>
        </div>

        {/* PERIOD SELECTOR TABS */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-black/60 p-1 border border-white/10">
          {(
            [
              { id: "all", label: "All History", color: "text-white" },
              { id: "ancient", label: "Ancient India (2500 BCE-750 CE)", color: "text-amber-300" },
              { id: "medieval", label: "Medieval India (750-1757 CE)", color: "text-emerald-300" },
              { id: "modern", label: "Modern India (1757-1947 CE)", color: "text-red-400" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedPeriod(tab.id);
                sound.playClick();
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                selectedPeriod === tab.id
                  ? "bg-white/20 text-white shadow-md"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              } ${tab.color}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D TIME TUNNEL CANVAS & DEEP DIVE CONTAINER */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* 3D TIME TUNNEL VISUALIZER (7 COLS) */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl lg:col-span-7 h-[460px]">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing" />

          {/* TOP HUD BAR */}
          <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                {currentEra.period.toUpperCase()} CHRONOLOGY
              </span>
              <span className="text-[11px] font-bold text-white/60">
                Node {activeEraIndex + 1} of {filteredTimeline.length}
              </span>
            </div>

            {/* WARP SPEED CONTROLLER */}
            <div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 border border-white/10">
              <span className="text-[10px] font-bold text-white/50">Warp:</span>
              {[1, 2, 3].map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    setWarpSpeed(spd);
                    sound.playClick();
                  }}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition ${
                    warpSpeed === spd ? "bg-red-600 text-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* BOTTOM TIMELINE CONTROLS */}
          <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
            <button
              onClick={() => {
                setActiveEraIndex((prev) => (prev > 0 ? prev - 1 : filteredTimeline.length - 1));
                sound.playClick();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20 active:scale-95"
            >
              <span>◀</span>
              <span>Past Era</span>
            </button>

            {/* ERA HORIZONTAL SCRUBBER */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-[280px] px-2 py-1 scrollbar-none">
              {filteredTimeline.map((era, index) => (
                <button
                  key={era.id}
                  onClick={() => {
                    setActiveEraIndex(index);
                    sound.playClick();
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === activeEraIndex
                      ? "w-6 bg-red-500 shadow-[0_0_8px_#ff1b1b]"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  title={`${era.displayYear} - ${era.eraTitle}`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                setActiveEraIndex((prev) => (prev < filteredTimeline.length - 1 ? prev + 1 : 0));
                sound.playClick();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-500 active:scale-95 shadow-[0_0_15px_rgba(255,27,27,0.4)]"
            >
              <span>Next Era</span>
              <span>▶</span>
            </button>
          </div>
        </div>

        {/* ERA DEEP DIVE ANALYTICAL HUD (5 COLS) */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl lg:col-span-5 space-y-4">
          <div>
            {/* ERA TITLE & THEME */}
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${
                  currentEra.period === "ancient"
                    ? "text-amber-400"
                    : currentEra.period === "medieval"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}>
                  {currentEra.displayYear} • {currentEra.period.toUpperCase()} INDIA
                </span>
                <h3 className="mt-0.5 text-lg font-black text-white leading-tight">
                  {currentEra.eraTitle}
                </h3>
              </div>
              <span className="shrink-0 rounded-xl bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-bold text-purple-300">
                {currentEra.pyqCount} Mains/Pre PYQs
              </span>
            </div>

            {/* THEME SUMMARY */}
            <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
                Historical Theme
              </span>
              <p className="text-xs font-semibold text-white/90 mt-0.5">{currentEra.theme}</p>
            </div>

            {/* CAUSES & CATALYSTS */}
            <div className="mt-3 space-y-1.5">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                ⚡ Catalysts & Root Causes:
              </span>
              <ul className="space-y-1 text-xs text-white/80">
                {currentEra.causes.map((c, i) => (
                  <li key={`cause-${i}`} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* KEY EVENTS & TURNING POINTS */}
            <div className="mt-3 space-y-1.5">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                🏛️ Turning Points & High-Yield Events:
              </span>
              <ul className="space-y-1 text-xs text-white/80">
                {currentEra.keyEvents.map((ev, i) => (
                  <li key={`ev-${i}`} className="flex items-start gap-1.5">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* STRUCTURAL CONSEQUENCES */}
            <div className="mt-3 space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                📈 Historical Impact & Consequences:
              </span>
              <ul className="space-y-1 text-xs text-white/80">
                {currentEra.consequences.map((cq, i) => (
                  <li key={`cq-${i}`} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{cq}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SAMPLE UPSC PYQ & DRILL LAUNCH */}
          <div className="border-t border-white/10 pt-3 space-y-2">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
              <span className="text-[10px] font-black uppercase text-red-400 block mb-0.5">
                🎯 Sample UPSC Question
              </span>
              <p className="text-xs italic text-white/80 leading-snug">"{currentEra.pyqSample}"</p>
            </div>

            <button
              onClick={() => {
                sound.playVictory();
                router.push(`/pyqs?search=${encodeURIComponent(currentEra.eraTitle.split(" ")[0])}`);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 py-2.5 text-xs font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95"
            >
              <span>Practice {currentEra.pyqCount} PYQs for this Era</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
