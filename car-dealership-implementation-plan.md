# Implementation Plan: Car Dealership Inventory System
**Stack:** Node.js + Express + MongoDB (backend) · React + Tailwind (frontend)
**Purpose of this document:** hand this to Antigravity (or any agentic coding tool) as the execution spec. It is written so an agent can work phase-by-phase, committing real TDD history as it goes, without losing the thread of *why* each piece exists.

---

## 0. Guiding Principles for the Agent

Before writing any code, the agent should internalize these constraints — they are graded, not optional:

1. **Tests come first, always.** For every unit of backend logic: write a failing test → write the minimum code to pass it → refactor. Commit at each stage where it makes sense (not necessarily all three, but the *history* should show this rhythm across the project, not one giant "add feature" commit).
2. **Every AI-assisted commit gets a co-author trailer.** No exceptions. Track this from commit #1.
3. **Log every prompt used**, verbatim, into `PROMPTS.md` as you go — not reconstructed at the end from memory.
4. **Commit messages narrate the journey.** They should read like a story of decisions, not just "fix bug" or "add feature."
5. **Small, frequent commits** beat large ones. Aim for granularity an interviewer can actually read through.

---

## 1. Repository Structure

Use a monorepo with two clearly separated apps — this is the cleanest structure for a solo full-stack kata and makes the README setup instructions trivial.

```
car-dealership-inventory/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Vehicle.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── vehicleController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── vehicleRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js      # verifies JWT
│   │   │   ├── roleMiddleware.js      # admin-only guard
│   │   │   ├── errorMiddleware.js     # centralized error handler
│   │   │   └── validateRequest.js     # Zod/Joi schema validation
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── vehicleService.js      # business logic, kept out of controllers
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   └── generateToken.js
│   │   ├── app.js                     # express app, no .listen() — needed for supertest
│   │   └── server.js                  # imports app, calls .listen()
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── vehicleService.test.js
│   │   │   └── authService.test.js
│   │   ├── integration/
│   │   │   ├── auth.test.js
│   │   │   └── vehicles.test.js
│   │   └── setup/
│   │       └── testDb.js              # mongodb-memory-server bootstrap
│   ├── .env.example
│   ├── package.json
│   └── jest.config.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/ (Navbar, ProtectedRoute, AdminRoute)
│   │   │   ├── vehicles/ (VehicleCard, VehicleForm, VehicleList, SearchFilterBar)
│   │   │   └── ui/ (Button, Input, Modal, Toast) — small reusable primitives
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js                 # axios instance with interceptors
│   │   ├── hooks/
│   │   │   └── useVehicles.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tests/                         # React Testing Library + Vitest
│   ├── tailwind.config.js
│   └── package.json
│
├── .github/workflows/ci.yml           # optional but a strong differentiator
├── README.md
├── PROMPTS.md
└── .gitignore
```

**Why this structure impresses:** separation of controllers/services/models is a textbook SOLID move (Single Responsibility) — controllers only handle req/res, services hold business logic and are what you unit test in isolation, models are pure schema. It also makes the "which layer do I test" question trivial to answer in an interview.

---

## 2. Data Models

### User
```js
{
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,          // bcrypt hashed, never returned in queries (select: false)
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: Date
}
```

### Vehicle
```js
{
  make: { type: String, required: true },
  model: { type: String, required: true },
  category: { type: String, enum: ['Sedan','SUV','Truck','Coupe','Hatchback','Van'], required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0, default: 0 },
  year: Number,
  imageUrl: String,
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: Date,
  updatedAt: Date
}
```

Add a compound text index on `make` + `model` for the search endpoint, and standard indexes on `category` and `price` since those are filterable.

---

## 3. Backend API Contract

Auth (public):
- `POST /api/auth/register` → `{ name, email, password }` → 201 + user (no password) + token
- `POST /api/auth/login` → `{ email, password }` → 200 + token

Vehicles (JWT required on all):
- `GET /api/vehicles` → paginated list (`?page=1&limit=10`), only vehicles with quantity ≥ 0 shown, sortable by price
- `GET /api/vehicles/search?make=&model=&category=&minPrice=&maxPrice=` → filtered list
- `GET /api/vehicles/:id` → single vehicle detail (useful for a detail page/modal — small addition, easy win)
- `POST /api/vehicles` → admin only → create
- `PUT /api/vehicles/:id` → admin only → update
- `DELETE /api/vehicles/:id` → admin only → delete

Inventory (JWT required):
- `POST /api/vehicles/:id/purchase` → `{ quantity: 1 }` → decrements stock; reject if `quantity` requested > stock (409 Conflict); reject if result would go below 0
- `POST /api/vehicles/:id/restock` → admin only → `{ quantity }` → increments stock

**Standard error shape** (used everywhere, and worth testing explicitly):
```json
{ "success": false, "message": "Vehicle not found", "statusCode": 404 }
```

**Standard success shape:**
```json
{ "success": true, "data": { ... } }
```

