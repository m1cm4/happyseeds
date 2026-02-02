# Testing Patterns

**Analysis Date:** 2026-02-02

## Test Framework

**Runner:**
- Backend: Vitest 4.0.18
- Frontend: Vitest 3.0.5
- Config: `apps/backend/vitest.config.ts`

**Assertion Library:**
- Vitest built-in expect (compatible with Jest)
- No separate assertion library required

**Run Commands:**
```bash
# Backend tests
pnpm test                # Run all backend tests (from apps/backend/)
pnpm test:watch          # Watch mode for backend
pnpm test:coverage       # Generate coverage report

# Frontend tests
pnpm test                # Run frontend tests (from apps/frontend/)
pnpm check-types         # TypeScript type checking
```

## Test File Organization

**Location:**
- Backend: Co-located with source files (same directory)
- Pattern: `src/path/module.ts` → `src/path/module.test.ts`
- Examples:
  - `apps/backend/src/utils/string.utils.ts` → `apps/backend/src/utils/string.utils.test.ts`
  - `apps/backend/src/services/plants.service.ts` → `apps/backend/src/services/plants.service.test.ts`

**Naming:**
- Test files: `*.test.ts` extension
- Not `.spec.ts`

**Vitest Config:**
```typescript
export default defineConfig({
  test: {
    environment: "node",           // Backend uses Node environment
    include: ["src/**/*.test.ts"],  // Only include .test.ts files
    globals: true,                 // describe, it, expect without imports
    testTimeout: 5000,              // 5 second timeout per test
  },
});
```

## Test Structure

**Suite Organization:**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("moduleName", () => {
  // Nested describe blocks for grouped functionality
  describe("functionName", () => {
    it("should do something specific", () => {
      // Arrange
      const input = "value";

      // Act
      const result = functionCall(input);

      // Assert
      expect(result).toBe("expected");
    });
  });

  describe("anotherFunction", () => {
    it("should handle edge case", () => {
      // test code
    });
  });
});
```

**Patterns:**

Setup/Teardown:
```typescript
beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks();
});
```

Arrange-Act-Assert:
```typescript
it("devrait convertir en minuscule", () => {
  // Arrange
  const input = "HELLOWORLD";

  // Act
  const result = slugify(input);

  // Assert
  expect(result).toBe("helloworld");
});
```

Test descriptions in French (observed in codebase, following project language):
```typescript
it("devrait remplacer espaces par des tirets", () => { ... });
it("devrait supprimer les accents", () => { ... });
it("devrait retourner null si la plante n'existe pas", () => { ... });
```

## Mocking

**Framework:**
- Vitest's `vi` object for mocking
- `vi.mock()` for module-level mocks
- `vi.fn()` for spy functions

**Patterns:**

Module mocking with hoisting:
```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock must be before import
vi.mock("../db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

// Now import the mocked module
import { db } from "../db";
import { plantsService } from "./plants.service";
```

Mock implementation chaining (Drizzle ORM pattern):
```typescript
const mockSelect = vi.fn().mockReturnValue({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockReturnValue({
      limit: vi.fn().mockResolvedValue([mockPlant]),
    }),
  }),
});
(db.select as any).mockImplementation(mockSelect);

