"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import AdminMetricsTab from "./tabs/metrics-tab";
import AdminDailyTab from "./tabs/daily-tab";
import AdminChannelsTab from "./tabs/channels-tab";
import AdminCampaignsTab from "./tabs/campaigns-tab";
import AdminLeadsTab from "./tabs/leads-tab";
import AdminInsightsTab from "./tabs/insights-tab";
import AdminReportsTab from "./tabs/reports-tab";
import AdminInboxTab from "./tabs/inbox-tab";
import AdminSettingsTab from "./tabs/settings-tab";
import type {
  Company,
  MonthlyMetric,
  DailyPerformance,
  Channel,
  Campaign,
  Lead,
  Insight,
  Report,
  InboxThread,
  InboxMessage,
  User,
} from "@/lib/types";

interface CompanyManagementProps {
  company: Company;
  metrics: MonthlyMetric[];
  dailyPerformance: DailyPerformance[];
  channels: Channel[];
  campaigns: Campaign[];
  leads: Lead[];
  insights: Insight[];
  reports: Report[];
  threads: InboxThread[];
  messages: InboxMessage[];
  users: User[];
}

const tabs = [
  { key: "metrics", label: "Metrics" },
  { key: "daily", label: "Daily Data" },
  { key: "channels", label: "Channels" },
  { key: "campaigns", label: "Campaigns" },
  { key: "leads", label: "Leads" },
  { key: "insights", label: "Insights" },
  { key: "reports", label: "Reports" },
  { key: "inbox", label: "Inbox" },
  { key: "settings", label: "Settings" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function CompanyManagement(props: CompanyManagementProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("metrics");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="rounded-lg border border-border bg-card p-2 text-text-muted transition-colors hover:border-gold hover:text-text-primary"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-text-primary">
              {props.company.name}
            </h1>
            <p className="text-xs text-text-muted">
              {props.company.industry ?? "—"} &middot;{" "}
              {props.company.contact_email ?? "—"}
            </p>
          </div>
        </div>
        <Link
          href={`/overview?preview=${props.company.id}`}
          target="_blank"
          className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <ExternalLink size={14} />
          Preview as Client
        </Link>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs transition-colors ${
              activeTab === tab.key
                ? "bg-background font-medium text-text-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "metrics" && (
          <AdminMetricsTab companyId={props.company.id} metrics={props.metrics} />
        )}
        {activeTab === "daily" && (
          <AdminDailyTab companyId={props.company.id} data={props.dailyPerformance} />
        )}
        {activeTab === "channels" && (
          <AdminChannelsTab companyId={props.company.id} channels={props.channels} />
        )}
        {activeTab === "campaigns" && (
          <AdminCampaignsTab
            companyId={props.company.id}
            campaigns={props.campaigns}
            channels={props.channels}
          />
        )}
        {activeTab === "leads" && (
          <AdminLeadsTab companyId={props.company.id} leads={props.leads} />
        )}
        {activeTab === "insights" && (
          <AdminInsightsTab companyId={props.company.id} insights={props.insights} />
        )}
        {activeTab === "reports" && (
          <AdminReportsTab companyId={props.company.id} reports={props.reports} />
        )}
        {activeTab === "inbox" && (
          <AdminInboxTab
            companyId={props.company.id}
            threads={props.threads}
            messages={props.messages}
          />
        )}
        {activeTab === "settings" && (
          <AdminSettingsTab company={props.company} users={props.users} />
        )}
      </div>
    </motion.div>
  );
}
