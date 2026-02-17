import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/sidebar";
import TopBar from "@/components/top-bar";
import Breadcrumbs from "@/components/breadcrumbs";
import CommandPalette from "@/components/command-palette";
import { ToastProvider } from "@/components/toast";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch unread inbox thread count
  const { count: unreadCount } = await supabase
    .from("inbox_threads")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar userEmail={user.email ?? "User"} inboxUnreadCount={unreadCount ?? 0} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <Breadcrumbs />
          <main className="flex-1 overflow-y-auto bg-background p-6">
            {children}
          </main>
        </div>
        <CommandPalette />
      </div>
    </ToastProvider>
  );
}
