import { createClient } from "@/lib/supabase/server";
import LeadsContent from "@/components/leads/leads-content";
import type { Lead, LeadActivity, LeadNote } from "@/lib/types";

export default async function LeadsPage() {
  const supabase = createClient();

  const [
    { data: leadsRaw },
    { data: activityRaw },
    { data: notesRaw },
  ] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("lead_activity").select("*").order("created_at", { ascending: true }),
    supabase.from("lead_notes").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <LeadsContent
      leads={(leadsRaw as Lead[]) ?? []}
      activities={(activityRaw as LeadActivity[]) ?? []}
      notes={(notesRaw as LeadNote[]) ?? []}
    />
  );
}
