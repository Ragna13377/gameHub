export const getTitleSize = (title: string): number => {
	const length = title.length;
	if (length < 29) return 30;
	else if (length < 35) return 25;
	else return 20;
};
