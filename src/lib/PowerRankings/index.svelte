<script>
    import {getNflState, getLeagueRosters, getLeagueTeamManagers, waitForAll, loadPlayers, getLeagueData} from '$lib/utils/helper';
    import PowerRankingsDisplay from './PowerRankingsDisplay.svelte';
    import LinearProgress from '@smui/linear-progress';
    import { preloadBestBallData } from '$lib/utils/helperFunctions/bestballPreloader.js';
    import { bestballPreloadedData } from '$lib/stores.js';
    
    const helperPromises = waitForAll(
        getNflState(),
        getLeagueRosters(),
        getLeagueTeamManagers(),
        getLeagueData(),
        loadPlayers(null),
        // Préchargement des données BestBall en arrière-plan
        preloadBestBallData().then(data => {
            if (data) {
                bestballPreloadedData.set(data);
            }
            return data;
        }).catch(() => null)
    );

</script>

<style>
    .loading {
        display: block;
        width: 85%;
        max-width: 500px;
        margin: 80px auto;
    }
</style>

{#await helperPromises}
    <!-- promise is pending -->
    <div class="loading">
        <p>Calculating power rankings...</p>
        <LinearProgress indeterminate />
    </div>
{:then [nflState, rostersData, leagueTeamManagers, leagueData, playersInfo]}
    {#if leagueData.status != 'pre_draft' && leagueData.status != 'complete'}
        <PowerRankingsDisplay {nflState} {rostersData} {leagueTeamManagers} {leagueData} {playersInfo} />
    {/if}
    {#if leagueData.status === 'pre_draft'}
        <p style="text-align: center;">Le PowerRanking sera affiché après la draft.</p>
    {/if}
    {#if leagueData.status === 'complete'}
        <p style="text-align: center;">Le PowerRanking sera affiché après la draft de la prochaine saison.</p>
    {/if}
{:catch error}
	<!-- promise was rejected -->
	<p>Something went wrong: {error.message}</p>
{/await}



