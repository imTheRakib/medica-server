# Medica-server# Medica Server - Backend API

<div align="center">
  
  ### Medicine Management System Backend
  
  [![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express-5.2.1-black?style=flat-square&logo=express)](https://expressjs.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-7.3.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Development Scripts](#development-scripts)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

---

## 🔍 Overview

**Medica Server** is the backend REST API for the Medica medicine e-commerce platform. It provides comprehensive endpoints for managing medicines, orders, user authentication, seller operations, and administrative functions. Built with Express.js, TypeScript, and Prisma ORM, it offers a scalable, type-safe, and secure backend solution.

The server handles:

- **Authentication** with email/password and Google OAuth via Better Auth
- **Role-based access control** (Customer, Seller, Admin)
- **Medicine inventory management**
- **Order processing** with cash-on-delivery
- **Review and rating system**
- **Image uploads** via ImageBB
- **Email verification** via Nodemailer

---

## 🛠 Tech Stack

| Category           | Technologies                                   |
| ------------------ | ---------------------------------------------- |
| **Runtime**        | Node.js 20+                                    |
| **Framework**      | Express.js 5.2.1                               |
| **Language**       | TypeScript 5.9.3 (51.3%) & JavaScript (48.7%)  |
| **Database**       | PostgreSQL                                     |
| **ORM**            | Prisma 7.3.0 with PrismaAdapter for PostgreSQL |
| **Authentication** | Better Auth 1.4.17                             |
| **Email Service**  | Nodemailer 7.0.13                              |
| **File Upload**    | Multer 2.0.2                                   |
| **Image Hosting**  | ImageBB API                                    |
| **HTTP Client**    | Axios 1.13.4                                   |
| **Security**       | CORS 2.8.6                                     |
| **Build Tool**     | tsup 8.5.1                                     |
| **Dev Tools**      | tsx 4.21.0                                     |

---

## ✨ Features

### 🔐 Authentication & Authorization

- ✅ Email/Password authentication with email verification
- ✅ Google OAuth integration
- ✅ Role-based access control (RBAC)
- ✅ JWT session management
- ✅ Protected routes with middleware
- ✅ User status management (ACTIVE/BANNED)

### 🏪 Seller Management

- ✅ Medicine CRUD operations
- ✅ Stock level management
- ✅ Order fulfillment tracking
- ✅ Sales statistics and analytics
- ✅ Medicine activation/deactivation
- ✅ Image upload for medicine thumbnails

### 👥 Customer Operations

- ✅ Browse and search medicines
- ✅ Place orders with shipping details
- ✅ Order history and tracking
- ✅ Order cancellation
- ✅ Product reviews and ratings
- ✅ Profile management

### 👨‍💼 Admin Panel

- ✅ User management (ban/unban/delete)
- ✅ Platform-wide statistics
- ✅ Category management
- ✅ Medicine oversight
- ✅ Order monitoring
- ✅ Featured medicine control

### 📦 Core Features

- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Request validation
- ✅ Pagination support
- ✅ Search and filter capabilities
- ✅ Database transactions
- ✅ Type-safe queries with Prisma

---

## 📦 Prerequisites

Ensure you have the following installed:

- **Node.js** (v20 or higher)
- **npm** or **pnpm**
- **PostgreSQL** (v14 or higher)
- **Git**

---

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ashrafulatif/medica-server.git
   cd medica-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
APP_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/medica_db

# Authentication
BETTER_AUTH_URL=http://localhost:5000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Service (Gmail SMTP)
APP_USERNAME=your_email@gmail.com
APP_PASSWORD=your_app_specific_password

# Image Upload
IMAGEBB_API_KEY=your_imagebb_api_key
```

### Environment Variable Descriptions

| Variable               | Description                                   | Required |
| ---------------------- | --------------------------------------------- | -------- |
| `PORT`                 | Server port number                            | Yes      |
| `APP_URL`              | Frontend application URL (for CORS)           | Yes      |
| `DATABASE_URL`         | PostgreSQL connection string                  | Yes      |
| `BETTER_AUTH_URL`      | Backend URL for authentication                | Yes      |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                        | Yes      |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret                    | Yes      |
| `APP_USERNAME`         | Email account for sending verification emails | Yes      |
| `APP_PASSWORD`         | App-specific password for email service       | Yes      |
| `IMAGEBB_API_KEY`      | ImageBB API key for image uploads             | Yes      |

---

## 💾 Database Setup

### 1. Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE medica_db;

# Exit psql
\q
```

### 2. Run Prisma Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 3. Seed Admin User

```bash
npm run seed:admin
```

This creates an admin user with:

- **Email**: `ashrafulhaqueatif@gmail.com`
- **Password**: `12345678`
- **Role**: ADMIN

---

## 🎯 Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:5000` (or your configured PORT).

### Production Build

```bash
# Build the application
npm run build

# The build output will be in the /api folder
```

### Start Production Server

After building, the compiled JavaScript will be in the `api/` folder. Deploy this folder to your hosting service (e.g., Vercel).

---

## 📁 Project Structure

```
medica-server/
├── api/                      # Compiled output (generated by tsup)
│   └── server.mjs            # Production bundle
├── prisma/
│   ├── schema/               # Prisma schema files
│   └── migrations/           # Database migrations
├── src/
│   ├── app.ts                # Express app configuration
│   ├── server.ts             # Server entry point
│   ├── config/               # Configuration files
│   │   ├── index.ts          # Environment config
│   │   ├── imageBB.ts        # ImageBB upload config
│   │   └── upload.ts         # Multer config
│   ├── lib/
│   │   ├── auth.ts           # Better Auth configuration
│   │   └── prisma.ts         # Prisma client instance
│   ├── middlewares/
│   │   ├── authMiddleware.ts       # JWT verification
│   │   ├── globalErrorHandler.ts  # Error handling
│   │   └── notFound.ts             # 404 handler
│   ├── modules/              # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.service.ts
│   │   ├── medicines/
│   │   │   ├── medicines.controller.ts
│   │   │   ├── medicines.routes.ts
│   │   │   └── medicines.service.ts
│   │   ├── orders/
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.routes.ts
│   │   │   └── orders.service.ts
│   │   ├── cart/
│   │   │   ├── cart.controller.ts
│   │   │   ├── cart.routes.ts
│   │   │   └── cart.service.ts
│   │   ├── reviews/
│   │   │   ├── reviews.controller.ts
│   │   │   ├── reviews.routes.ts
│   │   │   └── reviews.service.ts
│   │   ├── category/
│   │   │   ├── category.controller.ts
│   │   │   ├── category.routes.ts
│   │   │   └── category.service.ts
│   │   ├── sellerManagement/
│   │   │   ├── sellerManagement.controller.ts
│   │   │   ├── sellerManagement.routes.ts
│   │   │   └── sellerManagement.service.ts
│   │   └── admin/
│   │       ├── admin.controller.ts
│   │       ├── admin.routes.ts
│   │       └── admin.service.ts
│   ├── scripts/
│   │   └── seedAdmin.ts      # Admin seeding script
│   ├── types/
│   │   └── enums/            # TypeScript enums
│   └── utils/
│       └── emailTemplate.ts  # Email HTML templates
├── generated/                # Generated Prisma client
├── .env                      # Environment variables
├── .gitignore
├── package.json
├── prisma.config.ts          # Prisma configuration
├── tsconfig.json             # TypeScript config
├── vercel.json               # Vercel deployment config
└── README.md
```

---

## 🔌 API Endpoints

### Base URL

```
http://localhost:5000
```

### Root Endpoint

```http
GET /
```

**Response:**

```json
{
  "success": true,
  "message": "Medica - Medicine Management System API",
  "description": "A comprehensive medicine management system for sellers and customers",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "medicines": "/api/medicines",
    "orders": "/api/orders",
    "seller": "/api/seller",
    "admin": "/api/admin",
    "categories": "/api/category",
    "reviews": "/api/reviews"
  }
}
```

---

### 🔐 Authentication Endpoints

| Method | Endpoint                   | Description               | Auth Required |
| ------ | -------------------------- | ------------------------- | ------------- |
| POST   | `/api/auth/sign-up/email`  | Register new user         | No            |
| POST   | `/api/auth/sign-in/email`  | Login with email/password | No            |
| POST   | `/api/auth/sign-in/social` | Login with Google OAuth   | No            |
| GET    | `/api/auth/me`             | Get logged-in user info   | Yes           |
| PATCH  | `/api/auth/update`         | Update user profile       | Yes           |
| POST   | `/api/auth/sign-out`       | Logout user               | Yes           |
| GET    | `/api/auth/get-session`    | Get current session       | Yes           |

---

### 💊 Medicine Endpoints

| Method | Endpoint                            | Description                         | Auth Required | Role |
| ------ | ----------------------------------- | ----------------------------------- | ------------- | ---- |
| GET    | `/api/medicines`                    | Get all medicines (with pagination) | No            | -    |
| GET    | `/api/medicines/isFeatured`         | Get featured medicines              | No            | -    |
| GET    | `/api/medicines/topViewed-medicine` | Get popular medicines               | No            | -    |
| GET    | `/api/medicines/:id`                | Get medicine details with reviews   | No            | -    |
| GET    | `/api/medicines/category/:id`       | Get medicines by category           | No            | -    |

---

### 🏪 Seller Endpoints

| Method | Endpoint                    | Description            | Auth Required | Role   |
| ------ | --------------------------- | ---------------------- | ------------- | ------ |
| POST   | `/api/seller/medicines`     | Create new medicine    | Yes           | SELLER |
| PUT    | `/api/seller/medicines/:id` | Update medicine        | Yes           | SELLER |
| DELETE | `/api/seller/medicines/:id` | Delete medicine        | Yes           | SELLER |
| GET    | `/api/seller/medicines`     | Get seller's medicines | Yes           | SELLER |
| GET    | `/api/seller/orders`        | Get seller's orders    | Yes           | SELLER |
| PUT    | `/api/seller/orders/:id`    | Update order status    | Yes           | SELLER |
| GET    | `/api/seller/statistics`    | Get seller statistics  | Yes           | SELLER |

---

### 📦 Order Endpoints

| Method | Endpoint                         | Description           | Auth Required | Role     |
| ------ | -------------------------------- | --------------------- | ------------- | -------- |
| POST   | `/api/orders`                    | Create new order      | Yes           | CUSTOMER |
| GET    | `/api/orders`                    | Get customer's orders | Yes           | CUSTOMER |
| GET    | `/api/orders/:id`                | Get order details     | Yes           | CUSTOMER |
| PUT    | `/api/orders/cancel/:id`         | Cancel order          | Yes           | CUSTOMER |
| GET    | `/api/orders/recent`             | Get recent orders     | Yes           | CUSTOMER |
| GET    | `/api/orders/customerOrderStats` | Get order statistics  | Yes           | CUSTOMER |

---

### 🛒 Cart Endpoints

| Method | Endpoint             | Description       | Auth Required | Role     |
| ------ | -------------------- | ----------------- | ------------- | -------- |
| GET    | `/api/cart`          | Get cart items    | Yes           | CUSTOMER |
| POST   | `/api/cart/add`      | Add item to cart  | Yes           | CUSTOMER |
| PUT    | `/api/cart/item/:id` | Update cart item  | Yes           | CUSTOMER |
| DELETE | `/api/cart/item/:id` | Remove cart item  | Yes           | CUSTOMER |
| DELETE | `/api/cart/clear`    | Clear entire cart | Yes           | CUSTOMER |

---

### ⭐ Review Endpoints

| Method | Endpoint       | Description           | Auth Required | Role     |
| ------ | -------------- | --------------------- | ------------- | -------- |
| POST   | `/api/reviews` | Submit product review | Yes           | CUSTOMER |

---

### 👨‍💼 Admin Endpoints

| Method | Endpoint                      | Description             | Auth Required | Role  |
| ------ | ----------------------------- | ----------------------- | ------------- | ----- |
| GET    | `/api/admin/getAllTableStats` | Get platform statistics | Yes           | ADMIN |
| GET    | `/api/admin/users`            | Get all users           | Yes           | ADMIN |
| PUT    | `/api/admin/users/:id`        | Update user status      | Yes           | ADMIN |
| DELETE | `/api/admin/users/:id`        | Delete user             | Yes           | ADMIN |
| POST   | `/api/category`               | Create category         | Yes           | ADMIN |
| GET    | `/api/category`               | Get all categories      | No            | -     |

---

## 🔐 Authentication

### Better Auth Implementation

The server uses **Better Auth** for secure authentication with the following configuration:

```typescript
// Email/Password Authentication
emailAndPassword: {
  enabled: true,
  autoSignIn: false,
  requireEmailVerification: true
}

// Email Verification
emailVerification: {
  sendOnSignUp: true,
  autoSignInAfterVerification: true
}

// Social Authentication
socialProviders: {
  google: {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET
  }
}
```

### User Roles

| Role       | Description                          | Default |
| ---------- | ------------------------------------ | ------- |
| `CUSTOMER` | Regular users who purchase medicines | ✅      |
| `SELLER`   | Vendors who list and sell medicines  | ❌      |
| `ADMIN`    | Platform administrators              | ❌      |

### Auth Middleware

Protected routes use the `authMiddleware` to verify JWT tokens and check user roles:

```typescript
authMiddleware("ADMIN", "SELLER", "CUSTOMER");
```

---

## 💾 Database Schema

### Core Models

#### User

```prisma
model User {
  id            String      @id
  name          String
  email         String      @unique
  emailVerified Boolean     @default(false)
  image         String?
  role          String      @default("CUSTOMER")
  phone         String?
  status        String?     @default("ACTIVE")
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  // Relations
  sessions      Session[]
  accounts      Account[]
  medicines     Medicines[]
  orders        Orders[]
  reviews       Reviews[]
  category      Category[]
}
```

#### Medicines

```prisma
model Medicines {
  id           String      @id
  name         String
  description  String
  price        Float
  stocks       Int
  thumbnail    String?
  manufacturer String
  isActive     Boolean     @default(true)
  isFeatured   Boolean     @default(false)
  views        Int         @default(0)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  // Relations
  category     Category    @relation(fields: [categoryId], references: [id])
  seller       User        @relation(fields: [userId], references: [id])
  orderItems   OrderItems[]
  reviews      Reviews[]
}
```

#### Orders

```prisma
model Orders {
  id              String      @id
  userId          String
  totalAmount     Float
  paymentMethod   String
  status          String      @default("PENDING")
  shippingAddress String
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relations
  customer        User        @relation(fields: [userId], references: [id])
  orderItems      OrderItems[]
}
```

#### Reviews

```prisma
model Reviews {
  id         String    @id
  userId     String
  medicineId String
  rating     Int
  comment    String
  createdAt  DateTime  @default(now())

  // Relations
  customer   User      @relation(fields: [userId], references: [id])
  medicine   Medicines @relation(fields: [medicineId], references: [id])
}
```

#### Category

```prisma
model Category {
  id          String      @id
  name        String
  description String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relations
  medicines   Medicines[]
}
```

---

## 🚀 Deployment

### Vercel Deployment

The project includes a `vercel.json` configuration for seamless deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/server.mjs",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/server.mjs"
    }
  ]
}
```

### Deployment Steps

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Set environment variables** in Vercel dashboard

3. **Deploy to Vercel**

   ```bash
   vercel --prod
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

