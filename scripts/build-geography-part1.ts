import { PYQQuestion } from "../lib/core/types";

export const GEOGRAPHY_PART1: PYQQuestion[] = [
  // ==========================================================================
  // CHAPTER 1: SOLAR SYSTEM AND EVOLUTION OF EARTH (geo-1)
  // ==========================================================================
  {
    id: "geo-ch1-q1",
    year: 2022,
    subject: "Geography",
    topic: "Solar System and Evolution of Earth",
    chapterNumber: 1,
    paper: "GS-1",
    question: "1. In the northern hemisphere, the longest day of the year normally occurs in the: (2022)",
    options: [
      { id: "a", key: "A", text: "First half of the month of June" },
      { id: "b", key: "B", text: "Second half of the month of June" },
      { id: "c", key: "C", text: "First half of the month of July" },
      { id: "d", key: "D", text: "Second half of the month of July" }
    ],
    correctAnswer: "B",
    explanation: "On June 21st (Summer Solstice), the Northern Hemisphere is tilted at maximum towards the Sun, with the subsolar point falling directly on the Tropic of Cancer (23.5°N). This produces the longest daylight period of the year in the Northern Hemisphere, occurring in the second half of June.",
    extraEdge: "During the summer solstice, the Arctic Circle (66.5°N) experiences continuous daylight for 24 hours (Midnight Sun), while regions south of the Antarctic Circle experience total continuous darkness.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Summer Solstice", "Northern Hemisphere", "Tropic of Cancer", "Axial Tilt", "Day Length"]
  },
  {
    id: "geo-ch1-q2",
    year: 2019,
    subject: "Geography",
    topic: "Solar System and Evolution of Earth",
    chapterNumber: 1,
    paper: "GS-1",
    question: "2. On 21st June, the Sun: (2019)",
    options: [
      { id: "a", key: "A", text: "does not set below the horizon at the Arctic Circle" },
      { id: "b", key: "B", text: "does not set below the horizon at Antarctic Circle" },
      { id: "c", key: "C", text: "shines vertically overhead at noon on the Equator" },
      { id: "d", key: "D", text: "shines vertically overhead at the Tropic of Capricorn" }
    ],
    correctAnswer: "A",
    explanation: "On June 21st (Summer Solstice), the Arctic Circle (66.5°N) is completely illuminated throughout Earth's 24-hour diurnal rotation, meaning the Sun remains above the horizon continuously (the Midnight Sun phenomenon). The Sun is vertically overhead at noon on the Tropic of Cancer, not the Equator or Capricorn.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Arctic Circle", "Midnight Sun", "Summer Solstice", "Insolation"]
  },
  {
    id: "geo-ch1-q3",
    year: 2013,
    subject: "Geography",
    topic: "Solar System and Evolution of Earth",
    chapterNumber: 1,
    paper: "GS-1",
    question: "3. Variations in the length of daytime and night time from season to season are due to: (2013)",
    options: [
      { id: "a", key: "A", text: "The earth’s rotation on its axis" },
      { id: "b", key: "B", text: "The earth’s revolution around the sun in an elliptical manner" },
      { id: "c", key: "C", text: "Latitudinal position of the place" },
      { id: "d", key: "D", text: "Revolution of the earth on a tilted axis" }
    ],
    correctAnswer: "D",
    explanation: "Earth rotates on an axis tilted at 23.5° relative to the perpendicular to its orbital plane (or 66.5° to the plane of the ecliptic). As Earth revolves around the Sun on this fixed tilted axis, the angle of incoming solar radiation and the orientation of the Circle of Illumination relative to parallels change continually across the seasons, causing seasonal variations in day and night duration.",
    superHint: "Rotation alone produces day and night cycles (24h). Revolution on an un-tilted axis would produce constant 12h days everywhere year-round. It is the combination of revolution AND the tilted axis (axial parallelism) that causes seasonal day-length variation.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Axial Tilt", "Revolution of Earth", "Seasonal Variations", "Circle of Illumination"]
  },
  {
    id: "geo-ch1-q5",
    year: 2012,
    subject: "Geography",
    topic: "Solar System and Evolution of Earth",
    chapterNumber: 1,
    paper: "GS-1",
    question: "5. Electrically charged particles from space traveling at speeds of several hundred km/sec can severely harm living beings if they reach the surface of the Earth. What prevents them from reaching the surface of the Earth? (2012)",
    options: [
      { id: "a", key: "A", text: "The Earth’s magnetic field diverts them towards its poles." },
      { id: "b", key: "B", text: "Ozone layer around the Earth reflects them back to outer space." },
      { id: "c", key: "C", text: "Moisture in the upper layers of the atmosphere prevents them from reaching the surface of the Earth." },
      { id: "d", key: "D", text: "None of the statements (a), (b), and (c) given above is correct." }
    ],
    correctAnswer: "A",
    explanation: "Earth's internal geodynamo generates a magnetic dipole field extending into space as the magnetosphere. The magnetosphere deflects high-energy solar wind and galactic cosmic rays (charged protons and electrons) along magnetic field lines toward the geomagnetic poles into the Van Allen radiation belts, producing auroral displays (Aurora Borealis and Australis) in polar ionospheres.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Earth Magnetic Field", "Magnetosphere", "Solar Wind", "Van Allen Belts", "Auroras"]
  },
  {
    id: "geo-ch1-q6",
    year: 2010,
    subject: "Geography",
    topic: "Solar System and Evolution of Earth",
    chapterNumber: 1,
    paper: "GS-1",
    question: "6. Consider the following statements: (2010)\n1. On the planet Earth, the fresh water available for use amounts to about less than 1% of the total water found.\n2. Of the total fresh water found on the planet Earth 95% is bound up in polar ice caps and glaciers.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: About 97.5% of total water on Earth is saline oceanic water, leaving only 2.5% as freshwater. Of this 2.5% freshwater, ~68.7% is locked in ice caps/glaciers and ~30.1% is groundwater. Accessible surface freshwater in rivers, lakes, and atmosphere accounts for less than 1% of total freshwater (and <0.01% of total global water).\nStatement 2 is incorrect: Glaciers and ice caps hold approximately 68.7% of total freshwater, not 95%.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Hydrological Distribution", "Freshwater Resources", "Glaciers", "Groundwater"]
  },
  {
    id: "geo-ch1-q14",
    year: 2002,
    subject: "Geography",
    topic: "Solar System and Evolution of Earth",
    chapterNumber: 1,
    paper: "GS-1",
    question: "14. Which one of the following statements is correct with reference to our solar system? (2002)",
    options: [
      { id: "a", key: "A", text: "The earth is the densest of all the planets in our solar system" },
      { id: "b", key: "B", text: "The predominant element in the composition of earth is silicon" },
      { id: "c", key: "C", text: "The sun contains 75 percent of the mass of the solar system" },
      { id: "d", key: "D", text: "The diameter of the sun is 190 times that of the earth" }
    ],
    correctAnswer: "A",
    explanation: "Option (a) is correct: Earth has the highest average density (5.51 g/cm³) among all planets in the solar system due to its dense metallic core (Fe-Ni). Mercury is second at 5.43 g/cm³, while Saturn is the least dense (0.69 g/cm³).\nOption (b) is incorrect: Iron (Fe ~35%) is the most abundant element in the whole Earth by mass (Iron > Oxygen > Silicon > Magnesium).\nOption (c) is incorrect: The Sun contains 99.8% of the total mass of the solar system.\nOption (d) is incorrect: The Sun's diameter is ~109 times that of Earth.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Earth Density", "Solar System Mass", "Elemental Composition of Earth", "Terrestrial Planets"]
  },

  // ==========================================================================
  // CHAPTER 2: CLIMATOLOGY (geo-2)
  // ==========================================================================
  {
    id: "geo-ch2-q21",
    year: 2024,
    subject: "Geography",
    topic: "Climatology",
    chapterNumber: 2,
    paper: "GS-1",
    question: "21. Consider the following statements: (2024)\nStatement-I: The atmosphere is heated more by incoming solar radiation than by terrestrial radiation.\nStatement-II: Carbon dioxide and other greenhouse gases in the atmosphere are good absorbers of long wave radiation.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement-I and Statement-II are correct and Statement-II explains Statement-I" },
      { id: "b", key: "B", text: "Both Statement-I and Statement-II are correct but Statement-II does not explain Statement-I" },
      { id: "c", key: "C", text: "Statement-I is correct, but Statement-II is incorrect" },
      { id: "d", key: "D", text: "Statement-I is incorrect, but Statement-II is correct" }
    ],
    correctAnswer: "D",
    explanation: "Statement-I is incorrect: The atmosphere is largely transparent to incoming shortwave solar radiation and is primarily heated from below by outgoing longwave terrestrial radiation emitted by the Earth's warmed surface.\nStatement-II is correct: Water vapour, carbon dioxide, methane, and other greenhouse gases readily absorb longwave infrared terrestrial radiation, driving atmospheric heating (the natural greenhouse effect).",
    extraEdge: "Without the natural greenhouse effect, Earth's mean surface temperature would drop from +15°C to -18°C, freezing the hydrosphere and rendering life impossible.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Heat Budget of Earth", "Terrestrial Radiation", "Insolation", "Greenhouse Gases", "Longwave Radiation"]
  },
  {
    id: "geo-ch2-q22",
    year: 2024,
    subject: "Geography",
    topic: "Climatology",
    chapterNumber: 2,
    paper: "GS-1",
    question: "22. Consider the following statements: (2024)\nStatement-I: Thickness of the troposphere at the equator is much greater as compared to poles.\nStatement-II: At the equator, heat is transported to great heights by strong convectional currents.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement-I and Statement-II are correct and Statement-II explains Statement-I" },
      { id: "b", key: "B", text: "Both Statement-I and Statement-II are correct, but Statement-II does not explain Statement-I" },
      { id: "c", key: "C", text: "Statement-I is correct, but Statement-II is incorrect" },
      { id: "d", key: "D", text: "Statement-I is incorrect, but Statement-II is correct" }
    ],
    correctAnswer: "A",
    explanation: "The troposphere extends to an altitude of ~18 km at the equator but only ~8 km at the poles. Intense solar insolation at the equator heats surface air, driving powerful vertical convective updrafts that lift heat and moisture high into the atmosphere, pushing the tropopause upward. Hence, Statement-II is true and accurately explains Statement-I.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Troposphere", "Tropopause", "Convection Currents", "Equatorial Heating", "Atmospheric Structure"]
  },
  {
    id: "geo-ch2-q24",
    year: 2023,
    subject: "Geography",
    topic: "Climatology",
    chapterNumber: 2,
    paper: "GS-1",
    question: "24. Consider the following statements: (2023)\nStatement-I: The soil in tropical rain forests is rich in nutrients.\nStatement-II: The high temperature and moisture of tropical rain forests cause dead organic matter in the soil to decompose quickly.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement-I and Statement-II are correct and Statement-II explains Statement-I" },
      { id: "b", key: "B", text: "Both Statement-I and Statement-II are correct and Statement-II is not the correct explanation for Statement-I" },
      { id: "c", key: "C", text: "Statement-I is correct but Statement-II is incorrect" },
      { id: "d", key: "D", text: "Statement-I is incorrect but Statement-II is correct" }
    ],
    correctAnswer: "D",
    explanation: "Statement-I is incorrect: Tropical rainforest soils (Oxisols/Latosols) are heavily leached, acidic, and nutrient-poor because torrential equatorial rains wash soluble bases deep into the subsoil.\nStatement-II is correct: Constant warmth and high humidity foster intense microbial activity, causing rapid decomposition of leaf litter; released nutrients are immediately absorbed by shallow root systems rather than stored in the soil.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Tropical Rainforest", "Oxisols", "Soil Leaching", "Decomposition Rate", "Nutrient Cycle"]
  },
  {
    id: "geo-ch2-q26",
    year: 2022,
    subject: "Geography",
    topic: "Climatology",
    chapterNumber: 2,
    paper: "GS-1",
    question: "26. Consider the following statements: (2022)\n1. High clouds primarily reflect solar radiation and cool the surface of the Earth.\n2. Low clouds have a high absorption of infrared radiation emanating from the Earth’s surface and thus cause a warming effect.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "D",
    explanation: "Both statements reverse reality:\n1. Low, thick stratiform clouds (stratocumulus) have high albedo, primarily reflecting incoming solar radiation back to space, thereby cooling Earth's surface.\n2. High, thin cirriform clouds (cirrus) are largely transparent to incoming sunlight but absorb outgoing longwave infrared terrestrial radiation and re-emit it back downward, producing a net warming effect.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Cloud Radiative Forcing", "High vs Low Clouds", "Albedo Effect", "Terrestrial Infrared Absorption"]
  },
  {
    id: "geo-ch2-q29",
    year: 2020,
    subject: "Geography",
    topic: "Climatology",
    chapterNumber: 2,
    paper: "GS-1",
    question: "29. Consider the following statements: (2020)\n1. Jet streams occur in the Northern Hemisphere only.\n2. Only some cyclones develop an eye.\n3. The temperature inside the eye of a cyclone is nearly 10°C less than that of the surroundings.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "2 only" },
      { id: "d", key: "D", text: "1 and 3 only" }
    ],
    correctAnswer: "C",
    explanation: "Statement 1 is incorrect: Jet streams (Subtropical and Polar front jet streams) encircle both the Northern and Southern Hemispheres in upper tropospheric westerlies.\nStatement 2 is correct: Only mature, intense tropical cyclones develop a clear central eye; mid-latitude/temperate frontal cyclones do not have an eye.\nStatement 3 is incorrect: Due to adiabatic compression of subsiding air in the calm central core, the eye of a tropical cyclone is warmer (by 0-2°C at surface and up to 10°C in upper troposphere) than surrounding eyewall clouds, not colder.",
    superHint: "S1 uses absolute 'only' across symmetrical planetary physics. S3 uses 'less' — the eye is a warm core system where sinking air warms adiabatically.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Jet Streams", "Tropical Cyclones", "Cyclone Eye", "Adiabatic Warming"]
  },
  {
    id: "geo-ch2-q34",
    year: 2014,
    subject: "Geography",
    topic: "Climatology",
    chapterNumber: 2,
    paper: "GS-1",
    question: "34. The seasonal reversal of winds is the typical characteristic of: (2014)",
    options: [
      { id: "a", key: "A", text: "Equatorial climate" },
      { id: "b", key: "B", text: "Mediterranean climate" },
      { id: "c", key: "C", text: "Monsoon climate" },
      { id: "d", key: "D", text: "All of the above climates" }
    ],
    correctAnswer: "C",
    explanation: "The monsoon climate (derived from the Arabic 'Mausim' meaning season) is uniquely characterized by complete seasonal wind reversals: south-west monsoons blowing from maritime oceans to land during summer, and north-east monsoons blowing from continental landmass to ocean in winter.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Monsoon Climate", "Seasonal Wind Reversal", "South-West Monsoon", "North-East Monsoon"]
  },
  {
    id: "geo-ch2-q48",
    year: 2010,
    subject: "Geography",
    topic: "Climatology",
    chapterNumber: 2,
    paper: "GS-1",
    question: "48. A geographic region has the following distinct characteristics: (2010)\n1. Warm and dry climate\n2. Mild and wet winter\n3. Evergreen Oak trees\n\nThe above features are distinct characteristics of which one of the following regions?",
    options: [
      { id: "a", key: "A", text: "Mediterranean" },
      { id: "b", key: "B", text: "Eastern China" },
      { id: "c", key: "C", text: "Central Asia" },
      { id: "d", key: "D", text: "Atlantic coast of North America" }
    ],
    correctAnswer: "A",
    explanation: "The Mediterranean climate (Cs in Köppen classification) is uniquely distinguished by dry, sunny summers (due to subtropical high-pressure cells shifting poleward) and rainy, mild winters (brought by prevailing westerlies and temperate depressions). Its native sclerophyllous vegetation includes drought-adapted evergreen oaks, cork, olive, and chaparral.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Mediterranean Climate", "Sclerophyllous Vegetation", "Evergreen Oak", "Winter Rainfall"]
  },

  // ==========================================================================
  // CHAPTER 3: OCEANOGRAPHY (geo-3)
  // ==========================================================================
  {
    id: "geo-ch3-q74",
    year: 2024,
    subject: "Geography",
    topic: "Oceanography",
    chapterNumber: 3,
    paper: "GS-1",
    question: "74. Which of the following is/are correct inference/inferences from isothermal maps in the month of January? (2024)\n1. The isotherms deviate to the north over the ocean and to the south over the continent.\n2. The presence of cold ocean currents, Gulf Stream and North Atlantic Drift make the North Atlantic Ocean colder and the isotherms bend towards the north.\n\nSelect the answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: In January (Northern Hemisphere winter), continents cool much faster than oceans. Over oceans (warmer), isotherms bend poleward (northward); over continents (colder), isotherms sag equatorward (southward).\nStatement 2 is incorrect: The Gulf Stream and North Atlantic Drift are WARM ocean currents, not cold, which transport tropical warmth to Western Europe.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Isotherms in January", "Gulf Stream", "North Atlantic Drift", "Marine vs Continental Heating"]
  },
  {
    id: "geo-ch3-q75",
    year: 2020,
    subject: "Geography",
    topic: "Oceanography",
    chapterNumber: 3,
    paper: "GS-1",
    question: "75. With reference to Ocean Mean Temperature (OMT), which of the following statements is/are correct? (2020)\n1. OMT is measured up to a depth of 26°C isotherm which is 129 metres in the south-western Indian Ocean during January–March.\n2. OMT collected during January–March can be used in assessing whether the amount of rainfall in monsoon will be less or more than a certain long-term mean.\n\nSelect the correct using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: The 26°C isotherm depth in the south-western Indian Ocean during January–March is approximately 59 metres (not 129 metres).\nStatement 2 is correct: OMT reflects the upper ocean thermal heat content much better than surface skin SST. A higher OMT in the pre-monsoon season correlates with enhanced summer monsoon rainfall over India.",
    difficulty: "Hard",
    important: true,
    conceptTags: ["Ocean Mean Temperature (OMT)", "26°C Isotherm", "Monsoon Forecasting", "Indian Ocean Dynamics"]
  },
  {
    id: "geo-ch3-q76",
    year: 2018,
    subject: "Geography",
    topic: "Oceanography",
    chapterNumber: 3,
    paper: "GS-1",
    question: "76. Consider the following statements: (2018)\n1. Most of the world’s coral reefs are in tropical waters.\n2. More than one-third of the world’s coral reefs are located in the territories of Australia, Indonesia and Philippines.\n3. Coral reefs host far more animal phyla than those hosted by tropical rainforests.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 and 2 only" },
      { id: "b", key: "B", text: "3 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "D",
    explanation: "Statement 1 is correct: Reef-building hermatypic corals require warm (20-28°C), shallow, saline, and clear waters, concentrated between 30°N and 30°S.\nStatement 2 is correct: Australia (Great Barrier Reef) and the Coral Triangle nations (Indonesia, Philippines) host over 33% of global coral reef area.\nStatement 3 is correct: While rainforests host greater total species counts (dominated by insects), coral reefs exhibit greater taxonomic phylum diversity, hosting 32 of the 33 recognized animal phyla.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Coral Reefs", "Marine Biodiversity", "Coral Triangle", "Taxonomic Phyla"]
  },
  {
    id: "geo-ch3-q77",
    year: 2017,
    subject: "Geography",
    topic: "Oceanography",
    chapterNumber: 3,
    paper: "GS-1",
    question: "77. With reference to ‘Indian Ocean Dipole (IOD)’ sometimes mentioned in the news while forecasting Indian monsoon, which of the following statements is/are correct? (2017)\n1. The IOD phenomenon is characterised by a difference in sea surface temperature between tropical Western Indian Ocean and tropical Eastern Pacific Ocean.\n2. An IOD phenomenon can influence an El Nino’s impact on the monsoon.\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is incorrect: Indian Ocean Dipole is a coupled ocean-atmosphere phenomenon within the INDIAN OCEAN (difference between the tropical western Indian Ocean and southeastern equatorial Indian Ocean), NOT the Pacific Ocean.\nStatement 2 is correct: A positive IOD phase (warmer western Indian Ocean) brings abundant moisture and can neutralize/mitigate the drying impact of an adverse El Niño on the Indian monsoon (as seen during the 1997 and 2019 monsoons).",
    superHint: "Look at the name: *Indian Ocean* Dipole. It operates between two poles of the Indian Ocean itself, not between the Indian Ocean and the Pacific.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Indian Ocean Dipole (IOD)", "Positive IOD", "El Nino Neutralization", "Monsoon Dynamics"]
  },
  {
    id: "geo-ch3-q79",
    year: 2015,
    subject: "Geography",
    topic: "Oceanography",
    chapterNumber: 3,
    paper: "GS-1",
    question: "79. Tides occur in the oceans and seas due to which among the following? (2015)\n1. Gravitational force of the Sun\n2. Gravitational force of the Moon\n3. Centrifugal force of the Earth\n\nSelect the correct answer using the code given below:",
    options: [
      { id: "a", key: "A", text: "1 only" },
      { id: "b", key: "B", text: "2 and 3 only" },
      { id: "c", key: "C", text: "1 and 3 only" },
      { id: "d", key: "D", text: "1, 2 and 3" }
    ],
    correctAnswer: "D",
    explanation: "Tides are generated by differential gravitational forces and orbital mechanics:\n1. Moon's gravitational pull is the primary tide-generating force (2.17 times stronger than the Sun's due to proximity).\n2. Sun's gravitational pull modifies tidal amplitude (spring tides when aligned, neap tides at quadrature).\n3. Earth's rotation around the Earth-Moon barycentre produces a centrifugal force that creates a second tidal bulge on the side directly opposite the Moon.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Ocean Tides", "Gravitational Pull", "Centrifugal Force", "Tidal Bulge", "Spring & Neap Tides"]
  },

  // ==========================================================================
  // CHAPTER 4: GEOMORPHOLOGY (geo-4)
  // ==========================================================================
  {
    id: "geo-ch4-q93",
    year: 2024,
    subject: "Geography",
    topic: "Geomorphology",
    chapterNumber: 4,
    paper: "GS-1",
    question: "93. Consider the following statements: (2024)\nStatement-I: Rainfall is one of the reasons for the weathering of rocks.\nStatement-II: Rain water contains carbon dioxide in solution.\nStatement-III: Rain water contains atmospheric oxygen.\n\nWhich one of the following is correct in respect of the above statements?",
    options: [
      { id: "a", key: "A", text: "Both Statement-II and Statement-III are correct and both of them explain Statement-I" },
      { id: "b", key: "B", text: "Both Statement-II and Statement-III are correct, but only one of them explains Statement-I" },
      { id: "c", key: "C", text: "Only one of the Statement II and III is correct and that explains Statement-I" },
      { id: "d", key: "D", text: "Neither Statement-II nor Statement-III is correct" }
    ],
    correctAnswer: "A",
    explanation: "Statement-I is correct: Rainfall triggers both chemical and physical breakdown of bedrock.\nStatement-II is correct: Rainwater dissolves CO2 from air, forming weak carbonic acid (H2CO3) that drives carbonation and dissolution of carbonate rocks (limestone karst).\nStatement-III is correct: Rainwater carries dissolved atmospheric oxygen that oxidizes iron-bearing minerals into rust/ferric oxides, loosening mineral grains.\nBoth Statement-II and Statement-III correctly explain chemical weathering of rocks.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Weathering of Rocks", "Carbonation", "Oxidation", "Chemical Weathering", "Karst Topography"]
  },
  {
    id: "geo-ch4-q94",
    year: 2024,
    subject: "Geography",
    topic: "Geomorphology",
    chapterNumber: 4,
    paper: "GS-1",
    question: "94. Consider the following: (2024)\n1. Pyroclastic debris\n2. Ash and dust\n3. Nitrogen compounds\n4. Sulphur compounds\n\nHow many of the above are products of volcanic eruptions?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "Only three" },
      { id: "d", key: "D", text: "All four" }
    ],
    correctAnswer: "D",
    explanation: "Volcanic eruptions eject solid, liquid, and gaseous materials:\n- Solid: Pyroclastic debris (scoria, cinders, volcanic bombs) (1) and volcanic ash/dust (2).\n- Gaseous: Water vapour (>60%), sulphur compounds (SO2, H2S) (4), nitrogen compounds (NOx, NH3) (3), CO2, and halogens.\nHence, all four are products of volcanic eruptions.",
    superHint: "Apply the 'unlikely to be absent' heuristic: Can a massive subterranean magma explosion eject fragments (pyroclastic, ash) and volcanic gases (sulfur, nitrogen compounds)? Naturally yes.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Volcanic Eruptions", "Pyroclastic Flow", "Volcanic Ash", "Volcanic Gases"]
  },
  {
    id: "geo-ch4-q95",
    year: 2023,
    subject: "Geography",
    topic: "Geomorphology",
    chapterNumber: 4,
    paper: "GS-1",
    question: "95. Consider the following statements: (2023)\n1. In a seismograph, P waves are recorded earlier than S waves.\n2. In P waves, the individual particles vibrate to and fro in the direction of wave propagation, whereas in S waves, the particles vibrate up and down at right angles to the direction of wave propagation.\n\nWhich of the statements given above is/are correct?",
    options: [
      { id: "a", key: "A", text: "1 Only" },
      { id: "b", key: "B", text: "2 Only" },
      { id: "c", key: "C", text: "Both 1 and 2" },
      { id: "d", key: "D", text: "Neither 1 nor 2" }
    ],
    correctAnswer: "C",
    explanation: "Statement 1 is correct: Primary (P) waves are compressional longitudinal waves that travel fastest through solids, liquids, and gases, arriving first at seismographs. Secondary (S) waves travel slower and arrive second.\nStatement 2 is correct: P-waves vibrate parallel (to-and-fro) to the direction of wave propagation (compression and rarefaction), whereas S-waves are shear transverse waves vibrating perpendicular (up-and-down/at right angles) to wave travel.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Earthquake Waves", "P-Waves", "S-Waves", "Seismograph", "Body Waves"]
  },
  {
    id: "geo-ch4-q96",
    year: 2021,
    subject: "Geography",
    topic: "Geomorphology",
    chapterNumber: 4,
    paper: "GS-1",
    question: "96. The black cotton soil of India has been formed due to the weathering of: (2021)",
    options: [
      { id: "a", key: "A", text: "Brown forest soil" },
      { id: "b", key: "B", text: "Fissure volcanic rock" },
      { id: "c", key: "C", text: "Granite and schist" },
      { id: "d", key: "D", text: "Shale and limestone" }
    ],
    correctAnswer: "B",
    explanation: "Black cotton soil (Regur soil) of peninsular India was formed by the in-situ sub-aerial weathering of basaltic lava flows that poured out during the Cretaceous period through fissure eruptions (Deccan Trap volcanism). It is rich in montmorillonite clay minerals, imparting high moisture-retention capacity.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Black Cotton Soil", "Regur Soil", "Deccan Traps", "Basalt Weathering", "Fissure Eruptions"]
  },
  {
    id: "geo-ch4-q110",
    year: 2001,
    subject: "Geography",
    topic: "Geomorphology",
    chapterNumber: 4,
    paper: "GS-1",
    question: "110. Identify the correct order of the process of soil-erosion from the following: (2001)",
    options: [
      { id: "a", key: "A", text: "Splash erosion, Sheet erosion, Rill erosion, Gully erosion" },
      { id: "b", key: "B", text: "Sheet erosion, Splash erosion, Gully erosion, Rill erosion" },
      { id: "c", key: "C", text: "Rill erosion, Gully erosion, Sheet erosion, Splash erosion" },
      { id: "d", key: "D", text: "Gully erosion, Rill erosion, Sheet erosion, Splash erosion" }
    ],
    correctAnswer: "A",
    explanation: "Water-induced soil erosion progresses in four distinct chronological stages:\n1. Splash Erosion: Raindrops bombard bare soil, dislodging soil aggregates.\n2. Sheet Erosion: Uniform thin surface layer of soil is stripped away by sheet overland runoff.\n3. Rill Erosion: Runoff channelizes into small, finger-like incisions and micro-channels.\n4. Gully Erosion: Deepening and broadening of rills into pronounced chasms and ravines (badland topography).",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Soil Erosion Stages", "Splash Erosion", "Sheet Erosion", "Rill Erosion", "Gully Erosion"]
  },

  // ==========================================================================
  // CHAPTER 5: HUMAN AND ECONOMIC GEOGRAPHY (geo-5)
  // ==========================================================================
  {
    id: "geo-ch5-q111",
    year: 2023,
    subject: "Geography",
    topic: "Human and Economic Geography",
    chapterNumber: 5,
    paper: "GS-1",
    question: "111. With reference to coal-based thermal power plants in India, consider the following statements: (2023)\n1. None of them uses seawater.\n2. None of them are set up in water-stressed districts.\n3. None of them is privately owned.\n\nHow many of the above statements are correct?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "D",
    explanation: "Statement 1 is incorrect: Several coastal thermal power plants (such as Mundra Ultra Mega Power Plant in Gujarat) use seawater for once-through cooling systems.\nStatement 2 is incorrect: Over 40% of thermal power plants in India are located in water-stressed or drought-prone districts (e.g. Suratgarh in Rajasthan, Raichur in Karnataka).\nStatement 3 is incorrect: Substantial private sector entities (Tata Power, Adani Power, JSW Energy) own and operate major coal thermal stations.",
    superHint: "'None' is an absolute universal negative across three separate statements. Finding even a single counter-example (Mundra uses seawater; private plants exist) invalidates all three.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Thermal Power Plants", "Seawater Cooling", "Water Stress", "Private Power Generation"]
  },
  {
    id: "geo-ch5-q114",
    year: 2023,
    subject: "Geography",
    topic: "Human and Economic Geography",
    chapterNumber: 5,
    paper: "GS-1",
    question: "114. About three-fourths of the world’s cobalt, a metal required for the manufacture of batteries for electric motor vehicles, is produced by: (2023)",
    options: [
      { id: "a", key: "A", text: "Argentina" },
      { id: "b", key: "B", text: "Botswana" },
      { id: "c", key: "C", text: "The Democratic Republic of the Congo" },
      { id: "d", key: "D", text: "Kazakhstan" }
    ],
    correctAnswer: "C",
    explanation: "The Democratic Republic of the Congo (DRC) accounts for approximately 70–75% of global cobalt production, centered in the Katanga Copperbelt. Cobalt is an indispensable cathode active material for high-energy density lithium-ion batteries used in electric vehicles.",
    extraEdge: "Argentina, Bolivia, and Chile constitute the 'Lithium Triangle', hosting over 50% of the world's identified lithium brine resources.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Cobalt Reserves", "Democratic Republic of the Congo (DRC)", "EV Batteries", "Critical Minerals"]
  },
  {
    id: "geo-ch5-q115",
    year: 2023,
    subject: "Geography",
    topic: "Human and Economic Geography",
    chapterNumber: 5,
    paper: "GS-1",
    question: "115. Ilmenite and rutile, abundantly available in certain coastal tracts of India, are rich sources of which one of the following? (2023)",
    options: [
      { id: "a", key: "A", text: "Aluminium" },
      { id: "b", key: "B", text: "Copper" },
      { id: "c", key: "C", text: "Iron" },
      { id: "d", key: "D", text: "Titanium" }
    ],
    correctAnswer: "D",
    explanation: "Ilmenite (FeTiO3) and rutile (TiO2) are heavy beach sand minerals found along the coasts of Kerala (Chavara), Tamil Nadu, Andhra Pradesh, and Odisha. They are the primary industrial ores for extracting Titanium metal and manufacturing titanium dioxide pigment used in aerospace, defence, and paints.",
    difficulty: "Easy",
    important: true,
    conceptTags: ["Ilmenite", "Rutile", "Titanium", "Beach Sand Minerals", "Heavy Minerals"]
  },
  {
    id: "geo-ch5-q117",
    year: 2023,
    subject: "Geography",
    topic: "Human and Economic Geography",
    chapterNumber: 5,
    paper: "GS-1",
    question: "117. Consider the following statements: (2023)\n1. India has more arable area than China.\n2. The proportion of irrigated area is more in India as compared to China.\n3. The average productivity per hectare in Indian agriculture is higher than that in China.\n\nHow many of the above statements are correct?",
    options: [
      { id: "a", key: "A", text: "Only one" },
      { id: "b", key: "B", text: "Only two" },
      { id: "c", key: "C", text: "All three" },
      { id: "d", key: "D", text: "None" }
    ],
    correctAnswer: "A",
    explanation: "Statement 1 is correct: India has the largest arable land area in the world (~156 million hectares, ~11.8% of global total), whereas China has ~119 million hectares.\nStatement 2 is incorrect: China has a significantly higher proportion of irrigated land (~50% of its arable land is irrigated vs ~35-40% in India).\nStatement 3 is incorrect: China's agricultural crop productivity per hectare (cereal yield ~6,300 kg/ha) is nearly double that of India (~3,200 kg/ha).",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Arable Land", "Irrigation Percentage", "Agricultural Productivity", "India vs China Agriculture"]
  },
  {
    id: "geo-ch5-q119",
    year: 2022,
    subject: "Geography",
    topic: "Human and Economic Geography",
    chapterNumber: 5,
    paper: "GS-1",
    question: "119. With reference to India, consider the following statements: (2022)\n1. Monazite is a source of rare earths.\n2. Monazite contains thorium.\n3. Monazite occurs naturally in the entire Indian coastal sands in India.\n4. In India, government bodies only can process or export monazite.\n\nWhich of the statements given above are correct?",
    options: [
      { id: "a", key: "A", text: "1, 2 and 3 only" },
      { id: "b", key: "B", text: "1, 2 and 4 only" },
      { id: "c", key: "C", text: "3 and 4 only" },
      { id: "d", key: "D", text: "1, 2, 3 and 4" }
    ],
    correctAnswer: "B",
    explanation: "Statement 1 is correct: Monazite contains lanthanum, cerium, and other light rare earth elements (LREEs).\nStatement 2 is correct: Monazite sand is a primary phosphate mineral containing up to 8–10% Thorium dioxide (ThO2), vital for India's 3-stage nuclear program.\nStatement 3 is incorrect: Monazite is concentrated in specific coastal pockets (Kerala, Tamil Nadu, Odisha, Andhra Pradesh), not across the 'entire' coastline.\nStatement 4 is correct: Being a prescribed substance under the Atomic Energy Act, Indian Rare Earths Limited (IREL) under DAE is the sole authorized entity to handle, process, and export monazite.",
    superHint: "S3 states 'in the entire Indian coastal sands' — classic sweeping extreme word trap. Coastal placer deposits are geographically localized.",
    difficulty: "Medium",
    important: true,
    conceptTags: ["Monazite Sands", "Thorium", "Rare Earth Elements", "IREL", "Atomic Energy Act"]
  }
];
