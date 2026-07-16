<script>
	import { tabs } from '$lib/utils/tabs';
	import NavSmall from './NavSmall.svelte';
	import NavLarge from './NavLarge.svelte';
	import { page } from '$app/state';
	import IconButton from '@smui/icon-button';
	import { Icon } from '@smui/common';
	import { leagueGroups } from '$lib/utils/leagueInfo.js';
	import { leagueID } from '$lib/stores';
	import { switchLeague } from '$lib/utils/switchLeague';

	async function handleSelect(event) {
		const newId = event.target.value;
		if (newId === $leagueID) return;
		const selectedLeague = leagueGroups.flatMap(g => g.leagues).find(l => l.id === newId);
		if (!selectedLeague) return;
		await switchLeague(selectedLeague);
	}

	let darkTheme = $state(typeof window === "undefined" || window.matchMedia("(prefers-color-scheme: dark)").matches);

	function switchTheme() {
		// darkTheme has already been toggled by bind:pressed when onclick fires
		let themeLink = document.head.querySelector("#theme");
		if (!themeLink) {
			themeLink = document.createElement("link");
			themeLink.rel = "stylesheet";
			themeLink.id = "theme";
			document.head
				.querySelector('link[href="/smui-dark.css"]')
				.insertAdjacentElement("afterend", themeLink);
		}
		themeLink.href = darkTheme ? "/smui-dark.css" : "/smui.css";
	}
</script>

<svelte:head>
	<title>{!page.url.pathname[1] ? 'Home' : page.url.pathname[1].toUpperCase() + page.url.pathname.slice(2)} | League Page</title>
</svelte:head>

<style>

	nav {
		background-color: var(--fff);
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #352A7E;
		box-shadow: 0 0 8px 0 #352A7E;
	}

	#logo {
		width: 80px;
		margin-right: 10px;
		padding: 10px;
		border-radius: 15px;
	}

	.large {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80%;
	}

	.small {
		display: None;
	}

	.selector_league {
		color: #333;
		font-size: 16px;
		accent-color: #352A7E;
	}

	.selector_league option:checked, option:hover {
		background-color: #352A7E;
	}

	.selector_league select {
		width: 250px;
		height: 25px;
		font-size: 16px;
		color: #352A7E;
		border: 2px solid;
	}

	.selector_league optgroup {
		font-weight: bold;
	}

	:global(.lightDark) {
		color: var(--g555)
	}

	@media (max-width: 1200px) { /* width of the large navBar */
		.large {
			display: none;
		}

		.small {
			display: flex;
			justify-content: space-between;
			width: 100%;
		}
	}
</style>

<nav>
	<div class="container">
		<IconButton
			toggle
			bind:pressed={darkTheme}
			onclick={switchTheme}
			class="lightDark"
		>
			<Icon class="material-icons" on>dark_mode</Icon>
			<Icon class="material-icons">light_mode</Icon>
		</IconButton>
	</div>

	<div class="large">
		<a href="/"><img id="logo" alt="league logo" src="/logofb.jpg" /></a>
		<NavLarge />
	</div>
	<div class="selector_league large">
		<select value={$leagueID} onchange={handleSelect}>
			{#each leagueGroups as group}
				<optgroup label={group.label}>
					{#each group.leagues as league (league.id)}
						<option value={league.id}>{league.name}</option>
					{/each}
				</optgroup>
			{/each}
		</select>
	</div>

	<div class="small">
		<NavSmall />
		<a href="/"><img id="logo" alt="league logo" src="/logofb.jpg" /></a>
	</div>

</nav>
