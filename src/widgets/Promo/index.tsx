import PromoCard from '@entities/PromoCard';
import coin from './images/coin.svg';
import compare from './images/compare.svg';
import controller from './images/controller.svg';
import styles from './style.module.scss';

const Promo = () => (
	<section className={styles.container}>
		<PromoCard
			image={coin}
			text='Compare prices on popular sites and don’t overpay'
		/>
		<PromoCard image={compare} text='Choose the best offer' />
		<PromoCard image={controller} text='Favorite games in one place' />
	</section>
);

export default Promo;
