"use client";

import React, { useState, useMemo } from "react";
import { sound } from "@/lib/audio/sound-engine";

type VaultTab = "indices" | "spatial_mnemonics" | "ramsar_wetlands" | "constitutional_amendments";

interface GlobalIndex {
  id: string;
  name: string;
  publishingBody: string;
  frequency: string;
  coreDimensions: {
    dimension: string;
    indicators: string[];
  }[];
  indiaRankAndScore: string;
  upscRelevanceTakeaway: string;
}

interface SpatialMnemonic {
  id: string;
  waterBodyOrRegion: string;
  category: "Sea Littorals" | "Multilateral Blocs" | "Strategic Chokepoints";
  mnemonicWord: string;
  mnemonicExpansion: { letter: string; countryOrFeature: string; flag: string }[];
  geopoliticalSignificance: string;
  pyqHistory: string;
}

interface RamsarSite {
  id: string;
  name: string;
  state: string;
  yearDesignated: number;
  significance: string;
  keyFaunaFlora: string;
  montreuxRecord?: boolean;
}

interface ConstitutionalAmendment {
  id: string;
  actName: string;
  year: number;
  keyArticlesModified: string[];
  coreProvisions: string[];
  landmarkJudgments: string[];
  upscPrelimsRelevance: string;
}

// ============================================================================
// 1. GLOBAL INDICES & REPORTS MASTER
// ============================================================================
const GLOBAL_INDICES: GlobalIndex[] = [
  {
    id: "mpi-niti",
    name: "National Multidimensional Poverty Index (National MPI)",
    publishingBody: "NITI Aayog (in partnership with UNDP & OPHI)",
    frequency: "Annual / Biennial based on NFHS Data",
    coreDimensions: [
      {
        dimension: "Health (1/3rd weight)",
        indicators: ["Nutrition (BMI)", "Child & Adolescent Mortality", "Maternal Health (Antenatal care)"]
      },
      {
        dimension: "Education (1/3rd weight)",
        indicators: ["Years of Schooling (at least 6 years)", "School Attendance"]
      },
      {
        dimension: "Standard of Living (1/3rd weight)",
        indicators: [
          "Cooking Fuel (Clean fuel)",
          "Sanitation (Improved toilet)",
          "Drinking Water (Safe source within 30m)",
          "Electricity",
          "Housing (Pucca roof/wall)",
          "Assets",
          "Bank Accounts (Jan Dhan Inclusion)"
        ]
      }
    ],
    indiaRankAndScore: "Over 13.5 crore (135 million) Indians exited multidimensional poverty between 2015-16 and 2019-21 (NFHS-4 to NFHS-5). Poverty headcount fell from 24.85% to 14.96%.",
    upscRelevanceTakeaway: "UPSC Prelims 2021 & 2012: India added 'Maternal Health' and 'Bank Accounts' to the Alkire-Foster global MPI methodology."
  },
  {
    id: "lpi-wb",
    name: "Logistics Performance Index (LPI)",
    publishingBody: "World Bank",
    frequency: "Biennial",
    coreDimensions: [
      {
        dimension: "Customs & Clearance",
        indicators: ["Efficiency of border management and customs clearance speed"]
      },
      {
        dimension: "Infrastructure Quality",
        indicators: ["Quality of trade and transport infrastructure (Ports, Expressways, DFCs)"]
      },
      {
        dimension: "International Shipments & Tracking",
        indicators: ["Ease of arranging competitively priced shipments", "Tracking & tracing consignments", "Timeliness"]
      }
    ],
    indiaRankAndScore: "India ranked 38th out of 139 countries in LPI 2023 (jumped 6 places from 44th in 2018 due to PM Gati Shakti & National Logistics Policy).",
    upscRelevanceTakeaway: "UPSC Prelims 2017 & Mains GS-3: Measures multi-modal transport efficiency under PM Gati Shakti."
  },
  {
    id: "gii-wipo",
    name: "Global Innovation Index (GII)",
    publishingBody: "World Intellectual Property Organization (WIPO)",
    frequency: "Annual",
    coreDimensions: [
      {
        dimension: "Innovation Inputs (5 Pillars)",
        indicators: ["Institutions", "Human Capital & Research", "Infrastructure", "Market Sophistication", "Business Sophistication"]
      },
      {
        dimension: "Innovation Outputs (2 Pillars)",
        indicators: ["Knowledge & Technology Outputs (Patents, Scientific papers)", "Creative Outputs (Trademarks, ICT services exports)"]
      }
    ],
    indiaRankAndScore: "India ranked 39th out of 133 economies in GII 2024 (up from 81st in 2015). Top ranked economy in Central & Southern Asia.",
    upscRelevanceTakeaway: "UPSC Prelims 2016 & Mains GS-3: Assesses India's R&D spend (0.65% of GDP) and patent grant velocity."
  },
  {
    id: "hdi-undp",
    name: "Human Development Index (HDI)",
    publishingBody: "United Nations Development Programme (UNDP)",
    frequency: "Annual",
    coreDimensions: [
      {
        dimension: "Long and Healthy Life",
        indicators: ["Life Expectancy at Birth (Normalized min 20, max 85 years)"]
      },
      {
        dimension: "Knowledge / Education",
        indicators: ["Expected Years of Schooling for children", "Mean Years of Schooling for adults aged 25+"]
      },
      {
        dimension: "A Decent Standard of Living",
        indicators: ["Gross National Income (GNI) per capita (PPP $) on a logarithmic scale"]
      }
    ],
    indiaRankAndScore: "India ranked 134th out of 193 countries (HDI value 0.644, categorized under 'Medium Human Development').",
    upscRelevanceTakeaway: "Geometric Mean methodology of the 3 dimensions: $HDI = (I_{Health} \\times I_{Education} \\times I_{Income})^{1/3}$."
  },
  {
    id: "weo-imf",
    name: "World Economic Outlook (WEO) & Global Financial Stability Report",
    publishingBody: "International Monetary Fund (IMF)",
    frequency: "Biannual (April & October)",
    coreDimensions: [
      {
        dimension: "Global GDP Growth & Projections",
        indicators: ["Real GDP growth rate", "Inflation dynamics", "Fiscal deficit trajectories"]
      },
      {
        dimension: "External Sector & Trade Volumes",
        indicators: ["Current Account Balances", "Exchange rate volatility", "Commodity price indexes"]
      }
    ],
    indiaRankAndScore: "IMF projects India as the fastest-growing major global economy with ~6.8%–7.0% real GDP expansion.",
    upscRelevanceTakeaway: "UPSC Prelims 2014: 'Which of the following bodies releases the World Economic Outlook?' -> Answer: IMF."
  },
  {
    id: "cpi-ti",
    name: "Corruption Perceptions Index (CPI)",
    publishingBody: "Transparency International",
    frequency: "Annual",
    coreDimensions: [
      {
        dimension: "Public Sector Corruption Perception",
        indicators: ["Bribery of public officials", "Misdirection of public funds", "Effectiveness of anti-corruption enforcement"]
      }
    ],
    indiaRankAndScore: "India ranked 93rd out of 180 countries in CPI 2023 with a score of 39/100.",
    upscRelevanceTakeaway: "UPSC Prelims 2016: Transparency International is an international non-governmental organization based in Berlin."
  },
  {
    id: "epi-yale",
    name: "Environmental Performance Index (EPI)",
    publishingBody: "Yale Center for Environmental Law & Columbia University",
    frequency: "Biennial",
    coreDimensions: [
      {
        dimension: "Climate Change Mitigation",
        indicators: ["Projected GHG emissions, Carbon intensity growth rates"]
      },
      {
        dimension: "Environmental Health & Ecosystem Vitality",
        indicators: ["Air quality (PM2.5, NO2)", "Biodiversity & habitat protection", "Water resources & sanitation"]
      }
    ],
    indiaRankAndScore: "India strongly contested the EPI methodology due to disproportionate weightage on historical emissions vs per capita emissions.",
    upscRelevanceTakeaway: "UPSC Prelims 2017: Focuses on common but differentiated responsibilities (CBDR-RC) in global climate metrics."
  }
];

