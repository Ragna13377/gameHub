import { KeyboardEvent, PropsWithChildren } from 'react';

export type BaseButtonProps = PropsWithChildren & {
	onClick?: () => void;
	onKeyDown?: (e: KeyboardEvent) => void;
	disabled?: boolean;
	externalStyle?: string;
};

export type SelectButtonProps = BaseButtonProps & {
	isSelect: true;
	id: string;
};

export type ButtonProps = BaseButtonProps | SelectButtonProps;
