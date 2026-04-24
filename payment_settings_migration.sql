-- ============================================================
-- mywebpages — payment_settings table migration
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS payment_settings (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id         UUID REFERENCES businesses(id) ON DELETE CASCADE UNIQUE NOT NULL,
  gcash_name          TEXT,
  gcash_number        TEXT,
  paymaya_name        TEXT,
  paymaya_number      TEXT,
  bank_name           TEXT,
  bank_account_name   TEXT,
  bank_account_number TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Business owners can manage their own payment settings
CREATE POLICY "Owners can manage their payment settings"
  ON payment_settings FOR ALL
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

-- Anyone (public visitors) can read payment settings to show on booking confirmation
CREATE POLICY "Public can read payment settings"
  ON payment_settings FOR SELECT
  USING (true);

-- Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payment_settings_updated_at
  BEFORE UPDATE ON payment_settings
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();
