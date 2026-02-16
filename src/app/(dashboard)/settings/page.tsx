import { createClient } from "@/lib/supabase/server";
import SettingsContent from "@/components/settings/settings-content";
import type { Company, User, Lead, DailyPerformance, Channel } from "@/lib/types";

export default async function SettingsPage() {
  const supabase = createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const [
    { data: companyRaw },
    { data: usersRaw },
    { data: leadsRaw },
    { data: perfRaw },
    { data: channelsRaw },
  ] = await Promise.all([
    supabase.from("companies").select("*").single(),
    supabase.from("users").select("*"),
    supabase.from("leads").select("*"),
    supabase.from("daily_performance").select("*"),
    supabase.from("channels").select("*"),
  ]);

  return (
    <SettingsContent
      company={(companyRaw as Company) ?? null}
      users={(usersRaw as User[]) ?? []}
      leads={(leadsRaw as Lead[]) ?? []}
      performance={(perfRaw as DailyPerformance[]) ?? []}
      channels={(channelsRaw as Channel[]) ?? []}
      currentUserEmail={authUser?.email ?? ""}
    />
  );
}
