# HappySeeds - Planning de Développement

## Project: HappySeeds

### Overview

HappySeeds est une application web de gestion de grainothèque et de planification des semis. Les utilisateurs peuvent cataloguer leur collection de graines, consulter des fiches plantes détaillées, et créer des calendriers de semis optimisés selon leur zone climatique.

### Objectives

- **Principal** : Construire une application fullstack complète et fonctionnelle
- **Apprentissage** : Maîtriser TypeScript, React avec TanStack, Hono, Drizzle ORM, et Turborepo
- **Livrable** : Application MVP déployée avec authentification, CRUD Plants/Seeds, sessions de semis et calendrier

### Profil de l'apprenant

| Domaine | Niveau | Adaptation pédagogique |
|---------|--------|------------------------|
| TypeScript | Débutant | Expliquer `interface` vs `type`, enums, generics progressivement |
| React | Débutant | Détailler les hooks, introduire TanStack Query pas à pas |
| Backend | Intermédiaire | Comparer Hono ↔ Express, syntaxe similaire |
| SQL/Relations | Intermédiaire | Aller vite sur les concepts, focus sur Drizzle |
| Git | Intermédiaire | Utiliser gitflow, éviter rebase |
| Monorepo | Débutant | Expliquer Turborepo et pnpm workspaces en détail |

---

## Technology Stack

### Frontend

| Technology | Version | Justification |
|------------|---------|---------------|
| TanStack Start | latest | Metaframework React moderne, file-based routing, SSR ready |
| TanStack Router | latest | Routing type-safe, intégré avec Start |
| TanStack Query | latest | Gestion du "server state", cache automatique, mutations |
| React | 18+ | Librairie UI, hooks modernes |
| shadcn/ui | latest | Composants accessibles, personnalisables, pas de lock-in |
| TailwindCSS | 3.x | Utility-first CSS, rapide à prototyper |
| React Hook Form | latest | Gestion de formulaires performante |
| Zod | latest | Validation de schémas, inférence TypeScript |

### Backend

| Technology | Version | Justification |
|------------|---------|---------------|
| Hono | latest | Framework léger, syntaxe proche d'Express, TypeScript natif, RPC intégré |
| Drizzle ORM | latest | ORM TypeScript, proche du SQL, migrations simples |
| Better-Auth | latest | Authentification moderne, sessions sécurisées |
| Zod | latest | Validation partagée avec le frontend |

### Database

| Technology | Version | Justification |
|------------|---------|---------------|
| PostgreSQL | 15+ | SGBD robuste, relations, JSON support |
| Drizzle Kit | latest | Gestion des migrations, studio GUI |

### DevOps & Tools

| Tool | Purpose |
|------|---------|
| Turborepo | Orchestration monorepo, cache intelligent |
| pnpm | Package manager rapide, workspaces natifs |
| TypeScript | 5.9.2 | Type safety across stack |
| Prettier | Formatage de code |
| ESLint | Linting |
| Vitest | Tests unitaires (Phase 3) |
| Playwright | Tests E2E (Phase 3) |

