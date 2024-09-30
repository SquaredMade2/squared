export const compareNullableStrings = (
	a: string | null,
	b: string | null,
): number => {
	if (a === null && b === null) return 0;
	if (a === null) return -1;
	if (b === null) return 1;
	return a.localeCompare(b);
};

export const compareNullableNumbers = (
	a: number | null,
	b: number | null,
): number => {
	if (a === null && b === null) return 0;
	if (a === null) return -1;
	if (b === null) return 1;
	return a - b;
};

export const compareNullableDates = (
	a: Date | null,
	b: Date | null,
): number => {
	console.log(typeof a, typeof b);
	if (a === null && b === null) return 0;
	if (a === null) return -1;
	if (b === null) return 1;
	return new Date(a).getTime() - new Date(b).getTime();
};
