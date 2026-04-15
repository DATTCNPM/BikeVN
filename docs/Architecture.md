# SYSTEM ARCHITECTURE

## 1. Overview

Hệ thống sử dụng kiến trúc client-server:

```
Frontend (React)
    ↓ REST API
Backend (Spring Boot)
    ↓
MySQL Database
```

Ngoài ra:

- Chat sử dụng WebSocket
- Map sử dụng Google Maps API

---

## 2. Components

### 2.1 Frontend

- React + Hooks
- React Router
- Axios gọi API
- Google Maps hiển thị vị trí
- WebSocket client cho chat

---

### 2.2 Backend

- Spring Boot (REST API)
- JWT Authentication
- WebSocket (chat realtime)

Layer:

- Controller
- Service
- Repository

---

### 2.3 Database

- MySQL
- Các bảng:
  - Users
  - Vehicles
  - Bookings
  - Messages

---

## 3. Data Flow

### 3.1 Booking Flow

1. User chọn xe
2. Gửi request → backend
3. Backend check trùng lịch
4. Lưu DB
5. Trả response

---

### 3.2 Map Flow

1. Frontend lấy vị trí user
2. Call API /vehicles/nearby
3. Render marker

---

### 3.3 Chat Flow

1. Client connect WebSocket
2. Gửi message
3. Backend broadcast
4. Client nhận realtime

---

## 4. Security

- JWT Authentication
- Password hash
- Role-based access

---

## 5. Deployment (optional)

- Frontend: Vercel
- Backend: Render
- Database: Railway / MySQL local

---

## 6. Scalability (basic)

- Có thể mở rộng:
  - Redis cache
  - Microservices
