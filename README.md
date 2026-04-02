# Finance Dashboard Backend

## 📌 Project Overview

This project is a backend system for a finance dashboard where users can manage financial records and access insights based on their roles.

The goal of this project is to design a clean and structured backend that not only supports CRUD operations but also provides meaningful aggregated data for a dashboard view.

---

## 🚀 What This Backend Supports

### 🔐 Authentication & User Management

* User registration and login using JWT
* Secure password storage
* Role-based access control
* User status handling (active/inactive)

---

### 👥 Roles and Permissions

The system supports three roles:

* **Viewer**

  * Can only access dashboard summary data

* **Analyst**

  * Can view financial records
  * Can access dashboard insights

* **Admin**

  * Full control over records and users
  * Can create, update, and delete records

This separation ensures that users only access data relevant to their role.

---

### 💰 Financial Records

Each record contains:

* Amount
* Type (income / expense)
* Category
* Date
* Notes/Description

Supported operations:

* Create record
* View records
* Update record
* Soft delete (records are marked as deleted instead of being removed)

Additional features:

* Pagination support
* Filtering (type, category,date)
* Sorting (e.g., by date)
* searching(notes,category)

---

### 📊 Dashboard Summary

The backend provides aggregated data for dashboard usage:

* Total income
* Total expenses
* Net balance
* Category-wise totals
* Monthly trends
* Recent transactions

Aggregation is handled using MongoDB pipelines for efficiency.

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT for authentication

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-link>
cd FinanceBackend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

### 4. Start the server

```bash
npm run dev
```

---

## 📡 API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

---

### Records

* `POST /api/records` (Admin)
* `GET /api/records` (Admin, Analyst)
* `PATCH /api/records/:id` (Admin)
* `DELETE /api/records/:id` (Admin)

Query support:

* `?page=1&limit=5`
* `?type=expense`
* `?category=food`
* `?sort=-date`
* `?search=food`
* `?startDate=2026-01-01&endDate=2026-03-01`
---

### Dashboard

* `GET /api/dashboard/summary` (All roles)

---

## 🧠 Design Choices

* **Role-based middleware**
  Access control is handled at the middleware level to keep controllers clean and maintain separation of concerns.

* **Soft delete approach**
  Instead of permanently deleting records, they are marked as deleted. This helps maintain data history and prevents accidental loss.

* **Aggregation for analytics**
  Dashboard data is computed using MongoDB aggregation pipelines instead of manual processing in application logic.

* **Bootstrap admin**
  The first registered user is assigned the admin role to initialize the system.

---

## ⚖️ Assumptions

* Each user only accesses their own records
* Categories are not predefined and can be freely used
* Authentication is handled via JWT (no sessions)
* Only admins are allowed to modify data

---

## 🔁 Tradeoffs

* A simple role model was used instead of a complex permission system to keep the implementation clear and focused
* Refresh tokens were not implemented to keep authentication straightforward
* No frontend is included since the focus is backend design
* Admin Assignment Logic:

    - The system assigns the first registered user as an admin by checking if an admin already exists.
    - This approach works well for most scenarios but may lead to a race condition if multiple users register simultaneously.
    - In a production system, this would be handled using database-level constraints (e.g., unique index) or transactions to ensure only one admin is created.

---

## 🧪 Testing the APIs

Basic integration tests have been implemented using Jest and Supertest.

The following API flows are covered:
- Authentication APIs (Register, Login, Invalid Login)
- Records APIs (Create Record, Get Records with pagination, Unauthorized access)

These tests validate:
- API request/response behavior
- Authentication and authorization flow using JWT
- Proper handling of success and failure scenarios

To run tests:
npm test

Note:
Tests are written to cover core functionality and demonstrate understanding of backend testing. Full test coverage can be extended further if required.

---

## 📌 Possible Improvements

* Add search functionality for records
* Implement date range filtering
* Introduce caching for dashboard APIs
* Add unit and integration tests
* Deploy the backend for public access

---

## 👨‍💻 Author

Harshit Grover
