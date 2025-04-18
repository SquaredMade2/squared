import type React from "react";
import { createContext, useCallback, useContext, useReducer } from "react";

// Define the error state shape
type ErrorState = {
	[key: string]: Error | string | null;
};

// Define actions
type ErrorAction =
	| { type: "SET_ERROR"; payload: { key: string; error: Error | string } }
	| { type: "CLEAR_ERROR"; payload: string }
	| { type: "CLEAR_ALL_ERRORS" };

// Create context
type ErrorContextType = {
	errors: ErrorState;
	setError: (key: string, error: Error | string) => void;
	clearError: (key: string) => void;
	clearAllErrors: () => void;
	hasErrors: () => boolean;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Reducer to manage error states
function errorReducer(state: ErrorState, action: ErrorAction): ErrorState {
	switch (action.type) {
		case "SET_ERROR":
			return { ...state, [action.payload.key]: action.payload.error };
		case "CLEAR_ERROR": {
			const newState = { ...state };
			delete newState[action.payload];
			return newState;
		}
		case "CLEAR_ALL_ERRORS":
			return {};
		default:
			return state;
	}
}

// Provider component
export function ErrorProvider({ children }: { children: React.ReactNode }) {
	const [errors, dispatch] = useReducer(errorReducer, {});

	const setError = useCallback((key: string, error: Error | string) => {
		dispatch({
			type: "SET_ERROR",
			payload: { key, error },
		});
	}, []);

	const clearError = useCallback((key: string) => {
		dispatch({ type: "CLEAR_ERROR", payload: key });
	}, []);

	const clearAllErrors = useCallback(() => {
		dispatch({ type: "CLEAR_ALL_ERRORS" });
	}, []);

	const hasErrors = useCallback(() => {
		return Object.keys(errors).length > 0;
	}, [errors]);

	const value = {
		errors,
		setError,
		clearError,
		clearAllErrors,
		hasErrors,
	};

	return (
		<ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
	);
}

// Hook to use the error context
export function useError() {
	const context = useContext(ErrorContext);

	if (context === undefined) {
		throw new Error("useError must be used within an ErrorProvider");
	}

	return context;
}
