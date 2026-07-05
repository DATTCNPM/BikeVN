# BikeVN

<p align="center">
    <img src="./screenshot/landing.png" alt="BikeVN Banner" width="100%">
</p>

<h1 align="center">🏍️ BikeVN</h1>

<p align="center">
A modern full-stack motorbike rental platform built with Spring Boot, React, TypeScript, MySQL, and Docker.
</p>

<p align="center">

![Java](https://img.shields.io/badge/Java-21-red)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![MySQL](https://img.shields.io/badge/MySQL-8-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED)
![License](https://img.shields.io/badge/License-Educational-lightgrey)

</p>

---

# 📖 Overview

BikeVN is a production-style motorbike rental platform that allows customers to browse vehicles, place bookings, complete payments, communicate with owners in real time, and manage the entire rental lifecycle.

The project follows a modern full-stack architecture with a clear separation between frontend and backend services while emphasizing scalability, maintainability, and clean code practices.

---

# ✨ Key Features

### 👤 Customer

- 🔍 Search and filter vehicles
- 📄 Vehicle detail page
- 📅 Online booking
- 💳 Payment processing
- 📦 Booking management
- ↩️ Vehicle return workflow
- ⭐ Customer reviews
- 💬 Real-time messaging
- 👤 Profile management

### 🛠 Administrator

- 📊 Dashboard
- 👥 User management
- 🏍 Vehicle management
- 📅 Booking management
- 💳 Payment monitoring
- ⭐ Review moderation
- 📈 Reports & statistics

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- Shadcn UI

## Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- WebSocket (STOMP)

## Database

- MySQL

## DevOps

- Docker
- Docker Compose

---

# 🏗 System Architecture

```text
                +----------------------+
                |      React App       |
                +----------+-----------+
                           |
                REST API / WebSocket
                           |
                +----------v-----------+
                |    Spring Boot API   |
                +----------+-----------+
                           |
                     Spring Data JPA
                           |
                +----------v-----------+
                |        MySQL         |
                +----------------------+
```

---

# 📷 Screenshots

## 🏠 Home Page

![Home](/screenshot/landing.png)

---

## 🔍 Vehicle Listing

![Vehicle List](/screenshot/home.png)

---

## 📄 Vehicle Details

![Vehicle Detail](/screenshot/detail.png)

---

## 📅 Booking Page

![Booking](/screenshot/booking.png)

---

## 💳 Booking result

![Booking Result](/screenshot/booking-result.png)

---

## 💬 Real-time Chat

![Chat](/screenshot/chat.png)

---

## 👤 Customer Dashboard

![Customer Dashboard](/screenshot/profile.png)

---

## 🛠 Admin Dashboard

![Admin Dashboard](/screenshot/dashboard.png)

---

# 🎥 Demo

## Client

[client demo](https://bike-vn.vercel.app/)

---

## Admin

[admin demo](https://bike-vn-admin.vercel.app/)

---

# 📂 Project Structure

```text
BikeVN
│
├── backend/                  Spring Boot REST API
│
├── frontend/
│   ├── apps/
│   │   ├── admin/            Admin Dashboard
│   │   └── client-web/       Customer Website
│   │
│   └── packages/             Shared packages
│
├── database/                 SQL scripts
│
├── docker/                   Docker configuration
│
├── docs/
│   ├── architecture.md
│   ├── erd.md
│   ├── api.md
│   ├── backend.md
│   ├── frontend.md
│   ├── deployment.md
│   └── decisions/
│
├── README.md
└── CONTRIBUTING.md
```

---

# 🚀 Quick Start

## Prerequisites

Install:

- Docker Desktop
- Git
- Node.js
- Java 21

---

## Start Infrastructure

### Windows

```powershell
.\setup-env.ps1 up
```

### Linux / macOS

```bash
./setup-env.sh up
```

---

## Verify Services

| Service    | URL                   |
| ---------- | --------------------- |
| phpMyAdmin | http://localhost:8080 |
| Adminer    | http://localhost:8081 |

---

## Database

| Property | Value       |
| -------- | ----------- |
| Host     | localhost   |
| Port     | 3307        |
| Database | bikevn_db   |
| Username | bikevn_user |
| Password | bikevn_pass |

---

# 📚 Documentation

| Document        | Description                 |
| --------------- | --------------------------- |
| architecture.md | Overall system architecture |
| erd.md          | Database ERD                |
| api.md          | REST API documentation      |
| backend.md      | Backend guide               |
| frontend.md     | Frontend guide              |
| deployment.md   | Deployment guide            |

---

# ⚙ Engineering Decisions

- Concurrent Booking Control
- Duplicate Payment Prevention
- Vehicle Return Duplicate Prevention

---

# 🔄 Development Workflow

```text
Pull Latest Code
        │
        ▼
Start Docker
        │
        ▼
Run Backend
        │
        ▼
Run Frontend
        │
        ▼
Develop Feature
        │
        ▼
Commit Changes
        │
        ▼
Create Pull Request
```

---

# ⭐ Highlights

- JWT Authentication
- Role-based Authorization
- RESTful API
- WebSocket Messaging
- Responsive UI
- Dockerized Development Environment
- Clean Architecture
- Repository Pattern
- DTO Mapping
- Pagination
- Validation
- Global Exception Handling

---

# 🛣 Roadmap

- [x] Authentication
- [x] Booking System
- [x] Payment
- [x] Reviews
- [x] Chat
- [x] Admin Dashboard
- [ ] Notification Service
- [ ] Email Verification
- [ ] CI/CD Pipeline
- [ ] Mobile Application
- [ ] Monitoring & Logging

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Please read **CONTRIBUTING.md** before submitting a Pull Request.

---

# 📄 License

This project is intended for educational and portfolio purposes.

---

# ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub.

Made with ❤️ using Spring Boot + React.
