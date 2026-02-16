"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Share2, Eye } from "lucide-react";
import { format, parseISO } from "date-fns";
import ShareModal from "./share-modal";
import ReportDetailView from "./report-detail-view";
import type { Report, MonthlyMetric, Campaign, Lead } from "@/lib/types";

interface ReportsContentProps {
  reports: Report[];
  metrics: MonthlyMetric[];
  campaigns: Campaign[];
  leads: Lead[];
}

const typeBadges: Record<string, { label: string; style: string }> = {
  monthly: {
    label: "Monthly Performance",
    style: "border-blue-400/30 text-blue-400 bg-blue-400/5",
  },
  channel: {
    label: "Channel Comparison",
    style: "border-positive/30 text-positive bg-positive/5",
  },
  lead_source: {
    label: "Lead Source Analysis",
    style: "border-gold/30 text-gold bg-gold/5",
  },
  quarterly: {
    label: "Quarter in Review",
    style: "border-purple-400/30 text-purple-400 bg-purple-400/5",
  },
};

export default function ReportsContent({
  reports,
  metrics,
  campaigns,
  leads,
}: ReportsContentProps) {
  const [shareReportId, setShareReportId] = useState<string | null>(null);
  const [viewingReportId, setViewingReportId] = useState<string | null>(null);

  const viewingReport = reports.find((r) => r.id === viewingReportId) ?? null;

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {reports.map((report, i) => {
          const badge = typeBadges[report.type ?? ""] ?? typeBadges.monthly;
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2 text-text-muted">
                  <FileText size={16} />
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] ${badge.style}`}
                  >
                    {badge.label}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-medium text-text-primary">
                {report.title}
              </h3>

              {report.date_range_start && report.date_range_end && (
                <p
                  className="mt-1 text-xs text-text-muted"
                  style={{ fontFeatureSettings: '"tnum"' }}
                >
                  {format(parseISO(report.date_range_start), "MMM d, yyyy")} –{" "}
                  {format(parseISO(report.date_range_end), "MMM d, yyyy")}
                </p>
              )}

              <p className="mt-0.5 text-xs text-text-muted">
                Created {format(parseISO(report.created_at), "MMM d, yyyy")}
              </p>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setViewingReportId(report.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text-primary transition-colors hover:border-gold"
                >
                  <Eye size={12} />
                  View
                </button>
                <button className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text-primary transition-colors hover:border-gold">
                  <Download size={12} />
                  PDF
                </button>
                <button
                  onClick={() => setShareReportId(report.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text-primary transition-colors hover:border-gold"
                >
                  <Share2 size={12} />
                  Share
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Share modal */}
      <ShareModal
        reportId={shareReportId}
        onClose={() => setShareReportId(null)}
      />

      {/* Detail view */}
      <AnimatePresence>
        {viewingReport && (
          <ReportDetailView
            report={viewingReport}
            metrics={metrics}
            campaigns={campaigns}
            leads={leads}
            onClose={() => setViewingReportId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
