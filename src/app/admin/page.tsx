import { requireAdmin } from "@/lib/admin-auth";
import AdminDashboard from "@/components/admin/admin-dashboard";
import type { Company } from "@/lib/types";

export default async function AdminPage() {
  const { adminClient } = await requireAdmin();

  const [
    { data: companiesRaw },
    { data: metricsRaw },
    { data: leadsRaw },
  ] = await Promise.all([
    adminClient.from("companies").select("*").order("name"),
    adminClient.from("monthly_metrics").select("total_spend, total_leads, revenue_influenced"),
    adminClient.from("leads").select("id"),
  ]);

  const companies = (companiesRaw as Company[]) ?? [];
  const metrics = (metricsRaw as Array<{ total_spend: number; total_leads: number; revenue_influenced: number }>) ?? [];
  const totalLeads = leadsRaw?.length ?? 0;
  const totalSpend = metrics.reduce((s, m) => s + Number(m.total_spend), 0);
  const totalRevenue = metrics.reduce((s, m) => s + Number(m.revenue_influenced), 0);

  return (
    <AdminDashboard
      companies={companies}
      totalCompanies={companies.length}
      totalLeads={totalLeads}
      totalSpend={totalSpend}
      totalRevenue={totalRevenue}
    />
  );
}
