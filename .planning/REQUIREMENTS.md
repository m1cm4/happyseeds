# Requirements: HappySeeds

**Defined:** 2026-02-03
**Core Value:** Gérer sa collection de graines et planifier ses semis visuellement

## v1 Requirements

### Authentication (AUTH) ✓ Validé

- [x] **AUTH-01**: User peut s'inscrire avec email/password
- [x] **AUTH-02**: User peut se connecter et rester connecté
- [x] **AUTH-03**: User peut se déconnecter
- [x] **AUTH-04**: Routes protégées redirigent vers login

### Plants (PLNT)

- [x] **PLNT-01**: User peut voir la liste des plantes
- [x] **PLNT-02**: User peut créer une fiche plante
- [x] **PLNT-03**: User peut modifier une fiche plante
- [x] **PLNT-04**: User peut supprimer une fiche plante
- [ ] **PLNT-05**: Schéma plant avec champs horticoles (hardiness, position, périodes)
- [ ] **PLNT-06**: Formulaire plant avec nouveaux champs
- [ ] **PLNT-07**: Page détail plant améliorée
- [ ] **PLNT-08**: Dialog de confirmation suppression

### Seeds (SEED)

- [x] **SEED-01**: User peut voir ses graines
- [x] **SEED-02**: User peut ajouter une graine à une plante
- [x] **SEED-03**: User peut modifier une graine
- [x] **SEED-04**: User peut supprimer une graine
- [ ] **SEED-05**: Schéma seed refactorisé (snake_case)
- [ ] **SEED-06**: Formulaire seed avec sélection plante améliorée
- [ ] **SEED-07**: Navigation bidirectionnelle Plant ↔ Seeds

### Navigation (NAV)

- [ ] **NAV-01**: Header avec navigation principale
- [ ] **NAV-02**: Breadcrumbs sur les pages
- [ ] **NAV-03**: Liens "Voir les graines" sur PlantDetail
- [ ] **NAV-04**: Layout authentifié complet

### Sowing Sessions (SOW)

- [ ] **SOW-01**: User peut créer une session de semis
- [ ] **SOW-02**: User peut ajouter des entries (graines à semer)
- [ ] **SOW-03**: Dates estimées calculées automatiquement
- [ ] **SOW-04**: User peut changer le status d'une entry
- [ ] **SOW-05**: Wizard de création avec sélection de graines

### Calendar (CAL)

- [ ] **CAL-01**: User peut voir ses semis sur un calendrier mensuel
- [ ] **CAL-02**: User peut naviguer entre les mois
- [ ] **CAL-03**: Clic sur une date montre les détails

### Dashboard (DASH)

- [ ] **DASH-01**: Stats globales (nb plantes, graines, sessions)
- [ ] **DASH-02**: Tâches à venir (prochains semis)
- [ ] **DASH-03**: Liens rapides vers actions courantes
- [ ] **DASH-04**: Dashboard comme page par défaut après login

### Polish (UX)

- [ ] **UX-01**: Loading skeletons sur toutes les listes
- [ ] **UX-02**: Empty states informatifs
- [ ] **UX-03**: Error boundaries configurés
- [ ] **UX-04**: Responsive mobile vérifié

## v2 Requirements

### Images
- **IMG-01**: Table plant_image pour photothèque
- **IMG-02**: Upload d'images
- **IMG-03**: Galerie sur fiche plante

### Notifications
- **NOTF-01**: Rappels de semis
- **NOTF-02**: Notifications in-app

### Advanced
- **ADV-01**: Compagnonnage entre plantes
- **ADV-02**: Export calendrier (iCal)
- **ADV-03**: Multi-utilisateur (partage de fiches)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mobile app native | Web-first pour MVP |
| OAuth login | Email/password suffit |
| Real-time sync | Pas nécessaire pour usage solo |
| Multi-langue | Français uniquement v1 |
| Marketplace graines | Hors périmètre |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01..04 | — | ✓ Complete |
| PLNT-01..04 | — | ✓ Complete |
| PLNT-05..06 | Phase 1 | In Progress |
| PLNT-07..08 | Phase 2 | Pending |
| SEED-01..04 | — | ✓ Complete |
| SEED-05..06 | Phase 1 | Pending |
| SEED-07 | Phase 3 | Pending |
| NAV-01..04 | Phase 3 | Pending |
| SOW-01..05 | Phase 4 | Pending |
| CAL-01..03 | Phase 5 | Pending |
| DASH-01..04 | Phase 6 | Pending |
| UX-01..04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 27 total
- Validated: 12
- Active: 15
- Mapped to phases: 15 ✓

---
*Requirements defined: 2026-02-03*
*Last updated: 2026-02-03 after GSD initialization*
