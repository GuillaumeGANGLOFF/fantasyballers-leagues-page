export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/articles": [3],
		"/awards": [4],
		"/blog": [5],
		"/blog/[slug]": [6],
		"/constitution": [7],
		"/dashboard": [8],
		"/drafts": [9],
		"/linktree": [10],
		"/managers": [12],
		"/manager": [11],
		"/matchups": [13],
		"/records": [14],
		"/resources": [15],
		"/rivalry": [16],
		"/rosters": [17],
		"/standings": [18],
		"/transactions": [19]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';