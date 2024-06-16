import { PropsWithChildren } from 'react';

export type ButtonProps = PropsWithChildren & {
	disabled?: boolean;
	externalStyle?: string;
};
