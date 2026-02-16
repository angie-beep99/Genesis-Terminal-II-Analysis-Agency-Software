import { createClient } from "@/lib/supabase/server";
import OverviewContent from "@/components/overview/overview-content";
import type {
  MonthlyMetric,
  DailyPerformance,
  Lead,
  Insight,
  ChannelWithLeads,
  Campaign,
  Channel,
} from "@/lib/types";

export default async function OverviewPage() {
  const supabase = createClient();

  // Fetch monthly metrics (most recent 2 months for comparison)
  const { data: metrics } = await supabase
    .from("monthly_metrics")
    .select("*")
    .order("month", { ascending: false })
    .limit(2);

  const currentMetric = (metrics?.[0] as MonthlyMetric) ?? null;
  const previousMetric = (metrics?.[1] as MonthlyMetric) ?? null;

  // Fetch daily performance (last 90 days to support all toggles)
  const { data: dailyRaw } = await supabase
    .from("daily_performance")
    .select("*")
    .order("date", { ascending: true });

  const dailyPerformance = (dailyRaw as DailyPerformance[]) ?? [];

  // Fetch channels with their campaign lead totals
  const { data: channelsRaw } = await supabase
    .from("channels")
    .select("*");

  const { data: campaignsRaw } = await supabase
    .from("campaigns")
    .select("*");

  const channelList = (channelsRaw as Channel[]) ?? [];
  const campaignList = (campaignsRaw as Campaign[]) ?? [];

  const channels: ChannelWithLeads[] = channelList.map((ch) => {
    const channelCampaigns = campaignList.filter((c) => c.channel_id === ch.id);
    const total_leads = channelCampaigns.reduce(
      (sum, c) => sum + (Number(c.leads) || 0),
      0
    );
    return { ...ch, total_leads };
  });

  // Fetch leads sorted by most recent
  const { data: leadsRaw } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const leads = (leadsRaw as Lead[]) ?? [];

  // Fetch insights sorted by most recent
  const { data: insightsRaw } = await supabase
    .from("insights")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  const insights = (insightsRaw as Insight[]) ?? [];

  return (
    <OverviewContent
      currentMetric={currentMetric}
      previousMetric={previousMetric}
      dailyPerformance={dailyPerformance}
      channels={channels}
      leads={leads}
      insights={insights}
    />
  );
}
