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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState<UserAdminSummary | null>(null);
  const [selectedUserForSuspend, setSelectedUserForSuspend] = useState<UserAdminSummary | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<UserAdminSummary | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form states for creation
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<AdminRole>("ASPIRANT");
  const [newTargetYear, setNewTargetYear] = useState(2026);
  const [newGoalHours, setNewGoalHours] = useState(8);

  // Form states for editing
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<AdminRole>("ASPIRANT");
  const [editTargetYear, setEditTargetYear] = useState(2026);
  const [editGoalHours, setEditGoalHours] = useState(8);

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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    sound.playLock();

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_USER",
          email: newEmail.trim(),
          password: newPassword.trim() || "Password@123",
          fullName: newName.trim(),
          role: newRole,
          targetYear: newTargetYear,
          dailyGoalHours: newGoalHours,
        }),
      });

      const json = await res.json();
      if (json.success) {
        sound.playVictory();
        setActionSuccess(`✓ Cadet account created: ${newEmail}`);
        setShowCreateModal(false);
        setNewEmail("");
        setNewPassword("");
        setNewName("");
        fetchUsers();
        setTimeout(() => setActionSuccess(null), 4000);
      } else {
        sound.playWrong();
        setActionError(json.error?.message || "Failed to create user account.");
      }
    } catch (err: unknown) {
      sound.playWrong();
      setActionError(err instanceof Error ? err.message : "Error creating user");
    }
  };

  const handleOpenEditModal = (user: UserAdminSummary) => {
    setEditUserModal(user);
    setEditEmail(user.email);
    setEditPassword("");
    setEditName(user.fullName);
    setEditRole(user.role);
    setEditTargetYear(2026);
    setEditGoalHours(user.totalStudyHours ? Math.round(user.totalStudyHours / 7) : 8);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUserModal) return;
    setActionError(null);
    sound.playLock();

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_USER",
          userId: editUserModal.id,
          email: editEmail.trim(),
          password: editPassword.trim() || undefined,
          fullName: editName.trim(),
          role: editRole,
          targetYear: editTargetYear,
          dailyGoalHours: editGoalHours,
        }),
      });

      const json = await res.json();
      if (json.success) {
        sound.playVictory();
        setActionSuccess(`✓ Credentials & profile updated for ${editName}`);
        setEditUserModal(null);
        fetchUsers();
        setTimeout(() => setActionSuccess(null), 4000);
      } else {
        sound.playWrong();
        setActionError(json.error?.message || "Failed to update user.");
      }
    } catch (err: unknown) {
      sound.playWrong();
      setActionError(err instanceof Error ? err.message : "Error updating user");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUserForDelete) return;
    sound.playWrong();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE_USER",
          userId: selectedUserForDelete.id,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setActionSuccess(`User ${selectedUserForDelete.fullName} deleted permanently.`);
        setSelectedUserForDelete(null);
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
    <div className="space-y-6 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-[#090909] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="font-mono text-[10px] font-black tracking-widest text-[#F4C95D] uppercase">
            SUPABASE CADET REGISTRY & ACCESS CONTROL
          </span>
          <h2 className="mt-1 font-mono text-2xl font-black text-white uppercase">
            USER GOVERNANCE ({users.length} REAL CADETS)
          </h2>
          <p className="mt-1 text-xs text-[#8C8C8C]">
            Manage Supabase credentials, issue custom passwords, elevate roles, and inspect diagnostic performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Create User Button */}
          <button
            onClick={() => {
              sound.playWarp();
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 rounded-2xl bg-[#D8A63A] px-4 py-2 font-mono text-xs font-bold text-black hover:bg-[#F4C95D] transition shadow"
          >
            <span>➕ Create Cadet Account</span>
          </button>

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
            <option value="ASPIRANT">ASPIRANT</option>
          </select>
        </div>
      </div>

      {actionSuccess && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 font-mono text-xs text-emerald-400 animate-fadeIn">
          {actionSuccess}
        </div>
      )}

      {actionError && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3.5 font-mono text-xs text-red-400 animate-fadeIn">
          ⚠️ {actionError}
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-white/10 bg-white/[0.02] text-[#8C8C8C]">
              <tr>
                <th className="p-4">CADET / EMAIL</th>
                <th className="p-4">ROLE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4">TESTS</th>
                <th className="p-4">PYQS</th>
                <th className="p-4">ACCURACY</th>
                <th className="p-4 text-right">GOVERNANCE & CREDENTIALS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#8C8C8C]">
                    LOADING REAL SUPABASE CADET MATRIX...
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
                    <td className="p-4 text-white font-bold">{user.testsTaken}</td>
                    <td className="p-4 text-white font-bold">{user.pyqsSolved}</td>
                    <td className="p-4 font-bold text-[#F4C95D]">{user.pyqAccuracy}%</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Credentials Button */}
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-2.5 py-1 text-[10px] font-bold text-[#F4C95D] hover:bg-[#D8A63A]/20 transition"
                        >
                          🔑 EDIT / PASS
                        </button>

                        <button
                          onClick={() => setSelectedUserForSuspend(user)}
                          className={`rounded-xl border px-2.5 py-1 text-[10px] font-bold transition ${
                            user.accountStatus === "ACTIVE"
                              ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                              : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                        >
                          {user.accountStatus === "ACTIVE" ? "SUSPEND" : "ACTIVATE"}
                        </button>

                        <button
                          onClick={() => setSelectedUserForDelete(user)}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-400 hover:bg-red-500/20 transition"
                        >
                          🗑️
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

      {/* CREATE CADET MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-[#D8A63A]/40 bg-[#0d0d0d] p-6 shadow-2xl">
            <h3 className="font-mono text-base font-bold text-white uppercase flex items-center gap-2">
              <span>➕</span>
              <span>Create Cadet Account (Custom Credentials)</span>
            </h3>
            <p className="mt-1 text-xs text-[#8C8C8C]">
              Creates a live confirmed user in Supabase Auth with custom login credentials.
            </p>

            <form onSubmit={handleCreateUser} className="mt-5 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[#8C8C8C] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Officer Vikram Singh"
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8C8C8C] mb-1">Email Address (Login)</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="cadet@redroom.upsc"
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8C8C8C] mb-1">Password (Custom Credential)</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="e.g. CadetPass@2026"
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-[#F4C95D] focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#8C8C8C] mb-1">Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as AdminRole)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none cursor-pointer"
                  >
                    <option value="ASPIRANT">ASPIRANT</option>
                    <option value="CONTENT_ADMIN">CONTENT_ADMIN</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8C8C8C] mb-1">Target Year</label>
                  <input
                    type="number"
                    value={newTargetYear}
                    onChange={(e) => setNewTargetYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#8C8C8C] mb-1">Daily Hours</label>
                  <input
                    type="number"
                    value={newGoalHours}
                    onChange={(e) => setNewGoalHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-[#8C8C8C] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#D8A63A] px-5 py-2 font-bold text-black hover:bg-[#F4C95D]"
                >
                  ✓ Create User in Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER & PASSWORD MODAL */}
      {editUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-[#D8A63A]/40 bg-[#0d0d0d] p-6 shadow-2xl">
            <h3 className="font-mono text-base font-bold text-white uppercase flex items-center gap-2">
              <span>🔑</span>
              <span>Edit Profile & Reset Password</span>
            </h3>
            <p className="mt-1 text-xs text-[#8C8C8C]">
              Updating user: <strong className="text-white">{editUserModal.email}</strong>
            </p>

            <form onSubmit={handleUpdateUser} className="mt-5 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[#8C8C8C] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8C8C8C] mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8C8C8C] mb-1">
                  New Password <span className="text-[#8C8C8C]/60">(Leave empty to keep unchanged)</span>
                </label>
                <input
                  type="text"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Enter new custom password..."
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-[#F4C95D] focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C8C8C] mb-1">Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as AdminRole)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none cursor-pointer"
                  >
                    <option value="ASPIRANT">ASPIRANT</option>
                    <option value="CONTENT_ADMIN">CONTENT_ADMIN</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8C8C8C] mb-1">Target Year</label>
                  <input
                    type="number"
                    value={editTargetYear}
                    onChange={(e) => setEditTargetYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-white focus:border-[#D8A63A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditUserModal(null)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-[#8C8C8C] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#D8A63A] px-5 py-2 font-bold text-black hover:bg-[#F4C95D]"
                >
                  ✓ Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {selectedUserForDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-red-500/40 bg-[#0d0d0d] p-6 shadow-2xl text-center">
            <div className="text-3xl mb-2">🗑️</div>
            <h3 className="font-mono text-base font-bold text-white uppercase">
              Delete User Account?
            </h3>
            <p className="mt-2 text-xs text-[#8C8C8C]">
              Are you sure you want to delete <strong className="text-white">{selectedUserForDelete.fullName}</strong> ({selectedUserForDelete.email})? This action removes their profile, outbox, and Supabase credentials permanently.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setSelectedUserForDelete(null)}
                className="rounded-xl border border-white/10 px-4 py-2 font-mono text-xs text-[#8C8C8C] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="rounded-xl bg-red-500 px-5 py-2 font-mono text-xs font-bold text-white hover:bg-red-600"
              >
                Confirm Permanent Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUSPEND CONFIRMATION MODAL */}
      {selectedUserForSuspend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl text-center">
            <h3 className="font-mono text-base font-bold text-white uppercase">
              {selectedUserForSuspend.accountStatus === "ACTIVE" ? "Suspend Cadet Access?" : "Reactivate Cadet Access?"}
            </h3>
            <p className="mt-2 text-xs text-[#8C8C8C]">
              Cadet: <strong className="text-white">{selectedUserForSuspend.fullName}</strong> ({selectedUserForSuspend.email})
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setSelectedUserForSuspend(null)}
                className="rounded-xl border border-white/10 px-4 py-2 font-mono text-xs text-[#8C8C8C] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleSuspend}
                className={`rounded-xl px-5 py-2 font-mono text-xs font-bold ${
                  selectedUserForSuspend.accountStatus === "ACTIVE"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-emerald-500 text-black hover:bg-emerald-400"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
