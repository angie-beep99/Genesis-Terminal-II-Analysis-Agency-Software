"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Users, DollarSign, TrendingUp, ChevronRight } from "lucide-react";
import type { Company } from "@/lib/types";

interface AdminDashboardProps {
  companies: Company[];
  totalCompanies: number;
  totalLeads: number;
  totalSpend: number;
  totalRevenue: number;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export default function AdminDashboard({
  companies,
  totalCompanies,
  totalLeads,
  totalSpend,
  totalRevenue,
}: AdminDashboardProps) {
  const stats = [
    { label: "Active Companies", value: totalCompanies.toString(), icon: Building2, color: "text-blue-400" },
    { label: "Total Leads", value: totalLeads.toLocaleString(), icon: Users, color: "text-positive" },
    { label: "Total Ad Spend", value: fmt(totalSpend), icon: DollarSign, color: "text-gold" },
    { label: "Revenue Influenced", value: fmt(totalRevenue), icon: TrendingUp, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon size={16} className={stat.color} />
                <span className="text-xs text-text-muted">{stat.label}</span>
              </div>
              <p
                className="text-xl font-semibold text-text-primary"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Company list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <h2 className="mb-3 text-sm font-medium text-text-primary">
          Companies
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Link
              key={company.id}
              href={`/admin/company/${company.id}`}
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-gold"
            >
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {company.name}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {company.industry ?? "—"}
                </p>
                {company.contact_email && (
                  <p className="mt-0.5 text-xs text-text-muted">
                    {company.contact_email}
                  </p>
                )}
              </div>
              <ChevronRight
                size={16}
                className="text-text-muted transition-colors group-hover:text-gold"
              />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
