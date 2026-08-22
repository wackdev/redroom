import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/db/supabase";
import { ApiResponse } from "@/lib/core/types";

export interface AdminBroadcastMessage {
  id: string;
  title: string;
  message: string;
  type: "directive" | "announcement" | "alert" | "system";
  priority: "Urgent" | "High" | "Normal";
  actionLink?: string;
  actionLabel?: string;
  createdAt: string;
  author: string;
  isActive: boolean;
}

// In-memory persistent fallback store
let globalBroadcastStore: AdminBroadcastMessage[] = [
  {
    id: "broadcast-seed-1",
    title: "⚡ Prelims 2026 High-Yield Mission Active",
    message: "234+ Authentic UPSC CSE Prelims PYQs (2018-2026) are now fully indexed with live Indian Express & PIB daily news feeds. Keep your study streak active!",
    type: "directive",
    priority: "High",
    actionLink: "/pyqs",
    actionLabel: "Practice PYQs →",
    createdAt: new Date().toISOString(),
    author: "Chief Mentor",
    isActive: true,
  },
];

/**
 * GET /api/admin/broadcast
 * Returns all active broadcast announcements.
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<AdminBroadcastMessage[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

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

        globalBroadcastStore = mapped;
        const result = all ? mapped : mapped.filter((b) => b.isActive);
        return NextResponse.json({ success: true, data: result });
      }
    } catch {
      // Offline fallback
    }

    const result = all ? globalBroadcastStore : globalBroadcastStore.filter((b) => b.isActive);
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
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<AdminBroadcastMessage>>> {
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
    globalBroadcastStore = [newBroadcast, ...globalBroadcastStore];

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
export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse<{ deleted: boolean }>>> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_PARAMS", message: "Missing id" } },
        { status: 400 }
      );
    }

    globalBroadcastStore = globalBroadcastStore.filter((b) => b.id !== id);

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
