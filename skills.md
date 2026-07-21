# Skills Required — Car Dealership Inventory System

A map of every skill this project actually exercises, grouped by area, with reference repos worth skimming for patterns (not copying — the brief explicitly forbids that, and Antigravity/you should treat these as "how do experienced devs structure this," never as source to paste).

---

## 1. Backend — API & Architecture

- **Express fundamentals:** routing, middleware chaining, `Router()` modularization, `app.js`/`server.js` separation (the latter is what makes supertest possible without a real port).
- **RESTful API design:** resource-based URLs, correct HTTP verbs/status codes, consistent request/response envelopes.
- **Layered architecture (controller → service → model):** keeping business logic out of controllers is the single biggest "this person knows what they're doing" signal in a kata like this.
- **MongoDB/Mongoose schema design:** validation at the schema level, indexes for search fields, `ref`/`populate` for the `createdBy` relationship, `select: false` on password fields.
- **JWT authentication:** signing/verifying tokens, `bcrypt` password hashing, refresh-token awareness (even if you only implement access tokens, knowing the tradeoff matters in the interview).
- **Role-based access control (RBAC):** admin-only middleware guards.
- **Input validation:** schema validation (Zod or Joi) at the API boundary, before anything touches a service.
- **Centralized error handling:** a custom `ApiError` class + Express error-handling middleware, so every failure mode returns a consistent shape.
- **Concurrency-safe writes:** atomic conditional updates (`findOneAndUpdate` with a quantity guard) to prevent overselling — this is a small detail that reads as senior-level thinking.

**Reference repos:**
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) — the most-starred Node.js best-practices list on GitHub; sections on project structure, error handling, and security are directly relevant.
- [bradtraversy/mern-auth](https://github.com/bradtraversy/mern-auth) — clean, widely-referenced MERN JWT auth pattern from a well-known instructor.
- [nbagonoc/mern-multiple-user](https://github.com/nbagonoc/mern-multiple-user) — MERN boilerplate specifically demonstrating multiple user roles.

---

## 2. Testing & TDD

- **Red-Green-Refactor discipline:** writing a failing test, the minimal code to pass it, then refactoring — and having your git history actually show this rhythm.
- **Jest:** test structure (`describe`/`it`), mocking, `beforeEach`/`afterEach` lifecycle hooks.
- **Supertest:** exercising Express routes end-to-end without a running server.
- **mongodb-memory-server:** spinning up a real, ephemeral MongoDB instance per test run so integration tests hit real Mongoose behavior — this is the standard way to test a Mongo-backed API without touching production data or needing Docker.
- **Unit vs. integration test separation:** knowing what belongs at which layer (service logic unit-tested in isolation vs. full request-cycle integration tests).
- **Coverage tooling:** reading and acting on Istanbul/Jest coverage reports, not just chasing a percentage.

**Reference repos:**
- [goldbergyoni/javascript-testing-best-practices](https://github.com/goldbergyoni/javascript-testing-best-practices) — the canonical, exhaustive guide to JS/Node testing patterns; worth skimming the "Backend" section specifically.
- [TomDoesTech/Testing-Express-REST-API](https://github.com/TomDoesTech/Testing-Express-REST-API) — small, focused example of testing an Express REST API end-to-end with Supertest + mongodb-memory-server, including mocking services and controller-to-service testing.
- [jpedroschmitz/jest-mongodb](https://github.com/jpedroschmitz/jest-mongodb) — minimal example wiring Jest + mongodb-memory-server together.
- [shelfio/jest-mongodb](https://github.com/shelfio/jest-mongodb) — a maintained Jest preset for MongoDB in-memory testing if you want a drop-in config instead of hand-rolling setup/teardown.
- [pshaddel/NodeJS-Express-Integration-Test](https://github.com/pshaddel/NodeJS-Express-Integration-Test) — a very small, readable walkthrough of the exact integration-test pattern (global setup exporting a Mongo URI) you'll use here.

---

## 3. Frontend — React & UI

- **React fundamentals:** function components, hooks (`useState`, `useEffect`, `useContext`, `useMemo` for derived filter state).
- **React Router:** protected routes (auth-gated), role-gated admin routes.
- **Context API for auth state:** token storage, request interceptor pattern (attaching the JWT to every axios call).
- **Tailwind CSS:** utility-first styling, responsive grid layouts, building a consistent design system without a component library.
- **Form handling & validation:** controlled inputs, inline error display, disabled-state logic tied to server data (the zero-stock purchase button).
- **UX states that read as "thought about it":** loading skeletons, empty states, optimistic updates with rollback, toast notifications instead of `alert()`.
- **React Testing Library (optional but strong):** testing component behavior (e.g., "purchase button disables at zero quantity") rather than implementation detail.

**Reference repos:**
- [idrisibrahimerten/react-tailwind-ecommerce-website-project](https://github.com/idrisibrahimerten/react-tailwind-ecommerce-website-project) — React + Tailwind product listing/filtering/detail-page structure, close to what the dashboard needs.
- [silviajcn/Ecommerce-tailwind](https://github.com/silviajcn/Ecommerce-tailwind) — React + Vite + Tailwind app with product filtering, purchase flow, and purchase history — structurally close to the purchase/restock feature here.

---

## 4. Tooling, Process & Delivery

- **Git discipline:** small, narratively-ordered commits; writing commit messages that explain *why*, not just *what*.
- **AI co-authorship & transparent AI usage documentation:** this is graded explicitly in the brief — treat it as a skill, not paperwork. Being precise and honest (including moments you overrode an AI suggestion) is what separates a credible AI-usage section from a boilerplate one.
- **Environment configuration:** `.env`/`.env.example` conventions, keeping secrets out of git.
- **CI (optional differentiator):** a GitHub Actions workflow running the test suite on push.
- **API documentation:** a Postman collection or OpenAPI/Swagger spec (`swagger-jsdoc` + `swagger-ui-express`) — small effort, strong signal.
- **Deployment:** MongoDB Atlas + Render/Railway (backend) + Vercel/Netlify (frontend), including environment-variable wiring between them.
- **Technical writing:** a README that a stranger could actually set the project up from — this is graded and is also, not coincidentally, a real job skill.

**Reference repos:**
- [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices) (again) — also covers production/CI/config sections, not just code structure.

---

## 5. How to Use This List

Don't try to demonstrate every item equally — the purchase/restock concurrency handling and the TDD commit history are the two things most likely to get specifically discussed in the interview, so they're worth the most deliberate care. Everything else on this list should be *present and correct*, but those two are where "correct" and "impressive" diverge.
