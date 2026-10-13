<!-- __layout.svelte -->
<script>
	import { Nav, Footer } from "$lib/components"
	import AnnouncementPopup from '$lib/AnnouncementPopup.svelte';
    import { dev } from '$app/environment';
    import { injectAnalytics } from '@vercel/analytics/sveltekit';

    injectAnalytics({ mode: dev ? 'development' : 'production' });

    let { children } = $props();
</script>

<main>
    <Nav />

    {@render children()}

    <Footer />
</main>

<AnnouncementPopup />
