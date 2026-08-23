import { CurrentAffairsArticle } from "../core/types";
import { getDateKey } from "../core/utils";

const FEED_SOURCES = [
  {
    name: "The Indian Express Explained",
    url: "https://indianexpress.com/section/explained/feed/",
    category: "Editorial Analysis",
    defaultPaper: "GS-2" as const,
  },
  {
    name: "The Indian Express UPSC Essentials",
    url: "https://indianexpress.com/section/upsc-current-affairs/feed/",
    category: "UPSC Focus",
    defaultPaper: "GS-3" as const,
  },
  {
    name: "PIB National Releases",
    url: "https://pib.gov.in/RssMain.aspx?ModId=6",
    category: "Government Policy & Schemes",
    defaultPaper: "GS-2" as const,
  },
  {
    name: "PRS Legislative Research",
    url: "https://prsindia.org/feed",
    category: "Parliament & Governance",
    defaultPaper: "GS-2" as const,
  },
];

/**
 * Strips HTML tags, entities, and excessive whitespace.
 */
function cleanHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#124;/g, "|")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Automatically maps a news title & excerpt to UPSC General Studies papers.
 */
export function determineGSPaper(title: string, content: string = ""): "GS-1" | "GS-2" | "GS-3" | "GS-4" {
  const t = (title + " " + content).toLowerCase();

  // GS-4: Ethics, Integrity, Aptitude, Public Service Values
  if (
    t.includes("ethics") ||
    t.includes("probity") ||
    t.includes("whistleblower") ||
    t.includes("anti-corruption") ||
    t.includes("moral") ||
    t.includes("integrity")
  ) {
    return "GS-4";
  }

  // GS-2: Polity, Constitution, Governance, Social Justice, International Relations
  if (
    t.includes("constitution") ||
    t.includes("supreme court") ||
    t.includes("high court") ||
    t.includes("parliament") ||
    t.includes("lok sabha") ||
    t.includes("rajya sabha") ||
    t.includes("bill") ||
    t.includes("judiciary") ||
    t.includes("treaty") ||
    t.includes("bilateral") ||
    t.includes("un ") ||
    t.includes("united nations") ||
    t.includes("election") ||
    t.includes("governance") ||
    t.includes("fundamental rights") ||
    t.includes("federalism") ||
    t.includes("ministry") ||
    t.includes("welfare scheme") ||
    t.includes("foreign policy") ||
    t.includes("diplomacy")
  ) {
    return "GS-2";
  }

  // GS-3: Economy, Agriculture, Environment, Science & Tech, Security, Disaster Management
  if (
    t.includes("economy") ||
    t.includes("rbi") ||
    t.includes("gdp") ||
    t.includes("inflation") ||
    t.includes("fiscal") ||
    t.includes("tax") ||
    t.includes("isro") ||
    t.includes("climate") ||
    t.includes("biodiversity") ||
    t.includes("wildlife") ||
    t.includes("pollution") ||
    t.includes("ai") ||
    t.includes("artificial intelligence") ||
    t.includes("space") ||
    t.includes("defence") ||
    t.includes("missile") ||
    t.includes("cyber") ||
    t.includes("farmer") ||
    t.includes("crop") ||
    t.includes("semiconductor") ||
    t.includes("renewable energy") ||
    t.includes("disaster")
  ) {
    return "GS-3";
  }

  // GS-1: History, Art & Culture, Heritage, Geography, Society
  return "GS-1";
}

/**
 * Generates structured UPSC Prelims points based on headline keywords.
 */
