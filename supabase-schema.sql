-- GarageLeadly Supabase Database Schema
-- Run this in your Supabase SQL Editor to create all tables

-- Members table (contractor accounts)
CREATE TABLE members (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  company_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'paused', 'cancelled'
  membership_fee INTEGER NOT NULL DEFAULT 50000, -- in cents ($500)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Territories table (county assignments and budgets)
CREATE TABLE territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  county TEXT NOT NULL,
  daily_budget INTEGER NOT NULL DEFAULT 20000, -- in cents ($200)
  spent_today INTEGER NOT NULL DEFAULT 0, -- in cents
  last_lead_timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(member_id) -- one territory per member for now
);

-- Leads table (actual lead data)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  zip TEXT,
  county TEXT NOT NULL,
  issue_description TEXT,
  delivered_to_member_id UUID REFERENCES members(id),
  price_charged INTEGER NOT NULL, -- in cents
  stripe_charge_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead outcomes table (CRM tracking)
CREATE TABLE lead_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'called', 'scheduled', 'completed', 'lost'
  job_value INTEGER, -- in cents (only for completed jobs)
  notes TEXT,
  called_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(lead_id) -- one outcome per lead
);

-- Daily pricing table (track market rates)
CREATE TABLE daily_pricing (
  date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
  price_per_lead INTEGER NOT NULL, -- in cents
  cost_per_lead INTEGER NOT NULL, -- in cents (Google Ads cost)
  margin_percent DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_territories_county ON territories(county);
CREATE INDEX idx_leads_county ON leads(county);
CREATE INDEX idx_leads_member ON leads(delivered_to_member_id);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_lead_outcomes_member ON lead_outcomes(member_id);
CREATE INDEX idx_lead_outcomes_status ON lead_outcomes(status);

-- Row Level Security (RLS) Policies

-- Members: Users can only see their own data
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own member data"
  ON members FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own member data"
  ON members FOR UPDATE
  USING (auth.uid() = id);

-- Territories: Users can only see/update their own territories
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own territories"
  ON territories FOR SELECT
  USING (auth.uid() = member_id);

CREATE POLICY "Users can update their own territories"
  ON territories FOR UPDATE
  USING (auth.uid() = member_id);

-- Leads: Users can only see leads delivered to them
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own leads"
  ON leads FOR SELECT
  USING (auth.uid() = delivered_to_member_id);

-- Lead outcomes: Users can only see/manage their own lead outcomes
ALTER TABLE lead_outcomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lead outcomes"
  ON lead_outcomes FOR SELECT
  USING (auth.uid() = member_id);

CREATE POLICY "Users can insert their own lead outcomes"
  ON lead_outcomes FOR INSERT
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Users can update their own lead outcomes"
  ON lead_outcomes FOR UPDATE
  USING (auth.uid() = member_id);

-- Daily pricing: Public read access
ALTER TABLE daily_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view daily pricing"
  ON daily_pricing FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial pricing
INSERT INTO daily_pricing (date, price_per_lead, cost_per_lead, margin_percent)
VALUES (CURRENT_DATE, 4500, 3500, 28.57)
ON CONFLICT (date) DO NOTHING;

-- Success message
SELECT 'GarageLeadly database schema created successfully!' as message;
