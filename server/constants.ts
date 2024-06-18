import { IFuseOptions } from 'fuse.js';
import { TSteamApp } from './types';

export const wordsMoreTwoLetter = /\b\w{2,}\b/g;
export const specialCharRegex = /[^\w\s]/g;
export const replacementChar = ' ';
export const fuseOptions: IFuseOptions<TSteamApp> = {
	keys: ['name'],
	includeScore: true,
	threshold: 0.2,
	ignoreLocation: true,
	minMatchCharLength: 2,
};
export const commonWords = [
	'the',
	'an',
	'and',
	'or',
	'of',
	'if',
	'then',
	'but',
	'for',
	'at',
	'as',
	'by',
	'with',
	'from',
	'to',
	'in',
	'on',
	'at',
	'by',
]