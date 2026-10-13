import { describe, it, expect } from 'vitest';
import { stringDate } from './news';

describe('news helper stringDate', () => {
	it('should format date object into MM/DD/YYYY H:MM AM/PM string', () => {
		const morning = new Date(2026, 9, 13, 9, 5); // Oct 13, 2026 09:05 AM
		expect(stringDate(morning)).toBe('10/13/2026 9:05AM');

		const afternoon = new Date(2026, 9, 13, 14, 30); // Oct 13, 2026 02:30 PM
		expect(stringDate(afternoon)).toBe('10/13/2026 2:30PM');
	});
});
