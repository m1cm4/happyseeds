# Checkpoint - État du projet HappySeeds

> Ce fichier résume l'état actuel du développement pour reprendre facilement après une pause.
> **Dernière mise à jour** : 2026-02-27

---

## Core Value

**L'utilisateur peut gérer sa collection de graines et planifier ses semis visuellement sur un calendrier.**

→ Si un arbitrage est nécessaire, cette phrase tranche.

---

## Session en cours

### Session 5.1 : API Calendrier

**État** : ◆ EN COURS

**Branche** : `feature/session5.1-calendar-api`

**Dernière session terminée** : Session 4.3 - Sowing Sessions UI (✅ TERMINÉE)

### Context pour reprendre

**Dernière action :** Fichier session créé (`cours/session5.1-calendar-api.md`)

**Prochaine action :** Suivre les 6 étapes de la session (types shared → service → routes → montage → export → test)

**Fichiers clés à créer :**
- `packages/shared-types/src/schemas/calendar.schema.ts` — types calendrier
- `apps/backend/src/services/calendar.service.ts` — service d'agrégation avec jointures
- `apps/backend/src/routes/calendar.routes.ts` — endpoint GET /api/calendar

**Fichier d'instructions :** `cours/session5.1-calendar-api.md`

### Blockers

Aucun actuellement.

### Notes techniques (session 4.3)

- Pattern de suppression des ré-exports : `@types/` ne contient plus que les types frontend-specific, imports directs depuis `@happyseeds/shared-types`
- `radix-ui` (unifié) remplace `@radix-ui/react-label` dans label.tsx
- `routeTree.gen.ts` régénéré automatiquement par TanStack Router

---

## Key Decisions (session 4.3)

| Decision                                  | Rationale                                          | Outcome |
| ----------------------------------------- | -------------------------------------------------- | ------- |
| Import direct depuis shared-types         | Supprimer l'indirection des ré-exports @types/     | ✓ Good  |
| Formulaire simple (pas wizard)            | MVP suffisant, wizard pour une future itération    | — Pending |
| Badge de status coloré                    | UX visuelle rapide pour identifier l'état          | ✓ Good  |

---

## Sessions terminées

| Session                                      | Status | Branche Git                            | Notes                           |
| -------------------------------------------- | ------ | -------------------------------------- | ------------------------------- |
| 0.1 - Monorepo & TypeScript                  | ✅     | feature/session0.1-monorepo-sharedtype | —                               |
| 0.2 - Backend Hono                           | ✅     | feature/session0.2-backend-hono        | —                               |
| 0.3 - Database Drizzle                       | ✅     | feature/session0.3-database-drizzle    | —                               |
| 0.4 - Frontend TanStack Start                | ✅     | feature/session0.4-frontend-tanstack   | —                               |
| 1.1 - Auth Backend                           | ✅     | feature/session1.1-auth                | Better-Auth                     |
| 1.2 - Auth Frontend + Middleware             | ✅     | develop                                | Fusionne planning 1.2 + 1.3     |
| 1.3 - Protection Routes                      | ✅     | feature/1.3-route-protection           | —                               |
| 2.0 - Introduction Vitest                    | ✅     | feature/2.0-vitest                     | Session bonus                   |
| 2.1 - Plants API Backend                     | ⚠️     | feature/2.1-plants-api                 | Fichier session vide (0 lignes) |
| 2.2 - Frontend Plants Liste & TanStack Query | ✅     | feature/session2.2-frontend-plants     | Fusionne planning 2.2 + 2.3     |
| 2.3.1 - Plants Forms Preparation             | ✅     | feature/session2.3-plants-forms        | Partie 1 de planning 2.4        |
| 2.3.2 - Plants Forms Pages                   | ✅     | feature/session2.3-plants-forms        | Partie 2 de planning 2.4 + 2.5  |
| 2.4 - Seeds Schema & API Backend             | ✅     | feature/session2.4-seeds               | Schema, service, routes backend  |
| 2.5 - Seeds Frontend UI                      | ✅     | feature/session2.4-seeds               | Types, hooks, form, pages        |
| 2.4b - Refactoring Plant/Seed                | ✅     | feature/session2.4-seeds               | snake_case, nouveaux champs     |
| 3.1 - Navigation & UX                       | ✅     | feature/session3.1-navigation-ux       | Header, breadcrumbs, seeds list |
| 4.1 - SowingSession Schema & API            | ✅     | feature/session4.2-sowing-entry        | Zod, Drizzle, service, routes   |
| 4.2 - SowingEntry Schema & API              | ✅     | feature/session4.2-sowing-entry        | Middleware ownership, nested routes |
| 4.3 - Sowing Sessions UI                    | ✅     | feature/session4.3-sowing-sessions-ui  | Types, service, hooks, form, pages, nav |

