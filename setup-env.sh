#!/bin/bash
# ========================================
# BikeVN Docker Setup Script (Bash)
# ========================================
# This script loads environment variables and manages Docker containers

set -e

# Colors for console output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

ACTION="${1:-status}"

function write_status() {
    local message=$1
    local status=$2
    local timestamp=$(date '+%H:%M:%S')
    
    case $status in
        success)
            echo -e "${GREEN}[${timestamp}] ${message}${NC}"
            ;;
        error)
            echo -e "${RED}[${timestamp}] ${message}${NC}"
            ;;
        warning)
            echo -e "${YELLOW}[${timestamp}] ${message}${NC}"
            ;;
        *)
            echo -e "${CYAN}[${timestamp}] ${message}${NC}"
            ;;
    esac
}

function load_environment() {
    local env_file=".env"
    
    if [ -f "$env_file" ]; then
        write_status "Loading environment variables from .env..." "info"
        set -a
        source "$env_file"
        set +a
        write_status "Environment variables loaded" "success"
    else
        write_status ".env file not found" "error"
        exit 1
    fi
}

function check_docker() {
    write_status "Checking Docker installation..." "info"
    
    if command -v docker &> /dev/null; then
        local version=$(docker --version)
        write_status "Docker found: $version" "success"
        return 0
    else
        write_status "Docker not found or not running" "error"
        return 1
    fi
}

function docker_status() {
    write_status "Checking Docker container status..." "info"
    cd docker
    docker-compose -f docker-compose.yml ps
    cd ..
}

function docker_up() {
    write_status "Starting Docker containers..." "info"
    cd docker
    docker-compose -f docker-compose.yml up -d
    write_status "Containers started. Waiting for MySQL to be healthy..." "success"
    sleep 10
    docker-compose -f docker-compose.yml ps
    cd ..
}

function docker_down() {
    write_status "Stopping Docker containers..." "info"
    cd docker
    docker-compose -f docker-compose.yml down
    write_status "Containers stopped" "success"
    cd ..
}

function docker_logs() {
    write_status "Showing Docker logs..." "info"
    cd docker
    docker-compose -f docker-compose.yml logs -f
    cd ..
}

function show_help() {
    cat << EOF
BikeVN Docker Management Script
================================

Usage: ./setup-env.sh [Action]

Available Actions:
  status    - Show Docker container status (default)
  up        - Start all Docker containers
  down      - Stop all Docker containers
  logs      - Show container logs
  help      - Show this help message

Examples:
  ./setup-env.sh status
  ./setup-env.sh up
  ./setup-env.sh down
  ./setup-env.sh logs

Database Access:
  phpMyAdmin: http://localhost:8080
  Adminer:    http://localhost:8081
  MySQL User: bikevn_user / bikevn_pass
EOF
}

# Main execution
load_environment

if ! check_docker; then
    exit 1
fi

case "$ACTION" in
    up)
        docker_up
        ;;
    down)
        docker_down
        ;;
    logs)
        docker_logs
        ;;
    status)
        docker_status
        ;;
    help)
        show_help
        ;;
    *)
        docker_status
        ;;
esac
