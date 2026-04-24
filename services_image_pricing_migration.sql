-- Adds image and price-range columns to the services table.
-- Run this in your Supabase SQL editor.

ALTER TABLE services
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS price_min NUMERIC,
  ADD COLUMN IF NOT EXISTS price_max NUMERIC;

-- Backfill the new columns from the legacy `price` column where empty.
UPDATE services
SET price_min = price
WHERE price_min IS NULL AND price IS NOT NULL;

UPDATE services
SET price_max = price
WHERE price_max IS NULL AND price IS NOT NULL;

-- (Optional) constraint: max should be >= min when both present.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'services_price_range_chk'
  ) THEN
    ALTER TABLE services
      ADD CONSTRAINT services_price_range_chk
      CHECK (price_max IS NULL OR price_min IS NULL OR price_max >= price_min);
  END IF;
END $$;
