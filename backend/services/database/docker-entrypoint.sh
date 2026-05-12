#!/bin/sh
set -e

cd /app/services/database

# Run prisma db push in background so the HTTP server starts immediately
# (Railway health check needs port 5000 to respond quickly)
(
  echo "[database] Syncing database schema..."
  npx prisma db push && echo "[database] Schema synced." || echo "[database] Schema sync failed (non-fatal)."
) &

exec node dist/main
