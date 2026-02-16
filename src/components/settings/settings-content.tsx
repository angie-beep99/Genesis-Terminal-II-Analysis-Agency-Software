"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CompanyTab from "./company-tab";
import TeamTab from "./team-tab";
import NotificationsTab from "./notifications-tab";
import BillingTab from "./billing-tab";
import DataTab from "./data-tab";
import IntegrationsTab from "./integrations-tab";
import type { Company, User, Lead, DailyPerformance, Channel } from "@/lib/types";

interface SettingsContentProps {
  company: Company | null;
  users: User[];
  leads: Lead[];
  performance: DailyPerformance[];
  channels: Channel[];
  currentUserEmail: string;
}

const tabs = [
  { key: "company", label: "Company" },
  { key: "team", label: "Team" },
  { key: "notifications", label: "Notifications" },
  { key: "billing", label: "Billing" },
  { key: "data", label: "Data" },
  { key: "integrations", label: "Integrations" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function SettingsContent({
  company,
  users,
  leads,
  performance,
  channels,
  currentUserEmail,
}: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("company");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Tab navigation */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm transition-colors ${
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
        {activeTab === "company" && company && <CompanyTab company={company} />}
        {activeTab === "team" && (
          <TeamTab users={users} currentUserEmail={currentUserEmail} />
        )}
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "billing" && company && <BillingTab company={company} />}
        {activeTab === "data" && (
          <DataTab
            leads={leads}
            performance={performance}
            channels={channels}
          />
        )}
        {activeTab === "integrations" && <IntegrationsTab />}
      </div>
    </motion.div>
  );
}
