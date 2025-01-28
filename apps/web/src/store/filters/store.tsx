"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { type FilterStore, createFilterStore } from ".";

type FilterStoreApi = ReturnType<typeof createFilterStore>;

const FilterStoreContext = createContext<FilterStoreApi | undefined>(undefined);

export const FilterStoreProvider = ({ children }: { children: ReactNode }) => {
	const storeRef = useRef<FilterStoreApi>(undefined);

	if (!storeRef.current) {
		storeRef.current = createFilterStore();
	}

	return (
		<FilterStoreContext.Provider value={storeRef.current}>
			{children}
		</FilterStoreContext.Provider>
	);
};

export const useFilterStore = <T,>(selector: (store: FilterStore) => T): T => {
	const context = useContext(FilterStoreContext);

	if (!context) {
		throw new Error("useFilterStore must be used within FilterStoreProvider");
	}

	return useStore(context, selector);
};
