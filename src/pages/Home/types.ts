export type TResponseBody = {
	gameDetails: TSteamGameDetails[];
	gamesId: number[];
}

export type TSteamGameDetails = {
	name: string;
	is_free: boolean;
	steam_appid: number;
	detailed_description: string;
	header_image: string;
	price_overview?: {
		final_formatted: string;
	};
};