---

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        TURBOREPO                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │  apps/frontend  │    │  apps/backend   │                │
│  │                 │    │                 │                │
│  │  TanStack Start │───▶│  Hono API       │                │
│  │  + React        │    │  + Drizzle      │                │
│  │  + shadcn/ui    │    │                 │                │
│  │                 │    │        │        │                │
│  └─────────────────┘    └────────┼────────┘                │
│           │                      │                          │
│           │                      ▼                          │
│           │             ┌─────────────────┐                │
│           │             │   PostgreSQL    │                │
│           │             └─────────────────┘                │
│           │                                                 │
│           └──────────┬──────────────────────               │
│                      ▼                                      │
│           ┌─────────────────────┐                          │
│           │ packages/shared-types│                          │
│           │                     │                          │
│           │  Zod Schemas        │                          │
│           │  TypeScript Types   │                          │
│           └─────────────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
happyseeds/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── index.ts              # Point d'entrée (démarre le serveur)
│   │   │   ├── app.ts                # Configuration Hono + montage des routes
│   │   │   ├── db/
│   │   │   │   ├── index.ts          # Connexion DB
│   │   │   │   └── schema/           # Schémas Drizzle
│   │   │   │       ├── index.ts      # Export de tous les schémas
│   │   │   │       ├── auth-schema.ts
│   │   │   │       ├── plants.schema.ts
│   │   │   │       ├── seed.schema.ts
│   │   │   │       └── ...
│   │   │   ├── routes/               # Routes Hono (montées dans app.ts)
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── plants.routes.ts
│   │   │   │   └── seeds.routes.ts
│   │   │   ├── middleware/
│   │   │   │   └── auth.middleware.ts
│   │   │   └── services/             # Business logic
│   │   │       ├── plants.service.ts
│   │   │       └── seeds.service.ts
│   │   ├── drizzle.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/
│       ├── src/
│       │   ├── @types/               # TypeScript type definitions
│       │   │   ├── api.types.tsx     # ApiResponse, PaginatedResponse
│       │   │   ├── plant.types.tsx   # Plant, CreatePlantInput, etc.
│       │   │   └── seed.types.tsx    # Seed, CreateSeedInput, etc.
│       │   ├── routes/
│       │   │   ├── __root.tsx
│       │   │   ├── index.tsx
│       │   │   ├── login.tsx
│       │   │   ├── signup.tsx
│       │   │   └── _authenticated/
│       │   │       ├── route.tsx     # Layout authentifié
│       │   │       ├── dashboard.tsx
│       │   │       └── plants/
│       │   │           ├── index.tsx
│       │   │           ├── new.tsx
│       │   │           └── $id/
│       │   │               ├── index.tsx
│       │   │               ├── edit.tsx
│       │   │               └── seeds/
│       │   │                   ├── new.tsx
│       │   │                   └── $seedId/
│       │   │                       └── edit.tsx
│       │   ├── components/
│       │   │   ├── ui/               # shadcn components
│       │   │   ├── PlantForm.tsx
│       │   │   └── AppHeader.tsx
│       │   ├── hooks/
│       │   │   └── usePlants.ts      # TanStack Query hooks
│       │   ├── services/             # API services (utilisent request helper)
│       │   │   ├── plants.service.ts
│       │   │   └── seeds.service.ts
│       │   ├── lib/
│       │   │   ├── api-client.ts     # request<T> helper + ApiError
│       │   │   ├── auth-client.ts    # Better-Auth client
│       │   │   ├── auth.ts           # Auth utilities
│       │   │   ├── utils.ts          # cn() et autres utilitaires
│       │   │   └── schemas/          # Zod schemas pour formulaires
│       │   │       └── plant.schema.ts
│       │   └── router.tsx
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── shared-types/
│       ├── src/
│       │   ├── index.ts
│       │   └── schemas/
│       │       ├── user.schema.ts
│       │       ├── plant.schema.ts
│       │       ├── seed.schema.ts
│       │       └── ...
│       ├── package.json
│       └── tsconfig.json
│
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
└── PLANNING.md
```

---

## Database Schema

### Entities

#### User

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email de connexion |
| passwordHash | VARCHAR(255) | NOT NULL | Mot de passe hashé |
| name | VARCHAR(100) | NOT NULL | Nom d'affichage |
| climateZone | VARCHAR(50) | NULL | Zone climatique |
| createdAt | TIMESTAMP | NOT NULL | Date de création |
| updatedAt | TIMESTAMP | NOT NULL | Date de modification |

#### Plant

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| authorId | UUID | FK → User, NOT NULL | Auteur de la fiche (créateur) |
| name | VARCHAR(100) | NOT NULL | Nom commun |
| latinName | VARCHAR(100) | NULL | Nom latin |
| category | ENUM | NOT NULL | vegetable, fruit, flower, herb, shrub, other |
| description | TEXT | NULL | Description |
| sowingDepth | INTEGER | NULL | Profondeur de semis (cm) |
| sowingSpacing | INTEGER | NULL | Espacement (cm) |
| germinationDaysMin | INTEGER | NULL | Germination min (jours) |
| germinationDaysMax | INTEGER | NULL | Germination max (jours) |
| growthDaysMin | INTEGER | NULL | Croissance min (jours) |
| growthDaysMax | INTEGER | NULL | Croissance max (jours) |
| sunRequirement | ENUM | NULL | full_sun, partial_shade, shade |
| waterRequirement | ENUM | NULL | low, medium, high |
| notes | TEXT | NULL | Notes personnelles |
| imageUrl | VARCHAR(500) | NULL | URL de l'image |
| createdAt | TIMESTAMP | NOT NULL | Date de création |
| updatedAt | TIMESTAMP | NOT NULL | Date de modification |

#### Seed

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| userId | UUID | FK → User, NOT NULL | Propriétaire |
| plantId | UUID | FK → Plant, NOT NULL | Plante parente |
| variety | VARCHAR(100) | NOT NULL | Nom de la variété |
| brand | VARCHAR(100) | NULL | Marque/fournisseur |
| purchaseDate | DATE | NULL | Date d'achat |
| expirationDate | DATE | NULL | Date d'expiration |
| quantity | INTEGER | NULL | Quantité |
| quantityUnit | ENUM | NULL | grams, seeds, packets |
| organic | BOOLEAN | DEFAULT false | Bio |
| notes | TEXT | NULL | Notes |
| imageUrl | VARCHAR(500) | NULL | URL de l'image |
| createdAt | TIMESTAMP | NOT NULL | Date de création |
| updatedAt | TIMESTAMP | NOT NULL | Date de modification |

#### SowingSession

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| userId | UUID | FK → User, NOT NULL | Propriétaire |
| name | VARCHAR(100) | NOT NULL | Nom de la session |
| year | INTEGER | NOT NULL | Année |
| startDate | DATE | NOT NULL | Date de début |
| status | ENUM | NOT NULL | planned, active, completed, cancelled |
| notes | TEXT | NULL | Notes |
| createdAt | TIMESTAMP | NOT NULL | Date de création |
| updatedAt | TIMESTAMP | NOT NULL | Date de modification |

#### SowingEntry

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| sessionId | UUID | FK → SowingSession, NOT NULL | Session parente |
| seedId | UUID | FK → Seed, NOT NULL | Graine semée |
| plannedStartDate | DATE | NOT NULL | Date prévue |
| actualStartDate | DATE | NULL | Date réelle |
| estimatedEndDate | DATE | NULL | Date estimée de fin (calculée) |
| actualEndDate | DATE | NULL | Date réelle de fin |
| quantity | INTEGER | NOT NULL | Quantité semée |
| location | VARCHAR(50) | NULL | indoor, greenhouse, outdoor |
| status | ENUM | NOT NULL | planned, sowing, germinating, growing, transplanted, completed, failed |
| notes | TEXT | NULL | Notes |
| createdAt | TIMESTAMP | NOT NULL | Date de création |
| updatedAt | TIMESTAMP | NOT NULL | Date de modification |

#### Observation

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| sowingEntryId | UUID | FK → SowingEntry, NOT NULL | Entrée parente |
| date | DATE | NOT NULL | Date d'observation |
| type | ENUM | NOT NULL | germination, growth, issue, treatment, transplant, harvest, other |
| description | TEXT | NOT NULL | Description |
| imageUrl | VARCHAR(500) | NULL | URL de l'image |
| createdAt | TIMESTAMP | NOT NULL | Date de création |

### Relationships

```
User ─────┬───── 1:N ─────▶ Plant (as author - public read, author-only write)
          ├───── 1:N ─────▶ Seed  (as owner - private collection)
          └───── 1:N ─────▶ SowingSession

