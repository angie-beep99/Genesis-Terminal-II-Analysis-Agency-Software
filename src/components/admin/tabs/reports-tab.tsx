"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { format, parseISO } from "date-fns";
import { createReport, deleteReport } from "@/app/admin/company/[id]/actions";
import type { Report } from "@/lib/types";

interface Props {
  companyId: string;
  reports: Report[];
}

const reportTypes = [
  { value: "monthly", label: "Monthly Performance" },
  { value: "channel", label: "Channel Comparison" },
  { value: "lead_source", label: "Lead Source Analysis" },
  { value: "quarterly", label: "Quarter in Review" },
];

export default function AdminReportsTab({ companyId, reports }: Props) {
  const [rows, setRows] = useState(reports);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("monthly");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!title.trim() || !dateStart || !dateEnd) return;
    setSaving(true);
    const result = await createReport(companyId, {
      title: title.trim(),
      type,
      date_range_start: dateStart,
      date_range_end: dateEnd,
    });
    if (result.success) {
      setRows((prev) => [
        {
          id: `new-${Date.now()}`,
          company_id: companyId,
          title: title.trim(),
          type,
          date_range_start: dateStart,
          date_range_end: dateEnd,
          share_token: null,
          share_expires: null,
          file_url: null,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setTitle("");
      setType("monthly");
      setDateStart("");
      setDateEnd("");
      setShowForm(false);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await deleteReport(id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const typeBadge: Record<string, string> = {
    monthly: "border-blue-400/30 text-blue-400 bg-blue-400/5",
    channel: "border-positive/30 text-positive bg-positive/5",
    lead_source: "border-gold/30 text-gold bg-gold/5",
    quarterly: "border-purple-400/30 text-purple-400 bg-purple-400/5",
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">{rows.length} reports</p>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-xs font-medium text-background hover:opacity-90">
          <Plus size={14} /> Create Report
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-gold/30 bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-text-muted">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold" placeholder="e.g., February 2026 Monthly Performance" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold">
                {reportTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs text-text-muted">Start</label>
                <input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-muted">End</label>
                <input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold" />
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleCreate} disabled={saving || !title.trim()} className="flex items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-xs font-medium text-background hover:opacity-90 disabled:opacity-50"><Save size={12} /> Create</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:text-text-primary">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {rows.map((report) => (
          <div key={report.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-primary">{report.title}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] ${typeBadge[report.type ?? "monthly"] ?? typeBadge.monthly}`}>
                  {reportTypes.find((t) => t.value === report.type)?.label ?? report.type}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-text-muted" style={{ fontFeatureSettings: '"tnum"' }}>
                {report.date_range_start && report.date_range_end
                  ? `${format(parseISO(report.date_range_start), "MMM d, yyyy")} – ${format(parseISO(report.date_range_end), "MMM d, yyyy")}`
                  : "—"}
                {" · Created "}
                {format(parseISO(report.created_at), "MMM d, yyyy")}
              </p>
            </div>
            <button onClick={() => handleDelete(report.id)} className="rounded p-1 text-text-muted hover:text-negative"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
