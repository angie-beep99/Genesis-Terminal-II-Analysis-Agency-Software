"use client";

import { motion } from "framer-motion";
import { X, Printer } from "lucide-react";
import { format, parseISO } from "date-fns";
import ReportBody from "./report-body";
import type { Report, MonthlyMetric, Campaign, Lead } from "@/lib/types";

interface ReportDetailViewProps {
  report: Report;
  metrics: MonthlyMetric[];
  campaigns: Campaign[];
  leads: Lead[];
  onClose: () => void;
}

export default function ReportDetailView({
  report,
  metrics,
  campaigns,
  leads,
  onClose,
}: ReportDetailViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-background"
    >
      {/* Top bar — hidden in print */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-3 print:hidden">
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-text-primary transition-colors hover:border-gold"
        >
          <X size={14} />
          Close
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-text-primary transition-colors hover:border-gold"
        >
          <Printer size={14} />
          Print
        </button>
      </div>

      {/* Report header */}
      <div className="mx-auto max-w-4xl px-6 py-8 print:py-4">
        <h1 className="text-2xl font-semibold text-text-primary">
          {report.title}
        </h1>
        {report.date_range_start && report.date_range_end && (
          <p
            className="mt-1 text-sm text-text-muted"
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            {format(parseISO(report.date_range_start), "MMMM d, yyyy")} –{" "}
            {format(parseISO(report.date_range_end), "MMMM d, yyyy")}
          </p>
        )}
        <p className="mt-0.5 text-xs text-text-muted">
          Generated {format(parseISO(report.created_at), "MMMM d, yyyy")}
        </p>

        <hr className="my-6 border-border" />

        {/* Report body */}
        <ReportBody
          report={report}
          metrics={metrics}
          campaigns={campaigns}
          leads={leads}
        />
      </div>
    </motion.div>
  );
}
