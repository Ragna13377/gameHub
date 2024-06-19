export type marketType = 'steam' | 'gog';

export type SteamAndGOGResponse = {
	id: number;
	name: string;
	type: marketType;
	description: string;
	image: string;
	storeLink: string;
	price: string;
};
