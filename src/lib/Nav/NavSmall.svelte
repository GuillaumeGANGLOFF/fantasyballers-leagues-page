<script>
	import Drawer, {
	  Content,
	  Header,
	} from '@smui/drawer';
	import { Icon } from '@smui/tab';
  	import List, { Item, Text, Graphic, Separator, Subheader } from '@smui/list';
	import { goto, preloadData } from '$app/navigation';
	//import { leagueName } from '$lib/utils/helper';
	import {leagueID, leagueName} from '$lib/stores';
	import { listLeagues } from '$lib/utils/leagueInfo.js';
	import { enableBlog, managers } from '$lib/utils/leagueInfo';

	let selectedId;
	leagueID.subscribe(value => { selectedId = value; });
	let name;
	leagueName.subscribe(value => { name = value; });

	export let active, tabs;

	let open = false;

	const selectTab = (tab) => {
		if (tab.label === 'Nos Liens') {
			window.open(tab.dest, '_blank');
		} else {
			goto(tab.dest);
		}
	};

	function handleSelect(event) {
		const isBrowser = typeof window !== 'undefined';
		const selectedId = event.target.value;
		const selectedLeague = listLeagues.find(league => league.id === selectedId);
		leagueID.set(selectedId);
		leagueName.set(selectedLeague.name);
		if (isBrowser) {
			localStorage.setItem('leagueID', selectedId);
			localStorage.setItem('leagueName', selectedLeague.name);
			localStorage.setItem('leagueDynasty', selectedLeague.dynasty);
		}
		setTimeout(() => {
			if (window.location.pathname === '/') {
				// Si l'utilisateur est déjà sur la page d'accueil, recharge la page
				window.location.reload();
			} else {
				// Sinon, redirige vers la page d'accueil
				goto('/');
			}
		}, 1000);
	}
</script>

<style>
	:global(.menuIcon) {
		top: 15px;
		left: 15px;
		font-size: 2em;
		transform: translate(0%, 50%);
		color: #888;
		padding: 6px;
		cursor: pointer;
	}

	:global(.menuIcon:hover) {
		color: #352A7E;
	}

	:global(.nav-drawer) {
		z-index: 5;
		top: 0;
		left: 0;
	}

	:global(.nav-item) {
		color: #858585 !important;
	}

	.nav-back {
		position: fixed;
		z-index: 4;
		width: 100%;
		width: 100vw;
		height: 100%;
		height: 100vh;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.32);
		transition: all 0.7s;
	}

	.selector_league {
		color: #333;
		font-size: 16px;
		accent-color: #352A7E;
	}

	.selector_league option:checked, option:hover {
		background-color: #352A7E;
	}

	.selector_league {
		margin-top: 15px;
		width: 220px;
		height: 25px;
		font-size: 14px;
		color: #352A7E;
		border: 2px solid;
	}

	.selector_league optgroup {
		font-weight: bold;
	}
</style>

<Icon class="material-icons menuIcon" on:click={() => (open = true)}>menu</Icon>

<div class="nav-back" style="pointer-events: {open ? "visible" : "none"}; opacity: {open ? 1 : 0};" on:click={() => (open = false)}/>

<Drawer variant="modal" class="nav-drawer" fixed={true} bind:open>
	<Header>
		<select class="selector_league" value={selectedId} on:change={handleSelect}>
			<optgroup label="Trophées FB">
				{#each listLeagues as league}
					{#if league.classification === "TrophéeFB"}
						<option value={league.id}>{league.name}</option>
					{/if}
				{/each}
			</optgroup>
			<optgroup label="Ligues FB">
				{#each listLeagues as league}
					{#if league.classification === "LigueFB"}
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
		</select>
	</Header>
	<Content>
		<List>
			{#each tabs as tab}
				{#if !tab.nest && (tab.label != 'Blog' || (tab.label == 'Blog' && enableBlog))}
					<Item href="javascript:void(0)" on:click={() => selectTab(tab)} on:touchstart={() => preloadData(tab.dest)} on:mouseover={() => preloadData(tab.dest)} activated={active == tab.dest} >
						<Graphic class="material-icons{active == tab.dest ? "" : " nav-item"}" aria-hidden="true">{tab.icon}</Graphic>
						<Text class="{active == tab.dest ? "" : "nav-item"}">{tab.label}</Text>
					</Item>
				{/if}
			{/each}
			{#each tabs as tab}
				{#if tab.nest}
					<Separator />
					<Subheader>{tab.label}</Subheader>
					{#each tab.children as subTab}
						{#if subTab.label == 'Managers'}
							{#if managers.length}
								<Item href="javascript:void(0)" on:click={() => selectTab(subTab)} activated={active == subTab.dest}  on:touchstart={() => preloadData(subTab.dest)} on:mouseover={() => preloadData(subTab.dest)}>
									<Graphic class="material-icons{active == subTab.dest ? "" : " nav-item"}" aria-hidden="true">{subTab.icon}</Graphic>
									<Text class="{active == subTab.dest ? "" : "nav-item"}">{subTab.label}</Text>
								</Item>
							{/if}
						{:else}
							<Item href="javascript:void(0)" on:click={() => selectTab(subTab)} activated={active == subTab.dest}  on:touchstart={() => {if(subTab.label != 'Go to Sleeper') preloadData(subTab.dest)}} on:mouseover={() => {if(subTab.label != 'Go to Sleeper') preloadData(subTab.dest)}}>
								<Graphic class="material-icons{active == subTab.dest ? "" : " nav-item"}" aria-hidden="true">{subTab.icon}</Graphic>
								<Text class="{active == subTab.dest ? "" : "nav-item"}">{subTab.label}</Text>
							</Item>
						{/if}
					{/each}
				{/if}
			{/each}
		</List>
	</Content>
  </Drawer>
	
