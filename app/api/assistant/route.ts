import { NextRequest, NextResponse } from "next/server";
import { UPSC_MENTOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limiter";

// ============================================================================
// VERCEL HOBBY COMPLIANCE: EDGE RUNTIME (ELIMINATES 10S TIMEOUT)
// ============================================================================
export const runtime = "edge";

interface StreamProviderCandidate {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  model: string;
  extraHeaders?: Record<string, string>;
  isPollinations?: boolean;
}

/**
 * Builds the prioritized circuit breaker provider chain.
 * Priority: 1. Hugging Face (Primary HF_TOKEN) -> 2. Groq -> 3. Gemini -> 4. OpenRouter -> 5. Pollinations
 */
function getCircuitBreakerChain(): StreamProviderCandidate[] {
  const chain: StreamProviderCandidate[] = [];

  // 1. PRIMARY: Hugging Face Serverless Router (HF_TOKEN)
  const hfToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || "";
  if (hfToken) {
    chain.push(
      {
        id: "hf-qwen-72b",
        name: "Qwen 2.5 72B (Hugging Face)",
        url: "https://router.huggingface.co/v1/chat/completions",
        apiKey: hfToken,
        model: "Qwen/Qwen2.5-72B-Instruct",
      },
      {
        id: "hf-llama-70b",
        name: "Llama 3.3 70B (Hugging Face)",
        url: "https://router.huggingface.co/v1/chat/completions",
        apiKey: hfToken,
        model: "meta-llama/Llama-3.3-70B-Instruct",
      },
      {
        id: "hf-mistral-24b",
        name: "Mistral Small 24B (Hugging Face)",
        url: "https://router.huggingface.co/v1/chat/completions",
        apiKey: hfToken,
        model: "mistralai/Mistral-Small-24B-Instruct-2501",
      },
      {
        id: "hf-deepseek-r1",
        name: "DeepSeek R1 Distill 32B (Hugging Face)",
        url: "https://router.huggingface.co/v1/chat/completions",
        apiKey: hfToken,
        model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
      }
    );
  }

  // 2. Groq (Ultra low latency TTFT fallback)
  const groqKey = process.env.GROQ_API_KEY || "";
  if (groqKey) {
    chain.push({
      id: "groq",
      name: "Groq Llama 3.3 70B",
      url: "https://api.groq.com/openai/v1/chat/completions",
      apiKey: groqKey,
      model: "llama-3.3-70b-versatile",
    });
  }

  // 3. Google Gemini
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
  if (geminiKey) {
    chain.push({
      id: "gemini",
      name: "Gemini 2.0 Flash",
      url: `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
      apiKey: geminiKey,
      model: "gemini-2.0-flash",
    });
  }

  // 4. OpenRouter
  const openRouterKey = process.env.OPENROUTER_API_KEY || "";
  if (openRouterKey) {
    chain.push({
      id: "openrouter",
      name: "OpenRouter Llama 3.3 70B",
      url: "https://openrouter.ai/api/v1/chat/completions",
      apiKey: openRouterKey,
      model: "meta-llama/llama-3.3-70b-instruct:free",
      extraHeaders: {
        "HTTP-Referer": "https://redroom.upsc",
        "X-Title": "REDROOM UPSC OS",
      },
    });
  }

  // 5. Pollinations Zero-Auth Free Gateway (Always available zero-config fallback)
  chain.push({
    id: "pollinations",
    name: "Pollinations Zero-Auth AI",
    url: "https://text.pollinations.ai/",
    apiKey: "",
    model: "openai",
    isPollinations: true,
  });

  return chain;
}

/**
 * Attempts streaming connection to an individual provider.
 */
async function attemptProviderStream(
  candidate: StreamProviderCandidate,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  signal: AbortSignal
): Promise<ReadableStream<Uint8Array> | null> {
  try {
    if (candidate.isPollinations) {
      const lastMsg = messages[messages.length - 1]?.content || "";
      const sysMsg = messages.find((m) => m.role === "system")?.content || "";
      const prompt = sysMsg ? `${sysMsg}\n\nCadet Question: ${lastMsg}` : lastMsg;

      const encoded = encodeURIComponent(prompt.slice(0, 1500));
      const res = await fetch(`https://text.pollinations.ai/${encoded}`, {
        method: "GET",
        signal,
      });

      if (!res.ok || !res.body) return null;

      // Transform raw text into standard SSE stream
      const text = await res.text();
      const encoder = new TextEncoder();
      const words = text.split(" ");

      return new ReadableStream({
        start(controller) {
          for (let i = 0; i < words.length; i++) {
            const chunk = (i === 0 ? "" : " ") + words[i];
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: chunk })}\n\n`));
          }
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, modelUsed: candidate.name })}\n\n`
            )
          );
          controller.close();
        },
      });
    }

    // Standard OpenAI-compatible streaming API
    const response = await fetch(candidate.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${candidate.apiKey}`,
        ...(candidate.extraHeaders || {}),
      },
      body: JSON.stringify({
        model: candidate.model,
        messages,
        temperature: 0.3,
        max_tokens: 2048,
        stream: true,
      }),
      signal,
    });

    if (!response.ok || !response.body) {
      return null;
    }

    // Transform OpenAI SSE chunk stream into Redroom SSE stream
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(":")) continue;

          if (trimmed === "data: [DONE]") {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ done: true, modelUsed: candidate.name })}\n\n`
              )
            );
            continue;
          }

          if (trimmed.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(trimmed.slice(6));
              const deltaContent = parsed.choices?.[0]?.delta?.content || "";
              if (deltaContent) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ token: deltaContent })}\n\n`)
                );
              }
            } catch {}
          }
        }
      },
      flush(controller) {
        if (buffer.trim()) {
          try {
            const trimmed = buffer.trim();
            if (trimmed.startsWith("data: ") && trimmed !== "data: [DONE]") {
              const parsed = JSON.parse(trimmed.slice(6));
              const deltaContent = parsed.choices?.[0]?.delta?.content || "";
              if (deltaContent) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ token: deltaContent })}\n\n`)
                );
              }
            }
          } catch {}
        }
      },
    });

    return response.body.pipeThrough(transformStream);
  } catch (err) {
    console.warn(`[AI Circuit Breaker] Provider ${candidate.name} failed:`, err);
    return null;
  }
}

