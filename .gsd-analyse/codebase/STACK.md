# Technology Stack

**Analysis Date:** 2026-02-02

## Languages

**Primary:**
- TypeScript 5.7.3 - Full stack (backend, frontend, shared types)

**Secondary:**
- JavaScript (via TypeScript transpilation)

## Runtime

**Environment:**
- Node.js ≥18 (no specific version pinned, currently v24.13.0 in environment)

**Package Manager:**
- pnpm 10.28.2
- Lockfile: `pnpm-lock.yaml` present

## Frameworks

**Core Backend:**
- Hono 4.7.4 - Lightweight HTTP server/API framework
- @hono/node-server 1.14.0 - Node.js server adapter for Hono

**Core Frontend:**
- TanStack Start 1.132.0 - Full-stack React framework with SSR support
- TanStack Router 1.132.0 - File-based routing for React
- React 19.2.0 - UI library
- React DOM 19.2.0 - React DOM rendering

**Database:**
- Drizzle ORM 0.45.1 - TypeScript ORM for PostgreSQL
- postgres 3.4.5 - PostgreSQL client
- drizzle-kit 0.31.8 - Drizzle migration and schema tools

**Form & Validation:**
- React Hook Form 7.71.1 - Form state management
- @hookform/resolvers 5.2.2 - Validation resolver integration
- Zod 3.25.76 (backend), 3.24.1 (shared) - Schema validation and type inference

**Authentication:**
- better-auth 1.4.17 (backend: ^1.4.17, frontend: ^1.4.17) - Session-based authentication framework

**Styling:**
- TailwindCSS 4.0.6 - Utility-first CSS framework
- @tailwindcss/vite 4.0.6 - Vite plugin for Tailwind
- shadcn/ui - Component library (via Radix UI primitives + Tailwind)
- Radix UI components:
  - @radix-ui/react-label 2.1.8
  - @radix-ui/react-slot 1.2.4
- tailwind-merge 3.0.2 - Utility class merging
- clsx 2.1.1 - Conditional class names
- class-variance-authority 0.7.1 - Component variants
- lucide-react 0.561.0 - Icon library

**Data Fetching & State:**
- @tanstack/react-query 5.90.20 - Server state management
- @tanstack/react-router-ssr-query 1.131.7 - Query integration for SSR

**Build & Development:**
- Vite 7.1.7 - Frontend build tool
- @vitejs/plugin-react 5.0.4 - React plugin for Vite
- vite-tsconfig-paths 6.0.2 - TypeScript path alias resolution
- @tanstack/router-plugin 1.132.0 - TanStack Router Vite plugin
- Nitro (nightly) - Server runtime/middleware layer

**Testing:**
- Vitest 4.0.18 (backend), 3.0.5 (frontend) - Unit/integration test runner
- @vitest/coverage-v8 4.0.18 - Code coverage reporting
- @testing-library/react 16.2.0 - React component testing utilities
- @testing-library/dom 10.4.0 - DOM testing utilities
- jsdom 27.0.0 - DOM implementation for testing

**Development & Dev Tools:**
- tsx 4.19.2 - TypeScript execution for Node
- @tanstack/react-devtools 0.7.0 - React debugging tools
- @tanstack/react-router-devtools 1.132.0 - Router debugging
- @tanstack/devtools-vite 0.3.11 - Vite devtools integration

**Code Quality & Formatting:**
- Prettier 3.2.5 - Code formatter (root package)
- TypeScript strict mode enabled

**Build & Bundling:**
- Turborepo 2.8.0 - Monorepo task orchestration
- tsc - TypeScript compiler (build script)

**Utilities:**
- dotenv 16.4.7 - Environment variable loading
- tw-animate-css 1.3.6 - Tailwind animation utilities

## Key Dependencies

**Critical (Core Application):**
- Hono - HTTP framework foundation
- Drizzle ORM - Type-safe database layer
- React + TanStack Start - UI framework with SSR
- better-auth - Authentication system
- PostgreSQL driver - Database connectivity

**Infrastructure:**
- Turborepo - Build orchestration and monorepo management
- Vite - Frontend bundling and dev server
- Drizzle Kit - Schema migrations and introspection

## Configuration

**Environment:**
- `DATABASE_URL` - PostgreSQL connection string (required)
- `BACKEND_URL` - Backend server URL (defaults to `http://localhost:3001`)
- `FRONTEND_URL` - Frontend URL for CORS (defaults to `http://localhost:3000`)
- `VITE_API_URL` - Frontend API endpoint (defaults to `http://localhost:3001`)

**Build:**
- Root: `tsconfig.json` (via Prettier + TypeScript in root)
- Backend: `apps/backend/tsconfig.json` - ES2022 target, ESNext modules
- Frontend: `apps/frontend/tsconfig.json` - ES2022 target, JSX react-jsx
- Drizzle: `apps/backend/drizzle.config.ts` - PostgreSQL dialect configuration

**TypeScript Configuration:**
- Backend:
  - Target: ES2022
  - Module: ESNext
  - Strict: true
  - Output: `./dist`
  - Root: `./src`
- Frontend:
  - Target: ES2022
  - Module: ESNext
  - Strict: true
  - JSX: react-jsx
  - No emit (type checking only)

## Platform Requirements

**Development:**
- Node.js ≥18
- PostgreSQL database
- pnpm package manager

**Production:**
- Node.js ≥18 (for backend with `@hono/node-server`)
- PostgreSQL database
- Environment variables: DATABASE_URL, BACKEND_URL, FRONTEND_URL

## Architecture Patterns

**Monorepo Structure:**
- Turborepo orchestrates tasks across workspaces
- `apps/backend` - Hono API server with Drizzle ORM
- `apps/frontend` - TanStack Start React application
- `packages/shared-types` - Shared Zod schemas for type safety across stack

**API Communication:**
- HTTP REST API from Hono backend
- Frontend uses fetch-based API client with custom error handling
- better-auth handles authentication endpoints (proxied through Hono)

**Type Safety:**
- Zod for runtime validation (both backend and frontend)
- TypeScript strict mode enforced
- Type inference from Drizzle schema
- Schemas centralized in `packages/shared-types`

---

*Stack analysis: 2026-02-02*
