import express, { Request, Response, json, urlencoded } from 'express';
import cors from 'cors';
import axios from 'axios';
import { config } from 'dotenv';
import { TRequestBody, TSteamGameResponse, TSteamResponse } from './types';
import { isSteamGame } from './utils';

config();
const PORT = process.env.PORT || 3001;
// const STEAM_API_KEY = process.env.STEAM_API_KEY;
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use((req: Request, res: Response, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

app.post(
	'/api/search',
	async (
		req: Request<Record<string, never>, unknown, TRequestBody>,
		res: Response
	) => {
		try {
			const { data } = await axios.get<TSteamResponse>(
				'http://api.steampowered.com/ISteamApps/GetAppList/v0002/'
			);
			const apps = data?.applist?.apps || [];
			const result = apps.find((el) => el.name === req.body.searchedGame);
			if (!result) {
				return res.status(404).json({ error: 'App not found' });
			}
			const { appid } = result;
			const { data: gameData } = await axios.get<TSteamGameResponse>(
				`https://store.steampowered.com/api/appdetails?appids=${appid}`
			);
			const steamGame = gameData?.[appid];
			if (!steamGame || !isSteamGame(steamGame)) {
				return res.status(404).json({ error: 'App details not found' });
			}
			res.json(steamGame.data);
		} catch (error) {
			const errorMessage = axios.isAxiosError(error) ? error.message : 'Internal Server Error';
			res.status(500).json({ error: errorMessage });
		}
	}
);
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