// ============================================================================
// 2. SPATIAL SEAS & MULTILATERAL BLOCS (SPATIAL MNEMONICS)
// ============================================================================
const SPATIAL_MNEMONICS: SpatialMnemonic[] = [
  {
    id: "sp-baltic",
    waterBodyOrRegion: "Baltic Sea Littoral Countries",
    category: "Sea Littorals",
    mnemonicWord: "R-U-D-E  G-E-R-M-A-N-Y",
    mnemonicExpansion: [
      { letter: "R", countryOrFeature: "Russia (Kaliningrad & St. Petersburg)", flag: "🇷🇺" },
      { letter: "U", countryOrFeature: "Ukraine (Trap: Does NOT touch Baltic Sea!)", flag: "⚠️" },
      { letter: "D", countryOrFeature: "Denmark", flag: "🇩🇰" },
      { letter: "E", countryOrFeature: "Estonia", flag: "🇪🇪" },
      { letter: "G", countryOrFeature: "Germany", flag: "🇩🇪" },
      { letter: "E", countryOrFeature: "Estonia", flag: "🇪🇪" },
      { letter: "R", countryOrFeature: "Russia", flag: "🇷🇺" },
      { letter: "M", countryOrFeature: "Lithuania & Latvia (Baltic States)", flag: "🇱🇹" },
      { letter: "A", countryOrFeature: "All-9: Sweden, Finland, Poland, Lithuania, Latvia, Estonia, Germany, Denmark, Russia", flag: "🇪🇺" },
      { letter: "N", countryOrFeature: "Norway (Trap: Does NOT touch Baltic Sea - touches North Sea!)", flag: "⚠️" },
      { letter: "Y", countryOrFeature: "Yes: Exactly 9 Sovereign Bordering Littorals", flag: "🌊" }
    ],
    geopoliticalSignificance: "Nord Stream 1 & 2 gas pipelines, NATO Baltic Air Policing, Kaliningrad Suwalki Gap corridor.",
    pyqHistory: "UPSC Prelims 2014, 2018, 2023: Testing which country does not border the Baltic Sea (Norway & Ukraine are classic UPSC traps)."
  },
  {
    id: "sp-black",
    waterBodyOrRegion: "Black Sea Bordering Countries",
    category: "Sea Littorals",
    mnemonicWord: "T - E - A   R - U - B - G   (or BURGER-T)",
    mnemonicExpansion: [
      { letter: "T", countryOrFeature: "Turkey (Controls Bosphorus & Dardanelles Straits under Montreux 1936)", flag: "🇹🇷" },
      { letter: "E", countryOrFeature: "Europe / Romania", flag: "🇷🇴" },
      { letter: "A", countryOrFeature: "Azov Sea link via Kerch Strait", flag: "🌊" },
      { letter: "R", countryOrFeature: "Russia", flag: "🇷🇺" },
      { letter: "U", countryOrFeature: "Ukraine", flag: "🇺🇦" },
      { letter: "B", countryOrFeature: "Bulgaria", flag: "🇧🇬" },
      { letter: "G", countryOrFeature: "Georgia", flag: "🇬🇪" }
    ],
    geopoliticalSignificance: "Black Sea Grain Initiative, Snake Island, Sevastopol naval base, Montreux Convention 1936.",
    pyqHistory: "UPSC Prelims 2019, 2023: Direct question on countries bordering the Black Sea."
  },
  {
    id: "sp-caspian",
    waterBodyOrRegion: "Caspian Sea Littorals (Largest Enclosed Inland Body)",
    category: "Sea Littorals",
    mnemonicWord: "T - A - R - I - K   (TARIK)",
    mnemonicExpansion: [
      { letter: "T", countryOrFeature: "Turkmenistan", flag: "🇹🇲" },
      { letter: "A", countryOrFeature: "Azerbaijan (Baku port)", flag: "🇦🇿" },
      { letter: "R", countryOrFeature: "Russia (Volga river delta)", flag: "🇷🇺" },
      { letter: "I", countryOrFeature: "Iran", flag: "🇮🇷" },
      { letter: "K", countryOrFeature: "Kazakhstan", flag: "🇰🇿" }
    ],
    geopoliticalSignificance: "Caviar sturgeon fishing, massive Kashagan and Tengiz oilfields, INSTC maritime segment.",
    pyqHistory: "UPSC Prelims 2014 & 2019: Identify the countries that border the Caspian Sea (Uzbekistan & Armenia are classic traps)."
  },
  {
    id: "sp-red",
    waterBodyOrRegion: "Red Sea Bordering Nations",
    category: "Sea Littorals",
    mnemonicWord: "D - E - S - S - E - Y   (DESSEY)",
    mnemonicExpansion: [
      { letter: "D", countryOrFeature: "Djibouti (Bab-el-Mandeb Strait)", flag: "🇩🇯" },
      { letter: "E", countryOrFeature: "Egypt (Suez Canal / Sinai Peninsula)", flag: "🇪🇬" },
      { letter: "S", countryOrFeature: "Saudi Arabia (NEOM project)", flag: "🇸🇦" },
      { letter: "S", countryOrFeature: "Sudan (Port Sudan)", flag: "🇸🇩" },
      { letter: "E", countryOrFeature: "Eritrea", flag: "🇪🇷" },
      { letter: "Y", countryOrFeature: "Yemen (Houthi coastal control)", flag: "🇾🇪" }
    ],
    geopoliticalSignificance: "Critical global choke-point linking Mediterranean Sea via Suez to Indian Ocean via Bab-el-Mandeb.",
    pyqHistory: "UPSC Prelims 2007 & 2024: Direct question on Red Sea littoral nations."
  },
  {
    id: "sp-med",
    waterBodyOrRegion: "Mediterranean Sea Littorals (21 Nations)",
    category: "Sea Littorals",
    mnemonicWord: "T-A-M-L-E (North Africa) + S-I-M (Iberian) + B-A-L-K-A-N-S + L-E-V-A-N-T",
    mnemonicExpansion: [
      { letter: "N.Africa", countryOrFeature: "Tunisia, Algeria, Morocco, Libya, Egypt (TAMLE)", flag: "🌍" },
      { letter: "Levant", countryOrFeature: "Israel, Lebanon, Syria (Jordan does NOT touch Mediterranean!)", flag: "🌊" },
      { letter: "W.Europe", countryOrFeature: "Spain, France, Monaco, Italy, Malta", flag: "🇪🇺" },
      { letter: "Adriatic", countryOrFeature: "Slovenia, Croatia, Bosnia & Herzegovina, Montenegro, Albania", flag: "⚓" },
      { letter: "E.Med", countryOrFeature: "Greece, Turkey, Cyprus", flag: "🇬🇷" }
    ],
    geopoliticalSignificance: "Gibraltar Strait, Suez Canal, East Med Gas Forum, migrant maritime routes.",
    pyqHistory: "UPSC Prelims 2015, 2017, 2020: 'Which of the following does NOT open out to the Mediterranean Sea?' -> Jordan, Iraq, Saudi Arabia."
  },
  {
    id: "sp-asean",
    waterBodyOrRegion: "ASEAN (Association of Southeast Asian Nations - 10 Members)",
    category: "Multilateral Blocs",
    mnemonicWord: "B-S-M-L-T   V-M-P-I-C   (B.S. Medical College VIP T.V.)",
    mnemonicExpansion: [
      { letter: "B", countryOrFeature: "Brunei Darussalam", flag: "🇧🇳" },
      { letter: "S", countryOrFeature: "Singapore", flag: "🇸🇬" },
      { letter: "M", countryOrFeature: "Malaysia", flag: "🇲🇾" },
      { letter: "L", countryOrFeature: "Laos (Only landlocked ASEAN member)", flag: "🇱🇦" },
      { letter: "T", countryOrFeature: "Thailand", flag: "🇹🇭" },
      { letter: "V", countryOrFeature: "Vietnam", flag: "🇻🇳" },
      { letter: "M", countryOrFeature: "Myanmar", flag: "🇲🇲" },
      { letter: "P", countryOrFeature: "Philippines", flag: "🇵🇭" },
      { letter: "I", countryOrFeature: "Indonesia (ASEAN Secretariat Jakarta)", flag: "🇮🇩" },
      { letter: "C", countryOrFeature: "Cambodia (Last to join in 1999; Timor-Leste observer in principle)", flag: "🇰🇭" }
    ],
    geopoliticalSignificance: "RCEP trade agreement, South China Sea Code of Conduct, Straits of Malacca security.",
    pyqHistory: "UPSC Prelims 2018 & 2023: India-ASEAN relations, Act East Policy, and East Asia Summit members."
  },
  {
    id: "sp-g20",
    waterBodyOrRegion: "G20 (Group of Twenty + African Union = 21 Members)",
    category: "Multilateral Blocs",
    mnemonicWord: "GURU JI SITA AB SSC FCI ME  +  AU (New 2023)",
    mnemonicExpansion: [
      { letter: "G-U-R-U", countryOrFeature: "Germany, USA, Russia, UK", flag: "🌐" },
      { letter: "J-I", countryOrFeature: "Japan, India (New Delhi Leaders' Declaration 2023)", flag: "🇮🇳" },
      { letter: "S-I-T-A", countryOrFeature: "Saudi Arabia, Indonesia, Turkey, Australia", flag: "🌏" },
      { letter: "A-B", countryOrFeature: "Argentina, Brazil (2024 G20 Presidency)", flag: "🇧🇷" },
      { letter: "S-S-C", countryOrFeature: "South Africa (2025 Presidency), South Korea, Canada", flag: "🇿🇦" },
      { letter: "F-C-I", countryOrFeature: "France, China, Italy", flag: "🇫🇷" },
      { letter: "M-E", countryOrFeature: "Mexico, European Union (EU)", flag: "🇪🇺" },
      { letter: "+AU", countryOrFeature: "African Union (55 member states, permanent member admitted under India's G20 Presidency in 2023)", flag: "🌍" }
    ],
    geopoliticalSignificance: "Global Biofuels Alliance, IMEC (India-Middle East-Europe Economic Corridor), Multilateral Development Bank reforms.",
    pyqHistory: "UPSC Prelims 2020 & 2023: Testing full list of G20 member countries (e.g. New Zealand, Switzerland, Netherlands are NOT members)."
  },
  {
    id: "sp-sco",
    waterBodyOrRegion: "SCO (Shanghai Cooperation Organisation - 10 Members)",
    category: "Multilateral Blocs",
    mnemonicWord: "K - K - R - U - T   I - P   I - B   (Central Asia + India/Pak/Iran/Belarus)",
    mnemonicExpansion: [
      { letter: "K", countryOrFeature: "Kazakhstan (Astana)", flag: "🇰🇿" },
      { letter: "K", countryOrFeature: "Kyrgyzstan (Bishkek)", flag: "🇰🇬" },
      { letter: "R", countryOrFeature: "Russia (Moscow)", flag: "🇷🇺" },
      { letter: "U", countryOrFeature: "Uzbekistan (Tashkent - RATS headquarters)", flag: "🇺🇿" },
      { letter: "T", countryOrFeature: "Tajikistan (Dushanbe; Turkmenistan is NOT a member!)", flag: "🇹🇯" },
      { letter: "I", countryOrFeature: "India (Joined 2017 at Astana summit)", flag: "🇮🇳" },
      { letter: "P", countryOrFeature: "Pakistan (Joined 2017)", flag: "🇵🇰" },
      { letter: "I", countryOrFeature: "Iran (Joined 2023 as 9th member under India's chair)", flag: "🇮🇷" },
      { letter: "B", countryOrFeature: "Belarus (Joined 2024 as 10th member at Astana)", flag: "🇧🇾" }
    ],
    geopoliticalSignificance: "RATS (Regional Anti-Terrorist Structure), Eurasian connectivity, Chahbahar corridor.",
    pyqHistory: "UPSC Prelims 2022 & 2024: Questions on SCO members (Turkmenistan is the perennial trap — it maintains permanent neutrality)."
  },
  {
    id: "sp-brics",
    waterBodyOrRegion: "BRICS+ (Expanded 10 Member Nations - 2024)",
    category: "Multilateral Blocs",
    mnemonicWord: "B - R - I - C - S   +   E - E - I - S - U   (Egypt, Ethiopia, Iran, Saudi, UAE)",
    mnemonicExpansion: [
      { letter: "B", countryOrFeature: "Brazil", flag: "🇧🇷" },
      { letter: "R", countryOrFeature: "Russia (Kazan Summit 2024)", flag: "🇷🇺" },
      { letter: "I", countryOrFeature: "India", flag: "🇮🇳" },
      { letter: "C", countryOrFeature: "China", flag: "🇨🇳" },
      { letter: "S", countryOrFeature: "South Africa", flag: "🇿🇦" },
      { letter: "+Egypt", countryOrFeature: "Egypt (Joined Jan 1, 2024)", flag: "🇪🇬" },
      { letter: "+Ethiopia", countryOrFeature: "Ethiopia (Joined Jan 1, 2024)", flag: "🇪🇹" },
      { letter: "+Iran", countryOrFeature: "Iran (Joined Jan 1, 2024)", flag: "🇮🇷" },
      { letter: "+Saudi", countryOrFeature: "Saudi Arabia (Invited member)", flag: "🇸🇦" },
      { letter: "+UAE", countryOrFeature: "United Arab Emirates (Joined Jan 1, 2024; Argentina withdrew under Javier Milei)", flag: "🇦🇪" }
    ],
    geopoliticalSignificance: "New Development Bank (NDB Shanghai), de-dollarization mechanisms, Global South advocacy.",
    pyqHistory: "UPSC Prelims 2015 & 2024: NDB headquarters, Contingent Reserve Arrangement (CRA), and newly admitted member states."
  }
];

