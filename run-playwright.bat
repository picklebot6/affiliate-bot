@echo off
setlocal

cd /d D:\PlayWright\affiliate-bot || exit /b 1

set PLAYWRIGHT_BROWSERS_PATH=0

REM Disable ANSI colors in logs
set FORCE_COLOR=0

if not exist logs mkdir logs

set DATESTAMP=%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2%

npx playwright test > logs\run-%DATESTAMP%.log 2>&1

endlocal
