"use server";

import { createClient } from "@/lib/supabase/server";

export async function sendMessage(
  threadId: string,
  companyId: string,
  content: string
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("inbox_messages")
    .insert({
      thread_id: threadId,
      company_id: companyId,
      sender_type: "client",
      sender_name: "You",
      content,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Update last_message_at on thread
  await supabase
    .from("inbox_threads")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", threadId);

  return { message: data };
}

export async function markThreadAsRead(threadId: string) {
  const supabase = createClient();

  await supabase
    .from("inbox_threads")
    .update({ is_read: true })
    .eq("id", threadId);
}
