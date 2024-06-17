import axios from 'axios';
import { FormEvent, useCallback, useState } from 'react';
import { TSteamGameInfo } from '@pages/Home/types';
import GameItem from '@widgets/GameItem';
import SearchForm from '@widgets/SearchForm';
import styles from './style.module.scss';

const Index = () => {
	const [steamGame, setSteamGame] = useState<TSteamGameInfo | null>();
	const [loading, setLoading] = useState(false);
	const onSubmit = useCallback(async (e: FormEvent, searchedGame: string) => {
		e.preventDefault();
		setLoading(true);
		try {
			const { data } = await axios.post<TSteamGameInfo>('http://localhost:3001/api/search', {
				searchedGame,
			});
			setSteamGame(data);
		} catch (error) {
			console.log('Invalid response');
		} finally {
			setLoading(false);
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
				{steamGame && <GameItem {...steamGame} />}
			</main>
		</>
	);
};

export default Index;
