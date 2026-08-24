import { NextRequest, NextResponse } from "next/server";
import { UPSC_MENTOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limiter";

export const runtime = "nodejs";

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
  if (hfToken && !hfToken.includes("fake") && !hfToken.includes("your_token")) {
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
      }
    );
  }

  // 2. Groq (Ultra low latency TTFT fallback)
  const groqKey = process.env.GROQ_API_KEY || "";
  if (groqKey && !groqKey.includes("fake")) {
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
  if (geminiKey && !geminiKey.includes("fake")) {
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
  if (openRouterKey && !openRouterKey.includes("fake")) {
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
 * Attempts streaming connection to an individual provider with 3s timeout.
 */
async function attemptProviderStream(
  candidate: StreamProviderCandidate,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
): Promise<ReadableStream<Uint8Array> | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500); // Strict 3.5s per provider

  try {
    if (candidate.isPollinations) {
      const lastMsg = messages[messages.length - 1]?.content || "";
      const sysMsg = messages.find((m) => m.role === "system")?.content || "";
      const prompt = sysMsg ? `${sysMsg}\n\nCadet Question: ${lastMsg}` : lastMsg;

      // Try POST to Pollinations first
      try {
        const postRes = await fetch("https://text.pollinations.ai/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { role: "system", content: sysMsg },
              { role: "user", content: lastMsg },
            ],
            model: "openai",
            stream: false,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (postRes.ok) {
          const text = await postRes.text();
          if (text && text.trim()) {
            return createSyntheticStream(text.trim(), candidate.name);
          }
        }
      } catch {
        // Fall back to encoded GET
      }

      const encoded = encodeURIComponent(prompt.slice(0, 1000));
      const res = await fetch(`https://text.pollinations.ai/${encoded}`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) return null;

      const text = await res.text();
      if (!text || !text.trim()) return null;

      return createSyntheticStream(text.trim(), candidate.name);
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
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok || !response.body) {
      return null;
    }

    // Transform OpenAI SSE chunk stream into Redroom SSE stream
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";

    const transformStream = new TransformStream({
      transform(chunk, controllerTransform) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(":")) continue;

          if (trimmed === "data: [DONE]") {
            controllerTransform.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ done: true, modelUsed: candidate.name })}\n\n`
              )
            );
            continue;
          }

          if (trimmed.startsWith("data: ")) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              const token =
                data?.choices?.[0]?.delta?.content ||
                data?.choices?.[0]?.text ||
                "";
              if (token) {
                controllerTransform.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ token })}\n\n`)
                );
              }
            } catch {
              // Ignore malformed individual chunks
            }
          }
        }
      },
    });

    return response.body.pipeThrough(transformStream);
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Creates a synthetic SSE stream that emits words progressively.
 */
function createSyntheticStream(fullText: string, modelName: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const words = fullText.split(" ");

  return new ReadableStream({
    start(controller) {
      for (let i = 0; i < words.length; i++) {
        const chunk = (i === 0 ? "" : " ") + words[i];
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: chunk })}\n\n`));
      }
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ done: true, modelUsed: modelName })}\n\n`
        )
      );
      controller.close();
    },
  });
}

/**
 * Generates an intelligent, high-yield UPSC strategic answer if all remote APIs are unreachable.
 */
