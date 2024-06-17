import { TSteamGameInfo } from '@pages/Home/types';
import styles from './style.module.scss';

const GameItem = ({ name, detailed_description, is_free, price_overview, header_image }: TSteamGameInfo) => {
	return (
		<article className={styles.gameItem}>
			<h3 className={styles.name}>{name}</h3>
			<img className={styles.image} src={header_image} width={460} height={215} alt={`Игра: ${name}`} />
			<p className={styles.description}>{detailed_description}</p>
			<p className={styles.price}>
				Цена:
				<span className={styles.priceValue}>{is_free ? 'Бесплатно' : price_overview?.final_formatted }</span>
			</p>
		</article>
	);
};

export default GameItem;