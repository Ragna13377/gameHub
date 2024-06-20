import { clsx } from 'clsx';
import { ButtonProps } from '@entities/Button/types';
import { isSelectButton } from '@entities/Button/utils';
import styles from './style.module.scss';

const Button = (props: ButtonProps) => {
	const { onClick, onKeyDown, children, disabled, externalStyle } = props;
	if (isSelectButton(props)) {
		const { id } = props;
		return (
			<button
				onClick={onClick}
				onKeyDown={onKeyDown}
				id={`${id}SelectButton`}
				aria-haspopup='listbox'
				aria-expanded='false'
				aria-controls={`${id}Select`}
				disabled={disabled}
				className={clsx(styles.button, externalStyle)}
			>
				{children}
			</button>
		);
	} else
		return (
			<button
				onClick={onClick}
				disabled={disabled}
				className={clsx(styles.button, externalStyle)}
			>
				{children}
			</button>
		);
};

export default Button;
