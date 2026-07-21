# DriveMatch - Car Dealership Inventory System

DriveMatch is a modern, full-stack single-page application (SPA) built for a car dealership to manage inventory, track purchases, and provide an elegant shopping experience for customers.

## Features

*   **Role-Based Access Control**: Separate flows for Guests, Customers, and Administrators.
*   **Real-time Inventory**: WebSockets (`socket.io`) push live stock updates to all connected users.
*   **Premium UI/UX**: Designed with a clean, modern aesthetic utilizing Tailwind CSS v4.
*   **Advanced Filtering**: Filter inventory by Make, Category, Price Range, Fuel, and Transmission.
*   **TDD Approach**: Backend business logic heavily covered by Jest unit and integration tests.

## Tech Stack

*   **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io, Jest.
*   **Frontend**: React (Vite), TailwindCSS v4, React Router, Recharts, React Hook Form, Zod.

## Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   MongoDB instance (local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file based on environment requirements (e.g. MONGO_URI, JWT_SECRET, PORT=5000)
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Access the application at `http://localhost:5173`.

## Test Report
The backend enforces a strict TDD (Red-Green-Refactor) pattern.
Run the backend test suite:
```bash
cd backend
npm test
```
*Tests cover auth endpoints, vehicle CRUD operations, advanced query parsing, and purchase transactions.*

## Screenshots
*(Insert screenshots of the DriveMatch Dashboard, Inventory Browsing, and Details view here)*

## My AI Usage

### Tools Used
*   **Antigravity (Google DeepMind)**: Assisted as an autonomous coding agent to plan architecture, write React components, and implement real-time Socket.io logic.

### How I Used Them
*   **Architecture & Boilerplate**: I instructed the AI to scaffold the initial backend endpoints and hook up the test suite to establish a strong TDD workflow.
*   **UI/UX Implementation**: I provided reference images to the AI and asked it to recreate the complex flex layouts, Tailwind styles, and interactive sidebars. 
*   **Debugging**: The AI helped trace middleware configuration errors (e.g. correcting `authorize` to `admin` in route definitions).

### Reflection
Integrating AI into my workflow allowed me to move extremely fast on boilerplate and structural layouts. Instead of spending hours reading through Tailwind utility names or debugging minor syntax errors, I was able to focus on high-level architecture, user flows, and defining precise requirements. The pairing process was seamless; the AI acted as a highly capable junior developer that could instantly prototype ideas, which I could then review and refine.
