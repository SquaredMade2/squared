"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { type ViewStore, createViewStore } from ".";

type ViewStoreApi = ReturnType<typeof createViewStore>;

const ViewStoreContext = createContext<ViewStoreApi | undefined>(undefined);

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
