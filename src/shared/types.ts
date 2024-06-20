export type StoreType = 'steam' | 'gog';

export type SteamAndGOGResponse = {
	id: number;
	name: string;
	type: StoreType;
	description: string;
	image: string;
	storeLink: string;
	price: string;
};
