"use client";

import { createContext, useRef, useContext, type ReactNode } from "react";
import { useStore } from "zustand";
import { createUserStore, type UserState } from ".";

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<UserStoreApi | undefined>(
	undefined,
);

export const UserStoreProvider = ({ children }: { children: ReactNode }) => {
	const storeRef = useRef<UserStoreApi>();
	if (!storeRef.current) {
		storeRef.current = createUserStore();
	}

	return (
		<UserStoreContext.Provider value={storeRef.current}>
			{children}
		</UserStoreContext.Provider>
	);
};

export const useUserStore = <T,>(selector: (store: UserState) => T): T => {
	const context = useContext(UserStoreContext);
	if (!context) {
		throw new Error("useUserStore must be used within UserStoreProvider");
	}
	return useStore(context, selector);
};
