# 🏎️ AutoStore — Car Dealership Inventory System

A full-stack modern car marketplace built with TDD methodology

**Node.js • React • MongoDB • Express • Tailwind CSS • Tests**

---

## 📸 Screenshots

*(Replace these placeholders with actual screenshots before deployment)*
- `[Hero Section]`
- `[Category Filter & Advanced Search]`
- `[Vehicle Details & Similar Cars]`
- `[Admin Dashboard - Orders & Test Drives]`

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                    │
│   React 18 · Vite · Tailwind CSS 4 · React Router DOM   │
└────────────────────────┬────────────────────────────────┘
                         │ REST API calls
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   RENDER (Backend)                      │
│   Express 5 · Mongoose · JWT Auth · Multer + Cloudinary │
└────────────────────────┬────────────────────────────────┘
                         │ Mongoose Schema
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   MONGODB (Database)                    │
│                   MongoDB Atlas cluster                 │
└─────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack

### Backend
| Layer | Technology |
| :--- | :--- |
| **Runtime** | Node.js with Express 5 |
| **Database** | MongoDB (Atlas) |
| **ORM** | Mongoose (Strict Schema Validation) |
| **Auth** | JWT (JSON Web Tokens) + bcryptjs |
| **File Upload** | Multer → Cloudinary CDN |
| **Security** | CORS, Zod validation |
| **Testing** | Jest + Supertest + mongodb-memory-server |
| **Real-time** | Socket.io |

### Frontend
| Layer | Technology |
| :--- | :--- |
| **Framework** | React 18 + Vite |
| **Styling** | Tailwind CSS 4 + CSS custom properties |
| **State/Routing** | React Router DOM v6 + Custom React Contexts |
| **Icons** | Lucide React |
| **Forms** | React Hook Form + Zod |
| **Data Viz** | Recharts (Admin Dashboards) |
| **Testing** | Vitest + React Testing Library |

---

## ✨ Features

### Authentication & Authorization
- User registration with full name, email, and password.
- JWT token-based login.
- Role-based access: `user` (customer) and `admin` (dealership manager).
- Admin-only routes protected by both backend middleware and frontend UI guards.

### Vehicle Management
- Full CRUD operations (Admin only for create/update/delete).
- Atomic stock decrement on purchase (prevents overselling).
- Admin restock functionality.
- Vehicle image uploads via Multer → Cloudinary CDN.
- Dynamic "Similar Vehicles" recommendation engine.

### Search & Discovery
- Advanced algorithmic search by Make, Model, Category, and Price Range.
- Interactive category filtering (Sedan, SUV, Hatchback, Coupe, Truck, Van).
- Real-time inventory grid.

### UI/UX
- Premium Digital Showroom built with glassmorphism elements.
- Custom Lightbox for vehicle image viewing.
- Sticky filtering rails and smooth animations.
- Admin CRM dashboards for tracking Test Drives, Orders, and Customers.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- MongoDB (Local instance or MongoDB Atlas cluster)
- Cloudinary account (for image uploads)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/autostore-dealership.git
cd autostore-dealership

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure Environment
Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/car_dealership
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development

# Cloudinary (Optional, for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start Development
```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Default Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@example.com | password123 |
| **User**  | test@example.com  | password123 |

---

## 📚 API Reference

### Authentication
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login, returns JWT |

### Vehicles & Inventory
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/vehicles` | Public | List all vehicles |
| `GET` | `/api/vehicles/search` | Public | Search & filter inventory |
| `GET` | `/api/vehicles/:id` | Public | Get vehicle details |
| `POST` | `/api/vehicles` | Admin | Add a new vehicle |
| `PUT` | `/api/vehicles/:id` | Admin | Update vehicle specs |
| `DELETE` | `/api/vehicles/:id` | Admin | Delete vehicle |
| `POST` | `/api/vehicles/:id/purchase` | User | Purchase (atomic stock −1) |
| `POST` | `/api/vehicles/:id/restock` | Admin | Restock (add quantity) |

### Admin & CRM
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/orders` | Admin | Fetch populated purchase data for analytics |
| `GET` | `/api/users` | Admin | Fetch CRM directory of all registered users |
| `GET` | `/api/test-drives/all` | Admin | Fetch all scheduled system test drives |

---

## 🧪 Test Report

### Backend — Jest (52 tests)
```text
 PASS  tests/integration/auth.test.js
 PASS  tests/integration/vehicles.test.js
 PASS  tests/integration/orders.test.js
 PASS  tests/integration/testDrives.test.js
 PASS  tests/integration/customers.test.js
 PASS  tests/integration/middleware.test.js
 PASS  tests/unit/authService.test.js
 PASS  tests/unit/vehicleService.test.js
 PASS  tests/unit/validateRequest.test.js

 Test Suites: 11 passed, 11 total
 Tests:       52 passed, 52 total
