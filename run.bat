@echo off
echo Building Unicorns R us is Bullshit...
echo.
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo BUILD FAILED
    pause
    exit /b 1
)
echo.
echo Build successful! Output is in the build\ folder.
echo.
call npm run serve -- --port 3001
pause
