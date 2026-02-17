"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { upsertCampaign, deleteCampaign } from "@/app/admin/company/[id]/actions";
import type { Campaign, Channel } from "@/lib/types";

interface Props {
  companyId: string;
  campaigns: Campaign[];
  channels: Channel[];
}

interface EditRow {
  id: string | null;
  channel_id: string;
  name: string;
  status: string;
  spend: string;
  leads: string;
  cpl: string;
}

export default function AdminCampaignsTab({ companyId, campaigns, channels }: Props) {
  const [rows, setRows] = useState(campaigns);
  const [editRow, setEditRow] = useState<EditRow | null>(null);
  const [saving, setSaving] = useState(false);

  function newRow(): EditRow {
    return { id: null, channel_id: channels[0]?.id ?? "", name: "", status: "active", spend: "0", leads: "0", cpl: "0" };
  }

  async function handleSave() {
    if (!editRow) return;
    setSaving(true);
    const result = await upsertCampaign(companyId, editRow.id, {
      channel_id: editRow.channel_id,
      name: editRow.name,
      status: editRow.status,
      spend: parseFloat(editRow.spend) || 0,
      leads: parseInt(editRow.leads) || 0,
      cpl: parseFloat(editRow.cpl) || 0,
    });
    if (result.success) {
      if (editRow.id) {
        setRows((prev) =>
          prev.map((r) =>
            r.id === editRow.id
              ? { ...r, channel_id: editRow.channel_id, name: editRow.name, status: editRow.status, spend: parseFloat(editRow.spend) || 0, leads: parseInt(editRow.leads) || 0, cpl: parseFloat(editRow.cpl) || 0 }
              : r
          )
        );
      } else {
        setRows((prev) => [
          ...prev,
          { id: `new-${Date.now()}`, channel_id: editRow.channel_id, company_id: companyId, name: editRow.name, status: editRow.status, spend: parseFloat(editRow.spend) || 0, leads: parseInt(editRow.leads) || 0, cpl: parseFloat(editRow.cpl) || 0, created_at: new Date().toISOString() },
        ]);
      }
      setEditRow(null);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await deleteCampaign(id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const channelMap = new Map(channels.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">{rows.length} campaigns</p>
        <button onClick={() => setEditRow(newRow())} className="flex items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-xs font-medium text-background hover:opacity-90">
          <Plus size={14} /> Add Campaign
        </button>
      </div>

      {editRow && (
        <div className="rounded-xl border border-gold/30 bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-text-muted">Name</label>
              <input type="text" value={editRow.name} onChange={(e) => setEditRow({ ...editRow, name: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Channel</label>
              <select value={editRow.channel_id} onChange={(e) => setEditRow({ ...editRow, channel_id: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold">
                {channels.map((ch) => (
                  <option key={ch.id} value={ch.id}>{ch.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Status</label>
              <select value={editRow.status} onChange={(e) => setEditRow({ ...editRow, status: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Spend ($)</label>
              <input type="number" value={editRow.spend} onChange={(e) => setEditRow({ ...editRow, spend: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Leads</label>
              <input type="number" value={editRow.leads} onChange={(e) => setEditRow({ ...editRow, leads: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">CPL ($)</label>
              <input type="number" value={editRow.cpl} onChange={(e) => setEditRow({ ...editRow, cpl: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold" />
            </div>
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
              <th className="px-4 py-3 font-medium">Campaign</th>
              <th className="px-4 py-3 font-medium">Channel</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Spend</th>
              <th className="px-4 py-3 text-right font-medium">Leads</th>
              <th className="px-4 py-3 text-right font-medium">CPL</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-border/50 last:border-0">
                <td className="px-4 py-2 text-text-primary">{c.name}</td>
                <td className="px-4 py-2 text-text-muted">{channelMap.get(c.channel_id) ?? "—"}</td>
                <td className="px-4 py-2"><span className={`inline-flex items-center gap-1 text-xs ${c.status === "active" ? "text-positive" : "text-text-muted"}`}><span className={`h-1.5 w-1.5 rounded-full ${c.status === "active" ? "bg-positive" : "bg-text-muted"}`} />{c.status}</span></td>
                <td className="px-4 py-2 text-right text-text-primary" style={{ fontFeatureSettings: '"tnum"' }}>${Number(c.spend).toLocaleString()}</td>
                <td className="px-4 py-2 text-right text-text-primary" style={{ fontFeatureSettings: '"tnum"' }}>{c.leads}</td>
                <td className="px-4 py-2 text-right text-text-primary" style={{ fontFeatureSettings: '"tnum"' }}>${Number(c.cpl).toFixed(0)}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditRow({ id: c.id, channel_id: c.channel_id, name: c.name, status: c.status, spend: c.spend.toString(), leads: c.leads.toString(), cpl: c.cpl.toString() })} className="rounded px-2 py-1 text-xs text-text-muted hover:text-text-primary">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="rounded p-1 text-text-muted hover:text-negative"><Trash2 size={12} /></button>
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
