"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Report, MonthlyMetric, Campaign, Lead } from "@/lib/types";

interface ReportBodyProps {
  report: Report;
  metrics: MonthlyMetric[];
  campaigns: Campaign[];
  leads: Lead[];
}

interface BarTooltipEntry {
  color: string;
  name: string;
  value: number;
}

interface BarTooltipProps {
  active?: boolean;
  payload?: BarTooltipEntry[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: BarTooltipProps) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg print:hidden">
      <p className="mb-1 text-xs text-text-muted">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="text-xs"
          style={{ color: entry.color, fontFeatureSettings: '"tnum"' }}
        >
          {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
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

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 py-2 last:border-0">
      <span className="text-sm text-text-muted">{label}</span>
      <span
        className="text-sm font-medium text-text-primary"
        style={{ fontFeatureSettings: '"tnum"' }}
      >
        {value}
      </span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 mt-8 text-lg font-semibold text-text-primary first:mt-0">
      {children}
    </h2>
  );
}

export default function ReportBody({
  report,
  metrics,
  campaigns,
  leads,
}: ReportBodyProps) {
  const latestMetric = metrics[0];
  const previousMetric = metrics[1];

  const wonLeads = leads.filter((l) => l.status === "won");
  const totalPipeline = leads
    .filter((l) => !["won", "lost", "churned"].includes(l.status))
    .reduce((s, l) => s + (Number(l.value) || 0), 0);

  // Channel performance data for chart
  const channelMap = new Map<string, { spend: number; leads: number }>();
  for (const c of campaigns) {
    const key = c.channel_id;
    const existing = channelMap.get(key) ?? { spend: 0, leads: 0 };
    channelMap.set(key, {
      spend: existing.spend + Number(c.spend),
      leads: existing.leads + Number(c.leads),
    });
  }

  const channelNames: Record<string, string> = {};
  // Map channel_id to name via campaigns
  const uniqueChannels = Array.from(new Set(campaigns.map((c) => c.channel_id)));
  const channelLabels = ["Google Ads", "Meta", "Bing", "TikTok"];
  uniqueChannels.forEach((chId, i) => {
    channelNames[chId] = channelLabels[i] ?? `Channel ${i + 1}`;
  });

  const channelChartData = Array.from(channelMap.entries()).map(([id, data]) => ({
    name: channelNames[id] ?? id.slice(0, 8),
    Spend: data.spend,
    Leads: data.leads,
  }));

  // Lead status breakdown
  const statusCounts: Record<string, number> = {};
  for (const l of leads) {
    statusCounts[l.status] = (statusCounts[l.status] ?? 0) + 1;
  }

  // Campaign table (top 10 by leads)
  const topCampaigns = [...campaigns]
    .sort((a, b) => Number(b.leads) - Number(a.leads))
    .slice(0, 10);

  if (report.type === "channel") {
    // Channel-specific report
    return (
      <div>
        <SectionTitle>Channel Performance Overview</SectionTitle>
        <p className="mb-6 text-sm leading-relaxed text-text-muted">
          This report provides a comparative analysis of all active advertising
          channels for the reporting period.
        </p>

        <div className="mb-8 h-64 print:h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#71717A" }}
                axisLine={{ stroke: "#1A1A1A" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#71717A" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="Spend" fill="#71717A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <SectionTitle>Lead Volume by Channel</SectionTitle>
        <div className="mb-8 h-64 print:h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#71717A" }}
                axisLine={{ stroke: "#1A1A1A" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#71717A" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="Leads" fill="#C9A96E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <SectionTitle>Campaign Breakdown</SectionTitle>
        <CampaignTable campaigns={topCampaigns} />
      </div>
    );
  }

  // Monthly/quarterly report (default)
  return (
    <div>
      <SectionTitle>Executive Summary</SectionTitle>
      <p className="mb-6 text-sm leading-relaxed text-text-muted">
        This report covers the key performance metrics, channel analysis, and
        lead pipeline status for the reporting period.
      </p>

      {/* KPI Summary */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-medium text-text-primary">
          Key Metrics
        </h3>
        {latestMetric && (
          <>
            <MetricRow label="Total Spend" value={formatCurrency(latestMetric.total_spend)} />
            <MetricRow label="Total Leads" value={latestMetric.total_leads.toString()} />
            <MetricRow label="Qualified Leads" value={latestMetric.qualified_leads.toString()} />
            <MetricRow label="Cost Per Lead" value={formatCurrency(latestMetric.cost_per_lead)} />
            <MetricRow
              label="Cost Per Qualified Lead"
              value={formatCurrency(latestMetric.cost_per_qualified_lead)}
            />
            <MetricRow
              label="Revenue Influenced"
              value={formatCurrency(latestMetric.revenue_influenced)}
            />
          </>
        )}
        {previousMetric && latestMetric && (
          <div className="mt-3 border-t border-border pt-3">
            <p className="text-xs text-text-muted">
              vs Previous Period: Spend{" "}
              <span className="text-text-primary">
                {(
                  ((latestMetric.total_spend - previousMetric.total_spend) /
                    previousMetric.total_spend) *
                  100
                ).toFixed(1)}
                %
              </span>
              , Leads{" "}
              <span className="text-text-primary">
                {(
                  ((latestMetric.total_leads - previousMetric.total_leads) /
                    previousMetric.total_leads) *
                  100
                ).toFixed(1)}
                %
              </span>
              , CPL{" "}
              <span className="text-text-primary">
                {(
                  ((latestMetric.cost_per_lead - previousMetric.cost_per_lead) /
                    previousMetric.cost_per_lead) *
                  100
                ).toFixed(1)}
                %
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Channel chart */}
      <SectionTitle>Channel Performance</SectionTitle>
      <div className="mb-8 h-64 print:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={channelChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#71717A" }}
              axisLine={{ stroke: "#1A1A1A" }}
              tickLine={false}
            />
            <YAxis
              yAxisId="spend"
              tick={{ fontSize: 11, fill: "#71717A" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
            />
            <YAxis
              yAxisId="leads"
              orientation="right"
              tick={{ fontSize: 11, fill: "#71717A" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar yAxisId="spend" dataKey="Spend" fill="#71717A" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="leads" dataKey="Leads" fill="#C9A96E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pipeline */}
      <SectionTitle>Pipeline Status</SectionTitle>
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <MetricRow label="Active Pipeline Value" value={formatCurrency(totalPipeline)} />
        <MetricRow label="Total Won" value={wonLeads.length.toString()} />
        <MetricRow
          label="Won Value"
          value={formatCurrency(
            wonLeads.reduce((s, l) => s + (Number(l.value) || 0), 0)
          )}
        />
        <MetricRow label="New Leads" value={(statusCounts["new"] ?? 0).toString()} />
        <MetricRow label="Contacted" value={(statusCounts["contacted"] ?? 0).toString()} />
        <MetricRow label="Qualified" value={(statusCounts["qualified"] ?? 0).toString()} />
        <MetricRow label="Proposal Sent" value={(statusCounts["proposal_sent"] ?? 0).toString()} />
        <MetricRow label="Lost" value={(statusCounts["lost"] ?? 0).toString()} />
      </div>

      {/* Campaign table */}
      <SectionTitle>Top Campaigns</SectionTitle>
      <CampaignTable campaigns={topCampaigns} />
    </div>
  );
}

function CampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-text-muted">
            <th className="px-4 py-3 font-medium">Campaign</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Spend</th>
            <th className="px-4 py-3 text-right font-medium">Leads</th>
            <th className="px-4 py-3 text-right font-medium">CPL</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} className="border-b border-border/50 last:border-0">
              <td className="px-4 py-3 text-text-primary">{c.name}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ${
                    c.status === "active"
                      ? "bg-positive/10 text-positive"
                      : c.status === "paused"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-text-muted/10 text-text-muted"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      c.status === "active"
                        ? "bg-positive"
                        : c.status === "paused"
                          ? "bg-yellow-500"
                          : "bg-text-muted"
                    }`}
                  />
                  {c.status}
                </span>
              </td>
              <td
                className="px-4 py-3 text-right text-text-primary"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                ${Number(c.spend).toLocaleString()}
              </td>
              <td
                className="px-4 py-3 text-right text-text-primary"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                {c.leads}
              </td>
              <td
                className="px-4 py-3 text-right text-text-primary"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                ${Number(c.cpl).toFixed(0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
