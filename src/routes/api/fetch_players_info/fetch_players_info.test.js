import { describe, it, expect, vi } from 'vitest';
import { GET } from './+server.js';

describe('fetch_players_info API endpoint', () => {
	it('should aggregate player details and weekly projections', async () => {
		const mockNflState = { league_season: '2026' };
		const mockLeagueData = {
			settings: { playoff_week_start: 2 },
			scoring_settings: { pass_yd: 0.04, pass_td: 4 }
		};
		const mockPlayoffs = [{ r: 1 }];
		const mockPlayers = {
			p1: { first_name: 'Patrick', last_name: 'Mahomes', position: 'QB', team: 'KC' }
		};
		const mockProjectionsWeek1 = [
			{ player_id: 'p1', stats: { pass_yd: 250, pass_td: 2 }, opponent: 'BAL' }
		];

		global.fetch = vi.fn((url) => {
			if (url.includes('/state/nfl')) {
				return Promise.resolve({ ok: true, json: () => Promise.resolve(mockNflState) });
			}
			if (url.includes('/winners_bracket')) {
				return Promise.resolve({ ok: true, json: () => Promise.resolve([...mockPlayoffs]) });
			}
			if (url.includes('/league/')) {
				return Promise.resolve({ ok: true, json: () => Promise.resolve(mockLeagueData) });
			}
			if (url.includes('/players/nfl')) {
				return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPlayers) });
			}
			if (url.includes('/projections/nfl')) {
				return Promise.resolve({ ok: true, json: () => Promise.resolve(mockProjectionsWeek1) });
			}
			return Promise.reject(new Error(`Unexpected url: ${url}`));
		});

		const url = new URL('https://localhost/api/fetch_players_info?leagueId=test1234');
		const res = await GET({ url });
		const data = await res.json();

		expect(data).toBeDefined();
		expect(data.p1).toBeDefined();
		expect(data.p1.fn).toBe('Patrick');
		expect(data.p1.ln).toBe('Mahomes');
		expect(data.p1.pos).toBe('QB');
		expect(data.p1.t).toBe('KC');
		// 250 * 0.04 (10) + 2 * 4 (8) = 18.00
		expect(data.p1.wi['1'].p).toBe('18.00');
		expect(data.p1.wi['1'].o).toBe('BAL');
	});
});
