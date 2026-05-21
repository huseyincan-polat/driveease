<div align="center">

# 🚗 DriveEase — Car Rental Management System

> **Course:** System Analysis and Design — Spring 2026  
> **Student:** Hüseyin Can Polat — 220303047

![Node.js](https://img.shields.io/badge/Node.js-Express-236143?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-2356A4?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-B4772A?style=for-the-badge&logo=javascript&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-Tests-B73B3B?style=for-the-badge&logo=jest&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-API%20Docs-2385C5?style=for-the-badge&logo=swagger&logoColor=white)

</div>

---

## 📌 What Was Asked of Me?

This project was built for the System Analysis and Design course. The requirements were:

- ✅ Build a **full-stack web application** with CRUD operations
- ✅ Use **Node.js + Express** for the backend
- ✅ Use **Vanilla JavaScript** on the frontend (no React, no Vue!)
- ✅ Connect to a **real database** (MySQL)
- ✅ Design a proper **REST API** with correct HTTP methods and status codes
- ✅ Separate **business logic** from routes (so it can be unit tested)
- ✅ Write **unit tests** with Jest
- ✅ Document the API with **Swagger UI**
- ✅ Write a **README.md** explaining how to set up and run the project
- ✅ Use **Git & GitHub** throughout development

---

## 🎯 What Did I Build?

**DriveEase** is a car rental management platform with two user roles:

| Role | What they can do |
|------|-----------------|
| 👤 Customer | Browse cars, filter by category/branch/fuel, rent a car, view rental history |
| 🛠️ Admin | Add / update / delete cars, view all rentals, track total revenue |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla JavaScript, HTML, CSS |
| Backend | Node.js + Express.js |
| Database | MySQL |
| Authentication | JWT (JSON Web Tokens) |
| API Documentation | Swagger / OpenAPI 3.0 |
| Testing | Jest |

---

## 📁 Project Structure

```
systemanalysis/
├── backend/
│   ├── config/
│   │   └── db.js                  # MySQL connection
│   ├── controllers/               # Handle HTTP requests
│   │   ├── authController.js
│   │   ├── carController.js
│   │   ├── categoryController.js
│   │   ├── branchController.js
│   │   ├── rentalController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js                # JWT verification
│   ├── routes/                    # API route definitions
│   │   ├── authRoutes.js
│   │   ├── carRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── branchRoutes.js
│   │   ├── rentalRoutes.js
│   │   └── userRoutes.js
│   ├── services/                  # Business logic (not in routes!)
│   │   ├── carService.js
│   │   ├── rentalService.js
│   │   └── userService.js
│   └── tests/
│       ├── carService.test.js
│       └── userAndRentalService.test.js
├── frontend/
│   └── index.html                 # Single-page application (SPA)
├── app.js                         # Entry point
├── swagger.js
├── package.json
└── README.md
```

> 💡 **Why is business logic in `/services`?**  
> The course required that business logic NOT live inside routes.  
> Keeping it in services makes it independently testable with Jest —  
> routes just handle HTTP, services handle the actual logic.

---

## 🚀 Getting Started

### 1. Install Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MySQL](https://www.mysql.com/) v8 or higher
- Git

### 2. Clone the Repository

```bash
git clone https://github.com/huseyincan-polat/driveease.git
cd driveease
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create the `.env` File

Create a file named `.env` in the root folder and paste:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=car_rental_db
JWT_SECRET=supersecretkey
PORT=3000
```

> ⚠️ Replace `your_mysql_password` with your actual MySQL password!

### 5. Set Up the Database

Open MySQL Workbench and run:

```sql
CREATE DATABASE car_rental_db;
USE car_rental_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255)
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    fuel_type VARCHAR(50),
    transmission_type VARCHAR(20) DEFAULT 'Automatic',
    km INT DEFAULT 0,
    price_per_day DECIMAL(10,2) NOT NULL,
    status ENUM('available', 'rented') DEFAULT 'available',
    category_id INT,
    branch_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

CREATE TABLE rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    customer_id INT NOT NULL,
    pickup_branch_id INT NOT NULL,
    return_branch_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('active','completed','cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (pickup_branch_id) REFERENCES branches(id),
    FOREIGN KEY (return_branch_id) REFERENCES branches(id)
);
```

### 6. Create an Admin Account

Register through the app first, then run:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### 7. Start the Server

```bash
node app.js
```

Open your browser → **http://localhost:3000** 🎉

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `node app.js` | Start the server |
| `npm test` | Run Jest unit tests |

---

## 📖 API Documentation

Interactive Swagger UI → **http://localhost:3000/api-docs**

Click **Authorize** and paste your JWT token to test protected routes.

### Full Endpoint List

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Create a new account | Public |
| POST | /api/auth/login | Login and receive JWT | Public |
| GET | /api/cars | List all cars (with filters) | Public |
| POST | /api/cars | Add a new car | Admin |
| GET | /api/cars/:id | Get a single car | Public |
| PUT | /api/cars/:id | Update a car | Admin |
| DELETE | /api/cars/:id | Delete a car | Admin |
| GET | /api/categories | List categories | Public |
| POST | /api/categories | Add a category | Admin |
| GET | /api/branches | List branches | Public |
| GET | /api/rentals | View rentals | Authenticated |
| POST | /api/rentals | Rent a car | Authenticated |
| PATCH | /api/rentals/:id/complete | Mark rental complete | Admin |
| PATCH | /api/rentals/:id/cancel | Cancel a rental | Authenticated |

---

## 🧪 Running Tests

```bash
npm test
```

Tests use **Jest** and only test the **service layer** — not the routes.  
This follows the course requirement: business logic must be separately testable.

```
✅ carService — validateCar()          → 13 tests
✅ userService — Password Validation   → 1 test
✅ rentalService — Component Integration → 1 test
```

---

## ✅ Requirements Checklist

| Requirement | Status |
|-------------|--------|
| CRUD operations | ✅ Create, Read, Update, Delete on cars & rentals |
| REST API with proper HTTP methods | ✅ GET, POST, PUT, DELETE, PATCH |
| Vanilla JS frontend (no frameworks) | ✅ Pure HTML + JS SPA |
| Business logic separated from routes | ✅ `/services` layer |
| Input validation (frontend + backend) | ✅ Both layers |
| Unit tests | ✅ Jest, 15 tests |
| Swagger documentation | ✅ `/api-docs` |
| README | ✅ This file |
| Git & GitHub | ✅ [huseyincan-polat/driveease](https://github.com/huseyincan-polat/driveease) |
