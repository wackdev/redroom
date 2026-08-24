"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { sound } from "@/lib/audio/sound-engine";

type MuseumTab = "temples" | "sculptures" | "numismatics" | "modern_history";

interface TempleData {
  id: string;
  name: string;
  style: "Nagara" | "Dravida" | "Vesara";
  subStyle?: string;
  period: string;
  dynasty: string;
  location: string;
  keyFeatures: {
    sanctum: string;
    superstructure: string;
    gateway: string;
    waterTank: string;
    speciality: string;
  };
  pyqNotes: string;
}

interface SculptureSchool {
  id: string;
  school: "Gandhara" | "Mathura" | "Amaravati";
  era: string;
  patrons: string;
  material: string;
  religiousInfluence: string;
  buddhaFeatures: {
    expression: string;
    hairDrapery: string;
    posture: string;
    halo: string;
  };
  mainsComparison: string;
}

interface CoinEpigraphy {
  id: string;
  category: "Punch-Marked" | "Indo-Greek" | "Gupta Gold" | "Ashokan Edicts";
  period: string;
  metalsOrMedium: string;
  rulerDynasty: string;
  obverseReverseDescription: string;
  scriptLanguage: string;
  economicHistoricalSignificance: string;
}

interface ModernHistoryEra {
  id: string;
  eraName: string;
  period: string;
  themeColor: string;
  governorGenerals: string[];
  keyReformsActs: string[];
  movementsTribalPeasant: string[];
  landmarkTreatiesOrIncidents: string[];
  pyqHighYieldPointers: string[];
}

const TEMPLE_DATASET: TempleData[] = [
  {
    id: "nagara-khajuraho",
    name: "Kandariya Mahadeva Temple, Khajuraho",
    style: "Nagara",
    subStyle: "Rekha-Prasada / Latina",
    period: "c. 990–1030 CE",
    dynasty: "Chandela Dynasty (King Vidyadhara)",
    location: "Madhya Pradesh",
    keyFeatures: {
      sanctum: "Garbhagriha situated directly under the highest Shikhara, un-enclosed circumambulatory path (Pradakshina Patha).",
      superstructure: "Curvilinear Shikhara crowned by large Amalaka (fluted stone disc) and Kalasha. Multiple miniature Shikharas (Urushringas) rising like a mountain range.",
      gateway: "No boundary walls or towering Gopurams; entered through ornate Torana arches and elevated Jagati plinth.",
      waterTank: "Water tank usually absent or outside temple complex (unlike Dravidian temples).",
      speciality: "Erotic Mithuna sculptures on exterior walls; Sandhara layout (with covered inner ambulatory)."
    },
    pyqNotes: "UPSC Prelims 2021 & 2017: Nagara features — Amalaka, Kalasha, curvilinear shikhara, cruciform ground plan with no boundary walls."
  },
  {
    id: "nagara-modhera",
    name: "Sun Temple, Modhera",
    style: "Nagara",
    subStyle: "Solanki / Maru-Gurjara Style",
    period: "c. 1026–1027 CE",
    dynasty: "Solanki Dynasty (King Bhima I)",
    location: "Mehsana, Gujarat (Puspavati River)",
    keyFeatures: {
      sanctum: "Designed so that during equinoxes, the rising sun's first rays illuminated the golden icon in the Garbhagriha.",
      superstructure: "Carved intricately with Surya images, Digpalas, and celestial nymphs. Absence of mortar in masonry.",
      gateway: "Sabhamandapa (Assembly Hall) detached from Gudhamandapa (Shrine hall), entered through pillared Toranas.",
      waterTank: "Surya Kund (Ramakund) — magnificent stepped rectangular water reservoir lined with 108 miniature shrines.",
      speciality: "Unique stepped tank synthesis with intricate North-Western Nagara stone tracery."
    },
    pyqNotes: "UPSC Prelims 2022 & 2019: Solanki style temple architecture and Surya Kund stepped reservoir design."
  },
  {
    id: "dravida-brihadeeswara",
    name: "Brihadisvara Temple (Rajarajesvaram), Thanjavur",
    style: "Dravida",
    subStyle: "Imperial Chola Climax",
    period: "c. 1003–1010 CE",
    dynasty: "Chola Dynasty (Rajaraja I)",
    location: "Thanjavur, Tamil Nadu (Cauvery Basin)",
    keyFeatures: {
      sanctum: "Enormous square Garbhagriha housing a monolithic Shiva Lingam (3.7m high).",
      superstructure: "13-storey pyramidal Vimana rising 66 meters, topped by a monolithic 80-tonne granite Kumbam (octagonal dome capstone).",
      gateway: "Towering entrance Gopurams (Keralantakan and Rajarajan Toranas) surrounded by high perimeter boundary walls (Prakara).",
      waterTank: "Integrated temple water tank (Kalyana Theertham) within the monumental enclosure.",
      speciality: "Shadow of the Vimana does not fall outside the base at noon; fresco murals depicting Rajaraja and sage Karuvur Devar."
    },
    pyqNotes: "UPSC Prelims 2018 & Mains GS-1 (2020): Imperial Chola architectural zenith, shadow geometry, and Dravida Vimana dominance over Gopurams."
  },
  {
    id: "vesara-halebidu",
    name: "Hoysaleswara Temple, Halebidu (Dwarasamudra)",
    style: "Vesara",
    subStyle: "Hoysala Stellate (Star-shaped) Hybrid",
    period: "c. 1121–1160 CE",
    dynasty: "Hoysala Empire (King Vishnuvardhana)",
    location: "Hassan District, Karnataka",
    keyFeatures: {
      sanctum: "Dvikuta (twin temple shrines) dedicated to Hoysaleswara and Santaleswara Shiva Lingams.",
      superstructure: "Stellate (16-point star-shaped) Jagati platform offering multiple projection facets for sculptural relief.",
      gateway: "Low-rise open pillared Mandapas with lathe-turned polished chloritic schist (soapstone) pillars.",
      waterTank: "Stepped Pushkarini tank with inverted pyramidal stone tiers.",
      speciality: "UNESCO World Heritage Site (2023). Unrivalled soapstone friezes featuring elephants, lions, Makaras, and dancers."
    },
    pyqNotes: "UPSC Prelims 2024 & Mains GS-1 (2023): Hoysala Sacred Ensembles (Belur, Halebidu, Somnathpura) inscribed as UNESCO World Heritage."
  }
];

