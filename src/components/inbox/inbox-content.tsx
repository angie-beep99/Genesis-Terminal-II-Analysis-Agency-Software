"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreadList from "./thread-list";
import MessageThread from "./message-thread";
import type { InboxThread, InboxMessage } from "@/lib/types";

interface InboxContentProps {
  threads: InboxThread[];
  messages: InboxMessage[];
}

export default function InboxContent({
  threads: initialThreads,
  messages: initialMessages,
}: InboxContentProps) {
  const [threads, setThreads] = useState(initialThreads);
  const [messages, setMessages] = useState(initialMessages);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeThreadId) ?? null,
    [threads, activeThreadId]
  );

  const activeMessages = useMemo(
    () => messages.filter((m) => m.thread_id === activeThreadId),
    [messages, activeThreadId]
  );

  function handleSelectThread(threadId: string) {
    setActiveThreadId(threadId);
    // Mark as read locally
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, is_read: true } : t))
    );
  }

  function handleNewMessage(message: InboxMessage) {
    setMessages((prev) => [...prev, message]);
  }

  function handleBack() {
    setActiveThreadId(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-[calc(100vh-8.5rem)] overflow-hidden rounded-xl border border-border bg-card"
    >
      {/* Left panel — thread list */}
      <div
        className={`w-full flex-shrink-0 border-r border-border md:w-80 ${
          activeThreadId ? "hidden md:block" : "block"
        }`}
      >
        <ThreadList
          threads={threads}
          messages={messages}
          activeThreadId={activeThreadId}
          onSelect={handleSelectThread}
        />
      </div>

      {/* Right panel — message thread */}
      <div
        className={`flex-1 ${
          activeThreadId ? "block" : "hidden md:block"
        }`}
      >
        <AnimatePresence mode="wait">
          {activeThread ? (
            <MessageThread
              key={activeThread.id}
              thread={activeThread}
              messages={activeMessages}
              onNewMessage={handleNewMessage}
              onBack={handleBack}
            />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full items-center justify-center"
            >
              <p className="text-sm text-text-muted">
                Select a thread to view messages
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
