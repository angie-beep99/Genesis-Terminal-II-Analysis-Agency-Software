"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, subDays } from "date-fns";
import type { DailyPerformance } from "@/lib/types";

interface PerformanceChartProps {
  data: DailyPerformance[];
}

type Range = "7D" | "30D" | "90D";

interface TooltipPayloadEntry {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
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

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const [range, setRange] = useState<Range>("30D");

  const filtered = useMemo(() => {
    const days = range === "7D" ? 7 : range === "30D" ? 30 : 90;
    const cutoff = subDays(new Date(), days);
    return data
      .filter((d) => parseISO(d.date) >= cutoff)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data, range]);

  const chartData = filtered.map((d) => ({
    date: d.date,
    Spend: Number(d.spend),
    Leads: Number(d.leads),
  }));

  const ranges: Range[] = ["7D", "30D", "90D"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-primary">Performance</h3>
        <div className="flex gap-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-md px-3 py-1 text-xs transition-colors ${
                range === r
                  ? "bg-gold/10 text-gold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#71717A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#71717A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
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
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="spend"
              type="monotone"
              dataKey="Spend"
              stroke="#71717A"
              strokeWidth={2}
              fill="url(#spendGradient)"
            />
            <Area
              yAxisId="leads"
              type="monotone"
              dataKey="Leads"
              stroke="#C9A96E"
              strokeWidth={2}
              fill="url(#leadsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
