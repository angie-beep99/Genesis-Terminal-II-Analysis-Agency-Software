import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const { data: dbUser } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", authUser.id)
    .single();

  if (!dbUser?.is_admin) {
    redirect("/overview");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Admin top bar */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background px-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-lg font-semibold text-text-primary">
            Genesis Terminal
          </Link>
          <span className="rounded-full border border-negative/30 bg-negative/5 px-2 py-0.5 text-[11px] font-medium text-negative">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/overview"
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-text-primary transition-colors hover:border-gold"
          >
            Back to Dashboard
          </Link>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-text-muted">
            {authUser.email}
          </span>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
