# Architecture

**Analysis Date:** 2026-02-03

## Pattern Overview

**Overall:** Layered monorepo with clear separation of concerns (frontend, backend, shared types).

**Key Characteristics:**
- Turborepo-based monorepo with pnpm workspaces
- Type-safe across full stack via shared Zod schemas
- Backend: Hono + Drizzle ORM + PostgreSQL
- Frontend: TanStack Start + React + TanStack Query
- Authentication: Better-Auth with session-based approach
- RESTful API with consistent response format

## Layers

**Presentation Layer (Frontend):**
- Purpose: User interface and client-side state management
- Location: `apps/frontend/src/`
- Contains: React components, routes, hooks, services, schemas
- Depends on: TanStack Router, TanStack Query, shared-types
- Used by: End users via browser

**API Layer (Backend Routes):**
- Purpose: HTTP endpoints for CRUD operations and authentication
- Location: `apps/backend/src/routes/`
- Contains: `*.routes.ts` files with Hono route definitions
- Depends on: Services, middleware, validation schemas
- Used by: Frontend via HTTP requests

**Business Logic Layer (Backend Services):**
- Purpose: Database queries and business rule enforcement
- Location: `apps/backend/src/services/`
- Contains: `*.service.ts` files with pure data access and manipulation
- Depends on: Drizzle ORM, database schemas
- Used by: Routes, other services

**Data Access Layer (Drizzle ORM):**
- Purpose: Database schema definitions and query builders
- Location: `apps/backend/src/db/schema/`
- Contains: `*.schema.ts` files with table definitions and relations
- Depends on: PostgreSQL via drizzle-orm
- Used by: Services

**Middleware Layer (Backend):**
- Purpose: Cross-cutting concerns (auth, logging, CORS)
- Location: `apps/backend/src/middleware/`
- Contains: Authentication verification, error handling
- Depends on: Better-Auth, Hono framework
- Used by: Routes via `.use()` middleware attachment

**Type Layer (Shared):**
- Purpose: Single source of truth for validation and types
- Location: `packages/shared-types/src/schemas/`
- Contains: Zod schemas that define all entities and API contracts
- Depends on: Zod library
- Used by: Backend validation, frontend forms and hooks

## Data Flow

**Create/Update Plant Flow:**

1. User submits form in `apps/frontend/src/components/plant/plant-form.tsx`
2. Form data validated against `createPlantSchema` from `packages/shared-types`
3. `useCreatePlant()` hook in `apps/frontend/src/hooks/usePlants.ts` triggered
4. `plantsApi.create()` in `apps/frontend/src/services/plants.service.ts` calls `request<T>()`
5. `request()` helper in `apps/frontend/src/lib/api-client.ts` sends HTTP POST to `/api/plant`
6. Backend route handler in `apps/backend/src/routes/plant.routes.ts` receives request
7. `zValidator("json", createPlantSchema)` validates payload against same schema
8. `plantService.create()` in `apps/backend/src/services/plant.service.ts` executes
9. Drizzle ORM inserts into `plant` table via `apps/backend/src/db/schema/plant.schema.ts`
10. Response returned as `{ success: true, data: Plant }` to frontend
11. `useCreatePlant()` calls `onSuccess` callback, invalidates TanStack Query cache
12. Frontend components re-render with fresh data via `usePlants()` hook

**Read (List) Flow:**

1. Component mounts and calls `usePlants(params)` hook
2. TanStack Query caches via key: `['plants', 'list', params]`
3. If not cached or stale: `plantsApi.getAll(params)` executes
4. Sends GET `/api/plant?page=1&limit=10&category=...`
5. Backend route validates query via `zValidator("query", querySchema)`
6. `plantService.findAll(filters, pagination)` builds WHERE and ORDER BY clauses
7. Returns paginated result: `{ success: true, data: [...], pagination: {...} }`
8. Frontend extracts `data` and `pagination`, renders component

**State Management:**

- **Server State:** All plant/seed data fetched via TanStack Query (caching + invalidation)
- **Form State:** React Hook Form + Zod validation (per-form, not global)
- **URL State:** TanStack Router manages route parameters (`$id`, `/plants/new`)
- **Auth State:** Session managed via Better-Auth, checked in route guards

## Key Abstractions

**PlantService:**
- Purpose: Encapsulates all plant-related data operations
- Examples: `apps/backend/src/services/plant.service.ts`
- Pattern: Object with named methods (`findAll`, `findById`, `create`, `update`, `delete`)
- Provides: Pagination, filtering, sorting, ownership verification

