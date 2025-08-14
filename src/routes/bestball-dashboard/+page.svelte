<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import LinearProgress from '@smui/linear-progress';
    import { bestballCache, bestballPreloadedData } from '$lib/stores';
    import { get } from 'svelte/store';
    
    export let data;
    
    let standings = data.standings || [];
    let currentWeek = data.currentWeek || 0;
    let totalWeeks = data.totalWeeks || 18;
    let selectedWeek = currentWeek;
    let isLoading = false;
    let error = null;
    
    // Initialiser le cache si nécessaire
    onMount(() => {
        if (data.standings && data.standings.length > 0) {
            bestballCache.update(cache => ({
                ...cache,
                standings: { ...cache.standings, [selectedWeek]: data.standings },
                lastUpdate: Date.now(),
                currentWeek: data.currentWeek
            }));
        }
    });
    
    // Fonction pour filtrer les données par semaine
    $: filteredStandings = standings.filter(entry => {
        if (selectedWeek === 0) return true;
        return entry.week === selectedWeek;
    });
    
    // Fonction pour trier par points (décroissant)
    $: sortedStandings = [...filteredStandings].sort((a, b) => b.points - a.points);
    
    // Fonction pour changer de semaine
    async function changeWeek(week) {
        if (week === selectedWeek) return;
        
        selectedWeek = week;
        isLoading = true;
        error = null;
        
        // Vérifier le cache d'abord
        const cache = get(bestballCache);
        const cacheKey = week;
        const cacheAge = Date.now() - (cache.lastUpdate || 0);
        const cacheValid = cacheAge < 5 * 60 * 1000; // 5 minutes
        
        if (cache.standings[cacheKey] && cacheValid) {
            standings = cache.standings[cacheKey];
            isLoading = false;
            return;
        }
        
        try {
            const response = await fetch(`/api/bestball-dashboard?week=${week}`);
            if (response.ok) {
                const newData = await response.json();
                standings = newData.standings || [];
                
                // Mettre en cache
                bestballCache.update(cache => ({
                    ...cache,
                    standings: { ...cache.standings, [cacheKey]: newData.standings },
                    lastUpdate: Date.now()
                }));
            } else {
                error = 'Erreur lors du chargement des données';
            }
        } catch (err) {
            error = 'Erreur de connexion';
        } finally {
            isLoading = false;
        }
    }
    
    // Fonction pour obtenir la couleur de position
    function getPositionColor(position) {
        if (position <= 3) return 'gold';
        if (position <= 10) return 'silver';
        if (position <= 20) return 'bronze';
        return 'normal';
    }
    
    // Fonction pour formater les points
    function formatPoints(points) {
        return parseFloat(points).toFixed(2);
    }
</script>

<svelte:head>
    <title>Dashboard BestBall - FantasyBallers</title>
    <meta name="description" content="Classement global des ligues BestBall FantasyBallers" />
</svelte:head>

