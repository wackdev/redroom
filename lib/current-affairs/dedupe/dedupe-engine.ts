import { CurrentAffairsArticle } from "@/lib/core/types";

/**
 * Deduplicates articles based on normalized title similarity and source URLs.
 */
export function deduplicateArticles(articles: CurrentAffairsArticle[]): CurrentAffairsArticle[] {
  if (!Array.isArray(articles)) return [];

  const seenSlugs = new Set<string>();
  const seenUrls = new Set<string>();
  const deduped: CurrentAffairsArticle[] = [];

  for (const article of articles) {
    if (!article || typeof article.title !== "string") continue;

    const normalizedSlug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 40);

    const normalizedUrl = article.sourceUrl ? article.sourceUrl.trim().toLowerCase() : "";

    if (seenSlugs.has(normalizedSlug)) {
      continue;
    }

    if (normalizedUrl && seenUrls.has(normalizedUrl)) {
      continue;
    }

    seenSlugs.add(normalizedSlug);
    if (normalizedUrl) seenUrls.add(normalizedUrl);
    deduped.push(article);
  }

  return deduped;
}