Plant ────────── 1:N ─────▶ Seed

SowingSession ── 1:N ─────▶ SowingEntry

Seed ─────────── 1:N ─────▶ SowingEntry

SowingEntry ──── 1:N ─────▶ Observation
```

**Notes sur les permissions :**
- **Plant** : Lecture publique (tous les utilisateurs authentifiés). Modification/suppression réservée à l'auteur (`authorId`).
- **Seed** : Collection privée. Chaque graine appartient à un utilisateur (`userId`). CRUD réservé au propriétaire.

---

## Features & Sessions

### Vue d'ensemble des Modules

```
Module 0: Fondations ──▶ Module 1: Auth ──▶ Module 2: Plants CRUD
                                                    │
                                                    ▼
Module 6: Dashboard ◀── Module 5: Calendrier ◀── Module 3: Seeds CRUD
                                                    │
                                                    ▼
                                            Module 4: Sessions de Semis
```

### Session Order

| # | Module | Session | Description | Prérequis |
|---|--------|---------|-------------|-----------|
| 0.1 | Fondations | Monorepo & TypeScript | Structure Turborepo, bases TypeScript | Aucun |
| 0.2 | Fondations | Backend Hono | Serveur Hono, route health | 0.1 |
| 0.3 | Fondations | Database Drizzle | Connexion PostgreSQL, premier schéma | 0.2 |
| 0.4 | Fondations | Frontend TanStack Start | Setup frontend, TailwindCSS, shadcn | 0.1 |
| 1.1 | Auth | Schema User & API | Inscription, connexion backend | 0.3 |
| 1.2 | Auth | Middleware Auth | Protection des routes API | 1.1 |
| 1.3 | Auth | Pages Auth Frontend | Login/Register UI | 0.4, 1.2 |
| 1.4 | Auth | Protection Routes Frontend | AuthContext, route guards | 1.3 |
| 2.1 | Plants | Schema & API Backend | CRUD Plants complet | 1.2 |
| 2.2 | Plants | TanStack Query Intro | Hooks, cache, mutations | 1.4 |
| 2.3 | Plants | Liste Plants UI | Page liste, cards, loading | 2.2 |
| 2.4 | Plants | Formulaire Plant | Création/édition avec React Hook Form | 2.3 |
| 2.5 | Plants | Détail & Suppression | Page détail, confirmation delete | 2.4 |
| 3.1 | Seeds | Schema & API Backend | CRUD Seeds avec relation Plant | 2.1 |
| 3.2 | Seeds | UI Complète | Liste, form, détail Seeds | 2.5, 3.1 |
| 3.3 | Seeds | Navigation & UX | Header, breadcrumbs, liens | 3.2 |
| 4.1 | Sessions | Schema Session & API | CRUD Sessions | 3.1 |
| 4.2 | Sessions | Schema Entry & API | CRUD Entries, calculs dates | 4.1 |
| 4.3 | Sessions | UI Sessions | Wizard création, sélection graines | 4.2, 3.3 |
| 5.1 | Calendrier | API Calendrier | Endpoint optimisé | 4.2 |
| 5.2 | Calendrier | Composant Calendrier | Vue calendrier interactive | 5.1, 4.3 |
| 6.1 | Dashboard | API Statistiques | Aggregations, stats | 5.1 |
| 6.2 | Dashboard | Page Dashboard | Cards stats, tâches à venir | 6.1, 5.2 |
| 6.3 | Dashboard | Polish UX | Error boundaries, loading, responsive | 6.2 |

---

## Feature Details

### Module 0: Fondations & Configuration

#### Session 0.1: Monorepo & TypeScript Basics

**Objectifs:**
- Comprendre la structure Turborepo (apps/, packages/)
- Maîtriser les bases TypeScript : `type` vs `interface`, enums
- Configurer pnpm workspaces

**Nouveaux Concepts:**
- Turborepo : orchestration, cache, `turbo.json`
- pnpm : workspaces, hoisting
- TypeScript : types primitifs, `interface`, `type`, quand utiliser lequel
- Package `shared-types` et son rôle

**Livrables:**
- Structure monorepo initialisée
- Package `shared-types` avec premiers types
- `pnpm install` et `pnpm dev` fonctionnels

**Vérification:**
- `pnpm install` sans erreur
- Import de types depuis `shared-types` fonctionne

---

#### Session 0.2: Configuration Backend Hono

**Objectifs:**
- Mettre en place un serveur Hono fonctionnel
- Comprendre les différences Hono vs Express

**Nouveaux Concepts:**
- Hono : syntaxe, `Hono()`, routing
- Comparaison Express ↔ Hono (syntaxe similaire)
- Middleware pattern dans Hono
- Context Hono (`c.json()`, `c.text()`)

**Livrables:**
- Serveur Hono dans `apps/backend`
- Route `GET /api/health` fonctionnelle
- Scripts npm : `dev`, `build`

**Vérification:**
- `curl http://localhost:3001/api/health` retourne `{ "status": "ok" }`

