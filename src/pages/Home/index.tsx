import axios from 'axios';
import { FormEvent, useCallback, useState } from 'react';
import { SteamAndGOGResponse, StoreType } from '@shared/types';
import { apiSearch, githubLink, selectOptions } from '@pages/Home/constants';
import { filterByStore } from '@pages/Home/utils';
import Button from '@entities/Button';
import GameItem from '@widgets/GameItem';
import Promo from '@widgets/Promo';
import SearchForm from '@widgets/SearchForm';
import Select from '@entities/Select';
import styles from './style.module.scss';

const Index = () => {
	const [findedGames, setFindedGames] = useState<SteamAndGOGResponse[]>([]);
	const [filteredGames, setFilteredGames] = useState<SteamAndGOGResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [priceFilter, setPriceFilter] = useState<boolean>(false);
	const onSubmit = useCallback(async (e: FormEvent, searchedGame: string) => {
		e.preventDefault();
		if (searchedGame) {
			setLoading(true);
			try {
				const { data } = await axios.post<
					SteamAndGOGResponse[] | { error: string }
				>(apiSearch, { searchedGame });
				// const sortedData = sortGameByPrice(gameDetails);
				if ('error' in data) setError(data.error);
				else {
					setFindedGames(data);
					setFilteredGames(data);
				}
			} catch (error) {
				console.log('Invalid response');
			} finally {
				setLoading(false);
			}
		}
	}, []);
	return (
		<>
			<header className={styles.header}>
				<h1 className={styles.title}>Game Hub</h1>
				<p className={styles.description}>
					Find your favorite game at the lowest price
				</p>
				<SearchForm
					placeholder='Search for game...'
					buttonText='Search'
					onSubmit={onSubmit}
					loading={loading}
				/>
			</header>
			<main className={styles.content}>
				{findedGames.length > 0 ? (
					<div className={styles.result}>
						<search className={styles.filter}>
							<Select
								id='store'
								options={selectOptions}
								filterFunction={(type: string) =>
									filterByStore(type)(findedGames, setFilteredGames)
								}
							/>
							<Button onClick={() => {}} externalStyle={styles.filterButton}>
								Price: <span className={styles.controlText}>{priceFilter}</span>
							</Button>
						</search>
						{filteredGames.map((game) => (
							<GameItem key={game.id} {...game} />
						))}
					</div>
				) : (
					<Promo />
				)}
			</main>
			<footer className={styles.footer}>
				<small>
					© 2024 - Game Hub -{' '}
					<a href={githubLink} target='_blank' rel='noopenner noreferrer'>
						Source Link
					</a>
				</small>
			</footer>
		</>
	);
};

export default Index;
