"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

const labels: Record<string, string> = {
  overview: "Overview",
  channels: "Channels",
  leads: "Leads",
  pipeline: "Pipeline",
  reports: "Reports",
  inbox: "Inbox",
  settings: "Settings",
  admin: "Admin",
  company: "Company",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((segment, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = labels[segment] ?? decodeURIComponent(segment);
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav className="flex items-center gap-1.5 px-6 py-2 text-xs">
      <Link
        href="/overview"
        className="text-text-muted transition-colors hover:text-text-primary"
      >
        <Home size={12} />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight size={10} className="text-text-muted" />
          {crumb.isLast ? (
            <span className="text-text-primary">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-text-muted transition-colors hover:text-text-primary"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
