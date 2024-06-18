import { TSteamGameInfo } from '@pages/Home/types';
import styles from './style.module.scss';

const GameItem = ({
	name,
	steam_appid,
	detailed_description,
	is_free,
	price_overview,
	header_image,
}: TSteamGameInfo) => {
	if (!detailed_description) {
		return null;
	}
	return (
		<article className={styles.gameItem}>
			<h3
				className={styles.name}
				style={{ fontSize: name.length < 29 ? '30px' : name.length < 35 ? '25px' : '20px' }}
			>
				{name}
			</h3>
			<img
				className={styles.image}
				src={header_image}
				width={460}
				height={215}
				alt={`Игра: ${name}`}
			/>
			<p
				className={styles.description}
				dangerouslySetInnerHTML={{ __html: detailed_description }}
			/>
			<footer className={styles.footer}>
				<a
					className={styles.link}
					href={`https://store.steampowered.com/app/${steam_appid}`}
					target={'_blank'}
					rel={'noreferrer noopener'}
				>
					Steam
				</a>
				<p className={styles.price}>
					Цена:
					<span className={styles.priceValue}>
						{is_free || !price_overview
							? 'Бесплатно'
							: price_overview?.final_formatted}
					</span>
				</p>
			</footer>
		</article>
	);
};

export default GameItem;