function generateDynamicUPSCHeuristic(message: string, contextInfo?: string): string {
  const cleanMsg = message.trim();
  const lower = cleanMsg.toLowerCase();

  // 1. Polity / Constitution Question
  if (lower.includes("article") || lower.includes("constitution") || lower.includes("governor") || lower.includes("president") || lower.includes("judiciary") || lower.includes("parliament")) {
    return `### 🏛️ UPSC Polity & Constitutional Analysis: ${cleanMsg.slice(0, 60)}

**1. Constitutional Anchors & Mandate**:
• **Foundational Articles**: Examine relevant provisions across Part III (Fundamental Rights), Part IV (DPSP), and Parts V/VI (Union & State Institutions).
• **Core Doctrine**: Apply the **Basic Structure Doctrine** (Kesavananda Bharati 1973) and the **Non-Arbitrariness Standard** (Article 14).

**2. Institutional Friction & Flashpoints**:
• **Separation of Powers**: Balancing judicial review with legislative supremacy and executive discretion.
• **Cooperative Federalism**: Ensuring asymmetric federal safeguards (Articles 371A-J) and institutional consultation (Inter-State Council under Art 263).

**3. Landmark Precedents & Committee Guidance**:
• **Judicial Rulings**: Cite landmark Supreme Court judgements establishing constitutional morality (*S.R. Bommai 1994*, *Puttaswamy 2017*, *State of Punjab 2023*).
• **Reforms**: Implement recommendations of the **Sarkaria Commission (1988)**, **Punchhi Commission (2010)**, and **2nd Administrative Reforms Commission (ARC)**.

**4. Way Forward**:
Anchor administrative reforms in constitutional morality, transparent institutional paper trails, and citizen-centric governance for Viksit Bharat 2047.`;
  }

  // 2. Economy / Agriculture / Infrastructure Question
  if (lower.includes("economy") || lower.includes("capex") || lower.includes("inflation") || lower.includes("gdp") || lower.includes("agriculture") || lower.includes("farmer") || lower.includes("hydrogen")) {
    return `### 📈 UPSC Economic & Policy Strategic Synthesis: ${cleanMsg.slice(0, 60)}

**1. Macroeconomic Context & Structural Pillars**:
• **Growth Drivers**: High public capital expenditure multiplier (2.45x) under **PM Gati Shakti** and National Infrastructure Pipeline (NIP).
• **Fiscal Prudence**: Reconciling infrastructure capex push with the **FRBM Glide Path** targeting a fiscal deficit below 4.5% of GDP.

**2. Key Sectoral Bottlenecks**:
• **Agronomic Imbalances**: Moving away from rice-wheat monocultures toward climate-resilient **Shree Anna (Millets)** and balanced **Nutrient Based Subsidy (NBS)** regimes.
• **Energy Transition**: Scaling the **National Green Hydrogen Mission (SIGHT scheme)** to decarbonize hard-to-abate fertilizer, steel, and refinery sectors.

**3. Actionable Policy Way Forward**:
• Expand **Farmer Producer Organizations (FPOs)** for primary farm-gate processing.
• Leverage the **India Stack** and Digital Public Infrastructure for targeted Direct Benefit Transfers (DBT), eliminating intermediary leakages.`;
  }

  // 3. General Strategic Mentor Response
  return `### 🎯 UPSC Strategic Mentor (WHY OS) Intelligence

**Analysis on "${cleanMsg.slice(0, 70)}..."**:

1. **Syllabus & Core Demand Alignment**:
   • Break the topic down using the **PESTLE 360° Matrix**: Political, Economic, Socio-Cultural, Technological, Legal, and Environmental dimensions.
   
2. **High-Yield Value Addition Pointers**:
   • **Constitutional / Statutory Links**: Identify specific Articles, Schedules, or Parliamentary Acts.
   • **Committees & Data**: Cite NITI Aayog policy reports, 2nd ARC recommendations, or Economic Survey indices.
   • **Visual Integration**: Plan a structured flowchart or 2-column comparative table in your Mains script.

3. **Mains Answer Architecture Rule**:
   • **Crisp Intro** (Definition / Data / Constitutional anchor) $\\rightarrow$ **Multi-dimensional Body** (with clear subheadings) $\\rightarrow$ **Forward-Looking Conclusion** (aligned with SDGs and Constitutional Morality).`;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const rateLimit = await checkRateLimit(request);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: `Hourly AI quota exceeded. Please wait ${rateLimit.resetSeconds}s.`,
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetSeconds),
          },
        }
      );
    }

    const body = await request.json();
    const message = body?.message?.trim();
    const contextInfo = body?.contextInfo;

    if (!message) {
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

    // Iterate through circuit breaker candidates
    for (const candidate of chain) {
      const stream = await attemptProviderStream(candidate, messages);
      if (stream) {
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

    // Dynamic Context-Aware UPSC Heuristic Fallback Stream
    const dynamicText = generateDynamicUPSCHeuristic(message, contextInfo);
    const fallbackStream = createSyntheticStream(dynamicText, "redroom-strategic-mentor");

    return new Response(fallbackStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Model-Used": "redroom-strategic-mentor",
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
