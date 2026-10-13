import { describe, it, expect } from 'vitest';
import { tabs } from './tabs';

describe('Navigation tabs configuration', () => {
	it('should contain essential root navigation items', () => {
		const labels = tabs.map((t) => t.label);
		expect(labels).toContain('Home');
		expect(labels).toContain('Matchups');
		expect(labels).toContain('League Info');
		expect(labels).toContain('BestBall Global');
	});

	it('should properly configure League Info children', () => {
		const leagueInfoTab = tabs.find((t) => t.label === 'League Info');
		expect(leagueInfoTab).toBeDefined();
		expect(leagueInfoTab.nest).toBe(true);
		expect(Array.isArray(leagueInfoTab.children)).toBe(true);

		const childLabels = leagueInfoTab.children.map((c) => c.label);
		expect(childLabels).toEqual([
			'Rosters',
			'Managers',
			'Rivalry',
			'Standings',
			'Drafts',
			'Trophy Room',
			'Records',
			'Trades & Waivers'
		]);
	});

	it('should have valid destinations for all navigable tabs', () => {
		for (const tab of tabs) {
			if (!tab.nest) {
				expect(typeof tab.dest).toBe('string');
				expect(tab.dest.length).toBeGreaterThan(0);
			} else {
				for (const child of tab.children) {
					expect(typeof child.dest).toBe('string');
					expect(child.dest.startsWith('/')).toBe(true);
				}
			}
		}
	});
});
