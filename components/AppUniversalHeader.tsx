"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { UserSessionManager, CadetProfile } from "@/lib/core/user-context";
import { sound } from "@/lib/audio/sound-engine";
import { useCloudSync } from "@/lib/sync/sync-engine";
import { APP_ROUTES } from "@/lib/core/constants";
import { createClient } from "@/lib/db/supabase";

interface AppUniversalHeaderProps {
  moduleName?: string;
  moduleBadge?: string;
  onOpenCustomModal?: () => void;
}

export default function AppUniversalHeader({
  moduleName,
  moduleBadge,
}: AppUniversalHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isSyncing, lastSyncTime, triggerManualSync } = useCloudSync();

  const [activeUser, setActiveUser] = useState<CadetProfile | null>(() =>
    UserSessionManager.getActiveUser()
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveUser(UserSessionManager.getActiveUser());
    setIsMuted(sound.getMuted());

    const handleUserChange = (e: CustomEvent<CadetProfile | null>) => {
      setActiveUser(e.detail);
    };

    window.addEventListener("whynotupsc_user_changed", handleUserChange as EventListener);

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("whynotupsc_user_changed", handleUserChange as EventListener);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentRoute = useMemo(() => {
    return APP_ROUTES.find((r) => r.path === pathname) || null;
  }, [pathname]);

  const activeTitle = moduleName || currentRoute?.label || "Command Centre";
  const activeBadge = moduleBadge || (pathname === "/admin" ? "MASTER ADMIN" : "CIVIL SERVICES OS");

  const filteredRoutes = useMemo(() => {
    if (!searchFilter.trim()) return APP_ROUTES;
    const q = searchFilter.toLowerCase();
    return APP_ROUTES.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.path.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  const handleToggleSound = () => {
    const nextState = sound.toggleMute();
    setIsMuted(nextState);
  };

  const handleOpenFocusModal = () => {
    sound.playSelect();
    window.dispatchEvent(new CustomEvent("redroom_open_focus_modal"));
  };

  const handleOpenCommandPalette = () => {
    sound.playLock();
    window.dispatchEvent(new CustomEvent("redroom_open_command_palette"));
  };

  const handleLogout = async () => {
    sound.playClick();
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    UserSessionManager.logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#070707]/90 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6">
        {/* Left: Brand + Quick Switcher Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-3" ref={dropdownRef}>
          <Link
            href="/"
            onClick={() => sound.playSelect()}
            className="group flex items-center gap-2 rounded-xl p-1 transition"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#D8A63A] to-[#B38322] font-mono font-black text-black shadow-[0_0_15px_rgba(216,166,58,0.4)] group-hover:scale-105 transition shrink-0">
              ↑
            </div>
            <span className="font-mono text-sm sm:text-base font-black tracking-widest text-white uppercase hidden md:inline">
              WHYNOT<span className="text-[#F4C95D]">UPSC</span>
            </span>
          </Link>

          <span className="text-white/20 hidden sm:inline">/</span>

          {/* Module Switcher Dropdown Trigger Button */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playHover();
                setDropdownOpen(!dropdownOpen);
              }}
              className="flex min-h-[38px] items-center gap-1.5 sm:gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs font-bold text-white hover:border-[#D8A63A]/50 hover:bg-[#D8A63A]/10 transition shadow cursor-pointer"
            >
              <span className="text-sm">{currentRoute?.icon || "⚡"}</span>
              <span className="uppercase text-white tracking-wider max-w-[100px] sm:max-w-[180px] truncate">
                {activeTitle}
              </span>
              <span className="text-[10px] text-[#F4C95D]">▼</span>
            </button>

            {/* Quick Switcher Modal / Dropdown Menu */}
            {dropdownOpen && (
              <div className="fixed sm:absolute top-14 sm:top-full left-3 sm:left-0 right-3 sm:right-auto sm:w-96 rounded-2xl border border-white/15 bg-[#0c0c0c] p-3 text-white shadow-[0_15px_50px_rgba(0,0,0,0.95)] z-50 animate-in fade-in duration-150">
                <div className="mb-2.5 flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-mono text-[10px] font-black tracking-widest text-[#F4C95D] uppercase">
                    27-SYSTEM COMMAND DIRECTORY
                  </span>
                  <button
                    onClick={() => setDropdownOpen(false)}
                    className="font-mono text-xs text-[#8C8C8C] hover:text-white p-1"
                  >
                    ✕
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Jump to module..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="mb-2.5 w-full min-h-[38px] rounded-xl border border-white/10 bg-black/60 px-3 py-1.5 font-mono text-xs text-white placeholder:text-white/40 focus:border-[#D8A63A] focus:outline-none"
                  autoFocus
                />

                <div className="max-h-72 sm:max-h-80 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
                  {filteredRoutes.map((r) => {
                    const isActive = pathname === r.path;
                    return (
                      <Link
                        key={r.path}
                        href={r.path}
                        onClick={() => {
                          sound.playWarp();
                          setDropdownOpen(false);
                        }}
                        className={`flex min-h-[40px] items-center justify-between rounded-xl px-3 py-2 transition ${
                          isActive
                            ? "bg-[#D8A63A]/20 text-[#F4C95D] border border-[#D8A63A]/40 font-bold"
                            : "hover:bg-white/5 text-[#8C8C8C] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{r.icon}</span>
                          <div className="min-w-0">
                            <p className="font-bold text-white text-xs truncate">{r.label}</p>
                            <p className="text-[10px] text-white/50 truncate max-w-[200px]">
                              {r.description}
                            </p>
                          </div>
                        </div>
                        {isActive && <span className="text-[10px] text-[#F4C95D] shrink-0 ml-1">● ACTIVE</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <span className="hidden lg:inline-block rounded-full border border-[#D8A63A]/30 bg-[#D8A63A]/10 px-2 py-0.5 font-mono text-[9px] font-bold text-[#F4C95D]">
            {activeBadge}
          </span>
        </div>

        {/* Right: Actions, Sync, Profile, Command Shortcut */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 font-mono text-xs">
          {/* Cloud Sync Status */}
          <button
            onClick={() => void triggerManualSync()}
            title="Cloud Sync State"
            className={`flex min-h-[38px] items-center gap-1 rounded-xl border px-2 sm:px-2.5 py-1.5 font-semibold transition cursor-pointer ${
              isSyncing
                ? "border-[#D8A63A]/50 bg-[#D8A63A]/15 text-[#F4C95D] animate-pulse"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{isSyncing ? "🔄" : "☁️"}</span>
            <span className="hidden xl:inline text-[11px]">
              {isSyncing ? "SYNCING..." : lastSyncTime ? `SYNCED (${lastSyncTime})` : "SYNC"}
            </span>
          </button>

          {/* Deep Work Focus Sanctuary Trigger */}
          <button
            onClick={handleOpenFocusModal}
            title="Launch Deep Work Focus Sanctuary"
            className="flex min-h-[38px] items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2 sm:px-2.5 py-1.5 text-white/70 hover:border-[#D8A63A]/40 hover:text-white transition cursor-pointer"
          >
            <span>🧘</span>
            <span className="hidden md:inline text-[11px]">FOCUS</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? "Sound Muted" : "Sound Enabled"}
            className="flex min-h-[38px] items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2 sm:px-2.5 py-1.5 text-white/70 hover:text-white transition cursor-pointer"
          >
            <span>{isMuted ? "🔇" : "🔊"}</span>
          </button>

          {/* Omnibox / Command Palette Trigger */}
          <button
            onClick={handleOpenCommandPalette}
            title="Global Command Palette (Ctrl+K)"
            className="hidden sm:flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-2.5 py-1.5 font-bold text-[#F4C95D] hover:bg-[#D8A63A]/20 transition shadow cursor-pointer"
          >
            <span>⚡</span>
            <span className="text-[11px]">Ctrl+K</span>
          </button>

          {/* Cadet Profile Pill & Exit */}
          {activeUser ? (
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-1.5 sm:pl-2">
              <Link
                href="/performance"
                title="Cadet Profile & Performance Radar"
                className="flex min-h-[38px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 sm:px-2.5 py-1.5 hover:border-[#D8A63A] transition"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D8A63A] font-black text-black text-[10px]">
                  {activeUser.fullName?.charAt(0) || "C"}
                </div>
                <span className="hidden md:inline font-bold text-white text-[11px] max-w-[100px] truncate">
                  {activeUser.fullName}
                </span>
                <span className="hidden lg:inline text-[9px] text-[#F4C95D]">
                  '{String(activeUser.targetYear || 2026).slice(2)}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                title="Sign Out of Cadet Session"
                className="min-h-[38px] rounded-xl border border-white/10 bg-white/5 px-2 sm:px-2.5 py-1.5 text-white/60 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300 transition cursor-pointer text-[11px]"
              >
                Exit
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="min-h-[38px] flex items-center rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-3 py-1.5 font-bold text-black hover:bg-[#F4C95D] transition text-[11px]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
