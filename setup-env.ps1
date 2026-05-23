# ========================================
# BikeVN Docker Setup Script (PowerShell)
# ========================================
# This script loads environment variables and manages Docker containers

param(
    [string]$Action = "status"
)

# Colors for console output
$colors = @{
    Success = "Green"
    Error   = "Red"
    Warning = "Yellow"
    Info    = "Cyan"
}

function Write-Status {
    param([string]$Message, [string]$Status = "Info")
    $color = $colors[$Status]
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor $color
}

function Load-Environment {
    $envPath = ".\.env"
    if (Test-Path $envPath) {
        Write-Status "Loading environment variables from .env..." "Info"
        Get-Content $envPath | Where-Object { $_ -match '^[^#]*=' } | ForEach-Object {
            $key, $value = $_.Split('=', 2)
            $key = $key.Trim()
            $value = $value.Trim()
            if ($key) {
                [Environment]::SetEnvironmentVariable($key, $value, [System.EnvironmentVariableTarget]::Process)
            }
        }
        Write-Status "Environment variables loaded" "Success"
    }
    else {
        Write-Status ".env file not found" "Error"
        exit 1
    }
}

function Check-Docker {
    Write-Status "Checking Docker installation..." "Info"
    try {
        $version = docker --version
        Write-Status "Docker found: $version" "Success"
        return $true
    }
    catch {
        Write-Status "Docker not found or not running" "Error"
        return $false
    }
}

function Docker-Status {
    Write-Status "Checking Docker container status..." "Info"
    Push-Location docker
    docker-compose -f docker-compose.yml ps
    Pop-Location
}

function Docker-Up {
    Write-Status "Starting Docker containers..." "Info"
    Push-Location docker
    docker-compose -f docker-compose.yml up -d
    Write-Status "Containers started. Waiting for MySQL to be healthy..." "Success"
    Start-Sleep -Seconds 10
    docker-compose -f docker-compose.yml ps
    Pop-Location
}

function Docker-Down {
    Write-Status "Stopping Docker containers..." "Info"
    Push-Location docker
    docker-compose -f docker-compose.yml down
    Write-Status "Containers stopped" "Success"
    Pop-Location
}

function Docker-Logs {
    Write-Status "Showing Docker logs..." "Info"
    Push-Location docker
    docker-compose -f docker-compose.yml logs -f
    Pop-Location
}

function Show-Help {
    Write-Host @"
BikeVN Docker Management Script
================================

Usage: .\setup-env.ps1 [Action]

Available Actions:
  status    - Show Docker container status (default)
  up        - Start all Docker containers
  down      - Stop all Docker containers
  logs      - Show container logs
  help      - Show this help message

Examples:
  .\setup-env.ps1 status
  .\setup-env.ps1 up
  .\setup-env.ps1 down
  .\setup-env.ps1 logs

Database Access:
  phpMyAdmin: http://localhost:8080
  Adminer:    http://localhost:8081
  MySQL User: bikevn_user / bikevn_pass
"@
}

# Main execution
Load-Environment

if (-not (Check-Docker)) {
    exit 1
}

switch ($Action.ToLower()) {
    "up" { Docker-Up }
    "down" { Docker-Down }
    "logs" { Docker-Logs }
    "status" { Docker-Status }
    "help" { Show-Help }
    default { Docker-Status }
}
