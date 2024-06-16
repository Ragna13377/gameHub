import { clsx } from 'clsx';
import { ButtonProps } from '@entities/Button/types';
import styles from './style.module.scss';

const Button = ({ children, disabled, externalStyle }: ButtonProps) => (
	<button disabled={disabled} className={clsx(styles.button, externalStyle)}>{children}</button>
);

export default Button;
