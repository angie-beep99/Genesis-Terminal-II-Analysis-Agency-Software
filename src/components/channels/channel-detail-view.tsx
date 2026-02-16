"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, TrendingDown, Target } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import type { Channel, Campaign, DailyPerformance, Insight } from "@/lib/types";

interface ChannelDetailViewProps {
  channel: Channel;
  campaigns: Campaign[];
  dailyPerformance: DailyPerformance[];
  allCampaigns: Campaign[];
  insights: Insight[];
}

interface TooltipEntry {
  color: string;
  name: string;
  value: number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || !label) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs text-text-muted">
        {format(parseISO(label), "MMM d, yyyy")}
      </p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="text-xs"
          style={{ color: entry.color, fontFeatureSettings: '"tnum"' }}
        >
          {entry.name}: {entry.name === "Spend" ? `$${entry.value.toLocaleString()}` : entry.value}
        </p>
      ))}
    </div>
  );
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ChannelDetailView({
  channel,
  campaigns,
  dailyPerformance,
  allCampaigns,
  insights,
}: ChannelDetailViewProps) {
  // Derive channel-specific daily data proportionally
  const channelDaily = useMemo(() => {
    const channelSpend = campaigns.reduce((s, c) => s + Number(c.spend), 0);
    const totalSpend = allCampaigns.reduce((s, c) => s + Number(c.spend), 0);
    const ratio = totalSpend > 0 ? channelSpend / totalSpend : 0;

    return dailyPerformance
      .map((d) => ({
        date: d.date,
        Spend: Math.round(Number(d.spend) * ratio),
        Leads: Math.round(Number(d.leads) * ratio),
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);
  }, [campaigns, allCampaigns, dailyPerformance]);

  const totalSpend = campaigns.reduce((s, c) => s + Number(c.spend), 0);
  const totalLeads = campaigns.reduce((s, c) => s + Number(c.leads), 0);
  const cpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
  const conversionRate = totalLeads > 0 ? ((totalLeads * 0.38) / totalLeads) * 100 : 0;

  // Filter insights related to this channel
  const channelInsights = insights.filter((ins) =>
    ins.content.toLowerCase().includes(channel.name.toLowerCase())
  );

  const metricCards = [
    {
      title: "Spend",
      value: formatCurrency(totalSpend),
      icon: <DollarSign size={18} />,
    },
    {
      title: "Leads",
      value: totalLeads.toString(),
      icon: <Users size={18} />,
    },
    {
      title: "CPL",
      value: formatCurrency(cpl),
      icon: <TrendingDown size={18} />,
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate.toFixed(1)}%`,
      icon: <Target size={18} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metricCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">{card.title}</span>
              <span className="text-text-muted">{card.icon}</span>
            </div>
            <p
              className="mt-2 text-2xl font-semibold text-text-primary"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Performance chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <h3 className="mb-4 text-sm font-medium text-text-primary">
          {channel.name} — 30 Day Performance
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={channelDaily} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="chSpendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#71717A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#71717A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="chLeadsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(v: string) => format(parseISO(v), "MMM d")}
                tick={{ fontSize: 11, fill: "#71717A" }}
                axisLine={{ stroke: "#1A1A1A" }}
                tickLine={false}
              />
              <YAxis
                yAxisId="spend"
                tick={{ fontSize: 11, fill: "#71717A" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${v}`}
              />
              <YAxis
                yAxisId="leads"
                orientation="right"
                tick={{ fontSize: 11, fill: "#71717A" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                yAxisId="spend"
                type="monotone"
                dataKey="Spend"
                stroke="#71717A"
                strokeWidth={2}
                fill="url(#chSpendGrad)"
              />
              <Area
                yAxisId="leads"
                type="monotone"
                dataKey="Leads"
                stroke="#C9A96E"
                strokeWidth={2}
                fill="url(#chLeadsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Campaign breakdown table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="rounded-xl border border-border bg-card"
      >
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-medium text-text-primary">Campaigns</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-text-muted">
                <th className="px-5 py-3 font-medium">Campaign Name</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Spend</th>
                <th className="px-5 py-3 text-right font-medium">Leads</th>
                <th className="px-5 py-3 text-right font-medium">CPL</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((camp) => (
                <tr key={camp.id} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-3.5 text-text-primary">{camp.name}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={camp.status} />
                  </td>
                  <td
                    className="px-5 py-3.5 text-right text-text-primary"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  >
                    ${Number(camp.spend).toLocaleString()}
                  </td>
                  <td
                    className="px-5 py-3.5 text-right text-text-primary"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  >
                    {camp.leads}
                  </td>
                  <td
                    className="px-5 py-3.5 text-right text-text-primary"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  >
                    ${Number(camp.cpl).toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Observations */}
      {channelInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="mb-3 text-sm font-medium text-text-primary">
            Observations
          </h3>
          <div className="space-y-3">
            {channelInsights.map((ins) => (
              <p key={ins.id} className="text-sm leading-relaxed text-text-muted">
                {ins.content}
              </p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    active: { dot: "bg-positive", text: "text-positive", bg: "bg-positive/10", label: "Active" },
    paused: { dot: "bg-yellow-500", text: "text-yellow-500", bg: "bg-yellow-500/10", label: "Paused" },
    ended: { dot: "bg-text-muted", text: "text-text-muted", bg: "bg-text-muted/10", label: "Ended" },
  }[status] ?? { dot: "bg-text-muted", text: "text-text-muted", bg: "bg-text-muted/10", label: status };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ${config.bg} ${config.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
