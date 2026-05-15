-- Add purchases column to ProducsAnalytics if it doesn't exist yet (PostgreSQL).
-- Safe to run on databases set up via `prisma db push` that already have this column.
ALTER TABLE "ProducsAnalytics" ADD COLUMN IF NOT EXISTS "purchases" INTEGER NOT NULL DEFAULT 0;
