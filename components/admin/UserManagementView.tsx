"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { UserAdminSummary, AdminRole } from "@/lib/admin/types";
import { sound } from "@/lib/audio/sound-engine";

export default function UserManagementView() {
  const [users, setUsers] = useState<UserAdminSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedUserForRole, setSelectedUserForRole] = useState<UserAdminSummary | null>(null);
  const [selectedUserForSuspend, setSelectedUserForSuspend] = useState<UserAdminSummary | null>(null);
  const [newRoleSelection, setNewRoleSelection] = useState<AdminRole>("USER" as any);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/admin/users?query=${encodeURIComponent(searchQuery)}&role=${encodeURIComponent(roleFilter)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setUsers(json.data);
      }
    } catch {}
    setLoading(false);
  }, [searchQuery, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdateRole = async () => {
    if (!selectedUserForRole) return;
    sound.playLock();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_ROLE",
          userId: selectedUserForRole.id,
          role: newRoleSelection,
        }),
      });
      if (res.ok) {
        sound.playVictory();
        setActionSuccess(`Role elevated for ${selectedUserForRole.fullName}`);
        setSelectedUserForRole(null);
        fetchUsers();
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch {}
  };

  const handleToggleSuspend = async () => {
    if (!selectedUserForSuspend) return;
    sound.playWrong();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "TOGGLE_SUSPEND",
          userId: selectedUserForSuspend.id,
        }),
      });
      if (res.ok) {
        setActionSuccess(`Status updated for ${selectedUserForSuspend.fullName}`);
        setSelectedUserForSuspend(null);
        fetchUsers();
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-[#090909] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="font-mono text-[10px] font-black tracking-widest text-[#F4C95D] uppercase">
            CADET REGISTRY & PERMISSIONS
          </span>
          <h2 className="mt-1 font-mono text-2xl font-black text-white uppercase">
            USER GOVERNANCE ({users.length} REGISTERED)
          </h2>
          <p className="mt-1 text-xs text-[#8C8C8C]">
            Monitor study metrics, elevate administrative roles, and inspect diagnostic performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cadet or email..."
            className="rounded-2xl border border-white/15 bg-black/60 px-4 py-2 font-mono text-xs text-white focus:border-[#D8A63A] focus:outline-none"
          />

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-2xl border border-white/15 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-[#D8A63A] focus:outline-none cursor-pointer"
          >
            <option value="ALL">ALL ROLES</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="ADMIN">ADMIN</option>
            <option value="CONTENT_ADMIN">CONTENT_ADMIN</option>
            <option value="USER">CADET / USER</option>
          </select>
        </div>
      </div>

      {actionSuccess && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 font-mono text-xs text-emerald-400 animate-fadeIn">
          ✓ {actionSuccess}
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-white/10 bg-white/[0.02] text-[#8C8C8C]">
              <tr>
                <th className="p-4">CADET / IDENTITY</th>
                <th className="p-4">ROLE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4">STUDY HOURS</th>
                <th className="p-4">PYQS SOLVED</th>
                <th className="p-4">ACCURACY</th>
                <th className="p-4 text-right">GOVERNANCE ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#8C8C8C]">
                    LOADING CADET MATRIX...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#8C8C8C]">
                    NO CADETS MATCHING QUERY
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <strong className="text-white text-sm">{user.fullName}</strong>
                        <span className="text-[10px] text-[#8C8C8C]">{user.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase ${
                          user.role === "SUPER_ADMIN"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : user.role === "CONTENT_ADMIN"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                            : "bg-white/10 text-[#8C8C8C]"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-black ${
                          user.accountStatus === "ACTIVE"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        ● {user.accountStatus}
                      </span>
                    </td>
                    <td className="p-4 text-white font-bold">{user.totalStudyHours}h</td>
                    <td className="p-4 text-white font-bold">{user.pyqsSolved}</td>
                    <td className="p-4 font-bold text-[#F4C95D]">{user.pyqAccuracy}%</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition"
                        >
                          PROFILE ↗
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedUserForRole(user);
                            setNewRoleSelection(user.role as any);
                          }}
                          className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-[#F4C95D] hover:bg-[#D8A63A]/10 transition"
                        >
                          ROLE
                        </button>
                        <button
                          onClick={() => setSelectedUserForSuspend(user)}
                          className={`rounded-xl border px-2.5 py-1 text-[10px] font-bold transition ${
                            user.accountStatus === "ACTIVE"
                              ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                              : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                        >
                          {user.accountStatus === "ACTIVE" ? "SUSPEND" : "RESTORE"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Elevation Modal */}
      {selectedUserForRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="flex w-full max-w-md flex-col rounded-3xl border border-white/20 bg-[#0a0a0a] p-6 text-white">
            <h3 className="font-mono text-sm font-black uppercase text-[#F4C95D]">
              ASSIGN SYSTEM ROLE
            </h3>
            <p className="mt-1 text-xs text-[#8C8C8C]">
              Update role for <strong>{selectedUserForRole.fullName}</strong>. Every role change is logged to the immutable audit trail.
            </p>

            <div className="mt-4 space-y-2 font-mono text-xs">
              {(["SUPER_ADMIN", "ADMIN", "CONTENT_ADMIN", "MODERATOR", "ANALYST", "USER"] as const).map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${
                    newRoleSelection === r
                      ? "border-[#D8A63A] bg-[#D8A63A]/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-[#8C8C8C]"
                  }`}
                >
                  <span>{r}</span>
                  <input
                    type="radio"
                    name="roleSelect"
                    checked={newRoleSelection === r}
                    onChange={() => setNewRoleSelection(r as any)}
                    className="accent-[#D8A63A]"
                  />
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2 font-mono text-xs">
              <button
                onClick={() => setSelectedUserForRole(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[#8C8C8C] hover:text-white"
              >
                CANCEL
              </button>
              <button
                onClick={handleUpdateRole}
                className="rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-5 py-2 font-bold text-black hover:bg-[#F4C95D]"
              >
                CONFIRM ROLE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
      {selectedUserForSuspend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="flex w-full max-w-md flex-col rounded-3xl border border-red-500/40 bg-[#0a0a0a] p-6 text-white">
            <h3 className="font-mono text-sm font-black uppercase text-red-400">
              {selectedUserForSuspend.accountStatus === "ACTIVE" ? "SUSPEND USER ACCESS?" : "RESTORE USER ACCESS?"}
            </h3>
            <p className="mt-2 text-xs text-[#8C8C8C] leading-relaxed">
              Target: <strong>{selectedUserForSuspend.fullName}</strong> ({selectedUserForSuspend.email}).
              {selectedUserForSuspend.accountStatus === "ACTIVE"
                ? " Suspending this user will immediately revoke login sessions and API token capabilities."
                : " Restoring will reactivate full platform access."}
            </p>

            <div className="mt-6 flex justify-end gap-2 font-mono text-xs">
              <button
                onClick={() => setSelectedUserForSuspend(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[#8C8C8C] hover:text-white"
              >
                CANCEL
              </button>
              <button
                onClick={handleToggleSuspend}
                className={`rounded-xl px-5 py-2 font-bold transition ${
                  selectedUserForSuspend.accountStatus === "ACTIVE"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-emerald-500 text-black hover:bg-emerald-400"
                }`}
              >
                {selectedUserForSuspend.accountStatus === "ACTIVE" ? "CONFIRM SUSPENSION" : "RESTORE ACCESS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
