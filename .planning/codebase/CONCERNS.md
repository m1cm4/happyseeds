# Codebase Concerns

**Analysis Date:** 2026-02-03

## API Endpoint Naming Inconsistency (HIGH PRIORITY)

**Issue:** Critical mismatch between backend and frontend API endpoint paths.

**Files:**
- Backend routes: `apps/backend/src/app.ts` (line 51, 54)
- Backend routes: `apps/backend/src/routes/plant.routes.ts` (comments)
- Backend routes: `apps/backend/src/routes/seeds.routes.ts` (comments)
- Frontend service: `apps/frontend/src/services/plants.service.ts` (lines 20, 29, 36, 46, 56)
- Frontend service: `apps/frontend/src/services/seeds.service.ts`

**Problem:**
- Backend mounts routes at `/api/plant` (singular) and `/api/plant/:plantId/seeds`
- Frontend calls `/api/plants` (plural) and `/api/plants/:plantId/seeds`
- This causes all API requests to fail with 404 errors

**Current state:**
```typescript
// Backend (app.ts)
app.route("/api/plant", plantRoutes);           // SINGULAR
app.route("/api/plant/:plantId/seeds", seedsRoutes);

// Frontend (plants.service.ts)
return request<PaginatedResponse<Plant>>(`/api/plants${query ? `?${query}` : ""}`); // PLURAL
```

**Impact:** Complete API failure - no plant operations work from frontend.

**Fix approach:** Standardize on `/api/plant` (singular per CLAUDE.md conventions). Update all frontend service calls in `apps/frontend/src/services/plants.service.ts` and `apps/frontend/src/services/seeds.service.ts`.

---

## Hardcoded Credentials in Login Form (SECURITY RISK)

**Issue:** Plain text email and password hardcoded in development login page.

**Files:** `apps/frontend/src/routes/login.tsx` (lines 87, 99)

**Problem:**
```typescript
<Input
  id="email"
  name="email"
  type="email"
  required
  placeholder="vous@exemple.com"
  value="maesmichel@gmail.com"  // HARDCODED
/>

<Input
  id="password"
  name="password"
  type="password"
  required
  placeholder="Votre mot de passe"
  value="$$$$$$$$"  // HARDCODED
/>
```

**Impact:** Development credentials exposed in code; will be committed to version control.

**Fix approach:** Remove hardcoded values. Use empty string or omit `value` prop. If test credentials needed, use environment variables or comment-only documentation.

**Workaround for development:** Users must clear input fields before login attempt.

---

## Type Safety: Missing `as any` Cast (TYPE SAFETY)

**Issue:** Unsafe type assertion without proper validation.

**Files:** `apps/backend/src/services/plant.service.ts` (line 66)

**Problem:**
```typescript
if (filters.category) {
  conditions.push(eq(plant.category, filters.category as any));
}
```

The `as any` bypass defeats TypeScript's type safety. If category enum doesn't match expected values, runtime error occurs.

**Impact:** Reduced type safety; category filter could accept invalid values.

**Fix approach:** Validate category against enum before pushing condition. Use a type guard:
```typescript
if (filters.category && plantCategoryEnum.safeParse(filters.category).success) {
  conditions.push(eq(plant.category, filters.category));
}
```

---

## Schema Field Mismatch: Frontend vs Backend (TYPE SAFETY)

**Issue:** Frontend and backend plant schemas define different fields, causing hydration failures.

