"use client";

import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";
import { updateCompanyAdmin } from "@/app/admin/company/[id]/actions";
import type { Company, User } from "@/lib/types";

interface Props {
  company: Company;
  users: User[];
}

const roleBadge: Record<string, string> = {
  owner: "border-gold/30 text-gold bg-gold/5",
  admin: "border-blue-400/30 text-blue-400 bg-blue-400/5",
  member: "border-positive/30 text-positive bg-positive/5",
  viewer: "border-text-muted/30 text-text-muted bg-text-muted/5",
};

export default function AdminSettingsTab({ company, users }: Props) {
  const [name, setName] = useState(company.name);
  const [industry, setIndustry] = useState(company.industry ?? "");
  const [website, setWebsite] = useState(company.website ?? "");
  const [contactEmail, setContactEmail] = useState(company.contact_email ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await updateCompanyAdmin(company.id, {
      name,
      industry,
      website,
      contact_email: contactEmail,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Company details */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-text-primary">Company Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company Name" value={name} onChange={setName} />
          <Field label="Industry" value={industry} onChange={setIndustry} />
          <Field label="Website" value={website} onChange={setWebsite} />
          <Field label="Contact Email" value={contactEmail} onChange={setContactEmail} />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          {saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saving ? "Saving..." : saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      {/* Users */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-text-primary">
          Team Members ({users.length})
        </h3>
        {users.length === 0 ? (
          <p className="text-sm text-text-muted">No users found for this company.</p>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-2">
                <div>
                  <p className="text-sm text-text-primary">{user.full_name ?? user.email}</p>
                  <p className="text-xs text-text-muted">{user.email}</p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[11px] capitalize ${roleBadge[user.role] ?? roleBadge.member}`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-text-muted">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-gold"
      />
    </div>
  );
}
