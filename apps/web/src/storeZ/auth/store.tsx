"use client";

import { createContext, useRef, useContext, type ReactNode } from "react";
import { useStore } from "zustand";
import { type AuthStore, createAuthStore } from ".";

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(
	undefined,
);

export const AuthStoreProvider = ({ children }: { children: ReactNode }) => {
	const storeRef = useRef<AuthStoreApi>();
	if (!storeRef.current) {
		storeRef.current = createAuthStore();
	}

	return (
		<AuthStoreContext.Provider value={storeRef.current}>
			{children}
		</AuthStoreContext.Provider>
	);
};

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
	const context = useContext(AuthStoreContext);
	if (!context) {
		throw new Error("useAuthStore must be used within AuthStoreProvider");
	}
	return useStore(context, selector);
};
