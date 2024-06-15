import { SearchFormProps } from '@widgets/SearchForm/types';
import Button from '@entities/Button';
import Input from '@entities/Input';
import styles from './style.module.scss';

const SearchForm = ({ placeholder, buttonText }: SearchFormProps) => (
	<form action="" className={styles.searchForm}>
		<Input placeholder={placeholder} />
		<Button>{buttonText}</Button>
	</form>
);

export default SearchForm;
