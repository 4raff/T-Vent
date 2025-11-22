# 📚 T-Vent API Documentation

**Versi:** 1.0.0  
**Base URL:** `http://localhost:3000/api`  
**Last Updated:** November 22, 2025

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Authentication Endpoints](#authentication-endpoints)
4. [Users Endpoints](#users-endpoints)
5. [Events Endpoints](#events-endpoints)
6. [Tickets Endpoints](#tickets-endpoints)
7. [Payments Endpoints](#payments-endpoints)
8. [Reviews Endpoints](#reviews-endpoints)
9. [Bookmarks Endpoints](#bookmarks-endpoints)
10. [Messages Endpoints](#messages-endpoints)
11. [Notifications Endpoints](#notifications-endpoints)
12. [Admin Endpoints](#admin-endpoints)
13. [Error Handling](#error-handling)
14. [Response Formats](#response-formats)

---

## Getting Started

### Requirements

- Frontend application running on `http://localhost:3001`
- Backend API running on `http://localhost:3000`
- JWT token stored in localStorage as `jwtToken`

### Base Configuration

```javascript
// Frontend Configuration - src/config/api.js
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  TIMEOUT: 10000 // 10 seconds
};
```

### Installation in Frontend

```bash
npm install
```

---

## Authentication

### Token Management

**JWT Token Format:**
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjMwNzA3MjAwLCJleHAiOjE2MzA3MTA4MDB9.signature
```

**Token Storage (localStorage):**
```javascript
// After successful login
localStorage.getItem('jwtToken')  // "Bearer eyJhbGc..."
localStorage.getItem('user')      // { id, username, email, role, ... }
```

**Token Expiration:** 1 hour (3600 seconds)

### Automatic Token Injection

The frontend API client (`src/utils/api/client.js`) automatically injects JWT tokens:

```javascript
// Automatic Header Injection
Authorization: Bearer {jwtToken}
Content-Type: application/json
```

---

## Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "no_handphone": "081234567890"
}
```

**Success Response (201):**
```json
{
  "message": "Registrasi berhasil",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "no_handphone": "081234567890",
    "profile_picture": "john_doe.jpg",
    "role": "user",
    "created_at": "2025-11-22T10:30:00.000Z",
    "updated_at": "2025-11-22T10:30:00.000Z"
  }
}
```

**Error Response (400/500):**
```json
{
  "message": "Registrasi gagal",
  "errors": [
    { "field": "email", "message": "Email sudah digunakan" }
  ]
}
```

**Frontend Usage:**
```javascript
import { authService } from '@/utils/services/authService';

await authService.register({
  username: "john_doe",
  email: "john@example.com",
  password: "SecurePass123!",
  confirmPassword: "SecurePass123!",
  no_handphone: "081234567890"
});
```

---

### 2. Login User

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "message": "Login berhasil",
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "message": "Email atau password salah"
}
```

**Frontend Usage:**
```javascript
import { authService } from '@/utils/services/authService';

const response = await authService.login({
  email: "john@example.com",
  password: "SecurePass123!"
});

// response.data contains full user profile from getProfile()
console.log(response.data); // { id, username, email, role, ... }
```

**What Happens:**
1. Token received and stored in localStorage as `jwtToken`
2. User profile automatically fetched from `/api/users/profile`
3. User data stored in localStorage as `user`
4. Modal closes and user is authenticated

---

## Users Endpoints

### 1. Get User Profile (Authenticated)

**GET** `/users/profile`

Requires authentication. Returns current user's profile information.

**Headers:**
```javascript
Authorization: Bearer {jwtToken}
```

**Success Response (200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "no_handphone": "081234567890",
  "role": "user",
  "profile_picture": "john_doe.jpg",
  "created_at": "2025-11-22T10:30:00.000Z",
  "updated_at": "2025-11-22T10:30:00.000Z"
}
```

**Error Response (401):**
```json
{
  "message": "Autentikasi gagal. Silakan login."
}
```

**Frontend Usage:**
```javascript
import { authService } from '@/utils/services/authService';

// Automatically called after login
const userProfile = await authService.getProfile();
console.log(userProfile);

// Or get cached user from localStorage
const user = authService.getUser();
console.log(user);
```

---

### 2. Update User Profile (Authenticated)

**PUT** `/users/profile`

Update current user's profile information.

**Headers:**
```javascript
Authorization: Bearer {jwtToken}
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_updated",
  "no_handphone": "087654321098",
  "profile_picture": "new_picture.jpg"
}
```

**Success Response (200):**
```json
{
  "message": "Profil berhasil diperbarui",
  "data": {
    "id": 1,
    "username": "john_updated",
    "email": "john@example.com",
    "no_handphone": "087654321098",
    "role": "user",
    "profile_picture": "new_picture.jpg",
    "created_at": "2025-11-22T10:30:00.000Z",
    "updated_at": "2025-11-22T11:45:30.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Validasi gagal",
  "errors": [
    { "field": "username", "message": "Username harus minimal 3 karakter" }
  ]
}
```

**Frontend Usage:**
```javascript
import { apiClient } from '@/utils/api/client';
import { API_ENDPOINTS } from '@/config/api';

await apiClient.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, {
  username: "john_updated",
  no_handphone: "087654321098"
});
```

---

### 3. List All Users

**GET** `/users`

Get list of all users (public endpoint).

**Success Response (200):**
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "profile_picture": "john_doe.jpg",
    "created_at": "2025-11-22T10:30:00.000Z"
  },
  ...
]
```

---

## Events Endpoints

### 1. Get All Events

**GET** `/events`

List all events (public endpoint).

**Query Parameters:**
- `category` (optional): Filter by category
- `status` (optional): Filter by status (pending, approved, cancelled, completed)

**Success Response (200):**
```json
[
  {
    "id": 1,
    "nama": "Tech Conference 2025",
    "deskripsi": "Annual technology conference",
    "tanggal": "2025-12-15T09:00:00.000Z",
    "lokasi": "Jakarta Convention Center",
    "harga": 150000,
    "kategori": "Technology",
    "poster": "tech-conf.jpg",
    "jumlah_tiket": 500,
    "tiket_tersedia": 250,
    "created_by": 1,
    "status": "approved",
    "created_at": "2025-11-22T10:30:00.000Z",
    "updated_at": "2025-11-22T10:30:00.000Z"
  },
  ...
]
```

**Frontend Usage:**
```javascript
import { eventService } from '@/utils/services/eventService';

// Get all events
const events = await eventService.getEvents();

// Get events by category
const techEvents = await eventService.getEvents({ category: 'Technology' });
```

---

### 2. Get Event Details

**GET** `/events/:id`

Get specific event details by ID.

**URL Parameters:**
- `id` (required): Event ID

**Success Response (200):**
```json
{
  "id": 1,
  "nama": "Tech Conference 2025",
  "deskripsi": "Annual technology conference",
  "tanggal": "2025-12-15T09:00:00.000Z",
  "lokasi": "Jakarta Convention Center",
  "harga": 150000,
  "kategori": "Technology",
  "poster": "tech-conf.jpg",
  "jumlah_tiket": 500,
  "tiket_tersedia": 250,
  "created_by": 1,
  "status": "approved",
  "created_at": "2025-11-22T10:30:00.000Z",
  "updated_at": "2025-11-22T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "message": "Event tidak ditemukan"
}
```

**Frontend Usage:**
```javascript
import { eventService } from '@/utils/services/eventService';

const event = await eventService.getEvent(1);
console.log(event);
```

---

### 3. Get Event Detail Info

**GET** `/events/:id/detail`

Get detailed event information including creator and additional stats.

**URL Parameters:**
- `id` (required): Event ID

**Success Response (200):**
```json
{
  "event": {
    "id": 1,
    "nama": "Tech Conference 2025",
    ...
  },
  "creator": {
    "id": 1,
    "username": "organizer1",
    "profile_picture": "organizer.jpg"
  },
  "stats": {
    "total_tickets_sold": 250,
    "available_tickets": 250,
    "total_revenue": 37500000
  }
}
```

---

### 4. Get Available Tickets

**GET** `/events/:id/available-tiket`

Get available tickets for specific event.

**URL Parameters:**
- `id` (required): Event ID

**Success Response (200):**
```json
{
  "event_id": 1,
  "total_tiket": 500,
  "tiket_tersedia": 250,
  "tiket_terjual": 250
}
```

---

### 5. Create Event (Authenticated)

**POST** `/events`

Create new event. Requires authentication.

**Headers:**
```javascript
Authorization: Bearer {jwtToken}
```

**Request Body:**
```json
{
  "nama": "Tech Conference 2025",
  "deskripsi": "Annual technology conference",
  "tanggal": "2025-12-15T09:00:00Z",
  "lokasi": "Jakarta Convention Center",
  "harga": 150000,
  "kategori": "Technology",
  "poster": "tech-conf.jpg",
  "jumlah_tiket": 500
}
```

**Success Response (201):**
```json
{
  "message": "Event berhasil diajukan",
  "data": {
    "id": 1,
    "nama": "Tech Conference 2025",
    ...
    "created_by": 1,
    "status": "pending",
    "created_at": "2025-11-22T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Validasi gagal",
  "errors": [
    { "field": "nama", "message": "Nama event harus diisi" }
  ]
}
```

**Frontend Usage:**
```javascript
import { eventService } from '@/utils/services/eventService';

await eventService.createEvent({
  nama: "Tech Conference 2025",
  deskripsi: "Annual technology conference",
  tanggal: "2025-12-15T09:00:00Z",
  lokasi: "Jakarta Convention Center",
  harga: 150000,
  kategori: "Technology",
  poster: "tech-conf.jpg",
  jumlah_tiket: 500
});
```

---

### 6. Update Event (Authenticated)

**PUT** `/events/:id`

Update event. Only event creator or admin can update.

**Headers:**
```javascript
Authorization: Bearer {jwtToken}
```

**URL Parameters:**
- `id` (required): Event ID

**Request Body:**
```json
{
  "nama": "Tech Conference 2025 - Updated",
  "harga": 160000,
  "jumlah_tiket": 600
}
```

**Success Response (200):**
```json
{
  "message": "Event berhasil diperbarui",
  "data": { ... }
}
```

**Error Response (403):**
```json
{
  "message": "Akses ditolak. Anda bukan pemilik event."
}
```

**Frontend Usage:**
```javascript
import { eventService } from '@/utils/services/eventService';

await eventService.updateEvent(1, {
  nama: "Tech Conference 2025 - Updated",
  harga: 160000
});
```

---

### 7. Delete Event (Authenticated)

**DELETE** `/events/:id`

Delete event. Only event creator or admin can delete.

**Headers:**
```javascript
Authorization: Bearer {jwtToken}
```

**URL Parameters:**
- `id` (required): Event ID

**Success Response (204):**
No content

**Frontend Usage:**
```javascript
import { eventService } from '@/utils/services/eventService';

await eventService.deleteEvent(1);
```

---

## Tickets Endpoints

### 1. Get All Tickets

**GET** `/tickets`

List all tickets (public endpoint).

**Success Response (200):**
```json
[
  {
    "id": 1,
    "event_id": 1,
    "user_id": 2,
    "nomor_tiket": "TKET-001",
    "status": "active",
    "tanggal_pembelian": "2025-11-22T10:30:00.000Z",
    "created_at": "2025-11-22T10:30:00.000Z"
  },
  ...
]
```

---

### 2. Get Ticket by ID

**GET** `/tickets/:id`

Get specific ticket details.

**URL Parameters:**
- `id` (required): Ticket ID

**Success Response (200):**
```json
{
  "id": 1,
  "event_id": 1,
  "user_id": 2,
  "nomor_tiket": "TKET-001",
  "status": "active",
  "tanggal_pembelian": "2025-11-22T10:30:00.000Z",
  "created_at": "2025-11-22T10:30:00.000Z"
}
```

---

### 3. Book Ticket

**POST** `/tickets`

Create/book new ticket for event.

**Request Body:**
```json
{
  "event_id": 1,
  "user_id": 2,
  "jumlah_tiket": 2
}
```

**Success Response (201):**
```json
{
  "message": "Tiket berhasil dibuat",
  "data": {
    "id": 1,
    "event_id": 1,
    "user_id": 2,
    "nomor_tiket": "TKET-001",
    "status": "active",
    "created_at": "2025-11-22T10:30:00.000Z"
  }
}
```

---

### 4. Update Ticket Status

**PUT** `/tickets/:id`

Update ticket status.

**URL Parameters:**
- `id` (required): Ticket ID

**Request Body:**
```json
{
  "status": "used"
}
```

**Allowed Status Values:**
- `active` - Ticket is active
- `used` - Ticket has been used
- `cancelled` - Ticket cancelled

**Success Response (200):**
```json
{
  "message": "Tiket berhasil diperbarui",
  "data": { ... }
}
```

---

### 5. Delete Ticket

**DELETE** `/tickets/:id`

Delete ticket.

**URL Parameters:**
- `id` (required): Ticket ID

**Success Response (204):**
No content

---

### 6. Confirm Payment

**POST** `/tickets/konfirmasi-pembayaran`

Confirm ticket payment.

**Request Body:**
```json
{
  "ticket_id": 1,
  "payment_proof": "base64_encoded_image"
}
```

**Success Response (200):**
```json
{
  "message": "Pembayaran berhasil dikonfirmasi",
  "data": { ... }
}
```

---

### 7. Cancel Ticket

**POST** `/tickets/batalkan-tiket`

Cancel ticket booking.

**Request Body:**
```json
{
  "ticket_id": 1,
  "alasan": "Reason for cancellation"
}
```

**Success Response (200):**
```json
{
  "message": "Tiket berhasil dibatalkan",
  "data": { ... }
}
```

---

## Payments Endpoints

### 1. Get All Payments

**GET** `/payments`

List all payments.

**Success Response (200):**
```json
[
  {
    "id": 1,
    "ticket_id": 1,
    "user_id": 2,
    "jumlah": 150000,
    "metode_pembayaran": "bank_transfer",
    "bukti_pembayaran": "payment_proof.jpg",
    "status": "approved",
    "tanggal_pembayaran": "2025-11-22T10:30:00.000Z",
    "created_at": "2025-11-22T10:30:00.000Z"
  },
  ...
]
```

---

### 2. Get Payment by ID

**GET** `/payments/:id`

Get specific payment details.

**URL Parameters:**
- `id` (required): Payment ID

**Success Response (200):**
```json
{
  "id": 1,
  "ticket_id": 1,
  "user_id": 2,
  "jumlah": 150000,
  "metode_pembayaran": "bank_transfer",
  "bukti_pembayaran": "payment_proof.jpg",
  "status": "approved",
  "tanggal_pembayaran": "2025-11-22T10:30:00.000Z"
}
```

---

### 3. Get Total Payments

**GET** `/payments/total`

Get total payment statistics.

**Success Response (200):**
```json
{
  "total_pembayaran": 37500000,
  "jumlah_transaksi": 250,
  "status_pending": 10,
  "status_approved": 240
}
```

---

### 4. Create Payment

**POST** `/payments`

Create new payment record.

**Request Body:**
```json
{
  "ticket_id": 1,
  "user_id": 2,
  "jumlah": 150000,
  "metode_pembayaran": "bank_transfer",
  "bukti_pembayaran": "payment_proof.jpg"
}
```

**Allowed Payment Methods:**
- `bank_transfer`
- `credit_card`
- `e_wallet`
- `cash`

**Success Response (201):**
```json
{
  "message": "Pembayaran berhasil dibuat",
  "data": { ... }
}
```

---

### 5. Update Payment Status

**PUT** `/payments/:id`

Update payment status.

**URL Parameters:**
- `id` (required): Payment ID

**Request Body:**
```json
{
  "status": "approved"
}
```

**Allowed Status Values:**
- `pending` - Awaiting approval
- `approved` - Payment approved
- `rejected` - Payment rejected

**Success Response (200):**
```json
{
  "message": "Status pembayaran berhasil diperbarui",
  "data": { ... }
}
```

---

### 6. Process Payment

**POST** `/payments/proses`

Process/approve payment.

**Request Body:**
```json
{
  "payment_id": 1,
  "catatan": "Payment approved"
}
```

**Success Response (200):**
```json
{
  "message": "Pembayaran berhasil diproses",
  "data": { ... }
}
```

---

### 7. Reject Payment

**POST** `/payments/tolak`

Reject payment.

**Request Body:**
```json
{
  "payment_id": 1,
  "alasan": "Bukti pembayaran tidak jelas"
}
```

**Success Response (200):**
```json
{
  "message": "Pembayaran berhasil ditolak",
  "data": { ... }
}
```

---

### 8. Approve Payment

**POST** `/payments/terima`

Approve and receive payment.

**Request Body:**
```json
{
  "payment_id": 1
}
```

**Success Response (200):**
```json
{
  "message": "Pembayaran berhasil diterima",
  "data": { ... }
}
```

---

### 9. Delete Payment

**DELETE** `/payments/:id`

Delete payment record.

**URL Parameters:**
- `id` (required): Payment ID

**Success Response (204):**
No content

---

## Reviews Endpoints

### 1. Get All Reviews

**GET** `/reviews`

List all reviews.

**Success Response (200):**
```json
[
  {
    "id": 1,
    "event_id": 1,
    "user_id": 2,
    "rating": 4.5,
    "komentar": "Great event!",
    "created_at": "2025-11-22T10:30:00.000Z",
    "updated_at": "2025-11-22T10:30:00.000Z"
  },
  ...
]
```

---

### 2. Get Review by ID

**GET** `/reviews/:id`

Get specific review details.

**URL Parameters:**
- `id` (required): Review ID

**Success Response (200):**
```json
{
  "id": 1,
  "event_id": 1,
  "user_id": 2,
  "rating": 4.5,
  "komentar": "Great event!",
  "created_at": "2025-11-22T10:30:00.000Z"
}
```

---

### 3. Create Review

**POST** `/reviews`

Create new review for event.

**Request Body:**
```json
{
  "event_id": 1,
  "user_id": 2,
  "rating": 4.5,
  "komentar": "Great event!"
}
```

**Rating Range:** 1 - 5

**Success Response (201):**
```json
{
  "message": "Review berhasil dibuat",
  "data": { ... }
}
```

---

### 4. Submit Review

**POST** `/reviews/submit`

Submit review (alternative endpoint).

**Request Body:**
```json
{
  "event_id": 1,
  "user_id": 2,
  "rating": 4.5,
  "komentar": "Great event!"
}
```

**Success Response (201):**
```json
{
  "message": "Review berhasil dikirim",
  "data": { ... }
}
```

---

### 5. Update Review

**PUT** `/reviews/:id`

Update existing review.

**URL Parameters:**
- `id` (required): Review ID

**Request Body:**
```json
{
  "rating": 5,
  "komentar": "Amazing event! Highly recommended!"
}
```

**Success Response (200):**
```json
{
  "message": "Review berhasil diperbarui",
  "data": { ... }
}
```

---

### 6. Delete Review

**DELETE** `/reviews/:id`

Delete review.

**URL Parameters:**
- `id` (required): Review ID

**Success Response (204):**
No content

---

## Bookmarks Endpoints

### 1. Get Bookmarks by User

**GET** `/bookmarks/user/:user_id`

Get all bookmarks for specific user.

**URL Parameters:**
- `user_id` (required): User ID

**Success Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "event_id": 1,
    "created_at": "2025-11-22T10:30:00.000Z"
  },
  ...
]
```

---

### 2. Get Bookmark by ID

**GET** `/bookmarks/:id`

Get specific bookmark details.

**URL Parameters:**
- `id` (required): Bookmark ID

**Success Response (200):**
```json
{
  "id": 1,
  "user_id": 2,
  "event_id": 1,
  "created_at": "2025-11-22T10:30:00.000Z"
}
```

---

### 3. Create Bookmark

**POST** `/bookmarks`

Add event to bookmarks.

**Request Body:**
```json
{
  "user_id": 2,
  "event_id": 1
}
```

**Success Response (201):**
```json
{
  "message": "Bookmark berhasil dibuat",
  "data": { ... }
}
```

---

### 4. Delete Bookmark

**DELETE** `/bookmarks/:id`

Remove bookmark.

**URL Parameters:**
- `id` (required): Bookmark ID

**Success Response (204):**
No content

---

## Messages Endpoints

### 1. Get Messages by User

**GET** `/messages/user/:user_id`

Get all messages for specific user.

**URL Parameters:**
- `user_id` (required): User ID

**Success Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "pengirim": "admin",
    "pesan": "Welcome to T-Vent!",
    "created_at": "2025-11-22T10:30:00.000Z"
  },
  ...
]
```

---

### 2. Get Message by ID

**GET** `/messages/:id`

Get specific message details.

**URL Parameters:**
- `id` (required): Message ID

**Success Response (200):**
```json
{
  "id": 1,
  "user_id": 2,
  "pengirim": "admin",
  "pesan": "Welcome to T-Vent!",
  "created_at": "2025-11-22T10:30:00.000Z"
}
```

---

### 3. Create Message

**POST** `/messages`

Create new message.

**Request Body:**
```json
{
  "user_id": 2,
  "pengirim": "admin",
  "pesan": "Welcome to T-Vent!"
}
```

**Success Response (201):**
```json
{
  "message": "Pesan berhasil dibuat",
  "data": { ... }
}
```

---

## Notifications Endpoints

### 1. Get Notifications by User

**GET** `/notifications/user/:user_id`

Get all notifications for specific user.

**URL Parameters:**
- `user_id` (required): User ID

**Success Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "judul": "Event Approved",
    "deskripsi": "Your event has been approved",
    "is_read": false,
    "created_at": "2025-11-22T10:30:00.000Z"
  },
  ...
]
```

---

### 2. Get Notification by ID

**GET** `/notifications/:id`

Get specific notification details.

**URL Parameters:**
- `id` (required): Notification ID

**Success Response (200):**
```json
{
  "id": 1,
  "user_id": 2,
  "judul": "Event Approved",
  "deskripsi": "Your event has been approved",
  "is_read": false,
  "created_at": "2025-11-22T10:30:00.000Z"
}
```

---

### 3. Create Notification

**POST** `/notifications`

Create new notification.

**Request Body:**
```json
{
  "user_id": 2,
  "judul": "Event Approved",
  "deskripsi": "Your event has been approved"
}
```

**Success Response (201):**
```json
{
  "message": "Notifikasi berhasil dibuat",
  "data": { ... }
}
```

---

### 4. Mark Notification as Read

**PATCH** `/notifications/:id/read`

Mark notification as read.

**URL Parameters:**
- `id` (required): Notification ID

**Success Response (200):**
```json
{
  "message": "Notifikasi telah dibaca",
  "data": { ... }
}
```

---

## Admin Endpoints

### 1. Approve Event

**PUT** `/admin/approve-event/:id`

Approve pending event (admin only).

**URL Parameters:**
- `id` (required): Event ID

**Request Body:**
```json
{
  "catatan": "Event approved"
}
```

**Success Response (200):**
```json
{
  "message": "Event berhasil disetujui",
  "data": { ... }
}
```

---

### 2. Reject Event

**PUT** `/admin/reject-event/:id`

Reject pending event (admin only).

**URL Parameters:**
- `id` (required): Event ID

**Request Body:**
```json
{
  "alasan": "Event tidak sesuai dengan kriteria"
}
```

**Success Response (200):**
```json
{
  "message": "Event berhasil ditolak",
  "data": { ... }
}
```

---

### 3. Cancel Event

**PUT** `/admin/cancel-event/:id`

Cancel event (admin only).

**URL Parameters:**
- `id` (required): Event ID

**Request Body:**
```json
{
  "alasan": "Event dibatalkan oleh admin"
}
```

**Success Response (200):**
```json
{
  "message": "Event berhasil dibatalkan",
  "data": { ... }
}
```

---

### 4. Complete Event

**PUT** `/admin/complete-event/:id`

Mark event as completed (admin only).

**URL Parameters:**
- `id` (required): Event ID

**Request Body:**
```json
{
  "catatan": "Event selesai"
}
```

**Success Response (200):**
```json
{
  "message": "Event berhasil diselesaikan",
  "data": { ... }
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "message": "Error message",
  "error": "Error details",
  "errors": [
    {
      "field": "fieldname",
      "message": "Validation error message"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK - Request successful |
| `201` | Created - Resource created successfully |
| `204` | No Content - Successful deletion |
| `400` | Bad Request - Validation error or invalid input |
| `401` | Unauthorized - Missing or invalid JWT token |
| `403` | Forbidden - Access denied (not permission) |
| `404` | Not Found - Resource not found |
| `500` | Server Error - Internal server error |

### Common Error Messages

```javascript
// Authentication errors
"Autentikasi gagal. Silakan login."
"Autentikasi gagal. Format token tidak valid (Harus: Bearer <token>)."

// Validation errors
"Email atau password salah"
"Email sudah digunakan"
"Data tidak lengkap"
"Validasi gagal"

// Authorization errors
"Akses ditolak. Anda bukan pemilik event."
"Akses ditolak. Anda bukan pemilik atau administrator event."

// Not found errors
"Event tidak ditemukan"
"Tiket tidak ditemukan"
"User tidak ditemukan"
"Resource tidak ditemukan"

// Server errors
"Server Error"
"Gagal membuat event"
"Gagal memperbarui tiket"
```

---

## Response Formats

### Successful Response

```javascript
// Single item response
{
  "message": "Success message",
  "data": {
    "id": 1,
    "field1": "value1",
    "field2": "value2",
    ...
  }
}

// List response
[
  {
    "id": 1,
    "field1": "value1",
    ...
  },
  {
    "id": 2,
    "field1": "value2",
    ...
  }
]

// Auth response
{
  "message": "Login berhasil",
  "token": "Bearer eyJhbGc..."
}
```

### Error Response

```javascript
{
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "email",
      "message": "Email sudah digunakan"
    },
    {
      "field": "username",
      "message": "Username harus minimal 3 karakter"
    }
  ]
}
```

---

## Frontend Service Methods

### Auth Service

```javascript
import { authService } from '@/utils/services/authService';

// Register
await authService.register({
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  no_handphone: string
});

// Login
await authService.login({
  email: string,
  password: string
});

// Get Profile
await authService.getProfile();

// Logout
authService.logout();

// Check Authentication
authService.isAuthenticated(); // returns boolean

// Get Stored User Data
authService.getUser(); // returns user object or null
```

### Event Service

```javascript
import { eventService } from '@/utils/services/eventService';

// Get all events
await eventService.getEvents();

// Get event by ID
await eventService.getEvent(eventId);

// Create event
await eventService.createEvent({
  nama: string,
  deskripsi: string,
  tanggal: string,
  lokasi: string,
  harga: number,
  kategori: string,
  poster: string,
  jumlah_tiket: number
});

// Update event
await eventService.updateEvent(eventId, {
  nama?: string,
  harga?: number,
  ...
});

// Delete event
await eventService.deleteEvent(eventId);
```

### API Client

```javascript
import { apiClient } from '@/utils/api/client';

// GET request
await apiClient.get('/endpoint');

// POST request
await apiClient.post('/endpoint', {
  field: 'value'
});

// PUT request
await apiClient.put('/endpoint/:id', {
  field: 'new_value'
});

// DELETE request
await apiClient.delete('/endpoint/:id');

// PATCH request
await apiClient.patch('/endpoint/:id', {
  field: 'new_value'
});
```

---

## Quick Start Examples

### 1. Register and Login

```javascript
import { authService } from '@/utils/services/authService';

// Register
const registerResponse = await authService.register({
  username: "john_doe",
  email: "john@example.com",
  password: "SecurePass123!",
  confirmPassword: "SecurePass123!",
  no_handphone: "081234567890"
});

// Login (auto-fetches profile)
const loginResponse = await authService.login({
  email: "john@example.com",
  password: "SecurePass123!"
});

// User data now in localStorage
console.log(localStorage.getItem('user')); // Full user profile
console.log(localStorage.getItem('jwtToken')); // Bearer token

// Or get from service
const user = authService.getUser();
console.log(user);
```

### 2. Fetch and Display Events

```javascript
import { eventService } from '@/utils/services/eventService';

// Get all events
const events = await eventService.getEvents();

// Get specific event
const event = await eventService.getEvent(1);

// Display in component
events.forEach(event => {
  console.log(`${event.nama} - Rp${event.harga}`);
});
```

### 3. Create Event (Authenticated)

```javascript
import { eventService } from '@/utils/services/eventService';

const newEvent = await eventService.createEvent({
  nama: "Tech Conference 2025",
  deskripsi: "Annual technology conference",
  tanggal: "2025-12-15T09:00:00Z",
  lokasi: "Jakarta Convention Center",
  harga: 150000,
  kategori: "Technology",
  poster: "tech-conf.jpg",
  jumlah_tiket: 500
});

console.log(newEvent); // New event data with ID
```

### 4. Handle Errors

```javascript
import { apiClient } from '@/utils/api/client';

try {
  const response = await apiClient.get('/events/invalid-id');
} catch (error) {
  console.error(error.message); // "Not Found" or custom message
  console.error(error.status); // 404
  console.error(error.data); // { message: "Event tidak ditemukan" }
}
```

---

## Notes

- JWT tokens expire after **1 hour**
- All timestamps are in **ISO 8601 format** (UTC)
- All monetary amounts are in **IDR (Indonesian Rupiah)**
- Frontend automatically injects JWT token to all authenticated requests
- User profile is fetched automatically after login and stored in localStorage
- All endpoints follow REST conventions
- Rate limiting: No current rate limiting (implement if needed)

---

## Support

For API issues or questions, contact: **backend.tvent@example.com**

Last Updated: November 22, 2025
