# BikeVN

Ứng dụng cho thuê xe máy tay ga theo vị trí, hỗ trợ đặt xe và chat realtime giữa khách và chủ xe.

## Features

- Authentication (JWT)
- Booking system (check trùng lịch)
- Map tìm xe gần (Google Maps)
- Chat realtime (WebSocket)
- Admin dashboard

## Tech Stack

Frontend: React  
Backend: Spring Boot  
Database: MySQL  
Map: Google Maps API  
Realtime: WebSocket

## Architecture

## Folder Structure

```
motorbike-rental/
│
├── frontend/                # React
│   ├── public/
│   ├── src/
│   │   ├── assets/         # ảnh, icon
│   │   ├── components/     # UI components
│   │   ├── pages/          # page (Home, Detail...)
│   │   ├── services/       # gọi API (axios)
│   │   ├── hooks/          # custom hooks
│   │   ├── context/        # auth, global state
│   │   ├── routes/         # router config
│   │   ├── utils/          # helper
│   │   └── App.jsx
│   └── package.json
│
├── backend/                 # Spring Boot
│   └── src/main/java/com/app/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── model/          # entity
│       ├── dto/            # request/response
│       ├── config/         # security, websocket
│       └── Application.java
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── API.md
│   ├── Architecture.md
│   └── SRS.docx
│
├── README.md
└── .env.example
```

## Installation & Run

## Environment Variables

## API Overview

## Screenshots

## Team Members

- Trần Hải Đăng (Frontend)
- Trần Hoàng Phương (Backend)
- Hồ Tấn Đạt (Data, postman, word + slide)

## Future Improvements
