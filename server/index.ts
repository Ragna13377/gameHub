import express, { Request, Response, json, urlencoded } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { SteamAndGOGResponse, TRequestBody } from './types';
import { checkIsDataExists, connectToMongooseDB } from './utils/mongoose';
import {
	fetchSteamAppList,
	fetchSteamGameByFilteredIndex,
	fetchSteamGameDetails,
	filterSteamAppByTwoLetter,
	saveFilteredSteamGames,
} from './utils/steam';
import { fetchGogAppList, fetchGOGGameDetails } from './utils/gog';
import { fuseSearch } from './utils/fuse';

config();
const PORT = process.env.PORT || 3001;
const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.post(
	'/api/search',
	async (
		req: Request<Record<string, never>, unknown, TRequestBody>,
		res: Response<SteamAndGOGResponse[] | { error: string }>
	) => {
		try {
			let response: SteamAndGOGResponse[] = [];
			const [steamResult, gogResult] = await Promise.all([
				fetchSteamGameByFilteredIndex(req.body.searchedGame),
				fetchGogAppList(req.body.searchedGame),
			]);
			console.log(`fetch Steam ${steamResult ? steamResult.length : 'error'}`);
			console.log(`fetch Gog ${gogResult ? gogResult.length : 'error'}`);
			if (gogResult) {
				gogResult.forEach((game) => {
					response.push({
						id: Number(game.id),
						name: game.title,
						type: 'gog',
						description: '',
						image: '',
						storeLink: game.storeLink,
						price: game.price.final,
					});
				});
			}
			const uniqueSteamGame = fuseSearch(steamResult, req.body.searchedGame);
			const uniqueGOGGame = fuseSearch(gogResult, req.body.searchedGame);
			console.log(
				`unique Steam: ${uniqueSteamGame ? uniqueSteamGame.length : 'Error'}`
			);
			console.log(
				`unique GOG: ${uniqueGOGGame ? uniqueGOGGame.length : 'Error'}`
			);
			const [gogDetails, steamDetails] = await Promise.all([
				uniqueGOGGame
					? fetchGOGGameDetails(uniqueGOGGame.slice(0, 6))
					: Promise.resolve(null),
				uniqueSteamGame
					? fetchSteamGameDetails(uniqueSteamGame.slice(0, 6))
					: Promise.resolve(null),
			]);
			console.log(
				`details Steam: ${steamDetails ? steamDetails.length : 'Error'}`
			);
			console.log(`details GOG: ${gogDetails ? gogDetails.length : 'Error'}`);
			if (gogDetails) {
				gogDetails.forEach((details) => {
					const currentGame = response.find(
						(game) => game.id === details._embedded.product.id
					);
					if (currentGame) {
						currentGame.description = details.description;
						currentGame.image =
							details._embedded.product._links.image.href.replace(
								'_{formatter}',
								''
							);
					}
				});
			}
			response = response.filter((game) => game.description !== '');
			if (steamDetails) {
				steamDetails.forEach((details) => {
					if (
						details.detailed_description &&
						details.detailed_description !== '' &&
						!details.name.includes('Demo')
					) {
						response.push({
							id: details.steam_appid,
							name: details.name,
							type: 'steam',
							description: details.detailed_description,
							image: details.header_image,
							storeLink: `https://store.steampowered.com/app/${details.steam_appid}`,
							price:
								details.is_free || !details.price_overview
									? 'Free'
									: details.price_overview.final_formatted,
						});
					}
				});
			}
			if (response.length === 0) res.status(404).json({ error: 'Not Found' });
			res.json(response);
		} catch (error) {
			return res.status(404).json({ error: 'Search Error' });
		}
	}
);

const initialSaveData = async () => {
	const apps = await fetchSteamAppList();
	if (!apps) return;
	const filteredGames = filterSteamAppByTwoLetter(apps);
	await saveFilteredSteamGames(filteredGames);
};

const startServer = async () => {
	await connectToMongooseDB();
	const isDataExists = await checkIsDataExists();
	if (!isDataExists) {
		await initialSaveData();
	}
	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
};
startServer().catch((error) => console.log(error));
