import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLeagueData } from './leagueData';
import { getLeagueRosters } from './leagueRosters';
import { leagueData, rostersStore, leagueID } from '$lib/stores';

describe('leagueData and leagueRosters helpers', () => {
	beforeEach(() => {
		leagueData.set({});
		rostersStore.set({});
		leagueID.set('test_league_999');
		vi.restoreAllMocks();
	});

	describe('getLeagueData', () => {
		it('should fetch and cache league data by leagueID', async () => {
			const mockData = {
				league_id: 'test_league_999',
				name: 'Fantasy Test League',
				season: '2026'
			};

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockData)
			});

			const result = await getLeagueData('test_league_999');
			expect(result).toEqual(mockData);
			expect(global.fetch).toHaveBeenCalledTimes(1);

			// Calling a second time should use cache
			const cached = await getLeagueData('test_league_999');
			expect(cached).toEqual(mockData);
			expect(global.fetch).toHaveBeenCalledTimes(1);
		});
	});

	describe('getLeagueRosters', () => {
		it('should process rosters into a map keyed by roster_id', async () => {
			const mockRosters = [
				{
					roster_id: 1,
					owner_id: 'u1',
					starters: ['p1', 'p2'],
					reserve: ['p3']
				},
				{
					roster_id: 2,
					owner_id: 'u2',
					starters: ['p4'],
					reserve: null
				}
			];

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockRosters)
			});

			const result = await getLeagueRosters('test_league_999');
			expect(result.rosters['1']).toBeDefined();
			expect(result.rosters['2']).toBeDefined();
			expect(result.startersAndReserve).toEqual(['p1', 'p2', 'p3', 'p4']);
		});
	});
});
