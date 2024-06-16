import { FormEvent } from 'react';

export type SearchFormProps = {
	onSubmit: (e: FormEvent, query: string) => void;
	loading: boolean;
	buttonText: string;
	placeholder: string;
	externalStyle?: string;
};
