import { PriceVolumeType, SteamAndGOGResponse } from '@shared/types';
import { Dispatch, SetStateAction } from 'react';

export const filterByStore =
	(type: string) =>
	(
		games: SteamAndGOGResponse[],
		dispatch: Dispatch<SetStateAction<SteamAndGOGResponse[]>>
	) => {
		const filteredGames = games.filter((game) => game.type === type);
		if (filteredGames.length === 0) dispatch(games);
		else dispatch(filteredGames);
	};
export const filterByPrice = (
	type: PriceVolumeType,
	games: SteamAndGOGResponse[],
	dispatch: Dispatch<SetStateAction<SteamAndGOGResponse[]>>
) => {
	const filteredGames = [...games].sort((a, b) => {
		const isAFree = a.price === 'Free';
		const isBFree = b.price === 'Free';
		console.log(isAFree, isBFree);
		if ((isAFree && isBFree) || (!isAFree && !isBFree)) return 0;
		else {
			if (type === 'Low') {
				return isAFree ? 1 : -1;
			} else {
				return isAFree ? -1 : 1;
			}
		}
	});
	dispatch(filteredGames);
};
