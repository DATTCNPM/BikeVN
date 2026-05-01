# Frontend Stack - Web Cho Thuê Xe Máy

# 1. Core

| Công nghệ  | Dùng để làm gì              | Cách cài đặt               |
| ---------- | --------------------------- | -------------------------- |
| React      | Xây dựng UI component-based | `npm create vite@latest`   |
| TypeScript | Type safety, dễ maintain    | Chọn template `React + TS` |
| Vite       | Dev server + build project  | Có sẵn khi tạo project     |

---

# 2. UI & Styling

| Công nghệ     | Dùng để làm gì                                 | Cách cài đặt                                |
| ------------- | ---------------------------------------------- | ------------------------------------------- |
| Tailwind CSS  | Responsive UI nhanh, utility-first CSS         | `npm install tailwindcss @tailwindcss/vite` |
| shadcn/ui     | UI components đẹp: Button, Dialog, Table, Form | `npx shadcn@latest init`                    |
| lucide-react  | Bộ icon hiện đại                               | `npm install lucide-react`                  |
| Framer Motion | Animation, transition, modal animation         | `npm install framer-motion`                 |
| Swiper        | Carousel/banner danh sách xe                   | `npm install swiper`                        |

---

# 3. Routing

| Công nghệ    | Dùng để làm gì       | Cách cài đặt                   |
| ------------ | -------------------- | ------------------------------ |
| React Router | Điều hướng trang SPA | `npm install react-router-dom` |

---

# 4. API & State Management

| Công nghệ      | Dùng để làm gì                             | Cách cài đặt                        |
| -------------- | ------------------------------------------ | ----------------------------------- |
| Axios          | Gọi API backend                            | `npm install axios`                 |
| TanStack Query | Cache data, loading, refetch, server state | `npm install @tanstack/react-query` |
| Zustand        | Global state: auth, booking, cart          | `npm install zustand`               |

---

# 5. Form & Validation

| Công nghệ           | Dùng để làm gì                  | Cách cài đặt                      |
| ------------------- | ------------------------------- | --------------------------------- |
| React Hook Form     | Quản lý form                    | `npm install react-hook-form`     |
| Zod                 | Validate dữ liệu                | `npm install zod`                 |
| @hookform/resolvers | Kết nối Zod với React Hook Form | `npm install @hookform/resolvers` |

---

# 6. Authentication

| Công nghệ  | Dùng để làm gì                | Cách cài đặt             |
| ---------- | ----------------------------- | ------------------------ |
| JWT        | Backend tạo và verify token   | Backend xử lý            |
| jwt-decode | Đọc payload JWT phía frontend | `npm install jwt-decode` |

## Frontend auth flow

```txt
Login
→ Backend trả accessToken
→ Frontend lưu token
→ Axios tự attach Authorization header
→ Backend verify token
```

Ví dụ Authorization header:

```http
Authorization: Bearer accessToken
```

---

# 7. Maps

| Công nghệ     | Dùng để làm gì             | Cách cài đặt                |
| ------------- | -------------------------- | --------------------------- |
| Leaflet       | Render map                 | `npm install leaflet`       |
| React Leaflet | Tích hợp Leaflet với React | `npm install react-leaflet` |

## Maps hoạt động như thế nào?

Frontend map gồm 3 phần:

### 1. Package render map

- Leaflet
- React Leaflet

Dùng để:

- render bản đồ
- marker
- popup
- zoom

### 2. Map provider

Ví dụ:

- OpenStreetMap
- Google Maps
- Mapbox

Map provider sẽ cung cấp tile map.

### 3. Dữ liệu vị trí

Ví dụ backend trả:

```json
[
  {
    "name": "Honda Vision",
    "lat": 10.045,
    "lng": 105.746
  }
]
```

Frontend dùng dữ liệu này để render marker.

## Nếu chưa có backend

Có thể hardcode:

```ts
const vehicles = [
  {
    id: 1,
    name: "Vision",
    lat: 10.045,
    lng: 105.746,
  },
];
```

