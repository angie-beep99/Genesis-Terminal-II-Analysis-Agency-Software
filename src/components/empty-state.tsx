import type { ReactNode } from "react";
import {
  Users,
  Radio,
  BarChart3,
  Inbox,
  FileText,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon: Icon = FileText,
  title,
  message,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background">
        <Icon size={20} className="text-text-muted" />
      </div>
      <h3 className="mb-1 text-sm font-medium text-text-primary">{title}</h3>
      <p className="max-w-sm text-xs leading-relaxed text-text-muted">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* Preset empty states for common pages */

export function EmptyLeads() {
  return (
    <EmptyState
      icon={Users}
      title="No leads yet"
      message="They'll appear here as your campaigns generate enquiries."
    />
  );
}

export function EmptyChannels() {
  return (
    <EmptyState
      icon={Radio}
      title="No channels configured"
      message="Channels will appear here once your team sets up your ad platforms."
    />
  );
}

export function EmptyReports() {
  return (
    <EmptyState
      icon={BarChart3}
      title="No reports available"
      message="Reports will be generated as campaign data comes in."
    />
  );
}

export function EmptyInbox() {
  return (
    <EmptyState
      icon={Inbox}
      title="Inbox is empty"
      message="Messages from your team will appear here."
    />
  );
}

export function EmptyInsights() {
  return (
    <EmptyState
      icon={Lightbulb}
      title="No insights yet"
      message="Your team will share performance insights and recommendations here."
    />
  );
}
