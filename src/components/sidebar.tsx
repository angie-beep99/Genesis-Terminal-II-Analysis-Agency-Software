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
  Menu,
  X,
} from "lucide-react";
import { signOut } from "@/app/login/actions";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/channels", label: "Channels", icon: Radio },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: GitBranch },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  userEmail: string;
  inboxUnreadCount?: number;
}

export default function Sidebar({ userEmail, inboxUnreadCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile sidebar on resize past mobile breakpoint
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="text-lg font-semibold text-text-primary sidebar-label">
          Genesis Terminal
        </span>
        <span className="sidebar-label flex items-center gap-1 rounded-full bg-positive/10 px-2 py-0.5 text-xs text-positive">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-positive" />
          Live
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const showBadge = item.href === "/inbox" && inboxUnreadCount > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "border-l-2 border-gold bg-card text-text-primary"
                  : "border-l-2 border-transparent text-text-muted hover:bg-card hover:text-text-primary"
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="sidebar-label flex-1">{item.label}</span>
              {showBadge && (
                <span className="sidebar-label flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold px-1.5 text-[10px] font-semibold text-background">
                  {inboxUnreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-4 py-4">
        <p className="sidebar-label truncate text-xs text-text-muted">{userEmail}</p>
        <form action={signOut}>
          <button
            type="submit"
            className="mt-2 flex items-center gap-2 text-xs text-text-muted transition-colors hover:text-text-primary"
          >
            <LogOut size={14} />
            <span className="sidebar-label">Sign Out</span>
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button — rendered outside sidebar */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-3.5 z-30 rounded-lg border border-border bg-card p-2 text-text-muted transition-colors hover:text-text-primary md:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 flex h-screen flex-col border-r border-border bg-background
          transition-all duration-200
          ${/* Mobile: slide in/out */""}
          ${mobileOpen ? "left-0 w-60" : "-left-60"}
          ${/* Tablet: collapsed icon-only, expand on hover */""}
          md:static md:left-0 md:w-16 md:hover:w-60
          ${/* Desktop: full width */""}
          lg:w-60
        `}
      >
        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-3 top-5 text-text-muted hover:text-text-primary md:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}

        {sidebarContent}
      </aside>

      <style jsx global>{`
        /* Tablet collapsed: hide labels, show on hover */
        @media (min-width: 768px) and (max-width: 1023px) {
          aside:not(:hover) .sidebar-label {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
