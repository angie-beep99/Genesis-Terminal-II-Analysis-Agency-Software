"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { sendAdminMessage } from "@/app/admin/company/[id]/actions";
import type { InboxThread, InboxMessage } from "@/lib/types";

interface Props {
  companyId: string;
  threads: InboxThread[];
  messages: InboxMessage[];
}

const catStyles: Record<string, string> = {
  update: "border-blue-400/30 text-blue-400 bg-blue-400/5",
  question: "border-yellow-400/30 text-yellow-400 bg-yellow-400/5",
  report: "border-positive/30 text-positive bg-positive/5",
  action_required: "border-negative/30 text-negative bg-negative/5",
};

export default function AdminInboxTab({ companyId, threads, messages: initialMessages }: Props) {
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [senderName, setSenderName] = useState("Sarah Chen");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const threadMessages = messages.filter((m) => m.thread_id === activeThread);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [threadMessages.length]);

  async function handleSend() {
    if (!input.trim() || !activeThread || sending) return;
    const content = input.trim();
    setSending(true);
    setInput("");

    // Optimistic
    const optimistic: InboxMessage = {
      id: `opt-${Date.now()}`,
      thread_id: activeThread,
      company_id: companyId,
      sender_type: "team",
      sender_name: senderName,
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    await sendAdminMessage(activeThread, companyId, senderName, content);
    setSending(false);
  }

  return (
    <div className="flex h-[500px] overflow-hidden rounded-xl border border-border bg-card">
      {/* Thread list */}
      <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-border">
        {threads.map((thread) => {
          const cat = catStyles[thread.category] ?? catStyles.update;
          const lastMsg = messages.filter((m) => m.thread_id === thread.id).slice(-1)[0];
          return (
            <button
              key={thread.id}
              onClick={() => setActiveThread(thread.id)}
              className={`flex w-full flex-col gap-1 border-b border-border/50 px-4 py-3 text-left transition-colors ${
                activeThread === thread.id ? "bg-background/50" : "hover:bg-background/30"
              }`}
            >
              <span className="text-xs font-medium text-text-primary leading-tight">{thread.subject}</span>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-1.5 py-0.5 text-[9px] leading-none ${cat}`}>
                  {thread.category.replace("_", " ")}
                </span>
                {thread.last_message_at && (
                  <span className="text-[10px] text-text-muted">{formatDistanceToNow(parseISO(thread.last_message_at), { addSuffix: true })}</span>
                )}
              </div>
              {lastMsg && (
                <span className="text-[11px] text-text-muted truncate">{lastMsg.content.slice(0, 60)}...</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col">
        {activeThread ? (
          <>
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {threadMessages.map((msg) => {
                const isTeam = msg.sender_type === "team";
                return (
                  <div key={msg.id} className={`flex ${isTeam ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[75%] rounded-lg px-3 py-2 ${isTeam ? "bg-background border border-border" : "bg-background/50 border border-border/50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[11px] font-medium ${isTeam ? "text-gold" : "text-text-primary"}`}>{msg.sender_name}</span>
                        <span className="text-[10px] text-text-muted" style={{ fontFeatureSettings: '"tnum"' }}>{format(parseISO(msg.created_at), "MMM d, h:mm a")}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-text-primary">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply bar */}
            <div className="border-t border-border p-3">
              <div className="mb-2 flex items-center gap-2">
                <label className="text-[11px] text-text-muted">Send as:</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="rounded border border-border bg-background px-2 py-0.5 text-xs text-text-primary outline-none focus:border-gold"
                />
              </div>
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Reply as team..."
                  rows={2}
                  className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-gold placeholder:text-text-muted"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gold text-background hover:opacity-90 disabled:opacity-40"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-text-muted">Select a thread to view and reply</p>
          </div>
        )}
      </div>
    </div>
  );
}
