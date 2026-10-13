import { describe, it, expect } from 'vitest';
import { predictScores, getStarterPositions } from './predictOptimalScore';

describe('predictOptimalScore', () => {
	const mockLeagueData = {
		roster_positions: ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'FLEX', 'K', 'DEF', 'BN', 'BN']
	};

	describe('getStarterPositions', () => {
		it('should extract starting positions up to the first bench slot (BN)', () => {
			const starters = getStarterPositions(mockLeagueData);
			expect(starters).toEqual(['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'FLEX', 'K', 'DEF']);
		});
	});

	describe('predictScores', () => {
		it('should calculate the optimal starting lineup score for a given week', () => {
			const week = 5;
			const players = [
				{ pos: 'QB', wi: { 5: { p: 25.4 } } },
				{ pos: 'QB', wi: { 5: { p: 18.2 } } },
				{ pos: 'RB', wi: { 5: { p: 16.0 } } },
				{ pos: 'RB', wi: { 5: { p: 14.5 } } },
				{ pos: 'RB', wi: { 5: { p: 12.0 } } }, // could be FLEX
				{ pos: 'WR', wi: { 5: { p: 20.0 } } },
				{ pos: 'WR', wi: { 5: { p: 15.0 } } },
				{ pos: 'WR', wi: { 5: { p: 11.0 } } },
				{ pos: 'TE', wi: { 5: { p: 10.0 } } },
				{ pos: 'TE', wi: { 5: { p: 6.0 } } },
				{ pos: 'K', wi: { 5: { p: 8.0 } } },
				{ pos: 'DEF', wi: { 5: { p: 7.0 } } }
			];

			// QB: 25.4
			// RB1: 16.0, RB2: 14.5
			// WR1: 20.0, WR2: 15.0
			// TE: 10.0
			// FLEX: best of remaining RB (12.0), WR (11.0), TE (6.0) -> RB 12.0
			// K: 8.0
			// DEF: 7.0
			// Total = 25.4 + 16.0 + 14.5 + 20.0 + 15.0 + 10.0 + 12.0 + 8.0 + 7.0 = 127.9
			const score = predictScores(players, week, mockLeagueData);
			expect(score).toBeCloseTo(127.9, 1);
		});

		it('should handle superflex correctly (choosing QB if highest)', () => {
			const superflexLeague = {
				roster_positions: ['QB', 'SUPER_FLEX', 'BN']
			};
			const players = [
				{ pos: 'QB', wi: { 1: { p: 25.0 } } },
				{ pos: 'QB', wi: { 1: { p: 20.0 } } },
				{ pos: 'WR', wi: { 1: { p: 15.0 } } }
			];
			// QB: 25.0, SUPER_FLEX: 20.0 (QB2 > WR) -> 45.0
			const score = predictScores(players, 1, superflexLeague);
			expect(score).toBeCloseTo(45.0, 1);
		});

		it('should handle players with missing week projection gracefully (0 pts)', () => {
			const minimalLeague = {
				roster_positions: ['QB', 'BN']
			};
			const players = [
				{ pos: 'QB', wi: {} }
			];
			const score = predictScores(players, 1, minimalLeague);
			expect(score).toBe(0);
		});
	});
});
