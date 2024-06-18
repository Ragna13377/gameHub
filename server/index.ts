import express, { Request, Response, json, urlencoded } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { TRequestBody, TResponseBody } from './types';
import { checkIsDataExists, connectToMongooseDB } from './utils/mongoose';
import {
	fetchByFilteredIndex,
	fetchGameDetails,
	fetchSteamAppList,
	filterSteamAppByTwoLetter, fuseSearch,
	saveFilteredSteamGames
} from './utils/steam';

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
			const searchedResult = await fetchByFilteredIndex(req.body.searchedGame);
			if (searchedResult) {
				console.log('Search result received')
				const uniqueGames = fuseSearch(searchedResult, req.body.searchedGame);
				console.log('unique', uniqueGames.length)
				const gameDetails = await fetchGameDetails(uniqueGames.length > 6 ? uniqueGames.slice(0, 6) : uniqueGames);
				console.log('details', gameDetails.length)
				res.json({
					gameDetails,
					gamesId: uniqueGames.slice(0, 36),
				});
			}
		} catch (error) {
			console.log('Error searching', error);
		}
	}
);

const initialSaveData = async () => {
	const apps = await fetchSteamAppList();
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
