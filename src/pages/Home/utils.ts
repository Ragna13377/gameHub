// export const sortGameByPrice = (games: TSteamGameInfo[]): TSteamGameInfo[] => {
// 	return games.sort((a, b) => {
// 		if(a.price_overview?.final_formatted && b.price_overview?.final_formatted) {
// 			const aPrice = parseInt(a.price_overview.final_formatted);
// 			const bPrice = parseInt(b.price_overview.final_formatted);
// 			return aPrice - bPrice;
// 		}
// 		else {
// 			if(a.is_free && !b.is_free) return -1;
// 			else if(!a.is_free && b.is_free) return 1;
// 			else return 0;
// 		}
// 	})
// }

import { Dispatch, SetStateAction } from 'react';
import { SteamAndGOGResponse } from '@shared/types';

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
