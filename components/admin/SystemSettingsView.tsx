"use client";

import { useState, useEffect } from "react";
import { FeatureFlagItem, MaintenanceConfig, AdminAuditRecord } from "@/lib/admin/types";
import { sound } from "@/lib/audio/sound-engine";

export default function SystemSettingsView() {
  const [flags, setFlags] = useState<FeatureFlagItem[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceConfig>({
    isActive: false,
    title: "System Upgrade in Progress",
    message: "We are calibrating the WHYNOTUPSC neural engines. Normal access resumes shortly.",
    allowAdminBypass: true,
    updatedAt: new Date().toISOString(),
  });
  const [auditLogs, setAuditLogs] = useState<AdminAuditRecord[]>([]);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  const loadSystemConfig = async () => {
    try {
      const res = await fetch("/api/admin/system");
      const json = await res.json();
      if (json.success && json.data) {
        setFlags(json.data.flags || []);
        if (json.data.maintenance) setMaintenance(json.data.maintenance);
        setAuditLogs(json.data.auditLogs || []);
      }
    } catch {}
  };

  useEffect(() => {
    loadSystemConfig();
  }, []);

  const handleToggleFlag = async (flagId: string, currentVal: boolean) => {
    sound.playLock();
    try {
      const res = await fetch("/api/admin/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "TOGGLE_FLAG",
          flagId,
          isEnabled: !currentVal,
        }),
      });
      if (res.ok) {
        setFlags((prev) =>
          prev.map((f) => (f.id === flagId ? { ...f, isEnabled: !currentVal } : f))
        );
        sound.playVictory();
        loadSystemConfig();
      }
    } catch {}
  };

  const handleToggleMaintenance = async () => {
    sound.playWarp();
    const nextState = !maintenance.isActive;
    try {
      const res = await fetch("/api/admin/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_MAINTENANCE",
          maintenanceConfig: { ...maintenance, isActive: nextState },
        }),
      });
      if (res.ok) {
        setMaintenance((prev) => ({ ...prev, isActive: nextState }));
        setUpdateMsg(
          nextState
            ? "⚠️ GLOBAL MAINTENANCE MODE ACTIVATED. Normal users redirected to maintenance splash."
            : "✓ Platform restored to normal operational state."
        );
        loadSystemConfig();
        setTimeout(() => setUpdateMsg(null), 5000);
      }
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-[#090909] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="font-mono text-[10px] font-black tracking-widest text-[#F4C95D] uppercase">
            INFRASTRUCTURE & SYSTEM POLICIES
          </span>
          <h2 className="mt-1 font-mono text-2xl font-black text-white uppercase">
            SYSTEM & GOVERNANCE SETTINGS
          </h2>
          <p className="mt-1 text-xs text-[#8C8C8C]">
            Manage global feature flags, trigger maintenance lockdowns, and inspect immutable audit logs.
          </p>
        </div>
      </div>

      {updateMsg && (
        <div
          className={`rounded-2xl border p-3 font-mono text-xs animate-fadeIn ${
            maintenance.isActive
              ? "border-red-500/40 bg-red-950/20 text-red-300"
              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
          }`}
        >
          {updateMsg}
        </div>
      )}

      {/* Feature Flags Manager */}
      <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 font-mono text-xs">
        <h3 className="font-black text-[#D8A63A] uppercase tracking-wider mb-4">
          FEATURE MANAGEMENT FLAGS
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-white/15"
            >
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-white text-xs">{flag.name}</strong>
                  {flag.isBeta && (
                    <span className="rounded bg-purple-500/20 px-1.5 py-0.2 text-[9px] font-black text-purple-300">
                      BETA
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#8C8C8C] mt-0.5">{flag.description}</p>
                <span className="text-[9px] text-[#F4C95D]">Target: {flag.targetAudience}</span>
              </div>

              <button
                onClick={() => handleToggleFlag(flag.id, flag.isEnabled)}
                className={`rounded-xl px-3.5 py-1.5 font-bold transition ${
                  flag.isEnabled
                    ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : "border border-white/10 bg-white/5 text-[#8C8C8C]"
                }`}
              >
                {flag.isEnabled ? "ENABLED" : "DISABLED"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Global Maintenance Mode Controller */}
      <div className="rounded-3xl border border-red-500/30 bg-red-950/10 p-6 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-lg">🔒</span>
            <h3 className="font-black text-red-300 uppercase tracking-wider">
              PLATFORM MAINTENANCE LOCKDOWN
            </h3>
          </div>
          <button
            onClick={handleToggleMaintenance}
            className={`rounded-2xl px-5 py-2 font-bold transition ${
              maintenance.isActive
                ? "bg-emerald-500 text-black hover:bg-emerald-400"
                : "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            }`}
          >
            {maintenance.isActive ? "DEACTIVATE MAINTENANCE" : "ACTIVATE LOCKDOWN"}
          </button>
        </div>

        <p className="text-[11px] text-[#8C8C8C]">
          When active, all normal user routes display a clean maintenance notice. Authorized Super Admins and Admins bypass the lock automatically.
        </p>

        <div className="rounded-2xl border border-white/10 bg-black/60 p-4 space-y-2">
          <span className="text-[10px] text-[#F4C95D] uppercase font-bold">Current Splash Message Preview:</span>
          <h4 className="text-white font-bold">{maintenance.title}</h4>
          <p className="text-[#8C8C8C] text-[11px]">{maintenance.message}</p>
        </div>
      </div>

      {/* Administrative Audit Logs Stream */}
      <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-black text-[#D8A63A] uppercase tracking-wider">
            ADMINISTRATIVE AUDIT TRAIL ({auditLogs.length} LOGGED)
          </h3>
          <span className="text-[10px] text-[#8C8C8C]">Immutable Ledger</span>
        </div>

        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-3 font-mono text-[11px]"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[#F4C95D] font-bold">[{log.adminRole}]</span>
                  <strong className="text-white">{log.action}</strong>
                  <span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] text-[#8C8C8C]">
                    {log.targetType}
                  </span>
                </div>
                <p className="text-[10px] text-[#8C8C8C] mt-0.5">{log.adminEmail}</p>
              </div>
              <span className="text-[10px] text-[#8C8C8C]">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
