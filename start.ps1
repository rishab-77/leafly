# ─────────────────────────────────────────────
#  Leafly — Start Backend + Frontend
#  Usage: Right-click → "Run with PowerShell"
#         OR: .\start.ps1
# ─────────────────────────────────────────────

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$VENV_PYTHON = "$ROOT\.venv\Scripts\python.exe"
$FRONTEND_DIR = "$ROOT\frontend"

Write-Host ""
Write-Host "🌿 Starting Leafly..." -ForegroundColor Green
Write-Host "──────────────────────────────────────" -ForegroundColor DarkGray

# ── Kill any existing process on port 8000 ───
$existing = netstat -ano | Select-String ":8000 " | Select-String "LISTENING"
if ($existing) {
    $pid8000 = ($existing -split '\s+')[-1]
    Write-Host "⚠️  Killing existing process on port 8000 (PID $pid8000)" -ForegroundColor Yellow
    taskkill /PID $pid8000 /F | Out-Null
    Start-Sleep -Seconds 1
}

# ── Backend ──────────────────────────────────
Write-Host "🚀 Starting FastAPI backend  → http://127.0.0.1:8000" -ForegroundColor Cyan
$backend = Start-Process -FilePath $VENV_PYTHON `
    -ArgumentList "-m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000" `
    -WorkingDirectory $ROOT `
    -PassThru `
    -NoNewWindow

Start-Sleep -Seconds 2

# ── Frontend ─────────────────────────────────
Write-Host "⚡ Starting Vite frontend    → http://localhost:5173" -ForegroundColor Cyan
$frontend = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c npm run dev" `
    -WorkingDirectory $FRONTEND_DIR `
    -PassThru `
    -NoNewWindow

Write-Host ""
Write-Host "✅ Both servers running!" -ForegroundColor Green
Write-Host "   Backend  → http://127.0.0.1:8000" -ForegroundColor White
Write-Host "   Frontend → http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C or close this window to stop." -ForegroundColor DarkGray
Write-Host "──────────────────────────────────────" -ForegroundColor DarkGray

# ── Wait and clean up on exit ────────────────
try {
    Wait-Process -Id $backend.Id, $frontend.Id
} finally {
    Write-Host ""
    Write-Host "🛑 Shutting down servers..." -ForegroundColor Red
    Stop-Process -Id $backend.Id  -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue
}
