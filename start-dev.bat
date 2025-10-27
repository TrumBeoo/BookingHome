@echo off
echo Starting Homestay Hub Development Environment...
echo.

echo Starting Backend Server...
cd backend
start cmd /k "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
cd ..\frontend
start cmd /k "npm run dev"

echo.
echo Development servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
pause