import { describe, it, expect } from 'vitest';
import { listLeagues, homepageText } from './leagueInfo';

describe('leagueInfo configuration', () => {
	it('should define a valid list of leagues', () => {
		expect(Array.isArray(listLeagues)).toBe(true);
		expect(listLeagues.length).toBeGreaterThan(0);

		for (const league of listLeagues) {
			expect(typeof league.id).toBe('string');
			expect(league.id.trim().length).toBeGreaterThan(0);
			expect(typeof league.name).toBe('string');
			expect(typeof league.dynasty).toBe('boolean');
			expect(['TrophéeFB', 'LigueFB', 'BestBall']).toContain(league.classification);
		}
	});

	it('should have BestBall leagues defined for the bestball ranking aggregate', () => {
		const bestballLeagues = listLeagues.filter((l) => l.classification === 'BestBall');
		expect(bestballLeagues.length).toBeGreaterThan(0);
	});

	it('should contain valid homepage text', () => {
		expect(typeof homepageText).toBe('string');
		expect(homepageText.length).toBeGreaterThan(0);
	});
});
