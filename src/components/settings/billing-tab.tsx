"use client";

import { motion } from "framer-motion";
import { format, parseISO, addMonths } from "date-fns";
import { CreditCard, Info } from "lucide-react";
import type { Company } from "@/lib/types";

interface BillingTabProps {
  company: Company;
}

export default function BillingTab({ company }: BillingTabProps) {
  const partnershipStart = company.partnership_start
    ? parseISO(company.partnership_start)
    : null;

  // Derive next billing date as next month from now (just for display)
  const nextBilling = addMonths(new Date(), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard size={16} className="text-gold" />
          <h3 className="text-sm font-medium text-text-primary">
            Billing Information
          </h3>
        </div>

        <div className="space-y-4">
          <Row label="Current Plan" value="Growth Partner" />
          <Row
            label="Monthly Fee"
            value="$4,500"
            mono
          />
          <Row
            label="Next Billing Date"
            value={format(nextBilling, "MMMM d, yyyy")}
            mono
          />
          {partnershipStart && (
            <Row
              label="Partnership Start"
              value={format(partnershipStart, "MMMM d, yyyy")}
              mono
            />
          )}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-border bg-card p-4">
        <Info size={16} className="mt-0.5 flex-shrink-0 text-text-muted" />
        <p className="text-sm leading-relaxed text-text-muted">
          Contact your growth team for billing questions, plan changes, or
          invoice requests. Payments are processed automatically each month.
        </p>
      </div>
    </motion.div>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-text-muted">{label}</span>
      <span
        className="text-sm font-medium text-text-primary"
        style={mono ? { fontFeatureSettings: '"tnum"' } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
