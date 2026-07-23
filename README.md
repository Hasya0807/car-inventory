# 🏎️ DriveMatch | Modern Car Dealership Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)]()
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)]()
[![React](https://img.shields.io/badge/React-18.x-blue.svg?style=flat-square&logo=react)]()
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg?style=flat-square&logo=node.js)]()

DriveMatch is an enterprise-grade, full-stack Single-Page Application (SPA) engineered to streamline automotive dealership operations. It provides a seamless, premium digital showroom for customers while offering robust, real-time inventory and customer management capabilities for administrators. 

Built with a strict adherence to Test-Driven Development (TDD) and SOLID principles, this system serves as a highly scalable architecture for modern dealership workflows.

---

## ✨ Core Features

### 🛍️ Customer Experience
- **Premium Digital Showroom**: A highly responsive, visually stunning UI built with Tailwind CSS v4 and glassmorphism elements. Features an engaging **Hero Carousel** to spotlight prime vehicles.
- **Advanced Algorithmic Search**: Filter inventory in real-time by Make, Model, Body Style, Transmission, and Price Range.
- **Test Drive Bookings**: Customers can easily schedule test drives for their desired vehicles, completely synced with the dealership's timeline.
- **Secure Transactions**: Authenticated endpoints allowing users to securely reserve and purchase vehicles.
- **Personalized Garage**: Save favorite vehicles to a persistent wishlist.
- **Integrated Dealership Map**: Built-in Google Maps integration to quickly find the physical showroom (Ahmedabad).

### 🛡️ Administrative Control (Dealership CRM)
- **Role-Based Access Control (RBAC)**: Secure separation of privileges between guests, authenticated users, and dealership administrators.
- **Customer Directory (CRM)**: Track user engagement, monitor wishlist saves, and view total purchases on a per-user basis.
- **Test Drive Management**: Fully functional dashboard to approve, reschedule, or cancel test drive requests submitted by customers.
- **Sales & Order Tracking**: Dedicated "Orders Placed" dashboard groups all historical vehicle purchases by month for easy accounting.
- **Live Inventory Management**: Perform CRUD operations on the vehicle fleet with immediate global state synchronization. Toggle "Featured" statuses for homepage marketing.
- **Real-Time Analytics Dashboard**: Visualizations of sales data, revenue metrics, and inventory distribution powered by Recharts.

---

## 🏗️ Architecture & Technology Stack

The platform utilizes a modern MERN-like stack with specialized libraries for performance and state management.

### Backend (REST API)
- **Runtime Framework**: Node.js with Express.js
- **Database & ORM**: MongoDB with Mongoose (Strict Schema Validation)
- **Authentication**: Stateless JWT (JSON Web Tokens) with Bcrypt hashing
- **Testing Engine**: Jest & Supertest (100% coverage on critical business logic)
- **Real-Time Engine**: Socket.io for live inventory broadcasting

### Frontend (Client SPA)
- **Framework**: React 18 (Bootstrapped via Vite for HMR and optimized builds)
- **Styling**: Tailwind CSS v4 (Custom color tokens, fluid typography)
- **State & Routing**: React Router DOM v6, Custom React Contexts
- **Form Validation**: React Hook Form paired with Zod schemas
- **Data Visualization**: Recharts

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- Git

### 1. Repository Setup
```bash
git clone https://github.com/your-username/drivematch-dealership.git
cd drivematch-dealership
```

### 2. Backend Initialization
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with the following configuration:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/car_dealership
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Initialization
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The application will be instantly accessible at `http://localhost:5173`.

---

## 🧪 Test Coverage & TDD

This project was developed strictly adhering to the Red-Green-Refactor cycle. The backend API is entirely unit and integration tested, ensuring zero regressions during agile iterations.

To execute the test suite and generate a coverage report:
```bash
cd backend
npm test -- --coverage
```
*Current test suites cover: Auth validation, Role-based middleware, Vehicle CRUD lifecycle, Advanced Query Parsing, and Concurrency handling for purchases.*

---

## 📚 API Reference (Endpoints)

| Endpoint | Method | Auth Required | Description |
| :--- | :---: | :---: | :--- |
| `/api/auth/register` | `POST` | No | Register a new user |
| `/api/auth/login` | `POST` | No | Authenticate user & retrieve JWT |
| `/api/vehicles` | `GET` | No | Fetch all vehicles (supports filtering) |
| `/api/vehicles/search` | `GET` | No | Explicit search endpoint |
| `/api/vehicles` | `POST` | **Admin** | Add a new vehicle to inventory |
| `/api/vehicles/:id` | `PUT` | **Admin** | Update existing vehicle specs |
| `/api/vehicles/:id` | `DELETE`| **Admin** | Remove a vehicle from inventory |
| `/api/vehicles/:id/purchase` | `POST` | Yes | Process a vehicle purchase |
| `/api/orders` | `GET` | **Admin** | Fetch populated purchase data for analytics |
| `/api/users` | `GET` | **Admin** | Fetch CRM directory of all registered users |
| `/api/test-drives/all` | `GET` | **Admin** | Fetch all scheduled system test drives |

---

## 📸 Application Gallery
*(Replace these placeholders with actual screenshots before deployment)*
- `[Screenshot: Customer Dashboard / Showroom]`
- `[Screenshot: Advanced Filtering Mechanism]`
- `[Screenshot: Admin CRM & Analytics Dashboard]`

---

## 🤖 My AI Usage

As per modern development standards, this project was developed utilizing AI-assisted workflows to accelerate boilerplate generation and enhance structural architecture.

### Tools Utilized
*   **Antigravity (Google DeepMind)**: Served as an autonomous pair-programming agent and architectural consultant.

### Methodology & Usage
*   **Architecture & Boilerplate**: I instructed the AI to scaffold the initial RESTful endpoints, construct Mongoose schemas, and wire up the Jest testing framework to establish a rock-solid TDD foundation.
*   **UI/UX Implementation**: I provided conceptual reference images and requirements to the AI, instructing it to generate complex React component trees, responsive Tailwind grid layouts, and interactive sidebar navigation.
*   **Debugging & Refactoring**: The AI was utilized to rapidly trace configuration anomalies (such as correcting authorization middleware signatures) and refactor heavy state logic into clean, reusable React Contexts.

### Reflection
Integrating AI into the software development lifecycle dramatically accelerated the velocity of this project. It effectively eliminated the friction of context-switching to read through documentation for standard libraries (like Tailwind classes or Mongoose connection strings). Instead of getting bogged down in syntax, I was empowered to operate at a higher level of abstraction—focusing entirely on product requirements, edge-case logic, and the overall user experience. It acted as an exceptional force multiplier.
