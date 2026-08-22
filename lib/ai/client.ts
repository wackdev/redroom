import { AICompletionRequest, AICompletionResponse, ApiResponse } from "../core/types";
import { safeJsonParse, stripMarkdownFences } from "../core/utils";
import { executeFallbackChain } from "./fallback";

/**
 * Central AI Query Client for REDROOM
 * Handles multi-model fallback, JSON parsing, validation, and error normalization.
 */
export async function queryAI<T = unknown>(
  request: AICompletionRequest
): Promise<ApiResponse<AICompletionResponse<T>>> {
  const startTime = Date.now();

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];

  if (request.systemPrompt) {
    messages.push({
      role: "system",
      content: request.systemPrompt,
    });
  }

  // If JSON output is requested, explicitly instruct the model in the prompt
  let finalPrompt = request.prompt;
  if (request.jsonExpected && !finalPrompt.toLowerCase().includes("json")) {
    finalPrompt += "\n\nIMPORTANT: Respond with ONLY a valid, parseable JSON object matching the requested schema. Do not include markdown code block ticks.";
  }

  messages.push({
    role: "user",
    content: finalPrompt,
  });

  try {
    const result = await executeFallbackChain(
      messages,
      request.temperature ?? 0.2,
      request.maxTokens ?? 2500
    );

    const latencyMs = Date.now() - startTime;
    const cleanText = stripMarkdownFences(result.content);

    let parsedData: T | undefined = undefined;

    if (request.jsonExpected) {
      parsedData = safeJsonParse<T>(cleanText, undefined as unknown as T);
      if (parsedData === undefined) {
        // Retry parsing in case of subtle JSON framing
        const firstBrace = cleanText.indexOf("{");
        const lastBrace = cleanText.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace > firstBrace) {
          parsedData = safeJsonParse<T>(
            cleanText.substring(firstBrace, lastBrace + 1),
            undefined as unknown as T
          );
        }
      }
    }

    return {
      success: true,
      data: {
        text: cleanText,
        data: parsedData,
        modelUsed: result.modelUsed,
        provider: result.provider as any,
        latencyMs,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI Query Exception";
    return {
      success: false,
      error: {
        code: "AI_QUERY_FAILED",
        message,
        details: err,
      },
    };
  }
}
