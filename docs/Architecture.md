# System Architecture

This document describes the overall architecture of BikeVN.

---

# High-Level Architecture

```text
┌─────────────────────┐
│ Client Web          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Spring Boot API     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ MySQL Database      │
└─────────────────────┘

           ▲
           │
 ┌─────────┴─────────┐
 │ Admin Dashboard   │
 └───────────────────┘
```

---

# Core Domains

BikeVN is organized around several business domains.

## Identity Domain

Responsibilities:

- Authentication
- Authorization
- User management

Entities:

- User

---

## Vehicle Domain

Responsibilities:

- Vehicle management
- Availability management
- Vehicle lifecycle

Entities:

- Vehicle
- Branch

---

## Booking Domain

Responsibilities:

- Booking creation
- Booking validation
- Booking lifecycle

Entities:

- Booking

---

## Payment Domain

Responsibilities:

- Transaction processing
- Payment verification

Entities:

- Payment

---

## Return Domain

Responsibilities:

- Vehicle return workflow
- Damage reporting
- Additional fee calculation

Entities:

- VehicleReturn

---

## Communication Domain

Responsibilities:

- Conversations
- Messaging

Entities:

- Conversation
- Message

---

## Review Domain

Responsibilities:

- Ratings
- Customer feedback

Entities:

- Review

---

# Request Flow

```text
Client
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
```

---

# Security Architecture

Authentication:

- JWT

Authorization:

- Role Based Access Control

Roles:

```text
ADMIN
STAFF
CUSTOMER
```

---

# Concurrency Strategy

Critical workflows:

- Booking creation
- Payment processing
- Vehicle return processing

See:

- decisions/ConcurrentBookingControl.md
- decisions/DuplicatePaymentPrevention.md
- decisions/VehicleReturnDuplicatePrevention.md

---

# Architectural Goals

The system prioritizes:

1. Maintainability
2. Correctness
3. Scalability
4. Security

Over-engineering should be avoided unless justified by business requirements.
