# Roadmap: HappySeeds MVP

**Created:** 2026-02-03
**Milestone:** v1.0 MVP
**Phases:** 6

## Overview

| # | Phase | Goal | Requirements | Status |
|---|-------|------|--------------|--------|
| 1 | Refactoring 2.4b | Finaliser refactoring schémas Plant/Seed | PLNT-05,06 SEED-05,06 | ◆ In Progress |
| 2 | Plant Detail | Page détail améliorée + suppression | PLNT-07,08 | ○ Pending |
| 3 | Navigation & UX | Navigation complète + liens bidirectionnels | SEED-07 NAV-01..04 | ○ Pending |
| 4 | Sowing Sessions | CRUD sessions de semis avec wizard | SOW-01..05 | ○ Pending |
| 5 | Calendar | Vue calendrier interactive | CAL-01..03 | ○ Pending |
| 6 | Dashboard & Polish | Stats, dashboard, finitions UX | DASH-01..04 UX-01..04 | ○ Pending |

---

## Phase 1: Refactoring 2.4b

**Goal:** Finaliser le refactoring des schémas Plant et Seed avec nouveaux champs horticoles.

**Maps to:** Session 2.4b (Phases 6-8)

**Requirements:**
- PLNT-05: Schéma plant avec champs horticoles
- PLNT-06: Formulaire plant avec nouveaux champs
- SEED-05: Schéma seed refactorisé
- SEED-06: Formulaire seed amélioré

**Success Criteria:**
1. Formulaire Plant frontend fonctionne avec tous les nouveaux champs
2. Schéma Seed migré en snake_case avec nouveaux enums
3. Formulaire Seed frontend adapté
4. Tests manuels CRUD Plant et Seed passent
5. Données existantes préservées après migration

**Notes:**
- Plant backend déjà fait (Phases 1-5 complètes)
- Reste : Plant frontend forms + Seeds complet

---

## Phase 2: Plant Detail

**Goal:** Améliorer la page détail plante avec affichage complet et suppression sécurisée.

**Maps to:** Session 2.5

**Requirements:**
- PLNT-07: Page détail plant améliorée
- PLNT-08: Dialog de confirmation suppression

**Success Criteria:**
1. Page `/plant/$id` affiche tous les champs du nouveau schéma
2. Boutons Edit/Delete visibles
3. AlertDialog de confirmation avant suppression
4. Redirection vers liste après suppression
5. Toast de confirmation

---

## Phase 3: Navigation & UX

**Goal:** Navigation fluide entre entités avec header, breadcrumbs et liens contextuels.

**Maps to:** Sessions 3.1-3.3

**Requirements:**
- SEED-07: Navigation bidirectionnelle Plant ↔ Seeds
- NAV-01: Header avec navigation principale
- NAV-02: Breadcrumbs sur les pages
- NAV-03: Liens "Voir les graines" sur PlantDetail
- NAV-04: Layout authentifié complet

**Success Criteria:**
1. Header présent sur toutes les pages authentifiées
2. Breadcrumbs indiquent la position (Home > Plants > Tomate)
3. PlantDetail a un lien vers ses Seeds
4. SeedDetail a un lien retour vers sa Plant
5. Navigation au clavier fonctionne

---

## Phase 4: Sowing Sessions

**Goal:** Permettre la création et gestion de sessions de semis avec calcul automatique des dates.

**Maps to:** Sessions 4.1-4.3

**Requirements:**
- SOW-01: Créer une session de semis
- SOW-02: Ajouter des entries (graines à semer)
- SOW-03: Dates estimées calculées automatiquement
- SOW-04: Changer le status d'une entry
- SOW-05: Wizard de création avec sélection de graines

**Success Criteria:**
1. User peut créer une session avec nom et année
2. User peut ajouter des graines à la session
3. Date estimée de fin calculée depuis données Plant
4. Status entry peut être changé (planned → sowing → growing → completed)
5. Wizard guide l'utilisateur étape par étape

**Database:**
- Table `sowing_session` (id, user_id, name, year, start_date, status)
- Table `sowing_entry` (id, session_id, seed_id, planned_date, actual_date, status)

---

## Phase 5: Calendar

**Goal:** Visualiser les semis sur un calendrier mensuel interactif.

**Maps to:** Sessions 5.1-5.2

**Requirements:**
- CAL-01: Vue calendrier mensuel
- CAL-02: Navigation entre mois
- CAL-03: Détails au clic sur une date

**Success Criteria:**
1. Page `/calendar` affiche le mois courant
2. Entries visibles sur leurs dates planifiées
3. Boutons précédent/suivant pour naviguer
4. Clic sur date avec entries ouvre un détail
5. Couleurs différentes selon status

---

## Phase 6: Dashboard & Polish

**Goal:** Dashboard informatif et finitions UX pour un MVP complet.

**Maps to:** Sessions 6.1-6.3

**Requirements:**
- DASH-01: Stats globales
- DASH-02: Tâches à venir
- DASH-03: Liens rapides
- DASH-04: Dashboard comme page par défaut
- UX-01: Loading skeletons
- UX-02: Empty states
- UX-03: Error boundaries
- UX-04: Responsive mobile

**Success Criteria:**
1. `/dashboard` affiche stats (nb plantes, graines, sessions actives)
2. Widget "Prochains semis" avec les 5 prochaines tâches
3. Liens rapides vers création plant/seed/session
4. Redirection `/` → `/dashboard` pour users connectés
5. Skeletons sur toutes les listes pendant chargement
6. Messages informatifs quand listes vides
7. Erreurs attrapées sans crash
8. Layout correct sur mobile (testé 375px)

---

## Session Mapping

| GSD Phase | PLANNING.md Sessions |
|-----------|---------------------|
| Phase 1 | 2.4b (Phases 6-8) |
| Phase 2 | 2.5 |
| Phase 3 | 3.1, 3.2, 3.3 |
| Phase 4 | 4.1, 4.2, 4.3 |
| Phase 5 | 5.1, 5.2 |
| Phase 6 | 6.1, 6.2, 6.3 |

---
*Roadmap created: 2026-02-03*
*Last updated: 2026-02-03*
