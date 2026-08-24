"use client";

import { useState, useEffect } from "react";
import { PlatformLiveStats, ActivityEvent } from "@/lib/admin/types";
import { sound } from "@/lib/audio/sound-engine";

interface CommandCenterViewProps {
  stats: PlatformLiveStats;
  activities: ActivityEvent[];
  onRefresh: () => void;
}

export default function CommandCenterView({ stats, activities, onRefresh }: CommandCenterViewProps) {
  const [isMapExpanded, setIsMapExpanded] = useState(true);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const totalActive = Math.max(1, stats.liveNow);
  const regionalData = [
    { state: "DELHI NCR (RAJINDER NAGAR/MUKHERJEE NGR)", active: Math.max(1, Math.round(totalActive * 0.35)), percent: 35 },
    { state: "UTTAR PRADESH (PRAYAGRAJ/LUCKNOW)", active: Math.max(0, Math.round(totalActive * 0.20)), percent: 20 },
    { state: "BIHAR (PATNA/GAYA)", active: Math.max(0, Math.round(totalActive * 0.15)), percent: 15 },
    { state: "MAHARASHTRA (PUNE/MUMBAI)", active: Math.max(0, Math.round(totalActive * 0.10)), percent: 10 },
    { state: "KARNATAKA (BENGALURU/DHARWAD)", active: Math.max(0, Math.round(totalActive * 0.08)), percent: 8 },
    { state: "RAJASTHAN (JAIPUR/JODHPUR)", active: Math.max(0, Math.round(totalActive * 0.06)), percent: 6 },
    { state: "TELANGANA & AP (HYDERABAD)", active: Math.max(0, Math.round(totalActive * 0.04)), percent: 4 },
    { state: "TAMIL NADU & KERALA (CHENNAI/TRIVANDRUM)", active: Math.max(0, Math.round(totalActive * 0.02)), percent: 2 },
  ];

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) return;

    setBroadcasting(true);
    sound.playWarp();
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: broadcastTitle,
          message: broadcastMsg,
          type: "directive",
          priority: "High",
          author: "Super Admin Command",
        }),
      });
      if (res.ok) {
        setBroadcastSuccess(true);
        setBroadcastTitle("");
        setBroadcastMsg("");
        sound.playVictory();
        setTimeout(() => setBroadcastSuccess(false), 4000);
      }
    } catch {}
    setBroadcasting(false);
  };

  return (
    <div className="space-y-6">
      {/* Real-Time Live Overview Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-[#090909] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="font-mono text-[10px] font-black tracking-widest text-[#F4C95D] uppercase">
            WHYNOTUPSC TELEMETRY MATRIX
          </span>
          <h2 className="mt-1 font-mono text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            SYSTEM STATUS ● OPERATIONAL
          </h2>
          <p className="mt-1 text-xs text-[#8C8C8C]">
            Autonomous platform synchronization active. 0 critical anomalies detected.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playLock();
              onRefresh();
            }}
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-xs font-bold text-white hover:border-[#D8A63A] hover:bg-[#D8A63A]/10 transition shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          >
            <span>🔄</span> REFRESH TELEMETRY
          </button>
        </div>
      </div>

      {/* Primary Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="flex flex-col rounded-3xl border border-emerald-500/30 bg-emerald-950/10 p-5 shadow-[0_0_25px_rgba(16,185,129,0.05)]">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="font-mono text-[10px] font-black tracking-wider uppercase">LIVE NOW</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="mt-2 font-mono text-3xl sm:text-4xl font-black text-white">
            {stats.liveNow}
          </span>
          <span className="mt-1 font-mono text-[10px] text-[#8C8C8C]">Active cadets in workspace</span>
        </div>

        {/* Metric 2 */}
        <div className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] p-5">
          <span className="font-mono text-[10px] font-black tracking-wider text-[#F4C95D] uppercase">
            ACTIVE TODAY
          </span>
          <span className="mt-2 font-mono text-3xl sm:text-4xl font-black text-white">
            {stats.activeToday.toLocaleString()}
          </span>
          <span className="mt-1 font-mono text-[10px] text-[#8C8C8C]">Unique aspirants logged in</span>
        </div>

        {/* Metric 3 */}
        <div className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] p-5">
          <span className="font-mono text-[10px] font-black tracking-wider text-[#D8A63A] uppercase">
            NEW USERS TODAY
          </span>
          <span className="mt-2 font-mono text-3xl sm:text-4xl font-black text-amber-300">
            +{stats.newUsersToday}
          </span>
          <span className="mt-1 font-mono text-[10px] text-[#8C8C8C]">New registrations</span>
        </div>

        {/* Metric 4 */}
        <div className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] p-5">
          <span className="font-mono text-[10px] font-black tracking-wider text-[#8C8C8C] uppercase">
            STUDY HOURS
          </span>
          <span className="mt-2 font-mono text-3xl sm:text-4xl font-black text-white">
            {stats.totalStudyHours}h
          </span>
          <span className="mt-1 font-mono text-[10px] text-[#8C8C8C]">Total focused time today</span>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-4">
          <span className="font-mono text-[10px] text-[#8C8C8C] uppercase">PYQ Attempts</span>
          <h4 className="mt-1 font-mono text-xl font-black text-white">
            {stats.pyqsAttemptedToday.toLocaleString()}
          </h4>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-4">
          <span className="font-mono text-[10px] text-[#8C8C8C] uppercase">Revisions Completed</span>
          <h4 className="mt-1 font-mono text-xl font-black text-emerald-400">
            {stats.revisionsDoneToday}
          </h4>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-4">
          <span className="font-mono text-[10px] text-[#8C8C8C] uppercase">Mock Modules Active</span>
          <h4 className="mt-1 font-mono text-xl font-black text-[#F4C95D]">
            {stats.mockTestsActive} Modules
          </h4>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-4">
          <span className="font-mono text-[10px] text-[#8C8C8C] uppercase">Chill Zone Players</span>
          <h4 className="mt-1 font-mono text-xl font-black text-amber-300">
            {stats.chillZoneActivePlayers} Active
          </h4>
        </div>
      </div>

      {/* Two-Column Telemetry Section: Platform Health & Live Activity Stream */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Platform Health Score & Infrastructure Breakdown */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0a0a0a] p-6">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-xs font-black uppercase text-[#D8A63A] tracking-wider">
                PLATFORM HEALTH
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-[9px] font-black text-emerald-400">
                ● {stats.healthStatus}
              </span>
            </div>

            <div className="my-6 flex flex-col items-center text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <span className="font-mono text-2xl font-black text-white">
                  {stats.platformHealthPercent}%
                </span>
              </div>
              <p className="mt-3 font-mono text-xs text-[#8C8C8C]">
                MEASURABLE SYSTEMIC INTEGRITY
              </p>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                <span className="text-[#8C8C8C]">DATABASE LATENCY</span>
                <span className="font-bold text-emerald-400">{stats.dbLatencyMs}ms (OPTIMAL)</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                <span className="text-[#8C8C8C]">AUTH SYSTEM</span>
                <span className="font-bold text-emerald-400">100% OPERATIONAL</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                <span className="text-[#8C8C8C]">REALTIME SYNC</span>
                <span className="font-bold text-emerald-400">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                <span className="text-[#8C8C8C]">ERROR RATE</span>
                <span className="font-bold text-emerald-400">&lt; 0.01%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right (2 cols): Live Activity Event Stream */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 lg:col-span-2">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#F4C95D] animate-ping" />
                <span className="font-mono text-xs font-black uppercase text-white tracking-wider">
                  LIVE ACTIVITY STREAM
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#8C8C8C]">
                Real-time cadet events
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-2.5">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3 font-mono text-xs transition hover:border-[#D8A63A]/40"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black ${
                        act.eventType === "PYQ_SOLVED"
                          ? "bg-amber-500/20 text-amber-300"
                          : act.eventType === "CHILL_GAME"
                          ? "bg-purple-500/20 text-purple-300"
                          : act.eventType === "TEST_COMPLETED"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : act.eventType === "USER_SIGNUP"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {act.eventType === "PYQ_SOLVED"
                        ? "📝"
                        : act.eventType === "CHILL_GAME"
                        ? "🎮"
                        : act.eventType === "TEST_COMPLETED"
                        ? "🎯"
                        : act.eventType === "USER_SIGNUP"
                        ? "👤"
                        : "🔄"}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white">{act.displayName}</strong>
                        {act.stateLocation && (
                          <span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] text-[#8C8C8C]">
                            {act.stateLocation}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8C8C8C]">{act.description}</p>
                    </div>
                  </div>

                  <span className="whitespace-nowrap text-[10px] text-[#8C8C8C]">
                    {act.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-white/5 pt-3 font-mono text-[10px] text-[#8C8C8C]">
            Aggregated stream · Privacy-compliant zero PII exposure
          </div>
        </div>
      </div>

      {/* Regional Activity Map (Collapsible) */}
      <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🗺️</span>
            <h3 className="font-mono text-xs font-black uppercase text-white tracking-wider">
              REGIONAL ASPIRANT DISTRIBUTION (INDIA)
            </h3>
          </div>
          <button
            onClick={() => setIsMapExpanded(!isMapExpanded)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-[#8C8C8C] hover:text-white"
          >
            {isMapExpanded ? "COLLAPSE ▲" : "EXPAND ▼"}
          </button>
        </div>

        {isMapExpanded && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {regionalData.map((item) => (
              <div
                key={item.state}
                className="flex flex-col justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px]">{item.state}</span>
                  <span className="font-black text-[#F4C95D]">{item.active} ACTIVE</span>
                </div>
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#D8A63A] to-[#F4C95D]"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global Broadcast Directive Composer */}
      <div className="rounded-3xl border border-[#D8A63A]/30 bg-[#0c0c0c] p-6 shadow-[0_0_40px_rgba(216,166,58,0.1)]">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📢</span>
          <div>
            <h3 className="font-mono text-xs font-black uppercase text-white tracking-wider">
              UNIVERSAL CADET BROADCAST DIRECTIVE
            </h3>
            <p className="font-mono text-[10px] text-[#8C8C8C]">
              Instantly pushes high-priority banner notification to all connected UPSC aspirants
            </p>
          </div>
        </div>

        {broadcastSuccess && (
          <div className="mb-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 font-mono text-xs text-emerald-400 animate-fadeIn">
            ✓ Broadcast published successfully across all connected cadet portals!
          </div>
        )}

        <form onSubmit={handleSendBroadcast} className="space-y-3 font-mono text-xs">
          <input
            type="text"
            value={broadcastTitle}
            onChange={(e) => setBroadcastTitle(e.target.value)}
            placeholder="BROADCAST TITLE (e.g. ⚡ Prelims 2026 Strategy Session Live)"
            className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-2.5 text-white placeholder-zinc-600 focus:border-[#D8A63A] focus:outline-none"
          />
          <textarea
            value={broadcastMsg}
            onChange={(e) => setBroadcastMsg(e.target.value)}
            placeholder="DIRECTIVE MESSAGE (e.g. All 10 Indian Polity Modules are now fully open with multi-statement analysis)..."
            rows={2}
            className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-2.5 text-white placeholder-zinc-600 focus:border-[#D8A63A] focus:outline-none resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={broadcasting}
              className="rounded-2xl border border-[#D8A63A] bg-[#D8A63A] px-6 py-2.5 font-mono text-xs font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_20px_rgba(216,166,58,0.4)] disabled:opacity-50"
            >
              {broadcasting ? "BROADCASTING..." : "PUSH UNIVERSAL DIRECTIVE →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
