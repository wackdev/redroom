import { CurrentAffairsArticle } from "../core/types";
import { getDateKey } from "../core/utils";
import { createAdminClient } from "../db/supabase";
import { scrapeMultiSourceCurrentAffairs } from "./scraper";

const memoryCache = new Map<string, { articles: CurrentAffairsArticle[]; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 mins

/**
 * Retrieves daily Current Affairs articles from Indian Express and PIB feeds.
 */
export async function getDailyCurrentAffairs(dateStr: string = getDateKey()): Promise<CurrentAffairsArticle[]> {
  // 1. Check in-memory cache
  const cached = memoryCache.get(dateStr);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS && cached.articles.length > 0) {
    return cached.articles;
  }

  // 2. Fetch fresh multi-source feed from Indian Express and PIB
  const freshArticles = await scrapeMultiSourceCurrentAffairs();

  if (freshArticles.length > 0) {
    memoryCache.set(dateStr, { articles: freshArticles, timestamp: Date.now() });
    return freshArticles;
  }

  // 3. Fallback to Supabase database cache if available
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("current_affairs_cache")
      .select("*")
      .eq("date", dateStr)
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      const dbArticles: CurrentAffairsArticle[] = data.map((row) => ({
        id: row.id,
        title: row.title,
        date: row.date,
        source: row.source || "The Indian Express",
        sourceUrl: row.source_url,
        category: row.category || "General",
        gsPaper: row.gs_paper || "GS-2",
        summary: row.summary,
        context: row.context,
        whyInNews: row.why_in_news,
        keyFacts: row.key_facts || [],
        prelimsPoints: row.prelims_points || [],
        mainsAngle: row.mains_angle,
        tags: row.tags || [],
        rawContent: row.raw_content,
        quiz: row.quiz_json || undefined,
      }));

      memoryCache.set(dateStr, { articles: dbArticles, timestamp: Date.now() });
      return dbArticles;
    }
  } catch (dbErr) {
    console.warn("[CurrentAffairsCache] Database query error:", dbErr);
  }

  return freshArticles;
}
