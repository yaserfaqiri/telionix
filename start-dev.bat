@echo off
setlocal

cd /d "%~dp0"
title LG UAE Vue Dev Server

if not exist "node_modules" (
  echo Installing dependencies...
  call npm.cmd install --cache .npm-cache
  if errorlevel 1 (
    echo.
    echo Failed to install dependencies.
    pause
    exit /b 1
  )
)

if not exist "admin\node_modules" (
  echo Installing admin dependencies...
  pushd "admin"
  call npm.cmd install
  if errorlevel 1 (
    popd
    echo.
    echo Failed to install admin dependencies.
    pause
    exit /b 1
  )
  popd
)

netstat -ano | findstr ":4300" >nul
if errorlevel 1 (
  echo Starting admin API on http://localhost:4300 ...
  start "Telionix Admin API" cmd /c "cd /d ""%~dp0admin"" && npm.cmd start"
  timeout /t 3 >nul
) else (
  echo Admin API already running on port 4300.
)

call npm.cmd run dev
