// src/routes/blog/+page.js

import { redirect } from '@sveltejs/kit';

export const load = () => {
    throw redirect(302, 'https://linktr.ee/fantasyballersfr');
};