---

## 🧪 Development Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start development server with hot reload |
| `npm run build`      | Build for production (outputs to `api/`) |
| `npm run seed:admin` | Seed admin user to database              |
| `npm test`           | Run tests (placeholder)                  |

---

## ⚠️ Error Handling

The server includes comprehensive error handling for:

### Prisma Errors

- **P2025**: Record not found (404)
- **P2002**: Unique constraint violation (409)
- **P2003**: Foreign key constraint failed (400)
- **Validation errors**: Missing/incorrect fields (400)

### Custom Errors

- **Authentication errors**: Unauthorized (401)
- **Authorization errors**: Forbidden (403)
- **Not found errors**: 404
- **Server errors**: 500

### Error Response Format

```json
{
  "success": false,
  "message": "Error message here",
  "errorDetails": {
    /* Error stack trace in development */
  }
}
```

---

## 📧 Email Service

Email verification uses **Nodemailer** with Gmail SMTP:

- **Verification emails** sent on sign-up
- **Custom HTML templates** with branding
- **Verification URL** includes token for email confirmation
- **Auto sign-in** after successful verification

---

## 📤 File Upload

Medicine thumbnails are uploaded using:

1. **Multer** for multipart form handling (5MB limit)
2. **ImageBB API** for cloud storage
3. **Image validation** (only image files allowed)
4. **Memory storage** for buffer processing

---

## 🔒 Security Features

- ✅ CORS configured for trusted origins
- ✅ JWT session tokens with expiration
- ✅ HTTP-only cookies for authentication
- ✅ Role-based access control (RBAC)
- ✅ Email verification required
- ✅ User status management (ban system)
- ✅ Input validation and sanitization
- ✅ SQL injection protection via Prisma ORM

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Md. Shahariar Hossain Khan**

- GitHub: [imTheRakib](https://github.com/imTheRakib)

---

<div align="center">
  Made with ❤️ for accessible healthcare
</div>
