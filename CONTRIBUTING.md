# Contributing

Thank you for contributing to BikeVN.

This document defines the development workflow and coding conventions used in the project.

---

## Branch Strategy

### Main Branches

```text
main
develop
```

### Feature Branches

```text
feature/booking
feature/payment
feature/chat
```

### Bug Fix Branches

```text
fix/payment-timeout
fix/booking-validation
```

---

## Commit Convention

Use Conventional Commits.

### Feature

```text
feat: add booking lock mechanism
```

### Bug Fix

```text
fix: prevent duplicate payment requests
```

### Refactor

```text
refactor: simplify booking validation flow
```

### Documentation

```text
docs: update deployment guide
```

### Chore

```text
chore: update dependencies
```

---

## Pull Request Guidelines

Before creating a Pull Request:

- Code compiles successfully
- No lint errors
- No TypeScript errors
- Database migrations are verified
- Documentation updated if necessary

---

## Backend Standards

### General

- Follow layered architecture
- Keep controllers thin
- Business logic belongs in services
- Repository layer only accesses data

### Naming

```text
BookingController
BookingService
BookingRepository
```

---

## Frontend Standards

### General

- Prefer feature-based organization
- Use TanStack Query for server state
- Use Zustand for global client state
- Keep components focused and reusable

### Naming

```text
BookingForm.tsx
BookingDetails.tsx

useBooking.ts
useBookings.ts
```

---

## Code Review Checklist

Before approval:

- Readability
- Correctness
- Security
- Performance
- Maintainability

---

## Documentation

When introducing major architectural changes:

- Update architecture.md
- Update api.md if endpoints change
- Add decision documents for important engineering decisions

---

## Core Principle

Prioritize:

1. Correctness
2. Simplicity
3. Maintainability

Avoid premature optimization and unnecessary complexity.
