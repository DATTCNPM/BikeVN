# API Documentation

This document provides a high-level overview of BikeVN APIs.

Detailed request/response contracts should be generated through OpenAPI/Swagger.

---

# Base URL

Development

```text
http://localhost:8080/api
```

---

# Authentication

Authentication uses JWT.

Protected endpoints require:

```http
Authorization: Bearer <access_token>
```

---

# API Modules

## Authentication

Responsibilities:

- Login
- Register
- Refresh Token
- Logout

Example endpoints:

```text
POST /auth/login
POST /auth/register
POST /auth/refresh
POST /auth/logout
```

---

## Users

Responsibilities:

- Profile management
- Identity verification
- Account updates

Example endpoints:

```text
GET /users/me
PUT /users/me
```

---

## Vehicles

Responsibilities:

- Vehicle listing
- Vehicle detail
- Availability checking

Example endpoints:

```text
GET /vehicles
GET /vehicles/{id}
```

---

## Branches

Responsibilities:

- Rental branch information

Example endpoints:

```text
GET /branches
GET /branches/{id}
```

---

## Bookings

Responsibilities:

- Create booking
- Cancel booking
- View booking history

Example endpoints:

```text
POST /bookings
GET /bookings
GET /bookings/{id}
```

---

## Payments

Responsibilities:

- Payment processing
- Transaction tracking
- Refund support

Example endpoints:

```text
POST /payments
GET /payments/{id}
```

---

## Vehicle Returns

Responsibilities:

- Return workflow
- Damage reporting
- Fee calculation

Example endpoints:

```text
POST /vehicle-returns
```

---

## Reviews

Responsibilities:

- Customer feedback
- Vehicle ratings

Example endpoints:

```text
POST /reviews
GET /reviews
```

---

## Conversations

Responsibilities:

- Chat rooms
- Messaging

Example endpoints:

```text
GET /conversations
POST /messages
```

---

# Response Format

Success

```json
{
  "data": {}
}
```

Error

```json
{
  "code": 4001,
  "message": "BOOKING_NOT_FOUND"
}
```

---

# Error Handling

Common categories:

| Category       | Example               |
| -------------- | --------------------- |
| Validation     | INVALID_REQUEST       |
| Authentication | UNAUTHORIZED          |
| Authorization  | FORBIDDEN             |
| Business Rule  | VEHICLE_NOT_AVAILABLE |
| System         | INTERNAL_SERVER_ERROR |

---

# API Versioning

Current version:

```text
v1
```

Future versions should maintain backward compatibility whenever possible.
