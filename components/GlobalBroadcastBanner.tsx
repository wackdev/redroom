"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { subscribeToSyncChanges } from "@/lib/sync/sync-engine";

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

const DISMISSED_STORAGE_KEY = "redroom_dismissed_broadcasts";

export default function GlobalBroadcastBanner() {
  const router = useRouter();
  const [broadcasts, setBroadcasts] = useState<AdminBroadcastMessage[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);

  const loadBroadcasts = useCallback(async () => {
    try {
      // 1. Load dismissed IDs from localStorage
      try {
        const saved = localStorage.getItem(DISMISSED_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setDismissedIds(new Set(parsed.map(String)));
          }
        }
      } catch {}

      // 2. Fetch live broadcasts from API
      const res = await fetch("/api/admin/broadcast");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBroadcasts(json.data);
      }
    } catch {
      // Offline fallback
    }
  }, []);

  useEffect(() => {
    void loadBroadcasts();

    const unsubscribe = subscribeToSyncChanges((type) => {
      if (type === "all" || (type as string) === "broadcast") {
        void loadBroadcasts();
      }
    });

    // Also poll every 45s for fresh master directives
    const interval = setInterval(() => {
      void loadBroadcasts();
    }, 45000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [loadBroadcasts]);

  const activeVisibleBroadcasts = broadcasts.filter(
    (b) => b.isActive && !dismissedIds.has(b.id)
  );

  if (activeVisibleBroadcasts.length === 0) {
    return null;
  }

  const primary = activeVisibleBroadcasts[0];

  const handleDismiss = (id: string) => {
    const next = new Set(dismissedIds);
    next.add(id);
    setDismissedIds(next);
    try {
      localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(Array.from(next)));
    } catch {}
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return {
          wrapper: "border-red-500/40 bg-gradient-to-r from-red-950/80 via-red-900/60 to-purple-950/80 text-red-100",
          badge: "bg-red-500 text-white animate-pulse",
          glow: "shadow-[0_0_20px_rgba(239,68,68,0.25)]",
        };
      case "High":
        return {
          wrapper: "border-amber-500/40 bg-gradient-to-r from-amber-950/80 via-purple-950/70 to-pink-950/80 text-amber-100",
          badge: "bg-amber-500 text-black font-black",
          glow: "shadow-[0_0_20px_rgba(245,158,11,0.2)]",
        };
      default:
        return {
          wrapper: "border-purple-500/30 bg-gradient-to-r from-purple-950/80 via-[#100726]/90 to-indigo-950/80 text-purple-100",
          badge: "bg-purple-600 text-white font-bold",
          glow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]",
        };
    }
  };

  const style = getPriorityStyle(primary.priority);

  return (
    <aside
      aria-label="Universal Admin Broadcast"
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all ${style.wrapper} ${style.glow}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <div className="flex flex-1 items-center gap-3 overflow-hidden">
          {/* BADGE */}
          <span
            className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${style.badge}`}
          >
            <span>📢</span>
            <span>{primary.type.toUpperCase()}</span>
          </span>

          {/* HEADLINE & MESSAGE */}
          <div className="flex flex-1 items-center gap-2 overflow-hidden text-xs sm:text-sm">
            <span className="font-extrabold tracking-tight shrink-0">{primary.title}</span>
            <span className="hidden text-white/30 sm:inline">—</span>
            <span className="truncate text-white/80 font-medium">{primary.message}</span>
          </div>
        </div>

        {/* ACTION BUTTON & CONTROLS */}
        <div className="flex shrink-0 items-center gap-2">
          {primary.actionLink && (
            <button
              onClick={() => {
                if (primary.actionLink?.startsWith("http")) {
                  window.open(primary.actionLink, "_blank");
                } else if (primary.actionLink) {
                  router.push(primary.actionLink);
                }
              }}
              className="rounded-lg bg-white/10 px-3 py-1 text-xs font-bold text-white transition hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              {primary.actionLabel || "View Details →"}
            </button>
          )}

          {activeVisibleBroadcasts.length > 1 && (
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="rounded-lg bg-white/5 px-2 py-1 text-[11px] font-semibold text-white/70 hover:bg-white/10"
              title="Toggle all announcements"
            >
              {isExpanded ? "▲ Collapse" : `+${activeVisibleBroadcasts.length - 1} More`}
            </button>
          )}

          <button
            onClick={() => handleDismiss(primary.id)}
            title="Dismiss announcement"
            className="rounded-lg p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>

      {/* EXPANDED LIST IF MULTIPLE ANNOUNCEMENTS */}
      {isExpanded && activeVisibleBroadcasts.length > 1 && (
        <div className="border-t border-white/10 bg-black/40 px-4 py-3 sm:px-6 divide-y divide-white/5">
          {activeVisibleBroadcasts.slice(1).map((b) => {
            const subStyle = getPriorityStyle(b.priority);
            return (
              <div key={b.id} className="flex items-center justify-between gap-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${subStyle.badge}`}>
                    {b.priority}
                  </span>
                  <span className="font-bold text-white">{b.title}</span>
                  <span className="text-white/70">{b.message}</span>
                </div>
                <div className="flex items-center gap-2">
                  {b.actionLink && (
                    <button
                      onClick={() => router.push(b.actionLink!)}
                      className="text-purple-300 hover:text-white underline text-[11px]"
                    >
                      {b.actionLabel || "Open"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDismiss(b.id)}
                    className="text-white/40 hover:text-white text-[11px]"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
