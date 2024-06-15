import { useState } from 'react';
import SearchForm from '@widgets/SearchForm';
import styles from './style.module.scss';

const Index = () => {
	const [appState, setAppState] = useState(false);
	return (
		<>
			<header className={styles.header}>
				<h1 className={styles.title}>Game Hub</h1>
				<p className={styles.description}>Find your favorite game at the lowest price</p>
				<SearchForm placeholder='Search for game...' buttonText='Search' />
			</header>
			<main>Текст</main>
		</>
	);
};

export default Index;
