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