**Files:**
- Frontend types: `apps/frontend/src/@types/plant.types.tsx` (defines `name`, `latinName`, `sowingDepthMm`, `sowingSpacingCm`, `germinationDaysMin`, `germinationDaysMax`, `growthDaysMin`, `growthDaysMax`, `sunRequirement`, `waterRequirement`, `notes`)
- Frontend schema: `apps/frontend/src/schemas/plant.schema.ts` (imports from `@happyseeds/shared-types` but this package doesn't define plant.schema.ts)
- Backend schema: `apps/backend/src/db/schema/plant.schema.ts` (defines `common_name`, `family`, `genus`, `species`, `cultivar`, `position` (enum array), `stratification`, `sowing_depth`, `inside_sowing_period`, `outside_sowing_period`, etc. - completely different structure)

**Problem:**
Frontend schema file `apps/frontend/src/schemas/plant.schema.ts` imports from shared-types:
```typescript
import {
  createPlantSchema,
  plantCategoryOptions,
  sunRequirementOptions,
  waterRequirementOptions,
  CreatePlantInput
} from "../../schemas/plant.schema";
```

But `packages/shared-types/src/schemas/plant.schema.ts` exists and defines a different schema with extended fields (`family`, `genus`, `species`, `position` arrays, etc.). Frontend plant.types.tsx doesn't match this.

The backend database schema includes fields like `inside_sowing_period` (int array), `outside_sowing_period` (int array), `position` (enum array) which the frontend doesn't handle.

**Impact:**
- API responses include fields frontend doesn't know about
- Form submissions may fail validation
- Type coercion issues between camelCase (frontend) and snake_case (backend)

**Fix approach:**
1. Align frontend `@types/plant.types.tsx` with shared-types schema or vice versa
2. Ensure field names match between frontend form submission and backend expectations
3. Add transformation layer if snake_case DB fields need to map to camelCase frontend

---

## Missing Test Coverage (QUALITY)

**Issue:** Minimal test coverage for critical features.

**Files:** Only 2 test files exist in entire codebase:
- `apps/backend/src/services/plants.service.test.ts` (199 lines)
- `apps/backend/src/utils/string.utils.test.ts` (70 lines)

**Untested areas:**
- Frontend components (plant-form, seed-form, routes)
- Frontend hooks (usePlants, useSeeds, etc.)
- Frontend API services
- Backend routes (plant.routes.ts, seeds.routes.ts, auth.routes.ts)
- Backend seeds service
- Authentication middleware
- Error handling paths

**Impact:** Unknown quality; regressions undetected; breaking changes go unnoticed.

**Priority:** High - Phase 3 placeholder mentions Vitest + Playwright testing.

**Fix approach:** Establish test coverage minimums. At minimum:
- 80% coverage for services
- All API routes tested (happy path + error cases)
- Critical frontend flows (CRUD operations)

---

## Incomplete Authentication Scoping (SECURITY)

**Issue:** Plant queries don't scope to authenticated user.

**Files:**
- Backend: `apps/backend/src/services/plant.service.ts` (line 50-105)
- Backend: `apps/backend/src/routes/plant.routes.ts` (line 47-64)

**Problem:**
```typescript
// findAll() doesn't filter by userId - retrieves ALL plants in database
const data = await db
  .select()
  .from(plant)
  .where(and(...conditions))  // No userId check!
  .orderBy(orderByDirection(orderByColumn))
  .limit(limit)
  .offset(offset);
```

Update and delete operations DO check `author_id` (lines 141, 154), but list and read operations don't. User A can see User B's plants.

**Impact:** Data breach - users can enumerate all plants in system, access details of plants they don't own.

**Fix approach:** Add userId filter to findAll() and findById():
```typescript
conditions.push(eq(plant.author_id, userId));
```

Pass userId from auth context through routes to service.

---

## Unused Test File Causes Build Confusion (MAINTENANCE)

**Issue:** File naming convention error.

**Files:** `apps/frontend/src/schemas/seed.shema.ts` (typo in filename)

**Problem:** Filename uses `shema` instead of `schema`. While TypeScript doesn't care, it:
- Breaks import predictability
- Makes codebase harder to navigate
- Violates naming conventions established elsewhere

**Impact:** Minor but indicates careless refactoring; future developers may miss this.

**Fix approach:** Rename to `seed.schema.ts` and update all imports.

---

## Validation Error Callback Not Utilized (CODE QUALITY)

**Issue:** Form validation errors logged but not handled.

**Files:** `apps/frontend/src/components/plant/plant-form.tsx` (line 52-53)

**Problem:**
```typescript
return (
  <form onSubmit={handleSubmit(onSubmit,
    (errors) => console.log("Validation errors:", errors)      // Just logs to console
  )} className="space-y-6">
```

Form errors are logged to browser console but:
- User never sees validation errors before submission
- Errors already displayed inline via `{errors.name && <p>...`
- Console.log indicates debugging code left in

**Impact:** Inconsistent UX; debugging artifacts in production code.

**Fix approach:** Remove the error callback parameter entirely - errors are already handled via inline error display.

---

## Potential Null Reference in API Response (ERROR HANDLING)

**Issue:** API response data extraction assumes success structure.

**Files:** `apps/frontend/src/lib/api-client.ts` (line 23)

**Problem:**
```typescript
const data = await response.json();

if (!response.ok || !data.success) {
  throw new ApiError(...);
}

return data;  // Returns {success: true, data: T} but type says T
```

Function returns `data` (full response object including `success` wrapper) but TypeScript annotation says it returns `T`. Consumers expect unwrapped data.

**Example impact:**
```typescript
const plant = await plantsApi.getById(id);  // Expects Plant
// But actually gets: { success: true, data: Plant }
console.log(plant.name); // Undefined - plant is the wrapper object!
```

**Fix approach:** Return `data.data` instead of full `data`:
```typescript
return data.data as T;  // Or better: unwrap in response parsing
```

---

## Database Constraints Missing (DATA INTEGRITY)

**Issue:** No NOT NULL constraints on critical fields in seeds table.

**Files:** `apps/backend/src/db/schema/seed.schema.ts` (lines 14-30)

**Problem:** Fields like `brand`, `quantity`, `acquisitionType`, `acquisitionDate` allow NULL but business logic expects values. No database-level constraint prevents invalid states.

**Impact:** Corrupted data at database level; application must trust users don't send invalid data.

**Fix approach:** Add NOT NULL constraints and sensible defaults:
```typescript
quantity: integer("quantity").notNull().default(0),
acquisitionType: seedAcquisitionTypeEnum("acquisition_type")
  .notNull()
  .default("unknown"),
```

---

## Unused Test Database Endpoint (SECURITY/MAINTENANCE)

**Issue:** Test/debugging endpoint left in production code.

**Files:** `apps/backend/src/app.ts` (line 58-88)

**Problem:**
```typescript
// Test de la connexion DB -------
app.get("/api/db-test", async (c) => {
  // ... inserts test records directly into database
  const inserted = await db
    .insert(testTable)
    .values({ message: "Hello from Drizzle!" })
    .returning();
```

This endpoint:
- Inserts test data into live database
- Exposes database schema/structure
- Not protected by authentication
- Should never exist in production

**Impact:** Database pollution; potential for DoS (hammer endpoint to fill database); information disclosure.

**Fix approach:** Remove entirely or gate behind admin check + environment variable.

---

## Fragile Frontend Route: Assumes usePlant Success (FRAGILE)

**Issue:** Component doesn't handle data hydration correctly.

**Files:** `apps/frontend/src/routes/_authenticated/plants/$id.index.tsx` (line 29)

**Problem:**
```typescript
if (error || !data?.success) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        <p>Plante non trouvée</p>
      </div>
    </div>
  );
}

const plant = data.data;  // Assumes data.data exists, doesn't null-check
```

If API returns `{success: true, data: null}` (e.g., plant deleted between page load and request), line 42 crashes with "Cannot read property of null".

**Impact:** White screen of death instead of graceful error handling.

**Fix approach:** Add explicit null check:
```typescript
if (!data?.data) {
  return <div>Plante non trouvée</div>;
}
const plant = data.data;
```

---

## Unused Imports and Dead Code (MAINTENANCE)

**Issue:** Imports included but not used.

**Files:**
- `apps/frontend/src/routes/login.tsx` (line 1: `useSearch` imported but not used consistently)

**Impact:** Bloat; confusion about what's needed.

**Fix approach:** Remove unused imports in linting phase.

---

## Performance: Full Count on Every List Request (PERFORMANCE)

**Issue:** Inefficient pagination counting.

**Files:** `apps/backend/src/services/plant.service.ts` (line 76-81)

**Problem:**
```typescript
// Note: Drizzle ne fait pas de COUNT(*) directement, on compte les résultats
const allForCount = await db
  .select({ id: plant.id })
  .from(plant)
  .where(and(...conditions));

const total = allForCount.length;
```

This counts ALL matching records by fetching them. For 10,000 plants, fetches 10,000 rows just to get count.

**Impact:**
- O(n) performance for count operation
- Scales badly as dataset grows
- Unnecessary memory usage

**Fix approach:** Use Drizzle's count() function or raw SQL:
```typescript
const [{ total }] = await db
  .select({ total: count() })
  .from(plant)
  .where(and(...conditions));
```

---

## Missing User Association in Plant Creation (DATA INTEGRITY)

**Issue:** UI types don't match backend types.

**Files:**
- Frontend types: `apps/frontend/src/@types/plant.types.tsx` (includes `userId`)
- Frontend form: `apps/frontend/src/components/plant/plant-form.tsx` doesn't collect userId
- Backend schema: `apps/backend/src/db/schema/plant.schema.ts` requires `author_id`

**Problem:** Frontend form doesn't show/capture userId but API expects it. Backend correctly adds it from session context in routes (line 88), so this works but is confusing design.

**Impact:** Misleading types; potential for confusion in future refactoring.

**Fix approach:** Remove `userId` from CreatePlantInput type - it's always derived from session context, never from user input.

---

## Enum Mismatch: PlantCategory (TYPE SAFETY)

**Issue:** Multiple incompatible enum definitions for plant categories.

**Files:**
- Frontend types: `apps/frontend/src/@types/plant.types.tsx` - defines `["vegetable", "fruit", "flower", "herb", "shrub", "other"]`
- Shared types: `packages/shared-types/src/schemas/plant.schema.ts` - defines `["ornamental", "vegetable"]`
- Backend schema: `apps/backend/src/db/schema/plant.schema.ts` - defines `pgEnum("plant_category", ["ornamental", "vegetable"])`

**Problem:** Three different category systems. Frontend form allows "fruit", "flower", "herb" but backend only accepts "ornamental" or "vegetable". Form validation doesn't catch this.

**Impact:** Silent data loss on form submission; validation passes but submission fails.

**Fix approach:** Use single source of truth. Import enum from shared-types everywhere or vice versa.

---

## Missing Environment Variable Documentation (CONFIGURATION)

**Issue:** Critical env vars not documented.

**Files:** `apps/backend/src/app.ts` (line 23)

**Problem:**
```typescript
origin: process.env.FRONTEND_URL || "http://localhost:3000",
```

What if FRONTEND_URL is wrong? No validation, no error message, just silently uses default.

**Impact:** Misconfigured CORS blocks legitimate requests without clear error message.

**Fix approach:** Document all required env vars in `.env.example` and validate on startup.

---

## Inconsistent Null Handling in Plant Form (CODE QUALITY)

**Issue:** Mixed approaches to optional field initialization.

**Files:** `apps/frontend/src/components/plant/plant-form.tsx` (lines 34-48)

**Problem:**
```typescript
defaultValues: {
  name: defaultValues?.name ?? "",
  latinName: defaultValues?.latinName ?? "",
  sowingDepthMm: defaultValues?.sowingDepthMm ?? undefined,  // undefined vs ""
  sowingSpacingCm: defaultValues?.sowingSpacingCm ?? undefined,
  // ...
}
```

Uses both `""` and `undefined` inconsistently. For optional numeric fields, `undefined` is correct but string fields mix both.

**Impact:** Inconsistent form behavior; some fields don't clear properly on reset.

**Fix approach:** Use consistent pattern - `undefined` for optional fields, `""` for text only.

---

## Summary by Severity

### Critical (Breaks Functionality)
1. **API endpoint naming mismatch** - No plant operations work
2. **Hardcoded credentials** - Security exposure

### High (Data/Security Issues)
3. **Missing user scoping in queries** - Data breach
4. **Schema mismatch** - Type errors and validation failures
5. **Test database endpoint** - Security vulnerability

### Medium (Quality/Reliability)
6. **Fragile frontend route** - Crash on edge cases
7. **Null reference in API response** - Runtime errors
8. **Type safety gaps** - Reduced reliability
9. **Enum mismatch** - Silent data loss

### Low (Maintenance/Performance)
10. **Inefficient counting** - Scales poorly
11. **Missing test coverage** - Unknown quality
12. **Unused imports** - Code bloat
13. **Inconsistent patterns** - Maintenance burden

---

*Concerns audit: 2026-02-03*
