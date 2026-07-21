# AI Tooling Chat History

## [Phase 1 - Project skeleton]
**Prompt:** "Start with Phase 1 of the implementation plan."
**Tool:** Gemini 3.1 Pro
**Outcome:** Initialized git repository, created `.gitignore`, `PROMPTS.md`, and task tracking file. Moving to backend setup.

## [Phase 2 - Auth API]
**Prompt:** "Implement authService.js, authController.js, authRoutes.js, generateToken.js to satisfy the tests. Refactor: extract password hashing into a Mongoose pre-save hook so it can never be forgotten at the call site."
**Tool:** Gemini 3.1 Pro
**Outcome:** Created models, routes, controllers, utils, and integration tests for Auth. Tests pass locally.
