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