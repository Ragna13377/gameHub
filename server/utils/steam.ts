import axios from 'axios';
import { TFilteredSteamApp, TSteamApp, TSteamResponse } from '../types';
import { cleanAndSplitText } from './utils';
import FilteredSteamGame from '../models/FilteredSteamGame';

export const fetchSteamAppList = async (): Promise<TSteamApp[]> => {
	try {
		const { data } = await axios.get<TSteamResponse>(
			'http://api.steampowered.com/ISteamApps/GetAppList/v0002/'
		);
		return  data?.applist?.apps.slice(0, 100) || [];
	} catch (error) {
		console.error('Error fetching Steam app list:', error);
		return [];
	}
}

export const filterSteamAppByTwoLetter = (apps: TSteamApp[]) => {
	const filteredGames = apps.reduce((map, game) => {
		if(!game.name) return map;
		const words = cleanAndSplitText(game.name);
		words.forEach((word) => {
			const index = word.slice(0, 2).toLowerCase();
			if (!map.has(index)) map.set(index, {
				filteredIndex: index,
				games: [],
			})
			map.get(index)?.games.push({
				appid: game.appid,
				name: game.name,
			});
		});
		return map;
	}, new Map<string, TFilteredSteamApp>())
	return Array.from(filteredGames.values());
}

export const saveFilteredSteamGames = async (filteredGames: TFilteredSteamApp[] ) => {
	try {
		await FilteredSteamGame.insertMany(filteredGames);
		console.log('Sorted games saved');
	} catch (error) {
		console.log('Error saving sorted games', error);
	}
}

