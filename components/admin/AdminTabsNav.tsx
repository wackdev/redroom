"use client";

import { sound } from "@/lib/audio/sound-engine";

export type AdminTab =
  | "COMMAND_CENTER"
  | "KNOWLEDGE_VAULT"
  | "USERS"
  | "CONTENT"
  | "ANALYTICS"
  | "CHILL_ZONE"
  | "SYSTEM_SETTINGS";

interface AdminTabsNavProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const TABS: { id: AdminTab; label: string; icon: string; code: string }[] = [
  { id: "COMMAND_CENTER", label: "COMMAND CENTER", icon: "⚡", code: "HUB-01" },
  { id: "KNOWLEDGE_VAULT", label: "KNOWLEDGE VAULT", icon: "🏛️", code: "VAULT-02" },
  { id: "USERS", label: "USER GOVERNANCE", icon: "👥", code: "USR-03" },
  { id: "CONTENT", label: "CONTENT CMS", icon: "📚", code: "CMS-04" },
  { id: "ANALYTICS", label: "PLATFORM ANALYTICS", icon: "📈", code: "ANL-05" },
  { id: "CHILL_ZONE", label: "CHILL ZONE CONTROL", icon: "🎮", code: "ARC-06" },
  { id: "SYSTEM_SETTINGS", label: "SYSTEM & FLAGS", icon: "⚙️", code: "SYS-07" },
];

export default function AdminTabsNav({ activeTab, onTabChange }: AdminTabsNavProps) {
  return (
    <div className="flex w-full overflow-x-auto border-b border-white/10 bg-[#080808] px-4 py-2 scrollbar-none sm:px-8">
      <div className="flex gap-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playHover();
                onTabChange(tab.id);
              }}
              className={`flex items-center gap-2 whitespace-nowrap rounded-2xl border px-4 py-2 font-mono text-xs font-bold transition duration-150 ${
                isActive
                  ? "border-[#D8A63A] bg-[#D8A63A]/15 text-[#F4C95D] shadow-[0_0_20px_rgba(216,166,58,0.25)]"
                  : "border-white/10 bg-white/[0.03] text-[#8C8C8C] hover:border-white/20 hover:text-white"
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
              <span className="rounded bg-black/40 px-1.5 py-0.5 text-[9px] text-[#8C8C8C]">
                {tab.code}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
