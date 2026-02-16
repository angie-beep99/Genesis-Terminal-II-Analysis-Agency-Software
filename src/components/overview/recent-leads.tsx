"use client";

import { motion } from "framer-motion";
import type { Lead } from "@/lib/types";

interface RecentLeadsProps {
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

export default function RecentLeads({ leads }: RecentLeadsProps) {
  const recent = leads.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <h3 className="mb-4 text-sm font-medium text-text-primary">
        Recent Leads
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-text-muted">
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">Source</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 text-right font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((lead) => (
              <tr key={lead.id} className="border-b border-border/50 last:border-0">
                <td className="py-3 text-text-primary">{lead.name}</td>
                <td className="py-3 text-text-muted">{lead.source ?? "—"}</td>
                <td className="py-3">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-xs ${statusStyles[lead.status] ?? ""}`}
                  >
                    {statusLabels[lead.status] ?? lead.status}
                  </span>
                </td>
                <td
                  className="py-3 text-right text-text-primary"
                  style={{ fontFeatureSettings: '"tnum"' }}
                >
                  {lead.value != null
                    ? `$${Number(lead.value).toLocaleString()}`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
