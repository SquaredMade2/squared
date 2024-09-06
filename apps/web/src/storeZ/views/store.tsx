"use client";

import { createContext, useRef, useContext, type ReactNode } from "react";
import { useStore } from "zustand";
import { createViewsStore, type ViewsState } from ".";

export type ViewsStoreApi = ReturnType<typeof createViewsStore>;

export const ViewsStoreContext = createContext<ViewsStoreApi | undefined>(
	undefined,
);

export const ViewsStoreProvider = ({ children }: { children: ReactNode }) => {
	const storeRef = useRef<ViewsStoreApi>();

	if (!storeRef.current) {
		storeRef.current = createViewsStore();
	}

	return (
		<ViewsStoreContext.Provider value={storeRef.current}>
			{children}
		</ViewsStoreContext.Provider>
	);
};

export const useViewsStore = <T,>(selector: (store: ViewsState) => T): T => {
	const context = useContext(ViewsStoreContext);

	if (!context) {
		throw new Error("useViewsStore must be used within ViewsStoreProvider");
	}

	return useStore(context, selector);
};
