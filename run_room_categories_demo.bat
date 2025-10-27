@echo off
echo 🚀 Khởi động demo Room Categories
echo.

echo 📊 Tạo dữ liệu mẫu...
cd backend
python create_sample_data.py
echo.

echo 🔧 Khởi động backend server...
start "Backend Server" cmd /k "python main.py"
timeout /t 3

echo 🎨 Khởi động frontend...
cd ..\frontend
start "Frontend" cmd /k "npm run dev"
timeout /t 2

echo 📱 Khởi động dashboard...
cd ..\Dashboard
start "Dashboard" cmd /k "npm run dev"

echo.
echo ✅ Tất cả services đã được khởi động!
echo.
echo 🌐 Frontend (Khách hàng): http://localhost:5173
echo 📊 Dashboard (Quản lý): http://localhost:5174  
echo 🔧 API Documentation: http://localhost:8000/docs
echo.
echo 📋 Test Room Categories:
echo   - Frontend: http://localhost:5173/room-categories
echo   - Dashboard: http://localhost:5174/room-categories
echo.
pause