import express, { Request, Response, json, urlencoded } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';
import Fuse, { FuseResult, IFuseOptions } from 'fuse.js';
import { config } from 'dotenv';
import {
	TFilteredSteamApp,
	TRequestBody,
	TSteamApp,
	TSteamResponse,
} from './types';
import { cleanAndSplitText } from './utils/utils';
import GroupedSteamGame from './models/groupedSteamGame';
import { checkIsDataExists, connectToMongooseDB } from './utils/mongoose';

config();
const PORT = process.env.PORT || 3001;


const options: IFuseOptions<TSteamApp> = {
	keys: ['name'],
	includeScore: true,
	threshold: 0.2,
	ignoreLocation: true,
	minMatchCharLength: 2,
};

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
					GroupedSteamGame.findOne({
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
						const fuse = new Fuse(el, options);
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
	const { data } = await axios.get<TSteamResponse>(
		'http://api.steampowered.com/ISteamApps/GetAppList/v0002/'
	);
	const apps = data?.applist?.apps.slice(0, 100) || [];
	const groupedGames: TFilteredSteamApp[] = [];
	apps.forEach((game) => {
		if (game.name) {
			const words = cleanAndSplitText(game.name);
			words.forEach((word) => {
				const index = word.slice(0, 2).toLowerCase();
				const isIndexExist = groupedGames.findIndex(
					(item) => item.filteredIndex === index
				);
				if (isIndexExist === -1) {
					groupedGames.push({
						filteredIndex: index,
						games: [
							{
								appid: game.appid,
								name: game.name,
							},
						],
					});
				} else {
					groupedGames[isIndexExist].games.push({
						appid: game.appid,
						name: game.name,
					});
				}
			});
		}
	});
	try {
		await GroupedSteamGame.insertMany(groupedGames);
		console.log('Sorted games saved');
	} catch (error) {
		console.log('Error saving sorted games', error);
	}
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
