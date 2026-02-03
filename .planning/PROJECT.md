# HappySeeds

## What This Is

Application web de gestion de grainothèque et de planification des semis. Les utilisateurs cataloguent leur collection de graines, consultent des fiches plantes détaillées, et créent des calendriers de semis optimisés selon leur zone climatique.

Projet d'apprentissage fullstack : TypeScript, TanStack, Hono, Drizzle ORM, Turborepo.

## Core Value

L'utilisateur peut gérer sa collection de graines et planifier ses semis visuellement sur un calendrier.

## Requirements

### Validated

- ✓ Monorepo Turborepo + pnpm workspaces — session 0.1
- ✓ Backend Hono avec route health — session 0.2
- ✓ Database PostgreSQL + Drizzle ORM — session 0.3
- ✓ Frontend TanStack Start + shadcn/ui — session 0.4
- ✓ Auth : inscription, connexion, sessions — sessions 1.1-1.4
- ✓ Plants CRUD : liste, création, édition, suppression — sessions 2.1-2.4
- ✓ Seeds CRUD : liste, création, édition, suppression — session 2.4

### Active

- [ ] Refactoring schémas Plant/Seed (snake_case, nouveaux champs) — session 2.4b
- [ ] Plant detail page améliorée + delete confirmation — session 2.5
- [ ] Seeds UI complète + navigation — sessions 3.1-3.3
- [ ] Sowing Sessions : création, entries, wizard — sessions 4.1-4.3
- [ ] Vue calendrier interactive — sessions 5.1-5.2
- [ ] Dashboard avec stats et tâches à venir — sessions 6.1-6.3

### Out of Scope

- Mobile app native — web-first, mobile plus tard
- Real-time notifications — complexité excessive pour MVP
- OAuth (Google, GitHub) — email/password suffit pour v1
- Upload d'images — URLs externes pour MVP, upload en v2
- Multi-langue — français uniquement pour MVP

## Context

**État actuel (session 2.4b) :**
- Plant refactoring : backend terminé, frontend forms en cours
- Seeds refactoring : à faire après Plant
- Nouveau schéma Plant : snake_case, champs horticoles (hardiness, position, périodes semis)

**Documents de référence :**
- `PLANNING.md` — planning détaillé des sessions
- `cours/session2.4b-*.md` — documentation refactoring en cours
- `.planning/codebase/` — cartographie du code existant

## Constraints

- **Tech stack** : Turborepo, Hono, Drizzle, TanStack Start, shadcn/ui — choix pédagogique fixé
- **Learning project** : Rythme adapté à l'apprentissage, explications incluses
- **Shared types** : Zod schemas dans `packages/shared-types/` — source de vérité
- **Naming** : Singulier partout (table `plant` pas `plants`), snake_case en DB

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tables singulier (plant, seed) | Convention plus claire, cohérence | ✓ Good |
| snake_case en DB | Standard PostgreSQL | ✓ Good |
| Périodes en integer[] | Semaines de l'année, flexible | — Pending |
| Position en enum[] | Choix multiple exposition | — Pending |
| Photothèque reportée | Session 2.4c dédiée | — Pending |

---
*Last updated: 2026-02-03 after GSD initialization*
