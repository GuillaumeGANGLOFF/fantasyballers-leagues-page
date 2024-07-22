import { redirect } from '@sveltejs/kit';

export const load = () => {
    throw redirect(302, 'https://lookerstudio.google.com/reporting/7d9b9535-7ab9-4e2d-979e-47ccb29dbcb4');
};