"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { sound } from "@/lib/audio/sound-engine";

type GISLayer = "rivers" | "passes" | "archaeology" | "protected";

interface MapFeature {
  id: string;
  name: string;
  category: GISLayer;
  subCategory?: string;
  stateOrRegion: string;
  coordinates: { x: number; y: number }; // Normalized canvas coords (0 to 600)
  keyDetails: string[];
  pyqHook: string;
  tributaryInfo?: {
    leftBank: string[];
    rightBank: string[];
    originAndEnd: string;
  };
}

const GIS_FEATURE_DATASET: MapFeature[] = [
  // --------------------------------------------------------------------------
  // 1. RIVERS & DETAILED TRIBUTARY SYSTEMS
  // --------------------------------------------------------------------------
  {
    id: "riv-ganga",
    name: "Ganga River Basin",
    category: "rivers",
    stateOrRegion: "Uttarakhand, UP, Bihar, WB",
    coordinates: { x: 330, y: 220 },
    tributaryInfo: {
      originAndEnd: "Origin: Gangotri Glacier (Gaumukh) as Bhagirathi. Meets Alaknanda at Devprayag to form Ganga. Outflow into Bay of Bengal (Sundarbans).",
      leftBank: ["Ramganga", "Gomti (originates at Gomat Taal, Pilibhit)", "Ghaghara (Karnali)", "Gandak", "Kosi (Sorrow of Bihar)", "Mahananda"],
      rightBank: ["Yamuna (Bandarpunch, joins at Prayagraj)", "Son (originates at Amarkantak plateau)", "Punpun", "Damodar (via Hugli)"]
    },
    keyDetails: [
      "Total length: 2,525 km (India's longest river basin covering 26% of landmass).",
      "Panch Prayags: Vishnuprayag (Alaknanda + Dhauliganga), Nandaprayag (Alaknanda + Nandakini), Karnaprayag (Alaknanda + Pindar), Rudraprayag (Alaknanda + Mandakini), Devprayag (Alaknanda + Bhagirathi)."
    ],
    pyqHook: "UPSC Prelims 2021 & 2019: Direct questions on Panch Prayag confluences and left-to-right tributary arrangement (Gandak, Kosi, Mahananda)."
  },
  {
    id: "riv-indus",
    name: "Indus River System (Sindhu)",
    category: "rivers",
    stateOrRegion: "Ladakh, J&K, Pakistan",
    coordinates: { x: 190, y: 110 },
    tributaryInfo: {
      originAndEnd: "Origin: Bokhar Chu glacier near Lake Mansarovar in Tibet (Singi Khamban/Lion's Mouth). Enters Ladakh between Ladakh and Zanskar ranges. Outflow into Arabian Sea near Karachi.",
      leftBank: ["Zanskar", "Jhelum (Verinag)", "Chenab (Chandra + Bhaga at Tandi)", "Ravi (Kullu hills)", "Beas (Rohtang Pass)", "Sutlej (Rakas Lake Tibet)"],
      rightBank: ["Shyok (River of Death)", "Gilgit", "Hunza", "Nubra", "Swat", "Kabul", "Kurram", "Gomal"]
    },
    keyDetails: [
      "Indus Water Treaty (1960) mediated by World Bank: India has unrestricted rights over Eastern rivers (Ravi, Beas, Sutlej; ~33 MAF), while Pakistan gets Western rivers (Indus, Jhelum, Chenab; ~135 MAF).",
      "Chenab is the largest tributary of Indus in terms of water discharge."
    ],
    pyqHook: "UPSC Prelims 2021: Which river flows directly into the Indus without joining the other four? (Sutlej directly joins Indus at Mithankot after Panjnad confluence)."
  },
  {
    id: "riv-brahmaputra",
    name: "Brahmaputra River System (Yarlung Tsangpo)",
    category: "rivers",
    stateOrRegion: "Tibet, Arunachal Pradesh, Assam, Bangladesh",
    coordinates: { x: 500, y: 190 },
    tributaryInfo: {
      originAndEnd: "Origin: Chemayungdung glacier near Mansarovar in Tibet. Takes a sharp U-turn (syntaxial bend) around Namcha Barwa through Great Himalayan Gorge (Dihang). Joins Padma in Bangladesh to form Meghna.",
      leftBank: ["Dibang / Sikang", "Lohit (originates in Zayal Chu, Eastern Tibet)", "Burhi Dihing", "Dhansiri (South)", "Kolong"],
      rightBank: ["Subansiri (Gold River)", "Kameng / Jia Bhoreli", "Manas", "Sankosh (Bhutan border)", "Teesta (Cholamu Lake Sikkim)"]
    },
    keyDetails: [
      "Houses Majuli Island in Assam — the world's largest riverine island.",
      "Braided river channel prone to massive annual flooding and siltation due to torrential monsoon rainfall."
    ],
    pyqHook: "UPSC Prelims 2016 & 2014: Which of the following are tributaries of Brahmaputra? (Dibang, Kameng, Lohit)."
  },
  {
    id: "riv-godavari",
    name: "Godavari River (Dakshin Ganga)",
    category: "rivers",
    stateOrRegion: "Maharashtra, Telangana, Andhra Pradesh, Chhattisgarh, Odisha",
    coordinates: { x: 280, y: 360 },
    tributaryInfo: {
      originAndEnd: "Origin: Trimbakeshwar in Western Ghats (Nashik, Maharashtra). Second largest river basin in India (10% of total geographical area). Outflow into Bay of Bengal at Rajahmundry.",
      leftBank: ["Dharshi", "Penganga", "Wardha", "Wainganga (confluence forms Pranahita)", "Indravati (Bastar, Chitrakote falls)", "Sabari (Machkund/Kolab)"],
      rightBank: ["Pravara", "Mula", "Manjra (originates in Balaghat range)", "Maner", "Kinnerasani"]
    },
    keyDetails: [
      "Pranahita (combined Penganga + Wardha + Wainganga) is Godavari's largest tributary, conveying 34% of its discharge.",
      "Coringa mangrove ecosystem located at Godavari estuary (second largest mangrove formation in India)."
    ],
    pyqHook: "UPSC Prelims 2015 & 2017: Left-bank tributaries of Godavari (Indravati, Pranahita, Sabari)."
  },
  {
    id: "riv-krishna",
    name: "Krishna River Basin",
    category: "rivers",
    stateOrRegion: "Maharashtra, Karnataka, Telangana, Andhra Pradesh",
    coordinates: { x: 270, y: 430 },
    tributaryInfo: {
      originAndEnd: "Origin: Mahabaleshwar (Western Ghats, Maharashtra). Second largest east-flowing peninsular river. Outflow into Bay of Bengal near Vijayawada (Hamsaladeevi).",
      leftBank: ["Bhima (originates at Bhimashankar)", "Dindi", "Musi (Hyderabad city on its banks)", "Paleru", "Munneru"],
      rightBank: ["Koyna (Shivaji Sagar reservoir)", "Venna", "Panchganga (Kolhapur)", "Dudhganga", "Ghataprabha", "Malaprabha", "Tungabhadra (Tunga + Bhadra at Koodli)"]
    },
    keyDetails: [
      "Tungabhadra is the major right-bank tributary, originating in Gangamoola (Varaha Parvat).",
      "Major dams: Almatti, Srisailam, Nagarjuna Sagar, Prakasam Barrage."
    ],
    pyqHook: "UPSC Prelims 2019: Identify the tributaries of Krishna (Koyna, Malaprabha, Ghataprabha, Tungabhadra, Bhima)."
  },
  {
    id: "riv-cauvery",
    name: "Cauvery River (Kaveri / Ponni)",
    category: "rivers",
    stateOrRegion: "Karnataka, Tamil Nadu, Kerala, Puducherry",
    coordinates: { x: 260, y: 510 },
    tributaryInfo: {
      originAndEnd: "Origin: Talakaveri in Brahmagiri range (Kodagu, Karnataka). Flows through a perennial regime because upper catchment receives Southwest monsoon and lower catchment receives Northeast monsoon. Outflow into Bay of Bengal at Poompuhar.",
      leftBank: ["Harangi", "Hemavati", "Shimsha", "Arkavathi (near Bengaluru)"],
      rightBank: ["Lakshmantirtha", "Kabbani (originates in Wayanad)", "Suvarnavathi", "Bhavani (originates in Silent Valley/Nilgiris)", "Noyyal", "Amaravathi"]
    },
    keyDetails: [
      "Perennial character makes it the most intensely utilized peninsular river (95% water utilized).",
      "Forms riverine islands: Srirangapatna, Shivanasamudra (Gaganachukki and Bharachukki falls), and Srirangam."
    ],
    pyqHook: "UPSC Prelims 2020 & 2014: Identify the tributaries of Cauvery (Kabbani, Bhavani, Amaravathi, Hemavati)."
  },
  {
    id: "riv-narmada-tapti",
    name: "Narmada & Tapti (Rift Valley Rivers)",
    category: "rivers",
    stateOrRegion: "Madhya Pradesh, Maharashtra, Gujarat",
    coordinates: { x: 220, y: 300 },
    tributaryInfo: {
      originAndEnd: "Narmada Origin: Amarkantak Plateau (MP). Flows west through a structural fault (rift valley) between Vindhya range (North) and Satpura range (South). Outflow into Gulf of Khambhat. Tapti Origin: Multai in Betul district (MP) south of Satpura.",
      leftBank: ["Narmada: Sher, Shakkar, Dudhi, Tawa, Ganjal", "Tapti: Purna, Girna, Panjhra, Bori"],
      rightBank: ["Narmada: Hiran, Orsang, Barna, Kolar", "Tapti: Vaki, Gomai, Arunavati"]
    },
    keyDetails: [
      "West-flowing rivers forming estuaries instead of deltas due to steep gradient and hard rocky rift beds.",
      "Marble Rocks gorge and Dhuandhar waterfalls near Jabalpur on Narmada."
    ],
    pyqHook: "UPSC Prelims 2013 & 2007: Why does Narmada flow westwards? (Flows through a linear rift valley formed by faulting)."
  },

  // --------------------------------------------------------------------------
  // 2. STRATEGIC MOUNTAIN PASSES
  // --------------------------------------------------------------------------
  {
    id: "pass-zojila",
    name: "Zoji La Pass (Elevation: 3,528 m)",
    category: "passes",
    stateOrRegion: "Ladakh / Jammu & Kashmir",
    coordinates: { x: 205, y: 80 },
    keyDetails: [
      "Connects Srinagar with Kargil and Leh in Ladakh across the Great Himalayan Range.",
      "NH-1 passes through here; Zoji La All-Weather Bi-directional Tunnel (14.2 km) is Asia's longest bi-directional tunnel."
    ],
    pyqHook: "UPSC Prelims 2017: Which pass connects Srinagar to Leh? (Zoji La)."
  },
  {
    id: "pass-shipkila",
    name: "Shipki La Pass (Elevation: 3,930 m)",
    category: "passes",
    stateOrRegion: "Kinnaur, Himachal Pradesh (Indo-China Border)",
    coordinates: { x: 240, y: 130 },
    keyDetails: [
      "Located in Kinnaur district along the Sutlej gorge.",
      "The river Sutlej enters India from Tibet through this exact pass."
    ],
    pyqHook: "UPSC Prelims 2015: Through which pass does the Sutlej river enter India from Tibet? (Shipki La)."
  },
  {
    id: "pass-lipulekh",
    name: "Lipulekh Pass (Elevation: 5,200 m)",
    category: "passes",
    stateOrRegion: "Pithoragarh, Uttarakhand (India-Nepal-China Tri-junction)",
    coordinates: { x: 290, y: 170 },
    keyDetails: [
      "Crucial pass for the annual Kailash Mansarovar Yatra pilgrimage.",
      "Located near Kalapani trijunction territory bordering Nepal."
    ],
    pyqHook: "UPSC Prelims 2020: Strategic passes in news for border infrastructure (Lipulekh-Dharchula road link)."
  },
  {
    id: "pass-nathula",
    name: "Nathu La & Jelep La Passes",
    category: "passes",
    stateOrRegion: "East Sikkim (Indo-China Border)",
    coordinates: { x: 420, y: 200 },
    keyDetails: [
      "Nathu La (4,310 m) connects Sikkim with Tibet's Chumbi Valley; reopened for border trade in 2006 (historic Silk Road offshoot).",
      "Jelep La connects Lhasa to India via Chumbi Valley, carved by Teesta River."
    ],
    pyqHook: "UPSC Prelims 2018: Passes providing access to Chumbi Valley in Tibet (Nathu La and Jelep La)."
  },
  {
    id: "pass-bomdila",
    name: "Bomdi La & Diphu Passes",
    category: "passes",
    stateOrRegion: "Arunachal Pradesh",
    coordinates: { x: 485, y: 165 },
    keyDetails: [
      "Bomdi La connects Western Arunachal (Tawang) with Lhasa in Tibet.",
      "Diphu Pass is located at the India-Myanmar-China trijunction in Arunachal Pradesh."
    ],
    pyqHook: "UPSC Prelims 2016: Location of passes in Eastern Himalayas connecting Tawang with Tibet."
  },
  {
    id: "pass-palghat",
    name: "Palghat Gap (Palakkad Gap)",
    category: "passes",
    stateOrRegion: "Kerala - Tamil Nadu Border (Western Ghats)",
    coordinates: { x: 250, y: 530 },
    keyDetails: [
      "A prominent 32-km wide break/gap in the continuous Western Ghats chain.",
      "Separates the Nilgiri Hills (North) from the Anamalai Hills and Palani Hills (South).",
      "Connects Palakkad (Kerala) with Coimbatore (Tamil Nadu); channels southwest monsoon winds into interior Tamil Nadu."
    ],
    pyqHook: "UPSC Prelims 2013: Geographic break separating Nilgiri and Anamalai ranges (Palghat Gap)."
  },
  {
    id: "pass-bhorghat-thalghat",
    name: "Thal Ghat & Bhor Ghat Passes",
    category: "passes",
    stateOrRegion: "Maharashtra (Sahyadri Western Ghats)",
    coordinates: { x: 215, y: 360 },
    keyDetails: [
      "Thal Ghat (Kasara Ghat): Connects Mumbai to Nashik and onward to North India (NH-3 / Mumbai-Kolkata rail line).",
      "Bhor Ghat: Connects Mumbai to Pune and onward to South India (Mumbai-Pune Expressway / NH-4)."
    ],
    pyqHook: "UPSC Prelims 2011: North-to-South arrangement of Western Ghats passes (Thal Ghat -> Bhor Ghat -> Palghat -> Shencottah Gap)."
  },

  // --------------------------------------------------------------------------
  // 3. ARCHAEOLOGICAL & INDUS VALLEY SITES
  // --------------------------------------------------------------------------
  {
    id: "arch-dholavira",
    name: "Dholavira (Khadir Bet, Kutch)",
    category: "archaeology",
    stateOrRegion: "Gujarat (UNESCO World Heritage Site 2021)",
    coordinates: { x: 180, y: 260 },
    keyDetails: [
      "Unique 3-tier city division: Citadel, Middle Town, and Lower Town surrounded by massive stone fortifications (unlike brick in other IVC sites).",
      "Mastery of hydraulic engineering: Series of 16 monumental water harvesting reservoirs and stone-cut storm water drains.",
      "10-character giant Harappan Inscription Signboard found at northern gate."
    ],
    pyqHook: "UPSC Prelims 2021: Which Harappan city is famous for its elaborate water harvesting reservoir system? (Dholavira)."
  },
  {
    id: "arch-rakhigarhi",
    name: "Rakhigarhi (Hisar District)",
    category: "archaeology",
    stateOrRegion: "Haryana (Ghaggar-Hakra River Basin)",
    coordinates: { x: 245, y: 170 },
    keyDetails: [
      "Largest Indus Valley Civilization site in the Indian subcontinent (>350 hectares, larger than Mohenjo-Daro).",
      "Excavations revealed mud-brick granaries, lapidary bead workshops, terracotta seals, and ancient skeletal DNA studies proving indigenous South Asian continuity without Steppe pastoralist ancestry in early IVC."
    ],
    pyqHook: "UPSC Prelims 2020: Largest Harappan site discovered in India (Rakhigarhi)."
  },
  {
    id: "arch-lothal",
    name: "Lothal (Bhogavo River Basin)",
    category: "archaeology",
    stateOrRegion: "Gulf of Khambhat, Gujarat",
    coordinates: { x: 195, y: 290 },
    keyDetails: [
      "World's oldest artificial tidal dockyard connected to the Bhogavo River, enabling maritime trade with Mesopotamia (Dilmun/Magan).",
      "Micro-bead manufacturing factory, joint/double burials, ivory scale for measurement, and Persian Gulf button seal."
    ],
    pyqHook: "UPSC Prelims 2019 & 2012: The only Indus Valley site with an artificial brick dockyard (Lothal)."
  },
  {
    id: "arch-kalibangan",
    name: "Kalibangan (Black Bangles)",
    category: "archaeology",
    stateOrRegion: "Hanumangarh, Rajasthan (Ghaggar River)",
    coordinates: { x: 215, y: 190 },
    keyDetails: [
      "World's earliest recorded ploughed agricultural field surface with furrow patterns for mixed cropping (mustard and gram).",
      "Row of 7 fire altars (Yajna Kundas) indicative of proto-religious sacrificial rituals; camel bones and wooden furrow marks."
    ],
    pyqHook: "UPSC Prelims 2017: Evidence of ploughed agricultural field discovered at (Kalibangan)."
  },
  {
    id: "arch-banawali",
    name: "Banawali",
    category: "archaeology",
    stateOrRegion: "Fatehabad, Haryana",
    coordinates: { x: 235, y: 165 },
    keyDetails: [
      "Discovery of a complete terracotta clay model of a plough (Hal).",
      "High proportion of good quality two-row barley seeds; radial street planning rather than standard orthogonal grid."
    ],
    pyqHook: "UPSC Prelims 2016: Clay model of a plough was discovered at which site? (Banawali)."
  },
  {
    id: "arch-inamgaon",
    name: "Inamgaon (Ghod River)",
    category: "archaeology",
    stateOrRegion: "Maharashtra (Chalcolithic Jorwe Culture)",
    coordinates: { x: 240, y: 400 },
    keyDetails: [
      "Post-Harappan Chalcolithic settlement (1400–700 BCE) showing transitioned mud houses, storage silos, and potter's kilns.",
      "Adults buried in extended position head pointing North in floor pits; multi-roomed chief's house with granary."
    ],
    pyqHook: "UPSC Prelims 2015: Chalcolithic burial patterns and farming settlements in Deccan."
  },

  // --------------------------------------------------------------------------
  // 4. PROTECTED BIOSPHERE RESERVES & RAMSAR SITES
  // --------------------------------------------------------------------------
  {
    id: "prot-nilgiri",
    name: "Nilgiri Biosphere Reserve (First in India, 1986)",
    category: "protected",
    stateOrRegion: "Tamil Nadu, Kerala, Karnataka",
    coordinates: { x: 245, y: 505 },
    keyDetails: [
      "Includes Silent Valley NP, Bandipur NP, Nagarhole NP, Mudumalai Wildlife Sanctuary, Wayanad WLS, and Mukurthi NP.",
      "Endemic Fauna: Largest population of Lion-tailed Macaque and Nilgiri Tahr; Shola grassland-forest mosaic."
    ],
    pyqHook: "UPSC Prelims 2021 & 2017: Which national parks are contiguous and part of Nilgiri Biosphere? (Silent Valley, Mudumalai, Wayanad, Bandipur)."
  },
  {
    id: "prot-agasthyamalai",
    name: "Agasthyamalai Biosphere Reserve",
    category: "protected",
    stateOrRegion: "Kerala & Tamil Nadu (Southern Western Ghats)",
    coordinates: { x: 255, y: 560 },
    keyDetails: [
      "Encompasses Neyyar, Peppara, and Shendurney Wildlife Sanctuaries (Kerala) and Kalakkad Mundanthurai Tiger Reserve (TN).",
      "Homeland of the indigenous Kanikaran tribal community who hold traditional botanical knowledge of medicinal flora (Arogyapacha)."
    ],
    pyqHook: "UPSC Prelims 2019: Identify protected areas included in Agasthyamalai Biosphere Reserve (Shendurney, Peppara, Neyyar, Kalakkad Mundanthurai)."
  },
  {
    id: "prot-namdapha",
    name: "Namdapha National Park & Tiger Reserve",
    category: "protected",
    stateOrRegion: "Changlang District, Arunachal Pradesh",
    coordinates: { x: 535, y: 175 },
    keyDetails: [
      "Only national park in the world that harbors 4 feline species: Tiger, Common Leopard, Clouded Leopard, and Snow Leopard.",
      "Habitat of the critically endangered Namdapha Flying Squirrel; extensive altitudinal gradient from sub-tropical to alpine zone."
    ],
    pyqHook: "UPSC Prelims 2015 & 2013: Sanctuary harboring 4 big cat species spanning sub-tropical to alpine biome (Namdapha)."
  },
  {
    id: "prot-loktak",
    name: "Loktak Lake & Keibul Lamjao National Park",
    category: "protected",
    stateOrRegion: "Bishnupur District, Manipur",
    coordinates: { x: 515, y: 240 },
    keyDetails: [
      "Largest freshwater lake in Northeast India; Ramsar Wetland under Montreux Record due to ecological degradation.",
      "Keibul Lamjao is the world's only floating national park, characterized by floating biomass mats known as 'Phumdis'.",
      "Exclusive sole natural habitat of the endangered Sangai Deer (Rucervus eldii eldii / Dancing Deer of Manipur)."
    ],
    pyqHook: "UPSC Prelims 2022 & 2015: Only floating park in the world and sole habitat of Sangai Deer (Keibul Lamjao, Loktak Lake)."
  },
  {
    id: "prot-similipal",
    name: "Similipal Tiger Reserve & Biosphere Reserve",
    category: "protected",
    stateOrRegion: "Mayurbhanj District, Odisha",
    coordinates: { x: 380, y: 340 },
    keyDetails: [
      "Part of the UNESCO World Network of Biosphere Reserves (2009).",
      "Only known natural habitat of wild Pseudo-melanistic (black striped) Royal Bengal Tigers.",
      "Spectacular Barehipani (399m) and Joranda waterfalls; Mugger crocodile management project along Ramtirtha."
    ],
    pyqHook: "UPSC Prelims 2021 & 2018: Protected area in Odisha famous for melanistic tigers and Sal forest canopy (Similipal)."
  },
  {
    id: "prot-debrigarh",
    name: "Debrigarh Wildlife Sanctuary",
    category: "protected",
    stateOrRegion: "Bargarh & Sambalpur, Odisha",
    coordinates: { x: 360, y: 350 },
    keyDetails: [
      "Situated along the right bank of the massive Hirakud Dam reservoir on Mahanadi River.",
      "High density of Indian Gaur (Bison), Sambar, and Leopard; zero human-wildlife conflict zone.",
      "Historically associated with freedom fighter Veer Surendra Sai who took shelter in Barapathar caves."
    ],
    pyqHook: "UPSC Prelims 2023 & 2024: Debrigarh Sanctuary and its eco-tourism & tiger corridor status."
  },
  {
    id: "riv-mahanadi",
    name: "Mahanadi River Basin",
    category: "rivers",
    stateOrRegion: "Chhattisgarh, Odisha",
    coordinates: { x: 350, y: 320 },
    tributaryInfo: {
      originAndEnd: "Origin: Sihawa near Dhamtari (Raipur plateau, Chhattisgarh). Drains through Chhattisgarh basin and Odisha plains into Bay of Bengal at False Point.",
      leftBank: ["Seonath", "Hasdeo (Hasdeo Arand coal belt)", "Mand", "Ib (Ib river coalfields)"],
      rightBank: ["Ong", "Tel (originates in Nabarangpur)", "Jonk"]
    },
    keyDetails: [
      "Hirakud Dam near Sambalpur is the longest earthen dam in the world (25.8 km).",
      "Forms rich delta near Cuttack and Paradip; mangrove estuary at Kendrapara."
    ],
    pyqHook: "UPSC Prelims 2022 & 2016: Tributaries of Mahanadi (Tel, Hasdeo, Ib, Seonath, Jonk)."
  },
  {
    id: "pass-banihal",
    name: "Banihal Pass (Jawahar Tunnel)",
    category: "passes",
    stateOrRegion: "Jammu & Kashmir (Pir Panjal Range)",
    coordinates: { x: 195, y: 95 },
    keyDetails: [
      "Crosses Pir Panjal Range connecting Jammu with Kashmir Valley.",
      "Houses the 2.85 km Jawahar Tunnel and the 11.2 km Qazigund-Banihal Railway Tunnel (Pir Panjal Railway Tunnel)."
    ],
    pyqHook: "UPSC Prelims 2018: Passes cutting across the Pir Panjal mountain range (Banihal Pass)."
  },
  {
    id: "pass-khardungla",
    name: "Khardung La Pass (Elevation: 5,359 m)",
    category: "passes",
    stateOrRegion: "Ladakh Range, Ladakh UT",
    coordinates: { x: 215, y: 70 },
    keyDetails: [
      "Gateway to the Shyok and Nubra river valleys; strategic military logistics route to Siachen Glacier base camp.",
      "One of the highest motorable mountain passes in the world."
    ],
    pyqHook: "UPSC Prelims 2020: Valley accessed via Khardung La Pass (Nubra Valley & Siachen)."
  },
  {
    id: "prot-panna",
    name: "Panna Tiger Reserve & Biosphere Reserve",
    category: "protected",
    stateOrRegion: "Panna & Chhatarpur Districts, Madhya Pradesh",
    coordinates: { x: 300, y: 260 },
    keyDetails: [
      "UNESCO World Network of Biosphere Reserves (2020).",
      "Ken River flows through the park; central site of the Ken-Betwa River Interlinking Project (submerging parts of core tiger habitat).",
      "Remarkable tiger reintroduction and vulture conservation breeding program."
    ],
    pyqHook: "UPSC Prelims 2022 & 2017: River flowing through Panna Tiger Reserve (Ken River)."
  },
  {
    id: "arch-bhimbetka",
    name: "Bhimbetka Rock Shelters (Paleolithic & Mesolithic)",
    category: "archaeology",
    stateOrRegion: "Raisen District, Madhya Pradesh (UNESCO 2003)",
    coordinates: { x: 275, y: 310 },
    keyDetails: [
      "Discovered by V.S. Wakankar (1957); over 750 rock shelters spanning Upper Paleolithic to Medieval times.",
      "Rock art depicts hunting scenes, dancing figures, rhinoceros, elephants, and ritual dances using natural hematite (red) and plant (green/white) mineral pigments."
    ],
    pyqHook: "UPSC Prelims 2019 & 2011: Prehistoric rock painting caves in India (Bhimbetka)."
  }
];

