import axios from 'axios';
import { FormEvent, useCallback, useState } from 'react';
import { SteamAndGOGResponse } from '@shared/types';
import { apiSearch, githubLink } from '@pages/Home/constants';
import GameItem from '@widgets/GameItem';
import Filter from '@widgets/Filter';
import Promo from '@widgets/Promo';
import SearchForm from '@widgets/SearchForm';
import styles from './style.module.scss';

const Home = () => {
	const [findedGames, setFindedGames] = useState<SteamAndGOGResponse[]>([]);
	const [filteredGames, setFilteredGames] = useState<SteamAndGOGResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const onSubmit = useCallback(async (e: FormEvent, searchedGame: string) => {
		e.preventDefault();
		if (searchedGame) {
			setLoading(true);
			try {
				const { data } = await axios.post<
					SteamAndGOGResponse[] | { error: string }
				>(apiSearch, { searchedGame });
				if ('error' in data) {
					setError(data.error);
					setFilteredGames([]);
				} else if (data.length > 0) {
					setFindedGames(data);
					setFilteredGames(data);
				} else {
					setError('No matches found');
				}
			} catch (error) {
				console.log('Invalid response');
				setError('Sorry... Try later');
				setFilteredGames([]);
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
				{error ? (
					<p className={styles.error}>{error}</p>
				) : findedGames.length > 0 ? (
					<div className={styles.result}>
						<Filter data={findedGames} setData={setFilteredGames} />
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

export default Home;
