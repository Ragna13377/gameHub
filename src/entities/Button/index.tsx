import { clsx } from 'clsx';
import { ButtonProps } from '@entities/Button/types';
import styles from './style.module.scss';

const Button = ({ children, externalStyle }: ButtonProps) => (
	<button className={clsx(styles.button, externalStyle)}>{children}</button>
);

export default Button;
