import { SteamAndGOGResponse } from '@shared/types';
import { Dispatch, SetStateAction } from 'react';

export type FilterProps = {
	data: SteamAndGOGResponse[];
	setData: Dispatch<SetStateAction<SteamAndGOGResponse[]>>;
};
