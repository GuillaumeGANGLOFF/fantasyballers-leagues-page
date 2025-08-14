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
export let leagueDynasty = writable(isBrowser? localStorage.getItem("leagueDynasty") || listLeagues[0].dynasty : listLeagues[0].dynasty);
if (isBrowser) {
    leagueID.subscribe(value => {
        localStorage.setItem('leagueID', value);
    });
    leagueName.subscribe(value => {
        localStorage.setItem('leagueName', value);
    });
    leagueID.subscribe(value => {
        localStorage.setItem('leagueDynasty', value);
    });
}

// Store pour le cache du dashboard BestBall
export const bestballCache = writable({
    standings: {},
    lastUpdate: null,
    currentWeek: 0
});

// Store pour les données préchargées BestBall
export const bestballPreloadedData = writable(null);