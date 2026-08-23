"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserSessionManager, CadetProfile, SINGLE_ADMIN_CREDENTIALS } from "@/lib/core/user-context";
import { sound } from "@/lib/audio/sound-engine";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [targetYear, setTargetYear] = useState(2026);
  const [optionalSubject, setOptionalSubject] = useState("PSIR / Political Science");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const emailTrimmed = email.trim().toLowerCase();
    const passTrimmed = password.trim();

    if (!emailTrimmed || !passTrimmed) {
      setError("Please provide both email and password.");
      return;
    }

    if (authMode === "signup") {
      if (!fullName.trim()) {
        setError("Please provide your full name.");
        return;
      }
      if (passTrimmed.length < 6) {
        setError("Password must be at least 6 characters in length.");
        return;
      }
      if (passTrimmed !== confirmPassword.trim()) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    sound.playHover();

    try {
      // 1. Direct Single Master Admin Login
      if (
        emailTrimmed === SINGLE_ADMIN_CREDENTIALS.email.toLowerCase() &&
        passTrimmed === SINGLE_ADMIN_CREDENTIALS.password
      ) {
        const authResult = await UserSessionManager.authenticateLocal(emailTrimmed, passTrimmed);
        if (authResult.success && authResult.user) {
          UserSessionManager.setActiveUser(authResult.user);
          sound.playVictory();
          setSuccessMsg("Administrator verified. Entering Command Center...");
          setTimeout(() => {
            router.push(redirectTarget === "/dashboard" ? "/admin" : redirectTarget);
          }, 400);
          return;
        }
      }

      // 2. Call Server Auth API
      const endpoint = authMode === "signin" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        authMode === "signin"
          ? { email: emailTrimmed, password: passTrimmed }
          : {
              email: emailTrimmed,
              password: passTrimmed,
              fullName: fullName.trim(),
              targetYear,
              optionalSubject: optionalSubject.trim(),
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success && json.data?.user) {
        const cadet: CadetProfile = json.data.user;
        UserSessionManager.setActiveUser(cadet);
        sound.playVictory();

        if (authMode === "signup") {
          setSuccessMsg("Cadet profile initialized! Directing to command console...");
        } else {
          setSuccessMsg("Welcome back, Cadet. Access granted.");
        }

        setTimeout(() => {
          router.push(redirectTarget);
        }, 500);
        return;
      }

      // 3. Fallback: Local Client Authentication
      if (authMode === "signin") {
        const localAuth = await UserSessionManager.authenticateLocal(emailTrimmed, passTrimmed);
        if (localAuth.success && localAuth.user) {
          UserSessionManager.setActiveUser(localAuth.user);
          sound.playVictory();
          setSuccessMsg("Local offline profile verified. Accessing portal...");
          setTimeout(() => {
            router.push(redirectTarget);
          }, 400);
          return;
        }
      } else {
        const localReg = await UserSessionManager.registerLocal({
          email: emailTrimmed,
          password: passTrimmed,
          fullName,
          targetYear,
          optionalSubject,
        });
        if (localReg.success && localReg.user) {
          UserSessionManager.setActiveUser(localReg.user);
          sound.playVictory();
          setSuccessMsg("Cadet profile created locally. Entering workspace...");
          setTimeout(() => {
            router.push(redirectTarget);
          }, 400);
          return;
        }
      }

      // Show specific server error
      setError(json.error?.message || "Authentication failed. Please verify credentials.");
    } catch (err: unknown) {
      console.warn("[Login] Auth error:", err);
      // Try local auth as graceful offline fallback
      if (authMode === "signin") {
        const localRes = await UserSessionManager.authenticateLocal(emailTrimmed, passTrimmed);
        if (localRes.success && localRes.user) {
          UserSessionManager.setActiveUser(localRes.user);
          sound.playVictory();
          router.push(redirectTarget);
          return;
        }
      }
      setError("Network or server connection issue. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-[#D8A63A]/40 bg-[#0d0d0d] p-6 sm:p-8 shadow-[0_0_60px_rgba(216,166,58,0.15)] relative">
      {/* Top Gold Ambient Glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-12 bg-[#D8A63A]/20 blur-2xl pointer-events-none rounded-full" />

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
        Civil Services Operating System // Secure Cadet Portal
      </p>

      {/* Tab Switcher: SIGN IN vs CREATE ACCOUNT */}
      <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1 mb-6 font-mono text-xs">
        <button
          type="button"
          onClick={() => {
            sound.playHover();
            setAuthMode("signin");
            setError("");
            setSuccessMsg("");
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
            setSuccessMsg("");
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
        <div className="mb-4 rounded-2xl bg-red-500/10 border border-red-500/30 p-3 font-mono text-xs text-red-300 animate-fadeIn flex items-start gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 font-mono text-xs text-emerald-300 animate-fadeIn flex items-start gap-2">
          <span>✓</span>
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleAuthSubmit} className="space-y-4 font-mono text-xs">
        {authMode === "signup" && (
          <div>
            <label className="text-[10px] text-[#8C8C8C] uppercase">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Aarav Kumar"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 w-full rounded-xl bg-black/60 border border-white/10 px-4 py-2.5 text-xs text-white outline-none focus:border-[#D8A63A] transition"
            />
          </div>
        )}

        <div>
          <label className="text-[10px] text-[#8C8C8C] uppercase">Email Address</label>
          <input
            type="email"
            placeholder="cadet@whynotupsc.org or your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-xl bg-black/60 border border-white/10 px-4 py-2.5 text-xs text-white outline-none focus:border-[#D8A63A] transition"
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
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-[#8C8C8C] uppercase">Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[10px] text-[#F4C95D] hover:underline cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-xl bg-black/60 border border-white/10 px-4 py-2.5 text-xs text-white outline-none focus:border-[#D8A63A] transition"
          />
        </div>

        {authMode === "signup" && (
          <div>
            <label className="text-[10px] text-[#8C8C8C] uppercase">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-xl bg-black/60 border border-white/10 px-4 py-2.5 text-xs text-white outline-none focus:border-[#D8A63A] transition"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-2xl border border-[#D8A63A] bg-[#D8A63A] py-3.5 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_20px_rgba(216,166,58,0.3)] disabled:opacity-50 cursor-pointer"
        >
          {loading
            ? "VERIFYING CADET CLEARANCE..."
            : authMode === "signin"
            ? "SIGN IN TO WORKSPACE →"
            : "CREATE CADET PROFILE & ENTER →"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-[#F5F5F5] px-4 py-8 font-sans select-none selection:bg-[#D8A63A]/30">
      <Suspense
        fallback={
          <div className="font-mono text-xs text-[#8C8C8C] flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#D8A63A] border-t-transparent" />
            LOADING SECURE PORTAL...
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </main>
  );
}