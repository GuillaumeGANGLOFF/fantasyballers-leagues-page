<script>
	import { tabs } from '$lib/utils/tabs';
	import NavSmall from './NavSmall.svelte';
	import NavLarge from './NavLarge.svelte';
    import { page } from '$app/stores';
	import IconButton from '@smui/icon-button';
	import { Icon } from '@smui/common';
	import { listLeagues } from '$lib/utils/leagueInfo.js';
	import { leagueName, leagueID } from '$lib/stores';

	let selectedId;
	leagueID.subscribe(value => { selectedId = value; });

	$: active = tabs.find(tab => tab.dest == $page.url.pathname || (tab.nest && tab.children.find(subTab => subTab.dest == $page.url.pathname)));

	function handleSelect(event) {
		const isBrowser = typeof window !== 'undefined';
		const selectedId = event.target.value;
		const selectedLeague = listLeagues.find(league => league.id === selectedId);
		leagueID.set(selectedId);
		leagueName.set(selectedLeague.name);
		if (isBrowser) {
			localStorage.setItem('LeagueID', selectedId);
			localStorage.setItem('LeagueName', selectedLeague.name);
			localStorage.setItem('DynastyLeague', selectedLeague.dynasty);
		}
		setTimeout(() => {
			window.location.reload();
		}, 50);
	}

	// toggle dark mode
	let lightTheme =
		typeof window === "undefined" ||
		window.matchMedia("(prefers-color-scheme: light)").matches;
	
	function switchTheme() {
		lightTheme = !lightTheme;
		let themeLink = document.head.querySelector("#theme");
		if (!themeLink) {
			themeLink = document.createElement("link");
			themeLink.rel = "stylesheet";
			themeLink.id = "theme";
		}
		themeLink.href = `/smui${lightTheme ? "" : "-dark"}.css`;
		document.head
		.querySelector('link[href="/smui-dark.css"]')
		.insertAdjacentElement("afterend", themeLink);
	}
</script>

<svelte:head>
	<title>{!$page.url.pathname[1] ? 'Home' : $page.url.pathname[1].toUpperCase() + $page.url.pathname.slice(2)} | League Page</title>
</svelte:head>

<style>
	a {
		display: table;
    	margin: 0 auto;
	}
	nav {
		background-color: var(--fff);
		position: relative;
		z-index: 2;
		border-bottom: 1px solid #352A7E;
		box-shadow: 0 0 8px 0 #352A7E;
	}

	#logo {
		width: 80px;
		display: block;
		margin: 0 auto;
		padding: 10px;
	}

	.large {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.small {
		display: none;
	}

	.selector_league {
		color: #333;
		font-size: 16px;
		position: absolute;
		left: 5px;
	}

	.selector_league select {
		width: 250px;
		height: 100px;
		font-size: 28px;
	}

	.selector_league optgroup {
		font-weight: bold;
	}

	:global(.lightDark) {
		color: var(--g555)
	}

	@media (max-width: 950px) { /* width of the large navBar */
		.large {
			display: none;
		}

		.small {
			display: block;
		}
	}
</style>

<nav>
	<a href="/"><img id="logo" alt="league logo" src="/logofb.jpg" /></a>

	<!--<div class="container">
		<IconButton
			toggle
			pressed={lightTheme}
			on:MDCIconButtonToggle:change={switchTheme}
			class="lightDark"
		>
			<Icon class="material-icons" on>dark_mode</Icon>
			<Icon class="material-icons">light_mode</Icon>
		</IconButton>
	</div>-->

	<div class="large">
		<div class="selector_league">
			<select value={selectedId} on:change={handleSelect}>
				<optgroup label="Trophées FB">
					{#each listLeagues as league}
						{#if league.classification === "TFB"}
							<option value={league.id}>{league.name}</option>
						{/if}
					{/each}
				</optgroup>
				<optgroup label="BestBall">
					{#each listLeagues as league}
						{#if league.classification === "BestBall"}
							<option value={league.id}>{league.name}</option>
						{/if}
					{/each}
				</optgroup>
				<optgroup label="Ligues FB">
					{#each listLeagues as league}
						{#if league.classification === "LFB"}
							<option value={league.id}>{league.name}</option>
						{/if}
					{/each}
				</optgroup>
			</select>
		</div>
		<NavLarge {tabs} bind:active={active} />
	</div>

	<div class="small">
		<NavSmall {tabs} bind:active={$page.url.pathname} />
		<div class="selector_league small_selector">
			<select value={selectedId} on:change={handleSelect}>
				<optgroup label="Trophées FB">
					{#each listLeagues as league}
						{#if league.classification === "TFB"}
							<option value={league.id}>{league.name}</option>
						{/if}
					{/each}
				</optgroup>
				<optgroup label="BestBall">
					{#each listLeagues as league}
						{#if league.classification === "BestBall"}
							<option value={league.id}>{league.name}</option>
						{/if}
					{/each}
				</optgroup>
				<optgroup label="Ligues FB">
					{#each listLeagues as league}
						{#if league.classification === "LFB"}
							<option value={league.id}>{league.name}</option>
						{/if}
					{/each}
				</optgroup>
			</select>
		</div>
	</div>

</nav>
