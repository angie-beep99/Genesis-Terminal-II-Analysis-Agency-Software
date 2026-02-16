"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { differenceInDays, parseISO } from "date-fns";
import KanbanCard from "./kanban-card";
import type { PipelineColumn } from "./pipeline-content";
import type { Lead } from "@/lib/types";

interface KanbanColumnProps {
  column: PipelineColumn;
  leads: Lead[];
  onDrop: (leadId: string, targetColumnKey: string) => void;
  index: number;
}

export default function KanbanColumn({
  column,
  leads,
  onDrop,
  index,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const stats = useMemo(() => {
    const totalValue = leads.reduce(
      (s, l) => s + (Number(l.value) || 0),
      0
    );
    const days = leads.map((l) =>
      differenceInDays(new Date(), parseISO(l.updated_at))
    );
    const avgDays =
      days.length > 0
        ? Math.round(days.reduce((a, b) => a + b, 0) / days.length)
        : 0;
    return { totalValue, avgDays, count: leads.length };
  }, [leads]);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const leadId = e.dataTransfer.getData("text/plain");
    if (leadId) {
      onDrop(leadId, column.key);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-xl border bg-card transition-colors ${
        isDragOver ? "border-gold/50 bg-gold/5" : "border-border"
      }`}
    >
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-medium ${column.color}`}>
            {column.label}
          </h3>
          <span
            className="rounded-full bg-background px-2 py-0.5 text-xs text-text-muted"
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            {stats.count}
          </span>
        </div>
        <p
          className={`mt-0.5 text-xs ${column.valueColor}`}
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          ${stats.totalValue.toLocaleString()}
        </p>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-2 p-3" style={{ minHeight: 120 }}>
        {leads.map((lead) => (
          <KanbanCard key={lead.id} lead={lead} columnKey={column.key} />
        ))}
        {leads.length === 0 && (
          <p className="py-6 text-center text-xs text-text-muted">
            No leads
          </p>
        )}
      </div>

      {/* Column stats */}
      <div className="border-t border-border px-4 py-2.5">
        <div className="flex justify-between text-[11px] text-text-muted">
          <span>{stats.count} lead{stats.count !== 1 ? "s" : ""}</span>
          <span style={{ fontFeatureSettings: '"tnum"' }}>
            ~{stats.avgDays}d avg
          </span>
        </div>
      </div>
    </motion.div>
  );
}
