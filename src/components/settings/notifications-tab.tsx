"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, CheckCircle } from "lucide-react";

interface NotifPref {
  label: string;
  key: string;
  email: boolean;
  inApp: boolean;
}

const defaultPrefs: NotifPref[] = [
  { label: "New Lead", key: "new_lead", email: true, inApp: true },
  { label: "Lead Status Change", key: "lead_status", email: false, inApp: true },
  { label: "Weekly Summary", key: "weekly_summary", email: true, inApp: false },
  { label: "Monthly Report", key: "monthly_report", email: true, inApp: true },
  { label: "New Inbox Message", key: "inbox_message", email: false, inApp: true },
  { label: "Budget Alert", key: "budget_alert", email: true, inApp: true },
];

export default function NotificationsTab() {
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [saved, setSaved] = useState(false);

  function toggle(key: string, channel: "email" | "inApp") {
    setPrefs((prev) =>
      prev.map((p) =>
        p.key === key ? { ...p, [channel]: !p[channel] } : p
      )
    );
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="rounded-xl border border-border bg-card">
        {/* Header row */}
        <div className="flex items-center border-b border-border px-5 py-3 text-xs text-text-muted">
          <span className="flex-1">Category</span>
          <span className="w-20 text-center">Email</span>
          <span className="w-20 text-center">In-App</span>
        </div>

        {prefs.map((pref, i) => (
          <div
            key={pref.key}
            className={`flex items-center px-5 py-3 ${
              i !== prefs.length - 1 ? "border-b border-border/50" : ""
            }`}
          >
            <span className="flex-1 text-sm text-text-primary">
              {pref.label}
            </span>
            <div className="flex w-20 justify-center">
              <Toggle
                checked={pref.email}
                onChange={() => toggle(pref.key, "email")}
              />
            </div>
            <div className="flex w-20 justify-center">
              <Toggle
                checked={pref.inApp}
                onChange={() => toggle(pref.key, "inApp")}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        {saved ? <CheckCircle size={14} /> : <Save size={14} />}
        {saved ? "Saved" : "Save Preferences"}
      </button>
    </motion.div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative h-5 w-9 rounded-full transition-colors ${
        checked ? "bg-gold" : "bg-border"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-text-primary transition-transform ${
          checked ? "left-[1.125rem]" : "left-0.5"
        }`}
      />
    </button>
  );
}
