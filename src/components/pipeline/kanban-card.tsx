"use client";

import { useState } from "react";
import { differenceInDays, parseISO } from "date-fns";
import type { Lead } from "@/lib/types";

interface KanbanCardProps {
  lead: Lead;
  columnKey: string;
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

export default function KanbanCard({ lead, columnKey }: KanbanCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const daysInStage = differenceInDays(new Date(), parseISO(lead.updated_at));

  const isWon = lead.status === "won";
  const isLost = lead.status === "lost";
  const valueColor = isWon
    ? "text-gold"
    : isLost
      ? "text-negative/60"
      : "text-text-primary";

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("text/plain", lead.id);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  }

  function handleDragEnd() {
    setIsDragging(false);
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`cursor-grab rounded-lg border border-border bg-background p-3 transition-all active:cursor-grabbing ${
        isDragging ? "opacity-40 ring-1 ring-gold/30" : "hover:border-border/80"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text-primary">
            {lead.name}
          </p>
          {lead.company && (
            <p className="truncate text-xs text-text-muted">{lead.company}</p>
          )}
        </div>
        {/* Show badge in the won/lost column to distinguish */}
        {columnKey === "won_lost" && (
          <span
            className={`flex-shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] ${
              statusStyles[lead.status] ?? ""
            }`}
          >
            {statusLabels[lead.status]}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span
          className={valueColor}
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          {lead.value != null
            ? `$${Number(lead.value).toLocaleString()}`
            : "—"}
        </span>
        <span className="text-text-muted">{lead.source ?? ""}</span>
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[11px] text-text-muted">
        <span style={{ fontFeatureSettings: '"tnum"' }}>
          {daysInStage}d in stage
        </span>
      </div>
    </div>
  );
}
