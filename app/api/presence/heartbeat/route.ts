import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/db/supabase";
import { ApiResponse } from "@/lib/core/types";

interface LivePresenceRecord {
  userId: string;
  displayName: string;
  currentPath: string;
  lastSeenAt: string;
  ipHash?: string;
}

// In-memory fallback presence registry (cleans up entries older than 2 minutes)
const presenceMemoryStore = new Map<string, LivePresenceRecord>();

function cleanStalePresence() {
  const cutoff = Date.now() - 2 * 60 * 1000; // 2 minutes
  for (const [key, val] of presenceMemoryStore.entries()) {
    if (new Date(val.lastSeenAt).getTime() < cutoff) {
      presenceMemoryStore.delete(key);
    }
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ liveNow: number; activeCadets: string[] }>>> {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = String(body.userId || "cadet_anon_" + (request.headers.get("x-forwarded-for") || "local").slice(0, 8)).trim();
    const displayName = String(body.displayName || "Cadet Aspirant").trim();
    const currentPath = String(body.currentPath || "/").trim();
    const now = new Date().toISOString();

    const record: LivePresenceRecord = {
      userId,
      displayName,
      currentPath,
      lastSeenAt: now,
    };

    presenceMemoryStore.set(userId, record);
    cleanStalePresence();

    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        await supabase.from("live_presence").upsert({
          user_id: userId,
          display_name: displayName,
          current_path: currentPath,
          last_seen_at: now,
        }, { onConflict: "user_id" });
      } catch {
        // Safe fallback to in-memory store
      }
    }

    const liveNow = Math.max(1, presenceMemoryStore.size);
    const activeCadets = Array.from(presenceMemoryStore.values()).map((p) => p.displayName);

    return NextResponse.json({
      success: true,
      data: {
        liveNow,
        activeCadets,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Presence heartbeat error";
    return NextResponse.json(
      { success: false, error: { code: "PRESENCE_ERROR", message: msg } },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse<ApiResponse<{ liveNow: number; activeCadets: string[] }>>> {
  cleanStalePresence();
  let liveNow = Math.max(1, presenceMemoryStore.size);
  let activeCadets = Array.from(presenceMemoryStore.values()).map((p) => p.displayName);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const cutoff = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from("live_presence")
        .select("user_id, display_name")
        .gte("last_seen_at", cutoff);

      if (data && data.length > 0) {
        liveNow = Math.max(1, data.length);
        activeCadets = data.map((d) => d.display_name || "Cadet Aspirant");
      }
    } catch {
      // In-memory fallback
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      liveNow,
      activeCadets,
    },
  });
}
