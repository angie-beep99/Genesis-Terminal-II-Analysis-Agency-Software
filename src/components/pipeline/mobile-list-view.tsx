"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { columns } from "./pipeline-content";
import type { Lead } from "@/lib/types";

interface MobileListViewProps {
  leads: Lead[];
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

export default function MobileListView({ leads }: MobileListViewProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["new"]));

  function toggle(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {columns.map((col) => {
        const colLeads = leads.filter((l) => col.statuses.includes(l.status));
        const totalValue = colLeads.reduce(
          (s, l) => s + (Number(l.value) || 0),
          0
        );
        const isOpen = expanded.has(col.key);

        return (
          <div
            key={col.key}
            className="rounded-xl border border-border bg-card"
          >
            <button
              onClick={() => toggle(col.key)}
              className="flex w-full items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${col.color}`}>
                  {col.label}
                </span>
                <span className="rounded-full bg-background px-2 py-0.5 text-xs text-text-muted">
                  {colLeads.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs text-text-muted"
                  style={{ fontFeatureSettings: '"tnum"' }}
                >
                  ${totalValue.toLocaleString()}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-text-muted transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border/50 px-4 py-2">
                    {colLeads.length === 0 ? (
                      <p className="py-4 text-center text-xs text-text-muted">
                        No leads
                      </p>
                    ) : (
                      <div className="divide-y divide-border/30">
                        {colLeads.map((lead) => {
                          const daysInStage = differenceInDays(
                            new Date(),
                            parseISO(lead.updated_at)
                          );
                          const isWon = lead.status === "won";
                          const isLost = lead.status === "lost";
                          return (
                            <div
                              key={lead.id}
                              className="flex items-center justify-between py-3"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-text-primary">
                                  {lead.name}
                                </p>
                                <p className="text-xs text-text-muted">
                                  {lead.source ?? "Unknown"} ·{" "}
                                  {daysInStage}d
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-sm ${
                                    isWon
                                      ? "text-gold"
                                      : isLost
                                        ? "text-negative/60"
                                        : "text-text-primary"
                                  }`}
                                  style={{ fontFeatureSettings: '"tnum"' }}
                                >
                                  {lead.value != null
                                    ? `$${Number(lead.value).toLocaleString()}`
                                    : "—"}
                                </span>
                                <span
                                  className={`rounded-full border px-2 py-0.5 text-[10px] ${
                                    statusStyles[lead.status] ?? ""
                                  }`}
                                >
                                  {statusLabels[lead.status]}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
