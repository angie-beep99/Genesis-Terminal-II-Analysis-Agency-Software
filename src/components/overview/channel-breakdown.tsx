"use client";

import { motion } from "framer-motion";
import type { ChannelWithLeads } from "@/lib/types";

interface ChannelBreakdownProps {
  channels: ChannelWithLeads[];
}

const dotColors: Record<string, string> = {
  "Google Ads": "#4285F4",
  Meta: "#0668E1",
  Bing: "#00809D",
  TikTok: "#EE1D52",
};

export default function ChannelBreakdown({ channels }: ChannelBreakdownProps) {
  const sorted = [...channels].sort((a, b) => b.total_leads - a.total_leads);
  const maxLeads = sorted[0]?.total_leads ?? 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <h3 className="mb-4 text-sm font-medium text-text-primary">
        Channel Breakdown
      </h3>
      <div className="space-y-4">
        {sorted.map((ch) => {
          const barWidth = (ch.total_leads / maxLeads) * 100;
          const color = dotColors[ch.name] ?? "#C9A96E";
          return (
            <button
              key={ch.id}
              className="flex w-full items-center gap-3 rounded-lg p-1 text-left transition-colors hover:bg-background"
            >
              <span
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="w-24 flex-shrink-0 text-sm text-text-primary">
                {ch.name}
              </span>
              <div className="flex-1">
                <div className="h-2 w-full rounded-full bg-background">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: color,
                      opacity: 0.6,
                    }}
                  />
                </div>
              </div>
              <span
                className="w-8 text-right text-sm font-medium text-text-primary"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                {ch.total_leads}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
