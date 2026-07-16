<script>
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import LinearProgress from '@smui/linear-progress';
	import { listLeagues } from '$lib/utils/leagueInfo.js';

	const CACHE_KEY = 'bestballRankingCache';
	const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

	const bestBallLeagues = listLeagues.filter(l => l.classification === 'BestBall');

	/** @param {string} name */
	function shortenLeagueName(name) {
		const match = name.match(/Best Ball (\d+)$/);
		if (match) return `BB ${match[1]}`;
		if (name.includes("Int'l")) return "Int'l";
		return name;
	}

	/** @param {{ user_id: string, display_name: string, avatar: string, metadata?: { team_name?: string, avatar?: string } }} user */
	function resolveAvatar(user) {
		if (user.metadata?.avatar) return user.metadata.avatar;
		if (user.avatar) return `https://sleepercdn.com/avatars/thumbs/${user.avatar}`;
		return 'https://sleepercdn.com/images/v2/icons/player_default.webp';
	}

	let loading = $state(false);
	let ranking = $state.raw([]);
	let error = $state('');

	async function fetchRanking(forceRefresh = false) {
		if (!forceRefresh) {
			try {
				const cached = localStorage.getItem(CACHE_KEY);
				if (cached) {
					const { timestamp, data } = JSON.parse(cached);
					if (Date.now() - timestamp < CACHE_TTL_MS) {
						ranking = data;
						return;
					}
				}
			} catch {
				// ignore malformed cache
			}
		}

		loading = true;
		error = '';

		try {
			const results = await Promise.allSettled(
				bestBallLeagues.map(async (league) => {
					const [usersRes, rostersRes] = await Promise.all([
						fetch(`https://api.sleeper.app/v1/league/${league.id}/users`),
						fetch(`https://api.sleeper.app/v1/league/${league.id}/rosters`)
					]);
					const users = await usersRes.json();
					const rosters = await rostersRes.json();
					return { league, users, rosters };
				})
			);

			/** @type {SvelteMap<string, { user_id: string, displayName: string, avatar: string, leagueMap: SvelteMap<string, { leagueName: string, fpts: number }> }>} */
			const userMap = new SvelteMap();

			for (const result of results) {
				if (result.status !== 'fulfilled') continue;
				const { league, users, rosters } = result.value;

				const userById = new SvelteMap(users.map(u => [u.user_id, u]));

				// Calculate per-league ranks by sorting rosters by fpts desc
				const rostersWithFpts = rosters
					.filter(r => r.owner_id)
					.map(r => ({
						owner_id: r.owner_id,
						fpts: parseFloat((r.settings.fpts + (r.settings.fpts_decimal ?? 0) / 100).toFixed(2))
					}))
					.sort((a, b) => b.fpts - a.fpts);

				const rankByOwner = new SvelteMap(rostersWithFpts.map((r, i) => [r.owner_id, i + 1]));

				for (const { owner_id, fpts } of rostersWithFpts) {
					const user = userById.get(owner_id);
					if (!user) continue;

					if (!userMap.has(owner_id)) {
						userMap.set(owner_id, {
							user_id: owner_id,
							displayName: user.display_name,
							avatar: resolveAvatar(user),
							leagueMap: new SvelteMap()
						});
					}

					const entry = userMap.get(owner_id);
					entry.leagueMap.set(league.id, {
						leagueName: shortenLeagueName(league.name),
						fpts,
						rank: rankByOwner.get(owner_id) ?? 0
					});
				}
			}

			const data = Array.from(userMap.values())
				.map(entry => {
					const leagues = Array.from(entry.leagueMap.values()).sort((a, b) => b.fpts - a.fpts);
					const totalFpts = parseFloat(leagues.reduce((sum, l) => sum + l.fpts, 0).toFixed(2));
					return {
						user_id: entry.user_id,
						displayName: entry.displayName,
						avatar: entry.avatar,
						totalFpts,
						leagueCount: leagues.length,
						leagues
					};
				})
				.sort((a, b) => b.totalFpts - a.totalFpts);

			ranking = data;

			try {
				localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
			} catch {
				// ignore storage quota errors
			}
		} catch (e) {
			error = 'Une erreur est survenue lors du chargement du classement.';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	function handleRefresh() {
		try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
		fetchRanking(true);
	}

	onMount(() => {
		fetchRanking();
	});
</script>

<div class="holder">
	<h1>Classement Général BestBall</h1>
	<p class="subtitle">Saison 2025 &mdash; Agrégat de 15 ligues BestBall</p>

	{#if loading}
		<div class="loading">
			<p>Chargement du classement BestBall&hellip;</p>
			<p class="loadingNote">Le chargement peut prendre quelques secondes car 15 ligues sont récupérées en parallèle.</p>
			<LinearProgress indeterminate />
		</div>
	{:else}
		<button class="refreshBtn" onclick={handleRefresh}>Rafraîchir</button>

		{#if error}
			<p class="errorMsg">{error}</p>
		{/if}

		{#if ranking.length > 0}
			<div class="rankingTable">
				<DataTable>
					<Head>
						<Row>
							<Cell class="rankCell center">#</Cell>
							<Cell>Équipe</Cell>
							<Cell class="center">Ligues</Cell>
							<Cell class="center">Total FPTS</Cell>
							<Cell>Détail</Cell>
						</Row>
					</Head>
					<Body>
						{#each ranking as entry, i (entry.user_id)}
							<Row>
								<Cell class="rankCell center">{i + 1}</Cell>
								<Cell>
									<div class="teamCell">
										<img
											class="teamAvatar"
											src={entry.avatar}
											alt={entry.displayName}
											onerror={(e) => { e.currentTarget.src = 'https://sleepercdn.com/images/v2/icons/player_default.webp'; }}
										/>
										<span>{entry.displayName}</span>
									</div>
								</Cell>
								<Cell class="center">{entry.leagueCount}</Cell>
								<Cell class="center">
									<span class="totalFpts">{entry.totalFpts.toFixed(2)}</span>
								</Cell>
								<Cell>
									<ul class="detailList">
										{#each entry.leagues as league (league.leagueName)}
											<li>{league.leagueName}: {league.fpts.toFixed(2)} pts (#{league.rank})</li>
										{/each}
									</ul>
								</Cell>
							</Row>
						{/each}
					</Body>
				</DataTable>
			</div>
		{:else if !loading}
			<p class="emptyMsg">Aucune donnée disponible.</p>
		{/if}
	{/if}
</div>

<style>
	.holder {
		position: relative;
		z-index: 1;
		text-align: center;
	}
	h1 {
		font-size: 2.2em;
		line-height: 1.3em;
		margin: 1.5em 0 0.5em;
	}
	.subtitle {
		color: #666;
		margin-bottom: 2em;
		font-size: 0.95em;
	}
	.loading {
		display: block;
		width: 85%;
		max-width: 500px;
		margin: 80px auto;
	}
	.loadingNote {
		font-size: 0.85em;
		color: #888;
		margin-bottom: 1.2em;
	}
	.rankingTable {
		max-width: 100%;
		overflow-x: auto;
		margin: 1em auto 5em;
		display: inline-block;
	}
	.teamCell {
		display: flex;
		align-items: center;
		gap: 12px;
		cursor: default;
	}
	.teamAvatar {
		border-radius: 50%;
		height: 40px;
		width: 40px;
		object-fit: cover;
		border: 0.25px solid #777;
		flex-shrink: 0;
	}
	.totalFpts {
		font-weight: bold;
		color: #352A7E;
	}
	.detailList {
		font-size: 0.75em;
		color: #555;
		text-align: left;
		margin: 0;
		padding: 0;
		list-style: none;
		white-space: nowrap;
	}
	.refreshBtn {
		background-color: #352A7E;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 8px 20px;
		cursor: pointer;
		font-size: 0.9em;
		margin-bottom: 1.5em;
	}
	.refreshBtn:hover {
		background-color: #554B99;
	}
	.errorMsg {
		color: #c0392b;
		margin-bottom: 1em;
	}
	.emptyMsg {
		color: #888;
	}
	:global(.center) {
		text-align: center;
	}
	:global(.rankCell) {
		font-weight: bold;
		color: #352A7E;
		min-width: 40px;
	}
</style>
