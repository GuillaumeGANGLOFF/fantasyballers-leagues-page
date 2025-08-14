export const load = async ({ fetch }) => {
    try {
        // Récupérer les données des ligues BestBall depuis l'API
        const response = await fetch('/api/bestball-dashboard');
        if (response.ok) {
            const data = await response.json();
            return {
                standings: data.standings || [],
                currentWeek: data.currentWeek || 0,
                totalWeeks: data.totalWeeks || 18
            };
        }
        return {
            standings: [],
            currentWeek: 0,
            totalWeeks: 18
        };
    } catch (error) {
        console.error('Erreur lors du chargement du dashboard BestBall:', error);
        return {
            standings: [],
            currentWeek: 0,
            totalWeeks: 18
        };
    }
}; 