"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { sound } from "@/lib/audio/sound-engine";

export interface GeoFeature {
  id: string;
  name: string;
  category: "monsoon" | "currents" | "tectonics" | "straits" | "rivers" | "biomes";
  categoryLabel: string;
  lat: number;
  lng: number;
  type: "point" | "current_warm" | "current_cold" | "trench" | "ridge" | "chokepoint";
  description: string;
  mainsSignificance: string;
  pyqNote: string;
}

const GLOBAL_GEO_DATASET: GeoFeature[] = [
  // ==========================================================================
  // 1. OCEAN CURRENTS (WARM & COLD) & GYRES
  // ==========================================================================
  {
    id: "gulf-stream",
    name: "Gulf Stream & North Atlantic Drift",
    category: "currents",
    categoryLabel: "Ocean Current (Warm)",
    lat: 32.0,
    lng: -75.0,
    type: "current_warm",
    description: "Powerful western boundary warm current originating in Gulf of Mexico. Transports equatorial heat to Northwestern Europe, keeping British & Scandinavian ports ice-free in winter.",
    mainsSignificance: "Core component of Atlantic Meridional Overturning Circulation (AMOC). Weakening of AMOC due to Greenland ice melt is a major climate tipping point.",
    pyqNote: "UPSC 2017: What are the consequences of the spreading of warm and cold currents on the marine life and regional climate?",
  },
  {
    id: "kuroshio-current",
    name: "Kuroshio (Japan) & Oyashio Convergence",
    category: "currents",
    categoryLabel: "Ocean Current (Warm/Cold)",
    lat: 35.0,
    lng: 142.0,
    type: "current_warm",
    description: "Convergence of warm Kuroshio from the south and cold nutrient-rich Oyashio from the north off the coast of Hokkaido, creating one of the world's richest pelagic fishing grounds (Grand Banks analogue).",
    mainsSignificance: "Dense advective fog formation and intense marine primary productivity due to thermal mixing and upwelling.",
    pyqNote: "UPSC 2013: Why are the world's major fishing grounds located at the confluence of warm and cold ocean currents?",
  },
  {
    id: "peru-humboldt",
    name: "Peru (Humboldt) Current & Upwelling",
    category: "currents",
    categoryLabel: "Ocean Current (Cold)",
    lat: -14.0,
    lng: -77.0,
    type: "current_cold",
    description: "Cold eastern boundary current flowing equatorward along the western coast of South America. Generates nutrient-rich coastal upwelling supporting the Peruvian anchoveta fishery and causing aridity in the Atacama Desert.",
    mainsSignificance: "During El Niño (warm phase of ENSO), upwelling is suppressed, triggering fishery collapse, South American flash floods, and Indian monsoon failure.",
    pyqNote: "UPSC 2021: How does the Southern Oscillation Index (SOI) and El Niño modulate the Indian Summer Monsoon?",
  },
  {
    id: "benguela-current",
    name: "Benguela Current & Namib Aridity",
    category: "currents",
    categoryLabel: "Ocean Current (Cold)",
    lat: -22.0,
    lng: 14.0,
    type: "current_cold",
    description: "Cold eastern boundary current of South Atlantic flowing past Southwest Africa. Atmospheric thermal inversion created by cold water prevents convection, producing the hyper-arid Namib and Kalahari Deserts.",
    mainsSignificance: "Classic example of western continental tropical desiccation caused by offshore trade winds and cold marine currents.",
    pyqNote: "UPSC 2019: Major hot deserts of the world are located on the western tropical margins of continents. Explain with geographical reasons.",
  },
  {
    id: "canary-current",
    name: "Canary Current & Sahara Desert Axis",
    category: "currents",
    categoryLabel: "Ocean Current (Cold)",
    lat: 25.0,
    lng: -16.0,
    type: "current_cold",
    description: "Cold current flowing southwards along the northwest coast of Africa. Desiccating influence reinforces the descending limb of the Hadley Cell, sustaining the hyper-aridity of the Sahara Desert.",
    mainsSignificance: "Interacts with Mediterranean outflow water, modulating North Atlantic subtropical gyre salinity.",
    pyqNote: "UPSC 2014: Discuss the factors responsible for the formation of the Sahara Desert.",
  },
  {
    id: "somali-current",
    name: "Somali Current & Arabian Sea Monsoon Inversion",
    category: "currents",
    categoryLabel: "Ocean Current (Reversible)",
    lat: 10.0,
    lng: 52.0,
    type: "current_warm",
    description: "Only major western boundary current that completely reverses direction twice a year in response to the seasonal shifts of the Asian Monsoon winds. Flows northeastward during SW monsoon with intense coastal upwelling.",
    mainsSignificance: "Upwelling cools sea surface temperatures in western Arabian Sea, intensifying the land-sea thermal gradient driving the Indian monsoon.",
    pyqNote: "UPSC 2015: What explains the unique reversal of currents in the Northern Indian Ocean compared to the Atlantic and Pacific Oceans?",
  },
  {
    id: "west-wind-drift",
    name: "Antarctic Circumpolar Current (West Wind Drift)",
    category: "currents",
    categoryLabel: "Circumpolar Current (Cold)",
    lat: -55.0,
    lng: 0.0,
    type: "current_cold",
    description: "World's largest ocean current flowing clockwise from west to east around Antarctica, driven by the Roaring Forties. Unobstructed by landmasses, it connects Atlantic, Pacific, and Indian Oceans.",
    mainsSignificance: "Acts as a thermal barrier insulating the Antarctic ice sheet from warm subtropical waters, regulating global thermohaline circulation.",
    pyqNote: "UPSC 2018: Explain the significance of the Antarctic Circumpolar Current in global climate regulation.",
  },

  // ==========================================================================
  // 2. MONSOON, ATMOSPHERIC CELLS & WIND BELTS
  // ==========================================================================
  {
    id: "sw-monsoon",
    name: "South-West Monsoon & Somali Low-Level Jet",
    category: "monsoon",
    categoryLabel: "Monsoon & Jet Streams",
    lat: 13.0,
    lng: 75.0,
    type: "point",
    description: "Driven by intense seasonal heating of Tibetan Plateau, northward shift of ITCZ, and the Tropical Easterly Jet (TEJ). Cross-equatorial flow channeled by Somali Jet delivers 75%+ of India's annual precipitation.",
    mainsSignificance: "Agrarian lifeline for Indian food security, kharif crop production, and hydroelectric reservoir replenishment.",
    pyqNote: "UPSC 2022: What is the role of the Tropical Easterly Jet (TEJ) and Tibetan heating in the onset of the Indian Summer Monsoon?",
  },
  {
    id: "itcz-belt",
    name: "Inter-Tropical Convergence Zone (ITCZ / Doldrums)",
    category: "monsoon",
    categoryLabel: "Atmospheric Convergence",
    lat: 5.0,
    lng: 80.0,
    type: "point",
    description: "Low-pressure belt encircling the globe near the equator where NE and SE Trade Winds converge, causing intense convective thunderstorms and calm winds (Doldrums).",
    mainsSignificance: "Seasonal thermal migration of ITCZ over the Indian subcontinent (Monsoon Trough) is the foundational catalyst of monsoonal rainfall.",
    pyqNote: "UPSC 2016: Discuss the concept of ITCZ and explain its impact on the seasonal shift of global wind and pressure belts.",
  },
  {
    id: "walker-circulation",
    name: "Walker Circulation & Indian Ocean Dipole (IOD)",
    category: "monsoon",
    categoryLabel: "Atmospheric Cell",
    lat: -2.0,
    lng: 90.0,
    type: "point",
    description: "Zonal atmospheric circulation across the equatorial Pacific and Indian oceans. Positive IOD (warmer western Indian Ocean) enhances Indian monsoon rainfall and offsets negative El Niño effects.",
    mainsSignificance: "Coupled ocean-atmosphere teleconnections governing extreme droughts and flood cycles across South Asia and Australia.",
    pyqNote: "UPSC 2020: Differentiate between El Niño Modoki and Conventional El Niño, and assess their influence on the Indian monsoon.",
  },
  {
    id: "roaring-forties",
    name: "Roaring Forties & Furious Fifties",
    category: "monsoon",
    categoryLabel: "Global Wind Belt",
    lat: -45.0,
    lng: 110.0,
    type: "point",
    description: "Persistent, powerful Westerly winds blowing between 40°S and 50°S latitudes in the Southern Hemisphere, intensified by the absence of commercial land barriers.",
    mainsSignificance: "Primary driver of the Antarctic Circumpolar Current and historical sailing clipper routes.",
    pyqNote: "UPSC 2011: Why are the westerlies much stronger and more constant in the Southern Hemisphere than in the Northern Hemisphere?",
  },

  // ==========================================================================
  // 3. PLATE TECTONICS, SEISMIC BELTS & TRENCHES
  // ==========================================================================
  {
    id: "ring-of-fire",
    name: "Circum-Pacific Ring of Fire (Subduction Arc)",
    category: "tectonics",
    categoryLabel: "Plate Tectonics & Volcanism",
    lat: 36.0,
    lng: 138.0,
    type: "trench",
    description: "40,000-km horseshoe-shaped zone of convergent plate boundaries where oceanic plates subduct beneath continental plates, generating 80%+ of world earthquakes and 75% of active volcanoes.",
    mainsSignificance: "Deep Wadati-Benioff zones, explosive andesitic flux melting volcanism, and catastrophic tsunami hazards.",
    pyqNote: "UPSC 2021: Differentiate the causes of earthquakes and volcanic eruptions along the Circum-Pacific Belt. Discuss their socio-economic impacts.",
  },
  {
    id: "himalayan-mbt-mct",
    name: "Himalayan Collision Zone: MBT, MCT & HFT",
    category: "tectonics",
    categoryLabel: "Continental Orogeny",
    lat: 29.5,
    lng: 81.0,
    type: "trench",
    description: "Active continent-continent collision between the Indian Plate and Eurasian Plate moving at ~5 cm/year. Main Central Thrust (MCT), Main Boundary Thrust (MBT), and Himalayan Frontal Thrust (HFT) accommodate intense compressive strain.",
    mainsSignificance: "High seismic vulnerability (Seismic Zone V), frequent cloudbursts, and glacio-fluvial landslide hazards.",
    pyqNote: "UPSC 2020: Why are the Himalayas highly prone to landslides and seismic hazards compared to the Western Ghats?",
  },
  {
    id: "mid-atlantic-ridge",
    name: "Mid-Atlantic Ridge (Divergent Boundary)",
    category: "tectonics",
    categoryLabel: "Seafloor Spreading",
    lat: 0.0,
    lng: -25.0,
    type: "ridge",
    description: "16,000-km submarine mountain range along divergent plate boundaries. Upwelling basaltic magma creates new oceanic crust through seafloor spreading (Hess theory) and paleomagnetic magnetic striping (Vine-Matthews).",
    mainsSignificance: "Hydrothermal vents (black smokers) hosting chemosynthetic deep-sea ecosystems.",
    pyqNote: "UPSC 2014: Explain the theory of Seafloor Spreading and how it validated Alfred Wegener's Continental Drift hypothesis.",
  },
  {
    id: "east-african-rift",
    name: "East African Rift Valley (Continental Rifting)",
    category: "tectonics",
    categoryLabel: "Continental Divergence",
    lat: -1.0,
    lng: 36.0,
    type: "ridge",
    description: "Active continental rift zone where the African Plate is splitting into the Somalian and Nubian plates. Extends from the Afar Triple Junction (Danakil Depression) southwards to Mozambique.",
    mainsSignificance: "Formation of graben lakes (Tanganyika, Malawi) and shield/stratovolcanoes (Kilimanjaro, Ol Doinyo Lengai).",
    pyqNote: "UPSC 2018: With reference to the East African Rift System, discuss the geomorphological features associated with continental rifting.",
  },
  {
    id: "mariana-trench",
    name: "Mariana Trench & Challenger Deep (10,994m)",
    category: "tectonics",
    categoryLabel: "Deepest Ocean Trench",
    lat: 11.3,
    lng: 142.2,
    type: "trench",
    description: "Deepest oceanic trench on Earth formed by the subduction of the dense Pacific Plate beneath the smaller Mariana Plate. Challenger Deep reaches a depth of approximately 10,994 meters.",
    mainsSignificance: "Extreme hydrostatic pressure (1,000+ atmospheres) and cold seep habitats containing extremophile biodiversity.",
    pyqNote: "UPSC 2016: What are ocean trenches and how do they relate to island arcs and volcanic activity?",
  },
  {
    id: "san-andreas",
    name: "San Andreas Transform Fault",
    category: "tectonics",
    categoryLabel: "Transform Boundary",
    lat: 35.1,
    lng: -119.6,
    type: "point",
    description: "1,200-km conservative transform fault zone in California where the Pacific Plate slides horizontally past the North American Plate, producing destructive shallow-focus earthquakes.",
    mainsSignificance: "Classic textbook model of strike-slip faulting and earthquake elastic-rebound theory.",
    pyqNote: "UPSC 2019: Distinguish between convergent, divergent, and transform plate boundaries with global geographical examples.",
  },

  // ==========================================================================
  // 4. STRATEGIC STRAITS & MARITIME CHOKEPOINTS
  // ==========================================================================
  {
    id: "strait-malacca",
    name: "Strait of Malacca (Primary Energy Conduit)",
    category: "straits",
    categoryLabel: "Maritime Chokepoint",
    lat: 2.5,
    lng: 101.5,
    type: "chokepoint",
    description: "Narrow 800-km waterway between the Malay Peninsula and Sumatra, connecting the Indian Ocean to the South China Sea. Over 25% of global traded goods and 80% of China's crude oil imports transit this strait.",
    mainsSignificance: "Vulnerable to 'Malacca Dilemma'; geopolitical pivot point for Indo-Pacific maritime security and Quad naval surveillance.",
    pyqNote: "UPSC 2022: Discuss the geopolitical and strategic significance of the Malacca Strait in the emerging Indo-Pacific architecture.",
  },
  {
    id: "strait-hormuz",
    name: "Strait of Hormuz (World Petroleum Lifeline)",
    category: "straits",
    categoryLabel: "Oil Chokepoint",
    lat: 26.5,
    lng: 56.5,
    type: "chokepoint",
    description: "Strategic waterway separating Oman and Iran connecting the Persian Gulf with the Gulf of Oman. Handles ~21 million barrels of petroleum per day (~20% of global petroleum consumption).",
    mainsSignificance: "Vital for India's energy security (60%+ crude imported from Gulf). Chokepoint volatility causes immediate global oil price spikes.",
    pyqNote: "UPSC 2020: Examine the strategic importance of the Strait of Hormuz for India's energy security and geopolitical stability.",
  },
  {
    id: "bab-el-mandeb",
    name: "Bab-el-Mandeb & Red Sea Gateway",
    category: "straits",
    categoryLabel: "Maritime Chokepoint",
    lat: 12.6,
    lng: 43.3,
    type: "chokepoint",
    description: "The 'Gate of Tears' strait connecting the Red Sea to the Gulf of Aden and Arabian Sea, flanked by Yemen and Djibouti/Eritrea. Essential southern entry for all vessels navigating the Suez Canal.",
    mainsSignificance: "Target of maritime security attacks (Houthi naval interdictions) forcing global shipping to reroute around Cape of Good Hope, spiking freight costs.",
    pyqNote: "UPSC 2024: How does maritime insecurity in the Red Sea and Bab-el-Mandeb disrupt global supply chains and Indian trade?",
  },
  {
    id: "suez-canal",
    name: "Suez Canal & Mediterranean Axis",
    category: "straits",
    categoryLabel: "Artificial Canal",
    lat: 30.5,
    lng: 32.3,
    type: "chokepoint",
    description: "193-km artificial sea-level waterway in Egypt connecting the Mediterranean Sea to the Red Sea, eliminating the 7,000-km circumnavigation of Africa for Europe-Asia shipping.",
    mainsSignificance: "Handles ~12% of world trade. Alternative multimodal routes like IMEC (India-Middle East-Europe Corridor) seek to de-risk Suez dependency.",
    pyqNote: "UPSC 2021: Discuss the economic implications of the Suez Canal obstruction on global trade and India's exports.",
  },
  {
    id: "panama-canal",
    name: "Panama Canal (Atlantic-Pacific Gateway)",
    category: "straits",
    categoryLabel: "Lock Canal",
    lat: 9.0,
    lng: -79.6,
    type: "chokepoint",
    description: "82-km artificial lock waterway cutting across the Isthmus of Panama. Freshwater locks fed by Lake Gatun lift ships 26 meters above sea level to transit between Atlantic and Pacific oceans.",
    mainsSignificance: "Severe climate-induced droughts in Gatun Lake restrict daily vessel transits, illustrating freshwater vulnerability in global transport infrastructure.",
    pyqNote: "UPSC 2023: What are the geographic challenges confronting the Panama Canal amidst changing global precipitation patterns?",
  },
  {
    id: "strait-gibraltar",
    name: "Strait of Gibraltar (Pillars of Hercules)",
    category: "straits",
    categoryLabel: "Inter-Continental Strait",
    lat: 35.9,
    lng: -5.6,
    type: "chokepoint",
    description: "Narrow 14-km strait connecting the Atlantic Ocean to the Mediterranean Sea and separating Spain from Morocco. Features a two-layer water exchange: light Atlantic surface water flows in, dense saline Mediterranean water flows out at depth.",
    mainsSignificance: "Key geopolitical maritime gateway controlling access to Mediterranean shipping routes.",
    pyqNote: "UPSC 2017: Trace the geographical features and salinity distribution differences between the Mediterranean Sea and the open Atlantic.",
  },

  // ==========================================================================
  // 5. MAJOR RIVER BASINS & HYDROLOGICAL DELTAS
  // ==========================================================================
  {
    id: "ganga-brahmaputra",
    name: "Ganga-Brahmaputra-Meghna Delta & Sundarbans",
    category: "rivers",
    categoryLabel: "World's Largest Delta",
    lat: 23.0,
    lng: 89.5,
    type: "point",
    description: "Combined alluvial delta spanning India and Bangladesh. World's largest mangrove forest (Sundarbans UNESCO World Heritage Site) providing a protective bioshield against Bay of Bengal tropical cyclones.",
    mainsSignificance: "Supports 400+ million people with intensive agriculture; highly vulnerable to climate sea-level rise and salinity ingress.",
    pyqNote: "UPSC 2019: Discuss the ecological significance of the Sundarbans mangrove delta and the threats it faces from climate change.",
  },
  {
    id: "indus-basin",
    name: "Indus River Basin & Panjnad Tributaries",
    category: "rivers",
    categoryLabel: "Antecedent River System",
    lat: 31.5,
    lng: 72.0,
    type: "point",
    description: "Major transboundary Himalayan river originating near Lake Mansarovar. Sustained by five Punjab tributaries (Jhelum, Chenab, Ravi, Beas, Satluj) and governed by the Indus Waters Treaty (1960).",
    mainsSignificance: "Powers the canal irrigation breadbaskets of Punjab, Haryana, and Pakistan's Indus plains.",
    pyqNote: "UPSC 2021: With reference to the Indus Waters Treaty, discuss the allocation of eastern and western rivers and its strategic significance.",
  },
  {
    id: "amazon-basin",
    name: "Amazon River Basin & Tropical Rainforest",
    category: "rivers",
    categoryLabel: "Largest River Basin",
    lat: -3.4,
    lng: -62.2,
    type: "point",
    description: "Largest drainage basin and greatest freshwater discharge in the world (~20% of global river discharge). Dense tropical rainforest ('Lungs of the Earth') sequestering massive planetary carbon.",
    mainsSignificance: "Critical global carbon sink and biodiversity reservoir; threatened by deforestation, cattle ranching, and agricultural frontier expansion.",
    pyqNote: "UPSC 2020: Discuss the causes and global ecological consequences of deforestation in the Amazon Rainforest basin.",
  },
  {
    id: "nile-basin",
    name: "Nile River Basin & GERD Hydropolitical Axis",
    category: "rivers",
    categoryLabel: "Longest River (6,650 km)",
    lat: 15.6,
    lng: 32.5,
    type: "point",
    description: "Confluence of the White Nile (originating Lake Victoria) and Blue Nile (Lake Tana, Ethiopia) at Khartoum, flowing northwards through the Sahara to the Mediterranean delta.",
    mainsSignificance: "Construction of the Grand Ethiopian Renaissance Dam (GERD) on the Blue Nile is a major hydropolitical flashpoint between Ethiopia, Sudan, and Egypt.",
    pyqNote: "UPSC 2022: Examine the hydropolitical disputes over transboundary water sharing in the Nile River Basin.",
  },

  // ==========================================================================
  // 6. BIOMES, DESERTS & EXTREME GEOGRAPHY
  // ==========================================================================
  {
    id: "western-ghats",
    name: "Western Ghats (Sahyadri) Biodiversity Hotspot",
    category: "biomes",
    categoryLabel: "UNESCO Hotspot",
    lat: 11.5,
    lng: 76.5,
    type: "point",
    description: "1,600-km mountain escarpment older than the Himalayas, exhibiting exceptionally high biological endemism (Nilgiri Tahr, Lion-tailed Macaque, Shola-grassland mosaic).",
    mainsSignificance: "Acts as an orographic barrier capturing SW monsoon clouds; governed by Madhav Gadgil and K. Kasturirangan ecological committee frameworks.",
    pyqNote: "UPSC 2018: Compare the ecological vulnerability of the Western Ghats and Eastern Ghats and discuss conservation strategies.",
  },
  {
    id: "atacama-desert",
    name: "Atacama Desert (Driest Non-Polar Desert)",
    category: "biomes",
    categoryLabel: "Hyper-Arid Rainshadow",
    lat: -23.8,
    lng: -69.2,
    type: "point",
    description: "Hyper-arid plateau in Northern Chile trapped between the Andes Mountains (eastern rainshadow) and the cold Peru Current (coastal thermal inversion). Some weather stations have recorded zero rain in recorded history.",
    mainsSignificance: "Houses world's largest lithium brine reserves (Lithium Triangle: Chile, Bolivia, Argentina) and premier astronomical observatories (ALMA).",
    pyqNote: "UPSC 2021: Discuss the geostrategic importance of the 'Lithium Triangle' of South America for the global green energy transition.",
  },
  {
    id: "gobi-desert",
    name: "Gobi Desert & Central Asian Rainshadow",
    category: "biomes",
    categoryLabel: "Cold Continental Desert",
    lat: 44.0,
    lng: 105.0,
    type: "point",
    description: "Vast cold desert in Northern China and Southern Mongolia formed by extreme continentality and the immense rainshadow barrier of the Himalayan Plateau.",
    mainsSignificance: "Winter temperatures plunge below -40°C; severe source of Asian Dust Storms (Yellow Dust) impacting East Asian air quality.",
    pyqNote: "UPSC 2015: Differentiate between hot tropical deserts and mid-latitude cold continental deserts with suitable global examples.",
  },
];

