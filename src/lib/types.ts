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

export interface Report {
  id: string;
  company_id: string;
  title: string;
  type: string | null;
  date_range_start: string | null;
  date_range_end: string | null;
  share_token: string | null;
  share_expires: string | null;
  file_url: string | null;
  created_at: string;
}

export interface InboxThread {
  id: string;
  company_id: string;
  subject: string;
  category: "update" | "question" | "report" | "action_required";
  is_read: boolean;
  last_message_at: string | null;
  created_at: string;
}

export interface InboxMessage {
  id: string;
  thread_id: string;
  company_id: string;
  sender_type: "team" | "client";
  sender_name: string;
  content: string;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  logo_url: string | null;
  contact_email: string | null;
  partnership_start: string | null;
  terminal_ownership_date: string | null;
  created_at: string;
}

export interface User {
  id: string;
  company_id: string | null;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  full_name: string | null;
  created_at: string;
}

export interface ChannelWithLeads extends Channel {
  total_leads: number;
}
