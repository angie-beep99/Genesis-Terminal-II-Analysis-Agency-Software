import { requireAdmin } from "@/lib/admin-auth";
import CompanyManagement from "@/components/admin/company-management";
import type {
  Company,
  MonthlyMetric,
  DailyPerformance,
  Channel,
  Campaign,
  Lead,
  Insight,
  Report,
  InboxThread,
  InboxMessage,
  User,
} from "@/lib/types";

interface Props {
  params: { id: string };
}

export default async function AdminCompanyPage({ params }: Props) {
  const { adminClient } = await requireAdmin();
  const companyId = params.id;

  const [
    { data: companyRaw },
    { data: metricsRaw },
    { data: dailyRaw },
    { data: channelsRaw },
    { data: campaignsRaw },
    { data: leadsRaw },
    { data: insightsRaw },
    { data: reportsRaw },
    { data: threadsRaw },
    { data: messagesRaw },
    { data: usersRaw },
  ] = await Promise.all([
    adminClient.from("companies").select("*").eq("id", companyId).single(),
    adminClient.from("monthly_metrics").select("*").eq("company_id", companyId).order("month", { ascending: false }),
    adminClient.from("daily_performance").select("*").eq("company_id", companyId).order("date", { ascending: false }),
    adminClient.from("channels").select("*").eq("company_id", companyId),
    adminClient.from("campaigns").select("*").eq("company_id", companyId),
    adminClient.from("leads").select("*").eq("company_id", companyId).order("created_at", { ascending: false }),
    adminClient.from("insights").select("*").eq("company_id", companyId).order("created_at", { ascending: false }),
    adminClient.from("reports").select("*").eq("company_id", companyId).order("created_at", { ascending: false }),
    adminClient.from("inbox_threads").select("*").eq("company_id", companyId).order("last_message_at", { ascending: false }),
    adminClient.from("inbox_messages").select("*").eq("company_id", companyId).order("created_at", { ascending: true }),
    adminClient.from("users").select("*").eq("company_id", companyId),
  ]);

  if (!companyRaw) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-text-muted">Company not found.</p>
      </div>
    );
  }

  return (
    <CompanyManagement
      company={companyRaw as Company}
      metrics={(metricsRaw as MonthlyMetric[]) ?? []}
      dailyPerformance={(dailyRaw as DailyPerformance[]) ?? []}
      channels={(channelsRaw as Channel[]) ?? []}
      campaigns={(campaignsRaw as Campaign[]) ?? []}
      leads={(leadsRaw as Lead[]) ?? []}
      insights={(insightsRaw as Insight[]) ?? []}
      reports={(reportsRaw as Report[]) ?? []}
      threads={(threadsRaw as InboxThread[]) ?? []}
      messages={(messagesRaw as InboxMessage[]) ?? []}
      users={(usersRaw as User[]) ?? []}
    />
  );
}
