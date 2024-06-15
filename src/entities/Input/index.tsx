import { InputProps } from '@entities/Input/types';
import styles from './style.module.scss';

const Input = ({ placeholder, type }: InputProps) => (
	<input
		className={styles.input}
		type={type ? type : 'text'}
		placeholder={placeholder}
	/>
);

export default Input;