```

### Frontend — Vitest (3 test suites)
```text
 PASS  src/tests/ComparePage.test.jsx
 PASS  src/tests/VehicleDetailsPage.test.jsx
 PASS  src/tests/AdminPanels.test.jsx

 Test Files:  3 passed, 3 total
```
**Total:** Over 55 passing tests across backend and frontend.

---

## 📁 Project Structure

```text
autostore-dealership/
├── backend/
│   ├── src/
│   │   ├── config/              # MongoDB & Cloudinary configs
│   │   ├── controllers/         # Business logic routing handlers
│   │   ├── middleware/          # Auth, roles, error handling
│   │   ├── models/              # Mongoose schemas (Vehicle, User, Order, etc.)
│   │   ├── routes/              # Express REST routes
│   │   ├── app.js               # Express application setup
│   │   └── server.js            # Node HTTP server entrypoint
│   └── tests/                   # 11 integration and unit test suites
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI (Navbar, Sidebar, VehicleCard)
│   │   ├── context/             # AuthContext, ThemeContext
│   │   ├── pages/               # Page views (Dashboard, Details, Admin CRM)
│   │   ├── services/            # Axios API client handlers
│   │   ├── tests/               # Vitest component test suites
│   │   └── App.jsx              # Main routing and layout wrapper
└── README.md                    # This file
```

---

## 📅 Development Journey

This project was built following Test-Driven Development (TDD) with a clear Red-Green-Refactor cycle:

| Phase | What Was Built | Tests |
| :--- | :--- | :--- |
| **Session 1** | Project setup, Mongoose schema, core layout | — |
| **Session 2** | Auth endpoints (register/login) with Zod validation | Auth test suite |
| **Session 3** | Vehicle CRUD endpoints & atomic stock management | Vehicle CRUD & Inventory tests |
| **Session 4** | CRM Backend: Orders, Test Drives, Customer metrics | Admin integration tests |
| **Session 5** | Frontend scaffold, API hooks, and routing | — |
| **Session 6** | Image upload (Multer + Cloudinary) | Media handling |
| **Session 7** | Complex UI: Admin Dashboards, Recharts analytics | UI Component Tests |
| **Session 8** | Similar Vehicles Recommendation Engine | Search test suite |
| **Session 9** | Comprehensive TDD backfilling and QA passes | 55+ tests verified |

---

## 🤖 My AI Usage

### Tool Used
**Antigravity (Google DeepMind)** — AI-powered autonomous coding assistant (primary tool throughout the project)

### How I Used AI
**Architecture & Planning**
- Designed the MongoDB database schemas (User, Vehicle, Purchase, TestDrive).
- Planned the RESTful API endpoint structure and testing configuration.
- Defined the TDD workflow for backend routing and logic validation.

**Backend Development**
- Generated boilerplate for Express routes, error-handling middleware, and JWT verification.
- Debugged and implemented atomic stock decrements and concurrency checks.
- Set up `mongodb-memory-server` for isolated integration testing environments.
- Integrated Multer + Cloudinary for seamless vehicle image uploads.

**Frontend Development**
- Scaffolded the React component architecture using Vite.
- Implemented premium UI elements using Tailwind CSS v4.
- Built interactive features including the Image Lightbox, Similar Vehicles engine, and Admin analytics dashboards.
- Refactored prop-drilling into highly efficient React Contexts.

**Testing**
- Generated comprehensive test suites for 11 backend integration and unit test files using Jest and Supertest.
- Set up Vitest + React Testing Library for verifying complex frontend component rendering.
- Achieved a flawless testing record across the entire stack.

### Reflection
AI was most valuable as an architectural consultant and rapid prototyping engine. The TDD cycle was significantly accelerated—AI could generate comprehensive failing tests based on my requirements, and then write the exact code needed to pass them. Every AI-generated piece of code was reviewed, tested, and refined to ensure pristine quality. The human-AI collaboration felt like true pair programming, where the AI handled the vast breadth of the codebase while I directed the product vision, deep business logic, and UI design decisions.

---
**License**: MIT
