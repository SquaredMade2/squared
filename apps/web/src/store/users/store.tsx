"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { type UserStore, createUserStore } from ".";

type UserStoreApi = ReturnType<typeof createUserStore>;

const UserStoreContext = createContext<UserStoreApi | undefined>(undefined);

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

export const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
	const context = useContext(UserStoreContext);
	if (!context) {
		throw new Error("useUserStore must be used within UserStoreProvider");
	}
	return useStore(context, selector);
};
