@echo off
setlocal

cd /d "%~dp0"
title Telionix Admin Panel

if not exist "node_modules" (
  echo Installing admin dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo Failed to install admin dependencies.
    pause
    exit /b 1
  )
)

start "" cmd /c "timeout /t 3 >nul && start http://localhost:4300"
call npm.cmd start
