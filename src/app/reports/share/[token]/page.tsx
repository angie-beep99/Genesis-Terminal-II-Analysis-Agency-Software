import { createClient } from "@/lib/supabase/server";
import SharedReportView from "@/components/reports/shared-report-view";
import type { Report, MonthlyMetric, Campaign, Lead } from "@/lib/types";

interface Props {
  params: { token: string };
}

export default async function SharedReportPage({ params }: Props) {
  const supabase = createClient();

  // Look up the report by share token
  const { data: report } = await supabase
    .from("reports")
    .select("*")
    .eq("share_token", params.token)
    .single();

  if (!report) {
    return <ExpiredView />;
  }

  const typedReport = report as Report;

  // Check if expired
  if (typedReport.share_expires) {
    const expiresAt = new Date(typedReport.share_expires);
    if (expiresAt < new Date()) {
      return <ExpiredView />;
    }
  }

  // Fetch supporting data using the report's company_id
  const [
    { data: metricsRaw },
    { data: campaignsRaw },
    { data: leadsRaw },
  ] = await Promise.all([
    supabase
      .from("monthly_metrics")
      .select("*")
      .eq("company_id", typedReport.company_id)
      .order("month", { ascending: false }),
    supabase
      .from("campaigns")
      .select("*")
      .eq("company_id", typedReport.company_id),
    supabase
      .from("leads")
      .select("*")
      .eq("company_id", typedReport.company_id),
  ]);

  return (
    <SharedReportView
      report={typedReport}
      metrics={(metricsRaw as MonthlyMetric[]) ?? []}
      campaigns={(campaignsRaw as Campaign[]) ?? []}
      leads={(leadsRaw as Lead[]) ?? []}
    />
  );
}

function ExpiredView() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h1 className="text-lg font-semibold text-text-primary">
          This link has expired
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          This shared report link is no longer valid. Please request a new link
          from the report owner.
        </p>
      </div>
    </div>
  );
}
