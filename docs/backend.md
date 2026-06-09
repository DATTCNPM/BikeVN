# Backend

This document describes the backend architecture, design principles, and implementation conventions.

---

# Overview

BikeVN backend is built using Spring Boot.

Responsibilities:

- Business logic
- Authentication
- Authorization
- Booking management
- Payment processing
- Vehicle lifecycle management
- Messaging services

---

# Technology Stack

Core technologies:

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL

---

# Layered Architecture

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Responsibilities are strictly separated.

---

# Project Structure

```text
backend/
└── src/main/java/
    └── com.app/
        ├── controller/
        ├── service/
        ├── repository/
        ├── entity/
        ├── dto/
        ├── request/
        ├── response/
        ├── mapper/
        ├── security/
        └── config/
```

---

# Controller Layer

Responsibilities:

- Request handling
- Input validation
- Response generation

Controllers should remain thin.

Avoid business logic in controllers.

---

# Service Layer

Responsibilities:

- Business rules
- Transaction management
- Workflow orchestration

This is the primary business layer.

---

# Repository Layer

Responsibilities:

- Database access
- Query execution
- Persistence operations

Repositories should not contain business logic.

---

# DTO Strategy

Separate:

```text
Request DTO
Response DTO
Entity
```

Never expose entities directly through APIs.

---

# Validation

Validation should be applied at:

- Request layer
- Business layer

Examples:

- Booking date validation
- Vehicle availability validation
- Payment status validation

---

# Error Handling

Unified error response format:

```json
{
  "code": 4001,
  "message": "BOOKING_NOT_FOUND"
}
```

All business exceptions should use centralized handling.

---

# Transaction Management

Use Spring transactions for:

- Booking creation
- Payment processing
- Vehicle return operations

Critical workflows must be atomic.

---

# Security

Authentication:

- JWT

Authorization:

- Role-based access control

Roles:

- ADMIN
- STAFF
- CUSTOMER

---

# Concurrency Considerations

Important engineering decisions:

- Booking lock mechanism
- Duplicate payment prevention
- Vehicle return idempotency

See:

- decisions/ConcurrentBookingControl.md
- decisions/DuplicatePaymentPrevention.md
- decisions/VehicleReturnDuplicatePrevention.md

---

# Database Design Principles

Guidelines:

- Normalize appropriately
- Use foreign keys
- Create indexes for frequent queries
- Avoid N+1 query issues

---

# Development Workflow

1. Define requirements
2. Create entities
3. Create DTOs
4. Implement services
5. Implement controllers
6. Add validations
7. Add tests
8. Update API documentation
