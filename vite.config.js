import { sveltekit } from '@sveltejs/kit/vite';

// Silences Sass deprecation warnings coming from SMUI's internal .scss files.
// These are third-party warnings that cannot be fixed in our code.
// Remove this list if SMUI is updated to a version that uses the modern Sass API.
const SMUI_SASS_SILENCE = ['legacy-js-api', 'color-functions', 'global-builtin', 'mixed-decls'];

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	css: {
		preprocessorOptions: {
			scss: {
				silenceDeprecations: SMUI_SASS_SILENCE,
			},
			sass: {
				silenceDeprecations: SMUI_SASS_SILENCE,
			},
		},
	},
};

export default config;
