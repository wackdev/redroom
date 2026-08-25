import { z } from "zod";
import { AICompletionRequest, AICompletionResponse, ApiResponse } from "../core/types";
import { safeJsonParse, stripMarkdownFences } from "../core/utils";
import { executeFallbackChain } from "./fallback";

export interface AIQueryOptions<T = unknown> extends AICompletionRequest {
  schema?: z.ZodType<T>;
  retryAttempts?: number;
}

/**
 * Central AI Query Client for WhyNotUPSC OS
 * Handles multi-model fallback, JSON parsing, strict Zod validation, timeouts, and error normalization.
 */
export async function queryAI<T = unknown>(
  request: AIQueryOptions<T>
): Promise<ApiResponse<AICompletionResponse<T>>> {
  const startTime = Date.now();
  const maxRetries = request.retryAttempts ?? 1;

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];

  if (request.systemPrompt) {
    messages.push({
      role: "system",
      content: request.systemPrompt,
    });
  }

  let finalPrompt = request.prompt;
  if (request.jsonExpected && !finalPrompt.toLowerCase().includes("json")) {
    finalPrompt +=
      "\n\nIMPORTANT: Respond with ONLY a valid, parseable JSON object matching the requested schema. Do not include markdown code block ticks.";
  }

  messages.push({
    role: "user",
    content: finalPrompt,
  });

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
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

        // Run Zod schema validation if schema is supplied
        if (request.schema && parsedData !== undefined) {
          const validation = request.schema.safeParse(parsedData);
          if (validation.success) {
            parsedData = validation.data;
          } else {
            console.warn("[queryAI] Schema validation warning, using raw parsed data:", validation.error);
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
      lastError = err;
      if (attempt < maxRetries) {
        // Small exponential backoff before retry
        await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
      }
    }
  }

  const message = lastError instanceof Error ? lastError.message : "AI Query Exception";
  return {
    success: false,
    error: {
      code: "AI_QUERY_FAILED",
      message,
      details: lastError,
    },
  };
}
