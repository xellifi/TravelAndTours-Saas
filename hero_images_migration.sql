-- Adds a hero_images array to the businesses table so owners can manage
-- up to 5 rotating hero images on their public landing page.
-- Run this in your Supabase SQL editor.

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS hero_images TEXT[] NOT NULL DEFAULT '{}';
