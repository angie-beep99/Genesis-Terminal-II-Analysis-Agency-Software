"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateCompany(
  companyId: string,
  data: {
    name: string;
    industry: string;
    website: string;
    contact_email: string;
  }
) {
  const supabase = createClient();

  const { error } = await supabase
    .from("companies")
    .update(data)
    .eq("id", companyId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function exportTableCsv(
  table: "leads" | "daily_performance" | "channels"
) {
  const supabase = createClient();

  const { data, error } = await supabase.from(table).select("*");
  if (error) return { error: error.message };
  if (!data || data.length === 0) return { csv: "" };

  const headers = Object.keys(data[0] as Record<string, unknown>);
  const rows = data.map((row) => {
    const r = row as Record<string, unknown>;
    return headers
      .map((h) => {
        const val = r[h];
        const str = val === null || val === undefined ? "" : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(",");
  });

  return { csv: [headers.join(","), ...rows].join("\n") };
}
