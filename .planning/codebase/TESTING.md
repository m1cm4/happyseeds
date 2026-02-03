# Testing Patterns

**Analysis Date:** 2026-02-03

## Test Framework

**Runner:**
- Vitest 4.0.18
- Config: `apps/backend/vitest.config.ts`
- Environment: Node.js (for backend tests)

**Assertion Library:**
- Vitest built-in `expect` (globals enabled)

**Run Commands:**
```bash
pnpm test               # Run all tests once
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Generate coverage report
```

**TypeScript Configuration for Tests:**
- `tsconfig.json` includes `"vitest/globals"` in types
- Enables `describe`, `it`, `expect` without explicit imports
- Test timeout: 5000ms default (configurable per test)

## Test File Organization

**Location:**
- Co-located with source files in same directory
- Pattern: `{source}.test.ts` or `{source}.spec.ts`

**Naming:**
- Test files: `*.test.ts` format (observed in codebase)
- Example: `string.utils.test.ts`, `plants.service.test.ts`

**Structure:**
```
apps/backend/src/
├── utils/
│   ├── string.utils.ts
│   └── string.utils.test.ts        # Co-located test
├── services/
│   ├── plant.service.ts
│   └── plants.service.test.ts       # Co-located test
```

## Test Structure

**Suite Organization:**

From `string.utils.test.ts`:
```typescript
import { slugify, truncate } from "./string.utils";

describe("string.utils", () => {
  describe("slugify", () => {
    it("devrait convertir en minuscule", () => {
      // Arrange
      const input = "HELLOWORLD";

      // Act
      const result = slugify(input);

      // Assert
      expect(result).toBe("helloworld");
    });

    it("devrait remplacer espaces par des tirets", () => {
      const result = slugify("hello world");
      expect(result).toBe("hello-world");
    });
  });

  describe("truncate", () => {
    it("devrait retourner la chaîne intacte si elle est plus courte que maxLength", () => {
      const result = truncate("Hello", 10);
      expect(result).toBe("Hello");
    });
  });
});
```

**Patterns:**

1. **Nested describe blocks:** Organize by function/method being tested
2. **AAA pattern:** Arrange → Act → Assert (comments visible in tests)
3. **Descriptive test names:** French language, describe expected behavior (e.g., "devrait convertir en minuscule")
4. **One assertion per test (mostly):** Some tests combine related assertions

## Mocking

**Framework:** Vitest built-in `vi` module

**Patterns:**

From `plants.service.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the entire db module
vi.mock("../db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { db } from "../db";
import { plantsService } from "./plant.service";

describe("plantsService", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("devrait retourner une plante si elle existe", async () => {
      // Arrange: Configure the mock chain
      const mockSelect = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockPlant]),
          }),
        }),
      });
      (db.select as any).mockImplementation(mockSelect);

      // Act
      const result = await plantsService.findById("plant-123");

      // Assert
      expect(result).toEqual(mockPlant);
      expect(db.select).toHaveBeenCalled();
    });
  });
});
```

**What to Mock:**
- Database layer (`../db`) - replace with mock implementations
- External dependencies
- Async operations that would slow tests

**What NOT to Mock:**
- Utility functions being tested
- Internal service logic (test actual behavior)
- Pure functions (test actual output)

**Mock Setup Pattern:**
1. Use `vi.mock()` at top of file to intercept imports
2. Configure mock in `beforeEach()` for each specific test
3. Use `vi.clearAllMocks()` in `beforeEach()` to reset state
4. Cast to `any` when mocking Drizzle's fluent API chains

**Drizzle Query Mocking:**
For Drizzle's chainable query builder:
```typescript
// Mock the entire chain from select() through limit()
const mockSelect = vi.fn().mockReturnValue({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockReturnValue({
      limit: vi.fn().mockResolvedValue([mockPlant]),  // Return promise
    }),
  }),
});
(db.select as any).mockImplementation(mockSelect);
```

## Fixtures and Factories

**Test Data:**

