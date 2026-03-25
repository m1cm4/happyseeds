# HappySeeds

**Application de gestion de grainothèque et de planification des semis.**

[![Status](https://img.shields.io/badge/status-alpha%20·%20en%20d%C3%A9veloppement-orange)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)]()
[![Node](https://img.shields.io/badge/Node-%3E%3D18-green)]()
[![pnpm](https://img.shields.io/badge/pnpm-10-yellow)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)

> [Read in English](README.md)

---

Application web fullstack personnelle destinée aux jardiniers souhaitant cataloguer leur collection de graines, consulter des fiches plantes et planifier leur calendrier de semis selon les données climatiques.

> **Note :** Ce projet personnel est en cours de développement (version alpha). Certaines fonctionnalités sont encore en progression.

## Captures d'écran

<table>
  <tr>
    <td><img src="README_assets/screenshot-home.png" alt="Page d'accueil" width="400" /></td>
    <td><img src="README_assets/screenshot-dashboard.png" alt="Tableau de bord" width="400" /></td>
  </tr>
  <tr>
    <td><img src="README_assets/screenshot-calendrier.png" alt="Calendrier des semis" width="400" /></td>
    <td><img src="README_assets/screenshot-seed-form.png" alt="Formulaire graine" width="400" /></td>
  </tr>
</table>

## Stack technique

| Couche               | Technologie                           |
| -------------------- | ------------------------------------- |
| **Monorepo**         | Turborepo + pnpm                      |
| **Backend**          | Hono                                  |
| **ORM**              | Drizzle ORM                           |
| **Base de données**  | PostgreSQL                            |
| **Authentification** | Better-Auth (sessions)                |
| **Frontend**         | TanStack Start + TanStack Router      |
| **Data Fetching**    | TanStack Query                        |
| **Composants UI**    | shadcn/ui + Radix UI                  |
| **Styles**           | Tailwind CSS v4                       |
| **Validation**       | Zod (partagé entre client et serveur) |
| **Langage**          | TypeScript (mode strict)              |

## Architecture

```mermaid
graph TB
    subgraph Client["Frontend — TanStack Start"]
        Router[TanStack Router<br/>Routing fichier]
        Query[TanStack Query<br/>État serveur]
        UI[shadcn/ui + Tailwind]
    end

    subgraph Server["Backend — Hono"]
        Routes[API REST]
        Services[Couche services]
        Auth[Better-Auth<br/>Middleware session]
    end

    subgraph Data["Base de données"]
        ORM[Drizzle ORM]
        PG[(PostgreSQL)]
    end

    subgraph Shared["packages/shared-types"]
        Zod[Schémas Zod<br/>Source de vérité unique]
    end

    Router --> Query
    Query -->|HTTP| Routes
    Routes --> Auth
    Routes --> Services
    Services --> ORM
    ORM --> PG

    Zod -.->|Inférence de types| Client
    Zod -.->|Validation requêtes| Server
```

## Structure du projet

```
happyseeds/
├── apps/
│   ├── backend/              # Serveur API Hono
│   │   └── src/
│   │       ├── db/schemas/   # Définitions de tables Drizzle
│   │       ├── routes/       # Endpoints API REST
│   │       ├── services/     # Logique métier
│   │       └── middleware/   # Middleware d'authentification
│   └── frontend/             # Application TanStack Start
│       └── src/
│           ├── routes/       # Routing basé sur les fichiers
│           ├── components/   # Composants UI
│           ├── hooks/        # Hooks TanStack Query
│           ├── services/     # Couche services API
│           └── lib/          # Utilitaires
├── packages/
│   └── shared-types/         # Schémas Zod partagés entre client et serveur
└── scripts/                  # Outils (import, release)
```

## Décisions techniques clés

Ce projet privilégie délibérément des technologies que je n'avais pas ou peu pratiquées — l'objectif était d'apprendre en construisant, pas de rester en terrain connu.

**Monorepo Turborepo** — Backend, frontend et types partagés cohabitent dans un seul dépôt avec linting, formatage et vérification de types unifiés. Les schémas Zod partagés assurent une sécurité de types de bout en bout : un schéma unique valide les requêtes API côté serveur et infère les types TypeScript côté client.

**TanStack Start + Router** — Choisi pour son routing type-safe basé sur les fichiers et son intégration étroite avec TanStack Query. L'écosystème TanStack offre une alternative moderne et bien conçue, construite sur des bibliothèques éprouvées (Query, Router, Form) plutôt que sur un framework tout-en-un.

**Drizzle ORM** — Approche légère, proche du SQL, avec une excellente inférence TypeScript. Les migrations sont des fichiers SQL explicites, offrant un contrôle total sur le schéma de la base de données — un flux de travail plus transparent par rapport au moteur de migration abstrait de Prisma.

**Hono** — Framework HTTP ultra-rapide et léger avec support TypeScript natif. Son système de middlewares s'intègre naturellement avec Better-Auth pour l'authentification par sessions.

## Approche de développement

Ce projet a été construit avec une méthodologie d'apprentissage assistée par IA. J'ai conçu un skill `dev-mentor` — un ensemble de règles qui configure l'IA comme un **guide socratique** : elle explique les concepts, revoit les décisions architecturales, pose des questions et oriente vers la documentation, mais **n'écrit jamais de code directement**.

Chaque ligne de code de ce dépôt a été écrite à la main. L'IA a servi de mentor, pas de co-pilote.

Cette approche m'a permis de comprendre en profondeur chaque choix technique tout en exploitant l'IA comme accélérateur d'apprentissage structuré.

## Démarrage rapide

### Pré-requis

- Node.js >= 18
- pnpm >= 10
- PostgreSQL

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/m1cm4/happyseeds.git
cd happyseeds

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
# Éditer les fichiers .env avec vos identifiants de base de données

# Exécuter les migrations
cd apps/backend
pnpm drizzle-kit migrate
cd ../..

# Lancer les serveurs de développement
pnpm dev
```

Le frontend tourne sur `http://localhost:3000` et l'API sur `http://localhost:3001`.

## Feuille de route

- [ ] Fonctionnalité de recherche dans les plantes et graines
- [ ] Upload d'images dans les formulaires de plantes
- [ ] Pagination sur les vues listes
- [ ] Skeleton loaders pour une meilleure expérience de chargement
- [ ] URLs SEO-friendly (slugs au lieu des UUID)
- [ ] Enrichissement des cas d'utilisation et workflows
- [ ] Refonte UI/UX
- [ ] Système de design visuel
- [ ] Fonctionnalités IA (API météo, base de données plantes, aide à la rédaction)
- [ ] Plus de tests (unitaires, intégration, e2e)

## Licence

[MIT](LICENSE) — Michel Maes

## Contact

**Michel Maes** — Développeur Full Stack JS | Front-End Designer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-mic--maes-blue?logo=linkedin)](https://linkedin.com/in/mic-maes)
