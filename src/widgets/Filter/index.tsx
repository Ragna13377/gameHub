import { useState } from 'react';
import Select from '@entities/Select';
import { selectOptions } from '@pages/Home/constants';
import { PriceVolumeType } from '@shared/types';
import { FilterProps } from '@widgets/Filter/types';
import { filterByPrice, filterByStore } from '@widgets/Filter/utils';
import Button from '@entities/Button';
import styles from './style.module.scss';

const Filter = ({ data, setData }: FilterProps) => {
	const [priceFilter, setPriceFilter] = useState<PriceVolumeType>('Low');
	const handlePriceFilter = () => {
		const newFilter = priceFilter === 'Low' ? 'High' : 'Low';
		setPriceFilter(newFilter);
		filterByPrice(newFilter, data, setData);
	};
	return (
		<search className={styles.filter}>
			<Select
				id='store'
				options={selectOptions}
				filterFunction={(type: string) => filterByStore(type)(data, setData)}
			/>
			<Button onClick={handlePriceFilter} externalStyle={styles.filterButton}>
				Price: <span className={styles.controlText}>{priceFilter}</span>
			</Button>
		</search>
	);
};

export default Filter;
