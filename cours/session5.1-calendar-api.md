# Session 5.1 : API Calendrier

> Created: 2026-02-27
> Mode: **Compass** 🧭

---

## Warm-Up (Active Recall)

**Question 1** : Dans la table `sowing_entry`, quels sont les 4 champs de dates et quel est leur rôle respectif ?

**Question 2** : Si tu veux récupérer toutes les entries d'un utilisateur (toutes sessions confondues), comment dois-tu structurer ta requête SQL pour t'assurer de ne retourner que les données de cet utilisateur ?

_(Essaie de répondre avant de scroller !)_

---

## Objectifs

À la fin de cette session, tu seras capable de :

1. Créer un endpoint d'agrégation qui regroupe des données provenant de plusieurs tables
2. Filtrer des entries par plage de dates (mois/année)
3. Enrichir les entries avec les données seed + plant via des jointures
4. Formater les données en structure adaptée à un affichage calendrier

---

## Vue d'ensemble

Jusqu'ici, les entries sont accessibles uniquement via leur session parente (`GET /api/sowing-sessions/:sessionId/entries`). Pour un calendrier, on a besoin d'une **vue transversale** : toutes les entries de l'utilisateur, toutes sessions confondues, filtrées par mois.

```
┌─────────────────────────────────────────────┐
│           Calendrier — Mars 2026            │
├────┬────┬────┬────┬────┬────┬────┤
│ Lu │ Ma │ Me │ Je │ Ve │ Sa │ Di │
├────┼────┼────┼────┼────┼────┼────┤
│    │    │    │    │    │    │  1 │
│  2 │  3 │  4 │  5 │  6 │  7 │  8 │
│  9 │ 10 │ 11 │ 12 │ 13 │ 14 │ 15 │
│    │    │ 🌱 │    │ 🌱 │    │    │
│ 16 │ 17 │ 18 │ 19 │ 20 │ 21 │ 22 │
│ 🌱 │    │    │    │    │    │    │
│ 23 │ 24 │ 25 │ 26 │ 27 │ 28 │ 29 │
│ 30 │ 31 │    │    │    │    │    │
└────┴────┴────┴────┴────┴────┴────┘
```

**Nouveau pattern** : On crée un service et des routes **séparés** (`calendar.service.ts`, `calendar.routes.ts`) plutôt que d'ajouter des méthodes aux services existants. C'est un endpoint d'**agrégation** — il combine des données de plusieurs entités.

---

## Concept : Endpoint d'agrégation

> **The Mentor's Compass** 🧭 : Les endpoints CRUD classiques (create/read/update/delete) manipulent une seule entité. Les endpoints d'**agrégation** croisent plusieurs tables pour produire une vue optimisée pour l'UI. C'est un pattern courant dans les dashboards et calendriers.

La différence clé :

| CRUD classique | Agrégation |
|---------------|------------|
| Une table principale | Jointures multi-tables |
| Filtres simples (id, status) | Filtres par plage de dates |
| Retourne l'entité telle quelle | Retourne une structure transformée |
| Service par entité | Service dédié à la vue |

---

## Action Steps

### Étape 1 : Types partagés (shared-types)

**Le But** : Définir le schéma Zod pour la réponse de l'API calendrier.

**Fichier** : `packages/shared-types/src/schemas/calendar.schema.ts`

**Ta Mission** :

Crée un schéma qui décrit une "entry enrichie" pour le calendrier. Chaque entry doit contenir :

| Champ | Source | Description |
|-------|--------|-------------|
| `id` | sowing_entry | UUID de l'entry |
| `plannedStartDate` | sowing_entry | Date de semis planifiée |
| `actualStartDate` | sowing_entry | Date de semis réelle (nullable) |
| `estimatedEndDate` | sowing_entry | Date de fin estimée (nullable) |
| `actualEndDate` | sowing_entry | Date de fin réelle (nullable) |
| `status` | sowing_entry | Status de l'entry |
| `location` | sowing_entry | indoor/greenhouse/outdoor (nullable) |
| `quantity` | sowing_entry | Quantité semée |
| `sessionId` | sowing_entry | ID de la session parente |
| `sessionName` | sowing_session | Nom de la session |
| `seedId` | sowing_entry | ID de la graine |
| `seedLabel` | seed | Label utilisateur de la graine |
| `plantCommonName` | plant | Nom commun de la plante |
| `plantLatinName` | plant | Nom latin (nullable) |

