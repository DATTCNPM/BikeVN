@echo off
REM ========================================
REM BikeVN Docker Setup Script (Batch)
REM ========================================
REM This script loads environment variables and manages Docker containers

setlocal enabledelayedexpansion

REM Colors won't work in CMD, so we use simple output
set ACTION=%1
if "%ACTION%"=="" set ACTION=status

REM Load .env file
if exist .env (
    echo [INFO] Loading environment variables from .env...
    for /f "usebackq delims=# eol=# tokens=1,* " %%a in (.env) do (
        if not "%%a"=="" (
            setlocal enabledelayedexpansion
            for /f "tokens=1,* delims==" %%i in ("%%a=%%b") do (
                set "VAR=%%i"
                set "VAL=%%j"
                if not "!VAR:~0,1!"==" " (
                    endlocal
                    set "!VAR!=!VAL!"
                    setlocal enabledelayedexpansion
                )
            )
            endlocal
        )
    )
    echo [SUCCESS] Environment variables loaded
) else (
    echo [ERROR] .env file not found
    exit /b 1
)

REM Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker not found or not running
    exit /b 1
) else (
    echo [SUCCESS] Docker is installed
)

REM Execute action
if "%ACTION%"=="up" goto docker_up
if "%ACTION%"=="down" goto docker_down
if "%ACTION%"=="logs" goto docker_logs
if "%ACTION%"=="help" goto show_help
goto docker_status

:docker_status
echo [INFO] Checking Docker container status...
cd docker
docker-compose -f docker-compose.yml ps
cd ..
goto end

:docker_up
echo [INFO] Starting Docker containers...
cd docker
docker-compose -f docker-compose.yml up -d
echo [SUCCESS] Containers started. Waiting for MySQL to be healthy...
timeout /t 10 /nobreak
docker-compose -f docker-compose.yml ps
cd ..
goto end

:docker_down
echo [INFO] Stopping Docker containers...
cd docker
docker-compose -f docker-compose.yml down
echo [SUCCESS] Containers stopped
cd ..
goto end

:docker_logs
echo [INFO] Showing Docker logs...
cd docker
docker-compose -f docker-compose.yml logs -f
cd ..
goto end

:show_help
echo.
echo BikeVN Docker Management Script
echo ================================
echo.
echo Usage: setup-env.bat [Action]
echo.
echo Available Actions:
echo   status    - Show Docker container status (default)
echo   up        - Start all Docker containers
echo   down      - Stop all Docker containers
echo   logs      - Show container logs
echo   help      - Show this help message
echo.
echo Examples:
echo   setup-env.bat status
echo   setup-env.bat up
echo   setup-env.bat down
echo   setup-env.bat logs
echo.
echo Database Access:
echo   phpMyAdmin: http://localhost:8080
echo   Adminer:    http://localhost:8081
echo   MySQL User: bikevn_user / bikevn_pass
echo.
goto end

:end
endlocal
