-- ---------------------------------------------------------------------------
-- Allow multiple businesses per owner.
--
-- Earlier versions of the schema may have had a UNIQUE constraint on
-- businesses.owner_id (so each user could only own a single business).
-- This script drops any such single-column unique constraint or unique
-- index on `owner_id` while leaving the slug uniqueness intact.
--
-- Run this once in the Supabase SQL Editor against the project.
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  r record;
BEGIN
  -- Drop any UNIQUE constraint defined on (owner_id) alone.
  FOR r IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_attribute a
      ON a.attrelid = t.oid AND a.attnum = ANY (c.conkey)
    WHERE t.relname = 'businesses'
      AND c.contype = 'u'
      AND array_length(c.conkey, 1) = 1
      AND a.attname = 'owner_id'
  LOOP
    EXECUTE format('ALTER TABLE businesses DROP CONSTRAINT %I', r.conname);
  END LOOP;

  -- Drop any plain UNIQUE INDEX on (owner_id) alone (if it wasn't backed by
  -- a constraint above).
  FOR r IN
    SELECT i.relname
    FROM pg_index ix
    JOIN pg_class i ON i.oid = ix.indexrelid
    JOIN pg_class t ON t.oid = ix.indrelid
    JOIN pg_attribute a
      ON a.attrelid = t.oid AND a.attnum = ANY (ix.indkey)
    WHERE t.relname = 'businesses'
      AND ix.indisunique
      AND ix.indnatts = 1
      AND a.attname = 'owner_id'
  LOOP
    EXECUTE format('DROP INDEX IF EXISTS %I', r.relname);
  END LOOP;
END $$;

-- A non-unique index on owner_id keeps the dashboard's "list businesses for
-- this owner" query fast.
CREATE INDEX IF NOT EXISTS businesses_owner_id_idx
  ON businesses (owner_id);
