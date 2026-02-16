import { createClient } from "@/lib/supabase/server";
import ChannelsContent from "@/components/channels/channels-content";
import type { Channel, Campaign, DailyPerformance, Insight } from "@/lib/types";

export default async function ChannelsPage() {
  const supabase = createClient();

  const [
    { data: channelsRaw },
    { data: campaignsRaw },
    { data: dailyRaw },
    { data: insightsRaw },
  ] = await Promise.all([
    supabase.from("channels").select("*").order("name"),
    supabase.from("campaigns").select("*"),
    supabase.from("daily_performance").select("*").order("date", { ascending: true }),
    supabase.from("insights").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <ChannelsContent
      channels={(channelsRaw as Channel[]) ?? []}
      campaigns={(campaignsRaw as Campaign[]) ?? []}
      dailyPerformance={(dailyRaw as DailyPerformance[]) ?? []}
      insights={(insightsRaw as Insight[]) ?? []}
    />
  );
}