// For async operations
const mockInsert = vi.fn().mockReturnValue({
  values: vi.fn().mockReturnValue({
    returning: vi.fn().mockResolvedValue([createdPlant]),
  }),
});
(db.insert as any).mockImplementation(mockInsert);
```

**What to Mock:**
- Database layer (db operations)
- External services
- Authentication checks (when testing non-auth-related logic)

**What NOT to Mock:**
- Business logic functions
- Utility functions
- Validation logic (Zod schemas)

## Fixtures and Factories

**Test Data:**

Inline mock objects:
```typescript
const mockPlant = {
  id: "plant-123",
  userId: "user-456",
  name: "Tomate",
  latinName: "Solanum lycopersicum",
  category: "vegetable" as const,
  description: "Délicieuse tomate rouge",
  sowingDepthMm: 5,
  sowingSpacingCm: 50,
  germinationDaysMin: 5,
  germinationDaysMax: 10,
  growthDaysMin: 60,
  growthDaysMax: 80,
  sunRequirement: "full_sun" as const,
  waterRequirement: "medium" as const,
  notes: null,
  imageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

Object spreading for variations:
```typescript
const updatedPlant = { ...mockPlant, name: "Tomate cerise" };
const newPlantData = {
  userId: "user-456",
  name: "Carotte",
  category: "vegetable" as const,
};
const createdPlant = { ...mockPlant, ...newPlantData, id: "new-id" };
```

**Location:**
- Currently: Defined inline within test files (co-located)
- No separate fixtures directory

**Note:** As project grows, consider extracting to `__fixtures__/` or `test/factories/` for reuse.

## Coverage

**Requirements:**
- Backend: Coverage configuration present (`vitest run --coverage`)
- Coverage tool: `@vitest/coverage-v8` 4.0.18
- Report format: HTML coverage report generated in `coverage/` directory
- Current coverage: Not enforced (no threshold configured)

**View Coverage:**
```bash
pnpm test:coverage    # Backend coverage report
# View: open apps/backend/coverage/index.html
```

## Test Types

**Unit Tests:**
- Scope: Individual functions and methods
- Approach: Test pure functions and service methods with mocked dependencies
- Examples:
  - `string.utils.test.ts`: Tests utility functions (slugify, truncate)
  - `plants.service.test.ts`: Tests service methods with mocked db

Pattern:
```typescript
// Test utility function (no mocks needed for pure function)
it("devrait gérer les tirets multiples", () => {
  const result = slugify("hello   world");
  expect(result).toBe("hello-world");
});

// Test service method (mocks db layer)
it("devrait retourner une plante si elle existe", async () => {
  const mockSelect = vi.fn().mockReturnValue({ ... });
  (db.select as any).mockImplementation(mockSelect);

  const result = await plantsService.findById("plant-123", "user-456");

  expect(result).toEqual(mockPlant);
  expect(db.select).toHaveBeenCalled();
});
```

**Integration Tests:**
- Status: Not yet implemented
- Recommendation: Test service + db layer together
- Future structure: Test routes with mocked auth

**E2E Tests:**
- Framework: Playwright (mentioned in CLAUDE.md Phase 3)
- Status: Planned but not yet implemented
- Will be part of Phase 3

## Common Patterns

**Async Testing:**
```typescript
it("devrait créer une plante et la retourner", async () => {
  // Arrange
  const mockInsert = vi.fn().mockReturnValue({
    values: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([createdPlant]),
    }),
  });
  (db.insert as any).mockImplementation(mockInsert);

  // Act
  const result = await plantsService.create(newPlantData);

  // Assert
  expect(result).toEqual(createdPlant);
  expect(db.insert).toHaveBeenCalled();
});
```

**Error Testing (Null/Not Found):**
```typescript
it("devrait retourner null si la plante n'existe pas", async () => {
  // Arrange
  const mockSelect = vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue([]),  // Empty result
      }),
    }),
  });
  (db.select as any).mockImplementation(mockSelect);

  // Act
  const result = await plantsService.findById("inexistant", "user-456");

  // Assert
  expect(result).toBeNull();
});

it("devrait retourner false si la suppression échoue", async () => {
  // Arrange
  const mockDelete = vi.fn().mockReturnValue({
    where: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([]),  // Empty = no rows affected
    }),
  });
  (db.delete as any).mockImplementation(mockDelete);

  // Act
  const result = await plantsService.delete("inexistant", "user-456");

  // Assert
  expect(result).toBe(false);
});
```

**Assertion Patterns:**
```typescript
// Equality
expect(result).toBe(value);              // Strict equality (===)
expect(result).toEqual(mockPlant);       // Deep equality (for objects)
expect(result).toBeNull();               // Null check
expect(result).toBe(true/false);         // Boolean checks

// Mock verification
expect(db.select).toHaveBeenCalled();                    // Called at least once
expect(db.select).toHaveBeenCalledWith(expectedArgs);   // Called with specific args
expect(mockFunction).toHaveBeenCalledTimes(1);          // Called specific number of times
```

## Test Coverage Areas

**Currently Tested:**
- `apps/backend/src/utils/string.utils.ts`: 100% coverage (slugify, truncate)
- `apps/backend/src/services/plants.service.ts`: Partial coverage (CRUD operations)

**Coverage Gaps:**
- No frontend component tests (`apps/frontend/src/components/`)
- No route handler tests (API endpoints)
- No integration tests
- No E2E tests
- Database layer only tested via mocks
- Authentication middleware untested
- Error handling in routes untested

## Best Practices Observed

1. **Isolation:** Each test is independent; no shared state between tests
2. **Clarity:** Test names describe expected behavior, not implementation
3. **Arrange-Act-Assert:** Clear three-phase structure in every test
4. **Mock Reset:** `vi.clearAllMocks()` in beforeEach ensures clean slate
5. **Type Safety:** Test data properly typed with `as const` for enums

## Notes for Future Test Development

- **Phase 3 additions:**
  - Playwright E2E tests
  - Frontend component tests with Testing Library
  - Integration tests with real database (test database)
  - API route tests with auth context

- **Mock simplification:** Consider factory functions to reduce mock setup boilerplate
  - Pattern: `createMockPlant()`, `createMockDb()`
  - Location: `apps/backend/test/factories/` or `__mocks__/`

- **Coverage thresholds:** Configure minimum coverage requirements in vitest.config.ts
  ```typescript
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    exclude: ['node_modules/', 'dist/'],
    lines: 80,      // Minimum 80% line coverage
    functions: 80,
    branches: 80,
  }
  ```

---

*Testing analysis: 2026-02-02*
