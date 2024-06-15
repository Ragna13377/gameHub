import { useState } from 'react';
import Logo from '@entities/Logo';
import logo from '@images/logo.webp';
import styles from './style.module.scss';

const Index = () => {
	const [appState, setAppState] = useState(false);
	return (
		<>
			<header className={styles.header}>
				<Logo img={logo} width={90} height={85} text='GameHub' />
			</header>
      <main>Текст</main>
		</>
	);
};

export default Index;
