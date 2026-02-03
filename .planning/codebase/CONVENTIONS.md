# Coding Conventions

**Analysis Date:** 2026-02-03

## Naming Patterns

**Files:**
- Kebab-case for component files: `plant-form.tsx`, `seed-form.tsx`, `plant-seed-selection.tsx`
- Snake_case for utility files: `string.utils.ts`, `auth.middleware.ts`
- Kebab-case for schema files: `plant.schema.ts`, `seed.schema.ts`
- Service files: `plant.service.ts`, `seed.service.ts` (singular entity name)
- Route files: `plant.routes.ts`, `seeds.routes.ts` (singular entity name)
- Test files: `*.test.ts` or `*.spec.ts` (co-located with source)

**Functions:**
- camelCase for function names: `slugify()`, `truncate()`, `usePlants()`, `useCreatePlant()`
- React component functions: PascalCase: `PlantForm()`, `SeedForm()`, `AppHeader()`
- Service objects exported as camelCase: `plantsService`, `plantsApi`, `plantRoutes`

**Variables:**
- camelCase for all variables and constants: `plantsKeys`, `querySchema`, `mockPlant`, `newPlantData`
- React hooks follow `useX` pattern: `usePlants()`, `usePlant()`, `useCreatePlant()`
- Query key objects use camelCase: `plantsKeys`, `seedsKeys`

**Types:**
- PascalCase for type names: `PlantFilters`, `PaginationParams`, `PaginatedResult<T>`, `Plant`, `NewPlant`
- Zod schemas exported with `Schema` suffix in type position: `createPlantSchema`, `plantSchema`
- Inferred types from Zod: `CreatePlantFormData`, `CreatePlantInput`, `UpdatePlantInput`

## Code Style

**Formatting:**
- Tool: Prettier 3.2.5 (configured via `pnpm format`)
- 2-space indentation throughout
- Line length: typically follows natural boundaries (observed ~100 char max in comments)
- Semicolons: Required at end of statements

**Linting:**
- No dedicated ESLint config at root (not enforced)
- Rely on TypeScript strict mode for type safety
- Format command: `pnpm format` applies Prettier to all `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.md`

**Style observations from codebase:**
- Use `const` exclusively; no `let` observed
- Prefer explicit return types for functions (especially in services)
- Use single quotes in TypeScript/JavaScript (Prettier configuration default)

## Import Organization

**Order:**
1. External packages (e.g., `import { useQuery } from "@tanstack/react-query"`)
2. Internal shared types (e.g., `import { CreatePlantInput } from "@happyseeds/shared-types"`)
3. Relative imports from same app (e.g., `import { plantsApi } from "@/services/plants.service"`)

**Path Aliases:**
- `@/` points to app source root (`src/`)
- `@happyseeds/shared-types` for shared types package
- Examples: `@/@types/plant.types`, `@/services/plants.service`, `@/hooks/usePlants`

**Example from codebase:**
```typescript
// Plant-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  createPlantSchema,
  plantCategoryOptions,
  CreatePlantFormData
} from "../../schemas/plant.schema";
import { Plant } from "@/@types/plant.types";
```

## Error Handling

**API Response Format (consistent across backend):**
```typescript
// Success
{ success: true, data: T }

// Paginated success
{ success: true, data: T[], pagination: { page, limit, total, totalPages } }

// Error
{
  success: false,
  error: {
    code: string;      // "NOT_FOUND", "UNAUTHORIZED", "VALIDATION_ERROR", "DB_ERROR"
    message: string;   // User-friendly message (French)
  }
}
```

**HTTP Status Codes:**
- `200` - Successful GET/PATCH
- `201` - Successful POST (created)
- `400` - Bad request / validation error (with error code)
- `401` - Unauthorized (not authenticated)
- `404` - Not found
- `500` - Server error

**Backend Error Handling Patterns:**

Service layer uses simple try-throw:
```typescript
// From plant.service.ts - no explicit error handling
async findById(id: string): Promise<Plant | null> {
  const result = await db.select()...
  return result[0] ?? null;
}
```