<div class="dashboard-container">
    <div class="text-center mb-8">
        <h1>🏆 Dashboard BestBall</h1>
        <p class="subtitle">
            Classement global de toutes nos ligues BestBall. Comparez vos performances 
            avec l'ensemble de la communauté FantasyBallers !
        </p>
    </div>

    <!-- Sélecteur de semaine -->
    <div class="week-selector">
        <h2>Sélection de la semaine</h2>
        
        <!-- Version desktop : boutons -->
        <div class="week-buttons desktop-only">
            <button 
                class="week-btn {selectedWeek === 0 ? 'active' : ''}"
                on:click={() => changeWeek(0)}
            >
                Global
            </button>
            {#each Array.from({length: totalWeeks}, (_, i) => i + 1) as week}
                <button 
                    class="week-btn {selectedWeek === week ? 'active' : ''}"
                    on:click={() => changeWeek(week)}
                >
                    Semaine {week}
                </button>
            {/each}
        </div>
        
        <!-- Version mobile/tablette : liste déroulante -->
        <div class="week-dropdown mobile-only">
            <select 
                bind:value={selectedWeek}
                on:change={() => changeWeek(selectedWeek)}
                class="week-select"
            >
                <option value={0}>Classement Global</option>
                {#each Array.from({length: totalWeeks}, (_, i) => i + 1) as week}
                    <option value={week}>Semaine {week}</option>
                {/each}
            </select>
        </div>
    </div>

    <!-- Statistiques -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-number">{standings.length}</div>
            <div class="stat-label">Managers</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">
                {standings.length > 0 ? Math.max(...standings.map(s => s.points)).toFixed(2) : '0.00'}
            </div>
            <div class="stat-label">Meilleur score</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">
                {standings.length > 0 ? (standings.reduce((sum, s) => sum + s.points, 0) / standings.length).toFixed(2) : '0.00'}
            </div>
            <div class="stat-label">Moyenne</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">
                {get(bestballPreloadedData) ? '⚡ Préchargé' : '🔄 API'}
            </div>
            <div class="stat-label">Source</div>
        </div>
    </div>

    <!-- Message d'erreur -->
    {#if error}
        <div class="error-message">
            {error}
        </div>
    {/if}

    <!-- Classement -->
    <div class="standings-container">
        <h2>
            {#if selectedWeek === 0}
                Classement Global
            {:else}
                Classement Semaine {selectedWeek}
            {/if}
        </h2>
        
        {#if isLoading}
            <div class="loading">
                <p>Chargement des données...</p>
                <LinearProgress indeterminate />
            </div>
        {:else if sortedStandings.length === 0}
            <div class="no-data">
                <p>Aucune donnée disponible pour cette semaine.</p>
            </div>
        {:else}
            <div class="standingsTable">
                <DataTable table$aria-label="BestBall Standings">
                    <Head>
                        <Row>
                            <Cell>Position</Cell>
                            <Cell>Manager</Cell>
                            <Cell>Ligue</Cell>
                            <Cell>Points</Cell>
                            {#if selectedWeek === 0}
                                <Cell>Semaine</Cell>
                            {/if}
                        </Row>
                    </Head>
                    <Body>
                        {#each sortedStandings as entry, index}
                            <Row>
                                <Cell>
                                    <span class="position {getPositionColor(index + 1)}">
                                        #{index + 1}
                                    </span>
                                </Cell>
                                <Cell>{entry.manager}</Cell>
                                <Cell>{entry.league}</Cell>
                                <Cell class="points">{formatPoints(entry.points)}</Cell>
                                {#if selectedWeek === 0}
                                    <Cell>{entry.week}</Cell>
                                {/if}
                            </Row>
                        {/each}
                    </Body>
                </DataTable>
            </div>
        {/if}
    </div>
</div>

<style>
    .dashboard-container {
        text-align: center;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    h1 {
        font-size: 2.2em;
        line-height: 1.3em;
        margin: 1.5em 0 1em;
        color: var(--mdc-theme-primary);
    }

    .subtitle {
        font-size: 1.2em;
        color: var(--mdc-theme-secondary);
        margin-bottom: 2em;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
    }

    .week-selector {
        background: var(--mdc-theme-surface);
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .week-selector h2 {
        font-size: 1.5em;
        margin-bottom: 1rem;
        color: var(--mdc-theme-on-surface);
    }

    .week-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
    }

    .week-btn {
        padding: 0.5rem 1rem;
        border: 2px solid var(--mdc-theme-primary);
        background: transparent;
        color: var(--mdc-theme-primary);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
    }

    .week-btn:hover {
        background: var(--mdc-theme-primary);
        color: white;
    }

    .week-btn.active {
        background: var(--mdc-theme-primary);
        color: white;
    }

    /* Styles pour la liste déroulante mobile/tablette */
    .week-dropdown {
        display: none;
    }

    .week-select {
        width: 100%;
        max-width: 300px;
        padding: 0.75rem 1rem;
        border: 2px solid var(--mdc-theme-primary);
        border-radius: 6px;
        background: var(--mdc-theme-surface);
        color: var(--mdc-theme-on-surface);
        font-size: 1rem;
        cursor: pointer;
        outline: none;
        transition: all 0.3s ease;
    }

    .week-select:focus {
        border-color: var(--mdc-theme-secondary);
        box-shadow: 0 0 0 2px rgba(var(--mdc-theme-secondary), 0.2);
    }

    /* Classes pour l'affichage responsive */
    .desktop-only {
        display: block;
    }

    .mobile-only {
        display: none;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background: var(--mdc-theme-surface);
        padding: 1.5rem;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }

    .stat-card:hover {
        transform: translateY(-2px);
    }

    .stat-number {
        font-size: 2.5em;
        font-weight: bold;
        color: var(--mdc-theme-primary);
        margin-bottom: 0.5rem;
    }

    .stat-label {
        color: var(--mdc-theme-on-surface);
        font-size: 1.1em;
    }

    .error-message {
        background: #fee;
        border: 1px solid #fcc;
        color: #c33;
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .standings-container {
        background: var(--mdc-theme-surface);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .standings-container h2 {
        background: var(--mdc-theme-primary);
        color: white;
        padding: 1rem 1.5rem;
        margin: 0;
        font-size: 1.3em;
    }

    .loading, .no-data {
        padding: 3rem;
        text-align: center;
        color: var(--mdc-theme-on-surface);
    }

    .loading p {
        margin-bottom: 1rem;
    }

    .standingsTable {
        max-width: 100%;
        overflow-x: auto;
        margin: 0.5em 0 2em;
    }

    .position {
        font-weight: bold;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
    }

    .position.gold {
        color: #d4af37;
        background: rgba(212, 175, 55, 0.1);
    }

    .position.silver {
        color: #c0c0c0;
        background: rgba(192, 192, 192, 0.1);
    }

    .position.bronze {
        color: #cd7f32;
        background: rgba(205, 127, 50, 0.1);
    }

    .position.normal {
        color: var(--mdc-theme-on-surface);
    }

    .points {
        font-weight: bold;
        color: var(--mdc-theme-primary);
    }

    @media (max-width: 768px) {
        .dashboard-container {
            padding: 0 15px;
        }

        /* Masquer les boutons sur mobile/tablette */
        .desktop-only {
            display: none;
        }

        /* Afficher la liste déroulante sur mobile/tablette */
        .mobile-only {
            display: block;
        }

        .stats-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
        /* Sur tablette, on peut garder les boutons mais les adapter */
        .week-buttons {
            flex-wrap: wrap;
            gap: 0.25rem;
        }

        .week-btn {
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
        }
    }
</style> 