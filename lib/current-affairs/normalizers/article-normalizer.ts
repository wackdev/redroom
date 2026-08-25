import { CurrentAffairsArticle } from "@/lib/core/types";

/**
 * Normalizes raw or scraped article objects into strict, safe CurrentAffairsArticle data models.
 * Enforces safe arrays and ensures no undefined slicing or iteration crashes.
 */
export function normalizeArticle(raw: Partial<CurrentAffairsArticle> | Record<string, unknown>): CurrentAffairsArticle {
  const r = raw as Record<string, unknown>;
  const title = typeof r.title === "string" ? r.title.trim() : "Untitled UPSC Brief";

  const tags = Array.isArray(r.tags)
    ? (r.tags.filter((t): t is string => typeof t === "string") as string[])
    : ["UPSC", "CurrentAffairs"];

  const keyFacts = Array.isArray(r.keyFacts)
    ? (r.keyFacts.filter((f): f is string => typeof f === "string") as string[])
    : [];

  const prelimsPoints = Array.isArray(r.prelimsPoints)
    ? (r.prelimsPoints.filter((p): p is string => typeof p === "string") as string[])
    : [];

  const rawQuiz = Array.isArray(r.quiz) ? r.quiz : [];
  const quiz = rawQuiz.map((q: any, idx: number) => ({
    id: q?.id || `quiz-q-${idx}-${Date.now()}`,
    question: typeof q?.question === "string" ? q.question : "Sample Question",
    options: Array.isArray(q?.options) ? q.options : [],
    answer: (["A", "B", "C", "D"].includes(q?.answer) ? q.answer : "A") as "A" | "B" | "C" | "D",
    explanation: typeof q?.explanation === "string" ? q.explanation : "Standard UPSC Explanation.",
  }));

  const date = typeof r.date === "string" ? r.date : (typeof r.publishedAt === "string" ? r.publishedAt : new Date().toISOString());

  return {
    id: typeof r.id === "string" ? r.id : `art-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    date,
    source: typeof r.source === "string" ? r.source : "The Hindu / Express",
    sourceUrl: typeof r.sourceUrl === "string" ? r.sourceUrl : "https://indianexpress.com",
    category: typeof r.category === "string" ? r.category : "National Affairs",
    gsPaper: (["GS-1", "GS-2", "GS-3", "GS-4"].includes(r.gsPaper as string)
      ? (r.gsPaper as any)
      : "GS-2"),
    summary: typeof r.summary === "string" ? r.summary : "Summary pending compilation.",
    whyInNews: typeof r.whyInNews === "string" ? r.whyInNews : "Recent development under government policy.",
    background: typeof r.background === "string" ? r.background : "Constitutional / statutory context.",
    keyFacts,
    prelimsPoints,
    mainsAngle: typeof r.mainsAngle === "string" ? r.mainsAngle : "Dimensions, challenges & way forward.",
    pyqConnection: typeof r.pyqConnection === "string" ? r.pyqConnection : "Related to GS-2 Governance themes.",
    tags,
    quiz,
    imageUrl: typeof r.imageUrl === "string" ? r.imageUrl : undefined,
    createdAt: typeof r.createdAt === "string" ? r.createdAt : new Date().toISOString(),
  };
}

export function normalizeArticleList(rawList: unknown): CurrentAffairsArticle[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map((item) => normalizeArticle(item));
}
