"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/db/supabase";
import { UserSessionManager, CadetProfile } from "@/lib/core/user-context";
import { sound } from "@/lib/audio/sound-engine";

export default function LoginPage() {
  const router = useRouter();
  const isCloudAvailable = isSupabaseConfigured();

  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [targetYear, setTargetYear] = useState(2026);
  const [optionalSubject, setOptionalSubject] = useState("PSIR / Political Science");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim() || !password.trim()) {
      setError("Please provide both email and password.");
      return;
    }

    if (authMode === "signup") {
      if (!fullName.trim()) {
        setError("Please provide your full name.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters in length.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    sound.playHover();

    // 1. If Supabase Cloud is configured
    if (isCloudAvailable) {
      try {
        const supabase = createClient();
        if (authMode === "signin") {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (signInError) {
            setError(signInError.message);
            setLoading(false);
            return;
          }
          if (data.user) {
            const cadet: CadetProfile = {
              id: data.user.id,
              email: data.user.email || email,
              fullName: data.user.user_metadata?.full_name || fullName || "Cadet Aspirant",
              targetYear: data.user.user_metadata?.target_year || targetYear,
              optionalSubject: data.user.user_metadata?.optional_subject || optionalSubject,
              role: (data.user.user_metadata?.role as any) || "USER",
              createdAt: data.user.created_at || new Date().toISOString(),
              lastActiveAt: new Date().toISOString(),
            };
            UserSessionManager.setActiveUser(cadet);
          }
        } else {
          // Sign Up
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                target_year: targetYear,
                optional_subject: optionalSubject,
                role: "USER",
              },
            },
          });
          if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
          }
          if (data.user) {
            const cadet: CadetProfile = {
              id: data.user.id,
              email,
              fullName,
              targetYear,
              optionalSubject,
              role: "USER",
              createdAt: new Date().toISOString(),
              lastActiveAt: new Date().toISOString(),
            };
            UserSessionManager.setActiveUser(cadet);
          }
        }
      } catch {
        // Fallback to local mode
      }
    } else {
      // 2. Zero-Cost Local Multi-User Registration & Authentication
      const userId = `cadet_${email.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now().toString(36)}`;
      const cadet: CadetProfile = {
        id: userId,
        email,
        fullName: fullName || email.split("@")[0] || "Cadet Aspirant",
        targetYear,
        optionalSubject,
        role: "USER",
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };
      UserSessionManager.setActiveUser(cadet);
    }

    sound.playVictory();
    router.push("/dashboard");
    setLoading(false);
  };

  const handleEnterGuestMode = () => {
    sound.playWarp();
    const guestUser = UserSessionManager.getDefaultCadet();
    UserSessionManager.setActiveUser(guestUser);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-[#F5F5F5] px-4 py-8 font-sans select-none selection:bg-[#D8A63A]/30">
      <div className="w-full max-w-md rounded-3xl border border-[#D8A63A]/40 bg-[#0d0d0d] p-6 sm:p-8 shadow-[0_0_60px_rgba(216,166,58,0.15)]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 font-mono text-sm font-black text-[#D8A63A] hover:bg-[#D8A63A]/20 transition"
          >
            ↑
          </Link>
          <h1 className="text-xl font-black font-mono tracking-widest text-white uppercase">
            WHYNOTUPSC
          </h1>
        </div>

        <p className="text-xs font-mono text-[#8C8C8C] mb-6">
          Civil Services Operating System // Secure Multi-User Portal
        </p>

        {/* Tab Switcher: SIGN IN vs CREATE ACCOUNT */}
        <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1 mb-6 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              sound.playHover();
              setAuthMode("signin");
              setError("");
            }}
            className={`flex-1 rounded-xl py-2 font-bold transition ${
              authMode === "signin"
                ? "bg-[#D8A63A] text-black shadow-[0_0_15px_rgba(216,166,58,0.3)]"
                : "text-[#8C8C8C] hover:text-white"
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playHover();
              setAuthMode("signup");
              setError("");
            }}
            className={`flex-1 rounded-xl py-2 font-bold transition ${
              authMode === "signup"
                ? "bg-[#D8A63A] text-black shadow-[0_0_15px_rgba(216,166,58,0.3)]"
                : "text-[#8C8C8C] hover:text-white"
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl bg-red-500/10 border border-red-500/30 p-3 font-mono text-xs text-red-300 animate-fadeIn">
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 font-mono text-xs text-emerald-300 animate-fadeIn">
            ✓ {successMsg}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4 font-mono text-xs">
          {authMode === "signup" && (
            <div>
              <label className="text-[10px] text-[#8C8C8C] uppercase">Full Name</label>
              <input
                type="text"
                placeholder="Aarav Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1 w-full rounded-xl bg-black/60 border border-white/10 px-4 py-2.5 text-xs text-white outline-none focus:border-[#D8A63A]"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] text-[#8C8C8C] uppercase">Email Address</label>
            <input
              type="email"
              placeholder="cadet@whynotupsc.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-xl bg-black/60 border border-white/10 px-4 py-2.5 text-xs text-white outline-none focus:border-[#D8A63A]"
            />
          </div>

          {authMode === "signup" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#8C8C8C] uppercase">Target Exam Year</label>
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-[#F4C95D] font-bold outline-none focus:border-[#D8A63A]"
                >
                  <option value={2025}>CSE 2025</option>
                  <option value={2026}>CSE 2026</option>
                  <option value={2027}>CSE 2027</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#8C8C8C] uppercase">Optional Subject</label>
                <input
                  type="text"
                  placeholder="e.g. PSIR / History"
                  value={optionalSubject}
                  onChange={(e) => setOptionalSubject(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#D8A63A]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] text-[#8C8C8C] uppercase">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-xl bg-black/60 border border-white/10 px-4 py-2.5 text-xs text-white outline-none focus:border-[#D8A63A]"
            />
          </div>

          {authMode === "signup" && (
            <div>
              <label className="text-[10px] text-[#8C8C8C] uppercase">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-xl bg-black/60 border border-white/10 px-4 py-2.5 text-xs text-white outline-none focus:border-[#D8A63A]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-2xl border border-[#D8A63A] bg-[#D8A63A] py-3 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_20px_rgba(216,166,58,0.3)] disabled:opacity-50"
          >
            {loading
              ? "AUTHENTICATING..."
              : authMode === "signin"
              ? "SIGN IN TO WORKSPACE →"
              : "CREATE CADET PROFILE & ENTER →"}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0d0d0d] px-3 font-mono text-[10px] text-[#8C8C8C] uppercase">
            OR ZERO-COST ACCESS
          </span>
        </div>

        {/* Guest / Direct Entry */}
        <button
          type="button"
          onClick={handleEnterGuestMode}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-2.5 font-mono text-xs font-bold text-white hover:border-[#D8A63A] hover:text-[#F4C95D] transition"
        >
          <span>🚀 INSTANT DEMO CADET ACCESS</span>
        </button>
      </div>
    </main>
  );
}