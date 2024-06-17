import mongoose from 'mongoose';
import FilteredSteamGame from '../models/FilteredSteamGame';
import { config } from 'dotenv';

config();
const { MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_DB } = process.env;
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.nldqiw9.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;
export const connectToMongooseDB = async () => {
	try {
		await mongoose.connect(MONGO_URI);
		console.log('Connected to MongoDB');
	} catch (error) {
		console.log('Error connection to DB');
	}
};

export const checkIsDataExists = async () => {
	const count = await FilteredSteamGame.countDocuments({});
	return count > 0;
};