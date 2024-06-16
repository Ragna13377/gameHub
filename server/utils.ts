import { TSteamError, TSteamGame } from './types';

export const isSteamGame = (res: TSteamError | TSteamGame): res is TSteamGame =>
	res.success === true;
