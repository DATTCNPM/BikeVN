# BikeVN

A full-stack motorbike rental platform built with Spring Boot, React, TypeScript, MySQL, and Docker.

---

## Overview

BikeVN is a motorbike rental management system that supports:

- Vehicle browsing and search
- Online booking
- Payment processing
- Booking lifecycle management
- Vehicle return workflow
- Customer reviews
- Real-time messaging
- Administrative dashboard

The project is designed using modern full-stack development practices with a clear separation between frontend and backend services.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- Shadcn UI

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate

### Database

- MySQL

### DevOps

- Docker
- Docker Compose

---

## Project Structure

```text
BikeVN/
│
├── backend/
│
├── frontend/
│   ├── apps/
│   │   ├── admin/
│   │   └── client-web/
│   │
│   └── packages/
│
├── database/
│
├── docker/
│
├── docs/
│   ├── architecture.md
│   ├── erd.md
│   ├── api.md
│   ├── backend.md
│   ├── frontend.md
│   ├── deployment.md
│   │
│   └── decisions/
│
├── README.md
└── CONTRIBUTING.md
```

---

## Quick Start

### Prerequisites

Install:

- Docker Desktop
- Git
- Node.js
- Java 21

---

### Start Infrastructure

Windows

```powershell
.\setup-env.ps1 up
```

Linux / macOS

```bash
./setup-env.sh up
```

---

### Verify Services

| Service    | URL                   |
| ---------- | --------------------- |
| phpMyAdmin | http://localhost:8080 |
| Adminer    | http://localhost:8081 |

---

### Database

```text
Host: localhost
Port: 3307

Database: bikevn_db

Username: bikevn_user
Password: bikevn_pass
```

---

## Documentation

### Architecture

- docs/architecture.md
- docs/erd.md

### API

- docs/api.md

### Backend

- docs/backend.md

### Frontend

- docs/frontend.md

### Deployment

- docs/deployment.md

### Engineering Decisions

- docs/decisions/ConcurrentBookingControl.md
- docs/decisions/DuplicatePaymentPrevention.md
- docs/decisions/VehicleReturnDuplicatePrevention.md

---

## Development Workflow

1. Pull latest changes
2. Start Docker services
3. Run backend
4. Run frontend
5. Implement feature
6. Create Pull Request

See CONTRIBUTING.md for development standards.

---

## License

This project is intended for educational and portfolio purposes.
