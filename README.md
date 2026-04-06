# Finance Data Processing & Access Control Backend

A production-grade, secure backend system built with **Node.js**, **TypeScript**, and **Prisma**. This project manages financial records with strict **Role-Based Access Control (RBAC)**, data validation, and aggregated analytics.

---

## 🏗 Architecture & Design Decisions

This project follows **Clean Architecture** principles to ensure maintainability and scalability:

- **Controller-Service-Repository Pattern**: Logic is separated from HTTP concerns.
  - `Controllers`: Handle request/response and status codes.
  - `Services`: Contain the "Brain" (Business logic, math, and database queries).
  - `Middleware`: Enforces security (Auth, RBAC) and validation (Zod).
- **Type Safety**: Built 100% with TypeScript for compile-time error checking.
- **Data Persistence**: Uses **SQLite** for a zero-config setup, allowing the evaluator to run the project immediately without external database dependencies.
- **Security**: 
  - Passwords are encrypted using **Bcrypt** (10 salt rounds).
  - Authentication via **JWT** (Access + Refresh token flow).
  - Protection against brute-force via **Rate Limiting**.

---

## 🔐 Access Control Logic (RBAC)

The system enforces permissions through a custom `authorize` middleware. Below is the permission matrix implemented:

| Feature | Endpoint | Viewer | Analyst | Admin |
| :--- | :--- | :---: | :---: | :---: |
| View All Records | `GET /records` | ✅ | ✅ | ✅ |
| Create Records | `POST /records` | ❌ | ✅ | ✅ |
| Update Records | `PATCH /records/:id` | ❌ | ✅ | ✅ |
| View Analytics | `GET /records/analytics` | ❌ | ✅ | ✅ |
| Delete Records | `DELETE /records/:id` | ❌ | ❌ | ✅ |
| Manage Users | `GET/PATCH /users` | ❌ | ❌ | ✅ |

---

## 🚀 Core Features

### 1. User & Role Management
- **Registration & Login**: Secure credential handling.
- **Session Management**: JWT Access tokens (15m) and Refresh tokens (7d).
- **User Status**: Admin can activate/deactivate users via the `/users` endpoint.

### 2. Financial Record Management
- **Full CRUD**: Create, Read, Update, and Soft-Delete records.
- **Soft Delete**: Records are flagged as `isDeleted: true` instead of removed, preserving financial audit trails.
- **Advanced Filtering**: Filter by `type` (Income/Expense), `category`, and `date` range.
- **Pagination**: Supports `page` and `limit` parameters for optimized data fetching.

### 3. Dashboard Analytics API
- **Aggregated Summaries**: Real-time calculation of Total Income, Total Expenses, and Net Balance.
- **Category Breakdown**: Grouped totals per category (e.g., Salary, Rent, Food).
- **Recent Activity**: Returns the latest transactions for the dashboard view.

---

## 🛠 Tech Stack
- **Runtime**: Node.js v18+
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: SQLite
- **Validation**: Zod
- **Auth**: JSON Web Tokens (JWT) & Bcrypt

---

## ⚙️ Setup & Installation

### 1. Install Dependencies
```bash
npm install

```
## 2. Environment Configuration

Create a `.env` file (refer to `.env.example`):

```env
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET="developmentseret123"
JWT_REFRESH_SECRET="developmentrefresh456"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
NODE_ENV=development
```

## 3. Database Initialization

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create the database file
npx prisma migrate dev --name init

# Seed the database with sample Admin and Transactions
npx prisma db seed
```
## 🧪 Testing the API

### 1. Health Check
Open http://localhost:3000/ in your browser. You should see:

```json
{"status":"ok", "message":"Finance API is running"}
```

### 2. Manual Test (PowerShell)

To register a new Admin user:

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/v1/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"admin@test.com", "password":"password123", "name":"Admin User", "role":"ADMIN"}'
```

### 3. Data Visualization

To view the database contents visually, run:

```bash
npx prisma studio
```

## 📄 API Documentation

### Auth
- `POST /api/v1/auth/register` - Create new user  
- `POST /api/v1/auth/login` - Authenticate and receive tokens  
- `POST /api/v1/auth/refresh` - Rotate access tokens  

### Records
- `GET /api/v1/records` - List records (supports `?page=1&limit=10&type=INCOME`)  
- `POST /api/v1/records` - Create entry (Analyst/Admin only)  
- `GET /api/v1/records/analytics` - Summary for dashboard  
- `PATCH /api/v1/records/:id` - Update entry  
- `DELETE /api/v1/records/:id` - Soft delete entry (Admin only)  

### Users (Admin Only)
- `GET /api/v1/users` - List all users  
- `PATCH /api/v1/users/:id` - Change role or toggle `isActive` status  

---
