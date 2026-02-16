"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { format, parseISO, getDay } from "date-fns";
import type { Channel, Campaign, DailyPerformance } from "@/lib/types";

interface AllChannelsViewProps {
  channels: Channel[];
  campaigns: Campaign[];
  dailyPerformance: DailyPerformance[];
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface SparkTooltipEntry {
  value: number;
  name: string;
}

interface SparkTooltipProps {
  active?: boolean;
  payload?: SparkTooltipEntry[];
  label?: string;
}

function SparkTooltip({ active, payload, label }: SparkTooltipProps) {
  if (!active || !payload || !label) return null;
  return (
    <div className="rounded border border-border bg-card px-2 py-1 text-[10px] text-text-primary shadow">
      {format(parseISO(label), "MMM d")} &middot; {payload[0]?.value ?? 0} leads
    </div>
  );
}

function getChannelDailyData(
  channelId: string,
  campaigns: Campaign[],
  allCampaigns: Campaign[],
  dailyPerformance: DailyPerformance[]
) {
  const channelCampaigns = campaigns.filter((c) => c.channel_id === channelId);
  const channelSpend = channelCampaigns.reduce((s, c) => s + Number(c.spend), 0);
  const totalSpend = allCampaigns.reduce((s, c) => s + Number(c.spend), 0);
  const ratio = totalSpend > 0 ? channelSpend / totalSpend : 0;

  return dailyPerformance
    .map((d) => ({
      date: d.date,
      leads: Math.round(Number(d.leads) * ratio),
      spend: Math.round(Number(d.spend) * ratio),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function getBestDay(data: { date: string; leads: number }[]): string {
  const dayTotals = [0, 0, 0, 0, 0, 0, 0];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  for (const d of data) {
    const day = getDay(parseISO(d.date));
    dayTotals[day] += d.leads;
    dayCounts[day] += 1;
  }
  let bestDay = 0;
  let bestAvg = 0;
  for (let i = 0; i < 7; i++) {
    const avg = dayCounts[i] > 0 ? dayTotals[i] / dayCounts[i] : 0;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestDay = i;
    }
  }
  return dayNames[bestDay];
}

export default function AllChannelsView({
  channels,
  campaigns,
  dailyPerformance,
}: AllChannelsViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Table header */}
      <div className="grid grid-cols-7 gap-2 border-b border-border px-5 py-3 text-xs font-medium text-text-muted">
        <span className="col-span-2">Channel</span>
        <span>Status</span>
        <span className="text-right">Spend</span>
        <span className="text-right">Leads</span>
        <span className="text-right">Qualified</span>
        <span className="text-right">CPL</span>
      </div>

      {/* Rows */}
      {channels.map((channel) => {
        const chCampaigns = campaigns.filter((c) => c.channel_id === channel.id);
        const totalSpend = chCampaigns.reduce((s, c) => s + Number(c.spend), 0);
        const totalLeads = chCampaigns.reduce((s, c) => s + Number(c.leads), 0);
        const qualifiedLeads = Math.round(totalLeads * 0.38);
        const cpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
        const cpql = qualifiedLeads > 0 ? totalSpend / qualifiedLeads : 0;
        const isExpanded = expandedId === channel.id;

        const channelDaily = getChannelDailyData(
          channel.id,
          campaigns,
          campaigns,
          dailyPerformance
        );

        const topCampaigns = [...chCampaigns]
          .sort((a, b) => Number(b.leads) - Number(a.leads))
          .slice(0, 3);

        const bestDay = getBestDay(channelDaily);

        return (
          <div key={channel.id} className="border-b border-border/50 last:border-0">
            <button
              onClick={() => setExpandedId(isExpanded ? null : channel.id)}
              className="grid w-full grid-cols-7 gap-2 px-5 py-3.5 text-left text-sm transition-colors hover:bg-background"
            >
              <span className="col-span-2 flex items-center gap-2 text-text-primary">
                <ChevronDown
                  size={14}
                  className={`text-text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
                {channel.name}
              </span>
              <span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ${
                    channel.status === "active"
                      ? "bg-positive/10 text-positive"
                      : "bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      channel.status === "active" ? "bg-positive" : "bg-yellow-500"
                    }`}
                  />
                  {channel.status === "active" ? "Active" : "Paused"}
                </span>
              </span>
              <span
                className="text-right text-text-primary"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                ${totalSpend.toLocaleString()}
              </span>
              <span
                className="text-right text-text-primary"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                {totalLeads}
              </span>
              <span
                className="text-right text-text-primary"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                {qualifiedLeads}
              </span>
              <span
                className="text-right text-text-primary"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                ${cpl.toFixed(0)}
              </span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-5 border-t border-border/50 bg-background/50 px-5 py-4 md:grid-cols-3">
                    {/* Mini sparkline */}
                    <div>
                      <p className="mb-2 text-xs font-medium text-text-muted">
                        30-Day Leads Trend
                      </p>
                      <div className="h-16">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={channelDaily.slice(-30)}>
                            <defs>
                              <linearGradient id={`spark-${channel.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Tooltip content={<SparkTooltip />} />
                            <Area
                              type="monotone"
                              dataKey="leads"
                              stroke="#C9A96E"
                              strokeWidth={1.5}
                              fill={`url(#spark-${channel.id})`}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Top 3 campaigns */}
                    <div>
                      <p className="mb-2 text-xs font-medium text-text-muted">
                        Top Campaigns
                      </p>
                      <div className="space-y-2">
                        {topCampaigns.map((camp, i) => (
                          <div key={camp.id} className="flex items-center justify-between text-xs">
                            <span className="text-text-primary">
                              <span className="text-text-muted">{i + 1}.</span>{" "}
                              {camp.name}
                            </span>
                            <span
                              className="text-text-muted"
                              style={{ fontFeatureSettings: '"tnum"' }}
                            >
                              {camp.leads} leads
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div>
                      <p className="mb-2 text-xs font-medium text-text-muted">
                        Stats
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-text-muted">Best Day</span>
                          <span className="text-text-primary">{bestDay}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Cost / Qualified Lead</span>
                          <span
                            className="text-text-primary"
                            style={{ fontFeatureSettings: '"tnum"' }}
                          >
                            ${cpql.toFixed(0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Active Campaigns</span>
                          <span className="text-text-primary">
                            {chCampaigns.filter((c) => c.status === "active").length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