Consistency here is a small thing that reads as senior-level care.

---

## 4. Backend Build Order (TDD phase-by-phase)

Work in this order — each phase is a natural commit cluster.

**Phase 1 — Project skeleton**
- Init express app, connect to MongoDB (Atlas or local), health-check route `GET /api/health`.
- One trivial supertest confirming the server boots and responds. Commit: `chore: bootstrap express app with health check`.

**Phase 2 — Auth (test-first)**
- Write `authService.test.js`: hashing a password produces a different string than the input; a wrong password fails comparison.
- Write `auth.test.js` (integration): register returns 201 + token; duplicate email returns 409; login with wrong password returns 401; login with valid creds returns 200 + token containing the user id/role in payload.
- Implement `authService.js`, `authController.js`, `authRoutes.js`, `generateToken.js` to satisfy the tests.
- Refactor: extract password hashing into a Mongoose pre-save hook so it can never be forgotten at the call site.

**Phase 3 — Auth middleware**
- Test: request without token → 401. Request with malformed/expired token → 401. Request with valid token → attaches `req.user` and calls next().
- Test role middleware separately: non-admin hitting an admin-only route → 403.
- Implement middleware to pass.

**Phase 4 — Vehicle CRUD (test-first)**
- Unit tests on `vehicleService.js`: createVehicle validates required fields; updateVehicle throws `ApiError(404)` for unknown id; deleteVehicle removes the doc.
- Integration tests on the routes: full CRUD happy paths + the 401/403 boundary (regular user cannot POST/PUT/DELETE).
- Implement to pass, then refactor duplicated "find or 404" logic into a shared helper.

**Phase 5 — Search & pagination**
- Tests: search by make returns only matching docs (case-insensitive); price range filter excludes out-of-range docs; pagination returns correct `page`/`totalPages`/`totalCount` metadata.
- Implement using Mongoose query building — keep the query-building logic in the service layer so it's unit-testable without hitting the DB for every branch (test the query-object construction directly, then a smaller number of integration tests for the actual DB behavior).

**Phase 6 — Purchase / Restock (the interesting business logic — spend real TDD effort here)**
- Tests: purchasing more than available stock → 409, stock unchanged. Purchasing exactly the remaining stock → succeeds, stock becomes 0. Purchase button logic depends on this being airtight, so test the boundary conditions explicitly (0, 1, exact match, overflow).
- Restock: only admin; increases quantity; rejects negative quantity.
- Consider using a MongoDB transaction or `findOneAndUpdate` with a conditional filter (`{ quantity: { $gte: requestedQty } }`) to avoid race conditions on concurrent purchases — this is a genuine differentiator if you mention it in the README ("used atomic conditional updates to prevent overselling under concurrent requests").

**Phase 7 — Validation & error handling middleware**
- Add Zod or Joi schemas for every request body; test that malformed payloads return 400 with a clear message before ever touching the service layer.
- Centralized error middleware: test that thrown `ApiError` instances produce the correct status/message, and that unexpected errors don't leak stack traces in production mode.

**Phase 8 — Coverage pass**
- Run `jest --coverage`, identify untested branches (especially error paths), backfill tests. Target 90%+ on services/controllers — this is the number you'll screenshot into the README's test report.

---

## 5. Testing Setup Details

- **Test runner:** Jest. **HTTP assertions:** Supertest against the exported `app` (never `server.listen()` in tests).
- **Database:** `mongodb-memory-server` — spins up a real in-memory MongoDB instance per test run so integration tests hit real Mongoose behavior without touching your actual Atlas cluster or needing Docker. Bootstrap it in `tests/setup/testDb.js` and reference it in `jest.config.js` via `globalSetup`/`globalTeardown` or `beforeAll`/`afterAll` in a shared setup file.
- **Unit vs integration split:** unit tests mock Mongoose models (or use the in-memory DB but isolate a single function); integration tests exercise full request → middleware → controller → service → DB → response chains.
- **Coverage tool:** Jest's built-in `--coverage` (Istanbul under the hood). Export the summary table into the README as your "test report," and optionally save a coverage badge or the raw `coverage/lcov-report/index.html` screenshot.

---

## 6. Frontend Build Plan

**Setup:** Vite + React + Tailwind (Vite is faster to bootstrap than CRA and is the current standard; mention this choice explicitly in the README as a deliberate decision, not a default).

**State/data flow:**
- `AuthContext` holds `user`, `token`, `login()`, `logout()`, `register()`; persist token in memory + localStorage; attach it to axios via a request interceptor.
- `useVehicles` hook centralizes fetch/search/pagination state so `DashboardPage` stays thin.
- Keep server state (vehicles) separate from UI state (search filters, form state) — don't conflate them in one giant context.

