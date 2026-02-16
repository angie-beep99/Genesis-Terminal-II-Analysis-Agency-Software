"use client";

import { format, parseISO } from "date-fns";
import { Printer } from "lucide-react";
import ReportBody from "./report-body";
import type { Report, MonthlyMetric, Campaign, Lead } from "@/lib/types";

interface SharedReportViewProps {
  report: Report;
  metrics: MonthlyMetric[];
  campaigns: Campaign[];
  leads: Lead[];
}

export default function SharedReportView({
  report,
  metrics,
  campaigns,
  leads,
}: SharedReportViewProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-3 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">
            Genesis Terminal
          </span>
          <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-text-muted">
            Shared Report
          </span>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-text-primary transition-colors hover:border-gold"
        >
          <Printer size={14} />
          Print
        </button>
      </div>

      {/* Report content */}
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

        <ReportBody
          report={report}
          metrics={metrics}
          campaigns={campaigns}
          leads={leads}
        />
      </div>
    </div>
  );
}