---

#### Session 0.3: Database Drizzle

**Objectifs:**
- Connecter PostgreSQL avec Drizzle
- Comprendre le workflow de migrations

**Nouveaux Concepts:**
- Drizzle ORM : définition de schéma (proche SQL)
- Drizzle Kit : génération et exécution de migrations
- Variables d'environnement avec `dotenv`
- Connection pooling

**Livrables:**
- Base de données `happyseeds` créée
- Connexion Drizzle configurée
- Une migration de test exécutée

**Vérification:**
- `pnpm drizzle-kit studio` ouvre le GUI
- Table de test visible dans pgAdmin/DBeaver

---

#### Session 0.4: Frontend TanStack Start

**Objectifs:**
- Initialiser TanStack Start
- Configurer TailwindCSS et shadcn/ui

**Nouveaux Concepts:**
- TanStack Start : file-based routing
- Différences avec Next.js/Remix
- Configuration Vite
- shadcn/ui : installation et utilisation

**Livrables:**
- App TanStack Start fonctionnelle
- TailwindCSS configuré
- shadcn/ui installé avec Button et Card
- Page d'accueil basique

**Vérification:**
- `http://localhost:3000` affiche la page d'accueil
- Hot reload fonctionne

---

### Module 1: Authentification

#### Session 1.1: Schema User & API Auth

