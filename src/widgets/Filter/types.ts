import { Dispatch, SetStateAction } from 'react';
import { SteamAndGOGResponse } from '@shared/types';

export type TPriceFilter = 'Low' | 'High';
export type FilterProps = {
	setSteamGame: Dispatch<SetStateAction<SteamAndGOGResponse[]>>;
};
