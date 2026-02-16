"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, CheckCircle } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { updateCompany } from "@/app/(dashboard)/settings/actions";
import type { Company } from "@/lib/types";

interface CompanyTabProps {
  company: Company;
}

export default function CompanyTab({ company }: CompanyTabProps) {
  const [name, setName] = useState(company.name);
  const [industry, setIndustry] = useState(company.industry ?? "");
  const [website, setWebsite] = useState(company.website ?? "");
  const [contactEmail, setContactEmail] = useState(
    company.contact_email ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Ownership countdown
  const ownershipDate = company.terminal_ownership_date
    ? parseISO(company.terminal_ownership_date)
    : null;
  const today = new Date();
  const daysRemaining = ownershipDate
    ? Math.max(0, differenceInDays(ownershipDate, today))
    : 0;

  // Calculate progress bar: percentage of 180 days elapsed
  const totalDays = 180;
  const partnershipStart = company.partnership_start
    ? parseISO(company.partnership_start)
    : null;
  const elapsed = partnershipStart
    ? differenceInDays(today, partnershipStart)
    : 0;
  const progressPct = Math.min(100, Math.max(0, (elapsed / totalDays) * 100));

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await updateCompany(company.id, {
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Editable form */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-medium text-text-primary">
          Company Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company Name" value={name} onChange={setName} />
          <Field label="Industry" value={industry} onChange={setIndustry} />
          <Field label="Website" value={website} onChange={setWebsite} />
          <Field
            label="Contact Email"
            value={contactEmail}
            onChange={setContactEmail}
            type="email"
          />
        </div>

        {/* Partnership start (read-only) */}
        {company.partnership_start && (
          <div className="mt-4">
            <label className="mb-1 block text-xs text-text-muted">
              Partnership Start Date
            </label>
            <p
              className="text-sm text-text-primary"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {format(parseISO(company.partnership_start), "MMMM d, yyyy")}
            </p>
          </div>
        )}

        {/* Ownership countdown */}
        {ownershipDate && (
          <div className="mt-6 rounded-lg border border-border bg-background p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted">
                  Terminal Ownership Date
                </p>
                <p
                  className="text-sm font-medium text-text-primary"
                  style={{ fontFeatureSettings: '"tnum"' }}
                >
                  {format(ownershipDate, "MMMM d, yyyy")}
                </p>
              </div>
              <span
                className="rounded-full bg-gold/10 px-3 py-1 text-sm font-semibold text-gold"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                {daysRemaining} days remaining
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p
              className="mt-1 text-right text-[11px] text-text-muted"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {progressPct.toFixed(0)}% of 180 days
            </p>
          </div>
        )}

        {/* Save button */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saved ? <CheckCircle size={14} /> : <Save size={14} />}
            {saving ? "Saving..." : saved ? "Saved" : "Save Changes"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-text-muted">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-gold"
      />
    </div>
  );
}
