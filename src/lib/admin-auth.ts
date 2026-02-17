import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Checks if the current user is an admin. Redirects to /overview if not.
 * Returns the admin supabase client (service role) for data operations.
 */
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  // Check is_admin flag in users table
  const { data: dbUser } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", authUser.id)
    .single();

  if (!dbUser?.is_admin) {
    redirect("/overview");
  }

  const adminClient = createAdminClient();
  return { authUser, adminClient };
}
