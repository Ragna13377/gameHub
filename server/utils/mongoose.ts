import mongoose from 'mongoose';
import GroupedSteamGame from '../models/groupedSteamGame';

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
	const count = await GroupedSteamGame.countDocuments({});
	return count > 0;
};