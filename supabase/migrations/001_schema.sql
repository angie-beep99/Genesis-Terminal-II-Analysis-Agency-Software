-- Migration: 001_schema.sql
-- Genesis Terminal II - Database Schema
-- All tables, RLS policies, and indexes

-- ============================================================
-- 1. COMPANIES
-- ============================================================
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  website text,
  logo_url text,
  contact_email text,
  partnership_start date,
  terminal_ownership_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- NOTE: companies RLS policy is created after users table (see below)

-- ============================================================
-- 2. USERS
-- ============================================================
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  company_id uuid REFERENCES companies ON DELETE SET NULL,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Now create both companies and users RLS policies (users table exists)
CREATE POLICY "Users can view their own company"
  ON companies FOR SELECT
  USING (
    id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

CREATE POLICY "Users can view users in their company"
  ON users FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users u WHERE u.id = auth.uid()
    )
  );

-- ============================================================
-- 3. MONTHLY_METRICS
-- ============================================================
CREATE TABLE monthly_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies ON DELETE CASCADE,
  month date NOT NULL,
  total_spend decimal,
  total_leads int,
  qualified_leads int,
  cost_per_lead decimal,
  cost_per_qualified_lead decimal,
  revenue_influenced decimal,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE monthly_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company monthly_metrics"
  ON monthly_metrics FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

-- ============================================================
-- 4. DAILY_PERFORMANCE
-- ============================================================
CREATE TABLE daily_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies ON DELETE CASCADE,
  date date NOT NULL,
  spend decimal,
  leads int,
  qualified_leads int,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE daily_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company daily_performance"
  ON daily_performance FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

-- ============================================================
-- 5. CHANNELS
-- ============================================================
CREATE TABLE channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company channels"
  ON channels FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

-- ============================================================
-- 6. CAMPAIGNS
-- ============================================================
CREATE TABLE campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES channels ON DELETE SET NULL,
  company_id uuid NOT NULL REFERENCES companies ON DELETE CASCADE,
  name text NOT NULL,
  status text,
  spend decimal,
  leads int,
  cpl decimal,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company campaigns"
  ON campaigns FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

-- ============================================================
-- 7. LEADS
-- ============================================================
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies ON DELETE CASCADE,
  name text NOT NULL,
  company text,
  email text,
  phone text,
  source text,
  campaign text,
  status text NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost', 'churned')),
  value decimal,
  cpa decimal,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company leads"
  ON leads FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

-- ============================================================
-- 8. LEAD_ACTIVITY
-- ============================================================
CREATE TABLE lead_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies ON DELETE CASCADE,
  action text NOT NULL,
  details text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE lead_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company lead_activity"
  ON lead_activity FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

-- ============================================================
-- 9. LEAD_NOTES
-- ============================================================
CREATE TABLE lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies ON DELETE CASCADE,
  note text NOT NULL,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company lead_notes"
  ON lead_notes FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

-- ============================================================
-- 10. INSIGHTS
-- ============================================================
CREATE TABLE insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies ON DELETE CASCADE,
  content text NOT NULL,
  category text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company insights"
  ON insights FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

-- ============================================================
-- 11. REPORTS
-- ============================================================
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies ON DELETE CASCADE,
  title text NOT NULL,
  type text,
  date_range_start date,
  date_range_end date,
  share_token text UNIQUE,
  share_expires timestamptz,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company reports"
  ON reports FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

-- ============================================================
-- 12. INBOX_THREADS
-- ============================================================
CREATE TABLE inbox_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies ON DELETE CASCADE,
  subject text NOT NULL,
  category text NOT NULL CHECK (category IN ('update', 'question', 'report', 'action_required')),
  last_message_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE inbox_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company inbox_threads"
  ON inbox_threads FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

-- ============================================================
-- 13. INBOX_MESSAGES
-- ============================================================
CREATE TABLE inbox_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES inbox_threads ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('team', 'client')),
  sender_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE inbox_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company inbox_messages"
  ON inbox_messages FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

-- ============================================================
-- 14. NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  type text,
  title text NOT NULL,
  message text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

-- ============================================================
-- INDEXES for common queries
-- ============================================================
CREATE INDEX idx_users_company ON users (company_id);
CREATE INDEX idx_monthly_metrics_company ON monthly_metrics (company_id);
CREATE INDEX idx_daily_performance_company_date ON daily_performance (company_id, date);
CREATE INDEX idx_channels_company ON channels (company_id);
CREATE INDEX idx_campaigns_company ON campaigns (company_id);
CREATE INDEX idx_campaigns_channel ON campaigns (channel_id);
CREATE INDEX idx_leads_company ON leads (company_id);
CREATE INDEX idx_leads_status ON leads (status);
CREATE INDEX idx_lead_activity_lead ON lead_activity (lead_id);
CREATE INDEX idx_lead_notes_lead ON lead_notes (lead_id);
CREATE INDEX idx_insights_company ON insights (company_id);
CREATE INDEX idx_reports_company ON reports (company_id);
CREATE INDEX idx_inbox_threads_company ON inbox_threads (company_id);
CREATE INDEX idx_inbox_messages_thread ON inbox_messages (thread_id);
CREATE INDEX idx_notifications_user ON notifications (user_id);
CREATE INDEX idx_notifications_company ON notifications (company_id);
