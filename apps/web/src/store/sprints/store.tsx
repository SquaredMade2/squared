"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { type SprintStore, createSprintStore } from ".";

type SprintStoreApi = ReturnType<typeof createSprintStore>;

const SprintStoreContext = createContext<SprintStoreApi | undefined>(undefined);

export const SprintStoreProvider = ({ children }: { children: ReactNode }) => {
	const storeRef = useRef<SprintStoreApi>();
	if (!storeRef.current) {
		storeRef.current = createSprintStore();
	}

	return (
		<SprintStoreContext.Provider value={storeRef.current}>
			{children}
		</SprintStoreContext.Provider>
	);
};

export const useSprintStore = <T,>(selector: (store: SprintStore) => T): T => {
	const context = useContext(SprintStoreContext);
	if (!context) {
		throw new Error("useSprintStore must be used within SprintStoreProvider");
	}
	return useStore(context, selector);
};
