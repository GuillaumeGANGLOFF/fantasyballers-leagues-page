import { get } from 'svelte/store';
import { leagueData, leagueID } from '$lib/stores';
//import { leagueID } from '$lib/utils/leagueInfo';

export const getLeagueData = async () => {
	const currentLeagueID = get(leagueID);

	if (get(leagueData)[currentLeagueID]) {
		return get(leagueData)[currentLeagueID];
	}

	const res = await fetch(`https://api.sleeper.app/v1/league/${currentLeagueID}`, {compress: true}).catch((err) => { console.error(err); });
	const data = await res.json().catch((err) => { console.error(err); });

	if (res.ok) {
		leagueData.update(ld => {
			ld[currentLeagueID] = data;
			return ld;
		});
		return data;
	} else {
		throw new Error(data);
	}
}