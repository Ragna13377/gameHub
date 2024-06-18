import { clsx } from 'clsx';
import { useState } from 'react';
import { FilterProps, TPriceFilter } from '@widgets/Filter/types';
import styles from './style.module.scss';

const Filter = ({setSteamGame}: FilterProps) => {
	const [priceFilter, setPriceFilter] = useState<TPriceFilter>('Low');
	return (
		<search className={styles.controls}>
			<button
				className={clsx(styles.control)}
			>
				Market: Steam
			</button>
			<button
				className={clsx(styles.control, styles[`control${priceFilter}`])}
				onClick={() => {
					if (priceFilter === 'Low') {
						setPriceFilter('High');
					} else {
						setPriceFilter('Low');
					}
					setSteamGame(prev => [...prev.slice().reverse()]);
				}}
			>
				Price: {priceFilter}
			</button>
		</search>
	);
};

export default Filter;


