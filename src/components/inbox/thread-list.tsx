"use client";

import { formatDistanceToNow, parseISO } from "date-fns";
import { Inbox } from "lucide-react";
import type { InboxThread, InboxMessage } from "@/lib/types";

interface ThreadListProps {
  threads: InboxThread[];
  messages: InboxMessage[];
  activeThreadId: string | null;
  onSelect: (id: string) => void;
}

const categoryStyles: Record<
  string,
  { label: string; style: string }
> = {
  update: {
    label: "Update",
    style: "border-blue-400/30 text-blue-400 bg-blue-400/5",
  },
  question: {
    label: "Question",
    style: "border-yellow-400/30 text-yellow-400 bg-yellow-400/5",
  },
  report: {
    label: "Report",
    style: "border-positive/30 text-positive bg-positive/5",
  },
  action_required: {
    label: "Action Required",
    style: "border-negative/30 text-negative bg-negative/5",
  },
};

export default function ThreadList({
  threads,
  messages,
  activeThreadId,
  onSelect,
}: ThreadListProps) {
  // Build a map of thread_id -> last message
  const lastMessageMap = new Map<string, InboxMessage>();
  for (const msg of messages) {
    const existing = lastMessageMap.get(msg.thread_id);
    if (!existing || msg.created_at > existing.created_at) {
      lastMessageMap.set(msg.thread_id, msg);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium text-text-primary">Threads</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 && (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
              <Inbox size={16} className="text-text-muted" />
            </div>
            <p className="text-xs text-text-muted">Inbox is empty</p>
          </div>
        )}
        {threads.map((thread) => {
          const isActive = thread.id === activeThreadId;
          const cat = categoryStyles[thread.category] ?? categoryStyles.update;
          const lastMsg = lastMessageMap.get(thread.id);
          const preview = lastMsg
            ? lastMsg.content.length > 80
              ? lastMsg.content.slice(0, 80) + "..."
              : lastMsg.content
            : "";

          return (
            <button
              key={thread.id}
              onClick={() => onSelect(thread.id)}
              className={`flex w-full flex-col gap-1.5 border-b border-border/50 px-4 py-3 text-left transition-colors ${
                isActive
                  ? "bg-card/80 border-l-2 border-l-gold"
                  : "hover:bg-background/50"
              }`}
            >
              {/* Top row: subject + unread dot */}
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-sm leading-tight ${
                    !thread.is_read
                      ? "font-semibold text-text-primary"
                      : "font-medium text-text-primary"
                  }`}
                >
                  {thread.subject}
                </span>
                {!thread.is_read && (
                  <span className="mt-1 flex-shrink-0">
                    <span className="inline-block h-2 w-2 rounded-full bg-gold" />
                  </span>
                )}
              </div>

              {/* Category + timestamp */}
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full border px-1.5 py-0.5 text-[10px] leading-none ${cat.style}`}
                >
                  {cat.label}
                </span>
                {thread.last_message_at && (
                  <span
                    className="text-[11px] text-text-muted"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  >
                    {formatDistanceToNow(parseISO(thread.last_message_at), {
                      addSuffix: true,
                    })}
                  </span>
                )}
              </div>

              {/* Preview */}
              {preview && (
                <p className="text-xs leading-relaxed text-text-muted">
                  {preview}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