const SCULPTURE_SCHOOLS: SculptureSchool[] = [
  {
    id: "gandhara",
    school: "Gandhara",
    era: "1st Century BCE – 5th Century CE",
    patrons: "Kushana Dynasty (Kanishka, Huvishka)",
    material: "Grey Schist Stone, Stucco (Plaster)",
    religiousInfluence: "Predominantly Mahayana Buddhism (Greco-Buddhist synthesis)",
    buddhaFeatures: {
      expression: "Calm, intellectual Apollo-like Greek facial features, sharp aquiline nose, almond eyes, youthful countenance.",
      hairDrapery: "Heavy, realistic Roman-style flowing drapery falling in natural folds over both shoulders; wavy hair tied in an Ushnisha topknot.",
      posture: "Standing or seated with muscled anatomical realism; Abhayamudra, Dhyanamudra, Dharmachakrapravartana mudra.",
      halo: "Plain, simple circular halo with minimal floral carving (Hellenistic halo)."
    },
    mainsComparison: "Greco-Roman artistic realism fused with Buddhist spirituality in the North-West frontier (Taxila, Peshawar, Hadda, Bamiyan)."
  },
  {
    id: "mathura",
    school: "Mathura",
    era: "1st Century BCE – 3rd Century CE (and Gupta climax)",
    patrons: "Kushanas, Guptas",
    material: "Spotted Red Sandstone (from Sikri)",
    religiousInfluence: "Tri-religious synthesis: Buddhism, Jainism (Ayagapatas/Tirthankaras), and Brahmanism (Vishnu, Shiva, Surya, Durga).",
    buddhaFeatures: {
      expression: "Pleasant, beaming smiling face with compassionate eyes; fleshy round cheeks, prominent ears, joyful Indian spiritual vitality.",
      hairDrapery: "Light transparent muslin drapery clinging tightly to the body (usually leaving right shoulder bare); shaved head or curled snail-shell hair.",
      posture: "Sturdy, broad muscular shoulders with strong masculine vitality (derived from Yaksha/Yakhshini prototypes).",
      halo: "Extensively decorated, profusely carved circular halo featuring lotus petals, geometric bands, and celestial beings."
    },
    mainsComparison: "100% indigenous Indian aesthetic tradition emerging out of ancient Maurya-Sunga Yaksha figures centered at Mathura."
  },
  {
    id: "amaravati",
    school: "Amaravati",
    era: "2nd Century BCE – 3rd Century CE",
    patrons: "Satavahana and Ikshvaku Dynasties",
    material: "White and Greenish crystalline Palnad Marble / Limestone",
    religiousInfluence: "Exclusively Buddhist (Theravada and Mahayana transition)",
    buddhaFeatures: {
      expression: "Deep emotional expressions, narrative dynamism depicting multiple figures in intense human interaction.",
      hairDrapery: "Softly modeled bodies with elongated slender limbs and tribhanga (three-bend) swaying dance-like grace.",
      posture: "Dynamic narrative scenes: Jataka tales, Queen Maya's dream, the Great Departure, Subjugation of Nalagiri elephant.",
      halo: "Part of multi-figured bas-relief narrative friezes on stupa drum slabs and pradakshina balustrades."
    },
    mainsComparison: "Mastery of narrative bas-relief storytelling, continuous movement, and elegant sensual aesthetic along Krishna river basin."
  }
];

