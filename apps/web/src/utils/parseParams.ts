export const parseParams = (params?: string | string[]): string | undefined => {
	if (!params) return params;
	if (Array.isArray(params)) {
		return params[0];
	}
	return params;
};
