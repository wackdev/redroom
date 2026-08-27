import fs from "fs";
import path from "path";

const gs3Subjects = [
  {
    id: "gs3-economy",
    name: "Indian Economy & Macroeconomics",
    slug: "indian-economy-macroeconomics",
    description: "Planning, national income, growth & employment, fiscal policy, monetary policy, banking, external sector.",
    parent_id: null,
    exam_stage: "BOTH",
    paper: "GS-3",
    subject: "Economy",
    importance: "CRITICAL",
    display_order: 1,
    units: [
      {
        id: "eco-unit-01",
        name: "National Income, Planning & Growth",
        slug: "national-income-planning-growth",
        description: "GDP, GNP, NDP, NNP, Five-year plans evolution, NITI Aayog, inclusive growth, inequality.",
        importance: "CRITICAL",
        display_order: 1,
        topics: [
          {
            id: "eco-top-01",
            name: "National Income & Growth Dynamics",
            slug: "national-income-growth",
            importance: "CRITICAL",
            display_order: 1,
            subtopics: [
              "National Income accounting: GDP, GNP, NDP, NNP at Factor Cost vs Market Price",
              "Real vs Nominal GDP, GDP Deflator, Gross Value Added (GVA) calculation",
              "Economic Growth vs Economic Development, Human Development Index (HDI), Multidimensional Poverty Index (MPI)",
              "Planning in India: Historical background (Harrod-Domar, Mahalanobis models), Five Year Plans analysis",
              "Transition to NITI Aayog: Structure, functions, Governing Council, Action Agenda, 7-year Strategy",
              "Inclusive Growth and employment generation: Jobless growth debate, informal sector transition, gig economy"
            ]
          }
        ]
      },
      {
        id: "eco-unit-02",
        name: "Fiscal Policy, Budgeting & Taxation",
        slug: "fiscal-policy-budgeting",
        description: "Union Budget, FRBM Act, fiscal deficits, GST, direct & indirect tax reforms.",
        importance: "CRITICAL",
        display_order: 2,
        topics: [
          {
            id: "eco-top-02",
            name: "Government Budgeting & Deficits",
            slug: "government-budgeting-deficits",
            importance: "CRITICAL",
            display_order: 1,
            subtopics: [
              "Budget terminology: Revenue Receipts vs Capital Receipts, Revenue Expenditure vs Capital Expenditure",
              "Types of Deficits: Fiscal Deficit, Revenue Deficit, Effective Revenue Deficit, Primary Deficit",
              "FRBM Act 2003: Targets, escape clauses, NK Singh Committee recommendations",
              "Debt-to-GDP ratio, internal vs external debt, market borrowings",
              "Taxation System: Direct Taxes (Income tax, Corporate tax), Indirect Taxes (GST, Customs duty, Excise)",
              "GST Architecture: Structure, Dual GST model, GST Council (Article 279A), GST compensation cess issues",
              "Base Erosion and Profit Shifting (BEPS), Global Minimum Corporate Tax (Pillar 1 & Pillar 2), Equalisation Levy"
            ]
          }
        ]
      },
      {
        id: "eco-unit-03",
        name: "Monetary Policy, Banking & Financial Markets",
        slug: "monetary-policy-banking",
        description: "RBI, MPC, inflation targeting, repo rates, NPAs, IBC, capital markets.",
        importance: "CRITICAL",
        display_order: 3,
        topics: [
          {
            id: "eco-top-03",
            name: "Monetary Framework, RBI & Inflation Targeting",
            slug: "monetary-framework-inflation",
            importance: "CRITICAL",
            display_order: 1,
            subtopics: [
              "Monetary Policy Committee (MPC): Composition, mandate (Flexible Inflation Targeting 4% +/- 2%)",
              "Monetary Policy Tools: Quantitative (Repo, Reverse Repo, SDF, MSF, CRR, SLR) vs Qualitative (Margin requirements)",
              "Inflation dynamics: Consumer Price Index (CPI) vs Wholesale Price Index (WPI), Headline vs Core inflation",
              "Liquidity Management: Standing Deposit Facility (SDF), Long Term Repo Operations (LTRO), Open Market Operations (OMO)"
            ]
          },
          {
            id: "eco-top-04",
            name: "Banking Sector, NPAs & Insolvency",
            slug: "banking-sector-npas-ibc",
            importance: "CRITICAL",
            display_order: 2,
            subtopics: [
              "Banking Structure in India: Commercial Banks, RRBs, Cooperative Banks, Small Finance Banks, Payments Banks",
              "Non-Performing Assets (NPAs): Gross vs Net NPAs, Twin Balance Sheet problem, Prompt Corrective Action (PCA) framework",
              "Bad Banks (National Asset Reconstruction Company Ltd - NARCL & IDRCL)",
              "Insolvency and Bankruptcy Code (IBC) 2016: Resolution process (CIRP), NCLT, IBBI, success and challenges",
              "Financial Inclusion: PMJDY, JAM Trinity, UPI revolution, Digital Banking Units (DBUs)",
              "Capital Markets: Primary vs Secondary market, SEBI regulation, FPI/FDI trends, Sovereign Green Bonds"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "gs3-agriculture",
    name: "Agriculture & Food Security",
    slug: "agriculture-food-security",
    description: "Cropping patterns, irrigation, MSP, farm subsidies, PDS, food processing, land reforms.",
    parent_id: null,
    exam_stage: "BOTH",
    paper: "GS-3",
    subject: "Agriculture",
    importance: "CRITICAL",
    display_order: 2,
    units: [
      {
        id: "agri-unit-01",
        name: "Cropping Patterns, Irrigation & Land Reforms",
        slug: "cropping-patterns-irrigation",
        description: "Crop types, precision irrigation, micro-irrigation, tenancy reforms, digitization.",
        importance: "CRITICAL",
        display_order: 1,
        topics: [
          {
            id: "agri-top-01",
            name: "Major Crops, Patterns & Irrigation Infrastructure",
            slug: "major-crops-irrigation",
            importance: "CRITICAL",
            display_order: 1,
            subtopics: [
              "Cropping Patterns in India: Kharif, Rabi, Zaid, shift towards cash crops and horticulture",
              "Millets / Nutri-cereals (Shree Anna): Nutritional security, climate resilience, International Year of Millets",
              "Irrigation Systems: Major, Medium, Minor irrigation, groundwater over-exploitation, canal networks",
              "Micro-irrigation: Drip and Sprinkler irrigation, PM Krishi Sinchayee Yojana (Per Drop More Crop)",
              "Land Reforms: Abolition of Intermediaries, Tenancy reforms, Land Ceilings, Bhoodan movement",
              "Digitization of Land Records: SVAMITVA scheme, Unique Land Parcel Identification Number (ULPIN)"
            ]
          }
        ]
      },
      {
        id: "agri-unit-02",
        name: "Subsidies, MSP, PDS & Food Processing",
        slug: "subsidies-msp-pds-processing",
        description: "Farm inputs subsidies, MSP calculation, NFSA, storage, supply chain, food processing industries.",
        importance: "CRITICAL",
        display_order: 2,
        topics: [
          {
            id: "agri-top-02",
            name: "Farm Subsidies, MSP & Public Distribution System",
            slug: "farm-subsidies-msp-pds",
            importance: "CRITICAL",
            display_order: 1,
            subtopics: [
              "Agricultural Subsidies: Direct vs Indirect subsidies, Fertilizer subsidy (Nano Urea, NBS), Power, Seed & Credit subsidies",
              "Minimum Support Price (MSP): CACP criteria (A2, A2+FL, C2 costs), Swaminathan Commission recommendations",
              "Public Distribution System (PDS): Buffer stocks, FCI procurement, Targeted PDS, One Nation One Ration Card (ONORC)",
              "National Food Security Act (NFSA) 2013: Coverage, entitlement, Antyodaya Anna Yojana (AAY)",
              "Agricultural Marketing Reforms: APMC Acts, Model APMC Act, e-NAM platform, Farmer Producer Organizations (FPOs)"
            ]
          },
          {
            id: "agri-top-03",
            name: "Food Processing Sector & Supply Chains",
            slug: "food-processing-supply-chains",
            importance: "HIGH",
            display_order: 2,
            subtopics: [
              "Food Processing Industries: Scope, significance, upstream and downstream linkages, employment generation",
              "Mega Food Parks Scheme, PM Kisan Sampada Yojana, Operation Greens (TOP to TOTAL)",
              "Cold chain infrastructure, post-harvest losses, supply chain bottlenecks",
              "Agricultural technology: AI in agriculture, Kisan Drones, Precision farming, Agri-tech startups"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "gs3-scitech",
    name: "Science & Technology",
    slug: "science-and-technology",
    description: "Biotechnology, Space tech, Defence, Nuclear energy, Nanotechnology, AI, Quantum computing, IPR.",
    parent_id: null,
    exam_stage: "BOTH",
    paper: "GS-3",
    subject: "Science & Technology",
    importance: "CRITICAL",
    display_order: 3,
    units: [
      {
        id: "sci-unit-01",
        name: "Biotechnology, Genetics & Health Sciences",
        slug: "biotechnology-genetics-health",
        description: "CRISPR-Cas9, Stem cells, GM crops, vaccines, Antimicrobial Resistance, Rare diseases.",
        importance: "CRITICAL",
        display_order: 1,
        topics: [
          {
            id: "sci-top-01",
            name: "Gene Editing, Stem Cells & Medical Tech",
            slug: "gene-editing-stem-cells",
            importance: "CRITICAL",
            display_order: 1,
            subtopics: [
              "Recombinant DNA Technology, Genomic sequencing, Human Genome Project, GenomeIndia project",
              "CRISPR-Cas9 Gene Editing technology, base editing, prime editing, ethical concerns of designer babies",
              "Stem Cell Therapy: Pluripotent stem cells, therapeutic cloning, regenerative medicine",
              "Genetically Modified (GM) Crops: Bt Cotton, Bt Brinjal, GM Mustard (DMH-11), GEAC regulatory framework",
              "Vaccines Technology: mRNA vaccines, viral vector, DNA vaccines, protein subunit vaccines",
              "Antimicrobial Resistance (AMR): Superbugs, One Health approach, National Action Plan on AMR"
            ]
          }
        ]
      },
      {
        id: "sci-unit-02",
        name: "Space Technology, Defence & Nuclear Energy",
        slug: "space-defence-nuclear",
        description: "ISRO missions, launch vehicles, satellite systems, missile programs, nuclear reactors.",
        importance: "CRITICAL",
        display_order: 2,
        topics: [
          {
            id: "sci-top-02",
            name: "Space Exploration & Indian Missions",
            slug: "space-exploration-missions",
            importance: "CRITICAL",
            display_order: 1,
            subtopics: [
              "Types of Orbits: Low Earth Orbit (LEO), Sun-Synchronous, Geostationary (GEO), Polar orbits",
              "Launch Vehicles: PSLV, GSLV Mk III (LVM3), SSLV, Reusable Launch Vehicle (RLV-TD)",
              "Major ISRO Missions: Chandrayaan-3, Aditya-L1 (Lagrange Point 1), Gaganyaan (Human spaceflight), XPoSat",
              "NavIC (IRNSS) Satellite Navigation System vs GPS, Galileo, GLONASS, BeiDou",
              "Commercialization of Indian Space: IN-SPACe, NewSpace India Limited (NSIL), Indian Space Policy 2023",
              "Space debris issues, Kessler syndrome, Project NETRA, Artemis Accords"
            ]
          },
          {
            id: "sci-top-03",
            name: "Defence Technology & Nuclear Energy",
            slug: "defence-nuclear-energy",
            importance: "CRITICAL",
            display_order: 2,
            subtopics: [
              "Missile Systems: Ballistic vs Cruise Missiles, Agni series, Prithvi, BrahMos, Akash, Astra, Pinaka",
              "Integrated Guided Missile Development Programme (IGMDP) legacy",
              "Air Defense Systems: S-400 Triumf, BMD (Prithvi Air Defence & Advanced Air Defence), Iron Dome concept",
              "Indigenization of Defence: Make in India in defence, INS Vikrant (IAC-1), Tejas Mk1A, Project 75 submarines",
              "Nuclear Energy: Nuclear fission vs fusion, Three-Stage Indian Nuclear Power Programme (Thorium utilization)",
              "Nuclear safety, AERB, DAE, Civil Liability for Nuclear Damage Act, International Atomic Energy Agency (IAEA) safeguards"
            ]
          }
        ]
      },
      {
        id: "sci-unit-03",
        name: "IT, AI, Quantum, Nano & Emerging Tech",
        slug: "it-ai-quantum-nano",
        description: "Artificial Intelligence, Quantum Mission, Semiconductor Mission, Cyber security, IPR.",
        importance: "CRITICAL",
        display_order: 3,
        topics: [
          {
            id: "sci-top-04",
            name: "Frontier Technologies: AI, Quantum & Semiconductors",
            slug: "frontier-technologies",
            importance: "CRITICAL",
            display_order: 1,
            subtopics: [
              "Artificial Intelligence, Generative AI (LLMs), deepfakes, ethics of AI, IndiaAI Mission",
              "National Quantum Mission: Quantum computing, quantum key distribution (QKD), qubits, quantum supremacy",
              "India Semiconductor Mission (ISM): Fabrication plants, packaging, chip design ecosystem",
              "Nanotechnology: Nanomaterials, carbon nanotubes, graphene, applications in medicine, agriculture, textiles",
              "Cybersecurity: Malware, ransomware, zero-day vulnerabilities, CERT-In, National Cyber Security Policy",
              "Intellectual Property Rights (IPR): Patents, Copyrights, Trademarks, Geographical Indications (GI), TRIPS agreement"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "gs3-environment",
    name: "Environment, Ecology & Biodiversity",
    slug: "environment-ecology-biodiversity",
    description: "Ecosystems, biodiversity conservation, pollution, climate change, international treaties, renewable energy.",
    parent_id: null,
    exam_stage: "BOTH",
    paper: "GS-3",
    subject: "Environment",
    importance: "CRITICAL",
    display_order: 4,
    units: [
      {
        id: "env-unit-01",
        name: "Ecosystem Dynamics & Biodiversity Conservation",
        slug: "ecosystems-biodiversity-conservation",
        description: "Trophic levels, biogeochemical cycles, protected areas, Ramsar wetlands, IUCN status.",
        importance: "CRITICAL",
        display_order: 1,
        topics: [
          {
            id: "env-top-01",
            name: "Ecosystem Principles & Energy Flow",
            slug: "ecosystem-principles-energy",
            importance: "CRITICAL",
            display_order: 1,
            subtopics: [
              "Ecology concepts: Habitat, Ecological Niche, Ecotone, Edge effect, Keystone species, Indicator species",
              "Energy Flow in Ecosystems: Food chain, Food web, Ecological Pyramids (Number, Biomass, Energy)",
              "Biogeochemical Cycles: Carbon, Nitrogen, Phosphorus, Sulphur, Water cycles",
              "Ecological Succession: Primary vs Secondary succession, Pioneer species, Climax community"
            ]
          },
          {
            id: "env-top-02",
            name: "Biodiversity Conservation & Protected Areas",
            slug: "biodiversity-protected-areas",
            importance: "CRITICAL",
            display_order: 2,
            subtopics: [
              "Levels of Biodiversity: Genetic, Species, Ecological diversity, Biodiversity Hotspots (Western Ghats, Indo-Burma, Himalayas, Sundaland)",
              "In-situ Conservation: National Parks, Wildlife Sanctuaries, Biosphere Reserves (MAB program), Conservation Reserves",
              "Ex-situ Conservation: Zoos, Botanical gardens, Seed banks, Cryopreservation",
              "Flagship Species conservation: Project Tiger, Project Elephant, Project Cheetah, Project Dolphin, Great Indian Bustard",
              "IUCN Red List Categories: Critically Endangered, Endangered, Vulnerable species of India",
              "Wetlands and Coral Reefs: Ramsar Convention, Montreux Record, Coastal Regulation Zone (CRZ) norms, Blue Flag beaches"
            ]
          }
        ]
      },
      {
        id: "env-unit-02",
        name: "Environmental Pollution, Laws & Climate Change",
        slug: "pollution-laws-climate-change",
        description: "Air, water, plastic pollution, EIA, Wildlife Protection Act, UNFCCC, Paris Agreement.",
        importance: "CRITICAL",
        display_order: 2,
        topics: [
          {
            id: "env-top-03",
            name: "Pollution, Waste Management & Legislation",
            slug: "pollution-waste-legislation",
            importance: "CRITICAL",
            display_order: 1,
            subtopics: [
              "Air Pollution: National Clean Air Programme (NCAP), Air Quality Index (AQI), GRAP, BS-VI emission norms, stubble burning",
              "Water Pollution: Eutrophication, Biological Oxygen Demand (BOD), Namami Gange programme",
              "Waste Management Rules: Solid Waste, Plastic Waste (Extended Producer Responsibility), E-Waste, Bio-medical Waste",
              "Environmental Impact Assessment (EIA): Process, public hearing, draft EIA 2020 notification controversies",
              "Environmental Statutes: Wildlife (Protection) Act 1972 (2022 Amendment), Water Act 1974, Air Act 1981, Environment (Protection) Act 1986, Forest (Conservation) Act 1980",
              "Institutions: National Green Tribunal (NGT), Central Pollution Control Board (CPCB), National Biodiversity Authority (NBA)"
            ]
          },
          {
            id: "env-top-04",
            name: "Climate Change Dynamics & Global Conventions",
            slug: "climate-change-global-conventions",
            importance: "CRITICAL",
            display_order: 2,
            subtopics: [
              "Greenhouse Effect, Global Warming, Carbon budget, IPCC Reports (AR6 synthesis findings)",
              "Ozone Layer Depletion: Vienna Convention, Montreal Protocol and Kigali Amendment",
              "UNFCCC Framework: Kyoto Protocol (Clean Development Mechanism), Paris Agreement (Article 6 carbon markets)",
              "India's Climate Commitments: Panchamrit targets (COP26), Nationally Determined Contributions (NDCs), Net Zero by 2070",
              "Renewable Energy: International Solar Alliance (ISA), National Green Hydrogen Mission, PM-KUSUM, Offshore wind energy",
              "Global Environmental Conventions: UNCCD (Desertification, Land Degradation Neutrality), CBD (Kunming-Montreal Global Biodiversity Framework), Basel, Rotterdam, Stockholm Conventions"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "gs3-security-disaster",
    name: "Internal Security & Disaster Management",
    slug: "internal-security-disaster",
    description: "Border security, insurgency, terrorism, LWE, cyber warfare, money laundering, NDMA, Sendai Framework.",
    parent_id: null,
    exam_stage: "BOTH",
    paper: "GS-3",
    subject: "Internal Security",
    importance: "CRITICAL",
    display_order: 5,
    units: [
      {
        id: "sec-unit-01",
        name: "Internal Security Challenges & Extremism",
        slug: "security-challenges-extremism",
        description: "Left Wing Extremism, North-East insurgency, terrorism, border management, organized crime.",
        importance: "CRITICAL",
        display_order: 1,
        topics: [
          {
            id: "sec-top-01",
            name: "Extremism, Border Security & Terrorism",
            slug: "extremism-border-terrorism",
            importance: "CRITICAL",
            display_order: 1,
            subtopics: [
              "Left Wing Extremism (LWE): Causes (jal-jungle-jameen), SAMADHAN doctrine, surrender policies, greyhounds",
              "Insurgency in North-East India: Historical factors, peace accords (Naga Framework Agreement, Bodo Peace Accord), AFSPA debate",
              "Cross-border Terrorism & Proxy War: State and Non-state actors, radicalization, counter-terrorism framework (NIA, MAC, NATGRID)",
              "Border Management: Land borders with Pakistan, China, Bangladesh, Myanmar, Nepal; Comprehensive Integrated Border Management System (CIBMS)",
              "Coastal Security: 3-tier security architecture (Navy, Coast Guard, Marine Police), coastal radar networks",
              "Security Forces: Mandate and role of CAPF (BSF, CRPF, CISF, ITBP, SSB, Assam Rifles, NSG), Chief of Defence Staff (CDS) & Theaterisation"
            ]
          },
          {
            id: "sec-top-02",
            name: "Cyber Warfare, Money Laundering & Crime Nexus",
            slug: "cyber-warfare-money-laundering",
            importance: "CRITICAL",
            display_order: 2,
            subtopics: [
              "Cyber Warfare: Critical information infrastructure protection (NCIIPC), dark web, cyber-attacks on power grids, financial fraud",
              "Social Media and Security: Misinformation, fake news, deepfakes, mobilization of communal riots, IT Rules",
              "Money Laundering: Hawala, trade-based money laundering, Prevention of Money Laundering Act (PMLA), Financial Action Task Force (FATF)",
              "Organized Crime & Terrorism Nexus: Drug trafficking (Golden Crescent, Golden Triangle), arms smuggling, counterfeit currency"
            ]
          }
        ]
      },
      {
        id: "dm-unit-01",
        name: "Disaster Management & Resilience",
        slug: "disaster-management-resilience",
        description: "Natural & man-made disasters, NDMA Act 2005, NDMP, Sendai Framework, CDRI.",
        importance: "CRITICAL",
        display_order: 2,
        topics: [
          {
            id: "dm-top-01",
            name: "Disaster Preparedness, Institutional Framework & Sendai",
            slug: "disaster-preparedness-sendai",
            importance: "CRITICAL",
            display_order: 1,
            subtopics: [
              "Disaster Profile of India: Earthquakes (seismic zones), Floods, Cyclones, Droughts, Landslides, Glacial Lake Outburst Floods (GLOF)",
              "Man-made Disasters: Chemical (Bhopal gas tragedy), Biological, Radiological, Nuclear, Industrial fires",
              "Disaster Management Act 2005: Institutional setup (NDMA headed by PM, SDMA, DDMA, NDRF, NIDM)",
              "National Disaster Management Plan (NDMP): Prevention, Mitigation, Preparedness, Relief, Recovery & Reconstruction",
              "Early Warning Systems: INCOIS tsunami warning, IMD cyclone tracking radars, Doppler weather radars",
              "Global Frameworks: Sendai Framework for Disaster Risk Reduction (2015-2030) - 4 priorities, Coalition for Disaster Resilient Infrastructure (CDRI)"
            ]
          }
        ]
      }
    ]
  }
];

const outputPath = path.join(process.cwd(), "data", "syllabus", "gs3-economy-scitech-environment-security.json");
fs.writeFileSync(outputPath, JSON.stringify(gs3Subjects, null, 2), "utf-8");
console.log("Successfully generated GS-3 Syllabus at:", outputPath, "with", gs3Subjects.length, "Subjects.");
