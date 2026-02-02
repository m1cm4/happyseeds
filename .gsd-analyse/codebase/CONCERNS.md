# Codebase Concerns

**Analysis Date:** 2026-02-02

## Tech Debt

**Type Safety Violations (`any` casts):**
- Issue: Multiple instances of `as any` type casts bypass TypeScript safety in critical data paths
- Files:
  - `apps/backend/src/services/plants.service.ts:56` - `filters.category as any` in SQL equality check
  - `apps/frontend/src/routes/_authenticated/plants/new.tsx:21` - `cleanedData as any` in mutation
  - `apps/frontend/src/routes/_authenticated/plants/$id/edit.tsx:46` - `cleanedData as any` in update mutation
  - `apps/backend/src/services/plants.service.test.ts` - Multiple `(db.select as any)`, `(db.insert as any)` in tests
  - `apps/frontend/src/routeTree.gen.ts` - Auto-generated file with many `as any` casts (auto-generated, acceptable)
- Impact: Loss of type safety in form submission, potential data type mismatches, harder debugging
- Fix approach:
  1. Create proper filter types that exclude undefined values
  2. Use Zod's `.transform()` or proper type guards
  3. Replace manual data cleaning with schema-based validation
  4. For tests, use proper type-safe mocking with proper Drizzle types

**Debug Console Statements:**
- Issue: Production-ready console.log/console.error statements left in code for debugging
- Files:
  - `apps/backend/src/index.ts` - `console.log` for server startup (acceptable, informational)
  - `apps/frontend/src/lib/auth.ts:8` - `console.log("==== getSession (client)")` debug statement
  - `apps/frontend/src/lib/auth.ts:12` - `console.log("==== getSession (server)")` debug statement
  - `apps/frontend/src/routes/_authenticated/dashboard.tsx:1` - `console.log("========== _authenticate/dashboard ===============")` debug statement
  - `apps/frontend/src/components/PlantForm.tsx:53` - `console.log("Validation errors:", errors)` in error callback
  - `apps/frontend/src/routes/_authenticated/plants/new.tsx:15,20,23,27` - Multiple console.log calls for form submission flow
- Impact: Clutters logs, exposes internal state, impacts performance in high-traffic scenarios
- Fix approach: Replace with proper logging library (pino, winston, or bunyan) with log levels

**Empty Routes File:**
- Issue: Seeds routes defined in schema and service but routes file is empty
- Files: `apps/backend/src/routes/seeds.routes.ts` (0 bytes, completely empty)
- Impact: Seeds CRUD API endpoints not exposed despite full backend implementation
- Fix approach: Implement seeds routes following the plants.routes.ts pattern

## Missing Critical Features

**Seeds API Endpoints Not Exposed:**
- Problem: Seeds service (`apps/backend/src/services/seeds.service.ts`) is fully implemented with findAllByPlant, findById, create, update, delete, countByPlant methods, but no routes file exists
- Blocks: Any frontend functionality for seed management, seed inventory tracking, acquisition history
- Files affected: Backend service complete, but `apps/backend/src/routes/seeds.routes.ts` is empty
- Workaround: Can be completed by copying plants.routes.ts pattern with seeds-specific schemas

**Frontend Seeds Hooks Not Implemented:**
- Problem: No hooks directory implementation for seeds queries/mutations
- Impact: Cannot fetch, create, update, or delete seeds from frontend
- Files: `apps/frontend/src/hooks/` only contains `usePlants.ts`, no `useSeeds.ts` or similar

**Frontend Seeds UI Routes Missing:**
- Problem: No routes for viewing/managing seeds in the UI
- Missing: `/plants/$id/seeds/list`, `/plants/$id/seeds/new`, `/plants/$id/seeds/$seedId/edit`
- Impact: Seeds data is captured in database but unreachable from UI

## Security Considerations

**Missing Cascade Delete Constraint on Foreign Key:**
- Risk: Seeds reference plants via `plant_id` with `ON DELETE no action` - orphan seeds if plant is deleted
- Files:
  - `apps/backend/src/db/migrations/0003_orange_hannibal_king.sql:16` - seeds foreign key has `ON DELETE no action`
  - `apps/backend/src/db/schema/seed.schema.ts:35-37` - Foreign key definition
- Current mitigation: Database enforces referential integrity (prevents deletion), but app should handle cascade
- Recommendations:
  1. Add `onDelete: "cascade"` to seed.schema.ts plantId foreign key
  2. Test delete plant → cascades to delete seeds
  3. Update migration to match

**Insufficient Error Handling in Frontend Requests:**
- Risk: API errors not always properly caught and displayed to users
- Files:
  - `apps/frontend/src/routes/_authenticated/plants/$id/edit.tsx:24` - Only checks `error || !data?.data` but error display assumes `error.message` exists
  - `apps/frontend/src/routes/_authenticated/plants/new.tsx:40` - Assumes `createPlant.error.message` exists without null checks
