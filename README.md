@ -1,72 +0,0 @@
# Delivery App Backend

A complete Go backend API for a delivery preference management system. This backend handles user authentication, order management, and delivery preferences with full CRUD operations.

## Features

- **JWT Authentication** - Secure user login and token-based auth
- **Order Management** - Create, read, update delivery orders
- **Multiple Delivery Types** - Support for IN_STORE, DELIVERY, and CURBSIDE options
- **Input Validation** - Comprehensive request validation with proper error messages
- **PostgreSQL Database** - Persistent data storage with automatic migrations
- **Docker Support** - Containerized deployment with Docker Compose
- **RESTful API** - Clean, well-structured API endpoints
- **CORS Enabled** - Ready for frontend integration
- **Health Checks** - Container health monitoring

## 🛠️ Tech Stack

- **Backend**: Go (Gin framework)
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Containerization**: Docker & Docker Compose
- **Testing**: Go testing package

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login with email/password

### User
- `GET /api/v1/me` - Get current user information

### Orders
- `GET /api/v1/orders` - Get all orders for current user
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/:id` - Get specific order
- `PUT /api/v1/orders/:id` - Update existing order

## 🗃️ Order Delivery Types

### 1. IN_STORE
- No additional fields required

### 2. DELIVERY
- **Required**: `address`, `delivery_time` (future datetime)
- **Optional**: None

### 3. CURBSIDE
- **Required**: `vehicle_color`, `vehicle_model`
- **Optional**: None

## 🔑 Test Credentials

For testing purposes, use these pre-seeded credentials:
- **Email**: `user@example.com`
- **Password**: `password`

## 🚀 Quick Start

### Prerequisites
- Go 1.21+ (for local development)
- PostgreSQL (for local development)
- Docker & Docker Compose (for containerized deployment)

### Method 1: Run with Docker (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build



Bilkul, yeh lo chhoti aur simple version 👇

---

## 📱 React Native Expo Frontend

A lightweight mobile app built with **Expo + React Native**, connected to the Go backend.

### ✨ Features

* Login with email/password (`/api/v1/auth/login`)
* View orders list (`/api/v1/orders`)
* Create & update orders with delivery type (IN_STORE / DELIVERY / CURBSIDE)
* JWT-based auth with secure token storage

---

### 🧰 Tech Stack

* **React Native (Expo)**
* **Axios** for API calls
* **Expo Secure Store** for JWT
* **React Navigation** for screens

---

### ⚙️ Setup

```bash
cd frontend
npm install
npm start
```

Make sure backend runs first (on same WiFi network).

Set your API base URL in `frontend/.env`

```
API_BASE_URL=http://192.168.18.41:8080
```

---

### 🚀 Run on device

```bash
npx expo start
```

Scan QR with Expo Go app.

---

Chaho to main is frontend ka **ready boilerplate** code (App.js + Login + Orders + API integration) bana doon taake copy paste se chalu ho jaye?
