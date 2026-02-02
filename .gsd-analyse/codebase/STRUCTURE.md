# Codebase Structure

**Analysis Date:** 2026-02-02

## Directory Layout

```
happyseeds/
├── apps/                        # Application workspaces
│   ├── backend/                 # Hono API server
│   │   ├── src/
│   │   │   ├── db/              # Database layer (schemas, migrations, client)
│   │   │   ├── routes/          # API route handlers
│   │   │   ├── services/        # Business logic
│   │   │   ├── middleware/      # Request middleware
│   │   │   ├── lib/             # Utilities (auth)
│   │   │   ├── utils/           # Helper functions
│   │   │   ├── app.ts           # Express-like app initialization
│   │   │   └── index.ts         # Server entry point
│   │   ├── drizzle.config.ts    # Database migration config
│   │   ├── vitest.config.ts     # Test runner config
│   │   └── package.json
│   └── frontend/                # TanStack Start + React app
│       ├── src/
│       │   ├── routes/          # File-based routing
│       │   ├── components/      # React components
│       │   ├── hooks/           # Custom React hooks
│       │   ├── lib/             # Utilities (API client, schemas)
│       │   ├── data/            # Static data
│       │   ├── router.tsx       # Router configuration
│       │   ├── routeTree.gen.ts # Generated route tree
│       │   └── styles.css       # Global styles
│       ├── public/              # Static assets
│       ├── vite.config.ts       # Build config
│       └── package.json
├── packages/                    # Shared packages
│   └── shared-types/            # Zod schemas for type safety
│       ├── src/schemas/
│       │   └── common.schema.ts # Shared validation schemas
│       └── package.json
├── .claude/                     # Claude Code instructions
│   └── rules/                   # Project-specific rules
├── .planning/                   # Planning artifacts
│   └── codebase/               # Generated analysis docs (this file location)
├── pnpm-workspace.yaml         # Monorepo config
├── turbo.json                  # Turborepo build graph
└── package.json
```

## Directory Purposes

**`apps/backend/src/db/`:**
- Purpose: Database schema definitions, migrations, and client connection
- Contains: Drizzle ORM table definitions, PostgreSQL enums, type exports
- Key files:
  - `schema/plants.schema.ts`: Plant entity, enums (category, sunRequirement, waterRequirement), relations
  - `schema/seed.schema.ts`: Seed entity, relations to plants and users
  - `schema/auth-schema.ts`: Better-Auth tables (user, session, account, verification)
  - `index.ts`: Barrel export of all schemas
  - `index.ts` (root): Drizzle client initialization
- Generated: `migrations/` folder created by `drizzle-kit generate`
- Committed: Yes (migrations tracked in git)

**`apps/backend/src/routes/`:**
- Purpose: HTTP route definitions and request handling
- Contains: Route handlers organized by entity
- Key files:
  - `plants.routes.ts`: CRUD endpoints for plants (GET list, GET detail, POST create, PATCH update, DELETE)
  - `seeds.routes.ts`: Placeholder for seed endpoints (empty)
  - `auth.routes.ts`: Delegates to Better-Auth handler
- Pattern: Each route file exports a Hono router with validation and service calls
- Validation: Uses `zValidator()` for request body and query parameters

**`apps/backend/src/services/`:**
- Purpose: Encapsulate business logic and data access
- Contains: Entity-specific service objects with async methods
- Key files:
  - `plants.service.ts`: Methods (findAll, findById, create, update, delete) with filtering and pagination
  - `seeds.service.ts`: Stub service
  - Pattern: Each method handles authorization (scoping to userId) and database operations
- Responsible for: Query building, pagination, ownership checks, data transformation

**`apps/backend/src/middleware/`:**
- Purpose: Cross-cutting request processing
- Contains: Middleware functions for Hono
- Key files:
  - `auth.middleware.ts`: Session extraction, user injection, unauthorized responses
- Pattern: `createMiddleware()` factory from Hono with typed context

**`apps/backend/src/lib/`:**
- Purpose: Shared utilities and integrations
- Contains: External library setup
- Key files:
  - `auth.ts`: Better-Auth initialization with Drizzle adapter, session config
