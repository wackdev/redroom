import { RevisionConfidence, RevisionItem } from "../core/types";
import { getDateKey } from "../core/utils";
import { createAdminClient } from "../db/supabase";
import { calculateSM2, calculateUrgencyScore } from "./spaced-repetition";

export const DEFAULT_REVISION_TOPICS: Array<{
  topicId: string;
  topicName: string;
  subject: string;
  importance: "High" | "Medium" | "Low";
}> = [
  {
    topicId: "polity-fr",
    topicName: "Fundamental Rights & Writs (Articles 12-35)",
    subject: "Polity",
    importance: "High",
  },
  {
    topicId: "polity-dpsp",
    topicName: "Directive Principles of State Policy (Articles 36-51)",
    subject: "Polity",
    importance: "High",
  },
  {
    topicId: "economy-monetary",
    topicName: "Monetary Policy, RBI Tools & Inflation Targeting",
    subject: "Economy",
    importance: "High",
  },
  {
    topicId: "history-revolt1857",
    topicName: "Revolt of 1857 & Administrative Changes Act 1858",
    subject: "History",
    importance: "Medium",
  },
  {
    topicId: "env-biodiversity",
    topicName: "Biodiversity Hotspots & Protected Area Network",
    subject: "Environment",
    importance: "High",
  },
  {
    topicId: "geo-monsoon",
    topicName: "Indian Monsoon Mechanism & El Niño Southern Oscillation",
    subject: "Geography",
    importance: "High",
  },
];

/**
 * Loads user revision queue, prioritizing overdue and high urgency topics.
 */
export async function getUserRevisionQueue(userId?: string): Promise<RevisionItem[]> {
  const todayStr = getDateKey();

  if (userId) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("revision_items")
        .select("*")
        .eq("user_id", userId)
        .order("next_review_date", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((row) => {
          const isOverdue = row.next_review_date <= todayStr;
          return {
            id: row.id,
            userId: row.user_id,
            topicId: row.topic_id,
            topicName: row.topic_name,
            subject: row.subject,
            upscImportance: row.upsc_importance || "High",
            repetitionCount: row.repetition_count || 0,
            easeFactor: Number(row.ease_factor || 2.5),
            intervalDays: row.interval_days || 1,
            lastReviewedAt: row.last_reviewed_at,
            nextReviewDate: row.next_review_date,
            urgencyScore: calculateUrgencyScore(row.next_review_date, row.upsc_importance),
            isOverdue,
          };
        });
      }
    } catch (err) {
      console.warn("[RevisionEngine] Database load error:", err);
    }
  }

  // Fallback default revision queue
  return DEFAULT_REVISION_TOPICS.map((item, index) => {
    const nextDate = index < 3 ? todayStr : getDateKey(new Date(Date.now() + index * 86400000));
    return {
      id: `rev-${item.topicId}`,
      userId: userId || "local-user",
      topicId: item.topicId,
      topicName: item.topicName,
      subject: item.subject,
      upscImportance: item.importance,
      repetitionCount: 0,
      easeFactor: 2.5,
      intervalDays: 1,
      nextReviewDate: nextDate,
      urgencyScore: calculateUrgencyScore(nextDate, item.importance),
      isOverdue: nextDate <= todayStr,
    };
  });
}

/**
 * Records a revision attempt and computes the new spaced repetition schedule.
 */
export async function logRevisionReview(
  userId: string,
  topicId: string,
  topicName: string,
  subject: string,
  confidence: RevisionConfidence,
  upscImportance: "High" | "Medium" | "Low" = "High"
): Promise<RevisionItem> {
  const currentQueue = await getUserRevisionQueue(userId);
  const existing = currentQueue.find((q) => q.topicId === topicId);

  const reps = existing ? existing.repetitionCount : 0;
  const interval = existing ? existing.intervalDays : 1;
  const ease = existing ? existing.easeFactor : 2.5;

  const sm2 = calculateSM2(confidence, reps, interval, ease, upscImportance);

  const updatedItem: RevisionItem = {
    id: existing?.id || `rev-${topicId}`,
    userId,
    topicId,
    topicName,
    subject,
    upscImportance,
    repetitionCount: sm2.repetitionCount,
    easeFactor: sm2.easeFactor,
    intervalDays: sm2.intervalDays,
    lastReviewedAt: new Date().toISOString(),
    nextReviewDate: sm2.nextReviewDate,
    urgencyScore: sm2.urgencyScore,
    isOverdue: sm2.isOverdue,
  };

  try {
    const supabase = createAdminClient();
    await supabase.from("revision_items").upsert(
      {
        user_id: userId,
        topic_id: topicId,
        topic_name: topicName,
        subject,
        upsc_importance: upscImportance,
        repetition_count: sm2.repetitionCount,
        ease_factor: sm2.easeFactor,
        interval_days: sm2.intervalDays,
        last_reviewed_at: updatedItem.lastReviewedAt,
        next_review_date: sm2.nextReviewDate,
      },
      { onConflict: "user_id,topic_id" }
    );
  } catch (err) {
    console.warn("[RevisionEngine] Supabase update failed:", err);
  }

  return updatedItem;
}