Frontend vẫn render map bình thường.

---

# 8. Avatar

| Công nghệ | Dùng để làm gì     | Cách cài đặt  |
| --------- | ------------------ | ------------- |
| DiceBear  | Random avatar user | Không cần cài |

Ví dụ:

```txt
https://api.dicebear.com/9.x/adventurer/svg?seed=username
```

Ví dụ React:

```tsx
const avatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${username}`;

<img src={avatar} />;
```

---

# 9. Notifications & UX

| Công nghệ        | Dùng để làm gì             | Cách cài đặt                   |
| ---------------- | -------------------------- | ------------------------------ |
| Sonner           | Toast notification         | `npm install sonner`           |
| React Day Picker | Date picker chọn ngày thuê | `npm install react-day-picker` |

---

# 10. Charts (Admin)

| Công nghệ | Dùng để làm gì                | Cách cài đặt           |
| --------- | ----------------------------- | ---------------------- |
| Recharts  | Dashboard doanh thu, thống kê | `npm install recharts` |

---

# 11. Payment

| Công nghệ | Dùng để làm gì               | Cách cài đặt                    |
| --------- | ---------------------------- | ------------------------------- |
| Stripe.js | Frontend payment UI/redirect | `npm install @stripe/stripe-js` |

## Frontend payment làm gì?

Frontend:

- hiển thị UI thanh toán
- redirect người dùng
- hiển thị QR
- loading/payment status

Backend:

- tạo payment session
- verify thanh toán
- webhook

## Payment flow

```txt
Frontend click thanh toán
→ gọi backend
→ backend tạo payment session
→ frontend redirect user
→ backend verify payment
```

---

# 12. Realtime (Optional)

| Công nghệ        | Dùng để làm gì              | Cách cài đặt                   |
| ---------------- | --------------------------- | ------------------------------ |
| Socket.IO Client | Chat, notification realtime | `npm install socket.io-client` |

---

# 13. Development Tools

| Công nghệ | Dùng để làm gì    | Cách cài đặt              |
| --------- | ----------------- | ------------------------- |
| ESLint    | Kiểm tra lỗi code | Có sẵn trong Vite         |
| Prettier  | Format code       | `npm install -D prettier` |

---

# 14. Deploy

| Công nghệ | Dùng để làm gì     |
| --------- | ------------------ |
| Vercel    | Deploy frontend    |
| Netlify   | Alternative deploy |

Deploy bằng cách:

- push code lên GitHub
- connect repository
- deploy tự động

---

# 15. Cấu trúc dự án khuyến nghị

```txt
frontend/
├── client-web/
└── admin/
```

## Vai trò

### client-web

Dành cho:

- landing page
- danh sách xe
- booking
- profile user

Sau này có thể migrate sang Next.js để SEO.

### admin

Dành cho:

- CRUD xe
- dashboard
- quản lý booking
- quản lý user

Thường vẫn dùng React + Vite.

---

# 16. Cấu trúc thư mục mỗi app

```txt
src/
├── api/
├── assets/
├── components/
├── layouts/
├── pages/
├── routes/
├── hooks/
├── store/
├── services/
├── schemas/
├── types/
├── utils/
├── constants/
└── lib/
```

---

# 17. Stack khuyến nghị cuối cùng

```txt
React
TypeScript
Vite
Tailwind CSS
shadcn/ui
React Router
Axios
TanStack Query
Zustand
React Hook Form
Zod
Leaflet
React Leaflet
Sonner
Framer Motion
```

---

# 18. Hướng phát triển tương lai

## Giai đoạn đầu

Dùng:

```txt
React + TypeScript + Vite
```

Để:

- học React tốt
- build nhanh
- hoàn thiện logic frontend

## Sau này cần SEO

Có thể migrate:

```txt
client-web → Next.js
admin      → React + Vite
```

Vì Next.js vẫn là React nên có thể tái sử dụng rất nhiều component.
