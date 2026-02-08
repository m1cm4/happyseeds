# Migration Skill dev-mentor - Rapport d'Analyse

> Date : 2026-02-08
> Ancienne version : dev-mentor 1.0 (utilisée jusqu'à maintenant)
> Nouvelle version : dev-mentor (avec Walkthrough/Compass modes)

---

## 📊 Comparaison des Versions

### Changements Majeurs

| Aspect | Ancienne (1.0) | Nouvelle |
|--------|----------------|----------|
| **Modes pédagogiques** | Un seul mode implicite (instructions) | **Walkthrough** OU **Compass** (choix apprenant) |
| **Onboarding** | Simple | **Conversation structurée** (5 étapes) |
| **Dossier théorie** | `theorie/` | **`memo/`** (références personnelles) |
| **Fichiers requis** | LEARNER-PROFILE, PLANNING, sessions, theorie | LEARNER-PROFILE, PLANNING, **DEBUG-JOURNAL**, **VOCABULARY**, sessions, memo |
| **Templates** | 5 fichiers de référence | **11 fichiers de référence** (onboarding, workflow, 2 session templates, etc.) |
| **Consolidation** | Informelle | **Formalisée** (VOCABULARY en propres mots + summary 3 points) |
| **Warm-Up** | Absent | **Active Recall** systématique au début de chaque session |
| **Scripts Python** | init-session.py, init-theorie.py, init-profile.py | Absents (non mentionnés) |
| **Commands** | next, explain, why, debug, review, recap, planning, profile, retrospective, docs | Idem + **vocab**, **mode** |

### Nouveaux Concepts

1. **Deux Modes Pédagogiques** :
   - **Walkthrough** : Instructions complètes avec What/How/Why (pour débutants)
   - **Compass** : Hints + Socratic method + Two-Strike Rule (pour autonomie)

2. **Onboarding Conversationnel** :
   - Étape 0 : Comprendre le besoin
   - Étape 1 : Connaître l'apprenant
   - Étape 2 : Assessment ciblé
   - Étape 3 : Choix du mode
   - Étape 4 : Création des fichiers
   - Étape 5 : Approbation

3. **Consolidation Renforcée** :
   - VOCABULARY.md : apprenant définit termes dans ses propres mots
   - DEBUG-JOURNAL.md : log d'analyse d'erreurs
   - Summary 3 points à la fin de chaque session

4. **Warm-Up Systématique** :
   - Question d'Active Recall basée sur weak points du profile
   - Au début de CHAQUE session

---

## 🗂️ État Actuel du Projet HappySeeds

### ✅ Fichiers Existants et Conformes

| Fichier | Location | Conforme |
|---------|----------|----------|
| LEARNER-PROFILE.md | `cours/` | ✅ (à vérifier format) |
| PLANNING.md | **`root/`** | ⚠️ **Mauvais emplacement** |
| CHECKPOINT.md | `cours/` | ✅ Bonus utile |
| SESSION-RESTRUCTURATION.md | `cours/` | ✅ Documentation |
| theorie/ (23 fichiers) | `cours/theorie/` | ⚠️ **Ancienne convention** → doit devenir `memo/` |
| session*.md (22 sessions) | `cours/` | ✅ Conforme |

### ❌ Fichiers Manquants (requis par nouvelle version)

| Fichier | Location Requise | Action |
|---------|------------------|--------|
| **DEBUG-JOURNAL.md** | `cours/` | 🔴 **À créer** |
| **VOCABULARY.md** | `cours/` | 🔴 **À créer** |
| **memo/** | `cours/memo/` | 🔴 **À créer** (renommer ou migrer theorie/) |

### ⚠️ Fichiers à Ajuster

| Action | Fichier | Raison |
|--------|---------|--------|
| **Déplacer** | `PLANNING.md` → `cours/PLANNING.md` | Nouvelle règle : "ALL mentor files in MENTOR_ROOT" |
| **Renommer OU Migrer** | `cours/theorie/` → `cours/memo/` | Nouvelle convention : `memo/` pour références personnelles |

---

## 🎯 Plan d'Action Détaillé

### Phase 1 : Créer Fichiers Manquants 🔴 PRIORITÉ HAUTE

#### 1.1 DEBUG-JOURNAL.md
```bash
# Créer le fichier avec template
```
**Contenu** : Utiliser le template de `.claude/skills/dev-mentor/references/debug-journal-template.md`

**Structure** :
```markdown
# Debug Journal

> Record your technical battles here to ensure you never have to fight the same bug twice.

---

## Log Entries

### [YYYY-MM-DD] | [Short Error Description]
- **Symptom**: ...
- **My Hypothesis**: ...
- **Investigation**: ...
- **Real Cause**: ...
- **Solution**: ...
- **Lesson Learned**: ...
```

#### 1.2 VOCABULARY.md
```bash
# Créer le fichier avec template
```
**Contenu** : Utiliser le template de `.claude/skills/dev-mentor/references/vocabulary-template.md`

**Structure** :
```markdown
# Personal Technical Glossary

> "If you can't explain it simply, you don't understand it well enough."

---

## A
### API
- **My Definition**: [Learner's own words]
- **Analogy**: [Memorable comparison]
- **Context**: [First encountered in Session X.Y]
```

**Action immédiate** : Peupler rétroactivement avec termes des 22 sessions déjà complétées ?
- ⚠️ Optionnel mais recommandé pour continuité

#### 1.3 Dossier memo/
**Options** :

**Option A** : Renommer `theorie/` → `memo/`
```bash
mv cours/theorie cours/memo
```
- ✅ Simple et direct
- ✅ Conserve l'historique Git
- ❌ Perd la sémantique "theorie" si utile

**Option B** : Créer `memo/` et migrer progressivement
```bash
mkdir cours/memo
# Garder theorie/ pour archive
# Nouvelles explications vont dans memo/
```
- ✅ Transition douce
- ✅ Garde l'ancien accessible
- ❌ Duplication temporaire

**Recommandation** : **Option A** (renommer) pour simplicité

---

### Phase 2 : Déplacer PLANNING.md 🟡 PRIORITÉ MOYENNE

```bash
mv PLANNING.md cours/PLANNING.md
```

**Vérification après déplacement** :
- [ ] Le fichier est bien dans `cours/`
- [ ] Format conforme au nouveau template (vérifier sections)
- [ ] Pas de références cassées dans le projet

---

### Phase 3 : Vérifier Conformité LEARNER-PROFILE.md 🟡 PRIORITÉ MOYENNE

**Comparer avec** : `.claude/skills/dev-mentor/references/profile-template.md`

**Sections à vérifier** :
- [ ] Identity & Goals
- [ ] Skill Matrix (avec colonne "Struggles / Weak Points")
- [ ] Concepts Mastered (avec liens memo)
- [ ] Strengths & Growth Areas
- [ ] Learning Style & Preferences
- [ ] **Victory Log** (nouveau !)
- [ ] Project History

**Action** : Lire le profil actuel et comparer

---

### Phase 4 : Adapter Sessions Futures 🟢 PRIORITÉ BASSE

**Pour les prochaines sessions (3.1+)** :

1. **Choisir le mode pédagogique** :
   - Walkthrough (instructions complètes) ?
   - Compass (hints + Socratic) ?

2. **Utiliser le template approprié** :
   - `.claude/skills/dev-mentor/references/session-templates/walkthrough-session.md`
   - `.claude/skills/dev-mentor/references/session-templates/compass-session.md`

3. **Ajouter Warm-Up** :
   - Question d'Active Recall basée sur LEARNER-PROFILE.md (Struggles / Weak Points)

4. **Ajouter Consolidation** :
   - Update VOCABULARY.md
   - Update LEARNER-PROFILE.md si skill level change
   - Summary 3 points clés

**Note** : Pas besoin de modifier rétroactivement les 22 sessions existantes

---

### Phase 5 : Peupler Rétroactivement (Optionnel) 🔵 BONUS

#### 5.1 DEBUG-JOURNAL.md
Ajouter des entries pour les bugs majeurs rencontrés dans les 22 sessions :
- Session 2.1 : Plants API (fichier vide, documenter pourquoi ?)
- Bugs TypeScript process (voir `fix-typescript-process-error.md`)
- Autres bugs notables du `mon_journal.md`

#### 5.2 VOCABULARY.md
Extraire termes techniques des sessions et demander à l'apprenant de définir :
- TanStack Query, useQuery, useMutation
- Drizzle ORM, schema, migration
- Better-Auth, session, middleware
- React Hook Form, Controller, Zod
- etc.

---

## 📋 Checklist de Migration

### Immédiat (Avant Session 3.1)
- [ ] Créer `cours/DEBUG-JOURNAL.md`
- [ ] Créer `cours/VOCABULARY.md`
- [ ] Renommer `cours/theorie/` → `cours/memo/` (ou créer `memo/`)
- [ ] Déplacer `PLANNING.md` → `cours/PLANNING.md`

### Avant Prochaine Session
- [ ] Vérifier conformité `LEARNER-PROFILE.md`
- [ ] Ajouter **Victory Log** au profile si absent
- [ ] Choisir mode pédagogique (Walkthrough OU Compass)
- [ ] Mettre à jour LEARNER-PROFILE.md avec le mode choisi

### Optionnel (Amélioration Continue)
- [ ] Peupler VOCABULARY.md rétroactivement (10-20 termes clés)
- [ ] Ajouter 2-3 entries majeures à DEBUG-JOURNAL.md
- [ ] Ajouter 2-3 achievements à Victory Log

---

## 🚀 Commandes Prêtes à Exécuter

```bash
# Phase 1 : Créer fichiers manquants
touch cours/DEBUG-JOURNAL.md cours/VOCABULARY.md

# Phase 2 : Déplacer PLANNING.md
mv PLANNING.md cours/PLANNING.md

# Phase 3 : Renommer theorie → memo
mv cours/theorie cours/memo

# Vérification
ls -la cours/
```

---

## ❓ Questions pour Confirmation

1. **Mode pédagogique** : Pour les sessions futures (3.1+), préfères-tu :
   - **Walkthrough** (instructions complètes comme jusqu'à maintenant) ?
   - **Compass** (hints + Socratic, plus d'autonomie) ?

2. **Migration theorie/ → memo/** :
   - Renommer directement ? ✅ Recommandé
   - Créer memo/ et garder theorie/ en archive ?

3. **Peuplement rétroactif** :
   - Veux-tu que je t'aide à peupler VOCABULARY.md avec les termes des 22 sessions ?
   - Veux-tu documenter les bugs majeurs dans DEBUG-JOURNAL.md ?

---

**Prochaine action recommandée** : Confirmer les choix (1-3) puis exécuter Phase 1 et 2.
