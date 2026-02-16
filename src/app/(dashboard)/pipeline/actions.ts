"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateLeadStatus(
  leadId: string,
  newStatus: string,
  oldStatus: string
) {
  const supabase = createClient();

  const { error: updateError } = await supabase
    .from("leads")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", leadId);

  if (updateError) {
    return { error: updateError.message };
  }

  // Record the activity
  const { data: lead } = await supabase
    .from("leads")
    .select("company_id")
    .eq("id", leadId)
    .single();

  if (lead) {
    await supabase.from("lead_activity").insert({
      lead_id: leadId,
      company_id: lead.company_id,
      action: "Status changed",
      details: `Moved from ${oldStatus} to ${newStatus}`,
    });
  }

  return { success: true };
}
