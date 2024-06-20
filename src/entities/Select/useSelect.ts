import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { TUseSelect } from '@entities/Select/types';

export const useSelect = ({
	filterFunction,
	selectedIndex,
	options,
}: TUseSelect) => {
	const initialSelectedIndex = selectedIndex ?? 0;
	const selectRef = useRef<HTMLDivElement>(null);
	const [selectState, setSelectState] = useState<string>(
		options[initialSelectedIndex]
	);
	const [isExpanded, setIsExpanded] = useState(false);
	const handleClick = () => {
		setIsExpanded((prev) => !prev);
	};
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			handleClick();
		}
	};
	const handleClickOutside = (e: MouseEvent) => {
		if (selectRef.current && !selectRef.current.contains(e.target as Node))
			setIsExpanded(false);
	};
	const handleOptionClick = (option: string) => {
		setSelectState(option);
		filterFunction(option);
		setIsExpanded(false);
	};
	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);
	return {
		selectRef,
		initialSelectedIndex,
		selectState,
		isExpanded,
		handleClick,
		handleKeyDown,
		handleOptionClick,
	};
};
