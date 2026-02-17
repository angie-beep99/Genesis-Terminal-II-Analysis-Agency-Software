"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Users, BarChart3, Inbox, Radio, CheckCheck } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

interface Notification {
  id: string;
  icon: "lead" | "report" | "inbox" | "channel";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  href: string;
}

const sampleNotifications: Notification[] = [
  { id: "1", icon: "lead", title: "New Lead", message: "Jennifer Walsh submitted a form from Google Ads", timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), read: false, href: "/leads" },
  { id: "2", icon: "inbox", title: "New Message", message: "Sarah Chen replied in 'Q4 Strategy Discussion'", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), read: false, href: "/inbox" },
  { id: "3", icon: "report", title: "Report Ready", message: "January 2025 Monthly Performance is available", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false, href: "/reports" },
  { id: "4", icon: "channel", title: "Channel Update", message: "Google Ads spend is tracking 15% above target", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), read: true, href: "/channels" },
  { id: "5", icon: "lead", title: "Lead Qualified", message: "Michael Torres moved to qualified status", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), read: true, href: "/leads" },
  { id: "6", icon: "inbox", title: "Action Required", message: "Creative approval needed for Facebook campaign", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), read: true, href: "/inbox" },
  { id: "7", icon: "report", title: "Weekly Digest", message: "Your weekly performance summary is ready", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true, href: "/reports" },
  { id: "8", icon: "lead", title: "New Lead", message: "Robert Kim came through LinkedIn Ads", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), read: true, href: "/leads" },
  { id: "9", icon: "channel", title: "Budget Alert", message: "LinkedIn Ads daily budget has been exhausted", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), read: true, href: "/channels" },
  { id: "10", icon: "inbox", title: "Thread Closed", message: "'Landing Page Feedback' marked as resolved", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), read: true, href: "/inbox" },
];

const iconMap = {
  lead: Users,
  report: BarChart3,
  inbox: Inbox,
  channel: Radio,
};

const iconColors = {
  lead: "text-positive",
  report: "text-purple-400",
  inbox: "text-blue-400",
  channel: "text-gold",
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleClick(notification: Notification) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
    setOpen(false);
    router.push(notification.href);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-text-muted transition-colors hover:text-text-primary"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-negative text-[10px] font-medium text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-80 rounded-xl border border-border bg-card shadow-2xl sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-medium text-text-primary">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-gold"
              >
                <CheckCheck size={12} />
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((n) => {
              const Icon = iconMap[n.icon];
              return (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-background/50 ${
                    !n.read ? "bg-background/30" : ""
                  }`}
                >
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border bg-background">
                    <Icon size={14} className={iconColors[n.icon]} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-text-primary">
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-text-muted line-clamp-2">
                      {n.message}
                    </p>
                    <span
                      className="mt-1 block text-[10px] text-text-muted"
                      style={{ fontFeatureSettings: '"tnum"' }}
                    >
                      {formatDistanceToNow(parseISO(n.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
