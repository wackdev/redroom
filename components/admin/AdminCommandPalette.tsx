"use client";

import { useState, useEffect } from "react";
import { AdminTab } from "./AdminTabsNav";
import { sound } from "@/lib/audio/sound-engine";

interface AdminCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: AdminTab) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: string;
  tab: AdminTab;
}

const COMMANDS: CommandItem[] = [
  { id: "cmd-live", title: "View Live Telemetry & System Status", category: "Navigation", icon: "⚡", tab: "COMMAND_CENTER" },
  { id: "cmd-users", title: "Search Cadet Registry & Elevate Roles", category: "Users", icon: "👥", tab: "USERS" },
  { id: "cmd-pyqs", title: "Create New PYQ Draft & Content CMS", category: "Content", icon: "📚", tab: "CONTENT" },
  { id: "cmd-analytics", title: "Inspect Aspirant Conversion Funnel & Retention", category: "Analytics", icon: "📈", tab: "ANALYTICS" },
  { id: "cmd-chill", title: "Moderate Chill Zone & Purge Invalid Scores", category: "Chill Zone", icon: "🎮", tab: "CHILL_ZONE" },
  { id: "cmd-system", title: "Manage Feature Flags & Maintenance Lockdown", category: "System", icon: "⚙️", tab: "SYSTEM_SETTINGS" },
];

export default function AdminCommandPalette({ isOpen, onClose, onSelectTab }: AdminCommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = COMMANDS.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-4 pt-20 backdrop-blur-md animate-fadeIn">
      <div className="flex w-full max-w-xl flex-col rounded-3xl border border-white/20 bg-[#090909] shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden font-mono text-xs">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          <span className="text-[#F4C95D] text-base">⚡</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type an admin command or search (e.g. users, pyq, flags)..."
            autoFocus
            className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm"
          />
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] text-[#8C8C8C]"
          >
            ESC
          </button>
        </div>

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                sound.playLock();
                onSelectTab(item.tab);
                onClose();
              }}
              className="flex items-center justify-between rounded-2xl p-3 cursor-pointer text-white hover:bg-[#D8A63A]/15 hover:border hover:border-[#D8A63A]/40 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <div>
                  <strong className="text-white">{item.title}</strong>
                  <p className="text-[10px] text-[#8C8C8C]">{item.category}</p>
                </div>
              </div>
              <span className="text-[10px] text-[#F4C95D] font-bold">EXECUTE →</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-3 text-[10px] text-[#8C8C8C] flex justify-between">
          <span>WHYNOTUPSC Admin Omnibox</span>
          <span>Navigation Quick Jump</span>
        </div>
      </div>
    </div>
  );
}
