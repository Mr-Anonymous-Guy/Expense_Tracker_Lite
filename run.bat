@echo off
setlocal
echo Starting FinSmart web, API, and AI worker...
start "FinSmart Web" cmd /k "cd /d %~dp0 && npm run dev:web"
start "FinSmart API" cmd /k "cd /d %~dp0apps\api && python run.py"
start "FinSmart AI" cmd /k "cd /d %~dp0 && npm run dev:ai"
