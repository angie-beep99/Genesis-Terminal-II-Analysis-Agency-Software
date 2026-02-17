"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { parseISO } from "date-fns";
import LeadRow from "./lead-row";
import LeadDetailPanel from "./lead-detail-panel";
import { EmptyLeads } from "@/components/empty-state";
import type { Lead, LeadActivity, LeadNote } from "@/lib/types";

interface LeadsContentProps {
  leads: Lead[];
  activities: LeadActivity[];
  notes: LeadNote[];
}

type StatusFilter = "all" | Lead["status"];
type SortKey = "newest" | "oldest" | "highest_value" | "lowest_cpa";

const statusFilters: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "qualified", label: "Qualified" },
  { key: "proposal_sent", label: "Proposal Sent" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
];

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "highest_value", label: "Highest Value" },
  { key: "lowest_cpa", label: "Lowest CPA" },
];

export default function LeadsContent({ leads, activities, notes }: LeadsContentProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Summary stats — this month
  const summary = useMemo(() => {
    const now = new Date();
    const thisMonth = leads.filter((l) => {
      const d = parseISO(l.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const newCount = thisMonth.length;
    const wonCount = leads.filter((l) => l.status === "won").length;
    const pipeline = leads
      .filter((l) => !["won", "lost", "churned"].includes(l.status))
      .reduce((s, l) => s + (Number(l.value) || 0), 0);
    const totalWithOutcome = leads.filter((l) =>
      ["won", "lost"].includes(l.status)
    ).length;
    const winRate = totalWithOutcome > 0 ? (wonCount / totalWithOutcome) * 100 : 0;
    const cpas = leads.filter((l) => l.cpa != null).map((l) => Number(l.cpa));
    const avgCpa = cpas.length > 0 ? cpas.reduce((a, b) => a + b, 0) / cpas.length : 0;

    return { newCount, wonCount, pipeline, winRate, avgCpa };
  }, [leads]);

  // Filtered + sorted leads
  const filtered = useMemo(() => {
    let result = [...leads];

    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.company ?? "").toLowerCase().includes(q) ||
          (l.email ?? "").toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => b.created_at.localeCompare(a.created_at));
        break;
      case "oldest":
        result.sort((a, b) => a.created_at.localeCompare(b.created_at));
        break;
      case "highest_value":
        result.sort((a, b) => (Number(b.value) || 0) - (Number(a.value) || 0));
        break;
      case "lowest_cpa":
        result.sort((a, b) => (Number(a.cpa) || Infinity) - (Number(b.cpa) || Infinity));
        break;
    }

    return result;
  }, [leads, statusFilter, search, sortBy]);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) ?? null;
  const selectedActivities = activities.filter((a) => a.lead_id === selectedLeadId);
  const selectedNotes = notes.filter((n) => n.lead_id === selectedLeadId);

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-10 rounded-xl border border-border bg-card px-5 py-3"
      >
        <p
          className="text-sm text-text-muted"
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          This month:{" "}
          <span className="text-text-primary">{summary.newCount}</span> new leads
          {" · "}
          <span className="text-positive">{summary.wonCount}</span> won
          {" · "}
          <span className="text-gold">${summary.pipeline.toLocaleString()}</span> pipeline
          {" · "}
          <span className="text-text-primary">{summary.winRate.toFixed(0)}%</span> win rate
          {" · "}
          Avg CPA{" "}
          <span className="text-text-primary">${summary.avgCpa.toFixed(0)}</span>
        </p>
      </motion.div>

      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Status filters */}
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
          {statusFilters.map((sf) => (
            <button
              key={sf.key}
              onClick={() => setStatusFilter(sf.key)}
              className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                statusFilter === sf.key
                  ? "bg-gold/10 text-gold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {sf.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search name, company, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-w-[180px] rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-text-primary placeholder-text-muted outline-none focus:border-gold"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-primary outline-none focus:border-gold"
        >
          {sortOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Lead table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="rounded-xl border border-border bg-card"
      >
        {/* Header */}
        <div className="hidden grid-cols-8 gap-2 border-b border-border px-5 py-3 text-xs font-medium text-text-muted md:grid">
          <span className="col-span-2">Name</span>
          <span>Source</span>
          <span>Campaign</span>
          <span>Date</span>
          <span className="text-right">Value</span>
          <span className="text-right">CPA</span>
          <span className="text-right">Status</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <EmptyLeads />
        ) : (
          filtered.map((lead) => (
            <LeadRow
              key={lead.id}
              lead={lead}
              isSelected={lead.id === selectedLeadId}
              onClick={() => setSelectedLeadId(lead.id)}
            />
          ))
        )}
      </motion.div>

      {/* Detail panel */}
      <LeadDetailPanel
        lead={selectedLead}
        activities={selectedActivities}
        notes={selectedNotes}
        onClose={() => setSelectedLeadId(null)}
      />
    </div>
  );
}
