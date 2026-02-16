"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Lightbulb } from "lucide-react";
import type { Insight } from "@/lib/types";

interface TeamInsightsProps {
  insights: Insight[];
}

export default function TeamInsights({ insights }: TeamInsightsProps) {
  const latest = insights.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb size={16} className="text-gold" />
        <h3 className="text-sm font-medium text-text-primary">
          From your growth team
        </h3>
      </div>
      <div className="space-y-4">
        {latest.map((insight) => (
          <div
            key={insight.id}
            className="border-b border-border/50 pb-4 last:border-0 last:pb-0"
          >
            <p className="text-sm leading-relaxed text-text-primary">
              {insight.content}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {formatDistanceToNow(parseISO(insight.created_at), {
                addSuffix: true,
              })}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
