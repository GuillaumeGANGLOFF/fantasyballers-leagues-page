import { managers } from '$lib/utils/leagueInfo';
import { get } from 'svelte/store';
import { teamManagersStore, leagueID } from '$lib/stores';
import { waitForAll } from './multiPromise';
import { getManagers, getTeamData } from './universalFunctions';
import { getLeagueData } from './leagueData';
import { deduplicateFetch } from '$lib/utils/pendingFetches';

export const getLeagueTeamManagers = () => {
    const id = get(leagueID);
    return deduplicateFetch(`teamManagers_${id}`, () => _fetchLeagueTeamManagers(id));
}

const _fetchLeagueTeamManagers = async (id) => {
    if(get(teamManagersStore) && get(teamManagersStore).currentSeason) {
		return get(teamManagersStore);
	}
    let currentLeagueID = id;
	let teamManagersMap = {};
    let finalUsers = {};
    let currentSeason = null;

	while(currentLeagueID && currentLeagueID !== null) {
		const [usersRaw, leagueData, rostersRaw] = await waitForAll(
            fetch(`https://api.sleeper.app/v1/league/${currentLeagueID}/users`, {compress: true}),
			getLeagueData(currentLeagueID),
            fetch(`https://api.sleeper.app/v1/league/${currentLeagueID}/rosters`, {compress: true}),
        ).catch((err) => { console.error(err); });

        const [users, rosters] = await waitForAll(
            usersRaw.json(), 
            rostersRaw.json(), 
        ).catch((err) => { console.error(err); });

        const year = parseInt(leagueData.season);
        currentLeagueID = leagueData.previous_league_id;
        if(!currentSeason) {
            currentSeason = year;
        }
        teamManagersMap[year] = {};
        const processedUsers = processUsers(users);

        for(const processedUserKey in processedUsers) {
            if(finalUsers[processedUserKey]) continue;
            finalUsers[processedUserKey] = processedUsers[processedUserKey];
        }
        for(const roster of rosters) {
            teamManagersMap[year][roster.roster_id] = {
                team: getTeamData(processedUsers, roster.owner_id),
                managers: getManagers(roster),
            };
        }
    }
    const response = {
        currentSeason,
        teamManagersMap,
        users: finalUsers,
    }
    teamManagersStore.update(() => response);
    return response;
}

const processUsers = (rawUsers) => {
	let finalUsers = {};
	for(const user of rawUsers) {
        user.user_name = user.user_name ?? user.display_name;
		finalUsers[user.user_id] = user;
        const manager = managers.find(m => m.managerID === user.user_id);
        if(manager) {
            finalUsers[user.user_id].display_name = manager.name;
        }
	}
	return finalUsers;
}
