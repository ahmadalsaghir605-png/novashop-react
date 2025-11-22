@echo off
REM Kill any process using port 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a

REM Set environment variable for DB port
set DB_PORT=3307

REM Start backend and frontend together in a new Command Prompt
start cmd /k "npm run dev:all"

REM Wait a few seconds for servers to start (adjust if needed)
timeout /t 5

REM Open Chrome to your site (change port if needed)
start chrome http://localhost:5173

pause