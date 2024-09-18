"use client";

import { createContext, useRef, useContext, type ReactNode } from "react";
import { useStore } from "zustand";
import { createViewStore, type ViewStore } from ".";

export type ViewStoreApi = ReturnType<typeof createViewStore>;

export const ViewStoreContext = createContext<ViewStoreApi | undefined>(
	undefined,
);

export const ViewStoreProvider = ({ children }: { children: ReactNode }) => {
	const storeRef = useRef<ViewStoreApi>();

	if (!storeRef.current) {
		storeRef.current = createViewStore();
	}

	return (
		<ViewStoreContext.Provider value={storeRef.current}>
			{children}
		</ViewStoreContext.Provider>
	);
};

export const useViewStore = <T,>(selector: (store: ViewStore) => T): T => {
	const context = useContext(ViewStoreContext);

	if (!context) {
		throw new Error("useViewStore must be used within ViewStoreProvider");
	}

	return useStore(context, selector);
};
