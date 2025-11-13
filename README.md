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
