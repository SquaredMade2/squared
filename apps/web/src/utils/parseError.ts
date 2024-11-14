export const parseError = (error: unknown, fallback?: string) => {
	if (error instanceof Error) {
		return error.message;
	}
	return fallback ?? "An unknown error occurred";
};