- Current mitigation: Error objects are created in api-client.ts but types may not guarantee message
- Recommendations:
  1. Ensure ApiError always has message
  2. Add fallback error display logic in components
  3. Type error response properly in hooks

**No CSRF Protection:**
- Risk: State-changing operations (POST, PATCH, DELETE) lack CSRF tokens
- Files:
  - `apps/backend/src/routes/plants.routes.ts` - POST/PATCH/DELETE endpoints unprotected
  - `apps/backend/src/routes/auth.routes.ts` - Auth endpoints likely unprotected
- Current mitigation: Session-based cookies with `credentials: include` provide some protection
- Recommendations:
  1. Add CSRF middleware to Hono (hono/csrf)
  2. Include CSRF token in form submissions
  3. Validate tokens in state-changing endpoints

## Performance Bottlenecks

**Inefficient Pagination Count Query:**
- Problem: Seeds and plants services count total records by fetching ALL ids and using `.length`
- Files:
  - `apps/backend/src/services/plants.service.ts:65-75` - Fetches all matching ids for count
  - `apps/backend/src/services/seeds.service.ts:59-63` - Fetches all matching ids for count
- Cause: Drizzle ORM doesn't provide direct `COUNT(*)` in current usage
- Impact: O(n) query performance for pagination metadata, scales poorly with large datasets
- Improvement path:
  1. Use Drizzle's count() function instead of manual counting
  2. Or use raw SQL with COUNT(*) for pagination
  3. Example: `db.select({ count: count() }).from(plants).where(...)`

**No Indexes on Foreign Keys:**
- Risk: Seeds.plantId and Seeds.userId lack indexes despite being frequently queried
- Files: `apps/backend/src/db/migrations/0003_orange_hannibal_king.sql` - seeds table definition
- Impact: Slow queries when filtering seeds by plant or user
- Improvement path:
  1. Add indexes in migration: `CREATE INDEX idx_seeds_plant_id ON seeds(plant_id);`
  2. Add indexes: `CREATE INDEX idx_seeds_user_id ON seeds(user_id);`

**No Query Result Caching:**
- Risk: Every read of plant details triggers full database fetch despite TanStack Query caching
- Files: `apps/frontend/src/hooks/usePlants.ts` - useQuery without staleTime configuration
- Impact: Unnecessary database hits even with client-side cache
- Improvement path:
  1. Configure staleTime in hooks: `queryFn: ..., staleTime: 5 * 60 * 1000`
  2. Add gcTime for longer cache retention
  3. Configure per query type (details vs lists may differ)

## Fragile Areas

**Form Data Cleaning Logic Duplicated Across Components:**
- Files:
  - `apps/frontend/src/routes/_authenticated/plants/new.tsx:17-19`
  - `apps/frontend/src/routes/_authenticated/plants/$id/edit.tsx:41-43`
- Why fragile: Same filter logic in two places - changes require updating both, inconsistent if diverges
- Safe modification: Extract to utility function in `apps/frontend/src/lib/utils.ts`
- Test coverage: No tests for this cleaning logic

**PlantForm Validation Error Callback Not Removing Empty Values:**
- Issue: Form cleaning happens at route level, not in form component
- Files: `apps/frontend/src/components/PlantForm.tsx:52-54` - Error callback logs but doesn't clean
- Why fragile: If form ever submitted differently, validation errors won't be cleaned
- Safe modification: Move cleaning logic into PlantForm component as part of onSubmit handler

**Database Schema Column Name Typo Not Caught:**
- Issue: `acquisitionTypeEnum` uses correct spelling but database column uses `aquistion_type` (missing 's')
- Files:
  - `apps/backend/src/db/schema/seed.schema.ts:18` - enum is `acquisitionTypeEnum`
  - `apps/backend/src/db/schema/seed.schema.ts:48` - but uses `acquisitionTypeEnum("aquisition_type")` ← typo in column name
  - `apps/backend/src/db/migrations/0003_orange_hannibal_king.sql:1,8` - typo persists in migration
- Why fragile: Misspelled column name works but is confusing, if SQL is written directly it will break
- Safe modification: Generate new migration to rename column from `aquisition_type` to `acquisition_type`

**Test Coverage Incomplete:**
- Files: `apps/backend/src/services/plants.service.test.ts` exists but
  - No tests for `findAll` pagination logic (most complex method)
  - No error handling tests (what if db throws?)
  - No integration tests with real database
  - Seeds service has no tests at all
- Impact: Pagination bugs, query errors won't be caught until production

## Test Coverage Gaps

**Seeds Service Untested:**
- What's not tested: All 6 methods in `apps/backend/src/services/seeds.service.ts` (findAllByPlant, findById, create, update, delete, countByPlant)
- Files: `apps/backend/src/services/` - no seeds.service.test.ts
- Risk: Bugs in seed CRUD won't be caught, pagination in seeds queries untested
- Priority: High - blocks seeds feature rollout

