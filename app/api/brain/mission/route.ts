import { generatePersonalizedMission } from "@/lib/brain/recommendations/recommendation-engine";
import { apiSuccess, apiError } from "@/lib/core/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const mission = await generatePersonalizedMission();
    return apiSuccess(mission);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Mission generation error";
    return apiError("MISSION_ERROR", message, err, 500);
  }
}
