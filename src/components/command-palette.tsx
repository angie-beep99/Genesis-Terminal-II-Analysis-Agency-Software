"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Radio,
  Users,
  GitBranch,
  BarChart3,
  Inbox,
  Settings,
  Building2,
  type LucideIcon,
} from "lucide-react";

interface PaletteItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: LucideIcon;
  href: string;
  category: "page" | "lead" | "company";
}

const pages: PaletteItem[] = [
  { id: "p-overview", label: "Overview", icon: LayoutDashboard, href: "/overview", category: "page" },
  { id: "p-channels", label: "Channels", icon: Radio, href: "/channels", category: "page" },
  { id: "p-leads", label: "Leads", icon: Users, href: "/leads", category: "page" },
  { id: "p-pipeline", label: "Pipeline", icon: GitBranch, href: "/pipeline", category: "page" },
  { id: "p-reports", label: "Reports", icon: BarChart3, href: "/reports", category: "page" },
  { id: "p-inbox", label: "Inbox", icon: Inbox, href: "/inbox", category: "page" },
  { id: "p-settings", label: "Settings", icon: Settings, href: "/settings", category: "page" },
];

// Sample leads and companies for search (in production these come from DB)
const sampleLeads: PaletteItem[] = [
  { id: "l-1", label: "Jennifer Walsh", sublabel: "Walsh & Associates", icon: Users, href: "/leads", category: "lead" },
  { id: "l-2", label: "Michael Torres", sublabel: "Torres Industries", icon: Users, href: "/leads", category: "lead" },
  { id: "l-3", label: "Robert Kim", sublabel: "Kim Legal Group", icon: Users, href: "/leads", category: "lead" },
  { id: "l-4", label: "Sarah Davis", sublabel: "Davis Consulting", icon: Users, href: "/leads", category: "lead" },
  { id: "l-5", label: "Emily Rodriguez", sublabel: "Rodriguez & Partners", icon: Users, href: "/leads", category: "lead" },
];

const sampleCompanies: PaletteItem[] = [
  { id: "c-1", label: "Morrison Law Group", sublabel: "Legal", icon: Building2, href: "/overview", category: "company" },
];

const allItems = [...pages, ...sampleLeads, ...sampleCompanies];

const categoryLabels: Record<string, string> = {
  page: "Pages",
  lead: "Leads",
  company: "Companies",
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filtered = query.trim()
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.sublabel?.toLowerCase().includes(query.toLowerCase())
      )
    : pages;

  // Group by category
  const grouped: { category: string; items: PaletteItem[] }[] = [];
  const seen = new Set<string>();
  for (const item of filtered) {
    if (!seen.has(item.category)) {
      seen.add(item.category);
      grouped.push({
        category: item.category,
        items: filtered.filter((i) => i.category === item.category),
      });
    }
  }

  const flatItems = grouped.flatMap((g) => g.items);

  // Keyboard shortcut to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const navigate = useCallback(
    (item: PaletteItem) => {
      setOpen(false);
      setQuery("");
      router.push(item.href);
    },
    [router]
  );

  // Handle keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatItems[selectedIndex]) {
        navigate(flatItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector("[data-selected=true]");
    if (selected) {
      selected.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Reset index on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Palette */}
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search size={16} className="text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, leads, companies..."
            className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
          />
          <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-text-muted">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-72 overflow-y-auto py-2">
          {flatItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text-muted">
              No results found
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.category}>
                <div className="px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider text-text-muted">
                  {categoryLabels[group.category] ?? group.category}
                </div>
                {group.items.map((item) => {
                  const flatIndex = flatItems.indexOf(item);
                  const isSelected = flatIndex === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      data-selected={isSelected}
                      onClick={() => navigate(item)}
                      onMouseEnter={() => setSelectedIndex(flatIndex)}
                      className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                        isSelected
                          ? "bg-background text-text-primary"
                          : "text-text-muted hover:bg-background/50"
                      }`}
                    >
                      <Icon size={16} />
                      <div className="min-w-0 flex-1">
                        <span className="text-sm">{item.label}</span>
                        {item.sublabel && (
                          <span className="ml-2 text-xs text-text-muted">
                            {item.sublabel}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] text-text-muted">
                          ↵
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2">
          <div className="flex items-center gap-3 text-[10px] text-text-muted">
            <span>
              <kbd className="rounded border border-border bg-background px-1 py-0.5">↑↓</kbd> navigate
            </span>
            <span>
              <kbd className="rounded border border-border bg-background px-1 py-0.5">↵</kbd> select
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
