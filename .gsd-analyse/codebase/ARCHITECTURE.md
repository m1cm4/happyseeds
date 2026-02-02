# Architecture

**Analysis Date:** 2026-02-02

## Pattern Overview

**Overall:** Layered full-stack monorepo with clear separation of concerns

**Key Characteristics:**
- Turborepo monorepo with independent backend and frontend applications
- Type-safe end-to-end via shared Zod schemas
- RESTful API with consistent response format
- Session-based authentication with Better-Auth
- Drizzle ORM for type-safe database access
- TanStack Router for file-based frontend routing
- TanStack Query for server state management

## Layers

**Database (Persistence):**
- Purpose: PostgreSQL data store with Drizzle ORM schema definitions
- Location: `apps/backend/src/db/`
- Contains: Schema definitions, migrations, DB client
- Depends on: PostgreSQL driver, postgres-js client
- Used by: Backend services

**Service Layer (Business Logic):**
- Purpose: Entity operations with filters, pagination, authorization checks
- Location: `apps/backend/src/services/`
- Contains: `plants.service.ts`, `seeds.service.ts` (service pattern with CRUD + query methods)
- Depends on: Drizzle ORM, database schemas
- Used by: Route handlers

**Route Layer (API Endpoints):**
- Purpose: HTTP request handling, validation, response formatting
- Location: `apps/backend/src/routes/`
- Contains: `plants.routes.ts`, `seeds.routes.ts`, `auth.routes.ts`
- Depends on: Hono router, Zod validators, service layer
- Used by: Main Hono app

**Middleware Layer (Request Interceptors):**
- Purpose: Cross-cutting concerns (auth, logging, CORS)
- Location: `apps/backend/src/middleware/`
- Contains: `auth.middleware.ts` (session extraction and user injection)
- Depends on: Better-Auth, Hono factory
- Used by: Route definitions

**Frontend Route Layer (File-based Routing):**
- Purpose: TanStack Router file-based page structure
- Location: `apps/frontend/src/routes/`
- Contains: `__root.tsx`, `login.tsx`, `_authenticated/` (layout), `_authenticated/plants/` (CRUD routes)
- Depends on: TanStack Router
- Used by: Application entry point

**Frontend Component Layer (UI Rendering):**
- Purpose: React components for pages and UI elements
- Location: `apps/frontend/src/components/`
- Contains: `PlantForm.tsx`, `AppHeader.tsx`, shadcn/ui components in `ui/`
- Depends on: React, React Hook Form, TailwindCSS
- Used by: Routes

**Frontend Hook Layer (Data Fetching & Mutations):**
- Purpose: TanStack Query integration for server state and cache management
- Location: `apps/frontend/src/hooks/`
- Contains: `usePlants()`, `usePlant()`, `useCreatePlant()`, `useUpdatePlant()`, `useDeletePlant()`
- Depends on: TanStack Query, API client
- Used by: Components

**API Client Layer (HTTP Communication):**
- Purpose: Typed HTTP requests to backend
- Location: `apps/frontend/src/lib/api-client.ts`
- Contains: Request helper, error handling, type definitions, `plantsApi` object with CRUD methods
- Depends on: Fetch API
- Used by: Hooks

**Shared Types (Type Safety):**
- Purpose: Centralized Zod schemas for validation and type inference
- Location: `packages/shared-types/src/schemas/`
- Contains: `common.schema.ts` (API response format, UUID, timestamps)
- Used by: Backend validation, frontend form validation

## Data Flow

**Plant CRUD Flow:**

1. **Create Flow:**
   - User submits form in `apps/frontend/src/routes/_authenticated/plants/new.tsx`
   - `PlantForm` component validates with Zod schema
   - `useCreatePlant()` hook calls `plantsApi.create()`
   - `request()` in `api-client.ts` sends POST to `/api/plants`
   - Backend route handler in `plants.routes.ts` validates with `createPlantSchema`
   - `plantsService.create()` inserts into `plants` table via Drizzle
   - Response returned with new plant data
   - TanStack Query invalidates `plantsKeys.lists()` cache
   - User redirected to plants list

2. **Read Flow (List):**
   - Component calls `usePlants({ page, limit, category?, search? })`
   - Query executes `plantsApi.getAll(params)` with URL parameters
   - Backend route handler receives query params via `zValidator("query", querySchema)`
   - `plantsService.findAll(filters, pagination)` builds WHERE conditions and executes query
   - Response includes paginated results and metadata
   - TanStack Query caches under key `['plants', 'list', params]`
   - Component renders with loading/error/data states

3. **Read Flow (Detail):**
   - Component calls `usePlant(id)`
   - Query executes `plantsApi.getById(id)`
   - Backend verifies ownership: `and(eq(plants.id, id), eq(plants.userId, userId))`
   - Returns plant or null if not found
   - Cached under key `['plants', 'detail', id]`

