"use client";

import { format, parseISO } from "date-fns";
import type { Lead } from "@/lib/types";

interface LeadRowProps {
  lead: Lead;
  isSelected: boolean;
  onClick: () => void;
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
  proposal_sent: "Proposal",
  won: "Won",
  lost: "Lost",
  churned: "Churned",
};

export default function LeadRow({ lead, isSelected, onClick }: LeadRowProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full border-b border-border/50 text-left transition-colors last:border-0 hover:bg-background ${
        isSelected ? "bg-background" : ""
      }`}
    >
      {/* Desktop */}
      <div className="hidden grid-cols-8 items-center gap-2 px-5 py-3.5 text-sm md:grid">
        <div className="col-span-2">
          <p className="text-text-primary">{lead.name}</p>
          {lead.company && (
            <p className="text-xs text-text-muted">{lead.company}</p>
          )}
        </div>
        <span className="text-text-muted">{lead.source ?? "—"}</span>
        <span className="truncate text-text-muted">{lead.campaign ?? "—"}</span>
        <span
          className="text-text-muted"
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          {format(parseISO(lead.created_at), "MMM d")}
        </span>
        <span
          className="text-right text-text-primary"
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          {lead.value != null ? `$${Number(lead.value).toLocaleString()}` : "—"}
        </span>
        <span
          className="text-right text-text-muted"
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          {lead.cpa != null ? `$${Number(lead.cpa).toFixed(0)}` : "—"}
        </span>
        <div className="text-right">
          <span
            className={`inline-block rounded-full border px-2.5 py-0.5 text-xs ${
              statusStyles[lead.status] ?? ""
            }`}
          >
            {statusLabels[lead.status] ?? lead.status}
          </span>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <div>
          <p className="text-sm text-text-primary">{lead.name}</p>
          <p className="text-xs text-text-muted">
            {lead.source ?? "Unknown"} · {format(parseISO(lead.created_at), "MMM d")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-sm text-text-primary"
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            {lead.value != null ? `$${Number(lead.value).toLocaleString()}` : "—"}
          </span>
          <span
            className={`inline-block rounded-full border px-2 py-0.5 text-[11px] ${
              statusStyles[lead.status] ?? ""
            }`}
          >
            {statusLabels[lead.status] ?? lead.status}
          </span>
        </div>
      </div>
    </button>
  );
}
