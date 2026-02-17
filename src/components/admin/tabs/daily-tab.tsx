"use client";

import { useState } from "react";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { upsertDailyPerformance, deleteDailyPerformance } from "@/app/admin/company/[id]/actions";
import type { DailyPerformance } from "@/lib/types";

interface Props {
  companyId: string;
  data: DailyPerformance[];
}

interface EditRow {
  id: string | null;
  date: string;
  spend: string;
  leads: string;
  qualified_leads: string;
}

export default function AdminDailyTab({ companyId, data }: Props) {
  const [rows, setRows] = useState(data);
  const [editRow, setEditRow] = useState<EditRow | null>(null);
  const [saving, setSaving] = useState(false);

  function handleAdd() {
    setEditRow({
      id: null,
      date: new Date().toISOString().slice(0, 10),
      spend: "0",
      leads: "0",
      qualified_leads: "0",
    });
  }

  function handleEdit(row: DailyPerformance) {
    setEditRow({
      id: row.id,
      date: row.date.slice(0, 10),
      spend: row.spend.toString(),
      leads: row.leads.toString(),
      qualified_leads: row.qualified_leads.toString(),
    });
  }

  async function handleSave() {
    if (!editRow) return;
    setSaving(true);
    const result = await upsertDailyPerformance(companyId, editRow.id, {
      date: editRow.date,
      spend: parseFloat(editRow.spend) || 0,
      leads: parseInt(editRow.leads) || 0,
      qualified_leads: parseInt(editRow.qualified_leads) || 0,
    });
    if (result.success) {
      if (editRow.id) {
        setRows((prev) =>
          prev.map((r) =>
            r.id === editRow.id
              ? {
                  ...r,
                  date: editRow.date,
                  spend: parseFloat(editRow.spend) || 0,
                  leads: parseInt(editRow.leads) || 0,
                  qualified_leads: parseInt(editRow.qualified_leads) || 0,
                }
              : r
          )
        );
      } else {
        setRows((prev) => [
          {
            id: `new-${Date.now()}`,
            company_id: companyId,
            date: editRow.date,
            spend: parseFloat(editRow.spend) || 0,
            leads: parseInt(editRow.leads) || 0,
            qualified_leads: parseInt(editRow.qualified_leads) || 0,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
      setEditRow(null);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await deleteDailyPerformance(id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">{rows.length} records</p>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-xs font-medium text-background hover:opacity-90"
        >
          <Plus size={14} />
          Add Row
        </button>
      </div>

      {/* Edit form */}
      {editRow && (
        <div className="rounded-xl border border-gold/30 bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs text-text-muted">Date</label>
              <input
                type="date"
                value={editRow.date}
                onChange={(e) => setEditRow({ ...editRow, date: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Spend</label>
              <input
                type="number"
                value={editRow.spend}
                onChange={(e) => setEditRow({ ...editRow, spend: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Leads</label>
              <input
                type="number"
                value={editRow.leads}
                onChange={(e) => setEditRow({ ...editRow, leads: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Qualified</label>
              <input
                type="number"
                value={editRow.qualified_leads}
                onChange={(e) => setEditRow({ ...editRow, qualified_leads: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-xs font-medium text-background hover:opacity-90 disabled:opacity-50">
              {saving ? <CheckCircle size={12} /> : <Save size={12} />}
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setEditRow(null)} className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:text-text-primary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 text-right font-medium">Spend</th>
              <th className="px-4 py-3 text-right font-medium">Leads</th>
              <th className="px-4 py-3 text-right font-medium">Qualified</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 50).map((row) => (
              <tr key={row.id} className="border-b border-border/50 last:border-0">
                <td className="px-4 py-2 text-text-primary" style={{ fontFeatureSettings: '"tnum"' }}>
                  {format(parseISO(row.date), "MMM d, yyyy")}
                </td>
                <td className="px-4 py-2 text-right text-text-primary" style={{ fontFeatureSettings: '"tnum"' }}>
                  ${Number(row.spend).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right text-text-primary" style={{ fontFeatureSettings: '"tnum"' }}>
                  {row.leads}
                </td>
                <td className="px-4 py-2 text-right text-text-primary" style={{ fontFeatureSettings: '"tnum"' }}>
                  {row.qualified_leads}
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleEdit(row)} className="rounded px-2 py-1 text-xs text-text-muted hover:text-text-primary">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="rounded p-1 text-text-muted hover:text-negative">
                      <Trash2 size={12} />
                    </button>
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
