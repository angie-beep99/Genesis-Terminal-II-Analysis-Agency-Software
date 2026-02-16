"use client";

import { motion } from "framer-motion";

const integrations = [
  { name: "HubSpot", letter: "H", color: "text-orange-400" },
  { name: "Salesforce", letter: "S", color: "text-blue-400" },
  { name: "Google Ads API", letter: "G", color: "text-yellow-400" },
  { name: "Meta API", letter: "M", color: "text-blue-500" },
  { name: "Slack", letter: "S", color: "text-purple-400" },
  { name: "Zapier", letter: "Z", color: "text-orange-500" },
];

export default function IntegrationsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {integrations.map((intg) => (
        <div
          key={intg.name}
          className="rounded-xl border border-border bg-card p-5 opacity-60"
        >
          {/* Logo placeholder */}
          <div
            className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-lg font-bold ${intg.color}`}
          >
            {intg.letter}
          </div>

          <h3 className="text-sm font-medium text-text-primary">
            {intg.name}
          </h3>

          <span className="mt-2 inline-flex rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-text-muted">
            Coming Soon
          </span>
        </div>
      ))}
    </motion.div>
  );
}
