import mongoose from 'mongoose';
import { TFilteredSteamApp } from '../types';

const FilteredSteamGame = new mongoose.Schema({
	filteredIndex: {
		type: String,
		required: true,
	},
	games: [
		{
			appid: { type: Number, required: true },
			name: { type: String, required: true },
		},
	],
});

export default mongoose.model<TFilteredSteamApp>('FilteredSteamGame', FilteredSteamGame);
