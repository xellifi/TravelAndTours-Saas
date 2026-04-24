-- ---------------------------------------------------------------------------
-- Operating hours per business.
--
-- Stored as two simple text fields on the business row itself:
--   * operating_hours       — primary line, e.g. "Mon – Sat · 9:00 AM – 7:00 PM"
--   * operating_hours_note  — optional note, e.g. "Sundays by appointment"
--
-- Free-form text (not structured day/time) is intentional: owners can write
-- the schedule the way their customers actually read it, with whatever
-- punctuation, language, or holiday note they need.
--
-- Run once in the Supabase SQL Editor.
-- ---------------------------------------------------------------------------

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS operating_hours TEXT,
  ADD COLUMN IF NOT EXISTS operating_hours_note TEXT;
