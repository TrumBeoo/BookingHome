@echo off
echo ========================================
echo        THIẾT LẬP TÀI KHOẢN ADMIN
echo ========================================
echo.

cd backend
echo Đang tạo tài khoản admin...
python create_admin.py

echo.
echo ========================================
echo Cài đặt dependencies cho Dashboard...
echo ========================================
cd ..\Dashboard
call npm install

echo.
echo ========================================
echo           HOÀN THÀNH THIẾT LẬP
echo ========================================
echo.
echo Để chạy hệ thống:
echo 1. Chạy backend: cd backend && python main.py
echo 2. Chạy Dashboard: cd Dashboard && npm run dev
echo.
echo Thông tin đăng nhập admin:
echo Email: admin@homestay.com
echo Password: admin123
echo.
pause