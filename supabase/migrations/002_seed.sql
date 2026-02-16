-- Migration: 002_seed.sql
-- Seed data for Morrison & Associates - Personal Injury Law Firm
-- ~$30,000/month ad spend across Google Ads, Meta, Bing, TikTok

-- ============================================================
-- COMPANY
-- ============================================================
INSERT INTO companies (id, name, industry, website, logo_url, contact_email, partnership_start, terminal_ownership_date, created_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Morrison & Associates',
  'Legal - Personal Injury',
  'https://morrisonlaw.example.com',
  NULL,
  'info@morrisonlaw.example.com',
  '2024-06-01',
  '2024-09-15',
  now()
);

-- ============================================================
-- CHANNELS (4)
-- ============================================================
INSERT INTO channels (id, company_id, name, status) VALUES
  ('aaaa0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Google Ads', 'active'),
  ('aaaa0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Meta', 'active'),
  ('aaaa0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Bing', 'active'),
  ('aaaa0004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'TikTok', 'active');

-- ============================================================
-- CAMPAIGNS (10 total across channels)
-- ============================================================
-- Google Ads campaigns
INSERT INTO campaigns (id, channel_id, company_id, name, status, spend, leads, cpl) VALUES
  ('bbbb0001-0000-0000-0000-000000000001', 'aaaa0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'PI - Car Accidents [Search]', 'active', 8500.00, 34, 250.00),
  ('bbbb0002-0000-0000-0000-000000000002', 'aaaa0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'PI - Slip & Fall [Search]', 'active', 3200.00, 16, 200.00),
  ('bbbb0003-0000-0000-0000-000000000003', 'aaaa0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'PI - Workers Comp [Search]', 'paused', 1800.00, 8, 225.00);

-- Meta campaigns
INSERT INTO campaigns (id, channel_id, company_id, name, status, spend, leads, cpl) VALUES
  ('bbbb0004-0000-0000-0000-000000000004', 'aaaa0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'PI Awareness - Video', 'active', 4200.00, 28, 150.00),
  ('bbbb0005-0000-0000-0000-000000000005', 'aaaa0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'PI Retargeting - Carousel', 'active', 2100.00, 18, 116.67),
  ('bbbb0006-0000-0000-0000-000000000006', 'aaaa0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'Free Consultation - Lead Gen', 'active', 3500.00, 22, 159.09);

-- Bing campaigns
INSERT INTO campaigns (id, channel_id, company_id, name, status, spend, leads, cpl) VALUES
  ('bbbb0007-0000-0000-0000-000000000007', 'aaaa0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
   'PI - Car Accidents [Bing Search]', 'active', 2800.00, 14, 200.00),
  ('bbbb0008-0000-0000-0000-000000000008', 'aaaa0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
   'PI - General Injury [Bing Search]', 'active', 1500.00, 9, 166.67);

-- TikTok campaigns
INSERT INTO campaigns (id, channel_id, company_id, name, status, spend, leads, cpl) VALUES
  ('bbbb0009-0000-0000-0000-000000000009', 'aaaa0004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111',
   'PI Stories - Awareness', 'active', 1600.00, 12, 133.33),
  ('bbbb0010-0000-0000-0000-000000000010', 'aaaa0004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111',
   'Know Your Rights - Engagement', 'active', 800.00, 7, 114.29);

-- ============================================================
-- MONTHLY_METRICS (3 months)
-- ============================================================
INSERT INTO monthly_metrics (company_id, month, total_spend, total_leads, qualified_leads, cost_per_lead, cost_per_qualified_lead, revenue_influenced) VALUES
  ('11111111-1111-1111-1111-111111111111', '2025-11-01', 28500.00, 142, 52, 200.70, 548.08, 312000.00),
  ('11111111-1111-1111-1111-111111111111', '2025-12-01', 31200.00, 158, 61, 197.47, 511.48, 385000.00),
  ('11111111-1111-1111-1111-111111111111', '2026-01-01', 30000.00, 168, 65, 178.57, 461.54, 420000.00);

-- ============================================================
-- DAILY_PERFORMANCE (30 days: Jan 17 – Feb 15 2026)
-- Realistic ~$1,000/day spend, 4-7 leads/day, 1-3 qualified/day
-- ============================================================
INSERT INTO daily_performance (company_id, date, spend, leads, qualified_leads) VALUES
  ('11111111-1111-1111-1111-111111111111', '2026-01-17', 1050.00, 5, 2),
  ('11111111-1111-1111-1111-111111111111', '2026-01-18', 980.00, 4, 1),
  ('11111111-1111-1111-1111-111111111111', '2026-01-19', 720.00, 3, 1),
  ('11111111-1111-1111-1111-111111111111', '2026-01-20', 1120.00, 6, 3),
  ('11111111-1111-1111-1111-111111111111', '2026-01-21', 1085.00, 7, 2),
  ('11111111-1111-1111-1111-111111111111', '2026-01-22', 1040.00, 5, 2),
  ('11111111-1111-1111-1111-111111111111', '2026-01-23', 990.00, 6, 3),
  ('11111111-1111-1111-1111-111111111111', '2026-01-24', 1150.00, 7, 2),
  ('11111111-1111-1111-1111-111111111111', '2026-01-25', 680.00, 3, 1),
  ('11111111-1111-1111-1111-111111111111', '2026-01-26', 640.00, 3, 1),
  ('11111111-1111-1111-1111-111111111111', '2026-01-27', 1100.00, 6, 2),
  ('11111111-1111-1111-1111-111111111111', '2026-01-28', 1060.00, 5, 2),
  ('11111111-1111-1111-1111-111111111111', '2026-01-29', 1030.00, 6, 3),
  ('11111111-1111-1111-1111-111111111111', '2026-01-30', 1140.00, 7, 3),
  ('11111111-1111-1111-1111-111111111111', '2026-01-31', 950.00, 4, 1),
  ('11111111-1111-1111-1111-111111111111', '2026-02-01', 690.00, 3, 1),
  ('11111111-1111-1111-1111-111111111111', '2026-02-02', 1080.00, 5, 2),
  ('11111111-1111-1111-1111-111111111111', '2026-02-03', 1110.00, 6, 2),
  ('11111111-1111-1111-1111-111111111111', '2026-02-04', 1020.00, 5, 2),
  ('11111111-1111-1111-1111-111111111111', '2026-02-05', 1070.00, 6, 3),
  ('11111111-1111-1111-1111-111111111111', '2026-02-06', 1090.00, 7, 2),
  ('11111111-1111-1111-1111-111111111111', '2026-02-07', 750.00, 3, 1),
  ('11111111-1111-1111-1111-111111111111', '2026-02-08', 700.00, 3, 1),
  ('11111111-1111-1111-1111-111111111111', '2026-02-09', 1130.00, 6, 2),
  ('11111111-1111-1111-1111-111111111111', '2026-02-10', 1060.00, 5, 2),
  ('11111111-1111-1111-1111-111111111111', '2026-02-11', 1015.00, 5, 2),
  ('11111111-1111-1111-1111-111111111111', '2026-02-12', 1180.00, 8, 3),
  ('11111111-1111-1111-1111-111111111111', '2026-02-13', 1050.00, 6, 2),
  ('11111111-1111-1111-1111-111111111111', '2026-02-14', 730.00, 3, 1),
  ('11111111-1111-1111-1111-111111111111', '2026-02-15', 680.00, 4, 1);

-- ============================================================
-- LEADS (20 with mixed statuses)
-- Personal injury law firm leads: car accidents, slip & fall, etc.
-- ============================================================
INSERT INTO leads (id, company_id, name, company, email, phone, source, campaign, status, value, cpa, created_at, updated_at) VALUES
  ('cccc0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'James Rivera', NULL, 'j.rivera@email.com', '(555) 101-2001', 'Google Ads', 'PI - Car Accidents [Search]',
   'won', 45000.00, 235.00, now() - interval '28 days', now() - interval '3 days'),

  ('cccc0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'Patricia Chen', NULL, 'p.chen@email.com', '(555) 101-2002', 'Google Ads', 'PI - Car Accidents [Search]',
   'qualified', 30000.00, 210.00, now() - interval '25 days', now() - interval '1 day'),

  ('cccc0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
   'Marcus Washington', NULL, 'mwash@email.com', '(555) 101-2003', 'Meta', 'PI Awareness - Video',
   'proposal_sent', 22000.00, 180.00, now() - interval '20 days', now() - interval '2 days'),

  ('cccc0004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111',
   'Linda Kowalski', NULL, 'lkowalski@email.com', '(555) 101-2004', 'Google Ads', 'PI - Slip & Fall [Search]',
   'won', 65000.00, 195.00, now() - interval '30 days', now() - interval '5 days'),

  ('cccc0005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111',
   'David Nguyen', NULL, 'dnguyen@email.com', '(555) 101-2005', 'Bing', 'PI - Car Accidents [Bing Search]',
   'contacted', 18000.00, 200.00, now() - interval '5 days', now() - interval '1 day'),

  ('cccc0006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111',
   'Sarah Martinez', NULL, 'smartinez@email.com', '(555) 101-2006', 'Meta', 'Free Consultation - Lead Gen',
   'new', NULL, 155.00, now() - interval '2 days', now() - interval '2 days'),

  ('cccc0007-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111',
   'Robert Kim', NULL, 'rkim@email.com', '(555) 101-2007', 'Google Ads', 'PI - Workers Comp [Search]',
   'qualified', 35000.00, 225.00, now() - interval '18 days', now() - interval '4 days'),

  ('cccc0008-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111',
   'Angela Thompson', NULL, 'athompson@email.com', '(555) 101-2008', 'TikTok', 'PI Stories - Awareness',
   'contacted', 15000.00, 130.00, now() - interval '8 days', now() - interval '3 days'),

  ('cccc0009-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111',
   'Michael O''Brien', NULL, 'mobrien@email.com', '(555) 101-2009', 'Google Ads', 'PI - Car Accidents [Search]',
   'lost', 28000.00, 240.00, now() - interval '35 days', now() - interval '10 days'),

  ('cccc0010-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111',
   'Jennifer Davis', NULL, 'jdavis@email.com', '(555) 101-2010', 'Meta', 'PI Retargeting - Carousel',
   'won', 52000.00, 115.00, now() - interval '40 days', now() - interval '8 days'),

  ('cccc0011-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111',
   'William Harris', NULL, 'wharris@email.com', '(555) 101-2011', 'Bing', 'PI - General Injury [Bing Search]',
   'new', NULL, 165.00, now() - interval '1 day', now() - interval '1 day'),

  ('cccc0012-0000-0000-0000-000000000012', '11111111-1111-1111-1111-111111111111',
   'Emily Rodriguez', NULL, 'erodriguez@email.com', '(555) 101-2012', 'Google Ads', 'PI - Car Accidents [Search]',
   'qualified', 40000.00, 220.00, now() - interval '12 days', now() - interval '2 days'),

  ('cccc0013-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111',
   'Christopher Lee', NULL, 'clee@email.com', '(555) 101-2013', 'TikTok', 'Know Your Rights - Engagement',
   'contacted', 12000.00, 112.00, now() - interval '6 days', now() - interval '2 days'),

  ('cccc0014-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111',
   'Maria Garcia', NULL, 'mgarcia@email.com', '(555) 101-2014', 'Meta', 'PI Awareness - Video',
   'proposal_sent', 55000.00, 150.00, now() - interval '15 days', now() - interval '1 day'),

  ('cccc0015-0000-0000-0000-000000000015', '11111111-1111-1111-1111-111111111111',
   'Daniel Brown', NULL, 'dbrown@email.com', '(555) 101-2015', 'Google Ads', 'PI - Slip & Fall [Search]',
   'churned', 20000.00, 205.00, now() - interval '45 days', now() - interval '15 days'),

  ('cccc0016-0000-0000-0000-000000000016', '11111111-1111-1111-1111-111111111111',
   'Ashley Wilson', NULL, 'awilson@email.com', '(555) 101-2016', 'Meta', 'Free Consultation - Lead Gen',
   'new', NULL, 160.00, now() - interval '3 days', now() - interval '3 days'),

  ('cccc0017-0000-0000-0000-000000000017', '11111111-1111-1111-1111-111111111111',
   'Thomas Anderson', NULL, 'tanderson@email.com', '(555) 101-2017', 'Google Ads', 'PI - Car Accidents [Search]',
   'won', 72000.00, 250.00, now() - interval '50 days', now() - interval '12 days'),

  ('cccc0018-0000-0000-0000-000000000018', '11111111-1111-1111-1111-111111111111',
   'Nicole Taylor', NULL, 'ntaylor@email.com', '(555) 101-2018', 'Bing', 'PI - Car Accidents [Bing Search]',
   'qualified', 25000.00, 195.00, now() - interval '9 days', now() - interval '1 day'),

  ('cccc0019-0000-0000-0000-000000000019', '11111111-1111-1111-1111-111111111111',
   'Kevin Jackson', NULL, 'kjackson@email.com', '(555) 101-2019', 'Google Ads', 'PI - Workers Comp [Search]',
   'lost', 18000.00, 230.00, now() - interval '38 days', now() - interval '14 days'),

  ('cccc0020-0000-0000-0000-000000000020', '11111111-1111-1111-1111-111111111111',
   'Rachel Moore', NULL, 'rmoore@email.com', '(555) 101-2020', 'TikTok', 'PI Stories - Awareness',
   'new', NULL, 135.00, now() - interval '1 day', now() - interval '1 day');

-- ============================================================
-- LEAD_ACTIVITY (sample activity for several leads)
-- ============================================================
INSERT INTO lead_activity (lead_id, company_id, action, details, created_at) VALUES
  ('cccc0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Form submitted', 'Submitted intake form via Google Ads landing page', now() - interval '28 days'),
  ('cccc0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Phone call', 'Initial consultation call - 18 min', now() - interval '27 days'),
  ('cccc0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Status changed', 'Moved to Qualified', now() - interval '26 days'),
  ('cccc0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Proposal sent', 'Retainer agreement sent via email', now() - interval '20 days'),
  ('cccc0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Status changed', 'Case signed - marked as Won', now() - interval '3 days'),

  ('cccc0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'Form submitted', 'Free consultation request from Google Ads', now() - interval '25 days'),
  ('cccc0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'Phone call', 'Discussed case details - rear-end collision', now() - interval '24 days'),
  ('cccc0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'Status changed', 'Moved to Qualified - strong case', now() - interval '22 days'),

  ('cccc0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
   'Form submitted', 'Inquiry via Meta ad - video campaign', now() - interval '20 days'),
  ('cccc0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
   'Email sent', 'Follow-up email with case evaluation', now() - interval '18 days'),
  ('cccc0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
   'Proposal sent', 'Sent retainer agreement for review', now() - interval '10 days'),

  ('cccc0006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111',
   'Form submitted', 'New lead from Meta free consultation campaign', now() - interval '2 days'),

  ('cccc0010-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111',
   'Form submitted', 'Clicked retargeting ad and submitted form', now() - interval '40 days'),
  ('cccc0010-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111',
   'Status changed', 'Won - signed retainer', now() - interval '8 days');

-- ============================================================
-- LEAD_NOTES (sample notes)
-- ============================================================
INSERT INTO lead_notes (lead_id, company_id, note, created_at) VALUES
  ('cccc0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Client was rear-ended at a stoplight. Clear liability. Medical bills ~$12K so far. Strong case.', now() - interval '27 days'),
  ('cccc0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Retainer signed. Demand letter being prepared.', now() - interval '3 days'),

  ('cccc0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'Multi-vehicle accident on I-95. Client has documented injuries. Police report obtained.', now() - interval '24 days'),

  ('cccc0004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111',
   'Slip and fall at grocery store. Surveillance footage available. Significant back injury.', now() - interval '29 days'),
  ('cccc0004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111',
   'Settlement negotiations in progress. Insurance company offered $40K, pushing for $65K.', now() - interval '10 days'),

  ('cccc0007-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111',
   'Workers comp claim. Construction site injury. Employer may be liable for safety violations.', now() - interval '17 days'),

  ('cccc0014-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111',
   'Truck accident case. Client has extensive medical documentation. High-value case potential.', now() - interval '14 days');

-- ============================================================
-- INSIGHTS (6 insights)
-- ============================================================
INSERT INTO insights (company_id, content, category, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111',
   'Google Ads car accident campaigns are generating the highest-value cases. Average case value $42K vs $18K from other channels.',
   'performance', now() - interval '3 days'),
  ('11111111-1111-1111-1111-111111111111',
   'Cost per qualified lead dropped 12% month-over-month. The new landing page copy is performing well.',
   'optimization', now() - interval '5 days'),
  ('11111111-1111-1111-1111-111111111111',
   'TikTok leads have the lowest CPA ($128 avg) but lower qualification rate (22% vs 38% on Google). Volume play for awareness.',
   'channel', now() - interval '7 days'),
  ('11111111-1111-1111-1111-111111111111',
   'Weekend ad spend should be reduced by 30%. Lead quality drops significantly on Saturdays and Sundays.',
   'recommendation', now() - interval '10 days'),
  ('11111111-1111-1111-1111-111111111111',
   'Meta retargeting carousel campaign has the best ROI this month. 18 leads at $116 CPL with a 44% qualification rate.',
   'performance', now() - interval '12 days'),
  ('11111111-1111-1111-1111-111111111111',
   'Bing search is underutilized. Similar conversion rates to Google at 15% lower CPC. Recommend increasing Bing budget by $1,500/mo.',
   'recommendation', now() - interval '14 days');

-- ============================================================
-- REPORTS (3)
-- ============================================================
INSERT INTO reports (id, company_id, title, type, date_range_start, date_range_end, share_token, share_expires, file_url, created_at) VALUES
  ('dddd0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'January 2026 Performance Report', 'monthly', '2026-01-01', '2026-01-31',
   'share_jan2026_m0rr1s0n', now() + interval '30 days', NULL, now() - interval '15 days'),
  ('dddd0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'Q4 2025 Quarterly Review', 'quarterly', '2025-10-01', '2025-12-31',
   'share_q4_2025_m0rr1s0n', now() + interval '60 days', NULL, now() - interval '45 days'),
  ('dddd0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
   'Google Ads Channel Deep Dive', 'channel', '2026-01-01', '2026-02-15',
   'share_gads_m0rr1s0n', now() + interval '14 days', NULL, now() - interval '2 days');

-- ============================================================
-- INBOX_THREADS (5) and INBOX_MESSAGES
-- ============================================================
-- Thread 1: Weekly performance update
INSERT INTO inbox_threads (id, company_id, subject, category, last_message_at, created_at) VALUES
  ('eeee0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Weekly Performance Update - Feb 10-16', 'update', now() - interval '1 day', now() - interval '2 days');

INSERT INTO inbox_messages (thread_id, company_id, sender_type, sender_name, content, created_at) VALUES
  ('eeee0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'team', 'Sarah Chen', 'Hi Morrison team, here''s your weekly performance summary. Total spend: $7,105. Leads generated: 32. Qualified leads: 11. Your CPL dropped to $222 this week, down from $238 last week. Google Ads car accident campaign continues to be your top performer.', now() - interval '2 days'),
  ('eeee0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'client', 'Mark Morrison', 'Thanks Sarah. The car accident leads have been very strong. Can we increase budget on that campaign by $2K?', now() - interval '1 day'),
  ('eeee0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'team', 'Sarah Chen', 'Absolutely. I''ll make that adjustment today. With the additional budget, we should see roughly 8-10 more leads per month based on current conversion rates.', now() - interval '1 day');

-- Thread 2: New landing page test
INSERT INTO inbox_threads (id, company_id, subject, category, last_message_at, created_at) VALUES
  ('eeee0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'New Landing Page A/B Test Results', 'report', now() - interval '3 days', now() - interval '5 days');

INSERT INTO inbox_messages (thread_id, company_id, sender_type, sender_name, content, created_at) VALUES
  ('eeee0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'team', 'Jake Torres', 'We''ve completed the A/B test on the car accident landing page. Variant B (with the client testimonial video) outperformed the control by 23% in conversion rate. Recommend switching all traffic to Variant B.', now() - interval '5 days'),
  ('eeee0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'client', 'Mark Morrison', 'Great results. Let''s go with Variant B. Can we also add the testimonial video to the Bing campaigns?', now() - interval '4 days'),
  ('eeee0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'team', 'Jake Torres', 'Done! Variant B is now live across all search campaigns including Bing. I''ll monitor performance over the next week and report back.', now() - interval '3 days');

-- Thread 3: Budget question
INSERT INTO inbox_threads (id, company_id, subject, category, last_message_at, created_at) VALUES
  ('eeee0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
   'Question About TikTok Campaign Budget', 'question', now() - interval '4 days', now() - interval '6 days');

INSERT INTO inbox_messages (thread_id, company_id, sender_type, sender_name, content, created_at) VALUES
  ('eeee0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
   'client', 'Mark Morrison', 'I noticed the TikTok spend is relatively low compared to other channels. Should we be investing more there?', now() - interval '6 days'),
  ('eeee0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
   'team', 'Sarah Chen', 'Good question. TikTok has our lowest CPA but also the lowest qualification rate at 22%. We recommend keeping it at current levels for brand awareness while focusing growth budget on Google and Meta where qualification rates are 35-40%.', now() - interval '4 days');

-- Thread 4: Action required - lead follow-up
INSERT INTO inbox_threads (id, company_id, subject, category, last_message_at, created_at) VALUES
  ('eeee0004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111',
   'Action Required: 3 Leads Awaiting Response', 'action_required', now() - interval '6 hours', now() - interval '1 day');

INSERT INTO inbox_messages (thread_id, company_id, sender_type, sender_name, content, created_at) VALUES
  ('eeee0004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111',
   'team', 'Sarah Chen', 'Hi team, we have 3 new leads from the last 48 hours that haven''t been contacted yet: Sarah Martinez (Meta), William Harris (Bing), and Rachel Moore (TikTok). Quick follow-up within 24 hours significantly improves conversion rates.', now() - interval '1 day'),
  ('eeee0004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111',
   'client', 'Mark Morrison', 'On it. I''ll have Lisa reach out to all three this afternoon.', now() - interval '6 hours');

-- Thread 5: Monthly report ready
INSERT INTO inbox_threads (id, company_id, subject, category, last_message_at, created_at) VALUES
  ('eeee0005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111',
   'January 2026 Monthly Report Ready', 'report', now() - interval '14 days', now() - interval '15 days');

INSERT INTO inbox_messages (thread_id, company_id, sender_type, sender_name, content, created_at) VALUES
  ('eeee0005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111',
   'team', 'Jake Torres', 'Your January 2026 monthly report is ready for review. Key highlights: 168 total leads (up 6% MoM), CPL down to $178.57, and $420K in revenue influenced. The full report is available in your Reports section.', now() - interval '15 days'),
  ('eeee0005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111',
   'client', 'Mark Morrison', 'Excellent numbers. The CPL improvement is exactly what we wanted to see. Let''s discuss the Q1 strategy on our next call.', now() - interval '14 days');

-- ============================================================
-- NOTIFICATIONS (10)
-- ============================================================
INSERT INTO notifications (company_id, user_id, type, title, message, read, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', NULL,
   'lead', 'New Lead: Rachel Moore', 'New lead from TikTok - PI Stories campaign', false, now() - interval '1 day'),
  ('11111111-1111-1111-1111-111111111111', NULL,
   'lead', 'New Lead: William Harris', 'New lead from Bing - General Injury campaign', false, now() - interval '1 day'),
  ('11111111-1111-1111-1111-111111111111', NULL,
   'lead', 'New Lead: Sarah Martinez', 'New lead from Meta - Free Consultation campaign', false, now() - interval '2 days'),
  ('11111111-1111-1111-1111-111111111111', NULL,
   'milestone', 'Case Won: James Rivera', 'Car accident case signed - estimated value $45,000', true, now() - interval '3 days'),
  ('11111111-1111-1111-1111-111111111111', NULL,
   'report', 'January Report Ready', 'Your January 2026 performance report has been published', true, now() - interval '15 days'),
  ('11111111-1111-1111-1111-111111111111', NULL,
   'optimization', 'CPL Improvement', 'Cost per lead dropped 12% this month across all channels', true, now() - interval '5 days'),
  ('11111111-1111-1111-1111-111111111111', NULL,
   'alert', 'Budget Pacing Alert', 'Google Ads spend is 8% ahead of monthly pace. Consider adjusting daily caps.', true, now() - interval '7 days'),
  ('11111111-1111-1111-1111-111111111111', NULL,
   'milestone', 'Case Won: Jennifer Davis', 'Retargeting lead signed retainer - estimated value $52,000', true, now() - interval '8 days'),
  ('11111111-1111-1111-1111-111111111111', NULL,
   'lead', 'Lead Status Update: Nicole Taylor', 'Lead moved to Qualified status', true, now() - interval '1 day'),
  ('11111111-1111-1111-1111-111111111111', NULL,
   'campaign', 'Campaign Paused: Workers Comp', 'Workers Comp search campaign paused due to low qualification rate', true, now() - interval '10 days');
