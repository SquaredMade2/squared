export const parseError = (error: unknown, fallback?: string) => {
	if (!error) return null;
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === "string") return error;
	return fallback ?? "An unknown error occurred";
};
