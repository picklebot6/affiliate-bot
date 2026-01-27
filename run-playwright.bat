@echo off
setlocal

cd /d D:\PlayWright\affiliate-bot || exit /b 1

set PLAYWRIGHT_BROWSERS_PATH=0
set PLAYWRIGHT_HTML_OPEN=never
set PW_TEST_HTML_REPORT_OPEN=never

if not exist logs mkdir logs
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set TS=%%i

REM Run tests and strip ANSI (cursor movement, colors, etc.) before logging
powershell -NoProfile -Command ^
  "& { npx playwright test --reporter=line 2>&1 | %% { $_ -replace '\x1b\[[0-9;?]*[ -/]*[@-~]', '' } | Out-File -Encoding utf8 -FilePath 'logs\run-%TS%.log' }"

endlocal