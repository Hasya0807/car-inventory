# AI Tooling Chat History

## [Phase 1 - Project skeleton]
**Prompt:** "Start with Phase 1 of the implementation plan."
**Tool:** Gemini 3.1 Pro
**Outcome:** Initialized git repository, created `.gitignore`, `PROMPTS.md`, and task tracking file. Moving to backend setup.

## [Phase 2 - Auth API]
**Prompt:** "Implement authService.js, authController.js, authRoutes.js, generateToken.js to satisfy the tests. Refactor: extract password hashing into a Mongoose pre-save hook so it can never be forgotten at the call site."
**Tool:** Gemini 3.1 Pro
**Outcome:** Created models, routes, controllers, utils, and integration tests for Auth. Tests pass locally.

## [Phase 3 - Auth Middleware]
**Prompt:** "Implement authMiddleware.js for protect and admin guards to satisfy the tests."
**Tool:** Gemini 3.1 Pro
**Outcome:** Created unit/integration tests for middleware and implemented the logic. Tests pass locally.

## [Phase 4 - Vehicle CRUD]
**Prompt:** "Write unit tests for vehicleService.js and integration tests for vehicle routes. Implement Vehicle model, service, controller, and routes to satisfy tests."
**Tool:** Gemini 3.1 Pro
**Outcome:** Added Vehicle model and full CRUD functionality with admin protection on mutations. Tests pass locally.

## [Phase 5 - Search & Pagination]
**Prompt:** "Implement search and pagination in vehicleService and vehicleController. Add buildVehicleQuery function and unit tests. Add integration tests for search endpoints."
**Tool:** Gemini 3.1 Pro
**Outcome:** Implemented query builder with regex matching for text fields and range filters for price. Updated getVehicles to handle pagination and return metadata. Tests pass locally.

## [Phase 6 - Purchase / Restock]
**Prompt:** "Implement purchase and restock logic using atomic conditional updates (findOneAndUpdate) to prevent overselling. Write comprehensive unit and integration tests."
**Tool:** Gemini 3.1 Pro
**Outcome:** Added atomic update operations for purchase and restock endpoints, ensuring safe concurrent purchases. Tests pass locally.

## [Phase 7 - Validation & Error Handling]
**Prompt:** "Implement centralized error middleware and Zod schema validation middleware. Add schemas for auth and vehicle routes. Verify with unit and integration tests."
**Tool:** Gemini 3.1 Pro
**Outcome:** Created errorMiddleware and validateRequest. Configured Zod schemas and integrated them into route definitions. All existing tests pass.

## [Phase 8 - Coverage Pass]
**Prompt:** "Run Jest coverage and verify it hits >90%. Add tests if necessary."
**Tool:** Gemini 3.1 Pro
**Outcome:** Ran coverage. Statements hit 94.49% and lines hit 95.15%. All backend phase requirements are complete.

## [Frontend - Phase 1 to 7]
**Prompt:** "Build a React + Tailwind SPA. Design Direction: Showroom-inspired. Specific colors provided. Display font: 'Space Grotesk', Body: 'Inter', Utility: 'IBM Plex Mono'. Scaffold the Vite project, set up API layer & Auth (Axios interceptors), Inventory dashboard, Vehicle details, Admin page, Polish pass, and write Tests."
**Tool:** Gemini 3.1 Pro
**Outcome:** Created a complete React frontend using Vite and Tailwind CSS v4. Implemented a custom design token system for a dark showroom aesthetic. Built all requested components (`VehicleGrid`, `VehicleCard`, `FilterRail`, `AdminPage`) with responsive layouts, animations, and toast notifications. Configured API client with Axios interceptors. Reached 100% completion on all frontend test cases using Vitest and React Testing Library.
