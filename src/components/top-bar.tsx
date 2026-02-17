"use client";

import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import NotificationBell from "./notifications";

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
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6 pl-14 md:pl-6">
      <h1 className="text-lg font-semibold text-text-primary">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Cmd+K hint */}
        <button
          onClick={() => {
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", metaKey: true })
            );
          }}
          className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-gold sm:flex"
        >
          <Search size={12} />
          Search
          <kbd className="rounded border border-border bg-background px-1 py-0.5 text-[10px]">
            ⌘K
          </kbd>
        </button>

        {/* Notification bell */}
        <NotificationBell />

        {/* Sample View badge */}
        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-text-muted">
          Sample View
        </span>
      </div>
    </header>
  );
}
