-- ---------------------------------------------------------------------------
-- Social links per business.
--
-- We store the list as JSONB on the business row itself so that:
--   * the public landing page can render the icons with no extra query
--   * the admin "Clone Business" action automatically carries the links over
--   * RLS on `businesses` already protects who can read/write them
--
-- Each entry has the shape:
--   { "id": "<uuid>", "platform": "facebook", "url": "https://..." }
--
-- Run once in the Supabase SQL Editor.
-- ---------------------------------------------------------------------------

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS social_links JSONB NOT NULL DEFAULT '[]'::jsonb;