export default function SpatialMapTrainer() {
  const [activeLayer, setActiveLayer] = useState<GISLayer>("rivers");
  const [selectedFeature, setSelectedFeature] = useState<MapFeature>(GIS_FEATURE_DATASET[0]);
  const [drillModeActive, setDrillModeActive] = useState<boolean>(false);
  const [drillTarget, setDrillTarget] = useState<MapFeature | null>(null);
  const [drillTimeRemaining, setDrillTimeRemaining] = useState<number>(60);
  const [drillScore, setDrillScore] = useState<number>(0);
  const [drillFeedback, setDrillFeedback] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Filter Features for the Active Layer
  const currentFeatures = useMemo(() => {
    return GIS_FEATURE_DATASET.filter((f) => f.category === activeLayer);
  }, [activeLayer]);

  // 60-Second Drill Timer
  useEffect(() => {
    let timer: any = null;
    if (drillModeActive && drillTimeRemaining > 0) {
      timer = setInterval(() => {
        setDrillTimeRemaining((t) => {
          if (t <= 1) {
            setDrillModeActive(false);
            sound.playVictory();
            setDrillFeedback(`🏁 Time Up! Final Score: ${drillScore} Points!`);
            return 60;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [drillModeActive, drillTimeRemaining, drillScore]);

  // Pick Next Drill Question
  const pickNextDrillTarget = () => {
    const randomF = GIS_FEATURE_DATASET[Math.floor(Math.random() * GIS_FEATURE_DATASET.length)];
    setDrillTarget(randomF);
    setDrillFeedback(null);
  };

  const handleStartDrill = () => {
    sound.playWarp();
    setDrillModeActive(true);
    setDrillScore(0);
    setDrillTimeRemaining(60);
    pickNextDrillTarget();
  };

  // Render High-Resolution Vector Map of India & GIS Overlays
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw India Border Polygon (Stylized Schematic Coordinate Path)
    ctx.beginPath();
    // Kashmir / Ladakh
    ctx.moveTo(190, 60);
    ctx.lineTo(250, 80);
    ctx.lineTo(260, 140);
    // Nepal border / Uttarakhand
    ctx.lineTo(310, 160);
    ctx.lineTo(380, 190);
    // Sikkim
    ctx.lineTo(415, 185);
    ctx.lineTo(430, 200);
    // Bhutan border & Arunachal
    ctx.lineTo(470, 160);
    ctx.lineTo(540, 160);
    // Nagaland, Manipur, Mizoram
    ctx.lineTo(530, 230);
    ctx.lineTo(510, 280);
    ctx.lineTo(480, 270);
    // Bangladesh loop & Bengal
    ctx.lineTo(450, 230);
    ctx.lineTo(420, 270);
    // Odisha coast
    ctx.lineTo(390, 340);
    // Andhra coast
    ctx.lineTo(320, 420);
    // Tamil Nadu coast & Kanyakumari
    ctx.lineTo(260, 560);
    // Kerala coast
    ctx.lineTo(240, 520);
    // Karnataka / Goa coast
    ctx.lineTo(230, 430);
    // Maharashtra coast
    ctx.lineTo(200, 350);
    // Gujarat Kutch & Kathiawar peninsula
    ctx.lineTo(170, 290);
    ctx.lineTo(150, 250);
    ctx.lineTo(190, 240);
    // Rajasthan border
    ctx.lineTo(180, 190);
    ctx.lineTo(190, 130);
    ctx.closePath();

    // Map Body Gradient Fill
    const mapGrad = ctx.createLinearGradient(150, 50, 400, 550);
    mapGrad.addColorStop(0, "rgba(216, 166, 58, 0.08)");
    mapGrad.addColorStop(0.5, "rgba(255, 27, 27, 0.05)");
    mapGrad.addColorStop(1, "rgba(6, 182, 212, 0.08)");
    ctx.fillStyle = mapGrad;
    ctx.fill();

    ctx.strokeStyle = "rgba(216, 166, 58, 0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Draw Tropic of Cancer Line (23.5° N) across 8 States
    ctx.beginPath();
    ctx.moveTo(140, 275);
    ctx.lineTo(530, 275);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "9px Inter, monospace";
    ctx.fillText("Tropic of Cancer (23.5°N: Guj, Raj, MP, C'garh, Jhk, WB, Tri, Miz)", 150, 270);

    // 3. Draw Standard Meridian Line (82.5° E) across 5 States
    ctx.beginPath();
    ctx.moveTo(355, 100);
    ctx.lineTo(355, 520);
    ctx.strokeStyle = "rgba(6, 182, 212, 0.2)";
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText("Standard Meridian 82.5°E (UP, MP, C'garh, Odi, AP)", 360, 140);

    // 4. Render GIS Feature Nodes
    GIS_FEATURE_DATASET.forEach((f) => {
      const isCurrentLayer = f.category === activeLayer;
      const isSelected = selectedFeature?.id === f.id;

      if (!isCurrentLayer && !drillModeActive) return;

      const { x, y } = f.coordinates;

      // Glow Circle for Active / Selected Feature
      ctx.beginPath();
      ctx.arc(x, y, isSelected ? 12 : 7, 0, Math.PI * 2);

      let color = "#D8A63A";
      if (f.category === "rivers") color = "#06b6d4";
      else if (f.category === "passes") color = "#ec4899";
      else if (f.category === "archaeology") color = "#f59e0b";
      else if (f.category === "protected") color = "#10b981";

      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = isSelected ? 15 : 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "#fff";
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();

      // Feature Label
      if (isSelected || isCurrentLayer) {
        ctx.font = isSelected ? "bold 10px Inter, sans-serif" : "9px Inter, sans-serif";
        ctx.fillStyle = isSelected ? "#fff" : "rgba(255, 255, 255, 0.75)";
        ctx.fillText(f.name.split(" ")[0], x + 10, y + 3);
      }
    });
  }, [activeLayer, selectedFeature, drillModeActive]);

  // Click on Canvas Pin-Drop Handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (drillModeActive && drillTarget) {
      // Calculate distance to target coordinates
      const dist = Math.hypot(clickX - drillTarget.coordinates.x, clickY - drillTarget.coordinates.y);

      if (dist < 40) {
        sound.playVictory();
        setDrillScore((s) => s + 10);
        setDrillFeedback(`🎯 Bullseye! You accurately located ${drillTarget.name}! (+10 Pts)`);
        setTimeout(() => pickNextDrillTarget(), 900);
      } else {
        sound.playHover();
        setDrillFeedback(`⚠️ Off target by ${Math.round(dist * 2.5)} km! Target was in ${drillTarget.stateOrRegion}.`);
      }
      return;
    }

    // Normal Exploration Mode: Find closest feature
    let closest: MapFeature | null = null;
    let minDist = 30;

    GIS_FEATURE_DATASET.forEach((f) => {
      const dist = Math.hypot(f.coordinates.x - clickX, f.coordinates.y - clickY);
      if (dist < minDist) {
        minDist = dist;
        closest = f;
      }
    });

    if (closest) {
      sound.playClick();
      setSelectedFeature(closest);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080511] p-5 shadow-2xl backdrop-blur-2xl">
      {/* HEADER & DRILL CONTROLS */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/20 text-sm">
              🗺️
            </span>
            <h2 className="font-mono text-base font-black tracking-wide text-white sm:text-lg">
              UPSC GIS Spatial Map Plotter & Tributaries Trainer
            </h2>
          </div>
          <p className="text-xs text-white/50">
            Interactive multi-layer GIS mapping of river basins, mountain passes, Harappan archaeology & Ramsar biospheres
          </p>
        </div>

        {/* 60S DRILL BUTTON */}
        <div className="flex items-center gap-2">
          {drillModeActive ? (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-950/40 px-4 py-1.5 font-mono text-xs text-red-300">
              <span className="animate-ping h-2 w-2 rounded-full bg-red-400" />
              <span>⏱️ {drillTimeRemaining}s Remaining</span>
              <span className="font-bold text-white">Score: {drillScore}</span>
            </div>
          ) : (
            <button
              onClick={handleStartDrill}
              className="flex items-center gap-1.5 rounded-xl border border-[#D8A63A] bg-gradient-to-r from-[#D8A63A] to-[#B38322] px-4 py-2 font-mono text-xs font-black text-black shadow-lg transition hover:scale-105 active:scale-95"
            >
              <span>⚡</span>
              <span>Start 60s Pin-Drop Spatial Drill</span>
            </button>
          )}
        </div>
      </div>

      {/* LAYER SELECTOR PILLS */}
      {!drillModeActive && (
        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              { id: "rivers", label: "🏞️ Rivers & Left/Right Tributaries", color: "border-cyan-500 bg-cyan-500/20 text-cyan-300" },
              { id: "passes", label: "🏔️ Mountain Passes (Himalayas & Ghats)", color: "border-pink-500 bg-pink-500/20 text-pink-300" },
              { id: "archaeology", label: "🏺 IVC & Archaeological Sites", color: "border-amber-500 bg-amber-500/20 text-amber-300" },
              { id: "protected", label: "🐅 Biosphere Reserves & Ramsar", color: "border-emerald-500 bg-emerald-500/20 text-emerald-300" },
            ] as const
          ).map((layer) => (
            <button
              key={layer.id}
              onClick={() => {
                sound.playClick();
                setActiveLayer(layer.id);
              }}
              className={`rounded-2xl border px-3.5 py-2 font-mono text-xs font-bold transition ${
                activeLayer === layer.id
                  ? `${layer.color} shadow-lg`
                  : "border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      )}

      {/* DRILL TARGET PROMPT BANNER */}
      {drillModeActive && drillTarget && (
        <div className="mb-6 rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/80 via-black to-red-950/80 p-4 text-center space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-400">
            📍 PIN-DROP MISSION: CLICK ON THE MAP TO LOCATE
          </span>
          <h3 className="text-lg font-black text-white">{drillTarget.name}</h3>
          <p className="text-xs text-white/60">Region: {drillTarget.stateOrRegion}</p>
          {drillFeedback && (
            <p className="text-xs font-mono font-bold text-amber-300 animate-bounce pt-1">
              {drillFeedback}
            </p>
          )}
        </div>
      )}

      {/* MAP CANVAS & INTEL EXPLORER */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT: VECTOR MAP CANVAS */}
        <div className="relative flex items-center justify-center rounded-2xl border border-white/10 bg-black/70 p-3 shadow-inner">
          <canvas
            ref={canvasRef}
            width={580}
            height={580}
            onClick={handleCanvasClick}
            className="cursor-crosshair max-w-full rounded-xl"
          />
          <div className="absolute bottom-3 left-3 rounded-lg bg-black/80 px-2.5 py-1 text-[10px] font-mono text-[#D8A63A] border border-[#D8A63A]/30 backdrop-blur-md">
            🎯 Click any point to view tributary flows & UPSC Prelims hooks
          </div>
        </div>

        {/* RIGHT: FEATURE DOSSIER & TRIBUTARY BREAKDOWN */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
          <div className="border-b border-white/5 pb-3">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                selectedFeature.category === "rivers"
                  ? "bg-cyan-500/20 text-cyan-300"
                  : selectedFeature.category === "passes"
                  ? "bg-pink-500/20 text-pink-300"
                  : selectedFeature.category === "archaeology"
                  ? "bg-amber-500/20 text-amber-300"
                  : "bg-emerald-500/20 text-emerald-300"
              }`}
            >
              {selectedFeature.category} • {selectedFeature.stateOrRegion}
            </span>
            <h3 className="mt-1.5 text-base font-black text-white">{selectedFeature.name}</h3>
          </div>

          {/* IF RIVER: TRIBUTARY MATRIX */}
          {selectedFeature.tributaryInfo && (
            <div className="space-y-2 text-xs">
              <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                <span className="font-bold text-cyan-300">🌊 Origin & Course:</span>
                <p className="mt-1 text-white/80 leading-relaxed">
                  {selectedFeature.tributaryInfo.originAndEnd}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3">
                  <span className="font-bold text-cyan-400">⬅️ Left-Bank:</span>
                  <ul className="mt-1 space-y-0.5 text-white/80 text-[11px]">
                    {selectedFeature.tributaryInfo.leftBank.map((t, idx) => (
                      <li key={idx}>• {t}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3">
                  <span className="font-bold text-emerald-400">➡️ Right-Bank:</span>
                  <ul className="mt-1 space-y-0.5 text-white/80 text-[11px]">
                    {selectedFeature.tributaryInfo.rightBank.map((t, idx) => (
                      <li key={idx}>• {t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* KEY GEOGRAPHICAL DETAILS */}
          <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 text-xs space-y-1.5">
            <span className="font-bold text-amber-300">📋 Geographical & Strategic Value:</span>
            <ul className="space-y-1 text-white/80">
              {selectedFeature.keyDetails.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-[#D8A63A]">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* UPSC PAST YEAR HOOK */}
          <div className="rounded-xl border border-[#D8A63A]/30 bg-[#D8A63A]/5 p-3 text-xs text-white/90">
            <span className="font-bold text-[#F4C95D]">🎯 UPSC Prelims Elimination Hook: </span>
            {selectedFeature.pyqHook}
          </div>
        </div>
      </div>
    </div>
  );
}
