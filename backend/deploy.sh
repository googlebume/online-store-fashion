#!/usr/bin/env bash
# Usage: ./deploy.sh <service-name>
# Example: ./deploy.sh auth-service
# Example: ./deploy.sh order-service
#
# Why the temp-dir approach:
#   railway.toml must point to "Dockerfile" (root-level).
#   services/database/Dockerfile must be absent so Railway doesn't auto-detect it.
#   Each service gets its own Dockerfile copied to the snapshot root.

set -e

SERVICE="$1"
if [ -z "$SERVICE" ]; then
  echo "Usage: $0 <service-name>"
  echo "Available: auth-service order-service product-service admin-service analytics-service database"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVICE_DOCKERFILE="$SCRIPT_DIR/services/$SERVICE/Dockerfile"

if [ ! -f "$SERVICE_DOCKERFILE" ]; then
  echo "Error: No Dockerfile found at $SERVICE_DOCKERFILE"
  exit 1
fi

TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

echo "→ Preparing snapshot for $SERVICE..."

rsync -a \
  --exclude='services/database/Dockerfile' \
  --exclude='node_modules' --exclude='**/node_modules' \
  --exclude='dist' --exclude='**/dist' \
  --exclude='.prisma' --exclude='**/.prisma' \
  --exclude='services/database/prisma/generated' \
  --exclude='services/database/dev.db' \
  --exclude='services/database/products' \
  --exclude='services/product-service/products' \
  --exclude='**/*.tsbuildinfo' \
  "$SCRIPT_DIR/" "$TMPDIR/"

cp "$SERVICE_DOCKERFILE" "$TMPDIR/Dockerfile"

cat > "$TMPDIR/railway.toml" << 'EOF'
[build]
builder = "dockerfile"
dockerfilePath = "Dockerfile"

[deploy]
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
EOF

echo "→ Uploading snapshot for $SERVICE..."
cd "$TMPDIR"
railway link --project aa4ce1a0-4f71-4c9f-9c97-919f6d891bd5 --environment production --service "$SERVICE" 2>&1 | tail -1
railway up --service "$SERVICE" --detach 2>&1
echo "→ Done. Watch logs: railway logs --service $SERVICE"
