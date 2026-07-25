#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting FinSmart web, API, and AI worker..."
cd "$ROOT_DIR"

npm run dev:web &
WEB_PID=$!

cd "$ROOT_DIR/apps/api"
python run.py &
API_PID=$!

cd "$ROOT_DIR"
npm run dev:ai &
AI_PID=$!

trap 'kill $WEB_PID $API_PID $AI_PID 2>/dev/null || true' EXIT
wait
