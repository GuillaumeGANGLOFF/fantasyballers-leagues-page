import { get } from 'svelte/store';
import { leagueData, leagueID } from '$lib/stores';

export const getLeagueData = async (queryLeagueID) => {
	const id = queryLeagueID ?? get(leagueID);
	if(get(leagueData)[id]) {
		return get(leagueData)[id];
	}
	const res = await fetch(`https://api.sleeper.app/v1/league/${id}`, {compress: true}).catch((err) => { console.error(err); });
	const data = await res.json().catch((err) => { console.error(err); });

	if (res.ok) {
		leagueData.update(ld => { ld[id] = data; return ld; });
		return data;
	} else {
		throw new Error(data);
	}
}
