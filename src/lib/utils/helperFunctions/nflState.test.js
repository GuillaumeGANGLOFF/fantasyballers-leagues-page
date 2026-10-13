import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getNflState } from './nflState';
import { nflState } from '$lib/stores';

describe('nflState helper', () => {
	beforeEach(() => {
		nflState.set({});
		vi.restoreAllMocks();
	});

	it('should fetch nfl state and cache it in the store', async () => {
		const mockState = {
			season: '2026',
			season_type: 'regular',
			week: 5,
			display_week: 5
		};

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(mockState)
		});

		const result = await getNflState();
		expect(result).toEqual(mockState);
		expect(global.fetch).toHaveBeenCalledTimes(1);

		// Second call should return from store without another fetch
		const cached = await getNflState();
		expect(cached).toEqual(mockState);
		expect(global.fetch).toHaveBeenCalledTimes(1);
	});
});
