# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HappySeeds is a seed library management and sowing planning web application. Users catalog seed collections, consult plant profiles, and create optimized sowing calendars based on climate data.

**Current Status**: Project is in scaffolding phase - configuration drafts exist in `.drafts/` but need to be moved to root and actual code written.

## Technology Stack

- **Monorepo**: Turborepo with pnpm 10.27.0
- **Backend**: Hono + Drizzle ORM + PostgreSQL + Better-Auth
- **Frontend**: TanStack Start + TanStack Router + TanStack Query + shadcn/ui + TailwindCSS
- **Shared**: Zod schemas in `packages/shared-types/`
- **Language**: TypeScript 5.9.2
- **Testing** (Phase 3): Vitest + Playwright

## Commands

```bash
# Development
pnpm dev              # Start all apps in dev mode (via Turborepo)
pnpm build            # Build all apps
pnpm lint             # Lint all apps
pnpm check-types      # TypeScript type checking
pnpm format           # Format with Prettier

# Database (from apps/backend/)
pnpm drizzle-kit generate    # Generate migrations
pnpm drizzle-kit migrate     # Run migrations
pnpm drizzle-kit studio      # Open Drizzle Studio GUI
```

## Project Structure

```
happyseeds/
├── apps/
│   ├── backend/           # Hono API server
│   │   └── src/
│   │       ├── db/        # Drizzle schemas & migrations
│   │       ├── routes/    # API routes (auth, plants, seeds, sessions, etc.)
│   │       ├── services/  # Business logic
│   │       └── middleware/
│   └── frontend/          # TanStack Start app
│       └── app/
│           ├── routes/    # File-based routing
│           ├── components/
│           ├── hooks/
│           └── lib/       # API client (Hono RPC)
├── packages/
│   └── shared-types/      # Zod schemas & TypeScript types
├── .drafts/               # Configuration drafts (move to root when scaffolding)
└── skills/                # AI assistant skill definitions
```

## Architecture Patterns

### Type Safety Across Stack
- Zod schemas in `packages/shared-types/` define all entities
- Backend uses schemas for request validation
- Frontend infers types from schemas
- Hono RPC provides fully-typed API calls

### API Error Format
```typescript
{
  success: false;
  error: {
    code: string;      // "VALIDATION_ERROR", "NOT_FOUND", "UNAUTHORIZED"
    message: string;
    details?: object;  // Field-level validation errors
  }
}
```

### Database Entities
User → owns → Plants, Seeds, SowingSessions
Plant → has → Seeds (varieties), companion relationships (many-to-many via junction table)
SowingSession → contains → SowingEntries → has → Observations

### Frontend State
- **Server state**: TanStack Query (all API data)
- **Form state**: React Hook Form + Zod
- **URL state**: TanStack Router (filters, pagination, search)

## AI Skills (in `/skills/`)

This project includes specialized AI assistant configurations:

### dev-mentor
For learning-focused development. Key behaviors:
- **Never edits files directly** - shows code with explanations
- Uses session-based vertical slices (typing → DB → backend → frontend per entity)
- Assesses learner skill level before starting
- Guides debugging rather than providing solutions
- Includes git workflow teaching (feature branches, conventional commits)

Commands: `next`, `explain [concept]`, `why [decision]`, `recap`, `review`, `debug`, `docs [topic]`

### dev-assistant
For rapid implementation. Key behaviors:
- Edits files directly
- Minimal explanations unless asked
- Follows linear development flow
- Speed-focused while maintaining quality

Commands: `implement`, `fix`, `refactor`, `add`, `explain`, `review`, `test`

### frontend-design-skill
For distinctive, high-quality frontend design. Emphasizes bold aesthetic direction over generic patterns.

## Git Workflow

**Commit format**: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore

**Branch naming**: `feature/[session-name]` or `feature/[feature-name]`

## Key Files Reference

- **Full Development Plan**: `.drafts/plan_draft.md` (database schema, API endpoints, frontend structure, development phases)
- **Package Configuration Draft**: `.drafts/package_draft.json`
- **Turborepo Config Draft**: `.drafts/turbo_draft.json`
- **Dev Mentor Skill**: `skills/dev-mentor-skill/SKILL.md`
- **Assessment Guide**: `skills/dev-mentor-skill/references/assessment-guide.md`
