import express, { Request, Response, json, urlencoded } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { TRequestBody, TResponseBody } from './types';
import { checkIsDataExists, connectToMongooseDB } from './utils/mongoose';
import {
	fetchSteamAppList, fetchSteamGameByFilteredIndex, fetchSteamGameDetails,
	filterSteamAppByTwoLetter,
	saveFilteredSteamGames
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
		res: Response<TResponseBody>
	) => {
		try {
			const [steamResult, gogResult] = await Promise.all([
				fetchSteamGameByFilteredIndex(req.body.searchedGame),
				fetchGogAppList(req.body.searchedGame)
			]);
			console.log(`fetch Steam ${steamResult ? steamResult.length : 'error'}`);
			console.log(`fetch Gog ${gogResult ? gogResult.length : 'error'}`);
			let uniqueSteamGame = fuseSearch(steamResult, req.body.searchedGame);
			let uniqueGOGGame = fuseSearch(gogResult, req.body.searchedGame);
			console.log(`unique Steam: ${uniqueSteamGame ? uniqueSteamGame.length: 'Error'}`);
			console.log(`unique GOG: ${uniqueGOGGame ? uniqueGOGGame.length: 'Error'}`);
			const [gogDetails, steamDetails] = await Promise.all([
				uniqueGOGGame ? fetchGOGGameDetails(uniqueGOGGame) : Promise.resolve(null),
				uniqueSteamGame ? fetchSteamGameDetails(uniqueSteamGame) : Promise.resolve(null)
			]);
			console.log(`details Steam: ${steamDetails ? steamDetails.length: 'Error'}`);
			console.log(`details GOG: ${gogDetails ? gogDetails.length: 'Error'}`);
				// res.json({
				// 	gameDetails,
				// 	gamesId: uniqueGames.slice(0, 36),
				// });
		} catch (error) {
			return res.status(404).json({ error: 'Search Error' });
		}
	}
);

const initialSaveData = async () => {
	const apps = await fetchSteamAppList();
	if(!apps) return;
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
