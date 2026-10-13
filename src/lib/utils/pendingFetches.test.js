import { describe, it, expect, vi } from 'vitest';
import { deduplicateFetch } from './pendingFetches';

describe('pendingFetches deduplicateFetch', () => {
	it('should return the identical promise for concurrent calls with the same key', async () => {
		let callCount = 0;
		const fakeFetch = () =>
			new Promise((resolve) => {
				callCount++;
				setTimeout(() => resolve('data-result'), 10);
			});

		const p1 = deduplicateFetch('key1', fakeFetch);
		const p2 = deduplicateFetch('key1', fakeFetch);

		expect(p1).toBe(p2);

		const [res1, res2] = await Promise.all([p1, p2]);
		expect(res1).toBe('data-result');
		expect(res2).toBe('data-result');
		expect(callCount).toBe(1);
	});

	it('should allow new fetch after previous promise resolves', async () => {
		let callCount = 0;
		const fakeFetch = () => {
			callCount++;
			return Promise.resolve(`call-${callCount}`);
		};

		const res1 = await deduplicateFetch('key2', fakeFetch);
		expect(res1).toBe('call-1');
		expect(callCount).toBe(1);

		const res2 = await deduplicateFetch('key2', fakeFetch);
		expect(res2).toBe('call-2');
		expect(callCount).toBe(2);
	});

	it('should cleanly remove key even if promise rejects', async () => {
		const failingFetch = () => Promise.reject(new Error('Network error'));

		await expect(deduplicateFetch('failing_key', failingFetch)).rejects.toThrow('Network error');

		// After rejection, calling again should invoke fetchFn again
		const succeedingFetch = () => Promise.resolve('recovered');
		const res = await deduplicateFetch('failing_key', succeedingFetch);
		expect(res).toBe('recovered');
	});
});
