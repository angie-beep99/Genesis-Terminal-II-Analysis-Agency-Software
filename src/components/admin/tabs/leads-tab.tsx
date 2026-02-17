"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { format, parseISO } from "date-fns";
import { upsertLead, deleteLead } from "@/app/admin/company/[id]/actions";
import type { Lead } from "@/lib/types";

interface Props {
  companyId: string;
  leads: Lead[];
}

const statuses = ["new", "contacted", "qualified", "proposal_sent", "won", "lost", "churned"];

interface EditRow {
  id: string | null;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  campaign: string;
  status: string;
  value: string;
  cpa: string;
}

function emptyRow(): EditRow {
  return { id: null, name: "", company: "", email: "", phone: "", source: "", campaign: "", status: "new", value: "0", cpa: "0" };
}

export default function AdminLeadsTab({ companyId, leads }: Props) {
  const [rows, setRows] = useState(leads);
  const [editRow, setEditRow] = useState<EditRow | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!editRow) return;
    setSaving(true);
    const result = await upsertLead(companyId, editRow.id, {
      name: editRow.name,
      company: editRow.company || null,
      email: editRow.email || null,
      phone: editRow.phone || null,
      source: editRow.source || null,
      campaign: editRow.campaign || null,
      status: editRow.status,
      value: editRow.value ? parseFloat(editRow.value) : null,
      cpa: editRow.cpa ? parseFloat(editRow.cpa) : null,
    });
    if (result.success) {
      if (editRow.id) {
        setRows((prev) =>
          prev.map((r) =>
            r.id === editRow.id
              ? { ...r, name: editRow.name, company: editRow.company || null, email: editRow.email || null, phone: editRow.phone || null, source: editRow.source || null, campaign: editRow.campaign || null, status: editRow.status as Lead["status"], value: editRow.value ? parseFloat(editRow.value) : null, cpa: editRow.cpa ? parseFloat(editRow.cpa) : null }
              : r
          )
        );
      } else {
        setRows((prev) => [
          { id: `new-${Date.now()}`, company_id: companyId, name: editRow.name, company: editRow.company || null, email: editRow.email || null, phone: editRow.phone || null, source: editRow.source || null, campaign: editRow.campaign || null, status: editRow.status as Lead["status"], value: editRow.value ? parseFloat(editRow.value) : null, cpa: editRow.cpa ? parseFloat(editRow.cpa) : null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          ...prev,
        ]);
      }
      setEditRow(null);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await deleteLead(id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">{rows.length} leads</p>
        <button onClick={() => setEditRow(emptyRow())} className="flex items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-xs font-medium text-background hover:opacity-90">
          <Plus size={14} /> Add Lead
        </button>
      </div>

      {editRow && (
        <div className="rounded-xl border border-gold/30 bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Name" value={editRow.name} onChange={(v) => setEditRow({ ...editRow, name: v })} />
            <Field label="Company" value={editRow.company} onChange={(v) => setEditRow({ ...editRow, company: v })} />
            <Field label="Email" value={editRow.email} onChange={(v) => setEditRow({ ...editRow, email: v })} />
            <Field label="Phone" value={editRow.phone} onChange={(v) => setEditRow({ ...editRow, phone: v })} />
            <Field label="Source" value={editRow.source} onChange={(v) => setEditRow({ ...editRow, source: v })} />
            <Field label="Campaign" value={editRow.campaign} onChange={(v) => setEditRow({ ...editRow, campaign: v })} />
            <div>
              <label className="mb-1 block text-xs text-text-muted">Status</label>
              <select value={editRow.status} onChange={(e) => setEditRow({ ...editRow, status: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold">
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Field label="Value ($)" value={editRow.value} onChange={(v) => setEditRow({ ...editRow, value: v })} type="number" />
            <Field label="CPA ($)" value={editRow.cpa} onChange={(v) => setEditRow({ ...editRow, cpa: v })} type="number" />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleSave} disabled={saving || !editRow.name.trim()} className="flex items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-xs font-medium text-background hover:opacity-90 disabled:opacity-50"><Save size={12} /> Save</button>
            <button onClick={() => setEditRow(null)} className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:text-text-primary">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Value</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 50).map((l) => (
              <tr key={l.id} className="border-b border-border/50 last:border-0">
                <td className="px-4 py-2">
                  <div className="text-text-primary">{l.name}</div>
                  {l.email && <div className="text-xs text-text-muted">{l.email}</div>}
                </td>
                <td className="px-4 py-2 text-text-muted">{l.source ?? "—"}</td>
                <td className="px-4 py-2"><span className={`rounded-full px-2 py-0.5 text-[11px] ${l.status === "won" ? "bg-positive/10 text-positive" : l.status === "lost" ? "bg-negative/10 text-negative" : "bg-text-muted/10 text-text-muted"}`}>{l.status}</span></td>
                <td className="px-4 py-2 text-right text-text-primary" style={{ fontFeatureSettings: '"tnum"' }}>{l.value ? `$${Number(l.value).toLocaleString()}` : "—"}</td>
                <td className="px-4 py-2 text-xs text-text-muted" style={{ fontFeatureSettings: '"tnum"' }}>{format(parseISO(l.created_at), "MMM d")}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditRow({ id: l.id, name: l.name, company: l.company ?? "", email: l.email ?? "", phone: l.phone ?? "", source: l.source ?? "", campaign: l.campaign ?? "", status: l.status, value: l.value?.toString() ?? "0", cpa: l.cpa?.toString() ?? "0" })} className="rounded px-2 py-1 text-xs text-text-muted hover:text-text-primary">Edit</button>
                    <button onClick={() => handleDelete(l.id)} className="rounded p-1 text-text-muted hover:text-negative"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-text-muted">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold" />
    </div>
  );
}
