# Technology Stack

**Analysis Date:** 2026-02-03

## Languages

**Primary:**
- TypeScript 5.7.3 - Used across entire monorepo (backend, frontend, shared types)
- JavaScript/JSX - React components in frontend

**Secondary:**
- SQL - PostgreSQL database queries via Drizzle ORM

## Runtime

**Environment:**
- Node.js >= 18
- Browser runtime for React 19.2.0

**Package Manager:**
- pnpm 10.28.2
- Lockfile: pnpm-lock.yaml (implicit, monorepo standard)

## Frameworks

**Core:**
- Hono 4.7.4 - Lightweight HTTP server framework for backend API
- TanStack Start 1.132.0 - Full-stack React framework for frontend
- TanStack Router 1.132.0 - File-based routing in frontend (`src/routes/`)
- TanStack Query 5.90.20 - Server state management and data fetching

**UI & Styling:**
- React 19.2.0 - UI component library
- React DOM 19.2.0 - React rendering
- React Hook Form 7.71.1 - Form state management
- TailwindCSS 4.0.6 - Utility-first CSS framework
- shadcn/ui (via Radix UI) - Component library
  - @radix-ui/react-label 2.1.8
  - @radix-ui/react-slot 1.2.4
- class-variance-authority 0.7.1 - Component variant management
- clsx 2.1.1 - Conditional className utility
- tailwind-merge 3.0.2 - Merge Tailwind classes
- lucide-react 0.561.0 - Icon library
- tw-animate-css 1.3.6 - Animation utilities

**Authentication:**
- better-auth 1.4.17 (backend 1.4.17, frontend 1.4.17) - Full-stack authentication
  - Session-based with secure cookies
  - Email/password authentication
  - Session expiry: 7 days with daily refresh

**Testing:**
- Vitest 4.0.18 (backend), 3.0.5 (frontend) - Unit and integration test runner
- @vitest/coverage-v8 4.0.18 - Code coverage reporting
- @testing-library/react 16.2.0 - React component testing utilities
- @testing-library/dom 10.4.0 - DOM testing utilities
- jsdom 27.0.0 - DOM environment for testing

**Build/Dev:**
- Vite 7.1.7 - Frontend build tool and dev server
- esbuild - Code bundler (via onlyBuiltDependencies in workspace)
- Turbo 2.8.0 - Monorepo build orchestration
- tsx 4.19.2 - TypeScript Node.js runner (dev mode)
- @vitejs/plugin-react 5.0.4 - React plugin for Vite
- vite-tsconfig-paths 6.0.2 - TypeScript path aliases in Vite
- @tanstack/router-plugin 1.132.0 - File-based routing plugin
- @tanstack/devtools-vite 0.3.11 - Developer tools for TanStack

**Database:**
- PostgreSQL - Primary database (configured via DATABASE_URL)
- Drizzle ORM 0.45.1 - Type-safe ORM for database queries
- drizzle-kit 0.31.8 - Migration management and schema tooling
- postgres 3.4.5 - PostgreSQL client library

**Validation & Serialization:**
- Zod 3.25.76 - Runtime schema validation
- @hono/zod-validator 0.7.6 - Zod validation middleware for Hono
- @hookform/resolvers 5.2.2 - Form validation resolver for React Hook Form

**Developer Tools:**
- Prettier 3.2.5 - Code formatter
- TypeScript 5.7.3 - Type checking (CLI: tsc --noEmit)
- dotenv 16.4.7 - Environment variable loader
- @tanstack/react-devtools 0.7.0 - Query DevTools
- @tanstack/react-router-devtools 1.132.0 - Router DevTools
- web-vitals 5.1.0 - Web performance metrics
- unrs-resolver - ESM resolver for workspace dependencies

**Server:**
- @hono/node-server 1.14.0 - Hono Node.js server adapter

## Key Dependencies

**Critical:**
- Drizzle ORM & postgres - Data persistence layer, required for all database operations
- better-auth - Authentication provider, gates all protected endpoints
- Hono - Backend server, handles all API requests
- TanStack Query - Client-side data synchronization
- TanStack Router - Frontend navigation and route handling

**Infrastructure:**
- Zod - Input validation for API endpoints and forms across stack
- Vite - Development and production build for frontend
- Turbo - Build caching and task orchestration across monorepo

## Configuration

**Environment:**
Backend (`apps/backend/.env.example`):
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string (required)
- `BACKEND_URL` - Backend base URL for better-auth (default: http://localhost:3001)
- `FRONTEND_URL` - Frontend origin for CORS (default: http://localhost:3000)

Frontend (`apps/frontend/.env.example`):
- `VITE_API_URL` - Backend API base URL (default: http://localhost:3001)

**Build:**
- Backend: TypeScript compilation to `dist/`
  - Config: `apps/backend/tsconfig.json`
  - Drizzle config: `apps/backend/drizzle.config.ts`
  - Output: ES2022, ESNext modules

- Frontend: Vite build to `dist/`
  - Config: `apps/frontend/tsconfig.json`
  - Path aliases: `@/*` maps to `src/*`
  - Output: ES2022, React JSX

## Platform Requirements

**Development:**
- Node.js >= 18
- pnpm >= 10.28.2
- PostgreSQL 12+ (running locally or remote)

**Production:**
- Node.js runtime (backend server)
- PostgreSQL 12+ database
- Static file hosting or Node.js server for frontend SPA

---

*Stack analysis: 2026-02-03*
