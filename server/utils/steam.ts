import axios from 'axios';
import {
	TFilteredSteamApp,
	TSteamApp, TSteamGameDetails,
	TSteamGameResponse,
	TSteamResponse
} from '../types';
import { cleanAndSplitText, isSteamGame } from './utils';
import FilteredSteamGame from '../models/FilteredSteamGame';

export const fetchSteamAppList = async (): Promise<TSteamApp[] | null> => {
	try {
		const { data } = await axios.get<TSteamResponse>(
			'https://api.steampowered.com/ISteamApps/GetAppList/v0002/'
		);
		return data?.applist?.apps || null;
	} catch (error) {
		console.log('Error fetching Steam app list:', error);
		return null;
	}
};

export const filterSteamAppByTwoLetter = (apps: TSteamApp[]): TFilteredSteamApp[] => {
	const filteredGames = apps.reduce((map, game) => {
		if (!game.name) return map;
		const words = cleanAndSplitText(game.name);
		words.forEach((word) => {
			const index = word.slice(0, 2).toLowerCase();
			if (!map.has(index))
				map.set(index, {
					filteredIndex: index,
					games: [],
				});
			map.get(index)?.games.push({
				appid: game.appid,
				name: game.name,
			});
		});
		return map;
	}, new Map<string, TFilteredSteamApp>());
	return Array.from(filteredGames.values());
};

export const saveFilteredSteamGames = async (
	filteredGames: TFilteredSteamApp[]
) => {
	try {
		await FilteredSteamGame.insertMany(filteredGames);
		console.log('Sorted games saved');
	} catch (error) {
		console.log('Error saving sorted games', error);
	}
};

export const fetchSteamGameById = async (
	appid: number
): Promise<TSteamGameDetails | null> => {
	return axios.get<TSteamGameResponse>(
		`https://store.steampowered.com/api/appdetails?appids=${appid}`
	).then(({ data }) => {
		const appData = data?.[appid];
		return (appData && isSteamGame(appData)) ? appData.data : null;
	}).catch((error) => {
		console.log('Error fetching Steam game ID list:', error);
		return null;
	})
};
export const fetchSteamGameByFilteredIndex = async (searchedGame: string):  Promise<TSteamApp[] | null> => {
	const words = cleanAndSplitText(searchedGame);
	const searchedDbPromises: Promise<TSteamApp[] | null>[] = words.map(
		(word) =>
			FilteredSteamGame.findOne({
				filteredIndex: word.slice(0, 2).toLowerCase(),
			})
				.then((result) => (result ? result.games : null))
				.catch((error) => {
					console.log(`Error fetching ${word}:`, error);
					return null;
				})
	);
	const result = (await Promise.all(searchedDbPromises)).flatMap((result) => result ?? []);
	return result.length > 0 ? result : null;
};

export const fetchSteamGameDetails = async (
	uniqueGames: number[]
): Promise<TSteamGameDetails[] | null> => {
	try {
		const gameDetailsPromises: Promise<TSteamGameDetails | null>[] =
			uniqueGames.map((appid) => fetchSteamGameById(appid));
		const result = (await Promise.all(gameDetailsPromises)).flatMap((result) => result ?? []);
		return result.length > 0 ? result : null;
	} catch (error) {
		console.log('Error fetch Steam details', error);
		return null;
	}
};
// 	return gameDetails.filter(
// 		(details) =>
// 			!(
// 				details === null ||
// 				details.name.includes('Demo') ||
// 				!details.detailed_description
// 			)
// 	) as TSteamGameDetails[];