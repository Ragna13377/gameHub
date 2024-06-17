import express, { Request, Response, json, urlencoded } from 'express';
import cors from 'cors';
import Fuse, { FuseResult } from 'fuse.js';
import { config } from 'dotenv';
import {
	TRequestBody,
	TSteamApp,
} from './types';
import { cleanAndSplitText } from './utils/utils';
import FilteredSteamGame from './models/FilteredSteamGame';
import { checkIsDataExists, connectToMongooseDB } from './utils/mongoose';
import { fetchSteamAppList, filterSteamAppByTwoLetter, saveFilteredSteamGames } from './utils/steam';
import { fuseOptions } from './constants';

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
		res: Response
	) => {
		try {
			const words = cleanAndSplitText(req.body.searchedGame);
			const searchedResult: Promise<TSteamApp[] | null>[] = [];
			words.forEach((word) => {
				searchedResult.push(
					FilteredSteamGame.findOne({
						filteredIndex: word.slice(0, 2).toLowerCase(),
					})
						.then((result) => (result ? result.games : null))
						.catch((error) => {
							console.log(`Error fetching '${word}':`, error);
							return null;
						})
				);
			});
			const searchedResultsArray = await Promise.all(searchedResult).catch(
				(error) => {
					console.log('Error Promise.all', error);
				}
			);
			if (searchedResultsArray) {
				const fuseSearch: FuseResult<TSteamApp>[] = [];
				searchedResultsArray.forEach((el) => {
					if (el) {
						const fuse = new Fuse(el, fuseOptions);
						const results = fuse.search(req.body.searchedGame);
						fuseSearch.push(...results);
					}
				});
				const uniqueGames = new Set<number>();
				fuseSearch.flat().forEach((el) => uniqueGames.add(el.item.appid));
			}
			res.json({ name: 'ff' });
			// 	const result = apps.find((el) => el.name === req.body.searchedGame);
			// 	if (!result) {
			// 		return res.status(404).json({ error: 'App not found' });
			// 	}
			// 	const { appid } = result;
			// 	console.log(appid);
			// 	const { data: gameData } = await axios.get<TSteamGameResponse>(
			// 		`https://store.steampowered.com/api/appdetails?appids=${appid}`
			// 	);
			// 	const steamGame = gameData?.[appid];
			// 	if (!steamGame || !isSteamGame(steamGame)) {
			// 		return res.status(404).json({ error: 'App details not found' });
			// 	}
			// 	res.json(steamGame.data);
			// }
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
