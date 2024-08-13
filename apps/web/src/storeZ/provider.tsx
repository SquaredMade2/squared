"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type SquaredStore, createSquaredStore } from "@/storeZ";

export type SquaredStoreApi = ReturnType<typeof createSquaredStore>;

export const SquaredStoreContext = createContext<SquaredStoreApi | undefined>(
	undefined,
);

export interface SquaredStoreProviderProps {
	children: ReactNode;
}

export const SquaredStoreProvider = ({
	children,
}: SquaredStoreProviderProps) => {
	const storeRef = useRef<SquaredStoreApi>();
	if (!storeRef.current) {
		storeRef.current = createSquaredStore();
	}

	return (
		<SquaredStoreContext.Provider value={storeRef.current}>
			{children}
		</SquaredStoreContext.Provider>
	);
};

export const useSquaredStore = <T,>(
	selector: (store: SquaredStore) => T,
): T => {
	const counterStoreContext = useContext(SquaredStoreContext);

	if (!counterStoreContext) {
		throw new Error("useSquaredStore must be used within SquaredStoreProvider");
	}

	return useStore(counterStoreContext, selector);
};
