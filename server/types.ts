export type TRequestBody = {
	searchedGame: string;
};
export type TSteamGameInfo = {
	name: string;
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
	data: TSteamGameInfo;
};

export type TSteamGameResponse = {
	[key: number]: TSteamError | TSteamGame;
};
export type TSteamResponse = {
	applist: {
		apps: TSteamApp[];
	};
};