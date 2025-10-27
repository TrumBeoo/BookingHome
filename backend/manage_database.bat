@echo off
echo ========================================
echo    DATABASE MANAGEMENT TOOLS
echo ========================================
echo.
echo 1. Kiem tra trang thai database
echo 2. Tao tat ca bang
echo 3. Xoa tat ca bang
echo 4. Tao lai tat ca bang (Reset)
echo 5. Reset database (nhanh)
echo 6. Thoat
echo.
set /p choice="Chon tuy chon (1-6): "

if "%choice%"=="1" (
    echo.
    echo Dang kiem tra trang thai database...
    python db_manager.py --status
    pause
    goto menu
)

if "%choice%"=="2" (
    echo.
    echo Dang tao tat ca bang...
    python db_manager.py --create-all
    pause
    goto menu
)

if "%choice%"=="3" (
    echo.
    echo Dang xoa tat ca bang...
    python db_manager.py --drop-all
    pause
    goto menu
)

if "%choice%"=="4" (
    echo.
    echo Dang tao lai tat ca bang...
    python db_manager.py --recreate-all
    pause
    goto menu
)

if "%choice%"=="5" (
    echo.
    echo Dang reset database...
    python reset_database.py
    pause
    goto menu
)

if "%choice%"=="6" (
    echo Tam biet!
    exit /b 0
)

echo Lua chon khong hop le!
pause

:menu
cls
goto :eof