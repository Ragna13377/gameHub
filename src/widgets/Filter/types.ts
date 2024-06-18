import { Dispatch, SetStateAction } from 'react';
import { TSteamGameInfo } from '@pages/Home/types';

export type TPriceFilter = 'Low' | 'High'
export type FilterProps = {
	setSteamGame: Dispatch<SetStateAction<TSteamGameInfo[]>>
}