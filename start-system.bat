@echo off
echo Starting Student Feedback System...
echo.

echo Starting Backend Server...
cd backend
start cmd /k "npm start"
cd ..

echo Starting Frontend Development Server...
cd frontend
start cmd /k "npm start"
cd ..

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this message...
pause >nul
