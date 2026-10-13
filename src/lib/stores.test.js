import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import {
	clearLeagueStores,
	awards,
	upcomingDraft,
	previousDrafts,
	matchupsStore,
	records,
	transactionsStore,
	teamManagersStore,
	brackets,
	standingsStore,
	leagueID,
	leagueName
} from './stores';

describe('Svelte stores and clearLeagueStores', () => {
	it('should initialize basic stores with default values', () => {
		expect(typeof get(leagueID)).toBe('string');
		expect(typeof get(leagueName)).toBe('string');
	});

	it('clearLeagueStores should reset league-dependent stores', () => {
		// Populate some stores with mock data
		awards.set({ 1: 'champion' });
		upcomingDraft.set({ draft: 'active' });
		previousDrafts.set(['draft1', 'draft2']);
		matchupsStore.set({ week1: [] });
		records.set({ high: 150 });
		transactionsStore.set({ trades: 5 });
		teamManagersStore.set({ managers: [] });
		brackets.set({ champs: [] });
		standingsStore.set({ 1: { wins: 5 } });

		// Clear stores
		clearLeagueStores();

		// Verify reset state
		expect(get(awards)).toEqual({});
		expect(get(upcomingDraft)).toEqual({});
		expect(get(previousDrafts)).toEqual([]);
		expect(get(matchupsStore)).toEqual({});
		expect(get(records)).toEqual({});
		expect(get(transactionsStore)).toEqual({});
		expect(get(teamManagersStore)).toEqual({});
		expect(get(brackets)).toEqual({});
		expect(get(standingsStore)).toEqual({});
	});
});
