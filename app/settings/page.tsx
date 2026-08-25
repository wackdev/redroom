"use client";

import React, { useState, useEffect } from "react";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import AuthGuard from "@/components/auth/AuthGuard";
import { sound } from "@/lib/audio/sound-engine";
import { DEFAULT_AI_MODELS } from "@/lib/core/constants";
import { useCloudSync } from "@/lib/sync/sync-engine";
import { dexieDb } from "@/lib/db/dexie";

export default function SettingsPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [selectedModel, setSelectedModel] = useState("moon-primary");
  const [leaderboardPrivacy, setLeaderboardPrivacy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { isSyncing, lastSyncTime, triggerManualSync } = useCloudSync();

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const handleToggleSound = () => {
    const nextState = sound.toggleMute();
    setIsMuted(nextState);
  };

  const handleExportData = async () => {
    sound.playLock();
    setExporting(true);
    try {
      const notes = await dexieDb.notes.toArray();
      const attempts = await dexieDb.pyq_attempts.toArray();
      const results = await dexieDb.test_results.toArray();
      const plans = await dexieDb.study_plans.toArray();

      const backup = {
        exportedAt: new Date().toISOString(),
        version: "1.0",
        data: {
          notes,
          attempts,
          results,
          plans,
        },
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `whynotupsc-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      sound.playVictory();
    } catch (err) {
      alert("Failed to export database backup.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#040406] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
        <AppUniversalHeader moduleName="System Preferences & Offline Sync" moduleBadge="SETTINGS" />

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
          <div className="border-b border-white/10 pb-4">
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-[#F4C95D]">
              SYSTEM CONFIGURATION
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Platform Settings & Engine Controls
            </h1>
            <p className="text-xs text-[#8C8C8C] mt-1 font-sans">
              Manage audio synthesis, AI strategic models, zero-latency IndexedDB local sync, and personal data exports.
            </p>
          </div>

          <div className="space-y-6">
            {/* 1. AUDIO SYNTHESIS & SFX */}
            <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-sm font-bold text-white">Audio Synthesis & SFX Engine</h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    Zero-asset Web Audio synth for hyperdrive warps, correct answers, and focus ticks.
                  </p>
                </div>
                <button
                  onClick={handleToggleSound}
                  className={`rounded-2xl px-5 py-2.5 font-mono text-xs font-bold transition ${
                    isMuted
                      ? "bg-white/10 text-white/50 hover:bg-white/20"
                      : "bg-[#D8A63A] text-black shadow-lg"
                  }`}
                >
                  {isMuted ? "🔇 Audio Muted" : "🔊 Audio Active"}
                </button>
              </div>
            </div>

            {/* 2. AI STRATEGIST MODEL SELECTION */}
            <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl space-y-4">
              <div>
                <h3 className="font-mono text-sm font-bold text-white">AI Strategy Copilot Provider</h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Select primary LLM backend for answer evaluations, DAF profiling, and strategic revision plans.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {DEFAULT_AI_MODELS.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => {
                      sound.playSelect();
                      setSelectedModel(model.id);
                    }}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      selectedModel === model.id
                        ? "border-[#D8A63A] bg-[#D8A63A]/10 text-white"
                        : "border-white/5 bg-white/[0.02] text-white/70 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">{model.name}</span>
                      {selectedModel === model.id && (
                        <span className="rounded-full bg-[#D8A63A] px-2 py-0.5 font-mono text-[9px] font-black text-black">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-white/40 mt-1">{model.modelParam}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. DEXIE OFFLINE CLOUD SYNC */}
            <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-mono text-sm font-bold text-white">IndexedDB Local Persistence & Cloud Sync</h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    Dexie 4.x outbox engine. Ensures 100% offline uptime with seamless background sync.
                  </p>
                  <p className="font-mono text-[11px] text-[#F4C95D] mt-2">
                    Status: {isSyncing ? "⚡ Syncing Outbox..." : "✓ Synchronized"} · Last Check: {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : "Recent"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playLock();
                    triggerManualSync();
                  }}
                  disabled={isSyncing}
                  className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-2.5 font-mono text-xs font-bold text-white transition shrink-0"
                >
                  {isSyncing ? "Syncing..." : "Force Cloud Sync 🔄"}
                </button>
              </div>
            </div>

            {/* 4. DATA EXPORT & BACKUP */}
            <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-mono text-sm font-bold text-white">Data Portability & Vault Export</h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    Export complete JSON archive of all your notes, PYQ attempts, mistake logs, and study sessions.
                  </p>
                </div>

                <button
                  onClick={handleExportData}
                  disabled={exporting}
                  className="rounded-2xl bg-gradient-to-r from-[#D8A63A] to-[#B38322] px-6 py-3 font-mono text-xs font-black text-black shadow-xl hover:scale-105 active:scale-95 transition shrink-0"
                >
                  {exporting ? "Exporting Vault..." : "Export Full JSON Backup 📦"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
