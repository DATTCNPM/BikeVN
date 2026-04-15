# TASK TIMELINE – Motorbike Rental System

## Timeline: 15/04 → 15/07

---

# 👥 Team Roles

- Backend: Member 1
- Frontend: Member 2
- Data + Test + Report: Member 3

---

# 📅 PHASE 1: Planning & Setup (15/04 → 28/04)

## Week 1–2

### All

- Thống nhất yêu cầu (SRS)
- Vẽ ERD
- Thiết kế API (API.md)
- Thiết kế UI (Figma)

### Backend

- Setup Spring Boot project
- Cấu hình MySQL
- Setup JWT

### Frontend

- Setup React project
- Setup routing
- Setup UI base

### Data

- Thiết kế database (schema.sql)
- Tạo dữ liệu mẫu (seed.sql)

---

# 📅 PHASE 2: Core Development (29/04 → 26/05)

## Week 3–4 (Auth + Vehicle)

### Backend

- Auth API (login/register)
- CRUD Vehicle

### Frontend

- UI Login/Register
- UI List Vehicle

### Data

- Test API bằng Postman
- Viết test case Auth

---

## Week 5–6 (Booking – CORE)

### Backend

- Booking API
- Check trùng lịch (QUAN TRỌNG)

### Frontend

- Booking UI
- Form chọn ngày

### Data

- Viết SQL check overlap
- Test booking edge cases

---

# 📅 PHASE 3: Advanced Features (27/05 → 16/06)

## Week 7 (Map)

### Frontend

- Tích hợp Google Maps
- Hiển thị marker

### Backend

- API /vehicles/nearby

### Data

- Chuẩn hóa lat/lng
- Seed dữ liệu vị trí

---

## Week 8 (Chat)

### Backend

- Setup WebSocket
- API message

### Frontend

- UI chat
- Kết nối WebSocket

### Data

- Lưu message DB
- Test chat flow

---

# 📅 PHASE 4: Integration & Testing (17/06 → 30/06)

## Week 9–10

### All

- Kết nối frontend + backend
- Fix bug

### Data (main)

- Viết test case đầy đủ
- Test toàn hệ thống

### Backend

- Fix bug API

### Frontend

- Fix UI/UX
- Loading, error handling

---

# 📅 PHASE 5: Finalization (01/07 → 15/07)

## Week 11–12

### All

- Hoàn thiện tính năng
- Chuẩn bị demo

### Data (main)

- Viết report (Word)
- Chuẩn bị slide

### Backend + Frontend

- Hỗ trợ viết report
- Chuẩn bị demo

---

# 📌 FINAL CHECKLIST

- [ ] Auth hoàn chỉnh
- [ ] Booking không trùng lịch
- [ ] Map hiển thị đúng
- [ ] Chat realtime hoạt động
- [ ] UI hoàn chỉnh
- [ ] Không lỗi lớn

---

# 🚀 NOTE

- Ưu tiên: Booking → Map → Chat
- Không delay core để làm chat
- Mỗi tuần phải có demo nội bộ
