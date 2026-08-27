import {
  UniversalTopic,
  SourceChunk,
  KnowledgeSearchResultItem,
  KnowledgeSearchResponse,
} from "./types";
import { STATIC_PYQ_DATASET } from "@/lib/study/pyq-engine";
import { STATIC_MAINS_PYQ_DATASET } from "@/lib/mains-pyq/static-dataset";

// Global Acronym Dictionary for instant UPSC query expansion
const ACRONYM_MAP: Record<string, string> = {
  fr: "Fundamental Rights",
  frs: "Fundamental Rights",
  dpsp: "Directive Principles of State Policy",
  dpsps: "Directive Principles of State Policy",
  fd: "Fundamental Duties",
  fds: "Fundamental Duties",
  ucc: "Uniform Civil Code",
  onoe: "One Nation One Election",
  cag: "Comptroller and Auditor General",
  eci: "Election Commission of India",
  rbi: "Reserve Bank of India",
  sebi: "Securities and Exchange Board of India",
  irdai: "Insurance Regulatory and Development Authority",
  trai: "Telecom Regulatory Authority of India",
  cci: "Competition Commission of India",
  nclt: "National Company Law Tribunal",
  nclat: "National Company Law Appellate Tribunal",
  itat: "Income Tax Appellate Tribunal",
  ngt: "National Green Tribunal",
  cat: "Central Administrative Tribunal",
  drt: "Debt Recovery Tribunals",
  nhrc: "National Human Rights Commission",
  shrc: "State Human Rights Commission",
  cic: "Central Information Commission",
  sic: "State Information Commission",
  cvc: "Central Vigilance Commission",
  ncw: "National Commission for Women",
  ncm: "National Commission for Minorities",
  ncdrc: "National Consumer Disputes Redressal Commission",
  ncsc: "National Commission for Scheduled Castes",
  ncst: "National Commission for Scheduled Tribes",
  ncbc: "National Commission for Backward Classes",
  caa: "Citizenship Amendment Act",
  nrc: "National Register of Citizens",
  npr: "National Population Register",
  pesa: "Panchayats Extension to Scheduled Areas",
  pri: "Panchayati Raj Institutions",
  pris: "Panchayati Raj Institutions",
  ulb: "Urban Local Bodies",
  ulbs: "Urban Local Bodies",
  rpa: "Representation of People Act",
  mcc: "Model Code of Conduct",
  evm: "Electronic Voting Machine",
  vvpat: "Voter Verifiable Paper Audit Trail",
  pil: "Public Interest Litigation",
  adr: "Alternative Dispute Resolution",
  drsc: "Departmental Standing Committees",
  pac: "Public Accounts Committee",
  copu: "Committee on Public Undertakings",
  gst: "Goods and Services Tax",
  cpi: "Consumer Price Index",
  wpi: "Wholesale Price Index",
  npa: "Non Performing Assets",
  ibc: "Insolvency and Bankruptcy Code",
  sarfaesi: "Securitisation and Reconstruction of Financial Assets",
};

/**
 * Normalizes and expands search queries using the UPSC Acronym Dictionary
 */
export function normalizeQuery(query: string): string {
  const clean = query.trim().toLowerCase();
  if (ACRONYM_MAP[clean]) {
    return ACRONYM_MAP[clean];
  }
  return query.trim();
}

/**
 * Executes high-performance Hybrid Search across Topics, Chunks, PYQs, and Revision
 */