**Pages:**
- `LoginPage` / `RegisterPage` — simple forms, inline validation, error toast on failure.
- `DashboardPage` — grid of `VehicleCard`s, `SearchFilterBar` at top (make/model/category dropdown/price range slider), pagination controls at bottom. Purchase button on each card, disabled + grayed when `quantity === 0`, with a quantity stepper if quantity > 1.
- `AdminPage` — table view of all vehicles with inline edit/delete, plus an "Add Vehicle" form/modal. Only reachable via an `AdminRoute` guard that checks `user.role === 'admin'` and redirects otherwise.

**Design differentiators worth the extra hour:**
- Skeleton loading states instead of spinners.
- Empty state illustration/message when search returns nothing.
- Optimistic UI update on purchase (decrement locally, roll back on error) — small but reads as thoughtful.
- Responsive grid: 1 column mobile → 2 tablet → 3–4 desktop.
- Toast notifications for success/error instead of `alert()`.

**Frontend tests (optional but a strong differentiator given the brief emphasizes testing):** Vitest + React Testing Library for at least: `VehicleCard` disables purchase button at zero quantity, `SearchFilterBar` calls its filter callback with correct params, `AdminRoute` redirects non-admins.

---

## 7. Git Workflow & AI Co-authorship

Commit early, commit often, and follow the red-green-refactor rhythm visibly. Example real commit sequence for one feature:

```
test: add failing tests for vehicle purchase quantity validation
feat: implement purchase endpoint to satisfy quantity validation tests
refactor: extract stock-check logic into vehicleService.canFulfill()
```

Any commit where AI materially contributed (boilerplate, test scaffolding, debugging help, refactor suggestions) gets the trailer:

```
feat: implement JWT auth middleware

Used an AI assistant to scaffold the middleware structure and
suggest edge cases for expired/malformed tokens, then wrote the
actual verification logic and tests manually.

Co-authored-by: Claude <noreply@anthropic.com>
```

Keep this honest and specific — vague trailers ("AI helped with everything") read worse than precise ones. Log the corresponding prompt in `PROMPTS.md` in the same commit or the one right after.

---

## 8. PROMPTS.md Format

Keep it chronological, one entry per meaningful AI interaction:

```markdown
## [Phase 2 - Auth Service]
**Prompt:** "Write Jest unit tests for a bcrypt-based password hashing
service, covering hash-differs-from-plaintext and compare-rejects-wrong-password cases."
**Tool:** Claude
**Outcome:** Used as a starting point for authService.test.js, edited
assertions to match actual return shape.
```

Do this live as you go — reconstructing it at the end is both more work and less credible.

---

## 9. README.md Structure

1. Project overview + screenshot(s)
2. Tech stack table with the *why* for non-obvious choices (Vite over CRA, mongodb-memory-server for tests, atomic conditional updates for purchase safety)
3. Setup instructions — backend (`.env` variables, `npm install`, `npm run dev`, `npm test`), frontend (same)
4. API reference (can be a table or link to a Postman/Swagger collection if you add one — nice optional differentiator)
5. Test report (coverage summary + screenshot)
6. **My AI Usage** — tools used, how, and an honest reflection (what it sped up, where you overrode or rejected its suggestions — this is the part interviewers actually read closely; a reflection that includes at least one place you *disagreed* with the AI's suggestion reads as far more credible than uniform praise)
7. Known limitations / what you'd add with more time
8. Live deployment link (if done)

---

## 10. Deployment (optional brownie points)

- **Database:** MongoDB Atlas free tier.
- **Backend:** Render or Railway (both have simple Node.js deploys with env var UI).
- **Frontend:** Vercel or Netlify, pointed at the deployed backend URL via an env var (`VITE_API_URL`).
- **CI (strong differentiator):** a GitHub Actions workflow that runs `npm test` on every push — screenshot the green check into the README.

---

## 11. Suggested Timeline

| Phase | Focus | Est. time |
|---|---|---|
| 1 | Skeleton + health check | 1–2 hrs |
| 2–3 | Auth + middleware (TDD) | 4–6 hrs |
| 4–6 | Vehicle CRUD + search + purchase logic (TDD) | 8–10 hrs |
| 7–8 | Validation, error handling, coverage backfill | 3–4 hrs |
| Frontend | Pages, components, integration | 8–10 hrs |
| Polish | README, PROMPTS.md, screenshots, deploy | 3–4 hrs |

---

## 12. Final Checklist Against the Brief

- [ ] JWT auth with register/login
- [ ] All 8 vehicle/inventory endpoints, admin-gated where specified
- [ ] Real database (MongoDB), not in-memory for the actual app
- [ ] Visible red-green-refactor commit history
- [ ] AI co-author trailers on every AI-assisted commit
- [ ] `PROMPTS.md` with real, chronological prompt history
- [ ] README with setup instructions, screenshots, test report, "My AI Usage" section
- [ ] React + Tailwind SPA with disabled purchase button at zero stock, admin CRUD UI, search/filter
- [ ] (Stretch) Live deployment link
- [ ] (Stretch) CI pipeline
