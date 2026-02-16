"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, CheckCircle } from "lucide-react";
import { exportTableCsv } from "@/app/(dashboard)/settings/actions";
import type { Lead, DailyPerformance, Channel } from "@/lib/types";

interface DataTabProps {
  leads: Lead[];
  performance: DailyPerformance[];
  channels: Channel[];
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function DataTab({ leads, performance, channels }: DataTabProps) {
  const [downloadedKey, setDownloadedKey] = useState<string | null>(null);

  async function handleExport(
    table: "leads" | "daily_performance" | "channels",
    filename: string
  ) {
    const result = await exportTableCsv(table);
    if (result.csv) {
      downloadCsv(result.csv, filename);
      setDownloadedKey(table);
      setTimeout(() => setDownloadedKey(null), 2000);
    }
  }

  const exports = [
    {
      key: "leads" as const,
      label: "Export Leads",
      filename: "leads_export.csv",
      count: leads.length,
      description: "All lead records including status, source, and value",
    },
    {
      key: "daily_performance" as const,
      label: "Export Performance Data",
      filename: "performance_export.csv",
      count: performance.length,
      description: "Daily performance metrics including spend and leads",
    },
    {
      key: "channels" as const,
      label: "Export Channel Data",
      filename: "channels_export.csv",
      count: channels.length,
      description: "Channel information and status",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="grid gap-4 sm:grid-cols-3"
    >
      {exports.map((exp) => (
        <div
          key={exp.key}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-medium text-text-primary">
            {exp.label}
          </h3>
          <p className="mt-1 text-xs text-text-muted">{exp.description}</p>
          <p
            className="mt-2 text-xs text-text-muted"
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            {exp.count} records
          </p>
          <button
            onClick={() => handleExport(exp.key, exp.filename)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-text-primary transition-colors hover:border-gold"
          >
            {downloadedKey === exp.key ? (
              <CheckCircle size={14} className="text-positive" />
            ) : (
              <Download size={14} />
            )}
            {downloadedKey === exp.key ? "Downloaded" : "Download CSV"}
          </button>
        </div>
      ))}
    </motion.div>
  );
}