**Objectifs:**
- Créer le schéma User avec Drizzle
- Implémenter inscription et connexion

**Nouveaux Concepts:**
- Schéma Drizzle complet (UUID, timestamps)
- Hashing de mot de passe (argon2)
- Validation Zod côté API
- Pattern service layer

**Livrables:**
- Schéma `users` migré
- Routes `POST /api/auth/register` et `POST /api/auth/login`
- Validation des données avec Zod

**Vérification:**
- Inscription d'un utilisateur via Postman/Thunder Client
- Connexion retourne un token/session

---

#### Session 1.2: Middleware d'Authentification

**Objectifs:**
- Protéger les routes API
- Injecter l'utilisateur dans le contexte

**Nouveaux Concepts:**
- Middleware Hono
- Vérification de session/JWT
- Context Hono : `c.set()`, `c.get()`
- Gestion erreurs 401/403

**Livrables:**
- Middleware `authMiddleware`
- Route `GET /api/auth/me` protégée

**Vérification:**
- Requête sans token → 401
- Requête avec token valide → données utilisateur

---

#### Session 1.3: Pages Auth Frontend

**Objectifs:**
- Créer les pages Login et Register
- Premier contact avec React Hook Form

**Nouveaux Concepts:**
- React Hook Form : `useForm`, `register`, `handleSubmit`
- Validation Zod côté client avec `zodResolver`
- Gestion des erreurs de formulaire
- Stockage du token (cookie httpOnly recommandé)

**Livrables:**
- Page `/login` fonctionnelle
- Page `/register` fonctionnelle
- Messages d'erreur affichés

**Vérification:**
- Inscription → redirection vers login
- Connexion → redirection vers dashboard

---

#### Session 1.4: Protection Routes Frontend

**Objectifs:**
- Restreindre l'accès aux pages authentifiées
- Créer un AuthContext

**Nouveaux Concepts:**
- Context React : `createContext`, `useContext`, Provider
- Route guards avec TanStack Router
- Layout routes (`_authenticated`)
- Hook personnalisé `useAuth()`

**Livrables:**
- `AuthProvider` avec état utilisateur
- Layout `_authenticated` avec vérification
- Hook `useAuth()` réutilisable

**Vérification:**
- Accès `/dashboard` sans auth → redirection `/login`
- Accès `/dashboard` avec auth → page affichée

---

### Module 2: CRUD Plants

#### Session 2.1: Schema Plant & API Backend

**Objectifs:**
- Créer le CRUD complet pour Plants côté API
- Maîtriser les enums Drizzle

**Nouveaux Concepts:**
- Enums PostgreSQL avec Drizzle
- Pattern CRUD avec Hono
- Query params pour filtrage et pagination
- Typage des réponses API

**Livrables:**
- Schéma `plants` migré
- Routes CRUD complètes
- Filtrage par catégorie, recherche par nom

**Vérification:**
- Tous les endpoints testés avec Postman
- Filtrage fonctionne

---

#### Session 2.2: Introduction TanStack Query

**Objectifs:**
- Comprendre le concept de "server state"
- Utiliser useQuery et useMutation

**Nouveaux Concepts:**
- Server state vs client state (explication détaillée)
- TanStack Query : QueryClient, QueryClientProvider
- `useQuery` : queryKey, queryFn, états (isLoading, isError, data)
- Cache automatique et invalidation

**Livrables:**
- Configuration TanStack Query
- Hook `usePlants()` avec useQuery
- Hook `usePlant(id)` pour le détail

**Vérification:**
- Données chargées et cachées
- Rafraîchissement automatique

---

#### Session 2.3: Liste Plants UI

**Objectifs:**
- Créer la page de liste des plantes
- Utiliser les composants shadcn/ui

