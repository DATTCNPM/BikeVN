# API DOCUMENTATION

## Base URL

http://localhost:8080/api

---

# 1. AUTH

## POST /auth/register

Request:
{
"name": "John",
"email": "john@gmail.com",
"password": "123456"
}

Response:
{
"message": "Register success"
}

---

## POST /auth/login

Request:
{
"email": "john@gmail.com",
"password": "123456"
}

Response:
{
"token": "JWT_TOKEN"
}

---

# 2. VEHICLES

## GET /vehicles

Query:
?search=sh
?minPrice=100
?maxPrice=500

Response:
[
{
"id": 1,
"name": "Honda SH",
"price": 200,
"lat": 10.123,
"lng": 106.123
}
]

---

## POST /vehicles (Admin)

Headers:
Authorization: Bearer TOKEN

Request:
{
"name": "Air Blade",
"price": 150,
"lat": 10.1,
"lng": 106.2
}

---

## PUT /vehicles/{id}

## DELETE /vehicles/{id}

---

# 3. BOOKINGS

## POST /bookings

Headers:
Authorization: Bearer TOKEN

Request:
{
"vehicleId": 1,
"startDate": "2026-04-20",
"endDate": "2026-04-22"
}

Response:
{
"message": "Booking created"
}

---

## GET /bookings/user

## PUT /bookings/{id}/status

(Admin)

Request:
{
"status": "APPROVED"
}

---

# 4. MAP

## GET /vehicles/nearby

Query:
?lat=10.12&lng=106.12&radius=5

Response:
[
{ "id": 1, "name": "SH", "lat": 10.1, "lng": 106.2 }
]

---

# 5. CHAT

## GET /messages/{userId}

Response:
[
{
"senderId": 1,
"content": "Hello",
"timestamp": "2026-04-14"
}
]

---

## WebSocket

Endpoint:
/ws

Send:
{
"senderId": 1,
"receiverId": 2,
"content": "Hello"
}

Receive:
{
"senderId": 1,
"content": "Hello"
}
