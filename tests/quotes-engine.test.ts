import {
  getAllQuotes,
  getQuotesByTheme,
  getQuotesByPaper,
  searchQuotes,
  getRandomQuote,
  getQuotesForEssayTopic,
  getQuoteStats,
  getQuoteById,
} from "../lib/knowledge/quotes-engine";
import { UPSC_QUOTES_DATASET } from "../lib/knowledge/datasets/quotes-dataset";

export async function runQuotesEngineTests() {
  console.log("------------------------------------------------------------");
  console.log("  TEST: UPSC CSE MAINS QUOTES & THINKERS ENGINE");
  console.log("------------------------------------------------------------");

  // 1. Validate dataset count and completeness
  const allQuotes = getAllQuotes();
  if (allQuotes.length < 320) {
    throw new Error(`Expected at least 320 quotes, found ${allQuotes.length}`);
  }
  console.log(`  ✔ Validated total ${allQuotes.length} Master UPSC Quotes in dataset`);

  // 2. Validate structural integrity of each quote
  for (const q of allQuotes) {
    if (!q.id || !q.theme || !q.quote || !q.author || !q.coreConcept || !q.placement || !q.anchoringTips) {
      throw new Error(`Quote ${q.id} has missing required fields`);
    }
    if (!Array.isArray(q.applicablePapers) || q.applicablePapers.length === 0) {
      throw new Error(`Quote ${q.id} has no applicable papers defined`);
    }
  }
  console.log(`  ✔ Verified 100% field integrity across all ${allQuotes.length} quote objects`);

  // 3. Test Theme Filtering
  const societyQuotes = getQuotesByTheme("Society");
  const polityQuotes = getQuotesByTheme("Polity");
  const ethicsQuotes = getQuotesByTheme("Ethics & Integrity");
  const envQuotes = getQuotesByTheme("Environment");

  if (societyQuotes.length === 0 || polityQuotes.length === 0 || ethicsQuotes.length === 0 || envQuotes.length === 0) {
    throw new Error("Theme filtering returned 0 results for major themes");
  }
  console.log(
    `  ✔ Theme filtering validated: Society (${societyQuotes.length}), Polity (${polityQuotes.length}), Ethics (${ethicsQuotes.length}), Environment (${envQuotes.length})`
  );

  // 4. Test Paper Filtering
  const essayQuotes = getQuotesByPaper("Essay");
  const gs4Quotes = getQuotesByPaper("GS-4");
  const gs2Quotes = getQuotesByPaper("GS-2");

  if (essayQuotes.length < 200 || gs4Quotes.length < 40) {
    throw new Error("Paper filtering numbers below expected thresholds");
  }
  console.log(
    `  ✔ Paper filtering validated: Essay (${essayQuotes.length}), GS-4 (${gs4Quotes.length}), GS-2 (${gs2Quotes.length})`
  );

  // 5. Test Full-Text Search
  const searchGandhi = searchQuotes({ query: "Gandhi" });
  if (searchGandhi.filteredCount === 0) {
    throw new Error("Search for 'Gandhi' returned 0 results");
  }
  console.log(`  ✔ Search 'Gandhi' -> Found ${searchGandhi.filteredCount} quotes`);

  const searchJustice = searchQuotes({ query: "justice", paper: "GS-4" });
  if (searchJustice.filteredCount === 0) {
    throw new Error("Search for 'justice' in GS-4 returned 0 results");
  }
  console.log(`  ✔ Search 'justice' [GS-4] -> Found ${searchJustice.filteredCount} quotes`);

  // 6. Test Random Quote & ID Lookup
  const randomQ = getRandomQuote("Ethics & Integrity");
  if (randomQ.theme !== "Ethics & Integrity") {
    throw new Error("Random quote returned wrong theme");
  }
  const byId = getQuoteById("quote-1");
  if (!byId || !byId.quote.includes("Injustice anywhere")) {
    throw new Error("Quote-1 lookup failed");
  }
  console.log(`  ✔ Random Quote & ID Lookup ('quote-1') passed`);

  // 7. Test Essay Topic Quote Recommender
  const recommended = getQuotesForEssayTopic("Climate change and environmental sustainability", 3);
  if (recommended.length === 0 || !recommended.some((r) => r.theme === "Environment")) {
    throw new Error("Essay topic matcher failed for environmental query");
  }
  console.log(`  ✔ Essay Topic Matcher: Found ${recommended.length} topically aligned quote hooks`);

  // 8. Test Stats Aggregator
  const stats = getQuoteStats();
  if (stats.total !== UPSC_QUOTES_DATASET.length) {
    throw new Error("Stats total mismatch");
  }
  console.log(`  ✔ Stats aggregation: ${Object.keys(stats.byTheme).length} themes, ${Object.keys(stats.byPaper).length} papers`);

  console.log("  🟢 All UPSC Quotes Engine tests passed!\n");
}
