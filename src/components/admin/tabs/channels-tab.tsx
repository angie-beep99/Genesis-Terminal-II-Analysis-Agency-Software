"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { upsertChannel, deleteChannel } from "@/app/admin/company/[id]/actions";
import type { Channel } from "@/lib/types";

interface Props {
  companyId: string;
  channels: Channel[];
}

interface EditRow {
  id: string | null;
  name: string;
  status: string;
}

export default function AdminChannelsTab({ companyId, channels }: Props) {
  const [rows, setRows] = useState(channels);
  const [editRow, setEditRow] = useState<EditRow | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!editRow) return;
    setSaving(true);
    const result = await upsertChannel(companyId, editRow.id, {
      name: editRow.name,
      status: editRow.status,
    });
    if (result.success) {
      if (editRow.id) {
        setRows((prev) => prev.map((r) => (r.id === editRow.id ? { ...r, name: editRow.name, status: editRow.status } : r)));
      } else {
        setRows((prev) => [...prev, { id: `new-${Date.now()}`, company_id: companyId, name: editRow.name, status: editRow.status, created_at: new Date().toISOString() }]);
      }
      setEditRow(null);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await deleteChannel(id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">{rows.length} channels</p>
        <button onClick={() => setEditRow({ id: null, name: "", status: "active" })} className="flex items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-xs font-medium text-background hover:opacity-90">
          <Plus size={14} /> Add Channel
        </button>
      </div>

      {editRow && (
        <div className="rounded-xl border border-gold/30 bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-text-muted">Name</label>
              <input type="text" value={editRow.name} onChange={(e) => setEditRow({ ...editRow, name: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Status</label>
              <select value={editRow.status} onChange={(e) => setEditRow({ ...editRow, status: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleSave} disabled={saving || !editRow.name.trim()} className="flex items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-xs font-medium text-background hover:opacity-90 disabled:opacity-50">
              <Save size={12} /> Save
            </button>
            <button onClick={() => setEditRow(null)} className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:text-text-primary">Cancel</button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card">
        {rows.map((ch, i) => (
          <div key={ch.id} className={`flex items-center justify-between px-5 py-3 ${i !== rows.length - 1 ? "border-b border-border/50" : ""}`}>
            <div className="flex items-center gap-3">
              <span className={`h-2 w-2 rounded-full ${ch.status === "active" ? "bg-positive" : "bg-yellow-500"}`} />
              <span className="text-sm text-text-primary">{ch.name}</span>
              <span className="text-xs text-text-muted capitalize">{ch.status}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setEditRow({ id: ch.id, name: ch.name, status: ch.status })} className="rounded px-2 py-1 text-xs text-text-muted hover:text-text-primary">Edit</button>
              <button onClick={() => handleDelete(ch.id)} className="rounded p-1 text-text-muted hover:text-negative"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
