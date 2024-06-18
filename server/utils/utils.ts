import { TSteamError, TSteamGame } from '../types';
import {
	commonWords,
	replacementChar,
	specialCharRegex,
	wordsMoreTwoLetter
} from '../constants';

export const isSteamGame = (res: TSteamError | TSteamGame): res is TSteamGame =>
	res.success === true;

export const cleanAndSplitText = (text: string): string[] => {
	const cleanedName = text.replace(specialCharRegex, replacementChar);
	const words = cleanedName.match(wordsMoreTwoLetter) || [];
	return words.filter((word) => {
		return !commonWords.includes(word);
	})
};
