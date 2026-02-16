import { createClient } from "@/lib/supabase/server";
import ReportsContent from "@/components/reports/reports-content";
import type { Report, MonthlyMetric, Campaign, Lead } from "@/lib/types";

export default async function ReportsPage() {
  const supabase = createClient();

  const [
    { data: reportsRaw },
    { data: metricsRaw },
    { data: campaignsRaw },
    { data: leadsRaw },
  ] = await Promise.all([
    supabase.from("reports").select("*").order("created_at", { ascending: false }),
    supabase.from("monthly_metrics").select("*").order("month", { ascending: false }),
    supabase.from("campaigns").select("*"),
    supabase.from("leads").select("*"),
  ]);

  return (
    <ReportsContent
      reports={(reportsRaw as Report[]) ?? []}
      metrics={(metricsRaw as MonthlyMetric[]) ?? []}
      campaigns={(campaignsRaw as Campaign[]) ?? []}
      leads={(leadsRaw as Lead[]) ?? []}
    />
  );
}