export default function GeographyGlobe3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedFeature, setSelectedFeature] = useState<GeoFeature | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const rotationRef = useRef<number>(1.2);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);

  const filteredFeatures = useMemo(() => {
    if (activeCategory === "all") return GLOBAL_GEO_DATASET;
    return GLOBAL_GEO_DATASET.filter((f) => f.category === activeCategory);
  }, [activeCategory]);

  const filteredFeaturesRef = useRef<GeoFeature[]>(filteredFeatures);
  filteredFeaturesRef.current = filteredFeatures;

  const selectedFeatureRef = useRef<GeoFeature | null>(selectedFeature);
  selectedFeatureRef.current = selectedFeature;

  // Set default selected feature on mount
  useEffect(() => {
    if (filteredFeatures.length > 0 && !selectedFeature) {
      setSelectedFeature(filteredFeatures[0]);
    }
  }, [filteredFeatures, selectedFeature]);

  // 3D Interactive Canvas Globe Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 480);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const render = () => {
      ctx.fillStyle = "#040407";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width * 0.38, 175);

      if (autoRotate && !isDraggingRef.current) {
        rotationRef.current += 0.0025;
      }
      const rot = rotationRef.current;

      // Volumetric Atmosphere Glow
      const atmGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.8,
        centerX,
        centerY,
        radius * 1.35
      );
      atmGlow.addColorStop(0, "rgba(59, 130, 246, 0.25)");
      atmGlow.addColorStop(0.5, "rgba(59, 130, 246, 0.08)");
      atmGlow.addColorStop(1, "rgba(4, 4, 7, 0)");
      ctx.fillStyle = atmGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Globe Base Sphere
      const globeGrad = ctx.createRadialGradient(
        centerX - radius * 0.35,
        centerY - radius * 0.35,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      globeGrad.addColorStop(0, "#1e293b");
      globeGrad.addColorStop(0.7, "#0f172a");
      globeGrad.addColorStop(1, "#020617");

      ctx.fillStyle = globeGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3D Latitudinal Parallels
      const latitudes = [-60, -30, 0, 30, 60];
      latitudes.forEach((lat) => {
        const phi = (lat * Math.PI) / 180;
        const latRadius = radius * Math.cos(phi);
        const yOffset = -radius * Math.sin(phi);

        ctx.beginPath();
        ctx.ellipse(centerX, centerY + yOffset, latRadius, latRadius * 0.28, 0, 0, Math.PI * 2);
        ctx.strokeStyle =
          lat === 0 ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = lat === 0 ? 1.5 : 0.75;
        ctx.stroke();
      });

      // 3D Longitudinal Meridians (Rotating)
      for (let lon = 0; lon < 360; lon += 30) {
        const radLon = ((lon * Math.PI) / 180) + rot;
        const xOffset = Math.sin(radLon) * radius;
        const isFront = Math.cos(radLon) > 0;

        if (isFront) {
          ctx.beginPath();
          ctx.ellipse(
            centerX + xOffset * 0.5,
            centerY,
            Math.abs(xOffset) * 0.5,
            radius,
            0,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = "rgba(59, 130, 246, 0.12)";
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }

      // Render Geographic Features onto 3D Sphere Surface
      filteredFeaturesRef.current.forEach((feature) => {
        const latRad = (feature.lat * Math.PI) / 180;
        const lngRad = (feature.lng * Math.PI) / 180 + rot;

        const x3d = radius * Math.cos(latRad) * Math.sin(lngRad);
        const y3d = -radius * Math.sin(latRad);
        const z3d = radius * Math.cos(latRad) * Math.cos(lngRad);

        // Render only features on the front hemisphere (z > 0)
        if (z3d > -20) {
          const depthAlpha = Math.max(0.2, (z3d + radius) / (2 * radius));
          const screenX = centerX + x3d;
          const screenY = centerY + y3d;

          const isSelected = selectedFeatureRef.current?.id === feature.id;

          // Distinct Color Palette by Category / Type
          let markerColor = "#3b82f6"; // Default Blue
          if (feature.type === "current_warm" || feature.category === "monsoon") {
            markerColor = "#ef4444"; // Red
          } else if (feature.type === "current_cold") {
            markerColor = "#06b6d4"; // Cyan
          } else if (feature.type === "trench" || feature.category === "tectonics") {
            markerColor = "#f59e0b"; // Amber
          } else if (feature.type === "chokepoint" || feature.category === "straits") {
            markerColor = "#ec4899"; // Pink
          } else if (feature.category === "biomes") {
            markerColor = "#10b981"; // Emerald
          }

          // Pulsing Glow for Selected Feature
          if (isSelected) {
            ctx.beginPath();
            ctx.arc(screenX, screenY, 14, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.2 * depthAlpha})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(screenX, screenY, 9, 0, Math.PI * 2);
            ctx.fillStyle = markerColor;
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(screenX, screenY, 5, 0, Math.PI * 2);
            ctx.fillStyle = markerColor;
            ctx.globalAlpha = depthAlpha;
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }

          // Label Text for Key Features
          if (z3d > 30 || isSelected) {
            ctx.save();
            ctx.fillStyle = isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.75)";
            ctx.font = isSelected
              ? "bold 11px Inter, sans-serif"
              : "600 9px Inter, sans-serif";
            ctx.fillText(feature.name.split(" ")[0], screenX + 7, screenY - 4);
            ctx.restore();
          }
        }
      });

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [autoRotate]);

  // Handle Drag / Rotation Interaction
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastXRef.current;
    rotationRef.current += deltaX * 0.006;
    lastXRef.current = e.clientX;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="space-y-6">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-ping" />
            <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
              Geography 3D Earth Atlas
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-0.5">
            Interactive Planetary Geospatial Engine: Ocean Currents, Tectonics, Straits, Monsoons & Biomes
          </p>
        </div>

        {/* ROTATION & CATEGORY CONTROLS */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`rounded-xl border border-white/10 px-3 py-1.5 text-xs font-bold transition ${
              autoRotate ? "bg-blue-600 text-white" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            {autoRotate ? "⏸ Pause Rotation" : "▶ Resume Auto-Orbit"}
          </button>
        </div>
      </div>

      {/* CATEGORY SELECTOR PILLS */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-black/60 p-2 border border-white/10">
        {(
          [
            { id: "all", label: `🌍 All Systems (${GLOBAL_GEO_DATASET.length})` },
            { id: "currents", label: "🌊 Ocean Currents & Gyres" },
            { id: "tectonics", label: "🌋 Plate Tectonics & Seismicity" },
            { id: "straits", label: "⚓ Straits & Chokepoints" },
            { id: "monsoon", label: "💨 Monsoons & Wind Belts" },
            { id: "rivers", label: "🏞️ River Basins & Deltas" },
            { id: "biomes", label: "🌲 Deserts & Hotspots" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveCategory(tab.id);
              sound.playClick();
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              activeCategory === tab.id
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3D GLOBE & ANALYTICAL METRICS CONTAINER */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* 3D GLOBE CANVAS (7 COLS) */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl lg:col-span-7 h-[480px]">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing touch-none"
          />

          {/* TOP HUD OVERLAY */}
          <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-300">
                3D SPHERICAL PROJECTION
              </span>
              <span className="text-[11px] font-bold text-white/60">
                {filteredFeatures.length} Active Spatial Anchors
              </span>
            </div>

            <span className="text-[10px] text-white/40 italic">
              Drag left/right to rotate Earth
            </span>
          </div>

          {/* BOTTOM FEATURE CAROUSEL SELECTOR */}
          <div className="relative z-10 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {filteredFeatures.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedFeature(f);
                    sound.playClick();
                    // Point rotation toward this feature
                    rotationRef.current = -((f.lng * Math.PI) / 180) + Math.PI / 2;
                  }}
                  className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition border ${
                    selectedFeature?.id === f.id
                      ? "bg-blue-600 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                      : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {f.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GEOGRAPHICAL DEEP DIVE ANALYTICAL HUD (5 COLS) */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl lg:col-span-5 space-y-4">
          {selectedFeature ? (
            <div className="space-y-3.5">
              {/* TITLE & BADGES */}
              <div className="border-b border-white/10 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-blue-300">
                    {selectedFeature.categoryLabel}
                  </span>
                  <span className="font-mono text-[10px] text-white/50">
                    {selectedFeature.lat.toFixed(1)}°N, {selectedFeature.lng.toFixed(1)}°E
                  </span>
                </div>
                <h3 className="mt-1.5 text-lg font-black text-white leading-snug">
                  {selectedFeature.name}
                </h3>
              </div>

              {/* CORE GEOGRAPHICAL MECHANISM */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                  Geophysical & Climatological Mechanism:
                </span>
                <p className="text-xs text-white/90 leading-relaxed">
                  {selectedFeature.description}
                </p>
              </div>

              {/* MAINS ANALYTICAL SIGNIFICANCE */}
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                  🌐 UPSC Mains Linkage & Climate Teleconnections:
                </span>
                <p className="text-xs text-white/90 leading-relaxed">
                  {selectedFeature.mainsSignificance}
                </p>
              </div>

              {/* PRELIMS PYQ CONNECTION */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  🎯 Previous Years' Question (PYQ) Anchor:
                </span>
                <p className="text-xs italic text-white/80 leading-snug">
                  "{selectedFeature.pyqNote}"
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20 text-xs text-white/40">
              Select any geographic anchor on the 3D globe to view details.
            </div>
          )}

          {/* DRILL TRIGGER */}
          <div className="border-t border-white/10 pt-3">
            <button
              onClick={() => {
                sound.playVictory();
                window.location.href = `/pyqs?search=${encodeURIComponent(
                  selectedFeature?.name.split(" ")[0] || "Geography"
                )}`;
              }}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-2.5 text-xs font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95"
            >
              Solve Geography PYQs on {selectedFeature?.name.split(" ")[0] || "Theme"} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