export function executeKnowledgeSearch(
  query: string,
  allTopics: UniversalTopic[],
  allChunks: SourceChunk[]
): KnowledgeSearchResponse {
  const startTime = Date.now();
  const rawQ = query.trim();
  const normalizedQ = normalizeQuery(rawQ).toLowerCase();
  const tokens = normalizedQ.split(/\s+/).filter(Boolean);

  const matchedTopics: KnowledgeSearchResultItem[] = [];
  const matchedConcepts: KnowledgeSearchResultItem[] = [];
  const matchedSourceNotes: KnowledgeSearchResultItem[] = [];
  const matchedPyqs: KnowledgeSearchResultItem[] = [];
  const matchedMains: KnowledgeSearchResultItem[] = [];
  const matchedRevision: KnowledgeSearchResultItem[] = [];

  if (!rawQ) {
    return {
      query,
      totalResults: 0,
      executionTimeMs: 0,
      categories: {
        topics: [],
        concepts: [],
        sourceNotes: [],
        pyqs: [],
        mains: [],
        revision: [],
      },
    };
  }

  // 1. TOPIC & CONCEPT MATCHING
  for (const t of allTopics) {
    const nameLower = t.name.toLowerCase();
    const slugLower = t.slug.toLowerCase();
    const descLower = (t.description || "").toLowerCase();
    const aliasLower = (t.aliases || []).map((a) => a.toLowerCase());
    const articlesLower = (t.keyArticles || []).map((a) => a.toLowerCase());
    const casesLower = (t.landmarkCases || []).map((c) => c.toLowerCase());

    let score = 0;

    // Exact Match
    if (nameLower === normalizedQ || slugLower === normalizedQ) {
      score += 100;
    } else if (aliasLower.includes(rawQ.toLowerCase()) || aliasLower.includes(normalizedQ)) {
      score += 95;
    } else if (nameLower.includes(normalizedQ)) {
      score += 85;
    } else if (articlesLower.some((a) => a.includes(rawQ.toLowerCase()))) {
      score += 90;
    } else if (casesLower.some((c) => c.includes(rawQ.toLowerCase()))) {
      score += 88;
    } else {
      const keywordsLower = (t.keywords || []).map((k: string) => k.toLowerCase());
      const matchCount = tokens.filter(
        (tok) =>
          nameLower.includes(tok) ||
          descLower.includes(tok) ||
          keywordsLower.some((k: string) => k.includes(tok))
      ).length;
      if (matchCount > 0) {
        score += Math.round((matchCount / tokens.length) * 75);
      }
    }

    if (score > 30) {
      const item: KnowledgeSearchResultItem = {
        id: t.id,
        category: t.topicLevel === "concept" ? "CONCEPTS" : "TOPICS",
        title: t.name,
        subject: t.subjectId.replace(/_/g, " ").toUpperCase(),
        topicPath: `${t.subjectId.replace(/_/g, " ").toUpperCase()} → ${t.name}`,
        relevanceScore: Math.min(100, score + (t.importanceScore ? t.importanceScore * 0.1 : 0)),
        previewText:
          t.summary30s ||
          t.description ||
          `Comprehensive UPSC notes, legal provisions, and PYQs for ${t.name}.`,
        slug: t.slug,
        meta: {
          level: t.topicLevel,
          importance: t.importanceScore,
          pyqCount: t.pyqCount,
          sourceCount: t.sourceCount,
        },
      };

      if (t.topicLevel === "concept") {
        matchedConcepts.push(item);
      } else {
        matchedTopics.push(item);
      }
    }
  }

  // 2. SOURCE CHUNK MATCHING
  for (const c of allChunks) {
    const textLower = c.searchableContent.toLowerCase();
    const headingLower = (c.heading || "").toLowerCase();

    let chunkScore = 0;
    if (headingLower.includes(normalizedQ)) {
      chunkScore += 80;
    } else {
      const matchCount = tokens.filter((tok) => textLower.includes(tok)).length;
      if (matchCount > 0) {
        chunkScore += Math.round((matchCount / tokens.length) * 65);
      }
    }

    if (chunkScore > 35) {
      const startIdx = Math.max(0, textLower.indexOf(tokens[0] || "") - 40);
      const snippet = c.cleanedContent.slice(startIdx, startIdx + 220) + "...";

      matchedSourceNotes.push({
        id: c.id,
        category: "SOURCE_NOTES",
        title: c.heading || `${c.sourceTitle || "Reference Source"} (p. ${c.pageStart})`,
        subject: "INDIAN POLITY",
        topicPath: `${c.sourceTitle || "Source"} (Page ${c.pageStart}–${c.pageEnd})`,
        relevanceScore: chunkScore,
        sourceName: c.sourceTitle || "ISSF Gold Standard Series",
        pageNumber: c.pageStart,
        previewText: snippet,
        slug: c.topicId || "indian-polity",
        meta: {
          chunkType: c.chunkType,
          pageStart: c.pageStart,
          pageEnd: c.pageEnd,
          ocrConfidence: c.ocrConfidence,
        },
      });
    }
  }

  // 3. PRELIMS PYQ MATCHING
  for (const pyq of STATIC_PYQ_DATASET) {
    const qLower = (pyq.question + " " + pyq.explanation + " " + (pyq.topic || "")).toLowerCase();
    const matchCount = tokens.filter((tok) => qLower.includes(tok)).length;
    if (matchCount > 0) {
      const relevance = Math.round((matchCount / tokens.length) * 85);
      if (relevance > 40) {
        matchedPyqs.push({
          id: String(pyq.id),
          category: "PYQS",
          title: `UPSC Prelims ${pyq.year} (${pyq.subject})`,
          subject: pyq.subject.toUpperCase(),
          topicPath: `Prelims PYQ Archive → ${pyq.subject} → ${pyq.topic}`,
          relevanceScore: relevance,
          previewText: pyq.question.slice(0, 180) + "...",
          slug: "pyqs",
          meta: {
            year: pyq.year,
            correctAnswer: pyq.correctAnswer,
            difficulty: pyq.difficulty,
          },
        });
      }
    }
  }

  // 4. MAINS PYQ MATCHING
  for (const m of STATIC_MAINS_PYQ_DATASET) {
    const mLower = (m.question + " " + m.subject + " " + (m.topic || "")).toLowerCase();
    const matchCount = tokens.filter((tok) => mLower.includes(tok)).length;
    if (matchCount > 0) {
      const relevance = Math.round((matchCount / tokens.length) * 85);
      if (relevance > 40) {
        matchedMains.push({
          id: String(m.id),
          category: "MAINS_QUESTIONS",
          title: `UPSC Mains ${m.year} (${m.paper} • ${m.marks}M)`,
          subject: m.subject.toUpperCase(),
          topicPath: `Mains Question Bank → ${m.paper} → ${m.topic}`,
          relevanceScore: relevance,
          previewText: m.question.slice(0, 180) + "...",
          slug: "mains-pyqs",
          meta: {
            year: m.year,
            marks: m.marks,
            wordLimit: m.wordLimit,
          },
        });
      }
    }
  }

  // Sort each category by relevanceScore desc
  matchedTopics.sort((a, b) => b.relevanceScore - a.relevanceScore);
  matchedConcepts.sort((a, b) => b.relevanceScore - a.relevanceScore);
  matchedSourceNotes.sort((a, b) => b.relevanceScore - a.relevanceScore);
  matchedPyqs.sort((a, b) => b.relevanceScore - a.relevanceScore);
  matchedMains.sort((a, b) => b.relevanceScore - a.relevanceScore);

  const totalResults =
    matchedTopics.length +
    matchedConcepts.length +
    matchedSourceNotes.length +
    matchedPyqs.length +
    matchedMains.length;

  return {
    query,
    totalResults,
    executionTimeMs: Date.now() - startTime,
    categories: {
      topics: matchedTopics.slice(0, 10),
      concepts: matchedConcepts.slice(0, 10),
      sourceNotes: matchedSourceNotes.slice(0, 15),
      pyqs: matchedPyqs.slice(0, 8),
      mains: matchedMains.slice(0, 8),
      revision: matchedRevision.slice(0, 8),
    },
  };
}
