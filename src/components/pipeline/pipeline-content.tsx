"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { differenceInDays, parseISO } from "date-fns";
import KanbanBoard from "./kanban-board";
import MobileListView from "./mobile-list-view";
import { updateLeadStatus } from "@/app/(dashboard)/pipeline/actions";
import { useToast } from "@/components/toast";
import type { Lead } from "@/lib/types";

interface PipelineContentProps {
  leads: Lead[];
}

export interface PipelineColumn {
  key: string;
  label: string;
  statuses: Lead["status"][];
  color: string;
  valueColor: string;
}

export const columns: PipelineColumn[] = [
  {
    key: "new",
    label: "New",
    statuses: ["new"],
    color: "text-text-primary",
    valueColor: "text-text-primary",
  },
  {
    key: "contacted_qualified",
    label: "Contacted / Qualified",
    statuses: ["contacted", "qualified"],
    color: "text-blue-400",
    valueColor: "text-text-primary",
  },
  {
    key: "proposal_sent",
    label: "Proposal Sent",
    statuses: ["proposal_sent"],
    color: "text-purple-400",
    valueColor: "text-text-primary",
  },
  {
    key: "won_lost",
    label: "Won / Lost",
    statuses: ["won", "lost"],
    color: "text-gold",
    valueColor: "text-gold",
  },
];

// Map column key to the primary status for drops
const dropStatusMap: Record<string, Lead["status"]> = {
  new: "new",
  contacted_qualified: "qualified",
  proposal_sent: "proposal_sent",
  won_lost: "won",
};

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export default function PipelineContent({ leads: initialLeads }: PipelineContentProps) {
  const [leads, setLeads] = useState(initialLeads);
  const { toast } = useToast();

  // Summary stats
  const summary = useMemo(() => {
    const activeLeads = leads.filter(
      (l) => !["lost", "churned"].includes(l.status)
    );
    const totalValue = activeLeads.reduce(
      (s, l) => s + (Number(l.value) || 0),
      0
    );
    const withValue = activeLeads.filter((l) => l.value != null);
    const avgDeal =
      withValue.length > 0
        ? withValue.reduce((s, l) => s + Number(l.value), 0) / withValue.length
        : 0;

    const wonLeads = leads.filter((l) => l.status === "won");
    const wonDays = wonLeads.map((l) =>
      differenceInDays(parseISO(l.updated_at), parseISO(l.created_at))
    );
    const avgClose =
      wonDays.length > 0
        ? Math.round(wonDays.reduce((a, b) => a + b, 0) / wonDays.length)
        : 0;

    const totalOutcome = leads.filter((l) =>
      ["won", "lost"].includes(l.status)
    ).length;
    const winRate =
      totalOutcome > 0 ? (wonLeads.length / totalOutcome) * 100 : 0;

    const wonCpas = wonLeads
      .filter((l) => l.cpa != null)
      .map((l) => Number(l.cpa));
    const avgCpa =
      wonCpas.length > 0
        ? wonCpas.reduce((a, b) => a + b, 0) / wonCpas.length
        : 0;

    return { totalValue, avgDeal, avgClose, winRate, avgCpa };
  }, [leads]);

  const handleDrop = useCallback(
    async (leadId: string, targetColumnKey: string) => {
      const lead = leads.find((l) => l.id === leadId);
      if (!lead) return;

      const newStatus = dropStatusMap[targetColumnKey];
      if (!newStatus || lead.status === newStatus) return;

      const oldStatus = lead.status;

      // Optimistic update
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? { ...l, status: newStatus, updated_at: new Date().toISOString() }
            : l
        )
      );

      // Sync to database
      const result = await updateLeadStatus(leadId, newStatus, oldStatus);
      if (result.error) {
        // Revert on error
        setLeads((prev) =>
          prev.map((l) =>
            l.id === leadId ? { ...l, status: oldStatus } : l
          )
        );
        toast("Failed to update lead status", "error");
      } else {
        toast(`Lead moved to ${newStatus.replace("_", " ")}`);
      }
    },
    [leads, toast]
  );

  const summaryItems = [
    { label: "Pipeline Value", value: formatCurrency(summary.totalValue) },
    { label: "Avg Deal Size", value: formatCurrency(summary.avgDeal) },
    { label: "Avg Time to Close", value: `${summary.avgClose}d` },
    { label: "Win Rate", value: `${summary.winRate.toFixed(0)}%` },
    { label: "Avg CPA (Won)", value: formatCurrency(summary.avgCpa) },
  ];

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      >
        {summaryItems.map((item, i) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-xs text-text-muted">{item.label}</p>
            <p
              className={`mt-1 text-lg font-semibold ${i === 0 ? "text-gold" : "text-text-primary"}`}
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Desktop: Kanban */}
      <div className="hidden md:block">
        <KanbanBoard leads={leads} onDrop={handleDrop} />
      </div>

      {/* Mobile: List */}
      <div className="md:hidden">
        <MobileListView leads={leads} />
      </div>
    </div>
  );
}