**Nouveaux Concepts:**
- Composants shadcn : Card, Button, Skeleton
- Layout responsive avec Tailwind (grid, flex)
- Empty state pattern
- Loading skeleton pattern

**Livrables:**
- Page `/plants` avec liste
- Composant `PlantCard`
- Loading skeleton
- Empty state

**Vérification:**
- Liste affichée avec les données
- Skeleton pendant le chargement
- Message si aucune plante

---

#### Session 2.4: Formulaire Plant

**Objectifs:**
- Créer le formulaire de création/édition
- Utiliser useMutation

**Nouveaux Concepts:**
- `useMutation` : mutationFn, onSuccess, onError
- Invalidation du cache après mutation
- Toast notifications (sonner)
- Réutilisation du formulaire (création vs édition)

**Livrables:**
- Page `/plants/new`
- Composant `PlantForm` réutilisable
- Toasts de succès/erreur
- Page `/plants/[id]/edit`

**Vérification:**
- Création d'une plante → apparaît dans la liste
- Édition → données mises à jour

---

#### Session 2.5: Détail Plant & Suppression

**Objectifs:**
- Afficher le détail d'une plante
- Implémenter la suppression avec confirmation

**Nouveaux Concepts:**
- Route dynamique TanStack Router (`$plantId`)
- AlertDialog shadcn pour confirmation
- Delete mutation
- Navigation programmatique

**Livrables:**
- Page `/plants/[plantId]`
- Boutons Edit/Delete
- Dialog de confirmation
- Redirection après suppression

**Vérification:**
- Détail affiché correctement
- Suppression avec confirmation fonctionne

---

### Module 3: CRUD Seeds

#### Session 3.1: Schema Seed & API

**Objectifs:**
- Créer le CRUD Seeds avec relation vers Plant
- Maîtriser les jointures Drizzle

**Nouveaux Concepts:**
- Foreign keys avec Drizzle
- Jointures : `with` clause Drizzle
- Nested data dans les réponses
- Filtrage par `plantId`

**Livrables:**
- Schéma `seeds` avec relation
- Routes CRUD avec données Plant incluses
- Filtrage par plante

**Vérification:**
- Seed inclut les infos de la Plant associée
- Filtrage par plantId fonctionne

---

#### Session 3.2: UI Seeds Complète

**Objectifs:**
- Créer toute l'interface Seeds
- Réutiliser les patterns du Module 2

**Nouveaux Concepts:**
- Select/Combobox avec données API
- Réutilisation de hooks (pattern similaire à Plants)
- URL state pour les filtres

**Livrables:**
- Hooks `useSeeds()`, `useSeed()`
- Page `/seeds` avec liste
- `SeedForm` avec sélection de Plant
- Pages détail et édition

**Vérification:**
- CRUD Seeds complet fonctionnel
- Sélection de Plant dans le formulaire

---

#### Session 3.3: Navigation & UX

**Objectifs:**
- Améliorer la navigation entre entités
- Créer le layout authentifié complet

**Nouveaux Concepts:**
- Navigation contextuelle
- Breadcrumbs pattern
- Sidebar/Header layout
- Liens bidirectionnels (Plant ↔ Seeds)

**Livrables:**
- Header avec navigation
- Breadcrumbs sur les pages
- Liens "Voir les graines" sur PlantDetail
- Layout complet

**Vérification:**
- Navigation fluide entre toutes les pages
- Contexte clair (où suis-je ?)

---

### Module 4: Sessions de Semis

#### Session 4.1: Schema SowingSession & API

**Objectifs:**
- Créer le CRUD Sessions
- Gérer les status avec enum

**Nouveaux Concepts:**
- Enum status et transitions
- Filtrage par année et status
- Pattern wizard (preview)

**Livrables:**
- Schéma `sowing_sessions` migré
- Routes CRUD Sessions
- Filtrage année/status

**Vérification:**
- CRUD fonctionnel
- Filtrage opérationnel

---

#### Session 4.2: Schema SowingEntry & API

**Objectifs:**
- Créer les entrées de semis
- Implémenter les calculs de dates

**Nouveaux Concepts:**
- Relations multiples (Session → Entry → Seed → Plant)
- Nested routes pattern
- Calcul de `estimatedEndDate` depuis les données Plant
- Enrichissement des données

