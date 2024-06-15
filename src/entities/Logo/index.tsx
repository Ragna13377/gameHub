import { clsx } from 'clsx';
import styles from './style.module.scss';
import { LogoProps } from '@entities/Logo/types';

const Logo = ({ img, width, height, text, externalStyle }: LogoProps) => (
	<div className={styles.logo}>
		<img
			className={clsx(styles.logoImg, externalStyle)}
			src={img}
			width={width}
			height={height}
			alt='Логотип'
			style={{ width, height }}
		/>
		{text && <p className={styles.logoText}>{text}</p>}
	</div>
);

export default Logo;
