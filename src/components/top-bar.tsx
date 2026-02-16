"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/overview": "Overview",
  "/channels": "Channels",
  "/leads": "Leads",
  "/pipeline": "Pipeline",
  "/reports": "Reports",
  "/inbox": "Inbox",
  "/settings": "Settings",
};

export default function TopBar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <h1 className="text-lg font-semibold text-text-primary">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative text-text-muted transition-colors hover:text-text-primary">
          <Bell size={20} />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-negative text-[10px] font-medium text-white">
            3
          </span>
        </button>

        {/* Sample View badge */}
        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-text-muted">
          Sample View
        </span>
      </div>
    </header>
  );
}
