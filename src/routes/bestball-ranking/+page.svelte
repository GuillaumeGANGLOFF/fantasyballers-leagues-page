<script>
	import { onMount } from 'svelte';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import LinearProgress from '@smui/linear-progress';
	import { listLeagues, bestBallHistoricalExtras } from '$lib/utils/leagueInfo.js';

	const CACHE_VERSION = 'v2';
	const bestBallLeagues = listLeagues.filter(l => l.classification === 'BestBall');

	// ---------------------------------------------------------------------------
	// Cache helpers
	// ---------------------------------------------------------------------------

	/** @param {string} key @param {number} [ttl] */
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

	/** @param {string} key @param {unknown} data */
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

	let nflStateSeason = $state('2026');
	let nflStateDisplayWeek = $state(0);
	/** @type {{ [year: string]: string[] }} */
	let yearLeagues = $state({});
	/** @type {{ [leagueId: string]: string }} */
	let leagueNamesById = $state({});
	let availableYears = $state(/** @type {string[]} */ ([]));
	let selectedYear = $state('');
	let nflWeek = $state(0);
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
	let noDataForYear = $state(false);

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

	/** @param {string} leagueId @returns {Promise<any>} */
	async function fetchLeagueData(leagueId) {
		const cacheKey = `bb_leagueData_${leagueId}_${CACHE_VERSION}`;
		let data = getCached(cacheKey);
		if (!data) {
			const res = await fetch(`https://api.sleeper.app/v1/league/${leagueId}`);
			data = await res.json();
			setCache(cacheKey, data);
		}
		return data;
	}

	/** @param {string} year @returns {Promise<number>} */
	async function getMaxWeekForYear(year) {
		if (year === nflStateSeason && nflStateDisplayWeek > 0) {
			return nflStateDisplayWeek;
		}
		const leagueIds = yearLeagues[year];
		if (!leagueIds?.length) return 0;

		const leagueData = await fetchLeagueData(leagueIds[0]);

		// Saison non démarrée
		const status = leagueData?.status;
		if (!status || status === 'pre_draft' || status === 'drafting') return 0;

		const lastReport = leagueData.settings?.last_report;
		if (!lastReport) return 0; // en saison mais aucune semaine finalisée
		return lastReport + 1;
	}

	/** @param {number} targetWeek */
	async function computeRankingForWeek(targetWeek) {
		const leagueIds = yearLeagues[selectedYear] ?? [];
		const weekNums = Array.from({ length: targetWeek }, (_, i) => i + 1);

		const leagueResults = await Promise.allSettled(
			leagueIds.map(async (leagueId) => {
				const rawName = leagueNamesById[leagueId];
				const leagueName = rawName ? shortenLeagueName(rawName) : shortenLeagueName(leagueId);

				const [users, rosters, ...matchupsByWeek] = await Promise.all([
					fetchUsers(leagueId),
					fetchRosters(leagueId),
					...weekNums.map(w => fetchMatchups(leagueId, w, nflWeek))
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
	async function handleYearChange(e) {
		const year = /** @type {HTMLSelectElement} */ (e.currentTarget).value;
		selectedYear = year;
		noDataForYear = false;
		error = '';
		ranking = [];
		prevRanking = [];
		loading = true;

		try {
			const maxWeek = await getMaxWeekForYear(year);
			nflWeek = maxWeek;

			if (maxWeek === 0) {
				noDataForYear = true;
				loading = false;
				return;
			}

			selectedWeek = maxWeek;
			await loadWeek(selectedWeek);
		} catch (err) {
			error = 'Erreur lors du chargement.';
			console.error(err);
			loading = false;
		}
	}

	/** @param {Event} e */
	function handleWeekChange(e) {
		selectedWeek = parseInt(/** @type {HTMLSelectElement} */ (e.currentTarget).value, 10);
		loadWeek(selectedWeek);
	}

	function handleRefresh() {
		const leagues = yearLeagues[selectedYear] ?? [];
		const weeksToClear = [selectedWeek];
		if (selectedWeek > 1) weeksToClear.push(selectedWeek - 1);
		for (const id of leagues) {
			for (const w of weeksToClear) {
				try { localStorage.removeItem(`bb_matchups_${id}_w${w}_${CACHE_VERSION}`); } catch { /* ignore */ }
			}
		}
		try { localStorage.removeItem(`bb_nflState_${CACHE_VERSION}`); } catch { /* ignore */ }
		loadWeek(selectedWeek);
	}

	// ---------------------------------------------------------------------------
	// Mount
	// ---------------------------------------------------------------------------

	onMount(async () => {
		try {
			// 1. NFL state
			const nflStateCacheKey = `bb_nflState_${CACHE_VERSION}`;
			let state = getCached(nflStateCacheKey, 15 * 60 * 1000);
			if (!state) {
				const res = await fetch('https://api.sleeper.app/v1/state/nfl');
				state = await res.json();
				setCache(nflStateCacheKey, state);
			}
			nflStateSeason = state.season ?? '2026';
			nflStateDisplayWeek = state.display_week ?? 0;

			// 2. Données des ligues courantes (niveau 0 = leagueInfo.js)
			const currentLeagueIds = bestBallLeagues.map(l => l.id);
			const lvl0Data = await Promise.all(currentLeagueIds.map(fetchLeagueData));

			const season0 = lvl0Data[0]?.season ?? nflStateSeason;
			const newYearLeagues = /** @type {{ [year: string]: string[] }} */ ({});
			const newNames = /** @type {{ [id: string]: string }} */ ({});

			newYearLeagues[season0] = currentLeagueIds;
			for (let i = 0; i < currentLeagueIds.length; i++) {
				newNames[currentLeagueIds[i]] = lvl0Data[i]?.name ?? bestBallLeagues[i].name;
			}

			// 3. Niveau 1 : previous_league_id des ligues courantes → saison N-1
			// On conserve le tableau brut (avec null) pour garder la correspondance d'indices
			const lvl1IdsRaw = lvl0Data.map(d => d?.previous_league_id ?? null);
			const lvl1Ids = lvl1IdsRaw.filter(Boolean);
			if (lvl1Ids.length > 0) {
				const lvl1Data = await Promise.all(lvl1Ids.map(fetchLeagueData));
				const season1 = lvl1Data[0]?.season ?? String(parseInt(season0) - 1);
				newYearLeagues[season1] = lvl1Ids;

				// Noms N-1 : indice via le tableau brut pour ne pas décaler
				let lvl1DataIdx = 0;
				for (let i = 0; i < lvl1IdsRaw.length; i++) {
					if (lvl1IdsRaw[i]) {
						newNames[lvl1IdsRaw[i]] = lvl1Data[lvl1DataIdx]?.name ?? lvl0Data[i]?.name ?? '';
						lvl1DataIdx++;
					}
				}

				// 4. Niveau 2 : previous_league_id des ligues N-1 → saison N-2
				const lvl2IdsRaw = lvl1Data.map(d => d?.previous_league_id ?? null);
				const lvl2Ids = lvl2IdsRaw.filter(Boolean);
				if (lvl2Ids.length > 0) {
					const firstLvl2Data = await fetchLeagueData(lvl2Ids[0]);
					const season2 = firstLvl2Data?.season ?? String(parseInt(season1) - 1);
					newYearLeagues[season2] = lvl2Ids;

					// Noms N-2 : on récupère les vrais noms depuis l'API (même pattern entre années)
					let lvl2DataIdx = 0;
					for (let i = 0; i < lvl2IdsRaw.length; i++) {
						if (lvl2IdsRaw[i]) {
							// Le nom de la ligue N-2 suit le même pattern que N-1
							newNames[lvl2IdsRaw[i]] = lvl1Data[i]?.name ?? '';
							lvl2DataIdx++;
						}
					}
				}
			}

			// Ligues historiques sans successeur (ex : Int'l division 2025)
			for (const [season, extras] of Object.entries(bestBallHistoricalExtras)) {
				if (newYearLeagues[season]) {
					for (const { id, name } of extras) {
						if (!newYearLeagues[season].includes(id)) {
							newYearLeagues[season] = [...newYearLeagues[season], id];
							newNames[id] = name;
						}
					}
				}
			}

			yearLeagues = { ...newYearLeagues };
			leagueNamesById = { ...newNames };

			// 5. availableYears triées desc
			availableYears = Object.keys(newYearLeagues).sort().reverse();

			// 6. Année par défaut = première année avec données réelles (pas pre_draft)
			//    On teste en parcourant les années dans l'ordre desc
			let defaultYear = availableYears[0];
			for (const y of availableYears) {
				const maxW = await getMaxWeekForYear(y);
				if (maxW > 0) { defaultYear = y; break; }
			}
			selectedYear = defaultYear;

			// 7. Semaine max pour l'année par défaut
			nflWeek = await getMaxWeekForYear(defaultYear);

			if (nflWeek === 0) {
				noDataForYear = true;
				loading = false;
				return;
			}

			selectedWeek = nflWeek;
			await loadWeek(selectedWeek);
		} catch (e) {
			error = 'Erreur lors de la récupération des données.';
			console.error(e);
			loading = false;
		}
	});
</script>

<div class="holder">
	<h1>Classement Général BestBall</h1>

	{#if availableYears.length > 0}
		<div class="controls">
			<div class="controlGroup">
				<label for="yearSelect">Saison :</label>
				<select id="yearSelect" value={selectedYear} onchange={handleYearChange}>
					{#each availableYears as y (y)}
						<option value={y}>{y}</option>
					{/each}
				</select>
			</div>

			{#if nflWeek > 0}
				<div class="controlGroup">
					<label for="weekSelect">Semaine :</label>
					<select id="weekSelect" value={selectedWeek} onchange={handleWeekChange}>
						{#each availableWeeks as w (w)}
							<option value={w}>Semaine {w}</option>
						{/each}
					</select>
				</div>
			{/if}

			{#if !noDataForYear}
				<button class="refreshBtn" onclick={handleRefresh}>&#8635; Rafraîchir</button>
			{/if}
		</div>
	{/if}

	{#if loading}
		<div class="loading">
			<p>Chargement du classement BestBall&hellip;</p>
			<p class="loadingNote">Le chargement peut prendre quelques secondes.</p>
			<LinearProgress indeterminate />
		</div>
	{:else if noDataForYear}
		<p class="emptyMsg">Données non disponibles pour la saison {selectedYear}.</p>
	{:else}
		{#if error}<p class="errorMsg">{error}</p>{/if}

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
									{#if delta === null || delta === 0}
										<span class="evolNeutral">&mdash;</span>
									{:else if delta > 0}
										<span class="evolUp">&#8593;{delta}</span>
									{:else}
										<span class="evolDown">&#8595;{Math.abs(delta)}</span>
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
								<Cell class="center"><span class="totalFpts">{entry.fpts.toFixed(2)}</span></Cell>
							</Row>
						{/each}
					</Body>
				</DataTable>
			</div>
		{:else}
			<p class="emptyMsg">Aucune donnée disponible.</p>
		{/if}
	{/if}
</div>

<style>
	.holder { position: relative; z-index: 1; text-align: center; }
	h1 { font-size: 2.2em; line-height: 1.3em; margin: 1.5em 0 1em; }
	.loading { display: block; width: 85%; max-width: 500px; margin: 80px auto; }
	.loadingNote { font-size: 0.85em; color: #888; margin-bottom: 1.2em; }

	.controls {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 16px;
		margin-bottom: 1.5em;
	}
	.controlGroup {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.controlGroup label { font-weight: 600; color: #352A7E; }
	.controlGroup select {
		height: 32px; font-size: 15px; color: #352A7E;
		border: 2px solid #352A7E; border-radius: 4px; padding: 0 8px;
	}
	.rankingTable {
		width: 100%;
		overflow-x: auto;
		margin: 0 auto 5em;
		display: flex;
		justify-content: center;
	}
	@media (max-width: 600px) {
		.rankingTable {
			display: block;
		}
		:global(.mdc-data-table) {
			width: 100%;
			min-width: unset;
		}
		:global(.mdc-data-table__table-container) {
			width: 100%;
		}
		:global(.mdc-data-table__cell),
		:global(.mdc-data-table__header-cell) {
			padding: 0 6px !important;
			font-size: 0.82em;
		}
	}
	.teamCell { display: flex; align-items: center; gap: 12px; cursor: default; }
	.teamAvatar { border-radius: 50%; height: 40px; width: 40px; object-fit: cover; border: 0.25px solid #777; flex-shrink: 0; }
	@media (max-width: 600px) {
		.teamAvatar { display: none; }
	}
	.totalFpts { font-weight: bold; color: #352A7E; }
	.evolUp { color: #27ae60; font-weight: bold; white-space: nowrap; }
	.evolDown { color: #c0392b; font-weight: bold; white-space: nowrap; }
	.evolNeutral { color: #aaa; }
	.refreshBtn { background-color: #352A7E; color: white; border: none; border-radius: 4px; padding: 6px 16px; cursor: pointer; font-size: 0.9em; }
	.refreshBtn:hover { background-color: #554B99; }
	.errorMsg { color: #c0392b; margin: 1em 0; }
	.emptyMsg { color: #888; }
	:global(.center) { text-align: center; }
	:global(.rankNum) { font-weight: bold; min-width: 30px; text-align: center; }
</style>
