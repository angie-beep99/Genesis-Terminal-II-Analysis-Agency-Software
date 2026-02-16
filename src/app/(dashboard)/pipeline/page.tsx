import { createClient } from "@/lib/supabase/server";
import PipelineContent from "@/components/pipeline/pipeline-content";
import type { Lead } from "@/lib/types";

export default async function PipelinePage() {
  const supabase = createClient();

  const { data: leadsRaw } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return <PipelineContent leads={(leadsRaw as Lead[]) ?? []} />;
}
