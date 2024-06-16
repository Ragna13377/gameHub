import { SearchFormProps } from '@widgets/SearchForm/types';
import Button from '@entities/Button';
import Input from '@entities/Input';
import styles from './style.module.scss';

const inputName = 'game';

const SearchForm = ({
	onSubmit,
	loading,
	placeholder,
	buttonText,
}: SearchFormProps) => (
	<form
		className={styles.searchForm}
		onSubmit={(e) => {
			const formData = new FormData(e.currentTarget);
			const searchedText = formData.get(inputName) as string;
			onSubmit(e, searchedText);
		}}
	>
		<Input placeholder={placeholder} name={inputName} />
		<Button disabled={loading}>{buttonText}</Button>
	</form>
);

export default SearchForm;
