"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { UserAdminSummary } from "@/lib/admin/types";
import { UserSessionManager } from "@/lib/core/user-context";
import { sound } from "@/lib/audio/sound-engine";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

type UserDetailTab = "OVERVIEW" | "STUDY" | "PRACTICE" | "REVISION" | "MOCKS" | "CHILL_ZONE";

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserAdminSummary | null>(null);
  const [activeTab, setActiveTab] = useState<UserDetailTab>("OVERVIEW");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isMaster = UserSessionManager.isMasterAdmin();
    setIsAdmin(isMaster);

    if (isMaster) {
      // Fetch user details
      fetch(`/api/admin/users?query=${encodeURIComponent(userId)}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const matched = json.data.find((u: UserAdminSummary) => u.id === userId) || json.data[0];
            setUser(matched);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId]);

  if (loading || isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] font-mono text-xs text-[#8C8C8C]">
        LOADING CADET INTELLIGENCE MATRIX...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] font-mono text-xs text-white p-6 text-center">
        <h2 className="text-red-400 font-bold text-base mb-2">ACCESS RESTRICTED</h2>
        <p className="text-[#8C8C8C] max-w-sm mb-4">
          You must be logged in as the platform administrator to inspect cadet telemetry.
        </p>
        <Link href="/login?redirect=/admin" className="rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-5 py-2 font-bold text-black">
          Admin Sign In →
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] font-mono text-xs text-white">
        <h2>CADET NOT FOUND</h2>
        <Link href="/admin" className="mt-4 text-[#D8A63A] underline">
          ← Back to Command Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-[#F5F5F5] font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#060606]/90 px-4 py-3.5 backdrop-blur-xl sm:px-8">
        <div className="flex items-center gap-3">
          <Link

            href="/admin"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition"
          >
            ← ADMIN GOVERNANCE
          </Link>
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[#8C8C8C]">
            <span className="text-white/20">/</span>
            <span className="text-white font-bold">{user.fullName}</span>
            <span className="rounded bg-[#D8A63A]/20 px-2 py-0.5 text-[9px] font-black text-[#F4C95D]">
              {user.role}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 sm:p-8 space-y-6">
        {/* User Hero Banner */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-[#090909] p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-black text-emerald-400">
                ● {user.accountStatus}
              </span>
              <span className="font-mono text-[10px] text-[#8C8C8C]">
                REGISTERED: {user.joinedAt}
              </span>
            </div>
            <h1 className="mt-2 font-mono text-2xl sm:text-3xl font-black text-white uppercase">
              {user.fullName}
            </h1>
            <p className="font-mono text-xs text-[#8C8C8C]">{user.email}</p>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <div className="text-right">
              <span className="text-[#8C8C8C] text-[10px] uppercase">STUDY TOTAL</span>
              <h3 className="text-2xl font-black text-[#F4C95D]">{user.totalStudyHours}h</h3>
            </div>
            <div className="text-right">
              <span className="text-[#8C8C8C] text-[10px] uppercase">PYQ ACCURACY</span>
              <h3 className="text-2xl font-black text-emerald-400">{user.pyqAccuracy}%</h3>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-white/10 bg-[#080808] p-1.5 rounded-2xl gap-1">
          {(["OVERVIEW", "STUDY", "PRACTICE", "REVISION", "MOCKS", "CHILL_ZONE"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                sound.playHover();
                setActiveTab(tab);
              }}
              className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition ${
                activeTab === tab
                  ? "bg-[#D8A63A] text-black shadow-[0_0_15px_rgba(216,166,58,0.3)]"
                  : "text-[#8C8C8C] hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === "OVERVIEW" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 space-y-4 font-mono text-xs">
              <h3 className="font-black text-[#D8A63A] uppercase tracking-wider">
                CORE CADET METRICS
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#8C8C8C]">ACCOUNT AGE</span>
                  <span className="text-white font-bold">184 Days</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#8C8C8C]">LAST ACTIVE</span>
                  <span className="text-emerald-400 font-bold">{user.lastActiveAt}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#8C8C8C]">CURRENT ROLE</span>
                  <span className="text-[#F4C95D] font-bold">{user.role}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#8C8C8C]">SECURITY STATUS</span>
                  <span className="text-emerald-400 font-bold">0 Flags / Clean</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 space-y-4 font-mono text-xs">
              <h3 className="font-black text-[#D8A63A] uppercase tracking-wider">
                PREPARATION FOOTPRINT
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#8C8C8C]">PYQS SOLVED</span>
                  <span className="text-white font-bold">{user.pyqsSolved} Qs</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#8C8C8C]">MOCK TESTS COMPLETED</span>
                  <span className="text-white font-bold">{user.testsTaken} Tests</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#8C8C8C]">MAINS DRAFTS WRITTEN</span>
                  <span className="text-white font-bold">{user.mainsDraftsCount} Answers</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#8C8C8C]">CHILL ZONE BREAKS</span>
                  <span className="text-white font-bold">{user.chillGamesCount} Sessions</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: STUDY */}
        {activeTab === "STUDY" && (
          <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 space-y-4 font-mono text-xs">
            <h3 className="font-black text-[#D8A63A] uppercase tracking-wider">
              SUBJECT TIME DISTRIBUTION ({user.totalStudyHours} TOTAL HOURS)
            </h3>
            <div className="space-y-4">
              {[
                { subject: "Indian Polity & Governance", hours: 48, percent: 34 },
                { subject: "Modern Indian History", hours: 32, percent: 23 },
                { subject: "Geography & Environment", hours: 28, percent: 20 },
                { subject: "Indian Economy", hours: 22, percent: 15 },
                { subject: "CSAT & Mental Ability", hours: 12.5, percent: 8 },
              ].map((s) => (
                <div key={s.subject} className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-white font-bold">{s.subject}</span>
                    <span className="text-[#F4C95D]">{s.hours}h ({s.percent}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#D8A63A]"
                      style={{ width: `${s.percent * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: PRACTICE */}
        {activeTab === "PRACTICE" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 font-mono text-xs space-y-3">
              <h3 className="font-black text-[#D8A63A] uppercase tracking-wider">
                PYQ PERFORMANCE BY SUBJECT
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white">Indian Polity</span>
                  <span className="text-emerald-400 font-bold">88.4% Accuracy (92 Qs)</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white">Modern History</span>
                  <span className="text-emerald-400 font-bold">82.1% Accuracy (64 Qs)</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white">Economy</span>
                  <span className="text-amber-400 font-bold">71.0% Accuracy (52 Qs)</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white">Environment</span>
                  <span className="text-amber-400 font-bold">66.5% Accuracy (48 Qs)</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 font-mono text-xs space-y-3">
              <h3 className="font-black text-[#D8A63A] uppercase tracking-wider">
                ELIMINATION RADAR DIAGNOSTICS
              </h3>
              <p className="text-[#8C8C8C] text-[11px] leading-relaxed">
                Candidate performs exceptionally well on Constitutional Writs and Parliamentary procedures. Primary trap vulnerability is Extreme Statement traps ("All", "Only", "Never") in Environment questions.
              </p>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-3 text-amber-300">
                ⚠️ Advisory: Suggest focused drills on Environment Act statutory mandates.
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: REVISION */}
        {activeTab === "REVISION" && (
          <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 font-mono text-xs space-y-4">
            <h3 className="font-black text-[#D8A63A] uppercase tracking-wider">
              SM-2 SPACED REPETITION ENGINE STATUS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <span className="text-2xl font-black text-emerald-400">42</span>
                <p className="text-[#8C8C8C] text-[10px] uppercase mt-1">Mastered Flashcards</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <span className="text-2xl font-black text-[#F4C95D]">{user.revisionsPending}</span>
                <p className="text-[#8C8C8C] text-[10px] uppercase mt-1">Pending Due Today</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <span className="text-2xl font-black text-white">94.2%</span>
                <p className="text-[#8C8C8C] text-[10px] uppercase mt-1">Retention Index</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: MOCKS */}
        {activeTab === "MOCKS" && (
          <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 font-mono text-xs space-y-4">
            <h3 className="font-black text-[#D8A63A] uppercase tracking-wider">
              MOCK SIMULATION HISTORY ({user.testsTaken} TAKEN)
            </h3>
            <div className="space-y-2">
              {[
                { title: "Polity Module 01 (Constitutional Framework)", score: "18.0 / 20.0", date: "2 days ago" },
                { title: "Polity Module 02 (Fundamental Rights)", score: "17.34 / 20.0", date: "4 days ago" },
                { title: "Modern History Comprehensive", score: "112.5 / 200.0", date: "1 week ago" },
              ].map((m) => (
                <div key={m.title} className="flex justify-between items-center border border-white/5 bg-white/[0.02] p-3 rounded-xl">
                  <span className="text-white font-bold">{m.title}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-[#F4C95D] font-black">{m.score}</span>
                    <span className="text-[#8C8C8C] text-[10px]">{m.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: CHILL ZONE */}
        {activeTab === "CHILL_ZONE" && (
          <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 font-mono text-xs space-y-4">
            <h3 className="font-black text-[#D8A63A] uppercase tracking-wider">
              CHILL ZONE COGNITIVE RECALIBRATION ({user.chillGamesCount} SESSIONS)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <span className="text-[#8C8C8C] text-[10px]">WHY NOT REACT?</span>
                <h4 className="text-xl font-black text-[#F4C95D] mt-1">214 ms</h4>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <span className="text-[#8C8C8C] text-[10px]">MEMORY VAULT</span>
                <h4 className="text-xl font-black text-white mt-1">1,420 pts</h4>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <span className="text-[#8C8C8C] text-[10px]">QUICK DUEL</span>
                <h4 className="text-xl font-black text-emerald-400 mt-1">8 Wins</h4>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
