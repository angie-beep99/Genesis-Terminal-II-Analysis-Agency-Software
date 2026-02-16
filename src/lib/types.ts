export interface MonthlyMetric {
  id: string;
  company_id: string;
  month: string;
  total_spend: number;
  total_leads: number;
  qualified_leads: number;
  cost_per_lead: number;
  cost_per_qualified_lead: number;
  revenue_influenced: number;
  created_at: string;
}

export interface DailyPerformance {
  id: string;
  company_id: string;
  date: string;
  spend: number;
  leads: number;
  qualified_leads: number;
  created_at: string;
}

export interface Channel {
  id: string;
  company_id: string;
  name: string;
  status: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  channel_id: string;
  company_id: string;
  name: string;
  status: string;
  spend: number;
  leads: number;
  cpl: number;
  created_at: string;
}

export interface Lead {
  id: string;
  company_id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  campaign: string | null;
  status: "new" | "contacted" | "qualified" | "proposal_sent" | "won" | "lost" | "churned";
  value: number | null;
  cpa: number | null;
  created_at: string;
  updated_at: string;
}

export interface Insight {
  id: string;
  company_id: string;
  content: string;
  category: string | null;
  created_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  company_id: string;
  action: string;
  details: string | null;
  created_by: string | null;
  created_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  company_id: string;
  note: string;
  created_by: string | null;
  created_at: string;
}

export interface ChannelWithLeads extends Channel {
  total_leads: number;
}