---

## Prochaines sessions (Roadmap)

| Session | Description                                                | Requirements |
| ------- | ---------------------------------------------------------- | ------------ |
| 5.1     | Calendar - API optimisée (agrégation + jointures)          | CAL-01       |
| 5.2     | Calendar - Composant vue mensuelle                         | CAL-02,03    |
| 6.1     | Dashboard - API Statistiques                               | DASH-01,02   |
| 6.2     | Dashboard - Page Dashboard                                 | DASH-03,04   |
| 6.3     | Polish UX - Error boundaries, responsive                   | UX-01..04    |

**Voir** : `PLANNING.md` pour les descriptions détaillées de chaque session.

---

## Architecture actuelle

### Backend (apps/backend/src/)

```
db/schema/
├── plant.schema.ts          ✅ Refactorisé (snake_case, nouveaux champs)
├── seed.schema.ts           ✅ (+userLabel, +acquisitionDatePrecision)
├── sowing-session.schema.ts ✅ pgEnum, pgTable, relations (4.1)
├── sowing-entry.schema.ts   ✅ pgEnum×2, pgTable, relations (4.2)
└── auth.schema.ts           ✅

services/
├── plant.service.ts          ✅ Adapté
├── seed.service.ts           ✅ Adapté
├── sowing-session.service.ts ✅ CRUD + filtres + pagination (4.1)
├── sowing-entry.service.ts   ✅ CRUD + verifySessionOwnership (4.2)
└── calendar.service.ts       ○ À faire (5.1)

routes/
├── plant.routes.ts           ✅
├── seed.routes.ts            ✅
├── sowing-session.routes.ts  ✅ 5 endpoints REST (4.1)
├── sowing-entry.routes.ts    ✅ Nested routes + middleware ownership (4.2)
├── auth.routes.ts            ✅
└── calendar.routes.ts        ○ À faire (5.1)
```

### Frontend (apps/frontend/src/)

```
routes/_authenticated/
├── plants/            ✅
│   ├── index.tsx      ✅ Liste
│   ├── new.tsx        ✅ Form
│   ├── $id.index.tsx  ✅ Détail + SeedsSection
│   └── $id.edit.tsx   ✅ Form édition
├── seeds/             ✅
│   ├── index.tsx      ✅ Liste (session 3.1)
│   ├── new.tsx        ✅ Form
│   ├── $id.edit.tsx   ✅ Form édition
│   └── route.tsx      ✅ Layout
├── sowing-sessions/   ✅ (session 4.3)
│   ├── index.tsx      ✅ Liste + badges status
│   └── new.tsx        ✅ Form création
├── dashboard/         ✅

components/
├── layout/
│   ├── app-header.tsx     ✅ + lien Sessions (4.3)
│   └── breadcrumbs.tsx    ✅
├── plant/                 ✅
├── seed/                  ✅
└── sowing-session/        ✅ (session 4.3)
    ├── sowing-session-form.tsx         ✅
    └── sowing-session-list-element.tsx ✅

hooks/
├── usePlant.ts            ✅
├── useSeed.ts             ✅
└── useSowingSession.ts    ✅ (session 4.3)

services/
├── plant.service.ts            ✅
├── seed.service.ts             ✅
└── sowing-session.service.ts   ✅ (session 4.3)
```

### Shared (packages/shared-types/)

```
schemas/
├── plant.schema.ts          ✅
├── seed.schema.ts           ✅
├── sowing-session.schema.ts ✅
├── sowing-entry.schema.ts   ✅
├── calendar.schema.ts       ○ À faire (5.1)
├── common.schema.ts         ✅
└── index.ts                 ✅
```

---

## Commandes utiles

```bash
# Lancer tout le projet
pnpm dev

# Database
cd apps/backend
pnpm drizzle-kit generate    # Générer migration
pnpm drizzle-kit migrate     # Appliquer migration
pnpm drizzle-kit studio      # GUI Drizzle

# Type checking
pnpm check-types
```

---

## Rappels importants

- **Ordre de modification** : Zod (shared-types) → Drizzle (backend) → Migration → Backend → Frontend
- **Import pattern** : Importer les types partagés directement depuis `@happyseeds/shared-types` (plus de ré-export via `@types/`)
- **Auth transitions** : Utiliser `window.location.href` (pas `navigate()`) après login/logout
- **Skill dev-mentor** : Montre le code dans les fichiers `cours/session*.md`, l'étudiant écrit

---

## Liens utiles

- **Planning général** : `PLANNING.md`
- **Session en cours** : `cours/session5.1-calendar-api.md`
- **Dernière session** : `cours/session4.3-sowing-sessions-ui.md`
