"use client";

import { useState } from "react";
import { Trash2, Send } from "lucide-react";
import { format, parseISO } from "date-fns";
import { createInsight, deleteInsight } from "@/app/admin/company/[id]/actions";
import type { Insight } from "@/lib/types";

interface Props {
  companyId: string;
  insights: Insight[];
}

export default function AdminInsightsTab({ companyId, insights }: Props) {
  const [rows, setRows] = useState(insights);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!content.trim()) return;
    setSaving(true);
    const result = await createInsight(companyId, content.trim(), category || null);
    if (result.success) {
      setRows((prev) => [
        {
          id: `new-${Date.now()}`,
          company_id: companyId,
          content: content.trim(),
          category: category || null,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setContent("");
      setCategory("");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await deleteInsight(id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-4">
      {/* Write insight */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-medium text-text-primary">
          Write an Insight
        </h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a plain-English insight for the client..."
          rows={4}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-gold placeholder:text-text-muted"
        />
        <div className="mt-3 flex items-center gap-3">
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (optional)"
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary outline-none focus:border-gold placeholder:text-text-muted"
          />
          <button
            onClick={handleCreate}
            disabled={saving || !content.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-1.5 text-xs font-medium text-background hover:opacity-90 disabled:opacity-50"
          >
            <Send size={12} />
            {saving ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      {/* Existing insights */}
      <div className="space-y-2">
        {rows.map((insight) => (
          <div
            key={insight.id}
            className="flex items-start justify-between rounded-xl border border-border bg-card p-4"
          >
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-text-primary">
                {insight.content}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-text-muted">
                {insight.category && (
                  <span className="rounded-full border border-border bg-background px-2 py-0.5">
                    {insight.category}
                  </span>
                )}
                <span style={{ fontFeatureSettings: '"tnum"' }}>
                  {format(parseISO(insight.created_at), "MMM d, yyyy")}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(insight.id)}
              className="ml-3 rounded p-1 text-text-muted hover:text-negative"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
