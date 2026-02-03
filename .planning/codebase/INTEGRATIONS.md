# External Integrations

**Analysis Date:** 2026-02-03

## APIs & External Services

**Not detected** - Currently no external API integrations (Stripe, SendGrid, OpenAI, etc.)

The application is self-contained with internal APIs only. Future integrations may include:
- Email service for account verification
- Weather/climate API for sowing recommendations
- Plant database API for extended plant information

## Data Storage

**Databases:**
- PostgreSQL (Primary)
  - Connection: `DATABASE_URL` environment variable
  - Connection string format: `postgresql://user:password@localhost:5432/happyseeds`
  - Client: postgres 3.4.5
  - ORM: Drizzle ORM 0.45.1
  - Schema location: `apps/backend/src/db/schema/`
  - Tables: `plant`, `seeds`, `users`, `sessions`, `accounts`, `verifications`

**File Storage:**
- Local filesystem only (no cloud storage integration)
- Session 2.4.c TODO: Image storage not yet implemented (commented out in `apps/backend/src/db/schema/plant.schema.ts` line 84)

**Caching:**
- Better-Auth cookie caching (session-level)
  - Cache duration: 5 minutes
  - Enabled by default in `apps/backend/src/lib/auth.ts`
- No distributed cache (Redis/Memcached)

## Authentication & Identity

**Auth Provider:**
- better-auth 1.4.17 - Self-hosted session-based authentication
  - Implementation: Drizzle ORM adapter with PostgreSQL
  - Backend config: `apps/backend/src/lib/auth.ts`
  - Frontend client: `apps/frontend/src/lib/auth-client.ts`

**Features:**
- Email & password authentication
  - Minimum password length: 8 characters
  - Enabled in `apps/backend/src/lib/auth.ts`
- Session management
  - Expiry: 7 days
  - Refresh age: Daily
  - Secure cookies with CORS support
- Email verification (infrastructure present, not actively used yet)

**Database Tables:**
- `users` - User accounts and profiles
- `sessions` - Active sessions with token, IP, user agent
- `accounts` - OAuth/linked accounts (extensible for future OAuth)
- `verifications` - Email/identity verification tokens

**Routes:**
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session
- All routes handled by better-auth middleware in `apps/backend/src/routes/auth.routes.ts`

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking service integrated (Sentry, Datadog, etc.)

**Logs:**
- Console logging only
  - Backend: `hono/logger` middleware on all requests (`apps/backend/src/app.ts` line 17)
  - Frontend: Browser console (development mode via DevTools)

**Performance:**
- No APM service integrated
- web-vitals 5.1.0 available in frontend (installed but not actively used for reporting)

## CI/CD & Deployment

**Hosting:**
- Not deployed - Local development only at this stage
- Intended platforms: TBD (not documented)

**CI Pipeline:**
- Not detected - No GitHub Actions, GitLab CI, or other pipeline configured
- Manual testing and building via `pnpm` commands

## Environment Configuration

**Required env vars:**

Backend:
- `DATABASE_URL` - PostgreSQL connection (critical, throws error if missing)
- `FRONTEND_URL` - CORS origin (defaults to localhost:3000)
- `BACKEND_URL` - better-auth base URL (defaults to localhost:3001)
- `PORT` - Server port (defaults to 3001)
- `NODE_ENV` - Runtime environment

Frontend:
- `VITE_API_URL` - Backend API URL (defaults to localhost:3001)

**Secrets location:**
- `.env` files in `apps/backend/` and `apps/frontend/` (git-ignored)
- Example files provided: `.env.example` in each app directory
- No secret management service configured (Vault, AWS Secrets Manager, etc.)

## Webhooks & Callbacks

**Incoming:**
- Not detected - No webhook endpoints for external services

**Outgoing:**
- Not detected - No outbound webhooks to external services
- Future use cases: Sowing reminders, inventory alerts, harvest notifications

## Cross-Origin Resource Sharing (CORS)

**Configuration:**
- Backend: `apps/backend/src/app.ts` (line 20-26)
  - Origin: `FRONTEND_URL` environment variable
  - Credentials: Enabled (allows session cookies cross-origin)
  - Methods: All (POST, GET, PUT, PATCH, DELETE via Hono defaults)

**Session Cookie:**
- Secure cookie with httpOnly flag (better-auth standard)
- SameSite attribute: Strict (default better-auth)
- Domain scoped to trusted origins

## API Response Format

**Standardized Response Structure:**

Success:
```typescript
{
  success: true;
  data: T;
}
```

Error:
```typescript
{
  success: false;
  error: {
    code: string;      // e.g., "VALIDATION_ERROR", "NOT_FOUND", "UNAUTHORIZED"
    message: string;
    details?: object;  // Field-level validation errors
  }
}
```

Implementation: `apps/frontend/src/lib/api-client.ts` (lines 8-34)

---

*Integration audit: 2026-02-03*
