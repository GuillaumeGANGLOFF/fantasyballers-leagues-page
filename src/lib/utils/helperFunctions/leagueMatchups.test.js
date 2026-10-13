import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLeagueMatchups } from './leagueMatchups';
import { matchupsStore, leagueID } from '$lib/stores';

describe('leagueMatchups', () => {
	beforeEach(() => {
		matchupsStore.set({});
		leagueID.set('test_league_123');
		vi.restoreAllMocks();
	});

	it('should fetch and structure matchups by matchup_id and week', async () => {
		const mockNflState = {
			season_type: 'regular',
			display_week: 3,
			season: '2026'
		};

		const mockLeagueData = {
			season: '2026',
			settings: {
				playoff_week_start: 3
			}
		};

		const mockWeek1Matchups = [
			{
				matchup_id: 1,
				roster_id: 10,
				starters: ['p1', 'p2'],
				starters_points: [12.5, 18.0]
			},
			{
				matchup_id: 1,
				roster_id: 11,
				starters: ['p3', 'p4'],
				starters_points: [10.0, 15.0]
			}
		];

		const mockWeek2Matchups = [
			{
				matchup_id: 2,
				roster_id: 10,
				starters: ['p1', 'p2'],
				starters_points: [14.0, 20.0]
			},
			{
				matchup_id: 2,
				roster_id: 12,
				starters: ['p5', 'p6'],
				starters_points: [9.0, 11.0]
			}
		];

		global.fetch = vi.fn((url) => {
			if (url.includes('/state/nfl')) {
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockNflState)
				});
			}
			if (url.includes('/league/test_league_123/matchups/1')) {
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockWeek1Matchups)
				});
			}
			if (url.includes('/league/test_league_123/matchups/2')) {
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockWeek2Matchups)
				});
			}
			if (url.includes('/league/test_league_123')) {
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockLeagueData)
				});
			}
			return Promise.reject(new Error(`Unexpected fetch URL: ${url}`));
		});

		const result = await getLeagueMatchups();

		expect(result).toBeDefined();
		expect(result.year).toBe('2026');
		expect(result.week).toBe(3);
		expect(result.regularSeasonLength).toBe(2);
		expect(result.matchupWeeks.length).toBe(2);

		// Week 1 check
		const week1 = result.matchupWeeks[0];
		expect(week1.week).toBe(1);
		expect(week1.matchups[1].length).toBe(2);
		expect(week1.matchups[1][0].roster_id).toBe(10);
		expect(week1.matchups[1][1].roster_id).toBe(11);
	});
});
