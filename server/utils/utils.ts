import { TSteamError, TSteamGame } from '../types';
import {
	replacementChar,
	specialCharRegex,
	wordsMoreTwoLetter,
} from '../constants';

export const isSteamGame = (res: TSteamError | TSteamGame): res is TSteamGame =>
	res.success === true;

export const cleanAndSplitText = (text: string): string[] => {
	const cleanedName = text.replace(specialCharRegex, replacementChar);
	return cleanedName.match(wordsMoreTwoLetter) || [];
};
