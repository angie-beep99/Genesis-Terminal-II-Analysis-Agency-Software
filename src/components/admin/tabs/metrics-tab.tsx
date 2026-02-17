"use client";

import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";
import { upsertMetric } from "@/app/admin/company/[id]/actions";
import type { MonthlyMetric } from "@/lib/types";

interface Props {
  companyId: string;
  metrics: MonthlyMetric[];
}

export default function AdminMetricsTab({ companyId, metrics }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(
    metrics[0]?.month?.slice(0, 7) ?? new Date().toISOString().slice(0, 7)
  );
  const existing = metrics.find((m) => m.month.startsWith(selectedMonth));

  const [totalSpend, setTotalSpend] = useState(existing?.total_spend?.toString() ?? "0");
  const [totalLeads, setTotalLeads] = useState(existing?.total_leads?.toString() ?? "0");
  const [qualifiedLeads, setQualifiedLeads] = useState(existing?.qualified_leads?.toString() ?? "0");
  const [cpl, setCpl] = useState(existing?.cost_per_lead?.toString() ?? "0");
  const [cpql, setCpql] = useState(existing?.cost_per_qualified_lead?.toString() ?? "0");
  const [revenue, setRevenue] = useState(existing?.revenue_influenced?.toString() ?? "0");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleMonthChange(month: string) {
    setSelectedMonth(month);
    const m = metrics.find((x) => x.month.startsWith(month));
    setTotalSpend(m?.total_spend?.toString() ?? "0");
    setTotalLeads(m?.total_leads?.toString() ?? "0");
    setQualifiedLeads(m?.qualified_leads?.toString() ?? "0");
    setCpl(m?.cost_per_lead?.toString() ?? "0");
    setCpql(m?.cost_per_qualified_lead?.toString() ?? "0");
    setRevenue(m?.revenue_influenced?.toString() ?? "0");
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await upsertMetric(companyId, `${selectedMonth}-01`, {
      total_spend: parseFloat(totalSpend) || 0,
      total_leads: parseInt(totalLeads) || 0,
      qualified_leads: parseInt(qualifiedLeads) || 0,
      cost_per_lead: parseFloat(cpl) || 0,
      cost_per_qualified_lead: parseFloat(cpql) || 0,
      revenue_influenced: parseFloat(revenue) || 0,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-xs text-text-muted">Month</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold"
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NumField label="Total Spend ($)" value={totalSpend} onChange={setTotalSpend} />
          <NumField label="Total Leads" value={totalLeads} onChange={setTotalLeads} />
          <NumField label="Qualified Leads" value={qualifiedLeads} onChange={setQualifiedLeads} />
          <NumField label="Cost Per Lead ($)" value={cpl} onChange={setCpl} />
          <NumField label="Cost Per Qualified Lead ($)" value={cpql} onChange={setCpql} />
          <NumField label="Revenue Influenced ($)" value={revenue} onChange={setRevenue} />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saving ? "Saving..." : saved ? "Saved" : "Save Metrics"}
        </button>
      </div>
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-text-muted">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-gold"
        style={{ fontFeatureSettings: '"tnum"' }}
      />
    </div>
  );
}