4. **Update Flow:**
   - User edits form in `_authenticated/plants/$id/edit.tsx`
   - `useUpdatePlant()` hook calls `plantsApi.update(id, data)`
   - Backend validates partial update with `updatePlantSchema` (`.partial()`)
   - `plantsService.update(id, userId, data)` applies changes
   - Invalidates both `plantsKeys.lists()` and `plantsKeys.detail(id)`

5. **Delete Flow:**
   - User clicks delete button
   - `useDeletePlant()` hook calls `plantsApi.delete(id)`
   - Backend verifies ownership before deletion
   - Invalidates `plantsKeys.lists()` cache

**State Management:**
- **Server state:** TanStack Query caches API responses, auto-refetch on mount/focus
- **Form state:** React Hook Form manages input values and validation errors locally
- **URL state:** TanStack Router stores pagination (page, limit) and filters (category, search) in URL
- **UI state:** Component-local useState for modals, dropdowns, loading states

## Key Abstractions

**Service Pattern (`*Service`):**
- Purpose: Encapsulate data access and business logic
- Examples: `apps/backend/src/services/plants.service.ts`, `apps/backend/src/services/seeds.service.ts`
- Pattern: Object with async methods (findAll, findById, create, update, delete)
- Benefits: Testable, reusable, separates concerns from HTTP handlers

**Query Key Hierarchy:**
- Purpose: Organize TanStack Query cache keys hierarchically
- Example: `plantsKeys.all` → `plantsKeys.lists()` → `plantsKeys.list(params)` → individual detail keys
- Pattern: Factory functions returning const tuples for type safety
- Location: `apps/frontend/src/hooks/usePlants.ts`

**Zod Validation Schemas:**
- Purpose: Single source of truth for data shape validation
- Examples: `createPlantSchema`, `updatePlantSchema`, `querySchema` in `plants.routes.ts`
- Pattern: Declarative validators that generate both TypeScript types and runtime checks
- Used for: Request validation, form validation, response typing

**API Response Wrapper:**
- Purpose: Consistent error handling across all endpoints
- Pattern: `{ success: true; data: T; }` or `{ success: false; error: { code: string; message: string; details?: object; } }`
- Implemented in: All route handlers, API client error handling
- Location: `packages/shared-types/src/schemas/common.schema.ts`

## Entry Points

**Backend Entry Point:**
- Location: `apps/backend/src/index.ts`
- Triggers: Server startup via `pnpm dev` or `pnpm build`
- Responsibilities: Load Hono app, attach to HTTP server on port 3001
- Bootstrap: Creates app via `src/app.ts`, serves on configured port

**Frontend Entry Point:**
- Location: `apps/frontend/src/routes/__root.tsx`
- Triggers: Browser load, TanStack Router initialization
- Responsibilities: Root layout, QueryClientProvider setup, global styles, devtools
- Structure: `<RootDocument>` wraps children with HTML shell and providers

**Auth Entry Point:**
- Location: `apps/backend/src/lib/auth.ts`
- Initialization: Better-Auth configured with Drizzle adapter
- Handles: Session creation, validation, cookie management
- Routes: Delegated to `authRoutes` in `src/routes/auth.routes.ts`

## Error Handling

**Strategy:** Consistent error responses with typed error codes

**Patterns:**

- **Route-level:** Catch errors in handlers, return standard format with HTTP status
  ```typescript
  return c.json({
    success: false,
    error: { code: "NOT_FOUND", message: "Plante non trouvée" }
  }, 404);
  ```

- **Service-level:** Throw or return null; route decides HTTP response
  - `plantsService.findById()` returns `Plant | null`
  - Route handler checks null and responds with 404

- **Frontend:** `ApiError` class extends Error with code and status
  - Thrown by `request()` helper when `!response.ok || !data.success`
  - Caught by TanStack Query, stored in `error` state
  - Components display via `error?.message`

- **Middleware:** Return early with error response on auth failure
  ```typescript
  if (!session?.user) {
    return c.json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Non authentifié" }
    }, 401);
  }
  ```

## Cross-Cutting Concerns

**Logging:**
- Backend: Hono logger middleware logs all requests to stdout
- Pattern: `app.use("*", logger())` in `apps/backend/src/app.ts`

**Validation:**
- Backend: Zod schemas via `zValidator()` on request body and query
- Frontend: React Hook Form + Zod resolver on form submission
- Shared: Type inference from Zod schemas ensures type safety end-to-end

**Authentication:**
- Implementation: Better-Auth session-based with PostgreSQL storage
- Middleware: `requireAuth` checks `auth.api.getSession()` and injects `userId` to context
- Protected routes: All entity routes use `plantsRoutes.use("/*", requireAuth)`
- Frontend: `auth-client.ts` provides auth methods for signup/signin

**CORS:**
- Configured in `apps/backend/src/app.ts`
- Allows origin from `FRONTEND_URL` env var (default localhost:3000)
- Credentials enabled for cookie-based auth

**Ownership Verification:**
- Pattern: Queries scoped to authenticated user via `eq(entity.userId, userId)`
- Applied in: All service methods fetch/update/delete operations
- Prevents: Users accessing other users' data

---

*Architecture analysis: 2026-02-02*
