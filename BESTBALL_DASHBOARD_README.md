# Dashboard BestBall - FantasyBallers

## Vue d'ensemble

Le Dashboard BestBall est une nouvelle fonctionnalité intégrée au site web FantasyBallers qui permet d'afficher un classement global de toutes les ligues BestBall. Cette fonctionnalité remplace partiellement l'utilisation de Google Data Studio en intégrant directement les données dans le site web.

## Fonctionnalités

### 🏆 Classement Global
- Affichage du classement global de tous les managers de toutes les ligues BestBall
- Tri automatique par points (du plus haut au plus bas)
- Calcul des points totaux de la saison pour chaque manager

### 📅 Vue par Semaine
- Possibilité de voir le classement d'une semaine spécifique
- Navigation facile entre les différentes semaines
- Affichage de l'évolution des performances

### 📊 Statistiques
- Nombre total de managers
- Meilleur score de la semaine/saison
- Moyenne des points de tous les managers

## Structure des Fichiers

```
src/
├── routes/
│   ├── bestball-dashboard/
│   │   ├── +page.js          # Logique de chargement des données
│   │   └── +page.svelte      # Interface utilisateur
│   └── api/
│       └── bestball-dashboard/
│           └── +server.js     # API backend
└── lib/
    └── utils/
        └── bestballConfig.js  # Configuration des ligues BestBall
```

## Configuration

### Ligues BestBall
Les ligues BestBall sont configurées dans `src/lib/utils/bestballConfig.js`. Ce fichier contient les IDs des ligues Sleeper pour la saison 2025.

**Note importante :** Ce fichier doit être synchronisé avec `FBDashboard/config.py` pour maintenir la cohérence entre le dashboard web et le script Python.

### Mise à jour des ligues
Pour ajouter ou modifier des ligues BestBall :

1. Mettre à jour `FBDashboard/config.py`
2. Mettre à jour `src/lib/utils/bestballConfig.js`
3. Redémarrer le serveur de développement

## API Endpoints

### GET /api/bestball-dashboard
Récupère les données du dashboard BestBall.

**Paramètres de requête :**
- `week` (optionnel) : Numéro de la semaine (1-18). Si omis ou égal à 0, retourne le classement global.

**Réponse :**
```json
{
  "standings": [
    {
      "manager": "Nom du Manager",
      "league": "Nom de la Ligue",
      "points": 1234.56,
      "week": 5
    }
  ],
  "currentWeek": 6,
  "totalWeeks": 18,
  "selectedWeek": 5
}
```

## Intégration avec le Code Python Existant

Le dashboard utilise la même logique que votre script Python `FBDashboard/main.py` :

1. **Récupération des données** : Utilise les mêmes endpoints Sleeper API
2. **Traitement des données** : Applique la même logique de calcul des points
3. **Configuration** : Utilise les mêmes IDs de ligues

## Navigation

Le dashboard BestBall est accessible via :
- **Menu principal** → **League Info** → **Dashboard BestBall**
- **URL directe** : `/bestball-dashboard`

## Développement

### Ajout de nouvelles fonctionnalités
Pour étendre le dashboard :

1. Modifier `+page.svelte` pour l'interface utilisateur
2. Modifier `+server.js` pour la logique backend
3. Ajouter de nouveaux endpoints API si nécessaire

### Tests
Pour tester le dashboard :

1. Démarrer le serveur de développement : `npm run dev`
2. Naviguer vers `/bestball-dashboard`
3. Vérifier que les données se chargent correctement
4. Tester la navigation entre les semaines

## Maintenance

### Synchronisation des données
Le dashboard se synchronise automatiquement avec les données Sleeper. Aucune action manuelle n'est requise.

### Mise à jour des ligues
Lors de l'ajout de nouvelles ligues BestBall :

1. Ajouter l'ID de la ligue dans `bestballConfig.js`
2. Le dashboard l'inclura automatiquement dans le classement

## Support

Pour toute question ou problème avec le dashboard BestBall, consulter :
- Les logs du serveur pour les erreurs API
- La console du navigateur pour les erreurs frontend
- La documentation Sleeper API pour les changements d'endpoints

## Évolutions Futures

- [ ] Ajout de graphiques d'évolution des performances
- [ ] Comparaison des performances entre managers
- [ ] Export des données en CSV/Excel
- [ ] Notifications des meilleures performances
- [ ] Intégration avec les réseaux sociaux 