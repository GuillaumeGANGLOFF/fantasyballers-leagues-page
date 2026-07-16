/**
 * Déduplique les appels concurrents aux helpers async.
 *
 * Problème sans cette couche : si deux composants appellent getLeagueMatchups()
 * simultanément avant que le store soit rempli, deux requêtes Sleeper partent
 * en parallèle (race condition). L'un des deux résultats est perdu et on fait
 * le double du travail.
 *
 * Solution : on stocke la Promise en cours dans une Map. Si un deuxième appel
 * arrive avec la même clé, il reçoit la même Promise. Quand la Promise se
 * résout (ou rejette), l'entrée est supprimée pour permettre de futurs re-fetch.
 *
 * @example
 * // dans leagueMatchups.js
 * import { deduplicateFetch } from '$lib/utils/pendingFetches';
 *
 * export const getLeagueMatchups = () =>
 *   deduplicateFetch(`matchups_${id}`, fetchMatchupsFromSleeper);
 */

/** @type {Map<string, Promise<any>>} */
const pending = new Map();

/**
 * @template T
 * @param {string} key - Clé unique identifiant cette requête (ex: `matchups_${leagueId}`)
 * @param {() => Promise<T>} fetchFn - Fonction qui effectue le vrai fetch
 * @returns {Promise<T>}
 */
export function deduplicateFetch(key, fetchFn) {
    if (pending.has(key)) {
        return pending.get(key);
    }

    const promise = fetchFn().finally(() => pending.delete(key));
    pending.set(key, promise);
    return promise;
}
