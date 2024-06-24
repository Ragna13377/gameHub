export type StoreType = 'Steam' | 'GOG';
export type PriceVolumeType = 'Low' | 'High';

export type SteamAndGOGResponse = {
	id: number;
	name: string;
	type: StoreType;
	description: string;
	image: string;
	storeLink: string;
	price: string;
};
