# Coding Conventions

**Analysis Date:** 2026-02-02

## Naming Patterns

**Files:**
- Service files: `*.service.ts` (e.g., `plants.service.ts`)
- Utility files: `*.utils.ts` (e.g., `string.utils.ts`)
- Schema files: `*.schema.ts` (e.g., `plants.schema.ts`, `auth-schema.ts`)
- Route files: `*.routes.ts` (e.g., `plants.routes.ts`)
- Middleware files: `*.middleware.ts` (e.g., `auth.middleware.ts`)
- Component files: PascalCase `.tsx` (e.g., `PlantForm.tsx`, `AppHeader.tsx`)
- React hooks: Custom hooks with `use` prefix (e.g., `useForm`, `useQuery`)

**Functions:**
- camelCase for functions and methods
- Service methods are properties of exported objects: `export const serviceName = { methodName: async (...) => {} }`
- Example: `plantsService.findById()`, `plantsService.update()`

**Variables:**
- camelCase for all variables and constants
- React component props typed with `Props` suffix: `type PlantFormProps`
- Example: `userId`, `defaultValues`, `isSubmitting`

**Types:**
- PascalCase for all type names
- Domain-specific types exported from schema files: `Plant`, `NewPlant`, `PlantFilters`, `PaginationParams`
- Response wrapper types: `PaginatedResult<T>`
- Props types with suffix: `PlantFormProps`, `AuthVariablesType`

**Enums:**
- PascalCase with `Enum` suffix in database schemas: `plantCategoryEnum`, `sunRequirementEnum`
- Exported as lowercase identifiers from drizzle: `pgEnum("plant_category", [...])`

## Code Style

**Formatting:**
- Tool: Prettier 3.2.5 (configured via root `package.json`)
- Command: `pnpm format` (runs across monorepo)
- Applies to: TypeScript, TSX, JavaScript, JSON, Markdown

**Linting:**
- Type checking: `pnpm check-types` (TypeScript `--noEmit`)
- No explicit ESLint configuration in project root
- TypeScript strict mode enforced (see tsconfig.json)

**Line Length:**
- Based on CLAUDE.md rules: Max 100 characters
- Observed in codebase: Generally followed in comments and code

**Semicolons:**
- All statements end with `;`
- Enforced in CLAUDE.md rules

**Indentation:**
- 2-space indentation (per CLAUDE.md rules)
- Consistent across all files

## Import Organization

**Order:**
1. External dependencies (Node.js, npm packages)
2. Internal modules (db, services, middleware)
3. Type imports and relative imports

**Pattern Examples:**

Backend routes:
```typescript
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { plantsService } from "../services/plants.service";
import { requireAuth } from "../middleware/auth.middleware";
```

Backend services:
```typescript
import { eq, and, ilike, desc, asc, SQL } from "drizzle-orm";
import { db } from "../db";
import { plants, Plant, NewPlant } from "../db/schema";
```

Frontend components:
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { createPlantSchema } from "../lib/schemas/plant.schema";
import type { Plant } from "../lib/api-client";
```

**Path Aliases:**
- Frontend: `@/*` maps to `./src/*` (configured in `apps/frontend/tsconfig.json`)
- Not observed in backend (uses relative imports)

## Error Handling

**Pattern:**
- Consistent API response format with `success` boolean wrapper
- Two response types:

Success:
```typescript
return c.json({ success: true, data: plant }, 201);
return c.json({ success: true, ...result });
```

Error:
```typescript
return c.json(
  {
    success: false,
    error: {
      code: "NOT_FOUND",        // Error code (string)
      message: "Plante non trouvée"  // User-friendly message
    }
  },
  404
);
```

**HTTP Status Codes:**
- `201` for successful POST (create)
- `200` for successful GET/PATCH/DELETE
- `400` for validation errors (implicit via Zod validator)
- `401` for authentication failures
- `404` for not found errors
- `500` for server errors (DB errors, etc.)

**Try/Catch:**
```typescript
try {
  const inserted = await db.insert(testTable).values(...).returning();
  return c.json({ success: true, data: { inserted: inserted[0] } });
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

**Validation:**
- Zod schemas define all request/response validation
- Backend: `zValidator("json", schema)` middleware
- Frontend: `zodResolver(schema)` in React Hook Form

**Null/Undefined Handling:**
- Use nullish coalescing: `result[0] ?? null`
- Optional chaining: `session?.user`
- Type narrowing before use

## Logging

**Framework:**
- Backend: Hono's built-in `logger()` middleware for HTTP requests
- Frontend: React DevTools via TanStack Query DevTools
- Console: `console.log()` for client-side errors (observed in PlantForm)

**Patterns:**
- Request logging: Applied globally via `app.use("*", logger())`
- Error logging: Errors included in response messages for debugging
- No structured logging library (logs, metrics sent via console/built-in)

## Comments

**When to Comment:**
- JSDoc comments for public functions and exported utilities
- Inline comments for complex logic
- Section comments using separator style: `// ============================================`

**JSDoc/TSDoc:**
```typescript
/**
 * Récupère une plante par son ID
 * Vérifie que l'utilisateur est bien le propriétaire
 */
