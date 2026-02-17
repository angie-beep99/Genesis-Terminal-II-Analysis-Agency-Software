-- Add is_admin flag to users table
ALTER TABLE users ADD COLUMN is_admin boolean NOT NULL DEFAULT false;

-- Admin RLS: allow admins to view ALL companies
CREATE POLICY "Admins can view all companies"
  ON companies FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

-- Admin RLS: allow admins to update ALL companies
CREATE POLICY "Admins can update all companies"
  ON companies FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

-- Helper function to check admin status
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true);
$$ LANGUAGE sql SECURITY DEFINER;

-- Admin full-access policies for all data tables
-- monthly_metrics
CREATE POLICY "Admins can manage monthly_metrics" ON monthly_metrics FOR ALL
  USING (is_admin());

-- daily_performance
CREATE POLICY "Admins can manage daily_performance" ON daily_performance FOR ALL
  USING (is_admin());

-- channels
CREATE POLICY "Admins can manage channels" ON channels FOR ALL
  USING (is_admin());

-- campaigns
CREATE POLICY "Admins can manage campaigns" ON campaigns FOR ALL
  USING (is_admin());

-- leads
CREATE POLICY "Admins can manage leads" ON leads FOR ALL
  USING (is_admin());

-- lead_activity
CREATE POLICY "Admins can manage lead_activity" ON lead_activity FOR ALL
  USING (is_admin());

-- lead_notes
CREATE POLICY "Admins can manage lead_notes" ON lead_notes FOR ALL
  USING (is_admin());

-- insights
CREATE POLICY "Admins can manage insights" ON insights FOR ALL
  USING (is_admin());

-- reports
CREATE POLICY "Admins can manage reports" ON reports FOR ALL
  USING (is_admin());

-- inbox_threads
CREATE POLICY "Admins can manage inbox_threads" ON inbox_threads FOR ALL
  USING (is_admin());

-- inbox_messages
CREATE POLICY "Admins can manage inbox_messages" ON inbox_messages FOR ALL
  USING (is_admin());

-- users
CREATE POLICY "Admins can view all users" ON users FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can manage users" ON users FOR ALL
  USING (is_admin());