const NUMISMATIC_EPIGRAPHY: CoinEpigraphy[] = [
  {
    id: "punch-marked",
    category: "Punch-Marked",
    period: "c. 6th Century BCE – 2nd Century BCE (Mahajanapada & Maurya)",
    metalsOrMedium: "Silver (Pana/Karshapana) and Copper (Mashaka)",
    rulerDynasty: "Magadha, Mauryan Empire (Chandragupta, Ashoka)",
    obverseReverseDescription: "Irregular rectangular/round silver pieces stamped with 5 distinct punch symbols: Sun, 6-arm symbol (Shadarachakra), Hill with Crescent, Peacock on hill, Tree in railing.",
    scriptLanguage: "No written inscriptions or royal portraits (purely symbolic punch stamps).",
    economicHistoricalSignificance: "Demonstrates emergence of pan-Indian monetary economy, centralized royal minting standard under Kautilya's Arthashastra (Lakshanadhyaksha)."
  },
  {
    id: "indo-greek",
    category: "Indo-Greek",
    period: "c. 2nd Century BCE – 1st Century CE",
    metalsOrMedium: "Silver (Drachm/Tetradrachm), Gold, Copper",
    rulerDynasty: "Indo-Greek Rulers (Demetrius, Menander / King Milinda, Eucratides)",
    obverseReverseDescription: "Obverse: Realistic royal bust portrait of the king wearing helmet/diadem. Reverse: Greek deities (Zeus, Herakles, Athena, Pallas) with royal epithets like 'Basileos Soteros' (King, the Savior).",
    scriptLanguage: "Bilingual and Biscript: Greek script on obverse and Kharosthi/Brahmi script on reverse.",
    economicHistoricalSignificance: "First rulers in India to issue coins with identifiable portraits and names of kings; first to issue regular gold coins in NW frontier."
  },
  {
    id: "gupta-gold",
    category: "Gupta Gold",
    period: "c. 320 CE – 550 CE (Classical Gupta Golden Age)",
    metalsOrMedium: "High-purity Gold (Dinar) and Silver (Rupaka under Chandragupta II)",
    rulerDynasty: "Gupta Emperors (Chandragupta I, Samudragupta, Chandragupta II Vikramaditya, Kumaragupta)",
    obverseReverseDescription: "Archer Type, King-Queen Matrimonial Type (Chandragupta I & Kumaradevi), Lyrist Type (Samudragupta playing Veena), Ashvamedha Type (Sacrificial horse before Yupa pillar), Lion-Slayer Type.",
    scriptLanguage: "Classical Sanskrit in Brahmi script featuring metric royal legends.",
    economicHistoricalSignificance: "Zenith of Indian numismatic artistry; high gold purity reflecting prosperity, flourishing Indian Ocean trade, and divine kingship concepts."
  },
  {
    id: "ashokan-edicts",
    category: "Ashokan Edicts",
    period: "c. 268 BCE – 232 BCE",
    metalsOrMedium: "Polished Chunar Sandstone monolithic pillars and natural living rock surfaces",
    rulerDynasty: "Emperor Ashoka Maurya (Devanampiya Piyadassi)",
    obverseReverseDescription: "14 Major Rock Edicts, 7 Pillar Edicts, Minor Rock Edicts. Major themes: Dhamma Vijay over Digvijay (Kalinga War, RE XIII), religious tolerance (RE XII), welfare administration (RE VI).",
    scriptLanguage: "Prakrit in Brahmi script (pan-India), Kharosthi (Shahbazgarhi/Mansehra in NW), Greek and Aramaic (Kandahar Bilingual Edict).",
    economicHistoricalSignificance: "Oldest deciphered historical inscriptions in India (James Prinsep, 1837); demonstrates benevolent statecraft and linguistic outreach."
  }
];