async findById(id: string, userId: string): Promise<Plant | null>

/**
 * Convertit une chaîne en "slug" URL-friendly
 * Exemple : "Ma Plante Préférée" → "ma-plante-preferee"
 */
export function slugify(text: string): string
```

**Section Comments:**
```typescript
// ============================================
// Tests pour slugify
// ============================================
```

**Inline Comments:**
- Used for non-obvious logic, especially in query construction
- French and English both observed (project is bilingual)

## Function Design

**Size:**
- Service functions: Typically 5-20 lines
- Route handlers: 10-30 lines (validation + service call + response)
- Complex functions: 30-50 lines (findAll with filters/pagination)

**Parameters:**
- Explicit parameters over object destructuring
- Database queries: Use parameter objects for filters (PlantFilters, PaginationParams)

```typescript
async findAll(filters: PlantFilters, pagination: PaginationParams = {}): Promise<...>
async update(id: string, userId: string, data: Partial<...>): Promise<...>
```

**Return Values:**
- Always typed with explicit return types
- Service methods: Return data or null/boolean
- Routes: Return `c.json()` responses
- Async functions always return Promises

## Module Design

**Exports:**
- Named exports for services, utilities, middleware
- Service pattern: Single exported object with methods

```typescript
export const plantsService = {
  async findAll(...) { },
  async findById(...) { },
  async create(...) { },
  async update(...) { },
  async delete(...) { },
};
```

**Barrel Files:**
- Used in `apps/backend/src/db/schema/index.ts`
- Exports all schema definitions for central access

```typescript
// Point d'entrée pour tous les schémas
export * from "./auth-schema";
export * from "./plants.schema";
export * from "./seed.schema";
```

**Type Inference:**
- Drizzle ORM: Types inferred from schema definitions
- `typeof table.$inferSelect` for read types (Plant)
- `typeof table.$inferInsert` for insert types (NewPlant)

```typescript
export type Plant = typeof plants.$inferSelect;
export type NewPlant = typeof plants.$inferInsert;
```

## TypeScript Patterns

**Strict Mode:**
- Enabled in both backend and frontend `tsconfig.json`
- `"strict": true` enforces:
  - No implicit any
  - Null/undefined safety
  - Strict function types
  - Strict bind/call/apply

**Type Safety:**
- Always provide explicit types for function parameters and returns
- Avoid `any` - use `unknown` if type is truly unknown
- Leverage type inference where obvious (Drizzle, React Hook Form)

**Generics:**
- Used in response types: `PaginatedResult<T>`
- Query parameters: Generic query builders with Drizzle

**Const Assertions:**
- Used for fixed enum-like values

```typescript
category: "vegetable" as const
waterRequirement: "high" as const
```

## Frontend-Specific Patterns

**Component Structure:**
```typescript
type ComponentNameProps = {
  prop1: Type;
  prop2?: Type;
  onAction: (data: Type) => void;
};

export function ComponentName({ prop1, onAction }: ComponentNameProps) {
  // Hook declarations
  const { data } = useQuery(...);

  // Component JSX
  return (
    <div>
      {/* content */}
    </div>
  );
}
```

**Form Handling:**
- React Hook Form + Zod validation
- Schemas defined in `app/lib/schemas/`
- Props pattern for reusable forms

```typescript
const { register, handleSubmit, formState: { errors } } = useForm<FormDataType>({
  resolver: zodResolver(schema),
  defaultValues: {...},
});
```

**Styling:**
- TailwindCSS utility classes (no custom CSS)
- Conditional classes via `cn()` utility

```typescript
<div className="space-y-4">
  {/* content */}
</div>

<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? "Loading..." : label}
</Button>
```

---

*Convention analysis: 2026-02-02*
