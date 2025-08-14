import { BBID } from '../bestballConfig.js';

// Fonction pour récupérer les informations d'une ligue
async function getLeagueInfo(leagueId) {
    try {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des données de la ligue');
        return await response.json();
    } catch (error) {
        console.error(`Erreur pour la ligue ${leagueId}:`, error);
        return null;
    }
}

// Fonction pour récupérer les rosters d'une ligue
async function getLeagueRosters(leagueId) {
    try {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des rosters');
        return await response.json();
    } catch (error) {
        console.error(`Erreur pour les rosters de la ligue ${leagueId}:`, error);
        return null;
    }
}

// Fonction pour récupérer l'état NFL
async function getNflState() {
    try {
        const response = await fetch('https://api.sleeper.app/v1/state/nfl');
        if (!response.ok) throw new Error('Erreur lors de la récupération de l\'état NFL');
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'état NFL:', error);
        return null;
    }
}

// Fonction principale pour précharger les données BestBall
export async function preloadBestBallData() {
    try {
        console.log('🔄 Préchargement des données BestBall...');
        
        // Récupérer l'état NFL en premier
        const nflState = await getNflState();
        if (!nflState) {
            console.warn('Impossible de récupérer l\'état NFL pour le préchargement BestBall');
            return null;
        }

        const currentWeek = nflState.week || 0;
        const lastWeek = Math.max(1, currentWeek - 1);

        // Récupérer les données de base de toutes les ligues BestBall en parallèle
        const leaguePromises = BBID.map(async (leagueId) => {
            const [leagueInfo, rosters] = await Promise.all([
                getLeagueInfo(leagueId),
                getLeagueRosters(leagueId)
            ]);
            return { leagueId, leagueInfo, rosters };
        });

        const leagueResults = await Promise.all(leaguePromises);
        
        // Préparer les données pour le cache
        const preloadedData = {
            lastWeek,
            currentWeek,
            leagues: leagueResults.filter(result => result.leagueInfo && result.rosters),
            timestamp: Date.now()
        };

        console.log(`✅ Préchargement BestBall terminé : ${preloadedData.leagues.length} ligues chargées`);
        return preloadedData;

    } catch (error) {
        console.error('❌ Erreur lors du préchargement BestBall:', error);
        return null;
    }
}

// Fonction pour vérifier si les données préchargées sont encore valides
export function isPreloadedDataValid(data, maxAgeMinutes = 10) {
    if (!data || !data.timestamp) return false;
    
    const age = Date.now() - data.timestamp;
    const maxAge = maxAgeMinutes * 60 * 1000;
    
    return age < maxAge;
} 