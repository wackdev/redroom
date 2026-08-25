"use client";

import React, { useState, useEffect } from "react";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import CadetRankBadge from "@/components/CadetRankBadge";
import AuthGuard from "@/components/auth/AuthGuard";
import { UserSessionManager, CadetProfile } from "@/lib/core/user-context";
import { sound } from "@/lib/audio/sound-engine";
import { UPSC_SUBJECTS } from "@/lib/core/constants";

export default function ProfilePage() {
  const [user, setUser] = useState<CadetProfile | null>(() => UserSessionManager.getActiveUser());
  const [fullName, setFullName] = useState(user?.fullName || "Cadet Aspirant");
  const [targetYear, setTargetYear] = useState<number>(user?.targetYear || 2026);
  const [optionalSubject, setOptionalSubject] = useState(user?.optionalSubject || "PSIR");
  const [dailyGoalHours, setDailyGoalHours] = useState(6.0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const optionalList = [
    "Political Science & International Relations (PSIR)",
    "Geography",
    "History",
    "Sociology",
    "Public Administration",
    "Philosophy",
    "Anthropology",
    "Economics",
    "Law",
    "Mathematics",
    "Medical Science",
    "Commerce & Accountancy",
  ];

  const handleSaveProfile = () => {
    sound.playVictory();
    if (user) {
      const updated: CadetProfile = {
        ...user,
        fullName,
        targetYear,
        optionalSubject,
      };
      UserSessionManager.setActiveUser(updated);
      setUser(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#040406] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
        <AppUniversalHeader moduleName="Cadet Dossier & DAF Profile" moduleBadge="PROFILE COMMAND" />

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
          {/* HEADER BANNER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-[#F4C95D]">
                CENTRAL CADET TELEMETRY
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Aspirant Profile & Detailed Application Form (DAF)
              </h1>
              <p className="text-xs text-[#8C8C8C] mt-1 font-sans">
                Manage your target exam year, optional subject, daily study targets, and military-grade cadet ranking.
              </p>
            </div>

            {savedSuccess && (
              <span className="rounded-2xl bg-emerald-500/20 border border-emerald-500/40 px-4 py-2 font-mono text-xs font-bold text-emerald-300 animate-in fade-in">
                ✓ Profile Updated Successfully
              </span>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* LEFT: RANK BADGE & STATS */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl space-y-6 text-center">
                <div className="mx-auto flex justify-center">
                  <CadetRankBadge />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{fullName}</h3>
                  <p className="font-mono text-xs text-white/50">{user?.email || "cadet@whynotupsc.os"}</p>
                </div>
                <div className="border-t border-white/5 pt-4 grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="bg-white/5 p-3 rounded-2xl">
                    <p className="text-[10px] text-white/50">TARGET YEAR</p>
                    <p className="text-sm font-bold text-[#F4C95D] mt-1">{targetYear}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl">
                    <p className="text-[10px] text-white/50">DAILY GOAL</p>
                    <p className="text-sm font-bold text-emerald-400 mt-1">{dailyGoalHours}h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: EDITABLE DAF DETAILS */}
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 sm:p-8 shadow-xl space-y-6">
                <h3 className="font-mono text-sm font-black uppercase tracking-wider text-white">
                  DAF Information & Preferences
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="font-mono text-xs text-white/60 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-semibold text-white focus:border-[#D8A63A] focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="font-mono text-xs text-white/60 block mb-1">Target Examination Year</label>
                      <select
                        value={targetYear}
                        onChange={(e) => setTargetYear(Number(e.target.value))}
                        className="w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-sm font-semibold text-white focus:border-[#D8A63A] focus:outline-none"
                      >
                        <option value={2025}>UPSC CSE 2025</option>
                        <option value={2026}>UPSC CSE 2026</option>
                        <option value={2027}>UPSC CSE 2027</option>
                        <option value={2028}>UPSC CSE 2028</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-mono text-xs text-white/60 block mb-1">Daily Study Target (Hours)</label>
                      <input
                        type="number"
                        step="0.5"
                        min="2"
                        max="16"
                        value={dailyGoalHours}
                        onChange={(e) => setDailyGoalHours(Number(e.target.value))}
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-semibold text-white focus:border-[#D8A63A] focus:outline-none"
                      >
                      </input>
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-xs text-white/60 block mb-1">500-Mark Optional Subject</label>
                    <select
                      value={optionalSubject}
                      onChange={(e) => setOptionalSubject(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-sm font-semibold text-white focus:border-[#D8A63A] focus:outline-none"
                    >
                      {optionalList.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button
                    onClick={handleSaveProfile}
                    className="rounded-2xl bg-gradient-to-r from-[#D8A63A] to-[#B38322] px-8 py-3.5 font-mono text-xs font-black text-black shadow-xl hover:scale-105 active:scale-95 transition"
                  >
                    Save Dossier Changes ⚡
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
