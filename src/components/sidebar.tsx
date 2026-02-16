"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Radio,
  Users,
  GitBranch,
  BarChart3,
  Inbox,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "@/app/login/actions";

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/channels", label: "Channels", icon: Radio },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: GitBranch },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-shrink-0 flex-col bg-background border-r border-border">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="text-lg font-semibold text-text-primary">
          Genesis Terminal
        </span>
        <span className="flex items-center gap-1 rounded-full bg-positive/10 px-2 py-0.5 text-xs text-positive">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-positive" />
          Live
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "border-l-2 border-gold bg-card text-text-primary"
                  : "border-l-2 border-transparent text-text-muted hover:bg-card hover:text-text-primary"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-4 py-4">
        <p className="truncate text-xs text-text-muted">{userEmail}</p>
        <form action={signOut}>
          <button
            type="submit"
            className="mt-2 flex items-center gap-2 text-xs text-text-muted transition-colors hover:text-text-primary"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
