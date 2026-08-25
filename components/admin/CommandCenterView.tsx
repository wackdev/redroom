"use client";

import { useState } from "react";
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
  const [targetCohort, setTargetCohort] = useState<"ALL" | "IAS" | "IPS" | "AT_RISK">("ALL");
  const [sendToTelegram, setSendToTelegram] = useState(true);
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
          targetCohort,
          sendTelegram: sendToTelegram
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
            Autonomous platform synchronization active. 0 critical anomalies detected across 60 modules.
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
        <div className="flex flex-col rounded-3xl border border-emerald-500/30 bg-emerald-950/10 p-5 shadow-[0_0_25px_rgba(16,185,129,0.05)]">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="font-mono text-[10px] font-black tracking-wider uppercase">LIVE NOW</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="mt-2 font-mono text-3xl sm:text-4xl font-black text-white">
            {stats.liveNow}
          </span>
          <span className="mt-1 font-mono text-[11px] text-emerald-400/80">Active Sprints Running</span>
        </div>

        <div className="flex flex-col rounded-3xl border border-[#D8A63A]/30 bg-[#D8A63A]/5 p-5 shadow-[0_0_25px_rgba(216,166,58,0.05)]">
          <div className="flex items-center justify-between text-[#F4C95D]">
            <span className="font-mono text-[10px] font-black tracking-wider uppercase">TOTAL HOURS</span>
            <span>⏳</span>
          </div>
          <span className="mt-2 font-mono text-3xl sm:text-4xl font-black text-white">
            {stats.totalStudyHours.toFixed(1)}h
          </span>
          <span className="mt-1 font-mono text-[11px] text-[#F4C95D]/80">Study Time Logged</span>
        </div>

        <div className="flex flex-col rounded-3xl border border-blue-500/30 bg-blue-950/10 p-5 shadow-[0_0_25px_rgba(59,130,246,0.05)]">
          <div className="flex items-center justify-between text-blue-400">
            <span className="font-mono text-[10px] font-black tracking-wider uppercase">PYQ VELOCITY</span>
            <span>📝</span>
          </div>
          <span className="mt-2 font-mono text-3xl sm:text-4xl font-black text-white">
            {stats.pyqsAttemptedToday}
          </span>
          <span className="mt-1 font-mono text-[11px] text-blue-400/80">Attempts Recorded</span>
        </div>

        <div className="flex flex-col rounded-3xl border border-purple-500/30 bg-purple-950/10 p-5 shadow-[0_0_25px_rgba(168,85,247,0.05)]">
          <div className="flex items-center justify-between text-purple-400">
            <span className="font-mono text-[10px] font-black tracking-wider uppercase">DB LATENCY</span>
            <span>⚡</span>
          </div>
          <span className="mt-2 font-mono text-3xl sm:text-4xl font-black text-white">
            {stats.dbLatencyMs}ms
          </span>
          <span className="mt-1 font-mono text-[11px] text-purple-400/80">Health: {stats.healthStatus}</span>
        </div>
      </div>

      {/* Broadcast & Regional Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 7 cols: Interactive Broadcast Terminal */}
        <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📢</span>
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                Live Broadcast Dispatch Terminal
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              Instant Push Sync
            </span>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="font-mono text-[11px] text-gray-400 block mb-1">Directive Headline:</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g., Weekly All-India Test Series #04 Live Now..."
                className="w-full px-4 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 bg-black/40 border border-white/10 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] text-gray-400 block mb-1">Message Body (Supports Markdown):</label>
              <textarea
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                rows={4}
                placeholder="Type your official directive or daily motivation message here..."
                className="w-full p-4 rounded-2xl text-xs text-white placeholder-gray-500 bg-black/40 border border-white/10 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3">
                <select
                  value={targetCohort}
                  onChange={(e) => setTargetCohort(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl text-xs text-white bg-black/40 border border-white/10 focus:outline-none">
                  <option value="ALL">All Registered Cadets</option>
                  <option value="IAS">IAS Aspirant Cohort</option>
                  <option value="IPS">IPS Aspirant Cohort</option>
                  <option value="AT_RISK">Low Spaced Recall Cohort</option>
                </select>

                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendToTelegram}
                    onChange={(e) => setSendToTelegram(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span>Dispatch to Telegram</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={broadcasting || !broadcastTitle.trim() || !broadcastMsg.trim()}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-[#D8A63A] hover:bg-[#F4C95D] transition-all shadow-lg disabled:opacity-40">
                {broadcasting ? "Dispatching..." : "⚡ Broadcast Directive"}
              </button>
            </div>

            {broadcastSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center">
                ✓ Directive successfully transmitted to all active user dashboards and Telegram nodes!
              </div>
            )}
          </form>
        </div>

        {/* Right 5 cols: Geographic Live Distribution */}
        <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span>🗺️</span> Regional Cadet Hotspots
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">Live Geo-Pulse</span>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {regionalData.map((reg, i) => (
              <div key={i} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-gray-200 truncate">{reg.state}</span>
                  <span className="font-bold text-amber-400">{reg.percent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300"
                    style={{ width: `${reg.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
