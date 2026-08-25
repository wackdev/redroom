import { ChunkType, SourceChunk } from "./types";

export interface ExtractedEntitySet {
  articles: string[];
  cases: string[];
  committees: string[];
  amendments: string[];
  dates: string[];
}

/**
 * Extracts constitutional articles, landmark Supreme Court cases, committees, and amendments from raw text
 */
export function extractKnowledgeEntities(text: string): ExtractedEntitySet {
  const articles = new Set<string>();
  const cases = new Set<string>();
  const committees = new Set<string>();
  const amendments = new Set<string>();
  const dates = new Set<string>();

  // Regex Patterns for UPSC Entities
  const articleRegex = /Article\s+(\d+[A-Za-z]?(?:\s*\(\d+\))*(?:\s*\([a-z]\))*)/gi;
  const caseRegex = /([A-Z][A-Za-z0-9\s.,'&-]+(?:v\.|vs\.)\s+[A-Z][A-Za-z0-9\s.,'&-]+(?:\s*\(\d{4}\))?)/g;
  const committeeRegex = /([A-Z][A-Za-z\s]+(?:Committee|Commission|Panel|Report))(?:\s*\(\d{4}\))?/g;
  const amendmentRegex = /(\d+(?:st|nd|rd|th)?\s+(?:Constitutional\s+)?Amendment(?:\s+Act)?(?:\s*,\s*\d{4})?)/gi;
  const dateRegex = /\b(1[789]\d{2}|20\d{2})\b/g;

  let match: RegExpExecArray | null;

  while ((match = articleRegex.exec(text)) !== null) {
    if (match[1]) articles.add(`Article ${match[1].trim()}`);
  }

  while ((match = caseRegex.exec(text)) !== null) {
    if (match[1] && match[1].length < 80) cases.add(match[1].trim());
  }

  while ((match = committeeRegex.exec(text)) !== null) {
    if (match[1] && match[1].length < 60) committees.add(match[1].trim());
  }

  while ((match = amendmentRegex.exec(text)) !== null) {
    if (match[1]) amendments.add(match[1].trim());
  }

  while ((match = dateRegex.exec(text)) !== null) {
    if (match[1]) dates.add(match[1].trim());
  }

  return {
    articles: Array.from(articles),
    cases: Array.from(cases),
    committees: Array.from(committees),
    amendments: Array.from(amendments),
    dates: Array.from(dates),
  };
}

/**
 * Categorizes a section of study text into a semantic chunk type
 */
export function classifyChunkType(heading: string, content: string): ChunkType {
  const hHead = heading.toLowerCase();
  const hAll = (heading + " " + content.slice(0, 300)).toLowerCase();

  // Check explicit heading hints first
  if (hHead.includes("judgment") || hHead.includes("case") || hHead.includes("verdict") || hHead.includes("ruling")) return "case_law";
  if (hHead.includes("amendment")) return "amendment";
  if (hHead.includes("committee") || hHead.includes("commission") || hHead.includes("report")) return "committee";
  if (hHead.includes("article") || hHead.includes("clause") || hHead.includes("provision")) return "constitutional_provision";
  if (hHead.includes("timeline") || hHead.includes("chronology")) return "timeline";
  if (hHead.includes("table") || hHead.includes("comparison") || hHead.includes("vs.")) return "comparison";
  if (hHead.includes("way forward") || hHead.includes("reform")) return "way_forward";
  if (hHead.includes("challenge") || hHead.includes("issue") || hHead.includes("criticism")) return "challenges";

  // General content fallback classification
  if (hAll.includes("introduction") || hAll.includes("overview")) return "introduction";
  if (hAll.includes("case") || hAll.includes("judgment") || hAll.includes("ruling") || hAll.includes("supreme court")) return "case_law";
  if (hAll.includes("article") || hAll.includes("clause") || hAll.includes("constitutional provision")) return "constitutional_provision";
  if (hAll.includes("amendment")) return "amendment";
  if (hAll.includes("committee") || hAll.includes("commission") || hAll.includes("report") || hAll.includes("recommendation")) return "committee";
  if (hAll.includes("scheme") || hAll.includes("mission") || hAll.includes("policy")) return "scheme";
  if (hAll.includes("causes") || hAll.includes("factors")) return "causes";
  if (hAll.includes("effects") || hAll.includes("impact") || hAll.includes("consequences")) return "effects";
  if (hAll.includes("challenges") || hAll.includes("issues") || hAll.includes("criticism") || hAll.includes("loopholes")) return "challenges";
  if (hAll.includes("way forward") || hAll.includes("reforms suggested") || hAll.includes("solution")) return "way_forward";
  if (hAll.includes("conclusion")) return "conclusion";
  if (hAll.includes("comparison") || hAll.includes("vs.") || hAll.includes("versus")) return "comparison";
  if (hAll.includes("table") || hAll.includes("comparative summary")) return "table";
  if (hAll.includes("timeline") || hAll.includes("chronology")) return "timeline";
  if (hAll.includes("prelims") || hAll.includes("fact")) return "prelims_fact";
  if (hAll.includes("mains") || hAll.includes("dimension")) return "mains_dimension";

  return "concept";
}

/**
 * Extracts high-frequency UPSC keywords from content
 */
export function generateChunkKeywords(text: string): string[] {
  const stopwords = new Set([
    "the", "and", "that", "for", "with", "this", "from", "have", "been", "which",
    "are", "was", "were", "into", "their", "under", "shall", "about", "these", "also",
    "will", "such", "over", "other", "when", "more", "most", "than", "between", "where",
    "after", "before", "upon", "only", "would", "could", "should", "those", "being"
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopwords.has(w));

  const freqMap = new Map<string, number>();
  words.forEach((w) => freqMap.set(w, (freqMap.get(w) || 0) + 1));

  return Array.from(freqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w);
}
