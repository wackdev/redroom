import { NextRequest } from "next/server";
import { trackActivityEvent, ActivityEventType } from "@/lib/brain/activity-events";
import { ActivityEventSchema } from "@/lib/validation/schemas";
import { apiSuccess, apiError } from "@/lib/core/api-response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = ActivityEventSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return apiError(
        "INVALID_EVENT_SCHEMA",
        "Invalid activity event payload format",
        parseResult.error.format(),
        400
      );
    }

    const { eventType, payload, userId } = parseResult.data;
    const event = await trackActivityEvent(eventType as ActivityEventType, payload, userId);

    return apiSuccess(event);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Event recording error";
    return apiError("EVENT_ERROR", message, err, 500);
  }
}