**Request Helper:**
- Purpose: Unified HTTP client with error handling and type inference
- Examples: `apps/frontend/src/lib/api-client.ts`
- Pattern: Generic function `request<T>(endpoint, options)` that returns typed response
- Ensures: Credentials included, consistent error format, type safety

**TanStack Query Hooks:**
- Purpose: React hooks that manage fetching, caching, and mutations
- Examples: `usePlants()`, `usePlant()`, `useCreatePlant()`, `useUpdatePlant()`, `useDeletePlant()`
- Location: `apps/frontend/src/hooks/usePlants.ts`, `apps/frontend/src/hooks/useSeeds.ts`
- Pattern: Query keys structured hierarchically, mutations with `onSuccess` cache invalidation

**Route Namespace (Hono):**
- Purpose: Group related routes and apply middleware
- Examples: `plantRoutes`, `seedsRoutes`, `authRoutes` in `apps/backend/src/routes/*.ts`
- Pattern: Each file exports `new Hono().use().get().post().patch().delete()`
- Mounted in: `apps/backend/src/app.ts` via `app.route("/api/plant", plantRoutes)`

**API Response Format:**
- Purpose: Consistent error and success handling across frontend/backend
- Pattern: Union type `{ success: true; data: T } | { success: false; error: {...} }`
- Types: `apps/frontend/src/@types/api.types.tsx`
- Enforced: In `request()` helper via `if (!response.ok || !data.success)`

## Entry Points

**Backend Entry Point:**
- Location: `apps/backend/src/app.ts`
- Triggers: HTTP server startup (imports and mounts routes)
- Responsibilities:
  - CORS middleware configuration
  - Request logging
  - Route mounting (`/api/auth`, `/api/plant`, `/api/plant/:plantId/seeds`)
  - Health check endpoint `/api/health`

**Backend Runtime Entry:**
- Location: `apps/backend/src/index.ts`
- Starts Hono server listening on port (env-configured)

**Frontend Entry Point:**
- Location: `apps/frontend/src/routes/__root.tsx`
- Triggers: Browser load (defines root layout)
- Responsibilities:
  - Wraps app in `QueryClientProvider`
  - Sets up global CSS
  - Renders `AppHeader`, dev tools
  - Manages HTML head meta/links

**Frontend Router Configuration:**
- Location: `apps/frontend/src/router.tsx`
- Creates `getRouter()` with QueryClient context
- File-based routing from `apps/frontend/src/routes/` tree

**Protected Route Guard:**
- Location: `apps/frontend/src/routes/_authenticated/route.tsx`
- Triggers: Before entering any `_authenticated/*` route
- Responsibilities: Cookie check (SSR), session validation (client), redirect to `/login` if unauthenticated

## Error Handling

**Strategy:** Return explicit error responses with typed codes.

**Patterns:**

**Backend:**
```typescript
// In routes
if (!plant) {
  return c.json(
    { success: false, error: { code: "NOT_FOUND", message: "Plante non trouvée" } },
    404
  );
}

// In middleware
if (!session?.user) {
  return c.json(
    { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } },
    401
  );
}
```

**Frontend:**
```typescript
// In request helper
if (!response.ok || !data.success) {
  throw new ApiError(
    data.error?.message || "Une erreur est survenue",
    data.error?.code || "UNKNOWN_ERROR",
    response.status
  );
}

// In components
const { data, isLoading, error } = usePlants();
if (error) {
  return <div className="bg-red-50">{error.message}</div>;
}
```

## Cross-Cutting Concerns

**Logging:**
- Backend: Hono's `logger()` middleware logs all requests
- Location: `apps/backend/src/app.ts` line 17
- Frontend: TanStack Query DevTools shows fetch activity

**Validation:**
- Backend: Zod via `@hono/zod-validator` on all routes
- Frontend: React Hook Form + Zod in forms
- Shared: Single source of truth in `packages/shared-types`

**Authentication:**
- Backend: Better-Auth with session cookies, checked via `requireAuth` middleware
- Location: `apps/backend/src/middleware/auth.middleware.ts`
- Frontend: `useSession()` hook checks session, route guards check cookie presence
- Locations: `apps/frontend/src/lib/auth-client.ts`, `apps/frontend/src/routes/_authenticated/route.tsx`

**CORS:**
- Configured in `apps/backend/src/app.ts` to allow frontend origin
- Includes credentials (cookies) in requests and responses

---

*Architecture analysis: 2026-02-03*
