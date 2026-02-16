"use server";

import { createClient } from "@/lib/supabase/server";

export async function generateShareToken(reportId: string) {
  const supabase = createClient();

  const token = `gt_${reportId.slice(0, 8)}_${Date.now().toString(36)}`;
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  const { error } = await supabase
    .from("reports")
    .update({
      share_token: token,
      share_expires: expires.toISOString(),
    })
    .eq("id", reportId);

  if (error) {
    return { error: error.message };
  }

  return { token, expires: expires.toISOString() };
}
