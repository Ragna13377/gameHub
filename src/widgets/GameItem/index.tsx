import { SteamAndGOGResponse } from '@shared/types';
import { storeLogo } from '@widgets/GameItem/constants';
import styles from './style.module.scss';
import { getTitleSize } from '@widgets/GameItem/utils';

const GameItem = ({
	name,
	type,
	description,
	image,
	price,
	storeLink,
}: SteamAndGOGResponse) => (
	<article className={styles.gameItem}>
		<h3 className={styles.name} style={{ fontSize: `${getTitleSize(name)}px` }}>
			{name}
		</h3>
		<img
			className={styles.image}
			src={image}
			width={460}
			height={215}
			alt={`Game: ${name}`}
		/>
		<p
			className={styles.description}
			dangerouslySetInnerHTML={{ __html: description }}
		/>
		<footer className={styles.footer}>
			<a
				className={styles.link}
				href={storeLink}
				target='_blank'
				rel='noreferrer noopener'
			>
				<img
					width={25}
					height={25}
					className={styles.linkImage}
					src={storeLogo[type]}
					alt={`Store: ${type}`}
				/>
				{type}
			</a>
			<p className={styles.price}>
				Price:
				<span className={styles.priceValue}>{price}</span>
			</p>
		</footer>
	</article>
);

export default GameItem;
