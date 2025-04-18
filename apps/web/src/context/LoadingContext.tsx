import type React from "react";
import { createContext, useCallback, useContext, useReducer } from "react";

// Define the loading state shape
type LoadingState = {
	[key: string]: boolean;
};

// Define actions
type LoadingAction =
	| { type: "START_LOADING"; payload: string }
	| { type: "STOP_LOADING"; payload: string };

// Create context
type LoadingContextType = {
	loadingState: LoadingState;
	startLoading: (key: string) => void;
	stopLoading: (key: string) => void;
	isLoading: (key: string) => boolean;
	anyLoading: () => boolean;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Reducer to manage loading states
function loadingReducer(
	state: LoadingState,
	action: LoadingAction,
): LoadingState {
	switch (action.type) {
		case "START_LOADING":
			return { ...state, [action.payload]: true };
		case "STOP_LOADING":
			return { ...state, [action.payload]: false };
		default:
			return state;
	}
}

// Provider component
export function LoadingProvider({ children }: { children: React.ReactNode }) {
	const [loadingState, dispatch] = useReducer(loadingReducer, {});

	const startLoading = useCallback((key: string) => {
		dispatch({ type: "START_LOADING", payload: key });
	}, []);

	const stopLoading = useCallback((key: string) => {
		dispatch({ type: "STOP_LOADING", payload: key });
	}, []);

	const isLoading = useCallback(
		(key: string) => {
			return !!loadingState[key];
		},
		[loadingState],
	);

	const anyLoading = useCallback(() => {
		return Object.values(loadingState).some(Boolean);
	}, [loadingState]);

	const value = {
		loadingState,
		startLoading,
		stopLoading,
		isLoading,
		anyLoading,
	};

	return (
		<LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
	);
}

// Hook to use the loading context
export function useLoading() {
	const context = useContext(LoadingContext);

	if (context === undefined) {
		throw new Error("useLoading must be used within a LoadingProvider");
	}

	return context;
}
