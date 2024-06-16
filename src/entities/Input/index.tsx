import { InputProps } from '@entities/Input/types';
import styles from './style.module.scss';

const Input = ({ name, placeholder, type }: InputProps) => {
	return (
		<input
			name={name}
			className={styles.input}
			type={type ? type : 'text'}
			placeholder={placeholder}
		/>
	);
};

export default Input;
