"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, DollarSign, Target, Clock, TrendingUp } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { useToast } from "@/components/toast";
import type { Lead, LeadActivity, LeadNote } from "@/lib/types";

interface LeadDetailPanelProps {
  lead: Lead | null;
  activities: LeadActivity[];
  notes: LeadNote[];
  onClose: () => void;
}

const statusStyles: Record<string, string> = {
  new: "border-text-primary/30 text-text-primary bg-text-primary/5",
  contacted: "border-blue-400/30 text-blue-400 bg-blue-400/5",
  qualified: "border-gold/30 text-gold bg-gold/5",
  proposal_sent: "border-purple-400/30 text-purple-400 bg-purple-400/5",
  won: "border-positive/30 text-positive bg-positive/5",
  lost: "border-negative/30 text-negative bg-negative/5",
  churned: "border-negative/20 text-negative/60 bg-negative/5",
};

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal_sent: "Proposal Sent",
  won: "Won",
  lost: "Lost",
  churned: "Churned",
};

const allStatuses: Lead["status"][] = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
  "churned",
];

export default function LeadDetailPanel({
  lead,
  activities,
  notes,
  onClose,
}: LeadDetailPanelProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [editingValue, setEditingValue] = useState(false);
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();

  if (!lead) return null;

  const daysInPipeline = differenceInDays(new Date(), parseISO(lead.created_at));
  const roi =
    lead.value != null && lead.cpa != null && Number(lead.cpa) > 0
      ? ((Number(lead.value) - Number(lead.cpa)) / Number(lead.cpa)) * 100
      : null;

  return (
    <AnimatePresence>
      {lead && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-border bg-background md:w-[480px]"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border p-5">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  {lead.name}
                </h2>
                {lead.company && (
                  <p className="text-sm text-text-muted">{lead.company}</p>
                )}
                <span
                  className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs ${
                    statusStyles[lead.status] ?? ""
                  }`}
                >
                  {statusLabels[lead.status] ?? lead.status}
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-text-muted transition-colors hover:bg-card hover:text-text-primary"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              {/* Quick actions */}
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs text-text-primary transition-colors hover:border-gold"
                  >
                    Change Status
                    <ChevronDown size={12} />
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute left-0 top-full z-10 mt-1 w-44 rounded-lg border border-border bg-card py-1 shadow-lg">
                      {allStatuses.map((s) => (
                        <button
                          key={s}
                          onClick={() => setShowStatusDropdown(false)}
                          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-background ${
                            s === lead.status
                              ? "text-gold"
                              : "text-text-primary"
                          }`}
                        >
                          {statusLabels[s]}
                          {s === lead.status && (
                            <span className="text-[10px] text-text-muted">
                              (current)
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setEditingValue(!editingValue)}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs text-text-primary transition-colors hover:border-gold"
                >
                  Edit Value
                </button>
              </div>

              {editingValue && (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
                  <span className="text-sm text-text-muted">$</span>
                  <input
                    type="number"
                    defaultValue={lead.value != null ? Number(lead.value) : ""}
                    placeholder="Enter value"
                    className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  />
                  <button
                    onClick={() => setEditingValue(false)}
                    className="rounded-md bg-gold px-3 py-1 text-xs font-medium text-background"
                  >
                    Save
                  </button>
                </div>
              )}

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 text-text-muted">
                    <DollarSign size={14} />
                    <span className="text-xs">Cost to Acquire</span>
                  </div>
                  <p
                    className="mt-1 text-lg font-semibold text-text-primary"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  >
                    {lead.cpa != null ? `$${Number(lead.cpa).toFixed(0)}` : "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 text-text-muted">
                    <Target size={14} />
                    <span className="text-xs">Potential Value</span>
                  </div>
                  <p
                    className="mt-1 text-lg font-semibold text-gold"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  >
                    {lead.value != null
                      ? `$${Number(lead.value).toLocaleString()}`
                      : "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 text-text-muted">
                    <TrendingUp size={14} />
                    <span className="text-xs">ROI if Won</span>
                  </div>
                  <p
                    className="mt-1 text-lg font-semibold text-positive"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  >
                    {roi != null ? `${roi.toFixed(0)}%` : "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 text-text-muted">
                    <Clock size={14} />
                    <span className="text-xs">Days in Pipeline</span>
                  </div>
                  <p
                    className="mt-1 text-lg font-semibold text-text-primary"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  >
                    {daysInPipeline}
                  </p>
                </div>
              </div>

              {/* Contact info */}
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="mb-3 text-xs font-medium text-text-muted">
                  Contact
                </h3>
                <div className="space-y-2 text-sm">
                  {lead.email && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Email</span>
                      <span className="text-text-primary">{lead.email}</span>
                    </div>
                  )}
                  {lead.phone && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Phone</span>
                      <span className="text-text-primary">{lead.phone}</span>
                    </div>
                  )}
                  {lead.source && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Source</span>
                      <span className="text-text-primary">{lead.source}</span>
                    </div>
                  )}
                  {lead.campaign && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Campaign</span>
                      <span className="truncate pl-4 text-text-primary">
                        {lead.campaign}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-text-primary">
                  Timeline
                </h3>
                {activities.length === 0 ? (
                  <p className="text-sm text-text-muted">No activity yet.</p>
                ) : (
                  <div className="relative space-y-0 pl-4">
                    <div className="absolute bottom-2 left-[7px] top-2 w-px bg-border" />
                    {activities.map((act) => (
                      <div key={act.id} className="relative pb-4">
                        <div className="absolute -left-4 top-1.5 h-2 w-2 rounded-full border border-gold bg-background" />
                        <div className="pl-3">
                          <p className="text-sm text-text-primary">
                            {act.action}
                          </p>
                          {act.details && (
                            <p className="mt-0.5 text-xs text-text-muted">
                              {act.details}
                            </p>
                          )}
                          <p
                            className="mt-0.5 text-[11px] text-text-muted"
                            style={{ fontFeatureSettings: '"tnum"' }}
                          >
                            {format(
                              parseISO(act.created_at),
                              "MMM d, yyyy · h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-text-primary">
                  Notes
                </h3>

                {/* Add note */}
                <div className="mb-4">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    rows={3}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-gold"
                  />
                  <button
                    onClick={() => { setNewNote(""); toast("Note added"); }}
                    disabled={!newNote.trim()}
                    className="mt-2 rounded-md bg-gold px-4 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-30"
                  >
                    Add Note
                  </button>
                </div>

                {/* Existing notes */}
                {notes.length === 0 ? (
                  <p className="text-sm text-text-muted">No notes yet.</p>
                ) : (
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="rounded-lg border border-border/50 bg-card p-3"
                      >
                        <p className="text-sm leading-relaxed text-text-primary">
                          {note.note}
                        </p>
                        <p
                          className="mt-1.5 text-[11px] text-text-muted"
                          style={{ fontFeatureSettings: '"tnum"' }}
                        >
                          {format(
                            parseISO(note.created_at),
                            "MMM d, yyyy · h:mm a"
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
