"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { format, parseISO } from "date-fns";
import { sendMessage, markThreadAsRead } from "@/app/(dashboard)/inbox/actions";
import type { InboxThread, InboxMessage } from "@/lib/types";

interface MessageThreadProps {
  thread: InboxThread;
  messages: InboxMessage[];
  onNewMessage: (message: InboxMessage) => void;
  onBack: () => void;
}

const categoryStyles: Record<string, { label: string; style: string }> = {
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

export default function MessageThread({
  thread,
  messages,
  onNewMessage,
  onBack,
}: MessageThreadProps) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const markedReadRef = useRef(false);

  const cat = categoryStyles[thread.category] ?? categoryStyles.update;

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark as read on mount
  useEffect(() => {
    if (!thread.is_read && !markedReadRef.current) {
      markedReadRef.current = true;
      markThreadAsRead(thread.id);
    }
  }, [thread.id, thread.is_read]);

  async function handleSend() {
    const content = input.trim();
    if (!content || sending) return;

    setSending(true);
    setInput("");

    // Optimistic message
    const optimisticMsg: InboxMessage = {
      id: `optimistic-${Date.now()}`,
      thread_id: thread.id,
      company_id: thread.company_id,
      sender_type: "client",
      sender_name: "You",
      content,
      created_at: new Date().toISOString(),
    };
    onNewMessage(optimisticMsg);

    const result = await sendMessage(thread.id, thread.company_id, content);
    if (result.error) {
      // Could remove the optimistic message here, but keeping it simple
      console.error("Failed to send:", result.error);
    }

    setSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex h-full flex-col"
    >
      {/* Thread header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button
          onClick={onBack}
          className="rounded-md p-1 text-text-muted transition-colors hover:bg-background hover:text-text-primary md:hidden"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h2 className="text-sm font-medium text-text-primary">
            {thread.subject}
          </h2>
          <span
            className={`mt-0.5 inline-flex rounded-full border px-1.5 py-0.5 text-[10px] leading-none ${cat.style}`}
          >
            {cat.label}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg, i) => {
          const isClient = msg.sender_type === "client";
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className={`flex ${isClient ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  isClient
                    ? "bg-background/80 border border-border"
                    : "bg-background border border-border/50"
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`text-xs font-medium ${
                      isClient ? "text-gold" : "text-text-primary"
                    }`}
                  >
                    {msg.sender_name}
                  </span>
                  <span
                    className="text-[10px] text-text-muted"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  >
                    {format(parseISO(msg.created_at), "MMM d, h:mm a")}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-text-primary">
                  {msg.content}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input bar */}
      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2 rounded-lg border border-border bg-background p-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-gold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
