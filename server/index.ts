import cors from 'cors';
import https from 'https';
import { config } from 'dotenv';
import express, { Request, Response, json, urlencoded } from 'express';
import { SteamAndGOGResponse, TGOGGameInfo, TRequestBody } from './types';
import { checkIsDataExists, connectToMongooseDB } from './utils/mongoose';
import { fuseSearch } from './utils/fuse';
import {
	fetchGogAppList,
	fetchGOGGameDetails,
	parseGogPrice,
} from './utils/gog';
import {
	fetchSteamAppList,
	fetchSteamGameByFilteredIndex,
	fetchSteamGameDetails,
	filterSteamAppByTwoLetter,
	saveFilteredSteamGames,
} from './utils/steam';
import { certOptions } from './certs';

config();
// const PORT = process.env.PORT || 3001;
const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.get('/', (req: Request, res: Response) => {
	res.send('OK. Only POST request available');
});
app.post(
	'/',
	async (
		req: Request<Record<string, never>, unknown, TRequestBody>,
		res: Response<SteamAndGOGResponse[] | { error: string }>
	) => {
		try {
			const response: SteamAndGOGResponse[] = [];
			console.log('==============');
			console.log('Searched game: ', req.body.searchedGame);
			const [steamResult, gogResult] = await Promise.all([
				fetchSteamGameByFilteredIndex(req.body.searchedGame),
				fetchGogAppList(req.body.searchedGame),
			]);
			console.log(`fetch Steam ${steamResult ? steamResult.length : 'error'}`);
			console.log(`fetch Gog ${gogResult ? gogResult.length : 'error'}`);
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
			if (gogDetails && gogResult) {
				gogDetails.forEach((details) => {
					const currentGame = gogResult.find(
						(game) => Number(game.id) === details._embedded.product.id
					) as TGOGGameInfo;
					response.push({
						id: Number(currentGame.id),
						name: currentGame.title,
						type: 'GOG',
						description: details.description,
						image: details._embedded.product._links.image.href.replace(
							'_{formatter}',
							''
						),
						storeLink: currentGame.storeLink,
						price: parseGogPrice(currentGame),
					});
				});
			}
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
							type: 'Steam',
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
			if (response.length === 0) {
				res.status(404).json({ error: 'No matches found' });
			} else res.json(response);
		} catch (error) {
			return res.status(404).json({ error: 'Sorry... Try later' });
		}
	}
);

const initialSaveData = async () => {
	const apps = await fetchSteamAppList();
	console.log('Steam data loaded');
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
	if (
		certOptions.cert &&
		certOptions.cert.length > 0 &&
		certOptions.key &&
		certOptions.key.length > 0 &&
		certOptions.ca &&
		certOptions.ca.length > 0
	) {
		console.log('Certificates loaded');
	}
	https.createServer(certOptions, app).listen(443, () => {
		console.log('HTTPS Server running on port 443');
	});
	// app.listen(PORT, () => {
	// 	console.log(`Server is running on port ${PORT}`);
	// });
};
startServer().catch((error) => console.log(error));
