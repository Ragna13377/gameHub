import mongoose from 'mongoose';
import FilteredSteamGame from '../models/FilteredSteamGame';
import { config } from 'dotenv';

config();
// const { MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_DB } = process.env;
// const mongoUrl = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.nldqiw9.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;
const mongoUrl = process.env.MONGO_URL as string;
export const connectToMongooseDB = async () => {
	try {
		await mongoose.connect(mongoUrl);
		console.log('Connected to MongoDB');
	} catch (error) {
		console.log('Error connection to DB');
	}
};

export const checkIsDataExists = async () => {
	const count = await FilteredSteamGame.countDocuments({});
	return count > 0;
};
