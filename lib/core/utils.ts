/**
 * REDROOM Core Utilities & Helpers
 * Pure deterministic functions for math, formatting, and safety
 */

/**
 * Safely wraps any nullable array to guarantee array operations never throw.
 */
export function safeArray<T>(arr: T[] | null | undefined): T[] {
  if (!arr || !Array.isArray(arr)) return [];
  return arr;
}

/**
 * Safely slices an array without throwing if array is undefined/null.
 */
export function safeSlice<T>(arr: T[] | null | undefined, start: number, end?: number): T[] {
  return safeArray(arr).slice(start, end);
}

/**
 * Standard date formatter for Indian standard display format.
 */
export function formatDate(
  dateInput: string | number | Date | null | undefined,
  style: "short" | "medium" | "full" = "medium"
): string {
  if (!dateInput) return "—";

  try {
    const d = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);

    if (style === "short") {
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
    }

    if (style === "full") {
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats time in 12-hour AM/PM format (e.g., "04:30 PM").
 */
export function formatTime(
  dateInput: string | number | Date | null | undefined = new Date()
): string {
  if (!dateInput) return "—";
  try {
    const d = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
}

/**
 * Formats date and time together (e.g. "22 Aug 2026, 04:30 PM").
 */
export function formatDateWithTime(
  dateInput: string | number | Date | null | undefined
): string {
  if (!dateInput) return "—";
  try {
    const d = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);
    const datePart = formatDate(d, "short");
    const timePart = formatTime(d);
    return `${datePart}, ${timePart}`;
  } catch {
    return String(dateInput);
  }
}

/**
 * Returns local calendar date key `YYYY-MM-DD` (avoids UTC timezone shift).
 */
export function getDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Shifts a YYYY-MM-DD date key by N days accurately in local time.
 */
export function shiftDateKey(dateKey: string, days: number): string {
  try {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + days);
    return getDateKey(dateObj);
  } catch {
    return dateKey;
  }
}

/**
 * Returns the Monday (start) and Sunday (end) dates of the week containing the given dateKey.
 */
export function getWeekDateRange(dateKey: string = getDateKey()): {
  startDate: string;
  endDate: string;
  weekKey: string;
} {
  try {
    const [y, m, d] = dateKey.split("-").map(Number);
    const curr = new Date(y, m - 1, d);
    // Sunday is 0, Monday is 1... We want Monday as day 1
    const dayOfWeek = curr.getDay(); // 0 is Sun, 1 is Mon...
    const distanceToMonday = (dayOfWeek + 6) % 7; // 0 for Mon, 6 for Sun
    
    const monday = new Date(curr);
    monday.setDate(curr.getDate() - distanceToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const startDate = getDateKey(monday);
    const endDate = getDateKey(sunday);
    const weekKey = `${startDate}_${endDate}`;

    return { startDate, endDate, weekKey };
  } catch {
    return { startDate: dateKey, endDate: dateKey, weekKey: dateKey };
  }
}

/**
 * Returns an array of 7 date strings (Monday through Sunday) for the week containing dateKey.
 */
export function getWeekDatesList(dateKey: string = getDateKey()): Array<{
  dateKey: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isSelected: boolean;
}> {
  const { startDate } = getWeekDateRange(dateKey);
  const todayKey = getDateKey();
  const days: Array<{
    dateKey: string;
    dayName: string;
    dayNumber: number;
    isToday: boolean;
    isSelected: boolean;
  }> = [];

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let i = 0; i < 7; i++) {
    const currentKey = shiftDateKey(startDate, i);
    const [y, m, d] = currentKey.split("-").map(Number);
    days.push({
      dateKey: currentKey,
      dayName: dayNames[i],
      dayNumber: d,
      isToday: currentKey === todayKey,
      isSelected: currentKey === dateKey,
    });
  }

  return days;
}

/**
 * Formats a human-readable week label (e.g. "17 Aug – 23 Aug 2026").
 */
export function formatWeekSpan(startDate: string, endDate: string): string {
  try {
    const startFormatted = formatDate(startDate, "short");
    const endFormatted = formatDate(endDate, "short");
    const year = endDate.split("-")[0];
    return `${startFormatted} – ${endFormatted} ${year}`;
  } catch {
    return `${startDate} to ${endDate}`;
  }
}

/**
 * Safely calculates percentage accuracy (0 to 100).
 */
export function calculateAccuracy(correct: number, attempted: number): number {
  if (!attempted || attempted <= 0) return 0;
  const acc = (correct / attempted) * 100;
  return Math.min(100, Math.max(0, Number(acc.toFixed(1))));
}

/**
 * Calculates mean, standard deviation, and consistency score (0 to 100).
 */
export function calculateVarianceAndConsistency(numbers: number[]): {
  mean: number;
  variance: number;
  standardDeviation: number;
  consistencyScore: number;
} {
  const safeNums = safeArray(numbers).filter((n) => typeof n === "number" && !isNaN(n));
  if (safeNums.length === 0) {
    return { mean: 0, variance: 0, standardDeviation: 0, consistencyScore: 0 };
  }

  const mean = safeNums.reduce((sum, val) => sum + val, 0) / safeNums.length;
  const variance =
    safeNums.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / safeNums.length;
  const standardDeviation = Math.sqrt(variance);

  // Consistency: Lower standard deviation yields higher score
  const consistencyScore = Math.max(0, Math.min(100, Math.round(100 - standardDeviation * 8)));

  return {
    mean: Number(mean.toFixed(2)),
    variance: Number(variance.toFixed(2)),
    standardDeviation: Number(standardDeviation.toFixed(2)),
    consistencyScore,
  };
}

/**
 * Strips markdown code block wrappers (e.g. ```json ... ```) from raw AI string.
 */
export function stripMarkdownFences(text: string): string {
  if (!text) return "";
  let clean = text.trim();
  // Remove starting ```json or ```
  clean = clean.replace(/^```(?:json|markdown|javascript|typescript)?\s*\n?/i, "");
  // Remove ending ```
  clean = clean.replace(/\n?```\s*$/i, "");
  return clean.trim();
}

/**
 * Safely parses JSON with fallback.
 */
export function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const cleaned = stripMarkdownFences(raw);
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}