const MODERN_HISTORY_VAULT: ModernHistoryEra[] = [
  {
    id: "modern-1",
    eraName: "British Consolidation & Economic Exploitation",
    period: "1757 – 1857 CE",
    themeColor: "#D8A63A",
    governorGenerals: [
      "Robert Clive (Dual System in Bengal 1765-1772)",
      "Warren Hastings (Regulating Act 1773, Asiatic Society 1784)",
      "Lord Cornwallis (Permanent Settlement 1793, Civil Services & Police Reforms)",
      "Lord Wellesley (Subsidiary Alliance 1798)",
      "Lord William Bentinck (Abolition of Sati 1829, English Education Act 1835)",
      "Lord Dalhousie (Doctrine of Lapse, Railways 1853, Telegraph & Postal reforms)"
    ],
    keyReformsActs: [
      "Regulating Act 1773 (Supreme Court at Calcutta)",
      "Pitt's India Act 1784 (Board of Control & Court of Directors dual system)",
      "Charter Act 1813 (Ended EIC trade monopoly except tea and China trade, ₹1 lakh for education)",
      "Charter Act 1833 (Governor General of Bengal -> Governor General of India, EIC became purely administrative)",
      "Charter Act 1853 (Open competition for Civil Services introduced)"
    ],
    movementsTribalPeasant: [
      "Sanyasi & Fakir Rebellion (1763-1800)",
      "Pagal Panthis & Faraizi Movement (Bengal 1820s)",
      "Khol Uprising (1831-32, Buddho Bhagat)",
      "Santhal Hool (1855-56, Sidhu and Kanhu Murmu)",
      "Ramosi & Gadkari Uprisings (Western Ghats & Maharashtra)"
    ],
    landmarkTreatiesOrIncidents: [
      "Battle of Plassey (1757) & Battle of Buxar (1764)",
      "Treaty of Allahabad (1765) - Diwani of Bengal, Bihar, Orissa",
      "Treaty of Salbai (1782) - 1st Anglo-Maratha peace for 20 years",
      "Treaty of Bassein (1802) - Peshwa accepted Subsidiary Alliance"
    ],
    pyqHighYieldPointers: [
      "Land Revenue: Permanent Settlement (Zamindars owners, sunset law, 10/11th to British), Ryotwari (Munro/Read in Madras/Bombay), Mahalwari (Holt Mackenzie/Bird in NWFP/Punjab).",
      "Commercialization of Agriculture led to rural indebtedness and de-industrialization (Drain of Wealth by Dadabhai Naoroji & R.C. Dutt)."
    ]
  },
  {
    id: "modern-2",
    eraName: "The Great Revolt & Socio-Religious Renaissance",
    period: "1857 – 1905 CE",
    themeColor: "#06b6d4",
    governorGenerals: [
      "Lord Canning (1857 Revolt, Government of India Act 1858, Indian Penal Code 1860)",
      "Lord Lytton (Vernacular Press Act 1878, Arms Act 1878, Royal Titles Act)",
      "Lord Ripon (Father of Local Self-Government 1882, Repealed Vernacular Press Act, Ilbert Bill Controversy 1883)",
      "Lord Dufferin (Formation of Indian National Congress 1885)",
      "Lord Curzon (Partition of Bengal 1905, Ancient Monuments Preservation Act 1904, Police Commission 1902)"
    ],
    keyReformsActs: [
      "Government of India Act 1858 (Crown Rule, Secretary of State for India with 15-member council)",
      "Queen Victoria's Proclamation 1858 (No further territorial annexation, religious non-interference)",
      "Indian Councils Act 1861 (Portfolio system, non-official Indians in council)",
      "Indian Councils Act 1892 (Indirect election introduced, budget discussion allowed)"
    ],
    movementsTribalPeasant: [
      "Indigo Revolt (Neel Bidroha 1859-60, Digambar & Bishnu Biswas, Dinabandhu Mitra's 'Nil Darpan')",
      "Deccan Riots (1875, Anti-marwari moneylenders, Deccan Agriculturists Relief Act 1879)",
      "Munda Ulgulan (1899-1900, Birsa Munda, Chotanagpur Tenancy Act 1908)",
      "Pabna Agrarian Leagues (1873, Bengal, legal resistance through courts)"
    ],
    landmarkTreatiesOrIncidents: [
      "Brahmo Samaj (1828 Raja Ram Mohan Roy, Debendranath Tagore, Keshub Chunder Sen)",
      "Prarthana Samaj (1867 Atmaram Pandurang, M.G. Ranade)",
      "Arya Samaj (1875 Swami Dayanand Saraswati - 'Go Back to the Vedas', Satyarth Prakash)",
      "Ramakrishna Mission (1897 Swami Vivekananda, Chicago 1893 World Parliament of Religions)",
      "Satyashodhak Samaj (1873 Jyotirao Phule - Gulamgiri, Sarvajanik Satyadharma)"
    ],
    pyqHighYieldPointers: [
      "Ilbert Bill (1883): Allowed Indian district magistrates to try European offenders; white mutiny forced dilution.",
      "Moderate Phase (1885-1905): Constitutional agitation, 3Ps (Prayer, Petition, Protest), Drain Theory."
    ]
  },
  {
    id: "modern-3",
    eraName: "Mass Nationalism, Gandhian Sprints & Independence",
    period: "1905 – 1947 CE",
    themeColor: "#ec4899",
    governorGenerals: [
      "Lord Minto II (Morley-Minto Reforms 1909 - Separate Electorates for Muslims)",
      "Lord Hardinge II (Annulment of Bengal Partition 1911, Delhi Durbar)",
      "Lord Chelmsford (Montagu-Chelmsford Reforms 1919, Jallianwala Bagh 1919)",
      "Lord Reading (Chauri Chaura 1922, Swaraj Party 1923)",
      "Lord Irwin (Simon Commission 1927, Dandi March 1930, Gandhi-Irwin Pact 1931)",
      "Lord Willingdon (Poona Pact 1932, Government of India Act 1935)",
      "Lord Linlithgow (August Offer 1940, Cripps Mission 1942, Quit India 1942)",
      "Lord Wavell (Wavell Plan & Shimla Conference 1945, Cabinet Mission 1946)",
      "Lord Mountbatten (3rd June Plan 1947, Indian Independence Act 1947)"
    ],
    keyReformsActs: [
      "Government of India Act 1909 (Morley-Minto: Separate communal electorates for Muslims)",
      "Government of India Act 1919 (Mont-Ford: Dyarchy in Provinces, Bicameralism at Centre)",
      "Government of India Act 1935 (All-India Federation, Provincial Autonomy, Dyarchy at Centre, Federal Court, RBI)",
      "Indian Independence Act 1947 (Created Dominions of India and Pakistan, lapse of paramountcy)"
    ],
    movementsTribalPeasant: [
      "Swadeshi & Boycott Movement (1905-1908, Vande Mataram, National Council of Education)",
      "Home Rule League Movement (1916, Tilak in Maharashtra/Karnataka, Annie Besant in Rest of India)",
      "Champaran (1917, Tinkathia), Kheda (1918), Ahmedabad Mill Strike (1918)",
      "Non-Cooperation Movement & Khilafat (1920-1922, Chauri Chaura incident)",
      "Civil Disobedience Movement (1930-1934, Salt Satyagraha, Round Table Conferences)",
      "Quit India Movement (1942, 'Do or Die', underground radio by Usha Mehta, parallel governments in Ballia, Tamluk, Satara)"
    ],
    landmarkTreatiesOrIncidents: [
      "Surat Split (1907) & Lucknow Pact (1916 - Congress-League unity)",
      "Poona Pact (1932): Joint electorates with reserved seats for Depressed Classes (Gandhi & Ambedkar)",
      "Azad Hind Fauj (INA) under Netaji Subhas Chandra Bose & Red Fort INA Trials (1945)",
      "Royal Indian Navy (RIN) Mutiny (Feb 1946, HMIS Talwar, Bombay)"
    ],
    pyqHighYieldPointers: [
      "Cripps Mission (1942): Post-war Dominion status, rejected by Congress as 'post-dated cheque'.",
      "Cabinet Mission (1946): Rejected Pakistan demand, proposed 3-tier grouping (A, B, C), Constituent Assembly formed."
    ]
  }
];

