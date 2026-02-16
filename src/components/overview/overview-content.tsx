"use client";

import MetricCards from "./metric-cards";
import PerformanceChart from "./performance-chart";
import ChannelBreakdown from "./channel-breakdown";
import LeadPipeline from "./lead-pipeline";
import RecentLeads from "./recent-leads";
import TeamInsights from "./team-insights";
import type {
  MonthlyMetric,
  DailyPerformance,
  ChannelWithLeads,
  Lead,
  Insight,
} from "@/lib/types";

interface OverviewContentProps {
  currentMetric: MonthlyMetric | null;
  previousMetric: MonthlyMetric | null;
  dailyPerformance: DailyPerformance[];
  channels: ChannelWithLeads[];
  leads: Lead[];
  insights: Insight[];
}

export default function OverviewContent({
  currentMetric,
  previousMetric,
  dailyPerformance,
  channels,
  leads,
  insights,
}: OverviewContentProps) {
  return (
    <div className="space-y-6">
      {/* Section 1: Big Four metric cards */}
      <MetricCards current={currentMetric} previous={previousMetric} />

      {/* Section 2 & 3: Chart + Channel breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PerformanceChart data={dailyPerformance} />
        </div>
        <div>
          <ChannelBreakdown channels={channels} />
        </div>
      </div>

      {/* Section 4: Lead pipeline */}
      <LeadPipeline leads={leads} />

      {/* Section 5 & 6: Recent leads + Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentLeads leads={leads} />
        <TeamInsights insights={insights} />
      </div>
    </div>
  );
}
