export type ApiReturnType<T> = {
	data: T | null;
	message: string;
	variant: "default" | "destructive";
};