export default function ArtCultureMuseum3D() {
  const [activeTab, setActiveTab] = useState<MuseumTab>("temples");
  const [selectedTemple, setSelectedTemple] = useState<TempleData>(TEMPLE_DATASET[0]);
  const [selectedSchool, setSelectedSchool] = useState<SculptureSchool>(SCULPTURE_SCHOOLS[0]);
  const [selectedCoin, setSelectedCoin] = useState<CoinEpigraphy>(NUMISMATIC_EPIGRAPHY[0]);
  const [selectedModernEra, setSelectedModernEra] = useState<ModernHistoryEra>(MODERN_HISTORY_VAULT[0]);

  // 3D Canvas Reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState({ x: 0.3, y: 0.5 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // 3D Wireframe / Solid Geometry Renderer for Temples & Stupas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render3DModel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Atmospheric Glow
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 140);
      grad.addColorStop(0, "rgba(216, 166, 58, 0.15)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);

      const project = (x: number, y: number, z: number) => {
        // Rotate Y
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;
        // Rotate X
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        const scale = 260 / (z2 + 350);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          depth: z2,
        };
      };

      // Draw Ground Plinth (Jagati)
      const plinthPts = [
        project(-70, 60, -70),
        project(70, 60, -70),
        project(70, 60, 70),
        project(-70, 60, 70),
      ];

      ctx.beginPath();
      ctx.moveTo(plinthPts[0].px, plinthPts[0].py);
      ctx.lineTo(plinthPts[1].px, plinthPts[1].py);
      ctx.lineTo(plinthPts[2].px, plinthPts[2].py);
      ctx.lineTo(plinthPts[3].px, plinthPts[3].py);
      ctx.closePath();
      ctx.fillStyle = "rgba(216, 166, 58, 0.12)";
      ctx.fill();
      ctx.strokeStyle = "#D8A63A";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Render based on Selected Style
      if (selectedTemple.style === "Nagara") {
        // Curvilinear Shikhara with Amalaka & Kalasha
        const layers = 10;
        for (let i = 0; i <= layers; i++) {
          const t = i / layers;
          const y = 50 - t * 120;
          const r = 45 * Math.cos((t * Math.PI) / 2.2);

          const ringPts = [
            project(-r, y, -r),
            project(r, y, -r),
            project(r, y, r),
            project(-r, y, r),
          ];

          ctx.beginPath();
          ctx.moveTo(ringPts[0].px, ringPts[0].py);
          ctx.lineTo(ringPts[1].px, ringPts[1].py);
          ctx.lineTo(ringPts[2].px, ringPts[2].py);
          ctx.lineTo(ringPts[3].px, ringPts[3].py);
          ctx.closePath();
          ctx.strokeStyle = i === layers ? "#F4C95D" : "rgba(216, 166, 58, 0.4)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Amalaka Disc on Top
        const amalakaPt = project(0, -75, 0);
        ctx.beginPath();
        ctx.arc(amalakaPt.px, amalakaPt.py, 12, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(244, 201, 93, 0.8)";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.stroke();

        // Kalasha Spire
        const kalashaPt = project(0, -92, 0);
        ctx.beginPath();
        ctx.moveTo(amalakaPt.px, amalakaPt.py);
        ctx.lineTo(kalashaPt.px, kalashaPt.py);
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Garbhagriha Box Base
        const gBox = [
          project(-40, 50, -40),
          project(40, 50, -40),
          project(40, 50, 40),
          project(-40, 50, 40),
        ];
        ctx.beginPath();
        ctx.moveTo(gBox[0].px, gBox[0].py);
        ctx.lineTo(gBox[1].px, gBox[1].py);
        ctx.lineTo(gBox[2].px, gBox[2].py);
        ctx.lineTo(gBox[3].px, gBox[3].py);
        ctx.closePath();
        ctx.fillStyle = "rgba(216, 166, 58, 0.25)";
        ctx.fill();
      } else if (selectedTemple.style === "Dravida") {
        // Pyramidal Vimana (Stepped Terraced Tiers)
        const tiers = 6;
        for (let i = 0; i <= tiers; i++) {
          const t = i / tiers;
          const y = 50 - t * 110;
          const w = 55 * (1 - t * 0.75);

          const tierPts = [
            project(-w, y, -w),
            project(w, y, -w),
            project(w, y, w),
            project(-w, y, w),
          ];

          ctx.beginPath();
          ctx.moveTo(tierPts[0].px, tierPts[0].py);
          ctx.lineTo(tierPts[1].px, tierPts[1].py);
          ctx.lineTo(tierPts[2].px, tierPts[2].py);
          ctx.lineTo(tierPts[3].px, tierPts[3].py);
          ctx.closePath();
          ctx.fillStyle = "rgba(6, 182, 212, 0.2)";
          ctx.fill();
          ctx.strokeStyle = "#06b6d4";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Shikhara Capstone (Kumbam dome)
        const kumbamPt = project(0, -70, 0);
        ctx.beginPath();
        ctx.arc(kumbamPt.px, kumbamPt.py, 14, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.stroke();

        // Towering Gopuram Gateway Outline in Foreground
        const gopuramPts = [
          project(-60, 45, 60),
          project(-30, -20, 60),
          project(30, -20, 60),
          project(60, 45, 60),
        ];
        ctx.beginPath();
        ctx.moveTo(gopuramPts[0].px, gopuramPts[0].py);
        ctx.lineTo(gopuramPts[1].px, gopuramPts[1].py);
        ctx.lineTo(gopuramPts[2].px, gopuramPts[2].py);
        ctx.lineTo(gopuramPts[3].px, gopuramPts[3].py);
        ctx.closePath();
        ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        // Vesara Stellate (Star-Shaped 16-point) Plan
        const starLayers = 5;
        for (let l = 0; l <= starLayers; l++) {
          const t = l / starLayers;
          const y = 50 - t * 90;
          const rBase = 50 * (1 - t * 0.6);

          ctx.beginPath();
          for (let p = 0; p < 16; p++) {
            const angle = (p * Math.PI * 2) / 16;
            const r = p % 2 === 0 ? rBase : rBase * 0.75;
            const pt = project(r * Math.cos(angle), y, r * Math.sin(angle));
            if (p === 0) ctx.moveTo(pt.px, pt.py);
            else ctx.lineTo(pt.px, pt.py);
          }
          ctx.closePath();
          ctx.fillStyle = "rgba(236, 72, 153, 0.15)";
          ctx.fill();
          ctx.strokeStyle = "#ec4899";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render3DModel);
    };

    animId = requestAnimationFrame(render3DModel);
    return () => cancelAnimationFrame(animId);
  }, [rotation, selectedTemple]);

  // Mouse / Touch Drag Rotation Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };

    setRotation((prev) => ({
      x: Math.max(-0.8, Math.min(0.8, prev.x + dy * 0.008)),
      y: prev.y + dx * 0.008,
    }));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080511] p-5 shadow-2xl backdrop-blur-2xl">
      {/* HEADER & TAB SWITCHER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#D8A63A]/20 text-sm">
              🏺
            </span>
            <h2 className="font-mono text-base font-black tracking-wide text-white sm:text-lg">
              Art, Culture & Architecture 3D Virtual Museum
            </h2>
          </div>
          <p className="text-xs text-white/50">
            Interactive structural anatomy of temples, sculpture comparison, numismatics & complete Modern History vault
          </p>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex flex-wrap gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("temples");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs font-bold transition ${
              activeTab === "temples"
                ? "bg-[#D8A63A] text-black shadow-lg shadow-[#D8A63A]/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>🏛️</span>
            <span>3D Temple Architecture</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("sculptures");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs font-bold transition ${
              activeTab === "sculptures"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>🗿</span>
            <span>Sculpture Schools</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("numismatics");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs font-bold transition ${
              activeTab === "numismatics"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>🪙</span>
            <span>Numismatics & Edicts</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("modern_history");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs font-bold transition ${
              activeTab === "modern_history"
                ? "bg-pink-600 text-white shadow-lg shadow-pink-900/40"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>📜</span>
            <span>Modern History Vault</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: 3D TEMPLE ARCHITECTURE EXPLORER */}
      {activeTab === "temples" && (
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* LEFT: 3D CANVAS VIEW & TEMPLE SELECTOR */}
          <div className="flex flex-col gap-4">
            <div className="relative flex items-center justify-center rounded-2xl border border-[#D8A63A]/30 bg-black/60 p-2 shadow-inner">
              <canvas
                ref={canvasRef}
                width={360}
                height={260}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="cursor-grab active:cursor-grabbing rounded-xl"
              />
              <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-2 py-1 text-[10px] font-mono text-[#D8A63A] border border-[#D8A63A]/30 backdrop-blur-md">
                🖱️ Drag to rotate 3D wireframe
              </div>
              <div className="absolute top-3 right-3 rounded-lg bg-black/70 px-2 py-1 text-[10px] font-mono text-white/80 border border-white/10 backdrop-blur-md">
                Style: {selectedTemple.style}
              </div>
            </div>

            {/* TEMPLE LIST */}
            <div className="grid grid-cols-2 gap-2">
              {TEMPLE_DATASET.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    sound.playHover();
                    setSelectedTemple(t);
                  }}
                  className={`rounded-xl border p-2.5 text-left transition ${
                    selectedTemple.id === t.id
                      ? "border-[#D8A63A] bg-[#D8A63A]/10 text-white shadow-lg"
                      : "border-white/5 bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#D8A63A]">
                    {t.style} Style
                  </span>
                  <span className="text-xs font-bold leading-snug line-clamp-1">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: STRUCTURAL ANATOMY BREAKDOWN */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div>
                <span className="rounded-full bg-[#D8A63A]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#F4C95D]">
                  {selectedTemple.subStyle || selectedTemple.style}
                </span>
                <h3 className="mt-1 text-base font-black text-white">{selectedTemple.name}</h3>
                <p className="text-xs text-white/60">
                  📍 {selectedTemple.location} • 👑 {selectedTemple.dynasty} ({selectedTemple.period})
                </p>
              </div>
            </div>

            {/* ANATOMY GRID */}
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                <span className="font-bold text-[#D8A63A]">🏛️ Garbhagriha (Sanctum):</span>
                <p className="mt-1 text-white/80 leading-relaxed">{selectedTemple.keyFeatures.sanctum}</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                <span className="font-bold text-cyan-400">⛰️ Superstructure (Shikhara / Vimana):</span>
                <p className="mt-1 text-white/80 leading-relaxed">{selectedTemple.keyFeatures.superstructure}</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                <span className="font-bold text-pink-400">🚪 Gateway & Perimeter (Gopuram / Torana):</span>
                <p className="mt-1 text-white/80 leading-relaxed">{selectedTemple.keyFeatures.gateway}</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                <span className="font-bold text-emerald-400">🌊 Water Reservoir (Kund / Tank):</span>
                <p className="mt-1 text-white/80 leading-relaxed">{selectedTemple.keyFeatures.waterTank}</p>
              </div>
            </div>

            {/* SPECIALITY & UPSC PYQ HOOK */}
            <div className="rounded-xl border border-[#D8A63A]/30 bg-[#D8A63A]/5 p-3.5 text-xs">
              <span className="font-bold text-[#F4C95D]">🎯 UPSC Prelims & Mains Relevance:</span>
              <p className="mt-1 text-white/90 leading-relaxed">{selectedTemple.pyqNotes}</p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SCULPTURE & ICONOGRAPHY SCHOOLS */}
      {activeTab === "sculptures" && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {SCULPTURE_SCHOOLS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedSchool(s);
                }}
                className={`rounded-2xl border p-4 text-left transition ${
                  selectedSchool.id === s.id
                    ? "border-purple-500 bg-purple-500/20 text-white shadow-lg shadow-purple-950/50"
                    : "border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span className="block text-xs font-bold uppercase tracking-wider text-purple-400">
                  {s.school} School
                </span>
                <span className="text-xs text-white/50">{s.era}</span>
              </button>
            ))}
          </div>

          {/* DETAILED COMPARATIVE MATRIX */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/10 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-500/20 pb-3">
              <div>
                <h3 className="text-base font-bold text-purple-200">{selectedSchool.school} Sculpture Tradition</h3>
                <p className="text-xs text-white/60">
                  👑 Patrons: {selectedSchool.patrons} • 🪨 Material: {selectedSchool.material}
                </p>
              </div>
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
                {selectedSchool.religiousInfluence}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div className="rounded-xl border border-white/5 bg-black/40 p-3.5">
                <span className="font-bold text-purple-300">👁️ Facial Features & Expression</span>
                <p className="mt-1.5 text-white/80 leading-relaxed">{selectedSchool.buddhaFeatures.expression}</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/40 p-3.5">
                <span className="font-bold text-cyan-300">👘 Drapery & Hair Details</span>
                <p className="mt-1.5 text-white/80 leading-relaxed">{selectedSchool.buddhaFeatures.hairDrapery}</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/40 p-3.5">
                <span className="font-bold text-amber-300">🧘 Body Form & Mudras</span>
                <p className="mt-1.5 text-white/80 leading-relaxed">{selectedSchool.buddhaFeatures.posture}</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/40 p-3.5">
                <span className="font-bold text-pink-300">✨ Prabhamandala (Halo)</span>
                <p className="mt-1.5 text-white/80 leading-relaxed">{selectedSchool.buddhaFeatures.halo}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/30 p-3.5 text-xs text-white/80">
              <span className="font-bold text-white">📝 Mains Comparative Thesis: </span>
              {selectedSchool.mainsComparison}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: NUMISMATICS & ASHOKAN EDICTS */}
      {activeTab === "numismatics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {NUMISMATIC_EPIGRAPHY.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedCoin(c);
                }}
                className={`rounded-2xl border p-3.5 text-left transition ${
                  selectedCoin.id === c.id
                    ? "border-emerald-500 bg-emerald-500/20 text-white shadow-lg shadow-emerald-950/50"
                    : "border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {c.category}
                </span>
                <span className="text-xs font-bold line-clamp-1">{c.rulerDynasty}</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
              <div>
                <h3 className="text-base font-bold text-emerald-200">{selectedCoin.category} Matrix</h3>
                <p className="text-xs text-white/60">
                  ⏳ Period: {selectedCoin.period} • 🪙 Medium: {selectedCoin.metalsOrMedium}
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-mono font-bold text-emerald-300">
                Script: {selectedCoin.scriptLanguage}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-white/5 bg-black/40 p-3.5">
                <span className="font-bold text-emerald-300">🔍 Visual Stamping & Iconography:</span>
                <p className="mt-1.5 text-white/80 leading-relaxed">{selectedCoin.obverseReverseDescription}</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/40 p-3.5">
                <span className="font-bold text-amber-300">📈 Economic & Historical Value:</span>
                <p className="mt-1.5 text-white/80 leading-relaxed">{selectedCoin.economicHistoricalSignificance}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: MODERN HISTORY COMPREHENSIVE REVISION VAULT */}
      {activeTab === "modern_history" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MODERN_HISTORY_VAULT.map((era) => (
              <button
                key={era.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedModernEra(era);
                }}
                className={`rounded-2xl border p-4 text-left transition ${
                  selectedModernEra.id === era.id
                    ? "border-pink-500 bg-pink-500/20 text-white shadow-lg shadow-pink-950/50"
                    : "border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span className="block text-xs font-bold uppercase tracking-wider text-pink-400">
                  {era.period}
                </span>
                <span className="text-xs font-bold text-white leading-snug">{era.eraName}</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-pink-500/30 bg-pink-950/10 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-500/20 pb-3">
              <div>
                <h3 className="text-base font-bold text-pink-200">{selectedModernEra.eraName}</h3>
                <p className="text-xs text-white/60">Comprehensive high-yield revision timeline ({selectedModernEra.period})</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              {/* Governor Generals */}
              <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1.5">
                <span className="font-bold text-amber-300">🎩 Governor Generals & Viceroys:</span>
                <ul className="space-y-1 text-white/80">
                  {selectedModernEra.governorGenerals.map((g, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#D8A63A]">•</span> {g}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Constitutional Acts */}
              <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1.5">
                <span className="font-bold text-cyan-300">📜 Key Constitutional Acts:</span>
                <ul className="space-y-1 text-white/80">
                  {selectedModernEra.keyReformsActs.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-cyan-400">•</span> {act}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tribal & Peasant Movements */}
              <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1.5">
                <span className="font-bold text-pink-300">🏹 Tribal & Peasant Revolts / Mass Action:</span>
                <ul className="space-y-1 text-white/80">
                  {selectedModernEra.movementsTribalPeasant.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-pink-400">•</span> {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treaties & Organizations */}
              <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1.5">
                <span className="font-bold text-emerald-300">🤝 Landmark Treaties / Reform Bodies:</span>
                <ul className="space-y-1 text-white/80">
                  {selectedModernEra.landmarkTreatiesOrIncidents.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">•</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* High Yield PYQ Box */}
            <div className="rounded-xl border border-pink-500/30 bg-black/50 p-3.5 text-xs text-white/90 space-y-1">
              <span className="font-bold text-pink-400">🎯 High-Yield Prelims & Mains Takeaways:</span>
              <ul className="space-y-1">
                {selectedModernEra.pyqHighYieldPointers.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-pink-400">✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