Tu as besoin de :
- Un schéma `calendarEntrySchema` pour une entry enrichie
- Un type `CalendarEntry` inféré
- Un schéma `calendarQuerySchema` pour les query params (`year`, `month`)

**Hints** :

- Regarde `sowing-entry.schema.ts` pour les enums existants (`sowingEntryStatusEnum`, `sowingEntryLocationEnum`)
- Les query params `year` et `month` sont des `z.coerce.number()` (comme dans `sowing-session.routes.ts`)
- `month` doit être entre 1 et 12

<details>
<summary><b>Code suggestion (essaie d'abord !)</b></summary>

```typescript
// packages/shared-types/src/schemas/calendar.schema.ts

import { z } from "zod";
import { sowingEntryStatusEnum, sowingEntryLocationEnum } from "./sowing-entry.schema";

// ============================================
// Schéma query params
// Utilisé par : route backend GET /api/calendar (zValidator) + frontend (query params)
// ============================================

export const calendarQuerySchema = z.object({
   year: z.coerce.number().int().min(2000).max(2200),
   month: z.coerce.number().int().min(1).max(12),
});

export type CalendarQuery = z.infer<typeof calendarQuerySchema>;

// ============================================
// Schéma d'une entry enrichie pour le calendrier
// Utilisé par : désérialisation réponse API côté frontend
// ============================================

export const calendarEntrySchema = z.object({
   // Entry data
   id: z.string().uuid(),
   plannedStartDate: z.string(),
   actualStartDate: z.string().nullable(),
   estimatedEndDate: z.string().nullable(),
   actualEndDate: z.string().nullable(),
   status: sowingEntryStatusEnum,
   location: sowingEntryLocationEnum.nullable(),
   quantity: z.number().int().nullable(),

   // Session context
   sessionId: z.string().uuid(),
   sessionName: z.string(),

   // Seed + Plant info
   seedId: z.string().uuid(),
   seedLabel: z.string().nullable(),
   plantCommonName: z.string().nullable(),
   plantLatinName: z.string().nullable(),
});

export type CalendarEntry = z.infer<typeof calendarEntrySchema>;
```

</details>

**N'oublie pas** : Exporte les nouveaux schemas depuis le barrel file `packages/shared-types/src/index.ts`.

---

### Étape 2 : Service calendrier (backend)

**Le But** : Créer le service qui récupère les entries enrichies pour un mois donné.

**Fichier** : `apps/backend/src/services/calendar.service.ts`

**Ta Mission** :

Crée une méthode `getMonthEntries(userId, year, month)` qui :

1. Calcule les bornes du mois (`startOfMonth`, `endOfMonth`)
2. Fait une jointure `sowing_entry` → `sowing_session` → `seed` → `plant`
3. Filtre par `userId` (via `sowing_session.userId`) et par plage de dates sur `plannedStartDate`
4. Retourne les entries enrichies avec les infos session, seed et plant

**Hints** :

- Pour les bornes du mois : `new Date(year, month - 1, 1)` et `new Date(year, month, 0)` (dernier jour)
- Drizzle supporte les jointures avec `.innerJoin()` et `.leftJoin()`
- Utilise `gte` (>=) et `lte` (<=) de `drizzle-orm` pour le filtrage par dates
- La colonne `plannedStartDate` est de type `date` en PostgreSQL
- Tu dois joindre : `sowingEntry` → `sowingSession` (via `sessionId`) → `seed` (via `seedId`) → `plant` (via seed `plantId`)
- Le `leftJoin` est préférable pour `seed` → `plant` car `plantId` est nullable dans `seed`

<details>
<summary><b>Structure de la requête Drizzle</b></summary>

```typescript
import { db } from "../db";
import {
   sowingEntry,
   sowingSession,
   seed,
   plant,
} from "../db/schemas";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export const calendarService = {
   async getMonthEntries(userId: string, year: number, month: number) {
      // Bornes du mois en format ISO (YYYY-MM-DD)
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      const results = await db
         .select({
            // Entry
            id: sowingEntry.id,
            plannedStartDate: sowingEntry.plannedStartDate,
            actualStartDate: sowingEntry.actualStartDate,
            estimatedEndDate: sowingEntry.estimatedEndDate,
            actualEndDate: sowingEntry.actualEndDate,
            status: sowingEntry.status,
            location: sowingEntry.location,
            quantity: sowingEntry.quantity,
            // Session
            sessionId: sowingEntry.sessionId,
            sessionName: sowingSession.name,
            // Seed
            seedId: sowingEntry.seedId,
            seedLabel: seed.userLabel,
            // Plant
            plantCommonName: plant.commonName,
            plantLatinName: sql<string | null>`
               CASE
                  WHEN ${plant.genus} IS NOT NULL
                  THEN CONCAT(${plant.genus}, ' ', COALESCE(${plant.species}, ''))
                  ELSE NULL
               END
            `.as("plantLatinName"),
         })
         .from(sowingEntry)
         .innerJoin(sowingSession, eq(sowingEntry.sessionId, sowingSession.id))
         .innerJoin(seed, eq(sowingEntry.seedId, seed.id))
         .leftJoin(plant, eq(seed.plantId, plant.id))
         .where(
            and(
               eq(sowingSession.userId, userId),
               gte(sowingEntry.plannedStartDate, startDate),
               lte(sowingEntry.plannedStartDate, endDate)
            )
         )
         .orderBy(sowingEntry.plannedStartDate);

      return results;
   },
};
```

</details>

---

### Étape 3 : Route calendrier (backend)

**Le But** : Créer l'endpoint `GET /api/calendar`.

**Fichier** : `apps/backend/src/routes/calendar.routes.ts`

**Ta Mission** :

Crée une route `GET /` avec :
- Middleware `requireAuth`
- Validation des query params (`year`, `month`) via `zValidator`
- Appel au `calendarService.getMonthEntries()`
- Réponse au format `{ success: true, data: entries }`

**Hints** :

- Regarde `sowing-session.routes.ts` pour le pattern de validation des query params
- Le `calendarQuerySchema` est importé depuis `@happyseeds/shared-types`
- C'est une route simple — un seul endpoint GET, pas de CRUD

<details>
<summary><b>Code suggestion (essaie d'abord !)</b></summary>

```typescript
// apps/backend/src/routes/calendar.routes.ts

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { calendarQuerySchema } from "@happyseeds/shared-types";
import { requireAuth } from "../middleware/auth.middleware";
import { calendarService } from "../services/calendar.service";

export const calendarRoutes = new Hono()
   .use("/*", requireAuth)

   // GET /api/calendar?year=2026&month=3
   .get("/", zValidator("query", calendarQuerySchema), async (c) => {
      const userId = c.get("userId");
      const { year, month } = c.req.valid("query");

      const entries = await calendarService.getMonthEntries(userId, year, month);

      return c.json({ success: true, data: entries });
   });
```

</details>

---

### Étape 4 : Montage de la route

**Le But** : Monter la route calendrier dans `app.ts`.

**Fichier** : `apps/backend/src/app.ts`

**Ta Mission** :

1. Importe `calendarRoutes` depuis `./routes/calendar.routes`
2. Monte la route sur `/api/calendar`

**Hints** :

- Place-la **après** les routes de sowing-sessions (pas de conflit de chemin ici)
- Le pattern est identique aux autres : `app.route("/api/calendar", calendarRoutes)`

<details>
<summary><b>Il suffit d'ajouter 2 lignes</b></summary>

```typescript
// Import (en haut du fichier)
import { calendarRoutes } from "./routes/calendar.routes";

// Montage (après SowingSession)
app.route("/api/calendar", calendarRoutes);
```

</details>

---

### Étape 5 : Export shared-types

**Le But** : S'assurer que les nouveaux types sont exportés.

**Fichier** : `packages/shared-types/src/index.ts`

**Ta Mission** :

Ajoute l'export du fichier `calendar.schema.ts` dans le barrel file.

<details>
<summary><b>Ligne à ajouter</b></summary>

```typescript
export * from "./schemas/calendar.schema";
```

</details>

---

### Étape 6 : Vérification avec curl/httpie

**Le But** : Tester l'endpoint directement.

1. Lance le projet : `pnpm dev`
2. Assure-toi d'avoir au moins une session avec des entries (dates de semis dans un mois précis)
3. Teste avec curl (ou httpie) :

```bash
# Remplace le cookie par ton cookie de session
curl "http://localhost:3001/api/calendar?year=2026&month=3" \
  -H "Cookie: better-auth.session_token=TON_TOKEN" | jq
```

**Résultat attendu** :

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "plannedStartDate": "2026-03-11",
      "status": "planned",
      "sessionName": "Semis printemps 2026",
      "seedLabel": "Tomate cerise",
      "plantCommonName": "Tomate",
      "plantLatinName": "Solanum lycopersicum",
      ...
    }
  ]
}
```

4. Teste aussi les cas limites :
   - Mois sans entries → `{ success: true, data: [] }`
   - Paramètres manquants → erreur de validation Zod
   - Mois invalide (13) → erreur de validation

---

## Session Validation

| Critère | Status |
|---------|--------|
| Schema `calendarQuerySchema` dans shared-types | [ ] |
| Schema `calendarEntrySchema` dans shared-types | [ ] |
| Export depuis `packages/shared-types/src/index.ts` | [ ] |
| Service `calendarService.getMonthEntries()` avec jointures | [ ] |
| Route `GET /api/calendar?year=&month=` avec auth + validation | [ ] |
| Montage dans `app.ts` | [ ] |
| Données enrichies (session name, seed label, plant name) | [ ] |
| Filtrage par plage de dates fonctionne | [ ] |
| Mois vide retourne `[]` | [ ] |

---

## Knowledge Consolidation

1. **Vocabulary** : Ajoute à `cours/VOCABULARY.md` :
   - `endpoint d'agrégation` — endpoint qui combine des données de plusieurs tables pour une vue optimisée
   - `innerJoin` vs `leftJoin` — inner exclut si pas de correspondance, left inclut avec null
   - `gte` / `lte` — greater than or equal / less than or equal (filtres de plage)

