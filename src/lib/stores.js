import { writable } from 'svelte/store';
import { listLeagues } from './utils/leagueInfo.js'

const isBrowser = typeof window !== 'undefined';

export let awards = writable({});
export let leagueData = writable({});
export let upcomingDraft = writable({});
export let previousDrafts = writable([]);
export let matchupsStore = writable({});
export let records = writable({});
export let rostersStore = writable({});
export let transactionsStore = writable({});
export let teamManagersStore = writable({});
export let nflState = writable({});
export let players = writable({});
export let news = writable([]);
export let posts = writable([]);
export let brackets = writable({});
export let standingsStore = writable({});
export let leagueID = writable(isBrowser ? localStorage.getItem("leagueID") || listLeagues[0].id : listLeagues[0].id);
export let leagueName = writable(isBrowser ? localStorage.getItem("leagueName") || listLeagues[0].name : listLeagues[0].name);
export let leagueDynasty = writable(isBrowser ? localStorage.getItem("leagueDynasty") || listLeagues[0].dynasty : listLeagues[0].dynasty);

if (isBrowser) {
    leagueID.subscribe(value => {
        localStorage.setItem('leagueID', value);
    });
    leagueName.subscribe(value => {
        localStorage.setItem('leagueName', value);
    });
    leagueDynasty.subscribe(value => {
        localStorage.setItem('leagueDynasty', value);
    });
}

/**
 * Vide tous les stores dépendants de la ligue active.
 * À appeler avant de changer de ligue pour garantir un rechargement propre.
 * Les stores déjà scopés par leagueID (leagueData, rostersStore) et les données
 * globales (nflState, players) ne sont pas touchés.
 */
export const clearLeagueStores = () => {
    awards.set({});
    upcomingDraft.set({});
    previousDrafts.set([]);
    matchupsStore.set({});
    records.set({});
    transactionsStore.set({});
    teamManagersStore.set({});
    brackets.set({});
    standingsStore.set({});
};