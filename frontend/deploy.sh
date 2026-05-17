#!/usr/bin/env bash
# Usage: ./deploy.sh [service1 service2 ...]
# If no args, deploys all services.
# Example: ./deploy.sh auth shop admin

set -e

FRONTEND_DIR="$(cd "$(dirname "$0")" && pwd)"
ALL_SERVICES=("auth" "shop" "admin" "host" "product" "user-profile")

if [ "$#" -gt 0 ]; then
  SERVICES=("$@")
else
  SERVICES=("${ALL_SERVICES[@]}")
fi

for svc in "${SERVICES[@]}"; do
  SVC_DIR="$FRONTEND_DIR/services/$svc"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  [$svc] Building..."
  cd "$SVC_DIR"

  npm run build:prod 2>&1 | tail -3

  echo "  [$svc] Copying build → .vercel/output/static/"
  rm -rf .vercel/output/static
  cp -r build/ .vercel/output/static

  echo "  [$svc] Deploying to Vercel..."
  npx vercel pull --yes --environment production 2>&1 | tail -1
  npx vercel --prebuilt --prod --yes 2>&1 | grep -E "Aliased:|error|Error" | head -3

  echo "  ✓ [$svc] deployed"
done

echo ""
echo "All done."
