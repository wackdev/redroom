import { calculateExamReadiness } from "@/lib/brain/scoring/readiness-engine";
import { apiSuccess, apiError } from "@/lib/core/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const readiness = await calculateExamReadiness();
    return apiSuccess(readiness);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Readiness calculation error";
    return apiError("READINESS_ERROR", message, err, 500);
  }
}
