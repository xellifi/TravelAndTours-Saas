-- Bookings table migration
-- Run this in your Supabase SQL Editor.
-- Safe to re-run: uses IF NOT EXISTS / IF EXISTS guards.

CREATE TABLE IF NOT EXISTS bookings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  service_id    UUID REFERENCES services(id) ON DELETE SET NULL,
  client_name   TEXT NOT NULL,
  client_email  TEXT NOT NULL,
  booking_date  TIMESTAMPTZ,
  status        TEXT NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bookings_business_id_idx
  ON bookings (business_id);

CREATE INDEX IF NOT EXISTS bookings_business_created_idx
  ON bookings (business_id, created_at DESC);

-- Row Level Security ---------------------------------------------------------
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Anyone (including unauthenticated visitors on a landing page) may create a
-- booking, scoped to a real business.
DROP POLICY IF EXISTS "Public can insert bookings" ON bookings;
CREATE POLICY "Public can insert bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    business_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM businesses b WHERE b.id = business_id)
  );

-- Owners can see / update / delete bookings for businesses they own.
DROP POLICY IF EXISTS "Owners can read their bookings" ON bookings;
CREATE POLICY "Owners can read their bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id = bookings.business_id AND b.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners can update their bookings" ON bookings;
CREATE POLICY "Owners can update their bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id = bookings.business_id AND b.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id = bookings.business_id AND b.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners can delete their bookings" ON bookings;
CREATE POLICY "Owners can delete their bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id = bookings.business_id AND b.owner_id = auth.uid()
    )
  );
