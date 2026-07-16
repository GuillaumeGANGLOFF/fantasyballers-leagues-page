<script>
	import { onMount } from 'svelte';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import LinearProgress from '@smui/linear-progress';
	import { listLeagues } from '$lib/utils/leagueInfo.js';

	const CACHE_VERSION = 'v2';
	const bestBallLeagues = listLeagues.filter(l => l.classification === 'BestBall');

	// ---------------------------------------------------------------------------
	// Cache helpers
	// ---------------------------------------------------------------------------

	/**
	 * @param {string} key
	 * @param {number} [ttl]
	 */
	function getCached(key, ttl = Infinity) {
		try {
			const raw = localStorage.getItem(key);
			if (!raw) return null;
			const { timestamp, data } = JSON.parse(raw);
			if (ttl === Infinity || Date.now() - timestamp < ttl) return data;
		} catch {
			// ignore
		}
		return null;
	}

	/**
	 * @param {string} key
	 * @param {unknown} data
	 */
	function setCache(key, data) {
		try {
			localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
		} catch {
			// ignore storage quota errors
		}
	}

	// ---------------------------------------------------------------------------
	// Helpers
	// ---------------------------------------------------------------------------

	/** @param {string} name */
	function shortenLeagueName(name) {
		const match = name.match(/Best Ball (\d+)$/);
		if (match) return `BB ${match[1]}`;
		if (name.includes("Int'l")) return "Int'l";
		return name;
	}

	/** @param {{ user_id: string, display_name: string, avatar?: string, metadata?: { avatar?: string } }} user */
	function resolveAvatar(user) {
		if (user.metadata?.avatar) return user.metadata.avatar;
		if (user.avatar) return `https://sleepercdn.com/avatars/thumbs/${user.avatar}`;
		return 'https://sleepercdn.com/images/v2/icons/player_default.webp';
	}

	// ---------------------------------------------------------------------------
	// State
	// ---------------------------------------------------------------------------

	let nflWeek = $state(0);
	let nflSeason = $state('');
	let selectedWeek = $state(0);
	let availableWeeks = $derived(
		nflWeek > 0 ? Array.from({ length: nflWeek }, (_, i) => i + 1) : []
	);
	let loading = $state(true);
	/** @type {Array<{ user_id: string, displayName: string, avatar: string, leagueName: string, fpts: number }>} */
	let ranking = $state.raw([]);
	/** @type {Array<{ user_id: string, displayName: string, avatar: string, leagueName: string, fpts: number }>} */
	let prevRanking = $state.raw([]);
	let error = $state('');

	// ---------------------------------------------------------------------------
	// Data fetching
	// ---------------------------------------------------------------------------

	/** @param {string} leagueId @param {number} week @param {number} currentNflWeek */
	async function fetchMatchups(leagueId, week, currentNflWeek) {
		const cacheKey = `bb_matchups_${leagueId}_w${week}_${CACHE_VERSION}`;
		const ttl = week < currentNflWeek ? Infinity : 60 * 60 * 1000;
		const cached = getCached(cacheKey, ttl);
		if (cached) return cached;

		const res = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`);
		const data = await res.json();
		setCache(cacheKey, data);
		return data;
	}

	/** @param {string} leagueId */
	async function fetchUsers(leagueId) {
		const cacheKey = `bb_users_${leagueId}_${CACHE_VERSION}`;
		const cached = getCached(cacheKey);
		if (cached) return cached;

		const res = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
		const data = await res.json();
		setCache(cacheKey, data);
		return data;
	}

	/** @param {string} leagueId */
	async function fetchRosters(leagueId) {
		const cacheKey = `bb_rosters_${leagueId}_${CACHE_VERSION}`;
		const cached = getCached(cacheKey);
		if (cached) return cached;

		const res = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
		const data = await res.json();
		setCache(cacheKey, data);
		return data;
	}

	/** @param {number} targetWeek */
	async function computeRankingForWeek(targetWeek) {
		const weekNums = Array.from({ length: targetWeek }, (_, i) => i + 1);

		const leagueResults = await Promise.allSettled(
			bestBallLeagues.map(async (league) => {
				const [users, rosters, ...matchupsByWeek] = await Promise.all([
					fetchUsers(league.id),
					fetchRosters(league.id),
					...weekNums.map(w => fetchMatchups(league.id, w, nflWeek))
				]);

				/** @type {Map<number, number>} roster_id → cumulative fpts */
				const fptsPerRoster = new Map();
				for (const weekMatchups of matchupsByWeek) {
					if (!Array.isArray(weekMatchups)) continue;
					for (const entry of weekMatchups) {
						const prev = fptsPerRoster.get(entry.roster_id) ?? 0;
						fptsPerRoster.set(entry.roster_id, prev + (entry.points ?? 0));
					}
				}

				/** @type {Map<number, string>} roster_id → owner_id */
				const rosterOwner = new Map();
				for (const roster of rosters) {
					if (roster.owner_id) rosterOwner.set(roster.roster_id, roster.owner_id);
				}

				/** @type {Map<string, { user_id: string, displayName: string, avatar: string }>} */
				const userById = new Map(
					users.map(u => [u.user_id, {
						user_id: u.user_id,
						displayName: u.display_name,
						avatar: resolveAvatar(u)
					}])
				);

				const leagueName = shortenLeagueName(league.name);

				/** @type {Array<{ user_id: string, displayName: string, avatar: string, leagueName: string, fpts: number }>} */
				const entries = [];
				for (const [rosterId, fpts] of fptsPerRoster.entries()) {
					const ownerId = rosterOwner.get(rosterId);
					if (!ownerId) continue;
					const user = userById.get(ownerId);
					if (!user) continue;
					entries.push({
						user_id: ownerId,
						displayName: user.displayName,
						avatar: user.avatar,
						leagueName,
						fpts: parseFloat(fpts.toFixed(2))
					});
				}

				return entries;
			})
		);

		/** @type {Map<string, { user_id: string, displayName: string, avatar: string, leagueName: string, fpts: number }>} */
		const bestPerUser = new Map();

		for (const result of leagueResults) {
			if (result.status !== 'fulfilled') continue;
			for (const entry of result.value) {
				const existing = bestPerUser.get(entry.user_id);
				if (!existing || entry.fpts > existing.fpts) {
					bestPerUser.set(entry.user_id, entry);
				}
			}
		}

		return Array.from(bestPerUser.values()).sort((a, b) => b.fpts - a.fpts);
	}

	/** @param {number} week */
	async function loadWeek(week) {
		loading = true;
		error = '';
		try {
			const [current, previous] = await Promise.all([
				computeRankingForWeek(week),
				week > 1 ? computeRankingForWeek(week - 1) : Promise.resolve([])
			]);
			ranking = current;
			prevRanking = previous;
		} catch (e) {
			error = 'Une erreur est survenue lors du chargement du classement.';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	// ---------------------------------------------------------------------------
	// Position change helper
	// ---------------------------------------------------------------------------

	/**
	 * @param {string} userId
	 * @param {number} currentRank
	 * @returns {number | null}
	 */
	function getPositionChange(userId, currentRank) {
		if (prevRanking.length === 0) return null;
		const prevIdx = prevRanking.findIndex(e => e.user_id === userId);
		if (prevIdx === -1) return null;
		return (prevIdx + 1) - currentRank;
	}

	// ---------------------------------------------------------------------------
	// Event handlers
	// ---------------------------------------------------------------------------

	/** @param {Event} e */
	function handleWeekChange(e) {
		const target = /** @type {HTMLSelectElement} */ (e.currentTarget);
		selectedWeek = parseInt(target.value, 10);
		loadWeek(selectedWeek);
	}

	function handleRefresh() {
		// Clear matchup caches for selected week and week-1
		const weeksToClear = [selectedWeek];
		if (selectedWeek > 1) weeksToClear.push(selectedWeek - 1);
		for (const league of bestBallLeagues) {
			for (const w of weeksToClear) {
				try { localStorage.removeItem(`bb_matchups_${league.id}_w${w}_${CACHE_VERSION}`); } catch { /* ignore */ }
			}
		}
		try { localStorage.removeItem(`bb_nflState_${CACHE_VERSION}`); } catch { /* ignore */ }
		loadWeek(selectedWeek);
	}

	// ---------------------------------------------------------------------------
	// Mount
	// ---------------------------------------------------------------------------

	onMount(async () => {
		const nflStateCacheKey = `bb_nflState_${CACHE_VERSION}`;
		let state = getCached(nflStateCacheKey, 15 * 60 * 1000);
		if (!state) {
			const res = await fetch('https://api.sleeper.app/v1/state/nfl');
			state = await res.json();
			setCache(nflStateCacheKey, state);
		}
		nflWeek = state.display_week ?? state.week ?? 1;
		nflSeason = state.season ?? '2025';
		selectedWeek = nflWeek;
		await loadWeek(selectedWeek);
	});
</script>

<div class="holder">
	<h1>Classement Général BestBall</h1>
	<p class="subtitle">Saison {nflSeason || '2025'} &mdash; Meilleure ligue parmi 15 ligues BestBall</p>

	{#if nflWeek > 0}
		<div class="weekSelector">
			<label for="weekSelect">Semaine :</label>
			<select id="weekSelect" value={selectedWeek} onchange={handleWeekChange}>
				{#each availableWeeks as w (w)}
					<option value={w}>Semaine {w}{w === nflWeek ? ' (actuelle)' : ''}</option>
				{/each}
			</select>
			<button class="refreshBtn" onclick={handleRefresh}>&#8635; Rafraîchir</button>
		</div>
	{/if}

	{#if loading}
		<div class="loading">
			<p>Chargement du classement BestBall&hellip;</p>
			<p class="loadingNote">Le chargement peut prendre quelques secondes car 15 ligues sont récupérées en parallèle.</p>
			<LinearProgress indeterminate />
		</div>
	{:else}
		{#if error}
			<p class="errorMsg">{error}</p>
		{/if}

		{#if ranking.length > 0}
			<div class="rankingTable">
				<DataTable>
					<Head>
						<Row>
							<Cell class="center rankNum">Pos.</Cell>
							<Cell class="center">Évol.</Cell>
							<Cell>Équipe</Cell>
							<Cell class="center">Ligue</Cell>
							<Cell class="center">FPTS</Cell>
						</Row>
					</Head>
					<Body>
						{#each ranking as entry, i (entry.user_id)}
							{@const rank = i + 1}
							{@const delta = getPositionChange(entry.user_id, rank)}
							<Row>
								<Cell class="center rankNum">{rank}</Cell>
								<Cell class="center">
									{#if delta === null}
										<span class="evolNeutral">&mdash;</span>
									{:else if delta > 0}
										<span class="evolUp">&#8593;{delta}</span>
									{:else if delta < 0}
										<span class="evolDown">&#8595;{Math.abs(delta)}</span>
									{:else}
										<span class="evolNeutral">&mdash;</span>
									{/if}
								</Cell>
								<Cell>
									<div class="teamCell">
										<img
											class="teamAvatar"
											src={entry.avatar}
											alt={entry.displayName}
											onerror={(e) => { /** @type {HTMLImageElement} */ (e.currentTarget).src = 'https://sleepercdn.com/images/v2/icons/player_default.webp'; }}
										/>
										<span>{entry.displayName}</span>
									</div>
								</Cell>
								<Cell class="center">{entry.leagueName}</Cell>
								<Cell class="center">
									<span class="totalFpts">{entry.fpts.toFixed(2)}</span>
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
		margin-bottom: 1.5em;
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
	.weekSelector {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 1.5em;
		flex-wrap: wrap;
		justify-content: center;
	}
	.weekSelector label {
		font-weight: 600;
		color: #352A7E;
	}
	.weekSelector select {
		height: 32px;
		font-size: 15px;
		color: #352A7E;
		border: 2px solid #352A7E;
		border-radius: 4px;
		padding: 0 8px;
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
		white-space: nowrap;
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
	.evolUp {
		color: #27ae60;
		font-weight: bold;
		white-space: nowrap;
	}
	.evolDown {
		color: #c0392b;
		font-weight: bold;
		white-space: nowrap;
	}
	.evolNeutral {
		color: #aaa;
	}
	.refreshBtn {
		background-color: #352A7E;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 6px 16px;
		cursor: pointer;
		font-size: 0.9em;
	}
	.refreshBtn:hover {
		background-color: #554B99;
	}
	.errorMsg {
		color: #c0392b;
		margin: 1em 0;
	}
	.emptyMsg {
		color: #888;
	}
	:global(.center) {
		text-align: center;
	}
	:global(.rankNum) {
		font-weight: bold;
		min-width: 30px;
		text-align: center;
	}
</style>
