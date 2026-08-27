import { MainsPYQQuestion } from "../core/types";

export const LOCAL_STORAGE_CUSTOM_MAINS_PYQS_KEY = "redroom_mains_pyqs_custom";

/**
 * Baseline static mains questions. Defaults to empty until candidate uploads questions.
 */
export const STATIC_MAINS_PYQ_DATASET: MainsPYQQuestion[] = [];

/**
 * Retrieves candidate uploaded Mains questions from browser storage.
 */
export function getStoredMainsPYQs(): MainsPYQQuestion[] {
  if (typeof window === "undefined") return STATIC_MAINS_PYQ_DATASET;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_MAINS_PYQS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to load custom mains questions from storage:", err);
  }
  return STATIC_MAINS_PYQ_DATASET;
}

/**
 * Saves candidate uploaded Mains questions into browser storage.
 */
export function saveUploadedMainsPYQs(questions: MainsPYQQuestion[]): number {
  if (typeof window === "undefined" || !Array.isArray(questions)) return 0;
  try {
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_MAINS_PYQS_KEY, JSON.stringify(questions));
    return questions.length;
  } catch (err) {
    console.error("Failed to save uploaded mains questions:", err);
    throw err;
  }
}
