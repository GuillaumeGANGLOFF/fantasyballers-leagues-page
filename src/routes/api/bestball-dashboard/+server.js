import { json } from '@sveltejs/kit';
import { BBID } from '$lib/utils/bestballConfig.js';

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

// Fonction pour récupérer les matchups d'une ligue pour une semaine donnée
async function getLeagueMatchups(leagueId, week) {
    try {
        const response = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des matchups');
        return await response.json();
    } catch (error) {
        console.error(`Erreur pour les matchups de la ligue ${leagueId} semaine ${week}:`, error);
        return null;
    }
}

// Fonction pour récupérer les informations d'un utilisateur
async function getUserInfo(userId) {
    try {
        const response = await fetch(`https://api.sleeper.app/v1/user/${userId}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des informations utilisateur');
        return await response.json();
    } catch (error) {
        console.error(`Erreur pour l'utilisateur ${userId}:`, error);
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

export async function GET({ url }) {
    try {
        const weekParam = url.searchParams.get('week');
        
        // Récupérer l'état NFL
        const nflState = await getNflState();
        if (!nflState) {
            throw new Error('Impossible de récupérer l\'état NFL');
        }
        
        const currentWeek = nflState.week || 0;
        const totalWeeks = 18; // Saison régulière NFL

        let targetWeek = 0; // 0 = global, sinon semaine spécifique
        if (weekParam && weekParam !== '0') {
            targetWeek = parseInt(weekParam);
        }

        // Récupérer les données de toutes les ligues BestBall en parallèle
        const allStandings = [];
        
        // Récupérer toutes les informations de base en parallèle
        const leaguePromises = BBID.map(async (leagueId) => {
            const [leagueInfo, rosters] = await Promise.all([
                getLeagueInfo(leagueId),
                getLeagueRosters(leagueId)
            ]);
            return { leagueId, leagueInfo, rosters };
        });

        const leagueResults = await Promise.all(leaguePromises);
        
        // Traiter les données par semaine ou globalement
        if (targetWeek > 0) {
            // Vue par semaine - plus rapide car une seule requête par ligue
            const matchupPromises = leagueResults.map(async ({ leagueId, leagueInfo, rosters }) => {
                if (!leagueInfo || !rosters) return [];
                
                const matchups = await getLeagueMatchups(leagueId, targetWeek);
                if (!matchups) return [];
                
                const weekStandings = [];
                for (const matchup of matchups) {
                    const roster = rosters.find(r => r.roster_id === matchup.roster_id);
                    if (roster && roster.owner_id) {
                        const userInfo = await getUserInfo(roster.owner_id);
                        if (userInfo) {
                            weekStandings.push({
                                manager: userInfo.display_name || userInfo.username || 'Manager inconnu',
                                league: leagueInfo.name,
                                points: parseFloat(matchup.points || 0),
                                week: targetWeek
                            });
                        }
                    }
                }
                return weekStandings;
            });

            const weekResults = await Promise.all(matchupPromises);
            weekResults.forEach(standings => allStandings.push(...standings));
            
        } else {
            // Classement global - optimisé pour récupérer seulement la dernière semaine
            const lastWeek = Math.max(1, currentWeek - 1);
            
            for (const { leagueId, leagueInfo, rosters } of leagueResults) {
                if (!leagueInfo || !rosters) continue;
                
                // Récupérer seulement la dernière semaine pour le classement global
                const lastWeekMatchups = await getLeagueMatchups(leagueId, lastWeek);
                if (lastWeekMatchups) {
                    for (const roster of rosters) {
                        if (roster.owner_id) {
                            const userInfo = await getUserInfo(roster.owner_id);
                            if (userInfo) {
                                const userMatchup = lastWeekMatchups.find(m => m.roster_id === roster.roster_id);
                                if (userMatchup && userMatchup.points) {
                                    allStandings.push({
                                        manager: userInfo.display_name || userInfo.username || 'Manager inconnu',
                                        league: leagueInfo.name,
                                        points: parseFloat(userMatchup.points),
                                        week: lastWeek
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

        // Trier par points (décroissant)
        allStandings.sort((a, b) => b.points - a.points);

        return json({
            standings: allStandings,
            currentWeek: currentWeek,
            totalWeeks: totalWeeks,
            selectedWeek: targetWeek
        });

    } catch (error) {
        console.error('Erreur dans l\'API BestBall Dashboard:', error);
        return json({
            error: 'Erreur lors de la récupération des données',
            standings: [],
            currentWeek: 0,
            totalWeeks: 18
        }, { status: 500 });
    }
} 