// ============================================================================
// 3. RAMSAR WETLAND SITES & BIOSPHERE RESERVES
// ============================================================================
const RAMSAR_WETLANDS: RamsarSite[] = [
  {
    id: "ramsar-tn",
    name: "Point Calimere, Gulf of Mannar, Pichavaram & Vedanthangal (16 Sites)",
    state: "Tamil Nadu (#1 State in India with 16 Ramsar Sites)",
    yearDesignated: 2022,
    significance: "Highest concentration of Ramsar wetlands in any Indian state. Includes mangrove ecosystems, bird sanctuaries, and marine biospheres.",
    keyFaunaFlora: "Greater Flamingos, Olive Ridley Turtles, Dugong (Sea Cow), Rhizophora mangroves."
  },
  {
    id: "ramsar-up",
    name: "Upper Ganga, Bakhira, Haiderpur, Nawabganj, Saman, Sandi (10 Sites)",
    state: "Uttar Pradesh (#2 State in India with 10 Ramsar Sites)",
    yearDesignated: 2021,
    significance: "Crucial freshwater riverine and oxbow floodplain wetlands supporting migratory avian flyways along the Central Asian Flyway.",
    keyFaunaFlora: "Ganges River Dolphin, Gharial, Sarus Crane (UP State Bird), Swamp Deer (Barasingha)."
  },
  {
    id: "ramsar-montreux-loktak",
    name: "Loktak Lake (Keibul Lamjao National Park)",
    state: "Manipur",
    yearDesignated: 1990,
    significance: "Famous for 'Phumdis' (floating biomass islands). Only floating national park in the world. Enlisted on the Montreux Record since 1993.",
    keyFaunaFlora: "Sangai (Brow-antlered / Dancing Deer of Manipur - Endangered), Water Chestnut.",
    montreuxRecord: true
  },
  {
    id: "ramsar-montreux-keoladeo",
    name: "Keoladeo Ghana National Park (Bharatpur)",
    state: "Rajasthan",
    yearDesignated: 1981,
    significance: "Man-made wetland sanctuary fed by Gambhir & Banganga rivers. Placed on Montreux Record in 1990 due to water scarcity and invasive Paspalum.",
    keyFaunaFlora: "Wintering habitat of Siberian Crane (critically endangered), Painted Stork, Spot-billed Pelican.",
    montreuxRecord: true
  },
  {
    id: "ramsar-chilika",
    name: "Chilika Lake (First Indian Ramsar Site - 1981)",
    state: "Odisha",
    yearDesignated: 1981,
    significance: "Largest coastal brackish water lagoon in India. Successfully REMOVED from the Montreux Record in 2002 after successful ecological restoration (Ramsar Wetland Conservation Award).",
    keyFaunaFlora: "Irrawaddy Dolphin (flagship species), Nalabana Bird Sanctuary, Green Sea Turtle."
  },
  {
    id: "ramsar-ladakh",
    name: "Tso Kar & Tsomoriri High-Altitude Wetlands",
    state: "Ladakh UT",
    yearDesignated: 2020,
    significance: "Hyper-saline high-altitude wetland complex in the Changthang plateau at over 4,500m above sea level.",
    keyFaunaFlora: "Black-necked Crane (breeding ground), Bar-headed Goose, Tibetan Gazelle, Kiang (Tibetan Wild Ass)."
  },
  {
    id: "ramsar-kerala",
    name: "Vembanad-Kol, Ashtamudi & Sasthamkotta Lakes",
    state: "Kerala",
    yearDesignated: 2002,
    significance: "Vembanad-Kol is the longest lake in India and largest wetland in Kerala, home to the traditional Pokkali saline rice farming system (GIAHS).",
    keyFaunaFlora: "Neelakurinji catchment, Spot-billed Pelicans, endemic freshwater pearl spot (Karimeen)."
  },
  {
    id: "ramsar-assam",
    name: "Deepor Beel",
    state: "Assam",
    yearDesignated: 2002,
    significance: "Permanent freshwater oxbow lake in a former channel of the Brahmaputra River. Sole Ramsar site in Assam.",
    keyFaunaFlora: "Asian Elephants (major foraging corridor), Greater Adjutant Stork (Hargila), Spot-billed Pelican."
  },
  {
    id: "ramsar-sundarbans",
    name: "Sundarban Wetland (Largest Ramsar Site in India)",
    state: "West Bengal",
    yearDesignated: 2019,
    significance: "Largest contiguous mangrove forest in the world, covering delta of Ganga, Brahmaputra & Meghna rivers.",
    keyFaunaFlora: "Royal Bengal Tiger (only mangrove tiger habitat), Saltwater Crocodile, Batagur baska (Northern River Terrapin)."
  }
];

