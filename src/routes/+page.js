import { getNflState, getAwards, getLeagueTeamManagers } from '$lib/utils/helper';

/**
 * Charge les données principales de la page d'accueil.
 * Les Promises sont retournées sans await : SvelteKit les stream et les {#await}
 * dans +page.svelte les consomment.
 * Quand invalidateAll() est appelé (après un switchLeague), cette fonction
 * est ré-exécutée avec les stores vidés → nouveaux fetch Sleeper.
 */
export async function load() {
    return {
        nflState: getNflState(),
        podiumsData: getAwards(),
        leagueTeamManagersData: getLeagueTeamManagers(),
    };
}