**Plants Service Pagination Not Tested:**
- What's not tested: `findAll` method with complex filtering and pagination logic
- Files: `apps/backend/src/services/plants.service.test.ts` - only tests findById, create, update, delete
- Risk: Pagination edge cases (page > totalPages, limit=0, etc.), filter combinations could break
- Priority: High - pagination affects entire app experience

**Frontend Hooks Not Tested:**
- What's not tested: TanStack Query hook behaviors (usePlants, useCreatePlant, usePlan, etc.)
- Files: `apps/frontend/src/hooks/usePlants.ts` - no .test.ts file
- Risk: Cache invalidation bugs, mutation error handling not verified
- Priority: Medium - client-side errors affect user experience

**API Routes Not Integration Tested:**
- What's not tested: Actual HTTP request/response cycle through Hono routes
- Files: `apps/backend/src/routes/` - no integration tests
- Risk: Request validation, error responses, auth middleware effectiveness untested
- Priority: High - ensures API contracts are honored

**Frontend Component Tests Missing:**
- What's not tested: PlantForm component with various validation states, error states
- Files: `apps/frontend/src/components/PlantForm.tsx` - no .test.tsx
- Risk: Form submission, error display, field validation not verified
- Priority: Medium - UI bugs only caught manually

## Known Bugs

**Incomplete API Response Type in Frontend:**
- Symptoms: `usePlant` hook returns `ApiResponse<Plant>` but query selector assumes `data.data` structure
- Files:
  - `apps/frontend/src/lib/api-client.ts:163` - Returns `ApiResponse<Plant>`
  - `apps/frontend/src/routes/_authenticated/plants/$id/edit.tsx:24` - Accesses `data?.data`
- Trigger: Edit plant page - fetch plant by ID
- Workaround: Conditional check `data?.data` catches undefined but is confusing
- Root cause: ApiResponse wraps data in .data property, so `ApiResponse<Plant>` really returns `{ success: true, data: Plant }`

**Form Submission Type Coercion Issue:**
- Symptoms: Number fields in form submit as strings, then coerced to `any`
- Files:
  - `apps/frontend/src/routes/_authenticated/plants/new.tsx:21` - `cleanedData as any`
  - `apps/frontend/src/routes/_authenticated/plants/$id/edit.tsx:46` - `cleanedData as any`
- Trigger: Submit form with numeric fields (sowingDepthMm, germinationDaysMin, etc.)
- Workaround: Backend accepts and converts, but type safety is lost
- Root cause: React Hook Form returns strings from number inputs, schema doesn't coerce before cleaning

## Scaling Limits

**Current capacity:** Single user instance tested, not load-tested
- Auth: Better-Auth session storage in database, scales with user count
- Plants: No pagination limit, could load all plants for user at once if requested
- Seeds: No bulk operations, one-by-one creation only

**Limit:** Performance degrades when:
- User has >1000 plants (no indexes on userId in list queries)
- Pagination count queries on large tables (O(n) implementation)
- Many concurrent connections (single backend instance)

**Scaling path:**
1. Add database indexes on userId, plantId
2. Replace manual count() with COUNT(*) SQL
3. Add backend read replicas for queries
4. Implement server-side pagination with keyset cursor if count becomes expensive
5. Consider connection pooling (Drizzle already supports)

## Dependencies at Risk

**Better-Auth (Authentication Library):**
- Risk: Custom implementation without established security track record
- Impact: Auth bypass, session hijacking, privilege escalation possible if bugs exist
- Migration plan:
  1. Keep current implementation for MVP
  2. Move to industry-standard (Auth0, Clerk, NextAuth.js) before production
  3. Or ensure comprehensive security audit of Better-Auth code

**TanStack Start (Meta-Framework):**
- Risk: Newer framework, smaller ecosystem, potential breaking changes between versions
- Impact: Dependencies may not update, community resources limited
- Migration plan:
  1. Pin version in package.json
  2. Monitor release notes for breaking changes
  3. Have fallback to standard TanStack Router + Vite if needed

**Drizzle ORM with PostgreSQL:**
- Risk: Drizzle is relatively new (vs Prisma), migrations are manual SQL
- Impact: Migration bugs could corrupt schema
- Current mitigation: Manual migrations with version control
- Recommendation: Backup database before running migrations

## Environment Configuration Issues

**Missing Environment Variables Documentation:**
- Risk: Developers don't know required .env vars, app fails silently
- Files: `.env` file not in CLAUDE.md, not documented
- Current state: DATABASE_URL required (checks in `apps/backend/src/db/index.ts:8`)
- Also likely needed: VITE_API_URL, FRONTEND_URL (in app.ts:22)
- Fix: Create .env.example with all required vars and add to CLAUDE.md

**Database URL Hardcoded Check Without Graceful Error:**
- Issue: App crashes immediately if DATABASE_URL not set
- Files: `apps/backend/src/db/index.ts:8` - `throw new Error("DATABASE_URL environment variable is not set!")`
- Better approach: Catch error, provide helpful message about how to set it

---

*Concerns audit: 2026-02-02*
