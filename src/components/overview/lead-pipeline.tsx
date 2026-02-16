"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Lead } from "@/lib/types";

interface LeadPipelineProps {
  leads: Lead[];
}

const stages = [
  { key: "new", label: "New", color: "text-text-primary" },
  { key: "contacted", label: "Contacted", color: "text-blue-400" },
  { key: "qualified", label: "Qualified", color: "text-gold" },
  { key: "proposal_sent", label: "Proposal Sent", color: "text-purple-400" },
  { key: "won", label: "Won", color: "text-gold" },
  { key: "lost", label: "Lost", color: "text-negative/60" },
] as const;

export default function LeadPipeline({ leads }: LeadPipelineProps) {
  const counts: Record<string, number> = {};
  for (const lead of leads) {
    counts[lead.status] = (counts[lead.status] ?? 0) + 1;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <h3 className="mb-4 text-sm font-medium text-text-primary">
        Lead Pipeline
      </h3>
      <div className="flex flex-wrap items-center gap-1">
        {stages.map((stage, i) => {
          const count = counts[stage.key] ?? 0;
          // Conversion rate from previous stage
          const prevCount = i > 0 ? (counts[stages[i - 1].key] ?? 0) : 0;
          const convRate = i > 0 && prevCount > 0 ? Math.round((count / prevCount) * 100) : null;

          return (
            <div key={stage.key} className="flex items-center gap-1">
              {i > 0 && (
                <div className="flex flex-col items-center px-1">
                  <ChevronRight size={14} className="text-text-muted" />
                  {convRate !== null && (
                    <span
                      className="text-[10px] text-text-muted"
                      style={{ fontFeatureSettings: '"tnum"' }}
                    >
                      {convRate}%
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-col items-center rounded-lg border border-border bg-background px-4 py-2">
                <span
                  className={`text-lg font-semibold ${stage.color}`}
                  style={{ fontFeatureSettings: '"tnum"' }}
                >
                  {count}
                </span>
                <span className="text-[11px] text-text-muted">{stage.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
