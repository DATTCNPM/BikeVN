# Hướng Dẫn Chạy Frontend Monorepo (client-web + admin)

# 1. Cấu trúc dự án

```txt
frontend/
├── apps/
│   ├── client-web/
│   └── admin/
│
├── node_modules/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── .gitignore
```

---

# 2. Cài đặt pnpm

## Kiểm tra pnpm

```bash
pnpm -v
```

## Nếu chưa có pnpm

```bash
npm install -g pnpm
```

---

# 3. File pnpm-workspace.yaml

Tạo file:

```txt
pnpm-workspace.yaml
```

Nội dung:

```yaml
packages:
  - "apps/*"
```

---

# 4. File .gitignore

Tạo file:

```txt
.gitignore
```

Nội dung:

```gitignore
node_modules
dist
.env
.env.local
.vscode
.DS_Store
```

---

# 5. Tạo project Vite

## Tạo client-web

```bash
npm create vite@latest apps/client-web
```

Chọn:

```txt
React
TypeScript
```

---

## Tạo admin

```bash
npm create vite@latest apps/admin
```

Chọn:

```txt
React
TypeScript
```

---

# 6. Xóa package-lock.json

Nếu trước đó dùng npm thì cần xóa:

```txt
apps/client-web/package-lock.json
apps/admin/package-lock.json
```

---

# 7. Install dependencies

Di chuyển về root:

```bash
cd frontend
```

Chạy:

```bash
pnpm install
```

pnpm sẽ:

- tạo node_modules dùng chung
- link dependencies cho từng app
- tạo vite executable

---

# 8. Chạy project

## Chạy client-web

```bash
pnpm --filter client-web dev
```

---

## Chạy admin

```bash
pnpm --filter admin dev
```

---

# 9. Install package riêng cho từng app

## Ví dụ cài Swiper cho client-web

```bash
pnpm add swiper --filter client-web
```

---

## Ví dụ cài Recharts cho admin

```bash
pnpm add recharts --filter admin
```

---

# 10. Install package dùng chung workspace

Ví dụ:

- prettier
- eslint
- typescript

Cài ở root:

```bash
pnpm add -D prettier -w
```

`-w`
= workspace root

---

# 11. package.json mỗi app

## apps/client-web/package.json

```json
{
  "name": "client-web"
}
```

---

## apps/admin/package.json

```json
{
  "name": "admin"
}
```

`name` dùng cho:

```bash
pnpm --filter admin dev
```

---

# 12. Node_modules trong apps có đúng không?

Có.

Ví dụ:

```txt
apps/admin/node_modules
```

vẫn có thể xuất hiện.

Nhưng:

- đây chỉ là symlink
- không phải node_modules đầy đủ như npm
- package thật nằm ở root node_modules

Nên:

- không gây lãng phí lớn
- không cần xóa

---

# 13. Không commit node_modules

`.gitignore` đã xử lý:

```gitignore
node_modules
```

Nên GitHub sẽ không upload:

- root node_modules
- apps/\*/node_modules

---

# 14. Lỗi thường gặp

## vite is not recognized

Nguyên nhân:

- chưa pnpm install
- dependency chưa được link
- còn package-lock.json từ npm

Cách xử lý:

```bash
pnpm install
```

Nếu vẫn lỗi:

Xóa:

```txt
apps/client-web/node_modules
apps/admin/node_modules
apps/client-web/package-lock.json
apps/admin/package-lock.json
```

Sau đó:

```bash
pnpm install
```

---

# 15. Stack khuyến nghị

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

# 16. Hướng phát triển tương lai

## Giai đoạn đầu

```txt
client-web → React + Vite
admin      → React + Vite
```

---

## Sau này cần SEO

```txt
client-web → Next.js
admin      → React + Vite
```

Do Next.js vẫn là React nên có thể tái sử dụng:

- components
- hooks
- services
- utils
- types
