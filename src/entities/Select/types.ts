export type SelectProps = TUseSelect & {
	id: string;
};

export type TUseSelect = {
	filterFunction: (type: string) => void;
	options: string[];
	selectedIndex?: number;
};
