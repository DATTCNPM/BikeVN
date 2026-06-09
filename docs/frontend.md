# Frontend

This document describes the frontend architecture, development conventions, and project organization.

---

# Overview

The frontend is implemented as a pnpm monorepo.

Applications:

| Application | Purpose                           |
| ----------- | --------------------------------- |
| admin       | Internal administration dashboard |
| client-web  | Customer-facing website           |

---

# Technology Stack

Core technologies:

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- Shadcn UI

---

# Monorepo Structure

```text
frontend/
│
├── apps/
│   ├── admin/
│   └── client-web/
│
├── packages/
│
├── pnpm-workspace.yaml
└── package.json
```

---

# Architectural Principles

The frontend follows:

- Feature-first organization
- Server state separation
- Reusable UI components
- Strong TypeScript typing

---

# Feature Structure

Example:

```text
features/
└── bookings/
    ├── api/
    ├── components/
    ├── hooks/
    ├── schemas/
    ├── mutations/
    └── pages/
```

---

# State Management

## Server State

TanStack Query

Responsibilities:

- Fetching data
- Caching
- Revalidation
- Mutations

---

## Client State

Zustand

Responsibilities:

- Authentication state
- Theme state
- UI state

Avoid storing server data inside Zustand.

---

# API Layer

Every feature owns its API logic.

Example:

```text
features/
└── bookings/
    └── api/
```

Responsibilities:

- API calls
- Request mapping
- Response mapping

---

# Validation

Zod is used for:

- Forms
- Request validation
- Response validation

---

# Routing

React Router is responsible for:

- Route definitions
- Route guards
- Nested layouts

---

# UI Components

Shared components belong in:

```text
packages/ui
```

Feature-specific components remain inside their feature folder.

---

# Naming Conventions

Components

```text
BookingForm.tsx
BookingTable.tsx
BookingDetail.tsx
```

Hooks

```text
useBookings.ts
useBooking.ts
```

Schemas

```text
booking.schema.ts
```

---

# Code Quality

Requirements:

- Strict TypeScript
- ESLint
- Prettier
- No unused code
- No any unless justified

---

# Recommended Workflow

1. Create feature
2. Define schemas
3. Implement API layer
4. Create queries/mutations
5. Build UI
6. Add validation
7. Test behavior
