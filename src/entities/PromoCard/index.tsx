import { PromoCardProps } from '@entities/PromoCard/types';
import styles from './style.module.scss';

const PromoCard = ({ image, text }: PromoCardProps) => (
	<article className={styles.outer}>
		<div className={styles.inner}>
			<img className={styles.image} src={image} alt='' />
			{text}
		</div>
	</article>
);

export default PromoCard;
