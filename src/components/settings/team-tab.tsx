"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, X, Trash2 } from "lucide-react";
import type { User } from "@/lib/types";

interface TeamTabProps {
  users: User[];
  currentUserEmail: string;
}

const roleBadge: Record<string, string> = {
  owner: "border-gold/30 text-gold bg-gold/5",
  admin: "border-blue-400/30 text-blue-400 bg-blue-400/5",
  member: "border-positive/30 text-positive bg-positive/5",
  viewer: "border-text-muted/30 text-text-muted bg-text-muted/5",
};

// Sample team members to show alongside any auth-seeded users
const sampleMembers: User[] = [
  {
    id: "sample-1",
    company_id: null,
    email: "mark@morrisonlaw.example.com",
    role: "owner",
    full_name: "Mark Morrison",
    created_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "sample-2",
    company_id: null,
    email: "lisa@morrisonlaw.example.com",
    role: "admin",
    full_name: "Lisa Morrison",
    created_at: "2024-06-15T00:00:00Z",
  },
  {
    id: "sample-3",
    company_id: null,
    email: "james@morrisonlaw.example.com",
    role: "member",
    full_name: "James Parker",
    created_at: "2024-08-01T00:00:00Z",
  },
  {
    id: "sample-4",
    company_id: null,
    email: "anna@morrisonlaw.example.com",
    role: "viewer",
    full_name: "Anna Chen",
    created_at: "2024-09-01T00:00:00Z",
  },
];

export default function TeamTab({ users, currentUserEmail }: TeamTabProps) {
  // Merge real users with samples, avoiding duplicates by email
  const realEmails = new Set(users.map((u) => u.email));
  const merged = [
    ...users,
    ...sampleMembers.filter((s) => !realEmails.has(s.email)),
  ];

  const [members, setMembers] = useState(merged);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<User["role"]>("member");

  const currentMember = members.find((m) => m.email === currentUserEmail);
  const isOwner = !currentMember || currentMember.role === "owner";
  const maxMembers = 10;

  function handleInvite() {
    if (!inviteEmail.trim() || members.length >= maxMembers) return;
    const newMember: User = {
      id: `invite-${Date.now()}`,
      company_id: null,
      email: inviteEmail.trim(),
      role: inviteRole,
      full_name: inviteEmail.split("@")[0] ?? inviteEmail,
      created_at: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail("");
    setShowInvite(false);
  }

  function handleRemove(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function handleRoleChange(id: string, role: User["role"]) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role } : m))
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">
          {members.length} / {maxMembers} members
        </p>
        <button
          onClick={() => setShowInvite(true)}
          disabled={members.length >= maxMembers}
          className="flex items-center gap-2 rounded-lg bg-gold px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <UserPlus size={14} />
          Invite Member
        </button>
      </div>

      {/* Members list */}
      <div className="rounded-xl border border-border bg-card">
        {members.map((member, i) => (
          <div
            key={member.id}
            className={`flex items-center gap-4 px-5 py-3 ${
              i !== members.length - 1 ? "border-b border-border/50" : ""
            }`}
          >
            {/* Avatar placeholder */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-background text-xs font-medium text-text-muted">
              {(member.full_name ?? member.email).charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">
                {member.full_name ?? member.email}
              </p>
              <p className="truncate text-xs text-text-muted">{member.email}</p>
            </div>

            {/* Role badge / dropdown */}
            {isOwner && member.role !== "owner" ? (
              <select
                value={member.role}
                onChange={(e) =>
                  handleRoleChange(member.id, e.target.value as User["role"])
                }
                className="rounded-md border border-border bg-background px-2 py-1 text-xs text-text-primary outline-none"
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
            ) : (
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] capitalize ${
                  roleBadge[member.role] ?? roleBadge.member
                }`}
              >
                {member.role}
              </span>
            )}

            {/* Remove (only non-owners) */}
            {isOwner && member.role !== "owner" && (
              <button
                onClick={() => handleRemove(member.id)}
                className="rounded-md p-1 text-text-muted transition-colors hover:bg-background hover:text-negative"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Invite modal */}
      <AnimatePresence>
        {showInvite && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setShowInvite(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-text-primary">
                  Invite Team Member
                </h3>
                <button
                  onClick={() => setShowInvite(false)}
                  className="rounded-md p-1 text-text-muted transition-colors hover:text-text-primary"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-text-muted">
                    Email
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-gold placeholder:text-text-muted"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) =>
                      setInviteRole(e.target.value as User["role"])
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-gold"
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim()}
                  className="w-full rounded-lg bg-gold py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  Send Invite
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
