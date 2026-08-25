import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/db/supabase";
import { ApiResponse } from "@/lib/core/types";
import {
  AdminBroadcastMessage,
  globalBroadcastStore,
  addBroadcastToStore,
  removeBroadcastFromStore,
} from "@/lib/admin/broadcast-store";

export type { AdminBroadcastMessage };

/**
 * Checks for recent messages sent to the Telegram bot via getUpdates fallback
 */
async function fetchRecentTelegramUpdates(): Promise<AdminBroadcastMessage[]> {
  const rawToken = process.env.TELEGRAM_BOT_TOKEN;
  const token = rawToken ? rawToken.replace(/^:+/, "").trim() : "";

  if (!token || token.includes("placeholder")) {
    return [];
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?limit=5`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const json = await res.json().catch(() => ({}));
    if (json.ok && Array.isArray(json.result) && json.result.length > 0) {
      const messages: AdminBroadcastMessage[] = [];

      for (const update of json.result) {
        const msg = update.message;
        if (!msg || !msg.text) continue;

        let text = msg.text.trim();
        let title = "⚡ TELEGRAM DISPATCH";
        let priority: "Urgent" | "High" | "Normal" = "High";
        let type: "directive" | "announcement" | "alert" | "system" = "directive";

        if (text.startsWith("/alert")) {
          type = "alert";
          priority = "Urgent";
          text = text.replace(/^\/alert\s*/i, "");
        } else if (text.startsWith("/broadcast")) {
          text = text.replace(/^\/broadcast\s*/i, "");
        } else if (text.startsWith("/notify") || text.startsWith("/msg")) {
          text = text.replace(/^\/(notify|msg)\s*/i, "");
        } else if (
          text.startsWith("/start") ||
          text.startsWith("/help") ||
          text.startsWith("/stats") ||
          text.startsWith("/telemetry") ||
          text.startsWith("/brief") ||
          text.startsWith("/quiz")
        ) {
          // Internal bot commands don't need to be broadcast banners
          continue;
        }

        if (text.includes("|")) {
          const parts = text.split("|");
          title = parts[0].trim();
          text = parts.slice(1).join("|").trim();
        }

        const authorName = msg.from?.username
          ? `@${msg.from.username}`
          : msg.from?.first_name || "Telegram Admin";

        const broadcastItem: AdminBroadcastMessage = {
          id: `tg-${update.update_id}`,
          title: title,
          message: text,
          type: type,
          priority: priority,
          author: `Telegram (${authorName})`,
          createdAt: msg.date ? new Date(msg.date * 1000).toISOString() : new Date().toISOString(),
          isActive: true,
        };

        messages.push(broadcastItem);
        addBroadcastToStore(broadcastItem);
      }

      return messages;
    }
  } catch {}

  return [];
}

/**
 * GET /api/admin/broadcast
 * Returns all active broadcast announcements.
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<AdminBroadcastMessage[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    // 1. Check for live Telegram updates
    const tgUpdates = await fetchRecentTelegramUpdates();

    // 2. Fetch from Supabase
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("admin_broadcasts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: AdminBroadcastMessage[] = data.map((row) => ({
          id: row.id,
          title: row.title,
          message: row.message,
          type: row.type || "directive",
          priority: row.priority || "Normal",
          actionLink: row.action_link,
          actionLabel: row.action_label,
          createdAt: row.created_at,
          author: row.author || "Admin",
          isActive: Boolean(row.is_active),
        }));

        // Merge mapped with tgUpdates and in-memory store
        const combined = [...tgUpdates, ...globalBroadcastStore, ...mapped];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const result = all ? unique : unique.filter((b) => b.isActive);
        return NextResponse.json({ success: true, data: result });
      }
    } catch {
      // Offline fallback
    }

    const combined = [...tgUpdates, ...globalBroadcastStore];
    const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
    unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const result = all ? unique : unique.filter((b) => b.isActive);
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load broadcasts";
    return NextResponse.json(
      { success: false, error: { code: "BROADCAST_FETCH_ERROR", message } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/broadcast
 * Creates a new universal admin broadcast command/announcement.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<AdminBroadcastMessage>>> {
  try {
    const body = await request.json();
    const {
      title,
      message,
      type = "directive",
      priority = "Normal",
      actionLink,
      actionLabel,
      author = "Admin Command",
    } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_PARAMS", message: "Title and message are required" } },
        { status: 400 }
      );
    }

    const newBroadcast: AdminBroadcastMessage = {
      id: `bc-${Date.now()}`,
      title: String(title).trim(),
      message: String(message).trim(),
      type,
      priority,
      actionLink: actionLink || undefined,
      actionLabel: actionLabel || undefined,
      createdAt: new Date().toISOString(),
      author: String(author).trim() || "Admin Command",
      isActive: true,
    };

    // Prepend to in-memory store
    addBroadcastToStore(newBroadcast);

    // Persist to Supabase if connected
    try {
      const supabase = createAdminClient();
      await supabase.from("admin_broadcasts").insert({
        id: newBroadcast.id,
        title: newBroadcast.title,
        message: newBroadcast.message,
        type: newBroadcast.type,
        priority: newBroadcast.priority,
        action_link: newBroadcast.actionLink || null,
        action_label: newBroadcast.actionLabel || null,
        author: newBroadcast.author,
        is_active: true,
        created_at: newBroadcast.createdAt,
      });
    } catch {
      // Safe offline fallback
    }

    return NextResponse.json({ success: true, data: newBroadcast });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to post broadcast";
    return NextResponse.json(
      { success: false, error: { code: "BROADCAST_POST_ERROR", message: msg } },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/broadcast
 * Deactivates or removes a broadcast.
 */
export async function DELETE(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ deleted: boolean }>>> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_PARAMS", message: "Missing id" } },
        { status: 400 }
      );
    }

    removeBroadcastFromStore(id);

    try {
      const supabase = createAdminClient();
      await supabase.from("admin_broadcasts").delete().eq("id", id);
    } catch {}

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete broadcast";
    return NextResponse.json(
      { success: false, error: { code: "BROADCAST_DELETE_ERROR", message } },
      { status: 500 }
    );
  }
}
