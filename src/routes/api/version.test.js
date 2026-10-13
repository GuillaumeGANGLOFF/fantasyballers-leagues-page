import { describe, it, expect, vi } from 'vitest';
import { GET as getGlobalVersion } from './checkGlobalVersion/+server.js';
import { GET as checkVersion } from './checkVersion/+server.js';
import { version } from '$lib/version';

describe('Version API endpoints', () => {
	it('checkGlobalVersion endpoint should return local version in JSON response', async () => {
		const res = await getGlobalVersion();
		const data = await res.json();
		expect(data).toBe(version);
	});

	it('checkVersion endpoint should return false if versions match', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(version)
		});

		const res = await checkVersion();
		const needsUpdate = await res.json();
		expect(needsUpdate).toBe(false);
	});

	it('checkVersion endpoint should return true if global version differs', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve('99.9.9')
		});

		const res = await checkVersion();
		const needsUpdate = await res.json();
		expect(needsUpdate).toBe(true);
	});
});
