export const parseParams = (params: string | string[]): string => {
	if (Array.isArray(params)) {
		return params[0];
	}
	return params;
};
