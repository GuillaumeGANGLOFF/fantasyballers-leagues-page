<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { goto } from '$app/navigation';
    import { listLeagues } from '$lib/utils/leagueInfo.js';
    import { leagueID, leagueName } from '$lib/stores';

    let playersData = writable([]);
    let selectedPlayer = null;
    let loading = true;

    // Clé pour stocker les données dans localStorage
    const cacheKey = 'playersDataCache';

    async function fetchUsers() {
        loading = true;

        let playersMap = new Map();
        for (let league of listLeagues) {
            const response = await fetch(`https://api.sleeper.app/v1/league/${league.id}/users`);
            const users = await response.json();

            users.forEach(user => {
                if (!playersMap.has(user.display_name)) {
                    playersMap.set(user.display_name, [
                        { league_name: league.name, league_id: league.id }
                    ]);
                } else {
                    playersMap.get(user.display_name).push({ league_name: league.name, league_id: league.id });
                }
            });
        }

        const sortedPlayers = Array.from(playersMap.entries()).sort(([nameA], [nameB]) =>
            nameA.localeCompare(nameB)
        );

        playersData.set(sortedPlayers);
        localStorage.setItem(cacheKey, JSON.stringify(sortedPlayers)); // Stocker les données dans localStorage
        loading = false;
    }

    // Fonction pour charger les données depuis le cache ou faire un appel API si nécessaire
    function loadPlayersData() {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            playersData.set(JSON.parse(cachedData)); // Charger les données depuis le cache
            loading = false;
        } else {
            fetchUsers(); // Si pas de cache, faire un appel API
        }
    }

    onMount(() => {
        loadPlayersData(); // Charger les données depuis le cache ou l'API
    });

    // Fonction de gestion de la sélection d'un joueur
    function selectPlayer(e) {
        const selectedIndex = e.target.selectedIndex - 1;
        if (selectedIndex >= 0) {
            selectedPlayer = $playersData[selectedIndex];
        }
    }

    // Fonction de gestion de la sélection de la ligue
    function handleSelect(league_id) {
        const selectedLeague = listLeagues.find(league => league.id === league_id);
        leagueID.set(league_id);
        leagueName.set(selectedLeague.name);
        localStorage.setItem('leagueID', selectedId);
        localStorage.setItem('leagueName', selectedLeague.name);
        localStorage.setItem('leagueDynasty', selectedLeague.dynasty);
        goto('/');
    }
</script>

<style>
    .selector_league {
        color: #333;
        font-size: 16px;
        accent-color: #352A7E;
        margin: 5px;
        text-align: center; /* Centrer le texte dans la zone du sélecteur */
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
        margin-bottom: 10px;
    }

    .league-button {
        background-color: #352A7E;
        color: white;
        font-size: 18px;
        padding: 10px 20px;
        margin: 10px 0; /* Espacement vertical entre les boutons */
        border: none;
        border-radius: 5px;
        cursor: pointer;
        width: 80%; /* Rendre les boutons plus larges, mais centrés */
    }

    .league-button:hover {
        background-color: #554B99;
    }

    .league-button:focus {
        outline: none;
        background-color: #4A3F8C;
    }
</style>


<div class="selector_league">
    <!-- Affichage de l'indication de chargement -->
    {#if loading}
        <p>Chargement des données...</p>
    {:else}
        <!-- Sélecteur pour les joueurs -->
        <select on:change="{selectPlayer}">
            <option disabled selected>Choisir un joueur</option>
            {#each $playersData as [display_name, leagues]}
                <option value={display_name}>{display_name}</option>
            {/each}
        </select>

        <!-- Affichage des ligues du joueur sélectionné -->
        {#if selectedPlayer}
            <ul>
                {#each selectedPlayer[1] as league}
                    <button class="league-button" on:click={() => handleSelect(league.league_id)}>
                        {league.league_name}
                    </button>
                {/each}
            </ul>
        {/if}
    {/if}
</div>