function generatePrelimsPointers(title: string, gsPaper: string): string[] {
  const t = title.toLowerCase();
  const pointers: string[] = [];

  if (t.includes("climate") || t.includes("flood") || t.includes("environment") || t.includes("biodiversity")) {
    pointers.push("Target 3 of Kunming-Montreal Global Biodiversity Framework (30x30 target by 2030).");
    pointers.push("National Action Plan on Climate Change (NAPCC) eight core missions.");
    pointers.push("Central Pollution Control Board (CPCB) statutory mandate under Water & Air Acts.");
    pointers.push("Disaster Management Act 2005 role of NDMA chaired by Prime Minister.");
  } else if (t.includes("economy") || t.includes("manufacturing") || t.includes("scheme") || t.includes("rbi") || t.includes("tax")) {
    pointers.push("Production-Linked Incentive (PLI) Scheme guidelines and capital expenditure thresholds.");
    pointers.push("Monetary Policy Committee (MPC) composition under Section 45ZB of RBI Act 1934.");
    pointers.push("Distinction between Revenue Deficit, Fiscal Deficit, and Primary Deficit.");
    pointers.push("National Infrastructure Pipeline (NIP) and PM GatiShakti Multi-modal connectivity.");
  } else if (t.includes("court") || t.includes("constitution") || t.includes("sc") || t.includes("justice") || t.includes("law")) {
    pointers.push("Constitutional provisions under Article 14 (Equality), 19 (Freedoms), and 21 (Personal Liberty).");
    pointers.push("Doctrine of Separation of Powers and Judicial Review under Article 13 & 32.");
    pointers.push("Jurisdiction of Supreme Court: Original (Art 131), Appellate (Art 133-136), Advisory (Art 143).");
    pointers.push("Law Commission of India recommendations on statutory governance reforms.");
  } else {
    pointers.push(`Core factual definition, historical background, and constitutional relevance of ${title.slice(0, 45)}.`);
    pointers.push(`Nodal Ministry / Statutory regulatory body responsible for policy implementation.`);
    pointers.push("Applicable international conventions and bilateral agreements signed by India.");
    pointers.push("Impact on Sustainable Development Goals (SDGs 2030 Agenda).");
  }

  return pointers;
}

/**
 * Generates an analytical Mains angle for UPSC GS Mains.
 */
function generateMainsAngle(title: string, gsPaper: string): string {
  return `Critically examine the policy, institutional, and socio-economic dimensions of "${title}". Discuss the structural challenges in implementation and propose practical measures under the ${gsPaper} framework to achieve optimal outcomes for India.`;
}

/**
 * Fetches and parses live RSS feeds with resilient timeout & headers.
 */
export async function scrapeMultiSourceCurrentAffairs(): Promise<CurrentAffairsArticle[]> {
  const todayStr = getDateKey();
  const articles: CurrentAffairsArticle[] = [];

  for (const feed of FEED_SOURCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(feed.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "application/rss+xml, application/xml, text/xml, */*",
        },
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeout);

      if (!res.ok) continue;

      const xml = await res.text();
      const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
      let match: RegExpExecArray | null;

      while ((match = itemRegex.exec(xml)) !== null && articles.length < 20) {
        const itemXml = match[1];

        const rawTitle =
          (itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) ||
            itemXml.match(/<title>([\s\S]*?)<\/title>/i))?.[1] || "";
        const rawLink =
          (itemXml.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/i) ||
            itemXml.match(/<link>([\s\S]*?)<\/link>/i))?.[1] || "";
        const rawDesc =
          (itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) ||
            itemXml.match(/<description>([\s\S]*?)<\/description>/i))?.[1] || "";
        const rawDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] || "";
        const thumbMatch =
          itemXml.match(/<media:thumbnail[^>]*url=["']([^"']+)["']/i) ||
          itemXml.match(/<media:content[^>]*url=["']([^"']+)["']/i) ||
          itemXml.match(/<enclosure[^>]*url=["']([^"']+)["']/i);
        const imageUrl = thumbMatch ? thumbMatch[1] : undefined;

        const title = cleanHtml(rawTitle);
        const link = cleanHtml(rawLink);
        const desc = cleanHtml(rawDesc);

        if (!title || title.length < 10 || articles.some((a) => a.title.toLowerCase() === title.toLowerCase())) {
          continue;
        }

        const gsPaper = determineGSPaper(title, desc);
        const id = `ca-${todayStr}-${articles.length + 1}`;

        articles.push({
          id,
          title,
          date: rawDate ? new Date(rawDate).toISOString().split("T")[0] : todayStr,
          source: feed.name,
          sourceUrl: link || feed.url,
          category:
            gsPaper === "GS-2"
              ? "Polity & Governance"
              : gsPaper === "GS-3"
              ? "Economy, Science & Environment"
              : "General Studies",
          gsPaper,
          summary:
            desc && desc.length > 30
              ? desc
              : `Comprehensive briefing from ${feed.name} on: "${title}". Key policy development carrying substantial analytical weight for UPSC CSE Prelims and Mains.`,
          context: `Featured in ${feed.name} daily briefing for Civil Services Aspirants.`,
          whyInNews: `Contemporary national policy and institutional development linked directly with the UPSC syllabus.`,
          prelimsPoints: generatePrelimsPointers(title, gsPaper),
          mainsAngle: generateMainsAngle(title, gsPaper),
          tags: [feed.name, gsPaper, "UPSC Daily Brief"],
          imageUrl,
        });
      }
    } catch {}
  }

  // If live feeds gathered articles, return them
  if (articles.length >= 3) {
    return articles;
  }

  // Fallback to rich UPSC daily briefing
  return getFallbackCurrentAffairs(todayStr);
}

