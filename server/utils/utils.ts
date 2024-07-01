import { TGOGGameInfo, TSteamApp, TSteamError, TSteamGame } from '../types';
import {
	commonWords,
	replacementChar,
	specialCharRegex,
	wordsMoreTwoLetter,
} from '../constants';

export const isSteamGame = (res: TSteamError | TSteamGame): res is TSteamGame =>
	res.success === true;
export const isSteamAppArray = (
	res: TSteamApp[] | TGOGGameInfo[]
): res is TSteamApp[] => 'appid' in res[0];
export const cleanAndSplitText = (text: string): string[] => {
	const cleanedName = text.replace(specialCharRegex, replacementChar);
	const words = cleanedName.match(wordsMoreTwoLetter) || [];
	return words.filter((word) => !commonWords.includes(word));
};