- Pattern: Configurations exported as singleton instances

**`apps/backend/src/utils/`:**
- Purpose: Helper functions
- Key files:
  - `string.utils.ts`: String manipulation utilities
  - `string.utils.test.ts`: Unit tests for utilities

**`apps/frontend/src/routes/`:**
- Purpose: File-based routing with TanStack Router
- Contains: Route components, one per file following naming convention
- Key files:
  - `__root.tsx`: Root layout, QueryClientProvider, global styles
  - `index.tsx`: Home page (unauthenticated)
  - `login.tsx`: Login page
  - `signup.tsx`: Signup page
  - `_authenticated/route.tsx`: Protected layout (requires auth check)
  - `_authenticated/dashboard.tsx`: Dashboard (protected)
  - `_authenticated/plants/index.tsx`: Plants list page
  - `_authenticated/plants/new.tsx`: Create plant form
  - `_authenticated/plants/$id/index.tsx`: Plant detail page
  - `_authenticated/plants/$id/edit.tsx`: Edit plant form
  - `demo/`: Demo pages for TanStack features
- Pattern: Export `const Route = createFileRoute(path)({ component, ... })`
- Layout nesting: `_authenticated` folder creates layout boundary, routes inside inherit protection

**`apps/frontend/src/components/`:**
- Purpose: Reusable React components
- Contains: Page components and UI primitives
- Key files:
  - `ui/`: shadcn/ui components (button, input, label, etc.)
  - `PlantForm.tsx`: Reusable form for create/edit plants
  - `AppHeader.tsx`: Navigation header
  - `TSDemoMenu.tsx`: Demo menu
- Pattern: Functional components with hooks, prop-based configuration

**`apps/frontend/src/hooks/`:**
- Purpose: Custom React hooks for data fetching and mutations
- Contains: TanStack Query integration
- Key files:
  - `usePlants.ts`: Query keys factory and hooks (usePlants, usePlant, useCreatePlant, useUpdatePlant, useDeletePlant)
- Pattern: Hooks return `useQuery` or `useMutation` results with cache invalidation on mutations

**`apps/frontend/src/lib/`:**
- Purpose: Utilities, API client, schemas
- Contains:
  - `api-client.ts`: HTTP client with typed requests, error handling, CRUD methods for plants
  - `schemas/plant.schema.ts`: React Hook Form schemas and validation options
  - `auth.ts`: Auth utility functions
  - `utils.ts`: Helper functions (cn() for classname merging)

**`packages/shared-types/src/schemas/`:**
- Purpose: Centralized validation schemas shared between backend and frontend
- Contains: Zod schema definitions
- Key files:
  - `common.schema.ts`: API response format, UUID schema, timestamps, type inference helpers
- Pattern: Schemas are single source of truth; types inferred with `z.infer<typeof schema>`

## Key File Locations

**Entry Points:**
- `apps/backend/src/index.ts`: Backend server startup
- `apps/backend/src/app.ts`: Hono app initialization with routes and middleware
- `apps/frontend/src/routes/__root.tsx`: Frontend root layout
- `apps/frontend/src/router.tsx`: Router and QueryClient initialization

**Configuration:**
- `apps/backend/drizzle.config.ts`: Database migration tool config
- `apps/backend/vitest.config.ts`: Unit test runner config
- `apps/frontend/vite.config.ts`: Frontend build tool config
- `apps/frontend/components.json`: shadcn/ui component paths
- `pnpm-workspace.yaml`: Monorepo workspace definition
- `turbo.json`: Turborepo build graph and task dependencies

**Core Logic:**
- `apps/backend/src/db/schema/plants.schema.ts`: Plant table and relations
- `apps/backend/src/db/schema/seed.schema.ts`: Seed table and relations
- `apps/backend/src/services/plants.service.ts`: Plant business logic
- `apps/backend/src/routes/plants.routes.ts`: Plant HTTP endpoints
- `apps/backend/src/middleware/auth.middleware.ts`: Auth protection

**Testing:**
- `apps/backend/src/services/plants.service.test.ts`: Service unit tests
- `apps/backend/src/utils/string.utils.test.ts`: Utility function tests

