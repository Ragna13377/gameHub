import { ButtonProps, SelectButtonProps } from '@entities/Button/types';
export const isSelectButton = (buttonProps: ButtonProps): buttonProps is SelectButtonProps =>
	'isSelect' in buttonProps

