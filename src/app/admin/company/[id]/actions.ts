"use server";

import { createAdminClient } from "@/lib/supabase/admin";

const admin = () => createAdminClient();

// --- MONTHLY METRICS ---
export async function upsertMetric(
  companyId: string,
  month: string,
  data: {
    total_spend: number;
    total_leads: number;
    qualified_leads: number;
    cost_per_lead: number;
    cost_per_qualified_lead: number;
    revenue_influenced: number;
  }
) {
  const sb = admin();
  // Check if metric for this month exists
  const { data: existing } = await sb
    .from("monthly_metrics")
    .select("id")
    .eq("company_id", companyId)
    .eq("month", month)
    .single();

  if (existing) {
    const { error } = await sb
      .from("monthly_metrics")
      .update(data)
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await sb
      .from("monthly_metrics")
      .insert({ company_id: companyId, month, ...data });
    if (error) return { error: error.message };
  }
  return { success: true };
}

// --- DAILY PERFORMANCE ---
export async function upsertDailyPerformance(
  companyId: string,
  id: string | null,
  data: { date: string; spend: number; leads: number; qualified_leads: number }
) {
  const sb = admin();
  if (id) {
    const { error } = await sb.from("daily_performance").update(data).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await sb
      .from("daily_performance")
      .insert({ company_id: companyId, ...data });
    if (error) return { error: error.message };
  }
  return { success: true };
}

export async function deleteDailyPerformance(id: string) {
  const sb = admin();
  const { error } = await sb.from("daily_performance").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

// --- CHANNELS ---
export async function upsertChannel(
  companyId: string,
  id: string | null,
  data: { name: string; status: string }
) {
  const sb = admin();
  if (id) {
    const { error } = await sb.from("channels").update(data).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await sb
      .from("channels")
      .insert({ company_id: companyId, ...data });
    if (error) return { error: error.message };
  }
  return { success: true };
}

export async function deleteChannel(id: string) {
  const sb = admin();
  const { error } = await sb.from("channels").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

// --- CAMPAIGNS ---
export async function upsertCampaign(
  companyId: string,
  id: string | null,
  data: { channel_id: string; name: string; status: string; spend: number; leads: number; cpl: number }
) {
  const sb = admin();
  if (id) {
    const { error } = await sb.from("campaigns").update(data).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await sb
      .from("campaigns")
      .insert({ company_id: companyId, ...data });
    if (error) return { error: error.message };
  }
  return { success: true };
}

export async function deleteCampaign(id: string) {
  const sb = admin();
  const { error } = await sb.from("campaigns").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

// --- LEADS ---
export async function upsertLead(
  companyId: string,
  id: string | null,
  data: {
    name: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    source: string | null;
    campaign: string | null;
    status: string;
    value: number | null;
    cpa: number | null;
  }
) {
  const sb = admin();
  if (id) {
    const { error } = await sb.from("leads").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await sb
      .from("leads")
      .insert({ company_id: companyId, ...data });
    if (error) return { error: error.message };
  }
  return { success: true };
}

export async function deleteLead(id: string) {
  const sb = admin();
  const { error } = await sb.from("leads").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

// --- INSIGHTS ---
export async function createInsight(companyId: string, content: string, category: string | null) {
  const sb = admin();
  const { error } = await sb.from("insights").insert({ company_id: companyId, content, category });
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteInsight(id: string) {
  const sb = admin();
  const { error } = await sb.from("insights").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

// --- REPORTS ---
export async function createReport(
  companyId: string,
  data: { title: string; type: string; date_range_start: string; date_range_end: string }
) {
  const sb = admin();
  const { error } = await sb.from("reports").insert({ company_id: companyId, ...data });
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteReport(id: string) {
  const sb = admin();
  const { error } = await sb.from("reports").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

// --- INBOX ---
export async function sendAdminMessage(threadId: string, companyId: string, senderName: string, content: string) {
  const sb = admin();
  const { error } = await sb.from("inbox_messages").insert({
    thread_id: threadId,
    company_id: companyId,
    sender_type: "team",
    sender_name: senderName,
    content,
  });
  if (error) return { error: error.message };
  await sb.from("inbox_threads").update({ last_message_at: new Date().toISOString() }).eq("id", threadId);
  return { success: true };
}

// --- COMPANY SETTINGS ---
export async function updateCompanyAdmin(
  companyId: string,
  data: { name: string; industry: string; website: string; contact_email: string }
) {
  const sb = admin();
  const { error } = await sb.from("companies").update(data).eq("id", companyId);
  if (error) return { error: error.message };
  return { success: true };
}