/**
 * High-yield curated UPSC daily briefing fallback.
 */
export function getFallbackCurrentAffairs(dateStr: string): CurrentAffairsArticle[] {
  return [
    {
      id: `ca-${dateStr}-1`,
      title: "The Indian Express Explained: Strategic Architecture of India Semiconductor Mission (ISM) & Wafer Fabs",
      date: dateStr,
      source: "The Indian Express",
      sourceUrl: "https://indianexpress.com/section/explained/explained-economics/",
      category: "Economy & Industrial Policy",
      gsPaper: "GS-3",
      summary:
        "The Union Cabinet has approved dedicated financial support under the India Semiconductor Mission to establish silicon wafer fabs, advanced packaging units (ATMP/OSAT), and display fabrication ecosystems in India.",
      context: "Detailed Explained series covering high-tech manufacturing, global chip supply chains, and digital sovereignty.",
      whyInNews: "Government strategic push to eliminate electronics import vulnerabilities and position India as a global electronics node.",
      keyFacts: [
        "Fiscal support up to 50% of project costs provided on a pari-passu basis by Central Government.",
        "Nodal agency: India Semiconductor Mission (ISM) under MeitY.",
      ],
      prelimsPoints: [
        "Semiconductor manufacturing requires pure monocrystalline silicon wafers and extreme ultraviolet (EUV) lithography.",
        "Production Linked Incentive (PLI) Scheme complements capital subsidy.",
        "Taiwan, South Korea, and the US currently lead the global advanced semiconductor fabrication market.",
      ],
      mainsAngle:
        "Examine the significance of semiconductor manufacturing for India's strategic autonomy and digital economy. What structural bottlenecks must be resolved to create an end-to-end chip ecosystem?",
      tags: ["The Indian Express", "Economy", "Semiconductors", "MeitY", "GS-3"],
    },
    {
      id: `ca-${dateStr}-2`,
      title: "PIB Release: MoEFCC operationalizes Green Credit Programme (GCP) for Afforestation and Water Conservation",
      date: dateStr,
      source: "PIB (Press Information Bureau)",
      sourceUrl: "https://pib.gov.in/allRel.aspx",
      category: "Environment & Climate Change",
      gsPaper: "GS-3",
      summary:
        "The Ministry of Environment, Forest and Climate Change has released technical benchmarks and verified methodologies for issuing Green Credits for tree planting on degraded land and watershed rejuvenation.",
      context: "Press Information Bureau notification under Environment (Protection) Act, 1986.",
      whyInNews: "Operationalization of the Green Credit registry managed by the Indian Council of Forestry Research and Education (ICFRE).",
      keyFacts: [
        "Administered by Indian Council of Forestry Research and Education (ICFRE), Dehradun.",
        "Incentivizes private sector CSR, community organizations, and individuals.",
      ],
      prelimsPoints: [
        "Green Credits are voluntary and non-carbon environmental units.",
        "Notified under the Environment (Protection) Act, 1986.",
        "Aligned with India's NDC target of creating an additional carbon sink of 2.5 to 3 billion tonnes of CO2 equivalent by 2030.",
      ],
      mainsAngle:
        "Critically evaluate the potential of market-driven ecological instruments like the Green Credit Programme in augmenting forest cover and community water resilience.",
      tags: ["PIB", "Environment", "Green Credit", "MoEFCC", "GS-3"],
    },
    {
      id: `ca-${dateStr}-3`,
      title: "PRS Legislative Brief: Criminal Justice Reforms & Bharatiya Sakshya Adhiniyam Digital Evidence Standards",
      date: dateStr,
      source: "PRS Legislative Research",
      sourceUrl: "https://prsindia.org",
      category: "Polity & Judiciary",
      gsPaper: "GS-2",
      summary:
        "Analysis of modern evidentiary standards governing electronic records, zero FIR mechanisms, and mandatory videography during forensic investigations under the new criminal law architecture.",
      context: "Implementation review of Bharatiya Nyaya Sanhita (BNS) and Bharatiya Nagarik Suraksha Sanhita (BNSS).",
      whyInNews: "Nationwide modernization of state police forces and judicial procedural compliance.",
      keyFacts: [
        "Section 61 of BSA gives electronic records the same legal status as paper documents.",
        "Mandates videography of search and seizure operations.",
      ],
      prelimsPoints: [
        "Indian Evidence Act 1872 was repealed and replaced by Bharatiya Sakshya Adhiniyam.",
        "Secondary evidence rules expanded for certified digital certificates.",
        "Law Commission 277th Report recommended safeguards for wrongful prosecution.",
      ],
      mainsAngle:
        "Assess how modern digital evidence standards balance investigative efficiency with fundamental rights under Article 21. What infrastructural upgrades are essential in district trial courts?",
      tags: ["PRS India", "Polity", "Judiciary", "Criminal Law", "GS-2"],
    },
    {
      id: `ca-${dateStr}-4`,
      title: "The Indian Express Explained: Urban Heat Islands (UHI) & Climate-Resilient Metropolitan Drainage",
      date: dateStr,
      source: "The Indian Express",
      sourceUrl: "https://indianexpress.com/section/explained/explained-climate/",
      category: "Geography & Urban Governance",
      gsPaper: "GS-1",
      summary:
        "Analysis of rapid urbanization, destruction of urban wetlands, loss of natural drainage channels, and the compounding Urban Heat Island (UHI) effect causing severe climate vulnerability in metropolitan regions.",
      context: "The Indian Express Explained Climate series on urban climate resilience.",
      whyInNews: "Recurrent urban flooding and heatwaves affecting tier-1 and tier-2 metropolitan hubs.",
      keyFacts: [
        "Urban Heat Island (UHI) effect raises metropolitan temperatures by 3°C to 7°C compared to surrounding rural areas.",
        "Concrete and asphalt absorb high solar radiation, creating thermal traps.",
      ],
      prelimsPoints: [
        "Urban Heat Island (UHI) is caused by high thermal mass materials, lack of evapotranspiration, and anthropogenic heat emission.",
        "National Disaster Management Authority (NDMA) formulated National Guidelines on Management of Urban Flooding (2010).",
        "Sponge City concepts and permeable pavements reduce urban runoff.",
      ],
      mainsAngle:
        "Discuss the structural and institutional shortcomings in India's urban planning that exacerbate urban floods and heatwaves. Suggest sustainable urban governance models based on nature-based solutions.",
      tags: ["The Indian Express", "Geography", "Urban Floods", "UHI", "Disaster Management", "GS-1", "GS-3"],
    },
  ];
}
