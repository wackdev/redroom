import { NextRequest } from "next/server";

export interface RateLimitOptions {
  maxRequests?: number; // Default: 15 requests
  windowSeconds?: number; // Default: 3600 (1 hour)
  identifier?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetSeconds: number;
}

// In-Memory Sliding Window Record
interface WindowRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, WindowRecord>();

// Cleanup stale entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of memoryStore.entries()) {
    record.timestamps = record.timestamps.filter((ts) => now - ts < 3600 * 1000);
    if (record.timestamps.length === 0) {
      memoryStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Extracts a client identifier from headers or auth cookies.
 */
function getClientIdentifier(request: NextRequest, customId?: string): string {
  if (customId) return customId;

  // 1. Check custom cadet token/header
  const cadetHeader = request.headers.get("x-cadet-id") || request.headers.get("Authorization");
  if (cadetHeader) return cadetHeader.slice(0, 32);

  // 2. Check IP headers provided by Vercel/Cloudflare
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "cadet-ip-default";

  return ip;
}

/**
 * Evaluates rate limit against Upstash Redis REST API if configured,
 * or falls back to in-memory sliding window cache on Edge Runtime.
 */
export async function checkRateLimit(
  request: NextRequest,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const maxRequests = options.maxRequests ?? 15;
  const windowSeconds = options.windowSeconds ?? 3600;
  const identifier = getClientIdentifier(request, options.identifier);
  const key = `ratelimit:${identifier}`;

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // --------------------------------------------------------------------------
  // OPTION A: UPSTASH REDIS REST API (Global Edge Synchronized)
  // --------------------------------------------------------------------------
  if (redisUrl && redisToken) {
    try {
      const response = await fetch(`${redisUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, windowSeconds],
          ["TTL", key],
        ]),
      });

      if (response.ok) {
        const results = await response.json();
        const count = results[0]?.result || 1;
        const ttl = results[2]?.result || windowSeconds;

        const remaining = Math.max(0, maxRequests - count);
        const allowed = count <= maxRequests;

        return {
          allowed,
          remaining,
          limit: maxRequests,
          resetSeconds: Math.max(1, ttl),
        };
      }
    } catch (err) {
      console.warn("[RateLimiter] Upstash Redis check failed, using in-memory fallback:", err);
    }
  }

  // --------------------------------------------------------------------------
  // OPTION B: IN-MEMORY SLIDING WINDOW (Zero Config, Free Tier Edge-Safe)
  // --------------------------------------------------------------------------
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const record = memoryStore.get(key) || { timestamps: [] };

  // Remove timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length < maxRequests) {
    record.timestamps.push(now);
    memoryStore.set(key, record);

    const remaining = maxRequests - record.timestamps.length;
    const oldest = record.timestamps[0] || now;
    const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);

    return {
      allowed: true,
      remaining,
      limit: maxRequests,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  const oldest = record.timestamps[0] || now;
  const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);

  return {
    allowed: false,
    remaining: 0,
    limit: maxRequests,
    resetSeconds: Math.max(1, resetSeconds),
  };
}
