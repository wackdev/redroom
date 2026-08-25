import { dexieDb } from "../db/dexie";
import { createClient, isSupabaseConfigured } from "../db/supabase";

export type ActivityEventType =
  | "STUDY_SESSION_COMPLETED"
  | "FOCUS_SESSION_COMPLETED"
  | "TOPIC_COMPLETED"
  | "TOPIC_STUDIED"
  | "PYQ_ATTEMPTED"
  | "PYQ_CORRECT"
  | "PYQ_INCORRECT"
  | "MISTAKE_LOGGED"
  | "TEST_COMPLETED"
  | "REVISION_COMPLETED"
  | "MAINS_ANSWER_SUBMITTED"
  | "CURRENT_AFFAIRS_COMPLETED"
  | "NOTE_CREATED";

export interface ActivityEvent {
  id?: string;
  userId?: string;
  eventType: ActivityEventType;
  payload: Record<string, unknown>;
  createdAt: string;
}

/**
 * Dispatches an activity event into the WhyNotUPSC telemetry pipeline.
 * Saves locally in Dexie and asynchronously persists to Supabase if configured.
 */
export async function trackActivityEvent(
  eventType: ActivityEventType,
  payload: Record<string, unknown>,
  userId = "cadet_current"
): Promise<ActivityEvent> {
  const event: ActivityEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    userId,
    eventType,
    payload,
    createdAt: new Date().toISOString(),
  };

  try {
    // 1. Notify window for real-time reactivity if in browser
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("whynotupsc_activity_event", { detail: event })
      );
    }

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        void supabase.from("activity_events").insert({
          user_id: userId.startsWith("cadet_") ? null : userId,
          event_type: eventType,
          payload,
          created_at: event.createdAt,
        });
      } catch {}
    }
  } catch (err) {
    console.warn("Activity tracking warning:", err);
  }

  return event;
}