## Naming Conventions

**Files:**
- Route files: `<entity>.routes.ts` (e.g., `plants.routes.ts`)
- Service files: `<entity>.service.ts` (e.g., `plants.service.ts`)
- Test files: `<name>.test.ts` or `<name>.spec.ts` (co-located with source)
- Schema files: `<entity>.schema.ts` (e.g., `plants.schema.ts`)
- Utility files: `<feature>.utils.ts` (e.g., `string.utils.ts`)
- Middleware files: `<feature>.middleware.ts`
- Frontend routes: `<pageName>.tsx` or `$param/` for dynamic segments
- Components: PascalCase (e.g., `PlantForm.tsx`)

**Directories:**
- Entity-based: `routes/`, `services/` organized by concern, not entity
- Feature-based: `components/ui/`, `hooks/` grouped by purpose
- Schema-based: `db/schema/` one file per entity
- Lowercase snake_case for non-component directories

**Functions and Variables:**
- Service methods: camelCase (findAll, findById, create, update, delete)
- React components: PascalCase (PlantForm, AppHeader)
- Hook functions: useXxx pattern (usePlants, usePlant)
- Query keys: camelCase object notation (plantsKeys.all, plantsKeys.detail)
- Types: PascalCase (Plant, NewPlant, PlantFilters)

## Where to Add New Code

**New Feature (e.g., Seeds CRUD):**
1. **Database:** Add/update schema in `apps/backend/src/db/schema/seed.schema.ts`
2. **Service:** Create `apps/backend/src/services/seeds.service.ts` with CRUD methods
3. **Routes:** Populate `apps/backend/src/routes/seeds.routes.ts` with route handlers
4. **Frontend API Client:** Add methods to `apps/frontend/src/lib/api-client.ts`
5. **Frontend Hooks:** Create `apps/frontend/src/hooks/useSeeds.ts` with query factory
6. **Frontend Routes:** Add pages in `apps/frontend/src/routes/_authenticated/seeds/`
7. **Frontend Components:** Create form/list components in `apps/frontend/src/components/`

**New Component/Module:**
- **Page component:** `apps/frontend/src/routes/_authenticated/<feature>/`
- **Reusable UI component:** `apps/frontend/src/components/<ComponentName>.tsx`
- **Shadow UI component:** `apps/frontend/src/components/ui/` (auto-sync from shadcn/ui)
- **Custom hook:** `apps/frontend/src/hooks/use<Feature>.ts`

**Backend Utilities:**
- **Shared helpers:** `apps/backend/src/utils/<feature>.utils.ts`
- **Config/setup:** `apps/backend/src/lib/<feature>.ts`
- **Middleware:** `apps/backend/src/middleware/<feature>.middleware.ts`

**Shared Types:**
- **Validation schemas:** `packages/shared-types/src/schemas/<feature>.schema.ts`
- Export from `packages/shared-types/src/schemas/index.ts` (if needed as public API)

## Special Directories

**`apps/backend/src/db/migrations/`:**
- Purpose: SQL migration files generated by Drizzle
- Generated: By `pnpm drizzle-kit generate` (when schema changes)
- Committed: Yes (tracked to enable recreating DB state)
- Edit: Never manually; regenerate from schema changes

**`apps/frontend/.tanstack/tmp/`:**
- Purpose: TanStack internals (route tree caching, temp files)
- Generated: By TanStack router build
- Committed: No (in .gitignore)

**`apps/backend/coverage/`:**
- Purpose: Test coverage reports
- Generated: By `vitest --coverage`
- Committed: No (in .gitignore)
- View: Open `coverage/index.html` in browser

**`node_modules/`:**
- Purpose: Installed dependencies via pnpm
- Generated: By `pnpm install`
- Committed: No (use pnpm-lock.yaml for reproducibility)
- Workspace: Hoisted to root with `pnpm-workspace.yaml`

**`.planning/codebase/`:**
- Purpose: Generated analysis documents
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md
- Committed: Yes (reference for development)
- Generated: By `/gsd:map-codebase` command

---

*Structure analysis: 2026-02-02*
