import { QueryCache, QueryClient } from "@tanstack/react-query";
import { HTTPException } from "hono/http-exception";
import { toast } from "sonner";

// Default settings for all queries
export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (err) => {
			let errorMessage: string;
			if (err instanceof HTTPException) {
				errorMessage = err.message;
			} else if (err instanceof Error) {
				errorMessage = err.message;
			} else {
				errorMessage = "An unknown error occurred.";
			}
			toast.error(errorMessage);
		},
	}),
	defaultOptions: {
		queries: {
			staleTime: 2 * 60 * 1000, // 2 minutes by default
			retry: 1, // Only retry once by default
			refetchOnWindowFocus: false, // Disable automatic refetching on window focus
			refetchOnMount: true, // Refetch when component mounts if stale
			refetchOnReconnect: true, // Refetch when connection is restored
		},
		mutations: {
			retry: 0, // Don't retry mutations by default
			onError: (error) => {
				console.error("Global mutation error:", error);
			},
		},
	},
});

// You can also create a custom hook for global query state access
export function useGlobalQueries() {
	const isFetching = queryClient.isFetching();
	const isMutating = queryClient.isMutating();

	return {
		isFetching,
		isMutating,
		isLoading: isFetching > 0 || isMutating > 0,
		invalidateAll: () => queryClient.invalidateQueries(),
		clearCache: () => queryClient.clear(),
	};
}
