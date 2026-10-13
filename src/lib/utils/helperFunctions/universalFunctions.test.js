import { describe, it, expect } from 'vitest';
import {
	cleanName,
	round,
	sortHighAndLow,
	getManagers,
	getTeamData,
	getAvatarFromTeamManagers,
	getTeamNameFromTeamManagers,
	renderManagerNames,
	getTeamFromTeamManagers,
	getUserNameFromTeamManagers,
	getNestedTeamNamesFromTeamManagers,
	getDatesActive,
	getRosterIDFromManagerID,
	getRosterIDFromManagerIDAndYear,
	checkIfManagerReceivedAward,
	generateGraph,
	parseDate
} from './universalFunctions';

describe('universalFunctions', () => {
	describe('cleanName', () => {
		it('should strip "Team " prefix and special characters', () => {
			expect(cleanName('Team Thunder!')).toBe('thunder');
			expect(cleanName('Team Eagles #1')).toBe('eagles1');
			expect(cleanName('Super-Stars & Co.')).toBe('superstarsco');
			expect(cleanName('Team [Winner]')).toBe('winner');
		});
	});

	describe('round', () => {
		it('should round numbers to 2 decimal places as string', () => {
			expect(round(123.456)).toBe('123.46');
			expect(round('123.4')).toBe('123.40');
			expect(round(100)).toBe('100.00');
			expect(round(0)).toBe('0.00');
		});
	});

	describe('sortHighAndLow', () => {
		it('should return top 10 highest and lowest elements', () => {
			const data = Array.from({ length: 25 }, (_, i) => ({ val: i + 1 }));
			const [high, low] = sortHighAndLow(data, 'val');

			expect(high.length).toBe(10);
			expect(high[0].val).toBe(25);
			expect(high[9].val).toBe(16);

			expect(low.length).toBe(10);
			expect(low[0].val).toBe(1);
			expect(low[9].val).toBe(10);
		});
	});

	describe('getManagers', () => {
		it('should extract owner and co-owners', () => {
			const roster = {
				owner_id: 'user1',
				co_owners: ['user2', 'user3']
			};
			expect(getManagers(roster)).toEqual(['user1', 'user2', 'user3']);
		});

		it('should handle roster without co-owners', () => {
			const roster = { owner_id: 'user1' };
			expect(getManagers(roster)).toEqual(['user1']);
		});

		it('should handle roster without owner', () => {
			const roster = {};
			expect(getManagers(roster)).toEqual([]);
		});
	});

	describe('getTeamData', () => {
		it('should return custom metadata team name and avatar when present', () => {
			const users = {
				u1: {
					display_name: 'JohnDoe',
					avatar: 'avatar123',
					metadata: {
						team_name: 'The Champs',
						avatar: 'https://example.com/custom.png'
					}
				}
			};
			const result = getTeamData(users, 'u1');
			expect(result.name).toBe('The Champs');
			expect(result.avatar).toBe('https://example.com/custom.png');
		});

		it('should fallback to display_name and sleeper avatar', () => {
			const users = {
				u1: {
					display_name: 'JaneDoe',
					avatar: 'avatar456',
					metadata: {}
				}
			};
			const result = getTeamData(users, 'u1');
			expect(result.name).toBe('JaneDoe');
			expect(result.avatar).toBe('https://sleepercdn.com/avatars/thumbs/avatar456');
		});

		it('should return default fallback if user is not found', () => {
			const result = getTeamData({}, 'nonexistent');
			expect(result.name).toBe('Unknown Team');
			expect(result.avatar).toBe('https://sleepercdn.com/images/v2/icons/player_default.webp');
		});
	});

	describe('teamManagers helpers', () => {
		const mockTeamManagers = {
			currentSeason: 2026,
			users: {
				m1: { display_name: 'Alice', user_name: 'alice_w', avatar: 'ava1' },
				m2: { display_name: 'Bob', user_name: 'bob_b', avatar: 'ava2' }
			},
			teamManagersMap: {
				2026: {
					1: {
						team: { name: 'Alice Dynamos', avatar: 'https://example.com/alice.png' },
						managers: ['m1']
					},
					2: {
						team: { name: 'Bob Blitzers', avatar: 'https://example.com/bob.png' },
						managers: ['m2']
					}
				},
				2025: {
					1: {
						team: { name: 'Alice Dynamos (Old)', avatar: 'https://example.com/alice-old.png' },
						managers: ['m1']
					}
				}
			}
		};

		it('getAvatarFromTeamManagers should return avatar for roster and year', () => {
			expect(getAvatarFromTeamManagers(mockTeamManagers, 1, 2026)).toBe('https://example.com/alice.png');
			expect(getAvatarFromTeamManagers(mockTeamManagers, 1, 2025)).toBe('https://example.com/alice-old.png');
			// non-existent roster returns fallback question icon
			expect(getAvatarFromTeamManagers(mockTeamManagers, 99, 2026)).toBe('managers/question.jpg');
		});

		it('getTeamNameFromTeamManagers should return team name', () => {
			expect(getTeamNameFromTeamManagers(mockTeamManagers, 1, 2026)).toBe('Alice Dynamos');
		});

		it('renderManagerNames should return formatted string of manager display names', () => {
			expect(renderManagerNames(mockTeamManagers, 1, 2026)).toBe('Alice');
		});

		it('getTeamFromTeamManagers should return the team object', () => {
			expect(getTeamFromTeamManagers(mockTeamManagers, 2, 2026)).toEqual({
				name: 'Bob Blitzers',
				avatar: 'https://example.com/bob.png'
			});
		});

		it('getUserNameFromTeamManagers should return sleeper username', () => {
			expect(getUserNameFromTeamManagers(mockTeamManagers, 1, 2026)).toBe('alice_w');
		});

		it('getNestedTeamNamesFromTeamManagers should show current owner if name changed', () => {
			const res = getNestedTeamNamesFromTeamManagers(mockTeamManagers, 2025, 1);
			expect(res).toContain('Alice Dynamos (Old)');
			expect(res).toContain('Alice Dynamos');
		});

		it('getDatesActive should return active seasons for a manager', () => {
			const active = getDatesActive(mockTeamManagers, 'm1');
			expect(active.start).toBe('2025');
			// Since m1 is active in current season (2026), end should be null
			expect(active.end).toBeNull();
		});

		it('getRosterIDFromManagerID should locate rosterID across seasons', () => {
			const found = getRosterIDFromManagerID(mockTeamManagers, 'm2');
			expect(found).toEqual({ rosterID: '2', year: '2026' });
		});

		it('getRosterIDFromManagerIDAndYear should locate rosterID for specific year', () => {
			expect(getRosterIDFromManagerIDAndYear(mockTeamManagers, 'm1', 2025)).toBe('1');
			expect(getRosterIDFromManagerIDAndYear(mockTeamManagers, 'm2', 2025)).toBeNull();
		});

		it('checkIfManagerReceivedAward should check if manager owned roster that year', () => {
			expect(checkIfManagerReceivedAward(mockTeamManagers, 1, 2025, 'm1')).toBe(true);
			expect(checkIfManagerReceivedAward(mockTeamManagers, 1, 2025, 'm2')).toBe(false);
		});
	});

	describe('generateGraph', () => {
		it('should generate graph structure with min, max and sorted stats', () => {
			const stats = [
				{ points: 150, managerID: 'm1' },
				{ points: 95, managerID: 'm2' },
				{ points: 120, managerID: 'm3' }
			];

			const graph = generateGraph(
				{ stats, x: 'Manager', stat: 'Points', header: 'Season Total', field: 'points', short: 'pts' },
				2026,
				10
			);

			expect(graph.stats).toEqual([150, 120, 95]);
			expect(graph.managerIDs).toEqual(['m1', 'm3', 'm2']);
			expect(graph.xMax).toBeGreaterThanOrEqual(150);
			expect(graph.labels.stat).toBe('Points');
			expect(graph.year).toBe(2026);
		});

		it('should return null when stats is null/undefined', () => {
			expect(generateGraph({}, 2026)).toBeNull();
		});
	});

	describe('parseDate', () => {
		it('should parse ISO date string into formatted date string', () => {
			const result = parseDate('2026-10-12T14:30:00Z');
			expect(typeof result).toBe('string');
			expect(result).toMatch(/\d+\/\d+\/\d{4}/);
		});
	});
});
