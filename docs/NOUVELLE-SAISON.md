# Guide de mise à jour — Nouvelle saison

Ce document décrit toutes les étapes nécessaires pour préparer le site FantasyBallers à une nouvelle saison NFL.

---

## 1. Mettre à jour les IDs de ligues

**Fichier :** `src/lib/utils/leagueInfo.js`

C'est le **seul fichier à modifier obligatoirement** chaque saison. Il contient la liste de toutes les ligues actives.

### Comment trouver les nouveaux IDs ?

1. Créez (ou recevez) les nouvelles ligues Sleeper pour la saison
2. Ouvrez chaque ligue sur Sleeper → l'ID est dans l'URL : `https://sleeper.app/leagues/**1245685011647053824**/team`
3. Ou via l'API : `GET https://api.sleeper.app/v1/user/{user_id}/leagues/nfl/{year}`

### Structure d'une entrée

```js
{ id: "NOUVEL_ID", name: "FantasyBallers Best Ball 1", dynasty: false, classification: "BestBall" }
```

Les trois classifications disponibles :

| `classification` | Description |
|---|---|
| `"BestBall"` | Ligues BestBall — apparaissent dans le classement général `/bestball-ranking` |
| `"LigueFB"` | Ligues standard / superflex / dynasty / etc. |
| `"TrophéeFB"` | Ligues Trophée FB |

### Exemple de mise à jour

Remplacez les IDs existants par les nouveaux, **en conservant les noms et classifications**.

```js
// Avant (saison 2025)
{ id: "1245685011647053824", name: "FantasyBallers Best Ball 1", dynasty: false, classification: "BestBall" },

// Après (saison 2026)
{ id: "NOUVEL_ID_2026", name: "FantasyBallers Best Ball 1", dynasty: false, classification: "BestBall" },
```

> **Important :** si vous ajoutez ou supprimez des ligues BestBall, le classement général s'ajuste automatiquement — il filtre toutes les ligues avec `classification: "BestBall"`.

---

## 2. Vider le cache Sleeper (optionnel mais recommandé)

La page de classement BestBall utilise `localStorage` pour mettre en cache les données Sleeper. Après une mise à jour des IDs, les anciens caches sont automatiquement ignorés car les clés incluent l'ID de la ligue.

Si vous souhaitez forcer un recalcul complet, incrémentez la constante `CACHE_VERSION` dans le fichier de la page :

**Fichier :** `src/routes/bestball-ranking/+page.svelte`

```js
// Ligne ~7 — incrementez v2 → v3
const CACHE_VERSION = 'v3';
```

Ceci invalide tous les caches `localStorage` existants côté client.

---

## 3. Vérifier le nombre de semaines (ligues BestBall)

Le classement BestBall détecte automatiquement le nombre de semaines disponibles :

- **En saison active** → utilise `display_week` de l'API `https://api.sleeper.app/v1/state/nfl`
- **Hors-saison / saison terminée** → récupère `last_report` depuis la première ligue BestBall et retourne `last_report + 1`
- **Pré-draft** (`status: "pre_draft"`) → retourne 0 (pas de données, message affiché)

## 3b. Sélecteur d'année — logique automatique

La page suit la chaîne `previous_league_id` sur **2 niveaux** :

```
leagueInfo.js (N) → previous_league_id → N-1 → previous_league_id → N-2
```

Exemple avec des IDs 2026 dans leagueInfo.js :
- **2026** → pre_draft (pas de données au départ)
- **2025** → via `previous_league_id` (complete ✓)
- **2024** → via `previous_league_id` des ligues 2025 (complete ✓)

L'**année par défaut** est la première avec status ≠ `pre_draft`/`drafting` (= 2025 pendant l'hors-saison, 2026 quand la saison démarre).

---

## 4. Vérifier la navigation

**Fichier :** `src/lib/utils/tabs.js`

La navigation ne dépend pas des IDs de ligues — aucune modification nécessaire sauf si vous souhaitez ajouter ou renommer des onglets.

Structure actuelle :
- **Home** — page d'accueil avec power rankings
- **Matchups** — matchs de la semaine
- **Blog** — articles (désactivé par défaut via `enableBlog`)
- **League Info** *(menu déroulant)* — Rosters, Managers, Rivalry, Standings, Drafts, Trophy Room, Records, Trades & Waivers
- **BestBall Global** — classement général BestBall (`/bestball-ranking`)
- **Nos Liens** — lien Linktree externe

---

## 5. Paramètres optionnels

**Fichier :** `src/lib/utils/leagueInfo.js` (en bas du fichier)

```js
export const dues = 100;           // Mise de la saison (affiché dans la constitution)
export const enableBlog = false;   // Activer/désactiver l'onglet Blog
export const showPopup = false;    // Activer un popup sur la homepage
export const textPopup = `...`;    // Contenu HTML du popup (inscriptions, etc.)
```

---

## 6. Checklist récapitulative

```
[ ] 1. Remplacer tous les IDs de ligues dans src/lib/utils/leagueInfo.js
[ ] 2. Vérifier que les noms et classifications sont corrects
[ ] 3. (Optionnel) Incrémenter CACHE_VERSION dans +page.svelte si besoin d'invalider les caches
[ ] 4. Tester en local : npm run dev
[ ] 5. Vérifier la page /bestball-ranking (sélecteur de semaine, classement)
[ ] 6. Vérifier la page /standings sur une ligue active
[ ] 7. Déployer
```

---

## Architecture technique (référence rapide)

| Fichier | Rôle |
|---|---|
| `src/lib/utils/leagueInfo.js` | **IDs de ligues**, groupes, texte homepage, managers |
| `src/lib/utils/tabs.js` | Structure de la navigation |
| `src/lib/stores.js` | Stores Svelte (état global, cache mémoire) |
| `src/routes/bestball-ranking/+page.svelte` | Classement général BestBall (autonome, fetch direct Sleeper) |
| `src/routes/standings/` | Classement par ligue (utilise les stores) |
| `src/lib/utils/helperFunctions/` | Fonctions d'appel à l'API Sleeper |

### API Sleeper utilisées

```
GET /v1/state/nfl                        → Semaine courante, saison
GET /v1/league/{id}                      → Données de la ligue (saison, statut, settings)
GET /v1/league/{id}/users                → Joueurs (nom, avatar)
GET /v1/league/{id}/rosters             → Rosters (roster_id → owner_id, fpts)
GET /v1/league/{id}/matchups/{week}     → Points par équipe pour une semaine donnée
```
