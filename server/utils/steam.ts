import axios from 'axios';
import { TFilteredSteamApp, TSteamApp, TSteamGameInfo, TSteamGameResponse, TSteamResponse } from '../types';
import { cleanAndSplitText, isSteamGame } from './utils';
import FilteredSteamGame from '../models/FilteredSteamGame';
import Fuse, { FuseResult } from 'fuse.js';
import { fuseOptions } from '../constants';

export const fetchSteamAppList = async (): Promise<TSteamApp[]> => {
	try {
		const { data } = await axios.get<TSteamResponse>(
			'http://api.steampowered.com/ISteamApps/GetAppList/v0002/'
		);
		return data?.applist?.apps || [];
	} catch (error) {
		console.error('Error fetching Steam app list:', error);
		return [];
	}
};

export const filterSteamAppByTwoLetter = (apps: TSteamApp[]) => {
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

export const fetchGameById = async (appid: number): Promise<TSteamGameInfo | null> => {
	try {
		const { data } = await axios.get<TSteamGameResponse>(
			`https://store.steampowered.com/api/appdetails?appids=${appid}`
		)
		const appData = data?.[appid];
		return (appData && isSteamGame(appData)) ? appData.data : null;
	} catch (error) {
		return null
	}
}
export const fetchByFilteredIndex = async (searchedGame: string) => {
	try {
		const words = cleanAndSplitText(searchedGame);
		const searchedDbPromises: Promise<TSteamApp[] | null>[] = words.map((word) =>
			FilteredSteamGame.findOne({ filteredIndex: word.slice(0, 2).toLowerCase() })
				.then((result) => (result ? result.games : null))
				.catch((error) => {
					console.log(`Error fetching ${word}:`, error);
					return null;
				})
		);
		return await Promise.all(searchedDbPromises);
	} catch (error) {
		console.log('Promise.all error request by filtered index', error);
		return null;
	}
}

export const fuseSearch = (searchedResult: (TSteamApp[] | null)[], searchedGame: string) => {
	const fuseSearch: FuseResult<TSteamApp>[] = [];
	searchedResult.forEach((el) => {
		if (el) {
			const fuse = new Fuse(el, fuseOptions);
			fuseSearch.push(...fuse.search(searchedGame));
		}
	});
	return Array.from(new Set(fuseSearch.flatMap((el) => el.item.appid)));
}

export const fetchGameDetails = async (uniqueGames: number[]): Promise<TSteamGameInfo[]> => {
	try {
		const gameDetailsPromises: Promise<TSteamGameInfo | null>[] = Array.from(uniqueGames).map((appid) => fetchGameById(appid));
		const gameDetails = await Promise.all(gameDetailsPromises)
		if (!gameDetails || gameDetails.every(detail => detail === null)) return [];
		return gameDetails.filter((details) => details !== null) as TSteamGameInfo[];
	} catch (error) {
		console.log('Promise.all error request by appid', error);
		return [];
	}
}
