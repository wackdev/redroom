import { PYQAttempt, PYQQuestion, MistakeType } from "../core/types";
import { createAdminClient, isSupabaseConfigured } from "../db/supabase";

import { STATIC_PYQ_DATASET } from "./static-dataset";
export { STATIC_PYQ_DATASET };

/**
 * Loads all available PYQs from static JSON datasets and merges with Supabase if online and configured.
 */
export async function getAllPYQs(): Promise<PYQQuestion[]> {
  const mergedMap = new Map<string, PYQQuestion>();

  // 1. Load all static questions from our curated JSON files
  for (const q of STATIC_PYQ_DATASET) {
    mergedMap.set(String(q.id), q);
  }

  // 2. Overlay / add any remote questions from Supabase ONLY if Supabase is properly configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("pyqs")
        .select("*")
        .order("year", { ascending: false })
        .order("id", { ascending: true });

      if (!error && data && data.length > 0) {
        for (const row of data) {
          if (!mergedMap.has(String(row.id))) {
            mergedMap.set(String(row.id), {
              id: row.id,
              year: row.year,
              subject: row.subject,
              topic: row.topic || "General",
              subtopic: row.subtopic,
              paper: row.paper || "GS-1",
              question: row.question,
              options: [
                { id: "A", text: row.option_a || "" },
                { id: "B", text: row.option_b || "" },
                { id: "C", text: row.option_c || "" },
                { id: "D", text: row.option_d || "" },
              ],
              correctAnswer: (row.correct_answer || "A") as "A" | "B" | "C" | "D",
              explanation: row.explanation || "",
              difficulty: (row.difficulty || "Medium") as "Easy" | "Medium" | "Hard",
              important: Boolean(row.important),
              conceptTags: row.concept_tags || [],
              createdAt: row.created_at,
            });
          }
        }
      }
    } catch (err) {
      console.warn("[PYQDatabase] Supabase query failed, using static dataset:", err);
    }
  }

  return Array.from(mergedMap.values()).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return String(a.id).localeCompare(String(b.id));
  });
}

/**
 * Logs a question attempt, tracking correctness and mistake categorization.
 */
export async function recordPYQAttempt(
  userId: string,
  pyqId: number | string,
  selectedOption: "A" | "B" | "C" | "D",
  isCorrect: boolean,
  mistakeType?: MistakeType,
  timeSpentSeconds = 0,
  notes?: string
): Promise<PYQAttempt> {
  const attempt: PYQAttempt = {
    userId,
    pyqId,
    selectedOption,
    isCorrect,
    mistakeType,
    timeSpentSeconds,
    notes,
    attemptedAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();

      // 1. Insert into pyq_attempts
      await supabase.from("pyq_attempts").insert({
        user_id: userId,
        pyq_id: String(pyqId),
        selected_option: selectedOption,
        is_correct: isCorrect,
        time_spent_seconds: timeSpentSeconds,
        mistake_type: mistakeType || null,
        notes: notes || null,
      });

      // 2. Mark as completed in user_pyq_progress if correct
      if (isCorrect) {
        await supabase.from("user_pyq_progress").upsert(
          {
            user_id: userId,
            pyq_id: String(pyqId),
            completed: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,pyq_id" }
        );
      }
    } catch (err) {
      console.warn("[PYQDatabase] Supabase attempt write error:", err);
    }
  }

  return attempt;
}

/**
 * Retrieves recent attempts for a user.
 */
export async function getUserPYQAttempts(userId: string): Promise<PYQAttempt[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("pyq_attempts")
        .select("*")
        .eq("user_id", userId)
        .order("attempted_at", { ascending: false })
        .limit(200);

      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          userId: row.user_id,
          pyqId: row.pyq_id,
          selectedOption: row.selected_option,
          isCorrect: row.is_correct,
          timeSpentSeconds: row.time_spent_seconds,
          mistakeType: row.mistake_type,
          notes: row.notes,
          attemptedAt: row.attempted_at,
        }));
      }
    } catch (err) {
      console.warn("[PYQDatabase] Attempt load error:", err);
    }
  }

  return [];
}
