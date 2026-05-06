#!/bin/bash

# ─────────────────────────────────────────────
#  Leafly — Start Backend + Frontend
# ─────────────────────────────────────────────

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_PYTHON="$ROOT_DIR/.venv/Scripts/python"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo ""
echo "🌿 Starting Leafly..."
echo "──────────────────────────────────────"

# ── Backend ──────────────────────────────────
echo "🚀 Starting FastAPI backend on http://127.0.0.1:8000"
cd "$ROOT_DIR"
"$VENV_PYTHON" -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Give the backend a moment to start
sleep 2

# ── Frontend ─────────────────────────────────
echo "⚡ Starting Vite frontend on http://localhost:5173"
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are running!"
echo "   Backend  → http://127.0.0.1:8000"
echo "   Frontend → http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers."
echo "──────────────────────────────────────"

# ── Graceful shutdown on Ctrl+C ──────────────
trap "echo ''; echo '🛑 Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

# Keep script alive
wait $BACKEND_PID $FRONTEND_PID
