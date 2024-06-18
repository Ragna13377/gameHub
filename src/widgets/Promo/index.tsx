import PromoCard from '@entities/PromoCard';
import styles from './style.module.scss';

const Promo = () => {
	return (
		<section className={styles.container}>
			<PromoCard />
			<PromoCard />
			<PromoCard />
		</section>

	);
};

export default Promo;