/**
 * POST /api/assistant
 * Edge Streaming AI Assistant with Cascaded Circuit Breaker Fallback
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // ------------------------------------------------------------------------
    // 0. API RATE LIMITING (Edge Sliding Window Protection)
    // ------------------------------------------------------------------------
    const rateLimit = await checkRateLimit(request, { maxRequests: 15, windowSeconds: 3600 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "SYSTEM COOLING: API LIMIT REACHED. Please wait before re-engaging the neural link.",
            retryAfterSeconds: rateLimit.resetSeconds,
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetSeconds),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json();
    const { message, contextInfo } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_PROMPT", message: "Missing message text" },
        },
        { status: 400 }
      );
    }

    let finalPrompt = message;
    if (contextInfo) {
      finalPrompt = `[Student Preparation Context: ${contextInfo}]\n\nCadet Question: ${message}`;
    }

    const messages = [
      { role: "system" as const, content: UPSC_MENTOR_SYSTEM_PROMPT },
      { role: "user" as const, content: finalPrompt },
    ];

    const chain = getCircuitBreakerChain();
    const controller = new AbortController();

    // Iterate through circuit breaker candidates without awaiting full generation
    for (const candidate of chain) {
      const stream = await attemptProviderStream(candidate, messages, controller.signal);
      if (stream) {
        // Return stream response immediately (defeating 10s serverless timeout)
        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Model-Used": candidate.name,
            "X-Accel-Buffering": "no",
          },
        });
      }
    }

    // Static Heuristic Emergency Fallback Stream
    const fallbackText = `**WHY (Strategic Mentor)**: Regarding "${message.slice(0, 50)}...", ensure this topic is analyzed through multi-dimensional GS lenses: Constitutional basis, Socio-economic impacts, Administrative bottlenecks (2nd ARC recommendations), and Forward-looking solutions for Viksit Bharat 2047.`;
    const encoder = new TextEncoder();
    const fallbackStream = new ReadableStream({
      start(ctrl) {
        ctrl.enqueue(
          encoder.encode(`data: ${JSON.stringify({ token: fallbackText })}\n\n`)
        );
        ctrl.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ done: true, modelUsed: "local-heuristic-mentor" })}\n\n`
          )
        );
        ctrl.close();
      },
    });

    return new Response(fallbackStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Assistant streaming error";
    return NextResponse.json(
      {
        success: false,
        error: { code: "ASSISTANT_STREAM_FAILED", message: msg },
      },
      { status: 500 }
    );
  }
}
