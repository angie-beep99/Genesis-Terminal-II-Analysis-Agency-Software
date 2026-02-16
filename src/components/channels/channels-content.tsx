"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AllChannelsView from "./all-channels-view";
import ChannelDetailView from "./channel-detail-view";
import type { Channel, Campaign, DailyPerformance, Insight } from "@/lib/types";

interface ChannelsContentProps {
  channels: Channel[];
  campaigns: Campaign[];
  dailyPerformance: DailyPerformance[];
  insights: Insight[];
}

export default function ChannelsContent({
  channels,
  campaigns,
  dailyPerformance,
  insights,
}: ChannelsContentProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const tabs = [
    { key: "all", label: "All Channels" },
    ...channels.map((ch) => ({ key: ch.id, label: ch.name })),
  ];

  const selectedChannel = channels.find((ch) => ch.id === activeTab) ?? null;

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm transition-colors ${
              activeTab === tab.key
                ? "bg-gold/10 text-gold"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "all" ? (
          <AllChannelsView
            channels={channels}
            campaigns={campaigns}
            dailyPerformance={dailyPerformance}
          />
        ) : selectedChannel ? (
          <ChannelDetailView
            channel={selectedChannel}
            campaigns={campaigns.filter((c) => c.channel_id === selectedChannel.id)}
            dailyPerformance={dailyPerformance}
            allCampaigns={campaigns}
            insights={insights}
          />
        ) : null}
      </motion.div>
    </div>
  );
}