**Livrables:**
- Schéma `sowing_entries` migré
- Routes CRUD imbriquées
- Calcul automatique des dates
- Données enrichies (seed + plant info)

**Vérification:**
- Création d'entry calcule la date estimée
- Données complètes retournées

---

#### Session 4.3: UI Sessions

**Objectifs:**
- Créer l'interface de gestion des sessions
- Implémenter la sélection de graines

**Nouveaux Concepts:**
- Wizard multi-étapes
- Sélection multiple (checkboxes)
- Status management UI
- Date picker

**Livrables:**
- Page `/calendar/sessions`
- Formulaire de session
- Interface sélection de graines
- Gestion des status

**Vérification:**
- Création de session avec entries
- Changement de status fonctionne

---

### Module 5: Vue Calendrier

#### Session 5.1: API Calendrier

**Objectifs:**
- Créer un endpoint optimisé pour le calendrier
- Formater les données par date

**Nouveaux Concepts:**
- Agrégation de données pour UI
- Format de données calendrier
- Filtrage par plage de dates

**Livrables:**
- Endpoint `GET /api/dashboard/calendar`
- Données groupées par date
- Filtrage mois/année

**Vérification:**
- Données formatées correctement
- Performance acceptable

---

#### Session 5.2: Composant Calendrier

**Objectifs:**
- Afficher les semis dans un calendrier visuel
- Permettre la navigation entre mois

**Nouveaux Concepts:**
- Librairie calendrier ou composant custom
- Affichage d'événements sur dates
- Navigation temporelle

**Livrables:**
- Page `/calendar`
- Composant calendrier
- Navigation mensuelle
- Aperçu au clic sur une date

**Vérification:**
- Entries visibles sur les bonnes dates
- Navigation fluide

---

### Module 6: Dashboard & Finitions

#### Session 6.1: API Statistiques

**Objectifs:**
- Créer les endpoints de statistiques
- Agréger les données

**Nouveaux Concepts:**
- Agrégations SQL (COUNT, GROUP BY)
- Calcul de taux de réussite
- Format de données pour widgets

**Livrables:**
- Endpoint `GET /api/dashboard/stats`
- Endpoint `GET /api/dashboard/upcoming`
- Statistiques calculées

**Vérification:**
- Stats correctes
- Tâches à venir triées par date

---

#### Session 6.2: Page Dashboard

**Objectifs:**
- Créer le tableau de bord visuel
- Dashboard comme page par défaut

**Nouveaux Concepts:**
- Layout dashboard
- Stats cards pattern
- Widgets interactifs

**Livrables:**
- Page `/dashboard`
- Composants StatsCard
- Widget tâches à venir
- Liens rapides

**Vérification:**
- Dashboard informatif
- Redirection depuis `/` vers `/dashboard`

---

#### Session 6.3: Polish UX

**Objectifs:**
- Finaliser l'expérience utilisateur
- S'assurer de la robustesse

**Nouveaux Concepts:**
- Error boundaries React
- Loading states globaux
- Responsive design final
- Accessibilité basics (a11y)

**Livrables:**
- Error boundaries configurés
- Tous loading states vérifiés
- Test mobile
- Vérification accessibilité clavier

**Vérification:**
- Application MVP complète et utilisable
- Pas de crash sur erreurs

---

## Testing Strategy

### Approche : Hybride (décision du 27/01/2026)

Les tests sont introduits **dès le Module 2** plutôt qu'en fin de projet.

