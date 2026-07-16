import { leagueID, leagueName, leagueDynasty, clearLeagueStores } from '$lib/stores';
import { invalidateAll } from '$app/navigation';

/**
 * Switches the active league without a full page reload.
 *
 * 1. Updates the leagueID / leagueName / leagueDynasty stores (and localStorage via
 *    their subscriptions defined in stores.js).
 * 2. Clears all league-dependent caches so the next data access triggers a fresh fetch.
 * 3. Calls SvelteKit's invalidateAll() to re-run all active load() functions — each page
 *    gets new data without leaving the current URL.
 *
 * @param {{ id: string, name: string, dynasty: boolean }} league
 */
export async function switchLeague(league) {
    leagueID.set(league.id);
    leagueName.set(league.name);
    leagueDynasty.set(league.dynasty);

    clearLeagueStores();

    await invalidateAll();
}
