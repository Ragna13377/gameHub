export type TRequestBody = {
	searchedGame: string;
};
export type TSteamResponse = {
	applist: {
		apps: TSteamApp[];
	};
};

export type TSteamApp = {
	appid: number;
	name: string;
};
export type TSteamError = {
	success: false;
};
export type TSteamGame = {
	success: true;
	data: TSteamGameInfo;
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

export type TSteamGameResponse = {
	[key: number]: TSteamError | TSteamGame;
};
