"use client";

import Link from "next/link";
import { AdminRole } from "@/lib/admin/types";
import { sound } from "@/lib/audio/sound-engine";

interface AdminHeaderProps {
  currentRole: AdminRole;
  onChangeRole?: (newRole: AdminRole) => void;
  onOpenCommandPalette: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function AdminHeader({
  currentRole,
  onChangeRole,
  onOpenCommandPalette,
  isMuted,
  onToggleMute,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#060606]/90 px-4 py-3.5 backdrop-blur-2xl sm:px-8">
      {/* Brand & System Status */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-mono text-xs font-black text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition"
          title="Return to Prep Dashboard"
        >
          ←
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-xs sm:text-sm font-black tracking-widest text-white uppercase">
              WHYNOTUPSC // ADMIN COMMAND PORTAL
            </h1>
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-black text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE
            </span>
          </div>
          <p className="font-mono text-[10px] text-[#8C8C8C]">
            AUTONOMOUS PLATFORM TELEMETRY & ECOSYSTEM GOVERNANCE
          </p>
        </div>
      </div>

      {/* Role Badge & Global Actions */}
      <div className="flex items-center gap-3 font-mono text-xs">
        {/* Role Selector Simulator for Testing RBAC */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1">
          <span className="text-[10px] text-[#8C8C8C]">ROLE:</span>
          <select
            value={currentRole}
            onChange={(e) => onChangeRole?.(e.target.value as AdminRole)}
            className="bg-transparent font-mono text-[11px] font-black text-[#F4C95D] focus:outline-none cursor-pointer"
          >
            <option value="SUPER_ADMIN" className="bg-black text-white">SUPER_ADMIN (ALL)</option>
            <option value="ADMIN" className="bg-black text-white">ADMIN (PLATFORM)</option>
            <option value="CONTENT_ADMIN" className="bg-black text-white">CONTENT_ADMIN (CMS)</option>
            <option value="MODERATOR" className="bg-black text-white">MODERATOR (CHILL)</option>
            <option value="ANALYST" className="bg-black text-white">ANALYST (READ-ONLY)</option>
          </select>
        </div>

        {/* Mute Button */}
        <button
          onClick={onToggleMute}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#8C8C8C] hover:text-white transition"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

        {/* Command Palette Trigger */}
        <button
          onClick={() => {
            sound.playLock();
            onOpenCommandPalette();
          }}
          className="flex items-center gap-1.5 rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3.5 py-1.5 font-bold text-[#F4C95D] hover:bg-[#D8A63A]/20 transition shadow-[0_0_15px_rgba(216,166,58,0.2)]"
        >
          <span>⚡</span>
          <span className="hidden md:inline">COMMAND</span> [Ctrl+K]
        </button>
      </div>
    </header>
  );
}
