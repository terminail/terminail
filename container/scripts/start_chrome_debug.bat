@echo off
REM Script to start Chrome with remote debugging port for E2E testing

REM Check if Chrome is already running with debug port
netstat -ano | findstr :9222 >nul
if %errorlevel% == 0 (
    echo Chrome is already running with debug port 9222
    exit /b 0
)

REM Start Chrome with remote debugging port
echo Starting Chrome with remote debugging port 9222...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
    --remote-debugging-port=9222 ^
    --no-first-run ^
    --no-default-browser-check ^
    --disable-extensions ^
    --disable-plugins ^
    --disable-images ^
    --user-data-dir=%TEMP%\chrome_debug_user_data

REM Wait for Chrome to start
timeout /t 3 /nobreak >nul

REM Verify Chrome is running
netstat -ano | findstr :9222 >nul
if %errorlevel% == 0 (
    echo Chrome successfully started with debug port 9222
) else (
    echo Failed to start Chrome with debug port 9222
    exit /b 1
)