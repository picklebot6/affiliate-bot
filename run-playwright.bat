@echo off
setlocal

cd /d D:\PlayWright\affiliate-bot || exit /b 1

REM Playwright runtime settings
set PLAYWRIGHT_BROWSERS_PATH=0
set PLAYWRIGHT_HTML_OPEN=never
set PW_TEST_HTML_REPORT_OPEN=never

REM Disable ANSI / colors / cursor control
set FORCE_COLOR=0
set PW_DISABLE_COLORS=1

if not exist logs mkdir logs

REM Stable ISO-style date (works regardless of locale)
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set DATESTAMP=%%i

npx playwright test --reporter=line > logs\run-%DATESTAMP%.log 2>&1

endlocal