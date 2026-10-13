import { describe, it, expect } from 'vitest';
import { version } from './version';
import pkg from '../../package.json';

describe('Version check', () => {
	it('version in version.js should match package.json', () => {
		expect(version).toBe(pkg.version);
	});
});