From `plants.service.test.ts`:
```typescript
const mockPlant = {
  id: "plant-123",
  authorId: "user-456",
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

**Location:**
- Defined at top of test file, above test suites
- Reused across multiple related tests
- Mutations (e.g., `{ ...mockPlant, name: "Tomate cerise" }`) create variations

## Coverage

**Requirements:** Not enforced (no coverage threshold configured)

**View Coverage:**
```bash
pnpm test:coverage
```

Generates coverage reports (tool configured in `vitest.config.ts` via `@vitest/coverage-v8`)

## Test Types

**Unit Tests:**
- Scope: Individual functions and methods
- Approach: Test with mocked dependencies
- Example: `string.utils.test.ts` tests `slugify()` and `truncate()` directly
- Example: `plants.service.test.ts` tests service methods with mocked DB

**Integration Tests:**
- Scope: Not yet implemented (Phase 3 future work)
- Would test service + DB together
- Planned framework: Vitest

**E2E Tests:**
- Framework: Playwright (mentioned in CLAUDE.md for Phase 3)
- Not yet implemented
- Would test full user workflows from UI

## Common Patterns

**Async Testing:**

From `plants.service.test.ts`:
```typescript
it("devrait retourner une plante si elle existe", async () => {
  const mockSelect = vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue([mockPlant]),  // mockResolvedValue for async
      }),
    }),
  });
  (db.select as any).mockImplementation(mockSelect);

  const result = await plantsService.findById("plant-123");  // await the async call
  expect(result).toEqual(mockPlant);
});
```

Key points:
- Use `async` in test function signature
- Use `mockResolvedValue()` for mocks that return promises
- `await` service calls that return promises

**Error Testing:**

From `plants.service.test.ts`:
```typescript
it("devrait retourner null si la plante n'existe pas", async () => {
  const mockSelect = vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue([]),  // Empty array = not found
      }),
    }),
  });
  (db.select as any).mockImplementation(mockSelect);

  const result = await plantsService.findById("inexistant");
  expect(result).toBeNull();  // Verify null return
});
```

Patterns for error cases:
- Return empty arrays for not-found scenarios
- Test truthy/falsy checks (`expect(result).toBeNull()`, `expect(result).toBe(false)`)
- No exception throwing in observed tests (services return null/false instead)

**Boolean Return Testing:**

From `plants.service.test.ts`:
```typescript
describe("delete", () => {
  it("devrait retourner true si la suppression a réussi", async () => {
    const mockDelete = vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: "plant-123" }]),  // Has data = success
      }),
    });
    (db.delete as any).mockImplementation(mockDelete);

    const result = await plantsService.delete("plant-123", "user-456");
    expect(result).toBe(true);  // Length > 0 = true
  });

  it("devrait retourner false si la plante n'existe pas", async () => {
    const mockDelete = vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([]),  // Empty = false
      }),
    });
    (db.delete as any).mockImplementation(mockDelete);

    const result = await plantsService.delete("inexistant", "user-456");
    expect(result).toBe(false);  // Length === 0 = false
  });
});
```

## Current Test Coverage

**Tested:**
- `apps/backend/src/utils/string.utils.ts` - Full coverage (slugify, truncate)
- `apps/backend/src/services/plants.service.ts` - Partial coverage (findById, create, update, delete methods)

**Not Tested:**
- Frontend components (no tests found in `apps/frontend/`)
- API route handlers (tests in service, but not routes themselves)
- Integration scenarios
- E2E workflows

## Frontend Testing (Future Pattern)

While not yet implemented, frontend testing would follow similar patterns:

**Components:**
- Would test via testing-library-react (or Vitest setup)
- Mock TanStack Query hooks
- Test rendering and user interactions

**Hooks:**
- Test with `renderHook()` from testing-library/react
- Mock `queryClient` for TanStack Query hooks

**Services:**
- Mock `request()` helper from `lib/api-client.ts`
- Verify correct endpoints called

---

*Testing analysis: 2026-02-03*
