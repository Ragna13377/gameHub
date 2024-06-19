import Fuse, { IFuseOptions } from 'fuse.js';
import { TGOGGameInfo, TSteamApp } from '../types';
import { isSteamAppArray } from './utils';

export const createFuseOptions = <T>(
	keys: Array<keyof T>
): IFuseOptions<T> => ({
	keys: keys.map((key) => key.toString()),
	includeScore: true,
	threshold: 0.2,
	ignoreLocation: true,
	minMatchCharLength: 2,
});

export const customFuseOptions = {
	steam: createFuseOptions<TSteamApp>(['name']),
	gog: createFuseOptions<TGOGGameInfo>(['title']),
};

export const fuseSearch = (
	searchedResult: TSteamApp[] | TGOGGameInfo[] | null,
	searchedGame: string
): number[] | null => {
	if (!searchedResult) return null;
	if (isSteamAppArray(searchedResult)) {
		const fuse = new Fuse(searchedResult, customFuseOptions.steam);
		const fuseSearchResults = fuse.search(searchedGame);
		return Array.from(
			new Set(fuseSearchResults.map((result) => result.item.appid))
		);
	} else {
		const fuse = new Fuse(searchedResult, customFuseOptions.gog);
		const fuseSearchResults = fuse.search(searchedGame);
		return fuseSearchResults.map((result) => Number(result.item.id));
	}
};
