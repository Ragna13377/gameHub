import axios from 'axios';
import { TGOGGameDetails, TGOGGameInfo, TGOGResponse } from '../types';

export const fetchGogAppList = async (
	searchedGame: string
): Promise<TGOGGameInfo[] | null> => {
	try {
		const { data } = await axios.get<TGOGResponse>(
			`https://catalog.gog.com/v1/catalog?query=like:${searchedGame}`
		);
		return data ? data.products : null;
	} catch (error) {
		console.log('Error fetching GOG app list:', error);
		return null;
	}
};
export const fetchGOGGameDetails = async (
	uniqueGames: number[]
): Promise<TGOGGameDetails[] | null> => {
	try {
		const gameDetailPromises: Promise<TGOGGameDetails | null>[] =
			uniqueGames.map((id) =>
				axios
					.get<TGOGGameDetails>(
						`https://api.gog.com/v2/games/${id}?locale=en-US`
					)
					.then(({ data }) => (data ? data : null))
					.catch((error) => {
						console.log('Error fetch GOG game ID details', error);
						return null;
					})
			);
		const result = (await Promise.all(gameDetailPromises)).flatMap(
			(result) => result ?? []
		);
		return result.length > 0 ? result : null;
	} catch (error) {
		console.log('Error fetch GOG details', error);
		return null;
	}
};

export const parseGogPrice = (gogGame: TGOGGameInfo): string => {
	if (!gogGame.price || !gogGame.price.final) return 'Free';
	else {
		const parsedPrice = parseFloat(gogGame.price.final.replace(/[^\d.]/g, ''));
		return parsedPrice !== 0 ? `${parsedPrice}$` : 'Free';
	}
};