Route layer handles errors and returns formatted response:
```typescript
// From plant.routes.ts
.get("/:id", async (c) => {
  const plant = await plantService.findById(id);
  if (!plant) {
    return c.json(
      { success: false, error: { code: "NOT_FOUND", message: "Plante non trouvée" } },
      404
    );
  }
  return c.json({ success: true, data: plant });
})
```

Exception case with try-catch:
```typescript
// From app.ts - DB test endpoint
try {
  const result = await db.insert(testTable).values(...).returning();
  return c.json({ success: true, data: result });
} catch (error) {
  return c.json(
    {
      success: false,
      error: {
        code: "DB_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    },
    500
  );
}
```

**Frontend Error Handling:**

Custom `ApiError` class wraps HTTP errors:
```typescript
// From api-client.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}
```

Errors thrown from request helper when `!response.ok || !data.success`:
```typescript
export async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {...});
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new ApiError(
      data.error?.message || "Une erreur est survenue",
      data.error?.code || "UNKNOWN_ERROR",
      response.status
    );
  }
  return data;
}
```

Mutations handle errors implicitly via TanStack Query (errors accessible via `mutation.error`).

## Logging

**Framework:** Hono built-in `logger()` middleware (outputs all HTTP requests)

**Patterns:**
- Backend: `app.use("*", logger())` - logs all requests automatically
- Frontend: `console.log()` in error handlers (e.g., form submission errors: `(errors) => console.log("Validation errors:", errors)`)
- Server startup: `console.log()` for initialization messages

**When to log:**
- Hono middleware automatically logs all HTTP activity
- Console.log acceptable for debugging form validation errors
- No structured logging library in use (future improvement)

## Comments

**When to Comment:**
- JSDoc for exported functions/types (observed throughout)
- Section headers for grouping related code (e.g., `// ============================================ // Types pour les paramètres`)
- Inline comments for complex logic or business rules

**JSDoc/TSDoc:**
- Used for exported functions and services
- Example:
```typescript
/**
 * Récupère une plante par son ID
 * Vérifie que l'utilisateur est bien le propriétaire
 */
async findById(id: string): Promise<Plant | null> {
  ...
}
```

**Section Comments:**
Used liberally to organize code into logical blocks:
```typescript
// ============================================
// Query Keys
// ============================================

// ============================================
// Hooks
// ============================================
```

## Function Design

**Size:**
- Utility functions: 5-20 lines (e.g., `slugify()`, `truncate()`)
- Service methods: 5-25 lines (database queries + return)
- Route handlers: 10-30 lines (validation + service call + response)
- Hooks: 10-20 lines (minimal setup)

**Parameters:**
- Prefer single object parameter for multiple related values:
```typescript
// ✓ Good: object with related filters
async findAll(filters: PlantFilters, pagination: PaginationParams = {})

// Services default to minimal params
async findById(id: string): Promise<Plant | null>
```

**Return Values:**
- Services return concrete types or `null` for "not found" cases
- Routes return Hono JSON responses
- Hooks return TanStack Query hook result objects

## Module Design

**Exports:**
- Services exported as const objects:
```typescript
export const plantService = {
  async findById(id: string) {...},
  async create(data: NewPlant) {...},
  // ...
};
```

- Routes exported as const Hono instances:
```typescript
export const plantRoutes = new Hono()
  .get("/", ...)
  .post("/", ...)
```

- Utility functions exported as named exports:
```typescript
export function slugify(text: string): string {...}
export function truncate(text: string, maxLength: number): string {...}
```

- React components exported as named exports:
```typescript
export function PlantForm({ ... }: PlantFormProps) {...}
```

**Barrel Files:**
- Used in schema layer: `/db/schema/index.ts` re-exports from individual schema files
- Pattern: `export * from "./auth-schema"`
- Not used in routes or services (each mounted individually in app.ts)

**Database Schema Exports:**
From Drizzle schemas, export both table and inferred types:
```typescript
export const plant = pgTable("plant", { ... });
export type Plant = typeof plant.$inferSelect;      // Read type
export type NewPlant = typeof plant.$inferInsert;   // Create/Insert type
```

---

*Convention analysis: 2026-02-03*
