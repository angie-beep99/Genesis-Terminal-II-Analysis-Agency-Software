"use client";

import { motion } from "framer-motion";
import { DollarSign, Users, UserCheck, TrendingDown } from "lucide-react";
import type { MonthlyMetric } from "@/lib/types";

interface MetricCardsProps {
  current: MonthlyMetric | null;
  previous: MonthlyMetric | null;
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

interface CardProps {
  title: string;
  value: string;
  change: number;
  invertColors?: boolean;
  highlight?: boolean;
  icon: React.ReactNode;
  index: number;
}

function Card({ title, value, change, invertColors, highlight, icon, index }: CardProps) {
  const isPositive = change >= 0;
  // For CPA, negative change is good (green)
  const isGood = invertColors ? !isPositive : isPositive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted">{title}</span>
        <span className="text-text-muted">{icon}</span>
      </div>
      <p
        className={`mt-2 text-2xl font-semibold ${highlight ? "text-gold" : "text-text-primary"}`}
        style={{ fontFeatureSettings: '"tnum"' }}
      >
        {value}
      </p>
      <p className="mt-1 text-xs" style={{ fontFeatureSettings: '"tnum"' }}>
        <span className={isGood ? "text-positive" : "text-negative"}>
          {isPositive ? "+" : ""}
          {change.toFixed(1)}%
        </span>
        <span className="ml-1 text-text-muted">vs last period</span>
      </p>
    </motion.div>
  );
}

export default function MetricCards({ current, previous }: MetricCardsProps) {
  const cur = current ?? {
    total_spend: 0,
    total_leads: 0,
    qualified_leads: 0,
    cost_per_lead: 0,
  };
  const prev = previous ?? {
    total_spend: 0,
    total_leads: 0,
    qualified_leads: 0,
    cost_per_lead: 0,
  };

  const cards = [
    {
      title: "Money Invested",
      value: formatCurrency(cur.total_spend),
      change: pctChange(cur.total_spend, prev.total_spend),
      icon: <DollarSign size={18} />,
    },
    {
      title: "Leads Generated",
      value: formatNumber(cur.total_leads),
      change: pctChange(cur.total_leads, prev.total_leads),
      icon: <Users size={18} />,
    },
    {
      title: "Qualified Leads",
      value: formatNumber(cur.qualified_leads),
      change: pctChange(cur.qualified_leads, prev.qualified_leads),
      icon: <UserCheck size={18} />,
      highlight: true,
    },
    {
      title: "Cost Per Acquisition",
      value: formatCurrency(cur.cost_per_lead),
      change: pctChange(cur.cost_per_lead, prev.cost_per_lead),
      invertColors: true,
      icon: <TrendingDown size={18} />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card, i) => (
        <Card key={card.title} index={i} {...card} />
      ))}
    </div>
  );
}
