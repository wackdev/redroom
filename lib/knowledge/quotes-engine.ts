import {
  UPSC_QUOTES_DATASET,
  UPSCQuote,
  QuoteTheme,
  ApplicablePaper,
} from "./datasets/quotes-dataset";

export interface QuotesFilterOptions {
  theme?: QuoteTheme | "ALL";
  paper?: ApplicablePaper | "ALL";
  query?: string;
  limit?: number;
  offset?: number;
}

export interface QuotesSearchResult {
  quotes: UPSCQuote[];
  total: number;
  filteredCount: number;
}

/**
 * Returns all quotes in the master dataset
 */
export function getAllQuotes(): UPSCQuote[] {
  return UPSC_QUOTES_DATASET;
}

/**
 * Get quote by ID
 */
export function getQuoteById(id: string): UPSCQuote | undefined {
  return UPSC_QUOTES_DATASET.find((q) => q.id === id);
}

/**
 * Retrieves quotes by theme
 */
export function getQuotesByTheme(theme: QuoteTheme | "ALL"): UPSCQuote[] {
  if (theme === "ALL") return UPSC_QUOTES_DATASET;
  return UPSC_QUOTES_DATASET.filter((q) => q.theme === theme);
}

/**
 * Retrieves quotes by applicable UPSC paper
 */
export function getQuotesByPaper(paper: ApplicablePaper | "ALL"): UPSCQuote[] {
  if (paper === "ALL") return UPSC_QUOTES_DATASET;
  return UPSC_QUOTES_DATASET.filter((q) => q.applicablePapers.includes(paper));
}

/**
 * Full-text search across quotes, author names, themes, and core concepts
 */
export function searchQuotes(options: QuotesFilterOptions = {}): QuotesSearchResult {
  const { theme = "ALL", paper = "ALL", query = "", limit, offset = 0 } = options;
  const cleanQuery = query.trim().toLowerCase();

  const filtered = UPSC_QUOTES_DATASET.filter((item) => {
    // Theme filter
    if (theme !== "ALL" && item.theme !== theme) {
      return false;
    }

    // Paper filter
    if (paper !== "ALL" && !item.applicablePapers.includes(paper)) {
      return false;
    }

    // Search query
    if (cleanQuery) {
      const matchQuote = item.quote.toLowerCase().includes(cleanQuery);
      const matchAuthor = item.author.toLowerCase().includes(cleanQuery);
      const matchConcept = item.coreConcept.toLowerCase().includes(cleanQuery);
      const matchTheme = item.theme.toLowerCase().includes(cleanQuery);
      const matchAnchoring = item.anchoringTips.toLowerCase().includes(cleanQuery);

      if (!matchQuote && !matchAuthor && !matchConcept && !matchTheme && !matchAnchoring) {
        return false;
      }
    }

    return true;
  });

  const total = UPSC_QUOTES_DATASET.length;
  const filteredCount = filtered.length;
  const quotes = limit ? filtered.slice(offset, offset + limit) : filtered.slice(offset);

  return {
    quotes,
    total,
    filteredCount,
  };
}

/**
 * Picks a random quote, optionally filtered by theme
 */
export function getRandomQuote(theme: QuoteTheme | "ALL" = "ALL"): UPSCQuote {
  const pool = getQuotesByTheme(theme);
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || UPSC_QUOTES_DATASET[0];
}

/**
 * Finds relevant quote hooks for an essay or ethics dilemma topic
 */
export function getQuotesForEssayTopic(topic: string, limit = 4): UPSCQuote[] {
  const clean = topic.toLowerCase();
  const words = clean.split(/\s+/).filter((w) => w.length > 3);

  // Score each quote
  const scored = UPSC_QUOTES_DATASET.map((q) => {
    let score = 0;
    const textToMatch = `${q.quote} ${q.author} ${q.coreConcept} ${q.theme} ${q.anchoringTips}`.toLowerCase();

    for (const w of words) {
      if (textToMatch.includes(w)) {
        score += 2;
      }
    }

    // Direct thematic boosts
    if (clean.includes("environment") || clean.includes("climate") || clean.includes("planet")) {
      if (q.theme === "Environment") score += 5;
    }
    if (clean.includes("tech") || clean.includes("ai") || clean.includes("science")) {
      if (q.theme === "Science & Tech") score += 5;
    }
    if (clean.includes("women") || clean.includes("poverty") || clean.includes("inequality") || clean.includes("society")) {
      if (q.theme === "Society") score += 5;
    }
    if (clean.includes("governance") || clean.includes("democracy") || clean.includes("polity") || clean.includes("constitution")) {
      if (q.theme === "Polity") score += 5;
    }
    if (clean.includes("ethics") || clean.includes("morality") || clean.includes("integrity") || clean.includes("duty")) {
      if (q.theme === "Ethics & Integrity") score += 5;
    }
    if (clean.includes("growth") || clean.includes("economy") || clean.includes("development") || clean.includes("capital")) {
      if (q.theme === "Economy") score += 5;
    }

    return { quote: q, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.quote);
}

/**
 * Aggregates statistics for the dataset
 */
export function getQuoteStats() {
  const byTheme: Record<string, number> = {};
  const byPaper: Record<string, number> = {};

  for (const q of UPSC_QUOTES_DATASET) {
    byTheme[q.theme] = (byTheme[q.theme] || 0) + 1;
    for (const p of q.applicablePapers) {
      byPaper[p] = (byPaper[p] || 0) + 1;
    }
  }

  return {
    total: UPSC_QUOTES_DATASET.length,
    byTheme,
    byPaper,
  };
}
