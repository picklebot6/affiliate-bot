@echo off
setlocal enabledelayedexpansion

REM Always set working directory
cd /d C:\automation\playwright-automation

REM Load environment variables from .env
for /f "usebackq tokens=1,* delims==" %%A in (`type .env`) do (
  set %%A=%%B
)

REM Optional: pin Playwright browser path
set PLAYWRIGHT_BROWSERS_PATH=0

REM Create logs directory if missing
if not exist logs mkdir logs

REM Timestamp
set DATESTAMP=%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2%

REM Run Playwright headless (recommended)
npx playwright test ^
  > logs\run-%DATESTAMP%.log 2>&1

endlocal
