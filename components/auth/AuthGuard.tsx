"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { UserSessionManager, CadetProfile } from "@/lib/core/user-context";
import { sound } from "@/lib/audio/sound-engine";

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CadetProfile | null>(() => UserSessionManager.getActiveUser());
  const [isChecking, setIsChecking] = useState<boolean>(() => !UserSessionManager.getActiveUser());

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // 1. Synchronous check
      let active = UserSessionManager.getActiveUser();
      if (!active) {
        // 2. Asynchronous remote session hydration on page refresh
        active = await UserSessionManager.hydrateSession();
      }

      if (isMounted) {
        setUser(active);
        setIsChecking(false);
      }
    };

    void checkAuth();

    const handleUserChange = (e: CustomEvent<CadetProfile | null>) => {
      if (isMounted) {
        setUser(e.detail);
        setIsChecking(false);
      }
    };

    window.addEventListener("whynotupsc_user_changed", handleUserChange as EventListener);
    return () => {
      isMounted = false;
      window.removeEventListener("whynotupsc_user_changed", handleUserChange as EventListener);
    };
  }, []);

  if (isChecking) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#050505] text-[#8C8C8C] font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#D8A63A] border-t-transparent shadow-[0_0_15px_rgba(216,166,58,0.3)]" />
          <span className="tracking-widest text-[#F4C95D]">INITIALIZING CADET MATRIX...</span>
        </div>
      </div>
    );
  }

  // Not Authenticated: Render sleek Cadet Access Shield Gate
  if (!user) {
    const redirectUrl = encodeURIComponent(pathname || "/dashboard");

    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-[#F5F5F5] px-4 py-12 font-sans selection:bg-[#D8A63A]/30">
        <div className="relative w-full max-w-md rounded-3xl border border-[#D8A63A]/40 bg-[#0d0d0d] p-6 sm:p-8 shadow-[0_0_60px_rgba(216,166,58,0.15)] overflow-hidden">
          {/* Top Decorative Amber Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D8A63A] to-transparent" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 font-mono text-sm font-black text-[#F4C95D] shadow-[0_0_15px_rgba(216,166,58,0.3)]">
                🔒
              </div>
              <div>
                <h1 className="font-mono text-sm font-black tracking-widest text-white uppercase">
                  CADET ACCESS REQUIRED
                </h1>
                <p className="text-[10px] font-mono text-[#8C8C8C]">
                  CIVIL SERVICES OPERATING SYSTEM
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-mono text-xs text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition"
            >
              ✕
            </Link>
          </div>

          <p className="mt-2 text-xs text-[#8C8C8C] leading-relaxed">
            Authentication is required to access your personalized syllabus matrix, elimination radar, study telemetry, and interactive labs.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={`/login?redirect=${redirectUrl}`}
              onClick={() => sound.playWarp()}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#D8A63A] bg-[#D8A63A] py-3.5 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_25px_rgba(216,166,58,0.35)] cursor-pointer"
            >
              <span>CADET SIGN IN / REGISTER</span>
              <span>→</span>
            </Link>

            <Link
              href="/"
              className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-3 font-mono text-xs text-[#8C8C8C] hover:border-white/20 hover:text-white transition"
            >
              ← Return to Mission Overview
            </Link>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <span className="font-mono text-[10px] text-white/30 uppercase">
              WHYNOTUPSC // MULTI-USER CLOUD PLATFORM
            </span>
          </div>
        </div>
      </main>
    );
  }

  // Admin Requirement Check
  if (requireAdmin && !UserSessionManager.isMasterAdmin()) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-[#F5F5F5] px-4 py-8 font-mono text-xs">
        <div className="w-full max-w-md rounded-3xl border border-red-500/40 bg-[#0d0d0d] p-6 text-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
          <span className="text-3xl">⚠️</span>
          <h2 className="mt-3 font-black text-red-400 text-sm">ADMIN CLEARANCE REQUIRED</h2>
          <p className="mt-2 text-[#8C8C8C] text-xs">
            Your cadet account does not possess Super Admin clearance.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white hover:border-[#D8A63A]"
          >
            ← Return to Command Centre
          </Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
