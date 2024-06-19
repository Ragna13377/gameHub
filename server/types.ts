export type TRequestBody = {
	searchedGame: string;
};
export type TSteamGameDetails = {
	name: string;
	steam_appid: number;
	is_free: boolean;
	detailed_description: string;
	header_image: string;
	price_overview?: {
		final_formatted: string;
	};
};
export type TSteamApp = {
	appid: number;
	name: string;
};
export type TFilteredSteamApp = {
	filteredIndex: string;
	games: TSteamApp[];
};
export type TSteamError = {
	success: false;
};
export type TSteamGame = {
	success: true;
	data: TSteamGameDetails;
};

export type TSteamGameResponse = {
	[key: number]: TSteamError | TSteamGame;
};
export type TSteamResponse = {
	applist: {
		apps: TSteamApp[];
	};
};

export type TGOGGameInfo = {
	id: string;
	title: string;
	price: {
		final: string;
	};
	storeLink: string;
};
export type TGOGGameDetails = {
	description: string;
	_links: {
		store: {
			href: string;
		};
	};
	_embedded: {
		product: {
			title: string;
			id: number;
			_links: {
				image: {
					href: string;
				};
			};
		};
	};
};
export type TGOGResponse = {
	pages: number;
	productCount: number;
	products: TGOGGameInfo[];
};
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