2. **Summary** : Note 3 choses apprises/consolidées :
   - _1._
   - _2._
   - _3._

---

## Git Workflow

**Branche** : `feature/session5.1-calendar-api`

Commite après chaque étape fonctionnelle :

```bash
# Après shared-types
git add packages/shared-types/
git commit -m "feat(shared-types): add calendar entry and query schemas"

# Après service + routes + montage
git add apps/backend/src/services/calendar.service.ts apps/backend/src/routes/calendar.routes.ts apps/backend/src/app.ts
git commit -m "feat(backend): add calendar API endpoint with month filtering"
```

---

## Bonus (si tu veux aller plus loin)

- **Inclure les entries par `actualStartDate`** : En plus du filtre sur `plannedStartDate`, inclure aussi les entries dont la date réelle (`actualStartDate`) tombe dans le mois
- **Grouper par date** : Au lieu d'un tableau plat, retourner un objet `{ "2026-03-11": [...entries], "2026-03-15": [...entries] }`
- **Ajouter la couleur du status** : Inclure un champ `statusColor` dans la réponse pour simplifier le rendu frontend

---

## Next Session Preview

Dans la session 5.2, nous créerons le **composant calendrier frontend** — une grille mensuelle qui affiche les semis sur les bonnes dates avec navigation entre les mois. Ce sera la première vue de "data visualization" de l'app !

---

## Mode Compass - Two-Strike Rule

**Rappel** : Si tu es bloqué après 2 tentatives, dis-le ! Je basculerai en mode Walkthrough.

Les jointures Drizzle et le filtrage par dates sont des concepts nouveaux. Prends le temps de comprendre la requête — les `<details>` sont là pour t'aider si tu es bloqué.

---

**Bonne session !**
