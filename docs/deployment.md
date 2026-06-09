# Deployment

This document describes local development infrastructure, Docker services, environment configuration, and deployment-related workflows.

---

# Infrastructure Overview

BikeVN uses Docker Compose to provide local infrastructure services.

Current services:

| Service    | Purpose                         |
| ---------- | ------------------------------- |
| MySQL      | Primary database                |
| phpMyAdmin | Database administration         |
| Adminer    | Lightweight database management |

---

# Docker Architecture

```text
┌─────────────────┐
│ Frontend        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Spring Boot API │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ MySQL           │
└─────────────────┘

         ▲
         │
 ┌───────┴────────┐
 │ phpMyAdmin     │
 │ Adminer        │
 └────────────────┘
```

---

# Prerequisites

Required software:

- Docker Desktop
- Git
- Java 21
- Node.js
- pnpm

---

# Environment Configuration

Main environment file:

```text
.env
```

Example:

```env
DB_HOST=localhost
DB_PORT=3307
DB_NAME=bikevn_db

DB_USERNAME=bikevn_user
DB_PASSWORD=bikevn_pass
```

---

# Start Infrastructure

Windows

```powershell
.\setup-env.ps1 up
```

Linux/macOS

```bash
./setup-env.sh up
```

---

# Stop Infrastructure

Windows

```powershell
.\setup-env.ps1 down
```

Linux/macOS

```bash
./setup-env.sh down
```

---

# View Logs

```powershell
.\setup-env.ps1 logs
```

---

# Service Endpoints

| Service    | URL                   |
| ---------- | --------------------- |
| phpMyAdmin | http://localhost:8080 |
| Adminer    | http://localhost:8081 |

---

# Database Access

```text
Host: localhost
Port: 3307

Database: bikevn_db

Username: bikevn_user
Password: bikevn_pass
```

---

# Verification Checklist

After startup verify:

- Containers are running
- Database is reachable
- phpMyAdmin loads correctly
- Sample data exists
- Backend can connect successfully

---

# Troubleshooting

## Port Already In Use

Update port values inside:

```text
.env
```

Restart containers afterward.

---

## MySQL Not Ready

MySQL initialization may take 20–30 seconds during first startup.

Check logs:

```bash
docker compose logs mysql
```

---

## Reset Environment

WARNING: removes all local database data.

```bash
docker compose down -v
docker compose up -d
```

---

# Future Production Deployment

Potential deployment targets:

- VPS
- AWS EC2
- DigitalOcean
- Railway
- Render

Current Docker configuration is intended for local development only.