| Module | Tests |
|--------|-------|
| Module 0-1 (Fondations, Auth) | ❌ Pas de tests (setup + Better-Auth gère l'auth) |
| Module 2 (Plants) | ✅ Introduction Vitest + tests services backend |
| Module 3 (Seeds) | ✅ Tests services + tests hooks custom |
| Module 4-5 (Sessions, Calendar) | ✅ Tests logique métier (calculs dates) |
| Module 6 (Dashboard) | ✅ Tests d'intégration API |
| Phase finale | ✅ Tests E2E Playwright |

### Session 2.0 : Introduction à Vitest (ajoutée)

Avant le CRUD Plants, une session dédiée à la configuration et aux bases des tests.

### Unit Tests (Modules 2+)

- **Outil** : Vitest
- **Cible** : Services backend, fonctions utilitaires, hooks custom
- **Coverage** : Objectif > 70%

### Integration Tests (Modules 2+)

- **Outil** : Vitest + supertest
- **Cible** : Routes API complètes
- **Approche** : Base de données de test isolée

### E2E Tests (Phase finale)

- **Outil** : Playwright
- **Cible** : Parcours utilisateur critiques
- **Scénarios** : Inscription, création plante, création session

---

## Deployment Plan

### Environment

| Env | Frontend | Backend | Database |
|-----|----------|---------|----------|
| Development | localhost:3000 | localhost:3001 | localhost PostgreSQL |
| Production | Vercel | Railway/Render | Neon/Supabase |

### CI/CD (Phase 3)

- **Plateforme** : GitHub Actions
- **Pipeline** : Lint → Type-check → Test → Build → Deploy
- **Triggers** : Push sur main, Pull Requests

### Variables d'environnement

**Backend (.env):**
```
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/happyseeds
AUTH_SECRET=your-secret-key-min-32-chars
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3001
```

---

## Progress Tracking

| Session | Status | Date Started | Date Completed | Notes |
|---------|--------|--------------|----------------|-------|
| 0.1 - Monorepo & TypeScript | Not Started | - | - | - |
| 0.2 - Backend Hono | Not Started | - | - | - |
| 0.3 - Database Drizzle | Not Started | - | - | - |
| 0.4 - Frontend TanStack Start | Not Started | - | - | - |
| 1.1 - Schema User & API | Not Started | - | - | - |
| 1.2 - Middleware Auth | Not Started | - | - | - |
| 1.3 - Pages Auth Frontend | Not Started | - | - | - |
| 1.4 - Protection Routes Frontend | Not Started | - | - | - |
| 2.0 - Introduction Vitest | Not Started | - | - | Ajouté (approche hybride) |
| 2.1 - Schema Plant & API | Not Started | - | - | - |
| 2.2 - TanStack Query Intro | Not Started | - | - | - |
| 2.3 - Liste Plants UI | Not Started | - | - | - |
| 2.4 - Formulaire Plant | Not Started | - | - | - |
| 2.5 - Détail & Suppression | Not Started | - | - | - |
| 3.1 - Schema Seed & API | Not Started | - | - | - |
| 3.2 - UI Seeds Complète | Not Started | - | - | - |
| 3.3 - Navigation & UX | Not Started | - | - | - |
| 4.1 - Schema Session & API | Not Started | - | - | - |
| 4.2 - Schema Entry & API | Not Started | - | - | - |
| 4.3 - UI Sessions | Not Started | - | - | - |
| 5.1 - API Calendrier | Not Started | - | - | - |
| 5.2 - Composant Calendrier | Not Started | - | - | - |
| 6.1 - API Statistiques | Not Started | - | - | - |
| 6.2 - Page Dashboard | Not Started | - | - | - |
| 6.3 - Polish UX | Not Started | - | - | - |

---

## Git Workflow

### Branch Strategy (Gitflow simplifié)

- `main` : Code stable, déployable
- `develop` : Intégration des features (optionnel pour ce projet)
- `feature/session-X.Y-description` : Travail en cours

### Commit Convention

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Scope: auth, plants, seeds, sessions, calendar, dashboard, config
```

**Exemples:**
```
feat(plants): add CRUD API endpoints
fix(auth): handle expired token error
docs(readme): update installation instructions
```

### Rythme Git par Session

1. Créer la branche : `git checkout -b feature/session-0.1-monorepo`
2. Commits atomiques après chaque étape majeure
3. Push régulier : `git push -u origin feature/session-0.1-monorepo`
4. Merge dans main quand session complète

---

## Notes pour le Mentor

### Adaptations pédagogiques

- **TypeScript** : Expliquer systématiquement `interface` vs `type`, montrer les deux syntaxes
- **Hono** : Toujours faire le parallèle avec Express pour les concepts similaires
- **TanStack Query** : Prendre le temps d'expliquer le concept de "server state" avant de coder
- **Hooks React** : Expliquer le "pourquoi" avant le "comment"

### Points de vigilance

- L'apprenant connaît bien SQL → ne pas sur-expliquer les relations
- Nouveau sur les migrations → bien montrer le workflow Drizzle Kit
- Gitflow connu → pas besoin de réexpliquer, juste adapter au projet

### Ressources à partager

- Documentation officielle Hono : https://hono.dev
- Documentation Drizzle : https://orm.drizzle.team
- Documentation TanStack : https://tanstack.com
- shadcn/ui : https://ui.shadcn.com