// ============================================================================
// 4. LANDMARK CONSTITUTIONAL AMENDMENTS (1st to 106th CAA)
// ============================================================================
const CONSTITUTIONAL_AMENDMENTS: ConstitutionalAmendment[] = [
  {
    id: "caa-106",
    actName: "106th Constitutional Amendment Act, 2023",
    year: 2023,
    keyArticlesModified: ["Article 330A", "Article 332A", "Article 239AA", "Article 334A"],
    coreProvisions: [
      "Nari Shakti Vandan Adhiniyam: Provides 33% (one-third) horizontal reservation for women in Lok Sabha, State Legislative Assemblies, and the National Capital Territory of Delhi Assembly.",
      "Sunset Clause: Valid for an initial period of 15 years, with extension subject to parliamentary law.",
      "Implementation Trigger: Takes effect after the first census conducted post-enactment followed by delimitation exercise."
    ],
    landmarkJudgments: ["Affirmed parliamentary prerogative to enact affirmative action under Article 15(3)."],
    upscPrelimsRelevance: "UPSC Prelims 2024: Reservation does NOT apply to Rajya Sabha or State Legislative Councils."
  },
  {
    id: "caa-105",
    actName: "105th Constitutional Amendment Act, 2021",
    year: 2021,
    keyArticlesModified: ["Article 338B", "Article 342A", "Article 366(26C)"],
    coreProvisions: [
      "Restored the constitutional power of State Governments and Union Territories to independently identify and maintain their own State lists of Socially and Educationally Backward Classes (SEBCs / OBCs).",
      "Clarified that the President's notification under Article 342A applies only to the Central OBC List."
    ],
    landmarkJudgments: ["Overcame the Supreme Court's interpretation in the Maratha Reservation case (Jaishri Laxmanrao Patil v. Chief Minister, Maharashtra 2021)."],
    upscPrelimsRelevance: "UPSC Prelims 2022: Federal balance in affirmative action list classification."
  },
  {
    id: "caa-103",
    actName: "103rd Constitutional Amendment Act, 2019",
    year: 2019,
    keyArticlesModified: ["Article 15(6)", "Article 16(6)"],
    coreProvisions: [
      "Introduced up to 10% reservation for Economically Weaker Sections (EWS) of citizens in admissions to educational institutions (including private, aided or unaided, except minority institutions under Art 30(1)) and civil posts/appointments.",
      "EWS reservation is in addition to existing reservations (SC/ST/OBC) and exempts the 50% ceiling rule for economic criteria."
    ],
    landmarkJudgments: ["Janhit Abhiyan v. Union of India (2022) — 5-Judge Constitution Bench upheld the 103rd CAA by 3:2 majority."],
    upscPrelimsRelevance: "UPSC Prelims 2020 & 2023: EWS criteria eligibility and minority institution exemption."
  },
  {
    id: "caa-101",
    actName: "101st Constitutional Amendment Act, 2016",
    year: 2016,
    keyArticlesModified: ["Article 246A", "Article 269A", "Article 279A"],
    coreProvisions: [
      "Goods and Services Tax (GST): Subsumed multiple indirect taxes (Excise, VAT, Service Tax, Octroi) into a single destination-based consumption tax.",
      "Concurrent taxing power: Art 246A gives both Parliament and State Legislatures power to tax goods and services.",
      "GST Council (Art 279A): Federal body with Center holding 1/3rd voting weight and States combined holding 2/3rd voting weight; decisions require 3/4th weighted majority."
    ],
    landmarkJudgments: ["Union of India v. Mohit Minerals (2022) — Supreme Court ruled that GST Council recommendations have persuasive value, not binding mandates, preserving cooperative federalism."],
    upscPrelimsRelevance: "UPSC Prelims 2017, 2019, 2022: GST Council voting distribution and destination-based taxation."
  },
  {
    id: "caa-91",
    actName: "91st Constitutional Amendment Act, 2003",
    year: 2003,
    keyArticlesModified: ["Article 75(1A)", "Article 164(1A)", "Tenth Schedule"],
    coreProvisions: [
      "Capped Council of Ministers: The total number of Ministers (including PM/CM) cannot exceed 15% of the total strength of Lok Sabha or State Legislative Assembly.",
      "Minimum State Cabinet Size: State Council of Ministers cannot be less than 12 members (except UTs like Delhi with 10%).",
      "Anti-Defection Overhaul: Removed the 1/3rd split exemption in the Tenth Schedule — now only 2/3rd merger is protected."
    ],
    landmarkJudgments: ["Affirmed by Supreme Court in Kihoto Hollohan and Subhash Desai (Maharashtra Political Crisis 2023)."],
    upscPrelimsRelevance: "UPSC Prelims 2005 & 2022: 15% cap and deletion of split provision in Tenth Schedule."
  },
  {
    id: "caa-86",
    actName: "86th Constitutional Amendment Act, 2002",
    year: 2002,
    keyArticlesModified: ["Article 21A", "Article 45", "Article 51A(k)"],
    coreProvisions: [
      "Right to Education as a Fundamental Right: Made free and compulsory education for children aged 6 to 14 years a Fundamental Right under Article 21A.",
      "Substituted Article 45 (DPSP): State shall endeavor to provide early childhood care and education for all children until age 6.",
      "Added 11th Fundamental Duty: Article 51A(k) makes it the duty of every parent/guardian to provide educational opportunities to children aged 6–14."
    ],
    landmarkJudgments: ["Unni Krishnan (1993) & Society for Unaided Private Schools v. UOI (2012)."],
    upscPrelimsRelevance: "UPSC Prelims 2012, 2018: Simultaneous modification of Part III, Part IV, and Part IVA."
  },
  {
    id: "caa-73-74",
    actName: "73rd & 74th Constitutional Amendment Acts, 1992",
    year: 1992,
    keyArticlesModified: ["Part IX (Art 243-243O)", "Part IXA (Art 243P-243ZG)", "Eleventh Schedule", "Twelfth Schedule"],
    coreProvisions: [
      "Constitutionalized Local Self-Government: 3-tier Panchayati Raj System (Gram, Intermediate, District) and Urban Local Bodies (Nagar Panchayats, Municipal Councils, Municipal Corporations).",
      "Mandatory 1/3rd Women Reservation (Art 243D(3) & 243T(3)) including Chairpersons.",
      "State Election Commission (Art 243K) & State Finance Commission (Art 243I) every 5 years."
    ],
    landmarkJudgments: ["K. Krishna Murthy v. UOI (2010) — Triple Test conditions for OBC reservations in local body elections."],
    upscPrelimsRelevance: "UPSC Prelims 2013, 2016, 2021: Compulsory vs Voluntary provisions and Schedule 11/12 functional subjects."
  },
  {
    id: "caa-44",
    actName: "44th Constitutional Amendment Act, 1978",
    year: 1978,
    keyArticlesModified: ["Article 352", "Article 356", "Article 358", "Article 359", "Article 300A"],
    coreProvisions: [
      "National Emergency Safeguards: Replaced 'internal disturbance' with 'armed rebellion' in Article 352; required written advice of Union Cabinet.",
      "Protected Fundamental Rights: Articles 20 and 21 (Protection in respect of conviction & Right to Life/Liberty) CANNOT be suspended during National Emergency.",
      "Right to Property: Removed from Part III Fundamental Rights (Art 19(1)(f) & 31) and made a Constitutional / Legal Right under Article 300A."
    ],
    landmarkJudgments: ["Minerva Mills (1980) & K.S. Puttaswamy (Right to Privacy 2017)."],
    upscPrelimsRelevance: "UPSC Prelims 2019 & 2021: Non-suspendability of Articles 20 & 21 and status of Article 300A."
  },
  {
    id: "caa-42",
    actName: "42nd Constitutional Amendment Act, 1976 ('Mini-Constitution')",
    year: 1976,
    keyArticlesModified: ["Preamble", "Part IVA (Art 51A)", "Part XIVA (Art 323A/323B)", "Art 39A", "Art 43A", "Art 48A"],
    coreProvisions: [
      "Preamble Amendment: Added words 'Socialist', 'Secular', and 'Integrity' (only time Preamble was amended).",
      "Fundamental Duties: Added Part IVA containing 10 Fundamental Duties on the recommendations of Swaran Singh Committee.",
      "DPSPs Added: Equal justice and free legal aid (39A), Workers' participation in management (43A), Protection of environment and forests (48A).",
      "Seventh Schedule Shifts: Transferred 5 subjects from State List to Concurrent List (Education, Forests, Weights & Measures, Protection of wild animals/birds, Administration of justice)."
    ],
    landmarkJudgments: ["Minerva Mills (1980) struck down clauses granting absolute immunity to constitutional amendments and unlimited DPSP supremacy over FRs."],
    upscPrelimsRelevance: "UPSC Prelims 2017, 2020, 2023: Preamble keywords, Concurrent list transfers, and Swaran Singh committee."
  },
  {
    id: "caa-1",
    actName: "1st Constitutional Amendment Act, 1951",
    year: 1951,
    keyArticlesModified: ["Article 15(3)", "Article 19(2)", "Article 31A", "Article 31B", "Ninth Schedule"],
    coreProvisions: [
      "Ninth Schedule Created: Inserted Article 31B and 9th Schedule to protect land reform and agrarian laws from judicial review on ground of violating Fundamental Rights.",
      "Article 19(2) Restrictions: Added 'Public order', 'Friendly relations with foreign states', and 'Incitement to an offence' as reasonable restrictions on free speech.",
      "Empowered State: Enabled special provisions for the advancement of socially and educationally backward classes (Art 15(4))."
    ],
    landmarkJudgments: ["I.R. Coelho v. State of Tamil Nadu (2007) — Laws placed in the 9th Schedule after April 24, 1973 are open to judicial review if they violate the Basic Structure."],
    upscPrelimsRelevance: "UPSC Prelims 2018 & 2019: Prime Minister during 1st CAA (Jawaharlal Nehru) and I.R. Coelho cutoff date."
  }
];

