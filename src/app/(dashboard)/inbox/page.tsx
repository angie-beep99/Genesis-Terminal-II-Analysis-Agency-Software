import { createClient } from "@/lib/supabase/server";
import InboxContent from "@/components/inbox/inbox-content";
import type { InboxThread, InboxMessage } from "@/lib/types";

export default async function InboxPage() {
  const supabase = createClient();

  const [{ data: threadsRaw }, { data: messagesRaw }] = await Promise.all([
    supabase
      .from("inbox_threads")
      .select("*")
      .order("last_message_at", { ascending: false }),
    supabase
      .from("inbox_messages")
      .select("*")
      .order("created_at", { ascending: true }),
  ]);

  return (
    <InboxContent
      threads={(threadsRaw as InboxThread[]) ?? []}
      messages={(messagesRaw as InboxMessage[]) ?? []}
    />
  );
}
