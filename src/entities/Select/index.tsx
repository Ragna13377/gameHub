import { SelectProps } from '@entities/Select/types';
import { useSelect } from '@entities/Select/useSelect';
import Button from '@entities/Button';
import styles from './style.module.scss';

const Select = ({
	id,
	options,
	selectedIndex,
	filterFunction,
}: SelectProps) => {
	const {
		selectRef,
		initialSelectedIndex,
		isExpanded,
		selectState,
		handleClick,
		handleOptionClick,
		handleKeyDown,
	} = useSelect({ selectedIndex, options, filterFunction });
	return (
		<div className={styles.select} ref={selectRef}>
			<Button
				isSelect
				id={id}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				externalStyle={styles.selectButton}
			>
				Market: <span className={styles.controlText}>{selectState}</span>
			</Button>
			{isExpanded && (
				<ul
					className={styles.selectList}
					id={`${id}Select`}
					role='listbox'
					aria-labelledby={`${id}SelectButton`}
				>
					{options.map((option, ind) => (
						<li
							key={option}
							className={styles.selectListItem}
							onClick={() => handleOptionClick(option)}
							onKeyDown={(event) => {
								if (event.key === 'Enter' || event.key === ' ') {
									handleOptionClick(option);
								}
							}}
							tabIndex={0}
							role='option'
							aria-selected={ind === initialSelectedIndex}
						>
							{option}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Select;