export default function MnemonicIndexVault() {
  const [activeTab, setActiveTab] = useState<VaultTab>("indices");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpatialCategory, setSelectedSpatialCategory] = useState<string>("All");

  // Selected Detail States
  const [selectedIndex, setSelectedIndex] = useState<GlobalIndex>(GLOBAL_INDICES[0]);
  const [selectedMnemonic, setSelectedMnemonic] = useState<SpatialMnemonic>(SPATIAL_MNEMONICS[0]);
  const [selectedRamsar, setSelectedRamsar] = useState<RamsarSite>(RAMSAR_WETLANDS[0]);
  const [selectedCAA, setSelectedCAA] = useState<ConstitutionalAmendment>(CONSTITUTIONAL_AMENDMENTS[0]);

  // Filtered Lists
  const filteredIndices = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return GLOBAL_INDICES.filter(
      (idx) =>
        idx.name.toLowerCase().includes(q) ||
        idx.publishingBody.toLowerCase().includes(q) ||
        idx.upscRelevanceTakeaway.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredSpatial = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return SPATIAL_MNEMONICS.filter((m) => {
      const matchCat = selectedSpatialCategory === "All" || m.category === selectedSpatialCategory;
      const matchQ =
        !q ||
        m.waterBodyOrRegion.toLowerCase().includes(q) ||
        m.mnemonicWord.toLowerCase().includes(q) ||
        m.geopoliticalSignificance.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [searchQuery, selectedSpatialCategory]);

  const filteredRamsar = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return RAMSAR_WETLANDS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q) ||
        r.keyFaunaFlora.toLowerCase().includes(q) ||
        r.significance.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredCAA = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return CONSTITUTIONAL_AMENDMENTS.filter(
      (caa) =>
        caa.actName.toLowerCase().includes(q) ||
        caa.coreProvisions.some((p) => p.toLowerCase().includes(q)) ||
        caa.keyArticlesModified.some((a) => a.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080511] p-5 shadow-2xl backdrop-blur-2xl space-y-6">
      {/* HEADER & TAB SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-sm">
              🗃️
            </span>
            <h2 className="font-mono text-base font-black tracking-wide text-white sm:text-lg">
              The UPSC Mnemonic & Index Vault
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-0.5">
            Instant recall memory matrix for Global Reports, Strategic Chokepoints, Ramsar Wetlands & Constitutional Amendments
          </p>
        </div>

        {/* 4 PRIMARY NAVIGATION TABS */}
        <div className="flex flex-wrap rounded-2xl border border-white/10 bg-white/[0.03] p-1 gap-1">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("indices");
              setSearchQuery("");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold transition ${
              activeTab === "indices"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>📊</span>
            <span>Reports & Indices</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("spatial_mnemonics");
              setSearchQuery("");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold transition ${
              activeTab === "spatial_mnemonics"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-950/50"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>🗺️</span>
            <span>Seas & Blocs ({SPATIAL_MNEMONICS.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("ramsar_wetlands");
              setSearchQuery("");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold transition ${
              activeTab === "ramsar_wetlands"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-950/50"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>🌿</span>
            <span>Ramsar & Wetlands ({RAMSAR_WETLANDS.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("constitutional_amendments");
              setSearchQuery("");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold transition ${
              activeTab === "constitutional_amendments"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-950/50"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>📜</span>
            <span>Landmark CAAs (1st–106th)</span>
          </button>
        </div>
      </div>

      {/* QUICK SEARCH BAR */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder={`Search in ${
            activeTab === "indices"
              ? "reports, publishing bodies & indicators..."
              : activeTab === "spatial_mnemonics"
              ? "seas, mnemonics, straits & border countries..."
              : activeTab === "ramsar_wetlands"
              ? "wetlands, states, fauna & Montreux sites..."
              : "amendment acts, articles & landmark rulings..."
          }`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white outline-none placeholder:text-white/30 focus:border-purple-500"
        />
      </div>

      {/* =====================================================================
          TAB 1: GLOBAL INDICES & REPORTS MASTER
          ===================================================================== */}
      {activeTab === "indices" && (
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredIndices.map((idx) => (
              <button
                key={idx.id}
                onClick={() => {
                  sound.playHover();
                  setSelectedIndex(idx);
                }}
                className={`w-full rounded-2xl border p-3.5 text-left transition ${
                  selectedIndex.id === idx.id
                    ? "border-emerald-500 bg-emerald-500/20 text-white shadow-lg shadow-emerald-950/40"
                    : "border-white/5 bg-white/[0.02] text-white/70 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {idx.publishingBody}
                </span>
                <span className="text-xs font-bold text-white line-clamp-1">{idx.name}</span>
              </button>
            ))}
          </div>

          {/* RIGHT: INDEX ANATOMY */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
              <div>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  Published by: {selectedIndex.publishingBody}
                </span>
                <h3 className="mt-1 text-base font-black text-white">{selectedIndex.name}</h3>
                <p className="text-xs text-white/60">Frequency: {selectedIndex.frequency}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              {selectedIndex.coreDimensions.map((dim, i) => (
                <div key={i} className="rounded-xl border border-white/5 bg-black/40 p-3.5 space-y-1.5">
                  <span className="font-bold text-emerald-300">{dim.dimension}</span>
                  <ul className="space-y-1 text-white/80">
                    {dim.indicators.map((ind, j) => (
                      <li key={j} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/5 bg-black/30 p-3.5 text-xs text-white/90">
              <span className="font-bold text-amber-300">🇮🇳 India's Performance & Trends: </span>
              {selectedIndex.indiaRankAndScore}
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 text-xs text-emerald-200">
              <span className="font-bold text-emerald-300">🎯 UPSC Examiner Traps: </span>
              {selectedIndex.upscRelevanceTakeaway}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: SPATIAL SEAS & MULTILATERAL BLOCS
          ===================================================================== */}
      {activeTab === "spatial_mnemonics" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {(["All", "Sea Littorals", "Multilateral Blocs"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedSpatialCategory(cat)}
                className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
                  selectedSpatialCategory === cat
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-950/50"
                    : "bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredSpatial.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    sound.playHover();
                    setSelectedMnemonic(m);
                  }}
                  className={`w-full rounded-2xl border p-3.5 text-left transition ${
                    selectedMnemonic.id === m.id
                      ? "border-cyan-500 bg-cyan-500/20 text-white shadow-lg shadow-cyan-950/40"
                      : "border-white/5 bg-white/[0.02] text-white/70 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    {m.mnemonicWord}
                  </span>
                  <span className="text-xs font-bold text-white line-clamp-1">{m.waterBodyOrRegion}</span>
                </button>
              ))}
            </div>

            {/* RIGHT: MNEMONIC EXPANSION */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/10 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
                <div>
                  <span className="font-mono text-sm font-black text-cyan-400">
                    Mnemonic: {selectedMnemonic.mnemonicWord}
                  </span>
                  <h3 className="mt-0.5 text-base font-black text-white">{selectedMnemonic.waterBodyOrRegion}</h3>
                </div>
                <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
                  {selectedMnemonic.category}
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                {selectedMnemonic.mnemonicExpansion.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-black/40 p-2.5"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 font-mono font-black text-cyan-300">
                      {item.letter}
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-white">
                        {item.flag} {item.countryOrFeature}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-xl border border-white/5 bg-black/30 p-3.5">
                  <span className="font-bold text-cyan-300">🌐 Geopolitical Strategic Chokepoint:</span>
                  <p className="mt-1 text-white/80">{selectedMnemonic.geopoliticalSignificance}</p>
                </div>

                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3.5">
                  <span className="font-bold text-cyan-400">📝 UPSC Past Year Paper History:</span>
                  <p className="mt-1 text-white/90">{selectedMnemonic.pyqHistory}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: RAMSAR WETLAND SITES & BIOSPHERE RESERVES
          ===================================================================== */}
      {activeTab === "ramsar_wetlands" && (
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredRamsar.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  sound.playHover();
                  setSelectedRamsar(r);
                }}
                className={`w-full rounded-2xl border p-3.5 text-left transition ${
                  selectedRamsar.id === r.id
                    ? "border-amber-500 bg-amber-500/20 text-white shadow-lg shadow-amber-950/40"
                    : "border-white/5 bg-white/[0.02] text-white/70 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {r.state}
                  </span>
                  {r.montreuxRecord && (
                    <span className="rounded-full bg-red-500/20 px-2 py-0.2 text-[9px] font-black text-red-300 border border-red-500/30">
                      Montreux Record
                    </span>
                  )}
                </div>
                <span className="mt-1 text-xs font-bold text-white line-clamp-1">{r.name}</span>
              </button>
            ))}
          </div>

          {/* RIGHT: RAMSAR SITE ANATOMY */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400">Location: {selectedRamsar.state}</span>
                <h3 className="mt-0.5 text-base font-black text-white">{selectedRamsar.name}</h3>
                <p className="text-xs text-white/60">Designated: {selectedRamsar.yearDesignated}</p>
              </div>

              {selectedRamsar.montreuxRecord && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-200">
                  ⚠️ <strong>Montreux Record Listed Site</strong> (Threat of ecological change)
                </div>
              )}
            </div>

            <div className="rounded-xl border border-white/5 bg-black/40 p-4 text-xs space-y-2">
              <span className="font-bold text-amber-300">🌿 Ecological Importance & Hydrology:</span>
              <p className="text-white/85 leading-relaxed">{selectedRamsar.significance}</p>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs space-y-2">
              <span className="font-bold text-amber-300">🦩 Key Flora, Fauna & Flagship Species:</span>
              <p className="text-amber-100 leading-relaxed">{selectedRamsar.keyFaunaFlora}</p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: LANDMARK CONSTITUTIONAL AMENDMENTS (1st to 106th CAA)
          ===================================================================== */}
      {activeTab === "constitutional_amendments" && (
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredCAA.map((caa) => (
              <button
                key={caa.id}
                onClick={() => {
                  sound.playHover();
                  setSelectedCAA(caa);
                }}
                className={`w-full rounded-2xl border p-3.5 text-left transition ${
                  selectedCAA.id === caa.id
                    ? "border-purple-500 bg-purple-500/20 text-white shadow-lg shadow-purple-950/40"
                    : "border-white/5 bg-white/[0.02] text-white/70 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Year {caa.year}
                </span>
                <span className="text-xs font-bold text-white line-clamp-1">{caa.actName}</span>
              </button>
            ))}
          </div>

          {/* RIGHT: CAA DETAILS */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/10 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-500/20 pb-3">
              <div>
                <span className="text-xs font-bold text-purple-400">Enacted Year: {selectedCAA.year}</span>
                <h3 className="mt-0.5 text-base font-black text-white">{selectedCAA.actName}</h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedCAA.keyArticlesModified.map((art, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-300"
                  >
                    {art}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/40 p-4 text-xs space-y-2">
              <span className="font-bold text-purple-300">⚖️ Key Constitutional Provisions:</span>
              <ul className="space-y-1.5 text-white/85">
                {selectedCAA.coreProvisions.map((prov, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-purple-400">▸</span>
                    <span>{prov}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedCAA.landmarkJudgments.length > 0 && (
              <div className="rounded-xl border border-white/5 bg-black/30 p-3.5 text-xs text-white/90">
                <span className="font-bold text-pink-300">🏛️ Landmark Supreme Court Rulings: </span>
                {selectedCAA.landmarkJudgments.join(" · ")}
              </div>
            )}

            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5 text-xs text-purple-200">
              <span className="font-bold text-purple-300">🎯 UPSC Examiner Angle: </span>
              {selectedCAA.upscPrelimsRelevance}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
